# Work tracking facts

- Active work is tracked on the Flashheart board: project `tz`, key `TZ`, in the default root `~/reports/Kanban`, which is not committed.
- Use the `flashheart` MCP tools and skill: claim a ticket before starting, checkpoint at milestones, write a review and move it to `review` when the pull request opens. Agents never move tickets to `done`.
- New work gets a ticket first; work spanning several tickets with a shared goal belongs in a workstream.
- Tickets hold scope and acceptance criteria. Longer briefs may live in `docs/dev/roadmap-items/` and plans in `docs/dev/plans/` with zero-padded numeric prefixes; the ticket links them.
- Completed outcomes move into `docs/PRODUCT.md`, decisions, README, release governance, and changelog.
- Machines without the board (CI, other checkouts) skip ticket updates.
