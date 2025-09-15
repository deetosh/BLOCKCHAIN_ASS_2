export interface ITransactionInput {
  txid: string; 
  index: number;
  scriptLength: number;
  scriptSig: string;
  sequence: string;
}

export interface ITransactionOutput {
  value: number;
  scriptLength: number;
  scriptPubKey: string;
}

export interface ITransaction {
  version: number; 
  inputCount: number;
  inputs: ITransactionInput[];
  outputCount: number;
  outputs: ITransactionOutput[];
  locktime: number;
  hex?: string;
  txid?: string;
}

export interface IBlockHeader {
  index: number;
  timestamp: number;
  merkleRoot: string;
  prevHash: string;
  nonce: number;
}

export interface IBlock {
  header: IBlockHeader;
  hash: string;
  transactions: ITransaction[];
}

export interface IBlockchain {
  chain: IBlock[];
  difficulty: number;
}
