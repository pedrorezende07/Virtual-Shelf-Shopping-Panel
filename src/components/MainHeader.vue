<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat round icon="menu" @click="toggleDrawer"></q-btn>
      <q-toolbar-title>Virtual Shelf Shopping</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: "MainHeader",
  data() {
    return {};
  },
  methods: {
    toggleDrawer() {
      this.$emit("toggle-drawer");
    },
  },
};
</script>

<style scoped></style>
