<template>
  <q-dialog v-model="localModalOpen" persistent @hide="emitClose">
    <q-card style="width: 600px; max-width: 1000px; height: 500px">
      <q-card-section>
        <div class="text-h6">Adicionar Novo Usuário</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="adicionarUsuario">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input
                v-model="newUser.nome"
                label="Nome"
                :rules="nomeRules"
                lazy-rules
                :color="isValid(newUser.nome, nomeRules) ? 'green' : ''"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(newUser.nome, nomeRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="newUser.email"
                label="Email"
                :rules="emailRules"
                lazy-rules
                :color="isValid(newUser.email, emailRules) ? 'green' : ''"
                @update:model-value="validateEmail"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(newUser.email, emailRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="newUser.cpf"
                label="CPF"
                :rules="cpfRules"
                lazy-rules
                :color="isValid(newUser.cpf, cpfRules) ? 'green' : ''"
                @update:model-value="validateCPF"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(newUser.cpf, cpfRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
            </div>
            <br />
            <div class="col-6">
              <q-input
                v-model="newUser.telefone"
                label="Telefone"
                :rules="telefoneRules"
                lazy-rules
                fill-mask
                mask="(##)#####-####"
                :color="isValid(newUser.telefone, telefoneRules) ? 'green' : ''"
                @update:model-value="validateTelefone"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(newUser.telefone, telefoneRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            // Corrija a formatacao de tempo
            <div class="col-5" style="max-width: 300px">
              <q-input v-model="date" mask="date" :rules="dateRules">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date minimal v-model="date">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Fechar"
                            color="primary"
                            flat
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
              <q-input
                v-if="modalSenha"
                v-model="newUser.senha"
                label="Senha"
                :rules="senhaRules"
                lazy-rules
                :color="isValid(newUser.senha, senhaRules) ? 'green' : ''"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(newUser.senha, senhaRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
            </div>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" @click="closeModal" />
              <q-btn
                color="primary"
                label="Adicionar"
                @click="adicionarUsuario"
              />
            </q-card-actions>
          </div>
        </q-form>
        {{ newUser }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
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
  },
  data() {
    return {
      localModalOpen: this.isModalOpen,
      modalSenha: false,
      newUser: {
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        senha: "123456",
      },
      formattedDate: "",
      nomeRules: [
        (val) => !!val || "Nome é obrigatório",
        (val) => val.length <= 100 || "Nome deve ter no máximo 100 caracteres",
        (val) => val.length >= 3 || "Nome deve ter no mínimo 3 caracteres",
        //(val) => Validar nome com expressão regular
        //  /^[A-Z][a-z]*([ ]?[A-Z][a-z]*)*$/.test(val) ||
        //  "Nome deve começar com letra maiúscula",
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
          /^\d{2}-\d{2}-\d{4}$/.test(val) ||
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
    },
    "newUser.dataNascimento": function (val) {
      this.formattedDate = this.formatDate(val);
    },
    modalSenha(val) {
      if (!val) {
        this.newUser.senha = "123456";
      } else {
        this.newUser.senha = "";
      }
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
      this.newUser.cpf = value;
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
      this.newUser.email = value;
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
      this.newUser.telefone = value;
    },
    emitClose() {
      this.$emit("close");
    },
    closeModal() {
      this.localModalOpen = false;
      this.emitClose();
    },
    async adicionarUsuario() {
      try {
        console.log("Adicionando usuário...");
        const response = await axios.post(
          "http://localhost:8080/api/v1/usuarios",
          this.newUser
        );
        console.log("Usuário adicionado:", response);
        this.$emit("user-added", response.data);
        this.closeModal();
        this.resetNewUserForm();

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
    },
    resetNewUserForm() {
      this.newUser = {
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        senha: "",
      };
      this.formattedDate = "";
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados para o seu componente, se necessário */
</style>
