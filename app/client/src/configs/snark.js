// import {groth16} from 'snarkjs'

const snarkjs = window.snarkjs;
export const generateSellProof  = async({balance , units})=>{
    try {
        const input = {
            balance:balance , credits:units
        };
        const wasmfile = 'http://localhost:3000/sell.wasm';
        const zkeyfile = 'http://localhost:3000/sell.zkey';
        const jsonfile = 'http://localhost:3000/sell_verification_key.json'
        const {proof , publicSignals} = await snarkjs.groth16.fullProve(
            input, wasmfile , zkeyfile //get these files from ipfs instead
        );
        if(publicSignals[0]=='0') throw new Error();
        const vKeyResponse = await fetch(jsonfile);
        if (!vKeyResponse.ok) throw new Error(`Failed to fetch verification key: ${vKeyResponse.statusText}`);
        const vKey = await vKeyResponse.json();
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        if(!res) throw new Error("Not Verified");
        return {proof , publicSignals};

    } catch (error) {
        console.log(`zk-buy generate proof failed\n${error}`);
        return false;
    }
}

export const generateBuyProof = async({balance , units , limit})=>{
    try {
        const input = {
            balance:balance , limit:limit ,  creditBuy:units
        };
        const wasmfile = 'http://localhost:3000/buy.wasm';
        const zkeyfile = 'http://localhost:3000/buy.zkey';
        const jsonfile = 'http://localhost:3000/buy_verification_key.json'
        const {proof , publicSignals } = await snarkjs.groth16.fullProve(
            input , wasmfile , zkeyfile
        )
        if(publicSignals[0]=='0') throw new Error();
        const vKeyResponse = await fetch(jsonfile);
        if (!vKeyResponse.ok) throw new Error(`Failed to fetch verification key: ${vKeyResponse.statusText}`);
        const vKey = await vKeyResponse.json();
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        if(!res) throw new Error("Not Verified");
        return {proof , publicSignals};
    } catch (error) {
        console.log(`zk-sell generate proof failed\n${error}`);
        return false;
    }
}