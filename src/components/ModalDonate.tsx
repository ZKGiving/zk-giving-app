// import { useEffect, useState } from "react";
// import React from "react";
// import Popup from "reactjs-popup";
// import { ethers } from "ethers";
// // import {
// //   AztecSdk,
// //   createAztecSdk,
// //   EthersAdapter,
// //   EthereumProvider,
// //   SdkFlavour,
// //   AztecSdkUser,
// //   GrumpkinAddress,
// //   SchnorrSigner,
// //   EthAddress,
// //   TxSettlementTime,
// //   BridgeCallData,
// //   TxId,
// // } from "@aztec/sdk";
// // import axios from "axios";

// // import { depositEthToAztec, registerAccount, aztecConnect } from "../aztec/utils";
// // import donationBridgeABI from "../abis/donationBridgeABI.json"

// type SchnorrSigner = typeof SchnorrSigner;
// type GrumpkinAddress = typeof GrumpkinAddress;
// type AztecSdk = typeof AztecSdk;
// type AztecSdkUser = typeof AztecSdkUser;
// type TxId = typeof TxId;
// type EthereumProvider = typeof EthereumProvider;
// type BridgeCallData = typeof BridgeCallData;

// // PSEUDO CODE
// // 1. Imports not working correctly?
// // 2. Import via Props state from Parent (Organization)
// // 3. On Modal setup, hit connect() which initializes SDK
// // 4. User hits 'Shield ETH' which hits depositEth()
// // 5. Once ETH is Shielded , 'Send ETH' button appears (IF zkEth > 0)
// // 6. logBalance() (name to be changed) polls Aztec rollup every 1-3s to see if balance has changed?

// export default function ModalDonate(props: any) {
//   const [hasMetamask, setHasMetamask] = useState(false);
//   // const [ethAccount, setEthAccount] = useState<EthAddress | null>(null);
//   const [initing, setIniting] = useState(false);
//   const [sdk, setSdk] = useState<null | AztecSdk>(null);
//   const [account0, setAccount0] = useState<AztecSdkUser | null>(null);
//   const [userExists, setUserExists] = useState<boolean>(false);
//   const [accountPrivateKey, setAccountPrivateKey] = useState<Buffer | null>(
//     null
//   );
//   const [accountPublicKey, setAccountPublicKey] =
//     useState<GrumpkinAddress | null>(null);
//   const [spendingSigner, setSpendingSigner] = useState<
//     SchnorrSigner | undefined
//   >(undefined);
//   const [alias, setAlias] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [txId, setTxId] = useState<TxId | null>(null);
//   const [zkETH, setZkETH] = useState(0);

//   const { connection, userAddress, claimedAddress } = props;

//   async function connect() {
//     try {
//       if (connection !== undefined) {
//         setIniting(true); // Start init status

//         // Get Metamask provider
//         // TODO: Show error if Metamask is not on Aztec Testnet
//         const provider = new ethers.providers.Web3Provider(connection);
//         const ethereumProvider: EthereumProvider = new EthersAdapter(provider);

//         // Get Metamask ethAccount
//         // await provider.send("eth_requestAccounts", []);
//         // const mmSigner = provider.getSigner();
//         // const mmAddress = EthAddress.fromString(await mmSigner.getAddress());
//         // setEthAccount(mmAddress);

//         // Initialize SDK
//         const sdk = await createAztecSdk(ethereumProvider, {
//           serverUrl: "https://api.aztec.network/aztec-connect-testnet/falafel", // Testnet
//           pollInterval: 1000,
//           memoryDb: true,
//           debug: "bb:*",
//           flavour: SdkFlavour.PLAIN,
//           minConfirmation: 1, // ETH block confirmations
//         });
//         await sdk.run();
//         console.log("Aztec SDK initialized:", sdk);
//         setSdk(sdk);

//         // Generate user's privacy keypair
//         // The privacy keypair (also known as account keypair) is used for en-/de-crypting values of the user's spendable funds (i.e. balance) on Aztec
//         // It can but is not typically used for receiving/spending funds, as the user should be able to share viewing access to his/her Aztec account via sharing his/her privacy private key
//         const { publicKey: accPubKey, privateKey: accPriKey } =
//           await sdk.generateAccountKeyPair(userAddress);
//         console.log("Privacy Key:", accPriKey);
//         console.log("Public Key:", accPubKey.toString());
//         setAccountPrivateKey(accPriKey);
//         setAccountPublicKey(accPubKey);
//         if (await sdk.isAccountRegistered(accPubKey)) setUserExists(true);

//         // Get or generate Aztec SDK local user
//         let account0 = (await sdk.userExists(accPubKey))
//           ? await sdk.getUser(accPubKey)
//           : await sdk.addUser(accPriKey);
//         setAccount0(account0);

//         // Generate user's spending key & signer
//         // The spending keypair is used for receiving/spending funds on Aztec
//         const { privateKey: spePriKey } = await sdk.generateSpendingKeyPair(
//           userAddress
//         );

//         const schSigner = await sdk?.createSchnorrSigner(spePriKey);
//         console.log("Signer:", schSigner);
//         setSpendingSigner(schSigner);

