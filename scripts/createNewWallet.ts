import * as dotenv from 'dotenv';
import { ethers } from "ethers";

dotenv.config();

async function main() {
    const newWallet = ethers.Wallet.createRandom();
    console.log("New wallet created!");
    console.log({walletAddress: newWallet.address, walletPrivateKey: newWallet.privateKey});
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});