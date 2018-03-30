const Promise = require("bluebird");
const pgp = require("pg-promise")({promiseLib: Promise});
const db = pgp("postgres://postgres:postgres@localhost:5432/reddit");

const Web3 = require("web3");
const TipperArtifacts = require("./contracts/build/contracts/Tipper.json");
// const web3 = new Web3("http://127.0.0.1:9545/");
const web3 = new Web3("wss://rinkeby.infura.io/ws");
// const Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4447"].address);
const Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4"].address);

// run();

var tipEvent = Tipper.events.Tip();

tipEvent
  .on("data", log)
  .on("error", console.error);

function log(data){
  console.log(data);
}

async function run(){
  let coinbase = await web3.eth.getCoinbase();
  console.log(coinbase);
}
