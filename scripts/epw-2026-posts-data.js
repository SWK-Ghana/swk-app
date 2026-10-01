// Elevator Pitch Workshop (17 September 2026) — the news item and the event
// recap. Figures match the event report at /reports/elevator-pitch-workshop-2026
// (registration sheet, deduplicated: 63 registrants). Covers are crops of the
// official thank-you poster, so no new uploads are needed.
//
// Seed with: node scripts/seed-epw-2026-posts.js

const CLD = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
const POSTER = 'v1790860574/SWK_Ghana_EPW_Thank_You_Poster_v4_mw6mdj.png'
const SLIDE = 'v1790859578/WhatsApp_Image_2026-09-18_at_12.04.53_vdrv2t.jpg'

const REPORT = 'https://swkghana.org/reports/elevator-pitch-workshop-2026'
const REPORT_PDF = 'https://swkghana.org/reports/SWK-Ghana-Elevator-Pitch-Workshop-Report-2026.pdf'
const RECAP = 'https://swkghana.org/blog/pitch-ready-inside-our-elevator-pitch-workshop'

const caption = (text) =>
  `<p style="text-align:center;font-size:.875rem;color:#6b7280;margin-top:-.75rem">${text}</p>`

export const posts = [

  // ─── NEWS ─────────────────────────────────────────────────────────────────
  {
    _type: 'post',
    title: '30+ Join SWK Ghana and Aequitas Foundation’s Elevator Pitch Workshop',
    slug: { _type: 'slug', current: 'elevator-pitch-workshop-30-join-swk-ghana-aequitas-foundation' },
    category: 'News',
    excerpt: 'More than 30 people joined our free online Elevator Pitch Workshop with Aequitas Foundation on 17 September 2026, with 63 registered from four countries. The full event report is now available.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-10-01T13:05:00Z',
    // The "THANK YOU" header of the poster.
    coverImageUrl: `${CLD}/c_crop,x_0,y_0,w_1080,h_608/f_auto,q_auto/${POSTER}`,
    content: `<p><strong>Accra, 1 October 2026.</strong> More than 30 people joined <strong>Pitch Ready</strong>, the free Elevator Pitch Workshop hosted by SWK Ghana and Aequitas Foundation, live online on Thursday 17 September 2026. Sixty-three people registered for the 90-minute session from four countries: Ghana, South Sudan, the United Kingdom and Zambia.</p>

<p>The workshop was facilitated by Rev’d Akua Buabema Ofori-Boateng, PhD, Director of Programmes for the Anglican Diocese of Accra and founding Executive Director of Aequitas Foundation, and moderated by Ben Brown of SWK Ghana. It was built around the Three C’s of a strong pitch: clear, concise and compelling.</p>

<p>The audience was young: 87% of registrants were aged 15 to 35. Working professionals, students and recent graduates, and founders, entrepreneurs and traders made up most of the room, alongside educators, advisors, farmers and agro-processors.</p>

<h2>Lessons for future sessions</h2>

<p>Some participants dropped out during the session because of network challenges and technical issues with Jitsi, the app behind SWK Meet. Our event report sets out who took part, what we learned, and the changes we plan for future online events, including how-to-join guides, backup links and testing the platform at full audience size before the day.</p>

<h2>Read the report</h2>

<p>The full report, <a href="${REPORT}">Pitch Ready: Elevator Pitch Workshop</a>, is available online and <a href="${REPORT_PDF}">as a PDF</a>. For the story of the session, read our recap: <a href="${RECAP}">Pitch Ready: Inside Our Elevator Pitch Workshop</a>.</p>

<h2>Up next: Agribusiness Summit 2026</h2>

<p>Our next event is the SWK Ghana Agribusiness Summit 2026, free and in person on Saturday 7 November 2026 at The GracedLife Leadership Centre, Ashaley Botwe, Accra. <a href="https://swkghana.org/summit">Register at swkghana.org/summit</a>.</p>

<h2>About SWK Ghana</h2>

<p>SWK Ghana (legally registered as SWK Ghana LBG) is a youth-focused nonprofit empowering young people to lead sustainable change across Africa through programmes in climate action, agribusiness, circular economy and technology.</p>

<h2>About Aequitas Foundation</h2>

<p>Aequitas Foundation is a faith-based nonprofit in Accra working towards a fairer world through youth development and skills-building. Learn more at <a href="https://www.aequitasfoundation.org">aequitasfoundation.org</a>.</p>

<p>Media enquiries: <a href="mailto:info@swkghana.org">info@swkghana.org</a></p>`,
  },

  // ─── EVENT RECAP ──────────────────────────────────────────────────────────
  {
    _type: 'post',
    title: 'Pitch Ready: Inside Our Elevator Pitch Workshop',
    slug: { _type: 'slug', current: 'pitch-ready-inside-our-elevator-pitch-workshop' },
    category: 'Event Recaps',
    excerpt: 'On 17 September, more than 30 people joined us and Aequitas Foundation online to learn how to explain an idea clearly, concisely and compellingly in 60 seconds. What the session covered, who signed up, and what we are changing next time.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-10-01T13:00:00Z',
    // The three in-session screenshots from the poster.
    coverImageUrl: `${CLD}/c_crop,x_0,y_395,w_1080,h_558/f_auto,q_auto/${POSTER}`,
    content: `<p>The idea is not the hard part. Being understood is. That was the starting point for <strong>Pitch Ready</strong>, the Elevator Pitch Workshop we hosted with <a href="https://www.aequitasfoundation.org">Aequitas Foundation</a> on Thursday 17 September 2026.</p>

<p>For 90 minutes, more than 30 people joined us live on SWK Meet, our online meeting platform, to work on one skill: explaining who you are, what you do and why it matters, in about the time it takes to ride an elevator.</p>

<h2>Why a pitch workshop?</h2>

<p>About one in five working-age Africans is starting a business (Brookings, 2024). Yet capital and networks remain out of reach for many young founders, often not for want of a good idea but for want of a clear one. When a funder, partner or customer gives you a minute to make your case, explaining your work clearly and credibly becomes one of the most practical skills you can have.</p>

<p>So we treated the pitch as a skill you practise, not a talent you either have or lack. The session was free and open to everyone: founders and agripreneurs, students, community leaders, and anyone who has to make someone care, fast.</p>

<h2>The framework: the Three C’s</h2>

<p>Our facilitator, Rev’d Akua Buabema Ofori-Boateng, PhD, built the session around three tests every pitch has to pass:</p>

<ul>
<li><strong>Clear:</strong> plain language and no jargon. Who you are, what you do, and why it matters.</li>
<li><strong>Concise:</strong> thirty to ninety seconds, carrying only what is genuinely essential.</li>
<li><strong>Compelling:</strong> a specific hook, a real story, or a blunt statement of the problem you solve.</li>
</ul>

<p>Rev’d Akua brings an unusual range to the subject. She is an Anglican priest, engineer and strategist, Director of Programmes for the Anglican Diocese of Accra, and the founding Executive Director of Aequitas Foundation, with twenty years in the corporate sector behind her.</p>

<h2>In the room</h2>

<p>Rev’d Akua led the session on camera with slides, while Ben Brown moderated for SWK Ghana. Participants raised hands and used the chat to engage with the facilitator.</p>

<img src="${CLD}/c_crop,x_0,y_216,w_644,h_497/f_auto,q_auto/${SLIDE}" width="644" height="497" style="width:100%;max-width:644px;margin-left:auto;margin-right:auto" alt="Rev’d Akua Ofori-Boateng on camera beside the Elevator Pitch Workshop title slide on SWK Meet." />
${caption('Rev’d Akua presents the workshop’s opening slide on SWK Meet.')}

<h2>Who signed up</h2>

<p>Sixty-three people registered in the twelve days before the session, from four countries: Ghana, South Sudan, the United Kingdom and Zambia. The audience was young, with 87% aged 15 to 35. Working professionals made up the largest group, followed by students and recent graduates, and founders, entrepreneurs and traders. Educators, advisors, farmers and agro-processors signed up too.</p>

<p>Three in four registrants heard about the workshop through our WhatsApp community, and 95% chose to join it. Women made up 35% of registrants, a figure we want to raise at future events.</p>

<h2>What didn’t go to plan</h2>

<p>We want to be open about this part. More than 30 people joined live, but some dropped out during the session because of network problems and technical issues with Jitsi, the app behind SWK Meet. If you were one of them, thank you for your patience.</p>

<p>Here is what we plan to do differently for future online sessions:</p>

<ul>
<li>Send a short how-to-join guide and a backup link with every reminder.</li>
<li>Invite people on weaker connections to join with video off.</li>
<li>Test the platform at the expected audience size before the day.</li>
<li>Record sessions so that anyone who drops out can catch up.</li>
</ul>

<h2>Thank you</h2>

<img src="${CLD}/f_auto,q_auto,w_960/${POSTER}" width="1080" height="1350" style="width:100%;max-width:480px;margin-left:auto;margin-right:auto" alt="Thank-you poster: Webinar recap. Thank you for joining our Elevator Pitch Workshop. 30+ people joined us live to craft, practise and perfect their pitch." />

<p>Thank you to Rev’d Akua for facilitating, to Aequitas Foundation for partnering with us, to Ben Brown for moderating, and to everyone who registered, joined and practised with us. As our thank-you poster puts it: keep pitching. Your idea deserves to be heard.</p>

<h2>What’s next</h2>

<p>Our next event is the <strong>SWK Ghana Agribusiness Summit 2026</strong>, a free summit for young people in Ghana to inspire, equip and connect. It takes place in person on Saturday 7 November 2026 at The GracedLife Leadership Centre, Ashaley Botwe, Accra.</p>

<ul>
<li><a href="https://swkghana.org/summit">Register for the Summit</a></li>
<li><a href="https://swkghana.org/volunteers">Volunteer with us</a></li>
<li><a href="https://swkghana.org/partners">Partner with us</a></li>
</ul>

<p>Want the full picture? Read the <a href="${REPORT}">Elevator Pitch Workshop report</a>, with the registration data, lessons and recommendations, or <a href="${REPORT_PDF}">download it as a PDF</a>.</p>`,
  },
]
