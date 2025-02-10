import { createVuetify } from 'vuetify'
import { mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Importa los estilos de Material Design Icons

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Asegura que mdi está configurado como el set por defecto
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light', // Tema por defecto (light o dark)
    themes: {
      light: {
        colors: {
          primary: '#6667AB', // Azul
          secondary: '#424242', // Gris
          accent: '#82B1FF', // Azul claro
          hard:'#ff0000',
          error: '#FF5252', // Rojo
          info: '#2196F3', // Azul claro
          success: '#4CAF50', // Verde
          warning: '#FFC107', // Amarillo
        },
      },
      dark: {
        colors: {
          primary: '#2196F3', // Azul
          secondary: '#424242', // Gris
          accent: '#FF4081', // Rosa
          error: '#FF5252', // Rojo
          info: '#2196F3', // Azul claro
          success: '#4CAF50', // Verde
          warning: '#FB8C00', // Naranja
        },
      },
    },
  },
})