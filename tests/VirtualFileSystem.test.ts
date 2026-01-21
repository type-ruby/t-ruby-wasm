import { describe, it, expect, beforeEach } from "vitest";
import { VirtualFileSystem } from "../src/VirtualFileSystem.js";

describe("VirtualFileSystem", () => {
  let vfs: VirtualFileSystem;

  beforeEach(() => {
    vfs = new VirtualFileSystem();
  });

  describe("addFile", () => {
    it("should add a file", () => {
      vfs.addFile("test.trb", "content");
      expect(vfs.getFile("test.trb")).toBe("content");
    });

    it("should overwrite existing file", () => {
      vfs.addFile("test.trb", "old");
      vfs.addFile("test.trb", "new");
      expect(vfs.getFile("test.trb")).toBe("new");
    });
  });

  describe("addFiles", () => {
    it("should add multiple files", () => {
      vfs.addFiles([
        { path: "a.trb", content: "a" },
        { path: "b.trb", content: "b" },
      ]);
      expect(vfs.size).toBe(2);
    });
  });

  describe("hasFile", () => {
    it("should return true for existing file", () => {
      vfs.addFile("test.trb", "content");
      expect(vfs.hasFile("test.trb")).toBe(true);
    });

    it("should return false for non-existing file", () => {
      expect(vfs.hasFile("missing.trb")).toBe(false);
    });
  });

  describe("removeFile", () => {
    it("should remove a file and return true", () => {
      vfs.addFile("test.trb", "content");
      expect(vfs.removeFile("test.trb")).toBe(true);
      expect(vfs.hasFile("test.trb")).toBe(false);
    });

    it("should return false for non-existing file", () => {
      expect(vfs.removeFile("missing.trb")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should remove all files", () => {
      vfs.addFiles([
        { path: "a.trb", content: "a" },
        { path: "b.trb", content: "b" },
      ]);
      vfs.clear();
      expect(vfs.size).toBe(0);
    });
  });

  describe("getAllFiles", () => {
    it("should return a copy of all files", () => {
      vfs.addFile("test.trb", "content");
      const files = vfs.getAllFiles();

      files.set("new.trb", "new");
      expect(vfs.hasFile("new.trb")).toBe(false);
    });
  });
});
