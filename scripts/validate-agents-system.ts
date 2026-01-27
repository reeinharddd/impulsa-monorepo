#!/usr/bin/env bun
/**
 * AGENTS.md System Validator
 *
 * Validates the integrity, consistency, and effectiveness of:
 * - Subagents (.github/agents/*.agent.md)
 * - Skills (.github/skills/*.skill.md)
 * - Instructions (.github/instructions/*.instructions.md)
 * - Root orchestrator (AGENTS.md)
 *
 * Usage: bun run scripts/validate-agents-system.ts
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

// ============================================================================
// Types
// ============================================================================

interface ValidationResult {
  file: string;
  type: 'agent' | 'skill' | 'instruction' | 'orchestrator';
  errors: string[];
  warnings: string[];
  info: string[];
}

interface AgentFrontmatter {
  agent_id: string;
  name: string;
  description: string;
  version: string;
  last_updated: string;
  scope?: {
    owns?: string[];
    contributes?: string[];
    reads?: string[];
  };
  auto_invoke?: {
    keywords?: {
      primary?: string[];
      secondary?: string[];
    };
    file_patterns?: string[];
    events?: string[];
    conditions?: string[];
  };
  outputs?: {
    code?: string[];
    documents?: { type: string; template: string; path: string }[];
  };
}

interface SkillFrontmatter {
  skill_id: string;
  name: string;
  description: string;
  event?: string;
  auto_trigger?: boolean;
  version: string;
  last_updated: string;
  inputs?: string[];
  output?: string;
  output_format?: string;
  auto_invoke?: {
    events?: string[];
    conditions?: string[];
  };
  validation_rules?: string[];
  chain_after?: string[];
  chain_before?: string[];
  called_by?: string[];
  mcp_tools?: string[];
}

interface InstructionFrontmatter {
  // AGENTS.md standard format
  instruction_id?: string;
  name?: string;
  applies_to?: string | string[];
  version?: string;
  last_updated?: string;
  // VS Code format
  applyTo?: string;
  excludeAgent?: string;
}

// VS Code instructions have a different format, so we have separate required fields
const REQUIRED_INSTRUCTION_FIELDS_STANDARD = [
  'instruction_id',
  'name',
  'applies_to',
  'version',
  'last_updated',
];
const REQUIRED_INSTRUCTION_FIELDS_VSCODE = ['applyTo'];

// ============================================================================
// Constants
// ============================================================================

const ROOT_DIR = process.cwd();
const AGENTS_DIR = join(ROOT_DIR, '.github/agents');
const SKILLS_DIR = join(ROOT_DIR, '.github/skills');
const INSTRUCTIONS_DIR = join(ROOT_DIR, '.github/instructions');
const ORCHESTRATOR_PATH = join(ROOT_DIR, 'AGENTS.md');

const VALID_AGENTS = [
  '@Architect',
  '@Backend',
  '@Frontend',
  '@QA',
  '@Scribe',
  '@Security',
  '@DataArchitect',
  '@SyncEngineer',
  '@DevOps',
];

const VALID_COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
];

const REQUIRED_AGENT_FIELDS = [
  'agent_id',
  'name',
  'description',
  'version',
  'last_updated',
];
const REQUIRED_SKILL_FIELDS = [
  'skill_id',
  'name',
  'description',
  'version',
  'last_updated',
];
// Keep for compatibility but instructions will use format-specific validation

// ============================================================================
// Helpers
// ============================================================================

function extractFrontmatter(content: string): {
  frontmatter: unknown;
  body: string;
} | null {
  // Standard YAML frontmatter
  let match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    try {
      const frontmatter = parseYaml(match[1]);
      return { frontmatter, body: match[2] };
    } catch {
      return null;
    }
  }

  // VS Code instructions format (````instructions with YAML inside)
  match = content.match(
    /^````instructions\n---\n([\s\S]*?)\n---\n([\s\S]*?)````$/
  );
  if (match) {
    try {
      const frontmatter = parseYaml(match[1]);
      return { frontmatter, body: match[2] };
    } catch {
      return null;
    }
  }

  return null;
}

function checkRequiredFields(
  obj: Record<string, unknown>,
  fields: string[],
  result: ValidationResult
): void {
  for (const field of fields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      result.errors.push(`Missing required field: ${field}`);
    }
  }
}

function checkDateFormat(date: string, result: ValidationResult): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    result.errors.push(`Invalid date format: ${date} (expected YYYY-MM-DD)`);
  }
}

function checkVersionFormat(version: string, result: ValidationResult): void {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(version)) {
    result.warnings.push(
      `Non-standard version format: ${version} (expected X.Y.Z)`
    );
  }
}

// ============================================================================
// Validators
// ============================================================================

async function validateAgent(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: filePath.replace(ROOT_DIR + '/', ''),
    type: 'agent',
    errors: [],
    warnings: [],
    info: [],
  };

  const content = await readFile(filePath, 'utf-8');
  const parsed = extractFrontmatter(content);

  if (!parsed) {
    result.errors.push('Invalid or missing YAML frontmatter');
    return result;
  }

  const fm = parsed.frontmatter as AgentFrontmatter;

  // Check required fields
  checkRequiredFields(
    fm as unknown as Record<string, unknown>,
    REQUIRED_AGENT_FIELDS,
    result
  );

  // Check date format
  if (fm.last_updated) {
    checkDateFormat(fm.last_updated, result);
  }

  // Check version format
  if (fm.version) {
    checkVersionFormat(fm.version, result);
  }

  // Check name starts with @
  if (fm.name && !fm.name.startsWith('@')) {
    result.errors.push(`Agent name must start with @: ${fm.name}`);
  }

  // Check scope
  if (!fm.scope) {
    result.warnings.push('Missing scope definition');
  } else {
    if (!fm.scope.owns || fm.scope.owns.length === 0) {
      result.warnings.push('Agent has no owned paths defined');
    }
  }

  // Check auto_invoke
  if (!fm.auto_invoke) {
    result.warnings.push('Missing auto_invoke rules');
  } else {
    if (
      !fm.auto_invoke.keywords?.primary ||
      fm.auto_invoke.keywords.primary.length === 0
    ) {
      result.warnings.push('No primary keywords defined for auto-invocation');
    }
    if (
      !fm.auto_invoke.file_patterns ||
      fm.auto_invoke.file_patterns.length === 0
    ) {
      result.warnings.push('No file patterns defined for auto-invocation');
    }
  }

  // Check outputs
  if (!fm.outputs) {
    result.info.push('No outputs defined');
  }

  // Check body content
  if (parsed.body.trim().length < 100) {
    result.warnings.push('Agent documentation body seems too short');
  }

  // Check for required sections in body (accept inline > **Purpose:** format too)
  const hasPurpose =
    parsed.body.includes('## Purpose') ||
    parsed.body.includes('> **Purpose:**');
  const hasConstraints = parsed.body.includes('## Constraints');
  const hasWorkflow = parsed.body.includes('## Workflow');

  if (!hasPurpose) {
    result.warnings.push(
      'Missing recommended section: ## Purpose (or > **Purpose:**)'
    );
  }
  if (!hasConstraints) {
    result.warnings.push('Missing recommended section: ## Constraints');
  }
  if (!hasWorkflow) {
    result.warnings.push('Missing recommended section: ## Workflow');
  }

  result.info.push(`Agent ID: ${fm.agent_id}`);
  result.info.push(`Version: ${fm.version}`);

  return result;
}

async function validateSkill(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: filePath.replace(ROOT_DIR + '/', ''),
    type: 'skill',
    errors: [],
    warnings: [],
    info: [],
  };

  const content = await readFile(filePath, 'utf-8');
  const parsed = extractFrontmatter(content);

  if (!parsed) {
    result.errors.push('Invalid or missing YAML frontmatter');
    return result;
  }

  const fm = parsed.frontmatter as SkillFrontmatter;

  // Check required fields
  checkRequiredFields(
    fm as unknown as Record<string, unknown>,
    REQUIRED_SKILL_FIELDS,
    result
  );

  // Check date format
  if (fm.last_updated) {
    checkDateFormat(fm.last_updated, result);
  }

  // Check version format
  if (fm.version) {
    checkVersionFormat(fm.version, result);
  }

  // Check called_by references valid agents
  if (fm.called_by) {
    for (const agent of fm.called_by) {
      if (!VALID_AGENTS.includes(agent)) {
        result.errors.push(`Invalid agent reference in called_by: ${agent}`);
      }
    }
  } else {
    result.warnings.push('No called_by agents defined');
  }

  // Check chain references
  if (fm.chain_before) {
    result.info.push(`Chains before: ${fm.chain_before.join(', ')}`);
  }
  if (fm.chain_after) {
    result.info.push(`Chains after: ${fm.chain_after.join(', ')}`);
  }

  // Check auto_invoke
  if (fm.auto_trigger && !fm.auto_invoke) {
    result.warnings.push('auto_trigger is true but no auto_invoke rules');
  }

  // Check MCP tools
  if (fm.mcp_tools && fm.mcp_tools.length > 0) {
    result.info.push(`MCP tools: ${fm.mcp_tools.join(', ')}`);
  }

  // Check body content
  if (parsed.body.trim().length < 50) {
    result.warnings.push('Skill documentation body seems too short');
  }

  result.info.push(`Skill ID: ${fm.skill_id}`);
  result.info.push(`Version: ${fm.version}`);

  return result;
}

async function validateInstruction(
  filePath: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: filePath.replace(ROOT_DIR + '/', ''),
    type: 'instruction',
    errors: [],
    warnings: [],
    info: [],
  };

  const content = await readFile(filePath, 'utf-8');
  const parsed = extractFrontmatter(content);

  if (!parsed) {
    result.errors.push('Invalid or missing YAML frontmatter');
    return result;
  }

  const fm = parsed.frontmatter as InstructionFrontmatter;

  // Detect format: VS Code (applyTo) vs AGENTS.md standard (instruction_id)
  const isVSCodeFormat = 'applyTo' in fm;

  if (isVSCodeFormat) {
    // VS Code format validation
    checkRequiredFields(
      fm as unknown as Record<string, unknown>,
      REQUIRED_INSTRUCTION_FIELDS_VSCODE,
      result
    );

    if (fm.applyTo) {
      result.info.push(`Applies to: ${fm.applyTo}`);
    }
    if (fm.excludeAgent) {
      result.info.push(`Excludes agent: ${fm.excludeAgent}`);
    }
    result.info.push(`Format: VS Code instructions`);
  } else {
    // AGENTS.md standard format validation
    checkRequiredFields(
      fm as unknown as Record<string, unknown>,
      REQUIRED_INSTRUCTION_FIELDS_STANDARD,
      result
    );

    // Check date format
    if (fm.last_updated) {
      checkDateFormat(fm.last_updated, result);
    }

    // Check version format
    if (fm.version) {
      checkVersionFormat(fm.version, result);
    }

    // Check applies_to
    if (fm.applies_to) {
      const patterns = Array.isArray(fm.applies_to)
        ? fm.applies_to
        : [fm.applies_to];
      result.info.push(`Applies to: ${patterns.join(', ')}`);
    }

    result.info.push(`Instruction ID: ${fm.instruction_id}`);
    result.info.push(`Version: ${fm.version}`);
  }

  // Check body content
  if (parsed.body.trim().length < 100) {
    result.warnings.push('Instruction documentation seems too short');
  }

  return result;
}

async function validateOrchestrator(): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: 'AGENTS.md',
    type: 'orchestrator',
    errors: [],
    warnings: [],
    info: [],
  };

  const content = await readFile(ORCHESTRATOR_PATH, 'utf-8');

  // Check for required sections
  const requiredSections = [
    'Agent Routing',
    'File Pattern Triggers',
    'Skill Auto-Triggers',
    'Commands',
  ];
  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`)) {
      result.errors.push(`Missing required section: ## ${section}`);
    }
  }

  // Check all agents are referenced
  for (const agent of VALID_AGENTS) {
    if (!content.includes(agent)) {
      result.warnings.push(`Agent ${agent} not referenced in orchestrator`);
    }
  }

  // Check version
  const versionMatch = content.match(/Version:\*\* (\d+\.\d+\.\d+)/);
  if (versionMatch) {
    result.info.push(`Orchestrator version: ${versionMatch[1]}`);
  }

  return result;
}

// ============================================================================
// Cross-Validation
// ============================================================================

interface CrossValidationResult {
  errors: string[];
  warnings: string[];
  info: string[];
}

async function crossValidate(
  agents: ValidationResult[],
  skills: ValidationResult[]
): Promise<CrossValidationResult> {
  const result: CrossValidationResult = {
    errors: [],
    warnings: [],
    info: [],
  };

  // Build skill ID list
  const skillIds: Set<string> = new Set();
  for (const skill of skills) {
    const content = await readFile(join(ROOT_DIR, skill.file), 'utf-8');
    const parsed = extractFrontmatter(content);
    if (parsed) {
      const fm = parsed.frontmatter as SkillFrontmatter;
      if (fm.skill_id) {
        skillIds.add(fm.skill_id);
      }
    }
  }

  // Check skill chaining references
  for (const skill of skills) {
    const content = await readFile(join(ROOT_DIR, skill.file), 'utf-8');
    const parsed = extractFrontmatter(content);
    if (parsed) {
      const fm = parsed.frontmatter as SkillFrontmatter;

      if (fm.chain_before) {
        for (const chainedSkill of fm.chain_before) {
          if (!skillIds.has(chainedSkill)) {
            result.errors.push(
              `Skill ${fm.skill_id} chains to non-existent skill: ${chainedSkill}`
            );
          }
        }
      }

      if (fm.chain_after) {
        for (const chainedSkill of fm.chain_after) {
          if (!skillIds.has(chainedSkill)) {
            result.errors.push(
              `Skill ${fm.skill_id} chains from non-existent skill: ${chainedSkill}`
            );
          }
        }
      }
    }
  }

  // Check for unused agents (agents not called by any skill)
  const usedAgents = new Set<string>();
  for (const skill of skills) {
    const content = await readFile(join(ROOT_DIR, skill.file), 'utf-8');
    const parsed = extractFrontmatter(content);
    if (parsed) {
      const fm = parsed.frontmatter as SkillFrontmatter;
      if (fm.called_by) {
        fm.called_by.forEach((a) => usedAgents.add(a));
      }
    }
  }

  for (const agent of VALID_AGENTS) {
    if (!usedAgents.has(agent)) {
      result.warnings.push(`Agent ${agent} is not called by any skill`);
    }
  }

  result.info.push(`Total agents: ${agents.length}`);
  result.info.push(`Total skills: ${skills.length}`);
  result.info.push(`Skills with chaining: ${skillIds.size}`);

  return result;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('\n🔍 AGENTS.md System Validator\n');
  console.log('='.repeat(60));

  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  // Validate Agents
  console.log('\n📦 Validating Agents...\n');
  try {
    const agentFiles = (await readdir(AGENTS_DIR)).filter(
      (f) => f.endsWith('.agent.md') && f !== 'README.md'
    );
    for (const file of agentFiles) {
      const result = await validateAgent(join(AGENTS_DIR, file));
      results.push(result);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;

      const status =
        result.errors.length > 0
          ? '❌'
          : result.warnings.length > 0
            ? '⚠️'
            : '✅';
      console.log(`  ${status} ${file}`);
      result.errors.forEach((e) => console.log(`     ❌ ${e}`));
      result.warnings.forEach((w) => console.log(`     ⚠️  ${w}`));
    }
  } catch {
    console.log('  ❌ Failed to read agents directory');
  }

  // Validate Skills
  console.log('\n⚡ Validating Skills...\n');
  try {
    const skillFiles = (await readdir(SKILLS_DIR)).filter(
      (f) => f.endsWith('.skill.md') && f !== 'README.md'
    );
    for (const file of skillFiles) {
      const result = await validateSkill(join(SKILLS_DIR, file));
      results.push(result);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;

      const status =
        result.errors.length > 0
          ? '❌'
          : result.warnings.length > 0
            ? '⚠️'
            : '✅';
      console.log(`  ${status} ${file}`);
      result.errors.forEach((e) => console.log(`     ❌ ${e}`));
      result.warnings.forEach((w) => console.log(`     ⚠️  ${w}`));
    }
  } catch {
    console.log('  ❌ Failed to read skills directory');
  }

  // Validate Instructions
  console.log('\n📋 Validating Instructions...\n');
  try {
    const instructionFiles = (await readdir(INSTRUCTIONS_DIR)).filter(
      (f) => f.endsWith('.instructions.md') && f !== 'README.md'
    );
    for (const file of instructionFiles) {
      const result = await validateInstruction(join(INSTRUCTIONS_DIR, file));
      results.push(result);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;

      const status =
        result.errors.length > 0
          ? '❌'
          : result.warnings.length > 0
            ? '⚠️'
            : '✅';
      console.log(`  ${status} ${file}`);
      result.errors.forEach((e) => console.log(`     ❌ ${e}`));
      result.warnings.forEach((w) => console.log(`     ⚠️  ${w}`));
    }
  } catch {
    console.log('  ❌ Failed to read instructions directory');
  }

  // Validate Orchestrator
  console.log('\n🎯 Validating Orchestrator...\n');
  const orchestratorResult = await validateOrchestrator();
  results.push(orchestratorResult);
  totalErrors += orchestratorResult.errors.length;
  totalWarnings += orchestratorResult.warnings.length;

  const status =
    orchestratorResult.errors.length > 0
      ? '❌'
      : orchestratorResult.warnings.length > 0
        ? '⚠️'
        : '✅';
  console.log(`  ${status} AGENTS.md`);
  orchestratorResult.errors.forEach((e) => console.log(`     ❌ ${e}`));
  orchestratorResult.warnings.forEach((w) => console.log(`     ⚠️  ${w}`));

  // Cross-Validation
  console.log('\n🔗 Cross-Validation...\n');
  const agents = results.filter((r) => r.type === 'agent');
  const skills = results.filter((r) => r.type === 'skill');
  const crossResult = await crossValidate(agents, skills);
  totalErrors += crossResult.errors.length;
  totalWarnings += crossResult.warnings.length;

  crossResult.errors.forEach((e) => console.log(`  ❌ ${e}`));
  crossResult.warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
  crossResult.info.forEach((i) => console.log(`  ℹ️  ${i}`));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary\n');

  const agentCount = results.filter((r) => r.type === 'agent').length;
  const skillCount = results.filter((r) => r.type === 'skill').length;
  const instructionCount = results.filter(
    (r) => r.type === 'instruction'
  ).length;

  console.log(`  Components validated:`);
  console.log(`    • Agents:       ${agentCount}`);
  console.log(`    • Skills:       ${skillCount}`);
  console.log(`    • Instructions: ${instructionCount}`);
  console.log(`    • Orchestrator: 1`);
  console.log();
  console.log(`  Results:`);
  console.log(`    • Errors:   ${totalErrors}`);
  console.log(`    • Warnings: ${totalWarnings}`);
  console.log();

  if (totalErrors > 0) {
    console.log('  ❌ Validation FAILED - Fix errors before proceeding\n');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(
      '  ⚠️  Validation PASSED with warnings - Review recommended\n'
    );
    process.exit(0);
  } else {
    console.log('  ✅ Validation PASSED - All checks passed\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
