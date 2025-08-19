import express from "express";
import cors from "cors";
import blockChainRouter from "./blockchain.routes";

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


// Routes
app.use("/api/blockchain", blockChainRouter);

