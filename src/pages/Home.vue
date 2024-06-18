<template>
  <q-page class="q-pa-md">
    <q-toolbar class="q-mb-md">
      <q-banner class="q-mr-auto">
        <div class="text-h5">Bem-vindo! O que deseja hoje?</div>
      </q-banner>
      <q-btn
        @click="showCart"
        label="Ver Carrinho"
        color="primary"
        icon="shopping_cart"
        v-ripple
      >
        <q-badge v-if="cartItemCount > 0" color="red" floating>{{
          cartItemCount
        }}</q-badge>
      </q-btn>
    </q-toolbar>

    <q-dialog v-model="cartModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Seu Carrinho</div>
        </q-card-section>
        <q-card-section>
          <q-list v-if="cartProducts.length" bordered>
            <q-item v-for="product in cartProducts" :key="product.id">
              <q-item-section avatar>
                <q-img
                  :src="product.url"
                  :alt="product.nome"
                  style="width: 50px; height: 50px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ product.nome }}</q-item-label>
                <q-item-label caption>{{ product.descricao }}</q-item-label>
                <q-item-label caption
                  >Quantidade: {{ product.quantity }}</q-item-label
                >
                <q-item-label caption
                  >Valor: {{ product.valor }} pontos</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else>
            <q-banner class="q-mt-md">
              <div class="text-subtitle2">Seu carrinho está vazio.</div>
            </q-banner>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-if="cartProducts.length !== 0"
            flat
            label="Ir ao pagamento"
            @click="goToCheckout"
          />
          <q-btn flat label="Fechar" @click="cartModal = false" />
        </q-card-actions>
        <q-card-actions align="right"> </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-gutter-md q-grid">
      <q-card v-for="product in products" :key="product.id" class="my-card">
        <q-img :src="product.url" :alt="product.nome" class="product-img" />
        <q-card-section>
          <div class="text-h6">{{ product.nome }}</div>
          <div class="text-subtitle2 description">{{ product.descricao }}</div>
          <div class="text-h6">Valor: {{ product.valor }} pontos</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            flat
            round
            dense
            icon="remove"
            @click="decreaseQuantity(product)"
            :disable="product.quantity === 0"
          />
          <q-input
            v-model="product.quantity"
            type="number"
            dense
            borderless
            readonly
            style="width: 50px; text-align: center"
          />
          <q-btn
            flat
            round
            dense
            icon="add"
            @click="increaseQuantity(product)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "InitialHome",
  data() {
    return {
      products: [],
      loading: true,
      cartModal: false,
    };
  },
  computed: {
    cartProducts() {
      return this.products.filter((product) => product.quantity > 0);
    },
    cartItemCount() {
      return this.products.reduce(
        (total, product) => total + product.quantity,
        0
      );
    },
  },
  methods: {
    goToCheckout() {
      const cartItems = this.cartProducts.map((product) => ({
        id: product.id,
        nome: product.nome,
        descricao: product.descricao,
        valor: product.valor,
        quantity: product.quantity,
        url: product.url,
      }));
      this.$router.push({
        name: "ShoppingCart",
        query: { cart: JSON.stringify(cartItems) },
      });
    },
    async fetchProducts() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/produtos"
        );
        this.products = response.data.map((product) => ({
          ...product,
          quantity: 0,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },
    decreaseQuantity(product) {
      if (product.quantity > 0) {
        product.quantity -= 1;
      }
    },
    increaseQuantity(product) {
      product.quantity += 1;
    },
    showCart() {
      this.cartModal = true;
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.product-img {
  max-width: 100%;
  height: 200px;
  object-fit: cover;
}
.q-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.my-card {
  flex: 1 1 calc(25% - 16px);
  margin: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.2s ease;
}
.my-card:hover {
  transform: scale(1.02);
}
.description {
  height: 105px; /* altura fixa para a descrição */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
