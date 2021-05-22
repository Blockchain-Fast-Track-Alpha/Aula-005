import * as dotenv from "dotenv";
import { ethers } from "ethers";

import * as BallotContractJson from "../artifacts/contracts/Ballot.sol/IBallot.json";

dotenv.config();

const BALLOT_ADDRESS = "0x1088A759a56Dc3A769F2D736ea36FE4251815B84";

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
  const contract = contractFactory.attach(BALLOT_ADDRESS);
  let proposals: string[] = [];
  let propId = 0;
  while (propId < 2 ** 255) {
    try {
      const proposalName = await contract.proposals(propId);
      proposals.push(ethers.utils.parseBytes32String(proposalName));
      propId++;
    } catch (e) {
      break;
    }
  }
  const winner = await contract.winningProposal();
  const winnerOrder = Number(ethers.utils.formatEther(winner)) + 1;
  const winnerName = ethers.utils.parseBytes32String(
    await contract.winnerName()
  );

  console.log(
    "Ballot at address " + BALLOT_ADDRESS + " has the following proposals:"
  );
  console.log(proposals);
  console.log(
    "So far the winner proposal, named " +
      winnerName +
      ", has " +
      winnerOrder +
      " votes"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
