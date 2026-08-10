"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Plus, Sparkles, Trash2, ArrowRight } from "lucide-react";
import GlowOrbs from "@/components/GlowOrbs";
import LiquidButton from "@/components/LiquidButton";
import {
  createId,
  addOwnedId,
  saveNote,
  getAllOwnedNotes,
  deleteNote,
  Note,
} from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNotes(getAllOwnedNotes());
    setMounted(true);
  }, []);

  function handleCreate() {
    const id = createId();
    const now = Date.now();
    saveNote({
      id,
      title: "Untitled Note",
      content: "",
      createdAt: now,
      updatedAt: now,
    });
    addOwnedId(id);
    router.push(`/note/${id}`);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    deleteNote(id);
    setNotes(getAllOwnedNotes());
  }

  return (
    <main className="relative min-h-screen w-full">
      <GlowOrbs />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-6 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-white/70"
        >
          <Sparkles size={14} className="text-purple-300" />
          No login. No signup. Just write.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-6xl"
        >
          <span className="text-gradient">My Notes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 max-w-xl text-center text-base text-white/50 sm:text-lg"
        >
          Write freely, share instantly with a link, and watch your numbers
          add themselves up — automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10"
        >
          <LiquidButton onClick={handleCreate} className="px-8 py-4 text-base">
            <Plus size={20} />
            Create New Note
          </LiquidButton>
        </motion.div>

        {/* Notes list */}
        <div className="mt-20 w-full">
          {mounted && notes.length > 0 && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40"
            >
              Your notes on this device
            </motion.h2>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, i) => (
              <motion.a
                key={note.id}
                href={`/note/${note.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group glass relative flex flex-col rounded-2xl p-5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl liquid-bg">
                    <FileText size={16} className="text-white" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="opacity-0 transition-opacity group-hover:opacity-100 text-white/40 hover:text-red-400"
                    aria-label="Delete note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="mb-1 truncate font-semibold text-white">
                  {note.title || "Untitled Note"}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-white/40">
                  {note.content || "Empty note..."}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-white/30">
                  <span>
                    {new Date(note.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </div>
              </motion.a>
            ))}
          </div>

          {mounted && notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass mt-4 flex flex-col items-center rounded-3xl px-8 py-16 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl liquid-bg opacity-80">
                <FileText size={26} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white/80">
                No notes yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-white/40">
                Hit "Create New Note" above to start writing. Try typing
                something like{" "}
                <span className="text-purple-300">"Cement 50"</span> and
                watch the totals panel come alive.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer credit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 flex flex-col items-center gap-1"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/30">
            Developed by
          </p>
          <motion.p
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[length:200%_auto] bg-gradient-to-r from-fuchsia-400 via-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-2xl font-extrabold tracking-wide text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.35)] sm:text-3xl"
          >
            ABDUL MATEEN
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
