---
name: skill-creator
description: "Create new AI agent skills following the Prowler-like standard. Use when adding new capabilities."
event: manual-trigger
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - skill_name
  - skill_description
output: skill_file
output_format: ".github/skills/{name}/SKILL.md"

# Agent Association
called_by: ["@Architect", "@Scribe"]
mcp_tools:
  - create_file
---

# Skill Creator Skill

> **Purpose:** Standardize the creation of new Agent Skills.

## Structure

1.  **Directory:** `.github/skills/{skill-name}/`
2.  **File:** `SKILL.md`

## Template

````markdown
---
name: { skill-name }
description: "{Short description used for auto-discovery}"
event: { file-change|manual-trigger }
auto_trigger: { true|false }
version: "1.0.0"
last_updated: "YYYY-MM-DD"

# Inputs/Outputs
inputs:
  - source_input
output: desired_output
output_format: "Description of output"

# Auto-Trigger Rules (Optional)
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "path/to/watch.ts"

# Agent Association
called_by: ["@AgentName"]
mcp_tools:
  - tool_name
---

# {Skill Name} Skill

> **Purpose:** {One-line purpose}

## Guidelines

1.  **Rule 1**
2.  **Rule 2**

## Code Patterns

```typescript
// Example code
```
````

```

## Post-Creation

After creating a skill, the system (Copilot) will automatically discover it if it's in `.github/skills/`. Ensure `AGENTS.md` is updated (use `skill-sync`).
```
