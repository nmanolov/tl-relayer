import { FastifyInstance } from "fastify";
import { getChainInfo } from "../services/chain.service";
import { get } from "./helper";

export const chainRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/info', (request) => {
        return getChainInfo();
    })

    done();
}
