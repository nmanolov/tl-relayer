import { FastifyInstance } from "fastify";
import { listNatives, listOracles } from "../services/contract.service";
import { get } from "./helper";

export const contractRoute = (fastify: FastifyInstance, _opts: any, done: any) => {
    get(fastify, '/natives', (_request) => {
        return listNatives();
    });
    get(fastify, '/oracles', (request) => {
        return listOracles();
    });

    done();
}
