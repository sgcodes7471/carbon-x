import Web3 from 'web3';
import {iotContractAddress , IOT_ABI} from '../configs/constants.js'

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(IOT_ABI , iotContractAddress);

export const GetCredits=async({iot,address}) =>{
    try {
        let credits = await contract.methods.getByIdentifier(iot).call({
            from:address
        });
        console.log('Transaction Successful',credits);
        return credits;
    } catch (error) {
        console.log('Transaction failed to fetch carbon credits',error);
        return false;
    }
}