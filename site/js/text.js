// "**kalın**" işaretli metni parçalara ayırır; parçalar DOM'a textContent ile yazılır.
export function tokenizeBold(input) {
  const s = String(input ?? '');
  if (!s) return [];
  const parts = s.split('**');
  if (parts.length % 2 === 0) return [{ text: s, bold: false }];
  return parts.map((text, i) => ({ text, bold: i % 2 === 1 })).filter((p) => p.text.length > 0);
}
