"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { submitContactForm, initialContactState } from "@/app/actions/contact";

type FieldName = "name" | "email" | "message" | "websiteUrl";

const FIELD_LABELS: Record<FieldName, string> = {
  name: "Ad Soyad",
  email: "E-posta",
  message: "Projenizden bahsedin",
  websiteUrl: "Mevcut web siteniz (opsiyonel)",
};

type ValidationErrors = Partial<Record<FieldName, string>>;

/**
 * ContactForm — güvenli iletişim formu.
 * Yetkili doğrulama sunucudadır (server action + Zod). İstemci, aynı şemayı
 * alan blur anında dinamik import ederek anında geri bildirim verir;
 * zod böylece ilk boyama JS bundle'ında yer almaz.
 * Erişilebilirlik: label-for, aria-invalid, aria-live durum bölgesi.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialContactState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [startedAt, setStartedAt] = useState("0");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleFocus = (): void => {
    if (startedAt === "0") setStartedAt(String(Date.now()));
  };

  /** Alan blur'unda şema modülünü dinamik yükleyip tek alanı doğrular. */
  const handleBlur = async (name: FieldName): Promise<void> => {
    const form = formRef.current;
    if (!form) return;
    const value = form.elements.namedItem(name);
    if (
      !(value instanceof HTMLInputElement) &&
      !(value instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    const { contactFormSchema } = await import("@/lib/validation/contact");
    const fieldSchema = contactFormSchema.shape[name];
    const result = fieldSchema.safeParse(value.value);
    const isEmpty = value.value.trim().length === 0;
    const isValid = result.success || (isEmpty && name !== "message");

    setErrors((previous) => {
      const next: ValidationErrors = { ...previous };
      if (isValid) {
        delete next[name];
      } else {
        next[name] = result.error.issues[0]?.message;
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
    }
    // Yetkili doğrulama + anti-spam kontrolleri server action'dadır.
  };

  const renderField = (
    name: FieldName,
    type: "text" | "email" | "url",
    required: boolean,
    autoComplete?: string,
  ) => (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`contact-${name}`}
        className="font-display text-xs uppercase tracking-[0.2em] text-muted"
      >
        {FIELD_LABELS[name]}
        {required && <span className="text-accent"> *</span>}
      </label>
      {name === "message" ? (
        <textarea
          id={`contact-${name}`}
          name={name}
          rows={5}
          required={required}
          maxLength={2000}
          onFocus={handleFocus}
          onBlur={() => void handleBlur(name)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
          placeholder="Hedeflerinizi ve zaman çizelgenizi kısaca anlatın…"
        />
      ) : (
        <input
          id={`contact-${name}`}
          name={name}
          type={type}
          required={required}
          maxLength={200}
          autoComplete={autoComplete}
          onFocus={handleFocus}
          onBlur={() => void handleBlur(name)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
        />
      )}
      {errors[name] && (
        <p id={`error-${name}`} role="alert" className="text-xs text-red-400">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      noValidate
      className="relative flex flex-col gap-6"
    >
      {/* Honeypot — görsel ve klavye akışının dışında */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Şirket
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="grid gap-6 sm:grid-cols-2">
        {renderField("name", "text", true, "name")}
        {renderField("email", "email", true, "email")}
      </div>

      {renderField("websiteUrl", "url", false, "url")}

      {renderField("message", "text", true)}

      <div aria-live="polite" className="min-h-6 text-sm">
        {state.status !== "idle" && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={state.status === "success" ? "text-accent" : "text-red-400"}
          >
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="group inline-flex w-fit items-center gap-3 rounded-full bg-accent px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.18em] text-background transition-[filter] duration-200 hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Gönderiliyor…" : "Gönder"}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </form>
  );
}
