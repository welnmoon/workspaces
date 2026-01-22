export const withQuery = <
  T extends Record<string, string | number | boolean | null | undefined>,
>(
  path: string,
  query?: T
): string => {
  if (!query) return path;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.set(key, String(value));
  });

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};
