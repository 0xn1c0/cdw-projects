import type { AppProps } from "next/app";
import { ThirdwebProvider, metamaskWallet, walletConnect } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { chain } from "../config/parameters"

function CdwMint({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={chain} supportedWallets={[metamaskWallet(),walletConnect()]}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default CdwMint;
