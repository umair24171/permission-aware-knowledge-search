# Permission aware knowledge search plan

## Scope

Mock Drive, Slack and Notion connectors supply indexed synthetic documents plus live source metadata, ancestor relationships, grants, group membership and revocable link capabilities. Retrieval applies the full permission predicate inside PostgreSQL before ranking and LIMIT. Local hash embeddings use pgvector; answers see only permitted chunks.

## Data model

Source nodes (connector, parent, inheritance, active, content version, link sharing), source ACL grants, live group membership, hashed link capabilities, indexed document chunks and vectors tied to source content versions. Current ACL metadata is distinct from the content index.

## Tools

TypeScript, pg, PostgreSQL with pgvector, PGlite vector extension for supplemental host tests, mock connectors, deterministic hash embedding, mock and Claude answer provider, Node tests, Cartesian leak suite and retrieval quality eval, Docker and Actions.

## Written edge cases, each with named tests

1. Group membership removal immediately revokes indexed access.
2. Deleted document or ancestor hides all chunks; moved nodes inherit new permissions.
3. Link-shared document requires its revocable capability; guessed or missing link denied.
4. Nested folder inheritance works, including a boundary that stops inheritance.
5. User with no grants gets no chunks and no model invocation.
6. Near duplicates with different ACLs never leak restricted copy.
7. Grant/link revocation after indexing takes effect without re-embedding.
8. Prompt asking for restricted text cannot alter database authorization.
9. SQL injection, invalid limits, cycles and cross-connector parent moves rejected.
10. Content version change hides stale index until reindex; deleted-node ancestry remains denied across inheritance boundaries.
11. Many-user/query Cartesian leak suite asserts zero unauthorized document IDs and secret canary text in provided contexts.
12. Retrieval quality uses separate topical query/relevance labels, reports recall@3 and MRR with only accessible ground truth.
