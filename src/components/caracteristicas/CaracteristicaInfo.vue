<template>
  <div class="content-grid">
    <div class="description-box">
      <span class="box-title">Descripción de la característica</span>
      <p>
        {{ descripcion }}
      </p>
    </div>

    <div class="rating-box">
      <span class="box-title">Calificación de la característica</span>
      <strong>
        {{ calificacion }}
      </strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  caracteristica: {
    type: Object,
    required: true,
  },
});

const descripcion = computed(() => {
  return (
    props.caracteristica.descripcion ||
    "Sin descripción registrada para esta característica."
  );
});

const calificacion = computed(() => {
  if (
    props.caracteristica.calificacion &&
    props.caracteristica.calificacion_descripcion
  ) {
    return `${props.caracteristica.calificacion} ${props.caracteristica.calificacion_descripcion}`;
  }

  return props.caracteristica.calificacion || "Sin calificación registrada.";
});
</script>

<style scoped>
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 14px;
  align-items: stretch;
}

.description-box,
.rating-box {
  border: 1px solid #d7e1ef;
  border-radius: 12px;
  background: #f8fafc;
}

.description-box {
  padding: 14px 16px;
  border-left: 5px solid #315f99;
}

.description-box p {
  margin: 0;
  color: #37474f;
  font-size: 13px;
  line-height: 1.5;
}

.rating-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 16px;
  border-left: 5px solid #7a95c9;
}

.rating-box strong {
  color: #244f84;
  font-size: 14px;
  line-height: 1.4;
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

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
