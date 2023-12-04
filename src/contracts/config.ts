import abiCrowdSale from './abis/crowdSale.json';
import abiSupllyChain from './abis/supplyChain.json';
import { ethers } from "ethers";

export const CROWDSALE_ADDRESS: string = '0xb5894444c65B52d12cAD243002cBE961B885d628';
export const SUPPLYCHAIN_ADDRESS: string = '0x3F72FbDf7Fb10b094c584659d2075e0337C1B384';
export const getAbiCrowSale = () => abiCrowdSale;
export const getAbiSupplyChain = () => abiSupllyChain;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET);