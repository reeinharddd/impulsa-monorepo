# Skills System

> **Version:** 2.0.0 | **Standard:** AGENTS.md v1

This directory contains atomic, reusable skills that automate repetitive tasks.

## Purpose

Skills are **automated micro-tasks** triggered by events. They:

- Execute a single, focused task
- Are triggered automatically by events
- Require minimal context
- Return structured output

## How Skills Work

```
Event Trigger → Skill Invoked → Process Inputs → Return Output
     ↓              ↓                ↓               ↓
 pre-commit    commit.skill      staged_files   commit_message
```

## Available Skills (17 Total)

### Core Skills (Workflow)

| Skill     | File                                             | Trigger          | Auto | Purpose                       |
| :-------- | :----------------------------------------------- | :--------------- | :--- | :---------------------------- |
| Commit    | [commit.skill.md](commit.skill.md)               | `pre-commit`     | ✅   | Generate Conventional Commits |
| PR        | [pull-request.skill.md](pull-request.skill.md)   | `pr-creation`    | ✅   | Generate PR descriptions      |
| Review    | [code-review.skill.md](code-review.skill.md)     | `review-request` | ❌   | Automated code review         |
| Migration | [migration.skill.md](migration.skill.md)         | `schema-change`  | ✅   | Validate DB migrations        |
| Testing   | [testing.skill.md](testing.skill.md)             | `code-change`    | ❌   | Suggest tests needed          |
| Docs      | [documentation.skill.md](documentation.skill.md) | `doc-creation`   | ❌   | Apply doc template            |

### Documentation Skills (Auto-Sync)

| Skill        | File                                                               | Trigger                 | Auto | Purpose                   |
| :----------- | :----------------------------------------------------------------- | :---------------------- | :--- | :------------------------ |
| Frontmatter  | [frontmatter-validation.skill.md](frontmatter-validation.skill.md) | `doc-save`              | ✅   | Validate YAML frontmatter |
| ADR          | [adr-creation.skill.md](adr-creation.skill.md)                     | `architecture-decision` | ❌   | Create ADR documents      |
| Schema Sync  | [schema-doc-sync.skill.md](schema-doc-sync.skill.md)               | `schema-change`         | ✅   | Sync schema docs          |
| API Docs     | [api-doc-generation.skill.md](api-doc-generation.skill.md)         | `controller-change`     | ✅   | Generate API docs         |
| Index        | [doc-index-update.skill.md](doc-index-update.skill.md)             | `doc-change`            | ✅   | Update doc indexes        |
| Related Docs | [related-docs-sync.skill.md](related-docs-sync.skill.md)           | `doc-update`            | ✅   | Sync related_docs refs    |

### Template-Specific Skills

| Skill            | File                                                                         | Trigger               | Auto | Purpose              |
| :--------------- | :--------------------------------------------------------------------------- | :-------------------- | :--- | :------------------- |
| UX Flow          | [ux-flow-creation.skill.md](ux-flow-creation.skill.md)                       | `ux-design`           | ❌   | Create UX flow docs  |
| Testing Strategy | [testing-strategy-creation.skill.md](testing-strategy-creation.skill.md)     | `testing-plan`        | ❌   | Create test plans    |
| Deploy Runbook   | [deployment-runbook-creation.skill.md](deployment-runbook-creation.skill.md) | `deployment-planning` | ❌   | Create runbooks      |
| Security Audit   | [security-audit-creation.skill.md](security-audit-creation.skill.md)         | `security-review`     | ❌   | Create audit reports |

### Meta Skills (Self-Updating)

| Skill       | File                                         | Trigger         | Auto | Purpose                 |
| :---------- | :------------------------------------------- | :-------------- | :--- | :---------------------- |
| Self-Update | [self-update.skill.md](self-update.skill.md) | `system-change` | ✅   | Update AGENTS.md system |

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

Each skill has YAML frontmatter:

```yaml
---
skill_id: "commit-message"
description: "Generate Conventional Commit messages"
version: "1.0.0"
auto_invoke:
  event: "pre-commit"
  condition: "staged_files.length > 0"
inputs:
  - staged_files
  - diff_summary
output: "commit_message"
---
```

## Event Types

| Event            | When Triggered         | Skills                 |
| :--------------- | :--------------------- | :--------------------- |
| `pre-commit`     | Before git commit      | commit.skill.md        |
| `pr-creation`    | Creating pull request  | pull-request.skill.md  |
| `review-request` | PR review requested    | code-review.skill.md   |
| `schema-change`  | schema.prisma modified | migration.skill.md     |
| `code-change`    | \*.ts file modified    | testing.skill.md       |
| `doc-creation`   | docs/\*\* file created | documentation.skill.md |

## Creating a New Skill

1. Create `[name].skill.md` in this directory
2. Include YAML frontmatter with:
   - `skill_id`: unique identifier
   - `auto_invoke.event`: trigger event
   - `auto_invoke.condition`: when to run
   - `inputs`: required context
   - `output`: what skill produces
3. Define the skill logic and rules
4. Include examples

## Invocation by Subagents

Subagents can explicitly invoke skills:

```markdown
@Backend: "I'm modifying schema.prisma, invoking migration.skill.md"
@Scribe: "Creating new doc, invoking documentation.skill.md"
```

## Related Documentation

- [Subagents System](../agents/README.md)
- [Path Instructions](../instructions/README.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Documentation Workflow](/docs/process/standards/DOCUMENTATION-WORKFLOW.md)

---

_Skills are atomic and stateless. They process inputs and return outputs._
