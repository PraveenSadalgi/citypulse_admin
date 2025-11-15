export type Issue = {
  id: number;
  city: string;
  title: string;
  category: string;
  status: "urgent" | "high" | "medium" | "low";
  location: string;
  description: string;
  urgencyScore: number;
  createdAt: string;
  reportedBy: string;
  isResolved?: boolean;
  coinsEarned?: number;
};

const cities = ["Bengaluru", "Mumbai", "Delhi", "Pune"];

const reporterNames = [
  "Asha", "Ramesh", "Priya", "Karan", "Sneha", "Vikram", "Neha", "Rohit", "Sara", "Akhil"
];

const categories = ["Roads", "Sanitation", "Water", "Streetlight", "Tree", "Signage"];

const statuses: Issue["status"][] = ["urgent", "high", "medium", "low"];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Choose random counts per city from a set, including 5,10,12 etc.
const countsPool = [5, 7, 8, 10, 12];

let idCounter = 1000;
const mockIssues: Issue[] = [];

for (const city of cities) {
  const count = countsPool[Math.floor(Math.random() * countsPool.length)];
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString();
    const urgencyScore = randomInt(10, 100);
    const isResolved = Math.random() < 0.25 && status === "low"; // some lows resolved

    mockIssues.push({
      id: idCounter++,
      city,
      title: `${categories[Math.floor(Math.random() * categories.length)]} issue near Sector ${randomInt(1, 50)}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      status,
      location: `${city} - Ward ${randomInt(1, 80)}`,
      description: `This is a mock description for an issue in ${city}. It affects local residents and needs attention. Generated for SuperAdmin testing.`,
      urgencyScore,
      createdAt,
      reportedBy: reporterNames[Math.floor(Math.random() * reporterNames.length)],
      isResolved,
      coinsEarned: Math.random() > 0.85 ? randomInt(5, 50) : undefined,
    });
  }
}

export const getIssuesByCity = (city: string) => mockIssues.filter((m) => m.city === city);

export const getSummaryCountsByCity = () => {
  const map: Record<string, { city: string; pending: number; unresolved: number }> = {} as any;
  for (const c of cities) map[c] = { city: c, pending: 0, unresolved: 0 };

  for (const issue of mockIssues) {
    const rec = map[issue.city];
    if (!rec) continue;
    if (!issue.isResolved) rec.pending += 1;
    // treat unresolved as high or urgent issues that are not resolved
    if (!issue.isResolved && (issue.status === "urgent" || issue.status === "high")) rec.unresolved += 1;
  }

  return Object.values(map);
};

export { mockIssues, cities };
