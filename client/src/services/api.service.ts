import axios from "axios";
import type { IBlock } from "../interface/blockchain.interface";

const API_BASE_URL = "http://localhost:3000/api/blockchain";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class BlockchainAPI {
  static async getChain(): Promise<any> {
    const response = await api.get("/chain");
    return response.data;
  }
  static async mineBlock(data: string): Promise<any> {
    const response = await api.post("/mine", { data });
    return response.data;
  }
  static async validateChain(): Promise<any> {
    const response = await api.get("/validate");
    return response.data;
  }
  static async uploadAndValidateChain(chainData: IBlock[]): Promise<any> {
    const response = await api.post("/upload-validate", {
      chainData,
    });
    return response.data;
  }
  static async downloadChain(): Promise<any> {
    const response = await api.get("/download");
    return response.data;
  }
}

export default api;
