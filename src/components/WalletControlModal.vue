<template>
  <q-dialog v-model="localModalOpen" persistent @hide="emitClose">
    <q-card style="width: 650px; max-width: 1000px; height: 600px">
      <q-card-section>
        <div class="text-h4">Controle de Pontos</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-2"><p class="text-h6">Nome:</p></div>
          <div class="col-7">
            <p class="text-h4">{{ localUser.nome }}</p>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-2"><p class="text-h6">CPF:</p></div>
          <div class="col-7">
            <p class="text-h4">{{ localUser.cpf }}</p>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-2"><p class="text-h6">Pontos:</p></div>
          <div class="col-7">
            <p class="text-h4">{{ localUser.carteira.saldo }}</p>
          </div>
        </div>
        <q-separator />
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <h5>Adicionar Pontos</h5>
            <q-input
              v-model="addPoints"
              type="number"
              label="Pontos a adicionar"
              :disable="removePoints != 0"
            />
            <q-btn
              color="positive"
              label="Adicionar"
              icon="add"
              @click="handleAddPoints"
              :disable="removePoints != 0"
              class="q-mt-sm"
            />
          </div>
          <div class="col-6">
            <h5>Remover Pontos</h5>
            <q-input
              v-model="removePoints"
              type="number"
              label="Pontos a remover"
              :disable="addPoints != 0"
            />
            <q-btn
              color="negative"
              label="Remover"
              icon="remove"
              @click="handleRemovePoints"
              :disable="addPoints != 0"
              class="q-mt-sm"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Fechar" color="primary" @click="emitClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "WalletControl",
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      localModalOpen: this.isModalOpen,
      localUser: this.user,
      addPoints: 0,
      removePoints: 0,
    };
  },
  watch: {
    isModalOpen(newVal) {
      this.localModalOpen = newVal;
    },
    user(newVal) {
      this.localUser = newVal;
    },
  },
  methods: {
    emitClose() {
      this.$emit("close");
    },
    handleAddPoints() {
      if (this.addPoints > 0) {
        const novoSaldo = +this.localUser.carteira.saldo + +this.addPoints; //esse + eh para tratar transformacao em numero
        this.$q
          .dialog({
            title: "Confirmar Adição de Pontos",
            message: `Tem certeza de que deseja adicionar ${this.addPoints} aos pontos do usuário ${this.localUser.nome}?\n\nNova pontuação será de ${novoSaldo} pontos.`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            try {
              await axios.put(
                `http://localhost:8080/api/v1/carteiras/${this.localUser.carteira.id}`,
                {
                  id: this.localUser.carteira.id,
                  saldo: novoSaldo,
                }
              );
              this.$q.notify({
                color: "green-4",
                position: "top",
                textColor: "white",
                icon: "cloud_done",
                message: "Pontos adicionados com sucesso!",
              });
              this.closeModal();
            } catch (error) {
              this.$q.notify({
                color: "red-5",
                position: "top",
                textColor: "white",
                icon: "error",
                message: "Erro ao adicionar pontos: " + error.message,
              });
            }
          });
      } else {
        this.$q.notify({
          color: "negative",
          message: "Insira um valor válido para adicionar pontos",
        });
      }
    },
    handleRemovePoints() {
      if (this.removePoints > 0) {
        this.$q
          .dialog({
            title: "Confirmar Remoção de Pontos",
            message: `Tem certeza de que deseja remover ${
              this.removePoints
            } pontos do usuário ${this.localUser.nome}?

            Nova pontuação será de ${
              this.localUser.carteira.saldo - this.removePoints
            } pontos.`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            try {
              await axios.put(
                `http://localhost:8080/api/v1/carteiras/${this.localUser.carteira.id}`,
                {
                  id: this.localUser.carteira.id,
                  saldo: this.localUser.carteira.saldo - this.removePoints,
                }
              );
              this.$q.notify({
                color: "green-4",
                position: "top",
                textColor: "white",
                icon: "cloud_done",
                message: "Pontos removidos com sucesso!",
              });
              this.closeModal();
            } catch (error) {
              this.$q.notify({
                color: "red-5",
                position: "top",
                textColor: "white",
                icon: "error",
                message: "Erro ao remover pontos: " + error.message,
              });
            }
          });
      } else {
        this.$q.notify({
          color: "negative",
          message: "Insira um valor válido para remover pontos",
        });
      }
    },
    closeModal() {
      this.addPoints = 0;
      this.removePoints = 0;
      this.localModalOpen = false;
      this.emitClose();
    },
  },
};
</script>

<style scoped>
.q-mt-sm {
  margin-top: 8px;
}
</style>
