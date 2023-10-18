import Fastify from "fastify";
import { routes } from "./router";

const fastify = Fastify({
  logger: true,
});
fastify.register(routes);

fastify.listen({ port: 3001 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Started server at ${address}`);
});
