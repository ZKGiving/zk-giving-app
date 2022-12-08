import axios from "axios";

export default async function searchOrgs(searchInput) {


  try {
    const { data } = await axios.get(
      "https://api.data.charitynavigator.org/v2/Organizations",
      {
        params: {
          app_id: process.env.REACT_APP_CHARITY_APP_ID,
          app_key: process.env.REACT_APP_CHARITY_API_KEY,
          search: searchInput,
          searchType: "NAME_ONLY",
          rated:1,
          pageSize: 100,
          sort:"RELEVANCE:DESC",
          sizeRange: 3,
        },
      }
    );


    return {organizations: data};
  } catch (e) {
    console.log("ERROR: ", e);

  }
}
