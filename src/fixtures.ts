import type { Database } from "./db.js";
import { MockConnector, membership } from "./connectors.js";
export const capability = "synthetic-link-capability-only-0001";
export async function fixtures(db: Database) {
  const drive = new MockConnector(db, "drive"),
    slack = new MockConnector(db, "slack"),
    notion = new MockConnector(db, "notion");
  await drive.node("engineering");
  await drive.grant("engineering", "group", "engineering");
  await drive.node("nested", "engineering");
  await drive.node("deploy", "nested");
  await drive.index(
    "deploy",
    "Deployment rollback runbook: inspect logs, restore the previous release, verify health checks.",
  );
  await drive.node("private");
  await drive.grant("private", "user", "alice");
  await drive.node("restricted", "private");
  await drive.index(
    "restricted",
    "Deployment rollback runbook private appendix. RESTRICTED_CANARY_7319 confidential acquisition budget.",
  );
  await slack.node("support-channel");
  await slack.grant("support-channel", "group", "support");
  await slack.node("refund-policy", "support-channel");
  await slack.index(
    "refund-policy",
    "Refund policy: delivered orders can receive refunds within thirty days, maximum fifty dollars.",
  );
  await notion.node("handbook");
  await notion.grant("handbook", "user", "alice");
  await notion.grant("handbook", "user", "bob");
  await notion.node("leave-policy", "handbook");
  await notion.index(
    "leave-policy",
    "Leave vacation holiday policy: request annual leave at least two weeks before travel.",
  );
  await notion.node("link-only");
  await notion.index(
    "link-only",
    "Partner onboarding checklist: verify business identity and complete profile.",
  );
  await notion.shareLink("link-only", capability);
  await membership(db, "alice", "engineering");
  await membership(db, "bob", "engineering");
  await membership(db, "carol", "support");
  return { drive, slack, notion };
}
