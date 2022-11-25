import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import react from 'react';
// own css files here
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import Head from "next/head";


const { chains, provider } = configureChains(
  [
    chain.polygonMumbai,
  ],
  [

    jsonRpcProvider({
      rpc: () => {
        return {
          http: "https://rpc.ankr.com/polygon_mumbai",
        };
      },
    }),
    publicProvider(),

  ]
);
const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = react.useState(false);
  react.useEffect(() => setMounted(true), []);
  if (!mounted) return null
  return (
    <>

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider showRecentTransactions={true} chains={chains}>
          <Component {...pageProps} />
     
        </RainbowKitProvider>
      </WagmiConfig>
    </>

  )
}
