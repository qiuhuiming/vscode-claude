#!/usr/bin/env node

/**
 * Test script to debug session data reading
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get workspace path (simulating current project)
const workspacePath = process.cwd();
console.log('📂 Workspace path:', workspacePath);

// Convert to Claude's directory format (replace / and . with -)
const claudeProjectName = workspacePath.replace(/[\/\.]/g, '-');
console.log('📁 Claude project name:', claudeProjectName);

const claudeDir = path.join(os.homedir(), '.claude', 'projects', claudeProjectName);
console.log('📂 Claude sessions directory:', claudeDir);

// Check if directory exists
if (!fs.existsSync(claudeDir)) {
    console.log('❌ Directory does not exist!');
    console.log('\n🔍 Let\'s check what projects exist:');
    const projectsDir = path.join(os.homedir(), '.claude', 'projects');
    if (fs.existsSync(projectsDir)) {
        const projects = fs.readdirSync(projectsDir);
        console.log('Available projects:');
        projects.forEach(p => console.log(`  - ${p}`));
    }
    process.exit(1);
}

console.log('✅ Directory exists!');

// Read files
const files = fs.readdirSync(claudeDir);
console.log(`\n📋 Total files: ${files.length}`);

// UUID pattern
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jsonl$/i;

// Filter session files
const sessionFiles = files.filter(f => uuidPattern.test(f));
console.log(`📋 Session files (UUID pattern): ${sessionFiles.length}`);

// Parse each session
console.log('\n📖 Sessions:');
sessionFiles.forEach((filename, index) => {
    const filePath = path.join(claudeDir, filename);
    const stats = fs.statSync(filePath);
    const id = filename.replace('.jsonl', '');

    // Read first few lines to find summary
    let summary = null;
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                const json = JSON.parse(line);
                if (json.type === 'summary' && json.summary) {
                    summary = json.summary;
                    break;
                }
            } catch (e) {
                continue;
            }
        }
    } catch (err) {
        console.error(`  Error reading ${filename}:`, err.message);
    }

    console.log(`  ${index + 1}. ${id.substring(0, 8)}...`);
    console.log(`     Summary: ${summary || '(no summary found)'}`);
    console.log(`     Modified: ${stats.mtime.toLocaleString()}`);
    console.log(`     Size: ${(stats.size / 1024).toFixed(2)} KB`);
});

console.log('\n✅ Test complete!');
