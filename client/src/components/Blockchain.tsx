import React from "react";
import Block from "./Block";
import { IBlock } from "../interface/blockchain.interface";
interface BlockchainProps {
  blocks: IBlock[];
  invalidBlockIndex?: number;
  isshowingUploaded?: boolean;
  loadOriginalChain: () => void;
}
const Blockchain: React.FC<BlockchainProps> = ({
  blocks,
  invalidBlockIndex,
  isshowingUploaded,
  loadOriginalChain,
}) => {
  return (
    <div className="blockchain-container">
      <h2>🔗 Blockchain ({blocks.length} blocks) 🔗</h2>
      {isshowingUploaded && (
        <div style={{ display: 'flex' ,justifyContent:'center',alignItems:'center',height: 'fit-content',gap:'10px'}}>
          <div className="uploaded-indicator">Uploaded Blockchain</div>
          <button style={{ height: 'fit-content', width: 'fit-content' }} onClick={loadOriginalChain}>Load original chain</button>
        </div>
      )}
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
