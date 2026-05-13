export class FactorModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.factor_id = data.factor_id || data.id || null;
    this.nombre = data.nombre || "";
    this.descripcion = data.descripcion || "";
    this.calificacion = data.calificacion || "";
    this.activo = data.activo !== undefined ? data.activo : true;
    this.caracteristicas = Array.isArray(data.caracteristicas)
      ? data.caracteristicas
      : [];
  }

  static fromApi(data = {}) {
    return new FactorModel({
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      calificacion: data.calificacion,
      activo: data.activo,
      caracteristicas: data.caracteristicas || [],
    });
  }

  static fromApiList(data = []) {
    return data.map((item) => FactorModel.fromApi(item));
  }

  toPayload() {
    return {
      nombre: this.nombre || "",
      descripcion: this.descripcion || "",
      calificacion: this.calificacion || "",
      activo: this.activo,
      caracteristicas: this.caracteristicas || [],
    };
  }
}
