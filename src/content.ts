// All copy and links for the site. Replace every {{...}} value with your own.

export type Persona = {
  key: string;
  label: string;
  blurb: string;
};

export const content = {
  name: "{{YOUR_NAME}}",
  city: "{{CITY}}",
  heroAlt: "{{descriptive alt text for the hero photo}}",
  nav: [
    { label: "WORK", href: "#" },
    { label: "PLAY", href: "#" },
    { label: "ME", href: "#" },
    { label: "RESUME", href: "/resume.pdf" },
  ],
  personas: [
    {
      key: "anyone",
      label: "anyone",
      blurb:
        "{{intro paragraph}} A product designer who creates user-centered experiences balancing user needs and technical feasibility.",
    },
    {
      key: "recruiter",
      label: "recruiter",
      blurb: "{{recruiter blurb}} A short summary of your role, strengths, and what you're looking for next.",
    },
    {
      key: "product designer",
      label: "product designer",
      blurb: "{{product designer blurb}} How you approach research, systems, and craft, in a sentence or two.",
    },
    {
      key: "developers",
      label: "developers",
      blurb: "{{developers blurb}} How you collaborate with engineering, from handoff to shipping.",
    },
  ] satisfies Persona[],
  pills: ["{{currently doing X}}", "based in {{city}}"],
  footer: {
    email: "mailto:{{you@example.com}}",
    linkedin: "{{https://www.linkedin.com/in/your-handle}}",
  },
};
