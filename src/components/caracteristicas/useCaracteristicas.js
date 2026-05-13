import { ref } from "vue";
import { caracteristicasService } from "@/service/caracteristicas.service";
import { CaracteristicaModel } from "@/model/caracteristica.model";

export function useCaracteristicas(factorId) {
  const caracteristicas = ref([]);
  const cargandoCaracteristicas = ref(false);

  const cargarCaracteristicas = async () => {
    if (!factorId.value) {
      caracteristicas.value = [];
      return;
    }

    cargandoCaracteristicas.value = true;

    try {
      caracteristicas.value = await caracteristicasService.listarPorFactor(
        factorId.value
      );
    } finally {
      cargandoCaracteristicas.value = false;
    }
  };

  const crearCaracteristica = async ({ nombre, descripcion, calificacion }) => {
    const nuevaCaracteristica = new CaracteristicaModel({
      factor_id: factorId.value,
      nombre,
      descripcion,
      calificacion: calificacion || "",
      activo: true,
      aspectos: [],
    });

    const caracteristicaCreada = await caracteristicasService.crear(
      nuevaCaracteristica
    );

    caracteristicas.value = [
      ...caracteristicas.value,
      caracteristicaCreada,
    ];

    return caracteristicaCreada;
  };

  const actualizarCaracteristica = async (id, data) => {
    const caracteristicaActualizada =
      await caracteristicasService.actualizarParcial(id, data);

    caracteristicas.value = caracteristicas.value.map((caracteristica) => {
      if (caracteristica.id !== id) {
        return caracteristica;
      }

      return {
        ...caracteristica,
        ...caracteristicaActualizada,
      };
    });

    return caracteristicaActualizada;
  };

  const cambiarEstadoCaracteristica = async (caracteristica) => {
    const nuevoEstado = caracteristica.activo === false;

    const caracteristicaActualizada =
      await caracteristicasService.actualizarParcial(caracteristica.id, {
        activo: nuevoEstado,
      });

    caracteristicas.value = caracteristicas.value.map((item) => {
      if (item.id !== caracteristica.id) {
        return item;
      }

      return {
        ...item,
        ...caracteristicaActualizada,
      };
    });

    return caracteristicaActualizada;
  };

  const eliminarCaracteristica = async (caracteristica) => {
    await caracteristicasService.eliminar(caracteristica.id);

    caracteristicas.value = caracteristicas.value.filter((item) => {
      return item.id !== caracteristica.id;
    });
  };

  return {
    caracteristicas,
    cargandoCaracteristicas,

    cargarCaracteristicas,
    crearCaracteristica,
    actualizarCaracteristica,
    cambiarEstadoCaracteristica,
    eliminarCaracteristica,
  };
}
