<template>
    <div class="intro">
        <h1>{{ upper(panelStore?.panel.nombreFactor) }} - {{ upper(panelStore?.panel.nombreCaracteristica) }}</h1>
        <!--<div class="intro-box">
        <p>{{ panelStore?.panel.descripcion }}</p>
        </div>-->
        
    </div>
    <div class="intro">
        <div class="menu-opciones">
            <v-btn class="opcion" @click="diriguirseGraficas(item)">Ver graficas</v-btn>
            <v-btn class="opcion" @click="diriguirseTablas(item)">Ver tablas</v-btn>
            <v-btn class="opcion" @click="diriguirseDocumentos(item)">Ver documentos</v-btn>
        </div>
    </div>

    <!--<div v-if="mostrarPanel">
        <PanelVistaPrincipal />
    </div>-->
    <div v-if="mostrarPanel">
        <Panel />
    </div>
    <div v-if="mostrarTableroDatos">
        <TableroVista />
    </div>
    <div v-if="mostrarArchivos">
        <ArchivosVista />
    </div>
</template>

<script setup>
    import { usePanelStore } from "@/stores/panelStore";
    import PanelVistaPrincipal from "@/components/panel/PanelVistaPrincipal.vue";
    import TableroVista from "@/components/tablero/TableroVista.vue";
    import ArchivosGestion from "@/components/archivos/ArchivosGestion.vue";
    import ArchivosVista from "@/components/archivos/ArchivosVista.vue";
    import Panel from "@/components/panel/PanelVista.vue";
    import { ref } from "vue";
    import { useObservatorioStore } from "@/stores/observatorioStore";

    const observatorioStore = useObservatorioStore();
    const panelStore = usePanelStore();
    console.log("componente característica principal", panelStore.panel);
    const mostrarPanel = ref(false);
    const mostrarTableroDatos = ref(false);
    const mostrarArchivos = ref(false);

    const upper = (texto) => (texto || "").toUpperCase();

    const diriguirseGraficas = (item) => {
        //console.log("item.raw :", item.raw);
        //console.log("item.raw.id :", item.raw.id);
        //console.log("item.raw.nombre :", item.raw.nombre);
        //console.log("item.raw.descripcion :", item.raw.descripcion);
        //console.log("item.raw.observatorio :", item.raw.observatorio);
        //console.log("item.raw.columnas :", item.raw.columnas);
        panelStore.setPanel({
            id: panelStore?.panel.id,
            nombre: panelStore?.panel.nombreCaracteristica,
            nombreCaracteristica: panelStore?.panel.nombreCaracteristica,
            descripcion: panelStore?.panel.descripcion,
            nombreFactor: panelStore?.panel.nombreFactor,
            observatorio: panelStore?.panel.observatorio,
            columnas: panelStore?.panel.columnas,
        });
        console.log("panelStore.panel actualizado :", panelStore.panel);
        mostrarPanel.value = true;
        mostrarTableroDatos.value = false;
        mostrarArchivos.value = false;
    };

    const diriguirseTablas = (item) => {
      mostrarPanel.value = false;
      mostrarTableroDatos.value = true;
      mostrarArchivos.value = false;
    };
    const diriguirseDocumentos = (item) => {
      mostrarPanel.value = false;
      mostrarTableroDatos.value = false;
      mostrarArchivos.value = true;
    };
</script>

<style scoped>
.intro {
  background-color: #335f97;
  color: #ffffff;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.intro h1 {
  background-color: #ffffff;
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
  color: #335f97;
  border: 2px solid black;
  border-radius: 10px;
}
.intro-box {
  background-color: #ffffff;
  font-size: 14px;
  color: black;
  border: 2px solid black;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.menu-opciones {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.opcion {
  background-color: #ffffff !important;
  color: #000000 !important;
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #335f97 !important;
  box-shadow: none !important;
  text-transform: none !important;
  cursor: pointer;
  font-size: 14px;
  font-weight: 200;
  transition: 0.2s;
}

.opcion:hover {
  background-color: #335f97;
  color: white;
  border: 2px solid #ffffff;
}
</style>