# Marmot Construction — Concrete Pour Tracker

An iPhone-friendly, installable Progressive Web App (PWA) for foremen to report daily concrete pours.

## What it does

- Pour date, foreman, subdivision, phase and notes
- Dropdown of **48 rate options representing 37 structures**, transcribed from the supplied `PullSheet(1).xls` (Sheet1, rows 4–40)
- Both 100 mm and 125 mm pull rates for the 11 source structures that provide both, rather than invented rates for other structures
- Multiple structures on the same daily report
- Ordered, returned, actual used and theoretical concrete volumes; total and per-structure waste percentages
- Choose **Hand pour** or **Machine pour** at the start of each daily report
- **Hand pour**: only enter cubic metres poured; structure/thickness selection, theoretical volume, and waste calculations are hidden and not required
- **Machine pour**: original structure pull-rate dropdown and waste workflow, including two ordering methods (**By structure** or **One combined order**), preserved
- Square-metre input for structures with `m³/m²` rates (separate walk, flag and median fill); lineal metres for `m³/LM` rates
- Device-local draft autosave and a saved-report list
- Fully client-side, **real `.xlsx` Excel export** with formulas and a separate **Pull rates** tab, with no third-party spreadsheet library or internet dependency
- Automatic email with Excel attached via Vercel serverless function and Resend, once the environment variables are configured
- Manual iPhone share-sheet fallback if automatic email is unavailable

## Calculation

**Theoretical m³ = measured LM or m² × source pull rate**

**Actual used m³ = ordered m³ − returned m³**

**Waste % = (actual used m³ − theoretical m³) ÷ theoretical m³ × 100**

Negative waste indicates *less concrete used than theoretical*. With a **combined order**, per-structure waste is intentionally hidden since the concrete cannot be accurately assigned to individual structures; the total report waste remains valid. For **hand pours**, only the poured m³ is reported: no waste percent is calculated, and Excel/email explicitly identify the pour as a hand pour.

The pour type is stored with each saved report. Older saved reports automatically load as machine pours. Switching between types keeps the other mode's entered values locally, but only the selected pour type appears in exported reports and email. Record mixed hand and machine pours as separate daily reports to avoid mixing a volume-only record with a waste calculation.

## Deploy as an iPhone web app

1. Create a new Vercel project from this folder (upload as a Git repository or use the Vercel CLI).
2. Choose framework **Other**, leave build command blank. The app is plain HTML/CSS/JS and the `api/send-report.js` file is an automatically deployed Vercel serverless function.
3. Add these **server-side environment variables** under Project Settings > Environment Variables:

   | Variable | Purpose |
   |---|---|
   | `RESEND_API_KEY` | Private API key from [Resend](https://resend.com/) |
   | `RESEND_FROM_EMAIL` | Sending address at a domain verified in Resend, e.g. `Marmot Reports <reports@your-verified-domain.ca>` |
   | `REPORT_SUBMISSION_KEY` | Your private, long team passphrase (recommended at least 12 random characters) |

4. Redeploy the project after saving the variables. In the app, the foreman enters the team submission key (not stored in localStorage). The backend sends the Excel attachment **only to `estimating@marmotconstruction.com`**.
5. Open your Vercel URL in Safari on the iPhone. Tap **Share > Add to Home Screen > Open as Web App > Add**.

**Before configuring email:** the Excel download and local reports already work. `Send to estimating` cannot deliver an email without a properly configured backend. Instead use **Share Excel attachment** and pick Mail. iOS does not reliably prefill an email recipient when sharing files, so the foreman must enter `estimating@marmotconstruction.com` in Mail.

## Local preview and testing

Open `index.html` on a desktop browser for a quick interactive preview. For offline caching and automatic email, deploy to HTTPS. To serve locally with a webserver:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/> on a desktop browser.

For testing the email endpoint, use `vercel dev` after setting the environment variables. Avoid exposing the endpoint on a public domain without access controls: a shared submission passphrase protects it, but production deployments may additionally need organization-managed authentication or server-side rate limiting.

## Data handling and limitations

- Draft and saved reports live in **browser storage on that device only**. They are not automatically synced among foremen or backed up. Clearing site data or losing the device removes them. Export or email regularly.
- The service worker caches the app UI for offline use after the first HTTPS visit; sending email always requires internet access.
- The backend uses Resend's HTTPS API and doesn't keep a separate report database.
- Returned concrete is optional and defaults to zero. Correct ticket totals matter for accurate waste tracking.
- Two close labels have **different pull rates in the supplied file**: `2.0 Rolled Mono` is `0.304 m³/LM` (100 mm) while `2.0 Rld. Mono` is `0.303 m³/LM`. Both are retained as separate dropdown options for review.
- Source rates are a reference library; no on-site override/editing of rates is allowed in this first version.

## Files

- `index.html`, `styles.css`, `app.js`: responsive mobile-first UI
- `structures.js`, `pull-rates.json`: 48 structure/rate options and original source row numbers
- `excel.js`: spreadsheet generator (offline-capable, no dependency)
- `api/send-report.js`: secured email endpoint for Vercel
- `manifest.webmanifest`, `sw.js`, `assets/`: iOS install and offline shell
- `generate_rates.py`: original structure-rate transcription and JSON export script
