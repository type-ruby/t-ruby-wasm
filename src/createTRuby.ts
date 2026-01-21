import type { TRubyOptions } from "./types/TRubyOptions.js";
import { TRuby } from "./TRuby.js";

/**
 * Create and initialize a T-Ruby instance
 *
 * @remarks
 * This is a convenience function that creates a new TRuby instance
 * and initializes it in one step. Recommended for most use cases.
 *
 * @param options - Optional configuration options
 * @returns Promise resolving to an initialized TRuby instance
 *
 * @example
 * ```typescript
 * import { createTRuby } from '@t-ruby/wasm';
 *
 * const tRuby = await createTRuby();
 * const result = await tRuby.compile(`
 *   def hello(name: String): String
 *     "Hello, #{name}!"
 *   end
 * `);
 * ```
 */
export async function createTRuby(options?: TRubyOptions): Promise<TRuby> {
  const instance = new TRuby(options);
  await instance.initialize();
  return instance;
}
