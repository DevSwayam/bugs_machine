import { expect } from 'chai';
import { ethers, network } from 'hardhat';

import { asyncDecrypt, awaitAllDecryptionResults } from '../asyncDecrypt';
import { getSigners, initSigners } from '../signers';

describe('TestAsyncDecrypt', function () {
  before(async function () {
    await asyncDecrypt();
    await initSigners(3);
    this.signers = await getSigners();
  });

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory('TestAsyncDecrypt');
    this.contract = await contractFactory.connect(this.signers.alice).deploy();
  });

  it('test async decrypt bool would fail if maxTimestamp is above 1 day', async function () {
    if (network.name === 'hardhat') {
      // mocked mode
      await expect(this.contract.connect(this.signers.carol).requestBoolAboveDelay()).to.be.revertedWith(
        'maxTimestamp exceeded MAX_DELAY',
      );
    } else {
      // fhevm-mode
      const tx = await this.contract.connect(this.signers.carol).requestBoolAboveDelay({ gasLimit: 1_000_000 });
      await expect(tx.wait()).to.throw;
    }
  });

  it('test async decrypt bool', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestBool({ gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yBool();
    expect(y).to.equal(true);
  });

  it('test async decrypt FAKE bool', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeBool.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });

  it('test async decrypt uint4', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestUint4({ gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yUint4();
    expect(y).to.equal(4);
  });

  it('test async decrypt FAKE uint4', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeUint4.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });

  it('test async decrypt uint8', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestUint8({ gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yUint8();
    expect(y).to.equal(42);
  });

  it('test async decrypt FAKE uint8', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeUint8.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });

  it('test async decrypt uint16', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestUint16({ gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yUint16();
    expect(y).to.equal(16);
  });

  it('test async decrypt FAKE uint16', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeUint16.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });

  it('test async decrypt uint32', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestUint32(5, 15, { gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yUint32();
    expect(y).to.equal(52); // 5+15+32
  });

  it('test async decrypt FAKE uint32', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeUint32.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });

  it('test async decrypt uint64', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestUint64({ gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yUint64();
    expect(y).to.equal(64);
  });

  it('test async decrypt FAKE uint64', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeUint64.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });

  it('test async decrypt address', async function () {
    const tx2 = await this.contract.connect(this.signers.carol).requestAddress({ gasLimit: 500_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await this.contract.yAddress();
    expect(y).to.equal('0x8ba1f109551bD432803012645Ac136ddd64DBA72');
  });

  it('test async decrypt FAKE address', async function () {
    if (network.name !== 'hardhat') {
      // only in fhevm mode
      const txObject = await this.contract
        .connect(this.signers.carol)
        .requestFakeAddress.populateTransaction({ gasLimit: 5_000_000 });
      const tx = await this.signers.carol.sendTransaction(txObject);
      let receipt = null;
      let waitTime = 0;
      while (receipt === null && waitTime < 15000) {
        receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        if (receipt === null) {
          console.log('Trying again to fetch txn receipt....');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          waitTime += 5000;
        }
      }
      expect(waitTime >= 15000).to.be.true;
    }
  });
});
