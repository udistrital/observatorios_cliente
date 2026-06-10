export const environment = {
  production: true,
  autenticacion: true,
  notificaciones: false,
  menuApps: false,
  appname: 'observatorios',
  appMenu: 'Observatorios',
  ASSETS_SERVICE: "https://assets.portaloas.udistrital.edu.co/",
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'PDpmPDMZfxv_xLxiZXyPr1s1Rk4a',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email',
    REDIRECT_URL: 'https://atlas.portaloas.udistrital.edu.co',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'https://atlas.portaloas.udistrital.edu.co',
    AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
  },
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  // MAIN_BACKEND: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/observatorio_crud/v1',
  MAIN_BACKEND: 'https://api.intranetoas.udistrital.edu.co/observatorios_crud/api/v1/',
  GESTOR_DOCUMENTAL: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1/'
};
