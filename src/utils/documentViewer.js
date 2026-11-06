const MIME_POR_EXTENSION = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const EXTENSION_POR_MIME = Object.fromEntries(
  Object.entries(MIME_POR_EXTENSION).map(([extension, mime]) => [mime, extension])
);
const TAMANO_BLOQUE_BASE64 = 4 * 1024 * 1024;
const LIMITE_PAQUETE_OFFICE_BYTES = 512 * 1024 * 1024;

export const EXTENSIONES_VISOR = Object.freeze(Object.keys(MIME_POR_EXTENSION));

export const obtenerExtensionDocumento = (nombre = "", mime = "") => {
  const nombreNormalizado = String(nombre).trim().toLowerCase();
  const coincidencia = nombreNormalizado.match(/\.([a-z0-9]+)$/);
  const extensionNombre = coincidencia?.[1] || "";

  if (EXTENSIONES_VISOR.includes(extensionNombre)) {
    return extensionNombre;
  }

  return EXTENSION_POR_MIME[String(mime).toLowerCase()] || "";
};

export const base64ABytes = (contenido, limiteBytes = Number.POSITIVE_INFINITY) => {
  let base64 = String(contenido || "")
    .trim()
    .replace(/^data:[^,]*;base64,/i, "");

  if (/\s/.test(base64)) {
    base64 = base64.replace(/\s/g, "");
  }

  if (!base64) {
    throw new Error("El documento no contiene datos para visualizar.");
  }

  const relleno = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const tamanoEstimado = Math.floor((base64.length * 3) / 4) - relleno;

  if (tamanoEstimado > limiteBytes) {
    const limiteMb = Math.floor(limiteBytes / (1024 * 1024));
    throw new Error(`El archivo supera el limite de ${limiteMb} MB del visor.`);
  }

  const bytes = new Uint8Array(tamanoEstimado);
  let desplazamiento = 0;

  try {
    for (let inicio = 0; inicio < base64.length; inicio += TAMANO_BLOQUE_BASE64) {
      const binario = atob(base64.slice(inicio, inicio + TAMANO_BLOQUE_BASE64));

      for (let indice = 0; indice < binario.length; indice++) {
        bytes[desplazamiento++] = binario.charCodeAt(indice);
      }
    }
  } catch {
    throw new Error("El contenido del documento no es base64 valido.");
  }

  if (bytes.byteLength > limiteBytes) {
    const limiteMb = Math.floor(limiteBytes / (1024 * 1024));
    throw new Error(`El archivo supera el limite de ${limiteMb} MB del visor.`);
  }

  return bytes;
};

const analizarPaqueteZip = (bytes) => {
  const vista = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const inicioBusqueda = Math.max(0, bytes.byteLength - 65557);
  let posicionDirectorio = -1;

  for (let posicion = bytes.byteLength - 22; posicion >= inicioBusqueda; posicion--) {
    if (vista.getUint32(posicion, true) === 0x06054b50) {
      posicionDirectorio = posicion;
      break;
    }
  }

  if (posicionDirectorio < 0) {
    throw new Error("El paquete Office no contiene un directorio ZIP valido.");
  }

  const totalEntradas = vista.getUint16(posicionDirectorio + 10, true);
  const tamanoDirectorio = vista.getUint32(posicionDirectorio + 12, true);
  const inicioDirectorio = vista.getUint32(posicionDirectorio + 16, true);

  if (
    totalEntradas === 0xffff ||
    tamanoDirectorio === 0xffffffff ||
    inicioDirectorio === 0xffffffff ||
    totalEntradas > 10000 ||
    inicioDirectorio + tamanoDirectorio > bytes.byteLength
  ) {
    throw new Error("El paquete Office excede los limites seguros del visor.");
  }

  const decodificador = new TextDecoder("utf-8");
  const nombres = [];
  let tamanoDescomprimido = 0;
  let posicion = inicioDirectorio;

  for (let indice = 0; indice < totalEntradas; indice++) {
    if (posicion + 46 > bytes.byteLength || vista.getUint32(posicion, true) !== 0x02014b50) {
      throw new Error("El directorio del paquete Office esta corrupto.");
    }

    const tamanoEntrada = vista.getUint32(posicion + 24, true);
    const longitudNombre = vista.getUint16(posicion + 28, true);
    const longitudExtra = vista.getUint16(posicion + 30, true);
    const longitudComentario = vista.getUint16(posicion + 32, true);
    const finNombre = posicion + 46 + longitudNombre;

    if (tamanoEntrada === 0xffffffff || finNombre > bytes.byteLength) {
      throw new Error("El paquete Office contiene una entrada no compatible.");
    }

    tamanoDescomprimido += tamanoEntrada;

    if (tamanoDescomprimido > LIMITE_PAQUETE_OFFICE_BYTES) {
      throw new Error("El contenido descomprimido excede el limite seguro de 512 MB.");
    }

    nombres.push(decodificador.decode(bytes.subarray(posicion + 46, finNombre)));
    posicion = finNombre + longitudExtra + longitudComentario;
  }

  return nombres;
};

export const validarFirmaDocumento = (bytes, extension) => {
  const firmaPdf = [0x25, 0x50, 0x44, 0x46, 0x2d];
  const firmaOle = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  const firmaZip =
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    ((bytes[2] === 0x03 && bytes[3] === 0x04) ||
      (bytes[2] === 0x05 && bytes[3] === 0x06) ||
      (bytes[2] === 0x07 && bytes[3] === 0x08));

  const iniciaCon = (firma) => {
    return firma.every((valor, indice) => bytes[indice] === valor);
  };

  const firmaValida = {
    pdf: iniciaCon(firmaPdf),
    doc: iniciaCon(firmaOle),
    docx: firmaZip,
    xls: iniciaCon(firmaOle),
    xlsx: firmaZip,
  }[extension];

  if (!firmaValida) {
    throw new Error(`El contenido no corresponde con un archivo .${extension}.`);
  }

  if (extension === "docx" || extension === "xlsx") {
    const nombres = analizarPaqueteZip(bytes);
    const tieneTiposContenido = nombres.includes("[Content_Types].xml");
    const prefijoEsperado = extension === "docx" ? "word/" : "xl/";

    if (!tieneTiposContenido || !nombres.some((nombre) => nombre.startsWith(prefijoEsperado))) {
      throw new Error(`El paquete no contiene la estructura interna de un archivo .${extension}.`);
    }
  }
};

export const etiquetaColumna = (indice) => {
  let valor = Number(indice) + 1;
  let etiqueta = "";

  while (valor > 0) {
    const residuo = (valor - 1) % 26;
    etiqueta = String.fromCharCode(65 + residuo) + etiqueta;
    valor = Math.floor((valor - 1) / 26);
  }

  return etiqueta;
};

export const mimePorExtension = (extension) => {
  return MIME_POR_EXTENSION[extension] || "application/octet-stream";
};
