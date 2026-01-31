---
name: skill-sync
description: "Synchronize AGENTS.md with the current state of available skills. Use after adding/removing skills."
event: file-change
auto_trigger: true
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - .github/skills/
output: AGENTS.md
output_format: "Updated Markdown table"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - ".github/skills/**/SKILL.md"

# Agent Association
called_by: ["@Scribe"]
mcp_tools:
  - list_dir
  - read_file
  - replace_string_in_file
---

# Skill Sync Skill

> **Purpose:** Keep the central `AGENTS.md` orchestrator in sync with the `skills/` directory.

## Process

1.  **List Skills:** Scan `.github/skills/` for all `SKILL.md` files.
2.  **Extract Meta:** Read frontmatter `name` and `description` from each.
3.  **Update Table:** Regenerate the "Skills" table in `AGENTS.md`.

## Table Format

| Skill        | Description                  | File                                                                     |
| :----------- | :--------------------------- | :----------------------------------------------------------------------- |
| `skill-name` | Description from frontmatter | [.github/skills/skill-name/SKILL.md](.github/skills/skill-name/SKILL.md) |
