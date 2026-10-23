# Work in progress: Permission aware knowledge search

Synthetic BuildZn portfolio project. Mock Drive, Slack and Notion connectors provide document chunks and current source ACL metadata. PostgreSQL applies access checks inside the pgvector retrieval query before ranking and LIMIT. A model receives only that query's permitted chunks.

```mermaid
flowchart TD
  A[Mock source connectors] --> B[Current source ACL and ancestry]
  A --> C[Versioned chunks and vectors]
  D[Trusted user identity and query] --> E[SQL access filter and vector ranking]
  B --> E
  C --> E
  E --> F[Authorized context]
  F --> G[Grounded answer provider]
```

## Run
Node 24 and Docker Compose:

```sh
git clone <repository-url>
cd permission-aware-knowledge-search
docker compose up -d db
npm ci
DATABASE_URL=postgres://portfolio:synthetic-local-only@localhost:5432/portfolio npm run demo
```

Or `docker compose up --build --abort-on-container-exit --exit-code-from app`. The public synthetic database password is local demo configuration. `npm test` truncates tables: use a disposable database. `npm run eval` seeds fixtures and requires a fresh database. `docker compose down -v` resets local data.

```sh
npm run build
DATABASE_URL=postgres://portfolio:synthetic-local-only@localhost:5432/portfolio npm test
```

Supplemental cloud commands: `TEST_PGLITE=1 npm test`, `TEST_PGLITE=1 npm run demo`, `TEST_PGLITE=1 npm run eval`. These use an embedded PostgreSQL engine with the pgvector extension, not a substitute claim of Docker verification.

## Measured results
24 tests passed, zero failed or skipped. TypeScript check passed. Leak tests: 1,728 user/query pairs across baseline, group revocation and deleted-source phases, zero unauthorized chunks. Five topical queries: recall@3 1.0, MRR 1.0. These small synthetic measurements do not establish production retrieval quality or a universal absence of leaks. Raw outputs: docs/test-output.txt, docs/eval-output.txt, docs/demo-output.md.

The first host vector-extension initialization failed because an undefined positional data-directory argument discarded options. Using the documented options-object constructor loaded the extension; all tests then ran unchanged. A TypeScript array-narrowing error was fixed without changing the embedding semantics.

## Tradeoffs and limits
This uses an equivalent access predicate inside the database query, not RLS. A caller with direct database credentials could bypass it; the trusted application boundary is required. Identity is supplied by the trusted caller. Connector policies are normalized to additive user/group grants, stop-inheritance boundaries and document link capabilities. Actual Drive, Slack and Notion permission semantics and sync latency are not implemented. Revocations in the mock authoritative source tables are synchronous. A real system needs trusted permission snapshots and fail-closed freshness handling before making the same claim.

Authorization is evaluated at query time. Revocation cannot retract context already sent to a model. Queries read current ACLs separately from versioned content; changed content is hidden until reindexed. Recursive tree checks are exact for these fixtures but not optimized for large trees. Hash embeddings are a cheap lexical baseline with collisions and no semantic-language guarantees. Claude answer generation is optional and untested against a live endpoint. Citation and hallucination behavior outside the mock remain unmeasured.

No secrets or real customer content are included. No UI or deployment. Native pgvector CI, public repository and clean-clone Docker checks remain blocked; see docs/BLOCKERS.md, docs/PLAN.md and docs/ASSUMPTIONS.md.
