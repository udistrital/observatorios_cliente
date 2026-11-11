export const LONGITUD_MAXIMA_ENLACE = 2048;

const PROTOCOLOS_PERMITIDOS = new Set(["http:", "https:"]);
const CARACTERES_NO_PERMITIDOS = /[\u0000-\u0020\u007f\\]/;
const ETIQUETA_HOST_VALIDA = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export const normalizarEnlaceHttp = (valor) => {
  const enlace = String(valor ?? "").trim();

  if (
    !enlace ||
    enlace.length > LONGITUD_MAXIMA_ENLACE ||
    CARACTERES_NO_PERMITIDOS.test(enlace) ||
    !/^https?:\/\/[^/?#]/i.test(enlace)
  ) {
    return null;
  }

  try {
    const url = new URL(enlace);
    const inicioAutoridad = enlace.indexOf("://") + 3;
    const autoridad = enlace
      .slice(inicioAutoridad)
      .split(/[/?#]/, 1)[0];
    const hostname = url.hostname.endsWith(".")
      ? url.hostname.slice(0, -1)
      : url.hostname;
    const esIpv6 = hostname.startsWith("[") && hostname.endsWith("]");
    const hostValido = esIpv6 || (
      hostname.length <= 253 &&
      hostname.split(".").every((etiqueta) => {
        return ETIQUETA_HOST_VALIDA.test(etiqueta);
      })
    );

    if (
      !PROTOCOLOS_PERMITIDOS.has(url.protocol) ||
      !url.hostname ||
      url.port === "0" ||
      autoridad.includes("%") ||
      !hostValido
    ) {
      return null;
    }

    return enlace;
  } catch {
    return null;
  }
};
