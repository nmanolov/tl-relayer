import { FastifyInstance } from "fastify";
import { rpcClient } from "../config/rpc.config"
import { getAttestationPayload, importPubKey } from "../services/address.service";
import { listunspent } from "../services/sochain.service";
import { ELogType, saveLog } from "../services/utils.service";

const allowedMethods = [
    'tl_getallbalancesforaddress',
    'tl_getproperty',
    'tl_list_attestation',
    'tl_getbalance',
    'tl_getinfo',
    'tl_createrawtx_opreturn',
    'tl_createrawtx_reference',
    'tl_check_kyc',
    'tl_check_commits',
    'tl_listnodereward_addresses',
    'tl_getfullposition',
    //
    'tl_createpayload_commit_tochannel',
    'tl_createpayload_withdrawal_fromchannel',
    'tl_createpayload_simplesend',
    'tl_createpayload_attestation',
    'tl_createpayload_instant_ltc_trade',
    'tl_createpayload_instant_trade',
    'tl_createpayload_contract_instant_trade',
    //
    'createrawtransaction',
    'sendrawtransaction',
    'decoderawtransaction',
    'validateaddress',
    'addmultisigaddress',
];



export const rpcRoutes = (fastify: FastifyInstance, opts: any, done: any) => {
    const selectAndInvokeRpcCall = (request) => {
        const { params } = request.body as { params: any[] };
        const { method } = request.params as { method: string };

        if (method === 'listunspent') {
            return listunspent(fastify, params);
        }

        if (method === 'tl_createpayload_attestation') {
           return getAttestationPayload(fastify, request.ip);
        }

        if (method === 'importpubkey') {
            return importPubKey(fastify, params);
        }

        if (method === 'sendrawtransaction') {
            return rpcClient.call(method, ...params)
                .then((res) => {
                    if (res.data) {
                        saveLog(ELogType.TXIDS, res.data);
                    }
                    return res;
                });
        }

        if (!allowedMethods.includes(method)) {
            return Promise.reject({ message: `${method} Method is not allowed` });
        }

        const _params = params?.length ? params : [];
        return rpcClient.call(method, ..._params);
    }

    fastify.post('/:method', async (request, reply) => {
        try {
            const res = await selectAndInvokeRpcCall(request);
            reply.send(res);
        } catch (error) {
            reply.send({ error: error.message });
        }
    });

    done();
}
