---
title: Privacy Policy
language: en
version: 1.0
last_updated: 2026-05-27
publisher: Skander BAHRI (French sole proprietor), CoDevelop
canonical_url: https://privacyscore.fr/en/privacy-policy
cross_links:
  - legal-notice: https://privacyscore.fr/en/legal-notice
  - terms-of-use: https://privacyscore.fr/en/terms-of-use
---

# Privacy Policy

Last updated: May 27, 2026, version 1.0

This policy explains how the **Privacy Score** iOS application and the `privacyscore.fr` website handle your data. We chose to write it in plain English because an app that audits your privacy should itself be worthy of your trust. If a sentence is unclear, write to `support@privacyscore.fr` and we will fix it.

## What we do NOT collect

Before detailing what we do collect, here is what Privacy Score **does not collect**:

- No account, no email address, no password, no user identifier you would provide.
- No third-party analytics SDK: no Firebase, no Sentry, no Amplitude, no Mixpanel, no Segment, no PostHog, no Crashlytics, and no comparable SDK.
- No audience-measurement or advertising cookies on the `privacyscore.fr` website.
- No outbound connection from the iOS app to track you or to transmit your report.
- No profiling, no automated decisions about you.

This absence is verifiable: the app makes no network request to our servers, because we do not run any server for this purpose.

This list reflects version 1.0 of the app. Any future change to the scope of processing will be announced inside the app before taking effect, and this policy will be updated with a new version.

## Data Controller

The data controller within the meaning of Article 4.7 of Regulation (EU) 2016/679 (GDPR) is:

