# Git Review + Worktree Engine

Every code change in Mythos Director runs in an isolated git worktree.

## Flow

1. Agent proposes change
2. Worktree created from current branch
3. Diff generated
4. Human reviews in dashboard
5. Approve → merge | Reject → discard
6. Never auto-merge

## Security

- Fail-closed
- Full audit
- Review required for any mutation
