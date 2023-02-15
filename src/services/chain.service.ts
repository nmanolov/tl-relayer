import { rpcClient } from "../config/rpc.config"

export const getChainInfo = () => {
    return rpcClient.call('tl_getinfo');
}

export const getNextReward = () => {
    return rpcClient.call('tl_getnextreward');
}

export const listNodeRewardAddresses = () => {
    return rpcClient.call('tl_listnodereward_addresses');
}

export const getLastWinners = () => {
    return rpcClient.call('tl_getlast_winners');
}
