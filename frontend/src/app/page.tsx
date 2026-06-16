"use client";

import { useEffect } from "react";
import { FileGallery } from "@/components/FileGallery";
import { UploadBox } from "@/components/UploadBox";
import { loadFiles } from "@/features/files/filesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Home() {
  const dispatch = useAppDispatch();
  const { error, items } = useAppSelector((state) => state.files);

  useEffect(() => {
    void dispatch(loadFiles());
  }, [dispatch]);

  return (
    <main className="dashboard">
      <header className="dashboardHeader">
        <div>
          <p className="eyebrow">Local object storage</p>
          <h1>File Storage Dashboard</h1>
        </div>
        <div className="stats">
          <span>{items.length}</span>
          <small>stored files</small>
        </div>
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <UploadBox />
      <FileGallery />
    </main>
  );
}
