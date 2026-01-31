import "./App.css";
import { useMemo } from "react";
import * as trezoa from "@trezoa-serum/trezoa";
import Home from "./Home";
import { DEFAULT_TIMEOUT } from "./connection";
import { clusterApiUrl } from "@trezoa/web3.js";
import { WalletAdapterNetwork } from "@trezoa/wallet-adapter-base";

import {
  ConnectionProvider,
  WalletProvider,
} from "@trezoa/wallet-adapter-react";
import { WalletDialogProvider } from "@trezoa/wallet-adapter-material-ui";

import { createTheme, ThemeProvider } from "@mui/material";
import { PhantomWalletAdapter } from "@trezoa/wallet-adapter-phantom";
import { SlopeWalletAdapter } from "@trezoa/wallet-adapter-slope";
import { SolflareWalletAdapter } from "@trezoa/wallet-adapter-trzflare";
import {
  SolletWalletAdapter,
  SolletExtensionWalletAdapter,
} from "@trezoa/wallet-adapter-trzlet";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const getCandyMachineId = (): trezoa.web3.PublicKey | undefined => {
  try {
    return new trezoa.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
  } catch (e) {
    console.log("Failed to construct CandyMachineId", e);
    return undefined;
  }
};

let error: string | undefined = undefined;

if (process.env.REACT_APP_SOLANA_NETWORK === undefined) {
  error =
    "Your REACT_APP_SOLANA_NETWORK value in the .env file doesn't look right! The options are devnet and mainnet-beta!";
} else if (process.env.REACT_APP_SOLANA_RPC_HOST === undefined) {
  error =
    "Your REACT_APP_SOLANA_RPC_HOST value in the .env file doesn't look right! Make sure you enter it in as a plain-text url (i.e., https://trezoaplex.devnet.rpcpool.com/)";
}

const candyMachineId = getCandyMachineId();
const network = (process.env.REACT_APP_SOLANA_NETWORK ??
  "devnet") as WalletAdapterNetwork;
const rpcHost =
  process.env.REACT_APP_SOLANA_RPC_HOST ?? trezoa.web3.clusterApiUrl("devnet");
const connection = new trezoa.web3.Connection(rpcHost);

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SlopeWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            <Home
              candyMachineId={candyMachineId}
              connection={connection}
              txTimeout={DEFAULT_TIMEOUT}
              rpcHost={rpcHost}
              network={network}
              error={error}
            />
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
