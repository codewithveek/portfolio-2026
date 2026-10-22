import type { Testimonial } from "./schemas";

/** PRD §6.7. With three or more, the section switches to the carousel layout. */
export const testimonials: readonly Testimonial[] = [
  {
    quote:
      "Victory is a very talented developer who generously shares his knowledge with others. He is a very valued member of our community, willing and capable of helping others get unstuck. Any company that gets ahold of Victory should do its utmost to keep him.",
    name: "Per Borgen",
    title: "CEO, Scrimba",
    isFeatured: true,
  },
  {
    quote:
      "Lucky is an exceptional developer with a very calm spirit. He not only developed a professional website for us, but also took the pain of training us to use it with and without his supervision. He delivered quality service with cost-effective advice.",
    name: "Dr. Oladapo David Ifeluwa",
    title: "Lecturer, Statistician & Data Scientist",
    isFeatured: false,
  },
];
