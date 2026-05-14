// ─── Search Operators ────────────────────────────────────────────────────────

export interface SearchOperator {
  operator: string
  syntax: string
  example: string
  description: string
  engine: string[]
}

export const searchOperators: SearchOperator[] = [
  // Core operators
  { operator: 'site:', syntax: 'site:domain.com query', example: 'site:linkedin.com "John Smith" "Redstone Arsenal"', description: 'Restrict results to specific domain. Combine with quotes for precision.', engine: ['Google', 'Bing', 'DuckDuckGo'] },
  { operator: '"exact phrase"', syntax: '"word1 word2"', example: '"operational security" "Huntsville" filetype:pdf', description: 'Force exact phrase match. Enclose in double quotes.', engine: ['Google', 'Bing', 'DuckDuckGo'] },
  { operator: 'filetype:', syntax: 'filetype:ext query', example: 'site:army.mil filetype:pdf "TSCM" 2023', description: 'Filter by file extension: pdf, docx, xlsx, pptx, csv, sql, log, txt, conf', engine: ['Google', 'Bing'] },
  { operator: 'inurl:', syntax: 'inurl:string query', example: 'inurl:admin inurl:login site:gov', description: 'URL must contain string. Useful for finding login pages, admin panels, exposed directories.', engine: ['Google', 'Bing'] },
  { operator: 'intitle:', syntax: 'intitle:string', example: 'intitle:"index of" "parent directory" "passwords"', description: 'Page title must contain string. Classic for open directory indexing.', engine: ['Google', 'Bing', 'DuckDuckGo'] },
  { operator: 'intext:', syntax: 'intext:string', example: 'intext:"api_key" site:github.com', description: 'Page body must contain string. Complements intitle.', engine: ['Google'] },
  { operator: 'cache:', syntax: 'cache:url', example: 'cache:targetsite.com/page', description: 'Show Google\'s cached copy. Useful when target has removed content.', engine: ['Google'] },
  { operator: 'related:', syntax: 'related:domain.com', example: 'related:palantir.com', description: 'Show sites Google considers related/similar. Maps competitive landscape.', engine: ['Google'] },
  { operator: 'link:', syntax: 'link:url', example: 'link:targetsite.com', description: 'Find pages linking to URL. (Deprecated in Google — use for Bing)', engine: ['Bing'] },
  { operator: 'OR / |', syntax: 'term1 OR term2', example: '"John Smith" (FBI OR "Federal Bureau") site:linkedin.com', description: 'Boolean OR — either term must appear. Must be uppercase.', engine: ['Google', 'Bing'] },
  { operator: '- (exclude)', syntax: '-term', example: '"John Smith" Alabama -baseball', description: 'Exclude pages containing term. Reduces false positives.', engine: ['Google', 'Bing', 'DuckDuckGo'] },
  { operator: '* (wildcard)', syntax: 'phrase * phrase', example: '"worked at * from 2018"', description: 'Wildcard within quoted phrase. Fills in unknown words.', engine: ['Google'] },
  { operator: 'before:/after:', syntax: 'query before:YYYY-MM-DD', example: 'site:twitter.com "John Smith" before:2020-01-01', description: 'Date range filtering. Useful for historical OSINT.', engine: ['Google'] },
  { operator: 'numrange:', syntax: 'numrange:low-high', example: 'SSN numrange:555-00-0000-555-99-9999', description: 'Search for numbers in range. Rarely needed but occasionally useful for document hunting.', engine: ['Google'] },
  // Compound dorks
  { operator: 'Open dir dork', syntax: 'intitle:"index of" parent directory', example: 'intitle:"index of" "parent directory" site:targetdomain.com', description: 'Classic open directory listing. Finds exposed file servers. Add filename terms to narrow.', engine: ['Google', 'Bing'] },
  { operator: 'Login page dork', syntax: 'inurl:login site:target', example: 'inurl:login OR inurl:signin OR inurl:admin site:targetdomain.com', description: 'Find authentication endpoints. Pair with exposed credential searches.', engine: ['Google', 'Bing'] },
  { operator: 'Config file dork', syntax: 'filetype:conf OR filetype:env', example: 'filetype:env OR filetype:conf "DB_PASSWORD" site:github.com', description: 'Exposed configuration files. Commonly contain credentials, API keys, database strings.', engine: ['Google', 'Bing'] },
  { operator: 'Camera dork', syntax: 'inurl:/view/view.shtml', example: 'intitle:"webcamXP" OR inurl:"/view/view.shtml" OR intitle:"Live View / - AXIS"', description: 'Exposed IP cameras. Cross-reference with Shodan for confirmation.', engine: ['Google'] },
  { operator: 'Document metadata dork', syntax: 'filetype:pdf site:org "author"', example: 'filetype:pdf site:target.gov "prepared by"', description: 'Documents often contain author names, email addresses, internal paths in metadata.', engine: ['Google', 'Bing'] },
]

// ─── People Search Sources ────────────────────────────────────────────────────

export interface PeopleSource {
  name: string
  url: string
  dataTypes: string[]
  strengths: string[]
  limitations: string[]
  cost: string
  optOutUrl?: string
  notes: string
}

export const peopleSources: PeopleSource[] = [
  {
    name: 'Spokeo',
    url: 'spokeo.com',
    dataTypes: ['Name', 'Address history', 'Phone', 'Email', 'Relatives', 'Social profiles'],
    strengths: ['Good relative/associate mapping', 'Address history depth', 'Social media linkage'],
    limitations: ['Often outdated', 'Aggregates errors from source data', 'Opt-out possible'],
    cost: '$10–30/month',
    optOutUrl: 'spokeo.com/optout',
    notes: 'Strong for associate/relative mapping. Use address history to build location timeline.',
  },
  {
    name: 'Intelius',
    url: 'intelius.com',
    dataTypes: ['Name', 'Address', 'Phone', 'Criminal records', 'Employment', 'Education'],
    strengths: ['Employment and education history', 'Criminal record access', 'Court records'],
    limitations: ['Criminal records incomplete (varies by state)', 'Expensive for deep reports'],
    cost: '$25–40/report or subscription',
    optOutUrl: 'intelius.com/optout',
    notes: 'Better employment/education data than Spokeo. Good for CI vetting baseline.',
  },
  {
    name: 'BeenVerified',
    url: 'beenverified.com',
    dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Social', 'Relatives', 'Vehicle'],
    strengths: ['Vehicle registration data', 'Comprehensive social links', 'Email lookup'],
    limitations: ['Vehicle data often stale', 'High error rate on common names'],
    cost: '$17–26/month',
    optOutUrl: 'beenverified.com/opt-out',
    notes: 'Vehicle registration access is differentiator vs competitors. Useful for parking lot/fleet OSINT.',
  },
  {
    name: 'TruthFinder',
    url: 'truthfinder.com',
    dataTypes: ['Criminal', 'Address', 'Phone', 'Relatives', 'Social', 'Assets'],
    strengths: ['Darker web record access', 'Asset/property linkage', 'Arrest records'],
    limitations: ['Marketing-heavy UI', 'Results require manual review for accuracy'],
    cost: '$28/month',
    optOutUrl: 'truthfinder.com/opt-out',
    notes: 'Claims broader dark web aggregation. Asset/property data useful for financial OSINT.',
  },
  {
    name: 'PeopleFinder / PeekYou',
    url: 'peekYou.com / peoplefinder.com',
    dataTypes: ['Social profiles', 'Username linkage', 'Name', 'Email'],
    strengths: ['Username-to-identity mapping', 'Social profile aggregation', 'Free tier useful'],
    limitations: ['Less address/phone depth than competitors', 'Social data quality varies'],
    cost: 'Free (limited) / $20/month',
    notes: 'PeekYou excels at linking usernames across platforms. Key tool for handle-to-identity correlation.',
  },
  {
    name: 'Pipl (Pro)',
    url: 'pipl.com',
    dataTypes: ['Deep web records', 'Social', 'Email', 'Phone', 'Address', 'Professional'],
    strengths: ['Deep web indexing beyond surface aggregators', 'High confidence scoring', 'API access'],
    limitations: ['Expensive (enterprise-only)', 'Requires account approval', 'Not consumer-facing'],
    cost: 'Enterprise ($1,000+/year)',
    notes: 'Professional standard for thorough people search. Indexes sources most aggregators miss. If you have access, use it first.',
  },
  {
    name: 'LinkedIn (manual)',
    url: 'linkedin.com',
    dataTypes: ['Employment history', 'Education', 'Connections', 'Endorsements', 'Publications', 'Groups'],
    strengths: ['Employment history is usually accurate (self-reported)', 'Connection graph = associate mapping', 'Groups reveal interests/affiliations'],
    limitations: ['Requires account', 'View tracking possible', 'Privacy-restricted profiles block data'],
    cost: 'Free (limited) / Sales Navigator $80/month',
    notes: 'Use Sales Navigator for full Boolean search without view limits. Search by company + title to find current employees. Use Google "site:linkedin.com" to avoid login requirements.',
  },
  {
    name: 'Whitepages / AnyWho',
    url: 'whitepages.com / anywho.com',
    dataTypes: ['Phone', 'Address', 'Name lookup'],
    strengths: ['Reverse phone lookup (name from number)', 'Reverse address (residents at address)', 'Free tier'],
    limitations: ['Cell phones often unlisted', 'VoIP numbers return carrier, not owner', 'VOIP vs landline not always indicated'],
    cost: 'Free (limited) / $5/report',
    optOutUrl: 'whitepages.com/suppression_requests',
    notes: 'Best for landline reverse lookup. Pairs well with CallerID services for cell phones.',
  },
  {
    name: 'PACER (federal courts)',
    url: 'pacer.gov',
    dataTypes: ['Federal civil/criminal case records', 'Bankruptcy', 'Appellate', 'Docket entries'],
    strengths: ['Authoritative federal court records', 'Associates named in litigation', 'Financial details in bankruptcy filings', 'Alias names in criminal records'],
    limitations: ['Federal courts only (no state)', '$0.10/page fee', 'Requires registration'],
    cost: '$0.10/page (free under $30/quarter)',
    notes: 'Free accounts with quarterly usage under $30 are effectively free for targeted lookups. Party search finds all cases a person appears in. Critical for CI background.',
  },
  {
    name: 'State court records',
    url: 'Varies by state',
    dataTypes: ['Civil', 'Criminal', 'Traffic', 'Domestic', 'Probate', 'Small claims'],
    strengths: ['State-level criminal and civil cases PACER misses', 'Often includes addresses from filings', 'Associates as co-parties or witnesses'],
    limitations: ['No unified system — must query state by state', 'Many states require in-person or fee-based access', 'Varying retention periods'],
    cost: 'Varies ($0–$15/search)',
    notes: 'Most identity fraud, DUI, domestic cases are state-level. CourtListener (free) aggregates some. Individual state systems: Texas = search.txcourts.gov, Florida = myfloridalegal.com',
  },
]

// ─── Sock Puppet / Persona OPSEC ─────────────────────────────────────────────

export interface PersonaStep {
  phase: string
  step: string
  actions: string[]
  warnings: string[]
}

export const personaSteps: PersonaStep[] = [
  {
    phase: 'Infrastructure',
    step: 'Dedicated hardware and network',
    actions: [
      'Use a dedicated device not linked to any personal accounts or browsing history',
      'VPN on at all times — never access persona from your real IP',
      'Ideally: separate VPN provider from your personal VPN, different payment method',
      'Consider Tails OS or a dedicated VM with VPN for maximum separation',
      'Mobile: separate SIM / device for persona SMS verification — never personal phone',
      'Payment: prepaid card purchased with cash, or virtual card service (Privacy.com) not linked to real identity',
    ],
    warnings: ['One slip — one login from your real IP — burns the persona permanently', 'Browser fingerprinting can link personas even across different accounts if same browser/device'],
  },
  {
    phase: 'Infrastructure',
    step: 'Network and browser configuration',
    actions: [
      'Firefox with uBlock Origin, canvas blocker, and user-agent spoofer',
      'Never log into any real accounts on the persona browser profile',
      'Disable WebRTC (IP leak vector) in about:config: media.peerconnection.enabled = false',
      'Set consistent timezone and screen resolution matching your VPN exit country',
      'Use realistic VPN exit node: same city/country as persona backstory',
      'Consider residential proxy (not datacenter IP) — many platforms flag datacenter IPs',
    ],
    warnings: ['Canvas fingerprinting can identify browser across sites even with VPN', 'Clock skew between system clock and VPN timezone is a known de-anonymization vector'],
  },
  {
    phase: 'Identity creation',
    step: 'Build a coherent backstory',
    actions: [
      'Choose persona consistent with your investigation target\'s community (industry, location, interests)',
      'Generate realistic name: use real name statistics for target demographic (census.gov name data)',
      'Use This Person Does Not Exist (thispersondoesnotexist.com) for profile photo — AI-generated faces have no reverse image match',
      'Create backstory: city, employer, school, interests — all must be verifiable but not easily falsifiable',
      'Build LinkedIn with employment at real companies in correct city — do not fabricate connections',
      'Maintain consistent age, location, and timeline across all platforms',
    ],
    warnings: ['AI face detectors (Hive Moderation, FotoForensics) can sometimes flag synthetic images', 'Backstory inconsistencies across platforms are the most common exposure vector'],
  },
  {
    phase: 'Account creation',
    step: 'Platform registration sequence',
    actions: [
      'Email first: ProtonMail or Tutanota with VPN active — no recovery phone/email linked to real identity',
      'Phone number: use VoIP service (TextNow, Google Voice via persona email) or physical burner SIM',
      'Create accounts in order: email → phone-verified accounts (Twitter, Instagram) → non-phone accounts (Reddit, forums)',
      'Age accounts before use: minimum 2–4 weeks of light activity before targeting',
      'Never create multiple persona accounts simultaneously from same IP',
      'Use different passwords, not generated by your personal password manager',
    ],
    warnings: ['Many platforms (Meta, Twitter/X) flag accounts created from same IP as existing accounts', 'SMS verification via VoIP increasingly blocked by major platforms — physical SIM often required'],
  },
  {
    phase: 'Persona development',
    step: 'Build authentic activity history',
    actions: [
      'Post on low-stakes topics for 2–4 weeks before engaging with target community',
      'Follow, like, and interact with real accounts in the persona\'s interest area',
      'Repost/share content naturally — do not only post original content (suspicious for new accounts)',
      'Build follower count organically — reciprocal follows in niche communities',
      'Establish presence on forums/Reddit relevant to backstory before approaching target',
      'Do not accelerate activity near investigation targets — maintain natural cadence',
    ],
    warnings: ['Sudden interest shift (persona becomes interested in exact target topic immediately) is a behavioral indicator', 'Posting cadence that exactly matches your work hours is an exposure vector'],
  },
  {
    phase: 'Operational',
    step: 'Engagement hygiene',
    actions: [
      'Never use persona to directly ask investigative questions — indirect elicitation only',
      'Document all interactions with timestamps and screenshots immediately',
      'Do not share information between personas (one persona knows what another knows)',
      'Maintain persona even when not actively investigating — it must appear to have a life',
      'If a target becomes suspicious, disengage immediately — do not try to recover the interaction',
      'Keep a legend document: full backstory, accounts, passwords (stored securely, not in personal tools)',
    ],
    warnings: ['Elicitation that sounds like an interview will alert a counterintelligence-aware target', 'Cross-contamination between personas is a common investigator error under time pressure'],
  },
]

