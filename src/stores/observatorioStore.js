import { defineStore } from "pinia";

export const useObservatorioStore = defineStore("observatorioStore", {
  state: () => ({
    observatorio: null,
  }),
  actions: {
    setObservatorio(data) {
      this.observatorio = data;
    },
  },
});
