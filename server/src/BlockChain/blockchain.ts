import { Block, IBlock } from "./block.interface";

// Interface representing the entire blockchain
export interface IBlockchain {
  chain: IBlock[];
  difficulty: number;
}

export class Blockchain implements IBlockchain {
  public chain: Block[];
  public difficulty: number;

  // Create the genesis block
  private createGenesisBlock(): Block {
    const genesisBlock = new Block(0, Date.now(), "Genesis Block", "0");
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
  public addBlock(data: string): Block {
    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      latestBlock.index + 1,
      Date.now(),
      data,
      latestBlock.hash
    );

    console.log(`Mining block ${newBlock.index}...`);
    newBlock.mineBlock(this.difficulty); // Mine the block
    this.chain.push(newBlock); // Add the new block to the chain

    return newBlock;
  }

  // Validate the entire blockchain
  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];
      // Verify current block's hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      // Verify connection to previous block
      if (currentBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
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
        blockData.index,
        blockData.timestamp,
        blockData.data,
        blockData.prevHash
      );
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;
      return block;
    });

    // Validate the uploaded chain
    for (let i = 1; i < uploadedChain.length; i++) {
      const currentBlock = uploadedChain[i];
      const prevBlock = uploadedChain[i - 1];

      // Check if current block's hash is valid
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return { isValid: false, invalidBlockIndex: i };
      }

      // Check if it properly links to previous block
      if (currentBlock.prevHash !== prevBlock.hash) {
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