// ─── Username Enumeration ─────────────────────────────────────────────────────

export interface UsernameSource {
  name: string
  url: string
  method: string
  coverage: string
  notes: string
}

export const usernameSources: UsernameSource[] = [
  { name: 'Sherlock', url: 'github.com/sherlock-project/sherlock', method: 'CLI tool (Python)', coverage: '400+ platforms', notes: 'python3 sherlock.py username — outputs found profiles. Run locally. Best broad-coverage tool.' },
  { name: 'WhatsMyName', url: 'whatsmyname.app / github.com/WebBreacher/WhatsMyName', method: 'Web + CLI', coverage: '600+ platforms', notes: 'Community-maintained site list. Web UI for quick checks. CLI version for scripting. More platforms than Sherlock.' },
  { name: 'Maigret', url: 'github.com/soxoj/maigret', method: 'CLI tool (Python)', coverage: '3,000+ platforms including dark web', notes: 'Sherlock fork with massively expanded site list including dark web, adult sites, country-specific platforms. pip install maigret' },
  { name: 'Namechk', url: 'namechk.com', method: 'Web', coverage: '100+ social/domain/app platforms', notes: 'Fast web-based check. Good for initial sweep. Shows availability = not registered (may be taken by different person).' },
  { name: 'KnowEm', url: 'knowem.com', method: 'Web', coverage: '500+ platforms', notes: 'Similar to Namechk. Cross-reference both for platform coverage gaps.' },
  { name: 'Instant Username', url: 'instantusername.com', method: 'Web', coverage: '100+ platforms', notes: 'Real-time checking. Faster UI than KnowEm for quick lookups.' },
  { name: 'PeekYou', url: 'peekyou.com', method: 'Web', coverage: 'Social platforms', notes: 'Specializes in correlating username → real identity. "Username" search tab aggregates profiles across sites.' },
  { name: 'Social Searcher', url: 'social-searcher.com', method: 'Web', coverage: 'Major social platforms', notes: 'Real-time social media search by keyword/handle. Monitors mentions.' },
  { name: 'GitHub user search', url: 'github.com/search?type=users', method: 'Web', coverage: 'GitHub', notes: 'Code commits expose real name, email, organization, location. Profile README often contains contact info and projects.' },
  { name: 'Email from username (dehashed)', url: 'dehashed.com', method: 'Web (paid)', coverage: 'Breach databases', notes: 'Username → email → password hash lookup from breach data. $6/month. Critical for CI use. Cross-reference with Have I Been Pwned.' },
]

// ─── Image OSINT ─────────────────────────────────────────────────────────────

export interface ImageTool {
  name: string
  url: string
  method: string
  bestFor: string
  notes: string
}

export const imageTools: ImageTool[] = [
  { name: 'Google Reverse Image', url: 'images.google.com', method: 'Upload or URL', bestFor: 'Broad web coverage, finding exact and near-duplicate images', notes: 'Drag image onto search bar or right-click → "Search image with Google". Shows where image appears online. Crop to face for better face matching.' },
  { name: 'Bing Visual Search', url: 'bing.com/visualsearch', method: 'Upload or URL', bestFor: 'Different index from Google — finds images Google misses', notes: 'Always run both Google AND Bing. Different crawling = different results. Often better for non-English sites.' },
  { name: 'Yandex Image Search', url: 'yandex.com/images', method: 'Upload or URL', bestFor: 'Face recognition, Eastern European content, best facial matching', notes: 'Superior face recognition vs Google/Bing. Often returns real identity for face photos. Best tool for identifying unknown individuals from photos.' },
  { name: 'TinEye', url: 'tineye.com', method: 'Upload or URL', bestFor: 'Finding earliest occurrence of image (date verification)', notes: 'Shows all instances by oldest first. Proves whether an image existed before a claimed date. Useful for fabricated evidence detection.' },
  { name: 'PimEyes', url: 'pimeyes.com', method: 'Upload (face only)', bestFor: 'Facial recognition search across web', notes: 'Strongest commercial facial recognition OSINT tool. Finds faces on websites, social media, news. Subscription required for full results (~$30/month). CI-relevant.' },
  { name: 'FaceCheck.ID', url: 'facecheck.id', method: 'Upload (face only)', bestFor: 'Free facial recognition alternative to PimEyes', notes: 'Free tier with limited results. Searches social media and public web. Less coverage than PimEyes but useful for initial checks.' },
  { name: 'ExifTool', url: 'exiftool.org / cli', method: 'CLI / GUI', bestFor: 'Extracting full EXIF metadata from images', notes: 'exiftool image.jpg — extracts GPS coords, camera model, datetime, software, author. GPS present in ~30% of unmodified smartphone photos. Always check EXIF before assuming no location data.' },
  { name: 'Jeffrey\'s Exif Viewer', url: 'exif.regex.info/exif.cgi', method: 'Web upload', bestFor: 'Quick web-based EXIF extraction with map display', notes: 'Plots GPS coords on map automatically. No installation needed. Good for quick checks.' },
  { name: 'Google Maps / Earth', url: 'maps.google.com', method: 'Manual geolocation', bestFor: 'Photo geolocation from landmarks, shadows, terrain', notes: 'Street View for ground-level comparison. Compare building architecture, signage, vegetation, power lines, terrain. Shadow direction/length can estimate time and hemisphere.' },
  { name: 'SunCalc', url: 'suncalc.org', method: 'Web', bestFor: 'Sun position analysis for photo time/location verification', notes: 'Enter location + date → shows sun azimuth and elevation. Compare photo shadows to verify claimed time/location. Standard in imagery forensics.' },
  { name: 'Forensically', url: '29a.ch/photo-forensics', method: 'Web upload', bestFor: 'Image manipulation detection (clone detection, ELA)', notes: 'Error Level Analysis (ELA) detects image compositing. Clone detection finds copy-pasted regions. Useful for fabricated evidence screening.' },
  { name: 'FotoForensics', url: 'fotoforensics.com', method: 'Web upload', bestFor: 'ELA analysis, metadata, hidden data', notes: 'Similar to Forensically. Also shows EXIF and checks for steganography indicators.' },
]

// ─── Social Media Investigation ───────────────────────────────────────────────

export interface SocialPlatform {
  platform: string
  keyTechniques: string[]
  tools: { name: string; url: string; notes: string }[]
  opsecNotes: string[]
}

export const socialPlatforms: SocialPlatform[] = [
  {
    platform: 'LinkedIn',
    keyTechniques: [
      'site:linkedin.com "Name" "Company" — avoids login, no view tracking',
      'Sales Navigator Boolean: ("security" OR "intelligence") AND "Redstone" — full search without being seen',
      'Connection graph: mutual connections reveal organization network structure',
      'Group memberships expose professional associations and interests',
      'Job history gaps often indicate classified/sensitive employment',
      'Endorsements reveal actual skills vs claimed — who endorsed for what',
      'Post/article history reveals opinions, travel, conferences attended',
    ],
    tools: [
      { name: 'LinkedIn Sales Navigator', url: 'linkedin.com/sales', notes: 'Full Boolean search, no profile view notifications, see who viewed you. $80/month.' },
      { name: 'Phantom Buster', url: 'phantombuster.com', notes: 'LinkedIn data extraction automation. Bulk profile scraping, connection export.' },
      { name: 'IntelX LinkedIn search', url: 'intelx.io', notes: 'Historical LinkedIn data including deleted profiles.' },
    ],
    opsecNotes: [
      'Profile views are tracked and visible to subject unless using Sales Navigator or private mode',
      'Private mode hides your identity but subject still sees "LinkedIn member" viewed',
      'Google cache/site: search is the cleanest approach — no LinkedIn tracking',
      'Downloading someone\'s connections requires connecting first — an investigative step that burns access',
    ],
  },
  {
    platform: 'Twitter / X',
    keyTechniques: [
      'Advanced search: from:username since:2020-01-01 until:2020-12-31 — date-constrained post history',
      'Twitter Advanced Search: near:"city" within:15mi — location-based tweets',
      'Geotagged tweet scraping: many users had location enabled before Twitter changed defaults',
      'Followers/following analysis: who does target interact with most',
      'Quoted tweets and replies reveal opinion and associates more than original posts',
      'Deleted tweet recovery: Wayback Machine, Politwoops, Internet Archive',
      'Thread unrolling: threadreaderapp.com to export full threads',
    ],
    tools: [
      { name: 'Twitter Advanced Search', url: 'twitter.com/search-advanced', notes: 'Boolean operators, date range, geolocation, media type filtering.' },
      { name: 'Twint (legacy)', url: 'github.com/twintproject/twint', notes: 'Scrapes Twitter without API. API rate limits bypassed. May be broken due to X API changes.' },
      { name: 'Nitter instances', url: 'nitter.net (various instances)', notes: 'Twitter frontend without tracking or login. View tweets, search without account.' },
      { name: 'Wayback Machine', url: 'web.archive.org', notes: 'Recover deleted tweets if page was crawled. Not comprehensive.' },
    ],
    opsecNotes: [
      'X (Twitter) shows profile views to verified accounts — do not view target profile while logged in',
      'Use Nitter instances for anonymous browsing of public profiles',
      'API access significantly degraded in 2023 — many automation tools broken',
    ],
  },
  {
    platform: 'Facebook',
    keyTechniques: [
      'Graph search via URL manipulation: facebook.com/search/people/?q=Name&filters=...',
      'Friends of friends visible even with privacy settings in some configurations',
      'Events attended: reveals location, dates, associates present',
      'Check-ins and photo tags from friends even when subject\'s own profile is locked',
      'Groups membership sometimes visible — reveals interests and affiliations',
      'Historical timeline via Wayback Machine for cached profile snapshots',
      'Email/phone search: facebook.com/search/top?q=phone_or_email sometimes works',
    ],
    tools: [
      { name: 'IntelligenceX', url: 'intelx.io', notes: 'Historical Facebook data, cached profiles, deleted posts.' },
      { name: 'Sowdust Facebook Search', url: 'sowdust.github.io/fb-search', notes: 'Facebook graph search query builder.' },
      { name: 'Lookup-ID', url: 'lookup-id.com', notes: 'Extract Facebook numeric UID from profile URL. UID persists through username changes.' },
    ],
    opsecNotes: [
      'Facebook aggressively tracks and may flag/block accounts engaging in bulk searching',
      'Profile views are not directly notified but activity can trigger security alerts',
      'Use a burner account or access via cached/archived pages where possible',
      'Facebook UID is persistent — capture it early as usernames can change',
    ],
  },
  {
    platform: 'Instagram',
    keyTechniques: [
      'Location tag search: find all posts tagged at a location (restaurant, building, event)',
      'Hashtag tracking: follow investigation-relevant hashtags',
      'Geolocation from photo backgrounds: landmarks, storefronts, street signs',
      'Story highlights persist indefinitely — older location/contact data often present',
      'Tagged photos by others appear even if subject\'s own posts are restricted',
      'Followers/following: mutual follow patterns reveal close associates',
    ],
    tools: [
      { name: 'Imginn / Picuki', url: 'imginn.com', notes: 'View Instagram profiles without login or tracking.' },
      { name: 'InstaHunt', url: 'instahunt.co', notes: 'Instagram profile and hashtag analysis.' },
      { name: 'StorySaver', url: 'storysaver.net', notes: 'Download Instagram stories without notifying user.' },
    ],
    opsecNotes: [
      'Instagram story views are tracked — target sees who viewed their story',
      'Use third-party story viewers (Imginn) to avoid notification',
      'DMs require following — an investigative step. Do not DM as persona unless operationally justified',
    ],
  },
  {
    platform: 'Reddit',
    keyTechniques: [
      'User history at reddit.com/u/username — full post and comment history',
      'Pushshift.io (partially operational): search deleted Reddit content',
      'Cross-reference subreddit memberships for interest/location profiling',
      'Search by username across all subreddits: site:reddit.com/u/username',
      'Comment history timestamps reveal timezone and activity patterns',
      'Username often reused across platforms — run through Sherlock/Maigret',
    ],
    tools: [
      { name: 'Camas Reddit Search', url: 'camas.unddit.com', notes: 'Search deleted Reddit posts (Pushshift alternative).' },
      { name: 'Reveddit', url: 'reveddit.com', notes: 'Shows deleted comments and posts by username.' },
      { name: 'Reddit User Analyzer', url: 'reddit-user-analyser.netlify.app', notes: 'Visualizes posting patterns, most active subreddits, top words used.' },
    ],
    opsecNotes: [
      'Reddit accounts are anonymous by design but username reuse across platforms is common',
      'Subreddit history reveals interests, beliefs, location clues',
      'Posting time patterns across timezones can narrow geographic location',
    ],
  },
  {
    platform: 'TikTok',
    keyTechniques: [
      'tiktok.com/@username — direct profile lookup; TikTok exposes follower / following lists publicly',
      'Sound history reveals trends and locations — same audio used by clusters of regional accounts',
      'Likes are now private by default but can leak through old / re-shared posts',
      'TikTok\'s "Friends" feed surfaces accounts that interact with the target',
    ],
    tools: [
      { name: 'urlebird',         url: 'urlebird.com',         notes: 'Mirror of public TikTok profiles and videos — viewable without TikTok account or app.' },
      { name: 'tikbuddy',         url: 'tikbuddy.com',         notes: 'TikTok analytics — engagement rates, audience demographics, posting cadence.' },
      { name: 'TikTok Analytics', url: 'analytics.tiktok.com', notes: 'Native analytics for verified accounts; some signals (engagement, growth rate) leak via creator-marketplace listings.' },
    ],
    opsecNotes: [
      'TikTok aggressively profiles users — investigators should use a sandbox device / dedicated browser',
      'Watching a profile may surface you in their suggested content if you\'re logged in',
      'TikTok Live streams are ephemeral by default; record with yt-dlp during the stream',
    ],
  },
  {
    platform: 'YouTube',
    keyTechniques: [
      'site:youtube.com "Name" "Company" — Google dorking is more reliable than YouTube\'s native search',
      'About tab → channel creation date, total views, country of registration (when set)',
      'Comment history is searchable per-channel via filterforyoutube.com / commentpicker',
      'Community tab posts often leak more personal context than uploaded videos',
    ],
    tools: [
      { name: 'YouTube DataViewer (Amnesty)', url: 'amnestyusa.org/citizenevidence', notes: 'Extract exact upload timestamp + thumbnails for reverse image search. Verifies original-upload claims.' },
      { name: 'yt-dlp',                       url: 'github.com/yt-dlp/yt-dlp',       notes: 'CLI: archive videos and metadata before deletion. Standard tool for evidence preservation.' },
      { name: 'SocialBlade YouTube',          url: 'socialblade.com',                notes: 'Channel statistics — historical subscriber and view trajectory, ranking trends.' },
      { name: 'CommentPicker',                url: 'commentpicker.com',              notes: 'Search comments across a channel. Useful for finding all interactions a target had with a creator.' },
    ],
    opsecNotes: [
      'YouTube treats logged-in viewing as engagement signal — use logged-out / sandbox session for investigations',
      'Liking a video while logged in can publish to your "Liked videos" list if not made private',
    ],
  },
  {
    platform: 'Discord',
    keyTechniques: [
      'discord.com/users/<id> — direct profile lookup if you have the snowflake ID',
      'Server invites are often shared on Reddit, Twitter, Telegram — pivot from those to find target communities',
      'User IDs are permanent and survive username changes — capture them early',
      'Many "private" servers admit anyone with the invite link; lurk-only investigations are common',
    ],
    tools: [
      { name: 'DiscordLookup',     url: 'discordlookup.com',                          notes: 'Resolve user IDs to current display name + avatar without joining a server. Limited by Discord API throttling.' },
      { name: 'Discord.id',        url: 'discord.id',                                 notes: 'Convert Discord IDs (snowflakes) to creation timestamps. Useful for account-age verification.' },
      { name: 'DiscordHistory.io', url: 'discordhistorytracker.com',                  notes: 'Self-hosted scraper that archives server messages you have read access to. For evidence preservation only.' },
    ],
    opsecNotes: [
      'Joining a server reveals your username and avatar to all members and admins',
      'Use a dedicated investigation account with separate identity / phone',
      'Discord stores all messages server-side — assume anything sent is recoverable via subpoena',
    ],
  },
  {
    platform: 'Telegram',
    keyTechniques: [
      't.me/<username> — direct profile / channel preview without logging in',
      'Public channel forwarders reveal cross-channel networks ("forwarded from") — map ecosystems via shared content',
      'Telegram exposes "last seen" status in some configurations — narrowing activity windows',
      'Bots index public channels: search keywords across many channels at once via aggregator bots',
    ],
    tools: [
      { name: 'Telemetr.io',         url: 'telemetr.io',                  notes: 'Telegram channel analytics — subscriber growth, engagement, top channels. Free and paid tiers.' },
      { name: 'TGStat',              url: 'tgstat.com',                   notes: 'Russian-language but global coverage. Strongest catalog of Telegram channels and groups.' },
      { name: 'Lyzem',               url: 'lyzem.com',                    notes: 'Public Telegram channel search engine — full-text search across indexed channels.' },
      { name: 'telegram-nearby-map', url: 'github.com/tejado/telegram-nearby-map', notes: 'Triangulates "people nearby" feature for approximate-location of Telegram users (older technique; effectiveness varies).' },
    ],
    opsecNotes: [
      'Joining a channel reveals your username to admins',
      'Telegram\'s "secret chat" is end-to-end encrypted but cloud chats are not — assume all content is recoverable',
      'Many investigation-relevant communities (extremism, fraud, leaks) live on Telegram; use sandbox device + non-attributable phone',
    ],
  },
  {
    platform: 'Mastodon / Bluesky',
    keyTechniques: [
      'Federated identity — same handle on different instances is different people; verify with profile bio cross-references',
      'AT Protocol (Bluesky) and ActivityPub (Mastodon) expose profile + post history via public APIs without authentication',
      'Bluesky\'s starter packs and feeds reveal interest clusters and ideological neighborhoods',
      'Mastodon instance admin is often visible — instance choice signals community alignment',
    ],
    tools: [
      { name: 'Bluesky public API',   url: 'docs.bsky.app',                                notes: 'Free, no-auth public endpoints. Retrieve all posts, follows, followers programmatically.' },
      { name: 'Mostr / Mastodon API', url: 'docs.joinmastodon.org/api',                    notes: 'Each instance exposes a standard API. Public timeline + user info is fetchable without auth.' },
      { name: 'Skywatch',             url: 'github.com/aliceisjustplaying/skywatch',       notes: 'Bluesky-specific monitoring tools. Track posts containing keywords across the network.' },
      { name: 'Fediverse Observer',   url: 'fediverse.observer',                           notes: 'Discover Mastodon and Fediverse instances. Useful when looking for niche communities or instance patterns.' },
    ],
    opsecNotes: [
      'Federated networks make it harder to scale takedowns but also harder to centrally search — distributed by design',
      'Instance admins can read direct messages by default (not E2E encrypted)',
      'Public posts on either network are crawlable forever — assume permanent record',
    ],
  },
  {
    platform: 'GitHub (as social)',
    keyTechniques: [
      'github.com/<user>?tab=stars — interest profile from starred repos',
      'github.com/<user>?tab=followers and following — professional network',
      'Commits on public repos contain the user\'s git email by default — often a real address',
      'Activity heatmap reveals timezone and weekday vs. weekend posting patterns',
    ],
    tools: [
      { name: 'GitHub commit email lookup', url: 'github.com/<user>.patch',  notes: 'Append .patch to any user\'s recent commit URL: returns the patch with the committer\'s email. Standard pattern for finding emails behind GH accounts.' },
      { name: 'GitHub user search dorks',   url: 'github.com/search?type=users', notes: 'Filter by language, location, followers. location:"San Francisco" language:python — narrows by self-declared location.' },
      { name: 'OctoSuite',                  url: 'github.com/bellingcat/octosuite',          notes: 'Bellingcat\'s GitHub OSINT framework. CLI: enumerate repos, gists, organizations, followers for a target user.' },
    ],
    opsecNotes: [
      'Investigators should use a non-attributable GitHub account — your own profile is visible to anyone you interact with',
      'Starring repos can be made private but is public by default — interaction history is visible',
    ],
  },
]

