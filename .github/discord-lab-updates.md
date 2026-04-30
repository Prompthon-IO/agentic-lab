# Discord Lab Updates Automation

This repository enqueues Discord announcement jobs after pushes to `main`.
The local worker in `/Users/liqingpan/Projects/agent_skills/agent_skills`
drains those jobs from Postgres and posts them to the lab-updates Discord
channel.

## Required GitHub Secret

Create this repository secret in GitHub Actions:

```txt
PATHWAY_DISCORD_ANNOUNCER_DATABASE_URL
```

Use the same remote Postgres URL stored locally as
`PATHWAY_DISCORD_ANNOUNCER_DATABASE_URL` in:

```txt
~/.codex/state/pathway-discord-announcer/.env
```

Do not commit the value.

## Optional GitHub Variable

The workflow defaults to channel `1347671631295811595`. To change it without a
code change, add a repository variable:

```txt
DISCORD_LAB_UPDATES_CHANNEL_ID
```

## Local Workflow Test

From this repository root:

```bash
node .github/scripts/enqueue-discord-announcement.mjs --dry-run
```

The dry run prints only job metadata and changed paths. It does not connect to
Postgres and does not post to Discord.

## Runtime Flow

1. A push lands on `main`.
2. `.github/workflows/discord-lab-updates.yml` checks out the repo and runs the
   enqueue script.
3. The script filters for lab content paths such as `skills/`, `foundations/`,
   `patterns/`, `systems/`, `ecosystem/`, `case-studies/`, `radar/`, and
   `zh-Hans/`.
4. If relevant paths changed, it inserts one deduped row into
   `discord_announcement_jobs`.
5. The local announcer worker claims the pending row, formats the update, posts
   it to Discord, and marks the row `sent`.
