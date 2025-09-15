import { Router } from "express";
import { Blockchain } from "./BlockChain/blockchain";
import { buildTransaction } from "./BlockChain/block.interface";

const router = Router();
const blockchain = new Blockchain(5);


function buildExampleTransactions() {
  const txs = [];

  // Alice had previously received 1 BTC in a UTXO (given txid)
  const alicePrevTxid = "48437ddb190b006f858cdd881284ad467d68bfc4c74f3e6f621eb5af33be88d8";

  // 1) Alice pays Bob (0.3 BTC), change back to Alice minus fee 10,000 sat
  const satoshis = (btc: number) => Math.floor(btc * 100000000);

  const aliceInputs = [
    {
      txid: alicePrevTxid,
      index: 0,
      scriptLength: 0,
      scriptSig: "", // empty as described in assignment
      sequence: "ffffffff",
    },
  ];

  const aliceOutputs = [
    // To Bob: 0.3 BTC
    {
      value: satoshis(0.3),
      scriptLength: 0,
      scriptPubKey: "", // kept empty as not described in problem statement
      // may also use P2PKH script like (OP_DUP OP_HASH160 BobPubKey OP_EQUALVERIFY OP_CHECKSIG)
    },
    // Change back to Alice: 0.7 BTC minus fee 10,000 sat -> 0.7BTC = 70,000,000 sat, minus fee later accounted for by outputs
    {
      value: satoshis(0.7) - 10000, // subtract fee from change
      scriptLength: 0,
      scriptPubKey: "",
    },
  ];

  txs.push(buildTransaction(aliceInputs, aliceOutputs));

  // 2) X pays Y 0.05 BTC with transaction fee of 5000 satoshis
  txs.push(
    buildTransaction(
      [
        { txid: "a1".repeat(32), index: 0, scriptLength: 0, scriptSig: "", sequence: "ffffffff" },
      ],
      [
        { value: satoshis(0.05), scriptLength: 0, scriptPubKey: "" },
        { value: satoshis(0.95) - 5000, scriptLength: 0, scriptPubKey: "" },
      ]
    )
  );

  // 3) X pays Y 0.0001 BTC (no transaction fee)
  txs.push(
    buildTransaction(
      [{ txid: "b2".repeat(32), index: 1, scriptLength: 0, scriptSig: "", sequence: "ffffffff" }],
      [{ value: satoshis(0.0001), scriptLength: 0, scriptPubKey: "" }]
    )
  );

  // 4) a transaction where no actual bitcoin is exchanged
  txs.push(
    buildTransaction(
      [{ txid: "c3".repeat(32), index: 0, scriptLength: 0, scriptSig: "", sequence: "ffffffff" }],
      [{ value: 0, scriptLength: 0, scriptPubKey: "" }]
    )
  );

  // 5) Employer pays 3 employees
  txs.push(
    buildTransaction(
      [{ txid: "d4".repeat(32), index: 2, scriptLength: 0, scriptSig: "", sequence: "ffffffff" }],
      [
        { value: satoshis(0.02), scriptLength: 0, scriptPubKey: "" },
        { value: satoshis(0.01), scriptLength: 0, scriptPubKey: "" },
        { value: satoshis(0.03), scriptLength: 0, scriptPubKey: "" },
      ]
    )
  );

  // 6) a transaction with multiple inputs
  txs.push(
    buildTransaction(
      [{ txid: "e5".repeat(32), index: 0, scriptLength: 0, scriptSig: "", sequence: "ffffffff" },
       { txid: "e6".repeat(32), index: 0, scriptLength: 0, scriptSig: "", sequence: "ffffffff" },
       { txid: "e7".repeat(32), index: 0, scriptLength: 0, scriptSig: "", sequence: "ffffffff" }
      ],
      [{ value: satoshis(0.1), scriptLength: 0, scriptPubKey: "" }]
    )
  );

  return txs;
}




// get the entire blockchain
router.get("/chain", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: blockchain.toJSON(),
      chainLength: blockchain.chain.length,
      message: "Blockchain data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// mine a block
router.post("/mine", (req, res) => {
  try {
    let { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      transactions = buildExampleTransactions();
    }

    const newBlock = blockchain.addBlock(transactions);

    return res.status(200).json({
      error: false,
      block: newBlock.toJSON(),
      message: "Block mined successfully",
      chainLength: blockchain.chain.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to mine block",
    });
  }
});

// Upload and validate a blockchain file
router.post("/upload-validate", (req, res) => {
  try {
    const { chainData } = req.body;

    if (!chainData || !Array.isArray(chainData)) {
      return res.status(400).json({
        success: false,
        error: "Invalid chain data format",
      });
    }

    const validationResult = blockchain.validateUploadedChain(chainData);

    res.json({
      error: false,
      ...validationResult,
      message: validationResult.isValid
        ? "Uploaded blockchain is valid"
        : `Blockchain is invalid starting from block ${validationResult.invalidBlockIndex}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to validate uploaded blockchain",
    });
  }
});

export default router;
