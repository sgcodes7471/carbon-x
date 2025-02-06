import { PinataSDK } from 'pinata';
import keys from './env.js';

const pinata = new PinataSDK({
    pinataJwt: keys.PINATA_JWT,
    pinataGateway: keys.GATEWAY_URL
})

export default pinata;