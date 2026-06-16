import type { StoredFile } from "@/features/files/filesSlice";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchFiles(): Promise<StoredFile[]> {
  const response = await fetch(`${apiBaseUrl}/files`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load files.");
  }

  const data = (await response.json()) as { files: StoredFile[] };
  return data.files;
}

export async function uploadFile(file: File): Promise<StoredFile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBaseUrl}/files/upload`, {
    method: "POST",
    body: formData
  });

  const data = (await response.json()) as { file?: StoredFile; message?: string };

  if (!response.ok || !data.file) {
    throw new Error(data.message || "Upload failed.");
  }

  return data.file;
}

export async function deleteFile(file: StoredFile): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/files/${file.category}/${encodeURIComponent(file.fileName)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message || "Delete failed.");
  }
}
