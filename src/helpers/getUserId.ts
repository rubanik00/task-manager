export async function getUserId(pool: any, username: string) {
  const findUserQuery = `
  SELECT id, username
  FROM users
  WHERE username = $1`;

  const userId = await pool.query(findUserQuery, [username]);
  return userId.rows[0].id;
}
