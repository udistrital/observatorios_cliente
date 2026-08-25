import { computed } from "vue";
import { factoresService } from "@/service/factores.service";
import { useFactorStore } from "@/stores/factorStore";

export function useFactor(factorId) {
  const factorStore = useFactorStore();

  const obtenerIdFactor = (factor) => {
    return factor?.factor_id || factor?.id;
  };

  const crearFactorBase = () => ({
    id: factorId.value,
    factor_id: factorId.value,
    nombre: "Factor",
    descripcion: "",
    calificacion: "",
    orden: null,
    activo: true,
    caracteristicas: [],
  });

  const factor = computed(() => {
    const factorActual = factorStore.factor;

    if (
      factorActual &&
      obtenerIdFactor(factorActual) === factorId.value
    ) {
      return factorActual;
    }

    return crearFactorBase();
  });

  const cargarFactor = async (opciones = {}) => {
    const force = opciones.force === true;

    if (!factorId.value) {
      factorStore.setFactor(null);
      return null;
    }

    const factorActual = factorStore.factor;

    const yaTieneFactor =
      factorActual &&
      obtenerIdFactor(factorActual) === factorId.value;

    if (yaTieneFactor && !force) {
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
