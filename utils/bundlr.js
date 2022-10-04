import WebBundlr from "@bundlr-network/client/build/web"
import { utils } from "ethers";
import { networkConfig } from "../web3/web3config"



export const getRemoteBundler = async() => {
    console.log('client presignedhash', networkConfig)
    const result = await fetch('/api/presignedhash',{method: 'GET'})
    const data = await result.json()
    const presignedHash = Buffer.from(data.presignedHash,'hex')
    console.log('Client presignedHash:', presignedHash)
    const provider = {
      getSigner: () => {
          return {
              signMessage: () => {
                  return presignedHash
              }
          }
      }
    }
    const bundlr = new WebBundlr(networkConfig.bundlrNetwork, networkConfig.currency, provider);
    await bundlr.ready()
    console.log('remote bundlr ready:', bundlr.address)
    return bundlr
};

/**  uploadData
*    Define the tags 
*    create a transaction and get it sign on the paying server using the remote Bundler Object
*    passed. With the signed signature upload content and tags from client to Bundlr
*/
export const uploadData = async (remoteBundlr, webBundlr, file, fileData) => {
// tags array defines label with tag to our uploading content
// Helps to retrieve information at www.arweave.net/graphql
  const tags = [
    // Recomemnded tags for a file upload
    {name: "Content-Type", value: file.type},
    {name: "File", value: file.name },
    {name: "App-Name", value: "my-bundlr-app"},
    {name: "App-version", value: "1.0" },
    // custom tags
    // for example as in metadata server account is poster, we need to set who is the original owner
    {name: "owner", value: webBundlr.current.address }
  ]  
  const price= await remoteBundlr.getPrice(file.size)
  console.log(file.name,' of ', file.size,' will cost:', utils.formatEther(price.toString()))
  const transaction = remoteBundlr.createTransaction(fileData, { tags })
  console.log('transaction:', transaction)
  // get signature data
  const signatureData = Buffer.from(await transaction.getSignatureData());
  // get signature signed by the paying server
  try {
    const resp = await fetch("/api/serversigning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datatosign: Buffer.from(signatureData).toString("hex") }),
    });
    const resp2= await resp.json()
    console.log("signed JSON", resp2 )
    console.log('Server Signed Data:', resp2.signeddata)
    const signed = Buffer.from(resp2.signeddata,"hex")
    console.log('signed',signed)
    console.log('signatureData server signed', transaction)
    console.log('setting signature on transaction')
    transaction.setSignature(signed)
    console.log('transaction', transaction)
    //transaction.getRaw().set(signed,2)
    
    //       // make sure isValid is true - don't worry about isSigned.
    //   console.log({
  //  isSigned: await transaction.isSigned(),
  //  isValid: await transaction.isValid(),
  // })
  // if (!await transaction.isValid()) {alert('something went wrong'); return}
  const res = await transaction.upload();
  console.log('res', res)
  return {status:true, txid:res.data.id}
} catch (error) {
    console.log("Error", error);
    return {status:false}
  }
}  
