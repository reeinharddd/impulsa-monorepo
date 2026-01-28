# Skills System

> **Version:** 4.0.0 | **Standard:** Agent Skills (agentskills.io)

This directory contains skills that are **automatically discovered** by GitHub Copilot.

## How Skills Work (Auto-Discovery)

Skills are loaded automatically when Copilot determines they're relevant to your task based on the `description` field in each `SKILL.md` file.

```
User Request → Copilot Analyzes → Matches description → Loads SKILL.md
                                                              ↓
                                                      Instructions applied
```

**Key:** Write clear, specific `description` fields that explain:

1. What the skill does
2. **When** Copilot should use it

## Directory Structure

Each skill has its own folder containing:

```
skills/
├── README.md                    ← This file
├── commit/
│   └── SKILL.md                 ← Skill definition (MUST be named SKILL.md)
├── migration/
│   ├── SKILL.md                 ← Skill definition
│   └── examples/                ← Optional: examples, scripts
└── ...
```

## How Skills Work

```
Event Trigger → Skill Invoked → Process Inputs → Return Output
     ↓              ↓                ↓               ↓
 pre-commit    commit/SKILL      staged_files   commit_message
```

## Available Skills (18 Total)

### Core Skills (Workflow)

| Skill     | Folder                                   | Trigger          | Auto | Purpose                       |
| :-------- | :--------------------------------------- | :--------------- | :--- | :---------------------------- |
| Commit    | [commit/](commit/SKILL.md)               | `pre-commit`     | ✅   | Generate Conventional Commits |
| PR        | [pull-request/](pull-request/SKILL.md)   | `pr-creation`    | ✅   | Generate PR descriptions      |
| Review    | [code-review/](code-review/SKILL.md)     | `review-request` | ❌   | Automated code review         |
| Migration | [migration/](migration/SKILL.md)         | `schema-change`  | ✅   | Validate DB migrations        |
| Testing   | [testing/](testing/SKILL.md)             | `code-change`    | ❌   | Suggest tests needed          |
| Docs      | [documentation/](documentation/SKILL.md) | `doc-creation`   | ❌   | Apply doc template            |

### Frontend Skills

| Skill | Folder                                         | Trigger              | Auto | Purpose                   |
| :---- | :--------------------------------------------- | :------------------- | :--- | :------------------------ |
| i18n  | [i18n-translation/](i18n-translation/SKILL.md) | `component-creation` | ❌   | Ensure text is translated |

### Documentation Skills (Auto-Sync)

| Skill        | Folder                                                     | Trigger                 | Auto | Purpose                   |
| :----------- | :--------------------------------------------------------- | :---------------------- | :--- | :------------------------ |
| Frontmatter  | [frontmatter-validation/](frontmatter-validation/SKILL.md) | `doc-save`              | ✅   | Validate YAML frontmatter |
| ADR          | [adr-creation/](adr-creation/SKILL.md)                     | `architecture-decision` | ❌   | Create ADR documents      |
| Schema Sync  | [schema-doc-sync/](schema-doc-sync/SKILL.md)               | `schema-change`         | ✅   | Sync schema docs          |
| API Docs     | [api-doc-generation/](api-doc-generation/SKILL.md)         | `controller-change`     | ✅   | Generate API docs         |
| Index        | [doc-index-update/](doc-index-update/SKILL.md)             | `doc-change`            | ✅   | Update doc indexes        |
| Related Docs | [related-docs-sync/](related-docs-sync/SKILL.md)           | `doc-update`            | ✅   | Sync related_docs refs    |

### Template-Specific Skills

| Skill            | Folder                                                               | Trigger               | Auto | Purpose              |
| :--------------- | :------------------------------------------------------------------- | :-------------------- | :--- | :------------------- |
| UX Flow          | [ux-flow-creation/](ux-flow-creation/SKILL.md)                       | `ux-design`           | ❌   | Create UX flow docs  |
| Testing Strategy | [testing-strategy-creation/](testing-strategy-creation/SKILL.md)     | `testing-plan`        | ❌   | Create test plans    |
| Deploy Runbook   | [deployment-runbook-creation/](deployment-runbook-creation/SKILL.md) | `deployment-planning` | ❌   | Create runbooks      |
| Security Audit   | [security-audit-creation/](security-audit-creation/SKILL.md)         | `security-review`     | ❌   | Create audit reports |

### Meta Skills (Self-Updating)

| Skill       | Folder                               | Trigger         | Auto | Purpose                 |
| :---------- | :----------------------------------- | :-------------- | :--- | :---------------------- |
| Self-Update | [self-update/](self-update/SKILL.md) | `system-change` | ✅   | Update AGENTS.md system |

## Trigger Events

