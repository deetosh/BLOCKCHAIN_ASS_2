import { Router } from "express";
import { Blockchain } from "./BlockChain/blockchain";

const router = Router();
const blockchain = new Blockchain(5);

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
