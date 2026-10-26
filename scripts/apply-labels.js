#!/usr/bin/env node
'use strict';

/**
 * @file Apply the IssueTracker label set.
 *
 * Keeps the public tracker's vocabulary aligned with Forgejo rather than
 * inventing a parallel taxonomy: `bug`, `enhancement`, `question` and
 * `connection` already exist there, and mirrors stay meaningful only if both
 * sides agree on names.
 *
 * GitHub's stock labels (duplicate, invalid, wontfix, good first issue…) are
 * left alone — they are still useful for triage on the intake side.
 *
 * Usage:
 *   GITHUB_TOKEN=... node scripts/apply-labels.js [--dry-run]
 */

const REPO = process.env.TRACKER_REPO || 'VETuner/IssueTracker';
const TOKEN = process.env.GITHUB_TOKEN || '';

/**
 * Labels to create or update. Colours are chosen to sort readably in the
 * sidebar: kind first, then area, then state.
 */
const LABELS = [
    // Kind — mirrors the Forgejo set
    { name: 'bug', color: 'd73a4a', description: 'Something is not working' },
    { name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
    { name: 'question', color: 'd876e3', description: 'Further information is requested' },

    // Area — where in the product
    { name: 'connection', color: 'f9a825', description: 'USB, WebUSB, Bluetooth or link problems' },
    { name: 'ecu-definition', color: '6f42c1', description: 'INI files, parsing, ECU signatures' },
    { name: 'tuning', color: '0e8a16', description: 'VE tables, analysis, burns' },
    { name: 'ui', color: '1d76db', description: 'Layout, gauges, dashboards' },
    { name: 'mobile', color: 'c2e0c6', description: 'Android or iOS specific' },

    // Triage state
    { name: 'needs-triage', color: 'ededed', description: 'Not yet reviewed' },
    { name: 'needs-info', color: 'fbca04', description: 'Waiting on the reporter' },
    { name: 'cannot-reproduce', color: 'bfd4f2', description: 'Reported but not reproducible' },
    { name: 'tracked-upstream', color: '0052cc', description: 'Logged in the development tracker' },
];

async function api(pathname, options = {}) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/labels${pathname}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
        },
    });
    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    return { status: res.status, body };
}

async function main() {
    const dryRun = process.argv.includes('--dry-run');
    if (!TOKEN) {
        console.error('Error: GITHUB_TOKEN is not set.');
        return 1;
    }

    const existing = await api('?per_page=100');
    if (existing.status !== 200) {
        console.error(`Could not list labels (${existing.status}):`, JSON.stringify(existing.body).slice(0, 200));
        return 1;
    }
    const byName = new Map((existing.body || []).map((l) => [l.name, l]));

    let created = 0, updated = 0, unchanged = 0, failed = 0;
    for (const label of LABELS) {
        const current = byName.get(label.name);
        if (dryRun) {
            console.log(`${current ? 'would update' : 'would create'}: ${label.name}`);
            continue;
        }
        if (current) {
            if (current.color.toLowerCase() === label.color.toLowerCase()
                && (current.description || '') === label.description) {
                unchanged++;
                continue;
            }
            const res = await api('/' + encodeURIComponent(label.name), {
                method: 'PATCH', body: JSON.stringify(label),
            });
            if (res.status >= 300) {
                console.error(`FAIL update ${label.name}: ${res.status}`);
                failed++;
            } else { updated++; console.log('updated', label.name); }
        } else {
            const res = await api('', { method: 'POST', body: JSON.stringify(label) });
            if (res.status >= 300) {
                console.error(`FAIL create ${label.name}: ${res.status} ${JSON.stringify(res.body).slice(0, 120)}`);
                failed++;
            } else { created++; console.log('created', label.name); }
        }
    }

    console.log(`\ncreated=${created} updated=${updated} unchanged=${unchanged} failed=${failed}${dryRun ? ' (DRY RUN)' : ''}`);
    return failed > 0 ? 1 : 0;
}

main()
    .then((code) => process.exit(code))
    .catch((error) => { console.error(error); process.exit(1); });
