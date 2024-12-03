import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  RmqContext,
} from '@nestjs/microservices';

import { CartaoService } from './cartao.service';

const ackErrors: string[] = ['E11000'];

@Controller('cartao')
export class CartaoController {
  constructor(private readonly cartaoService: CartaoService) {}

  @MessagePattern('listar-cartoes')
  async listarCartoes(email: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.cartaoService.listarCartoes(email);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('delete-cartao')
  async deleteCartao(idCartao: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.cartaoService.deletarCartao(idCartao);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }
}
