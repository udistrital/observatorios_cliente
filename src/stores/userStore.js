import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null, 
  }),

  actions: {
    setUser(userData) {
      this.user = userData;
    },

    clearUser() {
      this.user = null;
    },
  },

});
