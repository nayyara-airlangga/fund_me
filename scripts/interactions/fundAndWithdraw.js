const hre = require("hardhat");

const main = async () => {
  const [owner, account1] = await hre.ethers.getSigners();
  const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  const fundMe = await hre.ethers.getContractAt("FundMe", contractAddress);
  const entranceFee = await fundMe.getEntranceFee();

  console.log(
    "The current entrance fee is",
    entranceFee.toString(),
    "\nFunding..."
  );

  await fundMe.connect(account1).fund({ value: entranceFee + 1 });

  await fundMe.connect(owner).withdraw();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