// ─── Domain / IP / Infrastructure OSINT ──────────────────────────────────────

export interface InfraTool {
  name: string
  url: string
  what: string
  commands?: string[]
  notes: string
}

export const infraTools: InfraTool[] = [
  // WHOIS / Registration
  { name: 'WHOIS (ICANN)', url: 'lookup.icann.org / whois.domaintools.com', what: 'Domain registration, registrant (often privacy-protected), nameservers, registration date', notes: 'GDPR has hidden most registrant data behind privacy proxies. Registrant org/email sometimes exposed for older registrations. Registration date is always visible.' },
  { name: 'DomainTools', url: 'domaintools.com', what: 'Historical WHOIS, reverse WHOIS, hosting history, connected domains', commands: ['Reverse WHOIS by email: finds all domains registered with same email', 'Hosting history: shows IP changes over time', 'Connected domains: other domains on same IP/nameserver'], notes: 'Best historical domain data. Expensive ($99+/month) but irreplaceable for infrastructure mapping. Free tier limited.' },
  { name: 'ViewDNS.info', url: 'viewdns.info', what: 'Reverse IP, DNS history, WHOIS, IP location, port scan, reverse MX', commands: ['Reverse IP lookup: other domains hosted on same IP', 'DNS History: shows IP changes over years', 'IP Location: geolocation of hosting'], notes: 'Free and comprehensive. Reverse IP reveals other sites on shared hosting — same operator.' },
  // Certificates
  { name: 'crt.sh', url: 'crt.sh', what: 'Certificate Transparency logs — all SSL/TLS certs issued for a domain', commands: ['%.target.com — wildcard search for all subdomains with certs', 'Search by organization name in cert subject'], notes: 'Reveals subdomains not in public DNS. Certs issued for internal hostnames, staging environments, internal tools often appear. Free and comprehensive.' },
  { name: 'Censys', url: 'search.censys.io', what: 'Internet-wide scan data: open ports, services, certificates, host attributes', commands: ['parsed.names: target.com — find all hosts with certs for domain', 'ip: x.x.x.x — full port/service scan of IP', 'autonomous_system.name: "Company Name"'], notes: 'Alternative to Shodan. Better certificate and structured data. Free tier 250 queries/month.' },
  // Shodan
  { name: 'Shodan', url: 'shodan.io', what: 'Internet of Things / exposed services scanner', commands: ['hostname:target.com — all Shodan results for domain', 'org:"Company Name" — all IPs owned by organization', 'ssl.cert.subject.CN:target.com — SSL certs', 'net:x.x.x.0/24 — subnet scan', 'http.title:"Login" country:US city:"Huntsville"'], notes: 'Best for exposed services, IoT devices, industrial control systems. $49/month for API. CLI: shodan host x.x.x.x' },
  // DNS
  { name: 'DNSDumpster', url: 'dnsdumpster.com', what: 'DNS reconnaissance: subdomains, MX records, TXT records, hosting info', notes: 'Free. Pulls from passive DNS databases. Good starting point before active recon. Shows visual host map.' },
  { name: 'SecurityTrails', url: 'securitytrails.com', what: 'Historical DNS, subdomains, WHOIS history, IP history', commands: ['Historical IPs: what IP did this domain point to in 2019', 'Subdomain enumeration from passive DNS', 'Reverse lookup by IP block'], notes: '$50/month for full access. Historical DNS data is the key differentiator — traces infrastructure over time.' },
  { name: 'Amass (CLI)', url: 'github.com/owasp-amass/amass', what: 'Active/passive subdomain enumeration and network mapping', commands: ['amass enum -passive -d target.com', 'amass enum -active -d target.com -brute', 'amass viz -d3 — visual network graph'], notes: 'Most comprehensive subdomain enumeration. Combines 50+ data sources. Use passive mode for pure OSINT (no direct contact with target).' },
  // IP / ASN
  { name: 'BGP.he.net (Hurricane Electric)', url: 'bgp.he.net', what: 'ASN lookup, IP block ownership, BGP routing, peer relationships', notes: 'Find what ASN owns an IP block. Map all IP ranges owned by an organization. Shows BGP peers (upstream providers).' },
  { name: 'ARIN / RIPE / APNIC', url: 'arin.net / ripe.net / apnic.net', what: 'Authoritative IP address registration by region', notes: 'ARIN = North America. RIPE = Europe/Middle East. APNIC = Asia-Pacific. Authoritative source for IP block ownership, registration contact.' },
  { name: 'Shodan CVE search', url: 'shodan.io/search?query=vuln:CVE-XXXX-XXXX', what: 'Find hosts exposed with specific CVE', notes: 'Enumerate vulnerable infrastructure without scanning. vuln:CVE-2021-44228 (Log4Shell) shows all exposed Log4j hosts.' },
  // Email
  { name: 'Hunter.io', url: 'hunter.io', what: 'Email format discovery and verification for a domain', commands: ['Domain search: finds all emails for company', 'Email finder: Name + Company → likely email', 'Email verifier: checks if address is valid'], notes: 'Reveals corporate email format (first.last@company.com vs flast@company.com). 25 free searches/month.' },
  { name: 'EmailRep', url: 'emailrep.io', what: 'Email reputation, breach history, social profiles linked to email', notes: 'API: curl emailrep.io/target@email.com — returns reputation score, breach data, linked profiles. Useful for phishing assessment and identity correlation.' },
]

// ─── Phone Number OSINT ───────────────────────────────────────────────────────

export interface PhoneTool {
  name: string
  url: string
  what: string
  cost: string
  notes: string
}

export const phoneTools: PhoneTool[] = [
  { name: 'Truecaller', url: 'truecaller.com', what: 'Crowdsourced caller ID — name linked to number by contacts in users\' address books', cost: 'Free (limited) / $3/month', notes: 'Most accurate for identifying unknown callers. Pulls name from how number is saved in millions of phones. Strong in US, India, Middle East. Web search: truecaller.com/search/us/+1XXXXXXXXXX' },
  { name: 'Whitepages Reverse Phone', url: 'whitepages.com/phone', what: 'Name and address linked to phone number', cost: 'Free (name only) / $5 full report', notes: 'Best for landlines. Cell phone results vary. Carrier identification is free. Combines with address for full picture.' },
  { name: 'NumLookup', url: 'numlookup.com', what: 'Free reverse phone: carrier, line type (mobile/landline/VoIP), location', cost: 'Free', notes: 'Free carrier and line type lookup. Identifies VoIP numbers (Google Voice, TextNow) vs real carriers. Key for identifying burner numbers.' },
  { name: 'Phoneinfoga', url: 'github.com/sundowndev/phoneinfoga', what: 'CLI tool: OSINT gathering for phone numbers across multiple sources', cost: 'Free (open source)', notes: 'phoneinfoga scan -n +1XXXXXXXXXX — queries multiple sources in one run. Docker image available. Good for automation.' },
  { name: 'Carrier lookup', url: 'freecarrierlookup.com', what: 'Carrier identification and porting status', cost: 'Free', notes: 'Identifies carrier and whether number has been ported (transferred between carriers). Ported numbers indicate the number was originally on a different carrier.' },
  { name: 'Google / Bing search', url: 'google.com', what: 'Number appeared in public records, directories, forums, social media', cost: 'Free', notes: 'Search: "555-867-5309" OR "5558675309" OR "+15558675309" — all format variants. Phone numbers in classified ads, forum posts, business listings reveal identity.' },
  { name: 'Social media search', url: 'Facebook / Twitter / Instagram', what: 'Phone number used to register or linked to account', cost: 'Free', notes: 'Facebook: search bar with phone number sometimes returns profile. Twitter: account recovery flow with number can confirm account without exposing it. WhatsApp: add number to contacts, check if WhatsApp account exists and profile photo.' },
  { name: 'CallerSmart / Hiya', url: 'callersmart.com / hiya.com', what: 'Community caller ID database with spam/fraud flags', cost: 'Free', notes: 'Community-reported identity for numbers. Less accurate than Truecaller but different database — run both.' },
]

// ─── Dark Web OSINT ───────────────────────────────────────────────────────────

export interface DarkWebSource {
  name: string
  type: string
  access: string
  url?: string
  what: string
  notes: string
}

