import Web3 from 'web3';
import {nftContractAddress , NFT_ABI} from '../configs/constants.js'

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(NFT_ABI , nftContractAddress);

export const RegisterBusiness = async ({data , formData})=>{
    const uri = `ipfs://${data.cid}`;
    try {
        const gasLimit = BigInt(await contract.methods.registerBusiness(
             uri 
        ).estimateGas({
            from: formData.user
        }));
        const bufferGasLimit = (gasLimit*13n)/10n;
        let receipt = await contract.methods.registerBusiness(
            uri 
        ).send({
            from:formData.user,
            gas:bufferGasLimit.toString()
        });
        
        receipt = JSON.stringify(receipt, (key, value) =>
            typeof value === "bigint" ? Number(value) : value,
        );
        console.log(`Transcation Successful\n${receipt}`);
        return true;
    } catch (error) {
        console.log(`Transaction Unsuccessful\n${error}`);
        return false;
    }
}

export const SignInBusiness = async({formData})=>{
    try {
        const gasLimit = BigInt(await contract.methods.verifyBusiness(
            formData.tokenId
        ).estimateGas({
            from: formData.user
        }));
        const tokenUri = await contract.methods.verifyBusiness(
            formData.tokenId
        ).call({
            from:formData.user,
            gas:gasLimit.toString()
        });
        console.log(`Transcation Successful\n${tokenUri}`);
        return tokenUri;
    } catch (error) {
        console.log(`Transaction Unsucessful\n${error}`)
        return false;
    }
}


export const updateURI = async({data , address})=>{
    try {
        if(!data.tokenId || !data.newUri) return;
        const gasLimit = BigInt(await contract.methods.updateUri(data.tokenId , data.newUri).estimateGas({
            from:address
        }));
        const uri = `ipfs://${data.newUri}`;
        const bufferGasLimit = (gasLimit*13n)/10n;
        let receipt = await contract.methods.updateUri(data.tokenId , uri).send({
            from:address,
            gas:bufferGasLimit.toString()
        })
        console.log(`Transaction Successful\n`,receipt);
        return true;
    } catch (error) {
        console.log(`Transaction failed\n` , error);
        return false;
    }
}
