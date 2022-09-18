const Caver = require("caver-js");
const kip17 = require(__dirname + "/build/contracts/KIP17Token.json");
const staking = require(__dirname + "/build/contracts/staking.json");
const address = ["https://public-node-api.klaytnapi.com/v1/cypress", "8217"];
const caver = new Caver(address[0]);

var wallet = {
    _address: "",
    _key: "",
};

if (address[1] == "8217") {
    const config = require(__dirname + "/truffle-config");
    wallet = caver.wallet.keyring.create(caver.klay.accounts.privateKeyToAccount(config.CYPRESS_PRIVATE_KEY).address, config.CYPRESS_PRIVATE_KEY);
} else {
    const config = require(__dirname + "/truffle-config.js");
    wallet = caver.wallet.keyring.create(caver.klay.accounts.privateKeyToAccount(config.BAOBAB_PRIVATE_KEY).address, config.BAOBAB_PRIVATE_KEY);
}
caver.wallet.add(wallet);

var contract = new caver.contract(kip17.abi, "0x338d4632dd3c126719b5111b1333e473fce454c6");
var contract2 = new caver.contract(staking.abi, staking.networks[address[1]].address);
(async () => {
    // var res = await contract.methods.setApprovalForAll(staking.networks[address[1]].address, true).send({
    //     from: wallet._address,
    //     gas: 2500000,
    // });
    // console.log(res);
    // var res = await contract2.methods.stake(2).send({
    //     from: wallet._address,
    //     gas: 2500000,
    // });
    // console.log(res);
    var res = await contract2.methods.withdraw(1788).send({
        from: wallet._address,
        gas: 2500000,
    });
    console.log(res);
    var res = await contract2.methods.getInformation("0xd7a6c44828f2a656fd9a9ee4dab8c2614b9a5c52").call();
    console.log(res);
})();
