import type { RubyVM } from "./RubyVM.js";

/**
 * Interface for the default Ruby VM factory from ruby-wasm-wasi
 *
 * @remarks
 * This interface represents the result of calling DefaultRubyVM()
 * from the ruby-wasm-wasi package.
 *
 * @internal
 */
export interface DefaultRubyVMResult {
  /** The initialized Ruby VM instance */
  vm: RubyVM;
}
