import { rpcClient } from "../config/rpc.config"



export const listTokens = () => {
    return rpcClient.call('tl_listproperties');
}

export const getTokenInfo = (propid: number) => {
    return rpcClient.call('tl_getproperty', propid);
}

export const getTokenCurrencyTotal = (propid: number) => {
    return rpcClient.call('tl_getcurrencytotal', propid);
}
