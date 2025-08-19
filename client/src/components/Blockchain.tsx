import React from "react";
import Block from "./Block";
import { IBlock } from "../interface/blockchain.interface";
interface BlockchainProps {
  blocks: IBlock[];
  invalidBlockIndex?: number;
}
const Blockchain: React.FC<BlockchainProps> = ({
  blocks,
  invalidBlockIndex,
}) => {
  return (
    <div className="blockchain-container">
      <h2>🔗 Blockchain ({blocks.length} blocks) 🔗</h2>
      <div className="blockchain">
        {blocks.map((block, index) => (
            
          <Block
            key={`block-${block.index}-${block.timestamp}`}
            block={block}
            isInvalid={
              invalidBlockIndex !== undefined && index >= invalidBlockIndex
            }
          />
        // <>hello</>
        ))}
      </div>
    </div>
  );
};
export default Blockchain;
