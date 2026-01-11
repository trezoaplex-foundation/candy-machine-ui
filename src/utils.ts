import * as trezoa from "@trezoa-serum/trezoa";
import { TOKEN_PROGRAM_ID } from "@trezoa/tpl-token";
import { SystemProgram } from "@trezoa/web3.js";
import {
  LAMPORTS_PER_TRZ,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@trezoa/web3.js";

export interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
  hideDuration?: number | null;
}

export const toDate = (value?: trezoa.BN) => {
  if (!value) {
    return;
  }

  return new Date(value.toNumber() * 1000);
};

const numberFormater = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = {
  format: (val?: number) => {
    if (!val) {
      return "--";
    }

    return numberFormater.format(val);
  },
  asNumber: (val?: trezoa.BN) => {
    if (!val) {
      return undefined;
    }

    return val.toNumber() / LAMPORTS_PER_TRZ;
  },
};

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID =
  new trezoa.web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

export const CIVIC = new trezoa.web3.PublicKey(
  "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"
);

export const CIVIC_GATEKEEPER_NETWORK =
  "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6";

export const getAtaForMint = async (
  mint: trezoa.web3.PublicKey,
  buyer: trezoa.web3.PublicKey
): Promise<[trezoa.web3.PublicKey, number]> => {
  return await trezoa.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

export const getNetworkExpire = async (
  gatekeeperNetwork: trezoa.web3.PublicKey
): Promise<[trezoa.web3.PublicKey, number]> => {
  return await trezoa.web3.PublicKey.findProgramAddress(
    [gatekeeperNetwork.toBuffer(), Buffer.from("expire")],
    CIVIC
  );
};

export const getNetworkToken = async (
  wallet: trezoa.web3.PublicKey,
  gatekeeperNetwork: trezoa.web3.PublicKey
): Promise<[trezoa.web3.PublicKey, number]> => {
  return await trezoa.web3.PublicKey.findProgramAddress(
    [
      wallet.toBuffer(),
      Buffer.from("gateway"),
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
      gatekeeperNetwork.toBuffer(),
    ],
    CIVIC
  );
};

export function createAssociatedTokenAccountInstruction(
  associatedTokenAddress: trezoa.web3.PublicKey,
  payer: trezoa.web3.PublicKey,
  walletAddress: trezoa.web3.PublicKey,
  splTokenMintAddress: trezoa.web3.PublicKey
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
}
