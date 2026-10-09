import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import "./MobileStaggeredMenu.css";

type SocialLink = {
  label: string;
  link: string;
};

type MobileStaggeredMenuProps = {
  items: readonly string[];
  socials: readonly SocialLink[];
  activeSection: string;
  onNavigate: (section: string) => void;
};

export default function MobileStaggeredMenu({
  items,
  socials,
  activeSection,
  onNavigate,
}: MobileStaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const layers = Array.from(overlay.querySelectorAll<HTMLElement>(".mobile-menu-layer"));
    const links = Array.from(panel.querySelectorAll<HTMLElement>(".mobile-menu-link"));
    const duration = reducedMotion ? 0.001 : 0.55;

    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(layers, { xPercent: 100 });
    gsap.set(panel, { y: -12, autoAlpha: 0 });

    return () => {
      timelineRef.current?.kill();
      gsap.killTweensOf([overlay, panel, ...layers, ...links]);
    };
  }, [portalTarget, reducedMotion]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;
    if (!open && !wasOpenRef.current) return;
    wasOpenRef.current = open;

    const layers = Array.from(overlay.querySelectorAll<HTMLElement>(".mobile-menu-layer"));
    const links = Array.from(panel.querySelectorAll<HTMLElement>(".mobile-menu-link"));
    const duration = reducedMotion ? 0.001 : 0.55;

    timelineRef.current?.kill();
    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    if (open) {
      timeline
        .set(overlay, { autoAlpha: 1 })
        .to(layers, {
          xPercent: 0,
          duration,
          stagger: reducedMotion ? 0 : 0.07,
          ease: "power4.out",
        })
        .to(
          panel,
          { y: 0, autoAlpha: 1, duration: reducedMotion ? 0.001 : 0.4, ease: "power3.out" },
          "-=0.28",
        )
        .fromTo(
          links,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: reducedMotion ? 0.001 : 0.65,
            stagger: reducedMotion ? 0 : 0.075,
            ease: "power4.out",
          },
          "-=0.16",
        );
      return;
    }

    timeline
      .to(links, {
        yPercent: 35,
        autoAlpha: 0,
        duration: reducedMotion ? 0.001 : 0.18,
        stagger: reducedMotion ? 0 : { each: 0.025, from: "end" },
        ease: "power2.in",
      })
      .to(panel, { y: -10, autoAlpha: 0, duration: reducedMotion ? 0.001 : 0.16 }, "-=0.04")
      .to(
        layers,
        {
          xPercent: 100,
          duration: reducedMotion ? 0.001 : 0.3,
          stagger: reducedMotion ? 0 : 0.045,
          ease: "power3.in",
          onComplete: () => gsap.set(overlay, { autoAlpha: 0 }),
        },
        "-=0.08",
      );
  }, [open, portalTarget, reducedMotion]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        ref={toggleRef}
        className="mobile-menu-button"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-staggered-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {portalTarget &&
        createPortal(
          <div ref={overlayRef} className="mobile-menu-overlay" aria-hidden={!open}>
            <div className="mobile-menu-layers" aria-hidden="true">
              <span className="mobile-menu-layer mobile-menu-layer-accent" />
              <span className="mobile-menu-layer mobile-menu-layer-secondary" />
              <span className="mobile-menu-layer mobile-menu-layer-background" />
            </div>
            <nav
              id="mobile-staggered-menu"
              ref={panelRef}
              className="mobile-menu-panel"
              aria-label="Mobile navigation"
              inert={!open}
            >
              <ol className="mobile-menu-list">
                {items.map((item, index) => {
                  const section = item.toLowerCase();
                  return (
                    <li key={section}>
                      <a
                        className="mobile-menu-link"
                        href={`#${section}`}
                        aria-current={activeSection === section ? "location" : undefined}
                        onClick={() => {
                          onNavigate(section);
                          closeMenu();
                        }}
                      >
                        <span>{item}</span>
                        <span className="mobile-menu-number" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ol>
              {socials.length > 0 && (
                <div className="mobile-menu-socials">
                  <p>Find me online</p>
                  <ul>
                    {socials.map((social) => (
                      <li key={social.label}>
                        <a href={social.link} target="_blank" rel="noreferrer">
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </nav>
          </div>,
          portalTarget,
        )}
    </>
  );
}
