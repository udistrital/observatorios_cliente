import { ref } from "vue";
import { aspectosService } from "@/service/aspectos.service";
import { AspectoModel } from "@/model/aspecto.model";
import { ordenarPorOrden } from "@/utils/orden";

export function useAspectos(caracteristicaId) {
  const aspectos = ref([]);
  const cargandoAspectos = ref(false);

  const cargarAspectos = async () => {
    if (!caracteristicaId.value) {
      aspectos.value = [];
      return;
    }

    cargandoAspectos.value = true;

    try {
      aspectos.value = await aspectosService.listarPorCaracteristica(
        caracteristicaId.value
      );
    } finally {
      cargandoAspectos.value = false;
    }
  };

  const crearAspecto = async ({ nombre, orden = null }) => {
    const nuevoAspecto = new AspectoModel({
      caracteristica_id: caracteristicaId.value,
      nombre,
      orden,
      activo: true,
      estructuras_evidencias: [],
    });

    const aspectoCreado = await aspectosService.crear(nuevoAspecto);

    aspectos.value = ordenarPorOrden([
      ...aspectos.value,
      aspectoCreado,
    ]);

    return aspectoCreado;
  };

  const actualizarAspecto = async (id, data) => {
    const aspectoActualizado = await aspectosService.actualizarParcial(
      id,
      data
    );

    aspectos.value = ordenarPorOrden(
      aspectos.value.map((aspecto) => {
        if (aspecto.id !== id) {
          return aspecto;
        }

        return {
          ...aspecto,
          ...aspectoActualizado,
        };
      })
    );

    return aspectoActualizado;
  };

  const cambiarEstadoAspecto = async (aspecto) => {
    const nuevoEstado = aspecto.activo === false;

    const aspectoActualizado = await aspectosService.actualizarParcial(
      aspecto.id,
      {
        activo: nuevoEstado,
      }
    );

    aspectos.value = aspectos.value.map((item) => {
      if (item.id !== aspecto.id) {
        return item;
      }

      return {
        ...item,
        ...aspectoActualizado,
      };
    });

    return aspectoActualizado;
  };

  const eliminarAspecto = async (aspecto) => {
    await aspectosService.eliminar(aspecto.id);

    aspectos.value = aspectos.value.filter((item) => {
      return item.id !== aspecto.id;
    });
  };

  return {
    aspectos,
    cargandoAspectos,

    cargarAspectos,
    crearAspecto,
    actualizarAspecto,
    cambiarEstadoAspecto,
    eliminarAspecto,
  };
}
