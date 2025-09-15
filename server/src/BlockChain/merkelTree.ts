import { calculateSHA256 } from "./block.interface";

export function computeMerkleRoot(txids: string[]): string {
  if (txids.length === 0) {
    // empty Merkle root: define as sha256 of empty string
    return calculateSHA256("");
  }

  let layer = txids.slice();

  while (layer.length > 1) { // calculate layer by layer (above) till we get the root of the tree
    const nextLayer: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : layer[i]; // duplicate if odd
      const combined = left + right;
      nextLayer.push(calculateSHA256(combined));
    }
    layer = nextLayer;
  }

  return layer[0];
}