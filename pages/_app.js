import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_APP_ID || ""}
        serverUrl={process.env.NEXT_PUBLIC_SERVER_URL || ""}
      >
        <Component {...pageProps} />
      </MoralisProvider>
    </RecoilRoot>
  );
}
export default MyApp;
