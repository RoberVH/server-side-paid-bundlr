import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import WebBundlr from "@bundlr-network/client/build/web";
import { providers, utils } from "ethers";
import BigNumber from "bignumber.js";
import { getRemoteBundler, uploadData } from "../utils/bundlr";
import { networkConfig } from "../web3/web3config"
import Image from "next/image";


export default function Home() {
  const [file, setFile] = useState()    // input file value
  const [fileData, setFileData] = useState()  // file data read from user's disk
  const [funds, setFunds] = useState("0.02")  // suggested Matic to transfer to Bundlr to fund it
  const [connected, setConnected] = useState(false)
  const [balance, setBalance] = useState()
  const [account, setAccount] = useState()
  const [remoteBundlr, setRemoteBundlr] = useState()
  const [remoteBundlrBalance, setRemBndlrBal] = useState()
  const [uploadedLinks, setUploads] = useState([])
  const [uploading, setuploading] = useState(false)
  const webBundlr = useRef()
  const provider = useRef()

  
  const getRmteBal = useCallback(async () => {
    if (remoteBundlr && remoteBundlr.address && WebBundlr) {
      const bal = await webBundlr.current.getBalance(remoteBundlr.address);
      setRemBndlrBal(webBundlr.current.utils.unitConverter(bal));
    }
  },[remoteBundlr]);

  useEffect(() => {
    getRmteBal();
  }, [remoteBundlr, getRmteBal]);

  function parseInput(input) {
    const conv = new BigNumber(input).multipliedBy(
      webBundlr.current.currencyConfig.base[1]

    );
    if (conv.isLessThan(1)) {
      console.log("error: value too small");
      return;
    } else {
      return conv;
    }
  }
  const handleFundAccount = async () => {
    if (!funds) {
      alert("Need a valid fund!");
      return;
    }
    const amountParsed = parseInput(funds);
    let response = await webBundlr.current.fund(amountParsed); // fund amount in ars
    const bal = await webBundlr.current.getLoadedBalance();
    setBalance(utils.formatEther(bal.toString()));
    setFunds("");
  };

  const handleinitRemoteBundrl = async () => {
    const remoteBundlr = await getRemoteBundler();
    setRemoteBundlr(remoteBundlr);
  };

  const uploadFileServer = async () => {
    if (!fileData) {
      alert("Choose a File first!");
      return;
    } else {
      setuploading(true)
      const result= await uploadData(remoteBundlr, webBundlr, file, fileData)
      if (result.status) {
        console.log('result',result)
        setUploads(rest =>[...rest,[result.txid, `https://arweave.net/${result.txid}`]])
        getRmteBal() // finally, display the changed balance of server account
      } else alert('Something went wrong!')
      setuploading(false)
    }

  };
  const handleFileChange = async (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    setFile(file)
    if (file) {
      reader.onloadend = () => {
        if (reader.result) {
          setFileData(Buffer.from(reader.result));
        }
      };
      reader.readAsArrayBuffer(file);
    }
    console.log("file to upload:", file.type);

  };

  const handleConnectMM = async () => {
    if (!window.ethereum) {
      alert("Metamask not found!");
      return;
    }
    await window.ethereum.enable();
    provider.current = new providers.Web3Provider(window.ethereum);
    await provider.current._ready();
    webBundlr.current = new WebBundlr(
      networkConfig.bundlrNetwork,
      networkConfig.currency,
      provider.current
    );
    await webBundlr.current.ready();
    const amountParsed = new BigNumber(funds).multipliedBy(
      webBundlr.current.currencyConfig.base[1]
    );

    let bal0 = await webBundlr.current.getLoadedBalance();
    let bal1 = utils.formatEther(bal0.toString());
    setBalance(bal1);
    setConnected(true);
    setAccount(webBundlr.current.address);
  };

  const UploadButton=({uploading}) => {
    console.log('button')
  if (!uploading) return (     
      <button className={styles.button} onClick={uploadFileServer}>
        Upload via Server
      </button >
      )
      else return (
        <button className={styles.button}>
            <Image className={styles.spinning} alt='iconuploading' src="/whitearrow.png" width={15} height={13}></Image>
          &nbsp; Loading...
        </button>
      )
  };

  if (!connected)
    return (
      <div className={styles.container}>
        <button
          style={{ marginTop: "2em" }}
          className={styles.button}
          onClick={handleConnectMM}
        >
          Connect Wallet
        </button>
      </div>
    );
  else
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ position: 'absolute', 
                      top:'2%', 
                      left:'70%',
                      padding:'0.8em', 
                      marginLeft: "auto", 
                      marginRight: "1em", 
                      backgroundColor:'#d2e2f4' }}>
          <label className={styles.labels} style={{ padding: "0.5em" }}>
            <strong>Web Account: &nbsp;</strong>
            {account.substring(0, 6) +
              "..." +
              account.substring(account.length - 4)}
          </label>
          <label className={styles.labels} style={{ padding: "0.5em" }}>
            <strong>Bundlr&lsquo;s Bal:&nbsp;</strong>{" "}
            {Number(balance).toFixed(5)}
          </label>
          <div>

          {remoteBundlr && (
            <div>
              <label className={styles.labels2} style={{ padding: "0.5em" }}>
                <strong>Server Account: &nbsp;</strong>
                {remoteBundlr.address.substring(0, 6) +
                  "..." +
                  remoteBundlr.address.substring(
                    remoteBundlr.address.length - 4
                  )}
              </label>
              <label className={styles.labels2} style={{ padding: "0.5em" }}>
                <strong>Bundlr&lsquo;s Bal:&nbsp;</strong>
                {Number(remoteBundlrBalance).toFixed(5)}
              </label>
              </div>
          )}
          </div>
          <label className={styles.labels} style={{ padding: "0.5em" }}>
            <strong>Network:&nbsp;</strong>{" "}
            {provider.current.network.name.toUpperCase()}
          </label>
          <br></br>
          <label className={styles.labels} style={{ padding: "0.5em" }}>
            <strong>Bndlr Network:&nbsp;</strong>{" "}
            {networkConfig.bundlrNetwork}
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "25px",
          }}
        >
          <div>
            {!remoteBundlr && (
              <div style={{ margin: "2em" }}>
                <button
                  className={styles.button}
                  onClick={handleinitRemoteBundrl}
                >
                  Initialize Remote Bundlr
                </button>
              </div>
            )}
          </div>
          <div>
            <input
              type="number"
              value={funds}
              style={{
                fontSize: "1.3em",
                height: "1.9em",
                width: "5em",
                marginTop: "0.5em",
                marginLeft: "2em",
                marginRight: "2em",
              }}
              onChange={(e) => setFunds(e.currentTarget.value)}
            ></input>
            <button className={styles.button} onClick={handleFundAccount}>
              Fund Own Web Account
            </button>
          </div>
        </div>
        {remoteBundlr && (
          <div style={{ marginTop: "2em" }}>
            <div style={{ margin: "2em" }}>
              <label className={styles.labels}>File to Upload:</label>
              <input
                style={{
                  margin: "20px",
                  outline: "solid 1px green",
                  width: "50%",
                  fontSize: "1.2rem",
                  background: "#6c92bd",
                  color: "white",
                }}
                type="file"
                onChange={(e) => handleFileChange(e)}
              />
              {fileData && <UploadButton uploading={uploading}/>}
              <div>
                {(uploadedLinks.length!==0) && 
                    <ul style={{listStyleType:'none', fontSize:'1.1em', margin:'3em 8em'}}>
                      <label style={{margin:'2em 0em'}}><strong>Loaded Files Links</strong></label>
                    {uploadedLinks.map((link) => 
                      <li key={link[0]} style={{color:'blue',margin:'1em'}}>
                        <a href={link[1]} target="_blank" rel="noreferrer">
                          {link[1]}
                        </a>
                      </li>
                    )}
                  </ul>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    );


}
