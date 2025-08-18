import { Router } from "express";
import { Blockchain } from "./BlockChain/blockchain";

const router = Router();
const blockchain = new Blockchain(2);

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
    const { data } = req.body;

    if (!data || typeof data !== "string") {
      return res.status(400).json({
        error: true,
        message: "Data is required and must be a string",
      });
    }

    const newBlock = blockchain.addBlock(data);

    return res.json({
      error: false,
      block: newBlock.toJSON(),
      message: "Block mined successfully",
      chainLength: blockchain.chain.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to mine block"
    });
  }
});

// Validate current blockchain
router.get("/validate", (req, res) => {
  try {
    const isValid = blockchain.isChainValid();

    res.json({
      error: false,
      isValid,
      message: isValid ? "Blockchain is valid" : "Blockchain is invalid",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to validate blockchain",
    });
  }
});

export default router;
