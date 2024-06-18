<template>
  <q-dialog v-model="localModalOpen" persistent @hide="emitClose">
    <q-card style="width: 600px; max-width: 1000px; height: 500px">
      <q-card-section>
        <div class="text-h6">
          {{ isEditMode ? "Editar Produto" : "Adicionar Novo Produto" }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="saveProduct">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input
                v-model="localProduct.nome"
                label="Nome"
                :rules="nomeRules"
                lazy-rules
                :color="isValid(localProduct.nome, nomeRules) ? 'green' : ''"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localProduct.nome, nomeRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="localProduct.descricao"
                label="Descrição"
                :rules="descricaoRules"
                lazy-rules
                :color="
                  isValid(localProduct.descricao, descricaoRules) ? 'green' : ''
                "
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localProduct.descricao, descricaoRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="localProduct.valor"
                label="Valor"
                type="number"
                :rules="valorRules"
                lazy-rules
                :color="isValid(localProduct.valor, valorRules) ? 'green' : ''"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="isValid(localProduct.valor, valorRules)"
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-input
                v-model="localProduct.estoque.quantProduto"
                label="Quantidade"
                type="number"
                :rules="quantidadeRules"
                lazy-rules
                :color="
                  isValid(localProduct.estoque.quantProduto, quantidadeRules)
                    ? 'green'
                    : ''
                "
              >
                <template v-slot:append>
                  <q-icon
                    v-if="
                      isValid(
                        localProduct.estoque.quantProduto,
                        quantidadeRules
                      )
                    "
                    name="checkbox"
                    color="green"
                  />
                </template>
              </q-input>
              <br />
            </div>
            <div class="col-6">
              <q-select
                v-model="localProduct.categoria.nome"
                :options="categoryOptions"
                label="Categoria"
                :rules="categoriaRules"
                lazy-rules
                :color="
                  isValid(localProduct.categoria, categoriaRules) ? 'green' : ''
                "
              />
              <br />
            </div>
            <div class="col-6">
              <q-select
                v-model="localProduct.subcategoria.nome"
                :options="subcategoryOptions"
                label="Subcategoria"
                :rules="subcategoriaRules"
                lazy-rules
                :color="
                  isValid(localProduct.subcategoria, subcategoriaRules)
                    ? 'green'
                    : ''
                "
              />
              <br />
            </div>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" @click="closeModal" />
              <q-btn color="primary" label="Salvar" @click="saveProduct" />
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
  name: "AddProductDialog",
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
    existingProducts: {
      type: Array,
      required: true,
    },
    product: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      localModalOpen: this.isModalOpen,
      localProduct: {
        nome: "",
        descricao: "",
        valor: "",
        quantProduto: "",
        categoria: "",
        subcategoria: "",
      },
      categoryOptions: [],
      subcategoryOptions: [],
      nomeRules: [
        (val) => !!val || "Nome é obrigatório",
        (val) => val.length <= 100 || "Nome deve ter no máximo 100 caracteres",
        (val) => val.length >= 3 || "Nome deve ter no mínimo 3 caracteres",
      ],
      descricaoRules: [
        (val) => !!val || "Descrição é obrigatória",
        (val) =>
          val.length <= 300 || "Descrição deve ter no máximo 300 caracteres",
      ],
      valorRules: [
        (val) => !!val || "Valor é obrigatório",
        (val) => val > 0 || "Valor deve ser positivo",
      ],
      quantidadeRules: [
        (val) => !!val || "Quantidade é obrigatória",
        (val) => val >= 0 || "Quantidade não pode ser negativa",
      ],
      categoriaRules: [(val) => !!val || "Categoria é obrigatória"],
      subcategoriaRules: [(val) => !!val || "Subcategoria é obrigatória"],
    };
  },
  watch: {
    isModalOpen(val) {
      this.localModalOpen = val;
      if (val && this.product) {
        this.localProduct = { ...this.product };
      } else if (val && !this.product) {
        this.resetLocalProductForm();
      }
    },
  },
  computed: {
    isEditMode() {
      return !!this.product;
    },
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/categorias"
        );
        this.categoryOptions = response.data.map((category) => ({
          label: category.nome,
          value: category.id,
        }));
        const subcategoryResponse = await axios.get(
          "http://localhost:8080/api/v1/subcategorias"
        );
        this.subcategoryOptions = subcategoryResponse.data.map(
          (subcategory) => ({
            label: subcategory.nome,
            value: subcategory.id,
          })
        );
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    },
    isValid(val, rules) {
      for (let rule of rules) {
        if (typeof rule === "function" && rule(val) !== true) {
          return false;
        }
      }
      return true;
    },
    emitClose() {
      this.$emit("close");
    },
    closeModal() {
      this.localModalOpen = false;
      this.emitClose();
    },
    async saveProduct() {
      if (this.isEditMode) {
        // Lógica para editar produto
        try {
          const response = await axios.put(
            `http://localhost:8080/api/v1/produtos/${this.localProduct.id}`,
            this.localProduct
          );
          this.$emit("product-added", response.data); // Emitir evento para recarregar lista de produtos
          this.closeModal();
          this.resetLocalProductForm();

          // Emite evento para o componente pai tratar a notificação
          this.$emit("notification", {
            message: "Produto editado com sucesso!",
            type: "success",
          });
        } catch (error) {
          console.error("Erro ao editar produto:", error);

          // Emite evento para o componente pai tratar a notificação de erro
          this.$emit("notification", {
            message: "Erro ao editar produto: " + error.message,
            type: "error",
          });
        }
      } else {
        // Lógica para adicionar produto
        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/produtos",
            this.localProduct
          );
          this.$emit("product-added", response.data); // Emitir evento para recarregar lista de produtos
          this.closeModal();
          this.resetLocalProductForm();

          // Emite evento para o componente pai tratar a notificação
          this.$emit("notification", {
            message: "Produto adicionado com sucesso!",
            type: "success",
          });
        } catch (error) {
          console.error("Erro ao adicionar produto:", error);

          // Emite evento para o componente pai tratar a notificação de erro
          this.$emit("notification", {
            message: "Erro ao adicionar produto: " + error.message,
            type: "error",
          });
        }
      }
    },
    resetLocalProductForm() {
      this.localProduct = {
        nome: "",
        descricao: "",
        valor: "",
        quantProduto: "",
        categoria: "",
        subcategoria: "",
      };
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados para o seu componente, se necessário */
</style>
