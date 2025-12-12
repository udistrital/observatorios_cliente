export const environment = {
  production: false,
  entorno: 'test',
  autenticacion: true,
  notificaciones: false,
  menuApps: false,
  appname: 'observatorios',
  appMenu: 'Observatorios',
  ASSETS_SERVICE: "https://assets.portaloas.udistrital.edu.co/",
  NOTIFICACION_MID: "https://pruebasapi.intranetoas.udistrital.edu.co:8527/v1/",
  NOTIFICACION_MID_WS: "wss://pruebasapi.intranetoas.udistrital.edu.co:8527/v1/ws",
  NOTIFICACIONES_CRUD: "https://autenticacion.portaloas.udistrital.edu.co/apioas/notificaciones_crud/",
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    //CLIENTE_ID: 'G80k5fLBp9FJ3fDh9zN2IKrXwgYa',
    CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a', //local
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email',
    REDIRECT_URL: 'http://localhost:4200/', //local
    //REDIRECT_URL: 'https://pruebasobservatorios.portaloas.udistrital.edu.co',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    //SIGN_OUT_REDIRECT_URL: 'https://pruebasobservatorios.portaloas.udistrital.edu.co',
    SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/', //local
    AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
  },
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  NOTIFICACION_MID: "https://pruebasapi.intranetoas.udistrital.edu.co:8527/v1/",
  NOTIFICACION_MID_WS: "wss://pruebasapi.intranetoas.udistrital.edu.co:8527/v1/ws",
  NOTIFICACIONES_CRUD: "https://autenticacion.portaloas.udistrital.edu.co/apioas/notificaciones_crud/",
  //MAIN_BACKEND: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/observatorio_crud/v1',
  //MAIN_BACKEND: 'https://pruebasapi.intranetoas.udistrital.edu.co/observatorios_crud/api/v1',
  MAIN_BACKEND: 'http://localhost:8000/api/v1',
  OBSERVATORIOS_MID: 'http://localhost:8086/v1'
};
