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
