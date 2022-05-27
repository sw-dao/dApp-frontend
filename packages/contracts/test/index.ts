/* eslint-disable camelcase */
import chai, { expect } from "chai";
import {
  ethers,
  deployments,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

describe("SWD Staking", async () => {
  it("Should get a different owner than the deployer", async function () {
    await deployments.fixture(["SWDAO", "SushiSwapPairMock", "SwdStaking"]);

    const { tokenOwner } = await getNamedAccounts();
    const swdStaking = await ethers.getContract("SwdStaking");

    const owner = await swdStaking.owner();
    expect(owner.toLowerCase()).to.be.equal(tokenOwner.toLowerCase());
  });

  it("Should only allow the owner to add LP", async function () {
    // given
    await deployments.fixture(["SWDAO", "SushiSwapPairMock", "SwdStaking"]);
    const slpToken = await ethers.getContract("SushiSwapPairMock");
    const swdStaking = await ethers.getContract("SwdStaking");

    // then
    await expect(swdStaking.add(10, slpToken.address, false)).to.be.reverted;
  });

  it("Should return the size of pools after deployment and be updated after creating a new pool", async function () {
    // Staking contract
    // given
    await deployments.fixture(["SWDAO", "SushiSwapPairMock", "SwdStaking"]);
    const { deployer, tokenOwner } = await getNamedAccounts();
    const { deploy } = deployments;
    const slpToken = await ethers.getContract("SushiSwapPairMock");
    const swdStaking = await ethers.getContract("SwdStaking", tokenOwner);

    const setAddPoolTx = await swdStaking.add(10, slpToken.address, false);
    await setAddPoolTx.wait();

    expect(await swdStaking.poolLength()).to.equal(1);

    // when
    await deploy("slpToken_2", {
      contract: "SushiSwapPairMock", // name of the token source
      from: deployer,
      log: true,
    });

    const sltToken_2 = await ethers.getContract("slpToken_2");

    const setAddSwdUsdcPoolTx = await swdStaking.add(
      10,
      sltToken_2.address,
      false
    );
    await setAddSwdUsdcPoolTx.wait();

    // then
    expect(await swdStaking.poolLength()).to.equal(2);
  });

  it("Should accept users LP tokens and allocate rewards", async function () {
    // given
    const { deployer, tokenOwner } = await getNamedAccounts();

    const swdToken = await ethers.getContract("SWDAO"); // tokenOwner has all the tokens
    const slpToken = await ethers.getContract("SushiSwapPairMock"); // tokens minted to deployer
    const swdStaking = await ethers.getContract("SwdStaking", tokenOwner);
    const pendingRewardBefore = await swdStaking.pendingSwd(0, deployer); // should be 0

    // Create LP
    const setAddPoolTx = await swdStaking.add(10, slpToken.address, false); // create LP for LP token
    await setAddPoolTx.wait();

    // Approval swdStaking contract to transfer funds
    const approvalTx = await slpToken.approve(swdStaking.address, 100);
    await approvalTx.wait();

    // Deposit LP tokens in LP
    const swdStakingWithDeployer = await ethers.getContract(
      "SwdStaking",
      deployer
    );

    const depositSwdEthTx = await swdStakingWithDeployer.deposit(0, 50);
    await depositSwdEthTx.wait();

    // Fund staking contract with SWD tokens
    const fundContractTx = await swdToken.transfer(
      swdStaking.address,
      ethers.utils.parseEther("10")
    );
    await fundContractTx.wait();
    expect(await swdToken.balanceOf(swdStaking.address)).to.equal(
      ethers.utils.parseEther("10")
    );

    // when
    // Tx for block to pass
    const users = await getUnnamedAccounts();

    const intermediateTx = await swdToken.transfer(
      users[0],
      ethers.utils.parseEther("10")
    );
    await intermediateTx.wait();

    const pendingRewardAfter = await swdStaking.pendingSwd(0, deployer);

    // then
    expect(pendingRewardAfter).to.be.gt(pendingRewardBefore);
    console.log(
      `Pending reward ${pendingRewardBefore.toString()} increased to ${pendingRewardAfter.toString()}`
    );

    const { amount } = await swdStaking.userInfo(0, deployer);

    await expect(swdStakingWithDeployer.withdraw(0, amount))
      .to.emit(swdStaking, "Withdraw")
      .withArgs(deployer, 0, amount);

    const pendingRewardAfterWithdraw = await swdStaking.pendingSwd(0, deployer);
    console.log(
      "Pending reward after withdraw: ",
      pendingRewardAfterWithdraw.toString()
    );
    expect(pendingRewardAfterWithdraw).to.be.lt(pendingRewardAfter);
    expect(pendingRewardAfterWithdraw.toString()).to.be.equal("0");
  });
});
