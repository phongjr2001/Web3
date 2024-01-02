import abiCrowdSale from './abis/crowdSale.json';
import abiSupllyChain from './abis/supplyChain.json';
import abiAGTToken from './abis/agtToken.json';
import { ethers } from "ethers";

export const AGT_TOKEN_ADDRESS: string = '0x016C31223Bdb9454E277A042A924C37BBafe1E18';
export const CROWDSALE_ADDRESS: string = '0xb5894444c65B52d12cAD243002cBE961B885d628';
export const SUPPLYCHAIN_ADDRESS: string = '0x1d548381D6A7a6992d3e4487dB91a0CA3045b1B7';
export const getAbiAGTToken = () => abiAGTToken;
export const getAbiCrowSale = () => abiCrowdSale;
export const getAbiSupplyChain = () => abiSupllyChain;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET);