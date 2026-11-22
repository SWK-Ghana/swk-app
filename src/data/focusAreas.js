// SWK Ghana's six focus areas: the structure of Our Work. Each one has its own
// page at /our-work/<slug> (src/components/FocusArea.jsx), listed in this order
// in the Our Work menu, on the Our Work overview, on Home and on About.
// Agribusiness comes first: it is where most of our work has been so far.
//
// Facts come from SWK Ghana's own reports, articles and records; nothing here
// should be stated that is not published elsewhere on the site.
// Images: `path` is a Cloudinary path; `src` is a file in public/.

const CLD = 'https://res.cloudinary.com/dwgj3lovn/image/upload'
export const cld = (path, w = 800) => `${CLD}/f_auto,q_auto,c_limit,w_${w}/${path}`

export const TAKA_KIPAWA = {
  title: 'Taka Kipawa app',
  text: 'Our waste-management platform, "Our Waste" in Swahili, connecting households, waste collectors and recyclers across Ga West Municipality.',
  image: { path: 'v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg', alt: 'Young people sorting plastic bottles for recycling at a community clean-up' },
  href: '/taka-kipawa',
  cta: 'Explore Taka Kipawa',
}

export const MARKETPLACE = {
  title: 'SWK Marketplace',
  text: 'A storefront for youth-led green businesses: verified young entrepreneurs selling eco-friendly, recycled and agricultural products, with escrow-protected payments.',
  image: { path: 'v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg', alt: 'The SWK Marketplace' },
  href: 'https://marketplace.swkghana.org',
  cta: 'Visit the Marketplace',
  external: true,
}

