// API route presignedhash
// declare and send a encoded signed message with our Mumbai account 
// this account will have our stash of crytpo to pay for our App users

import { utils } from "ethers";
import Bundlr from "@bundlr-network/client/";
import { networkConfig } from "../../web3/web3config"

const signingMsj="sign this message to connect to Bundlr.Network"


export default async function handler(req, res) {
  // get the bundler instance from the key we use at the server
  const serverBundlr = new Bundlr(
          networkConfig.bundlrNetwork,
          networkConfig.currency,
          networkConfig.serverAccPK
  )
  await serverBundlr.ready()
  const presignedHash = Buffer.from(await serverBundlr.currencyConfig.sign(signingMsj)).toString("hex");
  console.log('Server presignedHash',presignedHash)
  console.log('serverBundlr',serverBundlr.currency)
  res.status(200).send( {presignedHash} )
}
