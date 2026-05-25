---
name: aso-iphone
description: Apple App Store ASO (App Store Optimization) for the Privacy Score iOS app. Generates and validates app titles, subtitles, keyword fields, descriptions, promotional text, and what's-new copy in FR and EN. Strictly enforces Apple character/byte limits. Use when preparing App Store listing, updating metadata, or auditing existing listing.
when_to_use: App Store listing, ASO, app title, subtitle, keywords, app description, what's new, screenshots metadata
allowed-tools: Read Write Edit Bash
model: inherit
---

# ASO iPhone — Privacy Score on the App Store

You handle App Store Optimization for the iOS app. The app is **Privacy Score** (bundle: `codevelop.fr.Privacy-Score`), targets FR + EN markets, version 0.0.7. Apple App Store listing is the #1 conversion driver — every character matters.

## Apple field limits (May 2026)

| Field | Limit | Indexed? | Notes |
|---|---|---|---|
| App Name | 30 chars | YES | Highest indexing weight |
| Subtitle | 30 chars | YES | Second-highest indexing weight |
| Promotional Text | 170 chars | NO | Updatable without app release |
| Description | 4000 chars | NO | Apple — NOT indexed (unlike Google Play) |
| Keywords | **100 BYTES** (not chars) | YES | Comma-separated, NO spaces after commas |
| What's New | 4000 chars | NO | Release notes |
| Captions (screenshots) | 110 chars | YES (since June 2025) | New indexing field |
| URL slug | 30 chars | YES (URL-level) | apps.apple.com/.../<slug> |

## Critical: keyword field is BYTES not chars

For ASCII (FR + EN without accents): 1 char = 1 byte. 100 chars max.

For chars with accents (à, é, ü): 2 bytes each (UTF-8).

For CJK (Chinese, Japanese, Korean): 3 bytes each.

```python
# Quick check
def keyword_bytes(s):
    return len(s.encode('utf-8'))

keyword_bytes("privacy,audit,iphone")     # 20 bytes ✓
keyword_bytes("confidentialité,sécurité") # 26 bytes (not 25!)
```

Always use the [validate_metadata.py](scripts/validate_metadata.py) script.

## ASO strategy for Privacy Score

### Target positioning (Apple's eyes)

- Category: **Utilities** > Privacy
- Brand maturity: **Challenger** (new app, building visibility)
- Competition: Lockdown Privacy, Guardian Firewall, DuckDuckGo Privacy Browser

### App Name candidates (30 chars max)

Format: `<Brand>: <Value proposition with keyword>`

**FR version (30 chars max):**
- ✅ "Privacy Score: Audit iPhone" (27 chars) ← RECOMMENDED
- ✅ "Privacy Score: Confidentialité" (30 chars) — uses keyword "confidentialité"
- ❌ "Privacy Score" (13 chars — wastes 17 chars of indexing)

**EN version (30 chars max):**
- ✅ "Privacy Score: iPhone Audit" (27 chars) ← RECOMMENDED
- ✅ "Privacy Score: Tracker Check" (28 chars) — uses keyword "tracker"
- ❌ "Privacy Score" (13 chars — wastes 17 chars)

### Subtitle candidates (30 chars max)

Different keyword from Name to maximize indexing surface.

**FR:**
- ✅ "Bloquez traceurs et publicités" (30 chars) — keywords: "traceurs", "publicités"
- ✅ "Rapport Apple, analyse locale" (29 chars) — keywords: "rapport apple", "locale"

**EN:**
- ✅ "Block trackers, see who tracks" (30 chars) — keywords: "block trackers", "track"
- ✅ "Apple Privacy Report Analyzer" (29 chars) — keywords: "apple privacy report"

### Keyword field strategy (100 BYTES)

Rules:
- NO spaces after commas
- NO repeated words (already in Name/Subtitle = wasted)
- Mix singular/plural/related terms
- Include misspellings if common
- Use long-tail variants

**FR keyword field (target ≤100 bytes):**
```
audit,score,traceurs,publicité,vpn,dns,sécurité,rgpd,vie,privée,bloqueur,protection,données
```
Bytes count: "audit,score,traceurs,publicité,vpn,dns,sécurité,rgpd,vie,privée,bloqueur,protection,données"
= 13+1+5+1+8+1+9+1+3+1+3+1+8+1+4+1+3+1+6+1+8+1+10+1+7 = 98 bytes ✓

**EN keyword field (target ≤100 bytes):**
```
audit,score,tracker,blocker,vpn,dns,security,gdpr,privacy,monitor,scan,protect,data,leak,spy
```
Bytes: 95 bytes (count each char + commas)

### Description structure (4000 chars max — NOT indexed on Apple but readers DO read it)

**Structure (works for both FR and EN):**

