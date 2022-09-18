const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");

const CYPRESS_PRIVATE_KEY = "0x93b023f9e27d47d6b4ea119875bb7e71860f1a99f42f4c225c1d8d9517bdb24b";
const BAOBAB_PRIVATE_KEY = "0x9bd8e94d3edc022a6d2b5d3e2fb6b55e1d300c72748dfb99db451cd885315373";

module.exports = {
    CYPRESS_PRIVATE_KEY,
    BAOBAB_PRIVATE_KEY,

    networks: {
        baobab: {
            provider: () => new HDWalletProvider(BAOBAB_PRIVATE_KEY, "https://api.baobab.klaytn.net:8651/"),
            network_id: "1001",
            gas: "10000000",
            gasPrice: null,
            networkCheckTimeout: 10000000,
            timeoutBlocks: 2000,
        },
        cypress: {
            provider: () => new HDWalletProvider(CYPRESS_PRIVATE_KEY, "https://public-node-api.klaytnapi.com/v1/cypress"),
            network_id: "8217",
            gas: "8500000",
            gasPrice: null,
        },
    },

    compilers: {
        solc: {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 999999,
                },
                evmVersion: "istanbul",
                outputSelection: {
                    "*": {
                        "": ["ast"],
                        "*": [
                            "evm.bytecode.object",
                            "evm.deployedBytecode.object",
                            "abi",
                            "evm.bytecode.sourceMap",
                            "evm.deployedBytecode.sourceMap",
                            "metadata",
                        ],
                    },
                },
            },
        },
    },
};
