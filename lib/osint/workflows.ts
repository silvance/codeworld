// Investigation playbooks shown on the OSINT page. Each playbook is a
// step-by-step walkthrough of a common investigation type, citing
// specific tools from the rest of the OSINT page (linked via section
// hrefs that pre-fill the section's local search via ?q=).

export interface PlaybookStep {
  num: number
  /** Imperative action for this step ("Run Sherlock against the username"). */
  action: string
  /** Why this step matters in the investigation. */
  why: string
  /** Tool used in this step. */
  tool: string
  /** Optional deep-link to the relevant OSINT section + ?q=<tool>. */
  href?: string
  /** Optional runtime note. */
  notes?: string
}

export interface Playbook {
  id: string
  title: string
  /** One-line description of what you're trying to find out. */
  goal: string
  /** What information you need to start. */
  inputs: string[]
  /** What you typically end up with after running the playbook. */
  outputs: string[]
  steps: PlaybookStep[]
  /** Common mistakes, opsec considerations, or ethical reminders. */
  pitfalls: string[]
}

export const playbooks: Playbook[] = [
  // ─── 1. Username pivot ───────────────────────────────────────────────────────
  {
    id: 'username-pivot',
    title: 'Pivot from a username to a real identity',
    goal: 'You have a single username (a handle, a screen name) and want to know who is behind it and where else they exist online.',
    inputs: ['One username string (e.g. "blue_kestrel_91")'],
    outputs: [
      'A list of platforms where the username is registered',
      'Likely real-name candidates from associated emails / profile photos',
      'A timeline of when the account was created and active on each platform',
    ],
    steps: [
      {
        num: 1,
        tool: 'Sherlock',
        href: '/osint?section=username&q=Sherlock',
        action: 'Run Sherlock to enumerate the username across ~400 platforms.',
        why: 'Cast the widest possible net first. False positives are noisy but acceptable at this stage.',
        notes: 'python3 sherlock.py blue_kestrel_91. Filter results manually — Sherlock will report some sites as hits even when the page is a 404.',
      },
      {
        num: 2,
        tool: 'WhatsMyName',
        href: '/osint?section=username&q=WhatsMyName',
        action: 'Cross-check against WhatsMyName, which has a different (and often larger) site list than Sherlock.',
        why: 'Catches platforms Sherlock misses, particularly newer or niche sites. Confirms or contradicts Sherlock\'s hits.',
        notes: 'Web version at whatsmyname.app is fastest for casual queries. CLI exists for batch work.',
      },
      {
        num: 3,
        tool: 'Maigret',
        href: '/osint?section=username&q=Maigret',
        action: 'For deeper coverage including dark web and country-specific platforms, run Maigret.',
        why: 'Maigret covers 3,000+ platforms — overkill for most cases, essential for thorough work.',
      },
      {
        num: 4,
        tool: 'Manual verification',
        action: 'Visit the top-confirmed profiles in a sandboxed browser. Capture screenshots with Hunchly or SingleFile.',
        why: 'Automated tools confirm registration; manual verification confirms it\'s actually the same person (profile photo, bio, posting history).',
        notes: 'Use a non-attributable browser profile. Some platforms (LinkedIn) record profile views.',
      },
      {
        num: 5,
        tool: 'EpieOS',
        href: '/osint?section=email&q=EpieOS',
        action: 'If you find an associated email anywhere (signup pages, public profiles, leaks), run EpieOS on it.',
        why: 'EpieOS will reveal the Google account display name + photo behind a Gmail address, often producing a real name.',
      },
      {
        num: 6,
        tool: 'Have I Been Pwned',
        href: '/osint?section=email&q=Have+I+Been+Pwned',
        action: 'Check found emails against breach databases.',
        why: 'Breach exposure can corroborate identity, reveal password reuse patterns, and surface other accounts.',
      },
      {
        num: 7,
        tool: 'Image OSINT',
        href: '/osint?section=image',
        action: 'Take any profile photo and run it through reverse image search (Google + Yandex + PimEyes if available).',
        why: 'A profile photo reused on a LinkedIn account is the single most common identity link. Yandex face match is dramatically better than Google for this.',
      },
    ],
    pitfalls: [
      'Username collisions are real — same handle can be different people on different platforms. Verify with profile content, not just registration.',
      'Avoid logging in to platforms with attributable accounts. Most major sites log profile views to the viewed user.',
      'Profile photos from years ago may not match current ones. Use TinEye to find earliest occurrence and approximate when the photo was first used.',
    ],
  },

  // ─── 2. Domain / org footprint ───────────────────────────────────────────────
  {
    id: 'domain-footprint',
    title: 'Map an organization\'s external footprint from a single domain',
    goal: 'You have an organization\'s primary domain and want to enumerate everything reachable from it — subdomains, hosting, leaked emails, exposed services.',
    inputs: ['One root domain (e.g. acme.com)'],
    outputs: [
      'Subdomain list with current and historical resolution',
      'Hosting / cloud provider attribution',
      'Open service inventory (banners, versions, CVEs)',
      'Corporate email pattern and discovered addresses',
      'Public-facing employee list',
    ],
    steps: [
      {
        num: 1,
        tool: 'crt.sh',
        href: '/osint?section=infra&q=crt.sh',
        action: 'Query certificate transparency logs for all subdomains that have ever had a cert.',
        why: 'Every internet-facing host that ever had an HTTPS cert appears here — including staging, internal, and short-lived subdomains. Free, no rate limit, comprehensive.',
        notes: 'Search %.acme.com for wildcard match. Export to file for downstream processing.',
      },
      {
        num: 2,
        tool: 'Shodan',
        href: '/osint?section=infra&q=Shodan',
        action: 'Search Shodan for the org\'s IP ranges and exposed services.',
        why: 'Reveals what\'s actually reachable from the internet right now, with banners and known CVEs. Better than nmap because it\'s historical and doesn\'t generate scan traffic.',
        notes: 'org:"Acme Corp", ssl.cert.subject.cn:acme.com, hostname:acme.com — try all three.',
      },
      {
        num: 3,
        tool: 'Censys',
        href: '/osint?section=infra&q=Censys',
        action: 'Cross-check against Censys, which often has different coverage than Shodan.',
        why: 'Same internet, different scanners. Catches things one platform missed. Stronger on certificate and structured data.',
      },
      {
        num: 4,
        tool: 'DomainTools / ViewDNS',
        href: '/osint?section=infra&q=ViewDNS',
        action: 'Look up reverse-IP and DNS history.',
        why: 'Reveals what other domains share hosting (potential affiliates / shadow IT) and how the infrastructure has shifted over time.',
      },
      {
        num: 5,
        tool: 'Hunter.io',
        href: '/osint?section=email&q=Hunter.io',
        action: 'Pull the corporate email pattern and any publicly-known email addresses for the org.',
        why: 'Determines the email format (firstname.lastname@acme.com, etc.) which feeds phishing assessments or further person-pivots.',
      },
      {
        num: 6,
        tool: 'LinkedIn',
        href: '/osint?section=social&q=LinkedIn',
        action: 'site:linkedin.com "Acme Corp" via Google. Dorking from outside avoids LinkedIn\'s view-tracking.',
        why: 'Public employee list, job titles, recent hires. Recent job postings reveal technology stack and internal team structure.',
      },
      {
        num: 7,
        tool: 'TruffleHog / GitHub dorks',
        href: '/osint?section=code&q=TruffleHog',
        action: 'Search GitHub for "acme" / "@acme.com" / company-specific strings in public code.',
        why: 'Employees occasionally leak credentials, internal hostnames, or proprietary code in personal repos. Surprisingly common.',
      },
      {
        num: 8,
        tool: 'Wayback Machine',
        href: '/osint?section=archive&q=Wayback+Machine',
        action: 'Pull historical snapshots of the org\'s website.',
        why: 'Old versions reveal personnel that left, products that were quietly killed, and former branding/positioning. Useful for "what did they used to do?".',
      },
    ],
    pitfalls: [
      'Subdomain enumeration produces noise — wildcard DNS makes many "subdomains" identical. Confirm each is distinct.',
      'Shodan / Censys data can lag by hours-to-days. Things may have changed since the scan.',
      'Don\'t actively scan the target without authorization — passive sources (Shodan, Censys, crt.sh) are fine; nmap is not.',
    ],
  },

  // ─── 3. Image verification ───────────────────────────────────────────────────
  {
    id: 'image-verification',
    title: 'Verify or geolocate an image',
    goal: 'You have an image and a claim about it (where it was taken, when, by whom). You want to prove or disprove the claim.',
    inputs: ['One image file or URL', 'The claim being made about it'],
    outputs: [
      'Earliest known online occurrence of the image',
      'EXIF metadata if present (camera, date, GPS)',
      'Geolocation evidence (matched landmarks, sun position, weather)',
      'Verdict: original / repurposed / staged / manipulated',
    ],
    steps: [
      {
        num: 1,
        tool: 'ExifTool',
        href: '/osint?section=document&q=ExifTool',
        action: 'Run ExifTool on the image to extract all metadata.',
        why: 'Original captures often retain GPS coordinates, camera model, creation timestamp, and editing software fingerprint. Most social-media uploads strip this, so its presence is itself a clue.',
        notes: 'exiftool image.jpg. Pay attention to Software, GPS*, and CreateDate. Edited-in-Photoshop will show.',
      },
      {
        num: 2,
        tool: 'TinEye',
        href: '/osint?section=image&q=TinEye',
        action: 'Reverse image search on TinEye, sorted by oldest first.',
        why: 'Reveals if the image existed before its claimed origin date — the single fastest fake-detection signal. TinEye is better than Google for "find the original".',
      },
      {
        num: 3,
        tool: 'Google + Yandex + Bing reverse search',
        href: '/osint?section=image',
        action: 'Run the image through all three reverse engines (RevEye does this in one click).',
        why: 'Different indexes find different things. Yandex is dramatically better for faces; Google is best for general web; Bing fills gaps in non-English sources.',
        notes: 'Cropping the image to a distinctive element before searching often improves results.',
      },
      {
        num: 4,
        tool: 'FotoForensics / Forensically',
        href: '/osint?section=verify&q=Forensically',
        action: 'Run Error Level Analysis (ELA) and noise analysis.',
        why: 'Inconsistencies in JPEG compression artifacts indicate the image was edited. ELA is not definitive but a strong negative signal — a region with very different compression than its surroundings was likely added.',
      },
      {
        num: 5,
        tool: 'SunCalc',
        href: '/osint?section=verify&q=SunCalc',
        action: 'If the image is outdoors and shows shadows: measure shadow direction, then check SunCalc against the claimed location and time.',
        why: 'A staged or relocated image will have shadows pointing the wrong way for the claimed lat/lon/time. Triangulating the actual location from shadows is a Bellingcat staple.',
      },
      {
        num: 6,
        tool: 'WolframAlpha (weather)',
        href: '/osint?section=verify&q=WolframAlpha',
        action: 'Query historical weather for the claimed location and date.',
        why: 'Claimed "sunny day" with overcast in the historical record = mismatch. Rain / snow / fog visible in the image that didn\'t actually occur = mismatch.',
      },
      {
        num: 7,
        tool: 'Manual geolocation',
        href: '/osint?section=verify&q=Plonkit',
        action: 'Look for distinctive visual cues — road markings, license plates, vegetation, utility poles, signage. Compare against Plonkit\'s country-identification guides.',
        why: 'When other steps fail, manual interpretation of visual cues narrows the country / region. Then Mapillary or KartaView for street-level matching.',
      },
      {
        num: 8,
        tool: 'Bellingcat OIT',
        href: '/osint?section=verify&q=Bellingcat',
        action: 'For tough cases, walk the Bellingcat Online Investigations Toolkit for techniques specific to your image type.',
        why: 'Bellingcat is the reference institution. If you\'re stuck, the toolkit has dedicated techniques for satellite verification, video verification, etc.',
      },
    ],
    pitfalls: [
      'Compression and resizing destroy EXIF and weaken ELA. A version on Twitter is harder to analyze than the source.',
      'Reverse image search misses images that have only been posted in private or end-to-end-encrypted contexts.',
      'AI-generated images defeat traditional reverse-search entirely. Consider whether the image itself might be synthetic (look at hands, text in image, reflections).',
    ],
  },

  // ─── 4. Email enrichment ─────────────────────────────────────────────────────
  {
    id: 'email-enrichment',
    title: 'Enrich a single email address into a full profile',
    goal: 'You have an email address (from a signup, a leaked list, a contact form) and want to know who owns it and where else they appear online.',
    inputs: ['One email address (e.g. j.smith@gmail.com)'],
    outputs: [
      'Real name / display name behind the email',
      'List of services where the email is registered',
      'Breach exposure history',
      'Associated usernames and social profiles',
      'Risk / reputation signal',
    ],
    steps: [
      {
        num: 1,
        tool: 'EpieOS',
        href: '/osint?section=email&q=EpieOS',
        action: 'Run EpieOS as the very first step.',
        why: 'For Gmail addresses specifically, EpieOS reveals the Google account display name and profile photo immediately. This is often the single biggest unlock.',
      },
      {
        num: 2,
        tool: 'Holehe',
        href: '/osint?section=email&q=Holehe',
        action: 'Run Holehe to silently check ~120 services for account presence.',
        why: 'Holehe uses signup-flow side-channels — it tells you whether an account exists without triggering visible auth attempts on the target email.',
        notes: 'pip install holehe. Output is a list of "registered" / "not registered" per service.',
      },
      {
        num: 3,
        tool: 'Have I Been Pwned',
        href: '/osint?section=email&q=Have+I+Been+Pwned',
        action: 'Check the email against HIBP\'s 12B+ breach records.',
        why: 'Each breach lists what data classes were exposed (passwords, phones, addresses). Breach selection also reveals platform usage history.',
      },
      {
        num: 4,
        tool: 'h8mail',
        href: '/osint?section=email&q=h8mail',
        action: 'For paid breach sources (Dehashed, IntelX), use h8mail with API keys.',
        why: 'These sources expose plaintext passwords from older breaches when allowed. Password patterns reveal naming conventions that pivot to other accounts.',
      },
      {
        num: 5,
        tool: 'EmailRep',
        href: '/osint?section=email&q=EmailRep',
        action: 'Get a reputation/risk score from EmailRep.',
        why: 'Aggregates "is this email seen in scams, fraud, spam?" into a single signal. Useful when triaging inbound contact rather than building a profile.',
      },
      {
        num: 6,
        tool: 'Derive likely usernames',
        action: 'Take the local-part of the email (j.smith, jsmith2024, etc.) and treat it as a username candidate. Run through Sherlock / WhatsMyName.',
        why: 'Email local-parts are very often reused as usernames on other platforms. This is the fastest pivot from "email" to "all their accounts".',
      },
      {
        num: 7,
        tool: 'Phonebook.cz / IntelX',
        href: '/osint?section=email&q=Phonebook.cz',
        action: 'Search Phonebook.cz and IntelX for the email across leaked datasets, paste sites, and dark-web sources.',
        why: 'Deeper coverage than HIBP. Paste-site exposure can include code snippets and credentials never indexed by mainstream search.',
      },
    ],
    pitfalls: [
      'Email enumeration on social-login services (Facebook, Google) can notify the target via login alerts. Holehe and EpieOS specifically avoid this; not all tools do.',
      'Catch-all / disposable email domains (mailinator.com, simplelogin.io, etc.) reveal little — multiple unrelated people use the same prefix.',
      'Re-derive your usernames carefully — common names like "jsmith" hit thousands of unrelated people on every platform.',
    ],
  },

  // ─── 5. Person of interest profile ───────────────────────────────────────────
  {
    id: 'person-profile',
    title: 'Build a profile from a real name + city',
    goal: 'You have a first/last name and an approximate location, and you want to find their online presence and corroborate identity.',
    inputs: ['First name and last name', 'Approximate city / metro / region'],
    outputs: [
      'Confirmed social media accounts',
      'Photo / face match across platforms',
      'Employer and professional history',
      'Public-record context (address history, age range, associates)',
      'Phone numbers and email addresses where lawfully obtainable',
    ],
    steps: [
      {
        num: 1,
        tool: 'Google site dorks',
        href: '/osint?section=search',
        action: 'Build name + location queries: site:linkedin.com "First Last" "City", site:facebook.com, site:twitter.com.',
        why: 'Dorking from outside the platform avoids view-tracking. For common names, location is critical for disambiguation.',
      },
      {
        num: 2,
        tool: 'LinkedIn (logged out)',
        href: '/osint?section=social&q=LinkedIn',
        action: 'Use Google\'s site dork to access LinkedIn profiles without logging in.',
        why: 'Logged-in viewing notifies the target unless you have Sales Navigator. A site dork shows the headline + summary without triggering view tracking.',
      },
      {
        num: 3,
        tool: 'People-search aggregators',
        href: '/osint?section=people',
        action: 'Use Spokeo / Intelius / TruePeopleSearch for address history, age, and known relatives.',
        why: 'Aggregators compile US public records (voter rolls, property records, court filings) into searchable form. Confirms / disambiguates from other people sharing the name.',
        notes: 'Aggregator data is often stale by 1-2 years. Address history is the most reliable field. Coverage varies dramatically outside the US.',
      },
      {
        num: 4,
        tool: 'Image OSINT (face match)',
        href: '/osint?section=image&q=Yandex',
        action: 'Pull a profile photo from a confirmed account and reverse-search via Yandex and PimEyes.',
        why: 'Yandex face match is dramatically more accurate than Google\'s. PimEyes is purpose-built for face match across the web. These find the same person on accounts they used a different name on.',
      },
      {
        num: 5,
        tool: 'Username pivot',
        action: 'For every account you confirm, extract the username. Run the username pivot playbook on it.',
        why: 'People reuse usernames more than they reuse names. A username from one platform often unlocks five more.',
        href: '/osint?section=workflows&q=username-pivot',
      },
      {
        num: 6,
        tool: 'Phone OSINT',
        href: '/osint?section=phone',
        action: 'If you have a phone number from any source, run it through Truecaller, Whitepages, and NumLookup.',
        why: 'Reverse phone reveals the carrier-saved or crowd-sourced name. Truecaller is most accurate; NumLookup distinguishes VoIP / burner numbers.',
      },
      {
        num: 7,
        tool: 'Corporate intel',
        href: '/osint?section=corp',
        action: 'If the target is associated with a business (LLC member, corporate officer), check OpenCorporates, state SOS databases, and SEC filings.',
        why: 'Corporate filings are notarized public records — beneficial owner, address, registered agent. The most rigorous source for "are they who they say they are?".',
      },
      {
        num: 8,
        tool: 'Document the chain of evidence',
        href: '/osint?section=archive&q=Hunchly',
        action: 'Use Hunchly or SingleFile to archive every page visited during the investigation.',
        why: 'Online content disappears. A finding without an archived snapshot is unproven the moment the source goes offline.',
      },
    ],
    pitfalls: [
      'Sock-puppet / clean investigation account is mandatory. Your real LinkedIn account viewing your target\'s profile is a notification.',
      'People-search aggregators have stale data and high false-positive rates for common names. Cross-confirm with three independent sources before believing a fact.',
      'PimEyes and similar facial-recognition tools are subject to evolving legal restrictions (IL BIPA, EU AI Act). Use within authorized investigative scope only.',
      'Don\'t conflate the target with namesakes. "John Smith in Boston" matches ~5,000 people. Lock in identity via photo or unique identifier before profile-building.',
    ],
  },
]
