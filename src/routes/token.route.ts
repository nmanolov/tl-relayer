import { FastifyInstance } from "fastify";
import { getTokenInfo, listTokens, getTokenCurrencyTotal } from "../services/token.service";
import { get } from "./helper";

export const tokenRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/', (_request) => {
        return listTokens();
    });
    get(fastify, '/:propertyId', (request) => {
        const { propertyId } = request.params as { propertyId: string };
        const _propid = parseInt(propertyId);
        return getTokenInfo(_propid);
    });

    get(fastify, '/:propertyId/currency_total', (request) => {
        const { propertyId } = request.params as { propertyId: string };
        const _propid = parseInt(propertyId);
        return getTokenCurrencyTotal(_propid);
    });

    done();
}
