// One entry per case study. Image keys map to /assets/<slug>/<key>.webp
// Prefix "@" = show in a browser frame, "%" = website on a phone, none = platform default.

export type Story = {
  slug: string; order: number; name: string; type: string; color: string;
  platform: 'phone' | 'browser'; domain: string;
  figmaUrl: string; prototypeUrl: string;
  hook: string; desc: string; meta: string[]; heroShots: [string, string];
  popup: { tags: string[]; collage: [string, string, string]; path: string };
  ch1: { intro: string; what: string; problem: string; who: [string, string, string, string][]; personaNote: string;
    objectives: string[]; why: string; jtbd: string[]; landscape: [string, string, string][] };
  ch2: { intro: string; ia: { root: string; sections: [string, string[]][] }; iaNote: string; journeyTitle: string;
    journey: string[]; branches: [string, string, string][]; interactions: [string, string][]; flowMap: boolean };
  ch3: { intro: string; process: [string, string][]; evolution: string[]; iterations: [string, string, string][]; dsNote: string; foundations: boolean };
  ch4: { intro: string; gallery: [string, string][]; flow: [string, string][]; taps: string[]; micro: [string, string, string][];
    modesTitle: string; modes: [string, string][]; protoNote: string };
  ch5: { intro: string; decisions: [string, string, string, string][]; validation: [string, string, string][];
    targets: [string, string][]; targetNote?: string; next: string[] };
};

const ROLE = 'My role · product designer — IA, UI, design system, prototype';
const TOOLS = 'Tools · Figma (variables, components, prototyping)';

