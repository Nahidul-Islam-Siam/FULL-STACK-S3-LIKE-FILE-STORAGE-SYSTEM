"use client";

import { FileCard } from "./FileCard";
import { useAppSelector } from "@/store/hooks";

export function FileGallery() {
  const { items, loading } = useAppSelector((state) => state.files);

  return (
    <section className="gallerySection">
      <div className="sectionHeader">
        <h2>File Gallery</h2>
        <span>{loading ? "Loading..." : `${items.length} files`}</span>
      </div>

      {items.length === 0 && !loading ? (
        <div className="emptyState">No files uploaded yet.</div>
      ) : (
        <div className="galleryGrid">
          {items.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </section>
  );
}
