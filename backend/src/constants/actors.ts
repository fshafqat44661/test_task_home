export const ACTORS = ["Alice Johnson", "Bob Smith", "Carol Williams"] as const;

export type Actor = (typeof ACTORS)[number];

export const isValidActor = (actor: string): actor is Actor =>
  ACTORS.includes(actor as Actor);
