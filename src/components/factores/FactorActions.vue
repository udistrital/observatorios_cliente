<template>
  <div class="factor-actions-bar">
    <span class="factor-actions-bar__title">Acciones del factor</span>

    <div class="factor-actions-bar__buttons">
      <v-btn
        variant="tonal"
        icon
        size="small"
        color="primary"
        title="Ver factor"
        @click.stop="$emit('ver')"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>

      <v-btn
        variant="tonal"
        icon
        size="small"
        color="primary"
        title="Editar factor"
        @click.stop="$emit('editar')"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        variant="tonal"
        icon
        size="small"
        :color="factor.activo !== false ? 'error' : 'success'"
        :title="factor.activo !== false ? 'Desactivar factor' : 'Activar factor'"
        @click.stop="$emit('cambiar-estado')"
      >
        <v-icon>
          {{ factor.activo !== false ? "mdi-trash-can" : "mdi-sync" }}
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  factor: {
    type: Object,
    required: true,
  },
});

defineEmits(["ver", "editar", "cambiar-estado"]);
</script>

<style scoped>
.factor-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 14px;
  padding: 8px 12px;
  border: 1px solid #d7e1ef;
  border-left: 5px solid #244f84;
  border-radius: 10px;
  background: #f8fafc;
}

.factor-actions-bar__title {
  color: #455a64;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.factor-actions-bar__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 900px) {
  .factor-actions-bar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
