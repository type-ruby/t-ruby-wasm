/**
 * Escape a string for safe inclusion in Ruby code
 *
 * @remarks
 * This function escapes special characters in a string so it can be
 * safely interpolated into Ruby code without causing syntax errors
 * or injection vulnerabilities.
 *
 * @param str - The string to escape
 * @returns The escaped string wrapped in double quotes
 *
 * @example
 * ```typescript
 * const escaped = escapeRubyString('Hello\n"World"');
 * // Returns: "Hello\\n\\"World\\""
 * ```
 *
 * @internal
 */
export function escapeRubyString(str: string): string {
  const escaped = str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");

  return `"${escaped}"`;
}
