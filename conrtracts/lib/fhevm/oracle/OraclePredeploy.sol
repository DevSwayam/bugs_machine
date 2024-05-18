// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.20;

import "../lib/TFHE.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract OraclePredeploy is Ownable2Step {
    uint256 public constant MAX_DELAY = 1 days;

    struct DecryptionRequestEBool {
        ebool[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    struct DecryptionRequestEUint4 {
        euint4[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    struct DecryptionRequestEUint8 {
        euint8[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    struct DecryptionRequestEUint16 {
        euint16[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    struct DecryptionRequestEUint32 {
        euint32[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    struct DecryptionRequestEUint64 {
        euint64[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    struct DecryptionRequestEAddress {
        eaddress[] cts;
        address contractCaller;
        bytes4 callbackSelector;
        uint256 msgValue;
        uint256 maxTimestamp;
    }

    ebool eTRUE = TFHE.asEbool(true);

    uint256 public counter; // tracks the number of decryption requests

    mapping(address => bool) public isRelayer;
    mapping(uint256 => DecryptionRequestEBool) decryptionRequestsEBool;
    mapping(uint256 => DecryptionRequestEUint4) decryptionRequestsEUint4;
    mapping(uint256 => DecryptionRequestEUint8) decryptionRequestsEUint8;
    mapping(uint256 => DecryptionRequestEUint16) decryptionRequestsEUint16;
    mapping(uint256 => DecryptionRequestEUint32) decryptionRequestsEUint32;
    mapping(uint256 => DecryptionRequestEUint64) decryptionRequestsEUint64;
    mapping(uint256 => DecryptionRequestEAddress) decryptionRequestsEAddress;
    mapping(uint256 => bool) isFulfilled;

    constructor(address predeployOwner) Ownable(predeployOwner) {}

    event EventDecryptionEBool(
        uint256 indexed requestID,
        ebool[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event EventDecryptionEUint4(
        uint256 indexed requestID,
        euint4[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event EventDecryptionEUint8(
        uint256 indexed requestID,
        euint8[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event EventDecryptionEUint16(
        uint256 indexed requestID,
        euint16[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event EventDecryptionEUint32(
        uint256 indexed requestID,
        euint32[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event EventDecryptionEUint64(
        uint256 indexed requestID,
        euint64[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event EventDecryptionEAddress(
        uint256 indexed requestID,
        eaddress[] cts,
        address contractCaller,
        bytes4 callbackSelector,
        uint256 msgValue,
        uint256 maxTimestamp
    );

    event AddedRelayer(address indexed realyer);

    event RemovedRelayer(address indexed realyer);

    event ResultCallbackBool(uint256 indexed requestID, bool success, bytes result);
    event ResultCallbackUint4(uint256 indexed requestID, bool success, bytes result);
    event ResultCallbackUint8(uint256 indexed requestID, bool success, bytes result);
    event ResultCallbackUint16(uint256 indexed requestID, bool success, bytes result);
    event ResultCallbackUint32(uint256 indexed requestID, bool success, bytes result);
    event ResultCallbackUint64(uint256 indexed requestID, bool success, bytes result);
    event ResultcallbackAddress(uint256 indexed requestID, bool success, bytes result);

    function addRelayer(address relayerAddress) external onlyOwner {
        require(!isRelayer[relayerAddress], "Address is already relayer");
        isRelayer[relayerAddress] = true;
        emit AddedRelayer(relayerAddress);
    }

    function removeRelayer(address relayerAddress) external onlyOwner {
        require(isRelayer[relayerAddress], "Address is not a relayer");
        isRelayer[relayerAddress] = false;
        emit RemovedRelayer(relayerAddress);
    }

    function isExpired(uint256 requestID) external view returns (bool) {
        uint256 timeNow = block.timestamp;
        return
            isFulfilled[requestID] ||
            (timeNow > decryptionRequestsEBool[requestID].maxTimestamp &&
                decryptionRequestsEBool[requestID].maxTimestamp != 0) ||
            (timeNow > decryptionRequestsEUint4[requestID].maxTimestamp &&
                decryptionRequestsEUint4[requestID].maxTimestamp != 0) ||
            (timeNow > decryptionRequestsEUint8[requestID].maxTimestamp &&
                decryptionRequestsEUint8[requestID].maxTimestamp != 0) ||
            (timeNow > decryptionRequestsEUint16[requestID].maxTimestamp &&
                decryptionRequestsEUint16[requestID].maxTimestamp != 0) ||
            (timeNow > decryptionRequestsEUint32[requestID].maxTimestamp &&
                decryptionRequestsEUint32[requestID].maxTimestamp != 0) ||
            (timeNow > decryptionRequestsEUint64[requestID].maxTimestamp &&
                decryptionRequestsEUint64[requestID].maxTimestamp != 0) ||
            (timeNow > decryptionRequestsEAddress[requestID].maxTimestamp &&
                decryptionRequestsEAddress[requestID].maxTimestamp != 0);
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via `fulfillRequestBool`.
    function requestDecryptionEBool(
        ebool[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.and(ct[i], eTRUE); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEBool memory decryptionReq = DecryptionRequestEBool(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEBool[initialCounter] = decryptionReq;
        emit EventDecryptionEBool(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via `fulfillRequestUint8`.
    function requestDecryptionEUint4(
        euint4[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.shl(ct[i], 0); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEUint4 memory decryptionReq = DecryptionRequestEUint4(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEUint4[initialCounter] = decryptionReq;
        emit EventDecryptionEUint4(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via `fulfillRequestUint8`.
    function requestDecryptionEUint8(
        euint8[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.shl(ct[i], 0); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEUint8 memory decryptionReq = DecryptionRequestEUint8(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEUint8[initialCounter] = decryptionReq;
        emit EventDecryptionEUint8(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via `fulfillRequestUint16`.
    function requestDecryptionEUint16(
        euint16[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.shl(ct[i], 0); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEUint16 memory decryptionReq = DecryptionRequestEUint16(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEUint16[initialCounter] = decryptionReq;
        emit EventDecryptionEUint16(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via  via `fulfillRequestUint32`.
    function requestDecryptionEUint32(
        euint32[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.shl(ct[i], 0); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEUint32 memory decryptionReq = DecryptionRequestEUint32(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEUint32[initialCounter] = decryptionReq;
        emit EventDecryptionEUint32(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via `fulfillRequestUint64`.
    function requestDecryptionEUint64(
        euint64[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.shl(ct[i], 0); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEUint64 memory decryptionReq = DecryptionRequestEUint64(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEUint64[initialCounter] = decryptionReq;
        emit EventDecryptionEUint64(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    // Requests the decryption of n ciphertexts `ct`s with the result returned in a callback.
    // During callback, msg.sender is called with [callbackSelector,requestID,decrypt(ct[0]),decrypt(ct[1]),...,decrypt(ct[n-1])] as calldata via `FulfillRequestAddress`.
    function requestDecryptionAddress(
        eaddress[] memory ct,
        bytes4 callbackSelector,
        uint256 msgValue, // msg.value of callback tx, if callback is payable
        uint256 maxTimestamp
    ) external returns (uint256 initialCounter) {
        require(maxTimestamp > block.timestamp, "maxTimestamp must be a future date");
        require(maxTimestamp <= block.timestamp + MAX_DELAY, "maxTimestamp exceeded MAX_DELAY");
        initialCounter = counter;
        uint256 len = ct.length;
        for (uint256 i = 0; i < len; i++) {
            require(TFHE.isInitialized(ct[i]), "Ciphertext is not initialized");
            TFHE.eq(ct[i], ct[i]); // this is similar to no-op, except it would fail if ct is a "fake" handle,
            // not corresponding to a verified ciphertext in privileged memory
        }
        DecryptionRequestEAddress memory decryptionReq = DecryptionRequestEAddress(
            ct,
            msg.sender,
            callbackSelector,
            msgValue,
            maxTimestamp
        );
        decryptionRequestsEAddress[initialCounter] = decryptionReq;
        emit EventDecryptionEAddress(initialCounter, ct, msg.sender, callbackSelector, msgValue, maxTimestamp);
        counter++;
    }

    function fulfillRequestBool(
        uint256 requestID,
        bool[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEBool memory decryptionReq = decryptionRequestsEBool[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(decryptedCt[i]));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultCallbackBool(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    function fulfillRequestUint4(
        uint256 requestID,
        uint8[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEUint4 memory decryptionReq = decryptionRequestsEUint4[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(decryptedCt[i]));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultCallbackUint4(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    function fulfillRequestUint8(
        uint256 requestID,
        uint8[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEUint8 memory decryptionReq = decryptionRequestsEUint8[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(decryptedCt[i]));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultCallbackUint8(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    function fulfillRequestUint16(
        uint256 requestID,
        uint16[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEUint16 memory decryptionReq = decryptionRequestsEUint16[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(decryptedCt[i]));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultCallbackUint16(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    function fulfillRequestUint32(
        uint256 requestID,
        uint32[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEUint32 memory decryptionReq = decryptionRequestsEUint32[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(decryptedCt[i]));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultCallbackUint32(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    function fulfillRequestUint64(
        uint256 requestID,
        uint64[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEUint64 memory decryptionReq = decryptionRequestsEUint64[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(decryptedCt[i]));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultCallbackUint64(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    function fulfillRequestAddress(
        uint256 requestID,
        uint160[] memory decryptedCt /*, bytes memory signatureKMS */
    ) external payable onlyRelayer {
        // TODO: check EIP712-signature of the DecryptionRequest struct by the KMS (waiting for signature scheme specification of KMS to be decided first)
        require(!isFulfilled[requestID], "Request is already fulfilled");
        DecryptionRequestEAddress memory decryptionReq = decryptionRequestsEAddress[requestID];
        require(block.timestamp <= decryptionReq.maxTimestamp, "Too late");
        uint256 len = decryptedCt.length;
        bytes memory callbackCalldata = abi.encodeWithSelector(decryptionReq.callbackSelector, requestID);
        for (uint256 i; i < len; i++) {
            callbackCalldata = abi.encodePacked(callbackCalldata, abi.encode(address(decryptedCt[i])));
        }
        (bool success, bytes memory result) = (decryptionReq.contractCaller).call{value: decryptionReq.msgValue}(
            callbackCalldata
        );
        emit ResultcallbackAddress(requestID, success, result);
        isFulfilled[requestID] = true;
    }

    modifier onlyRelayer() {
        require(isRelayer[msg.sender], "Not relayer");
        _;
    }
}
