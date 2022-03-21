const DelegationType = {EIP712Domain: [{
    name: 'name',
    type: 'string'
}, {
    name: 'version',
    type: 'string'
}, {
    name: 'chainId',
    type: 'uint256'
}, {
    name: 'verifyingContract',
    type: 'address'
}],

Delegation: [
    { name: 'delegatee', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
  ]

}


const signTypedData  = async (account,msgParam) => {
    return new Promise((resolve,reject)=>{
      web3.currentProvider.send({
        method: 'eth_signTypedData',
        params: [account,msgParam],
        from: account,
    },(error,signature)=>{
        if(error){
            console.log(error)
            reject(error)
        }
        resolve(signature)
    })
   })

}

// Note: Incase of running the test on a ganache development network, ganache should be upgraded to v7.0
// due to the legacy bug of ganache prior to v7.0 which returns different values for the EVM's CHAINID opcode and the RPC method for eth_chainId
// causing EIP712 standard digests to be differnt onchain and offchain hence causing signature verifcation a failure by default.
const createDomainSeparator = (chainId, verifyingContract) => {
    return {
        name: "MindplexToken",
        version: "1",
        chainId: chainId,
        verifyingContract: verifyingContract
    }

}

const createPayLoad = (message, types, type, chainId, verifyingContract) => {

    return {
        
            types: types,
            domain: createDomainSeparator(chainId, verifyingContract),
            primaryType: type,
            message: message
    }
}

const createDelegationMessage =  (account,nonce,expiry)=>{
    return {
        delegatee:account,
        nonce:nonce,
        expiry:expiry
    }
}



const delegationSignature = async (delegatee,nonce,expiry, chainId, verifyingContract,account)=>{
     
     const msgParam = createPayLoad(createDelegationMessage(delegatee,nonce,expiry), DelegationType, "Delegation", chainId, verifyingContract) 
     const signature = await signTypedData(account,msgParam)
     return signature.result
}



module.exports = {delegationSignature}