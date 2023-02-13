import { FastifyInstance } from "fastify";
import { listNatives, listOracles, getContract, getContractOpenInterest, getContractTradeHistory, getContractTradeHistoryUnfiltered } from "../services/contract.service";
import { get } from "./helper";

export const contractRoute = (fastify: FastifyInstance, _opts: any, done: any) => {
    get(fastify, '/natives', (_request) => {
        return listNatives();
    });
    get(fastify, '/oracles', (_request) => {
        return listOracles();
    });

    get(fastify, '/:contractId', (request) => {
        const { contractId } = request.params as { contractId: string };
        return getContract(contractId);
    });

    get(fastify, '/:contractId/open_interest', (request) => {
        const { contractId } = request.params as { contractId: string };
        return getContractOpenInterest(contractId);
    });

    get(fastify, '/:contractId/trade_history', (request) => {
        const { contractId } = request.params as { contractId: string };
        return getContractTradeHistory(contractId);
    });

    get(fastify, '/:contractId/trade_history_unfiltered', (request) => {
        const { contractId } = request.params as { contractId: string };
        return getContractTradeHistoryUnfiltered(contractId);
    });

    done();
}
