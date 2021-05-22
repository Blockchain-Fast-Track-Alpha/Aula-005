import * as dotenv from "dotenv";
import { ethers } from "ethers";

import * as BallotContractJson from "../artifacts/contracts/Ballot.sol/BallotModified.json";

dotenv.config();

const PROPOSALS = ["Potato", "Popcorn", "Paprika", "Papaya"];

async function main() {
  const pkey = process.env.ADMIN_PRIVATE_KEY ?? "";
  if (pkey.length < 64) throw new Error("Private Key not set up");
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.PROVIDER_URL
  );
  const signer = new ethers.Wallet(pkey, provider);
  const contractFactory = new ethers.ContractFactory(
    BallotContractJson.abi,
    BallotContractJson.bytecode,
    signer
  );
  console.log("Deploying contract");
  let proposalsArray: string[] = [];
  PROPOSALS.forEach((element) => {
    proposalsArray.push(ethers.utils.formatBytes32String(element));
  });
  const ballotContract = await contractFactory.deploy(proposalsArray);
  console.log("Awaiting confirmations");
  await ballotContract.deployed();
  console.log("Contract deployed at " + ballotContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
