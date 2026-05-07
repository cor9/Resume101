// Sample data: Billy Boyson from the PDF
const billyDemo = {
  actor: {
    name: "Billy Boyson",
    union: "SAG-AFTRA",
    height: "4'8\"",
    eyes: "Brown",
    hair: "Brown",
    age: "Plays 8–11",
  },
  reps: [
    { type: "Agency", name: "DDO Talent Agency", location: "Los Angeles, CA", phone: "818.555.1212", email: "deborah@ddokidstalent.com" },
    { type: "Manager", name: "Bohemia Group", location: "Los Angeles, CA", phone: "310.555.1212", email: "corey@bohemiaent.com" },
  ],
  television: [
    { project: "All This", role: "Series Regular", studio: "Nockelodeon" },
    { project: "St. Hospital", role: "Guest Star", studio: "Brown Productions" },
    { project: "Harpo Hall", role: "Co-Star", studio: "CBC" },
  ],
  film: [
    { project: "Elotes", role: "Lead", studio: "Paramount Pictures" },
    { project: "Tricycle Wars", role: "Supporting", studio: "Jack Jay, Dir." },
  ],
  theatre: [
    { project: "Jungle Book, Jr.", role: "Mogli", studio: "SF Playhouse" },
    { project: "Annie", role: "Pepper", studio: "Downtown Theater" },
    { project: "Wizard If Ozzy", role: "Ensemble", studio: "Little School" },
    { project: "Cherry Orchard", role: "Ensemble", studio: "Little School" },
  ],
  commercial: [
    { project: "*List Available Upon Request", role: "", studio: "" },
  ],
  newMedia: [
    { project: "Merry Minutes", role: "Principal", studio: "YouTube" },
    { project: "Mister Conductor", role: "Principal", studio: "YouTube" },
  ],
  voiceover: [
    { project: "Sample Audiobook", role: "Narrator", studio: "Audible Kids" },
  ],
  training: [
    { class: "Stacey Smile", instructor: "CA Acting Studio", location: "Online" },
    { class: "Audition Techniques", instructor: "Corey Ralston", location: "LDG / Online" },
    { class: "Private Coach", instructor: "Henry Allen", location: "Los Angeles, CA" },
    { class: "Commercial Class", instructor: "Mary Moylan", location: "Los Angeles, CA" },
  ],
  skills:
    "Fully Vaccinated, Work Permit (CA, GA), Coogan Acct, Valid Passport, Local Hire (Boston, NYC, ATL), Fluent Spanish, Dialect (French, Southern, Creole, British), Vocalist (Tenor, 4 years), Dancer (Tap, Jazz, Hip-Hop, 3 years), Soccer (4 years), Baseball (2 years), Print Modeling Experience, Piano (5 years), Animal Lover, Debate Team, Video Game Enthusiast, Old Soul",
  headshot: null, // base64 dataURL or null
};

window.billyDemo = billyDemo;

// Section ordering catalog
window.SECTION_CATALOG = [
  { key: 'television', label: 'Television' },
  { key: 'film', label: 'Film' },
  { key: 'theatre', label: 'Theatre' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'newMedia', label: 'New Media' },
  { key: 'voiceover', label: 'Voiceover' },
];
