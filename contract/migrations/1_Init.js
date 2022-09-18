var staking = artifacts.require("staking");

module.exports = function (deployer) {
    deployer.deploy(staking, "0x338d4632dd3c126719b5111b1333e473fce454c6");
};
