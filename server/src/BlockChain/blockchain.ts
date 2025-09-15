import { Block, IBlock, ITransaction } from "./block.interface";
import { computeMerkleRoot } from "./merkelTree";

// Interface representing the entire blockchain
export interface IBlockchain {
  chain: IBlock[];
  difficulty: number;
}

const COINBASE_REWARD_SATOSHIS = 50 * 100000000;

export class Blockchain implements IBlockchain {
  public chain: Block[];
  public difficulty: number;

  // Create the genesis block
  private createGenesisBlock(): Block {
    const merkleRoot = computeMerkleRoot([]);
    const genesisBlock = new Block(0, Date.now(), "0", merkleRoot,[]);
    console.log("Mining genesis block...");
    genesisBlock.mineBlock(this.difficulty);
    return genesisBlock;
  }

  constructor(difficulty: number) {
    this.difficulty = difficulty;
    this.chain = [this.createGenesisBlock()];
  }

  // Get the latest block in the blockchain
  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  // Add a new block to the blockchain
  public addBlock(transactions: ITransaction[]): Block {
    const latestBlock = this.getLatestBlock();
    const coinbaseTx: ITransaction = {
      version: 1,
      inputCount: 1,
      inputs: [
        {
          txid: "0000000000000000000000000000000000000000000000000000000000000000",
          index: 0,
          scriptLength: 0,
          scriptSig: "",
          sequence: "ffffffff",
        },
      ],
      outputCount: 1,
      outputs: [
        {
          value: COINBASE_REWARD_SATOSHIS,
          scriptLength: 0,
          scriptPubKey: "OP_RETURN miner reward",
        },
      ],
      locktime: 0,
      hex: "coinbase",
      txid: "0000000000000000000000000000000000000000000000000000000000000000",
    };

    const allTxs = [...transactions,coinbaseTx];
    const txids = allTxs.map((t) => t.txid || "");
    const merkleRoot = computeMerkleRoot(txids);

    const newBlock = new Block(
      latestBlock.header.index + 1,
      Date.now(),
      latestBlock.hash,
      merkleRoot,
      allTxs
    );

    console.log(`Mining block ${newBlock.header.index}...`);
    newBlock.mineBlock(this.difficulty); // Mine the block
    this.chain.push(newBlock); // Add the new block to the chain

    return newBlock;
  }

  // Validate the uploaded chain 
  public validateUploadedChain(chainData: IBlock[]): {
    isValid: boolean;
    invalidBlockIndex?: number;
  } {
    if (chainData.length === 0) {
      return { isValid: false };
    }

    // Recreate blockchain from uploaded data
    const uploadedChain = chainData.map((blockData) => {
      const block = new Block(
        blockData.header.index,
        blockData.header.timestamp,
        blockData.header.prevHash,
        blockData.header.merkleRoot,
        blockData.transactions
      );
      block.hash = blockData.hash;
      block.header.nonce = blockData.header.nonce;
      return block;
    });

    // Validate the uploaded chain
    for (let i = 1; i < uploadedChain.length; i++) {
      const currentBlock = uploadedChain[i];
      const prevBlock = uploadedChain[i - 1];

      // Recompute merkle root from transactions
      const txids = (currentBlock.transactions || []).map((t) => t.txid || "");
      const recomputedRoot = computeMerkleRoot(txids);
      if (recomputedRoot !== currentBlock.header.merkleRoot) {
        return { isValid: false, invalidBlockIndex: i };
      }

      // Check if current block's hash is valid
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return { isValid: false, invalidBlockIndex: i };
      }

      // Check if it properly links to previous block
      if (currentBlock.header.prevHash !== prevBlock.hash) {
        return { isValid: false, invalidBlockIndex: i };
      }

      // Check the POW
      const target = "0".repeat(Math.max(0, this.difficulty));
      if (currentBlock.hash.substring(0, this.difficulty) !== target) {
        return { isValid: false, invalidBlockIndex: i };
      }
    }

    return { isValid: true };
  }

  // Convert the blockchain to a JSON representation
  public toJSON(): IBlockchain {
    return {
      chain: this.chain.map((block) => block.toJSON()),
      difficulty: this.difficulty,
    };
  }
}
