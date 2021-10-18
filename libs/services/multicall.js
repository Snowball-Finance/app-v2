import { Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';

class ContractCall{
    contractAddress = "";
    reference = "";
    abi = [];
    calls = [];

    constructor(address,abi,calls){
        this.reference = address;
        this.contractAddress = address;
        this.abi = abi;
        if(calls){
            this.calls = [...calls];
        }
    }

    setCall(methodName, methodParams){
        const call = {
            reference: `${methodName}Call`,
            methodName: methodName,
            methodParameters: [...methodParams] 
        };
        this.calls.push(call);
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
            const result = new Object();
            call.results[name].callsReturnContext.forEach(values => { 
                //I don`t want an array when the result is not an array
                if(values.returnValues.length > 1){
                    result[values.methodName] = convertMBNtoEthersBN(values.returnValues);
                }else{
                    result[values.methodName] = convertMBNtoEthersBN(values.returnValues)[0];
                }
            });
            resultSet[name] = result;
        });

        //result is [contractName: [ result1,... ],...]
        //result1 = { call: [return] }
        return resultSet;
    } catch (error) {
        throw new Error(`Multicall failed => ${error.message}`)
    }
}

//convert Multicall BN to Ethers BN
const convertMBNtoEthersBN = (retArray) => {
    return retArray.map(ret => {
        if(ret.type === "BigNumber"){
            return ethers.BigNumber.from(ret);
        }
        return ret;
    });
}

export {
    ContractCall,
    getMultiContractData,
}