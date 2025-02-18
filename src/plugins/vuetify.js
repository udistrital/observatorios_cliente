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
          primary: '#6667AB', 
          secondary: '#424242', 
          accent: '#4D4F86', 
          hard:'#ff0000',
          error: '#FF5252', 
          info: '#2196F3', 
          success: '#4CAF50', 
          warning: '#FFC107',  
          light:'#E8ECF7',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3', 
          secondary: '#424242', 
          accent: '#FF4081', 
          error: '#FF5252', 
          info: '#2196F3', 
          success: '#4CAF50', 
          warning: '#FB8C00', 
        },
      },
    },
  },
})