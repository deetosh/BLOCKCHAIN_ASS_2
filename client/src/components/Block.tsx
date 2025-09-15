import React, { useState } from "react";
import { IBlock } from "../interface/blockchain.interface";
import TransactionsDialog from "./TransactionDialog";


interface BlockProps {
  block: IBlock;
  isInvalid?: boolean;
}
const Block: React.FC<BlockProps> = ({ block, isInvalid = false }) => {
  const [showTx, setShowTx] = useState(false);
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
        <h3>Block #{block.header.index}</h3>
        {isInvalid && <span className="invalid-badge">INVALID</span>}
      </div>
      <div className="block-content">
        <div className="block-field">
          <div className="field-title">Timestamp:</div> 
          <div className="field-body"> {formatTimestamp(block.header.timestamp)} </div>
        </div>
        <div className="block-field">
          <div className="field-title">Previous Hash:</div>
          <div className="field-body hash">
            {truncateHash(block.header.prevHash)}
          </div>
        </div>
        <div className="block-field">
          <div className="field-title">Hash:</div>
          <div className="field-body hash">
            {truncateHash(block.hash)}
          </div>
        </div>
        <div className="block-field">
          <div className="field-title">Merkle Root:</div>
          <div className="field-body hash">{truncateHash(block.header.merkleRoot)}</div>
        </div>
        <div className="block-field">
          <div className="field-title">Nonce:</div>
           <div className="field-body">{block.header.nonce}</div>
        </div>
        <div className="block-field">
          <div className="field-title">Transactions:</div>
          <div className="field-body">{block.transactions.length}</div>
        </div>
        <button
          className="view-tx-btn"
          onClick={() => setShowTx(true)}
          style={{ marginLeft: "10px" }}
        >
          View Transactions
        </button>
      </div>
      {showTx && (
        <TransactionsDialog
          transactions={block.transactions}
          onClose={() => setShowTx(false)}
        />
      )}
    </div>

    
  );
};
export default Block;
