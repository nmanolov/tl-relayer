import { FastifyInstance } from "fastify";
import { addressRoute } from "./address.route";
import { chainRoute } from "./chain.route";
import { contractRoute } from "./contract.route";
import { rpcRoutes } from "./rpc.route";
import { tokenRoute } from "./token.route";
import { txRoute } from "./tx.route";

export const handleRoutes = (server: FastifyInstance) => {
    server.register(require('fastify-cors'))
        .register(require('fastify-axios'))
        .register(addressRoute, { prefix: '/address' })
        .register(txRoute, { prefix: '/tx' })
        .register(tokenRoute, { prefix: '/tokens' })
        .register(contractRoute, {prefix: '/contracts'})
        .register(chainRoute, { prefix: '/chain' })
        .register(rpcRoutes, { prefix: '/rpc' });
}
