# Assumptions

All data synthetic. No real Drive, Slack or Notion APIs. Mock connectors write authoritative source metadata and index into the same database; access changes are synchronous and transactional in this example. Real connector event latency, outages and permissions semantics require additional fail-closed design and are not claimed solved here.

The authenticated identity is trusted caller context, never query/model text. Source adapters normalize grants into additive user/group grants with an explicit stop-inheritance flag. Deleted ancestors deny descendants even across inheritance boundaries. Connector boundaries cannot share parent folders. Link sharing means possession of a revocable random capability for that document; public unrestricted links are deliberately not modeled.

Permission filter is applied inside retrieval SQL, not post-filtering. This is the requested equivalent-query-filter approach, not row level security against arbitrary direct database SQL. Callers never receive database credentials. Administrators can read underlying data.

Hash bag-of-token vectors are local deterministic embeddings for a small inspectable baseline. They are not semantic production embeddings. Claude is used only to draft grounded answers behind a provider interface; no paid calls in tests. Native pgvector, the embedded complement and Docker passed in the linked GitHub Actions run; see docs/TEST-REPORT.md. Owner/site verified as umair24171 and umair24171/dev_umair.

Source code is provided under the MIT license. Public repository names and topics are proposed until GitHub creation succeeds.
