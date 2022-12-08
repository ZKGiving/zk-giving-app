import { createClient } from '@supabase/supabase-js';
import {createClient as startClient} from '@urql/core';
import fetch from 'node-fetch';
import graphQLtestABI from '../../abis/graphQLtestABI.json';
import { ethers } from "ethers";

export default async function einHandler() {

  try {

    const supabase = createClient('https://abyockrhlitzeprckgjh.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_KEY);

    // This DB call will input the EIN from the API call and either return an Address or empty array
    const einResponse = await supabase
      .from('final_table')
      .select('*')
      .eq('ein', parseInt(req.body))

    // If there is an EIN/Address match from DB, return the data to FE
    if (einResponse.data.length !== 0) {
      return einResponse.data;
    }

    // API URL for The Graph
    const APIURL = process.env.GRAPH_URL;

    // 'Current number' is the number of Orgs that have been deployed
    const number = await supabase
      .from('current_number')
      .select('*')

    // Subgraph GraphQL query
    const query = `
    query {
      orgs(first: 100, skip: ${number.data[0][' number']}) {
        id
        address
        type
      }
          }`

    const client = startClient({
      url: APIURL,
      fetch
    })


    let arrayOfAddress = [];

    const response = await client.query(query).toPromise();

    // Gather new Orgs
    for (let i=0; i < response.data.orgs.length; i++) {
      if (response.data.orgs[i].type === "1") {
        arrayOfAddress.push(response.data.orgs[i].address)
      }

    }

    // If there are no additional Orgs, return empty object
    if (arrayOfAddress.length === 0) {
      return [];
    }

    let finalArray = [];
    let matchingAddress = [];

    // Loop through new Orgs & find their EIN number. Add them to Array
    for (let i=0; i < arrayOfAddress.length; i++) {
      const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);

      const contract = new ethers.Contract(arrayOfAddress[i], graphQLtestABI, provider);
      const response = (await contract.orgId()).toString();
      const sliced = response.slice(3,-46);
      let ein = "";
      for (let i=0; i < sliced.length; i++) {

        if (i % 2 === 0) {
          ein += sliced[i];
        }
      }
      // If one of the new Orgs matches the EIN on FE, return the matching address
      if (parseInt(ein) === req.body) {
        matchingAddress = [{ ein: [ein], address: arrayOfAddress[i] }];
      }

      finalArray.push({ ein: [ein], address: arrayOfAddress[i] })
    }

    // Insert Array of new Orgs in DB
    const inputNewOrgs = await supabase
      .from('final_table')
      .insert(finalArray)

    // Increment Current number
    const adjustCurrentNumber = await supabase
      .from('current_number')
      .update({ ' number': number.data[0].number + response.data.orgs.length})
      .eq('id', 1)

    return matchingAddress;

  } catch (e) {
    console.log("ERROR: ", e);
  }

}
