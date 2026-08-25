import { normalizarOrden, ordenarPorOrden } from "@/utils/orden";

export class AspectoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.caracteristica_id = data.caracteristica_id || null;
    this.nombre = data.nombre || "";
    this.orden = normalizarOrden(data.orden, null);
    this.activo = data.activo !== undefined ? data.activo : true;
    this.estructuras_evidencias = Array.isArray(data.estructuras_evidencias)
      ? data.estructuras_evidencias
      : [];
  }

  static fromApi(data = {}) {
    return new AspectoModel({
      id: data.id,
      caracteristica_id: data.caracteristica_id,
      nombre: data.nombre,
      orden: data.orden,
      activo: data.activo,
      estructuras_evidencias: data.estructuras_evidencias || [],
    });
  }

  static fromApiList(data = []) {
    if (!Array.isArray(data)) {
      return [];
    }

    return ordenarPorOrden(data.map((item) => AspectoModel.fromApi(item)));
  }

  toPayload() {
    return {
      caracteristica_id: this.caracteristica_id,
      nombre: this.nombre,
      orden: this.orden,
      activo: this.activo,
      estructuras_evidencias: this.estructuras_evidencias || [],
    };
  }
}
