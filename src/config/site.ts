export const profiles = {
  github: {
    label: "GitHub",
    url: "https://github.com/t-ooshiro0125",
    handle: "t-ooshiro0125",
  },
  x: {
    label: "X",
    url: "https://x.com/working_corgi",
    handle: "@working_corgi",
  },
} as const;

export const profileItems = [profiles.github, profiles.x] as const;

export const navigationItems = [
  { label: "Home", path: "" },
  { label: "About", path: "about/" },
  { label: "Works", path: "works/" },
  { label: "Notes", path: "notes/" },
  { label: "Contact", path: "contact/" },
] as const;
