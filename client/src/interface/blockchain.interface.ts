export interface IBlock {
  index: number;
  timestamp: number;
  data: string;
  prevHash: string;
  hash: string;
  nonce: number;
}

export interface IBlockchain {
  chain: IBlock[];
  difficulty: number;
}
