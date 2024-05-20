const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const dotenv = require('dotenv');
const { contract_Address, contract_Abi } = require('./contract_instance.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Define a route to handle requests for getting a random number
app.post('/api/eip712call/:address', async (req, res) => {
    try {
        const userAddress = req.params.address;
        const { expiryTime, bytesSignature } = req.body;

        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const signer = wallet.connect(provider);
        const contract = new ethers.Contract(contract_Address, contract_Abi, signer);

        const result = await contract.spinSlotMachine(userAddress, expiryTime,9090,17001, bytesSignature);
        res.json(result);
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const server = app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});