export const darkWebSources: DarkWebSource[] = [
  // Breach data
  { name: 'Have I Been Pwned', type: 'Breach database', access: 'Web / API (free)', what: 'Email addresses in known data breaches — breach name, year, data types exposed', notes: 'haveibeenpwned.com/API — free API for non-commercial use. Returns breaches by email. Check all known email addresses for target. Breach exposure reveals password reuse risk and historical accounts.' },
  { name: 'Dehashed', type: 'Breach database', access: 'Web ($6/month)', what: 'Breach data with plaintext/hashed passwords, email, username, IP, address', notes: 'Most comprehensive paid breach database. Search by email, username, IP, phone, name, address. Recovers plaintext passwords from older breaches. Critical for CI credential analysis.' },
  { name: 'IntelligenceX', type: 'Multi-source dark web archive', access: 'Web (free limited / $30/month)', what: 'Dark web content, Tor pages, I2P, data breaches, documents, paste sites', notes: 'Indexes Tor .onion pages, leak sites, paste sites, social media archives. Search by email, domain, name, BTC address, IP. Historical data including deleted content.' },
  { name: 'Leaked Source (archived)', type: 'Breach database (offline)', access: 'Third-party mirrors', what: 'Historical breach data', notes: 'Original site seized. Data widely available through other sources (Dehashed has most of it). Reference for older breach research.' },
  // Paste sites
  { name: 'Pastebin / Ghostbin / Hastebin', type: 'Paste sites', access: 'Web (free)', what: 'Leaked credentials, configuration files, source code, internal data', notes: 'Google dork: site:pastebin.com "target.com" "password" OR "apikey". PastebinSearch (psbdmp.ws) provides full-text search of Pastebin archives. Monitor for ongoing leaks.' },
  { name: 'psbdmp.ws', type: 'Pastebin search', access: 'Web (free)', what: 'Full-text search of Pastebin archive', notes: 'Searches historical Pastebin content including deleted pastes. Search by domain, email, name.' },
  // Tor / Dark web search
  { name: 'Ahmia', url: 'ahmia.fi', type: 'Tor search engine', access: 'Clearnet (no Tor needed)', what: 'Dark web site indexing — accessible from regular browser', notes: 'Indexes Tor hidden services. Accessible without Tor. Good starting point for dark web presence checks without operational Tor setup.' },
  { name: 'OnionSearch', type: 'Dark web search aggregator', access: 'Web tool', what: 'Aggregates results from multiple dark web search engines', notes: 'github.com/megadose/OnionSearch — Python CLI tool. Searches Ahmia, Torch, not Evil, Candle simultaneously.' },
  // Ransomware / leak sites
  { name: 'Ransomware leak site monitoring', type: 'Dark web monitoring', access: 'Tor Browser + manual', what: 'Leaked corporate data from ransomware extortion — documents, credentials, internal data', notes: 'Major groups: LockBit (down), AlphV/BlackCat (down), Cl0p, RansomHub. Search: ransomwatch.telemetry.ltd (clearnet aggregator of active leak sites). Organizations listed = confirmed breach.' },
  { name: 'DarkOwl', type: 'Commercial dark web monitoring', access: 'Enterprise ($)', what: 'Automated dark web monitoring, breach data, ransomware feeds', notes: 'Enterprise platform for continuous dark web monitoring. Alternative to manual Tor browsing. Relevant for organizational threat intelligence programs.' },
  // Cryptocurrency
  { name: 'Blockchain.com / Blockchair', type: 'Blockchain explorer', access: 'Web (free)', what: 'Bitcoin/crypto transaction history, address clustering, wallet analysis', notes: 'Trace BTC transactions: blockchain.com/explorer. Blockchair supports 20+ blockchains. Wallet clustering links addresses likely owned by same entity. CipherTrace/Chainalysis for advanced attribution (enterprise).' },
  { name: 'Etherscan', type: 'Ethereum explorer', access: 'Web (free)', what: 'ETH/ERC-20 token transactions, wallet history, smart contract interactions', notes: 'etherscan.io — full transaction history for Ethereum addresses. DeFi transactions reveal financial behavior patterns.' },
]

// ─── Corporate / Business Intelligence ────────────────────────────────────────

export interface CorpSource {
  name: string
  url: string
  what: string
  cost: string
  notes: string
}

export const corpSources: CorpSource[] = [
  { name: 'SEC EDGAR', url: 'efts.sec.gov/LATEST/search-index', what: '10-K, 10-Q, 8-K filings, insider transactions, beneficial ownership (13D/G), executive compensation', cost: 'Free', notes: 'Full-text search at efts.sec.gov/LATEST/search-index?q="search+term"&dateRange=custom. Insider transactions (Form 4) reveal executive stock movements. 13D/G shows who owns >5% of company. S-1 filings reveal pre-IPO financials.' },
  { name: 'USASpending.gov', url: 'usaspending.gov', what: 'Federal contracts and grants by recipient company, amount, awarding agency', cost: 'Free', notes: 'Search by company name or DUNS number. Reveals classified program associations (contract number patterns), relationships with specific agencies, revenue from government. Key for defense contractor CI.' },
  { name: 'SAM.gov', url: 'sam.gov', what: 'Federal vendor registration, contract awards, exclusions (debarment)', cost: 'Free', notes: 'All federal contractors must register. Entity registration reveals CAGE code, NAICS codes (business type), points of contact, banking info (redacted). Exclusion database shows debarred contractors.' },
  { name: 'FOIA / Freedom of Information', url: 'foia.gov / MuckRock.com', cost: 'Free (gov agencies) / $20 via MuckRock', what: 'Government records about companies, individuals, programs not publicly available', notes: 'FOIA.gov lists agency FOIA contacts. MuckRock.com tracks requests and hosts released documents. OIG reports, inspection records, contract details obtainable. Plan for 6–18 month wait on non-expedited requests.' },
  { name: 'OpenCorporates', url: 'opencorporates.com', what: 'Company registration data across 140+ jurisdictions worldwide', cost: 'Free (limited) / API paid', notes: 'Finds corporate registrations in multiple states/countries. Reveals registered agents, officers, filing history. Shell company detection — Delaware LLCs with same registered agent.' },
  { name: 'State SOS databases', url: 'Varies by state', what: 'State corporate filings, registered agent, officers, annual reports', cost: 'Free (most states)', notes: 'Most states: sos.state.gov → business search. Officers/directors listed by name. Registered agent reveals who manages the entity. Annual report filings show address history.' },
  { name: 'Dun & Bradstreet (D&B)', url: 'dnb.com', what: 'Business credit, subsidiaries, key personnel, revenue estimates, DUNS number', cost: '$50–500/report or enterprise', notes: 'DUNS number is a key identifier linking across government databases. Subsidiary/parent relationships. Key contacts sometimes listed. D&B credit rating used in federal contracting.' },
  { name: 'LinkedIn (corporate)', url: 'linkedin.com/company', what: 'Employee count, headcount growth, department breakdown, key personnel, job postings', cost: 'Free (limited) / Sales Navigator', notes: 'Job postings reveal technology stack, expansion plans, internal org structure. Headcount changes indicate financial health. Filter employees by department, seniority, geography.' },
  { name: 'Glassdoor', url: 'glassdoor.com', what: 'Employee reviews, salary data, interview questions, CEO approval, company culture', cost: 'Free (with account)', notes: 'Reviews reveal internal culture, management issues, real working conditions. Salary data. Interview questions reveal what positions require. Negative reviews sometimes contain sensitive internal details.' },
  { name: 'Patent/trademark databases', url: 'patents.google.com / tmsearch.uspto.gov', what: 'Patents reveal technology development, inventor names, R&D focus areas', cost: 'Free', notes: 'Inventor names on patents are individuals — searchable people OSINT. Patent citations map technology relationships. Trademark filings show brand/product plans. Foreign patents: espacenet.epo.org' },
  { name: 'Federal Acquisition Regulation (SAM + FPDS)', url: 'fpds.gov', what: 'Detailed federal contract award data: amounts, dates, description, socioeconomic status', cost: 'Free', notes: 'More detailed than USASpending. Contract descriptions sometimes reveal program names. Modification history shows contract growth/changes. PSC codes classify the type of work.' },
]

// ─── Email OSINT ──────────────────────────────────────────────────────────────

export interface EmailOSINTTool {
  name: string
  url: string
  category: string
  cost: string
  what: string
  notes: string
}

export const emailOSINT: EmailOSINTTool[] = [
  { name: 'Hunter.io',                    url: 'hunter.io',                                      category: 'Email enumeration',  cost: 'Free (25/mo) / paid', what: 'Find work emails by domain — pattern detection (firstname.lastname@) + verification',                                       notes: 'Reveals corporate email format. Verifier checks deliverability without sending. Largest free dataset for "what does the email format at acme.com look like?".' },
  { name: 'EpieOS',                       url: 'epieos.com',                                     category: 'Email lookup',       cost: 'Free / paid Pro',     what: 'Free email lookup — Google account name/photo, registered services, social profiles',                                      notes: 'Quietly the strongest free email tool. Shows the Google profile name and photo behind a Gmail address; flags accounts on Twitter, LinkedIn, etc.' },
  { name: 'EmailRep.io',                  url: 'emailrep.io',                                    category: 'Reputation',         cost: 'Free (limited)',      what: 'Email reputation scoring — risk, age, social profiles, suspiciousness',                                                    notes: 'API-friendly. Aggregates many signals into a single risk score. Good for quickly classifying inbound contact attempts.' },
  { name: 'Holehe',                       url: 'github.com/megadose/holehe',                     category: 'Account enum',       cost: 'Free (open source)',  what: 'CLI: check ~120 services for whether an email is registered',                                                              notes: 'pip install holehe — uses signup-flow side-channels (silent password reset etc.) to detect account presence without logging the user.' },
  { name: 'h8mail',                       url: 'github.com/khast3x/h8mail',                      category: 'Breach hunting',     cost: 'Free + paid sources', what: 'CLI: query email across breach databases (HIBP, Dehashed, Snusbase, IntelX)',                                              notes: 'Plug in API keys for premium databases. Output plaintext passwords from older breaches when the source allows.' },
  { name: 'Have I Been Pwned',            url: 'haveibeenpwned.com',                             category: 'Breach hunting',     cost: 'Free (web)',          what: 'Check email against ~12B breached records',                                                                                  notes: 'API requires paid key for automation. Web UI is free for one-off lookups. Cross-reference all known emails for a target.' },
  { name: 'IntelX (email search)',        url: 'intelx.io',                                      category: 'Breach hunting',     cost: 'Limited free / paid', what: 'Search email across leaked databases, paste sites, dark-web markets',                                                       notes: 'Aggregates more sources than HIBP. Snippets visible without buying. Strong for IR / forensic email triage.' },
  { name: 'Skymem',                       url: 'skymem.info',                                    category: 'Email pattern',      cost: 'Free',                what: 'Email format lookup by company domain',                                                                                      notes: 'Less complete than Hunter but free and instant. Cross-reference for pattern confirmation.' },
  { name: 'Phonebook.cz',                 url: 'phonebook.cz',                                   category: 'Email + subdomain',  cost: 'Limited free / paid', what: 'Email + subdomain enumeration by domain',                                                                                    notes: 'Operated by IntelX. Quick way to confirm email format and find associated subdomains in one query.' },
  { name: 'Mailinator (defensive lookup)',url: 'mailinator.com',                                 category: 'Disposable mailbox', cost: 'Free',                what: 'Public disposable mailboxes — search if a target signs up to services with disposables',                                    notes: 'Pattern: targets register on services with mailinator addresses. Try {username}@mailinator.com to see if anyone\'s used it. Same for tempmail.com, 10minutemail, etc.' },
]

// ─── Geospatial / Map OSINT ───────────────────────────────────────────────────

export interface GeoTool {
  name: string
  url: string
  category: string
  what: string
  notes: string
}

export const geoTools: GeoTool[] = [
  // Aviation
  { name: 'FlightRadar24',          url: 'flightradar24.com',                       category: 'Aviation',       what: 'Live and historical flight tracking via crowd-sourced ADS-B + radar',                                  notes: 'Free tier shows current flights with 7-day history. Premium for years of history. Filter by aircraft type, airline, callsign, registration.' },
  { name: 'ADS-B Exchange',         url: 'adsbexchange.com',                        category: 'Aviation',       what: 'Unfiltered ADS-B aggregator — military, blocked, and gov flights others hide',                          notes: 'Best source for tracking sensitive aircraft. No filtering of military, surveillance, or VIP flights. Historical replay via paid tier.' },
  { name: 'OpenSky Network',        url: 'opensky-network.org',                     category: 'Aviation',       what: 'Academic ADS-B aggregator with free historical API',                                                    notes: 'Used by researchers and journalists. Free API with 30+ days history. Heavier integration burden than FR24/ADS-B Exchange.' },
  { name: 'FAA Aircraft Registry',  url: 'registry.faa.gov',                        category: 'Aviation',       what: 'US aircraft registration: tail number → owner, model, year, base airport',                              notes: 'Free public records. N-number search. Entity-name search reveals corporate/private ownership patterns and shell-company aircraft fleets.' },
  // Maritime
  { name: 'MarineTraffic',          url: 'marinetraffic.com',                       category: 'Maritime',       what: 'Real-time and historical vessel tracking via AIS',                                                       notes: 'Vessels >300 GT are required to broadcast AIS. Free tier limited; paid for full history and dark-vessel detection.' },
  { name: 'VesselFinder',           url: 'vesselfinder.com',                        category: 'Maritime',       what: 'Alternative AIS tracker with port traffic and vessel particulars',                                       notes: 'Cross-check against MarineTraffic — receiver coverage differs, so some vessels show only on one platform.' },
  { name: 'Equasis',                url: 'equasis.org',                             category: 'Maritime',       what: 'IMO-backed vessel database — ownership, classification, port-state inspections',                         notes: 'Free with registration. Reveals beneficial-owner trails often hidden behind shell companies. Standard sanctions-analyst tool.' },
  // Satellite
  { name: 'Sentinel Hub EO Browser',url: 'apps.sentinel-hub.com/eo-browser',        category: 'Satellite',      what: 'Free 10 m optical imagery from ESA Sentinel-2, Landsat, MODIS',                                          notes: 'Imagery refreshes every ~5 days. Compare temporal series for change detection. SAR (Sentinel-1) penetrates cloud cover.' },
  { name: 'Google Earth Pro',       url: 'earth.google.com/web',                    category: 'Satellite',      what: 'Historical commercial imagery (Maxar etc.) with multi-year time slider',                                 notes: 'Free desktop version. Historical imagery slider goes back to ~2000 in many areas. Crucial for comparing site state over time.' },
  { name: 'NASA Worldview',         url: 'worldview.earthdata.nasa.gov',            category: 'Satellite',      what: 'Daily MODIS / VIIRS imagery — fires, smoke plumes, ice, dust',                                          notes: 'Lower resolution (~250 m) but daily revisit. Best for environmental, fires, atmospheric phenomena. Free.' },
  { name: 'Planet Explorer',        url: 'planet.com/explorer',                     category: 'Satellite',      what: 'Daily 3–5 m commercial imagery (paid)',                                                                  notes: 'Used by journalists and researchers. Free trial available. Planet NICFI program offers free monthly tropics imagery.' },
  // Mapping
  { name: 'OpenStreetMap',          url: 'openstreetmap.org',                       category: 'Mapping',        what: 'Editable global map data — POIs, building footprints, infrastructure',                                  notes: 'Often more detailed than Google for non-Western regions. Use Overpass Turbo (overpass-turbo.eu) for arbitrary geographic queries.' },
  { name: 'Mapillary',              url: 'mapillary.com',                           category: 'Street-level',   what: 'Crowd-sourced street-level imagery alternative to Street View',                                          notes: 'Coverage is patchy but reaches places Street View doesn\'t — backroads, industrial, post-event. Owned by Meta.' },
  { name: 'KartaView',              url: 'kartaview.org',                           category: 'Street-level',   what: 'Open-source street-level imagery (formerly OpenStreetCam)',                                              notes: 'Cross-check with Mapillary; complementary coverage. Open data — bulk-downloadable.' },
  // Chronolocation
  { name: 'SunCalc',                url: 'suncalc.org',                             category: 'Chronolocation', what: 'Sun azimuth/elevation by lat/lon and time — drives shadow-based geolocation',                           notes: 'Reverse-solve: given a shadow direction at a known location, infer time of day/year. Or: given time, predict shadow direction.' },
  { name: 'PeakVisor',              url: 'peakvisor.com',                           category: 'Chronolocation', what: 'Match horizon silhouettes against mountain databases',                                                   notes: 'Useful when an image shows distinctive ridgelines. Web AR mode for in-field confirmation.' },
  { name: 'WolframAlpha (weather)', url: 'wolframalpha.com',                        category: 'Chronolocation', what: 'Historical weather queries by location and date',                                                       notes: 'Cross-check claimed conditions: "weather in Kyiv 2024-03-15" returns recorded conditions. Catches faked content with wrong weather.' },
]

