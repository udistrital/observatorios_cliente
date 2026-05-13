<template>
  <div class="estructuras-evidencias">
    <div class="estructuras-evidencias__header">
      <div>
        <span class="estructuras-evidencias__label">
          Estructuras de evidencias
        </span>
        <h6>Estructuras asociadas al aspecto</h6>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="small"
        class="btn-crear-estructura"
        @click.stop="$emit('crear')"
      >
        Crear Estructura Evidencia
      </v-btn>
    </div>

    <div class="tabla-evidencias">
      <div class="tabla-evidencias__header">
        <div>ID</div>
        <div>Tipo de evidencia</div>
        <div>Nombre</div>
        <div>Estado</div>
        <div>Acciones</div>
      </div>

      <div
        v-if="itemsPaginados.length === 0"
        class="tabla-evidencias__empty"
      >
        No hay estructuras de evidencias registradas.
      </div>

      <div
        v-for="item in itemsPaginados"
        :key="item.id"
        class="tabla-evidencias__row"
      >
        <div class="tabla-evidencias__cell">
          <span class="estructura-id">
            {{ item.id }}
          </span>
        </div>

        <div class="tabla-evidencias__cell">
          <v-chip
            size="x-small"
            variant="tonal"
            :color="obtenerColorTipo(item.tipo_evidencia)"
          >
            {{ item.tipo_evidencia || "Sin tipo" }}
          </v-chip>
        </div>

        <div class="tabla-evidencias__cell">
          <span class="estructura-nombre">
            {{ item.nombre || "Sin nombre registrado" }}
          </span>
        </div>

        <div class="tabla-evidencias__cell">
          <v-chip
            size="x-small"
            variant="tonal"
            :color="item.activo !== false ? 'success' : 'error'"
          >
            {{ item.activo !== false ? "Activo" : "Inactivo" }}
          </v-chip>
        </div>

        <div class="tabla-evidencias__cell">
          <div class="acciones-tabla">
            <v-btn
              variant="tonal"
              icon
              size="x-small"
              color="primary"
              title="Ver estructura"
              @click.stop="$emit('ver', item)"
            >
              <v-icon size="16">mdi-eye</v-icon>
            </v-btn>

            <v-btn
              variant="tonal"
              icon
              size="x-small"
              color="primary"
              title="Editar estructura"
              @click.stop="$emit('editar', item)"
            >
              <v-icon size="16">mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              variant="tonal"
              icon
              size="x-small"
              :color="item.activo !== false ? 'warning' : 'success'"
              :title="item.activo !== false ? 'Desactivar estructura' : 'Activar estructura'"
              @click.stop="$emit('cambiar-estado', item)"
            >
              <v-icon size="16">
                {{ item.activo !== false ? "mdi-cancel" : "mdi-sync" }}
              </v-icon>
            </v-btn>

            <v-btn
              variant="tonal"
              icon
              size="x-small"
              color="success"
              title="Ir a la estructura"
              @click.stop="$emit('ir', item)"
            >
              <v-icon size="16">mdi-arrow-right-bold-circle</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <div class="tabla-evidencias__footer">
        <div class="footer__per-page">
          <span>Elementos por página:</span>

          <v-select
            v-model="itemsPorPagina"
            :items="[5, 10, 15]"
            density="compact"
            variant="outlined"
            hide-details
            class="select-items"
          />
        </div>

        <div class="footer__pagination">
          <span>{{ rangoPaginacion }}</span>

          <v-btn
            icon
            variant="text"
            size="small"
            :disabled="paginaActual === 1"
            @click="paginaActual = 1"
          >
            <v-icon>mdi-page-first</v-icon>
          </v-btn>

          <v-btn
            icon
            variant="text"
            size="small"
            :disabled="paginaActual === 1"
            @click="paginaActual--"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn
            icon
            variant="text"
            size="small"
            :disabled="paginaActual === totalPaginas"
            @click="paginaActual++"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>

          <v-btn
            icon
            variant="text"
            size="small"
            :disabled="paginaActual === totalPaginas"
            @click="paginaActual = totalPaginas"
          >
            <v-icon>mdi-page-last</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  estructuras: {
    type: Array,
    default: () => [],
  },
});

defineEmits([
  "crear",
  "ver",
  "editar",
  "cambiar-estado",
  "ir",
]);

const paginaActual = ref(1);
const itemsPorPagina = ref(5);

