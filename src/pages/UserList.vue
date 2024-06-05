<template>
  <div class="q-pa-md">
    <h3>Controle de Usuários</h3>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-10">
        <q-input filled v-model="search" label="Filtrar usuários" />
      </div>
      <div class="col-2">
        <q-btn
          color="primary"
          label="Adicionar Usuário"
          @click="openAddUserModal"
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
              @click="openEditUserModal(user)"
            />
          </td>
          <td>
            <q-btn
              color="green"
              icon="wallet"
              text-color="white"
              label="Gerenciamento de Pontos"
              @click="openWalletControlModal(user)"
            />
          </td>
          <td>
            <q-btn
              color="negative"
              icon="personremove"
              text-color="white"
              label="Excluir"
              @click="deleteUser(user)"
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
      :user="selectedUser"
      @close="closeModal"
      @user-added="userAdded"
      @notification="handleNotification"
      :existing-users="users"
    />
    <WalletControl
      :is-modal-open="isWalletControlModalOpen"
      :user="selectedUser"
      @close="closeModal"
    />
  </div>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md q-gutter-sm"></div>
  </div>
</template>

<script>
import axios from "axios";
import AddUserDialog from "../components/AddUserModal.vue";
import WalletControl from "../components/WalletControlModal.vue";

export default {
  name: "UserList",
  components: {
    AddUserDialog,
    WalletControl,
  },
  data() {
    return {
      users: [],
      search: "",
      loading: true,
      isWalletControlModalOpen: false,
      isModalOpen: false,
      selectedUser: null,
      currentPage: 1,
      itemsPerPage: 15,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async deleteUser(user) {
      this.$q
        .dialog({
          title: "Confirmar Exclusão",
          message: `Tem certeza de que deseja excluir o usuário ${user.nome}?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            await axios.delete(
              `http://localhost:8080/api/v1/usuarios/${user.id}`
            );
            this.$q.notify({
              color: "green-4",
              position: "top",
              textColor: "white",
              icon: "cloud_done",
              message: "Usuário excluído com sucesso!",
            });
            this.fetchUsers();
          } catch (error) {
            this.$q.notify({
              color: "red-5",
              position: "top",
              textColor: "white",
              icon: "error",
              message: "Erro ao excluir usuário: " + error.message,
            });
          }
        });
    },
    async fetchUsers() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/usuarios"
        );
        this.users = response.data;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    openAddUserModal() {
      this.selectedUser = null;
      this.isModalOpen = true;
    },
    openEditUserModal(user) {
      this.selectedUser = { ...user };
      this.isModalOpen = true;
    },
    openWalletControlModal(user) {
      this.selectedUser = user;
      this.isWalletControlModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.isWalletControlModalOpen = false;
      this.fetchUsers();
    },
    async userAdded(newUser) {
      await this.fetchUsers(); // Recarrega a lista de usuários
      this.closeModal(); // Fecha o modal após adicionar o usuário
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
