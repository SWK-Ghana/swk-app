// Content for /support, the NGO Support Hub: SWK Ghana's free toolkit and a
// curated library of trusted external resources.
//
// Toolkit PDFs are built from content/toolkit/*.html by `npm run build:toolkit`,
// which also refreshes toolkit-manifest.json (pages and file size).
// Library links were checked live and described from each organisation's own
// site on 3 October 2026. Re-check them when you add to or edit this list.

import manifest from './toolkit-manifest.json'

const BASE = '/support/toolkit/'

const doc = (file, rest) => ({
  file,
  href: BASE + file,
  pages: manifest[file]?.pages ?? null,
  bytes: manifest[file]?.bytes ?? null,
  ...rest,
})

export const TOOLKIT = [
  doc('swk-ngo-foundations-checklist.pdf', {
    no: '01',
    topic: 'Register & govern',
    title: 'NGO Foundations Checklist',
    edition: 'Ghana edition',
    desc: 'Register, govern well, manage money and stay compliant in Ghana, with a yearly calendar of what is due and to whom.',
  }),
  doc('swk-grant-proposal-template.pdf', {
    no: '02',
    topic: 'Funding',
    title: 'Grant Proposal Template',
    edition: 'With guide',
    desc: 'A section-by-section proposal with prompts, budget and risk tables, a checklist for before you submit, and where to look for funding.',
  }),
  doc('swk-me-starter-kit.pdf', {
    no: '03',
    topic: 'Measure impact',
    title: 'Monitoring & Evaluation Starter Kit',
    desc: 'A one-page theory of change, a results framework, indicator sheets and a simple learning rhythm for small teams.',
  }),
  doc('swk-impact-report-template.pdf', {
    no: '04',
    topic: 'Measure impact',
    title: 'Event & Impact Report Template',
    desc: 'The structure we use for our own reports: at-a-glance numbers, honest lessons and a checklist for before you publish.',
  }),
  doc('swk-partnership-mou-template.pdf', {
    no: '05',
    topic: 'Partnerships',
    title: 'Partnership MoU Template',
    desc: 'Put a partnership’s purpose, roles and ground rules in writing before the work starts, from branding to data protection.',
  }),
  doc('swk-storytelling-social-media-guide.pdf', {
    no: '06',
    topic: 'Communications',
    title: 'Storytelling & Social Media Guide',
    desc: 'Content pillars, a post formula, an ethical storytelling checklist and a monthly plan for your channels.',
  }),
  doc('swk-volunteer-management-kit.pdf', {
    no: '07',
    topic: 'People',
    title: 'Volunteer Management Starter Kit',
    desc: 'Role descriptions, fair recruitment, onboarding and the essentials of a volunteer agreement.',
  }),
]

export const CATEGORIES = [
  { id: 'ghana', label: 'Register in Ghana' },
  { id: 'funding', label: 'Funding' },
  { id: 'tools', label: 'Free tech' },
  { id: 'impact', label: 'Measure impact' },
  { id: 'comms', label: 'Communications' },
  { id: 'standards', label: 'Safeguarding & standards' },
  { id: 'learning', label: 'Learning' },
  { id: 'networks', label: 'Networks' },
]

