import { FastifyInstance } from "fastify";
import { getChainInfo, getLastWinners, getNextReward, listNodeRewardAddresses } from "../services/chain.service";
import { get } from "./helper";

export const chainRoute = (fastify: FastifyInstance, opts: any, done: any) => {
    get(fastify, '/info', (_request) => {
        return getChainInfo();
    });

    get(fastify, '/next_reward', (_request) => {
        return getNextReward();
    });

    get(fastify, '/node_reward_addresses', (_request) => {
        return listNodeRewardAddresses();
    });

    get(fastify, '/last_winners', (_request) => {
        return getLastWinners();
    });

    done();
}
