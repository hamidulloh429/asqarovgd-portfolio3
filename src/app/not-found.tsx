import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tightest">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-graphite">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ember"
      >
        Back to home
      </Link>
    </div>
  );
}
