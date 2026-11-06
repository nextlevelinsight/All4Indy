# The Open Shelf: is the business plausible?

Short answer: yes as a small, slow, community-led ebook marketplace. Not as a fast-growth play. This is reasoning, not market research. No market figures were verified and none are on the page.

## The model (updated)
Two ways for an author to list, their choice:
1. **Sell through us.** We host the book page, take payment, deliver the ebook file, then pay the author the larger share. We keep a small cut and market the book. No author website needed.
2. **Send readers to you.** The author already has a store. We link to it and earn a small referral.

**The differentiator:** with the buyer's opt-in at checkout, the author receives the buyer's email. They own that list. Most marketplaces keep it.

## What makes it work
- **Authors get what retail shelves withhold:** the larger share and the reader relationship.
- **Curation and marketing are the product.** A trusted small shelf plus real launch help is what the cut pays for.
- **Low overhead:** ebooks have no inventory or shipping.

## The hard parts
1. **Being the seller.** Collecting money for others means payment processing, refunds, chargebacks, and **sales tax/VAT on digital goods**, which varies by country and state. A merchant-of-record service (for example Paddle or Lemon Squeezy style providers) or a marketplace-capable processor (for example Stripe Connect) can handle much of this. Pricing, availability and terms need checking before you choose. Get accounting advice.
2. **Payouts to authors.** Split payments, minimum payout thresholds, tax forms for authors, and currency. Connect-style payout tools exist; verify fit and fees.
3. **Email sharing consent.** Share a buyer's email only with an explicit, unticked opt-in at checkout, clear wording, and a way for the author to honour unsubscribes. Privacy rules (GDPR, CAN-SPAM, and similar) apply, and the author becomes responsible for how they use the list. Needs legal review. The demo page already shows the opt-in pattern.
4. **Ebook delivery and piracy.** Deliver a download link by email; decide on watermarking versus plain files. DRM annoys readers and is easy to remove, so many indie sellers skip it.
5. **Content responsibility.** As seller you need a content policy, takedown process and author agreement (rights warranty, refunds, payout terms).
6. **Cold start.** Few readers means few sales means few authors. Start in one niche where you can bring readers yourself.

## Growth path
1. **Hand-run pilot.** 10 to 20 authors in one genre, manual listings, payment through a provider's hosted checkout, payouts done monthly by hand. Goal: first paid, delivered, paid-out sale.
2. **Make the promise real.** Author dashboard showing sales and opted-in emails; launch-week support for each book.
3. **Marketing engine.** Genre shelves, a reader newsletter, seasonal events, author takeovers.
4. **More revenue lines (optional):** featured slots, a premium author tier, sponsorship in the newsletter.
5. **Automate payouts and tax handling.**

## Decisions you still own
- The exact split. The site says only "the larger share" and "a small cut". Pick a real number and write it into the author agreement.
- Referral commission for the link-out option.
- Which payments and tax provider to use.
- Which niche to start with, and what you personally bring to it.
- Whether to offer exclusivity or let authors sell elsewhere too.

## Verdict
Plausible as a lean experiment, and more differentiated than the referral-only version, but with real compliance and payments work. First milestone: one complete sale cycle (pay, deliver, payout, opted-in email) with a handful of authors.

---

# Part 2: fees, money flow, transparency, delivery, audio, quality

Competitor numbers below are from general knowledge and are **unverified**. A research agent is verifying them into `COMPETITORS.md`; trust that file over this one. Dollar examples are illustrations using an assumed card fee of about 2.9% + $0.30.

## 1. Is it plausible?
Yes, as a narrow, curated, author-first shop. The differentiators are real: the author gets the buyer's email (opt-in), a large share, files the reader owns for life, and genuine marketing help. The risk is economics, not demand: ebooks are cheap, so a small cut of each sale is tiny. Illustration: 1,000 sales a month at a $6 average and a 10% fee is about $600 a month before costs. It only becomes a business with thousands of active authors, or extra revenue lines (featured slots, a paid author tier, sponsored newsletter spots). Treat it as a lean experiment until a pilot proves authors can sell here.

