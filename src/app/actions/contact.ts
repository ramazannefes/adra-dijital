"use server";

import { headers } from "next/headers";
import { contactFormSchema } from "@/lib/validation/contact";
import { CONTACT_MIN_SUBMIT_MS } from "@/lib/validation/contact";
import { isRateLimited } from "@/lib/server/rateLimit";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialContactState: ContactState = { status: "idle", message: "" };

/** Kullanıcıya gösterilecek mesajlar — teknik detay sızdırılmaz. */
const MESSAGES = {
  invalid: "Lütfen form alanlarını kontrol edin ve tekrar deneyin.",
  tooFast: "Mesajınız alındı. Teşekkürler!",
  rateLimited:
    "Çok fazla deneme yaptınız. Lütfen bir dakika sonra tekrar deneyin.",
  sendFailed:
    "Mesajınız şu an gönderilemedi. Bize doğrudan e-posta ile ulaşabilirsiniz.",
  success: "Mesajınız alındı. En kısa sürede size döneceğiz.",
} as const;

async function getClientKey(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * İletişim formu — kritik iş mantığı tamamen sunucudadır:
 * 1) Honeypot: gizli "company" alanı doluysa bot → sessizce yutulur.
 * 2) Süre kontrolü: 3 sn'den hızlı gönderim bot işaretidir.
 * 3) Rate limit: IP başına dakikada 5 istek.
 * 4) Zod doğrulaması (tek doğruluk kaynağı).
 * 5) RESEND_API_KEY varsa e-posta; yoksa sunucu logu. Site asla bozulmaz.
 * CSRF: Server Action origin kontrolüyle Next.js tarafından korunur.
 */
export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    company: formData.get("company") ?? "",
    websiteUrl: formData.get("websiteUrl") ?? "",
    message: formData.get("message") ?? "",
    startedAt: formData.get("startedAt") ?? "0",
  };

  // Honeypot — botlara gerçekten başarılı hissi ver, hiçbir şey yapma.
  if (String(raw.company).length > 0) {
    console.info("[contact] honeypot tetiklendi — istek yutuldu.");
    return { status: "success", message: MESSAGES.tooFast };
  }

  const parsedStartedAt = Number(raw.startedAt);
  if (
    Number.isFinite(parsedStartedAt) &&
    Date.now() - parsedStartedAt < CONTACT_MIN_SUBMIT_MS
  ) {
    console.info("[contact] şüpheli hız — istek yutuldu.");
    return { status: "success", message: MESSAGES.tooFast };
  }

  if (isRateLimited(await getClientKey())) {
    return { status: "error", message: MESSAGES.rateLimited };
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? MESSAGES.invalid;
    return { status: "error", message: firstIssue };
  }

  const { name, email, websiteUrl, message } = parsed.data;

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.info(
      `[contact] RESEND_API_KEY yok — mesaj loglandı | ${name} <${email}> | ${websiteUrl || "site yok"} | ${message.slice(0, 80)}…`,
    );
    return { status: "success", message: MESSAGES.success };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env["CONTACT_FROM_EMAIL"] ?? "AdRa Dijital <onboarding@resend.dev>";
    const to = process.env["CONTACT_TO_EMAIL"] ?? "merhaba@adradijital.com";

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Yeni proje talebi — ${name}`,
      text: `Ad: ${name}\nE-posta: ${email}\nWeb: ${websiteUrl || "-"}\n\n${message}`,
    });

    return { status: "success", message: MESSAGES.success };
  } catch (error) {
    console.error("[contact] e-posta gönderimi başarısız:", error);
    return { status: "error", message: MESSAGES.sendFailed };
  }
}
