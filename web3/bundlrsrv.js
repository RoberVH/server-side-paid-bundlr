/**
 * Bundlr Server utilities. This module has server bundlr methods that call Bundlr Api to upload files
 * to arweave from netxjs server
*/
import { utils } from "ethers";
import Bundlr from "@bundlr-network/client/";

const key = process.env.POLYGON_MUMBAI_PVK_ACCOUNT // your private key

export async function serverInit() {
  console.log('-serverInit')
    // const publicKey = serverBundlr.currencyConfig.getSigner().publicKey
     serverBundlr = new Bundlr("https://devnet.bundlr.network", "matic", key)
     await serverBundlr.ready();
     presignedHash = Buffer.from(
        await serverBundlr.currencyConfig.sign(
          "sign this message to connect to Bundlr.Network"
        )
      ).toString("hex");
}

export async function signDataOnServer(signatureData) {
    return await serverBundlr.currencyConfig.sign(signatureData)
}

export  const printBalance= async () =>  {
    const balance=await serverBundlr.getLoadedBalance()
    console.log('Balance',  balance.toString())
    const bal1 = balance.toString()
    const saldo=utils.formatEther(bal1.toString())
    console.log('Saldo: ', saldo);
}