// `tags`: Official | Ghana | Global | Free | For eligible NGOs | Some paid
export const RESOURCES = [
  // ── Register in Ghana ─────────────────────────────────────────────────────
  {
    cat: 'ghana', name: 'Office of the Registrar of Companies', href: 'https://orc.gov.gh/',
    desc: 'Incorporate your organisation as a company limited by guarantee, file annual returns and keep beneficial ownership details up to date.',
    tags: ['Official', 'Ghana'],
  },
  {
    cat: 'ghana', name: 'Non-Profit Organisations Secretariat', href: 'https://npos.mogcsp.gov.gh/',
    desc: 'Apply for your NPO licence after incorporation, check your licence status and submit your annual report.',
    tags: ['Official', 'Ghana'],
  },
  {
    cat: 'ghana', name: 'Ghana Revenue Authority', href: 'https://gra.gov.gh/',
    desc: 'Taxpayer registration (TIN), PAYE for staff and tax returns.',
    tags: ['Official', 'Ghana'],
  },
  {
    cat: 'ghana', name: 'SSNIT', href: 'https://www.ssnit.org.gh/',
    desc: 'Register as an employer and pay monthly pension contributions for your staff.',
    tags: ['Official', 'Ghana'],
  },
  {
    cat: 'ghana', name: 'Data Protection Commission', href: 'https://dpc.gov.gh/',
    desc: 'Register as a data controller under the Data Protection Act, 2012 (Act 843) if you collect personal data.',
    tags: ['Official', 'Ghana'],
  },

  // ── Funding ───────────────────────────────────────────────────────────────
  {
    cat: 'funding', name: 'UN Partner Portal', href: 'https://www.unpartnerportal.org/',
    desc: 'Register once to see and respond to UN agencies’ calls for civil society partners.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'funding', name: 'EU Funding & Tenders Portal', href: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/',
    desc: 'Every European Union call for proposals in one place, including calls open to civil society.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'funding', name: 'STAR-Ghana Foundation', href: 'https://star-ghana.org/',
    desc: 'A national centre for active citizenship and philanthropy, working for a vibrant, well-informed civil society in Ghana.',
    tags: ['Ghana'],
  },
  {
    cat: 'funding', name: 'Global Fund for Community Foundations', href: 'https://globalfundcommunityfoundations.org/',
    desc: 'A grassroots grantmaker supporting community philanthropy organisations around the world.',
    tags: ['Global'],
  },
  {
    cat: 'funding', name: 'GlobalGiving Accelerator', href: 'https://www.globalgiving.org/accelerator/',
    desc: 'Training plus a crowdfunding campaign that can earn your organisation a place on GlobalGiving.',
    tags: ['Global'],
  },
  {
    cat: 'funding', name: 'Opportunity Desk', href: 'https://opportunitydesk.org/',
    desc: 'A regularly updated list of grants, fellowships, awards and competitions.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'funding', name: 'FundsforNGOs', href: 'https://www2.fundsforngos.org/',
    desc: 'Grant news and fundraising guides for NGOs. Some content needs a paid membership.',
    tags: ['Global', 'Some paid'],
  },

  // ── Free tech ─────────────────────────────────────────────────────────────
  {
    cat: 'tools', name: 'Google for Nonprofits', href: 'https://www.google.com/nonprofits/',
    desc: 'No-cost and discounted Google tools, including Workspace, Ad Grants and the YouTube Nonprofit Program.',
    tags: ['For eligible NGOs'],
  },
  {
    cat: 'tools', name: 'Microsoft for Nonprofits', href: 'https://nonprofit.microsoft.com/',
    desc: 'Grants and discounts on Microsoft 365 and other Microsoft products.',
    tags: ['For eligible NGOs'],
  },
  {
    cat: 'tools', name: 'Canva for Nonprofits', href: 'https://www.canva.com/canva-for-nonprofits/',
    desc: 'Canva’s premium design features, templates and brand kits, free for eligible non-profits.',
    tags: ['For eligible NGOs'],
  },
  {
    cat: 'tools', name: 'TechSoup', href: 'https://www.techsoup.org/',
    desc: 'Donated and discounted software and hardware for non-profits, with guides to choosing and using them.',
    tags: ['For eligible NGOs'],
  },
  {
    cat: 'tools', name: 'Zoho for Nonprofits', href: 'https://www.zoho.com/nonprofits/',
    desc: 'Credits and discounts on Zoho’s CRM, email and fundraising tools.',
    tags: ['For eligible NGOs'],
  },
  {
    cat: 'tools', name: 'Slack for Nonprofits', href: 'https://slack.com/help/articles/204368833-Apply-for-the-Slack-for-Nonprofits-discount',
    desc: 'Free or discounted Slack plans for eligible organisations.',
    tags: ['For eligible NGOs'],
  },

  // ── Measure impact ────────────────────────────────────────────────────────
  {
    cat: 'impact', name: 'KoboToolbox', href: 'https://www.kobotoolbox.org/',
    desc: 'Build surveys and collect data, even offline, for monitoring, evaluation and research.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'impact', name: 'BetterEvaluation', href: 'https://www.betterevaluation.org/',
    desc: 'Free guides to planning, managing and using evaluations, method by method.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'impact', name: 'Ghana Statistical Service', href: 'https://statsghana.gov.gh/',
    desc: 'Census and survey data for problem statements, baselines and reports.',
    tags: ['Official', 'Ghana'],
  },
  {
    cat: 'impact', name: 'SDG indicators', href: 'https://unstats.un.org/sdgs/indicators/indicators-list/',
    desc: 'The official indicators for the Sustainable Development Goals, to align your results with the global goals.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'impact', name: 'tools4dev', href: 'https://tools4dev.org/',
    desc: 'Practical templates and how-to guides for international development projects.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'impact', name: 'PM4NGOs', href: 'https://pm4ngos.org/',
    desc: 'Best-practice guides and methods for managing development projects and MEAL.',
    tags: ['Free', 'Global'],
  },

  // ── Communications ────────────────────────────────────────────────────────
  {
    cat: 'comms', name: 'Ethical Storytelling', href: 'https://ethicalstorytelling.com/',
    desc: 'A community of non-profit storytellers, and a pledge to tell stories with dignity.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'comms', name: 'Dóchas resources', href: 'https://dochas.ie/resources/',
    desc: 'Tools and standards from Ireland’s network of development NGOs, including guidance on ethical communication.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'comms', name: 'Nonprofit Tech for Good', href: 'https://www.nptechforgood.com/',
    desc: 'Digital marketing and fundraising tips for non-profit professionals.',
    tags: ['Free', 'Global'],
  },

  // ── Safeguarding & standards ──────────────────────────────────────────────
  {
    cat: 'standards', name: 'Keeping Children Safe', href: 'https://www.keepingchildrensafe.global/',
    desc: 'Child safeguarding standards, tools and support for organisations of every size.',
    tags: ['Global'],
  },
  {
    cat: 'standards', name: 'Safeguarding Resource and Support Hub', href: 'https://safeguardingsupporthub.org/',
    desc: 'Free safeguarding guidance, templates and learning for organisations in the aid sector.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'standards', name: 'Core Humanitarian Standard', href: 'https://www.corehumanitarianstandard.org/',
    desc: 'Nine commitments on quality and accountability to the people your organisation serves.',
    tags: ['Free', 'Global'],
  },

  // ── Learning ──────────────────────────────────────────────────────────────
  {
    cat: 'learning', name: 'Kaya', href: 'https://kayaconnect.org/',
    desc: 'The Humanitarian Leadership Academy’s learning platform, with free online courses.',
    tags: ['Free', 'Global'],
  },
  {
    cat: 'learning', name: 'Acumen Academy', href: 'https://acumenacademy.org/',
    desc: 'Courses and programmes for people building social change, many of them free.',
    tags: ['Global'],
  },
  {
    cat: 'learning', name: 'Candid Learning', href: 'https://learning.candid.org/',
    desc: 'Trainings on fundraising, proposal writing and running a non-profit.',
    tags: ['Global'],
  },
  {
    cat: 'learning', name: 'edX', href: 'https://www.edx.org/',
    desc: 'Online courses from leading universities, many free to audit.',
    tags: ['Global'],
  },

  // ── Networks ──────────────────────────────────────────────────────────────
  {
    cat: 'networks', name: 'WACSI', href: 'https://wacsi.org/',
    desc: 'The West Africa Civil Society Institute, based in Accra: capacity development, advocacy support and knowledge resources.',
    tags: ['Ghana', 'Global'],
  },
  {
    cat: 'networks', name: 'National Youth Authority', href: 'https://nya.gov.gh/',
    desc: 'Ghana’s youth agency, with programmes in entrepreneurship, governance, agriculture and apprenticeships.',
    tags: ['Official', 'Ghana'],
  },
  {
    cat: 'networks', name: 'CIVICUS', href: 'https://www.civicus.org/',
    desc: 'A global alliance of civil society organisations and activists.',
    tags: ['Global'],
  },
]
