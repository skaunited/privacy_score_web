---
title: "iPhone Permissions Guide: What Each One Actually Grants"
description: "A practical iPhone permissions guide for iOS 17 and 18. What apps see, the precision controls, and the three permissions to revoke for most apps."
publishedAt: "2026-06-01"
updatedAt: "2026-06-01"
author: "Skander Bahri"
language: "en"
slug: "iphone-permissions-guide"
tags: ["iphone-permissions", "app-permissions", "ios-privacy"]
hero:
  alt: "The iPhone Settings app open on Privacy and Security, showing the list of system permissions"
---

When you tap "Allow" on an iPhone permission prompt, you almost certainly aren't picturing the actual blast radius. Grant Photos access to a delivery app so you can send a picture of the doorstep, and the app can now read every photo you've ever taken, plus the geotag on each. Grant Contacts to a "social" app once, and your friends' phone numbers may end up on a server in a country whose name you'd struggle to pronounce.

iPhone permissions are powerful when you know what they grant. This guide walks through all twelve permissions Apple exposes in iOS 17 and iOS 18, what each one actually lets an app see, the precision controls Apple has added since 2021, and the common misuse patterns to watch for. It's the companion piece to our [iPhone privacy settings 2026 guide](/en/blog/iphone-privacy-settings-2026/), which covers the system-level toggles. This one is about per-app permissions.

## The 12 permissions Apple shows you

You'll find them all in Settings, Privacy &amp; Security. Apple lists them in order of what they think you'll need most, which is not the same as order of risk. Below they're grouped by the kind of data they expose.

### Location Services

**What apps see when you say yes:** GPS coordinates accurate to a few meters, plus altitude, heading, speed, and (with Precise Location on) the building you're in. Apps can poll this in the foreground, in the background, or just once.

**Precision controls Apple added:**
- **Precise Location toggle (since iOS 14):** off gives apps a fuzzed coordinate accurate to about 10 km. Plenty for weather, news, or a food-delivery app that only needs your city.
- **While Using the App / Always / Once:** the four-button permission prompt for location. "Once" forces the app to ask again next launch. "While Using" cuts background polling entirely.
- **Background indicator:** the blue pill at the top of the screen when any app is using your location in the background.

**The common misuse pattern:** weather apps, flashlight apps, news apps, and shopping apps requesting Always-On location, then re-selling the timestamp stream to data brokers. The 2024 Wired investigation that identified Secret Service agents ran on exactly this kind of feed. <a href="https://www.404media.co/secret-service-bought-phone-location-data-from-data-brokers-treasury-ig-finds/" rel="external">404 Media has covered the pattern in detail</a>.

**Quick fix:** for almost any app, switch to "While Using" and Precise Location off. If an app insists on Always-On, it had better be a navigation app, a fitness tracker, or your bank's fraud-detection app.

### Contacts

**What apps see when you say yes:** every contact, every phone number, every email address, every note, every birthday, every photo. The full address book, as a structured export.

**Precision controls Apple added (iOS 18):** Limited Contacts access. You pick the specific contacts an app can see, one by one. This was a major shift; before iOS 18, Contacts was all-or-nothing.

**The common misuse pattern:** "find your friends" features in messaging, dating, fitness, and social apps that quietly upload your entire address book to find matches, then keep the data. Your friends never consented to being in that database.

**Quick fix:** Limited Contacts (iOS 18+) or deny outright. For apps that legitimately need to message someone in your address book, you can also just paste the number once.

### Calendars and Reminders

**What apps see when you say yes:** every event you've ever scheduled, the title, the location, the invitees, the notes, the recurrence rules. Reminders works the same way.

**Precision controls Apple added (iOS 17):** Write-Only access. The app can create new events but cannot read existing ones. Perfect for an airline app that wants to add your flight to your calendar without seeing your therapy appointments.

**The common misuse pattern:** apps requesting full read access when they only need to write. Less common than the Contacts pattern but lower-visibility and easy to forget once granted.

**Quick fix:** Write-Only for any app that just adds events. Deny for anything else.

### Photos

**What apps see when you say yes:** every photo and video, full resolution, with EXIF metadata (date, GPS, camera model). For most people that's tens of thousands of photos and a complete map of where they've been over the years.

**Precision controls Apple added:**
- **Limited Photos (since iOS 14):** you pick the specific photos an app can see. The app sees what you picked and nothing else.
- **Add Only:** the app can save new photos to your library but cannot read existing ones.

