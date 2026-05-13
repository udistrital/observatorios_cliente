import { computed } from "vue";
import { factoresService } from "@/service/factores.service";
import { useFactorStore } from "@/stores/factorStore";

export function useFactor(factorId) {
  const factorStore = useFactorStore();

  const factor = computed(() => {
    return factorStore.factor || {
      id: factorId.value,
      nombre: "Factor",
      descripcion: "",
      calificacion: "",
      activo: true,
      caracteristicas: [],
    };
  });

  const cargarFactor = async () => {
    if (!factorId.value) {
      factorStore.setFactor(null);
      return null;
    }

    const factorActual = factorStore.factor;

    const yaTieneFactor =
      factorActual &&
      factorActual.id === factorId.value;

    if (yaTieneFactor) {
      return factorActual;
    }

    const factorEncontrado = await factoresService.obtener(factorId.value);
    factorStore.setFactor(factorEncontrado);

    return factorEncontrado;
  };

  const actualizarFactor = async (data) => {
    const factorActualizado = await factoresService.actualizarParcial(
      factorId.value,
      data
    );

    factorStore.setFactor(factorActualizado);

    return factorActualizado;
  };

  const cambiarEstadoFactor = async () => {
    const nuevoEstado = factor.value.activo === false;

    let factorActualizado = null;

    if (nuevoEstado) {
      factorActualizado = await factoresService.actualizarParcial(
        factorId.value,
        {
          activo: true,
        }
      );
    } else {
      await factoresService.desactivar(factorId.value);

      factorActualizado = {
        ...factor.value,
        activo: false,
      };
    }

    factorStore.setFactor(factorActualizado);

    return factorActualizado;
  };

  return {
    factor,
    cargarFactor,
    actualizarFactor,
    cambiarEstadoFactor,
  };
}
