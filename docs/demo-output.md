# Recorded native and Docker demo output

All data synthetic. [Verified Actions run](https://github.com/umair24171/permission-aware-knowledge-search/actions/runs/40030755414). No hosting deployment.

## Native PostgreSQL demo

```text
##[group]Run npm run demo
npm run demo
shell: /usr/bin/bash -e {0}
env:
  DATABASE_URL: ***localhost:5432/portfolio
##[endgroup]

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

## Docker Compose demo

```text
app-1  |
app-1  | > buildzn-permission-aware-knowledge-search@0.1.0 demo
app-1  | > node --import tsx src/demo.ts
app-1  |
app-1  | All documents, users and ACLs are synthetic.
app-1  | Bob before revoke: [ 'deploy', 'leave-policy' ]
app-1  | Bob after revoke: [ 'leave-policy' ]
app-1  | Outsider restricted prompt: { text: 'No accessible evidence.', chunks: [] }
app-1  | Carol refund evidence: {
app-1  |   text: '[refund-policy] Refund policy: delivered orders can receive refunds within thirty days, maximum fifty dollars.',
app-1  |   chunks: [
app-1  |     {
app-1  |       id: 'refund-policy:0',
app-1  |       node: 'refund-policy',
app-1  |       body: 'Refund policy: delivered orders can receive refunds within thirty days, maximum fifty dollars.',
app-1  |       distance: 0.6077677297236319
app-1  |     }
app-1  |   ]
app-1  | }
```