**The common misuse pattern:** social apps and editors requesting full library access, then scanning the EXIF GPS data on every photo to build a location history. You can sometimes spot this in the App Privacy Report after the fact.

**Quick fix:** Limited Photos is the right answer for 95% of cases. Picking three photos at upload time takes two extra taps and removes an entire category of risk.

### Camera

**What apps see when you say yes:** live camera feed, both lenses, foreground only. The orange dot at the top of the screen lights up whenever any app is actively using the camera, non-bypassable at the hardware level.

**The common misuse pattern:** apps that ask for Camera as a one-time feature (QR scan, profile picture) and then keep the permission forever. Granted-and-forgotten attack surface, not active misuse.

**Quick fix:** review the Camera list every few months. Revoke from anything you don't actively photograph in.

### Microphone

**What apps see when you say yes:** live audio, foreground only. Same orange dot as Camera.

**The common misuse pattern:** the "is my phone listening to me?" panic is overblown (the indicator would catch it). The real concern is voice messages or "voice search" features that ship audio to transcription servers with retention policies you didn't read. The App Privacy Report will catch those domains after the fact.

**Quick fix:** revoke from anything you don't actively voice-message in.

### Speech Recognition

**What apps see when you say yes:** the right to transcribe audio in-app, using either Apple's on-device or cloud recognizer (the developer chooses, with no per-app indicator).

**Quick fix:** treat it like Microphone. Grant only when actively needed.

### Bluetooth

**What apps see when you say yes:** every nearby Bluetooth device, its MAC address, its name. This includes BLE beacons in stores that retailers use for indoor location tracking.

**Precision controls Apple added (since iOS 13):** per-app Bluetooth permission, separate from the system Bluetooth toggle. Before iOS 13, Bluetooth was a free-for-all.

**The common misuse pattern:** retail apps requesting Bluetooth to "improve in-store experience," which is shorthand for tracking your aisle-by-aisle movement using beacons. Loyalty apps love this.

**Quick fix:** revoke Bluetooth for any app that doesn't need to talk to a specific device you own (your headphones, your car, a fitness tracker). For headphones and cars, the standard Bluetooth menu, not a per-app permission, handles the pairing.

### Local Network

**What apps see when you say yes:** every device on your Wi-Fi network. Names, IP addresses, sometimes manufacturer info. This is how an app discovers your Chromecast, but also how it can fingerprint your home network.

**Precision controls Apple added (since iOS 14):** explicit per-app permission. Before iOS 14, any app could scan your local network silently. Apple's then-VP of marketing called this <a href="https://www.theverge.com/2020/8/24/21399356/apple-ios-14-privacy-features-local-network-permissions" rel="external">"a major change to how apps interact with iOS networking"</a>.

**The common misuse pattern:** social and shopping apps requesting Local Network with no legitimate reason. Combined with your home Wi-Fi SSID (a different signal), this can identify your household across app installs.

**Quick fix:** deny by default. Grant only to apps that legitimately need to discover a device on your network: Sonos, Hue, your printer's setup app, a smart-TV remote.

### Motion &amp; Fitness

**What apps see when you say yes:** step count, distance walked, flights climbed, plus the raw accelerometer if they ask for it. The raw accelerometer is enough for sophisticated apps to estimate keystrokes, vehicle type, or sleep patterns.

**The common misuse pattern:** ad-tech SDKs requesting Motion &amp; Fitness to fingerprint device usage, then correlating it with browsing.

**Quick fix:** unless an app is actively a fitness tracker or a navigation app that needs vehicle-type detection, deny.

### Tracking (App Tracking Transparency)

**What apps see when you say yes:** your IDFA, the cross-app advertising identifier that lets every SDK in every app stitch your behavior into one profile.

**Precision controls Apple added (since iOS 14.5):** every app must ask, with a system-issued prompt, before reading the IDFA. By default, the answer is no.

**The common misuse pattern:** legitimate ad-supported apps asking nicely, which is fine; deceptive apps asking via spammy prompts or pre-prompts designed to manipulate you into yes. Apple has been chasing the deceptive patterns down through App Store reviews, but new ones keep emerging.

**Quick fix:** for almost everyone, the answer is no. Turn off the global toggle (Settings, Privacy &amp; Security, Tracking, Allow Apps to Request to Track) and you'll never see the prompt again.

## How to audit your existing permissions

