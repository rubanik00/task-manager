export const generalJsonSchema = {
  type: "object",
  required: ["general"],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    status: { type: "string" },
  },
};

export const registerSchema = {
  type: "object",
  required: ["register"],
  properties: {
    username: { type: "string" },
    name: { type: "string" },
    password: { type: "string" },
  },
};

export const loginSchema = {
  type: "object",
  required: ["login"],
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
};
