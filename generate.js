const { secp256k1 } = require("ethereum-cryptography/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils")


const privateKey = secp256k1.utils.randomPrivateKey()
console.log('Private key:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey)
console.log('Public key:', toHex(publicKey));

const address1 = (keccak256(publicKey.slice(1)).slice(-20));
console.log('Ethereum public key:', toHex(address1));
