import React from "react";
import { ITransaction } from "../interface/blockchain.interface";

interface Props {
  transactions: ITransaction[];
  onClose: () => void;
}

const TransactionsDialog: React.FC<Props> = ({ transactions, onClose }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <div style={{flex:1,textAlign:"center"}}>Transactions ({transactions.length})</div>
          <button style={{width: "fit-content"}} onClick={onClose} className="close-btn">✖</button>
        </div>

        {transactions.map((tx, idx) => (
          <div key={tx.txid || idx} className="transaction-card">
            <h3>Tx #{idx + 1} {tx.txid?.substring(0, 12)}...</h3>
            <div className="tx-columns">
              {/* Inputs */}
              <div className="tx-col inputs">
                <h4>Inputs</h4>
                {tx.inputs.length === 0 && <p>No inputs (Coinbase)</p>}
                {tx.inputs.map((inp, i) => (
                  <div key={i} className="tx-item">
                    <p><strong>TxID:</strong> {inp.txid.substring(0, 20)}...</p>
                    <p><strong>Index:</strong> {inp.index}</p>
                    <p><strong>Seq:</strong> {inp.sequence}</p>
                  </div>
                ))}
              </div>

              {/* Outputs */}
              <div className="tx-col outputs">
                <h4>Outputs</h4>
                {tx.outputs.map((out, i) => (
                  <div key={i} className="tx-item">
                    <p><strong>Value:</strong> {out.value} sats</p>
                    {/* <p><strong>Script:</strong> {out.scriptPubKey}</p> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsDialog;
