# Open Shelf to Plotted Balance integration (draft spec)

Status: plan, not built. Based on a skim of the Plotted Balance spec (`AccountingSoftware/SPEC.md`); verify against the code before building.

## Goal
Everything a seller sees in the Open Shelf portal can be imported into Plotted Balance, split by seller, pen name and book, with no re-keying.

## Mapping
| Open Shelf | Plotted Balance |
|---|---|
| Sale | Journal entry: revenue (gross), tax liability, card fee expense, platform fee expense |
| Refund / chargeback | Reversing entry |
| Payout | Bank deposit, matched to the available balance |
| Referral fee invoice | Bill / expense |
| Author identity (pen name) | Book / royalty-source dimension |
| Publisher's internal splits | Plotted Balance royalty and co-author splits (Open Shelf pays the seller only) |

Plotted Balance rule to respect: only its ledger service writes journal entries, so Open Shelf data arrives as events or imports that the ledger service turns into entries.

## Three connection methods (build order)
1. **File export.** Per-sale and monthly statement files (CSV and JSON) in the format below. Imported through Plotted Balance's statement import.
2. **Live feed.** Open Shelf sends signed webhook events to Plotted Balance. New provider `open_shelf` alongside Stripe and PayPal, ingested idempotently by `external_id`.
3. **Connect button.** In the seller portal, "Connect Plotted Balance", with the seller approving access (OAuth style). Revocable at any time.

## Identifiers (permanent, never reused)
`seller_id`, `author_id` (pen name or real name), `book_id`, `sale_id`, `refund_id`, `payout_id`, `invoice_id`. Prefixes make them readable: `sel_`, `aut_`, `bk_`, `sale_`, `ref_`, `pay_`, `inv_`.

## Money rules
Integer cents, plus an ISO currency code. No floats. Every fee on its own field. Negative numbers only on reversal events.

## Sale record (CSV columns and JSON fields)
```
event_id, type, occurred_at (UTC ISO 8601), seller_id, author_id, book_id, sale_id,
currency, gross_cents, tax_cents, card_fee_cents, platform_fee_cents, net_cents,
status (pending|available|paid|refunded), available_on, payout_id, channel (sell_through|link_out)
```
Check: `gross - tax - card_fee - platform_fee = net`.

## Event types (live feed)
`sale.created`, `sale.available`, `sale.refunded`, `payout.paid`, `referral_fee.invoiced`, `referral_fee.paid`.

Each event: `{ id, type, version, occurred_at, seller_id, data: {...} }`.

## Delivery rules
- **Signed:** an HMAC signature header, with a timestamp to block replays.
- **At least once, idempotent:** retried until acknowledged; Plotted Balance ignores an `id` it has already stored.
- **Ordered by `occurred_at`:** the receiver tolerates out-of-order arrival.
- **Backfill:** an endpoint to re-send history from a date, so a new connection starts complete.
- **Versioned:** `version` on every event, so formats can change without breaking old receivers.

## Reports per pen name
Tagging each row with `author_id` and `book_id` lets Plotted Balance report revenue, fees, refunds and referral costs by pen name, by book, and by seller in total.

## Accounting treatment (to confirm with an accountant)
- Revenue recognised at sale (accrual), cash at payout. Funds held for refunds sit as a receivable from Open Shelf.
- Tax: depends on whether Open Shelf is seller of record. If so it collects and remits, and the author's books need not show it; otherwise it is a liability.
- Referral fees are an expense of the seller, billed monthly.

## Also useful: Open Shelf's own books
The company running Open Shelf can run in Plotted Balance as its own entity, fed by the same payment-provider events.

## Privacy and consent
Export only the seller's own data. Reader emails and identities are never included. Connection is opt-in and revocable; keep an audit log of what was sent.

## Open questions
- Exact import path in Plotted Balance (statement import vs a new provider).
- Which chart-of-accounts mapping to apply by default for authors.
- Whether pen names map to "books", "projects", or a new dimension in Plotted Balance.
- Authentication details for the connect flow.

## Sales tax needs (added)
- Each sale record needs the buyer's tax jurisdiction (state at minimum, ZIP/address-level where a rate service is used), `tax_cents` split by jurisdiction, and a flag for who collected it (`tax_collector`: `merchant_of_record` | `open_shelf`).
- Add `tax_category` (`digital_ebook`, `digital_audio`) so Plotted Balance applies per-state taxability.
- Plotted Balance's nexus monitor should count Open Shelf sales by state and transaction count, since transaction-count thresholds will trigger first at low prices.
- If a merchant of record collects the tax, Open Shelf's books record the sale net of that provider's fee and carry no sales-tax liability; if Open Shelf collects, the liability posts to Sales Tax Payable and the return worksheets apply.
- Open question: whether Open Shelf is treated as a marketplace facilitator in each state (it likely collects for its authors).
