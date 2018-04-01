const Promise = require("bluebird");
const initWeb3 = require("./initWeb3");
let web3 = initWeb3.reset();
const processTip = require("./processTip");
const Tipper = initWeb3.contracts.Tipper;

let lastBlock;
try { lastBlock = require("./.lastBlock") } catch(err) {}

// lastBlock = 2000000
if(lastBlock) catchUp(lastBlock - 1);

async function catchUp(fromBlock){
  console.log(`process Tip events from block: ${fromBlock}`);
  let tips = await Tipper.getPastEvents("Tip", {fromBlock});
  await Promise.each(tips, processTip);
}
// function error(err){
//   console.log("ERROR HERE!!!!")
//   console.warn(err);
//   setTimeout(function () {
//       process.on("exit", function () {
//           require("child_process").spawn(process.argv.shift(), process.argv, {
//               cwd: process.cwd(),
//               detached : true,
//               stdio: "inherit"
//           });
//       });
//       process.exit();
//   }, 5000);
// }
