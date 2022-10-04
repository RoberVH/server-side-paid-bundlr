 const web3ConfigNode1 = {
    currency: 'matic',
    serverAccPK : process.env.POLYGON_PVK_ACCOUNT,
    serverProviderLink: process.env.ALCHEMY_POLYGON_RPC_URL,
    bundlrNetwork:'https://node1.bundlr.network'
}

 const web3ConfigNode2 = {
    currency: 'matic',
    serverAccPK : process.env.POLYGON_PVK_ACCOUNT,
    serverProviderLink: process.env.ALCHEMY_POLYGON_RPC_URL,
    bundlrNetwork:'https://node2.bundlr.network'
}

const web3ConfigDevNet = {
    currency: 'matic',
    serverAccPK : process.env.POLYGON_PVK_ACCOUNT,
    serverProviderLink: process.env.ALCHEMY_MUMBAI_RPC_URL,
    bundlrNetwork:'https://devnet.bundlr.network'
}

//change to we3ConfigDevNet we3ConfigNode2 to connect working network
//export const networkConfig = web3ConfigNode2
export const networkConfig = web3ConfigDevNet