// ─── Crypto / Blockchain OSINT ────────────────────────────────────────────────

export interface CryptoTool {
  name: string
  url: string
  category: string
  cost: string
  what: string
  notes: string
}

export const cryptoOSINT: CryptoTool[] = [
  { name: 'Etherscan',                url: 'etherscan.io',                                category: 'Block explorer (ETH)',  cost: 'Free / paid API',     what: 'Ethereum mainnet explorer — addresses, transactions, contract code',                                      notes: 'Click any address for balance, tx history, token holdings. Sister explorers exist for L2s and other chains: arbiscan.io, polygonscan.com, basescan.org, bscscan.com.' },
  { name: 'Blockchain.com Explorer',  url: 'blockchain.com/explorer',                     category: 'Block explorer (BTC)',  cost: 'Free',                what: 'Bitcoin chain explorer — addresses, mempool, blocks, fees',                                                notes: 'Address pages include transaction graphs. Limited heuristic clustering compared to specialized tools.' },
  { name: 'Mempool.space',            url: 'mempool.space',                               category: 'Block explorer (BTC)',  cost: 'Free / self-host',    what: 'Modern Bitcoin explorer with mempool visualization',                                                       notes: 'Better UI than Blockchain.com. Lightning Network explorer included. Self-hostable.' },
  { name: 'Wallet Explorer',          url: 'walletexplorer.com',                          category: 'Bitcoin clustering',    cost: 'Free',                what: 'BTC address clustering — labels known exchanges/services by their wallet groupings',                       notes: 'Identifies if an address belongs to a known exchange, gambling site, or mixer. Older but still authoritative for known clusters.' },
  { name: 'OXT',                      url: 'oxt.me',                                      category: 'Bitcoin analytics',     cost: 'Free',                what: 'Heuristic BTC clustering with visual transaction graphs',                                                  notes: 'Reveals likely co-spending wallets. Visual graph traversal complements WalletExplorer\'s table view.' },
  { name: 'Breadcrumbs',              url: 'breadcrumbs.app',                             category: 'Investigation tool',    cost: 'Freemium',            what: 'Multi-chain investigation graph — drag-and-drop UI, attribution, sanctions screening',                     notes: 'Good for non-engineers. Includes OFAC sanctions list overlays. Free tier generous enough for casual investigations.' },
  { name: 'GraphSense',               url: 'graphsense.info',                             category: 'Investigation tool',    cost: 'Free (self-host)',    what: 'Open-source crypto analytics platform (academic / govt-leaning)',                                          notes: 'Used by Iknaio for AT/EU LE work. Heavy infra requirement; managed instance available.' },
  { name: 'Chainalysis Reactor',      url: 'chainalysis.com/reactor',                     category: 'Commercial analytics',  cost: 'Paid (enterprise)',   what: 'Industry-standard commercial blockchain investigation tool',                                                notes: 'Used by major exchanges and law enforcement. Best attribution coverage but expensive.' },
  { name: 'TRM Labs',                 url: 'trmlabs.com',                                 category: 'Commercial analytics',  cost: 'Paid (enterprise)',   what: 'Commercial blockchain risk intelligence — sanctions, fraud, ransomware',                                    notes: 'Direct competitor to Chainalysis. Stronger on real-time wallet screening for compliance.' },
  { name: 'Arkham Intelligence',      url: 'arkhamintelligence.com',                      category: 'Attribution',           cost: 'Free',                what: 'Crowd-sourced address labels, entity profiles, wallet tracking',                                            notes: 'Strong on identifying institutional wallets. "Bounty" system for unmasking entities. Free with login.' },
  { name: 'Etherscan label cloud',    url: 'etherscan.io/labelcloud',                     category: 'Attribution',           cost: 'Free',                what: 'Public address labels (CEX, mixer, MEV bot, sanctioned, etc.)',                                             notes: 'First stop for "who is this address?" before paid tools. Crowd-curated.' },
  { name: 'Dune Analytics',           url: 'dune.com',                                    category: 'Custom analytics',      cost: 'Free / paid',         what: 'SQL queries against indexed blockchain data',                                                              notes: 'Write custom queries; community has thousands of public dashboards. Powerful for pattern hunting at scale.' },
  { name: 'OFAC SDN List',            url: 'sanctionssearch.ofac.treas.gov',              category: 'Sanctions',             cost: 'Free',                what: 'US Treasury sanctioned crypto addresses',                                                                    notes: 'Cross-reference any wallet of interest. Both EU and UK maintain separate lists; OFAC is the most-cited.' },
]

// ─── Crypto concepts cheat sheet ─────────────────────────────────────────────
// What an investigator who's never worked a crypto case needs to know first.
// Plain-language definitions of the terms that show up in case files.

export interface CryptoConcept {
  term: string
  oneLiner: string
  detail: string
  whyItMatters: string
}

export const cryptoConcepts: CryptoConcept[] = [
  {
    term: 'Address',
    oneLiner: 'The string of characters that holds crypto — the equivalent of an account number.',
    detail: 'Format varies per chain: Bitcoin (bc1q…, 1…, 3…), Ethereum (0x…, 42 hex chars), Solana (Base58, ~44 chars), Monero (4… / 8…, 95 chars). An address is derived from a public key, which is derived from a private key. Owning the private key = owning the funds.',
    whyItMatters: 'Every crypto investigation starts with an address. Format alone tells you which chain to look on.',
  },
  {
    term: 'Private key / seed phrase',
    oneLiner: 'The secret that proves ownership. Anyone with it can move the funds.',
    detail: 'A private key is a random 256-bit number. A seed phrase (12 or 24 BIP-39 words) deterministically generates one or many private keys. The seed phrase IS the wallet — losing it loses the funds, and stealing it steals them.',
    whyItMatters: 'Seizing physical media that contains a seed phrase (paper, hardware wallet, file) is seizing the money. Chain-of-custody for these is critical.',
  },
  {
    term: 'Transaction (tx)',
    oneLiner: 'A record on the blockchain moving value from one address to another, with a unique hash.',
    detail: 'Identified by a transaction hash (txid). Has inputs (source addresses), outputs (destination addresses), an amount, a fee, and a block timestamp. Bitcoin and Ethereum model this differently (UTXO vs account) but the txid concept is universal.',
    whyItMatters: 'The txid is the durable, unique identifier you reference in reports. Block timestamps anchor the activity in time.',
  },
  {
    term: 'UTXO vs account model',
    oneLiner: 'Two different bookkeeping styles. Bitcoin uses UTXO; Ethereum uses accounts.',
    detail: 'UTXO (Bitcoin, Litecoin): each transaction spends prior "unspent transaction outputs" — like cash. Inputs from multiple addresses are common (common-input ownership heuristic relies on this). Account-based (Ethereum, Solana, etc.): each address has a balance that gets debited/credited like a bank account.',
    whyItMatters: 'Bitcoin clustering (WalletExplorer, OXT) only works on UTXO chains. Ethereum analysis depends on different heuristics — direct address activity, contract interactions, gas-payer patterns.',
  },
  {
    term: 'Wallet',
    oneLiner: 'Software (or hardware) that manages private keys. NOT a place where coins "live."',
    detail: 'Coins live on the blockchain. The wallet just holds the keys that prove ownership. Wallets are classified as: hot (online — MetaMask, Coinbase Wallet, Phantom), cold (offline — hardware wallets like Ledger / Trezor, paper wallets), and custodial (a third party holds your keys — Coinbase, Binance) vs non-custodial.',
    whyItMatters: 'A device seizure looks for wallet software / hardware / seed phrase records. Knowing custodial vs non-custodial drives legal-process strategy: custodial = subpoena the exchange; non-custodial = you need the keys.',
  },
  {
    term: 'Block explorer',
    oneLiner: 'A website that lets you look up any address or transaction on a chain.',
    detail: 'Free, no account needed for basic use. Etherscan (Ethereum), Mempool.space (Bitcoin), Solscan (Solana), Tronscan (Tron). For an unfamiliar address: identify the chain by format, paste it into the right explorer, read the transaction history.',
    whyItMatters: 'First-look tool. Free, fast, and good enough for 80% of basic investigative questions.',
  },
  {
    term: 'Gas / fee',
    oneLiner: 'The fee paid to miners/validators to include a transaction in a block.',
    detail: 'Bitcoin: fee in satoshis/byte. Ethereum: gas (a unit of compute) × gas price. Fees vary with network congestion and can spike during high activity. Suspects sometimes underfund fees to delay confirmation — useful timing signal.',
    whyItMatters: 'A high-fee transaction signals urgency (suspect wanted it confirmed fast). Failed / stuck transactions are also forensic events worth noting.',
  },
  {
    term: 'Mempool',
    oneLiner: 'The pool of submitted-but-not-yet-confirmed transactions.',
    detail: 'Each node has its own view of the mempool. Transactions sit here until a miner includes them in a block. Mempool.space lets you watch this in near-real-time.',
    whyItMatters: 'Catches transactions BEFORE they\'re in a block. Useful for real-time monitoring of known suspect addresses.',
  },
  {
    term: 'Token vs coin',
    oneLiner: 'A "coin" is native to its blockchain (BTC, ETH). A "token" is issued on top of one (USDT, USDC).',
    detail: 'On Ethereum, ERC-20 tokens (USDT, USDC, WETH) and ERC-721 tokens (NFTs) are smart contracts. Their transfer history is on Etherscan but lives under a contract address, with each holder having a sub-balance. USDT exists on Ethereum, Tron, Solana, BSC, etc. — same name, different smart contracts on each chain.',
    whyItMatters: 'USDT is the dominant scam-payment currency. Tron USDT (TRC-20) is the most-laundered stablecoin today. Don\'t confuse "USDT" with a single asset — always identify the chain.',
  },
  {
    term: 'Bridge',
    oneLiner: 'A service that moves a token from one chain to another. Common laundering vector.',
    detail: 'Bridges lock tokens on chain A and mint equivalent ones on chain B (or burn/release). Wormhole, Stargate, LayerZero, cBridge, Across, Hop are major ones. Some are decentralized; some have been exploited / sanctioned.',
    whyItMatters: 'A suspect moving funds across chains is intentionally obfuscating. The bridge transaction is a tractable forensic event — both legs are public, just on different chains.',
  },
  {
    term: 'Mixer / tumbler',
    oneLiner: 'A service that mixes coins from many users to break the on-chain link between source and destination.',
    detail: 'Tornado Cash (Ethereum, OFAC-sanctioned), ChipMixer (seized 2023), Wasabi Wallet + Samourai Wallet (CoinJoin implementations). Outputs can sometimes be partially de-anonymized through heuristics or operational mistakes; Tornado especially has known compromises.',
    whyItMatters: 'Mixer involvement is a strong signal of criminal intent. Funds in/out of OFAC-sanctioned mixers (Tornado Cash) is itself a sanctions violation in the US.',
  },
  {
    term: 'Privacy coin',
    oneLiner: 'A cryptocurrency designed for anonymity. Monero is the only one that works in practice.',
    detail: 'Monero (XMR): ring signatures + stealth addresses + RingCT — addresses and amounts hidden by default, effectively untraceable. Zcash (ZEC): shielded vs transparent — most users transact transparently, leaving shielded as opt-in (and rarely used). Dash: PrivateSend is CoinJoin, breakable.',
    whyItMatters: 'A suspect on Monero is a wall. Plan to either work around it (off-ramp / on-ramp choke points, mistakes elsewhere) or use legal process to centralized exchanges that touched it.',
  },
  {
    term: 'On-ramp / off-ramp',
    oneLiner: 'Where fiat enters crypto (on-ramp) or crypto becomes fiat (off-ramp).',
    detail: 'Almost always a centralized exchange (Coinbase, Binance, Kraken, OKX, etc.) or a P2P platform (LocalBitcoins legacy, Bisq, Hodl Hodl, peer-to-peer in Telegram groups). Off-ramps are subject to AML/KYC and produce records — this is usually where the investigation gets traction.',
    whyItMatters: 'Most prosecutable evidence comes from off-ramp KYC records. Address tracing is preamble; the off-ramp is the conviction.',
  },
]

// ─── Wallet artifacts on seized devices ──────────────────────────────────────

export interface CryptoWalletArtifact {
  wallet: string
  type: 'Browser extension' | 'Mobile' | 'Desktop' | 'Hardware'
  platform: string
  paths: string[]
  artifacts: string[]
  notes: string
}