const items = computed(() => {
  return props.estructuras.map((estructura, index) => ({
    id: estructura.id || `estructura_${index + 1}`,
    tipo_evidencia: estructura.tipo_evidencia || "Sin tipo",
    nombre: estructura.nombre || `Estructura ${index + 1}`,
    activo: estructura.activo !== false,
  }));
});

const totalPaginas = computed(() => {
  const total = Math.ceil(items.value.length / itemsPorPagina.value);
  return total > 0 ? total : 1;
});

const itemsPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value;
  const fin = inicio + itemsPorPagina.value;

  return items.value.slice(inicio, fin);
});

const rangoPaginacion = computed(() => {
  if (items.value.length === 0) {
    return "0-0 de 0";
  }

  const inicio = (paginaActual.value - 1) * itemsPorPagina.value + 1;
  const fin = Math.min(
    paginaActual.value * itemsPorPagina.value,
    items.value.length
  );

  return `${inicio}-${fin} de ${items.value.length}`;
});

watch(
  () => itemsPorPagina.value,
  () => {
    paginaActual.value = 1;
  }
);

watch(
  () => props.estructuras,
  () => {
    if (paginaActual.value > totalPaginas.value) {
      paginaActual.value = totalPaginas.value;
    }
  },
  {
    deep: true,
  }
);

const obtenerColorTipo = (tipo = "") => {
  const tipoNormalizado = tipo.toLowerCase();

  if (tipoNormalizado === "documental") {
    return "primary";
  }

  if (tipoNormalizado === "tabla") {
    return "success";
  }

  return "grey";
};
</script>

<style scoped>
.estructuras-evidencias {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid #cfe0ef;
  border-left: 5px solid #4a7cad;
  border-radius: 12px;
  background: #f7fbff;
}

.estructuras-evidencias__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 10px;
  padding: 9px 11px;
  border: 1px solid #d7e7f4;
  border-radius: 10px;
  background: #ffffff;
}

.estructuras-evidencias__label {
  display: block;
  margin-bottom: 3px;
  color: #4a7cad;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.estructuras-evidencias__header h6 {
  margin: 0;
  color: #2f4774;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.25;
}

.btn-crear-estructura {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: none;
}

.tabla-evidencias {
  overflow: hidden;
  border: 1px solid #c3d7e8;
  border-radius: 10px;
  background: #ffffff;
}

.tabla-evidencias__header,
.tabla-evidencias__row {
  display: grid;
  grid-template-columns: 24% 20% 22% 14% 20%;
  width: 100%;
}

.tabla-evidencias__header {
  min-height: 38px;
  background: #e7f1fa;
  border-bottom: 1px solid #c3d7e8;
}

.tabla-evidencias__header > div {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 8px;
  color: #263238;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.tabla-evidencias__row {
  min-height: 44px;
  border-bottom: 1px solid #dbe7f1;
}

.tabla-evidencias__row:last-of-type {
  border-bottom: none;
}

.tabla-evidencias__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 6px 8px;
  color: #37474f;
  font-size: 12px;
  line-height: 1.35;
  text-align: center;
}

.estructura-id {
  display: block;
  width: 100%;
  max-width: 180px;
  margin: 0 auto;
  color: #455a64;
  font-family: monospace;
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
  word-break: break-word;
}

.estructura-nombre {
  display: block;
  width: 100%;
  max-width: 220px;
  margin: 0 auto;
  color: #37474f;
  font-size: 12px;
  line-height: 1.35;
  text-align: center;
  word-break: break-word;
}

.acciones-tabla {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 5px;
  flex-wrap: nowrap;
}

.tabla-evidencias__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 10px;
  color: #607d8b;
  font-size: 12px;
  text-align: center;
}

.tabla-evidencias__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  min-height: 46px;
  padding: 6px 12px;
  border-top: 1px solid #dbe7f1;
  font-size: 11px;
}

.footer__per-page,
.footer__pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-items {
  width: 76px;
}

:deep(.v-chip) {
  font-size: 11px;
  font-weight: 700;
}

:deep(.v-btn) {
  flex: 0 0 auto;
}

@media (max-width: 900px) {
  .estructuras-evidencias__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .tabla-evidencias {
    overflow-x: auto;
  }

  .tabla-evidencias__header,
  .tabla-evidencias__row {
    min-width: 820px;
    grid-template-columns: 24% 20% 22% 14% 20%;
  }

  .tabla-evidencias__footer {
    justify-content: flex-start;
    min-width: 820px;
  }
}
</style>