## 2. What fee is competitive?
**Sell-through (we take payment and deliver):**
- Anchor: Amazon KDP pays roughly 70% inside a price band and 35% outside it (verify). Direct-sale tools (Gumroad, Payhip and similar) take roughly 5 to 10% plus card fees (verify).
- Suggested: **10% platform fee plus card processing passed through**, so the author nets about 81% on a $5 book and 84% on a $10 book. Illustration at $5: card fee $0.45, our fee $0.50, author $4.05.
- Founding-author offer: 5% for the first year to seed the shelf.
- Weak point: the fixed per-transaction card fee hurts low prices. Encourage bundles, series boxes and a sensible price floor.
- To fund marketing, 10% is thin at low prices. 12 to 15% would still beat most retailers but erodes the pitch. Decide once the pilot shows real marketing costs.

**Link-out (author sells on their own site, including physical books):**
We cannot see their sales, so a percentage needs a way to verify it. Options, strongest first:
1. **Tracked referral with proof.** A unique link plus coupon code or order webhook (Shopify, WooCommerce, Stripe) so the sale is attributable. Fee about 5 to 8%. Billed monthly from verified orders.
2. **Monthly statement on trust.** The author reports referred orders; we invoice. Cheap to build, but expect leakage and disputes. Fine for the pilot only.
3. **Flat listing fee or subscription** instead of a percentage (for example a small monthly fee for a listing and marketing slot). Nothing to verify, and predictable for both sides. Probably the honest answer for physical books.

Recommendation: ebooks earn a percentage; physical link-outs start as free discovery or a flat listing fee, and move to tracked-referral percentages only where an integration can prove the sale.

## 3. How money is collected and distributed
- **Collect:** one payment account for the platform. Use a marketplace payments product (Stripe Connect style) so each author has a connected, identity-verified payout account.
- **Seller of record decision:** if we are the seller, we owe sales tax and VAT on digital goods. Either use a tax-calculation service, or a merchant-of-record provider that takes on tax (usually for a higher fee). Decide this first; it drives everything else. Get an accountant.
- **Ledger:** every sale becomes a record: gross, tax, card fee, our fee, author net, status. Statuses: pending, available, paid, refunded.
- **Holds:** keep funds pending for a refund window (for example 14 to 30 days) before they become payable.
- **Payouts:** monthly, with a small minimum, to start. Faster payouts later.
- **Refunds and chargebacks:** the sale reverses against the author's balance. Write that into the author agreement.
- **Tax paperwork:** collect tax forms from authors; US authors earning over thresholds need year-end reporting (confirm requirements with an accountant).
- **Physical link-out money:** the author keeps 100% of the sale on their own site. We invoice the referral or flat fee monthly, or net it against ebook earnings in the same statement. A month-end statement that shows both is fine and simple, provided the numbers are verifiable.

## 4. Transparency and the seller portal
Build this as a product feature, not a report:
- **Live sales feed** from payment webhooks: each sale with gross, tax, card fee, our fee, and net, updated within minutes.
- **Balance view:** pending, available, paid out; next payout date.
- **Reader list:** opted-in emails only, with the consent timestamp and wording, CSV export, and unsubscribes that sync back.
- **Link-out stats:** clicks, tracked orders, fee owed.
- **Statements:** monthly downloadable PDF and CSV; payout history.
- **Public fee page** and the per-sale split shown to the reader at checkout (the boarding pass already does this).
Real-time to the minute is realistic for ebook sales; link-out is only as fresh as its integration.

## 5. Delivering ebooks the reader keeps for life
- **Format:** DRM-free EPUB as the master. It works in Apple Books, Kobo, most reader apps, and Kindle via its send-to-Kindle route (verify current support). Offer PDF as an option.
- **Delivery:** an account library on the site where purchases stay forever and can be re-downloaded, plus an emailed link at purchase.
- **No app needed at launch.** Building a reader app is expensive and competes with free apps readers already like. Later, an optional web reader.
- **"Yours for life" has to be a promise you can keep:** put a perpetual-download right in the reader terms and the author agreement; commit that if the shop closes, buyers get a download window and an export of their files. That is the difference from "rented" books, so write it in plain words.
- **Piracy:** skip DRM. Use invisible per-buyer watermarking as a deterrent and a takedown process.

## 6. Audiobooks
Same principle works: DRM-free M4B or MP3 files, kept in the buyer's library. Extras:
- Files are large, so you need cloud storage and a CDN, and bandwidth costs scale with downloads.
- A private podcast-style feed per buyer lets them play it in any podcast app with no app of ours.
- Production is expensive for indie authors, and exclusivity deals with big audio retailers may conflict. Treat it as **phase 2**, after ebooks work.

