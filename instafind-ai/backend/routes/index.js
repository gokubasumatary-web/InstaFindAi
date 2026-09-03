import { Router } from "express";
const router = Router();

// --- AI Query Parsing Endpoint ---
router.post("/parse-query", async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required" });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return res.json(extractMockParams(query));
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Extract Instagram search parameters from: "${query}". Return ONLY valid JSON with these fields: category (string), location (string), min_followers (number), max_followers (number), engagement_rate (number 0-10, optional). No prose, just JSON. If a field cannot be determined, use null.` }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      }
    );
    const data = await response.json();
    const parsed = JSON.parse(data.candidates[0].content.text);
    res.json(parsed);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    res.json(extractMockParams(query));
  }
});

// --- Search Endpoint ---
router.post("/search", async (req, res) => {
  const { filters } = req.body;
  if (!filters) {
    return res.status(400).json({ error: "Filters are required" });
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY;

  // Try real Instagram API if key is configured
  if (rapidApiKey && rapidApiKey !== "your-rapidapi-key-here") {
    try {
      const results = await searchRealInstagram(filters, rapidApiKey);
      return res.json({ results, total: results.length });
    } catch (error) {
      console.error("Real API search failed, falling back to mock:", error.message);
    }
  }

  // Fallback to mock data
  const accounts = getMockAccounts();
  let results = accounts;

  if (filters.category) {
    results = results.filter(
      (a) => a.category.toLowerCase().includes(filters.category.toLowerCase()) ||
        a.displayName.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  if (filters.location) {
    results = results.filter((a) => a.location.toLowerCase().includes(filters.location.toLowerCase()));
  }
  if (filters.min_followers !== undefined) {
    results = results.filter((a) => a.followers >= filters.min_followers);
  }
  if (filters.max_followers !== undefined) {
    results = results.filter((a) => a.followers <= filters.max_followers);
  }
  if (filters.engagement_rate !== undefined) {
    results = results.filter((a) => a.engagementRate >= filters.engagement_rate);
  }

  const scoredResults = results.map((account) => {
    let score = 0;
    const reasons = [];
    if (filters.category && account.category.toLowerCase().includes(filters.category.toLowerCase())) {
      score += 25; reasons.push("Category matches");
    }
    if (filters.location && account.location.toLowerCase().includes(filters.location.toLowerCase())) {
      score += 25; reasons.push("Location matches");
    }
    if (filters.min_followers !== undefined && account.followers >= filters.min_followers) {
      score += 25; reasons.push("Follower range matches");
    }
    if (filters.engagement_rate !== undefined && account.engagementRate >= filters.engagement_rate) {
      score += 25; reasons.push("Strong engagement");
    }
    return { ...account, matchScore: Math.min(score, 100), matchReasons: reasons };
  });

  scoredResults.sort((a, b) => b.matchScore - a.matchScore);
  res.json({ results: scoredResults, total: scoredResults.length });
});

// --- Real Instagram Search via RapidAPI (PullAPI) ---
async function searchRealInstagram(filters, apiKey) {
  const queryParts = [];
  if (filters.category) queryParts.push(filters.category);
  if (filters.location) queryParts.push(filters.location);
  const searchQuery = queryParts.join(" ") || "instagram";

  const searchUrl = `https://api.pullapi.com/instagram/search?query=${encodeURIComponent(searchQuery)}`;
  const searchResp = await fetch(searchUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "api.pullapi.com",
    },
  });

  if (!searchResp.ok) {
    throw new Error(`Instagram search API returned ${searchResp.status}`);
  }

  const searchData = await searchResp.json();
  if (!searchData.success || !searchData.data || !searchData.data.users) {
    throw new Error("No users found in search results");
  }

  const users = searchData.data.users.slice(0, 20);
  const profiles = [];

  for (const user of users) {
    try {
      const profileUrl = `https://api.pullapi.com/instagram/profile?username=${user.username}`;
      const profileResp = await fetch(profileUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "api.pullapi.com",
        },
      });

      if (profileResp.ok) {
        const profileData = await profileResp.json();
        if (profileData.success && profileData.data) {
          const p = profileData.data;
          profiles.push({
            id: p.user_id || user.user_id,
            username: p.username || user.username,
            displayName: p.full_name || user.full_name || user.username,
            category: filters.category || "instagram account",
            followers: p.follower_count || 0,
            following: p.following_count || 0,
            location: filters.location || "Unknown",
            bio: p.biography || "",
            engagementRate: null,
            isVerified: p.is_verified || false,
            isBusiness: p.is_business || false,
            lastActive: null,
            instagramUrl: `https://instagram.com/${p.username || user.username}`,
            matchScore: 0,
            matchReasons: ["Real Instagram data"],
          });
        }
      }
    } catch (e) {
      // Skip profiles that fail to load
    }
  }

  return profiles.map((account) => {
    let score = 0;
    const reasons = [];
    if (filters.category && account.bio && account.bio.toLowerCase().includes(filters.category.toLowerCase())) {
      score += 25; reasons.push("Category matches bio");
    }
    if (filters.location && account.bio && account.bio.toLowerCase().includes(filters.location.toLowerCase())) {
      score += 25; reasons.push("Location mentioned in bio");
    }
    if (filters.min_followers !== undefined && account.followers >= filters.min_followers) {
      score += 25; reasons.push("Follower count matches");
    }
    if (filters.max_followers !== undefined && account.followers <= filters.max_followers) {
      score += 15; reasons.push("Within follower limit");
    }
    return { ...account, matchScore: Math.min(score + 10, 100), matchReasons: reasons.length > 0 ? reasons : ["Search match"] };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// --- Save Account Endpoint ---
router.post("/save", (req, res) => {
  const { account } = req.body;
  res.json({ message: "Account saved successfully", account });
});

// --- Export CSV Endpoint ---
router.post("/export-csv", (req, res) => {
  const { accounts } = req.body;
  if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
    return res.status(400).json({ error: "Accounts data is required" });
  }
  const headers = ["Username", "Display Name", "Category", "Followers", "Location", "Engagement Rate", "Instagram URL", "Match Score"];
  const csvRows = [headers.join(",")];
  accounts.forEach((account) => {
    csvRows.push([
      account.username,
      `"${account.displayName}"`,
      account.category,
      account.followers,
      `"${account.location}"`,
      account.engagementRate || "N/A",
      account.instagramUrl,
      account.matchScore,
    ].join(","));
  });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=instafind-ai-results.csv");
  res.send(csvRows.join("\n"));
});

// --- Similar Accounts Endpoint ---
router.post("/similar", (req, res) => {
  const { accountId } = req.body;
  const accounts = getMockAccounts();
  const targetAccount = accounts.find((a) => a.id === accountId);
  if (!targetAccount) {
    return res.status(404).json({ error: "Account not found" });
  }
  let similar = accounts.filter(
    (a) => a.id !== accountId && a.category === targetAccount.category
  );
  similar.sort((a, b) => b.followers - a.followers);
  similar = similar.slice(0, 10);
  res.json({ similar });
});

// Seed mock data
const seedAccounts = seedMockAccounts();
let mockAccounts = seedAccounts;

function getMockAccounts() {
  return mockAccounts;
}

// Helper: Extract mock params from query
function extractMockParams(query) {
  const lower = query.toLowerCase();
  const params = { category: null, location: null, min_followers: null, max_followers: null, engagement_rate: null };
  const categoryPatterns = ["fitness coach", "python teacher", "tech influencer", "business coach", "travel creator", "fitness", "tech", "business", "travel"];
  for (const pattern of categoryPatterns) {
    if (lower.includes(pattern)) { params.category = pattern; break; }
  }
  if (lower.includes("india") || lower.includes("indian")) params.location = "India";
  else if (lower.includes("bangalore") || lower.includes("bengaluru")) params.location = "Bangalore";
  else if (lower.includes("mumbai")) params.location = "Mumbai";
  else if (lower.includes("delhi")) params.location = "Delhi";
  else if (lower.includes("worldwide")) params.location = "Worldwide";
  const followerMatch = query.match(/(\d+(?:\.?\d+)?)K/g);
  if (followerMatch) {
    const minK = parseFloat(followerMatch[0]);
    const maxK = followerMatch.length > 1 ? parseFloat(followerMatch[1]) : minK + 20;
    params.min_followers = minK * 1000;
    params.max_followers = maxK * 1000;
  }
  return params;
}

// Helper: Seed mock account data
function seedMockAccounts() {
  const categories = ["fitness coach", "python teacher", "tech influencer", "business coach", "travel creator", "lifestyle blogger", "foodie", "fitness model"];
  const locations = ["India", "Bangalore", "Mumbai", "Delhi", "Worldwide", "US", "UK"];
  const accounts = [];
  let seed = 42;
  const seededRandom = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };

  const demoData = [
    { category: "fitness coach", location: "India", followers: 15000 },
    { category: "fitness coach", location: "India", followers: 25000 },
    { category: "fitness coach", location: "India", followers: 35000 },
    { category: "fitness coach", location: "India", followers: 45000 },
    { category: "fitness coach", location: "India", followers: 12000 },
    { category: "fitness coach", location: "Bangalore", followers: 18000 },
    { category: "fitness coach", location: "Mumbai", followers: 22000 },
    { category: "fitness coach", location: "Delhi", followers: 30000 },
    { category: "python teacher", location: "India", followers: 20000 },
    { category: "python teacher", location: "India", followers: 40000 },
    { category: "python teacher", location: "Bangalore", followers: 15000 },
    { category: "python teacher", location: "US", followers: 50000 },
    { category: "tech influencer", location: "India", followers: 25000 },
    { category: "tech influencer", location: "India", followers: 45000 },
    { category: "tech influencer", location: "Worldwide", followers: 80000 },
    { category: "tech influencer", location: "US", followers: 60000 },
    { category: "business coach", location: "India", followers: 18000 },
    { category: "business coach", location: "Mumbai", followers: 35000 },
    { category: "business coach", location: "Delhi", followers: 28000 },
    { category: "business coach", location: "UK", followers: 42000 },
    { category: "travel creator", location: "India", followers: 22000 },
    { category: "travel creator", location: "Worldwide", followers: 55000 },
    { category: "travel creator", location: "US", followers: 38000 },
    { category: "travel creator", location: "UK", followers: 31000 },
    { category: "lifestyle blogger", location: "India", followers: 16000 },
    { category: "lifestyle blogger", location: "Mumbai", followers: 27000 },
    { category: "lifestyle blogger", location: "Bangalore", followers: 19000 },
    { category: "foodie", location: "India", followers: 14000 },
    { category: "foodie", location: "Delhi", followers: 23000 },
    { category: "foodie", location: "Mumbai", followers: 33000 },
    { category: "fitness model", location: "India", followers: 21000 },
    { category: "fitness model", location: "US", followers: 48000 },
    { category: "fitness model", location: "UK", followers: 36000 },
    { category: "fitness coach", location: "India", followers: 8000 },
    { category: "fitness coach", location: "India", followers: 55000 },
    { category: "fitness coach", location: "India", followers: 95000 },
    { category: "fitness coach", location: "Bangalore", followers: 42000 },
    { category: "fitness coach", location: "Mumbai", followers: 67000 },
    { category: "fitness coach", location: "Delhi", followers: 11000 },
    { category: "fitness coach", location: "India", followers: 29000 },
  ];

  for (let i = 0; i < demoData.length; i++) {
    const d = demoData[i];
    const engagementRate = (2 + seededRandom() * 8).toFixed(1);
    const isVerified = seededRandom() > 0.5;
    const isBusiness = seededRandom() > 0.3;
    const username = `@${["fit", "tech", "guru", "coach", "create"][i % 5]}${i + 1}`;
    accounts.push({
      id: i + 1,
      username,
      displayName: `${d.category} ${i + 1}`,
      category: d.category,
      followers: d.followers,
      following: Math.floor(seededRandom() * 5000) + 100,
      location: d.location,
      bio: `${d.category} sharing insights and tips`,
      engagementRate: parseFloat(engagementRate),
      isVerified,
      isBusiness,
      lastActive: new Date(Date.now() - seededRandom() * 24 * 60 * 60 * 1000).toISOString(),
      instagramUrl: `https://instagram.com/${username.replace("@", "")}`,
    });
  }

  for (let i = demoData.length; i < 80; i++) {
    const category = categories[Math.floor(seededRandom() * categories.length)];
    const location = locations[Math.floor(seededRandom() * locations.length)];
    const followerCount = 5000 + seededRandom() * 95000;
    const engagementRate = (2 + seededRandom() * 8).toFixed(1);
    const isVerified = seededRandom() > 0.5;
    const isBusiness = seededRandom() > 0.3;
    const username = `@${["fit", "tech", "guru", "coach", "create"][i % 5]}${i + 1}`;
    accounts.push({
      id: i + 1,
      username,
      displayName: `${category} ${i + 1}`,
      category,
      followers: Math.floor(followerCount),
      following: Math.floor(seededRandom() * 5000) + 100,
      location,
      bio: `${category} sharing insights and tips`,
      engagementRate: parseFloat(engagementRate),
      isVerified,
      isBusiness,
      lastActive: new Date(Date.now() - seededRandom() * 24 * 60 * 60 * 1000).toISOString(),
      instagramUrl: `https://instagram.com/${username.replace("@", "")}`,
    });
  }

  return accounts;
}

export default router;
