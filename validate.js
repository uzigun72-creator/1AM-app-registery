#!/usr/bin/env node
/**
 * Registry Validation Script
 * Runs on every PR to ensure registry.json is valid and follows spec.
 * Exit code 0 = pass, 1 = fail.
 */

const fs = require('fs');
const path = require('path');

const VALID_CATEGORIES = ['defi', 'tools', 'gaming', 'social', 'nft', 'other'];
const VALID_NETWORKS = ['preview', 'preprod', 'mainnet', '*'];
const MAX_ID_LENGTH = 32;
const MAX_NAME_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 120;
const MAX_ICON_FILE_SIZE = 50 * 1024; // 50KB
const MAX_APPS = 500;

let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

// Load registry
const registryPath = path.join(__dirname, 'registry.json');
let registry;
try {
  const raw = fs.readFileSync(registryPath, 'utf-8');
  registry = JSON.parse(raw);
  pass('Valid JSON');
} catch (e) {
  fail(`Invalid JSON: ${e.message}`);
  process.exit(1);
}

// Check top-level structure
if (typeof registry.version !== 'number') fail('Missing or invalid "version" (must be number)');
else pass(`Version: ${registry.version}`);

if (!Array.isArray(registry.apps)) { fail('"apps" must be an array'); process.exit(1); }
if (registry.apps.length > MAX_APPS) fail(`Too many apps: ${registry.apps.length} (max ${MAX_APPS})`);
else pass(`${registry.apps.length} app(s)`);

// Check each app
const ids = new Set();
for (const app of registry.apps) {
  console.log(`\n  Checking: ${app.name || app.id || '(unnamed)'}`);

  // id
  if (!app.id || typeof app.id !== 'string') { fail('Missing "id"'); continue; }
  if (app.id.length > MAX_ID_LENGTH) fail(`id "${app.id}" too long (${app.id.length}/${MAX_ID_LENGTH})`);
  if (!/^[a-z0-9-]+$/.test(app.id)) fail(`id "${app.id}" must be lowercase alphanumeric + hyphens`);
  if (ids.has(app.id)) fail(`Duplicate id: "${app.id}"`);
  ids.add(app.id);

  // name
  if (!app.name || typeof app.name !== 'string') fail('Missing "name"');
  else if (app.name.length > MAX_NAME_LENGTH) fail(`name "${app.name}" too long (${app.name.length}/${MAX_NAME_LENGTH})`);
  else pass(`name: ${app.name}`);

  // description
  if (!app.description || typeof app.description !== 'string') fail('Missing "description"');
  else if (app.description.length > MAX_DESCRIPTION_LENGTH) fail(`description too long (${app.description.length}/${MAX_DESCRIPTION_LENGTH})`);
  else pass(`description: ${app.description.slice(0, 50)}...`);

  // icon
  if (!app.icon || typeof app.icon !== 'string') fail('Missing "icon"');
  else if (!app.icon.startsWith('https://')) fail(`icon must be HTTPS: ${app.icon}`);
  else pass(`icon: ${app.icon.slice(0, 60)}...`);

  // url
  if (!app.url || typeof app.url !== 'string') fail('Missing "url"');
  else if (!app.url.startsWith('https://')) fail(`url must be HTTPS: ${app.url}`);
  else pass(`url: ${app.url}`);

  // category
  if (!VALID_CATEGORIES.includes(app.category)) fail(`Invalid category "${app.category}" — must be one of: ${VALID_CATEGORIES.join(', ')}`);
  else pass(`category: ${app.category}`);

  // networks
  if (!Array.isArray(app.networks) || app.networks.length === 0) fail('Missing or empty "networks"');
  else {
    for (const n of app.networks) {
      if (!VALID_NETWORKS.includes(n)) fail(`Invalid network "${n}" — must be one of: ${VALID_NETWORKS.join(', ')}`);
    }
    pass(`networks: ${app.networks.join(', ')}`);
  }
}

// Check local icon files
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
  console.log('\n  Checking icon files:');
  for (const file of fs.readdirSync(iconsDir)) {
    const filePath = path.join(iconsDir, file);
    const stat = fs.statSync(filePath);
    if (stat.size > MAX_ICON_FILE_SIZE) {
      fail(`Icon "${file}" is ${(stat.size / 1024).toFixed(1)}KB (max ${MAX_ICON_FILE_SIZE / 1024}KB)`);
    } else {
      pass(`${file}: ${(stat.size / 1024).toFixed(1)}KB`);
    }
  }
}

// Summary
console.log(`\n${errors === 0 ? '✓ All checks passed!' : `✗ ${errors} error(s) found`}\n`);
process.exit(errors > 0 ? 1 : 0);
