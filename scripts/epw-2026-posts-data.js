// Elevator Pitch Workshop (17 September 2026) — the news item and the event
// recap. Figures match the event report at /reports/elevator-pitch-workshop-2026
// (registration sheet, deduplicated: 63 registrants). What was taught follows
// Rev'd Akua's actual slide deck, summarised in our own words. Covers are crops
// of the official thank-you poster, so no new uploads are needed.
//
// Seed with: node scripts/seed-epw-2026-posts.js

const CLD = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
const POSTER = 'v1790860574/SWK_Ghana_EPW_Thank_You_Poster_v4_mw6mdj.png'
const SLIDE = 'v1790859578/WhatsApp_Image_2026-09-18_at_12.04.53_vdrv2t.jpg'

const REPORT = 'https://swkghana.org/reports/elevator-pitch-workshop-2026'
const REPORT_PDF = 'https://swkghana.org/reports/SWK-Ghana-Elevator-Pitch-Workshop-Report-2026.pdf'
const RECAP = 'https://swkghana.org/blog/pitch-ready-inside-our-elevator-pitch-workshop'

// Covers are built for the post page's short, full-width banner (about 4:1 on
// a laptop, 1.5:1 on a phone): the artwork is shown whole, never enlarged,
// centred on SWK dark green, and sized to stay clear of every crop.
const WIDE = 'c_lpad,w_2880,h_640,b_rgb:0C2E11'

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
    // The whole thank-you poster.
    coverImageUrl: `${CLD}/c_scale,h_540/${WIDE}/f_auto,q_auto/${POSTER}`,
    content: `<p><strong>Accra, 1 October 2026.</strong> More than 30 people joined <strong>Pitch Ready</strong>, the free Elevator Pitch Workshop hosted by SWK Ghana and Aequitas Foundation, live online on Thursday 17 September 2026. Sixty-three people registered for the 90-minute session from four countries: Ghana, South Sudan, the United Kingdom and Zambia.</p>

<p>The workshop was facilitated by Rev’d Akua Buabema Ofori-Boateng, PhD, Director of Programmes for the Anglican Diocese of Accra and founding Executive Director of Aequitas Foundation, and moderated by Ben Brown of SWK Ghana. The session taught a six-part structure for a 60-second pitch (hook, who you are, the problem, your solution, the value and the ask) and built in two rounds of practice: drafting a pitch from a five-part template, then delivering it to a partner for feedback before refining it.</p>

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
    excerpt: 'On 17 September, more than 30 people joined us and Aequitas Foundation online to learn how to build a 60-second pitch, part by part. What the session taught, who signed up, and what we are changing next time.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-10-01T13:00:00Z',
    // The poster's three in-session screenshots, as a rounded card.
    coverImageUrl: `${CLD}/c_crop,x_0,y_395,w_1080,h_558/c_scale,w_900,r_32,b_rgb:0C2E11/${WIDE}/f_auto,q_auto/${POSTER}`,
    content: `<p>The idea is not the hard part. Being understood is. That was the starting point for <strong>Pitch Ready</strong>, the Elevator Pitch Workshop we hosted with <a href="https://www.aequitasfoundation.org">Aequitas Foundation</a> on Thursday 17 September 2026.</p>

<p>For 90 minutes, more than 30 people joined us live on SWK Meet, our online meeting platform, to learn how to say who they are, what they offer and why it matters, in about a minute. Our facilitator, Rev’d Akua Buabema Ofori-Boateng, PhD, took the session from why a pitch matters, through a clear framework, into practice.</p>

<p>Rev’d Akua is an engineer, theologian and strategist, Director of Programmes for the Anglican Diocese of Accra, and the founding Executive Director of Aequitas Foundation.</p>

<h2>Why it matters</h2>

<p>An elevator pitch is a short, clear summary of who you are and what you offer, brief enough to finish before the lift doors open. Rev’d Akua showed where it earns its keep: first conversations at conferences and community events, the “tell me about yourself” moment in a job interview, funding and partnership talks with people who decide quickly, and every time someone asks what you do.</p>

<p>Her case for getting it right came in three parts. People trust what they can repeat back to you. A steady pitch shows that you know your own value. And keeping it brief respects the listener’s time, which is part of why they remember you.</p>

<p>For young founders the stakes are real. About one in five working-age Africans is starting a business (Brookings, 2024), yet capital and networks stay out of reach for many, often not for want of a good idea but for want of a clear one.</p>

<h2>A great pitch, in six parts</h2>

<p>The heart of the session was a six-part structure, with a rough time budget for each part of a 60-second pitch:</p>

<ol>
<li><strong>Hook (about 8 seconds):</strong> win attention with your very first line.</li>
<li><strong>Who you are (7 seconds):</strong> your name and role, kept brief.</li>
<li><strong>The problem (10 seconds):</strong> the gap or need you address.</li>
<li><strong>Your solution (15 seconds):</strong> what you do about it.</li>
<li><strong>The value (10 seconds):</strong> why it matters, or a quick proof point.</li>
<li><strong>The ask (10 seconds):</strong> the one thing you would like to happen next.</li>
</ol>

<p>Spoken naturally, about 150 words fills a minute. The advice was to time yourself out loud until the rhythm feels familiar, not memorised.</p>

<h2>Hooks that land, and mistakes to avoid</h2>

<p>A first line can do its job in several ways: ask a question that reframes the listener’s problem, make a bold statement, share a surprising insight, or tell a short story.</p>

<p>The ways pitches go wrong were just as clear. Too much detail or jargon, when a stranger should be able to repeat your one key sentence. No clear ask, when you should end on exactly one next step. Rambling without structure. Talking at people rather than with them. And being forgettable, when one vivid word or image would give your listener something to hold on to.</p>

<h2>From template to practice</h2>

<p>Rev’d Akua then turned the framework into a fill-in-the-blank template with five parts: who you help, what you help them do, the benefit they get, how you differ from the alternative, and a call to action. Example pitches showed it at work, from an agri-tech founder linking smallholder farmers in the Eastern Region with buyers in Accra, to a recent graduate and a freelance consultant.</p>

<p>The session then built in two rounds of practice:</p>

<ul>
<li><strong>Craft:</strong> five minutes alone, writing one honest sentence for each part of the template, without polishing.</li>
<li><strong>Pair up and present:</strong> partners take turns to pitch for 60 seconds while the other keeps time, then share one thing that landed and one thing to sharpen.</li>
<li><strong>Round two:</strong> rewrite the pitch using that feedback, then deliver it again to a new partner, aiming for confident and clear rather than perfect.</li>
</ul>

<p>Feedback followed a five-point check: clarity (could a stranger say back what you do?), the hook, the structure, confidence (a steady pace, eye contact, no filler words) and a single clear call to action.</p>

<p>The delivery tips were practical: practise out loud, not just in your head; look at your listener, or at the camera when you are online; slow down and pause after your hook; match your energy to your message; and smile, because confidence can be heard.</p>

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

<h2>Four things to remember</h2>

<p>Rev’d Akua closed with four takeaways: be clear rather than clever; focus on one idea, not everything; always end with an ask; and practise until your pitch sounds natural. Her challenge for the week after was to practise daily, out loud and against a timer, and to try the pitch on three people, noticing which line makes them lean in.</p>

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
