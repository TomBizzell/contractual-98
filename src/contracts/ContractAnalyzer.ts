
export const CONTRACT_ANALYZER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contractAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_analysis",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_analysisType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_jurisdiction",
        "type": "string"
      }
    ],
    "name": "addAnalysis",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "analyzer",
        "type": "address"
      }
    ],
    "name": "AnalysisAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "analysisId",
        "type": "uint256"
      }
    ],
    "name": "AnalysisUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_analysisId",
        "type": "uint256"
      }
    ],
    "name": "getAnalysis",
    "outputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "analysis",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "analyzer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "analysisType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "jurisdiction",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAnalysisCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contractAddress",
        "type": "address"
      }
    ],
    "name": "getAnalysesForContract",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const CONTRACT_ANALYZER_ADDRESS = ""; // This will be filled after deployment
