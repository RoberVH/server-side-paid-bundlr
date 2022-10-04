import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
  <div>
    <h1 style={{textAlign:'center'}}>Bundler File Uploader</h1>
    <h2 style={{textAlign:'center'}}>Server Side Payments</h2>
    <Component {...pageProps} />
  </div>
  )
}

export default MyApp
