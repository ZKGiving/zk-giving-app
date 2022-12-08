import { useState } from "react";

import axios from "axios";
import {Link} from "react-router-dom";

export default function Searchbar() {
  const [searchInput, setSearchInput] = useState("");
  const [orgs, setOrgs] = useState([]);

  const searchOrgs = async () => {
    console.log(process.env.REACT_APP_CHARITY_APP_ID)
    axios.defaults.headers["content-type"] = "application/json";

    const { data } = await axios({
      method: "get",
      url: "https://api.data.charitynavigator.org/v2/Organizations",
        params: {
          app_id: process.env.CHARITY_APP_ID,
          app_key: process.env.CHARITY_API_KEY,
          search: searchInput,
          searchType: "NAME_ONLY",
          rated:1,
          pageSize: 100,
          sort:"RELEVANCE:DESC",
          sizeRange: 3,
        },
      }
    );

    if (data.organizations) {
      setOrgs(data.organizations);
    } else {
      setOrgs([]);
    }
  };

  const renderOrgs = () => {
    return orgs.map((org: any) => {
      return (
        <li className="p-3 border-b-[1px] border-lavendar">
          <Link
            to={`/organizations/${org.ein}`}
            className="font-bold text-royal-purple hover:text-royal-purple/75"
          >
            {org.charityName}
          </Link>
        </li>
      );
    });
  };

  return (
    <section className="mt-[50px] lg:mt-[100px]">
      <div className="w-full lg:w-[800px] mx-auto py-[60px] px-[40px] bg-white shadow-md border-2 border-bright-purple/15 shadow-bright-purple/15 rounded-lg">
        <div className="flex flex-col lg:flex-row text-center lg:text-left lg:justify-start items-center">
          <div className="w-full">
            <h4 className="mb-5 text-3xl text-dark-purple">
              Non-profit search
            </h4>
            <p className="text-base lg:text-base-xl w-full mx-auto lg:mx-0 md:w-[80%] text-royal-purple">
              Lorem ipsum dolor sit amet consectetur. Fringilla at.
            </p>
          </div>
          <div className="flex w-full items-center">
            <div className="relative mx-auto w-full md:w-[65%] lg:w-full">
              <div className="relative">
                <input
                  className="border-2 w-full rounded-lg text-left focus:ring-royal-purple focus:border-royal-purple block w-full p-2.5 mt-0.5"
                  placeholder="Search for a non-profit"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                ></input>
                {orgs.length ? (
                  <div className="absolute mt-2 my-0 w-full bg-white shadow-lg rounded-b1 rounded-lg max-h-36 overflow-y-auto">
                    <p className="text-dark-purple p-2 border-b-[1px] ">Non-profits</p>
                      <ul>{renderOrgs()}</ul>
                  </div>
                ) : (
                  <p></p>
                )}{" "}
              </div>
              <button
                onClick={searchOrgs}
                className="w-full md:w-auto bg-bright-purple hover:bg-bright-purple/70 mt-4 text-white rounded-full px-[46px] py-[10px]"
                
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[50px] lg:mt-[100px] border-b-2 border-bg-lavandar" />
    </section>
  );
}
