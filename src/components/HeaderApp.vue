<template>
  <v-app-bar color="white" dense app>
    <!-- <div class="header"> -->
    <div class="header__space"></div>
    <v-spacer />
    <div class="header__logo">
      <figure class="header__logo-image">
        <img src="../assets/img/logo.png" alt="Logo" />
      </figure>
      <div class="header__logo-text">
        <h1 class="header__logo-title">OBSERVATORIOS</h1>
        <p class="header__logo-subtitle">
          Oficina Asesora de Tecnologías e Información
        </p>
      </div>
    </div>
    <v-spacer></v-spacer>
    <div class="header__info">
      <div class="header__info-bell">
        <v-btn
          class="ma-2"
          color="primary"
          icon="mdi-bell"
          variant="text"
        ></v-btn>
      </div>
      <div class="header__info-email">
        <v-icon color="primary" class="mdi mdi-account-circle"></v-icon>
        <span class="header__info-text" color="primary">correo@correo.com</span>
      </div>
    </div>
    <!-- </div> -->
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style scoped>
.header {
  width: 100%;
}
.header__space{
  width: 30vh;
  height: 20px;
}
.header__logo-image img {
  height: 50px;
  object-fit: cover;
}
.header__logo {
  display: flex;
  align-items: center;
}
.header__logo-text {
  margin: 0 15px;
  width: 170px;
}
.header__logo-title {
  font-size: 16px;
  text-align: center;
  width: 100%;
}
.header__logo-subtitle {
  font-size: 12px;
  text-align: center;
  line-height: 1;
}
.header__info {
  width: 35vh;
  display: flex;
  align-items: center;
  padding-right: 10px;
}
/* .header__info-email {

} */
.header__info-text{
  color: var(--color-fuerte);
}
</style>
