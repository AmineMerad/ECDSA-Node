const express = require("express");
const { sign } = require('ethereum-cryptography/secp256k1'); // Import 'sign' function
const { verify } = require('ethereum-cryptography/secp256k1'); // Import 'verify' function
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "db1f93d07b1f6bee52638193317025e0e31cf215": 100,
  "6b3dd809ce55440610415f11278d79fd9b30ea59": 50,
  "e286e3d3c4cb7617435297305f8095bd3b5b938a": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const isValid = verifyTransaction(sender, amount, signature);

  if (!isValid) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function signTransaction(sender, amount) { // Change 'address' to 'sender'
  const privateKey = getPrivateKeyForAddress(sender); // Use 'sender' instead of 'address'
  const signature = sign({ sender, amount }, privateKey); // Use 'sender' instead of 'address'
  return signature;
}

function verifyTransaction(sender, amount, signature) { // Change 'address' to 'sender'
  const publicKey = getPublicKeyForAddress(sender); // Use 'sender' instead of 'address'
  const isValid = verify({ sender, amount }, signature, publicKey); // Use 'sender' instead of 'address'
  return isValid;
}
