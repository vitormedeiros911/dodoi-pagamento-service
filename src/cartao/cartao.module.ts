import { Module } from '@nestjs/common';
import { CartaoController } from './cartao.controller';
import { CartaoService } from './cartao.service';

@Module({
  controllers: [CartaoController],
  providers: [CartaoService],
})
export class CartaoModule {}
