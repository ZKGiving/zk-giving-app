import { ethers } from "ethers";
const Web3Modal = require('web3modal');

export default function LoginButton(props: any) {
  const { setUserAddress } = props;

  async function login() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    setUserAddress(await signer.getAddress());
  }

  return (
    <button
      onClick={login}
      className="rounded-full bg-indigo-500 px-5 py-2 mt-5 text-white"
    >
      Connect Wallet
    </button>
  );
}
