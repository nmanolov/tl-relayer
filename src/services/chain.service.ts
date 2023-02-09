import { rpcClient } from "../config/rpc.config"

export const getChainInfo = () => {
    return rpcClient.call('tl_getinfo');
}
