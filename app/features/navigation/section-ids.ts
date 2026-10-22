/** In-page anchors on the home page (PRD §6). */
export const sectionIds = {
  home: "home",
  positioning: "positioning",
  work: "work",
  about: "about",
  writing: "writing",
  contact: "contact",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export interface NavItem {
  id: SectionId;
  label: string;
}

export const dockItems: readonly NavItem[] = [
  { id: "work", label: "Work" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
