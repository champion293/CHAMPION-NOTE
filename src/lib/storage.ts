import { v4 as uuidv4 } from "uuid";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const OWNED_KEY = "mynotes:owned";
const NOTE_PREFIX = "mynotes:note:";

function isBrowser() {
  return typeof window !== "undefined";
}

export function createId(): string {
  return uuidv4().split("-")[0];
}

export function getOwnedIds(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(OWNED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function setOwnedIds(ids: string[]) {
  if (!isBrowser()) return;
  localStorage.setItem(OWNED_KEY, JSON.stringify(ids));
}

export function addOwnedId(id: string) {
  const ids = getOwnedIds();
  if (!ids.includes(id)) {
    ids.unshift(id);
    setOwnedIds(ids);
  }
}

export function removeOwnedId(id: string) {
  setOwnedIds(getOwnedIds().filter((x) => x !== id));
}

export function isOwned(id: string): boolean {
  return getOwnedIds().includes(id);
}

export function getNote(id: string): Note | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(NOTE_PREFIX + id);
    return raw ? (JSON.parse(raw) as Note) : null;
  } catch {
    return null;
  }
}

export function saveNote(note: Note) {
  if (!isBrowser()) return;
  localStorage.setItem(NOTE_PREFIX + note.id, JSON.stringify(note));
}

export function deleteNote(id: string) {
  if (!isBrowser()) return;
  localStorage.removeItem(NOTE_PREFIX + id);
  removeOwnedId(id);
}

export function getAllOwnedNotes(): Note[] {
  const ids = getOwnedIds();
  const notes: Note[] = [];
  for (const id of ids) {
    const n = getNote(id);
    if (n) notes.push(n);
  }
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

// --- Sharing: encode the whole note into the URL so a link works with
// zero backend. Anyone opening it sees a read-only snapshot decoded
// straight from the URL, and can fork it into their own owned note.
export function encodeShareData(title: string, content: string): string {
  if (!isBrowser()) return "";
  const json = JSON.stringify({ t: title, c: content });
  return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
}

export function decodeShareData(
  param: string
): { title: string; content: string } | null {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(param))));
    const obj = JSON.parse(json);
    return { title: obj.t ?? "", content: obj.c ?? "" };
  } catch {
    return null;
  }
}
