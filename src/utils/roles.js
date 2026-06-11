export const ROL_ADMIN_OBSERVATORIOS = "ADMIN_OBSERVATORIOS";

export const normalizarRoles = (roles = []) => {
  if (Array.isArray(roles)) {
    return roles.map((rol) => String(rol).trim().toUpperCase()).filter(Boolean);
  }

  if (typeof roles === "string") {
    return roles
      .split(",")
      .map((rol) => rol.trim().toUpperCase())
      .filter(Boolean);
  }

  return [];
};

export const esAdminObservatorios = (roles = []) => {
  return normalizarRoles(roles).includes(ROL_ADMIN_OBSERVATORIOS);
};
