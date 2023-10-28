import { FastifyRequest, FastifyReply } from "fastify";
const jwt = require("jsonwebtoken");

export const checkAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers["authorization"];

    if (!token) {
      reply.code(401).send("Требуется авторизация");
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED ", decoded);

    request.user = decoded;
  } catch (error) {
    reply.code(401).send("Требуется авторизация");
    return;
  }
};

