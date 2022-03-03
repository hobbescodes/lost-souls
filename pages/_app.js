import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_APP_ID || ""}
        serverUrl={process.env.NEXT_PUBLIC_SERVER_URL || ""}
      >
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </MoralisProvider>
    </ThemeProvider>
  );
}
export default MyApp;
