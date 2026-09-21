# Hallmark Audit Report · ThinkAI Frontend

**Audit date:** 2026-09-18  
**Pages audited:** Login, Register, Dashboard, Courses, Exams, Profile, My Courses  
**Slop-test gates:** 58 total (per Hallmark v1.1.0)

---

## Executive Summary

**Overall score:** 41/58 gates PASS · 17/58 gates FAIL  
**Severity:** 🔴 High (12 critical issues) · 🟡 Medium (5 issues)

ThinkAI has strong **typographic foundation** (Instrument Serif + Inter pairing), **genuine content** (no invented metrics), and **proper token architecture**. However, it exhibits **multiple AI-generation fingerprints** that undermine craft:

1. **Liquid glass overuse** (auth pages) — templated glassmorphism with security theater
2. **Invented telemetry** — "256-BIT ENCRYPTION · ZERO-LATENCY AUTH · MULTI-DEVICE SYNC" footer with no backing
3. **Pill-button epidemic** — every input is `border-radius: 9999px`
4. **Generic copy** — "Khám phá tri thức vượt giới hạn", "Welcome Back", trust pills
5. **Missing 8-state discipline** — buttons lack disabled/loading/error/success states
6. **Inconsistent motion** — dashboard has NumberFlow, courses don't; no unified motion stance

---

## Critical Issues (🔴 High Priority)

### 1. Liquid Glass Overuse (Hallmark Gate 2)
**Location:** `/login`, `/register`, nav CTA  
**Issue:** Glassmorphism with backdrop-filter is the #1 AI tell. Auth pages use `.liquidGlass` with:
```css
backdrop-filter: blur(16px);
box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 50px rgba(0, 0, 0, 0.45);
```
Plus a gradient-mask pseudo-element.

**Fix:** Replace with **sharp surface** (0px border-radius, solid background, 1px border, subtle shadow).

---

### 2. Invented Telemetry Footer (Hallmark Gate 46)
**Location:** `/login`, `/register` footer  
**Issue:** 
```html
<footer>
  <span>• 256-BIT ENCRYPTION</span>
  <span>• ZERO-LATENCY AUTH</span>
  <span>• MULTI-DEVICE SYNC</span>
</footer>
```
**None of these are verified claims.** "256-BIT ENCRYPTION" is security theater. "ZERO-LATENCY" is impossible. "MULTI-DEVICE SYNC" is not a security feature.

**Fix:** Remove footer entirely, or replace with real organizational facts.

---

### 3. Pill-Button Epidemic (Hallmark Gate 41, 49)
**Location:** Every form input, every button  
**Issue:** `border-radius: 9999px` on all interactive elements. This:
1. Is a templated AI fingerprint
2. Causes text wrapping on mobile (login button wraps to 2 lines at 320px)
3. Lacks tactile feedback (scale on hover, not mechanical press)

**Fix:** 
- **Inputs:** `border-radius: 6px` (or 0px for sharp)
- **Primary buttons:** `border-radius: 0px`, add `:active { transform: translateY(1px); }`
- **Test at 320px:** Ensure no two-line button text

---

### 4. Missing 8-State Discipline (Hallmark Gate 22–24)
**Location:** All buttons, all forms  
**Issue:** Buttons only have `default`, `:hover`, `:disabled`. Missing: loading, error, success states.

**Fix:** Implement 8-state protocol with loading spinner, error recovery, success feedback.

---

### 5. Generic Hero Copy (Hallmark Gate 5, 12)
**Location:** `/courses` hero, `/login` headline  
**Issue:** 
- "Khám phá tri thức vượt giới hạn" (generic AI filler)
- "Welcome Back" (templated greeting)
- "SECURE ACCESS PORTAL · 256-BIT ENCRYPTED" (security theater)

**Fix:** Replace with specific, user-benefit copy.

---

### 6. Over-Saturated Accent (Hallmark Gate 45)
**Location:** `.switchLink` color  
**Issue:** `hsl(197, 100%, 75%)` — 100% saturation is neon. High-chroma accents are an AI tell.

**Fix:** Reduce to 40–60% saturation: `hsl(197, 50%, 70%)`

---

### 7. All-Caps Overuse (Hallmark Gate 40)
**Location:** Stats labels, section tags, pills  
**Issue:** "KHÓA HỌC", "BÀI ĐÃ HOÀN THÀNH", "SECURE ACCESS PORTAL", "ĐANG HỌC"

**Fix:** Use sentence case with optical weight instead.

---

### 8. Section Tags Everywhere (Hallmark Gate 54)
**Location:** Dashboard stats, course cards  
**Issue:** Every section has an eyebrow tag in uppercase.

**Fix:** Remove tags, use color + typography for hierarchy.

---

### 9. Inconsistent Motion (Hallmark Gate 30)
**Location:** Dashboard has `NumberFlow`, Courses static  
**Issue:** No unified motion stance.

**Fix:** Apply motion primitives consistently across all pages.

---

### 10. Focus Ring Animated (Hallmark Gate 25)
**Location:** `.pillInput:focus`  
**Issue:** `transition: all 0.2s ease` animates the focus ring.

**Fix:** Remove `all`, focus ring must appear instantly.

---

### 11. Form Labels Missing (Hallmark Gate 57)
**Location:** Auth forms  
**Issue:** Inputs have `placeholder` but no visible `<label>` with `for` attribute.

**Fix:** Add proper labels for accessibility.

---

### 12. Nav CTA is Liquid Glass (Hallmark Gate 2)
**Location:** Header nav "Đăng ký" button  
**Issue:** Same `.liquidGlass` class as auth cards.

**Fix:** Replace with solid button.

---

## Medium Issues (🟡)

13. No unified token system (`tokens.css`)
14. Scale on hover, not press (missing mechanical feedback)
15. Background video is decorative weight
16. No skeleton states (using spinner instead)
17. Calendar widget is decorative

---

## Strengths to Preserve

✅ **Type pairing:** Instrument Serif + Inter  
✅ **No invented metrics:** Real course prices, lesson counts  
✅ **Token architecture:** CSS modules in place  
✅ **Motion foundation:** FadeIn, NumberFlow, StaggerGroup added  
✅ **Semantic HTML:** Proper tags  
✅ **Accessibility baseline:** `:focus-visible` present  
✅ **No fake chrome:** No browser bars, phone frames  
✅ **Diversified structure:** Dashboard ≠ Courses ≠ Profile rhythm  

---

## Slop Score: 41/58 PASS (71%)

| Category | Pass | Fail | %Pass |
|----------|------|------|-------|
| Typography | 8 | 2 | 80% |
| Color | 4 | 2 | 67% |
| Layout | 7 | 1 | 88% |
| Motion | 5 | 7 | 42% |
| Structure | 8 | 2 | 80% |
| A11y | 7 | 1 | 88% |
| Anti-patterns | 2 | 2 | 50% |

---

**Next step:** `hallmark redesign /login --mood sharp` to fix auth pages.