| Event                   | When                   | Skill(s)                        | Context Needed                       |
| :---------------------- | :--------------------- | :------------------------------ | :----------------------------------- |
| `pre-commit`            | Before `git commit`    | commit                          | `staged_files`, `diff_summary`       |
| `pr-creation`           | Opening PR             | pull-request                    | `commits`, `changed_files`, `issues` |
| `review-request`        | PR review              | code-review                     | `changed_files`, `diff`, `pr_desc`   |
| `schema-change`         | Edit `schema.prisma`   | migration → schema-doc-sync     | `schema_diff`, `existing_data`       |
| `controller-change`     | Edit `*.controller.ts` | api-doc-generation              | `controller_files`                   |
| `code-change`           | Edit `*.ts`            | testing                         | `changed_files`, `existing_tests`    |
| `doc-save`              | Save in `docs/**`      | frontmatter-validation          | `document_path`                      |
| `doc-creation`          | Create in `docs/**`    | documentation, doc-index-update | `doc_type`, `module`                 |
| `doc-update`            | Modify `related_docs`  | related-docs-sync               | `old_refs`, `new_refs`               |
| `architecture-decision` | Major decision         | adr-creation                    | `context`, `options`                 |
| `ux-design`             | UI design needed       | ux-flow-creation                | `feature_name`, `screens`            |
| `testing-plan`          | Test strategy needed   | testing-strategy-creation       | `feature_name`, `scope`              |
| `deployment-planning`   | Deploy prep            | deployment-runbook-creation     | `services`, `environment`            |
| `security-review`       | Security audit         | security-audit-creation         | `scope`, `threat_model`              |
| `system-change`         | Agent/Skill modified   | self-update                     | `changed_component`                  |

## Skill vs Subagent

| Aspect   | Skill                   | Subagent                     |
| :------- | :---------------------- | :--------------------------- |
| Purpose  | Single, focused task    | Complex domain work          |
| Trigger  | Automatic on event      | User intent or routing       |
| Output   | Structured artifact     | Variable (code, docs, etc.)  |
| Context  | Minimal, specific       | Full domain context          |
| Examples | Commit message, PR desc | Design system, implement API |

## Skill Configuration

Each skill has YAML frontmatter following the [Agent Skills spec](https://agentskills.io/specification):

```yaml
---
name: commit
description: "Generate Conventional Commit messages from staged changes. Use when committing code or generating commit messages."
---
# Instructions for Copilot...
```

### Required Fields

| Field         | Required | Description                                                    |
| :------------ | :------- | :------------------------------------------------------------- |
| `name`        | Yes      | Must match folder name (lowercase, hyphens)                    |
| `description` | Yes      | **Critical for auto-discovery**. Explain what & when to use it |

### Optional Fields

| Field      | Description                |
| :--------- | :------------------------- |
| `license`  | License for the skill      |
| `metadata` | Additional key-value pairs |
| `version`  | Skill version              |

## Event Types

| Event            | When Triggered         | Skill Folder   |
| :--------------- | :--------------------- | :------------- |
| `pre-commit`     | Before git commit      | commit/        |
| `pr-creation`    | Creating pull request  | pull-request/  |
| `review-request` | PR review requested    | code-review/   |
| `schema-change`  | schema.prisma modified | migration/     |
| `code-change`    | \*.ts file modified    | testing/       |
| `doc-creation`   | docs/\*\* file created | documentation/ |

## Creating a New Skill

1. Create a new folder `[skill-name]/` in this directory (lowercase, hyphens for spaces)
2. Create `SKILL.md` inside the folder with YAML frontmatter:
   - `name`: must match folder name (lowercase, hyphens)
   - `description`: **critical** - what the skill does AND when to use it
3. Write clear instructions in Markdown
4. Include examples if helpful
5. Optionally add supporting files (scripts, examples) in the same folder

**Note:** Skill files MUST be named `SKILL.md` (uppercase).

### Good Description Examples

```yaml
# Good - specific about when to use
description: "Generate Conventional Commit messages from staged changes. Use when committing code or when the user asks for a commit message."

# Good - includes keywords
description: "Validate Prisma schema changes for safety. Use when schema.prisma is modified or when running database migrations."
```

### Bad Description Examples

```yaml
# Bad - too vague
description: "Helps with commits."

# Bad - no "when to use"
description: "Generates commit messages."
```

## Invocation by Subagents

Subagents can explicitly invoke skills:

```markdown
@Backend: "I'm modifying schema.prisma, invoking migration skill"
@Scribe: "Creating new doc, invoking documentation skill"
```

## Related Documentation

- [Subagents System](../agents/README.md) - For complex domain work (use `runSubagent`)
- [Path Instructions](../instructions/README.md) - File-pattern rules
- [Agent Skills Spec](https://agentskills.io/specification) - Official format
- [GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) - Copilot skills

---

_Skills are auto-discovered by Copilot based on the `description` field. Write clear descriptions!_
