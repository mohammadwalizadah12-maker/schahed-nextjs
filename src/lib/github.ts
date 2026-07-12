/**
 * GitHub-Contents-API: liest/schreibt eine Datei im Repo und loest damit
 * (ueber Vercels Git-Integration) automatisch ein Redeploy aus.
 *
 * Benoetigte Vercel-Env-Variablen:
 *   GITHUB_TOKEN   Fine-grained PAT, Contents: Read+Write, nur dieses Repo
 *   GITHUB_REPO    z. B. "mohammadwalizadah12-maker/schahed-nextjs"
 *   GITHUB_BRANCH  z. B. "main"
 */

const API = "https://api.github.com";

function cfg() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN / GITHUB_REPO nicht konfiguriert.");
  }
  return { token, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** Aktuelle Datei-SHA holen (fuer Update noetig). null, falls Datei fehlt. */
async function getSha(path: string): Promise<string | null> {
  const { token, repo, branch } = cfg();
  const res = await fetch(
    `${API}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status}`);
  const json = await res.json();
  return json.sha as string;
}

/** Schreibt (erstellt/aktualisiert) eine Textdatei und committet sie. */
export async function commitFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const { token, repo, branch } = cfg();
  const sha = await getSha(path);

  // UTF-8 -> base64
  const bytes = new TextEncoder().encode(content);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const contentB64 = btoa(bin);

  const res = await fetch(`${API}/repos/${repo}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentB64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub PUT ${path}: ${res.status} ${detail}`);
  }
}