## 7. Keeping out slop
Policing grammar is too far: it is subjective, expensive, and excludes distinctive voices. Gate on **trust and presentation**, and curate for **quality** separately:
1. **Verified authors:** identity and payout verification. This alone filters most spam.
2. **Listing basics:** a free sample chapter, a working EPUB, a real cover, complete metadata, a minimum length, duplicate and plagiarism checks, and an AI-use disclosure.
3. **New-account limits:** a cap on titles per week and a hold on the first payout.
4. **Reader signals:** reviews only from verified buyers; auto-flag high refund rates or complaints.
5. **Two tiers:** *open listing* (any verified author, findable by search) and the *curated shelf* (human-picked, featured, gets marketing help). The curated tier is where quality is enforced, using a short rubric (readable, edited well enough, honest cover and blurb).
Do not rely on AI-text detectors; they are unreliable and will wrongly flag real authors.

## 8. Decisions to make next
- Seller of record or merchant of record, and the payments provider.
- The fee: start point 10% plus card fees, 5% for founding authors.
- Physical link-out: flat fee, tracked percentage, or free discovery.
- Refund window and payout schedule.
- A written author agreement and reader terms (get a lawyer to check, especially the lifetime-access and email-sharing wording).
- Pilot: 10 to 20 authors in one genre, one full cycle of pay, deliver, payout.

---

## Update: newsletter link plus our own list (replaces author email sharing)
- **Authors** do not receive buyer emails. Every buyer sees the author's own newsletter sign-up link (opens in a new tab on the author's page), so consent and unsubscribes sit with the author's own email tool.
- **We** keep the buyer's email for the receipt and library. An unticked, optional checkbox adds them to The Open Shelf's newsletter and the "authors you've bought from" email (author site, newsletter link, paperback link). Needs one-click unsubscribe and a stored record of when and to what wording they agreed.
- Seller portal: replace the "opted-in emails" list with newsletter-link click counts.
- Open point: authors may dislike us holding the list. Say so plainly in the author agreement, always show the author's link to every buyer, and have a lawyer review the consent wording.

---

## Merchant of record vs doing it yourself (as of Nov 2026)
Fees below come from third-party comparison sites and competitor blogs, not the providers' own pages. Confirm directly. This is not tax advice; confirm the tax points with an accountant.

**Merchant of record (MoR) reported costs**
- Paddle: 5% + $0.50 (some sources say custom pricing). Lemon Squeezy: 5% + $0.50, with extras for international, PayPal and subscriptions. Stripe Managed Payments (preview): about 6.4% + $0.30. Polar: 4% + $0.40 per its own page, other sources say 5% + $0.50. FastSpring: about 5.9% + $0.95, by quote.
- The MoR fee replaces the card fee. On a $5 book that is about $0.75 (15%) against about $0.45 (9%) with plain Stripe. With our 10% on top, the author nets about 75% at $5 and about 78% at $6.99, against about 81% and 80% without an MoR.
- Unconfirmed: whether these providers accept a marketplace paying many third-party authors. Several were built for software. Ask their sales teams before committing.

**Doing it ourselves**
- Plotted Balance (per its spec) covers rate lookup at sale time with a saved snapshot, per-state registration and filing settings, taxability by category, a nexus monitor with 70/90/100% alerts, return worksheets and a compliance calendar. It tracks and reports; it does not register or file.
- Still needed: an address-level rate service, state registrations and returns (or a filing service), and a decision on origin vs destination sourcing per state.
- Many states use a transaction-count threshold as well as a dollar one (commonly 200 sales). At low ebook prices the count is hit first, so expect to register in more states than the dollar totals suggest.
- As a marketplace we probably collect and remit on authors' sales too (marketplace-facilitator rules). Confirm.
- EU/UK buyers carry VAT from the first digital sale for non-EU sellers (to confirm). Block those countries at launch.

**Recommendation:** pilot US-only with an MoR so nothing needs registering first; move to Stripe plus a rate service plus a filing service, with Plotted Balance as the nexus tracker and records, once volume makes the 5% + $0.50 hurt. Add other countries one at a time.
