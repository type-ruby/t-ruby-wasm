/**
 * T-Ruby WASM Type Definitions
 *
 * @remarks
 * This module re-exports all type definitions for convenient importing.
 * Each type is defined in its own file following the single-export pattern.
 *
 * @example
 * ```typescript
 * import type { TRubyOptions, CompileResult } from '@t-ruby/wasm';
 * ```
 *
 * @packageDocumentation
 */

export type { TRubyOptions } from "./TRubyOptions.js";
export type { CompileError } from "./CompileError.js";
export type { CompileWarning } from "./CompileWarning.js";
export type { CompileResult } from "./CompileResult.js";
export type { TypeCheckError } from "./TypeCheckError.js";
export type { TypeCheckResult } from "./TypeCheckResult.js";
export type { VirtualFile } from "./VirtualFile.js";
export type { VersionInfo } from "./VersionInfo.js";
