<template>
  <div class="aspecto-card">
    <header
      class="aspecto-card__header"
      @click="$emit('toggle', aspecto.id)"
    >
      <div class="aspecto-card__title">
        <span class="aspecto-card__number">
          {{ index + 1 }}
        </span>

        <div>
          <span class="aspecto-card__label">Aspecto</span>
          <h5>{{ aspecto.nombre }}</h5>
        </div>
      </div>

      <v-btn
        icon
        variant="text"
        size="small"
        color="primary"
        @click.stop="$emit('toggle', aspecto.id)"
      >
        <v-icon>
          {{ abierto ? "mdi-chevron-up" : "mdi-chevron-down" }}
        </v-icon>
      </v-btn>
    </header>

    <v-expand-transition>
      <div
        v-if="abierto"
        class="aspecto-card__content"
      >
        <AspectoActions
          :aspecto="aspecto"
          @ver="$emit('ver', aspecto)"
          @editar="$emit('editar', aspecto)"
          @cambiar-estado="$emit('cambiar-estado', aspecto)"
          @eliminar="$emit('eliminar', aspecto)"
        />

        <AspectoEstructurasTable
          :estructuras="aspecto.estructuras_evidencias || []"
          @crear="$emit('crear-estructura', aspecto)"
          @ver="$emit('ver-estructura', $event)"
          @editar="$emit('editar-estructura', aspecto, $event)"
          @cambiar-estado="$emit('cambiar-estado-estructura', aspecto, $event)"
          @ir="$emit('ir-estructura', $event)"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup>
import AspectoActions from "./AspectoActions.vue";
import AspectoEstructurasTable from "./AspectoEstructurasTable.vue";

defineProps({
  aspecto: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  abierto: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  "toggle",
  "ver",
  "editar",
  "cambiar-estado",
  "eliminar",
  "crear-estructura",
  "ver-estructura",
  "editar-estructura",
  "cambiar-estado-estructura",
  "ir-estructura",
]);
</script>

<style scoped>
.aspecto-card {
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid #b9d8ce;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(46, 139, 116, 0.08);
}

.aspecto-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px;
  cursor: pointer;
  background: #ffffff;
  border-left: 5px solid #2e8b74;
  transition: background-color 0.2s ease;
}

.aspecto-card__header:hover {
  background: #edf8f4;
}

.aspecto-card__title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.aspecto-card__number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  border-radius: 9px;
  background: #2e8b74;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
}

.aspecto-card__label {
  display: block;
  margin-bottom: 2px;
  color: #2e8b74;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.aspecto-card__title h5 {
  margin: 0;
  color: #29443d;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.35;
}

.aspecto-card__content {
  padding: 12px;
  background: #fbfefd;
  border-top: 1px solid #d8ebe4;
}

.aspecto-description-box {
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid #c7e4da;
  border-left: 5px solid #2e8b74;
  border-radius: 10px;
  background: #ffffff;
}

.aspecto-description-box p {
  margin: 0 0 6px;
  color: #37474f;
  font-size: 13px;
  line-height: 1.5;
}

.box-title {
  display: block;
  margin-bottom: 6px;
  color: #607d9a;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
</style>
