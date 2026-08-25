import { normalizarOrden, ordenarPorOrden } from "@/utils/orden";

export class ProcesoModel {
  constructor(data = {}) {
    this.id = data.id || data.proceso_id || null;
    this.proceso_id = data.proceso_id || data.id || null;
    this.nombre = data.nombre || "";
    this.descripcion = data.descripcion || "";
    this.dependencia_responsable = data.dependencia_responsable || "";
    this.objetivo = data.objetivo || "";
    this.factores = Array.isArray(data.factores) ? data.factores : [];
    this.fecha_inicio = data.fecha_inicio || "";
    this.fecha_fin = data.fecha_fin || "";
    this.orden = normalizarOrden(data.orden, null); 
    this.activo = data.activo !== undefined ? data.activo : true;
    this.fecha_creacion = data.fecha_creacion || "";
    this.fecha_modificacion = data.fecha_modificacion || "";
  }

  static fromApi(data = {}) {
    return new ProcesoModel({
      id: data.id,
      proceso_id: data.proceso_id || data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      dependencia_responsable: data.dependencia_responsable,
      objetivo: data.objetivo,
      factores: data.factores || [],
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      orden: data.orden,
      activo: data.activo,
      fecha_creacion: data.fecha_creacion,
      fecha_modificacion: data.fecha_modificacion,
    });
  }

  static fromApiList(data = []) {
    return ordenarPorOrden(data.map((item) => ProcesoModel.fromApi(item)));
  }

  toPayload() {
    return {
      nombre: this.nombre || "",
      descripcion: this.descripcion || "",
      dependencia_responsable: this.dependencia_responsable || "",
      objetivo: this.objetivo || "",
      factores: this.factores || [],
      fecha_inicio: this.fecha_inicio || "",
      fecha_fin: this.fecha_fin || "",
      orden: this.orden,
      activo: this.activo,
    };
  }
}
