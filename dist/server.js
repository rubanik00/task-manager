"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const router_1 = require("./router");
const fastify = (0, fastify_1.default)({
    logger: true,
});
fastify.register(router_1.routes);
fastify.listen({ port: 3005 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Started server at ${address}`);
});
