"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
// import { routes } from "./router";
const fastify = (0, fastify_1.default)({
    logger: true,
});
// fastify.register(routes);
fastify.listen({ port: 3001 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Started server at ${address}`);
});
