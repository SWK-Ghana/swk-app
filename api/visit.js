import { sanityStore } from './_lib/store.js'
import { createVisitHandler } from './_lib/visits.js'

export default createVisitHandler(() => sanityStore(process.env.SANITY_TOKEN))
