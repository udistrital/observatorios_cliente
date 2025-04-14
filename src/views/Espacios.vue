<template>
  <div class="main-espacios">
    <div class="espacio elevation-5" @click="verAdministracion">
      <div class="espacio__item"></div>
      <figure class="espacio__img">
        <img src="../assets/img/logo-admin.png" alt="administracion" />
      </figure>
      <h4 class="espacio__titulo">Administración</h4>
    </div>
    <div v-for="(espacio, index) in espacios" :key="index">
      <div
        v-if="espacio.activo"
        class="espacio elevation-5"
        @click="diriguirseObservatorio(espacio)"
      >
        <figure class="espacio__img">
          <img :src="espacio.imagen" alt="administracion" />
        </figure>
        <h4 class="espacio__titulo">{{ espacio.nombre }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import espaciosData from "../data_prueba.json";
import { useRouter } from "vue-router";
import peticionAPI from "@/service/conexion_api";
import { useObservatorioStore } from "@/stores/observatorioStore";

const observatorioStore = useObservatorioStore();
const router = useRouter();
const espacios = ref([]);
const observatorios = ref();

const verAdministracion = () => {
  router.push("/administracion/observatorios");
};

const traerObservatorios = () => {
  espacios.value = [];
  peticionAPI("observatorios/", "GET")
    .then((data) => {
      espacios.value = data;
      console.log(espacios.value);
    })
    .catch((error) => console.error(error));
};

const diriguirseObservatorio = (item) => {
  observatorioStore.setObservatorio({
    id: item.id,
    observatorio_id: item.observatorio_id,
    nombre: item.nombre,
    imagen: item.imagen,
  });
  router.push(`/${item.observatorio_id}/estructuras`);
};
onMounted(() => {
  espacios.value = espaciosData.espacios;
  traerObservatorios();
});
</script>

<style scoped>
.main-espacios {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
  max-height: 100%;
  overflow-x: hidden;
}
.espacio {
  height: 130px;
  width: 130px;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  cursor: pointer;
}
.espacio__img img {
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}
.espacio__titulo {
  text-align: center;
  width: 90%;
}
</style>