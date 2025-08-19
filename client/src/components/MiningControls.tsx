import React, { useState } from "react";
interface MiningControlsProps {
  onMine: (data: string) => void;
  onDownload: () => void;
  onUpload: (file: File) => void;
  isMining: boolean;
}
const MiningControls: React.FC<MiningControlsProps> = ({
  onMine,
  onDownload,
  onUpload,
  isMining,
}) => {
  const [blockData, setBlockData] = useState("");
  const handleMine = () => {
    if (blockData.trim()) {
      onMine(blockData.trim());
      setBlockData("");
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset the input
      event.target.value = "";
    }
  };
  return (
    <div className="mining-controls">
      <h2>Controls</h2>
      <div className="control-block">
        <p>Add and mine a new block</p>
        <input
          type="text"
          placeholder="Enter block data (e.g., transaction data)"
          value={blockData}
          onChange={(e) => setBlockData(e.target.value)}
          disabled={isMining}
        />
        <button
          onClick={handleMine}
          disabled={isMining || !blockData.trim()}
          className="mine-btn"
        >
          {isMining ? "Mining..." : "Mine Block"}
        </button>
      </div>
      <div className="control-block">
        <p>Download the JSON file</p>
        <button onClick={onDownload} className="download-btn">
          Download Blockchain
        </button>
      </div>

      <div className="control-block">
        <p>Upload the JSON file of a blockchain and validate it</p>
        <label className="upload-label">
          <input
            type="file"
            accept=".json,.txt,.yaml,.yml"
            onChange={handleFileUpload}
            hidden
          />
          <span className="upload-btn">Upload & Validate Blockchain</span>
        </label>
      </div>
    </div>
  );
};
export default MiningControls;