export const stories: Story[] = [
  {
    slug: 'kosh', order: 1, name: 'Kosh', type: 'Mobile app · Fintech', color: 'var(--as-app-kosh)', platform: 'phone', domain: 'kosh.app',
    figmaUrl: 'https://www.figma.com/design/wLbcL3YUWFObmOZrWHMt9N/KOSH-APPLICATION?node-id=23-4',
    prototypeUrl: 'https://www.figma.com/proto/wLbcL3YUWFObmOZrWHMt9N/KOSH-APPLICATION?node-id=23-4',
    hook: 'Money apps fail on trust before they fail on features.',
    desc: 'A mobile money copilot for India. Kosh links every bank account through the RBI Account Aggregator framework, explains spending automatically, and turns insights into budgets, goals, SIPs and UPI payments.',
    meta: [ROLE, 'Product design · concept', 'iOS & Android', '28 core screens + states + dark', 'Sep 2026', TOOLS], heroShots: ['home', 'consent'],
    popup: { tags: ['iOS & Android', 'Light + Dark', 'Consent-first'], collage: ['home', 'consent', 'receipt'], path: '~/creativity/kosh' },
    ch1: {
      intro: 'What Kosh is, who it serves, and the problem it exists to solve.',
      what: 'Kosh is a mobile money copilot for Indian users. It links every bank account through the RBI Account Aggregator (AA) framework, explains spending automatically, and turns insights into action through budgets, goals, SIPs and UPI payments — in one app.',
      problem: 'A typical salaried user holds 2–4 bank accounts, a credit card and scattered mutual funds. No single view exists, SMS-reading apps feel invasive, and investing apps ignore day-to-day cash flow — so people stop tracking, or rely on memory.',
      who: [
        ['Aarav, 27 · primary', 'Salaried engineer, Bengaluru; 3 bank accounts, 1 credit card, ad-hoc SIPs', 'See where his salary goes; save for a bike and an emergency fund', 'Five apps to check; forgets subscriptions; unsure if SIPs are on track'],
        ['Meera, 34 · secondary', 'Freelance designer, Pune; irregular income, 2 accounts', 'Smooth out lean months; set aside tax money', 'Budgets built for fixed salaries; no cash-flow forecast'],
        ['Rakesh, 52 · edge case', 'Small shop owner, Lucknow; prefers Hindi, careful about sharing data', 'A simple view of savings; safe UPI payments', 'Distrusts apps that read SMS; small text; jargon'],
      ],
      personaNote: 'Assumption-based personas built from the product brief and competitor review — to be confirmed in the interviews planned in chapter 5.',
      objectives: ['One trusted picture of money: net worth and cash flow across all linked accounts.', 'Insight without effort: auto-categorisation and anomaly alerts, no manual entry.', 'Insight to action in two taps: every insight links to a budget, goal, SIP or payment.', 'Trust by design: consent is explicit, reviewable and revocable at any time.'],
      why: 'Earn trust first, then earn attention. The first session has to deliver one useful insight within 3 minutes — and every data request has to justify itself in plain language.',
      jtbd: ['When my salary lands, I want to know what is already committed, so I can decide what is safe to spend.', 'When something unusual happens in my account, I want to be told quickly and clearly, so I can act before it costs me.', 'When I set a goal, I want to see if I am on track, so I stay motivated without doing maths.', 'When an app asks for my financial data, I want to know exactly what it sees and for how long, so I feel in control.'],
      landscape: [['Investment-first apps', 'e.g. Groww, INDmoney', 'Strong on portfolios; weak on day-to-day cash flow'], ['Rewards & neobank apps', 'e.g. CRED, Jupiter', 'Drive engagement, but tie you to one account or card'], ['Kosh', 'Where it fits', 'Bank-agnostic cash-flow intelligence that hands off to action — differentiated by the consent experience and insight-to-action']],
    },
    ch2: {
      intro: 'How people move through Kosh, from opening the app to their first insight and every task after it.',
      ia: { root: 'Kosh', sections: [['Home', ['Net worth + cash flow', 'Notifications', 'Profile & consent']], ['Spend', ['Transactions', 'Budgets', 'Insights']], ['Pay · centre', ['Scan & pay', 'Bill reminders', 'Receipts']], ['Grow', ['Goals', 'Portfolio', 'SIPs']], ['Ask', ['AI chat', 'Chart answers']]] },
      iaNote: 'Five tabs; Pay is the raised centre key. Profile, security and consent open from the avatar on Home — rare, but always one tap away.',
      journeyTitle: 'Main journey · onboarding to first insight',
      journey: ['Splash', 'Value carousel', 'Phone + OTP', 'Biometric setup', 'Select banks', '?Review consent', 'Linking progress', '!Dashboard with first insight'],
      branches: [['Review consent', 'Decline', 'Manual mode — an empty dashboard that explains what linking unlocks']],
      interactions: [['Consent: approve or decline', 'Decline lands on an empty dashboard that explains what linking unlocks — a real path, not a dead end.'], ['Anomaly alert: was this you?', 'Yes → recategorise or split, with an Undo toast. No → report to the bank through a deep link.'], ['Payment: success, pending or failed', 'Each has its own receipt. A failure says why and offers one-tap retry.'], ['Goal: on track?', 'The what-if slider shows whether a SIP closes the gap before anything is committed.']],
      flowMap: true,
    },
    ch3: {
      intro: 'From the brief to a full, handoff-ready system — including the gaps I found and fixed along the way.',
      process: [['Brief & goals', 'Goals and success metrics'], ['Research plan', 'Interviews, consent-card tests'], ['IA & flows', '5 tabs; flows A–D'], ['Wireframes', 'Greyscale structure first'], ['Design system', '4 variable collections, 39 components'], ['High-fidelity UI', '28 core screens'], ['States & dark', 'Errors, loading, pop-ups; full dark set'], ['Prototype & handoff', 'Flows wired; tokens with code syntax']],
      evolution: ['home', 'consent'],
      iterations: [['Core screens only, happy path', 'Every screen got its real states: loading, empty, error, offline, pop-ups and confirmations', 'A gap audit showed people would hit states the design hadn’t covered — failed payments, timeouts, consent revoked.'], ['Light mode only', 'A complete dark set for every screen, plus a dark design-system board', 'People check money at night and in public; dark mode and privacy mode belong together.'], ['Screens without a map', 'A user flow map with tap-by-tap paths and a component-usage index', 'So a developer can follow any path and know which component builds each screen.']],
      dsNote: 'Primitives → semantic → component variables, with Light and Dark modes and code syntax for Web, iOS and Android. Screens bind only to semantic tokens, so a theme change never needs a redesign.',
      foundations: true,
    },
    ch4: {
      intro: 'High-fidelity screens in real devices, a connected flow and the small motions that make it feel trustworthy.',
      gallery: [['home', '06 · Home dashboard'], ['banks', '05 · Select banks'], ['consent', '05a · Review consent'], ['txn', '08b · Transaction detail'], ['goal', '10 · Goal detail'], ['upi', '12 · UPI amount entry'], ['receipt', '12a · Payment receipt'], ['ask', '13 · Ask Copilot']],
      flow: [['banks', 'Select banks'], ['consent', 'Review consent'], ['home', 'First insight']], taps: ['tap “Continue”', 'tap “Approve & link”'],
      micro: [['Net-worth reveal', 'Amount counts up over 600 ms on first load; the sparkline draws left to right.', 'Final value shown instantly'], ['Privacy mode', 'Tap the eye or long-press a balance — amounts blur to ••••• in 150 ms, light haptic.', 'Instant swap'], ['Transaction swipe', 'Swipe left to reveal Recategorise and Split.', 'Actions in a long-press menu'], ['What-if slider', 'Drag the SIP amount; projection and target date update live at 60 fps.', 'Update on release'], ['Payment success', 'Check draws in, amount settles 0.95 → 1, success haptic.', 'Static check and text'], ['Copilot typing', 'Three-dot indicator; the answer streams in sentence by sentence.', 'Answer appears whole']],
      modesTitle: 'Light and dark', modes: [['home', 'Light'], ['home-dark', 'Dark']],
      protoNote: 'Flows A–D are wired in the Kosh file: onboarding to first insight, anomaly to resolution, goal to SIP, and UPI payment.',
    },
    ch5: {
      intro: 'Why it looks and behaves the way it does — and how each choice makes money feel less stressful.',
      decisions: [['LAYOUT', 'One primary number per card', 'Clarity over density; secondary data lives one tap deeper.', '“Am I okay?” is answered at a glance.'], ['COLOUR', 'Debits stay neutral, not red', 'Spending is normal. Red is saved for real problems: overspend, failed payments, fraud.', 'Everyday spending doesn’t alarm; real alerts stand out.'], ['COLOUR', 'One indigo, only for action', 'Indigo always means “you can tap this”.', 'A calmer screen and fewer wrong taps.'], ['TYPE', 'Inter with tabular figures; ₹ at 70%', 'Amounts line up in columns and the number is the focus, not the symbol.', 'Faster scanning of balances and transactions.'], ['NAVIGATION', 'Pay is the raised centre tab', 'Paying is the most frequent task.', 'One thumb move from anywhere in the app.'], ['TRUST', 'Consent on one legible card', 'Data, purpose, frequency and expiry in plain words; revoke in 2 taps.', 'People link accounts knowing exactly what they share.']],
      validation: [['Gap audit of every screen', 'Found states the design didn’t cover: failed payments, timeouts, offline, revoked consent', '28 state, pop-up and error frames added'], ['Dark-mode & night-use review', 'Money is checked at night and in public', 'Full dark set of every screen + privacy mode'], ['WCAG 2.2 contrast check', 'Every text colour pair measured', 'All pairs pass AA; primary text and amounts AAA'], ['Handoff walkthrough', 'Could a developer follow every path?', 'User-flow map with tap-by-tap paths + component index']],
      targets: [['60%', 'link 2+ accounts in the first session'], ['75%', 'complete Account Aggregator consent'], ['< 3 min', 'to the first useful insight'], ['90%', 'task success on 5 core tasks'], ['80+', 'SUS usability score']],
      next: ['Run the 6 interviews and the 5-second test on the consent card.', 'Moderated usability test: 5 core tasks with 5 people.', 'Design the tablet layouts for Home, Transactions and Portfolio.'],
    },
  },
  {
    slug: 'pulsewise', order: 2, name: 'Pulsewise', type: 'Health · App + console', color: 'var(--as-app-pulsewise)', platform: 'phone', domain: 'console.pulsewise.health',
    figmaUrl: 'https://www.figma.com/design/PMiYIIPhgUUbw8TkZPB0XE/Pulsewise',
    prototypeUrl: 'https://www.figma.com/proto/PMiYIIPhgUUbw8TkZPB0XE/Pulsewise?node-id=19-10393&starting-point-node-id=19%3A10393',
    hook: 'A number always has a verdict — for patients, and for the clinicians watching over them.',
    desc: 'Remote patient monitoring for chronic conditions. Patients take readings at home with connected devices; clinicians see a risk-ranked queue that tells them who needs attention first, today.',
    meta: [ROLE, 'Product design · concept', 'Patient app + clinician console', '27 screens · large text · dark', '2026', TOOLS], heroShots: ['today', 'critical'],
    popup: { tags: ['Patient app', 'Clinician console', 'Safety-critical'], collage: ['today', 'critical', 'plan'], path: '~/creativity/pulsewise' },
    ch1: {
      intro: 'A safety-critical product with two opposite users — and one problem between them.',
      what: 'Pulsewise is a remote patient monitoring platform for chronic conditions like hypertension and type 2 diabetes. Patients take readings at home with connected devices; clinicians see a risk-ranked queue that tells them who needs attention first, today.',
      problem: 'Between appointments, a patient with hypertension or diabetes is effectively invisible. Readings live in a notebook nobody reads, so deterioration is caught at the next visit. Clinics that do collect remote data drown in it — hundreds of readings a day, no triage, no context.',
      who: [
        ['Sushila, 64 · primary patient', 'Retired teacher, Pune; hypertension + type 2 diabetes; reading glasses', 'Know whether today’s reading is fine; avoid a hospital visit', 'Small text; charts with no verdict; fear of “doing it wrong”'],
        ['Ravi, 38 · caregiver', 'Sushila’s son in Dubai; checks in daily', 'See mum’s readings without calling every evening', 'No visibility; hears about problems late'],
        ['Dr Anand, 41 · clinician', '300 monitored patients; 20 minutes between clinics', 'Find the 5 patients who need action today', 'Data dumps, 6 clicks per patient, alert fatigue'],
        ['Nurse Farah, 29 · coordinator', 'Triages the queue daily and calls patients', 'Work the queue without losing her place', 'Duplicated calls; unclear ownership of alerts'],
      ],
      personaNote: 'Assumption-based personas built from the product brief and competitor review — to be confirmed in the interviews planned in chapter 5.',
      objectives: ['Effortless capture: a reading reaches the care team without the patient typing anything.', 'Signal over volume: clinicians see a ranked queue, not a data dump.', 'Closed loop: every alert ends in a decision that is recorded and visible to the patient.', 'Safety by design: no alert is silently lost, and no critical value appears without a next step.'],
      why: 'Safety outranks elegance. One number, one action: every screen says what is happening and what to do — and never shows a clinical value without the next step attached.',
      jtbd: ['When I take a reading at home, I want to know immediately whether it is normal for me, so I am not left guessing overnight.', 'When something is out of range, I want to know whether to act now or mention it at my next visit, so I neither panic nor ignore it.', 'When I open the console before clinic, I want the queue ordered by who is deteriorating, so I spend my 20 minutes on the right five patients.', 'When I act on an alert, I want my decision recorded and visible, so nobody repeats the call.'],
      landscape: [['Device-maker apps', 'Cuff and glucometer apps', 'Excellent at capture, but stop at the patient’s phone'], ['Hospital portals', 'EHR patient portals', 'Hold the record, but built for documentation, not triage'], ['Pulsewise', 'Where it fits', 'Device-agnostic capture + an acuity-ranked triage queue with a closed-loop alert']],
    },
    ch2: {
      intro: 'Two surfaces, deliberately asymmetric: a calm phone app for patients and a queue-first console for clinicians.',
      ia: { root: 'Pulsewise', sections: [['Patient · Today', ['Reading + verdict', 'Vital cards']], ['Patient · Trends', ['Vital history', 'Manual log']], ['Patient · Plan', ['Medications', 'Reminders']], ['Patient · Care team', ['Messages', 'Video consult']], ['Console · Triage', ['Ranked queue', 'Filters']], ['Console · Patient 360', ['Timeline', 'Care plan', 'Thresholds']]] },
      iaNote: 'Four thumb-sized tabs for patients; a persistent left nav and queue-first workspace for clinicians. Pairing, caregivers and ABHA live in the patient’s profile.',
      journeyTitle: 'The safety spine · out-of-range reading to resolution',
      journey: ['Reading synced', '?Within thresholds?', 'Patient alert + what to do', 'Queue: ranked by acuity', 'Clinician reviews Patient 360', 'Message, adjust plan or call', '!Patient sees the decision'],
      branches: [['Within thresholds?', 'Yes', 'Today: reassurance'], ['Within thresholds?', 'Critical', 'Alert + call the care team, pinned to the top of the queue']],
      interactions: [['Critical alert', 'Interrupts on both surfaces and can’t be dismissed without choosing an action.'], ['Acknowledge', 'Explicit and attributed — opening a record never counts. Unacknowledged critical alerts escalate after 30 minutes.'], ['No device yet?', 'Manual logging works the same day; pairing can come later.'], ['Offline', 'Both sides show the last successful sync time — no silent failure.']],
      flowMap: true,
    },
    ch3: {
      intro: 'Designing two surfaces from one system, then stress-testing it against the hardest user: 64, at 200% text.',
      process: [['Brief & goals', 'Safety principles, metrics'], ['Research plan', 'Interviews, coordinator inquiry'], ['IA & flows', 'Two surfaces; flows A–D'], ['Wireframes', 'Calm vs dense layouts'], ['Design system', 'Shared tokens, 2 density modes'], ['High-fidelity UI', 'Patient app + console'], ['States, large text, dark', 'Failures, variants, night shifts'], ['Prototype & handoff', 'Flows wired; FHIR mapping']],
      evolution: ['today', 'critical'],
      iterations: [['States only for the happy path', '30 states: pairing failed, syncing, no reading, missed dose, session timeout, invalid thresholds and more', 'Safety principle one is “no silent failure” — every one of these happens in a real clinic.'], ['Large text planned as a setting', 'Six large-text patient screens designed as real variants', 'The primary user is 64 with reading glasses; 200% text has to be designed, not just scaled.'], ['Light only', 'A full dark set of every screen and a dark design-system board', 'Clinicians work night shifts and keep the console open all day.']],
      dsNote: 'One token set for two surfaces: Comfortable density for the patient app, Compact for the console, a Large-text type mode, and red, amber and green reserved for clinical acuity only.',
      foundations: true,
    },
    ch4: {
      intro: 'Calm screens for patients, dense screens for clinicians — and the motions that carry clinical meaning.',
      gallery: [['today', '04 · Today'], ['critical', '06 · Critical alert'], ['plan', '07 · Plan · medications'], ['manual', '05a · Manual log'], ['@queue', '14 · Triage queue (console)'], ['@p360', '15 · Patient 360 (console)']],
      flow: [['today', 'Reading arrives'], ['critical', 'Critical alert'], ['@queue', 'Clinician’s queue'], ['@p360', 'Patient 360']], taps: ['crosses threshold', 'ranks first', 'open patient'],
      micro: [['Reading arrives', 'Value cross-fades in over 250 ms; the verdict follows 100 ms later.', 'Both appear at once'], ['Verdict change', 'Banner slides down 250 ms; a single haptic only at Critical.', 'Banner appears in place'], ['Pairing progress', 'A ring expands once per device found; status text updates.', 'Text-only status list'], ['Queue update', 'New row expands in 250 ms; the acuity bar draws left to right.', 'Row appears, no draw'], ['Threshold edit', 'The band resizes live; points restate their acuity on release.', 'Numeric entry updates on blur'], ['Live call', 'The recording dot is the only looping animation in the product.', 'Solid dot + “Recording”']],
      modesTitle: 'Standard, large text and dark', modes: [['today', 'Standard'], ['today-large', 'Large text'], ['today-dark', 'Dark']],
      protoNote: 'Flows A–D are wired in the Pulsewise file: onboarding to first reading, alert to resolution, the clinician triage round and teleconsult.',
    },
    ch5: {
      intro: 'In a clinical product every visual choice is a safety choice. Here’s what I decided, and why.',
      decisions: [['COLOUR', 'Red, amber and green only ever mean acuity', 'Nothing decorative is allowed to look like an alarm.', 'When something turns red, it really matters.'], ['COLOUR', 'Vital colours never encode risk', 'A blood-pressure line is violet whatever its value; only the acuity badge turns red.', 'Charts can’t be misread as a verdict.'], ['TYPE', 'Source Sans 3 at 17 px; IBM Plex Mono for readings', 'A large x-height for a 64-year-old; slashed zero and distinct 1/7 for nurses scanning 140/90 vs 110/70.', 'Fewer misread values on both surfaces.'], ['LAYOUT', 'One reading and one verdict per patient screen', 'A number always has a verdict and a next step.', 'Patients know at once whether to act.'], ['DENSITY', 'Comfortable vs Compact density modes', 'Same components, different spacing: 9 → 14 patients per console screen.', 'Faster triage without a second design system.'], ['ACCESSIBILITY', 'No precision gestures for patients', 'No swipe or drag — every action is a tap on a 56 px control.', 'Usable with tremor and low phone confidence.']],
      validation: [['Safety-state audit', 'Checked every “no silent failure” case', '30 states added: pairing failed, syncing, no reading, missed dose, timeout, invalid thresholds…'], ['Older-user review', 'Primary user is 64 with reading glasses', 'Six large-text variants designed, not just scaled'], ['WCAG 2.2 contrast check', 'Acuity and vitals colours measured', 'All acuity labels ≥ 5:1; readings AAA'], ['Night-shift review', 'Console stays open all day', 'Full dark set + dark design-system board']],
      targets: [['80%', 'pair a device in the first session'], ['70%', 'reading adherence by week 4'], ['95%', 'critical alerts acknowledged within 30 min'], ['< 90 s', 'clinician time per patient review'], ['75+', 'SUS score, patients aged 60+']],
      next: ['6 patient interviews (4 aged 60+) and a contextual inquiry with 2 care coordinators.', 'Usability test at 200% text with 5 patients; timed triage tasks with 3 clinicians.', 'Threshold card sort with 3 clinicians to validate the acuity model.'],
    },
  },
  {
    slug: 'promptjuice', order: 3, name: 'Promptjuice', type: 'Website · Learning', color: 'var(--as-app-promptjuice)', platform: 'browser', domain: 'promptjuice.design',
    figmaUrl: 'https://www.figma.com/design/Hr8WnTOa049krIlHWiCqYm/Prompt-juice',
    prototypeUrl: 'https://www.figma.com/proto/Hr8WnTOa049krIlHWiCqYm/Prompt-juice?node-id=12-7858&starting-point-node-id=12%3A7858',
    hook: 'Show the recipe, not the magic.',
    desc: 'A website where designers collect visual references, discover AI tools and learn how prompts actually work. Every reference comes with a colour-coded prompt recipe you can remix.',
    meta: [ROLE, 'Product design · concept', 'Website · desktop + mobile', '12 desktop + 8 mobile pages · Studio mode', 'Sep 2026', TOOLS], heroShots: ['home', 'playground'],
    popup: { tags: ['Website', 'Illustration system', 'Desktop + Mobile'], collage: ['home', 'refdetail', 'playground'], path: '~/creativity/promptjuice' },
    ch1: {
      intro: 'Why designers keep getting lucky — or unlucky — with AI tools, and what a better teacher looks like.',
      what: 'Promptjuice is a website where designers collect visual references, discover AI tools and learn how prompts work. Every reference in the library comes with a prompt recipe: the exact prompt, broken into colour-coded parts, plus the tools that do it best.',
      problem: 'Designers are told to “just prompt it”, but prompting is taught as a list of magic words. Reference sites show what good looks like, tool directories list which tools exist, and prompt guides are walls of text. Nobody connects the three.',
      who: [
        ['Ananya, 24 · primary', 'Junior product designer, Bengaluru; uses AI tools weekly for moodboards', 'Consistent, on-brand outputs instead of lucky accidents', 'Copies prompts from Twitter that never work twice'],
        ['Kabir, 31 · secondary', 'Freelance brand designer; pitches 3 clients a month', 'A reusable library of looks he can adapt per client', 'References and prompts live in 4 different apps'],
        ['Meera, 38 · edge case', 'Design lead introducing AI to a team of 12', 'A shared prompt vocabulary for the team', 'Everyone prompts differently; results are unrepeatable'],
      ],
      personaNote: 'Assumption-based personas built from the product brief and competitor review — to be confirmed in the interviews planned in chapter 5.',
      objectives: ['Make prompts legible: every prompt is visibly broken into its six parts.', 'Learn by remixing: change one part and see how the result changes.', 'References become recipes: saving a reference also saves a reusable prompt.', 'Honest tool guidance: compare tools on real outputs from the same prompt.'],
      why: 'Learning tools usually look like software. I wanted this to feel like a zine made by designers for designers — and to make every prompt legible, so people learn structure instead of magic words.',
      jtbd: ['When I find a reference I love, I want to know how to reproduce its style, so I can use it in my own work.', 'When a prompt gives me a bad result, I want to know which part caused it, so I can fix it instead of starting over.', 'When I pick an AI tool, I want to compare real outputs from the same prompt, so I choose on evidence.', 'When I teach my team, I want a shared structure everyone can follow, so our outputs stay consistent.'],
      landscape: [['Reference libraries', 'e.g. Pinterest, Dribbble, Mobbin', 'Inspiration without instructions'], ['Prompt marketplaces & guides', 'Prompt packs, long guides', 'Sell or list prompts without teaching structure'], ['Promptjuice', 'Where it fits', 'Where the three overlap: a colour-coded prompt anatomy on every reference, remixable in a Playground']],
    },
    ch2: {
      intro: 'Four doors into the site, and every one of them leads to the same place: remixing a prompt.',
      ia: { root: 'Promptjuice', sections: [['References', ['Masonry gallery', 'Reference + recipe']], ['Learn', ['Lesson path', 'Prompt anatomy']], ['Tools', ['Tool directory', 'Same-prompt comparison']], ['Playground', ['Remix a prompt', 'Swap one part']], ['Library', ['Saved recipes', 'Collections']]] },
      iaNote: 'Four doors, one destination: every path converges on the Playground. Saved recipes live in the Library, behind the avatar.',
      journeyTitle: 'The core loop · reference to recipe',
      journey: ['Browse references', 'Open reference', 'See prompt recipe', 'Remix in Playground', 'Swap one part', '?Signed in?', '!Save to library'],
      branches: [['Signed in?', 'No', 'Sign-up sheet that keeps your work → Library with your first recipe']],
      interactions: [['Hover a prompt part', 'Its highlight intensifies and its character waves on the anatomy line-up.'], ['Swap a part', 'The old chip flips out, the new one flips in, the output cross-fades.'], ['Save → sign up', 'Sign-up appears only at the first save, so nobody hits a wall before seeing value.'], ['Pick a tool', 'The same prompt across four tools, compared on real outputs.']],
      flowMap: true,
    },
    ch3: {
      intro: 'From a teaching idea — six parts of a prompt — to a visual language, a cast of characters and a full site.',
      process: [['Brief & goals', 'Concept, metrics'], ['Research plan', 'Interviews, prompt card sort'], ['IA & flows', '4 doors to the Playground'], ['Wireframes', 'Gallery and recipe layouts'], ['Design system', 'Stickers, gradients, 6 parts'], ['Illustration cast', 'Characters per prompt part'], ['Pages & states', 'Desktop, mobile, Studio'], ['Prototype & handoff', 'Flows A–C wired']],
      evolution: ['home', 'refdetail'],
      iterations: [['Desktop pages only', '8 mobile pages from 390 wide, plus a mobile menu and sign-up sheet', 'Designers browse references on their phones; the recipe has to work at 390.'], ['Happy-path pages', '13 states: generating, saved toast, prompt copied, no results, wrong tag, Pro gate, 500 page and more', 'Learning is full of wrong answers — the product has to respond kindly to them.'], ['A light Playground only', 'A complete Studio (dark) set of every page and a Studio design-system board', 'Long remix sessions are easier on the eyes in a dark studio.']],
      dsNote: 'Hard-edged stickers on soft gradients: flat fills, 2 px ink outlines and hard offset shadows for components; shade ramps and gradients only in the background. Six prompt-part tokens carry the teaching system.',
      foundations: true,
    },
    ch4: {
      intro: 'The pages, a connected flow, and motion that feels like handling paper stickers.',
      gallery: [['home', '01 · Home'], ['refdetail', '03 · Reference detail'], ['lesson', '05 · Lesson'], ['playground', '08 · Playground (Studio)']],
      flow: [['home', 'Home'], ['refdetail', 'Reference + recipe'], ['playground', 'Playground']], taps: ['open a reference', 'tap “Remix”'],
      micro: [['Hover any card', 'Lifts 2 px; the hard shadow grows 4 → 6 px with a spring.', 'Shadow grows only'], ['Press', 'Moves 4 px down-right onto its shadow; the shadow collapses to 0.', 'Colour darkens one shade'], ['Hover a prompt part', 'Its underlay intensifies; its character waves.', 'Underlay only'], ['Swap a part', 'Old chip flips out, new chip flips in; the output cross-fades.', 'Instant swap, 1-frame highlight'], ['Hero prompt machine', 'Cards drop in one by one and a picture prints out — it runs once.', 'Static final frame'], ['Save a recipe', 'The card bounces; the Library icon gets a +1 badge.', 'Badge only']],
      modesTitle: 'Studio mode and mobile', modes: [['home-studio', 'Studio (dark)'], ['%home-mobile', 'Mobile · 390']],
      protoNote: 'Flows A–C are wired in the Promptjuice file: reference to saved recipe, the first lesson, and choosing a tool.',
    },
    ch5: {
      intro: 'A playful brand still has to be easy. Here’s where the personality stops and the usability rules take over.',
      decisions: [['VISUAL LANGUAGE', 'Hard edges, soft air', 'Components are flat stickers with ink outlines and hard shadows; gradients stay in the background.', 'Controls are unmistakable even on a colourful page.'], ['COLOUR', 'Six colours = six prompt parts', 'Every part has a colour, a glyph and a label — never colour alone.', 'People learn prompt structure by sight.'], ['TYPE', 'Space Grotesk, Inter and JetBrains Mono', 'Zine attitude for headings, legibility for body, and mono so prompts read as something you can copy and edit.', 'Prompts look editable, so people edit them.'], ['ACCESSIBILITY', 'Pink is never text on white', 'pink/600 on white is only 4.0 : 1, so links are ink with an underline.', 'All text on sticker colours passes AAA.'], ['FLOW', 'Sign-up only at the first save', 'Browsing, two lessons and the Playground stay open.', 'Value comes before the ask.'], ['INTERACTION', 'Press = the shadow collapses', 'The element moves onto its own shadow.', 'Tactile feedback with zero ambiguity.']],
      validation: [['State audit', 'What happens when learners get it wrong?', '13 states: generating, wrong tag, no results, Pro gate, 500 page…'], ['Mobile review', 'Designers browse on their phones', '8 mobile pages from 390 wide + mobile menu and sign-up sheet'], ['WCAG 2.2 contrast check', 'Text on six sticker colours measured', 'All text AAA; pink never used for text on white'], ['Long-session review', 'Remixing happens in long sessions', 'Complete Studio (dark) set of every page']],
      targets: [['45%', 'of reference views open a prompt breakdown'], ['60%', 'complete Lesson 1'], ['8', 'recipes saved per active user, month 1'], ['3+', 'remix actions per session'], ['4%', 'free → Pro conversion']],
      next: ['6 interviews with designers who use AI tools weekly.', 'Card sort of 40 real prompts into the six parts.', '5-second test on the home hero, then a find–remix–save usability test.'],
    },
  },
  {
    slug: 'relay', order: 4, name: 'Relay', type: 'Web app · AI workflows', color: 'var(--as-app-relay)', platform: 'browser', domain: 'app.relay.dev',
    figmaUrl: 'https://www.figma.com/design/91k6GaPJiQAs0gsu98FFiG/Relay',
    prototypeUrl: 'https://www.figma.com/proto/91k6GaPJiQAs0gsu98FFiG/Relay?node-id=20-63877&starting-point-node-id=20%3A63877',
    hook: 'Show the work.',
    desc: 'Where operations teams build, run and supervise AI agent workflows — a canvas to build, a trace for every run, and human approval gates before anything risky happens.',
    meta: [ROLE, 'Product design · concept', 'B2B web app · 1440', '29 screens · landing page · dark + light', 'Sep 2026', TOOLS], heroShots: ['canvas', 'trace'],
    popup: { tags: ['B2B web app', 'Motion & scroll', 'Dark + Light'], collage: ['canvas', 'trace', 'approval'], path: '~/creativity/relay' },
    ch1: {
      intro: 'Agents are running real operations. When one fails at 2 a.m., someone has to understand what happened.',
      what: 'Relay is where operations teams build, run and supervise AI agent workflows. You assemble a graph of LLM steps, tools and human approval gates on a canvas, publish it, and then watch every run: each step, its tokens, its cost, its latency, and where it went wrong.',
      problem: 'Teams are wiring agents into real operations — refunds, claims, onboarding, support triage — with tools built for demos. When a run fails at 2 a.m., nobody can answer what the agent did, what it cost, and where a human should have stopped it.',
      who: [
        ['Divya, 33 · primary', 'Ops lead on a fintech support team; builds workflows, doesn’t write code', 'Automate refund triage without losing control of edge cases', 'Builders that hide what the agent did; failures she can’t debug alone'],
        ['Sam, 29 · builder', 'Automation engineer; lives in the canvas and the trace', 'Ship changes fast without breaking production', 'No diffing, no versioning, no safe way to test a prompt change'],
        ['Priya, 41 · approver', 'Team manager; only ever sees approval requests', 'Decide quickly with enough context; edit before approving', 'A payload blob and a yes/no button'],
        ['Marcus, 45 · admin', 'Platform owner; buys the tool', 'Control access, secrets and spend across teams', 'No cost attribution; keys pasted into node configs'],
      ],
      personaNote: 'Assumption-based personas built from the product brief and competitor review — to be confirmed in the interviews planned in chapter 5.',
      objectives: ['The graph is the source of truth: what you build is exactly what runs and what you can replay.', 'Every run is explainable: any output traces back to a step, a prompt version, an input and a cost.', 'Humans stay in the loop by design: approval gates are first-class nodes with their own inbox.', 'Change is safe: versions, diffs and evaluations before publish; instant rollback after.'],
      why: 'Show the work. Every automated action has to be inspectable, attributable and reversible — and the interface has to make that inspection fast, not merely possible.',
      jtbd: ['When I build a workflow, I want to test it on real inputs before publishing, so I don’t learn about failures from customers.', 'When a run fails, I want to see the exact step, prompt and response that broke, so I can fix the node instead of guessing.', 'When an agent wants to take a risky action, I want a human decision with full context, so we stay accountable.', 'When I change a prompt, I want to see what changed and how it scores against past cases, so improvements are measurable.'],
      landscape: [['Visual automation tools', 'Integration-first builders', 'Treat an LLM step as one more block — no token, cost or eval story'], ['Agent frameworks', 'Code-first SDKs', 'Powerful, but invisible to ops teams'], ['Relay', 'Where it fits', 'Build and watch in one model: the graph you draw is the graph you replay, step by step']],
    },
    ch2: {
      intro: 'Five areas, ordered by how often an ops team touches them, and one signature move: from a failed span straight to its node.',
      ia: { root: 'Relay', sections: [['Overview', ['Metrics', 'Attention list']], ['Workflows', ['Canvas editor', 'Node config', 'Test run', 'Versions & diff']], ['Runs', ['Runs list', 'Trace view', 'Span inspector']], ['Approvals', ['Inbox', 'Approval detail']], ['Evals', ['Suites', 'Comparison']], ['Admin', ['Integrations & secrets', 'Members & roles', 'Usage & billing']]] },
      iaNote: 'Admin is pinned at the bottom of the rail. The canvas is a workspace, not a page: library, config and test panel are layers that never navigate away.',
      journeyTitle: 'The observability spine · failed run to fix',
      journey: ['Alert: run failed', 'Runs list, failures only', 'Trace view', 'Span inspector', 'Jump to node on canvas', '!Fix and re-run from that step'],
      branches: [['Span inspector', 'Paused at a gate', 'Approval inbox → approve, edit & approve, or reject with a reason']],
      interactions: [['Approval gate', 'The run pauses and an SLA timer starts; nothing expires mid-decision.'], ['Edit & approve', 'The approver can change the payload; the diff is recorded and shown to the owner.'], ['Publish', 'Blocked until checks pass; the previous version stays available for one-click rollback.'], ['Eval regressed', '“2 of 40 cases got worse” — compare before publishing.']],
      flowMap: true,
    },
    ch3: {
      intro: 'An Apple-structured system, a canvas that simplifies as you zoom out, and specs for every motion and scroll.',
      process: [['Brief & goals', 'Metrics, AI trust model'], ['Research plan', 'Ops interviews, trace test'], ['IA & flows', '5 areas; flows A–E'], ['Wireframes', 'Canvas, trace, inbox'], ['Design system', 'Materials, 1 accent, motion tokens'], ['High-fidelity UI', '29 screens, dark'], ['States & light', 'Failures, empty, full light set'], ['Motion & scroll specs', 'Landing scrollytelling']],
      evolution: ['canvas', 'trace'],
      iterations: [['Product screens only', '19 states: SSO error, empty canvas, publish blocked, test failed, approval expired, budget at 92%, viewer read-only and more', 'Ops tools live in their failure states; the trace and inbox had to be designed for them.'], ['Dark, plus three light shots', 'A complete light set of every screen and a light design-system board', 'Dark is the default, but light has to be a full peer.'], ['Components living inside screens', '24 extracted components and 8 new ones (dialog, toast, banner, tooltip, menu…) with a usage index', 'Every screen is built from the same parts, and engineering can map them to code.']],
      dsNote: 'One blue accent; translucent materials with backdrop blur instead of boxes; four elevation levels; concentric radii; and a Motion collection whose Reduced mode turns every animation off with one switch.',
      foundations: true,
    },
    ch4: {
      intro: 'Dense, calm screens; a flow from failure to fix; and motion that always carries information.',
      gallery: [['overview', '04 · Overview'], ['canvas', '06 · Canvas editor'], ['trace', '08 · Trace view'], ['approval', '09a · Approval detail']],
      flow: [['overview', 'Overview · failed run'], ['trace', 'Trace · span inspector'], ['canvas', 'Canvas · flown to the node']], taps: ['open the run', '“Jump to node”'],
      micro: [['Node drop', 'Scales 1.04 → 1 with a settle; the shadow falls; grid snap pulses once.', 'Instant place'], ['Run starts', 'The trigger’s border begins a travelling accent stroke; downstream nodes dim to 60%.', 'Solid accent stroke'], ['Data flowing', 'A 24 px highlight travels the active edge; completed edges settle to green.', 'Static accent edge'], ['Run fails', 'The failing node shakes 4 px twice and its red border fades in.', 'Red border only'], ['Span → node fly-to', 'The canvas pans and zooms to the node; its ring pulses twice.', 'Jump with a static ring'], ['Approval arrives', 'The gate node pulses amber, the inbox badge counts up, a toast slides in.', 'Badge and toast only']],
      modesTitle: 'Light mode and the scrollytelling landing', modes: [['canvas-light', 'Light mode'], ['landing', 'Landing page · scrollytelling']],
      protoNote: 'Flows A–E are wired in the Relay file: build and publish, failure to fix, approval, safe change, and the landing page.',
    },
    ch5: {
      intro: 'A precise instrument, not a dashboard. These choices keep a dense tool calm and an AI accountable.',
      decisions: [['COLOUR', 'One accent; colour only for meaning', 'Run status and node type are the only saturated colours.', 'The screen stays calm even when it’s dense.'], ['DEPTH', 'Materials over panels', 'Translucent sidebars and popovers with a 1 px hairline instead of heavy borders.', 'Layers read as glass; the canvas stays visible.'], ['TYPE', 'Inter + JetBrains Mono, tabular figures', 'Anything a machine wrote is mono; costs and latencies don’t jitter as runs stream in.', 'Runs are faster and safer to read.'], ['CANVAS', 'Semantic zoom', 'Text never shrinks below 11 px — it disappears instead.', 'Legible and fast at 150 nodes.'], ['MOTION', 'Motion only explains a state change', 'Only “running” animates continuously; a Reduced mode turns it all off.', 'Motion carries information, never noise.'], ['TRUST', 'Approval gates are first-class nodes', 'Risky actions default to Approve, with full context and edit-before-approve.', 'Humans stay in the loop by design.']],
      validation: [['Failure-state audit', 'Ops tools live in their failure states', '19 states: SSO error, publish blocked, test failed, approval expired, budget 92%…'], ['Light-mode parity check', 'Dark is default; light must be a peer', 'Complete light set + light design-system board'], ['Token audit', 'Any colour outside the system?', '0 unbound colours across dark and light'], ['Component audit', 'Were screens built from shared parts?', '24 components extracted, 8 added, with a usage index']],
      targets: [['< 10 min', 'to the first successful test run'], ['70%', 'of failed runs diagnosed without engineering'], ['< 2 min', 'median approval decision'], ['60%', 'of workflows published with an eval'], ['60 fps', 'canvas interaction up to 150 nodes']],
      next: ['5 interviews with ops leads running agents in production.', 'Timed trace-reading test: 5 people, one failed run.', 'Card sort of 30 node types, and an approval-copy test with managers.'],
    },
  },
  {
    slug: 'hyra', order: 5, name: 'Hyra', type: 'Web app · HR dashboard', color: 'var(--as-app-hyra)', platform: 'browser', domain: 'hyra.app',
    figmaUrl: 'https://www.figma.com/design/0wclXZu4BIreI7DBmQaA8x/HYRA-Dashboard',
    prototypeUrl: 'https://www.figma.com/proto/0wclXZu4BIreI7DBmQaA8x/HYRA-Dashboard?node-id=1-996&starting-point-node-id=1%3A996',
    hook: 'Everything an HR team checks before 10 a.m., on one screen.',
    desc: 'An HR dashboard that brings people, attendance, leave, hiring, onboarding, payroll and approvals into one place — so an HR manager starts the day with what needs her, not with six tabs.',
    meta: [ROLE, 'Product design · concept', 'Web app · 1600', '14 screens · light + dark', '2026', TOOLS], heroShots: ['dashboard', 'dashboard-dark'],
    popup: { tags: ['Web app · 1600', '14 screens', 'Light + Dark'], collage: ['dashboard', 'directory', 'approvals'], path: '~/creativity/hyra' },
    ch1: {
      intro: 'What Hyra does, who opens it every morning, and the problem it is built around.',
      what: 'Hyra is an HR dashboard for a growing company. The home screen answers the morning questions — who is in, who is out, what is waiting for approval, how hiring and onboarding are going — and 13 more screens cover the people lifecycle: directory, profiles, attendance, leave, recruitment, onboarding, payroll, performance, documents, the org chart, reports, tasks and settings.',
      problem: 'HR work is usually spread across separate tools — attendance in one, leave in another, hiring and payroll somewhere else — so “who needs my approval today?” means opening all of them. Requests wait, and nobody sees the whole team at once.',
      who: [
        ['Meera · HR manager (primary)', 'Runs people operations for a 1,284-person company', 'Start the day knowing who’s out, what’s waiting and how hiring is going', 'Approvals and updates scattered across tools'],
        ['Employees', 'Request leave, reimbursements and documents', 'Quick decisions and a clear status', 'Not knowing where a request is'],
        ['Hiring managers', 'Own open roles and new joiners', 'See the pipeline and onboarding progress', 'Chasing HR for updates'],
      ],
      personaNote: 'Assumption-based personas built from the product brief and competitor review — to be confirmed in the interviews planned in chapter 5.',
      objectives: ['One morning view: attendance, approvals, hiring and onboarding at a glance.', 'Decisions in place: approve leave, reimbursements and offers without leaving the dashboard.', 'The full people lifecycle in one consistent layout: hire, onboard, pay, grow, report.', 'Readable all day: light and dark themes with the same structure.'],
      why: 'HR managers make dozens of small decisions a day. “Needs your approval” sits next to attendance and hiring on the home screen, so the most common decisions take one click.',
      jtbd: ['When I start my day, I want to see who is in, who is out and what is waiting, so I can act before requests pile up.', 'When someone asks for leave or a reimbursement, I want to decide in one place, so they aren’t left waiting.', 'When hiring is in progress, I want the whole pipeline at a glance, so I can unblock the stage that’s stuck.'],
      landscape: [['Point tools', 'Separate attendance, leave, hiring and payroll tools', 'Each does one job; nobody sees the whole team'], ['Spreadsheets & email', 'Requests in inboxes', 'Approvals get lost and wait'], ['Hyra', 'Where it fits', 'One morning view of people, time, hiring and approvals, with decisions made in place']],
    },
    ch2: {
      intro: 'Fourteen areas behind one slim rail, and a morning that starts with the decisions waiting for you.',
      ia: { root: 'Hyra', sections: [['Dashboard', ['Attendance', 'Approvals', 'Hiring', 'Out today', 'Onboarding']], ['People', ['Directory', 'Profile', 'Organization']], ['Time', ['Attendance & time', 'Leave']], ['Talent', ['Recruitment', 'Onboarding', 'Performance']], ['Pay & documents', ['Payroll', 'Documents & compliance']], ['Insights & admin', ['Reports & analytics', 'Tasks & approvals', 'Settings']]] },
      iaNote: 'A slim icon rail holds the 14 areas; the top bar holds search, the theme toggle and the profile.',
      journeyTitle: 'A morning in Hyra · approval from the dashboard',
      journey: ['Open the dashboard', 'See “Needs your approval · 3 items”', 'Open a request', '?Approve?', '!Request resolved'],
      branches: [['Approve?', 'Need more detail', 'Open Tasks & approvals for the full request']],
      interactions: [['Needs your approval', 'Leave, reimbursements and offers wait on the dashboard with who asked and for what.'], ['Attendance this week', 'Present, late and on leave by day, with a weekly switch.'], ['Hiring pipeline', 'Applied → Screening → Interview → Offer as one funnel with counts.'], ['Theme toggle', 'Light and dark from the top bar; layouts stay identical.']],
      flowMap: false,
    },
    ch3: {
      intro: 'From fourteen HR areas to one consistent layout built from a small set of components.',
      process: [['Scope', '14 HR areas'], ['IA', 'Icon rail + top bar'], ['Wireframes', 'Dashboard and table layouts'], ['Components', 'Stat card, employee row, chips'], ['High-fidelity UI', '14 screens, light'], ['Dark theme', 'Six key screens'], ['Handoff', 'Components and themes']],
      evolution: ['dashboard', 'directory'],
      iterations: [['Light theme only', 'Dark versions of the six most-used screens, switched from the top bar', 'HR tools stay open all day.']],
      dsNote: 'A focused component set — theme toggle, buttons, status chips, avatars, icon rail, top bar, stat cards, employee rows and progress — reused across all 14 screens and both themes.',
      foundations: false,
    },
    ch4: {
      intro: 'The fourteen screens, a connected flow, and a proposed motion spec for the build.',
      gallery: [['dashboard', '01 · HR Dashboard'], ['directory', '02 · Employee Directory'], ['profile', '03 · Employee Profile'], ['attendance', '04 · Attendance & Time'], ['leave', '05 · Leave Management'], ['recruitment', '06 · Recruitment'], ['payroll', '08 · Payroll & Compensation'], ['approvals', '13 · Tasks & Approvals']],
      flow: [['dashboard', 'Dashboard'], ['approvals', 'Tasks & approvals'], ['profile', 'Employee profile']], taps: ['“Needs your approval”', 'open the requester'],
      micro: [['Theme toggle', 'The whole UI cross-fades over 200 ms; the toggle knob slides.', 'Instant swap'], ['Approve / reject', 'The row collapses in 200 ms and the “Needs your approval” count ticks down.', 'Row removed, count updates'], ['Stat cards', 'Numbers count up once on first load (600 ms).', 'Final value shown'], ['Hiring funnel', 'Bars grow left to right on first load.', 'Static bars']],
      modesTitle: 'Dark theme', modes: [['dashboard-dark', 'Dashboard · dark'], ['reports-dark', 'Reports & analytics · dark']],
      protoNote: 'Open the Hyra file to click through all 14 screens in light and dark.',
    },
    ch5: {
      intro: 'Small, repeated decisions — about layout, navigation and data — that make a dense HR tool feel easy.',
      decisions: [['LAYOUT', 'Approvals live on the home screen', 'The most frequent HR decisions sit next to attendance and hiring.', 'Common approvals take one click from the dashboard.'], ['NAVIGATION', 'A slim icon rail for 14 areas', 'Maximum width for tables and charts; every area stays one click away.', 'More data visible without sideways scrolling.'], ['COMPONENTS', 'One stat card, one employee row, one status chip', 'The same parts repeat across all 14 screens.', 'Learn one screen, know them all — and faster to build.'], ['THEME', 'Light and dark from the top bar', 'HR tools stay open all day.', 'Comfortable in any lighting, with identical layouts.'], ['DATA', 'Status as a chip with a word, not colour alone', 'Present, late, on leave and approval states are labelled.', 'Readable for colour-blind users and in dark mode.'], ['PRIVACY', 'Sensitive fields partly masked', 'Phone numbers show as +91 98••• ••210 on profiles.', 'Less personal data exposed on shared screens.']],
      validation: [['Consistency audit', 'Do 14 screens share the same parts?', 'One stat card, employee row, status chip and progress reused everywhere'], ['All-day-use review', 'HR tools stay open all day', 'Dark versions of the six most-used screens'], ['Privacy review', 'Personal data on shared screens', 'Phone numbers partly masked on profiles'], ['WCAG 2.2 colour check', 'Status shown by colour?', 'Every status is a chip with a word, never colour alone']],
      targets: [['1 click', 'to approve a request from the dashboard'], ['< 10 s', 'to see who is out today'], ['14', 'HR areas in one layout'], ['2', 'themes, identical layouts']],
      targetNote: 'Proposed targets for Hyra — to confirm and validate with HR managers.',
      next: ['Validate the dashboard with HR managers: which morning questions matter most?', 'Usability-test the approval and leave flows with 5 people.', 'Add mobile layouts for employees requesting leave and reimbursements.'],
    },
  },
];

export const bySlug = (slug: string) => stories.find((s) => s.slug === slug)!;
export const nextOf = (s: Story) => stories[s.order % stories.length];