export const cryptoWalletArtifacts: CryptoWalletArtifact[] = [
  {
    wallet: 'MetaMask',
    type: 'Browser extension',
    platform: 'Chrome / Firefox / Edge — desktop',
    paths: [
      'Chrome: ~/Library/Application Support/Google/Chrome/Default/Local Extension Settings/nkbihfbeogaeaoehlefnkodbefgpgknn/ (macOS)',
      'Chrome: %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Local Extension Settings\\nkbihfbeogaeaoehlefnkodbefgpgknn\\ (Windows)',
      'Chrome: ~/.config/google-chrome/Default/Local Extension Settings/nkbihfbeogaeaoehlefnkodbefgpgknn/ (Linux)',
    ],
    artifacts: [
      'LevelDB store (.ldb files) — contains encrypted vault',
      'Encrypted vault key: stored in extension storage; encrypted with the user\'s password',
      'Recent address activity, contact book, network endpoints in extension preferences',
    ],
    notes: 'Vault decryption requires the password. Tools: MetaMask-Vault-Decryptor (open source). Most common Ethereum wallet — first thing to look for on suspect laptops.',
  },
  {
    wallet: 'Phantom',
    type: 'Browser extension',
    platform: 'Chrome / Firefox / Brave — desktop',
    paths: [
      'Chrome extension ID: bfnaelmomeimhlpmgjnjophhpkkoljpa',
      'macOS: ~/Library/Application Support/Google/Chrome/Default/Local Extension Settings/bfnaelmomeimhlpmgjnjophhpkkoljpa/',
    ],
    artifacts: [
      'LevelDB encrypted vault',
      'Connected dApps history, recent addresses',
    ],
    notes: 'Dominant Solana wallet; also supports Ethereum and Bitcoin. Similar structure to MetaMask.',
  },
  {
    wallet: 'Trust Wallet',
    type: 'Mobile',
    platform: 'iOS / Android',
    paths: [
      'iOS: /private/var/mobile/Containers/Data/Application/<UUID>/Documents/ — Trust Wallet container',
      'Android: /data/data/com.wallet.crypto.trustapp/ — files + shared_prefs + databases',
    ],
    artifacts: [
      'Encrypted keystore (Android: trust.dat / iOS: wallet files in Documents)',
      'Address book, transaction history cache, connected dApps',
      'Biometric / passcode protected — decryption requires unlocked device',
    ],
    notes: 'Multi-chain (50+ chains). Acquisition needs file-system extraction; iTunes backup excludes app data on iOS.',
  },
  {
    wallet: 'Coinbase Wallet (non-custodial)',
    type: 'Mobile',
    platform: 'iOS / Android',
    paths: [
      'iOS: /private/var/mobile/Containers/Data/Application/<UUID>/ — bundle ID org.toshi (legacy) or com.coinbase.wallet',
      'Android: /data/data/org.toshi/',
    ],
    artifacts: [
      'Encrypted seed phrase storage',
      'Recovery phrase backup may be in iCloud / Google Drive — check cloud accounts',
    ],
    notes: 'Distinct from coinbase.com (custodial exchange). User holds keys. Coinbase\'s cloud-backup feature has been a forensic boon — recovery phrase may be retrievable from the user\'s iCloud / Google account with legal process.',
  },
  {
    wallet: 'Electrum',
    type: 'Desktop',
    platform: 'Windows / macOS / Linux',
    paths: [
      'Windows: %APPDATA%\\Electrum\\wallets\\',
      'macOS: ~/Library/Application Support/Electrum/wallets/',
      'Linux: ~/.electrum/wallets/',
    ],
    artifacts: [
      'Wallet file (default name: default_wallet) — JSON, encrypted if password set',
      'Server history, address labels, transaction notes',
    ],
    notes: 'Bitcoin-only, lightweight SPV client. Wallet file decrypts with the user\'s password. Open with Electrum itself or python-electrum.',
  },
  {
    wallet: 'Bitcoin Core',
    type: 'Desktop',
    platform: 'Windows / macOS / Linux',
    paths: [
      'Windows: %APPDATA%\\Bitcoin\\wallets\\',
      'macOS: ~/Library/Application Support/Bitcoin/wallets/',
      'Linux: ~/.bitcoin/wallets/',
    ],
    artifacts: [
      'wallet.dat — Berkeley DB file containing keys + transaction metadata',
      'May be encrypted (older versions) or descriptor-based (newer)',
    ],
    notes: 'Full node — also holds the entire blockchain locally (~500GB+). Wallet.dat is the high-value file. pywallet (open source) extracts keys from wallet.dat.',
  },
  {
    wallet: 'Exodus / Atomic Wallet',
    type: 'Desktop',
    platform: 'Windows / macOS / Linux',
    paths: [
      'Exodus: %APPDATA%\\Exodus\\exodus.wallet\\ (Windows) · ~/Library/Application Support/exodus.wallet/ (macOS)',
      'Atomic: %APPDATA%\\Atomic\\IndexedDB\\ (Windows) · ~/Library/Application Support/atomic/ (macOS)',
    ],
    artifacts: [
      'Encrypted seed storage (multi-asset)',
      'Recent transactions, exchange history (both have built-in swap features)',
    ],
    notes: 'Atomic Wallet was breached in 2023 — vulnerability suggests weak encryption / key derivation. Targets of opportunity for analysts; suspect may have already lost the funds.',
  },
  {
    wallet: 'Ledger Live (companion to Ledger hardware)',
    type: 'Desktop',
    platform: 'Windows / macOS / Linux',
    paths: [
      'Windows: %APPDATA%\\Ledger Live\\',
      'macOS: ~/Library/Application Support/Ledger Live/',
      'Linux: ~/.config/Ledger Live/',
    ],
    artifacts: [
      'Account list (read-only — public addresses, never private keys)',
      'Transaction history cache',
      'Connected device serial numbers, firmware versions',
    ],
    notes: 'Ledger Live does NOT contain private keys — those are on the hardware device. But it tells you WHICH addresses to look at on-chain. Cross-reference with the device itself if seized.',
  },
  {
    wallet: 'Trezor Suite',
    type: 'Desktop',
    platform: 'Windows / macOS / Linux',
    paths: [
      'Windows: %APPDATA%\\@trezor\\suite-desktop\\',
      'macOS: ~/Library/Application Support/@trezor/suite-desktop/',
    ],
    artifacts: [
      'Account metadata, labels, address book',
      'Optional Dropbox / Google Drive labels backup',
    ],
    notes: 'Same as Ledger Live — host-side metadata only. Private keys remain on the Trezor device. Labels stored in cloud are accessible via OAuth with legal process to Dropbox / Google.',
  },
  {
    wallet: 'Hardware wallet (physical)',
    type: 'Hardware',
    platform: 'Device itself',
    paths: ['Physical device seizure — Ledger Nano S/X/Plus, Trezor One/T/Safe 3, Coldcard, BitBox, etc.'],
    artifacts: [
      'Device PIN required to access. Multiple failed attempts may wipe the device.',
      'Recovery phrase (24 words) — usually backed up on paper, sometimes engraved in metal',
      'Look for nearby seed-phrase storage: paper, metal cards, password managers',
    ],
    notes: 'CRITICAL: do not enter wrong PINs randomly — many wallets wipe after 3-8 attempts. Photograph the device, document serial, work with a crypto-forensics specialist before touching it. The seed phrase backup is more important than the device itself.',
  },
  {
    wallet: 'Seed phrase / paper wallet indicators',
    type: 'Hardware',
    platform: 'Physical seizure',
    paths: ['Anywhere the suspect could have written 12 or 24 words'],
    artifacts: [
      'Lists of 12 or 24 English words (BIP-39 wordlist — 2048 words, all lowercase)',
      'QR codes on paper / printouts',
      'Steel / metal "seed plates" (Cryptosteel, Billfodl, etc.)',
      'Encrypted password manager entries labeled crypto / wallet / seed',
    ],
    notes: 'BIP-39 wordlist is public — running a candidate 12/24 word list against the wordlist is a quick yes/no check. Tools: bip39-validator. Any match plus a wallet name on the same page = seizure target.',
  },
]

// ─── Obfuscation indicators (mixers, bridges, privacy coins) ────────────────

export interface CryptoObfuscation {
  name: string
  type: 'Mixer / CoinJoin' | 'Bridge' | 'Privacy coin' | 'DEX aggregator'
  chains: string
  indicators: string[]
  ciValue: string
  notes: string
}

export const cryptoObfuscation: CryptoObfuscation[] = [
  // Mixers
  {
    name: 'Tornado Cash',
    type: 'Mixer / CoinJoin',
    chains: 'Ethereum + L2s',
    indicators: [
      'Deposit / withdrawal contract addresses publicly known',
      'Funds in/out of Tornado addresses = on-chain visible',
      'Fixed denominations (0.1, 1, 10, 100 ETH; 100, 1000, 10k DAI; etc.)',
    ],
    ciValue: 'OFAC-sanctioned since 2022. Any deposit/withdrawal involvement is a sanctions hit. Known operational compromises allow some pre-2023 transactions to be partially de-anonymized.',
    notes: 'High investigative priority. Chainalysis and TRM Labs have de-mix attribution for specific deposit/withdrawal pairs. Document the txid going IN and any txid coming OUT to the same likely-controlled address with similar timing.',
  },
  {
    name: 'ChipMixer',
    type: 'Mixer / CoinJoin',
    chains: 'Bitcoin',
    indicators: ['Seized by FBI/Europol in March 2023', 'Pre-seizure deposits + withdrawal txids may still be on-chain'],
    ciValue: 'Historical indicator — anyone touching ChipMixer pre-March 2023 has criminal-intent signal. Records seized; LE has subpoena access to its records.',
    notes: 'No longer operational. Historical traces still valuable for cases involving 2018-2023 BTC laundering.',
  },
  {
    name: 'Wasabi Wallet (CoinJoin)',
    type: 'Mixer / CoinJoin',
    chains: 'Bitcoin',
    indicators: [
      'Equal-output CoinJoin transactions: many inputs, many outputs of identical amounts',
      'Coordinator: zkSNACKs (centralized; banned some addresses post-Chainalysis pressure in 2024)',
    ],
    ciValue: 'Self-hosted CoinJoin. Pre-2024: high participation rate. Post-2024 coordinator restrictions: usage dropped, alternatives gained share. Chainalysis publishes Wasabi-attribution data.',
    notes: 'Look for: equal-output (0.1 BTC × 10, etc.) transactions with 8+ inputs and outputs. WalletExplorer and OXT flag known CoinJoin patterns.',
  },
  {
    name: 'Samourai Wallet (Whirlpool)',
    type: 'Mixer / CoinJoin',
    chains: 'Bitcoin',
    indicators: ['Founders charged April 2024 for unlicensed money transmission', 'Whirlpool denominations: 0.001, 0.01, 0.05, 0.5 BTC'],
    ciValue: 'No longer operational. Existing chain traces remain. Operator-side records under federal subpoena.',
    notes: 'Heavily used by privacy advocates AND criminals. The federal indictment offers a comprehensive record of attribution methodology.',
  },

  // Bridges
  {
    name: 'Wormhole',
    type: 'Bridge',
    chains: 'Ethereum, Solana, BSC, Polygon, Avalanche, others',
    indicators: ['Lock-and-mint pattern: token locked on source chain, wrapped version minted on destination'],
    ciValue: 'Both legs are on-chain — fully traceable across chains by amount + timestamp matching. $325M hack in 2022 was followed cross-chain to laundering attempts.',
    notes: 'Use Wormhole\'s explorer (wormholescan.io) to follow specific txs across chains.',
  },
  {
    name: 'Stargate / LayerZero',
    type: 'Bridge',
    chains: 'Multi-chain (Ethereum, BSC, Polygon, Arbitrum, etc.)',
    indicators: ['LayerZero is the underlying protocol; Stargate is the user-facing app'],
    ciValue: 'Like Wormhole — both legs trackable. LayerZero has its own scanner (layerzeroscan.com).',
    notes: 'Increasingly popular for cross-chain laundering. Tracing requires matching amounts + timestamps on both source and destination chains.',
  },
  {
    name: 'Across Protocol / Hop / cBridge',
    type: 'Bridge',
    chains: 'L1 ↔ L2 + cross-L2 (Optimism, Arbitrum, Base, Polygon)',
    indicators: ['Optimistic bridges — small fee + delay before destination tokens arrive'],
    ciValue: 'L2 → L2 movement is now the dominant cross-chain pattern. All bridges publish source/destination on-chain.',
    notes: 'L2 explorers (Arbiscan, Optimistic Etherscan, Basescan) show the destination side; mainnet Etherscan shows the deposit.',
  },

  // Privacy coins
  {
    name: 'Monero (XMR)',
    type: 'Privacy coin',
    chains: 'Monero',
    indicators: ['Native chain, not an Ethereum token. XMR addresses are 95 characters starting with 4 or 8.'],
    ciValue: 'Effectively untraceable. Ring signatures (each tx mixes with 10+ decoys), stealth addresses (one-time destination per tx), RingCT (amounts hidden). NO useful on-chain analysis.',
    notes: 'Investigation route: off-ramp choke points. XMR-to-fiat happens at limited exchanges (Kraken until 2024, regional/decentralized swaps post-2024). Subpoena off-ramp KYC. Also: operational mistakes — suspect reusing an address across chains, posting clearnet info linked to XMR address, etc.',
  },
  {
    name: 'Zcash (ZEC)',
    type: 'Privacy coin',
    chains: 'Zcash',
    indicators: ['Transparent (t-addr, starts with t1/t3) vs Shielded (z-addr, starts with zs)'],
    ciValue: 'Most ZEC activity is on transparent addresses — fully traceable like Bitcoin. Shielded pool usage is single-digit percentages. Z-to-z transactions are private but rare.',
    notes: 'Practical posture: treat ZEC as semi-public unless you see specifically z-to-z transactions. Most off-ramps don\'t accept shielded sends, forcing transparency at the off-ramp.',
  },
  {
    name: 'Dash (PrivateSend)',
    type: 'Privacy coin',
    chains: 'Dash',
    indicators: ['PrivateSend is a CoinJoin variant — looks like equal-input/output mixing'],
    ciValue: 'Chainalysis and others have published de-mixing for Dash PrivateSend. Treat as obfuscated-but-tractable.',
    notes: 'Marketed as a privacy coin but technically just CoinJoin. Lower investigator priority than Monero.',
  },
]

// ─── Off-ramps · exchanges · stablecoin freeze ───────────────────────────────

export interface CryptoOfframp {
  name: string
  type: 'Centralized exchange (CEX)' | 'Stablecoin issuer' | 'Peer-to-peer' | 'Non-KYC / instant swap'
  jurisdiction: string
  kyc: string
  cooperation: string
  legalProcess: string
  notes: string
}

