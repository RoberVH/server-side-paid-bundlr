// API route serversigning
// sign transacction with server's mumbai account

import Bundlr from "@bundlr-network/client/";
import { networkConfig } from "../../web3/web3config"



export default async function handler(req, res) {
  // get the bundler instance from the key we use at the server
  const serverBundlr = new Bundlr(
      networkConfig.bundlrNetwork,
      networkConfig.currency,
      networkConfig.serverAccPK
  )  
  // console.log('-serversigning, serverBundlr curr es', serverBundlr.currency)
  // console.log('-serversigning, serverBundlr addr es', serverBundlr.address)
  //console.log('-serversigning, req.body.signatureData es', req.body)
  console.log('-serversigning, req.body.signatureData es', req.body.datatosign)
  const clientData= Buffer.from(req.body.datatosign,'hex')
  //const datatoSign = Buffer.from(req.body.signaturedata, "hex");
  console.log('-serversigning, clientData', clientData)
  console.log('-serversigning, clientData', clientData.length)
  
  
  try {  
    const signedData = await serverBundlr.currencyConfig.sign(clientData) 
    const signedDataEncoded = Buffer.from (signedData)
    console.log('signedData:', signedData)
    res.status(200).json({ msg:'ok',signeddata:signedDataEncoded })
  } catch (error) {
    console.log('serversigning error', error)
    res.status(405).json({msg:error})
  }
}