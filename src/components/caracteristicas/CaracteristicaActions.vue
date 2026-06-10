<template>
  <div class="actions-bar">
    <span class="actions-bar__title">Acciones de la característica</span>

    <div class="actions-bar__buttons">
      <v-btn
        variant="tonal"
        icon
        size="small"
        color="primary"
        title="Ver característica"
        @click.stop="$emit('ver')"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>

      <v-btn
        variant="tonal"
        icon
        size="small"
        color="primary"
        title="Editar característica"
        @click.stop="$emit('editar')"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        variant="tonal"
        icon
        size="small"
        :color="caracteristica.activo !== false ? 'warning' : 'success'"
        :title="caracteristica.activo !== false ? 'Desactivar característica' : 'Activar característica'"
        @click.stop="$emit('cambiar-estado')"
      >
        <v-icon>
          {{ caracteristica.activo !== false ? "mdi-cancel" : "mdi-sync" }}
        </v-icon>
      </v-btn>

      <!--
      <v-btn
        variant="tonal"
        icon
        size="small"
        color="error"
        title="Eliminar característica"
        @click.stop="$emit('eliminar')"
      >
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
      -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  caracteristica: {
    type: Object,
    required: true,
  },
});

defineEmits(["ver", "editar", "cambiar-estado", "eliminar"]);
</script>

<style scoped>
.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin: 0 0 14px;
  padding: 8px 12px;

  border: 1px solid #d7e1ef;
  border-left: 5px solid #7a95c9;
  border-radius: 10px;

  background: #f8fafc;
}

.actions-bar__title {
  color: #455a64;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.actions-bar__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 900px) {
  .actions-bar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
