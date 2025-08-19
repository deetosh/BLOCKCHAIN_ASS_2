import axios from "axios";
import type { IBlock } from "../interface/blockchain.interface";

const API_BASE_URL = "http://localhost:3000/api/blockchain";

// create the axios instance for calling the blockchain API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class BlockchainAPI {
  // get the entire blockchain
  static async getChain(): Promise<any> {
    const response = await api.get("/chain");
    return response.data;
  }

  // mine a new block
  static async mineBlock(data: string): Promise<any> {
    const response = await api.post("/mine", { data });
    return response.data;
  }

  // upload and validate the blockchain
  static async uploadAndValidateChain(chainData: IBlock[]): Promise<any> {
    const response = await api.post("/upload-validate", {
      chainData,
    });
    return response.data;
  }
}

export default api;
