import React, { useRef, useEffect, useState, FC } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  RpcResponseAndContext,
  SignatureResult,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface AirdropProps {
  pubkey: PublicKey;
}

const network = "devnet";

const Airdrop: FC<AirdropProps> = ({ pubkey }) => {
  // Create a connection to blockchain and
  // make it persistent across renders
  const connection = useRef(new Connection(clusterApiUrl(network)));

  const [publickey] = useState<string>(pubkey.toBase58());
  const [lamports, setLamports] = useState(1);
  const [txid, setTxid] = useState<string | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);

  // Retrieve the balance when mounting the component
  useEffect(() => {
    connection.current.getBalance(pubkey).then(setBalance);
  }, [pubkey]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLamports(parseInt(event.target.value));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    pubkey &&
      connection.current
        .requestAirdrop(pubkey, LAMPORTS_PER_SOL)
        .then((id: string) => {
          console.log(`Transaction ID ${id}`);
          setTxid(id);
          connection.current
            .confirmTransaction(id)
            .then((confirmation: RpcResponseAndContext<SignatureResult>) => {
              console.log(`Confirmation slot: ${confirmation.context.slot}`);
              setSlot(confirmation.context.slot);
              connection.current.getBalance(pubkey).then(setBalance);
            });
        })
        .catch(console.error);
  }

  return (
    <div>
      <p className="p15">&nbsp;</p>
      <form onSubmit={handleSubmit}>
        <label>Public Key to receive airdrop</label>
        <br />
        <input
          type="text"
          readOnly={true}
          value={publickey}
          className="input-text"
        />
        <br />
        <label>SOLs to request</label>
        <br />
        <input
          type="number"
          value={lamports}
          onChange={handleChange}
          className="input-text"
        />
        <br />
        <input
          type="submit"
          value="request airdrop!"
          className="input-submit"
        />
      </form>
      <p className="p15">&nbsp;</p>
      <hr />
      {txid ? <p>Transaction: {txid}</p> : null}
      {slot ? <p>Confirmation slot: {slot}</p> : null}
      <hr />
      <p>Your current balance is: {balance / Math.pow(10, 9)}</p>
    </div>
  );
};

export default Airdrop;
