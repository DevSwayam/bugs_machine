const contract_Address = "0xe5F0048F2F3fF1df8584879227C4c123f15cFC87";
const contract_Abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "RandomNumberGenerator__alreadyInitialised",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "RandomNumberGenerator__onlyOwmer",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "RandomNumberGenerator__onlyServer",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint16",
				"name": "number",
				"type": "uint16"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "uniqueId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "randomNumberGenerated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getCallerServerAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDestinationDomain",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
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
		"name": "getICA",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIcaRouterAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwnersAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSlotMachineContractAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserAddressToLastRandonNumber",
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
				"internalType": "uint32",
				"name": "_destinationDomain",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "_slotMachineContractAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_icaRouterAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_callerServer",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "sendRandomNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newServerAddress",
				"type": "address"
			}
		],
		"name": "setServerContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

module.exports={contract_Address,contract_Abi}