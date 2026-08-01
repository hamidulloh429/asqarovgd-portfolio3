import Link from "next/link";

type Settings = {
  siteTitle: string;
  contactEmail: string | null;
  contactTelegram: string | null;
  contactInstagram: string | null;
  contactWhatsapp: string | null;
  contactLinkedin: string | null;
  otherLinksJson: string;
} | null;

export default function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  let otherLinks: { label: string; url: string }[] = [];
  try {
    otherLinks = settings?.otherLinksJson ? JSON.parse(settings.otherLinksJson) : [];
  } catch {
    otherLinks = [];
  }

  const links = [
    settings?.contactEmail && { label: "Email", url: `mailto:${settings.contactEmail}` },
    settings?.contactTelegram && { label: "Telegram", url: settings.contactTelegram },
    settings?.contactInstagram && { label: "Instagram", url: settings.contactInstagram },
    settings?.contactWhatsapp && { label: "WhatsApp", url: settings.contactWhatsapp },
    settings?.contactLinkedin && { label: "LinkedIn", url: settings.contactLinkedin },
    ...otherLinks,
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <footer id="contact" className="border-t border-mist bg-cloud">
      <div className="container-x flex flex-col gap-10 py-16 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-semibold tracking-tightest">
            Let&rsquo;s make something.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-graphite">
            Available for freelance and collaboration. Reach out through
            whichever channel suits you best.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-3">
          {links.length === 0 && (
            <p className="text-sm text-graphite">Contact details coming soon.</p>
          )}
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target={l.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-sm text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-2 border-t border-mist py-6 text-xs text-graphite md:flex-row">
        <p>
          © {year} {settings?.siteTitle || "ASQAROVGD"}. All rights reserved.
        </p>
        <Link href="/admin/login" className="transition-colors hover:text-ink">
          Admin
        </Link>
      </div>
    </footer>
  );
}
