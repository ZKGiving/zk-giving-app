import { DONATION_BRIDGE_CONTRACT } from "../../config/goerli.json";
import donationBridgeABI from "../../abis/donationBridgeABI.json";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";
import { ethers } from "ethers";

export default async function handler(req, res) {
  const { address } = req.body;
  console.log(address)

  try {
    const abi = donationBridgeABI;
    const intrfc = new ethers.utils.Interface(abi);

    const credentials = {
      apiKey: process.env.RELAYER_API_KEY,
      apiSecret: process.env.RELAYER_SECRET,
    };

    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {
      speed: "fast",
    });

    const donationBridge = new ethers.Contract(
      DONATION_BRIDGE_CONTRACT,
      abi,
      signer
    );
    const tx = await donationBridge.listDonee(address);
    const receipt = await tx.wait();
    const parsedLog = intrfc.parseLog(receipt.logs[0]);
    const doneeId = parseInt(parsedLog.args.index._hex, 16);

    console.log(doneeId)

    //use doneeId as input for BridgeCallData with AztecConnect

    res.status(200).json("success");
  } catch (e) {
    console.log("ERROR: ", e);
    res.status(500).json(e);
  }
}
