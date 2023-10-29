import { getUserId } from "./helpers/getUserId";
import {
  generalJsonSchema,
  loginSchema,
  registerSchema,
} from "./schemas/schemas";

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const connectionConfig = {
  host: "localhost",
  port: 5433,
  database: "task_manager",
  user: "postgres",
  password: "2505",
};

const pool = new Pool(connectionConfig);

export async function routes(fastify: any) {
  fastify.get("/", async (_request: any, reply: any) => {
    reply.code(200).send({ hello: "world" });
  });

  fastify.get("/:username/user-id", async (request: any, reply: any) => {
    const params = request.params as any;
    const userId = await getUserId(pool, params.username);
    reply.code(200).send({ userID: userId });
  });

  fastify.get(
    "/tasks",
    {
      onRequest: [fastify.authenticate],
    },
    async (request: any, reply: any) => {
      const username = request.user.username;

      try {
        const userId = await getUserId(pool, username);

        const query = `
          SELECT id, name, description, status, creation_time
          FROM tasks
          WHERE assign_to_user = $1
        `;

        const result = await pool.query(query, [userId]);

        reply.status(200).send(result.rows);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        reply.status(500).send({ error: "Error fetching tasks" });
      }
    }
  );

  fastify.post(
    "/register",
    {
      schema: {
        body: registerSchema,
      },
    },
    async (request: any, reply: any) => {
      try {
        const body: any = request.body;
        const { username, name, password } = body.register;

        const salt = await bcrypt.genSalt(
          parseInt(process.env.SALT_ROUND as any)
        );

        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
        INSERT INTO users (username, name, password_hash)
        VALUES ($1, $2, $3) RETURNING id`;

        const result = await pool.query(query, [
          username,
          name,
          hashedPassword,
        ]);

        const token = fastify.jwt.sign(
          { username: username },
          process.env.JWT_SECRET
        );

        reply.status(201).send({ id: result.rows[0].id, token: token });
      } catch (error) {
        reply.code(500).send(error);
      }
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        body: loginSchema,
      },
    },
    async (request: any, reply: any) => {
      try {
        const body: any = request.body;
        const { username, password } = body.login;

        const findUserQuery = `
        SELECT id, username, name, password_hash
        FROM users
        WHERE username = $1`;

        const user = await pool.query(findUserQuery, [username]);

        if (!user) {
          reply.code(401).send("User not found");
          return;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.rows[0].password_hash
        );

        if (!isPasswordValid) {
          reply.code(401).send("Wrong password");
          return;
        }

        const token = fastify.jwt.sign(
          { username: username },
          process.env.JWT_SECRET
        );

        reply.send({ token });
      } catch (error) {
        reply.code(500).send(error);
      }
    }
  );

  fastify.post(
    "/create",
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: generalJsonSchema,
      },
    },
    async (request: any, reply: any) => {
      const body = request.body as any;
      const currentTime: number = Date.now() / 1000;
      const userId = await getUserId(pool, request.user.username);

      try {
        const query = `
          INSERT INTO tasks (name, description, assign_to_user, status, creation_time)
          VALUES ($1, $2, $3, $4, to_timestamp($5)) RETURNING id`;

        const result = await pool.query(query, [
          body.general.name,
          body.general.description,
          userId,
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
      onRequest: [fastify.authenticate],
      schema: {
        body: generalJsonSchema,
      },
    },
    async (request: any, reply: any) => {
      const params = request.params as any;
      const body = request.body as any;
      const id = params.id;

      const fields = ["name", "description", "status"];
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

  fastify.delete(
    "/:taskId/task",
    {
      onRequest: [fastify.authenticate],
    },
    async (request: any, reply: any) => {
      const username = request.user.username;
      const taskId = request.params.taskId;

      try {
        const userId = await getUserId(pool, username);

        const deleteQuery = `
          DELETE FROM tasks
          WHERE id = $1 AND assign_to_user = $2
        `;

        const result = await pool.query(deleteQuery, [taskId, userId]);

        if (result.rowCount === 1) {
          reply.status(204).send({ success: "Successfully Deleted" });
        } else {
          reply
            .status(404)
            .send({ error: "Task not found or does not belong to the user" });
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        reply.status(500).send({ error: "Error deleting task" });
      }
    }
  );
}