//         setIniting(false); // End init status
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async function depositEth() {
//     try {
//       const depositTokenQuantity: bigint = ethers.utils
//         .parseEther(amount.toString())
//         .toBigInt();

//       // let txId = await depositEthToAztec(
//       //   userAddress!,
//       //   accountPublicKey!,
//       //   depositTokenQuantity,
//       //   TxSettlementTime.NEXT_ROLLUP,
//       //   sdk!
//       // );

//       console.log("Deposit TXID:", txId);
//       console.log(
//         "View TX on Explorer:",
//         `https://aztec-connect-testnet-explorer.aztec.network/tx/${txId.toString()}`
//       );
//       setTxId(txId);
//       const qtyZkETH = sdk!.fromBaseUnits(
//         await sdk!.getBalance(account0!.id, sdk!.getAssetIdBySymbol("eth"))
//       );
//       setZkETH(parseInt(qtyZkETH));
//     } catch (e) {
//       console.log(e); // e.g. depositTokenQuantity = 0
//     }
//   }

//   // *** ATTENTION ***
//   // This is the testnet function for donating once ETH is Shielded

//   async function testnetDonate() {
//     const provider = new ethers.providers.Web3Provider(connection);
//     const mmSigner = provider.getSigner();
//     console.log(mmSigner);

//     // Input Address of Testnet Donation Bridge
//     const contract = new ethers.Contract("", donationBridgeABI, provider);
//     // ID provided for auxData
//     const id = await contract.listDonee(userAddress);

//     const fees = await getFees(16, "ETH", "ETH", id, TxSettlementTime);

//     try {
//       const fromAmount: bigint = ethers.utils
//         .parseEther(amount.toString())
//         .toBigInt();

//       // let txId = await aztecConnect(
//       //   account0!,
//       //   spendingSigner!,
//       //   16, // Testnet bridge id of CurveStEthBridge
//       //   fromAmount,
//       //   "ETH",
//       //   "ETH",
//       //   undefined,
//       //   undefined,
//       //   id, // ID of Org Address
//       //   TxSettlementTime.NEXT_ROLLUP,
//       //   sdk!
//       // );

//       console.log("Bridge TXID:", txId);
//       console.log(
//         "View TX on Explorer:",
//         `https://aztec-connect-testnet-explorer.aztec.network/tx/${txId.toString()}`
//       );
//       setTxId(txId);
//     } catch (e) {
//       console.log(e); // e.g. fromAmount > user's balance
//     }
//   }

//   // *** ATTENTION ***
//   // Mainnet function for donating
//   async function mainnetDonate() {
//     const donateID: any = await axios.post("/api/donate", {
//       address: claimedAddress,
//     });

//     try {
//       const fromAmount: bigint = ethers.utils
//         .parseEther(amount.toString())
//         .toBigInt();

//       // let txId = await aztecConnect(
//       //   account0!,
//       //   spendingSigner!,
//       //   16, // Will need to deploy bridge to get Brdige ID
//       //   fromAmount,
//       //   "ETH",
//       //   "ETH",
//       //   undefined,
//       //   undefined,
//       //   donateID, // ID to be passed to rollup
//       //   TxSettlementTime.NEXT_ROLLUP,
//       //   sdk!
//       // );

//       console.log("Bridge TXID:", txId);
//       console.log(
//         "View TX on Explorer:",
//         `https://aztec-connect-testnet-explorer.aztec.network/tx/${txId.toString()}`
//       );
//       setTxId(txId);
//     } catch (e) {
//       console.log(e); // e.g. fromAmount > user's balance
//     }
//   }

//   async function logBalance() {
//     // Wait for the SDK to read & decrypt notes to get the latest balances
//     await account0!.awaitSynchronised();
//     console.log(
//       "Balance: zkETH -",
//       sdk!.fromBaseUnits(
//         await sdk!.getBalance(account0!.id, sdk!.getAssetIdBySymbol("eth"))
//       ),
//       ", wstETH -",
//       sdk!.fromBaseUnits(
//         await sdk!.getBalance(account0!.id, sdk!.getAssetIdBySymbol("wsteth"))
//       )
//     );
//   }

//   async function getFees(
//     bridgeId: number,
//     inputAssetIdA: any,
//     outputAssetIdA: any,
//     auxData: number,
//     settlementTime: any
//   ) {
//     const bridgeCallData = new BridgeCallData(
//       bridgeId,
//       inputAssetIdA,
//       outputAssetIdA,
//       auxData
//     );

//     const fee = (await sdk.getDefiFees(bridgeCallData))[settlementTime];

//     return fee;
//   }

//   // REACT POPUP:
//   // https://react-popup.elazizi.com/getting-started
//   return (
//     <>
//       <div>
//         <Popup
//           trigger={<button className="button"> Open Modal </button>}
//           position="center center"
//           modal
//         >
//           <div>
//             <button
//               onClick={connect}
//               className="rounded-full bg-indigo-500 px-5 py-2 mt-5 text-white"
//             >
//               Connect to Aztec Network
//             </button>
//             <button
//               onClick={depositEth}
//               className="rounded-full bg-indigo-500 px-5 py-2 mt-5 text-white"
//             >
//               Shield ETH
//             </button>

//             <button
//               onClick={testnetDonate}
//               className="rounded-full bg-indigo-500 px-5 py-2 mt-5 text-white"
//             >
//               Donate to Nonprofit
//             </button>
//           </div>
//         </Popup>
//       </div>
//     </>
//   );
// }
