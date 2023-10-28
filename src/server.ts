import * as dotenv from "dotenv";
import fastify from "fastify";
import fastifyAuth from "@fastify/auth";
import { routes } from "./router";
dotenv.config();

const server = fastify();

server.register(fastifyAuth);

server.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET,
});
server.register(routes);

server.decorate(
  "authenticate",
  async function (
    request: { jwtVerify: () => any },
    reply: { send: (arg0: any) => void }
  ) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
);

server.get("/ping", async (_request: any, _reply: any) => {
  return "pong\n";
});

server.listen({ port: 3005 }, (err: any, address: any) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
