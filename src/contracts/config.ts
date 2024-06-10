import abiCrowdSale from './abis/crowdSale.json';
import abiSupllyChain from './abis/supplyChain.json';
import abiAGTToken from './abis/agtToken.json';
import { ethers } from "ethers";

export const AGT_TOKEN_ADDRESS: string = '0x7C42A6CDDd2Bb4B242d796a21beEb8254C0eD4bf';
export const CROWDSALE_ADDRESS: string = '0x0ED7145E8c38c2948456834E9FB147eC998210E9';
export const SUPPLYCHAIN_ADDRESS: string = '0x86CBC6D56fAd88A4265FF65E2d4EcAe034865F91';
export const getAbiAGTToken = () => abiAGTToken;
export const getAbiCrowSale = () => abiCrowdSale;
export const getAbiSupplyChain = () => abiSupllyChain;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET);