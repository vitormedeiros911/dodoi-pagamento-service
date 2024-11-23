import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CriarPagamentoDto } from './dto/criar-pagamento.dto';
import { PagamentoService } from './pagamento.service';

@Controller()
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @MessagePattern('criar-intencao-de-pagamento')
  async criarIntencaoDePagamento(data: CriarPagamentoDto) {
    return this.pagamentoService.criarIntencaoDePagamento(data);
  }

  @MessagePattern('buscar-publishable-key')
  async buscaPublishableKey() {
    return this.pagamentoService.buscaPublishableKey();
  }
}
