"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { uploadSelectedFile } from "@/features/files/filesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function UploadBox() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploading = useAppSelector((state) => state.files.uploading);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] || null);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    setSelectedFile(event.dataTransfer.files?.[0] || null);
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    await dispatch(uploadSelectedFile(selectedFile));
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section
      className={`uploadPanel ${isDragging ? "dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div>
        <h2>Upload File</h2>
        <p>Images, videos, PDFs, Word, and Excel files are accepted.</p>
      </div>

      <div className="uploadActions">
        <label className="filePicker">
          <input ref={inputRef} type="file" onChange={handleFileChange} />
          Choose File
        </label>
        <button type="button" disabled={!selectedFile || uploading} onClick={handleUpload}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {selectedFile ? (
        <div className="selectedFile">
          <span>{selectedFile.name}</span>
          <small>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
        </div>
      ) : (
        <div className="dropHint">Drag and drop a file here</div>
      )}
    </section>
  );
}
