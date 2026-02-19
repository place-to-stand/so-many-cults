import type { ComponentType } from "react";
import { FaInstagram, FaBandcamp } from "react-icons/fa";
import { FiCalendar, FiMail } from "react-icons/fi";

export const BAND_NAME = "so many cults";
export const BAND_SUBTITLE = "Austin, Texas Psych Rock";
export const BAND_EMAIL = "somanycults@gmail.com";
export const BAND_WEBSITE = "somanycults.com";

export const logo = {
  src: "/so-many-cults-logo.svg",
  alt: "so many cults logo",
  width: 1582,
  height: 263,
  font: "Geist Mono, Bold",
};

export type BandLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isExternal: boolean;
};

export const bandLinks: BandLink[] = [
  {
    label: "Shows",
    href: "https://do512.com/artists/so-many-cults",
    icon: FiCalendar,
    isExternal: true,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/somanycults",
    icon: FaInstagram,
    isExternal: true,
  },
  {
    label: "Bandcamp",
    href: "https://somanycults.bandcamp.com/",
    icon: FaBandcamp,
    isExternal: true,
  },
  {
    label: "Contact",
    href: `mailto:${BAND_EMAIL}`,
    icon: FiMail,
    isExternal: false,
  },
];

export const members = [
  { name: "Dave Pokk", role: "vocals, guitar" },
  { name: "Jason Desiderio", role: "synth, guitar, vocals" },
  { name: "Quinn Finney", role: "bass" },
  { name: "Dante Muñoz", role: "drums" },
];

export const ffo = ["Queens of the Stone Age", "All Them Witches", "Wand"];

export const shortBio =
  "So Many Cults are an Austin, Texas psych rock band channeling heavy, hypnotic " +
  "grooves through the sweat-soaked clubs of the Red River Cultural District. Formed " +
  "in 2024, the four-piece blends desert rock intensity, swampy psychedelia, and " +
  "garage-rock urgency into a sound that thrives in the live setting.";

export const extendedBio = [
  "So Many Cults emerged from Austin\u2019s teeming underground rock scene in 2024, " +
    "a four-piece psych rock band built for volume and bad lighting. Vocalist and " +
    "guitarist Dave Pokk, synth and guitarist Jason Desiderio, bassist Quinn Finney, " +
    "and drummer Dante Mu\u00f1oz came together with a shared appetite for the heavier, " +
    "more hypnotic corners of psychedelic rock \u2014 the kind that hits harder at midnight " +
    "in a room with a low ceiling.",

  "The band quickly established themselves as regulars on Austin\u2019s live " +
    "circuit, cutting their teeth at Red River staples like 13th Floor and " +
    "Chess Club and East 6th mainstay Hotel Vegas \u2014 small, loud rooms where the line " +
    "between stage and crowd barely exists. " +
    "Along the way they\u2019ve shared stages with Farmer\u2019s Wife, TC Superstar, " +
    "Pussy Gillette, Exotic Fruitica, and Subpar Snatch, finding their footing in the " +
    "city\u2019s thriving garage-psych ecosystem and building a reputation on the strength " +
    "of their relentless live shows.",

  "Their sound draws from a deep well: the desert-baked riffs and rhythmic propulsion " +
    "of Queens of the Stone Age, the dark psychedelic sprawl of All Them Witches, and " +
    "the fuzz-drenched experimentalism of Wand. But So Many Cults filter these " +
    "influences through Austin\u2019s own tradition of uncompromising live rock, arriving " +
    "at something that feels both familiar and distinctly their own. Demo tracks " +
    "like \u201cArcade,\u201d \u201cDirected Energy Weapons,\u201d and \u201cIt\u2019s " +
    "Gone Viral\u201d hint at a band with conspiratorial themes and a taste for the " +
    "absurd, delivered with the heaviness and precision the genre demands.",

  "So Many Cults are a band still in the early chapters of their story, but the " +
    "trajectory is clear: more noise, more rooms, more converts.",
];
