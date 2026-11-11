# Git facts

- Default branch: `main`.
- All repository changes use `feature/<short-description>` branches and pull requests.
- Keep commits focused and stage only intended files.
- Do not use `codex` in branch names, commit messages, PR titles, or PR bodies.
- Remote: `origin` is GitHub `rztaylor/WorldTime`; open pull requests against `main` with `gh pr create`.
- GitHub "Automatically delete head branches" is enabled (decided 2026-11-11), so a PR's head branch is deleted from `origin` when it merges. `release` is updated by push, not merged as a PR head, so it is unaffected. Delete local copies with `git fetch --prune` and `git branch -d`.
