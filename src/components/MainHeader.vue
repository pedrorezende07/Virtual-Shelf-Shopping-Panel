<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat round icon="menu" @click="toggleDrawer"></q-btn>
      <q-toolbar-title> Virtual Shelf Shopping </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: "MainHeader",
  methods: {
    toggleDrawer() {
      this.$emit("toggle-drawer");
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados para o seu header, se necessário */
</style>
