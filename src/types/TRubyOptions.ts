/**
 * Options for initializing T-Ruby WASM instance
 *
 * @remarks
 * These options allow customization of the T-Ruby runtime behavior,
 * including debug output and custom I/O handlers.
 *
 * @example
 * ```typescript
 * const options: TRubyOptions = {
 *   debug: true,
 *   stdout: (text) => myLogger.info(text),
 *   stderr: (text) => myLogger.error(text),
 * };
 * ```
 */
export interface TRubyOptions {
  /**
   * Whether to print debug information to console
   * @default false
   */
  debug?: boolean;

  /**
   * Custom stdout handler for Ruby output
   * @param text - The text written to stdout
   */
  stdout?: (text: string) => void;

  /**
   * Custom stderr handler for Ruby errors
   * @param text - The text written to stderr
   */
  stderr?: (text: string) => void;
}
