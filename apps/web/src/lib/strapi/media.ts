export function getMediaUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/uploads/")) return path;

  const baseUrl = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL;
  if (!baseUrl) return path;

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}
