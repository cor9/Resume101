// Knowledge base — distilled tips from Resume 101 RAG content.
// Each tip is surfaced contextually in the chat panel based on current step.

window.RESUME_TIPS = {
  name: [
    { q: "What if my child's legal name is hard to spell?", a: "Consider a stage name that's easier for casting directors to remember and pronounce — but use it consistently across headshots, casting profiles, and submissions." },
    { q: "Should I include a middle name?", a: "Avoid middle names unless your child is certain they want it as part of their professional name." },
    { q: "What about transitioning gender?", a: "Use the name they identify with professionally. Legal names are only required for contracts and union paperwork — not the resume." },
  ],
  union: [
    { q: "When can I list SAG-e?", a: "Only after the union confirms all three vouchers and formally communicates eligibility. Don't list it just because you have one or two vouchers." },
    { q: "We're AEA — can we say SAG too?", a: "No. AEA and SAG-AFTRA are separate unions. Only list ones your child officially belongs to." },
  ],
  height: [
    { q: "How current does this need to be?", a: "Update at least every 6 months for growing kids. An outdated height misleads casting and can cost roles." },
  ],
  age: [
    { q: "Should I list real age or play range?", a: "Industry standard is the play-age range (e.g. 8–11), not date of birth. Casting cares about what the actor reads as on camera." },
  ],
  hair: [
    { q: "What if hair changes often?", a: "List the natural color. Note dye jobs in special skills only if it affects current castability." },
  ],
  eyes: [],
  rep_yn: [
    { q: "What if we have multiple agents?", a: "List up to 3 representatives — typical setup is theatrical agent + commercial agent + manager. Each goes near the headshot area." },
    { q: "We just left an agency — keep them?", a: "No. Remove immediately. Outdated rep info confuses casting and hurts submissions." },
  ],
  tv_yn: [
    { q: "Order of credits?", a: "Television FIRST, then Film, then New Media, then Theatre. If no TV credits, lead with Film." },
    { q: "Background work?", a: "Never list background or extras. Only roles with documented speaking parts on the call sheet." },
    { q: "Character names in TV?", a: "No — only role type: Co-Star, Guest Star, Recurring, or Series Regular. Character names belong in Theatre only." },
  ],
  done: [
    { q: "What goes in the third column?", a: "Pick the single most impressive affiliation: Network, Production Company, or Director (e.g. 'Jane Doe, dir.'). Don't stack all three." },
    { q: "Commercials?", a: "For casting submissions, write '*List available upon request*' to avoid declaring conflicts. For agent submissions, list product TYPE (not brand)." },
    { q: "Special Skills tips", a: "Include languages (with fluency), dialects, sports + years, instruments + years, vocal range/part, and pertinent info: Coogan, work permits, local hire cities, valid passport." },
  ],
};

// Section-level tips (for the form view)
window.SECTION_TIPS = {
  basics: "Use legal name OR an established stage name — be consistent across all materials. Update height every 6 months for growing kids.",
  reps: "Up to 3 reps. Typical: theatrical agent + commercial agent + manager. Include company, point person name, city/state, phone, email.",
  headshot: "1–3 headshot thumbnails optional. Use 8×10 ratio. Headshot must match your current look.",
  tv: "Role type only: Co-Star, Guest Star, Recurring, Series Regular. NO character names. Third column = Network, Production Co., or 'Director, dir.'",
  film: "Role types: Lead or Supporting. Optionally tag (short), (feature), (student film) next to title.",
  theatre: "This is the ONE section where character names go (in role column). Third column = Theatre Company / Venue / Tour.",
  commercial: "For casting submissions, write '*List available upon request*'. For agent submissions, list product TYPE (Soft Drink, Tech, Vehicle) — never brand names. Conflicts!",
  newMedia: "Web series, scripted vertical content, branded content. Include platform (YouTube, IGTV, TikTok). Note '(Voice)' if applicable.",
  voiceover: "Format: Project — Role (Voice) — Studio. Include 'Various Roles (Voice)' for multi-character work. NDA projects: use generic title.",
  training: "10–15 max. Live, instructor-led only — no MasterClass or pre-recorded. Format: Class Type | Instructor or School | Studio/Location.",
  skills: "Include: language fluency, dialects, sports + years, vocal part + range + years, instruments + years, Coogan, work permits, local hire cities, valid passport, CHSPE if certified.",
};
