import Web3 from 'web3';
import {nftContractAddress , NFT_ABI} from '../configs/constants.js'

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(NFT_ABI , nftContractAddress);


export const SellCredits = async({data,address})=>{
    try {
        const totalPrice = data.price*data.units
        const gasLimit = BigInt(await contract.methods.list(data.price , data.units , totalPrice).estimateGas({
            from:address
        }))
        const bufferGasLimit = (gasLimit*13n)/10n;
        console.log(bufferGasLimit)
        let receipt = await contract.methods.list(data.price , data.units , totalPrice).send({
            from:address,
            gas:bufferGasLimit.toString()
        })
        // receipt = JSON.stringify(receipt , (key,value)=>{
        //     typeof value === 'bigint'?Number(value):value;
        // })
        console.log(`Transaction Successful\n${receipt}`);
        return receipt;
    } catch (error) {
        console.log(`Transaction Unsuccessful\n${error}`);
        return false;
    }
}

export const BuyCredits = async ({listId,address,totalPrice}) =>{
    try {
        const gasLimit = BigInt(await contract.methods.purchase(listId).estimateGas({
            from:address,
            value:Web3.utils.toWei(totalPrice.toString(), "gwei"),
        }))
        const bufferGasLimit=(gasLimit*13n)/10n;
        let receipt = await contract.methods.purchase(listId).send({
            from:address,
            gas:bufferGasLimit.toString(),
            value:Web3.utils.toWei(totalPrice.toString(), "gwei"),
        })
        receipt = JSON.stringify(receipt, (key, value) =>
            typeof value === "bigint" ? Number(value) : value,
        );
        console.log(`Transaction Successful\n${receipt}`);
        return receipt;
    } catch (error) {
        console.log(`Transaction Unsuccessfull\n${error}`);
        return false;
    }
}