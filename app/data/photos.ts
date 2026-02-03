import { Photo } from "../components/PhotoGallery";

export const chessClubPhotos: Photo[] = [
  {
    id: "thomas-egan-1",
    thumbnail: "/photos/thumbnails/2026-01-30---so-many-cults-at-chess-club---by-thomas-egan--1.jpg",
    fullSize: "/photos/2026-01-30---so-many-cults-at-chess-club---by-thomas-egan--1.jpg",
    photographer: "Thomas Egan",
    photographerLink: 'https://www.instagram.com/thomaseganphotography',
    date: "January 30, 2026",
    venue: "Chess Club",
  },
  {
    id: "thomas-egan-2",
    thumbnail: "/photos/thumbnails/2026-01-30---so-many-cults-at-chess-club---by-thomas-egan--2.jpg",
    fullSize: "/photos/2026-01-30---so-many-cults-at-chess-club---by-thomas-egan--2.jpg",
    photographer: "Thomas Egan",
    photographerLink: 'https://www.instagram.com/thomaseganphotography',
    date: "January 30, 2026",
    venue: "Chess Club",
  },
  {
    id: "thomas-egan-3",
    thumbnail: "/photos/thumbnails/2026-01-30---so-many-cults-at-chess-club---by-thomas-egan--3.jpg",
    fullSize: "/photos/2026-01-30---so-many-cults-at-chess-club---by-thomas-egan--3.jpg",
    photographer: "Thomas Egan",
    photographerLink: 'https://www.instagram.com/thomaseganphotography',
    date: "January 30, 2026",
    venue: "Chess Club",
  },
  {
    id: "chris-donahue-1",
    thumbnail: "/photos/thumbnails/2026-01-30---so-many-cults-at-chess-club---by-chris-donahue--1.jpg",
    fullSize: "/photos/2026-01-30---so-many-cults-at-chess-club---by-chris-donahue--1.jpg",
    photographer: "Chris Donahue",
    photographerLink: 'https://www.instagram.com/chrisdonahue',
    date: "January 30, 2026",
    venue: "Chess Club",
  },
];

// Homepage featured photo (Thomas Egan #2)
export const featuredPhoto = chessClubPhotos.find(p => p.id === "thomas-egan-2")!;
