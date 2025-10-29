import { ref, computed } from 'vue';

const user = ref({});
const permisos = ref([]);

// Función para buscar acciones de forma recursiva
function findActionFlat(permisosList, accion) {
  return permisosList.find(opt =>
    opt.Nombre === accion ||
    (opt.Opciones && opt.Opciones.length && findActionFlat(opt.Opciones, accion))
  );
}

export function useUserService() {
  function updateUser(dataUser) {
    user.value = dataUser;
  }

  function updatePermisos(data) {
    console.log("updatePermisos:", data);
    permisos.value = data;
  }

  function getCodigo() {
    const userService = user.value?.userService;
    return userService?.Codigo || userService?.documento || '';
  }

  function getDocumento() {
    return user.value?.userService?.documento || '';
  }

  function findAction(accion) {
    return findActionFlat(permisos.value, accion);
  }

  return {
    user,
    permisos,
    user$: computed(() => user.value),
    permisos$: computed(() => permisos.value),
    updateUser,
    updatePermisos,
    getCodigo,
    getDocumento,
    findAction
  };
}
