import { FastifyInstance } from "fastify";
import { fundAddress, getBalance, getUnvestedBalance, validate } from "../services/address.service";
import { get } from "./helper";

export const addressRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/:address/validate', (request) => {
        const { address } = request.params as { address: string };
        return validate(address);
    });

    get(fastify, '/:address/balance', (request) => {
        const { address } = request.params as { address: string };
        return getBalance(address);
    });

    get(fastify, '/:address/unvested_balance', (request) => {
        const { address } = request.params as { address: string };
        return getUnvestedBalance(address);
    });

    get(fastify, '/:address/faucet', (request) => {
        const { address } = request.params as { address: string };
        return fundAddress(address);
    })

    done();
}
