import { createHash } from "crypto";

export function calculateSHA256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

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

// Interface representing a single block in the blockchain
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

// Construct a raw Bitcoin transaction using inputs and outputs.
export function create_tx(
  inputs: ITransactionInput[],
  outputs: ITransactionOutput[],
  version = 1,
  locktime = 0
): string {
  const parts: string[] = [];
  parts.push(`v:${version}`);
  parts.push(`in:${inputs.length}`);
  for (const inp of inputs) {
    parts.push(`txid:${inp.txid}`);
    parts.push(`idx:${inp.index}`);
    parts.push(`len:${inp.scriptLength}`);
    parts.push(`sig:${inp.scriptSig}`);
    parts.push(`seq:${inp.sequence}`);
  }
  parts.push(`out:${outputs.length}`);
  for (const outp of outputs) {
    parts.push(`val:${outp.value}`);
    parts.push(`len:${outp.scriptLength}`);
    parts.push(`pk:${outp.scriptPubKey}`);
  }
  parts.push(`lock:${locktime}`);

  const raw = parts.join("|");
  const hex = Buffer.from(raw, "utf8").toString("hex");
  return hex;
}

// Hash the tx_hex to get transaction id
export function get_txid(tx_hex: string): string {
  return calculateSHA256(tx_hex);
}

export function buildTransaction(
  inputs: ITransactionInput[],
  outputs: ITransactionOutput[],
  version = 1,
  locktime = 0
): ITransaction {
  const hex = create_tx(inputs, outputs, version, locktime);
  const txid = get_txid(hex);
  return {
    version,
    inputCount: inputs.length,
    inputs,
    outputCount: outputs.length,
    outputs,
    locktime,
    hex,
    txid,
  };
}



export class Block implements IBlock {
  public header: IBlockHeader;
  public hash: string;
  public transactions: ITransaction[];

  // Constructor for the Block class
  constructor(
    index: number, timestamp: number, prevHash: string, merkleRoot: string, transactions: ITransaction[]
  ) {
    this.header = {
      index,
      timestamp,
      prevHash,
      merkleRoot,
      nonce: 0,
    };
    this.transactions = transactions || [];
    this.hash = this.calculateHash();
  }

  // Calculate the hash of the block
  public calculateHash(): string {
    const headerString = `${this.header.index}${this.header.timestamp}${this.header.prevHash}${this.header.merkleRoot}${this.header.nonce}`;
    return calculateSHA256(headerString);
  }

  // Mine the block
  public mineBlock(difficulty: number): void {
    const target = "0".repeat(difficulty); // Create a string with leading zeros
    this.hash = this.calculateHash();
    while (this.hash.substring(0, difficulty) !== target) { // Keep mining until the hash meets the difficulty target
      this.header.nonce += 1; 
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash} (index ${this.header.index}`);   // Log the mined block's hash
  }

  // Convert the block to a JSON representation
  public toJSON(): IBlock {
    return {
      header: this.header,
      hash: this.hash,
      transactions: this.transactions,
    };
  }
}
