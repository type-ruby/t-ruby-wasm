import type { VirtualFile } from "./types/VirtualFile.js";

/**
 * In-memory file system for managing T-Ruby source files
 *
 * @remarks
 * Provides a virtual file system for browser environments where
 * there's no access to the real file system. Useful for multi-file
 * T-Ruby projects in playgrounds and online editors.
 *
 * @example
 * ```typescript
 * const vfs = new VirtualFileSystem();
 * vfs.addFile("lib/utils.trb", "def helper: Integer\n  42\nend");
 * ```
 */
export class VirtualFileSystem {
  private files: Map<string, string> = new Map();

  /** Add a file to the virtual file system */
  addFile(path: string, content: string): void {
    this.files.set(path, content);
  }

  /** Add multiple files at once */
  addFiles(files: VirtualFile[]): void {
    for (const file of files) {
      this.addFile(file.path, file.content);
    }
  }

  /** Get file content by path */
  getFile(path: string): string | undefined {
    return this.files.get(path);
  }

  /** Check if a file exists */
  hasFile(path: string): boolean {
    return this.files.has(path);
  }

  /** Remove a file from the virtual file system */
  removeFile(path: string): boolean {
    return this.files.delete(path);
  }

  /** Get all files as a Map */
  getAllFiles(): Map<string, string> {
    return new Map(this.files);
  }

  /** Clear all files from the virtual file system */
  clear(): void {
    this.files.clear();
  }

  /** Get the number of files in the virtual file system */
  get size(): number {
    return this.files.size;
  }
}
