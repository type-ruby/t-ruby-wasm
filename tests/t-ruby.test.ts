import { describe, it, expect } from "vitest";
import { TRuby } from "../src/TRuby.js";

describe("TRuby", () => {
  describe("constructor", () => {
    it("should create an instance with default options", () => {
      const tRuby = new TRuby();
      expect(tRuby).toBeInstanceOf(TRuby);
      expect(tRuby.isInitialized()).toBe(false);
    });

    it("should create an instance with custom options", () => {
      const tRuby = new TRuby({ debug: true });
      expect(tRuby).toBeInstanceOf(TRuby);
    });
  });

  describe("virtual file system", () => {
    it("should add and retrieve files", () => {
      const tRuby = new TRuby();
      tRuby.addFile("test.trb", "def foo: Integer\n  42\nend");

      const files = tRuby.getFiles();
      expect(files.size).toBe(1);
      expect(files.get("test.trb")).toBe("def foo: Integer\n  42\nend");
    });

    it("should add multiple files at once", () => {
      const tRuby = new TRuby();
      tRuby.addFiles([
        { path: "a.trb", content: "# file a" },
        { path: "b.trb", content: "# file b" },
      ]);

      expect(tRuby.getFiles().size).toBe(2);
    });

    it("should remove files", () => {
      const tRuby = new TRuby();
      tRuby.addFile("test.trb", "content");
      expect(tRuby.getFiles().size).toBe(1);

      tRuby.removeFile("test.trb");
      expect(tRuby.getFiles().size).toBe(0);
    });

    it("should clear all files", () => {
      const tRuby = new TRuby();
      tRuby.addFiles([
        { path: "a.trb", content: "a" },
        { path: "b.trb", content: "b" },
      ]);

      tRuby.clearFiles();
      expect(tRuby.getFiles().size).toBe(0);
    });
  });

  describe("uninitialized state", () => {
    it("should throw when compile called before initialize", async () => {
      const tRuby = new TRuby();
      await expect(tRuby.compile("def foo: Integer\n  42\nend")).rejects.toThrow(
        "T-Ruby WASM not initialized"
      );
    });

    it("should throw when typeCheck called before initialize", async () => {
      const tRuby = new TRuby();
      await expect(tRuby.typeCheck("def foo: Integer\n  42\nend")).rejects.toThrow(
        "T-Ruby WASM not initialized"
      );
    });

    it("should throw when eval called before initialize", async () => {
      const tRuby = new TRuby();
      await expect(tRuby.eval("1 + 1")).rejects.toThrow(
        "T-Ruby WASM not initialized"
      );
    });

    it("should throw when getVersion called before initialize", async () => {
      const tRuby = new TRuby();
      await expect(tRuby.getVersion()).rejects.toThrow(
        "T-Ruby WASM not initialized"
      );
    });
  });
});
