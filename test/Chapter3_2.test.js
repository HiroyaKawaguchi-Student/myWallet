const Chapter3_2 = artifacts.require("./Chapter3_2.sol");

contract("Chapter3_2", accounts => {
    it("...should put 100BT in the first account.", async () => {
        const Chapter3_2Instance = await Chapter3_2.deployed();

        let balance = await Chapter3_2Instance.balanceOf(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");

        assert.equal(balance, 100, "First account don't have 100 BT.");
    });
});
