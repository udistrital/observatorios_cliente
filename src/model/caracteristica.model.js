export class CaracteristicaModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.factor_id = data.factor_id || "";
    this.nombre = data.nombre || "";
    this.descripcion = data.descripcion || "";
    this.calificacion = data.calificacion || "";
    this.activo = data.activo !== undefined ? data.activo : true;
    this.aspectos = Array.isArray(data.aspectos) ? data.aspectos : [];
  }

  static fromApi(data = {}) {
    return new CaracteristicaModel({
      id: data.id,
      factor_id: data.factor_id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      calificacion: data.calificacion,
      activo: data.activo,
      aspectos: data.aspectos || [],
    });
  }

  static fromApiList(data = []) {
    return data.map((item) => CaracteristicaModel.fromApi(item));
  }

  toPayload() {
    return {
      factor_id: this.factor_id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      calificacion: this.calificacion || "",
      activo: this.activo,
      aspectos: this.aspectos || [],
    };
  }
}
