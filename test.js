const Web3 = require("web3");
const ContentDAOArtifacts = require("./contracts/build/contracts/ContentDAO.json");
const web3 = new Web3("wss://rinkeby.infura.io/ws");
const ContentDAO = new web3.eth.Contract(ContentDAOArtifacts.abi, ContentDAOArtifacts.networks["4"].address);

ContentDAO.methods.SIG_STAKE().call().then(console.log)

var openEvent = ContentDAO.events.Opened();
var flipEvent = ContentDAO.events.Flipped();

openEvent
  .on("data", console.log)
  .on("error", console.error);

flipEvent
  .on("data", console.log)
  .on("error", console.error);

function log(err, res){
  if (err) return console.log(err);
  console.log(res);
}
