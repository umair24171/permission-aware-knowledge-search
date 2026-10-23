# Test report

All data synthetic. [Successful native CI and Docker run](https://github.com/umair24171/permission-aware-knowledge-search/actions/runs/40030755414), verified code commit `88b632a9606d4042c304839780e8179cc747d726`. Complete actual stdout: docs/native-ci-output.txt.

| Environment                    | Discovered | Passed | Failed | Skipped |
| ------------------------------ | ---------: | -----: | -----: | ------: |
| PostgreSQL service             |         24 |     24 |      0 |       0 |
| Embedded PostgreSQL complement |         24 |     24 |      0 |       0 |

All 24 distinct cases passed in at least one appropriate environment. No test cases were skipped.

Dependency install, formatting, TypeScript, native database tests, embedded complement, configured full-history secret scan, native demo and Docker Compose build/demo passed. Docker ran from a fresh Actions checkout and isolated volume, with no deployment. Earlier fresh local-clone evidence remains in docs/clean-clone-output.txt. Live Claude requests were not made. There are no real customer fixtures.

Known platform-specific assertion/implementation fixes are in PROGRESS.md and history. No test was deleted or weakened: the invoice IPC correction inspects the readiness payload rather than an unrelated optional transport-handle argument.
