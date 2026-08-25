export const ORDEN_SIN_DEFINIR = 999999;

export const normalizarOrden = (valor, defecto = null) => {
  if (valor === null || valor === undefined || valor === "") {
    return defecto;
  }

  const numero = Number(valor);

  if (!Number.isInteger(numero)) {
    return defecto;
  }

  return numero;
};

export const ordenarPorOrden = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items].sort((a, b) => {
    const ordenA = normalizarOrden(a?.orden, ORDEN_SIN_DEFINIR);
    const ordenB = normalizarOrden(b?.orden, ORDEN_SIN_DEFINIR);

    if (ordenA !== ordenB) {
      return ordenA - ordenB;
    }

    const nombreA = String(a?.nombre || "").toLowerCase();
    const nombreB = String(b?.nombre || "").toLowerCase();

    if (nombreA !== nombreB) {
      return nombreA.localeCompare(nombreB);
    }

    return String(a?.id || "").localeCompare(String(b?.id || ""));
  });
};

export const validarOrdenNoNegativo = (value) => {
  return (
    value === "" ||
    value === null ||
    value === undefined ||
    /^\d+$/.test(String(value)) ||
    "El orden debe ser un número entero mayor o igual a cero."
  );
};
