import { normalizarOrden, ordenarPorOrden } from "@/utils/orden";

export class EstructuraEvidenciaModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.aspecto_id = data.aspecto_id || null;
    this.tipo_evidencia = data.tipo_evidencia || "";
    this.nombre = data.nombre || "";
    this.orden = normalizarOrden(data.orden, null); 
    this.activo = data.activo !== undefined ? data.activo : true;
    this.campos = Array.isArray(data.campos) ? data.campos : [];
    this.data = Array.isArray(data.data) ? data.data : [];
  }

  static fromApi(data = {}) {
    return new EstructuraEvidenciaModel({
      id: data.id,
      aspecto_id: data.aspecto_id,
      tipo_evidencia: data.tipo_evidencia,
      nombre: data.nombre,
      orden: data.orden,
      activo: data.activo,
      campos: data.campos || [],
      data: data.data || [],
    });
  }

  static fromApiList(data = []) {
    if (!Array.isArray(data)) {
      return [];
    }

    return ordenarPorOrden(data.map((item) => EstructuraEvidenciaModel.fromApi(item)));
  }

  toCreatePayload() {
    return {
      aspecto_id: this.aspecto_id,
      tipo_evidencia: this.tipo_evidencia,
      nombre: this.nombre,
      orden: this.orden,
      activo: this.activo,
      campos: this.campos,
      data: this.data,
    };
  }

  toUpdatePayload() {
    return {
      aspecto_id: this.aspecto_id,
      tipo_evidencia: this.tipo_evidencia,
      nombre: this.nombre,
      orden: this.orden,
      activo: this.activo,
      campos: this.campos,
      data: this.data,
    };
  }

  toAspectoResumenPayload() {
    return {
      id: this.id,
      tipo_evidencia: this.tipo_evidencia,
      nombre: this.nombre,
      orden: this.orden,
      activo: this.activo,
    };
  }
}
