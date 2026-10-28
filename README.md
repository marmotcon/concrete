# Marmot Construction — Concrete Pour Tracker v1.4

An iPhone-friendly concrete pour app. No Vercel, server submission key, or email provider needed. Publish with GitHub Pages.

## Changes in v1.4

- **Foreman:** dropdown with Dave, Johnny, Tony, Jay, Carlos and Eddie.
- **Subdivision / job number:** searchable by name or 5-digit job number; all 133 named jobs were imported from the three supplied 2026 workbooks (Maintenance: 40; New Construction: 47; Commercial: 46). Blank/unnamed placeholder rows were omitted.
- Each selected job displays the job number plus project name, and both appear in the Excel report. Neither owner nor engineer is imported.
- Previously saved drafts without a job number still open, but must select the matching job from the dropdown to export/share a new report.
- Incremented the offline cache so iPhone installations load the updated job list.

## Previous v1.3 features

- Uses the supplied official Marmot Construction logo in the app (desktop and iPhone) and its orange peak mark for the Home Screen icon.
- One submission method: **Share Excel Report**. This opens the iPhone native share sheet with the Excel workbook **already attached**. Choose Mail, add the recipient and send.
- Removed **Open email to estimating**, which had required attaching a downloaded file manually.
- Kept the Copy control beside `estimating@marmotconstruction.com`, as a shortcut for the email recipient. The native share sheet does not let a website prefill the To field.
- Separate **Export Excel** and **Save report** remain available as file/history actions, not alternative email submission buttons.

## What is tracked

- Date, six-name foreman dropdown, searchable subdivision with job number, phase, notes.
- **Hand Pour:** total m³ poured only. No structure/waste fields.
- **Machine Pour:** 48 pull rate options (37 structures), thickness choices where provided, multiple lines, ordered and returned volumes, theoretical volume, actual used and waste percentage.
- One combined concrete order shared across multiple structures, or per-structure ordering.
- Formula: waste % = (actual used − theoretical) ÷ theoretical × 100.
- Theoretical = measured LM (or m²) × listed pull rate.
- Offline app after first visit, local draft save and saved report history, generated `.xlsx` report with a pull-rate reference tab.

## iPhone email workflow

1. Enter measurements and project details.
2. Tap **Copy** beside the recipient to put `estimating@marmotconstruction.com` on the clipboard (optional).
3. Tap **Share Excel Report**.
4. On the iPhone share sheet select **Mail**, paste/type the recipient in **To**, review the **already attached** Excel workbook and send.

**Important:** Websites cannot prefill the recipient in the iPhone Share sheet, even when they supply a real Excel attachment. The app cannot verify email delivery. File sharing requires the browser/device to support the Web Share API with files (iPhone Safari on HTTPS is recommended). If unsupported, an onscreen message requests opening the app in iPhone Safari. The separate Excel export remains available for local backup.

## Publish/update on GitHub Pages

1. Create a public GitHub repository such as `marmotcon/concrete`, or open your existing concrete repository.
2. Extract the ZIP and upload **all the files and folders inside it** to the repository root. Do not upload the ZIP or nest the app in another folder. Upload the `assets/` folder with the new `marmot-logo.png` and updated icons.
3. Commit changes. Under Settings > Pages select Deploy from branch `main`, folder `/(root)`.
4. Open `https://marmotcon.github.io/concrete/` in Safari and use Share > Add to Home Screen.

After an update, close/reopen the website if you still see the old version: the service worker will upgrade its cache. Drafts/saved reports on the same website/device continue to use the same local storage keys.

## Privacy and limitations

Reports are stored **on the device only**, not in GitHub or a server. Don't clear website data before exporting needed reports. Anyone with the public GitHub Pages URL can open and use the app, but saved reports do not become publicly accessible by using it.

## Files

- `index.html`, `styles.css`, `app.js`: app interface, job selector and share workflow
- `jobs.js`: searchable job list from uploaded 2026 files; no owner/engineer data
- `excel.js`: Excel workbook generation on-device
- `structures.js`, `pull-rates.json`: supplied structure/dropdown rates
- `assets/marmot-logo.png`, `assets/icon-192.png`, `assets/icon-512.png`: official branding and PWA icons
- `manifest.webmanifest`, `sw.js`: installable/offline app
- `generate_rates.py`: developer reference; not needed by GitHub Pages
