import { NextRequest, NextResponse } from "next/server";

interface GitHubMember {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const org = searchParams.get("org");
    const perPage = searchParams.get("per_page") || "30";
    const page = searchParams.get("page") || "1";

    if (!org) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return NextResponse.json(
        {
          error:
            "GitHub authentication required. Please login with GitHub or set GITHUB_TOKEN env variable.",
        },
        { status: 401 }
      );
    }

    // Fetch organization members
    const membersResponse = await fetch(
      `https://api.github.com/orgs/${org}/members?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Blockful-Portal",
        },
      }
    );

    if (!membersResponse.ok) {
      const errorData = await membersResponse.json();
      return NextResponse.json(
        {
          error: "Failed to fetch organization members",
          details: errorData.message || "Unknown error",
        },
        { status: membersResponse.status }
      );
    }

    const members: GitHubMember[] = await membersResponse.json();

    // Get detailed information for each member
    const detailedMembers = await Promise.all(
      members.map(async (member) => {
        try {
          const userResponse = await fetch(
            `https://api.github.com/users/${member.login}`,
            {
              headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Blockful-Portal",
              },
            }
          );

          if (userResponse.ok) {
            const userDetails = await userResponse.json();
            return {
              ...member,
              name: userDetails.name,
              email: userDetails.email,
              bio: userDetails.bio,
              location: userDetails.location,
              company: userDetails.company,
              blog: userDetails.blog,
              twitter_username: userDetails.twitter_username,
              public_repos: userDetails.public_repos,
              public_gists: userDetails.public_gists,
              followers: userDetails.followers,
              following: userDetails.following,
              created_at: userDetails.created_at,
              updated_at: userDetails.updated_at,
            };
          }

          return member;
        } catch (error) {
          console.error(`Error fetching details for ${member.login}:`, error);
          return member;
        }
      })
    );

    // Get pagination info from headers
    const linkHeader = membersResponse.headers.get("link");
    const totalPages = linkHeader
      ? Math.max(
          ...Array.from(linkHeader.matchAll(/page=(\d+)/g)).map((m) =>
            parseInt(m[1])
          )
        )
      : 1;

    return NextResponse.json({
      members: detailedMembers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        perPage: parseInt(perPage),
        hasNext: linkHeader?.includes('rel="next"') || false,
        hasPrev: linkHeader?.includes('rel="prev"') || false,
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub organization members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
