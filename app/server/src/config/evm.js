import {ethers} from 'ethers';
import keys from './env.js';

const provider = new ethers.JsonRpcProvider(keys.RPC_URL);

const wallet = new ethers.Wallet(keys.PRIVATE_KEY, provider);

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_identifier",
				"type": "string"
			}
		],
		"name": "getByIdentifier",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_identifier",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_initialCredit",
				"type": "uint256"
			}
		],
		"name": "initializeIdentifier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_credits",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_identifier",
				"type": "string"
			}
		],
		"name": "updateCredits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const contractAddress = "0xd69Bb0898e8f9292B8ccD137aaEFD7079ad43eAd";

export const contract = new ethers.Contract(contractAddress, contractABI, wallet);