const Promise = require("bluebird");
const pgp = require("pg-promise")({promiseLib: Promise});
const bases = require("bases");
const snoowrap = require('snoowrap');
const db = pgp("postgres://postgres:postgres@localhost:5432/reddit");
const {CONTENT_TYPES} = require("./constants");
const snoowrapConfig = require("./.secret");
const utils = require("./utils");
const erc20 = require("./erc20");
const r = new snoowrap(snoowrapConfig);

module.exports = async function processTip(tip){
  let {returnValues}= tip;
  let eventId = tip.id;
  // console.log(tip);
  let {ctype, id, token, amount} = returnValues;
  ctype = CONTENT_TYPES[parseInt(ctype)];
  let redditId = bases.toBase36(parseInt(id));

  let res = await db.any("SELECT * FROM tips WHERE event_id = $1", [eventId]);
  if(!res.length) {
    let tx = await web3.eth.getTransaction(tip.transactionHash);
    await db.none("INSERT INTO tips(event_id, content_type, reddit_id, token, amount, from_address) VALUES($1, $2, $3, $4, $5, $6)", [eventId, ctype, redditId, token, amount, tx.from]);
    res = await db.any("SELECT * FROM tips WHERE event_id = $1", [eventId]);
  }
  let replyId = res[0].reply_id;
  if(!replyId) return await sendReply(res[0]);
}

async function sendReply(tip){
  // do send
  let id;
  try {
    let reply = await genReply(tip);
    let comment;
    if(tip.content_type === "POST") comment = await r.getSubmission(tip.reddit_id).reply(reply);
    else comment = await r.getComment(tip.reddit_id).reply(reply);
    id = comment.id;
    console.log(`sent reply ${id} to ${tip.content_type}:${tip.reddit_id}`);
  } catch (err) {
    if(err.message.indexOf("TOO_OLD") !== -1) id = "TOO_OLD";
    else console.warn(err);
  }
  return await db.none("UPDATE tips SET reply_id = $1 WHERE id = $2", [id, tip.id]);
}

async function genReply(tip){
  if(utils.isEthTip(tip.token)) return `You received a ${web3.utils.fromWei(tip.amount, "finney")} finney (mETH) tip from ${tip.from_address} directly to your r/recdao registered wallet.`;
  else {
    const Token = new web3.eth.Contract(erc20, tip.token);
    let decimals = await Token.methods.decimals().call();
    let symbol = await Token.methods.symbol().call();
    return `You received a ${tip.amount/Math.pow(10, decimals)} ${symbol} tip from ${tip.from_address} directly to your r/recdao registered wallet.`;
  }
}
