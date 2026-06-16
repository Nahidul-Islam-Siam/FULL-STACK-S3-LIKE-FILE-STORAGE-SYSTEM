"use client";

import { useState } from "react";
import { deleteStoredFile, StoredFile } from "@/features/files/filesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function formatBytes(size: number): string {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function FileCard({ file }: { file: StoredFile }) {
  const dispatch = useAppDispatch();
  const deletingId = useAppSelector((state) => state.files.deletingId);
  const [copied, setCopied] = useState(false);
  const isDeleting = deletingId === file.id;

  async function handleCopy() {
    await navigator.clipboard.writeText(file.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function handleDelete() {
    void dispatch(deleteStoredFile(file));
  }

  return (
    <article className="fileCard">
      <div className="preview">
        {file.category === "images" ? <img src={file.url} alt={file.originalName} /> : null}
        {file.category === "videos" ? <video src={file.url} controls /> : null}
        {file.category === "documents" ? <div className="documentPreview">{file.fileName.split(".").pop()}</div> : null}
      </div>

      <div className="fileMeta">
        <h3 title={file.originalName}>{file.originalName}</h3>
        <span>{formatBytes(file.size)}</span>
      </div>

      <div className="fileActions">
        <button type="button" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className="danger" disabled={isDeleting} onClick={handleDelete}>
          {isDeleting ? "Deleting" : "Delete"}
        </button>
      </div>
    </article>
  );
}
