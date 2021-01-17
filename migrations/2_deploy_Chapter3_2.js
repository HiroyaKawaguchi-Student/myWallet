const Chapter3_2 = artifacts.require("./Chapter3_2.sol");

module.exports = function(deployer, network, accounts) {
    const name = "Chapter3_2";
    const symbol = "BT";
    const decimals = 18;
    const initSupply = web3.utils.toBN(100*(10**decimals));

    return deployer.then(()=>{
        return deployer.deploy(
            Chapter3_2,
            name,
            symbol,
            decimals,
            initSupply
        );
    });
}
