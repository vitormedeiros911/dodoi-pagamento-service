import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class CartaoService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  async listarCartoes(email: string) {
    const customer = await this.stripe.customers.list({
      email,
    });

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customer.data[0].id,
      type: 'card',
    });

    const cartoes = paymentMethods.data.map((cartao) => {
      return {
        id: cartao.id,
        last4: cartao.card.last4,
        bandeira: cartao.card.brand,
        validade: `${cartao.card.exp_month}/${cartao.card.exp_year}`,
      };
    });

    return {
      idCliente: customer.data[0].id,
      cartoes,
    };
  }

  async deletarCartao(idCartao: string) {
    await this.stripe.paymentMethods.detach(idCartao);
  }
}
