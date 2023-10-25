export const generalJsonSchema = {
  type: "object",
  required: ["general"],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    assign_to_user_id: { type: "number" },
    status: { type: "string" },
  },
};
