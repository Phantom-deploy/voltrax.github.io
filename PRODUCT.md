# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Riders and prospective buyers in Panama who reach the site on a phone, plus people who research it from a computer. The site must adapt cleanly to every screen size. Visitors are browsing electric motorcycles, checking specs and stock, and deciding whether to contact the dealership. Connectivity is often weak or slow.

## Product Purpose

Marketing and catalog site for Voltrax EV, a premium electric-motorcycle dealership in Rada Plaza, Costa del Este, Panama City. It shows in-stock bikes with official specs, parts and accessories, the showroom, and the special-order import program, and moves visitors to a WhatsApp conversation, which is the primary sales channel. Success is a visitor who finds the right bike or part and starts a chat.

## Positioning

A full EV ecosystem in one place: bikes (E-Ride Pro, Sur-Ron, Yozma, Valtinsu, EBox), parts and accessories, import on special order, and direct WhatsApp support.

## Operating Context

Sales and support happen through WhatsApp (+507 6013-9903). The contact form hands off to WhatsApp or mailto; there is no backend. Prices are quoted on request and are not published. Bilingual: Spanish is the default, English the alternate.

## Capabilities and Constraints

- Static site on GitHub Pages: no build step, framework, package manager or third-party runtime requests (fonts are self-hosted).
- Content lives in `assets/js/data.js` (bikes, parts, showroom, brands); copy in `assets/js/i18n.js`. See `PROJECT.md` for architecture.
- Every user-visible string needs both `es` and `en`.
- Light and dark themes; all colors come from CSS custom properties.
- Priorities from `CLAUDE.md`, in order: fast, lightweight, responsive, reliable on weak/slow Wi-Fi, visually polished. Visual quality and animation are the acceptable tradeoffs for extra weight; everything else earns its bytes.

## Brand Commitments

Name: Voltrax EV. Existing logo assets in `assets/img/brand/` (horizontal lockup and round logo) are the brand identity.

## Evidence on Hand

Real showroom photos, official manufacturer specs (each bike links its source), and real stock counts in `assets/js/data.js`. Absent and not to be fabricated: published prices, testimonials, customer counts, delivery times (these vary by manufacturer).

## Product Principles

1. Get the visitor to a WhatsApp conversation with as little friction as possible.
2. Specs are verifiable: every figure traces to the official manufacturer source.
3. Speed and resilience on a weak phone connection outrank decoration.
4. Every screen size and both languages are first-class, not afterthoughts.
5. Show what is truly in stock and what is import-only; never imply otherwise.
