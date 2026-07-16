/* Staff/users for the super-admin management screen. */
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Stylist" | "Wardrobe Assistant";
  status: "active" | "pending";
  initials: string;
  photo?: string; // profile photo (undefined = show initials)
}

export const staff: StaffMember[] = [
  { id: "u1", name: "Sofia Marchetti", email: "sofia@atelier.studio", role: "Super Admin", status: "active", initials: "SM", photo: "/wardrobe/editorial1.jpg" },
  { id: "u2", name: "James Okafor", email: "james@atelier.studio", role: "Stylist", status: "active", initials: "JO", photo: "/wardrobe/model1.jpg" },
  { id: "u3", name: "Lena Petrov", email: "lena@atelier.studio", role: "Wardrobe Assistant", status: "active", initials: "LP" },
  { id: "u4", name: "Marco Rossi", email: "marco@atelier.studio", role: "Stylist", status: "pending", initials: "MR" },
  { id: "u5", name: "Aisha Khan", email: "aisha@atelier.studio", role: "Wardrobe Assistant", status: "pending", initials: "AK" },
];

/* Voting participants for the share-to-vote screen. */
export interface VoteOption {
  id: string;
  label: string;
  garmentIds: string[];
  votes: number;
  voters: string[]; // initials
}

export const voteSession = {
  title: "Gala — which look?",
  question: "Eleanor's pick for Saturday's gala",
  options: [
    { id: "v1", label: "Look A — Slip & Blazer", garmentIds: ["g6", "g8", "g9"], votes: 5, voters: ["SM", "JO", "LP", "EL", "MR"] },
    { id: "v2", label: "Look B — Midi & Coat", garmentIds: ["g5", "g1", "g9", "g10"], votes: 2, voters: ["AK", "EL"] },
    { id: "v3", label: "Look C — Tailored", garmentIds: ["g8", "g4", "g7"], votes: 1, voters: ["JO"] },
  ] as VoteOption[],
};
