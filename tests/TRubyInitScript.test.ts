import { describe, it, expect } from "vitest";
import { generateInitScript } from "../src/vm/TRubyInitScript.js";

describe("TRubyInitScript", () => {
  describe("generateInitScript", () => {
    it("should generate script with TRuby module and WASM_ENV flag", () => {
      const script = generateInitScript();
      expect(script).toContain("module TRuby");
      expect(script).toContain("WASM_ENV = true");
    });

    it("should include Net::HTTP stub for WASM environment", () => {
      const script = generateInitScript();
      expect(script).toContain("module Net");
      expect(script).toContain("class HTTP");
      expect(script).toContain("HTTPSuccess = Class.new");
      expect(script).toContain("HTTPNotFound = Class.new");
    });

    it("should include OpenSSL stub", () => {
      const script = generateInitScript();
      expect(script).toContain("module OpenSSL");
      expect(script).toContain("VERIFY_PEER = 0");
    });

    it("should include FileUtils stub", () => {
      const script = generateInitScript();
      expect(script).toContain("module FileUtils");
      expect(script).toContain("def self.mkdir_p");
    });

    it("should use heredoc for file loading to avoid escape issues", () => {
      const script = generateInitScript();
      // Heredoc delimiter pattern: __T_RUBY_CODE_N__
      expect(script).toMatch(/<<~'__T_RUBY_CODE_\d+__'/);
    });

    it("should require json at the end", () => {
      const script = generateInitScript();
      expect(script).toContain("require 'json'");
    });

    it("should not contain double-quoted eval strings (old escape method)", () => {
      const script = generateInitScript();
      // Old pattern: eval("escaped content", binding, 'path')
      // Should not exist anymore since we use heredoc
      expect(script).not.toMatch(/eval\("[^"]*\\n[^"]*", binding/);
    });
  });
});
