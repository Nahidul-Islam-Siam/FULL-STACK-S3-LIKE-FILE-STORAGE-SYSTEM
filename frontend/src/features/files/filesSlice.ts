import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as fileApi from "@/api/fileApi";

export type FileCategory = "images" | "videos" | "documents";

export type StoredFile = {
  id: string;
  originalName: string;
  fileName: string;
  fileKey: string;
  url: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  createdAt: string;
};

type FilesState = {
  items: StoredFile[];
  loading: boolean;
  uploading: boolean;
  deletingId: string | null;
  error: string | null;
};

const initialState: FilesState = {
  items: [],
  loading: false,
  uploading: false,
  deletingId: null,
  error: null
};

export const loadFiles = createAsyncThunk("files/load", fileApi.fetchFiles);
export const uploadSelectedFile = createAsyncThunk("files/upload", fileApi.uploadFile);
export const deleteStoredFile = createAsyncThunk("files/delete", async (file: StoredFile) => {
  await fileApi.deleteFile(file);
  return file.id;
});

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Could not load files.";
      })
      .addCase(uploadSelectedFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadSelectedFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.unshift(action.payload);
      })
      .addCase(uploadSelectedFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message || "Upload failed.";
      })
      .addCase(deleteStoredFile.pending, (state, action) => {
        state.deletingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(deleteStoredFile.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter((file) => file.id !== action.payload);
      })
      .addCase(deleteStoredFile.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.error.message || "Delete failed.";
      });
  }
});

export const { clearError } = filesSlice.actions;
export default filesSlice.reducer;
