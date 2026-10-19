---
title: "How to Export Your iPhone App Privacy Report"
description: "Export your iPhone App Privacy Report from Settings and open it in Privacy Score. Follow the sharing steps and keep your original report file private."
publishedAt: "2026-10-19"
updatedAt: "2026-10-19"
author: "Skander Bahri"
language: "en"
slug: "export-app-privacy-report"
translationKey: "export-report"
tags: ["app-privacy-report", "export-report", "iphone-privacy-audit"]
hero:
  src: "/assets/screen-network.webp"
  alt: "Privacy Score Network Traffic screen grouping contacted domains by company, with example report data"
---

To export your iPhone App Privacy Report, open **Settings > Privacy & Security > App Privacy Report**, then use the **Share** button. Choose Privacy Score in the share sheet to open the report for local analysis. You need a report containing activity first; installing an analysis app does not create earlier records.

The export is Apple's activity file, not a screenshot of the report and not the privacy label shown on an App Store page. [Apple's developer guide confirms the Share button and NDJSON export format](https://developer.apple.com/documentation/network/inspecting-app-activity-data).

## Before you export

Open App Privacy Report in Settings and check whether recording is enabled. If it is not, turn it on and use the apps you want to review. Return when there is activity to inspect. Apple's documentation says data accumulates after activation; it does not specify a mandatory four-day waiting period. [See Apple's activation instructions](https://support.apple.com/en-us/102188).

For a useful first review, decide what you are trying to understand. You might want to check location use in a weather app, network domains contacted while reading news, or microphone access during a call. Record the app and approximate time of that task. This gives you something concrete to compare with the report.

Have [Privacy Score installed from the App Store](https://apps.apple.com/app/id6762229573) before opening the share sheet. The app analyzes the report you supply; it does not retrieve the system report automatically in the background.

## Share the report with Privacy Score

1. Open **Settings** on your iPhone.
2. Select **Privacy & Security**, then **App Privacy Report**.
3. Use the **Share** button on the report screen.
4. Look through the app destinations in the share sheet and select **Privacy Score**. If needed, open **More** to inspect the available destinations.
5. Let Privacy Score open and finish processing the file before reviewing the results.

Keep the original file unchanged. Apple describes the export as newline-delimited JSON, often called **NDJSON**: structured records separated by line breaks. You do not need to edit that format to use Privacy Score.

Do not substitute a Safari Privacy Report screenshot, a PDF, or text copied from Settings. Renaming one of those files to `.ndjson` does not turn it into an Apple activity export.

If Privacy Score does not appear as a destination, first confirm it is installed and can be opened normally. Then return to Settings and share a fresh report. If that still fails, note your iOS version, Privacy Score version, and what appears in the share sheet before [contacting support](mailto:support@privacyscore.fr). You can describe the issue without sending the report itself.

## Read the result in context

[Privacy Score's iPhone privacy audit](/) adds domain context, a score, and recommendations to the imported activity. The screenshot on this page shows the app's network view with example data; its numbers are not a typical-user benchmark.

Use three questions when reviewing a result:

| Question | Useful next step |
|---|---|
| Which app and feature produced this activity? | Compare the entry with what you were doing |
| Is the permission appropriate? | Review that app in Privacy & Security |
| What is the domain used for? | Consider the service, embedded content, and developer's privacy explanation |

A domain contact by itself does not identify the contents of an encrypted request, establish that personal data was sold, or prove a successful tracking event. A domain classification is context for an investigation. It is not a verdict on every request involving that domain.

For a practical next action, use the [iPhone permissions guide](/blog/iphone-permissions-guide/). For broader controls, follow the [privacy settings checklist](/blog/iphone-privacy-settings-2026/).

## Keep the exported file private

The report contains activity metadata that can reveal which apps you use and which domains they contact. Treat it as a personal file. Privacy Score performs report analysis locally on the iPhone; sharing a copy elsewhere is a separate decision.

If you also save an export in Files, choose its location deliberately. A folder in iCloud Drive may be available on your other signed-in devices. Avoid posting a complete report in a public support thread. Ask what information is needed before sharing a file, and prefer a narrowly cropped screenshot that does not expose unrelated activity.

Exporting Apple's report from Settings is different from exporting analysis results from Privacy Score. The first report analysis is free; Premium includes additional functionality such as further analyses and app export tools. Check the App Store purchase screen for the current features, local price, and offer eligibility.

### Is the report empty or missing the app you expected?

Follow the [empty or incomplete App Privacy Report checklist](/blog/app-privacy-report-empty/) before retrying the import. A newer export can help when the first file was created before the activity you want to inspect.

### Does an import keep watching the phone?

An import analyzes that file. To compare later activity, collect and share a fresh report, and keep the difference in usage and reporting period in mind.
