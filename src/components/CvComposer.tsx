"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowUp, FileText, Paperclip, X } from "lucide-react";

const DEFAULT_ACCEPT = ".pdf,.docx,.txt";

function hasAcceptedExtension(file: File, accept: string) {
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .some((entry) => (entry.startsWith(".") ? name.endsWith(entry) : file.type === entry));
}

export interface CvComposerProps {
  text: string;
  onTextChange: (value: string) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  onSubmit: () => void;
  placeholder: string;
  attachLabel: string;
  sendLabel: string;
  note?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  submitDisabled?: boolean;
  rows?: number;
  children?: ReactNode;
  id?: string;
}

export default function CvComposer({
  text,
  onTextChange,
  files,
  onFilesChange,
  onSubmit,
  placeholder,
  attachLabel,
  sendLabel,
  note,
  accept = DEFAULT_ACCEPT,
  multiple = false,
  maxFiles = 1,
  submitDisabled = false,
  rows = 3,
  children,
  id,
}: CvComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter((file) => hasAcceptedExtension(file, accept));
    if (valid.length === 0) return;
    const next = multiple
      ? [...files, ...valid].slice(0, maxFiles)
      : [valid[0]];
    onFilesChange(next);
  };

  const removeFile = (name: string) => {
    onFilesChange(files.filter((file) => file.name !== name));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer?.files || []));
  };

  const handleDragLeave = (event: React.DragEvent<HTMLFormElement>) => {
    if (event.target === event.currentTarget) setIsDragging(false);
  };

  const disabled = submitDisabled || (!text.trim() && files.length === 0);

  return (
    <form
      id={id}
      onSubmit={(event) => {
        event.preventDefault();
        if (disabled) return;
        onSubmit();
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`glass-card rounded-3xl p-3 sm:p-4 text-left shadow-2xl shadow-black/40 border transition-all ${isDragging
        ? "border-fuchsia-400/70 bg-fuchsia-500/[0.07]"
        : "border-white/10"
        }`}
    >
      <textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-label={placeholder}
        className="w-full min-h-28 rounded-2xl bg-black/25 border border-transparent px-4 py-3 text-left text-white placeholder:text-zinc-500 outline-none resize-none text-sm sm:text-base"
      />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 pt-2">
          {files.map((file) => (
            <span
              key={`${file.name}-${file.size}`}
              className="inline-flex items-center gap-1.5 max-w-full rounded-full bg-indigo-500/15 border border-indigo-500/30 pl-2.5 pr-1.5 py-1 text-xs text-indigo-200"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-[220px]">{file.name}</span>
              <span className="text-indigo-300/70">
                {Math.max(1, Math.round(file.size / 1024))} KB
              </span>
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                aria-label={`Rimuovi ${file.name}`}
                className="rounded-full p-0.5 hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-1 pt-2.5 flex-wrap">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/25 transition-all"
        >
          <Paperclip className="w-4 h-4" />
          <span className="hidden sm:inline">{attachLabel}</span>
        </button>

        {children}

        <div className="flex-1" />

        <button
          type="submit"
          disabled={disabled}
          aria-label={sendLabel}
          className="flex items-center justify-center w-10 h-10 rounded-full btn-primary text-white glow-border transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
      />

      {note && <p className="text-zinc-500 text-xs text-left mt-2 px-1">{note}</p>}
    </form>
  );
}
