"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  FileText,
  Layers3,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  WandSparkles,
  Zap,
  ChevronRight,
  Command,
  PenLine,
} from "lucide-react";

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
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNotes(getAllOwnedNotes());
    setMounted(true);
  }, []);

  function refreshNotes() {
    setNotes(getAllOwnedNotes());
  }

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
    refreshNotes();
  }

  function openAI(note?: Note) {
    setSelectedNote(note || notes[0] || null);
    setAiOpen(true);
  }

  function createDemoSummary(note: Note | null) {
    if (!note || !note.content.trim()) {
      return "Your note is empty. Start writing something and Champion Assistant will summarize the important points.";
    }

    const sentences = note.content
      .replace(/\s+/g, " ")
      .split(/[.!?]\s+/)
      .filter(Boolean)
      .slice(0, 3);

    if (sentences.length === 0) {
      return "Champion Assistant found content in your note, but there is not enough text yet for a useful summary.";
    }

    return sentences.join(". ") + (sentences.length ? "." : "");
  }

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  const totalCharacters = useMemo(
    () => notes.reduce((sum, note) => sum + note.content.length, 0),
    [notes]
  );

  const totalWords = useMemo(
    () =>
      notes.reduce(
        (sum, note) =>
          sum +
          note.content
            .trim()
            .split(/\s+/)
            .filter(Boolean).length,
        0
      ),
    [notes]
  );

  const latestNote = notes.length
    ? [...notes].sort((a, b) => b.updatedAt - a.updatedAt)[0]
    : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05050f] text-white">
      <GlowOrbs />

      {/* GLOBAL AMBIENT LIGHT */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -50, 40, 0],
            opacity: [0.12, 0.2, 0.1, 0.12],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-fuchsia-500 blur-[180px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 50, -30, 0],
            opacity: [0.08, 0.16, 0.08, 0.08],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[35%] h-[550px] w-[550px] rounded-full bg-cyan-500 blur-[190px]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* NAVBAR */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.04] bg-[#05050f]/60 py-5 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: 5,
              }}
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[-30%] bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,.7),transparent,rgba(34,211,238,.6),transparent)]"
              />

              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#080813]">
                <BrainCircuit
                  size={18}
                  className="text-purple-200"
                />
              </div>
            </motion.div>

            <div>
              <div className="text-sm font-black tracking-tight">
                Champion
                <span className="text-purple-400">.</span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.28em] text-white/25">
                Smart Notes
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-300/60">
                Private Workspace
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => openAI()}
            className="flex items-center gap-2 rounded-xl border border-purple-400/10 bg-purple-500/[0.07] px-3 py-2 text-xs font-semibold text-purple-200 transition hover:border-purple-400/25 hover:bg-purple-500/[0.12]"
          >
            <WandSparkles size={14} />
            <span className="hidden sm:inline">
              AI Assistant
            </span>
          </motion.button>
        </motion.header>

        {/* HERO */}
        <section className="relative flex min-h-[680px] flex-col items-center justify-center py-20 text-center lg:min-h-[720px]">

          {/* Floating AI badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
            }}
            className="relative mb-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(168,85,247,0)",
                  "0 0 50px rgba(168,85,247,.18)",
                  "0 0 0 rgba(168,85,247,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-500/[0.07] px-4 py-2 backdrop-blur-xl"
            >
              <Sparkles
                size={14}
                className="text-purple-300"
              />

              <span className="text-[11px] font-semibold text-purple-100/70">
                AI-powered note workspace
              </span>

              <span className="h-1 w-1 rounded-full bg-purple-300/40" />

              <span className="text-[10px] text-white/30">
                No account required
              </span>
            </motion.div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
            }}
            className="max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[100px]"
          >
            Your ideas,
            <br />

            <span className="relative inline-block">
              <span className="text-gradient">
                made smarter.
              </span>

              <motion.span
                animate={{
                  scaleX: [0.5, 1, 0.5],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 left-[10%] h-[2px] w-[80%] origin-center bg-gradient-to-r from-transparent via-purple-400 to-transparent blur-[1px]"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
            className="mt-8 max-w-2xl text-sm leading-7 text-white/40 sm:text-lg"
          >
            Write naturally. Organize your thoughts. Automatically
            detect totals. And let AI turn long notes into clear,
            useful summaries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
            }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <LiquidButton
              onClick={handleCreate}
              className="px-8 py-4 text-sm sm:px-10 sm:text-base"
            >
              <Plus size={19} />
              Create New Note
              <ArrowRight size={17} />
            </LiquidButton>

            <motion.button
              whileHover={{
                scale: 1.03,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAI()}
              className="flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-6 py-4 text-sm font-medium text-white/60 backdrop-blur-xl transition"
            >
              <WandSparkles
                size={17}
                className="text-purple-300"
              />
              Try AI Summary
            </motion.button>
          </motion.div>

          {/* Mini feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {[
              [Zap, "Auto Totals"],
              [WandSparkles, "AI Summary"],
              [Share2, "Instant Share"],
              [ShieldCheck, "Private"],
            ].map(([Icon, label]) => {
              const FeatureIcon = Icon as typeof Zap;

              return (
                <div
                  key={label as string}
                  className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/30 backdrop-blur-xl"
                >
                  <FeatureIcon
                    size={11}
                    className="text-purple-300/70"
                  />

                  {label as string}
                </div>
              );
            })}
          </motion.div>

          {/* Hero floating card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              rotateX: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.8,
            }}
            className="absolute -bottom-8 left-1/2 hidden w-[720px] -translate-x-1/2 lg:block"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-1 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.7rem] border border-white/[0.04] bg-[#090914]/90 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-400/70" />
                    <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
                    <div className="h-2 w-2 rounded-full bg-green-400/70" />
                  </div>

                  <div className="flex items-center gap-2 text-[9px] text-white/20">
                    <Command size={10} />
                    Smart Workspace
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5">
                    <div className="mb-4 h-2 w-20 rounded-full bg-purple-400/20" />
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full bg-white/[0.06]" />
                      <div className="h-2 w-[85%] rounded-full bg-white/[0.04]" />
                      <div className="h-2 w-[65%] rounded-full bg-white/[0.04]" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-purple-400/10 bg-purple-500/[0.05] p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <WandSparkles
                        size={13}
                        className="text-purple-300"
                      />

                      <span className="text-[9px] font-semibold text-purple-200/60">
                        AI SUMMARY
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full bg-purple-300/10" />
                      <div className="h-2 w-[90%] rounded-full bg-purple-300/[0.07]" />
                      <div className="h-2 w-[70%] rounded-full bg-purple-300/[0.05]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* DASHBOARD */}
        <section className="relative mt-24 pb-10 lg:mt-40">

          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-300/50">
                Your workspace
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Everything in one place.
              </h2>

              <p className="mt-2 max-w-xl text-sm text-white/30">
                Your notes, your numbers and your AI tools —
                ready when you are.
              </p>
            </div>

            <LiquidButton
              onClick={handleCreate}
              className="w-fit px-5 py-3"
            >
              <Plus size={16} />
              New Note
            </LiquidButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            {[
              {
                label: "Total Notes",
                value: notes.length,
                icon: Layers3,
                text: "Your workspace",
              },
              {
                label: "Words",
                value: totalWords,
                icon: PenLine,
                text: "Across all notes",
              },
              {
                label: "Characters",
                value: totalCharacters,
                icon: FileText,
                text: "Written content",
              },
              {
                label: "AI Ready",
                value: "100%",
                icon: WandSparkles,
                text: "Summarization",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 backdrop-blur-xl transition-all hover:border-purple-400/15 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/[0.08]">
                      <Icon
                        size={15}
                        className="text-purple-300/70"
                      />
                    </div>

                    <Sparkles
                      size={12}
                      className="text-white/10 transition group-hover:text-purple-300/30"
                    />
                  </div>

                  <div className="mt-4 text-2xl font-black">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/25">
                    {stat.label}
                  </div>

                  <div className="mt-2 text-[10px] text-white/15">
                    {stat.text}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI ASSISTANT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="group relative mt-5 overflow-hidden rounded-[2rem] border border-purple-400/10 bg-gradient-to-br from-purple-500/[0.08] via-white/[0.025] to-cyan-500/[0.04] p-6 backdrop-blur-2xl sm:p-8"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/[0.1]">
                    <WandSparkles
                      size={18}
                      className="text-purple-200"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-300/60">
                      Champion AI
                    </p>

                    <p className="text-xs text-white/30">
                      Your personal writing assistant
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Turn long notes into
                  <span className="text-gradient">
                    {" "}clear ideas.
                  </span>
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/30">
                  Select a note and let the AI assistant identify
                  the key ideas, remove unnecessary detail and
                  give you a concise summary.
                </p>
              </div>

              <div className="shrink-0">
                <LiquidButton
                  onClick={() => openAI()}
                  className="px-6 py-3.5"
                >
                  <WandSparkles size={16} />
                  Summarize a Note
                  <ArrowRight size={15} />
                </LiquidButton>
              </div>

            </div>
          </motion.div>

          {/* NOTES HEADER */}
          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                Library
              </p>

              <h3 className="mt-1 text-2xl font-black">
                Recent Notes
              </h3>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your notes..."
                className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/20 focus:bg-white/[0.04]"
              />
            </div>
          </div>

          {/* NOTES GRID */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {filteredNotes.map((note, index) => (
              <motion.a
                key={note.id}
                href={`/note/${note.id}`}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -7,
                }}
                onMouseEnter={() =>
                  setHoveredNote(note.id)
                }
                onMouseLeave={() =>
                  setHoveredNote(null)
                }
                className="group relative flex min-h-[225px] flex-col overflow-hidden rounded-[1.7rem] border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-all duration-500 hover:border-purple-400/20 hover:bg-white/[0.045] hover:shadow-[0_25px_80px_rgba(0,0,0,.35)]"
              >
                <motion.div
                  animate={{
                    opacity:
                      hoveredNote === note.id ? 1 : 0,
                  }}
                  className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-purple-500/15 blur-[90px]"
                />

                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="relative z-10 flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-500/[0.08]">
                    <FileText
                      size={17}
                      className="text-purple-200"
                    />
                  </div>

                  <div className="flex items-center gap-1">

                    <motion.button
                      whileHover={{
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.92,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openAI(note);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 opacity-0 transition hover:bg-purple-500/10 hover:text-purple-300 group-hover:opacity-100"
                      aria-label="Summarize note"
                    >
                      <WandSparkles size={14} />
                    </motion.button>

                    <motion.button
                      whileHover={{
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.92,
                      }}
                      onClick={(e) =>
                        handleDelete(note.id, e)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      aria-label="Delete note"
                    >
                      <Trash2 size={14} />
                    </motion.button>

                  </div>
                </div>

                <div className="relative z-10 mt-6">

                  <h4 className="truncate text-base font-bold text-white/90">
                    {note.title || "Untitled Note"}
                  </h4>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/30">
                    {note.content ||
                      "Empty note — start writing something meaningful."}
                  </p>
                </div>

                <div className="relative z-10 mt-auto flex items-center justify-between pt-7">

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    {new Date(
                      note.updatedAt
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-300/40 transition group-hover:text-purple-300/70">
                    Open
                    <ChevronRight size={12} />
                  </div>

                </div>
              </motion.a>
            ))}

          </div>

          {/* EMPTY STATE */}
          {mounted && notes.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.025] px-6 py-20 text-center backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/[0.07] blur-[110px]" />

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-purple-400/10 bg-purple-500/[0.08] shadow-[0_0_50px_rgba(124,58,237,.12)]"
              >
                <BrainCircuit
                  size={30}
                  className="text-purple-200/80"
                />
              </motion.div>

              <h3 className="relative mt-7 text-2xl font-black">
                Your workspace starts here.
              </h3>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
                Create a note, write naturally and let Champion
                Assistant help you understand it faster.
              </p>

              <div className="relative mt-8">
                <LiquidButton
                  onClick={handleCreate}
                  className="px-7 py-3.5"
                >
                  <Plus size={17} />
                  Create First Note
                </LiquidButton>
              </div>
            </motion.div>
          )}

          {mounted &&
            notes.length > 0 &&
            filteredNotes.length === 0 && (
              <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
                <Search
                  size={24}
                  className="mx-auto text-white/15"
                />

                <p className="mt-3 text-sm text-white/30">
                  No notes match your search.
                </p>
              </div>
            )}
        </section>

        {/* BOTTOM FEATURE STRIP */}
        <section className="mt-24 grid grid-cols-1 gap-4 md:grid-cols-3">

          {[
            {
              icon: WandSparkles,
              title: "AI Summaries",
              text: "Understand long notes in seconds.",
            },
            {
              icon: Zap,
              title: "Automatic Totals",
              text: "Numbers are detected and calculated automatically.",
            },
            {
              icon: ShieldCheck,
              title: "Private by Design",
              text: "Your notes stay on your device.",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -4,
                }}
                className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 transition hover:border-white/[0.1] hover:bg-white/[0.035]"
              >
                <Icon
                  size={18}
                  className="text-purple-300/60"
                />

                <h4 className="mt-5 text-sm font-bold text-white/70">
                  {feature.title}
                </h4>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  {feature.text}
                </p>
              </motion.div>
            );
          })}
        </section>

        {/* FOOTER */}
        <footer className="mt-28 border-t border-white/[0.05] py-10">

          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                <BrainCircuit
                  size={16}
                  className="text-purple-300"
                />
              </div>

              <div>
                <p className="text-xs font-bold">
                  Champion Assistant
                </p>

                <p className="text-[9px] text-white/20">
                  Think smarter. Write better.
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/15">
                Designed & Developed by
              </p>

              <motion.p
                animate={{
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mt-1 bg-[length:200%_auto] bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-lg font-black tracking-[0.1em] text-transparent"
              >
                ABDUL MATEEN
              </motion.p>
            </div>

          </div>

          <p className="mt-8 text-center text-[9px] text-white/10">
            © {new Date().getFullYear()} Champion Assistant. Built with
            Next.js, TypeScript & Framer Motion.
          </p>
        </footer>
      </div>

      {/* AI MODAL */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAiOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-purple-400/10 bg-[#090914]/95 p-6 shadow-[0_40px_120px_rgba(0,0,0,.7)] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

              <div className="relative flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-500/[0.08]">
                    <WandSparkles
                      size={19}
                      className="text-purple-200"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-300/50">
                      Champion AI
                    </p>

                    <h3 className="mt-1 text-xl font-black">
                      Note Summarizer
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setAiOpen(false)}
                  className="rounded-lg px-2 py-1 text-lg text-white/20 transition hover:bg-white/[0.05] hover:text-white/60"
                >
                  ×
                </button>
              </div>

              <div className="relative mt-7">

                {notes.length > 0 ? (
                  <>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
                      Select a note
                    </label>

                    <select
                      value={selectedNote?.id || ""}
                      onChange={(e) => {
                        const note = notes.find(
                          (item) => item.id === e.target.value
                        );

                        setSelectedNote(note || null);
                      }}
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 text-sm text-white outline-none focus:border-purple-400/20"
                    >
                      {notes.map((note) => (
                        <option
                          key={note.id}
                          value={note.id}
                          className="bg-[#090914]"
                        >
                          {note.title || "Untitled Note"}
                        </option>
                      ))}
                    </select>

                    <div className="mt-4 rounded-2xl border border-purple-400/10 bg-purple-500/[0.04] p-5">

                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={14}
                          className="text-purple-300"
                        />

                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200/50">
                          Summary
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-white/50">
                        {createDemoSummary(selectedNote)}
                      </p>
                    </div>

                    <p className="mt-4 text-center text-[10px] text-white/20">
                      AI interface ready — connect your preferred
                      AI API for production summaries.
                    </p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-10 text-center">

                    <FileText
                      size={28}
                      className="mx-auto text-white/15"
                    />

                    <p className="mt-4 text-sm text-white/40">
                      Create a note first.
                    </p>

                    <button
                      onClick={() => {
                        setAiOpen(false);
                        handleCreate();
                      }}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/20"
                    >
                      <Plus size={14} />
                      Create Note
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}