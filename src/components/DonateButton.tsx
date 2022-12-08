import axios from "axios";

export default function DonateButton(props: any) {
  const { orgAddress } = props;

  const donate = async () => {
    await axios.post("/api/donate", {
      address: orgAddress,
    });
  };

  return (
    <button
      className="rounded-full bg-indigo-500 px-5 py-2 mt-5 text-white"
      onClick={donate}
    >
      Donate
    </button>
  );
}
