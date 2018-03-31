const Web3 = require("web3");
const bases = require("bases");
const TipperArtifacts = require("./contracts/build/contracts/Tipper.json");
const TokenArtifacts = require("./contracts/build/contracts/Token.json");
const web3 = new Web3("http://127.0.0.1:8545");
const Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4"].address);
const Token = new web3.eth.Contract(TokenArtifacts.abi, TokenArtifacts.networks["4"].address);
const erc20 = require("./erc20");
const postId = bases.fromBase36("85tpzs");
const commentId = bases.fromBase36("dwkj69u");
const recipient = "carlslarson";

run();

async function run(){
  let coinbase = await web3.eth.getCoinbase();
  console.log(coinbase);

  let tip = web3.utils.toWei("0.015", 'ether');
  console.log(tip)

  let decimals = await Token.methods.decimals().call();

  // await Token.methods.approve(TipperArtifacts.networks["4"].address, 5000*Math.pow(10, decimals)).send({from: coinbase, gas: 200000});

  // await Tipper.methods.tipEther("0", postId.toString(), web3.utils.toHex(recipient)).send({from: coinbase, value: tip, gas: 100000});
  // await Tipper.methods.tipEther("1", commentId.toString(), web3.utils.toHex(recipient)).send({from: coinbase, value: tip, gas: 100000});
  await Tipper.methods.tipToken(
    "0",
    postId.toString(),
    web3.utils.toHex(recipient),
    TokenArtifacts.networks["4"].address,
    3*Math.pow(10, decimals)
  ).send({from: coinbase, gas: 100000});

  process.exit();
}
