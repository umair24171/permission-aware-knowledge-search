import type { Query } from "./db.js";
export async function migrate(q: Query) {
  for (const s of [
    `CREATE EXTENSION IF NOT EXISTS vector`,
    `CREATE TABLE IF NOT EXISTS source_nodes(id text PRIMARY KEY, connector text NOT NULL CHECK(connector IN ('drive','slack','notion')), parent text REFERENCES source_nodes(id), inherit boolean NOT NULL DEFAULT true, active boolean NOT NULL DEFAULT true, version integer NOT NULL DEFAULT 1, link_shared boolean NOT NULL DEFAULT false)`,
    `CREATE TABLE IF NOT EXISTS grants(node text REFERENCES source_nodes(id), kind text NOT NULL CHECK(kind IN ('user','group')), principal text NOT NULL, PRIMARY KEY(node,kind,principal))`,
    `CREATE TABLE IF NOT EXISTS memberships(user_id text NOT NULL, group_id text NOT NULL, PRIMARY KEY(user_id,group_id))`,
    `CREATE TABLE IF NOT EXISTS links(node text REFERENCES source_nodes(id), token_hash text NOT NULL, PRIMARY KEY(node,token_hash))`,
    `CREATE TABLE IF NOT EXISTS chunks(id text PRIMARY KEY, node text NOT NULL REFERENCES source_nodes(id), version integer NOT NULL, body text NOT NULL, embedding vector(64) NOT NULL)`,
  ])
    await q.query(s);
}
