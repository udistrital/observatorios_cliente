export class EstructuraEvidenciaModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.aspecto_id = data.aspecto_id || null;
    this.tipo_evidencia = data.tipo_evidencia || "";
    this.nombre = data.nombre || "";
    this.activo = data.activo !== undefined ? data.activo : true;
  }

  static fromApi(data = {}) {
    return new EstructuraEvidenciaModel({
      id: data.id,
      aspecto_id: data.aspecto_id,
      tipo_evidencia: data.tipo_evidencia,
      nombre: data.nombre,
      activo: data.activo,
    });
  }

  static fromApiList(data = []) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item) => EstructuraEvidenciaModel.fromApi(item));
  }

  toCreatePayload() {
    return {
      aspecto_id: this.aspecto_id,
      tipo_evidencia: this.tipo_evidencia,
      nombre: this.nombre,
      activo: this.activo,
    };
  }

  toUpdatePayload() {
    return {
      aspecto_id: this.aspecto_id,
      tipo_evidencia: this.tipo_evidencia,
      nombre: this.nombre,
      activo: this.activo,
    };
  }
}
