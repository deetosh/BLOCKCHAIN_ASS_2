import React from "react";
import { IBlock } from "../interface/blockchain.interface";


interface BlockProps {
  block: IBlock;
  isInvalid?: boolean;
}
const Block: React.FC<BlockProps> = ({ block, isInvalid = false }) => {
  // formatting the timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  // showing only the first 24 characters of the hash
  const truncateHash = (hash: string, length: number = 24) => {
    return hash.length > length ? `${hash.substring(0, length)}...` : hash;
  };
  return (
    <div className={`block ${isInvalid ? "invalid" : "valid"}`}>
      <div className="block-header">
        <h3>Block #{block.index}</h3>
        {isInvalid && <span className="invalid-badge">INVALID</span>}
      </div>
      <div className="block-content">
        <div className="block-field">
          <div className="field-title">Timestamp:</div> 
          <div className="field-body"> {formatTimestamp(block.timestamp)} </div>
        </div>
        <div className="block-field">
          <div className="field-title">Previous Hash:</div>
          <div className="field-body hash">
            {truncateHash(block.prevHash)}
          </div>
        </div>
        <div className="block-field">
          <div className="field-title">Hash:</div>
          <div className="field-body hash">
            {truncateHash(block.hash)}
          </div>
        </div>
        <div className="block-field">
          <div className="field-title">Data:</div> 
          <div className="field-body">{block.data}</div>
        </div>
        <div className="block-field">
          <div className="field-title">Nonce:</div>
           <div className="field-body">{block.nonce}</div>
        </div>
      </div>
    </div>
  );
};
export default Block;
