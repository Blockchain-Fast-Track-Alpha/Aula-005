import * as dotenv from "dotenv";
import { ethers } from "ethers";

import * as BallotContractInterfaceJson from "../artifacts/contracts/Ballot.sol/IBallot.json";

dotenv.config();

async function main() {
  const ballotAddress = process.argv[2];
  const proposalId = ethers.BigNumber.from(process.argv[3]);
  const pkey = process.env.ADMIN_PRIVATE_KEY ?? "";
  if (pkey.length < 64) throw new Error("Private Key not set up");
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.PROVIDER_URL
  );
  const signer = new ethers.Wallet(pkey, provider);
  const contractInterfaceFactory = new ethers.ContractFactory(
    BallotContractInterfaceJson.abi,
    BallotContractInterfaceJson.bytecode,
    signer
  );
  const contractInterface = contractInterfaceFactory.attach(ballotAddress);
  try {
    console.log("Giving right to vote: ");
    const tx = await contractInterface.giveRightToVote(signer.address);
    await tx.wait();
  } catch (e) {
    console.error(e);
  }
  console.log("Calling at contract interface: ");
  try {
    await contractInterface.vote(proposalId);
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
