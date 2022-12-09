import express from "express";
//import einHandler from "./ein-subgraph.js";
import searchOrgs from "./search-orgs.js";
import cors from 'cors';
import einHandler from "./ein-subgraph.js";
import * as dotenv from 'dotenv'

const PORT = process.env.PORT || 3001;
dotenv.config()
const app = express();

app.use(cors({
  origin: 'http://localhost:3002'
}));

app.post('/api/search-orgs', async function(req, res, next){

  const orgs = await searchOrgs(req.query.input);
  console.log(orgs)
  res.send(orgs);
});

app.post('/api/ein-subgraph', async function(req, res, next) {
  console.log(req.query)
  const address = await einHandler(req.query.input);
  res.send(address);
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
