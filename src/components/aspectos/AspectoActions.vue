<template>
  <div class="aspecto-actions-bar">
    <span class="aspecto-actions-bar__title">Acciones del aspecto</span>

    <div class="aspecto-actions-bar__buttons">
      <v-btn
        variant="tonal"
        icon
        size="small"
        color="primary"
        title="Ver aspecto"
        @click.stop="$emit('ver')"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>

      <v-btn
        variant="tonal"
        icon
        size="small"
        color="primary"
        title="Editar aspecto"
        @click.stop="$emit('editar')"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        variant="tonal"
        icon
        size="small"
        :color="aspecto.activo !== false ? 'warning' : 'success'"
        :title="aspecto.activo !== false ? 'Desactivar aspecto' : 'Activar aspecto'"
        @click.stop="$emit('cambiar-estado')"
      >
        <v-icon>
          {{ aspecto.activo !== false ? "mdi-cancel" : "mdi-sync" }}
        </v-icon>
      </v-btn>

      <!--
      <v-btn
        variant="tonal"
        icon
        size="small"
        color="error"
        title="Eliminar aspecto"
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
  aspecto: {
    type: Object,
    required: true,
  },
});

defineEmits(["ver", "editar", "cambiar-estado", "eliminar"]);
</script>

<style scoped>
.aspecto-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  padding: 8px 12px;
  border: 1px solid #c7e4da;
  border-left: 5px solid #2e8b74;
  border-radius: 10px;
  background: #f4fbf8;
}

.aspecto-actions-bar__title {
  color: #1f6f5d;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.aspecto-actions-bar__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 900px) {
  .aspecto-actions-bar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
