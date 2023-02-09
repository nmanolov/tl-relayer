import { FastifyInstance } from "fastify";
import { getTx } from "../services/tx.service";
import { get } from "./helper";

export const txRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/:txid', (request) => {
        const { txid } = request.params as { txid: string };
        return getTx(txid);
    });

    done();
}
