import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { CartaoModule } from './cartao/cartao.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PagamentoModule,
    ClientProxyModule,
    CartaoModule,
  ],
})
export class AppModule {}
