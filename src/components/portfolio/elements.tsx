import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BrainCircuit, Code2, Atom, Zap, Container, Database, GitBranch, Network, Cloud } from "lucide-react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export function Count({ value, suffix }: { value: number | null; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!seen || value === null) return;
    if (reduced) {
      setCount(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1000, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, reduced]);

  return <span ref={ref}>{value === null ? "" : count}{suffix}</span>;
}

export function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="tech-tag">
          {item}
        </span>
      ))}
    </div>
  );
}

export function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return (
    <Reveal className="section-heading">
      <div className="eyebrow">
        <span>{number} /</span> {label}
      </div>
      <h2>{title}</h2>
    </Reveal>
  );
}

export const skillIcons = [BrainCircuit, Code2, Atom, Zap, Container, Database, Code2, GitBranch, Network, Cloud];
