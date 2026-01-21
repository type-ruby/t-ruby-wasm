/**
 * Interface for the Ruby Virtual Machine from ruby-wasm-wasi
 *
 * @remarks
 * This interface abstracts the Ruby VM provided by the ruby-wasm-wasi package.
 * It enables running Ruby code in WebAssembly environments.
 *
 * @internal
 */
export interface RubyVM {
  /**
   * Evaluate Ruby code synchronously
   * @param code - Ruby code to evaluate
   * @returns Result of the evaluation
   */
  eval(code: string): unknown;

  /**
   * Evaluate Ruby code asynchronously
   * @param code - Ruby code to evaluate
   * @returns Promise resolving to the result
   */
  evalAsync(code: string): Promise<unknown>;
}
