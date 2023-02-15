import { envConfig } from "../config/env.config";
import { rpcClient } from "../config/rpc.config";

export const validate = (address: string) => {
    return rpcClient.call('validateaddress', address);
}

export const getBalance = (address: string) => {
    return rpcClient.call('tl_getallbalancesforaddress', address);
}

export const getUnvestedBalance = (address: string) => {
    return rpcClient.call('tl_getunvested', address);
}

export const fundAddress = (address: string) => {
    const network = envConfig.NETWORK;
    if (!network.endsWith("TEST")) {
        return Promise.resolve({ error: 'Faucet is Allowed only in TESTNET' });
    }
    return rpcClient.call('sendtoaddress', address, 1);
}
