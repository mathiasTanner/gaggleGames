type BrevoEmailPayload = {
  sender: {
    email: string;
    name?: string;
  };
  to: {
    email: string;
    name?: string;
  }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  tags?: string[];
  headers?: Record<string, string>;
};

type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "send_failed"; error?: string };

export function parseSender(value: string) {
  const match = value.match(/^(.+?)\s*<([^<>]+)>$/);

  if (!match) {
    return { email: value.trim() };
  }

  return {
    name: match[1].trim().replace(/^"|"$/g, ""),
    email: match[2].trim(),
  };
}

export async function sendBrevoEmail(
  payload: BrevoEmailPayload
): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return { ok: false, reason: "not_configured" };
  }

  let response: Response;
  try {
    response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return {
      ok: false,
      reason: "send_failed",
      error: err instanceof Error ? err.message : "Unable to reach Brevo",
    };
  }

  const data = (await response.json().catch(() => null)) as
    | { messageId?: string; message?: string; code?: string }
    | null;

  if (!response.ok) {
    return {
      ok: false,
      reason: "send_failed",
      error:
        data?.message ??
        data?.code ??
        `Brevo returned HTTP ${response.status}`,
    };
  }

  return { ok: true, id: data?.messageId ?? null };
}
