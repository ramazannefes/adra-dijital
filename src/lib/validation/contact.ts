import { z } from "zod";

/**
 * İletişim formu doğrulama şeması (TEK DOĞRULUK KAYNAĞI).
 * Sunucu bu şemayla yetkili doğrulama yapar; istemci aynı şemayı
 * blur anında dinamik import ederek UX geri bildirimi verir —
 * zod böylece ilk boyama JS bundle'ından çıkmış olur.
 */
export const CONTACT_MIN_SUBMIT_MS = 3000;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Adınızı girin.")
    .max(100, "Ad çok uzun."),
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi girin.")
    .max(200, "E-posta çok uzun."),
  company: z.string().trim().max(120, "Şirket adı çok uzun.").optional().default(""),
  websiteUrl: z
    .string()
    .trim()
    .max(300, "URL çok uzun.")
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .min(10, "Projeniz hakkında biraz daha bilgi verin (en az 10 karakter).")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir."),
  /** Formun açılma zamanı (ms) — bot beklemesi kontrolü için. */
  startedAt: z.coerce.number().int().nonnegative().optional().default(0),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactFormSchema = typeof contactFormSchema;
