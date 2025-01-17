import axios from "axios";
import { useState, useEffect, Context } from "react";
import LoginButton from "./components/LoginButton.js";
import DonateButton from "./components/DonateButton.js";
// import ModalDonate from "../../components/ModalDonate"
import DonateForm from "./components/DonateForm/index.js";
import { useParams } from "react-router-dom";

export default function Organization(props: any) {
  const [claimedAddress, setClaimedAddress] = useState();
  const [userAddress, setUserAddress] = useState();
  const [connection, setConnection] = useState();
  const  params  = useParams();

  async function callEIN() {

    const response = await axios.post("http://localhost:3001/api/ein-subgraph", { params }, {
        headers: {
          // 'application/json' is the modern content-type for JSON, but some
          // older servers may use 'text/json'.
          'content-type': 'application/json'
        },
        params: {
          input: params.ein
        }
        });

    const address = response.data;

    if (address.length !== 0) {
      setClaimedAddress(address[0].address);
    }
  }

  useEffect(() => {
    callEIN();
  }, [claimedAddress]);

  return (
    <div className="container-md p-10">
      <main className="text-center">
        {/* <h1 className="text-3xl mb-4">{orgData.charityName}</h1>
        <ul>
          <li>Sector: {orgData.irsClassification.nteeType}</li>
          <li>EIN: {orgData.ein}</li>
          <li>City: {orgData.mailingAddress.city}</li>
          <li>
            Charity Navigator URL:{" "}
            <a
              href={orgData.charityNavigatorURL}
              className="text-blue-500 hover:text-blue-700"
            >
              {orgData.charityNavigatorURL}
            </a>
          </li>
        </ul> */}
        {userAddress ? (
          <DonateButton orgAddress={claimedAddress} />
        ) : (
          <LoginButton setUserAddress={setUserAddress} />
        )}
        <DonateForm orgData={params.ein} address={claimedAddress} />

        <p className="text-3xl">Claimed Org Address: {claimedAddress} </p>
        <p>User Wallet Address: {userAddress}</p>
        {/* <ModalDonate /> */}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { ein } = context.params;
  const { data } = await axios.get(
    `https://api.data.charitynavigator.org/v2/Organizations/${ein}`,
    {
      params: {
        app_id: process.env.CHARITY_APP_ID,
        app_key: process.env.CHARITY_API_KEY,
        ein: ein,
      },
    }
  );

  return {
    props: {
      orgData: data,
    },
  };
}
