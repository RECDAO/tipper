const Promise = require("bluebird");
const writeFileAsync = Promise.promisify(require("fs").writeFile);
const Web3 = require("web3");
const processTip = require("./processTip");
let lastBlock;
try { lastBlock = require("./.lastBlock") } catch(err) {}
const TipperArtifacts = require("./contracts/build/contracts/Tipper.json");
// const web3 = new Web3("http://127.0.0.1:9545/");
global.web3 = new Web3("wss://rinkeby.infura.io/ws");
// const Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4447"].address);
const Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4"].address);

lastBlock = 2000000
if(lastBlock) catchUp(lastBlock - 1);

Tipper.events.Tip()
  .on("data", processTip)
  .on("error", console.error);

async function catchUp(fromBlock){
  console.log(`process Tip events from block: ${fromBlock}`);
  let tips = await Tipper.getPastEvents("Tip", {fromBlock});
  await Promise.each(tips, processTip);
}

web3.eth.subscribe("newBlockHeaders")
  .on("data", async function(block){
    console.log(block.number);
    await writeFileAsync(`${__dirname}/.lastBlock.json`, JSON.stringify(block.number));
  });
