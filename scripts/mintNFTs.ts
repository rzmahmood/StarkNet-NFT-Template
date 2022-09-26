import { mintNFTs as main } from "../src/mintNFTs";
import dotenv from "dotenv";

dotenv.config();

main()
  .then(() => {
    console.log("finished successfully");
    process.exit(0);
  })
  .catch((x) => {
    console.log(`Failed to run: ${x.toString()}`);
    process.exit(1);
  });
