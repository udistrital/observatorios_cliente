<template>
  <article class="factor-card">
    <div class="factor-card__header">
      <span class="factor-card__label">Factor de evaluación</span>
      <h1 class="factor-card__title">
        {{ factor.nombre || "Factor" }}
      </h1>
    </div>

    <div class="factor-card__content">
      <FactorActions
        :factor="factor"
        :puede-gestionar="puedeGestionar"
        @ver="$emit('ver', factor)"
        @editar="$emit('editar', factor)"
        @cambiar-estado="$emit('cambiar-estado', factor)"
      />

      <FactorInfo :factor="factor" />
    </div>
  </article>
</template>

<script setup>
import FactorActions from "./FactorActions.vue";
import FactorInfo from "./FactorInfo.vue";

defineProps({
  factor: {
    type: Object,
    required: true,
  },
  puedeGestionar: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["ver", "editar", "cambiar-estado"]);
</script>

<style scoped>
.factor-card {
  overflow: hidden;
  border: 1px solid #d7e1ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(25, 55, 90, 0.08);
}

.factor-card__header {
  padding: 18px 22px;
  background: linear-gradient(135deg, #244f84 0%, #376aa3 100%);
  color: #ffffff;
}

.factor-card__label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.factor-card__title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
}

.factor-card__content {
  padding: 16px;
  background: #ffffff;
}
</style>
