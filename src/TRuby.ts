import type { TRubyOptions } from "./types/TRubyOptions.js";
import type { CompileResult } from "./types/CompileResult.js";
import type { TypeCheckResult } from "./types/TypeCheckResult.js";
import type { VersionInfo } from "./types/VersionInfo.js";
import type { VirtualFile } from "./types/VirtualFile.js";
import type { RubyVM } from "./vm/RubyVM.js";
import { VirtualFileSystem } from "./VirtualFileSystem.js";
import { escapeRubyString } from "./utils/escapeRubyString.js";
import { T_RUBY_INIT_SCRIPT } from "./vm/TRubyInitScript.js";
import { RUBY_WASM_VERSION } from "./constants.js";

/** T-Ruby WASM wrapper for compiling T-Ruby to Ruby in the browser */
export class TRuby {
  private vm: RubyVM | null = null;
  private initialized = false;
  private vfs = new VirtualFileSystem();

  constructor(_options: TRubyOptions = {}) {}

  /** Initialize the T-Ruby WASM runtime. Must be called first. */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.vm = await this.loadWasm();
    await this.vm.evalAsync(T_RUBY_INIT_SCRIPT);
    this.initialized = true;
  }

  /** Compile T-Ruby source code to Ruby */
  async compile(source: string, filename = "input.trb"): Promise<CompileResult> {
    this.ensureInit();
    try {
      const r = await this.evalJson<CompileResult>(
        `TRuby::Compiler.compile(${escapeRubyString(source)}, filename: ${escapeRubyString(filename)}).to_json`
      );
      return { ...r, success: !r.errors?.length };
    } catch (e) {
      return { success: false, errors: [{ message: String(e) }] };
    }
  }

  /** Type check T-Ruby source code */
  async typeCheck(source: string, filename = "input.trb"): Promise<TypeCheckResult> {
    this.ensureInit();
    try {
      return await this.evalJson<TypeCheckResult>(
        `TRuby::TypeChecker.check(${escapeRubyString(source)}, filename: ${escapeRubyString(filename)}).to_json`
      );
    } catch (e) {
      return { valid: false, errors: [{ message: String(e) }] };
    }
  }

  addFile(path: string, content: string): void { this.vfs.addFile(path, content); }
  addFiles(files: VirtualFile[]): void { this.vfs.addFiles(files); }
  removeFile(path: string): void { this.vfs.removeFile(path); }
  clearFiles(): void { this.vfs.clear(); }
  getFiles(): Map<string, string> { return this.vfs.getAllFiles(); }

  /** Get version information */
  async getVersion(): Promise<VersionInfo> {
    this.ensureInit();
    const [tRuby, ruby] = await Promise.all([
      this.vm!.evalAsync("TRuby::VERSION") as Promise<string>,
      this.vm!.evalAsync("RUBY_VERSION") as Promise<string>,
    ]);
    return { tRuby, ruby, rubyWasm: RUBY_WASM_VERSION };
  }

  /** Execute arbitrary Ruby code */
  async eval(code: string): Promise<unknown> {
    this.ensureInit();
    return this.vm!.evalAsync(code);
  }

  isInitialized(): boolean { return this.initialized; }

  private async loadWasm(): Promise<RubyVM> {
    const { DefaultRubyVM } = await import("@ruby/wasm-wasi/dist/browser");
    const url = new URL("@ruby/3.4-wasm-wasi/dist/ruby+stdlib.wasm", import.meta.url);
    const mod = await WebAssembly.compileStreaming(fetch(url));
    const result = await DefaultRubyVM(mod);
    return result.vm as RubyVM;
  }

  private async evalJson<T>(code: string): Promise<T> {
    return JSON.parse(await this.vm!.evalAsync(`require 'json'; ${code}`) as string);
  }

  private ensureInit(): void {
    if (!this.initialized) throw new Error("T-Ruby WASM not initialized. Call initialize() first.");
  }
}
