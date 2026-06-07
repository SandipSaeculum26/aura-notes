"use client";
import { useEffect, useState } from "react";
import { Edit, Pin, Trash2, AlertCircle, Loader2 } from "lucide-react";

type Note = {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function NotesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [activeMenuNoteId, setActiveMenuNoteId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const response = await fetch(`${API_URL}/notes`);
    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }
    const data = await response.json();

    setNotes(data);
  };

  const openCreateModal = () => {
    setEditingNoteId(null);
    setTitle("");
    setContent("");
    setError("");
    setActiveMenuNoteId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setError("");
    setActiveMenuNoteId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNoteId(null);
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and description are required.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingNoteId) {
        setActionLoadingId(editingNoteId);
        const existingNote = notes.find((note) => note._id === editingNoteId);
        const response = await fetch(`${API_URL}/notes/${editingNoteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            isPinned: existingNote?.isPinned ?? false,
          }),
        });

        if (!response.ok) {
          setError("Failed to update note.");
          return;
        }

        const updatedNote = await response.json();
        setNotes((prevNotes) => prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));
        closeModal();
        return;
      }

      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        setError("Failed to create note.");
        return;
      }

      const createdNote = await response.json();
      setNotes((prevNotes) => [createdNote, ...prevNotes]);
      closeModal();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
      setActionLoadingId(null);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setActionLoadingId(noteId);
    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      setActiveMenuNoteId(null);
      setDeleteConfirmId(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePin = async (note: Note) => {
    setActionLoadingId(note._id);
    try {
      const response = await fetch(`${API_URL}/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          isPinned: !note.isPinned,
        }),
      });

      if (!response.ok) {
        return;
      }

      const updatedNote = await response.json();
      setNotes((prevNotes) => prevNotes.map((item) => (item._id === updatedNote._id ? updatedNote : item)));
      setActiveMenuNoteId(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (date: string) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

console.log(formatDate(new Date().toISOString()));

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Notes</h1>
          <p className="mt-2 text-base md:text-sm text-slate-600">
            Capture ideas, reminders, and quick thoughts in one place.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-[#2592d1] px-4 sm:px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d6fa3]"
          onClick={openCreateModal}
        >
          Create Note
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg sm:max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white/95 p-5 sm:p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <div className="text-2xl font-semibold text-slate-900">
                  {editingNoteId ? "Edit Note" : "New Note"}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {editingNoteId ? "Update your note details." : "Add a title and description to save your note."}
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                onClick={closeModal}
              >
                Close
              </button>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2592d1] focus:ring-2 focus:ring-[#2592d1]/20"
                  placeholder="Enter note title"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Description
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2592d1] focus:ring-2 focus:ring-[#2592d1]/20"
                  placeholder="Enter note description"
                />
              </label>

              {error && (
                <div className="rounded-2xl bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c] ring-1 ring-[#fca5a5]/30">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={`w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`w-full sm:w-auto rounded-2xl bg-[#2592d1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d6fa3] ${isSaving || (editingNoteId ? actionLoadingId === editingNoteId : false) ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={handleSaveNote}
                  disabled={isSaving || (editingNoteId ? actionLoadingId === editingNoteId : false)}
                >
                  {(isSaving || (editingNoteId ? actionLoadingId === editingNoteId : false)) && (
                    <Loader2 className="-ml-1 mr-2 inline-block h-4 w-4 animate-spin" />
                  )}
                  {editingNoteId ? (isSaving ? "Updating..." : "Update Note") : isSaving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                <AlertCircle className="h-5 w-5 text-rose-600 md:h-6 md:w-6" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-slate-900">Delete note?</div>
                <div className="mt-1 text-sm text-slate-600">
                  This action cannot be undone. The note will be permanently deleted.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className={`rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${actionLoadingId === deleteConfirmId ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => setDeleteConfirmId(null)}
                disabled={actionLoadingId === deleteConfirmId}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 ${actionLoadingId === deleteConfirmId ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => handleDeleteNote(deleteConfirmId)}
                disabled={actionLoadingId === deleteConfirmId}
              >
                {actionLoadingId === deleteConfirmId ? (
                  <Loader2 className="-ml-1 mr-2 inline-block h-4 w-4 animate-spin" />
                ) : null}
                {actionLoadingId === deleteConfirmId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note._id}
            className="rounded-md border border-slate-200 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-200 "
          >
            <div className="flex flex-col">

            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg md:text-xl font-semibold text-slate-900">{note.title}</div>
                <div className="mt-2 text-sm md:leading-6 text-slate-600">{note.content}</div>
              </div>

              <div className="relative flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    note.isPinned ? "bg-[#2592d1]/10 text-[#1d6fa3]" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {note.isPinned ? "Pinned" : "Note"}
                </span>
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-slate-100 transition"
                  onClick={() => setActiveMenuNoteId(note._id === activeMenuNoteId ? null : note._id)}
                  aria-label="Open note actions"
                >
                  ⋯
                </button>

                {activeMenuNoteId === note._id && (
                  <div className="absolute right-0 top-8 z-50 w-36 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl ring-1 ring-slate-200">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      onClick={() => openEditModal(note)}
                      disabled={actionLoadingId === note._id}
                    >
                      {actionLoadingId === note._id ? (
                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                      Edit
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      onClick={() => handleTogglePin(note)}
                      disabled={actionLoadingId === note._id}
                    >
                      {actionLoadingId === note._id ? (
                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                      ) : (
                        <Pin className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                      {note.isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-slate-50"
                      onClick={() => {
                        setDeleteConfirmId(note._id);
                        setActiveMenuNoteId(null);
                      }}
                      disabled={actionLoadingId === note._id}
                    >
                      <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-slate-500 mt-4">
              <div>{formatDate(note.createdAt)}</div>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}