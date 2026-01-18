export type SessionPayload = {
  uid: string;
  role: "ADMIN" | "EDITOR";
  iat: number; // issued at (seconds)
  exp: number; // expiry (seconds)
};

const textEncoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

async function hmac(input: string): Promise<string> {
  const keyData = textEncoder.encode(getSecret());
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, textEncoder.encode(input));
  return Buffer.from(new Uint8Array(sig)).toString("base64url");
}

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function unbase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  const body = JSON.stringify(payload);
  const b64 = base64url(body);
  const sig = await hmac(b64);
  return `${b64}.${sig}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = await hmac(b64);
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(unbase64url(b64)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function buildAdminSession(uid: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // 7 days expiry
  const payload: SessionPayload = {
    uid,
    role: "ADMIN",
    iat: now,
    exp: now + 60 * 60 * 24 * 7,
  };
  return createSessionToken(payload);
}