export const FOCUS_AREAS = [
  {
    slug: 'agribusiness',
    name: 'Agribusiness Advocacy',
    menuDesc: 'Webinars, the Summit and the Mentorship Programme',
    short: 'Bringing young people back to agriculture as a business: education, a Summit, and mentorship.',
    lede: 'Young people are leaving agriculture, yet it is full of business opportunity. Step by step, we are showing them how: five webinars of sensitisation and education, crowned by our first Summit, and now a mentorship programme.',
    hero: { src: '/summit-2026/group-800.webp', srcSet: '/summit-2026/group-800.webp 800w, /summit-2026/group-1600.webp 1600w', width: 1600, height: 822, alt: 'Young people, speakers and the SWK Ghana team at the Agribusiness Summit 2026 in Accra' },
    stats: [
      { n: '300+', label: 'young people reached by our webinars' },
      { n: '9+', label: 'countries' },
      { n: '138', label: 'Summit registrations' },
      { n: '20', label: 'mentees in 2027' },
    ],
    does: [
      { title: 'Sensitisation and education', text: 'Free online webinars that show young people agribusiness as a real career: partnerships, pitching, value chains and funding.' },
      { title: 'Bringing people together', text: 'Our Agribusiness Summit put young people in the room with farmers, founders, experts and partners.' },
      { title: 'Mentorship and first steps', text: 'Six months with a mentor who runs an agribusiness, so young people know where to turn and what to do.' },
    ],
    article: { slug: 'why-young-people-left-agriculture', title: 'Why 10 million young people left agriculture in just 16 years', excerpt: 'The research behind our agribusiness work, and why young people are the answer to an ageing farm sector.' },
    projects: ['marketplace'],
    photos: [
      { src: '/summit-2026/panel-wide-800.webp', alt: 'The panel at the Agribusiness Summit 2026' },
      { src: '/summit-2026/room-800.webp', alt: 'The room at the Agribusiness Summit 2026, seen from the back' },
      { path: 'v1790859578/WhatsApp_Image_2026-09-18_at_12.04.53_vdrv2t.jpg', alt: 'The Elevator Pitch Workshop facilitator presenting online' },
    ],
  },
  {
    slug: 'youth-development',
    name: 'Youth Development Programs',
    menuDesc: 'Leadership, skills and confidence for young people',
    short: 'Leadership workshops, skills training and mentorship that build confident young changemakers.',
    lede: 'Leadership is built, not born. We give young people real skills, real responsibility and real support, so they can lead change in their communities.',
    hero: { path: 'v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg', alt: 'Young people at an SWK Ghana youth development session' },
    does: [
      { title: 'Leadership and confidence', text: 'Workshops that help young people take initiative, make decisions and inspire others.' },
      { title: 'Practical skills', text: 'Skills in agribusiness, technology and communication that make young people employable and enterprising.' },
      { title: 'Learning by doing', text: 'Real responsibility: young people help design and run events, teams and campaigns, with mentors beside them.' },
    ],
    links: [
      { title: 'Mentorship Programme 2027', text: 'Our six-month programme for 20 young agripreneurs, aged 18 to 35.', href: '/mentorship-programme', cta: 'About the programme' },
      { title: 'Volunteer with us', text: 'Young people grow by doing: join the team behind our programmes.', href: '/volunteers', cta: 'Volunteer' },
    ],
    article: { slug: 'leadership-is-built-not-born', title: 'Leadership is built, not born', excerpt: 'Inside SWK Ghana\'s holistic approach to youth development.' },
    photos: [
      { path: 'v1773660247/photo_2026-03-16_11-22-45_dx3age.jpg', alt: 'A youth development session run by SWK Ghana' },
      { path: 'v1773615456/photo_2026-03-15_22-52-55_hkgbn5.jpg', alt: 'Young leaders at an SWK Ghana programme' },
      { path: 'v1773663233/photo_5_2026-03-16_12-13-08_xowgpz.jpg', alt: 'A youth engagement session' },
    ],
  },
  {
    slug: 'circular-economy',
    name: 'Circular Economy Initiatives',
    menuDesc: 'Taka Kipawa, the Marketplace and waste to worth',
    short: 'Turning waste into worth: recycling, reuse and green businesses run by young people.',
    lede: 'Ghana throws away enormous value every day. We help young people treat waste as a resource, through digital tools, green enterprise and education on responsible consumption (UN SDG 12).',
    hero: { path: 'v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg', alt: 'Young people sorting plastic bottles for recycling at a community clean-up' },
    does: [
      { title: 'Waste collection that works', text: 'Taka Kipawa connects households, collectors and recyclers so waste gets picked up and recycled.' },
      { title: 'Green enterprise', text: 'The SWK Marketplace gives young people selling recycled and eco-friendly products a place to reach customers.' },
      { title: 'Education', text: 'Workshops and campaigns on waste reduction and sustainable consumption.' },
    ],
    projects: ['taka', 'marketplace'],
    videos: [
      { ytId: 'mqVJMGlINt4', title: 'Taka Kipawa: waste management app', desc: 'How the app is changing waste collection in Ga West Municipality.' },
      { ytId: '2SIXUJJppP4', title: 'Circular economy innovation', desc: 'Youth-led solutions for sustainable consumption and waste reduction.' },
    ],
    article: { slug: 'from-waste-to-worth-circular-economy', title: 'From waste to worth', excerpt: 'The circular economy Ghana\'s youth can build.' },
    photos: [
      { path: 'v1773615092/Save_the_date_flyer_-_YouthOvaFashionWaste_1_owvjpc.png', alt: 'Save-the-date flyer for the Youth Over Fashion Waste event', whole: true },
    ],
  },
  {
    slug: 'technology-innovation',
    name: 'Technology & Innovation',
    menuDesc: 'Digital tools for real community problems',
    short: 'Digital tools that start with a community problem, and young people who learn to build them.',
    lede: 'Technology is only as valuable as the problem it solves. We build digital tools for real community challenges, and help young people learn to build them too.',
    hero: { path: 'v1773660247/photo_2026-03-16_11-22-22_i0nolg.jpg', alt: 'Two young people working together on a laptop at an SWK Ghana session' },
    does: [
      { title: 'Problem first', text: 'Our tools begin with a community problem, like waste piling up in Ga West, and work back to the technology.' },
      { title: 'Digital skills', text: 'Digital literacy for young people at every level, opening the door to the modern economy.' },
      { title: 'Build together', text: 'Innovation workshops and hackathons where young people design solutions in teams.' },
    ],
    projects: ['taka', 'marketplace'],
    videos: [
      { ytId: 'mqVJMGlINt4', title: 'Taka Kipawa: waste management app', desc: 'A digital platform that maps waste, schedules collection and connects recyclers.' },
    ],
    article: { slug: 'technology-with-purpose', title: 'Technology with purpose', excerpt: 'How SWK Ghana builds digital tools for real problems.' },
    photos: [
      { path: 'v1773660247/photo_2026-03-16_11-22-27_u5yojg.jpg', alt: 'An innovation workshop' },
      { path: 'v1773660247/photo_2026-03-16_11-22-15_enjvh6.jpg', alt: 'Young people working on laptops at an SWK Ghana skills workshop' },
    ],
  },
  {
    slug: 'climate-action',
    name: 'Climate Action Projects',
    menuDesc: 'Climate education, advocacy and practical projects',
    short: 'Climate education, youth advocacy and practical projects, from tree planting to the fight against galamsey.',
    lede: 'Young people did the least to cause the climate crisis, yet they will live with it the longest. That is why we put them at the centre of the response.',
    hero: { path: 'v1773663233/photo_4_2026-03-16_12-13-08_ox4qsx.jpg', alt: 'Young volunteers planting trees' },
    does: [
      { title: 'Climate education', text: 'Helping young people connect climate science to what they see at home: the flooded street, the failed harvest, the polluted stream.' },
      { title: 'Advocacy and voice', text: 'Bringing youth perspectives into climate conversations, from local assemblies to continental platforms.' },
      { title: 'Practical projects', text: 'Tree planting, clean-up drives, conservation and campaigns against galamsey.' },
    ],
    videos: [
      { ytId: 'GAE6AL3NWBo', title: 'Climate action', desc: 'Children speaking up for the environment and climate action.' },
      { ytId: 'zDywICh3Ay0', title: 'Fight against galamsey', desc: 'Young voices against illegal mining, to protect Ghana\'s land and water.' },
    ],
    article: { slug: 'youth-on-the-frontline-climate-action', title: 'Youth on the frontline', excerpt: 'Why climate action is Ghana\'s defining fight.' },
    photos: [
      { path: 'v1773660248/photo_2026-03-16_11-22-40_zbflj4.jpg', alt: 'A climate action project' },
    ],
  },
  {
    slug: 'community-engagement',
    name: 'Community Engagement',
    menuDesc: 'Outreach, forums and projects across Greater Accra',
    short: 'Grassroots outreach, participatory projects and forums across Greater Accra.',
    lede: 'Lasting change grows from within communities. We listen first, then work alongside communities across Greater Accra, so they are stronger and more capable after we leave.',
    hero: { path: 'v1760294683/SWK_at_Ga_West_n0c3fz.jpg', alt: 'SWK Ghana with community members in Ga West' },
    does: [
      { title: 'Outreach and education', text: 'Taking our programmes on sustainability, skills and leadership directly to communities.' },
      { title: 'Participatory projects', text: 'Clean-up drives, awareness campaigns and local initiatives that residents help plan and run.' },
      { title: 'Forums and dialogue', text: 'Spaces where community members, especially young people, raise concerns and shape the decisions that affect them.' },
    ],
    links: [
      { title: 'Join our WhatsApp community', text: 'Opportunities, events and conversations with young changemakers.', href: 'https://chat.whatsapp.com/LrSVJrNFHGY6kdPnW8xoTu', cta: 'Join on WhatsApp', external: true },
    ],
    article: { slug: 'change-starts-at-the-grassroots', title: 'Change starts at the grassroots', excerpt: 'Our community engagement across Greater Accra.' },
    photos: [
      { path: 'v1773615455/photo_2026-03-15_22-53-49_d6sonh.jpg', alt: 'Community outreach by SWK Ghana' },
      { path: 'v1773615455/photo_2026-03-15_22-56-57_j5xdzc.jpg', alt: 'SWK Ghana community engagement' },
    ],
  },
]

