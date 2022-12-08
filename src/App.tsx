import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  AztecSdk,
  createAztecSdk,
  EthersAdapter,
  EthereumProvider,
  SdkFlavour,
  AztecSdkUser,
  GrumpkinAddress,
  SchnorrSigner,
  EthAddress,
  TxSettlementTime,
  TxId,
} from "@aztec/sdk";
import Searchbar from "./components/Searchbar.js";
import Hero from "./components/sections/Hero.js";
import About from "./components/sections/About.js";
import Learn from "./components/sections/Learn.js";
import Partners from "./components/sections/Partners.js";

import { depositEthToAztec, registerAccount, aztecConnect } from "./utils.js";
import { fetchBridgeData } from "./bridge-data.js";

declare var window: any;

const App = () => {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [ethAccount, setEthAccount] = useState<EthAddress | null>(null);
  const [initing, setIniting] = useState(false);
  const [sdk, setSdk] = useState<null | AztecSdk>(null);
  const [account0, setAccount0] = useState<AztecSdkUser | null>(null);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [accountPrivateKey, setAccountPrivateKey] = useState<Buffer | null>(
    null
  );
  const [accountPublicKey, setAccountPublicKey] =
    useState<GrumpkinAddress | null>(null);
  const [spendingSigner, setSpendingSigner] = useState<
    SchnorrSigner | undefined
  >(undefined);
  const [alias, setAlias] = useState("");
  const [amount, setAmount] = useState(0);
  const [txId, setTxId] = useState<TxId | null>(null);

  // Metamask Check
  useEffect(() => {
    if (window.ethereum) {
      setHasMetamask(true);
    }
    window.ethereum.on("accountsChanged", () => window.location.reload());
  }, []);

  async function connect() {
    try {
      if (window.ethereum) {
        setIniting(true); // Start init status

        // Get Metamask provider
        // TODO: Show error if Metamask is not on Aztec Testnet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const ethereumProvider: EthereumProvider = new EthersAdapter(provider);

        // Get Metamask ethAccount
        await provider.send("eth_requestAccounts", []);
        const mmSigner = provider.getSigner();
        const mmAddress = EthAddress.fromString(await mmSigner.getAddress());
        setEthAccount(mmAddress);

        // Initialize SDK
        const sdk = await createAztecSdk(ethereumProvider, {
          serverUrl: "https://api.aztec.network/aztec-connect-testnet/falafel", // Testnet
          pollInterval: 1000,
          memoryDb: true,
          debug: "bb:*",
          flavour: SdkFlavour.PLAIN,
          minConfirmation: 1, // ETH block confirmations
        });
        await sdk.run();
        console.log("Aztec SDK initialized:", sdk);
        setSdk(sdk);

        // Generate user's privacy keypair
        // The privacy keypair (also known as account keypair) is used for en-/de-crypting values of the user's spendable funds (i.e. balance) on Aztec
        // It can but is not typically used for receiving/spending funds, as the user should be able to share viewing access to his/her Aztec account via sharing his/her privacy private key
        const { publicKey: accPubKey, privateKey: accPriKey } =
          await sdk.generateAccountKeyPair(mmAddress);
        console.log("Privacy Key:", accPriKey);
        console.log("Public Key:", accPubKey.toString());
        setAccountPrivateKey(accPriKey);
        setAccountPublicKey(accPubKey);
        if (await sdk.isAccountRegistered(accPubKey)) setUserExists(true);

        // Get or generate Aztec SDK local user
        let account0 = (await sdk.userExists(accPubKey))
          ? await sdk.getUser(accPubKey)
          : await sdk.addUser(accPriKey);
        setAccount0(account0);

        // Generate user's spending key & signer
        // The spending keypair is used for receiving/spending funds on Aztec
        const { privateKey: spePriKey } = await sdk.generateSpendingKeyPair(
          mmAddress
        );
        const schSigner = await sdk?.createSchnorrSigner(spePriKey);
        console.log("Signer:", schSigner);
        setSpendingSigner(schSigner);

        setIniting(false); // End init status
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Registering on Aztec enables the use of intuitive aliases for fund transfers
  // It registers an human-readable alias with the user's privacy & spending keypairs
  // All future funds transferred to the alias would be viewable with the privacy key and spendable with the spending key respectively
  async function registerNewAccount() {
    try {
      const depositTokenQuantity: bigint = ethers.utils
        .parseEther(amount.toString())
        .toBigInt();

      const txId = await registerAccount(
        accountPublicKey!,
        alias,
        accountPrivateKey!,
        spendingSigner!.getPublicKey(),
        "eth",
        depositTokenQuantity,
        TxSettlementTime.NEXT_ROLLUP,
        ethAccount!,
        sdk!
      );

      console.log("Registration TXID:", txId);
      console.log(
        "View TX on Explorer:",
        `https://aztec-connect-testnet-explorer.aztec.network/tx/${txId.toString()}`
      );
      setTxId(txId);
    } catch (e) {
      console.log(e); // e.g. Reject TX
    }
  }

  async function depositEth() {
    try {
      const depositTokenQuantity: bigint = ethers.utils
        .parseEther(amount.toString())
        .toBigInt();

      let txId = await depositEthToAztec(
        ethAccount!,
        accountPublicKey!,
        depositTokenQuantity,
        TxSettlementTime.NEXT_ROLLUP,
        sdk!
      );

      console.log("Deposit TXID:", txId);
      console.log(
        "View TX on Explorer:",
        `https://aztec-connect-testnet-explorer.aztec.network/tx/${txId.toString()}`
      );
      setTxId(txId);
    } catch (e) {
      console.log(e); // e.g. depositTokenQuantity = 0
    }
  }

  async function bridgeCrvLido() {
    try {
      const fromAmount: bigint = ethers.utils
        .parseEther(amount.toString())
        .toBigInt();

      let txId = await aztecConnect(
        account0!,
        spendingSigner!,
        6, // Testnet bridge id of CurveStEthBridge
        fromAmount,
        "ETH",
        "WSTETH",
        undefined,
        undefined,
        1e18, // Min acceptable amount of stETH per ETH
        TxSettlementTime.NEXT_ROLLUP,
        sdk!
      );

      console.log("Bridge TXID:", txId);
      console.log(
        "View TX on Explorer:",
        `https://aztec-connect-testnet-explorer.aztec.network/tx/${txId.toString()}`
      );
      setTxId(txId);
    } catch (e) {
      console.log(e); // e.g. fromAmount > user's balance
    }
  }

  async function logBalance() {
    // Wait for the SDK to read & decrypt notes to get the latest balances
    await account0!.awaitSynchronised();
    console.log(
      "Balance: zkETH -",
      sdk!.fromBaseUnits(
        await sdk!.getBalance(account0!.id, sdk!.getAssetIdBySymbol("eth"))
      ),
      ", wstETH -",
      sdk!.fromBaseUnits(
        await sdk!.getBalance(account0!.id, sdk!.getAssetIdBySymbol("wsteth"))
      )
    );
  }

  async function logBridges() {
    const bridges = await fetchBridgeData();
    console.log("Known bridges on Testnet:", bridges);
  }

  return (
    <div className="bg-gradient-to-t from-[#101FCA] via-lavandar/25 to-white">
      <head>
        <title>ZK Giving</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <main className="xl:max-w-[1280px] w-[90%] mx-auto">
        <Hero />
        <Learn />
        <Searchbar />
        <About />
        <Partners />
      </main>
    </div>
  );
};

export default App;
