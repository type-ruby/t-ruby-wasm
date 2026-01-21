import { T_RUBY_BUNDLE, HAS_T_RUBY_BUNDLE } from "./TRubyBundle.js";

/**
 * Generate Ruby initialization script for T-Ruby in WASM environment
 *
 * @remarks
 * This function generates a script that either loads bundled T-Ruby files
 * or falls back to a minimal implementation if no bundle is available.
 *
 * @internal
 */
export function generateInitScript(): string {
  if (HAS_T_RUBY_BUNDLE) {
    // Generate script that loads bundled files
    let script = `
# T-Ruby WASM Bundle Loader
$LOAD_PATH.unshift('/t-ruby')

# Create virtual file system for bundled files
`;

    // Add each bundled file to the virtual file system
    for (const [path, content] of Object.entries(T_RUBY_BUNDLE)) {
      const escapedContent = content
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n");
      script += `
begin
  dir = File.dirname('/t-ruby/${path}')
  FileUtils.mkdir_p(dir) unless Dir.exist?(dir)
rescue; end
File.write('/t-ruby/${path}', '${escapedContent}')
`;
    }

    script += `
require 'rubygems'
require 't_ruby'
`;

    return script;
  }

  // Fallback: minimal implementation
  return `
require 'rubygems'
begin
  require 't-ruby'
rescue LoadError
  # T-Ruby gem not available, use minimal implementation
  module TRuby
    VERSION = "0.0.0"

    class Compiler
      def self.compile(source, filename: "input.trb")
        # Minimal type erasure: strip type annotations
        ruby_code = source.gsub(/:\\s*[A-Z][A-Za-z0-9_]*(?:<[^>]+>)?/, '')
        ruby_code = ruby_code.gsub(/->\\s*[A-Z][A-Za-z0-9_]*(?:<[^>]+>)?/, '')
        ruby_code = ruby_code.gsub(/^\\s*interface\\s+.*?^\\s*end/m, '')
        ruby_code = ruby_code.gsub(/^\\s*type\\s+.*$/, '')
        { ruby: ruby_code, rbs: "", errors: [], warnings: [] }
      end
    end

    class TypeChecker
      def self.check(source, filename: "input.trb")
        { valid: true, errors: [] }
      end
    end
  end
end
`;
}

/**
 * @deprecated Use generateInitScript() instead
 */
export const T_RUBY_INIT_SCRIPT = generateInitScript();