// Phase 1 of our agribusiness journey (five webinars, crowned by the Summit), then Phase 2.
export const AGRI_JOURNEY = [
  {
    phase: 'Phase 1',
    mark: '1–3',
    when: 'September to November 2025',
    title: 'Agribusiness Webinar Series: three editions',
    text: 'Our first three webinars introduced young people to agribusiness as a business: 230 verified registrants from 9 countries.',
    links: [{ label: 'Read the 2025 impact report', href: 'https://drive.google.com/file/d/1Sl55CXUFD_OQY8GYmx9IeTaM0jOTr-Po/view?usp=sharing', external: true }],
  },
  {
    phase: 'Phase 1',
    mark: '4',
    when: 'May 2026',
    title: 'Webinar: Strategic Partnerships',
    text: 'How young agripreneurs build the partnerships that help a business grow.',
    links: [{ label: 'Read the webinar report', href: 'https://drive.google.com/file/d/1YH1I2D0HKRKCchaz6zi59Ufqij6gmOPi/view?usp=sharing', external: true }],
  },
  {
    phase: 'Phase 1',
    mark: '5',
    when: '17 September 2026',
    title: 'Pitch Ready: Elevator Pitch Workshop',
    text: 'With Aequitas Foundation: how to pitch an idea in 60 seconds. 63 registered from four countries, 30+ joined live.',
    links: [
      { label: 'Workshop page', href: '/pitch' },
      { label: 'Read the report', href: '/reports/elevator-pitch-workshop-2026' },
    ],
  },
  {
    phase: 'The crown of Phase 1',
    when: '7 November 2026 · Accra',
    title: 'Agribusiness Summit 2026',
    text: 'Our first in-person Summit: a panel, Spotlight talks from the field and a hands-on Agribusiness Model Canvas workshop. 138 registrations, 62 in the room, 13 speakers and facilitators, 6 partners.',
    links: [{ label: 'See what happened', href: '/reports/agribusiness-summit-2026' }],
    crown: true,
  },
  {
    phase: 'Phase 2',
    when: 'July to December 2027',
    title: 'Agribusiness Mentorship Programme 2027',
    text: 'Six months for 20 young agripreneurs, guided by five mentors who run agribusinesses: learn first, then take your first steps.',
    links: [
      { label: 'About the programme', href: '/mentorship-programme' },
      { label: 'Register your interest', href: '/mentorship' },
    ],
    current: true,
  },
]

export const focusArea = (slug) => FOCUS_AREAS.find((a) => a.slug === slug)
