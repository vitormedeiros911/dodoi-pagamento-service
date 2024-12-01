import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { CriarPagamentoDto } from './dto/criar-pagamento.dto';

@Injectable()
export class PagamentoService {
  private stripe: Stripe;

  constructor(private readonly clientProxyService: ClientProxyService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  private clientUsuarioBackend =
    this.clientProxyService.getClientProxyUsuarioServiceInstance();

  private clientPedidoBackend =
    this.clientProxyService.getClientProxyPedidoServiceInstance();

  buscaPublishableKey() {
    return {
      key: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }

  async criarIntencaoDePagamento(criarPagamentoDto: CriarPagamentoDto) {
    let customer: Stripe.Customer;

    const customers = await this.stripe.customers.list({
      email: criarPagamentoDto.emailComprador,
    });

    if (customers.data.length > 0) customer = customers.data[0];
    else
      customer = await this.criarCustomer(
        {
          email: criarPagamentoDto.emailComprador,
          name: criarPagamentoDto.nomeComprador,
        },
        criarPagamentoDto.idComprador,
      );

    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2020-08-27' },
    );
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: criarPagamentoDto.quantia,
      currency: 'brl',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (paymentIntent)
      this.clientPedidoBackend.emit('criar-pedido', {
        idComprador: criarPagamentoDto.idComprador,
        itens: criarPagamentoDto.itens,
        total: criarPagamentoDto.quantia,
        idPagamento: paymentIntent.id,
        idFarmacia: criarPagamentoDto.idFarmacia,
      });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };
  }

  async criarCustomer(
    customer: Stripe.CustomerCreateParams,
    idComprador: string,
  ) {
    const newCustomer = await this.stripe.customers.create(customer);

    this.clientUsuarioBackend.emit('atualizar-usuario', {
      id: idComprador,
      idContaStripe: newCustomer.id,
    });

    return newCustomer;
  }

  async estornarPagamento(idPagamento: string) {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(idPagamento);

    if (paymentIntent.status === 'succeeded') {
      await this.stripe.refunds.create({
        payment_intent: idPagamento,
      });
    }
  }
}
