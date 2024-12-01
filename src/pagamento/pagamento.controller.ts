import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

import { CriarPagamentoDto } from './dto/criar-pagamento.dto';
import { PagamentoService } from './pagamento.service';

@Controller()
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @MessagePattern('criar-intencao-de-pagamento')
  async criarIntencaoDePagamento(data: CriarPagamentoDto) {
    return this.pagamentoService.criarIntencaoDePagamento(data);
  }

  @EventPattern('estornar-pagamento')
  async estornarPagamento(idPagamento: string) {
    return this.pagamentoService.estornarPagamento(idPagamento);
  }

  @MessagePattern('buscar-publishable-key')
  buscaPublishableKey() {
    return this.pagamentoService.buscaPublishableKey();
  }
}
