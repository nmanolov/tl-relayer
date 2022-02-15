import { FastifyInstance } from "fastify";
import { rpcClient } from "../config/rpc.config"
import { listunspent } from "../services/sochain.service";

const allowedMethods = [
    'tl_getallbalancesforaddress',
    'tl_getproperty',
    'tl_list_attestation',
    // 'tl_listnodereward_addresses',
    // 'tl_isaddresswinner',
    'tl_getbalance',
    'sendrawtransaction',
];

export const rpcRoutes = (fastify: FastifyInstance, opts: any, done: any) => {
    fastify.post('/:method', async (request, reply) => {
        try {
            const { params } = request.body as { params: any[] };
            const { method } = request.params as { method: string };

            if (method === 'listunspent') {
                const res = await listunspent(fastify, params);
                reply.send(res);
                return;
            }

            if (!allowedMethods.includes(method)) {
                reply.send({ error: `${method} Method is now allowed` });
                return;
            } else {
                const res = await rpcClient.call(method, ...params);
                reply.send(res);
                return;
            }
        } catch (error) {
            reply.send({ error: error.message });
        }
    });

    done();
}
