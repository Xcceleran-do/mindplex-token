const MindplexUpgradeableToken = artifacts.require("MindplexUpgradeableToken");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const { assert } = require('chai')
const {delegationSignature} = require('./signature_helper_functions')
const { constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const BN = require("bignumber.js");
const { default: BigNumber } = require('bignumber.js');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');


contract("MindplexUpgradeableToken ", async(accounts) =>

    {
        let mindplexToken,chainId,contractAddress;
        beforeEach(async() => {

            mindplexToken = await deployProxy(MindplexUpgradeableToken, ["MindplexToken","MPX"],{ initializer: 'initialize'});          
            chainId = await web3.eth.getChainId()
            contractAddress = await mindplexToken.address 
        })


        // initial configurations

        const name = async(_name) => {
            const name = await mindplexToken.name.call();
            assert.equal(name,_name );
        }

     

        const symbol = async(_symbol) => {
            const symbol = await mindplexToken.symbol.call();
            assert.equal(symbol,_symbol);
        }

        const decimals = async(_decimals)=>{

            const decimals = await mindplexToken.decimals.call()
            assert.equal(decimals,_decimals)
        }

        const verifyInitialSupply = async(_initialSupply) => {
            const initialSupply = await mindplexToken.totalSupply.call();
            assert.equal(BN(initialSupply).toString(),_initialSupply.toString());
        }

        const verifyMaxSupply = async(_maxSupply) => {
            const maxSupply  = await mindplexToken.MAX_SUPPLY.call()
            assert.equal(BN(maxSupply).toString(),_maxSupply.toString(),)
        }


        // access functions
        const getMinterRole = async() => {
            return await mindplexToken.MINTER_ROLE.call();
        }

        const getPauserRole = async() => {

            return await mindplexToken.PAUSER_ROLE.call();
        }
        
        const grantMinterRole = async(_accountFrom,_minterAccount) => {
         
            const minterRole = await getMinterRole();
           
            await mindplexToken.grantRole(minterRole,_minterAccount,{from: _accountFrom});
        }

        const grantpauserRole = async(_accountFrom, _pauserAccount) => {

            const pauserRole = await getPauserRole();

            await mindplexToken.grantRole(pauserRole, _pauserAccount, { from: _accountFrom });

        }
        
        const revokeMinterRole = async(_accountFrom,_minterAccount) =>{

            const minterRole = await getMinterRole();
            await mindplexToken.revokeRole(minterRole,_minterAccount,{from: _accountFrom});
        }


        const revokePauserRole = async(_accountFrom, _pauserAccount) => {
            const pauserRole = await getPauserRole();

            await mindplexToken.revokeRole(pauserRole, _pauserAccount, { from: _accountFrom });
           
        }

        const renounceMinterRole = async(_accountFrom)=>{

            const minterRole = await getMinterRole();

            await mindplexToken.renounceRole(minterRole,_accountFrom,{from: _accountFrom})
        }


        const renouncePauserRole = async(_accountFrom) => {
            const pauserRole = await getPauserRole();

            await mindplexToken.renounceRole(pauserRole, _accountFrom, { from: _accountFrom });
        }


        //approve functions

        const approveAndVerify = async(_accountFrom, _accountTo, _amount) => {
            const allowanceB = await mindplexToken.allowance(_accountFrom, _accountTo)

            await mindplexToken.approve(_accountTo, _amount, { from: _accountFrom })

            const allowanceA = await mindplexToken.allowance(_accountFrom, _accountTo)

            assert.equal(_amount.plus(allowanceB).toString(), BN(allowanceA).toString())

        }

        const increaseAndDecreaseAllowance = async(_accountFrom, _accountTo, _amount) => {
            const allowanceB = await mindplexToken.allowance(_accountFrom, _accountTo)
            await mindplexToken.increaseAllowance(_accountTo, _amount, { from: _accountFrom })
            const allowanceA = await mindplexToken.allowance(_accountFrom, _accountTo)
            await mindplexToken.decreaseAllowance(_accountTo, _amount, { from: _accountFrom })
            const allowanceD = await mindplexToken.allowance(_accountFrom, _accountTo)

            assert.equal(_amount.plus(allowanceB).toString(), BN(allowanceA).toString())
            assert.equal(_amount.plus(allowanceD).toString(), BN(allowanceA).toString())

        }


        // transfer functions

        const transferAndVerify = async(_accountFrom, _accountTo, _amount) => {

            const balanceOfsenderB = await mindplexToken.balanceOf(_accountFrom)

            const balanceOfreceiverB = await mindplexToken.balanceOf(_accountTo)

            await mindplexToken.transfer(_accountTo, _amount, { from: _accountFrom })

            const balanceOfsenderA = await mindplexToken.balanceOf(_accountFrom)

            const balanceOfreceiverA = await mindplexToken.balanceOf(_accountTo)


            assert.equal(_amount.plus(balanceOfreceiverB).toString(), BN(balanceOfreceiverA).toString())
                // justification for using BN on balanceOfsenderB is that assert function can't handle numbers greater than 1e20

            assert.equal(_amount.plus(balanceOfsenderA).toString(), BN(balanceOfsenderB).toString())
        }



        const transferFromAndVerify = async(_accountFrom, _accountTo, _amount) => {

                const balanceOfsenderB = await mindplexToken.balanceOf(_accountFrom)

                const balanceOfreceiverB = await mindplexToken.balanceOf(_accountTo)

                const allowanceB = await mindplexToken.allowance(_accountFrom, _accountTo)

                await mindplexToken.transferFrom(_accountFrom, _accountTo, _amount, { from: _accountTo })

                const balanceOfsenderA = await mindplexToken.balanceOf(_accountFrom)

                const balanceOfreceiverA = await mindplexToken.balanceOf(_accountTo)

                const allowanceA = await mindplexToken.allowance(_accountFrom, _accountTo)

                assert.equal(_amount.plus(balanceOfreceiverB).toString(), BN(balanceOfreceiverA).toString())

                assert.equal(_amount.plus(balanceOfsenderA).toString(), BN(balanceOfsenderB).toString())

                assert.equal(_amount.plus(allowanceA).toString(), BN(allowanceB).toString())
            } 

        //mint functions

        const mintAndVerify = async(_accountFrom, _accountTo, _amount) => {

        const totalSupplyB = await mindplexToken.totalSupply();

        const balanceOfMinterB = (await mindplexToken.balanceOf(_accountTo));

        await mindplexToken.mint(_accountTo, _amount, { from: _accountFrom });

        const balanceOfMinterA = (await mindplexToken.balanceOf(_accountTo));

        const totalSupplyA = await mindplexToken.totalSupply()

        assert.equal(_amount.plus(totalSupplyB).toString(), BigNumber(totalSupplyA).toString());

        assert.equal(_amount.plus(balanceOfMinterB).toString(), BigNumber(balanceOfMinterA).toString());

    }



        // burn functions

        const burnAndVerify = async(_accountFrom, _amount) => {

            const totalSupplyB = await mindplexToken.totalSupply();

            const balanceOfBurnerB = (await mindplexToken.balanceOf(_accountFrom));

            await mindplexToken.burn(_amount, { from: _accountFrom });

            const balanceOfBurnerA = (await mindplexToken.balanceOf(_accountFrom));

            const totalSupplyA = await mindplexToken.totalSupply()

            assert.equal(_amount.plus(totalSupplyA).toString(), BN(totalSupplyB).toString());

            assert.equal(_amount.plus(balanceOfBurnerA).toString(), BN(balanceOfBurnerB).toString());
        }


        const burnFromAndVerify = async(_accountFrom, _accountTo, _amount) => {
            const balanceOfsenderB = await mindplexToken.balanceOf(_accountFrom)

            const allowanceB = await mindplexToken.allowance(_accountFrom, _accountTo)

            const totalSupplyB = await mindplexToken.totalSupply();

            await mindplexToken.burnFrom(_accountFrom, _amount, { from: _accountTo })

            const balanceOfsenderA = await mindplexToken.balanceOf(_accountFrom)

            const allowanceA = await mindplexToken.allowance(_accountFrom, _accountTo)

            const totalSupplyA = await mindplexToken.totalSupply()

            assert.equal(_amount.plus(totalSupplyA).toString(), BN(totalSupplyB).toString());

            // justification for using BN on balanceOfsenderB is that assert function can't handle numbers greater than 1e20
            assert.equal(_amount.plus(balanceOfsenderA).toString(), BN(balanceOfsenderB).toString())

            assert.equal(_amount.plus(allowanceA).toString(), BN(allowanceB).toString())
        }



        // pause and unpause functions

        const pauseContractAndVerify = async(_accountFrom) => {

            await mindplexToken.pause({ from: _accountFrom });

            const paused = await mindplexToken.paused();

            assert.equal(true, paused);
        }

        const unPauseContractAndVerify = async(_accountFrom) => {

            await mindplexToken.unpause({ from: _accountFrom });

            const paused = await mindplexToken.paused();

            assert.equal(false, paused);

        }

        const delegateAndVerify = async (_accountFrom,_accountTo)=>{
          const delegateeB = await mindplexToken.delegates(_accountFrom)
          await mindplexToken.delegate(_accountTo,{from:_accountFrom})
          const delegateeA = await mindplexToken.delegates(_accountFrom)
    
          assert.notEqual(delegateeB,_accountTo)
          assert.equal(delegateeA,_accountTo)
        }

        const delegateBySigAndVerify = async (_accountFrom,signer,delegatee,
         nonce,
         expiry,
         v,
         r,
         s)=>{

          const delegateeB = await mindplexToken.delegates(signer)
          await mindplexToken.delegateBySig(delegatee,nonce,expiry,v,r,s,{from:_accountFrom})
          const delegateeA = await mindplexToken.delegates(signer)

          assert.notEqual(delegateeB,delegatee)
          assert.equal(delegateeA,delegatee)
        }




        /* Test Scenarios */



        it("0 .Deployment and Initial configuration, get name,decimals,symbol,initial supply", async() => {

            assert(mindplexToken)

           await name("MindplexToken");

           await symbol("MPX");

            await decimals(6)


            const totalSupply = "1000000000000000"

            await verifyInitialSupply(totalSupply);

            const maxSupply = "1000000000000000" 
            
            await verifyMaxSupply(maxSupply)
            
        })


        it("1. Access Controls, get pauser role, assign minter role,pauser role revoke  role,renounce role", async() => {
            //accounts[0] is by default the owner of the contract 

            const amount = BigNumber(1e+10)

            await grantMinterRole(accounts[0],accounts[1])

            await grantMinterRole(accounts[0],accounts[2])


            await grantpauserRole(accounts[0], accounts[1])

            await grantpauserRole(accounts[0], accounts[2])

            
            await revokeMinterRole(accounts[0],accounts[2])

            await revokePauserRole(accounts[0], accounts[2])
            // should revert minting tokens with out a minter role account
            await expectRevert.unspecified(mintAndVerify(accounts[2],accounts[1],amount))
            // // should revert pausing a contract with out a pauser role account
            await expectRevert.unspecified(pauseContractAndVerify(accounts[2]))

            await renounceMinterRole(accounts[1])
            await renouncePauserRole(accounts[1])



        })

       



        it("2. Transfer Token from one account to another and verify", async() => {
            //accounts[0] is by default the owner of the contract

            const transferAmount = new BN(1e+10)

            await transferAndVerify(accounts[0], accounts[1], transferAmount)
        })

        it("3. Burn token and verify", async() => {
            //accounts[0] is by default the owner of the contract

            const burnAmount = new BN(1e+2)

            await burnAndVerify(accounts[0], burnAmount)
        })

         it("4. Mint tokens to an account and verify given that the total supply does not exceed the maximum supply", async()=>{

            const mintAmount = new BN(1e+2)

            await burnAndVerify(accounts[0], mintAmount)
            await mintAndVerify(accounts[0],accounts[1],mintAmount)

        })

        it("5. Minting tokens more than the Maximum Supply should fail",async()=>{

           const mintAmount = new BN(1e+3)
           await expectRevert.unspecified(mintAndVerify(accounts[0],accounts[1],mintAmount),"the total supply does not exceed the maximum supply")


        })

        it("6. Approve allowance,Increase and Decrease allowance, Transfer and Burn using allowance and verify", async() => {
            //accounts[0] is by default the owner of the contract

            const allowanceAmount = new BN(1e+5)

            const burnAmount = new BN(1e+2)

            await approveAndVerify(accounts[0], accounts[2], allowanceAmount)

            await burnFromAndVerify(accounts[0], accounts[2], burnAmount)

            await transferFromAndVerify(accounts[0], accounts[2], allowanceAmount.minus(burnAmount))

            await increaseAndDecreaseAllowance(accounts[0], accounts[2], allowanceAmount)

        })


        it("7. Pause and Unpause contract and verify", async() => {
            //accounts[0] is by default the owner of the contract

            await pauseContractAndVerify(accounts[0]);

            const transferAmount = new BN("100000000000000");

            //transfer should fail

            await expectRevert.unspecified(transferAndVerify(accounts[0], accounts[1], transferAmount.toString()));

            await unPauseContractAndVerify(accounts[0]);
            
            //transfer should pass
            await transferAndVerify(accounts[0], accounts[1], transferAmount)

        
        })

        it("8. Delegate and verify",async ()=>{
            await delegateAndVerify(accounts[0],accounts[1])
        })


        it("9. Delegate by Signature and verify",async ()=>{
        
        const nonce = 0
        const expiry = "10000000000000000000000000000000"
        const signature = await delegationSignature(accounts[2],nonce,expiry.toString(),chainId,contractAddress,accounts[1])
       
         var r = signature.slice(0, 66)
         var s = '0x' + signature.slice(66, 130)
         var v = '0x' + signature.slice(130, 132)
         v = web3.utils.hexToNumber(v)

        await delegateBySigAndVerify(accounts[2],accounts[1],accounts[2],nonce,expiry,v,r,s)

        })



        //test cases that should fail

        it("10. Burning tokens from an account  of value greater than what's been approved by the account should fail",async ()=>{
            
            const allowanceAmount = new BN(1e+5)

            const burnAmount = new BN(1e+6)
            
            await approveAndVerify(accounts[0], accounts[2], allowanceAmount)

            await expectRevert.unspecified(burnFromAndVerify(accounts[0], accounts[2], burnAmount))

        })



        it("11. Delegating with expired Signature should fail",async ()=>{
        
        const nonce = 0
        const expiry = "10"
        const signature = await delegationSignature(accounts[2],nonce,expiry.toString(),chainId,contractAddress,accounts[1])
       
         var r = signature.slice(0, 66)
         var s = '0x' + signature.slice(66, 130)
         var v = '0x' + signature.slice(130, 132)
         v = web3.utils.hexToNumber(v)

        await expectRevert.unspecified(delegateBySigAndVerify(accounts[2],accounts[1],accounts[2],nonce,expiry,v,r,s))

        })

         it("12. Delegating with used nonce should fail",async ()=>{
        
        const nonce = 0
        const expiry = "1000000000000000000000000000000"
        const signature = await delegationSignature(accounts[3],nonce,expiry.toString(),chainId,contractAddress,accounts[2])
       
         var r = signature.slice(0, 66)
         var s = '0x' + signature.slice(66, 130)
         var v = '0x' + signature.slice(130, 132)
         v = web3.utils.hexToNumber(v)
        await delegateBySigAndVerify(accounts[3],accounts[2],accounts[3],nonce,expiry,v,r,s)
        await expectRevert.unspecified(delegateBySigAndVerify(accounts[3],accounts[2],accounts[3],nonce,expiry,v,r,s))

        })

        it("13. Delegating with invalid nonce should fail",async ()=>{
        
        const nonce = 10
        const expiry = "1000000000000000000000000000000"
        const signature = await delegationSignature(accounts[3],nonce,expiry.toString(),chainId,contractAddress,accounts[2])
       
         var r = signature.slice(0, 66)
         var s = '0x' + signature.slice(66, 130)
         var v = '0x' + signature.slice(130, 132)
         v = web3.utils.hexToNumber(v)
         await expectRevert.unspecified(delegateBySigAndVerify(accounts[3],accounts[2],accounts[3],nonce,expiry,v,r,s))

        })


        


        








    }




)