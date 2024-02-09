import { TweenLite } from "gsap";

export function shopifyImg(url, attrs) {
  var suffix = "";
  if (attrs.width) suffix += attrs.width;
  suffix += "x";
  if (attrs.height) suffix += attrs.height;
  if (suffix === "x") return url;
  return url.replace(/\.(jpg|jpeg|png|gif)/, `_${suffix}.$1`);
}

export function parallaxSpeed(speed = 0) {
  const distance = `(${speed}*vh)`;
  const padding = `${-1 * speed}*vh`;
  return `(vh) 0, (-elh${(speed > 0 ? "" : "+") + padding}) ${distance}`;
}

export function parallaxY(top, bottom = 0) {
  return `(vh) ${bottom}, (-elh${(top < 0 ? "+" : "-") +
    Math.abs(top)}) ${top}`;
}

export const parallaxBreakpoints = [
  ["xs", 568],
  ["s", 720],
  ["m", 960],
  ["l", 1200]
];

export function getBreakPoint(width) {
  let bp = "d";
  for (let i = 0; i < parallaxBreakpoints.length; i++) {
    if (width < parallaxBreakpoints[i][1]) {
      bp = parallaxBreakpoints[i][0];
      break;
    }
  }
  return bp;
}

export function parseParallaxValue(val, bp) {
  // Run through the list of breakpoints starting with smallest
  let matched_bp = false;
  for (let i = 0; i < parallaxBreakpoints.length; i++) {
    // Skip all of the lower breakpoints
    if (!matched_bp && parallaxBreakpoints[i][0] !== bp) continue;
    // Mark when we've hit the breakpoint
    if (!matched_bp && parallaxBreakpoints[i][0] === bp) matched_bp = true;
    // Try matching the value
    // This loop will return the matching breakpoint or its first larger defined parent
    const re = new RegExp(
      parallaxBreakpoints[i][0] + ":\\s*([0-9\\-.][^\\s]*)"
    );
    const match = re.exec(val);
    if (match) return match[1];
  }

  // Try looking for the default value when the breakpoint
  // does not exist or is not specified
  const re = /^\s*([0-9\-.][^\s]*)/;
  const match = re.exec(val);
  if (match) return match[1];

  // Finally just return the string
  return val;
}

// Detect WebKit touch
export function isTouch() {
  return !!(
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
  );
}

export function getRuleByBreakpoint(rule, bp) {
  if (!rule || !rule.d) return undefined;
  let matched_bp = false;
  for (let i = 0; i < parallaxBreakpoints.length; i++) {
    // Skip all of the lower breakpoints
    if (!matched_bp && parallaxBreakpoints[i][0] !== bp) continue;
    // Mark when we've hit the breakpoint
    if (!matched_bp && parallaxBreakpoints[i][0] === bp) matched_bp = true;
    // Check if the breakpoint rule exists
    if (rule[parallaxBreakpoints[i][0]]) return rule[parallaxBreakpoints[i][0]];
  }
  return rule.d;
}

const SCROLL_POS = {
  x: 0,
  y: 0
};

export function scrollTo(el, offset = 0, duration = 0.75) {
  let to = 0;
  let maxScroll = 1500;
  // Compute target scroll
  to = el.getBoundingClientRect().top + window.pageYOffset + offset;
  // Clean Up Previous Scrolls
  TweenLite.killTweensOf(SCROLL_POS);
  if (Math.abs(to - window.pageYOffset) > maxScroll) {
    window.scrollTo(0, to + Math.sign(window.pageYOffset - to) * maxScroll);
  }
  SCROLL_POS.y = window.pageYOffset;
  // Animate Scroll
  TweenLite.to(SCROLL_POS, duration, {
    y: to,
    ease: Quart.easeOut,
    onUpdate() {
      window.scrollTo(SCROLL_POS.x, SCROLL_POS.y);
    }
  });
}
