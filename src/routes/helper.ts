export const get = (fastify, path, handler) => {
  fastify.get(path, (request, reply) => {
      return handler(request)
          .then(res => reply.send(res))
          .catch(error => reply.send({ error: error.message }));
  });
}
