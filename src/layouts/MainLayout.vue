<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <MainHeader @toggle-drawer="toggleLeftDrawer"></MainHeader>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/home">
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/users">
          <q-item-section>Users</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <MainFooter></MainFooter>
  </q-layout>
</template>

<script>
import MainHeader from "components/MainHeader.vue";
import MainFooter from "components/MainFooter.vue";

export default {
  name: "MainLayout",
  components: {
    MainHeader,
    MainFooter,
  },
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados para o seu layout, se necessário */
</style>
