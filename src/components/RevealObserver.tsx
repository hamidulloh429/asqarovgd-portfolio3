"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const attach = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => {
        observer.observe(el);
      });
    };

    attach();

    // Re-scan on DOM mutations (e.g. client-rendered project grids).
    const mo = new MutationObserver(() => attach());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
