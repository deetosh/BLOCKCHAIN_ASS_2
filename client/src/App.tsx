import React, { useState, useEffect } from 'react';
import Blockchain from './components/Blockchain';
import MiningControls from './components/MiningControls';
import { BlockchainAPI } from './services/api.service';
import { IBlock, IBlockchain } from './interface/blockchain.interface';
import './App.css';

function App() {
  const [blockchain, setBlockchain] = useState<IBlockchain | null>(null);
  const [loading, setLoading] = useState(true);
  const [mining, setMining] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [invalidBlockIndex, setInvalidBlockIndex] = useState<number | undefined>();

  useEffect(() => {
    loadBlockchain();
  }, []);

  const loadBlockchain = async () => {
    try {
      setLoading(true);
      const response = await BlockchainAPI.getChain();
      if (!response.error && response.data) {
        setBlockchain(response.data);
        setInvalidBlockIndex(undefined);
      } else {
        showMessage('error', 'Failed to load blockchain');
      }
    } catch (error) {
      showMessage('error', 'Failed to connect to server');
      console.error('Error loading blockchain:', error);
    } finally {
      setLoading(false);
    }
  };

  const mineBlock = async (data: string) => {
    try {
      setMining(true);
      showMessage('info', 'Mining block... This may take a moment.');
      
      const response = await BlockchainAPI.mineBlock(data);
      
      if (!response.error) {
        showMessage('success', `Block mined successfully! Chain now has ${response.chainLength} blocks.`);
        await loadBlockchain(); // Reload the blockchain
      } else {
        showMessage('error', response.error || 'Failed to mine block');
      }
    } catch (error) {
      showMessage('error', 'Failed to mine block');
      console.error('Error mining block:', error);
    } finally {
      setMining(false);
    }
  };

  const validateBlockchain = async () => {
    try {
      const response = await BlockchainAPI.validateChain();
      
      if (!response.error) {
        const messageType = response.isValid ? 'success' : 'error';
        showMessage(messageType, response.message || 'Validation completed');
        setInvalidBlockIndex(undefined);
      } else {
        showMessage('error', 'Failed to validate blockchain');
      }
    } catch (error) {
      showMessage('error', 'Failed to validate blockchain');
      console.error('Error validating blockchain:', error);
    }
  };

  const downloadBlockchain = async () => {
    try {
      const chainData = await BlockchainAPI.downloadChain();
      
      const dataStr = JSON.stringify(chainData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `blockchain_${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showMessage('success', 'Blockchain downloaded successfully');
    } catch (error) {
      showMessage('error', 'Failed to download blockchain');
      console.error('Error downloading blockchain:', error);
    }
  };

  const uploadAndValidateBlockchain = async (file: File) => {
    try {
      const fileText = await file.text();
      let chainData: IBlock[];

      try {
        const parsedData = JSON.parse(fileText);
        // Handle both direct array and wrapped object formats
        chainData = Array.isArray(parsedData) ? parsedData : parsedData.chain;
        
        if (!Array.isArray(chainData)) {
          throw new Error('Invalid format');
        }
      } catch (parseError) {
        showMessage('error', 'Invalid file format. Please upload a valid JSON file.');
        return;
      }

      const response = await BlockchainAPI.uploadAndValidateChain(chainData);
      
      if (!response.error) {
        if (response.isValid) {
          showMessage('success', 'Uploaded blockchain is valid!');
          setInvalidBlockIndex(undefined);
        } else {
          showMessage('error', response.message || 'Uploaded blockchain is invalid');
          setInvalidBlockIndex(response.invalidBlockIndex);
        }

        // Update display with uploaded chain for validation visualization
        if (blockchain) {
          const uploadedChain: IBlockchain = {
            chain: chainData,
            difficulty: blockchain.difficulty
          };
          setBlockchain(uploadedChain);
        }
      } else {
        showMessage('error', response.error || 'Failed to validate uploaded blockchain');
      }
    } catch (error) {
      showMessage('error', 'Failed to process uploaded file');
      console.error('Error uploading blockchain:', error);
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading ...</div>
      </div>
    );
  }

  return (
    <div className="app">

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <main className="main-content">
        <div className="controls-section">
          <MiningControls
            onMine={mineBlock}
            onValidate={validateBlockchain}
            onDownload={downloadBlockchain}
            onUpload={uploadAndValidateBlockchain}
            isMining={mining}
          />
        </div>

        <div className="blockchain-section">
          {blockchain && (
            <Blockchain 
              blocks={blockchain.chain} 
              invalidBlockIndex={invalidBlockIndex}
            />
          )}
        </div>
      </main>

    </div>
  );
}

export default App;