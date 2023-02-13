import { rpcClient } from "../config/rpc.config"

export const listNatives = () => {
    return rpcClient.call('tl_list_natives');
}

export const listOracles = () => {
    return rpcClient.call('tl_list_oracles');
}

export const getContract = (id: string) => {
    return rpcClient.call('tl_getcontract', id);
}

export const getContractOpenInterest = (id: string) => {
    return rpcClient.call('tl_getopen_interest', id);
}

export const getContractTradeHistory = (id: string) => {
    return rpcClient.call('tl_gettradehistory', id);
}

export const getContractTradeHistoryUnfiltered = (id: string) => {
    return rpcClient.call('tl_gettradehistory_unfiltered', id);
}
