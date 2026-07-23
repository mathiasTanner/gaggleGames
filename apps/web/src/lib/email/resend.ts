type ResendEmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  tags?: {
    name: string;
    value: string;
  }[];
};

type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "send_failed"; error?: string };

export async function sendResendEmail(
  payload: ResendEmailPayload,
  idempotencyKey?: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { ok: false, reason: "not_configured" };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return {
      ok: false,
      reason: "send_failed",
      error: err instanceof Error ? err.message : "Unable to reach Resend",
    };
  }

  const data = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; error?: string }
    | null;

  if (!response.ok) {
    return {
      ok: false,
      reason: "send_failed",
      error:
        data?.message ??
        data?.error ??
        `Resend returned HTTP ${response.status}`,
    };
  }

  return { ok: true, id: data?.id ?? null };
}
