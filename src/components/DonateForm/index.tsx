import React, { FC, useState } from "react";
import Deposit from "./Deposit.js";
import Donate from "./Donate.js"
import Confirmation from "./Confirmation.js";

type Props = {
  orgData: any;
  address: string | undefined;
};

const DonateForm: FC<Props> = ({ orgData, address }) => {
  const [depositAmount, setDepositAmount] = useState("0.01");
  const [donationAmount, setDonationAmount] = useState("0.01");
  const [step, setStep] = useState(1);

  function nextStep() {
    setStep(step + 1);
  }

  function previousStep() {
    setStep(step - 1);
  }

  function renderFormComponent() {
    switch (step) {
      case 1:
        return <Deposit orgData={orgData} nextStep={nextStep} depositAmount={depositAmount} setDepositAmount={setDepositAmount} />;
      case 2:
        return <Donate orgData={orgData} nextStep={nextStep} donationAmount={donationAmount} setDonationAmount={setDonationAmount} address={address} />;
      case 3:
        return <Confirmation orgData={orgData} donationAmount={donationAmount} />
    }
  }
  return (
    <div className="p-8 rounded-lg w-[600px] minH-[450px] border border-[#CDD1FF] z-50">
      {renderFormComponent()}
    </div>
  );
};

export default DonateForm;
