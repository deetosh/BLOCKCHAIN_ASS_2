import { createHash } from "crypto";

export function calculateSHA256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

// Interface representing a single block in the blockchain
export interface IBlock {
  index: number;
  timestamp: number;
  data: string;
  prevHash: string;
  hash: string;
  nonce: number;
}

export class Block implements IBlock {
  public index: number;
  public timestamp: number;
  public data: string;
  public prevHash: string;
  public hash: string;
  public nonce: number;

  // Constructor for the Block class
  constructor(
    index: number,
    timestamp: number,
    data: string,
    prevHash: string = "0"
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.nonce = 0; // Initialize nonce to 0
    this.hash = this.calculateHash(); // Calculate hash
  }

  // Calculate the hash of the block
  public calculateHash(): string {
    const blockString = `${this.index}${this.timestamp}${this.data}${this.prevHash}${this.nonce}`;
    return calculateSHA256(blockString);
  }

  // Mine the block
  public mineBlock(difficulty: number): void {
    const target = "0".repeat(difficulty); // Create a string with leading zeros
    while (this.hash.substring(0, difficulty) !== target) { // Keep mining until the hash meets the difficulty target
      this.nonce += 1; 
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);   // Log the mined block's hash
  }

  // Convert the block to a JSON representation
  public toJSON(): IBlock {
    return {
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      prevHash: this.prevHash,
      hash: this.hash,
      nonce: this.nonce,
    };
  }
}
