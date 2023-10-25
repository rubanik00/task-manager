import { FastifyInstance } from "fastify";
import { generalJsonSchema } from "./schemas/schemas";
const { Pool } = require("pg");

const pool = new Pool({
  user: "oleh",
  host: "localhost",
  database: "task_manager",
  password: "2505",
  port: 5433,
});

export async function routes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.post(
    "/create",
    {
      schema: {
        body: generalJsonSchema,
      },
    },
    async (request, reply) => {
      const body = request.body as any;
      const currentTime: number = Date.now() / 1000;

      try {
        const query = `
          INSERT INTO tasks (name, description, assign_to_user_id, status, creation_time)
          VALUES ($1, $2, $3, $4, to_timestamp($5)) RETURNING id`;

        const result = await pool.query(query, [
          body.general.name,
          body.general.description,
          body.general.assign_to_user_id,
          body.general.status,
          parseInt(currentTime.toString()),
        ]);

        reply.status(201).send({ id: result.rows[0].id });
      } catch (error) {
        console.error("Inserting data error:", error);
        reply.status(500).send({ error: "Inserting data error" });
      }
    }
  );

  fastify.put(
    "/:id/edit",
    {
      schema: {
        body: generalJsonSchema,
      },
    },
    async (request, reply) => {
      const params = request.params as any;
      const body = request.body as any;
      const id = params.id;

      const fields = ["name", "description", "assign_to_user_id", "status"];
      const notEmptyFields = [];
      const data = [];
      for (let i = 0; i < fields.length; i++) {
        if (body.general[fields[i]] != null) {
          notEmptyFields.push(fields[i]);
          data.push(body.general[fields[i]]);
        }
      }

      for (let i = 0; i < notEmptyFields.length; i++) {
        notEmptyFields[i] = notEmptyFields[i] + " = $" + (i + 1);
      }
      if (notEmptyFields.length == 0) {
        console.error("Data is empty");
        reply.status(500).send({ error: "Data is empty" });
      }

      try {
        const query = `
          UPDATE tasks
          SET ${notEmptyFields.join(", ")}
          WHERE id = $${notEmptyFields.length + 1}
        `;

        await pool.query(query, data.concat(id));

        reply.status(200).send({ message: "Record updated successfully" });
      } catch (error) {
        console.error("Error updating data:", error);
        reply.status(500).send({ error: "Error updating data" });
      }
    }
  );
}
