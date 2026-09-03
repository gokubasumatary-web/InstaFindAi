// Seed mock account data for development
const seedMockAccounts = () => {
  const categories = [
    "fitness coach",
    "python teacher",
    "tech influencer",
    "business coach",
    "travel creator",
    "lifestyle blogger",
    "fitness model",
  ];
  const locations = ["India", "Bangalore", "Mumbai", "Delhi", "Worldwide", "US", "UK"];

  const accounts = [];

  for (let i = 1; i <= 80; i++) {
    const category =
      categories[Math.floor(Math.random() * categories.length)];
    const location =
      locations[Math.floor(Math.random() * locations.length)];
    const followerCount =
      Math.pow(10, 1 + Math.random() * 3) * 1000; // 1K to 100K
    const engagementRate = (Math.random() * 10 + 1).toFixed(1); // 1-10%
    const isVerified = Math.random() > 0.5;
    const isBusiness = Math.random() > 0.3;

    const displayNames = [
      "guru " + i,
      "coach " + i,
      "creator " + i,
      "expert " + i,
    ];
    const username =
      "@" +
      (["fit", "tech", "guru", "coach", "create"][Math.floor(Math.random() * 5)] +
        i);

    accounts.push({
      id: i,
      username,
      displayName: `${category.replace(" ", " ")} ${i}`,
      category,
      followers: Math.floor(followerCount),
      following: Math.floor(Math.random() * 5000) + 100,
      location,
      bio: `${category} sharing insights and tips 💡`,
      engagementRate: parseFloat(engagementRate),
      isVerified,
      isBusiness,
      lastActive: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000
      ).toISOString(),
      instagramUrl: `https://instagram.com/${username.replace("@", "")}`,
    });
  }

  return accounts;
};

module.exports = seedMockAccounts;