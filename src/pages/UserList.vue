<template>
  <div class="q-pa-md">
    <h3>Usuários</h3>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-10">
        <q-input filled v-model="search" label="Filtrar usuários" />
      </div>
      <div class="col-2">
        <q-btn
          color="primary"
          label="Adicionar Novo Usuário"
          @click="openModal"
        />
      </div>
    </div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">Nome</th>
          <th class="text-left">Email</th>
          <th class="text-left">CPF</th>
          <th class="text-left">Telefone</th>
          <th class="text-left">Saldo</th>
          <th class="text-middle" colspan="3">Ações usuários</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td class="text-left">{{ user.nome }}</td>
          <td class="text-left">{{ user.email }}</td>
          <td class="text-left">{{ user.cpf }}</td>
          <td class="text-left">{{ user.telefone }}</td>
          <td class="text-left">{{ user.carteira.saldo }} pontos</td>
          <td>
            <q-btn
              color="white"
              icon="person"
              text-color="black"
              label="Editar"
            />
          </td>
          <td>
            <q-btn
              color="green"
              icon="add"
              text-color="white"
              label="Adicionar Pontos"
            />
          </td>
          <td>
            <q-btn
              color="negative"
              icon="personremove"
              text-color="white"
              label="Excluir"
            />
          </td>
        </tr>
        <tr v-if="loading">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-pagination
      v-model="currentPage"
      :max="totalPages"
      boundary-numbers
      @update:model-value="onPageChange"
    />

    <AddUserDialog
      :is-modal-open="isModalOpen"
      @close="closeModal"
      @user-added="userAdded"
      @notification="handleNotification"
      :existing-users="users"
    />
  </div>
</template>

<script>
import axios from "axios";
import AddUserDialog from "../components/AddUserModal.vue";

export default {
  name: "UserList",
  components: {
    AddUserDialog,
  },
  data() {
    return {
      users: [],
      search: "",
      loading: true,
      isModalOpen: false,
      currentPage: 1,
      itemsPerPage: 15,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        console.log("Fetching users...");
        const response = await axios.get(
          "http://localhost:8080/api/v1/usuarios"
        );
        console.log("Response:", response);
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.loading = false;
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    userAdded(newUser) {
      this.users.push(newUser);
    },
    onPageChange(page) {
      this.currentPage = page;
    },
    handleNotification({ message, type }) {
      this.$q.notify({
        color: type === "success" ? "green-4" : "red-5",
        position: "top",
        textColor: "white",
        icon: type === "success" ? "cloud_done" : "error",
        message,
      });
    },
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const searchLower = this.search.toLowerCase();
        return (
          user.id.toString().includes(searchLower) ||
          user.nome.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.cpf.toLowerCase().includes(searchLower) ||
          user.telefone.toLowerCase().includes(searchLower)
        );
      });
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
  },
};
</script>
