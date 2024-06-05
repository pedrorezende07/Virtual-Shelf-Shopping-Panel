<template>
  <q-dialog v-model="localModalOpen" persistent @hide="emitClose">
    <q-card style="width: 600px; max-width: 1000px; height: 500px">
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? "Editar Usuário" : "Adicionar Novo Usuário" }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="saveUser">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input
                v-model="localUser.nome"
                label="Nome"
                :rules="nomeRules"
                lazy-rules
                :color="isValid(localUser.nome, nomeRules) ? 'green' : ''"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localUser.nome, nomeRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="localUser.email"
                label="Email"
                :rules="emailRules"
                lazy-rules
                :color="isValid(localUser.email, emailRules) ? 'green' : ''"
                @update:model-value="validateEmail"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localUser.email, emailRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="localUser.cpf"
                label="CPF"
                :rules="cpfRules"
                lazy-rules
                :color="isValid(localUser.cpf, cpfRules) ? 'green' : ''"
                @update:model-value="validateCPF"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localUser.cpf, cpfRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
            </div>
            <br />
            <div class="col-6">
              <q-input
                v-model="localUser.telefone"
                label="Telefone"
                :rules="telefoneRules"
                lazy-rules
                fill-mask
                mask="(##)#####-####"
                :color="
                  isValid(localUser.telefone, telefoneRules) ? 'green' : ''
                "
                @update:model-value="validateTelefone"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localUser.telefone, telefoneRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <p>TODO: selecionar a data nao esta funcionando</p>
            <div class="col-5" style="max-width: 300px">
              <q-input
                v-model="dataNascimentoFormatted"
                label="Data de Nascimento"
                mask="##/##/####"
                :rules="dateRules"
                @input="formatDateInput"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="dataNascimentoInternal"
                        @update:model-value="updateDate"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fechar"
                            color="primary"
                            flat
                            @click="deleteUser"
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-7">
              <q-toggle
                v-model="modalSenha"
                color="green"
                label="Criar senha"
                left-label
              />
              <p v-if="!modalSenha">senha padrao: 123456</p>
              <q-input
                v-if="modalSenha"
                v-model="localUser.senha"
                label="Senha"
                :rules="senhaRules"
                lazy-rules
                :color="isValid(localUser.senha, senhaRules) ? 'green' : ''"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localUser.senha, senhaRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
            </div>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" @click="closeModal" />
              <q-btn color="primary" label="Salvar" @click="saveUser" />
            </q-card-actions>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "AddUserDialog",
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
    existingUsers: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dataNascimentoFormatted: "",
      dataNascimentoInternal: "",
      localModalOpen: this.isModalOpen,
      modalSenha: false,
      localUser: {
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        senha: "123456",
      },
      nomeRules: [
        (val) => !!val || "Nome é obrigatório",
        (val) => val.length <= 100 || "Nome deve ter no máximo 100 caracteres",
        (val) => val.length >= 3 || "Nome deve ter no mínimo 3 caracteres",
      ],
      emailRules: [
        (val) => !!val || "Email é obrigatório",
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Email inválido",
      ],
      cpfRules: [
        (val) => !!val || "CPF é obrigatório",
        (val) =>
          /^\d{11}$/.test(val) ||
          "CPF deve conter 11 dígitos sem pontos ou traços",
      ],
      telefoneRules: [
        (val) => !!val || "Telefone é obrigatório",
        (val) =>
          /^\(\d{2}\)\d{5}-\d{4}$/.test(val) ||
          "Telefone deve estar no formato (DD)00000-0000",
      ],
      dateRules: [
        (val) => !!val || "Data de aniversário é obrigatória",
        (val) =>
          /^\d{2}\/\d{2}\/\d{4}$/.test(val) ||
          "Data deve estar no formato DD/MM/YYYY",
      ],
      senhaRules: [
        (val) => !!val || "Senha é obrigatória",
        (val) => val.length >= 6 || "Senha deve ter no mínimo 6 caracteres",
      ],
      cpfDuplicateRule: () => false || "CPF já cadastrado",
      emailDuplicateRule: () => false || "Email já cadastrado",
      telefoneDuplicateRule: () => false || "Telefone já cadastrado",
    };
  },
  watch: {
    isModalOpen(val) {
      this.localModalOpen = val;
      if (val && this.user) {
        this.localUser = { ...this.user };
        this.dataNascimentoFormatted = this.formatDateToBR(
          this.localUser.dataNascimento
        );
        this.dataNascimentoInternal = this.localUser.dataNascimento;
      } else if (val && !this.user) {
        this.resetLocalUserForm();
      }
    },
    dataNascimentoFormatted(newVal) {
      this.localUser.dataNascimento = this.formatDateToISO(newVal);
    },
    modalSenha(val) {
      if (!val) {
        this.localUser.senha = "123456";
      } else {
        this.localUser.senha = "";
      }
    },
  },
  computed: {
    isEditMode() {
      return !!this.user;
    },
  },
  methods: {
    isValid(val, rules) {
      for (let rule of rules) {
        if (typeof rule === "function" && rule(val) !== true) {
          return false;
        }
      }
      return true;
    },
    validateCPF(value) {
      const exists = this.existingUsers.some((user) => user.cpf === value);
      if (exists) {
        this.cpfRules = [
          ...this.cpfRules.filter((rule) => rule !== this.cpfDuplicateRule),
          this.cpfDuplicateRule,
        ];
      } else {
        this.cpfRules = this.cpfRules.filter(
          (rule) => rule !== this.cpfDuplicateRule
        );
      }
      this.localUser.cpf = value;
    },
    validateEmail(value) {
      const exists = this.existingUsers.some((user) => user.email === value);
      if (exists) {
        this.emailRules = [
          ...this.emailRules.filter((rule) => rule !== this.emailDuplicateRule),
          this.emailDuplicateRule,
        ];
      } else {
        this.emailRules = this.emailRules.filter(
          (rule) => rule !== this.emailDuplicateRule
        );
      }
      this.localUser.email = value;
    },
    validateTelefone(value) {
      const exists = this.existingUsers.some((user) => user.telefone === value);
      if (exists) {
        this.telefoneRules = [
          ...this.telefoneRules.filter(
            (rule) => rule !== this.telefoneDuplicateRule
          ),
          this.telefoneDuplicateRule,
        ];
      } else {
        this.telefoneRules = this.telefoneRules.filter(
          (rule) => rule !== this.telefoneDuplicateRule
        );
      }
      this.localUser.telefone = value;
    },
    emitClose() {
      this.$emit("close");
    },
    closeModal() {
      this.localModalOpen = false;
      this.emitClose();
    },
    async saveUser() {
      if (this.isEditMode) {
        // Lógica para editar usuário
        try {
          const response = await axios.put(
            `http://localhost:8080/api/v1/usuarios/${this.localUser.id}`,
            this.localUser
          );
          this.$emit("user-added", response.data); // Emitir evento para recarregar lista de usuários
          this.closeModal();
          this.resetLocalUserForm();

          // Emite evento para o componente pai tratar a notificação
          this.$emit("notification", {
            message: "Usuário editado com sucesso!",
            type: "success",
          });
        } catch (error) {
          console.error("Erro ao editar usuário:", error);

          // Emite evento para o componente pai tratar a notificação de erro
          this.$emit("notification", {
            message: "Erro ao editar usuário: " + error.message,
            type: "error",
          });
        }
      } else {
        // Lógica para adicionar usuário
        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/usuarios",
            this.localUser
          );
          this.$emit("user-added", response.data); // Emitir evento para recarregar lista de usuários
          this.closeModal();
          this.resetLocalUserForm();

          // Emite evento para o componente pai tratar a notificação
          this.$emit("notification", {
            message: "Usuário adicionado com sucesso!",
            type: "success",
          });
        } catch (error) {
          console.error("Erro ao adicionar usuário:", error);

          // Emite evento para o componente pai tratar a notificação de erro
          this.$emit("notification", {
            message: "Erro ao adicionar usuário: " + error.message,
            type: "error",
          });
        }
      }
    },
    resetLocalUserForm() {
      this.localUser = {
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        senha: "123456",
      };
      this.dataNascimentoFormatted = "";
    },
    formatDateToBR(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    formatDateToISO(date) {
      if (!date) return "";
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    },
    formatDateInput(val) {
      this.dataNascimentoInternal = this.formatDateToISO(val);
    },
    updateDate(val) {
      this.dataNascimentoInternal = val;
      this.dataNascimentoFormatted = this.formatDateToBR(val);
      this.localUser.dataNascimento = val;
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados para o seu componente, se necessário */
</style>
