const Web3 = require("web3");
const bases = require("bases");
const TipperArtifacts = require("./contracts/build/contracts/Tipper.json");
const web3 = new Web3("http://127.0.0.1:8545");
const Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4"].address);
const postId = bases.fromBase36("6gkd6v");
const recipient = "carlslarson";

run();

async function run(){
  let coinbase = await web3.eth.getCoinbase();
  console.log(coinbase);

  let tip = web3.utils.toWei("0.5", 'ether');
  console.log(tip)

  await Tipper.methods.tipEther("0", postId.toString(), web3.utils.toHex(recipient)).send({from: coinbase, value: tip, gas: 100000});
}
