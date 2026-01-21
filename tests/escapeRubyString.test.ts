import { describe, it, expect } from "vitest";
import { escapeRubyString } from "../src/utils/escapeRubyString.js";

describe("escapeRubyString", () => {
  it("should wrap string in double quotes", () => {
    expect(escapeRubyString("hello")).toBe('"hello"');
  });

  it("should escape backslashes", () => {
    expect(escapeRubyString("a\\b")).toBe('"a\\\\b"');
  });

  it("should escape double quotes", () => {
    expect(escapeRubyString('say "hi"')).toBe('"say \\"hi\\""');
  });

  it("should escape newlines", () => {
    expect(escapeRubyString("line1\nline2")).toBe('"line1\\nline2"');
  });

  it("should escape carriage returns", () => {
    expect(escapeRubyString("line1\rline2")).toBe('"line1\\rline2"');
  });

  it("should escape tabs", () => {
    expect(escapeRubyString("col1\tcol2")).toBe('"col1\\tcol2"');
  });

  it("should handle multiple escape sequences", () => {
    const input = 'Hello\n"World"\t\\End';
    const expected = '"Hello\\n\\"World\\"\\t\\\\End"';
    expect(escapeRubyString(input)).toBe(expected);
  });

  it("should handle empty string", () => {
    expect(escapeRubyString("")).toBe('""');
  });
});
