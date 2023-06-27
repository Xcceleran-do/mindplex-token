const { expect } = require("chai");
const  { ethers, upgrades } = require("hardhat");
const BN = require("bignumber.js");

describe("Mindplex Token Contract", function () {
    let mindplexToken ;
    let _name = "MindplexToken";
    let _symbol = "MPX";
    let _decimal = 6;
    let _initialSupply = 1000000000000000;
    let _maxSupply = 1000000000000000;
    let _allowanceAmount = 50000;
    let zero_address = "0x0000000000000000000000000000000000000000";
    let admin;
    
    before(async function () {
        [
            admin,
            escrow, 
            recipient_adder, 
            editor, 
            operator, 
            requestor, 
            claimer,
            requestor2,
            claimer2,
            other 
        ] = await ethers.getSigners();

        // Deploy token contract
        const _mindplexToken  = await ethers.getContractFactory("MindplexToken");
        mindplexToken = await _mindplexToken.deploy(_name, _symbol);

        console.log("Token contract deployed to:", mindplexToken.address); 
    });  

    //------------------ Initial Configuration -----------------// 

    it("should assign given name", async function () {     
        const name = await mindplexToken.name();
        expect(_name).to.equal(name);
    });

    it("should assign given symbol", async function () {     
        const symbol = await mindplexToken.symbol();
        expect(_symbol).to.equal(symbol);
    });

    it("should assign given decimal", async function () {     
        const decimal = await mindplexToken.decimals();
        expect(_decimal).to.equal(decimal);
    });

    it("should assign total supply", async function () {     
        const totalSupply = await mindplexToken.totalSupply();
        expect(BN(_initialSupply).toString()).to.equal(totalSupply.toString());
    });

    it("should assign Max supply", async function () {     
        const maxSupply = await mindplexToken.MAX_SUPPLY();
        expect(BN(_maxSupply).toString()).to.equal(maxSupply.toString());
    });

    //------------------------- Approve ------------------------// 

    it("Should allocate allowance amount", async function () {         
        await mindplexToken.approve(mindplexToken.address, _allowanceAmount);
        expect(await mindplexToken.allowance(
            admin.address, 
            mindplexToken.address
        )).to.equal(_allowanceAmount);
    });

    it("Should increase allowance", async function () {  
        let addedAmount = 10000;
        _allowanceAmount += addedAmount;
        await mindplexToken.increaseAllowance(mindplexToken.address, addedAmount);
        expect(await mindplexToken.allowance(
            admin.address, 
            mindplexToken.address
        )).to.equal(_allowanceAmount);
    })

    it("Should decrease allowance", async function () {  
        let decreaseAmount = 20000;
        _allowanceAmount -= decreaseAmount;
        await mindplexToken.decreaseAllowance(mindplexToken.address, decreaseAmount);
        expect(await mindplexToken.allowance(
            admin.address, 
            mindplexToken.address
        )).to.equal(_allowanceAmount);
    })

    //------------------------- Transfer ------------------------// 
   
    it("Should transfer input amount", async function (){
        let _transferAmount = 500000;
        let _secondTransferAmount = 300000;
        let adminBalance = await mindplexToken.balanceOf(admin.address);

        // Transfer 1 (From admin to requestor)
        await mindplexToken.transfer(requestor.address, _transferAmount);
        expect(await mindplexToken.balanceOf(requestor.address)).to.equal(_transferAmount);
        expect(await mindplexToken.balanceOf(admin.address)).to.equal(adminBalance - _transferAmount);

        // Transfer 2 (From requestor to editor)
        let requestorBalance = await mindplexToken.balanceOf(requestor.address);
        await mindplexToken.connect(requestor).transfer(editor.address, _secondTransferAmount);
        expect(await mindplexToken.balanceOf(editor.address)).to.equal(_secondTransferAmount);
        expect(await mindplexToken.balanceOf(requestor.address)).to.equal(requestorBalance - _secondTransferAmount);
    })

    //------------------------- Burn ---------------------------// 

    it("Should revert minting before burn", async function (){
        await expect(mindplexToken.mint(admin.address, 100))
        .to.be.revertedWith("Token to be minted should not exceed Max supply")
    })

    it("Should burn input amount", async function (){
        let burnAmount = 500000;
        let callerBalance = await mindplexToken.balanceOf(admin.address);
        await mindplexToken.burn(burnAmount);
        expect(await mindplexToken.balanceOf(admin.address))
        .to.equal(callerBalance - burnAmount);
    })

    //------------------------- Burn from --------------------// 

    it("Should burn from burnfrom function", async function (){
        let allowanceAmount = 500;
        let balance = await mindplexToken.balanceOf(admin.address);

        await mindplexToken.approve(operator.address, allowanceAmount);
        expect(await mindplexToken.allowance(
            admin.address, 
            operator.address
        )).to.equal(allowanceAmount);

        await mindplexToken.connect(operator).burnFrom(admin.address, allowanceAmount);
        expect(await mindplexToken.balanceOf(
            admin.address
        )).to.equal(balance - allowanceAmount);
    })

    //------------------------- Mint ------------------------// 

    it("Should mint input amount", async function (){
        let newMintAmount = 2000;
        let callerBalance = await mindplexToken.balanceOf(admin.address);
        await mindplexToken.mint(admin.address, newMintAmount);
        let newBalance = Number(callerBalance) + Number(newMintAmount);
        expect(await mindplexToken.balanceOf(admin.address))
        .to.equal(newBalance);
    })

    it("Should revert if token receiver is zero address", async function (){
        let newMintAmount = 2000;
        await expect(mindplexToken.mint(zero_address, newMintAmount))
        .to.be.revertedWith("ERC20: mint to the zero address");
    })

    it("Should revert if someone other than role is trying to mint", async function (){
        let newMintAmount = 2000;
        await expect(mindplexToken.connect(editor).mint(admin.address, newMintAmount))
        .to.be.revertedWith("AccessControl: account 0x90f79bf6eb2c4f870365e785982e1f101e93b906 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6");
    })

    //-------------------- Pause & Unpause -------------------//

    it("Should pause & unpause contract", async function (){
        // Pause contract
        await mindplexToken.pause();

        // Trying to call mint when contract is paused
        await expect(mindplexToken.mint(admin.address, 100))
        .to.be.revertedWith("Pausable: paused");

        // Unpause contract
        await mindplexToken.unpause();
    })

    it("Should revert if someone else othan role is pausing", async function (){
        await expect(mindplexToken.connect(editor).pause())
        .to.be.revertedWith("AccessControl: account 0x90f79bf6eb2c4f870365e785982e1f101e93b906 is missing role 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a");
    })

    it("Should revert if someone else othan role is unpausing", async function (){
        await expect(mindplexToken.connect(editor).unpause())
        .to.be.revertedWith("AccessControl: account 0x90f79bf6eb2c4f870365e785982e1f101e93b906 is missing role 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a");
    })
})