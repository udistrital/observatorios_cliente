import { defineStore } from 'pinia';

export const useGraficaStore = defineStore('graficaStore', {
  state: () => ({
    grafica: null,   
  }),
  actions: {
    setGrafica(data) {
      this.grafica = data;
    },
    clearGrafica() {
      this.grafica = null;
    },
  },
  persist: true,
});
