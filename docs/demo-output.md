# Recorded demo output

All data synthetic. Actual command: `TEST_PGLITE=1 npm run demo`. Embedded PostgreSQL with pgvector. Native Docker demo remains unverified.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> buildzn-permission-aware-knowledge-search@0.1.0 demo
> node --import tsx src/demo.ts

All documents, users and ACLs are synthetic.
Bob before revoke: [ 'deploy', 'leave-policy' ]
Bob after revoke: [ 'leave-policy' ]
Outsider restricted prompt: { text: 'No accessible evidence.', chunks: [] }
Carol refund evidence: {
  text: '[refund-policy] Refund policy: delivered orders can receive refunds within thirty days, maximum fifty dollars.',
  chunks: [
    {
      id: 'refund-policy:0',
      node: 'refund-policy',
      body: 'Refund policy: delivered orders can receive refunds within thirty days, maximum fifty dollars.',
      distance: 0.6077677297236319
    }
  ]
}
```
