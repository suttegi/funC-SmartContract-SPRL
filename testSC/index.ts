import { getHttpEndpoint } from "@orbs-network/ton-access";
import { fromNano, internal, TonClient, WalletContractV4 } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";
import { Address } from "ton";
import { beginCell, contractAddress } from "ton-core";

async function main() {
  const mnemonic = "";
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const endpoint = await getHttpEndpoint({ network: "mainnet" });
  const client = new TonClient({ endpoint });

  console.log(wallet);
  console.log(wallet.address);

  // console.log(wallet)
  if (!(await client.isContractDeployed(wallet.address))) {
    return console.log("wallet is not deployed");
  }
  console.log("wallet deployed");

  console.log(wallet.address);
  const balance = await client.getBalance(wallet.address);
  console.log("balance: ", fromNano(balance));

  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        // non-bounceable mainnet or testnet wallet address
        to: "",
        value: "0.05",
        body: "meow",
        bounce: false,
      }),
    ],
  });
  let currentSegno = seqno;
  while (currentSegno == seqno) {
    console.log("waiting");
    await sleep(5000);
    currentSegno = await walletContract.getSeqno();
  }
  console.log("finally");
  // check the transfer using testnet bounceable
}

main();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
