import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { CartaoService } from './cartao.service';

@Controller('cartao')
export class CartaoController {
  constructor(private readonly cartaoService: CartaoService) {}

  @MessagePattern('listar-cartoes')
  async listarCartoes(email: string) {
    return this.cartaoService.listarCartoes(email);
  }

  @EventPattern('delete-cartao')
  async deleteCartao(idCartao: string) {
    await this.cartaoService.deletarCartao(idCartao);
  }
}