Settings, Privacy &amp; Security. The list at the top (Location Services, Contacts, etc.) is your audit surface. Open each one. You'll see the list of apps that have asked for that permission, with their current setting next to each name.

Two passes:

1. **The "do I still use this app?" pass.** Apps you uninstalled but whose permission grants Apple kept around in case you reinstall. Revoke them.
2. **The "wait, why does this app need that?" pass.** Apps you actively use but whose permission feels wrong. A note-taking app with Location set to Always. A flashlight app with Photos. Revoke.

The whole audit takes about 15 minutes the first time, less every time after.

## Three permissions you almost certainly want to revoke for most apps

If you only have time to make three blanket decisions, make these.

**Tracking: deny everyone.** Global kill-switch off. <a href="https://www.eff.org/deeplinks/2022/03/how-disable-ad-id-tracking-ios-and-android-and-why-you-should-do-it-now" rel="external">EFF has called this the single highest-impact iPhone privacy toggle</a>, and they're right.

**Location: While Using the App, Precise Location off, for nearly everything.** The exceptions are obvious (Maps, Uber, your bank's fraud detector). Everything else gets the fuzzed version, and only in the foreground.

**Bluetooth: revoke for any app that isn't pairing with a device you own.** This one is invisible to most users and almost always granted without thought. Going through the list once and saying no to retail apps, shopping apps, and social apps removes a major beacon-tracking surface.

## The hidden ninth permission: the App Privacy Report

Settings, Privacy &amp; Security, App Privacy Report, then Turn On App Privacy Report. This is the meta-permission: it shows you which apps used which permissions over the last seven days, plus the domains each app contacted.

You can read it raw. Apple's <a href="https://support.apple.com/guide/iphone/iphd34a4cdf7/ios" rel="external">official documentation</a> explains the format. The most common reaction the first time you read it is: "wait, that app talked to <em>where</em>?" Cross-referencing those domains with what you know about the app is how you catch the gap between "what you granted" and "what they actually do."

For the deeper dive, see our [iPhone privacy settings 2026 guide](/en/blog/iphone-privacy-settings-2026/) for the system-level toggles that complement permission control.

## Quick fixes table

The most common combinations to fix, sorted by impact:

| Permission | Default setting for most apps |
|---|---|
| Tracking (global) | Off |
| Location: weather, news, shopping | While Using, Precise off |
| Location: navigation, banking | Always allowed, Precise on |
| Photos: social, editors, delivery | Limited Photos |
| Contacts: social, dating, fitness | Deny or Limited (iOS 18+) |
| Calendars: airlines, travel | Write-Only |
| Camera: any app you don't actively photograph in | Revoke |
| Microphone: any app you don't actively voice-message in | Revoke |
| Bluetooth: retail, social, shopping | Deny |
| Local Network: anything not a smart-home or print app | Deny |
| Motion &amp; Fitness: anything not a fitness or navigation app | Deny |
| Speech Recognition: rarely needed outside Siri | Deny |

## Where Privacy Score helps

Reading the App Privacy Report raw is doable but draining. There's no UI for "which of these domains are tracking infrastructure versus legitimate app backends?" That's a JSON-style log, scrolled chronologically, with no taxonomy.

That's what [Privacy Score](/en/) does. You export the report from iOS (Settings, Privacy &amp; Security, App Privacy Report, Share). Privacy Score reads it on your iPhone, cross-references every contacted domain against the open DuckDuckGo Tracker Radar database, and shows you which apps are doing what. You get a score out of 100 and three to five concrete fixes ranked by how many points each one earns back. No server, no account, no cloud. The iOS source is public, and a grep for `URLSession` returns zero active calls. See our [privacy policy](/en/privacy-policy/) for the rest.

The first scan is free for life. Subsequent scans are €23.88 per year or €20.94 per six months via Apple In-App Purchase. The point of the app is to compress the audit from an afternoon to a minute, and to give you a number that goes up over time.

## Conclusion

iPhone permissions are blunt instruments when you grant them without thinking and surgical tools when you understand what each one does. The twelve above are the full list as of iOS 17 and iOS 18. Three of them (Tracking, Location, Bluetooth) account for most of the actual exposure. Spend 15 minutes auditing them, turn on the App Privacy Report, and you'll have closed most of the gap between "what you thought you allowed" and "what apps actually do." When you want the audit on autopilot, [Privacy Score](/en/) is here.
