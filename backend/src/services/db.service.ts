import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { Database } from "../models/Database";

const dbPath = path.join(__dirname, "../data/db.json");

export const readDb = (): Database => {
  const raw = readFileSync(dbPath, "utf-8");
  return JSON.parse(raw) as Database;
};

export const writeDb = (db: Database): void => {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
};