export const cryptoOfframps: CryptoOfframp[] = [
  // CEX with cooperation
  {
    name: 'Coinbase',
    type: 'Centralized exchange (CEX)',
    jurisdiction: 'US (Delaware, listed NASDAQ)',
    kyc: 'Full KYC',
    cooperation: 'High',
    legalProcess: 'Subpoena / court order via legal.coinbase.com. Compliance team responsive. Returns: account holder identity, KYC docs, transaction history, deposit/withdrawal addresses, IP logs.',
    notes: 'Best-cooperation US exchange. Compliance Notice form for emergencies. Most-cited exchange in US crypto-crime cases.',
  },
  {
    name: 'Kraken',
    type: 'Centralized exchange (CEX)',
    jurisdiction: 'US (San Francisco)',
    kyc: 'Full KYC',
    cooperation: 'High',
    legalProcess: 'compliance@kraken.com / law-enforcement portal. Returns equivalent records to Coinbase.',
    notes: 'Strong reputation for cooperation. Discontinued Monero trading for US users in 2024 — pre-2024 XMR off-ramp records may be available.',
  },
  {
    name: 'Binance / Binance.US',
    type: 'Centralized exchange (CEX)',
    jurisdiction: 'Binance: offshore (now Cayman). Binance.US: US-regulated entity.',
    kyc: 'Full KYC (Binance.US); variable historically (Binance global)',
    cooperation: 'Mixed',
    legalProcess: 'Binance.US: standard US legal process. Binance global: pre-2023 was less cooperative; post-DOJ settlement (Nov 2023) more responsive.',
    notes: 'Largest exchange by volume. Significant overlap between Binance global and laundering activity historically. Recent compliance reforms changed posture.',
  },
  {
    name: 'Bybit / OKX / KuCoin',
    type: 'Centralized exchange (CEX)',
    jurisdiction: 'Offshore (Seychelles / Cayman / others)',
    kyc: 'Variable',
    cooperation: 'Mixed',
    legalProcess: 'Compliance addresses published on each site. Response varies by jurisdiction of requestor and case specifics.',
    notes: 'Common destinations for funds leaving US-jurisdiction exchanges. KuCoin had US enforcement action 2024.',
  },

  // Non-KYC / red flags
  {
    name: 'ChangeNOW / SimpleSwap / FixedFloat',
    type: 'Non-KYC / instant swap',
    jurisdiction: 'Various offshore',
    kyc: 'No KYC for small amounts',
    cooperation: 'Low / nonexistent',
    legalProcess: 'Limited / case-by-case. No durable customer records.',
    notes: 'Used for cross-chain swaps without account creation. Address-to-address — may have IP / session logs but no identity. Red flag if seen in a transaction chain.',
  },
  {
    name: 'LocalBitcoins (legacy) / Bisq / Hodl Hodl',
    type: 'Peer-to-peer',
    jurisdiction: 'Various / decentralized',
    kyc: 'No / minimal',
    cooperation: 'LocalBitcoins shut down Feb 2023; records exist with legal process. Bisq/Hodl Hodl: decentralized, no central records.',
    legalProcess: 'LocalBitcoins records: subpoena to Finland-based parent (or successor). Bisq/Hodl Hodl: no central party.',
    notes: 'Pre-2023 LocalBitcoins is a key data source for historical investigations. Modern P2P (Bisq) is much harder.',
  },
  {
    name: 'Telegram P2P groups',
    type: 'Peer-to-peer',
    jurisdiction: 'Telegram corporate (Dubai)',
    kyc: 'None',
    cooperation: 'Telegram cooperates inconsistently; 2024 changes after Durov arrest improved response.',
    legalProcess: 'Subpoena to Telegram for user records / group membership / message history. Post-2024 they comply with valid legal process for serious crimes.',
    notes: 'Increasingly common venue for crypto-cash exchange. Often paired with cash drops or hawala-style settlement.',
  },

  // Stablecoin freeze
  {
    name: 'Tether (USDT)',
    type: 'Stablecoin issuer',
    jurisdiction: 'British Virgin Islands',
    kyc: 'N/A (issuer)',
    cooperation: 'High for clear LE requests',
    legalProcess: 'lawenforcement.requests@tether.to. Freeze form requires: target address, txids, case docs. Response time: hours-to-days for credible LE requests.',
    notes: 'USDT-Tron (TRC-20) is the #1 stablecoin used in crypto crime today. Tether has frozen $billions in criminal proceeds — fast, cooperative, no court order needed (just a credible LE request). Single biggest LE win in modern crypto cases.',
  },
  {
    name: 'Circle (USDC)',
    type: 'Stablecoin issuer',
    jurisdiction: 'US (Boston)',
    kyc: 'N/A (issuer)',
    cooperation: 'High; standard US legal process',
    legalProcess: 'compliance@circle.com / subpoena. Circle has frozen significant criminal proceeds especially in DPRK / sanctioned-entity cases.',
    notes: 'USDC is on Ethereum, Solana, Base, Arbitrum, and others — each chain version is separately freezable. Circle\'s freeze is fast but follows formal legal process more than Tether.',
  },
  {
    name: 'MakerDAO (DAI)',
    type: 'Stablecoin issuer',
    jurisdiction: 'Decentralized (no entity to subpoena)',
    kyc: 'N/A',
    cooperation: 'N/A — no freeze capability',
    legalProcess: 'None possible. DAI cannot be frozen by any party.',
    notes: 'When seen in a transaction chain after USDT/USDC, suspect may be intentionally choosing un-freezable stablecoin. Investigative flag.',
  },
  {
    name: 'OFAC SDN List (sanctions screening)',
    type: 'Stablecoin issuer',
    jurisdiction: 'US Treasury',
    kyc: 'N/A',
    cooperation: 'Reference list, not an entity',
    legalProcess: 'sanctionssearch.ofac.treas.gov — search by name or crypto address. Tornado Cash, Lazarus Group, ransomware affiliates all listed with specific addresses.',
    notes: 'US-jurisdiction obligations: cannot transact with SDN-listed addresses, period. Cross-reference every suspect address. Chainalysis / TRM / Elliptic auto-screen against this list.',
  },
]

// ─── Common case patterns ─────────────────────────────────────────────────────

export interface CryptoCasePattern {
  pattern: string
  typicalChain: string
  typicalAmount: string
  flow: string[]
  pivots: string[]
  notes: string
}

export const cryptoCasePatterns: CryptoCasePattern[] = [
  {
    pattern: 'Ransomware payment',
    typicalChain: 'Bitcoin (primarily); Monero increasingly',
    typicalAmount: '$50k–$10M+ BTC; smaller affiliates accept XMR',
    flow: [
      '1. Victim pays attacker BTC address (one-time / per-victim)',
      '2. Attacker consolidates payments → wallet aggregation transactions',
      '3. Funds move through mixer (historically ChipMixer / Wasabi / Tornado) or bridge to other chain',
      '4. Cashout via OTC desk, non-KYC exchange, or Russia-based exchange',
    ],
    pivots: [
      'Initial payment address tied to ransomware family (Chainalysis publishes IOCs)',
      'Wallet aggregation = likely controller address',
      'Pre-cashout exchange deposit = subpoena target',
    ],
    notes: 'Most-studied crypto crime pattern. Chainalysis Reactor and TRM Labs have ransomware-family attribution. Tracking initial-payment address → aggregator → off-ramp is the standard workflow.',
  },
  {
    pattern: 'Pig butchering / romance investment fraud',
    typicalChain: 'USDT on Tron (TRC-20) — dominant',
    typicalAmount: '$10k–$5M per victim, often life savings',
    flow: [
      '1. Victim grooming via Telegram / WhatsApp / dating app',
      '2. Victim deposits to a fake "trading platform" address (USDT-Tron)',
      '3. Funds consolidate to scam-organization wallets',
      '4. Conversion to USDT or BTC, off-ramp through Southeast Asia exchanges (Huione Pay, Cambodia-based platforms)',
    ],
    pivots: [
      'Victim has the address they sent funds to — primary IOC',
      'Tronscan to trace USDT-TRC20 flow',
      'Cluster analysis often shows organization-wide aggregator addresses',
      'TETHER FREEZE: USDT freezable, request via lawenforcement.requests@tether.to',
    ],
    notes: 'Now the #1 crypto crime by dollar volume (~$3-5B/year). FBI IC3 publishes annual stats. Tether freeze is THE most effective intervention — request early, evidence may still be recoverable.',
  },
  {
    pattern: 'Investment fraud / Ponzi (non-crypto-native)',
    typicalChain: 'Variable — often whatever the marketing emphasizes',
    typicalAmount: '$1M–$1B+ schemes',
    flow: [
      '1. Promoters market "guaranteed return" investment',
      '2. Victim funds → company wallet → operator personal wallet',
      '3. Late-stage withdrawals paid with new-deposit funds (Ponzi structure)',
      '4. Collapse / exit scam — operator off-ramps remainder',
    ],
    pivots: [
      'Company wallet addresses (often publicized in marketing materials)',
      'Direct flow to identified principal addresses',
      'Exchange off-ramp with US-jurisdiction KYC',
    ],
    notes: 'Often paired with traditional securities-fraud charges. Crypto trail supplements rather than replaces the financial-records investigation.',
  },
  {
    pattern: 'Sextortion / data-extortion payments',
    typicalChain: 'Bitcoin',
    typicalAmount: '$200–$5k per victim, mass-targeted',
    flow: [
      '1. Threat email demands BTC payment to specific address',
      '2. Multiple victim payments hit same address (or per-victim addresses with shared spending pattern)',
      '3. Funds consolidate, mix, off-ramp',
    ],
    pivots: [
      'Address is in the threat email — direct IOC',
      'Common-input ownership heuristic clusters across victims',
      'Volume is low per-victim but high aggregate; cooperation between victims valuable',
    ],
    notes: 'FBI IC3 collects these reports. Mempool.space + WalletExplorer often enough for a competent investigator without paid tools.',
  },
  {
    pattern: 'Drug marketplace / darknet payment',
    typicalChain: 'Monero (post-2020), Bitcoin (legacy)',
    typicalAmount: '$50–$50k per purchase',
    flow: [
      '1. Buyer deposits to marketplace escrow',
      '2. Sale completes, vendor withdraws',
      '3. Vendor off-ramps through mixer + exchange',
    ],
    pivots: [
      'Marketplace address clusters often well-attributed (Chainalysis, etc.)',
      'Vendor profile + clearnet OpSec mistakes (PGP key reuse, posting patterns)',
      'Mail intercepts often more productive than chain tracing for individual purchases',
    ],
    notes: 'Most major marketplaces (Hydra, AlphaBay, etc.) eventually fall to LE through OpSec mistakes rather than chain analysis. Chain analysis supports indictments rather than driving identification.',
  },
  {
    pattern: 'DeFi exploit / smart contract hack',
    typicalChain: 'Ethereum + L2s primarily',
    typicalAmount: '$1M–$600M per incident',
    flow: [
      '1. Exploit drains protocol funds to attacker address',
      '2. Funds quickly move through Tornado Cash (pre-sanction) or bridge to other chain',
      '3. Multi-month dormant period',
      '4. Slow off-ramp through privacy-coin swaps or distributed exchange deposits',
    ],
    pivots: [
      'Exploit txid + attacker address (public from the moment of attack)',
      'On-chain monitoring tools (Etherscan watchlist, OpenZeppelin Forta) catch movement',
      'DPRK / Lazarus Group attribution for ~50% of major DeFi hacks since 2022',
    ],
    notes: 'Best-publicized cases. Chainalysis Crypto Crime Report annual summary tracks these. North Korea attribution + OFAC sanctions are common outcomes.',
  },
]


// ─── Code & Repo OSINT ────────────────────────────────────────────────────────

export interface CodeOSINTTool {
  name: string
  url: string
  category: string
  cost: string
  what: string
  notes: string
}

export const codeOSINT: CodeOSINTTool[] = [
  { name: 'GitHub search dorks',          url: 'github.com/search',                                category: 'Search',                cost: 'Free',                what: 'GitHub-specific dorking: filename:, extension:, org:, language:, raw strings',                       notes: 'Examples: filename:.env DB_PASSWORD; extension:pem private; org:target "internal"; language:python "secret_key". Free GitHub login required for full results.' },
  { name: 'TruffleHog',                   url: 'github.com/trufflesecurity/trufflehog',            category: 'Secret scanning',       cost: 'Free (open source)',  what: 'Scan repos / orgs / git history for committed secrets — verifies live keys',                          notes: 'Verifier mode confirms whether found credentials are still valid. Run against entire orgs: trufflehog github --org=acme --only-verified.' },
  { name: 'Gitleaks',                     url: 'github.com/gitleaks/gitleaks',                     category: 'Secret scanning',       cost: 'Free (open source)',  what: 'Static analysis for secrets across git history',                                                      notes: 'Faster than TruffleHog for pure pattern matching; no live verification. Great for pre-commit hooks and CI gates.' },
  { name: 'GitHound',                     url: 'github.com/tillson/git-hound',                     category: 'Secret scanning',       cost: 'Free (open source)',  what: 'GitHub-wide secret hunting with regex + entropy across all of public GitHub',                          notes: 'Targets specific orgs/users at scale. Pattern-based dorking. Requires multiple GitHub PATs to bypass rate limits.' },
  { name: 'Sourcegraph',                  url: 'sourcegraph.com/search',                           category: 'Code search',           cost: 'Free public / paid',  what: 'Cross-repo code search — regex, structural, public + private',                                         notes: 'Search across millions of GitHub/GitLab repos via cloud instance. Better regex and structural search than GitHub native.' },
  { name: 'grep.app',                     url: 'grep.app',                                         category: 'Code search',           cost: 'Free',                what: 'Fast regex search across millions of public GitHub repos',                                             notes: 'No login required. Snappy. Useful for finding unique strings, idioms, or vulnerable patterns.' },
  { name: 'GitDorker',                    url: 'github.com/obheda12/GitDorker',                    category: 'Dorking',               cost: 'Free (open source)',  what: 'Automated GitHub dork runner — wordlist + token rotation',                                              notes: 'Runs hundreds of dorks against a target org. Supply multiple PATs to relieve rate limits.' },
  { name: 'gitGraber',                    url: 'github.com/hisxo/gitGraber',                       category: 'Continuous monitoring', cost: 'Free (open source)',  what: 'Continuously monitor GitHub for newly-committed secrets',                                              notes: 'Daemon-style. Useful as continuous SOC-style detection over a target organization or technology fingerprint.' },
  { name: 'S3Scanner',                    url: 'github.com/sa7mon/S3Scanner',                      category: 'Cloud config leaks',    cost: 'Free (open source)',  what: 'Find publicly readable S3 / GCS / Azure blob buckets',                                                 notes: 'Common bucket patterns: company-{prod,dev,backup,assets}. Public bucket = potential data leak. Pairs with subdomain enumeration.' },
  { name: 'Sourcegraph code intelligence',url: 'sourcegraph.com',                                  category: 'Code intelligence',     cost: 'Free public',         what: 'Code navigation across the indexed open-source ecosystem',                                              notes: 'Find references, definitions, and dependents. Useful for understanding the spread of a vulnerability or pattern across ecosystems.' },
  { name: 'PyPI / npm typosquat search',  url: 'pypi.org',                                         category: 'Supply chain',          cost: 'Free',                what: 'Inspect packages by name; check for typosquats around target dependencies',                            notes: 'For supply-chain investigations: identify suspicious package names, recent first-time publishers, and packages with single maintainers.' },
]

// ─── Archive & Wayback ────────────────────────────────────────────────────────

export interface ArchiveTool {
  name: string
  url: string
  category: string
  cost: string
  what: string
  notes: string
}

export const archiveOSINT: ArchiveTool[] = [
  { name: 'Wayback Machine',              url: 'web.archive.org',                                 category: 'Web archive',           cost: 'Free',                  what: 'Internet Archive snapshots — billions of captures since 1996',                                            notes: 'Calendar view to compare versions. URL prefix queries: web.archive.org/web/*/example.com/* finds all snapshots of a domain.' },
  { name: 'Archive.today',                url: 'archive.ph',                                      category: 'Web archive',           cost: 'Free',                  what: 'On-demand web page archiving with screenshot — captures paywalled / JS-heavy pages',                       notes: 'Robots.txt-defying. Captures dynamic content better than Wayback. Permanent shareable URLs. Good for citing rapidly-changing pages.' },
  { name: 'Google Cache',                 url: 'webcache.googleusercontent.com',                  category: 'Web archive',           cost: 'Free (mostly retired)', what: 'Google\'s cached version of indexed pages',                                                                notes: 'Largely retired in Sept 2024. Try cache:url operator or Wayback for historical pages.' },
  { name: 'CommonCrawl',                  url: 'commoncrawl.org',                                 category: 'Web archive',           cost: 'Free',                  what: 'Petabytes of crawled web pages, freely downloadable',                                                      notes: 'Best for large-scale historical web mining. Requires AWS / scripting; not for casual one-off lookups.' },
  { name: 'Wayback CDX API',              url: 'archive.org/help/wayback_api.php',                category: 'API',                   cost: 'Free',                  what: 'Programmatic access to Wayback snapshots',                                                                 notes: 'curl "http://web.archive.org/cdx/search/cdx?url=example.com&output=json" returns all snapshot metadata for a URL.' },
  { name: 'Hunchly',                      url: 'hunch.ly',                                        category: 'Investigation archive', cost: '$130/year',             what: 'Browser plugin that auto-archives every page during an investigation',                                    notes: 'Used by professional investigators. Captures visited pages with metadata; chain-of-custody friendly.' },
  { name: 'SingleFile',                   url: 'github.com/gildas-lormeau/SingleFile',            category: 'Investigation archive', cost: 'Free',                  what: 'Browser extension that saves a webpage as a single self-contained HTML file',                              notes: 'Lightweight alternative to Hunchly. No central index but each capture is portable and auditable.' },
  { name: 'Memento Time Travel',          url: 'timetravel.mementoweb.org',                       category: 'Multi-archive',         cost: 'Free',                  what: 'Aggregator that searches multiple web archives at once (Wayback, LOC, etc.)',                              notes: 'Useful when Wayback is missing a snapshot — try here as the meta-search across all federated archives.' },
  { name: 'PullPush (Reddit archive)',    url: 'pullpush.io',                                     category: 'Forum archive',         cost: 'Free',                  what: 'Reddit submissions and comments, including deleted ones',                                                  notes: 'Replaces the defunct Pushshift API. Same shape. Critical for retrieving moderated/deleted Reddit content.' },
  { name: 'YouTube content on archive.org',url: 'archive.org',                                    category: 'Media archive',         cost: 'Free',                  what: 'Many removed YouTube videos persist as fan mirrors on archive.org',                                        notes: 'Search archive.org for the YouTube channel ID or video URL — controversial / removed content often shows up here.' },
]

