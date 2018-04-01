const Promise = require("bluebird");
const processTip = require("./processTip");
const writeFileAsync = Promise.promisify(require("fs").writeFile);
const providerUrl = require('./config').providerUrl;
const Web3 = require("web3");
const TipperArtifacts = require("./contracts/build/contracts/Tipper.json");

module.exports = {
  Tipper: null,
  reset(){
    // new Web3("http://127.0.0.1:9545/");
    let web3 = new Web3(providerUrl);
    this.Tipper = new web3.eth.Contract(TipperArtifacts.abi, TipperArtifacts.networks["4"].address);
    subscribeTips(this.Tipper);
    subscribeBlocks(web3);
    return global.web3 = web3;
  }
}

function subscribeTips(Tipper){
  Tipper.events.Tip()
    .on("data", processTip)
    .on("error", console.warn);
}

function subscribeBlocks(web3){
  web3.eth.subscribe("newBlockHeaders")
    .on("data", async function(block){
      // console.log(block.number);
      await writeFileAsync(`${__dirname}/.lastBlock.json`, JSON.stringify(block.number));
    });
}
