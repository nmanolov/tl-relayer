import { FastifyInstance } from "fastify";
import { fundAddress, getAddressBalance, validateAddress } from "../services/address.service";
import { get } from "./helper";

export const addressRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/validate/:address', (request) => {
        const { address } = request.params as { address: string };
        return validateAddress(address);
    });

    get(fastify, '/balance/:address', (request) => {
        const { address } = request.params as { address: string };
        return getAddressBalance(address);
    });

    get(fastify, '/faucet/:address', (request) => {
        const { address } = request.params as { address: string };
        return fundAddress(address);
    })

    done();
}
