import {
    Multicall
  } from 'ethereum-multicall';

const getContractCall = (methodName, methodParams) => {
    return { 
        reference: `${methodName}Call`,
        methodName: methodName,
        methodParameters: [...methodParams] 
    };
}

const getContractObject = (address, abi, calls) => {
    return {
        contractAddress:address,
        abi,
        reference:address,
        calls: [
            ...calls
        ]
    }
}

//contract array should be provided with 
// [ {reference: string, contractCalls: [ {reference: string, methodName: string, methodParameters: any}, ... ], abi: []}, ... ]
const getMultiContractData = async (provider, contractArray) => {
    try {
        const multicall = new Multicall({ ethersProvider: provider});
        const call = await multicall.call(contractArray);
    
        const resultSet = new Object();
    
        const contractNames = Object.keys(call.results);
        contractNames.forEach(name => {
            resultSet[name] =  call.results[name].callsReturnContext.map(call => call.returnValues);
        });

        //result is [contractName: [ result1,... ],...]
        return resultSet;
    } catch (error) {
        throw new Error(`Multicall failed => ${error.message}`)
    }

}

export {
    getContractCall,
    getMultiContractData,
    getContractObject
}