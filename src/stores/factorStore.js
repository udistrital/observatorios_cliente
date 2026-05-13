import { defineStore } from "pinia";

export const useFactorStore = defineStore("factorStore", {
  state: () => ({
    factor: null,
  }),

  actions: {
    setFactor(data) {
      this.factor = data;
    },

    limpiarFactor() {
      this.factor = null;
    },
  },
});
