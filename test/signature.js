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


const createDomainSeparator = (chainId, verifyingContract) => {
   const main_and_testnet_ChainId = ["1", "3", "4", "42"]
    const _chainId = main_and_testnet_ChainId.includes(chainId) ? chainId : 1
    return {
        name: "MindplexToken",
        version: "1",
        chainId: _chainId,
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