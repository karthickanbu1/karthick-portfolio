import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import "./RubberSegment.css";

type SegmentItem = string | { value: string; label: ReactNode; icon?: ReactNode };
type Slot = { l: number; r: number };
type PointerSample = [time: number, x: number];
type DragState = {
  id: number;
  x0: number;
  slot: number;
  onThumb: boolean;
  live: boolean;
  offset: number;
  w: number;
  hist: PointerSample[];
};
type SegmentSize = "sm" | "md" | "lg";

type RubberSegmentProps = {
  items: SegmentItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  trackColor?: string;
  thumbColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: SegmentSize;
  radius?: number;
  inset?: number;
  equalSlots?: boolean;
  stretch?: number;
  squash?: number;
  speed?: number;
  glide?: number;
  draggable?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING_UI = { type: "spring" as const, duration: 0.3, bounce: 0 };
const SPRING_MOMENTUM = { type: "spring" as const, duration: 0.4, bounce: 0.2 };
const SPRING_RELAX = { type: "spring" as const, duration: 0.16, bounce: 0 };
const DILATE = 0.19;
const HANDOFF = 0.15;
const FLICK = 110;
const MAX_VELOCITY = 2000;
const DEADZONE = 4;
const SLOP = 10;
const RUBBER = 0.55;
const SIZES: Record<SegmentSize, { height: number; font: number; pad: number; min: number }> = {
  sm: { height: 28, font: 12, pad: 10, min: 36 },
  md: { height: 36, font: 13, pad: 14, min: 44 },
  lg: { height: 44, font: 14, pad: 18, min: 48 },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const rubber = (over: number, dim: number) =>
  (over * dim * RUBBER) / (dim + RUBBER * Math.abs(over));
const project = (velocity: number, glide: number) => {
  const decay = 1 - 0.1 * Math.pow(0.05, glide / 100);
  return ((velocity / 1000) * decay) / (1 - decay);
};
const velocityOf = (history: PointerSample[], now: number) => {
  const recent = history.filter(([time]) => now - time <= 100);
  if (recent.length < 2) return 0;
  const [startTime, startX] = recent[0]!;
  const [endTime, endX] = recent[recent.length - 1]!;
  return endTime - startTime >= 8 ? ((endX - startX) / (endTime - startTime)) * 1000 : 0;
};
const nearestSlot = (slots: Slot[], x: number) => {
  let best = 0;
  for (let i = 1; i < slots.length; i++) {
    if (
      Math.abs((slots[i]!.l + slots[i]!.r) / 2 - x) <
      Math.abs((slots[best]!.l + slots[best]!.r) / 2 - x)
    )
      best = i;
  }
  return best;
};

export default function RubberSegment({
  items,
  value,
  defaultValue,
  onChange,
  trackColor = "#27272a",
  thumbColor = "#fafafa",
  textColor = "#fafafa",
  activeTextColor = "#18181b",
  size = "md",
  radius = 10,
  inset = 3,
  equalSlots = true,
  stretch = 100,
  squash = 3,
  speed = 1,
  glide = 75,
  draggable = true,
  disabled = false,
  className = "",
  "aria-label": ariaLabel = "Segmented control",
}: RubberSegmentProps) {
  const list = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );
  const listCount = list.length;
  const [inner, setInner] = useState(defaultValue ?? list[0]?.value ?? "");
  const current = value !== undefined ? value : inner;
  const foundIndex = list.findIndex((item) => item.value === current);
  const index = foundIndex >= 0 ? foundIndex : 0;
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const slots = useRef<Slot[]>([]);
  const box = useRef<DOMRect | null>(null);
  const committed = useRef(index);
  const handoff = useRef<number | undefined>(undefined);
  const drag = useRef<DragState | null>(null);
  const generation = useRef(0);
  const edgeL = useMotionValue(0);
  const edgeR = useMotionValue(0);
  const innerW = useMotionValue(0);
  const thumbRadius = Math.max(0, radius - inset);
  const clipPath = useTransform(
    () =>
      `inset(0 ${Math.max(0, innerW.get() - edgeR.get())}px 0 ${Math.max(0, edgeL.get())}px round ${thumbRadius}px)`,
  );
  const duration = (seconds: number) => seconds / Math.max(speed, 0.01);

  const jumpTo = useCallback(
    (slotIndex: number) => {
      const slot = slots.current[slotIndex];
      if (!slot) return;
      window.clearTimeout(handoff.current);
      generation.current += 1;
      edgeL.jump(slot.l);
      edgeR.jump(slot.r);
    },
    [edgeL, edgeR],
  );

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || listCount === 0) return;
    const rect = track.getBoundingClientRect();
    box.current = rect;
    slots.current = Array.from({ length: listCount }, (_, i) => {
      const element = itemRefs.current[i];
      if (!element) return { l: 0, r: 0 };
      const itemRect = element.getBoundingClientRect();
      return { l: itemRect.left - rect.left - inset, r: itemRect.right - rect.left - inset };
    });
    innerW.set(rect.width - inset * 2);
    jumpTo(committed.current);
  }, [inset, innerW, jumpTo, listCount]);

  const listKey = list.map((item) => item.value).join("|");
  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (typeof document !== "undefined" && document.fonts) void document.fonts.ready.then(measure);
    return () => observer.disconnect();
  }, [equalSlots, listKey, measure, size]);

  useEffect(() => {
    if (!drag.current && committed.current !== index) {
      committed.current = index;
      jumpTo(index);
    }
  });

  useEffect(
    () => () => {
      window.clearTimeout(handoff.current);
      edgeL.stop();
      edgeR.stop();
    },
    [edgeL, edgeR],
  );

  const commit = (slotIndex: number) => {
    const item = list[slotIndex];
    if (!item) return;
    committed.current = slotIndex;
    if (slotIndex === index) return;
    if (value === undefined) setInner(item.value);
    onChange?.(item.value, slotIndex);
  };

  const land = (
    slotIndex: number,
    velocity: number | null,
    flick: boolean,
    withSquash: boolean,
  ) => {
    const slot = slots.current[slotIndex];
    if (!slot) return;
    const id = ++generation.current;
    const direction = Math.sign((slot.l + slot.r) / 2 - (edgeL.get() + edgeR.get()) / 2) || 1;
    const [lead, leadTo, trail, trailTo] =
      direction > 0 ? [edgeR, slot.r, edgeL, slot.l] : [edgeL, slot.l, edgeR, slot.r];
    const velocityFor = (motionValue: typeof edgeL) =>
      clamp(velocity === null ? motionValue.getVelocity() : velocity, -MAX_VELOCITY, MAX_VELOCITY);
    animate(lead, leadTo, {
      ...(flick ? SPRING_MOMENTUM : SPRING_UI),
      duration: duration(flick ? 0.4 : 0.3),
      velocity: velocityFor(lead),
    });
    const trailVelocity = velocityFor(trail);
    if (!withSquash || squash <= 0) {
      animate(trail, trailTo, { ...SPRING_UI, duration: duration(0.3), velocity: trailVelocity });
      return;
    }
    void animate(trail, trailTo + direction * squash, {
      ...SPRING_UI,
      duration: duration(0.3),
      velocity: trailVelocity,
    }).then(() => {
      if (generation.current === id)
        animate(trail, trailTo, { ...SPRING_RELAX, duration: duration(0.16) });
    });
  };

  const travel = (from: number, to: number) => {
    const start = slots.current[from];
    const end = slots.current[to];
    if (!start || !end) return;
    window.clearTimeout(handoff.current);
    generation.current += 1;
    if (reduce) {
      edgeL.jump(end.l);
      edgeR.jump(end.r);
      return;
    }
    const amount = stretch / 100;
    const tween = { duration: duration(DILATE), ease: EASE_OUT };
    animate(edgeL, end.l + (Math.min(start.l, end.l) - end.l) * amount, tween);
    animate(edgeR, end.r + (Math.max(start.r, end.r) - end.r) * amount, tween);
    handoff.current = window.setTimeout(
      () => land(to, null, false, true),
      duration(HANDOFF) * 1000,
    );
  };

  const localX = (event: ReactPointerEvent<HTMLElement>) =>
    event.clientX - (box.current ? box.current.left : 0) - inset;

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, slotIndex: number) => {
    if (disabled || drag.current || event.button !== 0) return;
    box.current = trackRef.current?.getBoundingClientRect() ?? null;
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = localX(event);
    const onThumb = draggable && x >= edgeL.get() && x <= edgeR.get();
    drag.current = {
      id: event.pointerId,
      x0: x,
      slot: slotIndex,
      onThumb,
      live: false,
      offset: 0,
      w: 0,
      hist: [[event.timeStamp, x]],
    };
    if (onThumb) {
      window.clearTimeout(handoff.current);
      generation.current += 1;
      edgeL.stop();
      edgeR.stop();
    } else if (!reduce) {
      event.currentTarget.dataset["pressed"] = "";
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || event.pointerId !== state.id || !state.onThumb) return;
    const x = localX(event);
    state.hist.push([event.timeStamp, x]);
    if (state.hist.length > 8) state.hist.shift();
    if (!state.live) {
      if (Math.abs(x - state.x0) < DEADZONE) return;
      state.live = true;
      state.offset = x - edgeL.get();
      state.w = edgeR.get() - edgeL.get();
      if (trackRef.current) trackRef.current.dataset["held"] = "";
    }
    const width = innerW.get();
    const left = x - state.offset;
    const maxLeft = width - state.w;
    if (reduce) {
      const clampedLeft = clamp(left, 0, maxLeft);
      edgeL.set(clampedLeft);
      edgeR.set(clampedLeft + state.w);
    } else if (left < 0) {
      edgeL.set(0);
      edgeR.set(state.w - rubber(-left, state.w));
    } else if (left > maxLeft) {
      edgeR.set(width);
      edgeL.set(maxLeft + rubber(left - maxLeft, state.w));
    } else {
      edgeL.set(left);
      edgeR.set(left + state.w);
    }
  };

  const release = () => {
    const state = drag.current;
    drag.current = null;
    if (trackRef.current) delete trackRef.current.dataset["held"];
    if (state) {
      const element = itemRefs.current[state.slot];
      if (element) delete element.dataset["pressed"];
    }
    return state;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || event.pointerId !== state.id) return;
    release();
    const x = localX(event);
    if (!state.live) {
      if (Math.abs(x - state.x0) <= SLOP && state.slot !== committed.current) {
        const from = committed.current;
        commit(state.slot);
        travel(from, state.slot);
      }
      return;
    }
    const velocity = velocityOf(state.hist, event.timeStamp);
    const flick = Math.abs(velocity) > FLICK;
    let destination = nearestSlot(
      slots.current,
      (edgeL.get() + edgeR.get()) / 2 + project(velocity, glide),
    );
    if (flick && destination === committed.current) {
      destination = clamp(destination + Math.sign(velocity), 0, list.length - 1);
    }
    commit(destination);
    if (reduce) jumpTo(destination);
    else land(destination, velocity, flick, flick);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || event.pointerId !== state.id) return;
    release();
    if (!state.live) return;
    if (reduce) jumpTo(committed.current);
    else land(committed.current, null, false, false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || list.length === 0) return;
    const last = list.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(last, index + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    if (next === index) return;
    commit(next);
    jumpTo(next);
    itemRefs.current[next]?.focus();
  };

  const preset = SIZES[size] ?? SIZES.md;
  const styles = {
    "--rs-track": trackColor,
    "--rs-thumb": thumbColor,
    "--rs-ink": textColor,
    "--rs-ink-active": activeTextColor,
    "--rs-radius": `${radius}px`,
    "--rs-inset": `${inset}px`,
    "--rs-thumb-radius": `${thumbRadius}px`,
    "--rs-h": `${preset.height}px`,
    "--rs-font": `${preset.font}px`,
    "--rs-pad": `${preset.pad}px`,
    "--rs-min": `${preset.min}px`,
  } as CSSProperties;

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-equal={equalSlots ? "" : undefined}
      data-draggable={draggable && !disabled ? "" : undefined}
      className={`rubber-segment${className ? ` ${className}` : ""}`}
      style={styles}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerCancel}
    >
      {list.map((item, i) => (
        <button
          key={item.value}
          ref={(element) => {
            itemRefs.current[i] = element;
          }}
          type="button"
          role="radio"
          aria-checked={i === index}
          tabIndex={i === index ? 0 : -1}
          disabled={disabled}
          className="rubber-segment__item"
          onPointerDown={(event) => handlePointerDown(event, i)}
          onClick={(event) => {
            if (event.detail !== 0 || i === index) return;
            const from = committed.current;
            commit(i);
            travel(from, i);
          }}
          onKeyDown={handleKeyDown}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
      {list.length > 0 && (
        <motion.div className="rubber-segment__thumb" aria-hidden="true" style={{ clipPath }}>
          {list.map((item) => (
            <span key={item.value} className="rubber-segment__item rubber-segment__copy">
              {item.icon}
              {item.label}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
