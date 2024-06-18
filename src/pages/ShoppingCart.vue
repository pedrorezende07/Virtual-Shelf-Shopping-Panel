<template>
  <q-page class="q-pa-md">
    <q-banner class="q-mb-md">
      <div class="text-h5">Seu Carrinho</div>
    </q-banner>
    <div v-if="cartItems.length">
      <q-list bordered padding>
        <q-item v-for="item in cartItems" :key="item.id">
          <q-item-section avatar>
            <q-img
              :src="item.url"
              :alt="item.nome"
              style="width: 50px; height: 50px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.nome }}</q-item-label>
            <q-item-label caption>{{ item.descricao }}</q-item-label>
            <q-item-label caption>Quantidade: {{ item.quantity }}</q-item-label>
            <q-item-label caption>Valor: {{ item.valor }} pontos</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-banner class="q-mt-md">
        <div class="text-subtitle2">Quantidade total: {{ totalQuantity }}</div>
        <div class="text-subtitle2">Valor total: {{ totalValue }} pontos</div>
      </q-banner>
      <q-btn color="negative" @click="clearCart">Limpar Carrinho</q-btn>
      <q-btn color="positive" @click="showPaymentDialog">Gerar Pagamento</q-btn>
    </div>
    <div v-else>
      <q-banner class="q-mt-md">
        <div class="text-subtitle2">Seu carrinho está vazio.</div>
      </q-banner>
    </div>

    <q-dialog v-model="paymentDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirme suas Credenciais</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="email" type="email" label="Email" />
          <q-input v-model="password" type="password" label="Senha" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="paymentDialog = false" />
          <q-btn flat label="Confirmar" @click="processPayment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "ShoppingCart",
  data() {
    return {
      cartItems: [],
      email: "",
      password: "",
      paymentDialog: false,
    };
  },
  computed: {
    totalQuantity() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    totalValue() {
      return this.cartItems.reduce(
        (total, item) => total + item.valor * item.quantity,
        0
      );
    },
  },
  methods: {
    clearCart() {
      this.cartItems = [];
      this.$router.push({ path: "/" });
    },
    showPaymentDialog() {
      this.paymentDialog = true;
    },
    async processPayment() {
      try {
        const pedidoItems = this.cartItems.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantity,
        }));

        const response = await axios.post(
          "http://localhost:8080/api/v1/pedidos/checkout",
          {
            email: this.email,
            senha: this.password,
            totalValue: this.totalValue,
            pedidoItems: pedidoItems,
          }
        );

        if (response.data.message === "Pagamento realizado com sucesso") {
          this.$q.notify({ type: "positive", message: response.data.message });
          this.clearCart();
        } else {
          this.$q.notify({ type: "negative", message: response.data.message });
        }
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        this.$q.notify({
          type: "negative",
          message: "Erro ao processar pagamento!",
        });
      } finally {
        this.paymentDialog = false;
      }
    },
  },
  created() {
    if (this.$route.query.cart) {
      this.cartItems = JSON.parse(this.$route.query.cart);
    }
  },
};
</script>

<style scoped>
.q-img {
  max-width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
