import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CriarPagamentoDto } from './dto/criar-pagamento.dto';
import { PagamentoService } from './pagamento.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @MessagePattern('criar-intencao-de-pagamento')
  async criarIntencaoDePagamento(
    @Payload() data: CriarPagamentoDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.pagamentoService.criarIntencaoDePagamento(data);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('estornar-pagamento')
  async estornarPagamento(
    @Payload() idPagamento: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.pagamentoService.estornarPagamento(idPagamento);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-publishable-key')
  buscaPublishableKey() {
    return this.pagamentoService.buscaPublishableKey();
  }
}
