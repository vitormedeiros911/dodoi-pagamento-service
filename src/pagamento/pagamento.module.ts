import { Module } from '@nestjs/common';

import { ClientProxyModule } from '../client-proxy/client-proxy.module';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';

@Module({
  imports: [ClientProxyModule],
  controllers: [PagamentoController],
  providers: [PagamentoService],
})
export class PagamentoModule {}
