import { rpcClient } from "../config/rpc.config"

export const listNatives = () => {
    return rpcClient.call('tl_list_natives');
}

export const listOracles = () => {
    return rpcClient.call('tl_list_oracles');
}
