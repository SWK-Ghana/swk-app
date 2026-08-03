// Program & initiative blog posts — covering SWK Ghana's work beyond
// agribusiness: climate action, circular economy, technology, youth
// development, community engagement, and the Taka Kipawa + Marketplace
// initiatives. Cover images use SWK Ghana's own Cloudinary library.
//
// Seed with: node scripts/seed-program-posts.js

const cover = (path) =>
  `https://res.cloudinary.com/dwgj3lovn/image/upload/f_auto,q_auto,w_1200/${path}`

export const posts = [

  // ─── CLIMATE ACTION ─────────────────────────────────────────────────────────
  {
    _type: 'post',
    title: 'Youth on the Frontline: Why Climate Action Is Ghana’s Defining Fight',
    slug: { _type: 'slug', current: 'youth-on-the-frontline-climate-action' },
    category: 'Opinion',
    excerpt: 'Ghana’s young people did the least to cause the climate crisis, yet they will live with it the longest. That is exactly why they must lead the response — and why SWK Ghana puts youth at the centre of climate action.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-06-28T08:00:00Z',
    coverImageUrl: cover('v1773660248/photo_2026-03-16_11-22-40_zbflj4.jpg'),
    content: `<p>Climate change is often discussed as a distant, future problem. In Ghana, it is neither distant nor future. It is here, and it is already reshaping how communities live, farm, and plan for tomorrow.</p>

<p>Coastal communities from Keta to Ada are losing homes and land to rising seas and tidal surges. Rainfall has become less predictable, disrupting the planting calendars that farming families have relied on for generations. And illegal small-scale mining — known locally as <em>galamsey</em> — has turned once-clear rivers like the Pra, Ankobra, and Birim brown with pollution, threatening the drinking water of millions.</p>

<p>These are not abstract statistics. They are the lived reality of the very young people SWK Ghana exists to empower.</p>

<h2>The Generation With the Most at Stake</h2>

<p>Ghana is a young country. More than half of the population is under the age of 25. That means the decisions made about our environment today will be inherited, in full, by a generation that is only now coming of age. Young Ghanaians will spend their entire adult lives inside the climate we build in this decade.</p>

<p>There is a hard injustice in this. The people who will bear the heaviest burden of climate change contributed the least to causing it. But inside that injustice lies a mandate: if young people are going to inherit the consequences, they must also hold the pen when the solutions are written.</p>

<blockquote>Climate action is not something that should happen <em>to</em> young people. It is something that must be led <em>by</em> them.</blockquote>

<h2>What Youth-Led Climate Action Looks Like</h2>

<p>At SWK Ghana, climate action is not a single event or a hashtag. It is a sustained programme of education, advocacy, and practical projects that give young people the knowledge and the platform to act. That work takes several forms:</p>

<ul>
<li><strong>Climate education:</strong> Helping young people understand the science of climate change and, crucially, connect it to what they see in their own communities — the flooded street, the failed harvest, the polluted stream.</li>
<li><strong>Advocacy and voice:</strong> Amplifying youth perspectives in conversations about climate policy, from local assemblies to continental platforms, so that decisions are shaped by the people who will live with them longest.</li>
<li><strong>Practical projects:</strong> Tree planting, clean-up drives, conservation initiatives, and campaigns against galamsey that turn awareness into visible, measurable change.</li>
</ul>

<h2>From Awareness to Action</h2>

<p>Awareness alone changes nothing. Every young person in Ghana already knows the weather is behaving strangely. What is missing is not information but agency — the belief that an individual can do something, and the practical pathway to do it.</p>

<p>This is the gap SWK Ghana works to close. When a young person plants a tree, joins a river clean-up, or stands up in a community forum to demand better waste management, something shifts. Climate action stops being a problem for governments and international summits and becomes something they own.</p>

<h2>A Fight Worth Choosing</h2>

<p>Ghana’s climate challenge is real, and it is serious. But this generation of young Ghanaians is the largest, most connected, and most educated in the nation’s history. They have the numbers, the tools, and — increasingly — the will.</p>

<p>The question is not whether young people will be affected by climate change. They will. The question is whether they will be its victims or its authors. At SWK Ghana, we are betting on the latter, and we are building the programmes to make it possible.</p>`,
  },

  // ─── CIRCULAR ECONOMY ───────────────────────────────────────────────────────
  {
    _type: 'post',
    title: 'From Waste to Worth: The Circular Economy Ghana’s Youth Can Build',
    slug: { _type: 'slug', current: 'from-waste-to-worth-circular-economy' },
    category: 'Articles',
    excerpt: 'Ghana throws away enormous value every day. The circular economy asks a simple question — what if waste was treated as a resource, not a burden? For young entrepreneurs, the answer is a generational opportunity.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-07-05T08:00:00Z',
    coverImageUrl: cover('v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg'),
    content: `<p>Every day, Ghana’s towns and cities generate mountains of waste — plastic bottles, food scraps, packaging, worn-out electronics, textiles. Much of it is never collected. Of what is collected, only a small fraction is recycled. The rest ends up in landfills, gutters, and open drains, or is burned in the open air.</p>

<p>We tend to see this as a sanitation problem. It is. But it is also something else: an enormous, daily loss of value. The plastic clogging a drain in Accra is not just litter — it is raw material that could have been a fence post, a paving block, or a new product. That is the insight at the heart of the <strong>circular economy</strong>, and it is one of SWK Ghana’s core focus areas.</p>

<h2>What Is the Circular Economy?</h2>

<p>The economy most of us grew up with is linear: we take resources, make products, use them, and throw them away. Take, make, waste. It assumes resources are unlimited and that “away” is a real place. Neither is true.</p>

<p>A circular economy is designed to eliminate the concept of waste entirely. Products are designed to be reused, repaired, refurbished, and recycled. Materials are kept in use for as long as possible, and what would have been waste in one process becomes the input for another. It is the logic that United Nations Sustainable Development Goal 12 — Responsible Consumption and Production — asks every nation to adopt.</p>

<blockquote>In a circular economy, there is no such thing as waste. There is only material in the wrong place, waiting for someone with the right idea.</blockquote>

<h2>Why This Is a Youth Opportunity</h2>

<p>Here is what makes the circular economy so powerful for young Ghanaians: it turns a problem everyone can see into a business almost anyone can start. The raw material is everywhere and often free. The demand — for recycled products, for waste collection, for repair services — is growing. And the barriers to entry are far lower than in most industries.</p>

<p>Across Ghana, young entrepreneurs are already proving it. They are turning plastic waste into paving tiles and furniture. They are collecting organic waste and turning it into compost for urban farms. They are repairing and reselling electronics that would otherwise become e-waste. Each of these ventures does three things at once: it cleans the environment, it creates income, and it builds a more resilient local economy.</p>

<h2>SWK Ghana’s Role</h2>

<p>Our circular economy work focuses on making this opportunity real for more young people. That means:</p>

<ul>
<li><strong>Education:</strong> Running workshops on waste reduction, recycling, and sustainable consumption so young people understand both the environmental case and the business case.</li>
<li><strong>Platforms:</strong> Through the SWK Marketplace, we give youth-led, eco-friendly ventures a place to reach customers who share their values.</li>
<li><strong>Technology:</strong> Through the Taka Kipawa app, we are connecting the people who produce waste with the people who can turn it into something valuable.</li>
</ul>

<h2>A Cleaner, Richer Future</h2>

<p>The circular economy is not a sacrifice or a compromise. It is a smarter way to run an economy — one that treats the environment as an asset to be protected rather than a cost to be ignored. For a country as young as Ghana, with as much creativity and entrepreneurial energy as ours, it is exactly the kind of opportunity this generation was made for.</p>

<p>The waste is already here. The only question is who will see the worth in it.</p>`,
  },

  // ─── TECHNOLOGY & INNOVATION ────────────────────────────────────────────────
  {
    _type: 'post',
    title: 'Technology With Purpose: How SWK Ghana Builds Digital Tools for Real Problems',
    slug: { _type: 'slug', current: 'technology-with-purpose' },
    category: 'Program Updates',
    excerpt: 'Technology is only as valuable as the problem it solves. SWK Ghana’s approach to tech and innovation starts with community challenges — and works backwards to the tools that fix them.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-07-12T08:00:00Z',
    coverImageUrl: cover('v1773660247/photo_2026-03-16_11-22-22_i0nolg.jpg'),
    content: `<p>It is easy to be dazzled by technology for its own sake. New apps, new platforms, new buzzwords arrive constantly. But technology, on its own, solves nothing. A tool is only as valuable as the problem it addresses and the people it reaches.</p>

<p>That is the principle behind SWK Ghana’s work in technology and innovation. We do not build technology to look modern. We build it — and we teach young people to build it — to solve real problems that real communities in Ghana face every day.</p>

<h2>Starting With the Problem</h2>

<p>Our flagship example is <strong>Taka Kipawa</strong>, our waste-management platform. It did not begin with a desire to make an app. It began with a problem: households, waste collectors, and recyclers in Ga West Municipality were disconnected from one another. Waste that could be collected and recycled instead piled up, because the people who could move it had no easy way to find one another.</p>

<p>The technology came second. Once the problem was clear, the solution — a digital platform that maps waste, schedules collection, and connects a network of recyclers — followed naturally. That is the right order, and it is the order we teach.</p>

<blockquote>Good technology starts with a question about people, not a question about code.</blockquote>

<h2>Building Digital Skills</h2>

<p>Solving problems with technology requires people who can build. Across Ghana, there is enormous untapped talent — young people with the curiosity and creativity to become developers, designers, data analysts, and digital entrepreneurs, but without always having access to the training and opportunities to get there.</p>

<p>SWK Ghana’s technology programming works to close that gap through:</p>

<ul>
<li><strong>Digital literacy:</strong> Foundational skills that open the door to the modern economy, for participants at every starting level.</li>
<li><strong>Innovation labs and hackathons:</strong> Spaces where young people work in teams to design real solutions to community challenges, learning by building.</li>
<li><strong>Mentorship:</strong> Connecting emerging technologists with people who have walked the path before them.</li>
</ul>

<h2>Technology as a Multiplier</h2>

<p>What makes technology so powerful in the development context is that it multiplies the impact of everything else we do. A climate campaign reaches further when it is amplified online. A youth-led business grows faster when it can reach customers through a digital marketplace. A waste-collection effort becomes efficient when it is coordinated through an app rather than by word of mouth.</p>

<p>This is why technology and innovation is woven through all of SWK Ghana’s focus areas rather than sitting apart from them. It is not a separate programme. It is the engine that helps the others run.</p>

<h2>The Road Ahead</h2>

<p>Ghana’s digital future will not be built by outsiders. It will be built by young Ghanaians who understand their own communities and have the skills to serve them. Our job is to make sure as many of them as possible have those skills — and the confidence to use them on problems that matter.</p>`,
  },

  // ─── YOUTH DEVELOPMENT ──────────────────────────────────────────────────────
  {
    _type: 'post',
    title: 'Leadership Is Built, Not Born: Inside SWK Ghana’s Youth Development Approach',
    slug: { _type: 'slug', current: 'leadership-is-built-not-born' },
    category: 'Program Updates',
    excerpt: 'The best leaders are not discovered — they are developed. SWK Ghana’s youth development programmes are built on a simple belief: give young people real skills, real responsibility, and real support, and they will rise.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-07-19T08:00:00Z',
    coverImageUrl: cover('v1773615456/photo_2026-03-15_22-53-09_kvzvfr.jpg'),
    content: `<p>There is a myth that leaders are born — that some people simply arrive in the world with charisma, vision, and confidence, and the rest of us do not. It is a comforting story if you happen to be one of the anointed. For everyone else, it is a quiet way of being told to sit down.</p>

<p>SWK Ghana rejects that myth entirely. Leadership is a skill. Like any skill, it can be taught, practised, and mastered. And the earlier a young person is given the chance to build it, the further they will go. This belief sits at the very heart of our mission: to empower and mobilise young people as holistic changemakers.</p>

<h2>What “Holistic” Really Means</h2>

<p>We describe our approach to youth development as holistic, and we mean it precisely. It is not enough to teach a young person a single technical skill and send them on their way. Real development addresses the whole person:</p>

<ul>
<li><strong>Leadership and confidence:</strong> The ability to take initiative, make decisions, and inspire others.</li>
<li><strong>Practical and technical skills:</strong> The specific competencies — in agribusiness, technology, communication, and more — that make a young person employable and enterprising.</li>
<li><strong>Entrepreneurial thinking:</strong> The mindset that sees problems as opportunities and does not wait for permission to act.</li>
<li><strong>Values:</strong> Integrity, collaboration, and a genuine commitment to community and sustainability.</li>
</ul>

<blockquote>We are not trying to produce employees. We are trying to produce changemakers — young people who can build the future, not just fit into it.</blockquote>

<h2>Learning by Doing</h2>

<p>Skills are not built in lectures alone. They are built through practice, responsibility, and the occasional failure. That is why SWK Ghana’s programmes emphasise hands-on experience: workshops where participants build real projects, initiatives young people help design and run, and mentorship that pairs them with people who have already walked the road ahead.</p>

<p>When a young person is trusted with real responsibility — to organise an event, lead a team, run a campaign — something changes. They discover capacities they did not know they had. That discovery, repeated across thousands of young people, is how a generation of leaders is built.</p>

<h2>Who We Serve</h2>

<p>SWK Ghana focuses on young people aged 15 to 35, with particular attention to those who are too often overlooked: young women and girls, persons living with disability, students and out-of-school youth, and those in urban-poor, rural, and peri-urban communities. Talent is distributed everywhere. Opportunity is not. Our work is to correct that imbalance.</p>

<h2>The Ripple Effect</h2>

<p>When you develop one young leader, you do not change one life. That young person goes on to start a business that employs others, to lead a community project that lifts a neighbourhood, or to mentor the next group coming up behind them. Leadership development is one of the highest-return investments a society can make, because its effects compound across time and community.</p>

<p>Leaders are built, not born. At SWK Ghana, building them is the work we come to do every single day.</p>`,
  },

  // ─── COMMUNITY ENGAGEMENT ───────────────────────────────────────────────────
  {
    _type: 'post',
    title: 'Change Starts at the Grassroots: Our Community Engagement Across Greater Accra',
    slug: { _type: 'slug', current: 'change-starts-at-the-grassroots' },
    category: 'Impact Stories',
    excerpt: 'Real, lasting change does not arrive from the top down. It grows from within communities themselves. Here is how SWK Ghana works alongside communities across Greater Accra to build resilience from the ground up.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-07-26T08:00:00Z',
    coverImageUrl: cover('v1773615455/photo_2026-03-15_22-53-49_d6sonh.jpg'),
    content: `<p>It is tempting to believe that development is something you deliver to a community — a project designed elsewhere, funded elsewhere, and dropped in from above. It rarely works. Solutions imported without the involvement of the people they are meant to serve tend to fade the moment the outside support leaves.</p>

<p>SWK Ghana works the other way around. We believe that the most durable change begins <em>within</em> communities, shaped by the people who live there and know their own needs best. Community engagement is not one activity among many for us — it is the foundation everything else is built on.</p>

<h2>Beginning With Listening</h2>

<p>Every genuine community programme begins with listening. Before we run a workshop or launch an initiative, we ask: What does this community actually need? What are its strengths? Who are the people already working to make things better, and how can we support rather than replace them?</p>

<p>This is slower than arriving with a ready-made plan. It is also the only approach that lasts. When a community helps design a project, that project belongs to them. And what belongs to people, they protect.</p>

<blockquote>The best development does not do things <em>for</em> communities. It does things <em>with</em> them — and then leaves them stronger and more capable than before.</blockquote>

<h2>What Community Engagement Looks Like in Practice</h2>

<p>Across Greater Accra, our community work takes many forms:</p>

<ul>
<li><strong>Outreach and education:</strong> Bringing SWK Ghana’s programmes — on sustainability, skills, and leadership — directly to communities rather than waiting for people to come to us.</li>
<li><strong>Participatory projects:</strong> Clean-up drives, awareness campaigns, and local initiatives that residents help plan and carry out themselves.</li>
<li><strong>Forums and dialogue:</strong> Creating spaces where community members, especially young people, can raise concerns, share ideas, and shape the decisions that affect them.</li>
</ul>

<h2>Building Resilience, Not Dependency</h2>

<p>The goal of good community engagement is to work yourself out of a job. Success is not a community that depends on SWK Ghana. Success is a community that has the knowledge, the confidence, and the local leadership to keep improving long after any single programme ends.</p>

<p>That is what we mean when we talk about building resilient communities. Resilience is not something you can hand over. It is something a community grows for itself — and our role is to create the conditions in which that growth can happen.</p>

<h2>From Accra Outward</h2>

<p>Our current base is in Accra, in the Greater Accra Region, and that is where much of our community work is rooted today. But the model — listen first, work alongside people, build local capacity, then step back — is one we intend to carry across Ghana and, in time, across Africa. Grassroots change is not glamorous. It is patient, relational, and often invisible from the outside. It is also the only kind that truly lasts.</p>`,
  },

  // ─── TAKA KIPAWA (INITIATIVE) ───────────────────────────────────────────────
  {
    _type: 'post',
    title: 'Taka Kipawa: Turning “Our Waste” Into a Cleaner Ga West',
    slug: { _type: 'slug', current: 'taka-kipawa-cleaner-ga-west' },
    category: 'Program Updates',
    excerpt: 'Taka Kipawa — “Our Waste” in Swahili — is SWK Ghana’s waste-management platform connecting households, collectors, and recyclers across Ga West Municipality. Here is the problem it solves and how it works.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-08-01T08:00:00Z',
    coverImageUrl: cover('v1773660247/photo_2026-03-16_11-22-33_gfsqwy.jpg'),
    content: `<p>The name says it plainly. <strong>Taka Kipawa</strong> means “Our Waste” in Swahili — and that word, <em>our</em>, is the whole idea. Waste is not someone else’s problem to solve. It belongs to all of us, and so does the responsibility, and the opportunity, of dealing with it well.</p>

<p>Taka Kipawa is SWK Ghana’s waste-management platform, built to serve the households, waste collectors, and recyclers of Ga West Municipality. It is a practical example of what happens when we point technology at a real community problem.</p>

<h2>The Problem It Solves</h2>

<p>In many Ghanaian communities, the pieces needed for effective waste management already exist — they are just not connected. Households want their waste collected. Collectors want reliable routes and customers. Recyclers want a steady supply of sorted materials. But without a system to link them, each operates in isolation, and waste that could be collected and turned into value instead accumulates in streets, drains, and dumps.</p>

<p>Taka Kipawa exists to close that gap. It brings the whole chain — households, collectors, recyclers — onto one platform, so that waste moves efficiently from where it is produced to where it can be turned into something useful.</p>

<blockquote>The waste was never the problem. The disconnection was. Taka Kipawa connects the people who were always meant to be working together.</blockquote>

<h2>How It Works</h2>

<p>The platform brings together several capabilities designed around how waste actually moves through a community:</p>

<ul>
<li><strong>Waste mapping:</strong> Building a clear picture of where waste is generated across the municipality.</li>
<li><strong>Collection scheduling:</strong> Making it simple for households to have their waste collected reliably, and for collectors to plan efficient routes.</li>
<li><strong>Recycler network:</strong> Connecting collected materials to the recyclers who can process them, so waste re-enters the economy instead of ending up in a landfill.</li>
<li><strong>Impact tracking:</strong> Measuring what the system achieves, so progress can be seen and improved.</li>
</ul>

<h2>Why It Matters Beyond Waste</h2>

<p>Taka Kipawa is a waste-management tool, but its impact reaches further. Cleaner communities are healthier communities. Efficient recycling supports the circular economy and the livelihoods it creates. And a well-run collection network creates work for the young people who operate it.</p>

<p>It also demonstrates something we care about deeply: that Ghanaian problems can be solved with Ghanaian solutions, built by young Ghanaians who understand the context because they live in it.</p>

<h2>A Model for the Future</h2>

<p>Taka Kipawa begins in Ga West, but the challenge it addresses is national. Communities across Ghana face the same disconnection between waste, collectors, and recyclers. A platform that works here can be adapted to work elsewhere — and that is exactly the ambition.</p>

<p>Our waste. Our responsibility. Our opportunity. That is the promise inside the name, and it is the promise Taka Kipawa was built to keep.</p>`,
  },

  // ─── MARKETPLACE (INITIATIVE) ───────────────────────────────────────────────
  {
    _type: 'post',
    title: 'The SWK Marketplace: A Storefront for Ghana’s Youth-Led Green Economy',
    slug: { _type: 'slug', current: 'swk-marketplace-youth-green-economy' },
    category: 'Program Updates',
    excerpt: 'A great sustainable product means little if no one can find it. The SWK Marketplace connects young, eco-conscious entrepreneurs with customers who share their values — turning good intentions into real sales.',
    author: 'SWK Ghana',
    published: true,
    publishedAt: '2026-08-02T08:00:00Z',
    coverImageUrl: cover('v1773615456/photo_2026-03-15_22-53-24_iqemaf.jpg'),
    content: `<p>Across Ghana, young entrepreneurs are building remarkable things: products made from recycled materials, organic produce grown with care, handmade crafts, and agribusiness goods that support sustainable livelihoods. They have the creativity, the products, and the values. What many of them lack is something simpler and just as important — a way to reach customers.</p>

<p>The <strong>SWK Marketplace</strong> exists to solve exactly that. It is an online storefront built specifically to support youth-led ventures in agribusiness and the circular economy, connecting them with buyers who care about where their money goes.</p>

<h2>Why a Dedicated Marketplace?</h2>

<p>A young person who turns plastic waste into beautiful, durable products has done the hard part. But a great product that no one can find might as well not exist. General marketplaces are crowded, competitive, and rarely built with sustainability in mind. A sustainable, youth-led venture can get lost in the noise.</p>

<p>The SWK Marketplace changes the context. Here, being eco-friendly and youth-led is not a footnote — it is the point. Customers who visit are there precisely because they want to support sustainable, locally made, values-driven products. That alignment between seller and buyer is worth more than any advertising budget.</p>

<blockquote>The Marketplace does not just sell products. It builds a community of people who believe that what we buy should reflect the world we want to build.</blockquote>

<h2>Built Around SDG 12</h2>

<p>Every product on the SWK Marketplace is meant to align with United Nations Sustainable Development Goal 12 — Responsible Consumption and Production — and to be genuinely eco-friendly. That standard is deliberate. It ensures the Marketplace stays true to its mission and gives customers confidence that their purchase is doing real good, not just carrying a green label.</p>

<p>Categories on the Marketplace reflect this focus: agribusiness goods, recycled and upcycled products, handmade crafts, and organic produce — all rooted in sustainability and youth enterprise.</p>

<h2>What It Means for Young Entrepreneurs</h2>

<p>For a young entrepreneur, the Marketplace offers more than a sales channel. It offers visibility, credibility, and a community. Listing a product on a platform associated with SWK Ghana signals to customers that the venture is serious about sustainability. And being part of a network of like-minded founders means shared learning, encouragement, and opportunity.</p>

<p>Any young entrepreneur whose products align with SDG 12 and sustainability can apply to list on the Marketplace — turning an idea and a set of values into a real, growing business.</p>

<h2>Consumption as a Force for Good</h2>

<p>Every purchase is a small act of power. It says something about the kind of economy — and the kind of world — we want to support. The SWK Marketplace is built on the belief that when consumers and young, sustainable entrepreneurs find each other, that power is multiplied.</p>

<p>Ghana’s green economy is being built right now, one youth-led venture at a time. The Marketplace is where it finds its customers.</p>`,
  },

]
