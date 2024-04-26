// Next, React
import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import Minter from "components/Minter";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <div className="text-sm font-normal align-bottom text-right text-slate-600 mt-4">
            v{pkg.version}
          </div>
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Mint on Solana with Metaplex umi
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>Fork from </p>
          <a
            className="text-slate-500 text-2x1 leading-relaxed"
            href="https://github.com/solana-labs/dapp-scaffold"
            target="_blank"
            rel="noreferrer"
          >
            solana-labs/dapp-scaffold.
          </a>
        </h4>
        <div className="flex flex-col mt-2">
          {!wallet.connected && (
            <>
              <h4 className="md:w-full text-2xl text-slate-300 my-2">
                STEP 1: Click on top right corner "Connect Wallet" <br /> to
                connect your wallet.
              </h4>
            </>
          )}
          {wallet.connected && balance === 0 && (
            <>
              <h4 className="md:w-full text-2xl text-slate-300 my-2">
                STEP 2: GET SOME AIRDROP
              </h4>
              <RequestAirdrop />
            </>
          )}
          {wallet.connected && balance > 0 && (
            <h4 className="md:w-full text-2xl text-slate-300 my-2">
              <div className="flex flex-row justify-center">
                <div className="text-slate-600 mr-2">Your Balance: </div>
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL</div>
                <RequestAirdrop />
              </div>
              <div>
                STEP 4: Click "Start Mint" button to mint your NFT.
                <Minter />
              </div>
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};
