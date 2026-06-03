export class FactorModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.factor_id = data.factor_id || data.id || null;
    this.proceso_id = data.proceso_id || "";
    this.nombre = data.nombre || "";
    this.descripcion = data.descripcion || "";
    this.calificacion = data.calificacion || "";
    this.caracteristicas = Array.isArray(data.caracteristicas)
      ? data.caracteristicas
      : [];
    this.activo = data.activo !== undefined ? data.activo : true;
    this.fecha_creacion = data.fecha_creacion || "";
    this.fecha_modificacion = data.fecha_modificacion || "";
  }

  static fromApi(data = {}) {
    return new FactorModel({
      id: data.id,
      factor_id: data.factor_id || data.id,
      proceso_id: data.proceso_id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      calificacion: data.calificacion,
      caracteristicas: data.caracteristicas || [],
      activo: data.activo,
      fecha_creacion: data.fecha_creacion,
      fecha_modificacion: data.fecha_modificacion,
    });
  }

  static fromApiList(data = []) {
    return data.map((item) => FactorModel.fromApi(item));
  }

  toPayload() {
    return {
      proceso_id: this.proceso_id || "",
      nombre: this.nombre || "",
      descripcion: this.descripcion || "",
      calificacion: this.calificacion || "",
      caracteristicas: this.caracteristicas || [],
      activo: this.activo,
    };
  }
}
