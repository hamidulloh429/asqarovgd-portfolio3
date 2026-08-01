"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  siteTitle: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  aboutText: string;
  contactEmail: string | null;
  contactTelegram: string | null;
  contactInstagram: string | null;
  contactWhatsapp: string | null;
  contactLinkedin: string | null;
  otherLinksJson: string;
};

export default function AdminSettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [otherLinks, setOtherLinks] = useState<{ label: string; url: string }[]>(() => {
    try {
      return JSON.parse(settings.otherLinksJson || "[]");
    } catch {
      return [];
    }
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Settings, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const inputClass =
    "mt-1.5 w-full rounded-md border border-mist bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink";

  async function uploadBrandAsset(file: File, role: "logo" | "favicon") {
    const body = new FormData();
    body.append("file", file);
    body.append("role", role);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (res.ok) {
      set(role === "logo" ? "logoUrl" : "faviconUrl", data.saved.url);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, otherLinksJson: JSON.stringify(otherLinks) }),
    });
    setSaving(false);
    setSavedAt(Date.now());
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <section className="rounded-lg border border-mist bg-paper p-6">
        <h2 className="font-display text-base font-semibold">Branding</h2>
        <div className="mt-4">
          <label className="text-xs font-medium text-graphite">Site title / nickname</label>
          <input value={form.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} className={inputClass} />
        </div>

        <div className="mt-4 flex gap-8">
          <div>
            <p className="text-xs font-medium text-graphite">Logo</p>
            <div className="mt-2 flex items-center gap-3">
              {form.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                className="rounded-full border border-mist px-3.5 py-1.5 text-xs hover:border-ink"
              >
                Upload
              </button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadBrandAsset(e.target.files[0], "logo")} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-graphite">Favicon</p>
            <div className="mt-2 flex items-center gap-3">
              {form.faviconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.faviconUrl} alt="Favicon" className="h-12 w-12 rounded-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => faviconRef.current?.click()}
                className="rounded-full border border-mist px-3.5 py-1.5 text-xs hover:border-ink"
              >
                Upload
              </button>
              <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadBrandAsset(e.target.files[0], "favicon")} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-mist bg-paper p-6">
        <h2 className="font-display text-base font-semibold">Homepage</h2>
        <div className="mt-4">
          <label className="text-xs font-medium text-graphite">Hero title</label>
          <input value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} className={inputClass} />
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-graphite">Hero subtitle / role</label>
          <input value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} className={inputClass} />
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-graphite">Hero intro</label>
          <textarea rows={3} value={form.heroIntro} onChange={(e) => set("heroIntro", e.target.value)} className={inputClass} />
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-graphite">About text</label>
          <textarea rows={4} value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} className={inputClass} />
        </div>
      </section>

      <section className="rounded-lg border border-mist bg-paper p-6">
        <h2 className="font-display text-base font-semibold">Contact</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-graphite">Email</label>
            <input value={form.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-graphite">Telegram URL</label>
            <input value={form.contactTelegram || ""} onChange={(e) => set("contactTelegram", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-graphite">Instagram URL</label>
            <input value={form.contactInstagram || ""} onChange={(e) => set("contactInstagram", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-graphite">WhatsApp URL</label>
            <input value={form.contactWhatsapp || ""} onChange={(e) => set("contactWhatsapp", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-graphite">LinkedIn URL</label>
            <input value={form.contactLinkedin || ""} onChange={(e) => set("contactLinkedin", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-graphite">Other links</p>
            <button
              type="button"
              onClick={() => setOtherLinks((l) => [...l, { label: "", url: "" }])}
              className="text-xs text-ember hover:underline"
            >
              + Add link
            </button>
          </div>
          {otherLinks.map((l, i) => (
            <div key={i} className="mt-2 flex gap-2">
              <input
                placeholder="Label"
                value={l.label}
                onChange={(e) => setOtherLinks((links) => links.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                className={inputClass}
              />
              <input
                placeholder="URL"
                value={l.url}
                onChange={(e) => setOtherLinks((links) => links.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setOtherLinks((links) => links.filter((_, idx) => idx !== i))}
                className="text-xs text-graphite hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ember disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {savedAt && <span className="text-xs text-graphite">Saved.</span>}
      </div>
    </form>
  );
}
