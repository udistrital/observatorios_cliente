import { defineStore } from "pinia";

export const useEstructuraStore = defineStore("estructuraStore", {
  state: () => ({
    estructura: null,
  }),
  actions: {
    setEstructura(data) {
      this.estructura = data;
    },
    limpiarEstructura() {
      this.estructura = null;
    },
  },
});
