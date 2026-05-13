<template>
  <article class="caracteristica-card">
    <header
      class="caracteristica-card__header"
      @click="$emit('toggle', clave)"
    >
      <div class="caracteristica-card__title">
        <span class="caracteristica-card__number">
          {{ index + 1 }}
        </span>

        <div>
          <span class="caracteristica-card__label">Característica</span>
          <h3>{{ caracteristica.nombre }}</h3>
        </div>
      </div>

      <v-btn
        icon
        variant="text"
        color="white"
        size="small"
        class="btn-toggle"
        @click.stop="$emit('toggle', clave)"
      >
        <v-icon>
          {{ abierta ? "mdi-minus" : "mdi-plus" }}
        </v-icon>
      </v-btn>
    </header>

    <v-expand-transition>
      <div
        v-if="abierta"
        class="caracteristica-card__content"
      >
        <CaracteristicaActions
          :caracteristica="caracteristica"
          @ver="$emit('ver', caracteristica)"
          @editar="$emit('editar', caracteristica)"
          @cambiar-estado="$emit('cambiar-estado', caracteristica)"
          @eliminar="$emit('eliminar', caracteristica)"
        />

        <CaracteristicaInfo :caracteristica="caracteristica" />

        <slot
          :caracteristica="caracteristica"
          :index="index"
        />
      </div>
    </v-expand-transition>
  </article>
</template>

<script setup>
import CaracteristicaActions from "./CaracteristicaActions.vue";
import CaracteristicaInfo from "./CaracteristicaInfo.vue";

defineProps({
  caracteristica: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  clave: {
    type: String,
    required: true,
  },
  abierta: {
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
]);
</script>

<style scoped>
.caracteristica-card {
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid #ccd9ea;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 5px 16px rgba(25, 55, 90, 0.07);
}

.caracteristica-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 16px;
  background: #315f99;
  color: #ffffff;
  cursor: pointer;
}

.caracteristica-card__title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.caracteristica-card__number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffffff;
  color: #315f99;
  font-size: 14px;
  font-weight: 900;
}

.caracteristica-card__label {
  display: block;
  margin-bottom: 2px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.caracteristica-card__title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
}

.caracteristica-card__content {
  padding: 10px 16px 16px;
  background: #ffffff;
}

.btn-toggle {
  flex: 0 0 auto;
}
</style>
