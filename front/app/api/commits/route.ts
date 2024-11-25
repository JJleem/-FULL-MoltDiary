// app/api/commits/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const username = "JJleem";
  const token = process.env.GITHUB_TOKEN;

  // Fetch all repositories for the user
  const repoResponse = await fetch(
    `https://api.github.com/users/${username}/repos`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  const repos = await repoResponse.json();

  let allCommits: any[] = [];

  // Fetch commits from each repository
  for (const repo of repos) {
    const commitResponse = await fetch(
      `https://api.github.com/repos/${username}/${repo.name}/commits`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    const commits = await commitResponse.json();
    allCommits = allCommits.concat(commits);
  }

  // Return the collected commits
  return NextResponse.json({ commits: allCommits });
}
