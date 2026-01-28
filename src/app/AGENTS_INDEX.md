# AGENTS Index & Update Policy

Purpose: central index for AGENTS documents. Keep this file small — layer files contain rules; this file contains ownership, update policy, and version notes.

Files:
- Root summary: [`/AGENTS.md`](../../AGENTS.md) — canonical 1-page project summary.
- Domain rules: [`src/app/domain/AGENTS.md`](domain/AGENTS.md)
- Application rules: [`src/app/application/AGENTS.md`](application/AGENTS.md)
- Infrastructure rules: [`src/app/infrastructure/AGENTS.md`](infrastructure/AGENTS.md)
- Presentation rules: [`src/app/presentation/AGENTS.md`](presentation/AGENTS.md)

Update policy:
- **Owner**: each layer folder declares a single owner (team/person) in the top of its AGENTS file.
- **Change process**: small edits via PR; major policy changes require an ADR and coordination meeting.
- **Noise reduction**: keep layer AGENTS < 30 lines; move long-form rationale into `docs/agents-archive/`.

Versioning:
- `v1` — Initial consolidation (current)
- `v1.x` — Minor edits; update this file with changelog bullets.

How to use:
- Read root `/AGENTS.md` for quick orientation.
- When implementing, consult the specific layer AGENTS for concrete rules.
- To propose changes: open PR to the specific `src/app/*/AGENTS.md` and mention `AGENTS_INDEX.md`.
