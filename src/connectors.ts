import type { Database } from "./db.js";
import { embed, vectorLiteral, tokenHash } from "./embedding.js";
export class MockConnector {
  constructor(
    private db: Database,
    readonly source: "drive" | "slack" | "notion",
  ) {}
  async node(id: string, parent: string | null = null, inherit = true) {
    if (!id) throw new Error("Node ID required");
    await this.db.tx(async (q) => {
      if (parent) {
        const [p] = await q.query(
          "SELECT connector FROM source_nodes WHERE id=$1",
          [parent],
        );
        if (p?.connector !== this.source)
          throw new Error("Cross-connector parent");
      }
      await q.query(
        "INSERT INTO source_nodes(id,connector,parent,inherit) VALUES($1,$2,$3,$4)",
        [id, this.source, parent, inherit],
      );
    });
  }
  private async own(id: string) {
    const [n] = await this.db.query("SELECT * FROM source_nodes WHERE id=$1", [
      id,
    ]);
    if (n?.connector !== this.source) throw new Error("Wrong connector");
    return n;
  }
  async index(id: string, body: string) {
    const n = await this.own(id);
    if (!n.active) throw new Error("Deleted source");
    const pieces = body.match(/[\s\S]{1,500}/g) ?? [];
    await this.db.tx(async (q) => {
      await q.query("DELETE FROM chunks WHERE node=$1", [id]);
      for (let i = 0; i < pieces.length; i++)
        await q.query("INSERT INTO chunks VALUES($1,$2,$3,$4,$5::vector)", [
          `${id}:${i}`,
          id,
          n.version,
          pieces[i],
          vectorLiteral(embed(pieces[i]!)),
        ]);
    });
  }
  async grant(id: string, kind: "user" | "group", principal: string) {
    await this.own(id);
    await this.db.query(
      "INSERT INTO grants VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
      [id, kind, principal],
    );
  }
  async revoke(id: string, kind: "user" | "group", principal: string) {
    await this.own(id);
    await this.db.query(
      "DELETE FROM grants WHERE node=$1 AND kind=$2 AND principal=$3",
      [id, kind, principal],
    );
  }
  async remove(id: string) {
    await this.own(id);
    await this.db.query("UPDATE source_nodes SET active=false WHERE id=$1", [
      id,
    ]);
  }
  async changed(id: string) {
    await this.own(id);
    await this.db.query(
      "UPDATE source_nodes SET version=version+1 WHERE id=$1",
      [id],
    );
  }
  async move(id: string, parent: string | null) {
    await this.db.tx(async (q) => {
      // Serialize tree changes so concurrent opposite moves cannot introduce a cycle.
      await q.query("SELECT id FROM source_nodes ORDER BY id FOR UPDATE");
      const [n] = await q.query(
        "SELECT connector FROM source_nodes WHERE id=$1",
        [id],
      );
      if (n?.connector !== this.source) throw new Error("Wrong connector");
      if (parent) {
        const [p] = await q.query(
          "SELECT connector FROM source_nodes WHERE id=$1",
          [parent],
        );
        if (p?.connector !== this.source)
          throw new Error("Cross-connector parent");
        const ancestors = await q.query(
          "WITH RECURSIVE a AS (SELECT id,parent FROM source_nodes WHERE id=$1 UNION SELECT n.id,n.parent FROM source_nodes n JOIN a ON n.id=a.parent) SELECT id FROM a",
          [parent],
        );
        if (ancestors.some((x) => x.id === id)) throw new Error("Cycle");
      }
      await q.query("UPDATE source_nodes SET parent=$2 WHERE id=$1", [
        id,
        parent,
      ]);
    });
  }
  async shareLink(id: string, token: string) {
    await this.own(id);
    if (token.length < 24) throw new Error("Link capability too short");
    await this.db.tx(async (q) => {
      await q.query("UPDATE source_nodes SET link_shared=true WHERE id=$1", [
        id,
      ]);
      await q.query("INSERT INTO links VALUES($1,$2) ON CONFLICT DO NOTHING", [
        id,
        tokenHash(token),
      ]);
    });
  }
  async revokeLink(id: string, token: string) {
    await this.own(id);
    await this.db.query("DELETE FROM links WHERE node=$1 AND token_hash=$2", [
      id,
      tokenHash(token),
    ]);
  }
}
export async function membership(
  db: Database,
  user: string,
  group: string,
  enabled = true,
) {
  if (enabled)
    await db.query(
      "INSERT INTO memberships VALUES($1,$2) ON CONFLICT DO NOTHING",
      [user, group],
    );
  else
    await db.query("DELETE FROM memberships WHERE user_id=$1 AND group_id=$2", [
      user,
      group,
    ]);
}
