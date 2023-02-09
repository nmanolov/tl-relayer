import { FastifyInstance } from "fastify";
import { getTokenInfo, listTokens } from "../services/token.service";
import { get } from "./helper";

export const tokenRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/list', (request) => {
        return listTokens();
    });
    get(fastify, '/:propid', (request) => {
        const { propid } = request.params as { propid: string };
        const _propid = parseInt(propid);
        return getTokenInfo(_propid);
    });

    done();
}
