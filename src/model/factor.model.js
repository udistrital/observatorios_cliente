import { normalizarOrden, ordenarPorOrden } from "@/utils/orden";

export class FactorModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.proceso_id = data.proceso_id || null;
    this.nombre = data.nombre || "";
    this.descripcion = data.descripcion || "";
    this.calificacion = data.calificacion || "";
    this.orden = normalizarOrden(data.orden, null);
    this.caracteristicas = Array.isArray(data.caracteristicas)
      ? data.caracteristicas
      : [];
    this.activo = data.activo !== undefined ? data.activo : true;
  }

  static fromApi(data = {}) {
    return new FactorModel({
      id: data.id || data.factor_id,
      proceso_id: data.proceso_id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      calificacion: data.calificacion,
      orden: data.orden,
      caracteristicas: data.caracteristicas || [],
      activo: data.activo,
    });
  }

  static fromApiList(data = []) {
    return ordenarPorOrden(data.map((item) => FactorModel.fromApi(item)));
  }

  toPayload() {
    return {
      proceso_id: this.proceso_id,
      nombre: this.nombre || "",
      descripcion: this.descripcion || "",
      calificacion: this.calificacion || "",
      orden: this.orden,
      caracteristicas: this.caracteristicas || [],
      activo: this.activo,
    };
  }
}
