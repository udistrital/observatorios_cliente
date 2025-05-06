import { defineStore } from 'pinia';

export const usePanelStore = defineStore('panelStore', {
  state: () => ({
    panel: null,   
  }),
  actions: {
    setPanel(data) {
      this.panel = data;
    },
    clearPanel() {
      this.panel = null;
    },
  },
  persist: true,
});
