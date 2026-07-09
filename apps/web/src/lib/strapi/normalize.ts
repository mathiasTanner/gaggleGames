export type StrapiRecord = Record<string, unknown>;

export function asRecord(value: unknown): StrapiRecord {
  return value && typeof value === "object" ? (value as StrapiRecord) : {};
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function unwrapData(value: unknown): StrapiRecord {
  const record = asRecord(value);
  const data = asRecord(record.data);
  return asRecord(data.attributes ?? data);
}

export function unwrapMedia(value: unknown): StrapiRecord | undefined {
  const record = asRecord(value);
  const data = asRecord(record.data);
  const media = asRecord(data.attributes ?? record);
  return typeof media.url === "string" ? media : undefined;
}
