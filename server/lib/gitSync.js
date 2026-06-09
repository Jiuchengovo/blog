import { exec } from "child_process";

const BRANCH = "main";

/**
 * Commit and push content/posts/ changes to GitHub.
 * Runs asynchronously (fire-and-forget) — does NOT block the API response.
 */
export function syncPostsToGit(slug, action) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn("[gitSync] GITHUB_TOKEN not set in .env — skipping git push");
    return;
  }

  const repoDir = process.cwd();
  const remoteUrl = `https://x-access-token:${token}@github.com/Jiuchengovo/blog.git`;
  const commitMsg = `content: ${action} post "${slug}"`;

  const cmd = [
    `cd "${repoDir}"`,
    // Ensure git user is configured (needed for commit)
    `git config user.email >/dev/null 2>&1 || git config user.email "blog-bot@jiuchengovo.me"`,
    `git config user.name >/dev/null 2>&1 || git config user.name "Blog Bot"`,
    `git add content/posts/`,
    // Only commit if there are staged changes
    `git diff --cached --quiet || git commit -m "${commitMsg.replace(/"/g, '\\"')}"`,
    `git push ${remoteUrl} ${BRANCH}`,
  ].join(" && ");

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`[gitSync] Push failed for "${slug}":`, stderr || err.message);
      return;
    }
    console.log(`[gitSync] Pushed: ${commitMsg}`);
    if (stdout) console.log(stdout.trim());
  });
}
