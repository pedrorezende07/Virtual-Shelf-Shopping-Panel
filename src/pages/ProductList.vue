<template>
  <div class="q-pa-md">
    <h3>Controle de Produtos</h3>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-7">
        <q-input filled v-model="search" label="Filtrar produtos" />
      </div>
      <div class="col-3">
        <q-select
          filled
          bottom-slots
          v-model="filterCategory"
          :options="categories"
          label="Filtra por categoria"
        >
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="clearFilterCategory"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col-2">
        <q-btn
          color="primary"
          label="Adicionar Produto"
          @click="openAddProductModal"
        />
      </div>
    </div>

    <div class="cards-container">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="my-card-wrapper"
      >
        <q-card class="my-card" flat bordered>
          <div class="card-img-wrapper">
            <q-img :src="product.url" class="card-img" />
          </div>
          <q-card-section>
            <div class="text-overline text-orange-9">
              {{ product.categoria.nome }} / {{ product.subcategoria.nome }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ product.nome }}</div>
            <div class="text-caption text-grey">
              {{ product.descricao }}
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn flat color="primary" label="Editar" />
            <q-space />
            <div class="text-overline text-green-10">
              {{ product.valor }} pontos
            </div>
            <q-space />
            <div class="text-overline text-orange-7">
              Quantidade: {{ product.estoque.quantProduto }}
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductList",
  data() {
    return {
      products: [],
      search: "",
      filterCategory: [],
      categories: [],
      loading: true,
    };
  },
  mounted() {
    this.fetchProducts();
  },
  watch: {
    filterCategory(newVal) {
      // Atualiza o campo de pesquisa com as categorias selecionadas

      this.search = newVal.label;
    },
  },
  methods: {
    clearFilterCategory() {
      this.filterCategory = [];
      this.search = "";
    },
    async fetchProducts() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/produtos"
        );
        this.products = response.data;
        this.categorizandoProdutos();
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    categorizandoProdutos() {
      const categorias = this.products.flatMap((product) => [
        product.categoria.nome,
        product.subcategoria.nome,
      ]);
      const categoriasUnicas = [...new Set(categorias)].filter(Boolean);
      this.categories = categoriasUnicas.map((categoria) => ({
        label: categoria,
      }));
    },
  },
  computed: {
    filteredProducts() {
      const searchLower = (this.search || "").toLowerCase();
      return this.products.filter((product) => {
        return (
          product.id.toString().includes(searchLower) ||
          product.nome.toLowerCase().includes(searchLower) ||
          product.categoria.nome.toLowerCase().includes(searchLower) ||
          product.subcategoria.nome.toLowerCase().includes(searchLower)
        );
      });
    },
  },
};
</script>
<style scoped>
.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.my-card-wrapper {
  width: 300px;
  height: 450px;
}

.my-card {
  width: 100%;
  height: 100%;
}

.card-img-wrapper {
  width: 100%;
  height: 50%; /* Ajuste a altura conforme necessário */
}

.card-img img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
