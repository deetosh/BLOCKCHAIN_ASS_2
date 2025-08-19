import { useState, useEffect } from 'react';
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
  const [showingUploaded,setShowingUploaded] = useState(false);

  // loading the blockchain on component mount
  useEffect(() => {
    loadBlockchain();
  }, []);

  // loading the blockchain
  const loadBlockchain = async () => {
    try {
      setLoading(true);
      const response = await BlockchainAPI.getChain();
      if (!response.error && response.data) {
        setBlockchain(response.data);
        setShowingUploaded(false);
        setInvalidBlockIndex(undefined);
      } else {
        showMessage('error', 'Failed to load blockchain');
      }
    } catch (error) {
      showMessage('error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // mining a new block with user-provided data
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
    } finally {
      setMining(false);
    }
  };

  // download the blockchain data received as a JSON file
  const downloadBlockchain = async () => {
    try {
      const chainData = await BlockchainAPI.getChain(); // get the entire block chain data
      if (chainData.error || !chainData.data) {
        showMessage('error', 'Failed to retrieve blockchain data');
        return;
      }
      const dataStr = JSON.stringify(chainData.data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `blockchain_data.json`;
      
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
        console.log('file',parsedData);
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
          setShowingUploaded(true);
        }
      } else {
        showMessage('error', response.error || 'Failed to validate uploaded blockchain');
      }
    } catch (error) {
      showMessage('error', 'Failed to process uploaded file');
    }
  };

  // show a message to the user for 4 seconds
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // if loading then show loading indicator
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
          <MiningControls
            onMine={mineBlock}
            onDownload={downloadBlockchain}
            onUpload={uploadAndValidateBlockchain}
            isMining={mining}
          />

          {blockchain && (
            <Blockchain 
              blocks={blockchain.chain} 
              invalidBlockIndex={invalidBlockIndex}
              isshowingUploaded={showingUploaded}
              loadOriginalChain={loadBlockchain}
            />
          )}
      </main>

    </div>
  );
}

export default App;