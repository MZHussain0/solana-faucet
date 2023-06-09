﻿import React, { useState, useEffect, FC } from "react";
import { PublicKey } from "@solana/web3.js";
import Airdrop from "./Airdrop";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
}

type WindowWithSolana = Window & {
  solana?: PhantomProvider;
};

const Connect2Phantom: FC = () => {
  const [walletAvail, setWalletAvail] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [pubKey, setPubKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if ("solana" in window) {
      const solWindow = window as WindowWithSolana;
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
        setWalletAvail(true);
        // Attempt eager connection
        solWindow.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, []);

  useEffect(() => {
    provider?.on("connect", (publicKey: PublicKey) => {
      console.log(`connect event: ${publicKey}`);
      setConnected(true);
      setPubKey(publicKey);
    });
    provider?.on("disconnect", () => {
      console.log("disconnect event");
      setConnected(false);
      setPubKey(null);
    });
  }, [provider]);

  const connectHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("connect Handler");
    provider?.connect().catch((err) => console.log("connection error", err));
  };

  const disconnectHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("disconnect Handler");
    provider
      ?.disconnect()
      .catch((err) => console.log("disconnection error", err));
  };

  return (
    <div className="card">
      {walletAvail ? (
        <>
          <button disabled={connected} onClick={connectHandler}>
            Connect to Phantom
          </button>
          <button disabled={!connected} onClick={disconnectHandler}>
            Disconnect from Phantom
          </button>
          <hr />
          {connected && pubKey ? <Airdrop pubkey={pubKey} /> : null}
        </>
      ) : (
        <>
          <p>
            Opps!!! Phantom is not available. Go get it{" "}
            <a href="https://phantom.app/">https://phantom.app/</a>.
          </p>
          <p>
            before moving forward make sure to Install Phantom chrome extension.
            Create a solana wallet and change the connection from mainnet to
            devnet.
          </p>
        </>
      )}
    </div>
  );
};

export default Connect2Phantom;
