"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Trash2,
  Check,
  Calculator,
  Copy,
  Lock,
  Save,
  ChevronDown,
} from "lucide-react";
import GlowOrbs from "@/components/GlowOrbs";
import LiquidButton from "@/components/LiquidButton";
import {
  Note,
  getNote,
  saveNote,
  deleteNote,
  isOwned,
  addOwnedId,
  createId,
  encodeShareData,
  decodeShareData,
} from "@/lib/storage";
import { parseTotals, formatNumber } from "@/lib/totals";

export default function NotePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Load note: prefer a shared URL payload (?d=) if present & not owned,
  // otherwise load from localStorage. Falls back to a fresh empty note.
  useEffect(() => {
    const sharedParam = searchParams.get("d");
    const owned = isOwned(id);

    if (sharedParam && !owned) {
      const decoded = decodeShareData(sharedParam);
      if (decoded) {
        setTitle(decoded.title);
        setContent(decoded.content);
        setReadOnly(true);
        setLoaded(true);
        return;
      }
    }

    const existing = getNote(id);
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setReadOnly(!owned);
    } else if (owned) {
      // Owned id but no data (shouldn't normally happen) — start fresh.
      setTitle("Untitled Note");
      setContent("");
      setReadOnly(false);
    } else if (sharedParam) {
      setReadOnly(true);
    } else {
      // Nobody owns this and nothing shared: treat as a new local note.
      const now = Date.now();
      saveNote({ id, title: "Untitled Note", content: "", createdAt: now, updatedAt: now });
      addOwnedId(id);
      setTitle("Untitled Note");
      setContent("");
      setReadOnly(false);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-save (debounced) whenever title/content changes, only if owned/editable.
  useEffect(() => {
    if (!loaded || readOnly) return;
    setSaving(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const existing = getNote(id);
      saveNote({
        id,
        title: title || "Untitled Note",
        content,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      });
      setSaving(false);
    }, 400);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [title, content, loaded, readOnly, id]);

  const totals = useMemo(() => parseTotals(content), [content]);
  const grandTotal = useMemo(
    () => totals.reduce((sum, t) => sum + t.total, 0),
    [totals]
  );

  async function handleShare() {
    const encoded = encodeShareData(title, content);
    const url = `${window.location.origin}/note/${id}?d=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  function handleClear() {
    setContent("");
    setShowClearConfirm(false);
  }

  function handleDeleteNote() {
    deleteNote(id);
    router.push("/");
  }

  function handleSaveAsMine() {
    const newId = createId();
    const now = Date.now();
    saveNote({
      id: newId,
      title: title || "Untitled Note",
      content,
      createdAt: now,
      updatedAt: now,
    });
    addOwnedId(newId);
    router.push(`/note/${newId}`);
  }

  if (!loaded) {
    return (
      <main className="relative flex min-h-screen items-center justify-center">
        <GlowOrbs />
        <div className="text-white/40">Loading...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full pb-20">
      <GlowOrbs />

      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-[#05050f]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/30">
            {!readOnly && (
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Save size={12} className="animate-pulse" /> Saving...
                  </motion.span>
                ) : (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check size={12} className="text-emerald-400" /> Saved
                  </motion.span>
                )}
              </AnimatePresence>
            )}
            {readOnly && (
              <span className="flex items-center gap-1 rounded-full glass px-3 py-1">
                <Lock size={12} /> Read-only
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LiquidButton variant="secondary" onClick={handleShare} className="px-4 py-2 text-xs">
              {copied ? <Check size={15} /> : <Share2 size={15} />}
              <span className="hidden sm:inline">
                {copied ? "Copied!" : "Share"}
              </span>
            </LiquidButton>

            {!readOnly && (
              <LiquidButton
                variant="danger"
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 text-xs"
              >
                <Trash2 size={15} />
                <span className="hidden sm:inline">Clear</span>
              </LiquidButton>
            )}
          </div>
        </div>
      </div>

      {readOnly && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 max-w-6xl px-4 sm:px-6"
        >
          <div className="glass flex flex-col items-start justify-between gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-white/60">
              You're viewing a shared note. It's locked so the original owner's
              copy stays safe — save your own editable copy to make changes.
            </p>
            <LiquidButton onClick={handleSaveAsMine} className="whitespace-nowrap px-4 py-2 text-xs">
              <Copy size={14} />
              Save as My Note
            </LiquidButton>
          </div>
        </motion.div>
      )}

      {/* Editor + Totals */}
      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_320px]">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong flex min-h-[60vh] flex-col rounded-3xl p-6 sm:p-8"
        >
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={readOnly}
            placeholder="Untitled Note"
            rows={1}
            className="mb-4 w-full resize-none overflow-hidden bg-transparent text-2xl font-bold tracking-tight text-white placeholder-white/20 outline-none sm:text-3xl"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />
          <div className="mb-4 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={readOnly}
            placeholder={`Start writing...\n\nA PROJECT BY CHAUDHARY ABDUL MATEEN`}
            className="min-h-[45vh] w-full flex-1 resize-none bg-transparent text-base leading-relaxed text-white/90 placeholder-white/20 outline-none"
          />
        </motion.div>

        {/* Totals Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-strong h-fit rounded-3xl p-6 lg:sticky lg:top-24"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl liquid-bg">
              <Calculator size={15} className="text-white" />
            </div>
            <h2 className="font-semibold text-white">Auto Totals</h2>
          </div>

          <AnimatePresence mode="popLayout">
            {totals.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center"
              >
                <p className="text-sm text-white/30">
                  Write lines like{" "}
                  <span className="text-purple-300">"Cement 50"</span> to see
                  live totals here.
                </p>
              </motion.div>
            ) : (
              <motion.div key="list" className="flex flex-col gap-2">
                {totals.map((item, i) => {
                  const key = item.label.toLowerCase();
                  const isOpen = expandedLabel === key;
                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="rounded-xl glass overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedLabel(isOpen ? null : key)
                        }
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium capitalize text-white/90">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-white/30">
                            {item.count}{" "}
                            {item.count === 1 ? "entry" : "entries"}
                          </p>
                        </div>
                        <div className="ml-2 flex shrink-0 items-center gap-2">
                          <span className="text-sm font-bold text-gradient">
                            {formatNumber(item.total)}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-white/30 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-4"
                          >
                            <div className="flex flex-col gap-1.5 border-t border-white/5 py-3">
                              {item.entries.map((entry, idx) => (
                                <div
                                  key={`${entry.lineIndex}-${idx}`}
                                  className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs"
                                >
                                  <span className="truncate text-white/50">
                                    {entry.raw}
                                  </span>
                                  <span className="ml-2 shrink-0 font-semibold text-white/80">
                                    {formatNumber(entry.value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                <div className="mt-2 flex items-center justify-between rounded-xl liquid-bg px-4 py-3">
                  <span className="text-sm font-semibold text-white">
                    Grand Total
                  </span>
                  <span className="text-base font-bold text-white">
                    {formatNumber(grandTotal)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Clear confirm modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-sm rounded-3xl p-6"
            >
              <h3 className="mb-2 text-lg font-semibold text-white">
                Clear this note?
              </h3>
              <p className="mb-6 text-sm text-white/50">
                This wipes the text in this note. This can't be undone.
              </p>
              <div className="flex justify-end gap-3">
                <LiquidButton
                  variant="ghost"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-xs"
                >
                  Cancel
                </LiquidButton>
                <LiquidButton
                  variant="danger"
                  onClick={handleClear}
                  className="px-4 py-2 text-xs"
                >
                  <Trash2 size={14} />
                  Clear it
                </LiquidButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer credit */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-1 px-4 pb-4 sm:px-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
          Developed by
        </p>
        <p className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-sm font-extrabold tracking-wide text-transparent">
          ABDUL MATEEN
        </p>
      </div>
    </main>
  );
}
