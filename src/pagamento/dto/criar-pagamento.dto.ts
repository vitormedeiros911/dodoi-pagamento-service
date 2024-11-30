import { IEndereco } from '../../shared/interfaces/endereco.interface';

interface ItemPedidoDto {
  idProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export class CriarPagamentoDto {
  idComprador: string;
  quantia: number;
  emailComprador: string;
  nomeComprador: string;
  itens: ItemPedidoDto[];
  endereco: IEndereco;
  idFarmacia: string;
}