**Skander BAHRI**, a French sole proprietor (`entrepreneur individuel`) trading as **CoDevelop**, whose contact details are listed in the [Legal Notice](https://privacyscore.fr/en/legal-notice).

For any question about your data: `support@privacyscore.fr`.

## Data Protection Officer

Given our activity (publishing an app that processes data only on the user's device, with no large-scale monitoring and no special categories within the meaning of Article 9 GDPR), CoDevelop is **not required** to designate a Data Protection Officer under Article 37 GDPR. No DPO has been designated. Requests concerning your rights should be sent to `support@privacyscore.fr`.

## Data Processed and Purposes

### 1. Apple Privacy Report imported into the app

- **What it is**: an NDJSON file you export from iOS Settings &gt; Privacy &amp; Security &gt; App Privacy Report, then share with Privacy Score via the iOS share sheet.
- **Purpose**: analyze the report to compute a 0-100 privacy score, list detected trackers, identify which apps use location, and produce recommendations.
- **Legal basis (Art. 6 GDPR)**: performance of the service you requested (Art. 6.1.b).
- **Where the processing takes place**: entirely on your iPhone. The file is parsed locally by the app.
- **Storage**: inside the app's sandbox (SwiftData database and a copy of the NDJSON file under `Documents/PrivacyReports/`). No transmission to any server, whether ours or a third party's.
- **Retention**: until you import a new report (which replaces the previous one) or delete the app.
- **Recipients**: none.

### 2. Derived analyses from the report

- **What it is**: score, tracker counts, historical scores across imports, mitigation samples (encrypted DNS and VPN status at scan time).
- **Purpose**: render the dashboard, the score history, and the recommendations.
- **Legal basis**: performance of the service (Art. 6.1.b).
- **Storage**: app sandbox (separate SwiftData containers per category).
- **Retention**: indefinitely as long as the app remains installed. The mitigation-sample history is automatically pruned by age and quantity cap.
- **Recipients**: none.

### 3. Advertising identifier (IDFA)

- **What it is**: a unique identifier assigned by iOS to your device for advertising. If you have declined tracking via App Tracking Transparency, this identifier is all zeros and carries no identifying value.
- **Purpose**: compute the exposure duration ("you have carried this advertising ID for X days") so we can explain what it represents.
- **Legal basis**: legitimate interest in providing an educational analysis of your advertising exposure (Art. 6.1.f GDPR). This interest is balanced against your fundamental right to data protection: no transmission to any third party occurs, and you keep full control via iOS settings (App Tracking Transparency, reset of the advertising identifier).
- **Storage**: the app's `UserDefaults`, on your device. The identifier is stored locally only to compute the first-observed date. If the identifier is null (ATT declined), no date is recorded.
- **Retention**: until you reset your IDFA from iOS, or delete the app.
- **Recipients**: none.

> Under French data-protection authority (CNIL) guidance, the advertising identifier qualifies as personal data. We disclose it transparently here even though we transmit it to no one.

### 4. iOS statuses read on the fly

When you open the dashboard, the app reads certain system statuses (encrypted DNS status, VPN status, iOS version, location authorization status, App Tracking Transparency status). These values are read on every render and are **not stored**, with two exceptions:

- The **iOS version** is kept in `UserDefaults` to detect a system upgrade and trigger, if you enabled it, a corresponding notification.
- **Notification history** (dismissal counters, automatic pauses) is kept locally to respect your settings.

### 5. Custom DNS and VPN profiles

If you enter an encrypted DNS profile (DoH/DoT) or a VPN profile (IKEv2) inside the app:

- The values you enter are stored in the local SwiftData database.
- **The VPN password you may enter to generate a `.mobileconfig` file is never kept** beyond the generation session. The `.mobileconfig` file itself is temporary and protected by encryption (`completeFileProtection`), then automatically deleted after sharing.
- **Legal basis**: performance of the service you requested (Art. 6.1.b).
- **Recipients**: none (profiles stay on your device; you then choose whether to install the profile in iOS).

### 6. Paid subscription and billing

The app offers an auto-renewing subscription:

- Annual plan: €23.88 per year (i.e., €1.99 per month).
- Six-month plan: €20.94 per six months (i.e., €3.49 per month).
- The first scan is free for life and its full audit remains accessible on your device without any subscription.

The subscription is handled entirely by **Apple In-App Purchase**:

- **Apple** (Apple Distribution International Limited, Cork, Ireland) is the payment processor. CoDevelop receives neither your card number, nor your billing address, nor your Apple ID. CoDevelop only receives, periodically and in aggregate, the accounting data Apple consolidates to remit revenue.
- Apple's own [Privacy Policy](https://www.apple.com/legal/privacy/) applies to the processing of payment data.
- To manage or cancel your subscription, go to iOS Settings &gt; your Apple ID &gt; Subscriptions. Any refund is handled by Apple under its own refund policy.

### 7. Local notifications

The app may schedule local notifications (import reminder, new tip, iOS version change, score drop) with your permission. All notifications are **local**: no remote push notification is used, no server is contacted. Your notification preferences (active categories, quiet hours, dismissal history) are stored in `UserDefaults`.

### 8. The `privacyscore.fr` website

- **Cookies**: only cookies strictly necessary for the site to function are used (for example, a session cookie if a form requires one). These cookies are exempt from prior consent under Article 82, II of French Law No. 78-17 of January 6, 1978 (as amended). No third-party audience-measurement cookie, and no advertising cookie, is set.
- **Server logs**: our host **HOSTINGER operations, UAB** retains, as any host does, technical logs that include connection IP addresses. This retention is required by Article 6, II of French Law No. 2004-575 of June 21, 2004 (LCEN) for the purpose of detecting, investigating, and prosecuting criminal offenses. The statutory period is **one year**. These logs are managed exclusively by Hostinger and accessed only within the legal framework.

## Recipients and Transfers Outside the EU

CoDevelop does not transmit any data to a third party located outside the European Union on its own behalf.

Apple Distribution International Limited, which processes payment data on behalf of CoDevelop, is established in Ireland (European Union). Any subsequent transfers to the United States (in particular to Apple Inc. in Cupertino) are Apple's sole responsibility and are governed by the EU-US Data Privacy Framework, validated by the European Commission on July 10, 2023 (Adequacy Decision 2023/1795). Apple's own [Privacy Policy](https://www.apple.com/legal/privacy/) governs that processing.

## Your Rights

Under Articles 15 to 22 of the GDPR and Articles 48 to 56 of the French Data Protection Act (Law No. 78-17 of January 6, 1978, as amended), you have the following rights:

- Right of access to your data (Art. 15 GDPR)
- Right to rectification (Art. 16)
- Right to erasure (Art. 17)
- Right to restriction of processing (Art. 18)
- Right to data portability (Art. 20)
- Right to object (Art. 21)

### How to exercise these rights in practice

Almost all data remains on your device, so exercising these rights happens first through the app itself:

- **Access**: open the app. The content of your report and all analyses are at your disposal.
- **Rectification**: an Apple Privacy Report cannot be edited after the fact. To get more recent data, import a new report.
- **Erasure**: delete the app from iOS, or use the "Reset all settings" function available in development builds. Uninstalling removes the local database, saved profiles, and the captured IDFA in full.
- **Portability**: the imported Apple report remains an NDJSON file you can view and export through the iOS Files app, in the app's `Documents/PrivacyReports/` sandbox folder.

For any request that cannot be satisfied directly within the app, write to `support@privacyscore.fr`. CoDevelop will respond within one month of receipt, in accordance with Article 12.3 of the GDPR.

## Right to Lodge a Complaint with the CNIL

Under Article 77 of the GDPR, you have the right to lodge a complaint with a supervisory authority. In France, this is the **Commission nationale de l'informatique et des libertés (CNIL)**:

3 place de Fontenoy
TSA 80715
75334 PARIS CEDEX 07
France
Phone: +33 1 53 73 22 22
Website: `https://www.cnil.fr`

If you reside in another EU country, you may also contact your local supervisory authority.

## Automated Decisions and Profiling

No decision producing legal effects on you, or significantly affecting you, is taken about you in an automated manner. No profiling within the meaning of Article 22 of the GDPR is performed.

## Security

Data stored on your device benefits from the standard iOS protection (sandbox, file-system encryption when you have set a passcode). The `.mobileconfig` files temporarily generated for DNS / VPN profiles are flagged with `completeFileProtection` and deleted after sharing.

Because CoDevelop runs no server receiving your data, the risk of a server-side breach is, by design, nonexistent.

## Changes to This Policy

CoDevelop may amend this policy to reflect changes to the app, to the legal framework, or to CNIL guidance. The version in force is always dated and numbered at the top of this page. Any material change will be announced inside the app before taking effect.

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | May 27, 2026 | Initial publication. Compliance with GDPR Art. 13, French Data Protection Act Art. 48-56, DPF (Adequacy Decision 2023/1795), CNIL. Internal ROPA maintained separately (see `compliance/ROPA-codevelop.md`). |
