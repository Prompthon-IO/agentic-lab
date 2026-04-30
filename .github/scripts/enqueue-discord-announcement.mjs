#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";

const DEFAULT_CHANNEL_ID = "1347671631295811595";
const require = createRequire(import.meta.url);
const ELIGIBLE_PREFIXES = [
  "case-studies/",
  "contributor-kit/",
  "ecosystem/",
  "foundations/",
  "patterns/",
  "publications/",
  "radar/",
  "reading-paths/",
  "skills/",
  "systems/",
  "zh-Hans/",
];
const ELIGIBLE_FILES = new Set([
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "README.md",
  "SECURITY.md",
  "SUPPORT.md",
]);

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

function runGit(args, fallback = "") {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return fallback;
  }
}

function readEventPayload() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(eventPath, "utf8"));
}

function isZeroSha(value) {
  return typeof value === "string" && /^0+$/.test(value);
}

function changedPathsFromGit({ before, sha }) {
  const diffArgs =
    before && sha && !isZeroSha(before)
      ? ["diff", "--name-only", before, sha]
      : ["diff-tree", "--no-commit-id", "--name-only", "-r", sha || "HEAD"];
  const output = runGit(diffArgs);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function isEligiblePath(filePath) {
  return ELIGIBLE_FILES.has(filePath) ||
    ELIGIBLE_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function firstLine(value) {
  return String(value || "").split(/\r?\n/)[0]?.trim() || "";
}

function firstParagraph(value) {
  const normalized = String(value || "")
    .split(/\r?\n\r?\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .find(Boolean);
  return normalized || "";
}

function truncate(value, maxLength) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}

function summarizeAreas(paths) {
  const areas = unique(
    paths.map((filePath) => {
      if (ELIGIBLE_FILES.has(filePath)) {
        return filePath;
      }
      return filePath.split("/")[0];
    }),
  ).slice(0, 4);

  if (!areas.length) {
    return "lab content";
  }
  if (areas.length === 1) {
    return areas[0];
  }
  return `${areas.slice(0, -1).join(", ")} and ${areas.at(-1)}`;
}

async function fetchAssociatedPullRequest({ repoFullName, sha, token }) {
  if (!repoFullName || !sha || !token || !globalThis.fetch) {
    return null;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/commits/${sha}/pulls`,
    {
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "user-agent": "pathway-discord-announcer",
        "x-github-api-version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const pulls = await response.json();
  return Array.isArray(pulls) && pulls.length ? pulls[0] : null;
}

function buildAnnouncementJob({ event, pullRequest }) {
  const repoFullName =
    process.env.GITHUB_REPOSITORY ||
    event.repository?.full_name ||
    runGit(["config", "--get", "remote.origin.url"], "Prompthon-IO/agentic-lab")
      .replace(/^https:\/\/github.com\//, "")
      .replace(/\.git$/, "");
  const sha = process.env.GITHUB_SHA || event.after || runGit(["rev-parse", "HEAD"]);
  const branch =
    process.env.GITHUB_REF_NAME ||
    event.ref?.replace("refs/heads/", "") ||
    runGit(["branch", "--show-current"], "main");
  const before = event.before || runGit(["rev-parse", `${sha}^`], "");
  const changedPaths = changedPathsFromGit({ before, sha });
  const eligiblePaths = unique(changedPaths.filter(isEligiblePath));
  const headCommit = event.head_commit || {};
  const commitMessage = headCommit.message || runGit(["log", "-1", "--pretty=%B"]);
  const commitTitle = firstLine(commitMessage) || "Repository update";
  const prTitle = pullRequest?.title || "";
  const summarySource = firstParagraph(pullRequest?.body) || firstParagraph(commitMessage);
  const areaSummary = summarizeAreas(eligiblePaths);
  const changeSummary = truncate(
    [
      `Updated ${areaSummary}.`,
      summarySource || `Latest merged change: ${commitTitle}`,
    ].join(" "),
    700,
  );
  const repoUrl =
    event.repository?.html_url ||
    `https://github.com/${repoFullName}`;
  const prNumber = pullRequest?.number ?? null;
  const commitUrl = headCommit.url || `${repoUrl}/commit/${sha}`;
  const sourceUrl = pullRequest?.html_url || commitUrl;

  return {
    authorLogin:
      headCommit.author?.username ||
      pullRequest?.user?.login ||
      process.env.GITHUB_ACTOR ||
      null,
    branch,
    changeSummary,
    changedPaths: eligiblePaths,
    channelKey: "lab-updates",
    commitSha: sha,
    dedupeKey: `${repoFullName}:${branch}:${sha}:lab-updates`,
    discordChannelId:
      process.env.DISCORD_LAB_UPDATES_CHANNEL_ID || DEFAULT_CHANNEL_ID,
    eligiblePathCount: eligiblePaths.length,
    eventType: "github_push_main",
    maxAttempts: Number.parseInt(process.env.ANNOUNCER_MAX_ATTEMPTS || "5", 10),
    mergedByLogin:
      pullRequest?.merged_by?.login ||
      headCommit.committer?.username ||
      process.env.GITHUB_ACTOR ||
      null,
    payloadJson: {
      allChangedPaths: changedPaths,
      eventName: process.env.GITHUB_EVENT_NAME || "push",
      githubRunId: process.env.GITHUB_RUN_ID || null,
      headCommitUrl: commitUrl,
      sourceUrl,
      workflow: process.env.GITHUB_WORKFLOW || null,
    },
    prNumber,
    prTitle: prTitle || commitTitle,
    prUrl: pullRequest?.html_url || null,
    repoFullName,
    repoUrl,
  };
}

function publicJobSummary(job) {
  return {
    branch: job.branch,
    changedPaths: job.changedPaths,
    channelKey: job.channelKey,
    commitSha: job.commitSha,
    dedupeKey: job.dedupeKey,
    discordChannelId: job.discordChannelId,
    eligiblePathCount: job.eligiblePathCount,
    eventType: job.eventType,
    prNumber: job.prNumber,
    prTitle: job.prTitle,
    repoFullName: job.repoFullName,
    sourceUrl: job.payloadJson?.sourceUrl ?? null,
  };
}

function wantsSsl(databaseUrl) {
  return /(?:[?&]ssl=true|[?&]sslmode=(?:require|prefer|verify-ca|verify-full))/i.test(
    databaseUrl,
  );
}

async function enqueueJob(job) {
  const databaseUrl = process.env.PATHWAY_DISCORD_ANNOUNCER_DATABASE_URL;
  if (!databaseUrl) {
    console.log(
      "Skipping Discord announcement enqueue: missing PATHWAY_DISCORD_ANNOUNCER_DATABASE_URL secret.",
    );
    return { skipped: true, reason: "missing_database_secret" };
  }

  const { Client } = require("pg");
  const client = new Client({
    connectionString: databaseUrl,
    ssl: wantsSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();
  try {
    const result = await client.query(
      `
        INSERT INTO discord_announcement_jobs (
          dedupe_key,
          event_type,
          repo_full_name,
          repo_url,
          branch,
          commit_sha,
          pr_number,
          pr_title,
          pr_url,
          merged_by_login,
          author_login,
          change_summary,
          changed_paths,
          eligible_path_count,
          channel_key,
          discord_channel_id,
          max_attempts,
          payload_json
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18::jsonb
        )
        ON CONFLICT (dedupe_key) DO NOTHING
        RETURNING id, status
      `,
      [
        job.dedupeKey,
        job.eventType,
        job.repoFullName,
        job.repoUrl,
        job.branch,
        job.commitSha,
        job.prNumber,
        job.prTitle,
        job.prUrl,
        job.mergedByLogin,
        job.authorLogin,
        job.changeSummary,
        job.changedPaths,
        job.eligiblePathCount,
        job.channelKey,
        job.discordChannelId,
        job.maxAttempts,
        JSON.stringify(job.payloadJson),
      ],
    );

    if (result.rowCount > 0) {
      return {
        created: true,
        id: result.rows[0].id,
        status: result.rows[0].status,
      };
    }

    const existing = await client.query(
      "SELECT id, status FROM discord_announcement_jobs WHERE dedupe_key = $1",
      [job.dedupeKey],
    );
    return {
      created: false,
      id: existing.rows[0]?.id ?? null,
      status: existing.rows[0]?.status ?? null,
    };
  } finally {
    await client.end();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const event = readEventPayload();
  const repoFullName = process.env.GITHUB_REPOSITORY || event.repository?.full_name;
  const sha = process.env.GITHUB_SHA || event.after || runGit(["rev-parse", "HEAD"]);
  const pullRequest = await fetchAssociatedPullRequest({
    repoFullName,
    sha,
    token: process.env.GITHUB_TOKEN,
  });
  const job = buildAnnouncementJob({ event, pullRequest });

  if (!job.eligiblePathCount) {
    console.log(
      JSON.stringify(
        {
          skipped: true,
          reason: "no_eligible_paths",
          summary: publicJobSummary(job),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          summary: publicJobSummary(job),
        },
        null,
        2,
      ),
    );
    return;
  }

  const result = await enqueueJob(job);
  console.log(
    JSON.stringify(
      {
        ...result,
        summary: publicJobSummary(job),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