```
[OPENING HOOK — 1 sentence, the value prop]

[3-PROMISE BLOCK]
• Aucun serveur / No server
• Aucun compte / No account
• Traitement local / Local-only processing

[HOW IT WORKS — 3 numbered steps]
1. Activez le rapport de confidentialité Apple dans Réglages
2. Partagez-le avec Privacy Score
3. Recevez votre score de 0 à 100 et vos recommandations

[KEY FEATURES — bulleted list, 5-7 items]
• Score de confidentialité 0-100
• Détection de tous les traceurs publicitaires
• Recommandations VPN et DNS chiffré
• Suivi de l'évolution dans le temps
• Conformité RGPD intégrée

[WHY US — 2-3 sentences differentiating]

[TECHNICAL DETAILS — 1 short paragraph]
Privacy Score requires iOS 17.6 or later.
The app uses Apple's App Privacy Report (built into iOS).
100% open about its operation — no hidden tracking.

[CALL TO ACTION — final sentence]
```

### Promotional Text (170 chars — UPDATABLE without app review)

Use for announcements:
- "Nouvelle version : graphique d'évolution, notifications de baisse de score. Téléchargez maintenant la mise à jour gratuite." (152 chars)

Or for highlighting a feature:
- "🆕 Découvrez quelles apps suivent vos données publicitaires. Mise à jour gratuite, 100% local, sans compte." (107 chars) — but avoid emoji per our style.

### What's New (release notes — 4000 chars)

Structure per release:
```
Version 0.0.8 (1 juin 2026)

Nouveautés
• Graphique d'évolution sur 90 jours
• Notification quand votre score baisse
• Support iPad amélioré

Corrections
• Affichage des traceurs publicitaires
• Performance de l'analyse améliorée

Merci pour vos retours !
```

### Screenshots strategy (10 max per device class)

Order matters — the first 3 are visible without scrolling.

**Required slots (in order):**
1. **Hero shot**: Dashboard with score (most representative single screen)
2. **Trust shot**: Onboarding "no server, no account, local"
3. **Feature shot 1**: Tracker analysis
4. **Feature shot 2**: VPN/DNS recommendations
5. **Feature shot 3**: Score evolution graph
6. **Feature shot 4**: IDFA detail / "who tracks you"
7. **Differentiator**: Comparison vs competitors (optional)

**Captions (110 chars each — INDEXED since June 2025):**

Each caption is a separate indexing field. Use different keywords:

FR captions:
1. "Votre score de confidentialité iPhone calculé localement" (60 chars)
2. "Aucun serveur. Aucun compte. Traitement local uniquement." (61 chars)
3. "Identifiez les traceurs publicitaires de vos apps" (53 chars)
4. ...

### Custom Product Pages (CPP)

Available since July 2025. Eligible for organic Search now.

Create 2-3 CPP variants for different audiences:
- **/cpp/family-privacy**: emphasizes child safety
- **/cpp/business-privacy**: emphasizes corporate data
- **/cpp/dev-privacy**: emphasizes technical details

Each CPP gets its own URL and can rank separately in search.

## Validation workflow

Before submitting to App Store Connect:

```bash
# Run the validator
python scripts/validate_metadata.py \
  --app-name "Privacy Score: Audit iPhone" \
  --subtitle "Bloquez traceurs et publicités" \
  --keywords "audit,score,traceurs,publicité,vpn,dns,sécurité,rgpd,vie,privée,bloqueur,protection,données" \
  --description "@./assets/aso/description-fr.txt" \
  --whats-new "@./assets/aso/whatsnew-fr.txt" \
  --lang fr
```

Output:
```
✅ App Name: 27/30 chars
✅ Subtitle: 30/30 chars
✅ Keywords: 98/100 bytes
✅ Description: 1842/4000 chars
✅ What's New: 156/4000 chars
✅ All checks passed
```

## Common ASO mistakes for our app

- ❌ Repeating words across Name + Subtitle + Keywords (wastes indexing surface)
- ❌ Using "free" / "gratuit" in keywords (Apple may reject)
- ❌ Mentioning competitors by name in description (against guidelines)
- ❌ Adding spaces in keyword field after commas (counts as bytes)
- ❌ Forgetting accented characters cost 2 bytes
- ❌ All-caps in screenshots (Apple flags)
- ❌ Misleading screenshots (must show real UI)
- ❌ Not updating What's New per release (looks abandoned)

## ASO performance tracking

Manually monitor (free tools):
- App Store Connect → Analytics → Search (impressions, conversions)
- Search the keyword in App Store → note your rank position
- Track weekly: top 10 keywords' ranking

Paid tools (when budget allows):
- AppFollow
- Sensor Tower
- Mobile Action

## Related skills

- [seo-copywriter-fr](../seo-copywriter-fr/SKILL.md) — for FR description writing (same voice)
- [seo-copywriter-en](../seo-copywriter-en/SKILL.md) — for EN description writing

## References

- [validate_metadata.py](scripts/validate_metadata.py)
- [ASO learnings](references/aso-learnings.md)
