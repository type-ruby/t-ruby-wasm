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
    // Generate script that directly evals bundled T-Ruby files
    // This avoids file system operations which may not work in all WASM environments

    // T-Ruby library files in dependency order (complete list)
    // Based on t_ruby.rb require_relative order + parser_combinator submodules
    // Paths match bundle keys: lib/t_ruby/...
    // NOTE: version_checker.rb excluded - uses net/http which requires socket (not available in WASM)
    const T_RUBY_LOAD_ORDER = [
      // Core
      'lib/t_ruby/version.rb',
      // 'lib/t_ruby/version_checker.rb', // Excluded: uses net/http (socket not available in WASM)
      'lib/t_ruby/ruby_version.rb',
      'lib/t_ruby/code_emitter.rb',
      'lib/t_ruby/config.rb',
      'lib/t_ruby/string_utils.rb',
      'lib/t_ruby/ir.rb',

      // Parser Combinator - Base
      'lib/t_ruby/parser_combinator/parse_result.rb',
      'lib/t_ruby/parser_combinator/parser.rb',

      // Parser Combinator - Primitives
      'lib/t_ruby/parser_combinator/primitives/literal.rb',
      'lib/t_ruby/parser_combinator/primitives/satisfy.rb',
      'lib/t_ruby/parser_combinator/primitives/regex.rb',
      'lib/t_ruby/parser_combinator/primitives/end_of_input.rb',
      'lib/t_ruby/parser_combinator/primitives/pure.rb',
      'lib/t_ruby/parser_combinator/primitives/fail.rb',
      'lib/t_ruby/parser_combinator/primitives/lazy.rb',

      // Parser Combinator - Combinators
      'lib/t_ruby/parser_combinator/combinators/sequence.rb',
      'lib/t_ruby/parser_combinator/combinators/alternative.rb',
      'lib/t_ruby/parser_combinator/combinators/map.rb',
      'lib/t_ruby/parser_combinator/combinators/flat_map.rb',
      'lib/t_ruby/parser_combinator/combinators/many.rb',
      'lib/t_ruby/parser_combinator/combinators/many1.rb',
      'lib/t_ruby/parser_combinator/combinators/optional.rb',
      'lib/t_ruby/parser_combinator/combinators/sep_by.rb',
      'lib/t_ruby/parser_combinator/combinators/sep_by1.rb',
      'lib/t_ruby/parser_combinator/combinators/skip_right.rb',
      'lib/t_ruby/parser_combinator/combinators/label.rb',
      'lib/t_ruby/parser_combinator/combinators/lookahead.rb',
      'lib/t_ruby/parser_combinator/combinators/not_followed_by.rb',
      'lib/t_ruby/parser_combinator/combinators/choice.rb',
      'lib/t_ruby/parser_combinator/combinators/chain_left.rb',

      // Parser Combinator - DSL
      'lib/t_ruby/parser_combinator/dsl.rb',

      // Parser Combinator - Token parsers
      'lib/t_ruby/parser_combinator/token/token_parse_result.rb',
      'lib/t_ruby/parser_combinator/token/token_parser.rb',
      'lib/t_ruby/parser_combinator/token/token_matcher.rb',
      'lib/t_ruby/parser_combinator/token/token_sequence.rb',
      'lib/t_ruby/parser_combinator/token/token_alternative.rb',
      'lib/t_ruby/parser_combinator/token/token_map.rb',
      'lib/t_ruby/parser_combinator/token/token_many.rb',
      'lib/t_ruby/parser_combinator/token/token_many1.rb',
      'lib/t_ruby/parser_combinator/token/token_optional.rb',
      'lib/t_ruby/parser_combinator/token/token_sep_by.rb',
      'lib/t_ruby/parser_combinator/token/token_sep_by1.rb',
      'lib/t_ruby/parser_combinator/token/token_skip_right.rb',
      'lib/t_ruby/parser_combinator/token/token_label.rb',
      'lib/t_ruby/parser_combinator/token/token_dsl.rb',

      // Parser Combinator - High-level parsers
      'lib/t_ruby/parser_combinator/token/expression_parser.rb',
      'lib/t_ruby/parser_combinator/token/token_body_parser.rb',
      'lib/t_ruby/parser_combinator/token/statement_parser.rb',
      'lib/t_ruby/parser_combinator/token/token_declaration_parser.rb',

      // Parser Combinator - Type and declaration parsers
      'lib/t_ruby/parser_combinator/type_parser.rb',
      'lib/t_ruby/parser_combinator/declaration_parser.rb',

      // Parser Combinator - Error
      'lib/t_ruby/parser_combinator/parse_error.rb',

      // Main parser_combinator module (defines the module structure)
      'lib/t_ruby/parser_combinator.rb',

      // Scanner and more parsers
      'lib/t_ruby/scanner.rb',
      'lib/t_ruby/smt_solver.rb',
      'lib/t_ruby/type_alias_registry.rb',
      'lib/t_ruby/heredoc_detector.rb',
      'lib/t_ruby/parser.rb',
      'lib/t_ruby/union_type_parser.rb',
      'lib/t_ruby/generic_type_parser.rb',
      'lib/t_ruby/intersection_type_parser.rb',
      'lib/t_ruby/type_erasure.rb',
      'lib/t_ruby/error_handler.rb',
      'lib/t_ruby/diagnostic.rb',
      'lib/t_ruby/diagnostic_formatter.rb',
      'lib/t_ruby/error_reporter.rb',
      'lib/t_ruby/declaration_generator.rb',
      'lib/t_ruby/compiler.rb',

      // Type system
      'lib/t_ruby/constraint_checker.rb',
      'lib/t_ruby/type_inferencer.rb',
      'lib/t_ruby/runtime_validator.rb',
      'lib/t_ruby/type_checker.rb',
      'lib/t_ruby/type_env.rb',
      'lib/t_ruby/ast_type_inferrer.rb',
      'lib/t_ruby/cache.rb',
    ];

    let script = `
# T-Ruby WASM Bundle Loader
# Directly eval bundled files instead of writing to file system

# WASM 환경 표시
module TRuby
  WASM_ENV = true
end unless defined?(TRuby)

# Net::HTTP 스텁 (WASM에서 socket 사용 불가)
module Net
  class HTTP
    class << self
      def new(*); self; end
      def start(*); yield self if block_given?; end
      def get_response(*); nil; end
    end

    attr_accessor :use_ssl, :verify_mode, :open_timeout, :read_timeout

    def request(*); nil; end

    class Get
      def initialize(*); end
    end

    class Post
      def initialize(*); end
      attr_accessor :body
      def []=(*); end
    end

    class Delete
      def initialize(*); end
      def set_form_data(*); end
    end
  end

  HTTPSuccess = Class.new
  HTTPNotFound = Class.new
end unless defined?(Net::HTTP)

# OpenSSL 스텁
module OpenSSL
  module SSL
    VERIFY_PEER = 0
    VERIFY_NONE = 1
  end
end unless defined?(OpenSSL::SSL::VERIFY_PEER)

# FileUtils 스텁
module FileUtils
  def self.mkdir_p(*); true; end
  def self.rm_rf(*); true; end
  def self.cp(*); true; end
  def self.mv(*); true; end
end unless defined?(FileUtils) && FileUtils.respond_to?(:mkdir_p)
`;

    // Load each bundled file in dependency order by directly evaling the content
    // Using heredoc syntax to avoid complex escaping issues
    script += `
puts "[T-Ruby WASM] Starting file loading..."
puts "[T-Ruby WASM] Bundle has #{${Object.keys(T_RUBY_BUNDLE).length}} files"
`;

    for (let i = 0; i < T_RUBY_LOAD_ORDER.length; i++) {
      const path = T_RUBY_LOAD_ORDER[i];
      const content = T_RUBY_BUNDLE[path];
      if (!content) {
        script += `puts "[T-Ruby WASM] SKIP: ${path} (not in bundle)"\n`;
        continue;
      }
      script += `puts "[T-Ruby WASM] Loading: ${path}"\n`;

      // Process the content: remove frozen_string_literal and require_relative
      const processedContent = content
        .replace(/# frozen_string_literal: true\n?/g, '')
        .replace(/require_relative\s+["'][^"']+["']\n?/g, '')
        .replace(/require\s+["']fileutils["']\n?/g, '');

      // Use heredoc with single quotes to avoid interpolation and escape issues
      // The delimiter is unique per file to prevent conflicts
      const delimiter = `__T_RUBY_CODE_${i}__`;

      script += `
eval(<<~'${delimiter}', binding, '${path}')
${processedContent}
${delimiter}
`;
    }

    script += `
require 'json'
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
