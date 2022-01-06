const hre = require("hardhat");

const main = async () => {
  const networkName = hre.network.name;

  const FundMe = await hre.ethers.getContractFactory("FundMe");

  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("Deploying to the", networkName, "network...");
    const ethUSDPriceFeed = hre.config.networks[networkName].ethUSDPriceFeed;

    const fundMe = await FundMe.deploy(ethUSDPriceFeed);
    await fundMe.deployed();

    console.log("FundMe deployed to:", fundMe.address);
  } else {
    console.log("Deploying to the", networkName, "network with mocks...");

    const MockV3Aggregator = await hre.ethers.getContractFactory(
      "MockV3Aggregator"
    );
    const mockV3Aggregator = await MockV3Aggregator.deploy(8, 3 * 10 ** 11);
    await mockV3Aggregator.deployed();

    const ethUSDPriceFeed = mockV3Aggregator.address;

    console.log("MockV3Aggregator deployed to:", mockV3Aggregator.address);

    const fundMe = await FundMe.deploy(ethUSDPriceFeed);
    await fundMe.deployed();

    console.log("FundMe deployed to:", fundMe.address);
  }
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
