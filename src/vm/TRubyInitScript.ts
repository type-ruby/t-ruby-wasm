/**
 * Ruby initialization script for T-Ruby in WASM environment
 *
 * @remarks
 * This script is executed when the Ruby VM is initialized.
 * It attempts to load the T-Ruby gem, and falls back to a minimal
 * implementation if the gem is not available.
 *
 * @internal
 */
export const T_RUBY_INIT_SCRIPT = `
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
