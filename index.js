require("dotenv").config()
const express = require("express");
const solc = require("solc");
const fs = require("fs");

const app = express();

app.get("/", (_, res) => {
  try {
    // Reading the file
    const file = fs.readFileSync("Message.sol").toString();

    // Input structure for solidity compiler
    var input = {
      language: "Solidity",
      sources: {
        "Message.sol": {
          content: file,
        },
      },

      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    var output = JSON.parse(solc.compile(JSON.stringify(input)));

    let abi = output.contracts["Message.sol"]["Message"].abi;
    let bytecode =
      output.contracts["Message.sol"]["Message"].evm.bytecode.object;

    res.status(200).json({ abi, bytecode });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
