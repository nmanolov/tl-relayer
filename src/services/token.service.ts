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

enum CacheType {
    NativeFees = 0,
    OracleFees = 1,
    SpotFees = 2,
    Total
};

const parseCacheType = (p: string): CacheType => {
    const i = Number(p);
    if (i < 0) {
        throw { error: 'Invalid Cache Type' };
    }
    if (i >= 0 && i <= 2) {
        return i as CacheType;
    }
    return CacheType.Total;
}

export const getCache = (propId: number, type: string) => {
  const cacheType = parseCacheType(type);
  return rpcClient.call('tl_getcache', propId, cacheType);
}

export const getLtcVolume = (propId: number, firstBlock: number, secondBlock: number) => {
    return rpcClient.call('tl_get_ltcvolume', propId, firstBlock, secondBlock);
}

export const getVestingInfo = (propId: number) => {
    return rpcClient.call('tl_getvesting_info', propId);
}
