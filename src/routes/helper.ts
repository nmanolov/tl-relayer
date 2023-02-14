import { FastifyInstance, FastifyRequest, RouteHandlerMethod } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage, Server } from "http";


type HandlerType = (request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>) => Promise<any>;

export const get = (fastify: FastifyInstance, path: string, handler: HandlerType) => {
  fastify.get(path, (request, reply) => {
      return handler(request)
          .then(res => reply.send(res))
          .catch(error => reply.send({ error: error.message }));
  });
}
