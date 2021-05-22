import * as dotenv from 'dotenv';
import { ethers } from "ethers";

dotenv.config();

async function main() {
	const pkey = process.env.ADMIN_PRIVATE_KEY ?? "";
	if (pkey.length < 64) throw new Error("Private Key not set up");
	const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
	const signer = new ethers.Wallet(pkey, provider);
	const balance = await signer.getBalance();
	console.log("Ether balance for my address " + signer.address + " in this network is " + ethers.utils.formatEther(balance));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});