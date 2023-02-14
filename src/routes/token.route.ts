import { FastifyInstance } from "fastify";
import { getTokenInfo, listTokens, getTokenCurrencyTotal, getCache, getLtcVolume } from "../services/token.service";
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

    get(fastify, '/:propertyId/cache', (request) => {
        const { propertyId } = request.params as { propertyId: string };
        const { cacheType } = request.query as { cacheType: string };
        const _propId = parseInt(propertyId);
        return getCache(_propId, cacheType);
    });

    get(fastify, '/:propertyId/ltc_volume', (request) => {
        const { propertyId } = request.params as { propertyId: string };
        const {
            startBlock,
            endBlock
        } = request.query as {
            startBlock: string,
            endBlock: string,
        };
        const _propId = parseInt(propertyId);
        const _startBlock = startBlock && parseInt(startBlock);
        const _endBlock = endBlock && parseInt(endBlock);

        return getLtcVolume(_propId, _startBlock, _endBlock);
    })

    done();
}