// ─── Vehicle / Transport OSINT ────────────────────────────────────────────────

export interface VehicleTool {
  name: string
  url: string
  category: string
  jurisdiction: string
  cost: string
  what: string
  notes: string
}

export const vehicleOSINT: VehicleTool[] = [
  { name: 'NHTSA VIN Decoder',     url: 'vpic.nhtsa.dot.gov/decoder',                     category: 'VIN',           jurisdiction: 'US (works for global compliant VINs)', cost: 'Free',          what: 'Free VIN decoder — make, model, engine, manufacturing plant',                                                       notes: 'Authoritative for US-market vehicles. VINs from 1981+ are 17 chars; older are non-standard. API also available.' },
  { name: 'NICB VINCheck',         url: 'nicb.org/vincheck',                              category: 'VIN history',   jurisdiction: 'US',                                  cost: 'Free (5/day)',  what: 'Check if a vehicle is reported stolen or salvaged',                                                                  notes: 'Limited to 5 lookups per day. Good for vehicle provenance checks.' },
  { name: 'VinAudit',              url: 'vinaudit.com',                                   category: 'VIN history',   jurisdiction: 'US',                                  cost: '$10–25/report', what: 'Title history, accidents, mileage, theft',                                                                          notes: 'Cheaper alternative to Carfax. Pulls from same DMV data sources.' },
  { name: 'FAA Aircraft Registry', url: 'registry.faa.gov',                               category: 'Aircraft',      jurisdiction: 'US',                                  cost: 'Free',          what: 'N-number / serial → registered owner, address, model, year',                                                       notes: 'Free public records. Reveals shell-company aircraft ownership patterns common in private/corporate aviation.' },
  { name: 'UK CAA G-INFO',         url: 'siteapps.caa.co.uk/g-info',                      category: 'Aircraft',      jurisdiction: 'UK',                                  cost: 'Free',          what: 'UK aircraft registry — G- prefix tail numbers',                                                                     notes: 'Each EU country has its own registry. Germany: lba.de; France: aviation-civile.gouv.fr. EASA portal aggregates some.' },
  { name: 'Equasis (vessels)',     url: 'equasis.org',                                    category: 'Maritime',      jurisdiction: 'Global',                              cost: 'Free',          what: 'IMO number → owner, classification, port-state inspection history',                                                  notes: 'Free with registration. Beneficial-owner trails often visible despite shell-company structures. Industry-standard.' },
  { name: 'IHS Sea-web',           url: 'sea-web.com',                                    category: 'Maritime',      jurisdiction: 'Global',                              cost: 'Paid',          what: 'Commercial vessel database with ownership history',                                                                  notes: 'Used by sanctions analysts. Tracks ownership changes over time more completely than free sources.' },
  { name: 'Plate Recognizer',      url: 'platerecognizer.com',                            category: 'License plate', jurisdiction: 'Varies',                              cost: 'Freemium',      what: 'OCR for license plates from images',                                                                                 notes: 'Free 2,500/month tier. Use ethically and lawfully — many jurisdictions restrict plate-to-owner lookups for non-LE.' },
]

// ─── Document & Metadata OSINT ────────────────────────────────────────────────

export interface DocumentTool {
  name: string
  url: string
  category: string
  cost: string
  what: string
  notes: string
}

export const documentOSINT: DocumentTool[] = [
  { name: 'ExifTool',                    url: 'exiftool.org',                                category: 'Metadata',          cost: 'Free (open source)', what: 'CLI: read/write/edit metadata in 100+ file formats (JPEG, PDF, Office, video)',                                       notes: 'Standard practitioner tool. exiftool file.pdf reveals author, software, creation timestamps, GPS coordinates from photos.' },
  { name: 'FOCA',                        url: 'github.com/ElevenPaths/FOCA',                 category: 'Metadata harvest',  cost: 'Free (open source)', what: 'Crawl a domain for documents and extract metadata at scale',                                                            notes: 'Pulls all docs from a target site, extracts authors / usernames / internal paths from metadata. Windows-native; runs in Wine.' },
  { name: 'Metagoofil',                  url: 'github.com/laramies/metagoofil',              category: 'Metadata harvest',  cost: 'Free (open source)', what: 'CLI alternative to FOCA — doc enumeration via search engines + metadata extraction',                                  notes: 'Cross-platform. Slower than FOCA for big targets but scriptable.' },
  { name: 'GetMetadata',                 url: 'getmetadata.com',                             category: 'Web tools',         cost: 'Free / paid',        what: 'Web-based metadata viewer for uploaded files',                                                                          notes: 'Quick checks without installing anything. Don\'t upload sensitive or classified files — they hit a third party.' },
  { name: 'pdfgrep',                     url: 'pdfgrep.org',                                 category: 'PDF',               cost: 'Free (open source)', what: 'Grep across PDF files — searches text content, not just filenames',                                                    notes: 'pdfgrep -r "pattern" /docs/ — invaluable for searching large doc collections during investigations.' },
  { name: 'pdftotext / pdfinfo',         url: 'poppler.freedesktop.org',                     category: 'PDF',               cost: 'Free (open source)', what: 'Poppler utilities: extract text and metadata from PDF',                                                                 notes: 'apt install poppler-utils. pdfinfo reveals creation tool, author, dates. pdftotext for content extraction.' },
  { name: 'oletools',                    url: 'github.com/decalage2/oletools',               category: 'Office docs',       cost: 'Free (open source)', what: 'Analyze Office documents — macros, embedded objects, metadata',                                                         notes: 'olevba for macros, oleid for general triage, oleobj for embedded payloads. Useful for both investigation and threat triage.' },
  { name: 'DocumentCloud',               url: 'documentcloud.org',                           category: 'Document hosting',  cost: 'Free (verified)',    what: 'Investigative journalist platform — searchable archive of public-interest documents',                                  notes: 'Search across millions of leaked / FOIA\'d documents from journalist organizations worldwide.' },
  { name: 'CrossRef / Sci-Hub mirror',   url: 'crossref.org',                                category: 'Academic',          cost: 'Free',               what: 'DOI lookup → academic paper metadata, authors, citation graph',                                                         notes: 'Free DOI resolution. Author affiliations and ORCIDs link academic personas across publications.' },
  { name: 'Google Scholar',              url: 'scholar.google.com',                          category: 'Academic',          cost: 'Free',               what: 'Academic publication search — author profiles, citation metrics, affiliations',                                        notes: 'Author profile pages reveal employment history through paper affiliations over time. h-index for credibility scoring.' },
]

// ─── Verification Toolkit ─────────────────────────────────────────────────────

export interface VerificationTool {
  name: string
  url: string
  category: string
  what: string
  notes: string
}

export const verificationToolkit: VerificationTool[] = [
  { name: 'Bellingcat Online Investigations Toolkit', url: 'bit.ly/bcattools',                                  category: 'Toolkit (curated)',  what: 'Curated, frequently-updated list of OSINT tools maintained by Bellingcat',                                                   notes: 'Hundreds of tools categorized by use case. Authoritative starting point — cross-check before adopting any new tool.' },
  { name: 'InVID Verification Plugin',                url: 'invid-project.eu/tools-and-services/invid-verification-plugin', category: 'Video verification', what: 'Browser plugin: keyframe extraction, reverse image search on frames, magnifier, metadata',                                  notes: 'EU-funded; standard tool for journalist video verification. Identifies repurposed / staged videos by extracting keyframes for reverse search.' },
  { name: 'RevEye',                                   url: 'github.com/JOSM/reveye',                            category: 'Image search relay', what: 'Browser extension: right-click → search image across multiple reverse engines simultaneously',                                notes: 'Sends one image to Google, Bing, Yandex, TinEye, Baidu in one click. Massive time-saver vs. running each manually.' },
  { name: 'FotoForensics',                            url: 'fotoforensics.com',                                 category: 'Image forensics',    what: 'Error Level Analysis (ELA) and metadata for tamper detection',                                                                notes: 'Quick check for "is this image edited?" — ELA shows JPEG compression inconsistencies. Not definitive but a useful first pass.' },
  { name: 'Forensically',                             url: 'forensically.guillermoamaral.com',                  category: 'Image forensics',    what: 'Browser-based suite: ELA, clone detection, noise analysis, geometry tools',                                                  notes: 'No upload required — runs in-browser, so safer for sensitive images. Better UX than FotoForensics for one-off analysis.' },
  { name: 'YouTube DataViewer',                       url: 'amnestyusa.org/citizenevidence',                    category: 'Video verification', what: 'Amnesty Citizen Evidence Lab tool — extract upload time, thumbnails, reverse image search',                                  notes: 'Identifies if a video was reposted / re-uploaded. Compare upload date against claimed event date.' },
  { name: 'SunCalc',                                  url: 'suncalc.org',                                       category: 'Chronolocation',     what: 'Sun azimuth/elevation by time and place — solve shadow puzzles',                                                              notes: 'Given a shadow direction in an image, infer the time of year + day for a known location. Cross-listed under Geo.' },
  { name: 'WolframAlpha (weather queries)',           url: 'wolframalpha.com',                                  category: 'Chronolocation',     what: 'Historical weather data by city + date',                                                                                       notes: 'Cross-check claimed conditions: rain, fog, snow on a specific day. Identifies fakes via mismatched weather.' },
  { name: 'Plonkit (geolocation guides)',             url: 'plonkit.net',                                       category: 'Geolocation training', what: 'Community guides for country/region identification by visual cues',                                                          notes: 'Plates, road markings, utility poles, vegetation, vehicles — all signal national/regional origin. Built for GeoGuessr but excellent for OSINT.' },
  { name: 'OSINT Combine — Verification methods',     url: 'osintcombine.com/free-osint-tools',                 category: 'Methodology',        what: 'Free tools and methodology guides for verifying digital content',                                                              notes: 'Process-oriented — explains how to chain verification steps for a coherent finding.' },
  { name: 'TinEye reverse image',                     url: 'tineye.com',                                        category: 'Image provenance',   what: 'Reverse image search optimized for finding the earliest occurrence of an image online',                                       notes: 'Sort results by oldest. Best for verifying whether an image existed before a claimed date.' },
]

import type { RawSearchEntry } from '@/lib/search/types'
import { playbooks } from './workflows'

export const osintSearchEntries: RawSearchEntry[] = [
  ...searchOperators.map<RawSearchEntry>(o => ({ title: o.operator, aka: o.engine.join('/'), subtitle: o.description, section: 'search' })),
  ...peopleSources.map<RawSearchEntry>(s => ({ title: s.name, aka: s.cost, subtitle: s.dataTypes.join(' · '), section: 'people' })),
  ...usernameSources.map<RawSearchEntry>(s => ({ title: s.name, aka: s.method, subtitle: s.coverage, section: 'username' })),
  ...emailOSINT.map<RawSearchEntry>(t => ({ title: t.name, aka: `${t.category} · ${t.cost}`, subtitle: t.what, section: 'email' })),
  ...imageTools.map<RawSearchEntry>(t => ({ title: t.name, aka: t.method, subtitle: t.bestFor, section: 'image' })),
  ...socialPlatforms.map<RawSearchEntry>(p => ({ title: p.platform, aka: 'Social media', subtitle: p.keyTechniques[0] ?? '', section: 'social' })),
  ...infraTools.map<RawSearchEntry>(t => ({ title: t.name, aka: t.url, subtitle: t.what, section: 'infra' })),
  ...archiveOSINT.map<RawSearchEntry>(t => ({ title: t.name, aka: `${t.category} · ${t.cost}`, subtitle: t.what, section: 'archive' })),
  ...codeOSINT.map<RawSearchEntry>(t => ({ title: t.name, aka: `${t.category} · ${t.cost}`, subtitle: t.what, section: 'code' })),
  ...cryptoOSINT.map<RawSearchEntry>(t => ({ title: t.name, aka: `${t.category} · ${t.cost}`, subtitle: t.what, section: 'crypto' })),
  ...cryptoConcepts.map<RawSearchEntry>(c => ({ title: c.term, aka: 'Crypto concept', subtitle: c.oneLiner, section: 'crypto' })),
  ...cryptoWalletArtifacts.map<RawSearchEntry>(w => ({ title: w.wallet, aka: `Crypto wallet · ${w.type}`, subtitle: w.platform, section: 'crypto' })),
  ...cryptoObfuscation.map<RawSearchEntry>(o => ({ title: o.name, aka: `Crypto · ${o.type}`, subtitle: o.chains, section: 'crypto' })),
  ...cryptoOfframps.map<RawSearchEntry>(o => ({ title: o.name, aka: `Crypto off-ramp · ${o.type}`, subtitle: o.jurisdiction, section: 'crypto' })),
  ...cryptoCasePatterns.map<RawSearchEntry>(p => ({ title: p.pattern, aka: 'Crypto case pattern', subtitle: p.typicalChain, section: 'crypto' })),
  ...phoneTools.map<RawSearchEntry>(t => ({ title: t.name, aka: t.cost, subtitle: t.what, section: 'phone' })),
  ...darkWebSources.map<RawSearchEntry>(s => ({ title: s.name, aka: s.type, subtitle: s.what, section: 'darkweb' })),
  ...corpSources.map<RawSearchEntry>(s => ({ title: s.name, aka: s.cost, subtitle: s.what, section: 'corp' })),
  ...geoTools.map<RawSearchEntry>(t => ({ title: t.name, aka: t.category, subtitle: t.what, section: 'geo' })),
  ...vehicleOSINT.map<RawSearchEntry>(t => ({ title: t.name, aka: `${t.category} · ${t.jurisdiction}`, subtitle: t.what, section: 'vehicle' })),
  ...documentOSINT.map<RawSearchEntry>(t => ({ title: t.name, aka: t.category, subtitle: t.what, section: 'document' })),
  ...verificationToolkit.map<RawSearchEntry>(t => ({ title: t.name, aka: t.category, subtitle: t.what, section: 'verify' })),
  // Workflow playbooks — surfaceable via search so people can find them by name.
  ...playbooks.map<RawSearchEntry>(p => ({ title: p.title, aka: 'Playbook', subtitle: p.goal, section: 'workflows' })),
]
