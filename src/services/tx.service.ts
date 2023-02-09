import { rpcClient } from "../config/rpc.config"

export const getTx =  (txid: string) => {
    return rpcClient.call('tl_gettransaction', txid);
}
