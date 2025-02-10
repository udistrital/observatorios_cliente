<template>
  <div class="main-footer footer">
    <v-container  fluid>
      <v-row align="center" class="justify-space-between">
        <div class="footer__logo">
          <figure class="footer__logo-image">
            <img src="../assets/img/logo-ud.png" alt="Logo" />
          </figure>
          <div class="footer__logo-text">
            <p class="footer__logo-subtitle">
              Oficina Asesora de Tecnologías e Información
            </p>
          </div>
        </div>

        <div class="footer__info" >
            <div class="footer__info-item" v-for="(item, index) in contactInfo" :key="index">
              <div>
                <v-icon color="primary" class="footer__info-icon">{{ item.icon }}</v-icon>
              </div>
              <div>
                <v-list-item-title class="">{{
                  item.text
                }}</v-list-item-title>
              </div>
            </div>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contactInfo: [
        { icon: "mdi-phone", text: "+57 XXXXXXXXXX" },
        { icon: "mdi-map-marker", text: "Bogotá" },
        { icon: "mdi-clock", text: "8:00 AM - 6:00 PM" },
        { icon: "mdi-web", text: "www.xxxxxxxx.com" },
        { icon: "mdi-email", text: "contacto@xxxxxx.com" },
      ],
    };
  },
};
</script>

<style scoped>

.footer {
  max-height: 64px;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.1);
}

.footer__logo-image img {
  height: 50px;
  object-fit: cover;
}
.footer__logo {
  display: flex;
  align-items: center;
}
.footer__logo-text {
  margin: 0 15px;
  width: 170px;
  height: 44px;
  padding-left: 15px;
  display: flex;
  align-items: center;
  border-left: 1px solid gray;
}

.footer__logo-subtitle {
  font-size: 13px;
  text-align: center;
  line-height: 1;
}
.footer__info{
  display: flex;
}
.footer__info-item{
  display: flex;
  margin: 0 10px;
}
.footer__info-icon{
  margin: 0 5px;
}
</style>