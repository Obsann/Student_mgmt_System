export function getEthiopianGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: "A", color: "text-green-600 bg-green-50" };
  if (score >= 80) return { grade: "B", color: "text-blue-600 bg-blue-50" };
  if (score >= 60) return { grade: "C", color: "text-yellow-600 bg-yellow-50" };
  if (score >= 50) return { grade: "D", color: "text-orange-600 bg-orange-50" };
  return { grade: "F", color: "text-red-600 bg-red-50" };
}
