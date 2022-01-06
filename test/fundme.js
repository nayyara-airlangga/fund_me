const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundMe - Fund and Withdraw", function () {
  it("Should be able to fund and withdraw through the contract", async function () {
    const MockV3Aggregator = await hre.ethers.getContractFactory(
      "MockV3Aggregator"
    );
    const mockV3Aggregator = await MockV3Aggregator.deploy(8, 3 * 10 ** 11);
    await mockV3Aggregator.deployed();

    const ethUSDPriceFeed = mockV3Aggregator.address;

    const FundMe = await hre.ethers.getContractFactory("FundMe");
    const fundMe = await FundMe.deploy(ethUSDPriceFeed);
    await fundMe.deployed();

    const [owner, account1] = await ethers.getSigners();

    const entranceFee = await fundMe.getEntranceFee();

    await fundMe.connect(account1).fund({ value: entranceFee + 1 });

    expect(await fundMe.funders(0)).to.equal(account1.address);
    expect(await fundMe.addressToAmountFunded(account1.address)).to.equal(
      entranceFee + 1
    );

    await fundMe.connect(owner).withdraw();

    expect(await fundMe.addressToAmountFunded(account1.address)).to.equal(0);
  });
});

describe("FundMe - Only Owner Can Withdraw", function () {
  it("Should raise a transaction reverted error", async function () {
    const MockV3Aggregator = await hre.ethers.getContractFactory(
      "MockV3Aggregator"
    );
    const mockV3Aggregator = await MockV3Aggregator.deploy(8, 3 * 10 ** 11);
    await mockV3Aggregator.deployed();

    const ethUSDPriceFeed = mockV3Aggregator.address;

    const FundMe = await hre.ethers.getContractFactory("FundMe");
    const fundMe = await FundMe.deploy(ethUSDPriceFeed);
    await fundMe.deployed();

    const [owner, account1] = await ethers.getSigners();

    try {
      await fundMe.connect(account1).withdraw();
    } catch (error) {
      expect(error.message).to.equal(
        "Transaction reverted without a reason string"
      );
    }
  });
});
