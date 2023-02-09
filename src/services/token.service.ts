import { rpcClient } from "../config/rpc.config"

export const getTokenInfo = (propid: number) => {
    return rpcClient.call('tl_getproperty', propid);
}

export const listTokens = () => {
    return rpcClient.call('tl_listproperties');
}
