#!/usr/bin/env node

/**
 * T-Ruby 초기화 스크립트 생성 테스트
 *
 * 실제 생성되는 Ruby 초기화 스크립트를 확인
 */

import { readFileSync } from 'node:fs';

// dist/index.js에서 생성된 스크립트 추출
const distCode = readFileSync('./dist/index.js', 'utf-8');

// T_RUBY_INIT_SCRIPT 변수 찾기
// generateInitScript() 함수 결과를 찾아서 version.rb 로드 부분 확인

// T_RUBY_BUNDLE 추출
const bundleMatch = distCode.match(/var T_RUBY_BUNDLE = \{/);
if (!bundleMatch) {
  console.error('T_RUBY_BUNDLE을 찾을 수 없음');
  process.exit(1);
}

// version.rb 내용 찾기
const versionRbMatch = distCode.match(/"lib\/t_ruby\/version\.rb":\s*`([^`]*)`/);
if (versionRbMatch) {
  console.log('=== version.rb 번들 내용 ===');
  console.log(versionRbMatch[1]);
  console.log('');
}

// generateInitScript 함수 시뮬레이션
// TRubyBundle.ts 소스에서 직접 확인
const bundleSource = readFileSync('./src/vm/TRubyBundle.ts', 'utf-8');
const initScriptSource = readFileSync('./src/vm/TRubyInitScript.ts', 'utf-8');

// version.rb 내용 추출
const versionRbInBundle = bundleSource.match(/"lib\/t_ruby\/version\.rb":\s*`([^`]*)`/);
if (versionRbInBundle) {
  console.log('=== TRubyBundle.ts의 version.rb ===');
  console.log(versionRbInBundle[1]);
  console.log('');
}

// 생성된 스크립트에서 version.rb 로드 부분 시뮬레이션
console.log('=== 생성될 version.rb 로드 코드 ===');
const versionContent = versionRbInBundle ? versionRbInBundle[1] : '';
const processedContent = versionContent
  .replace(/# frozen_string_literal: true\n?/g, '')
  .replace(/require_relative\s+["'][^"']+["']\n?/g, '')
  .replace(/require\s+["']fileutils["']\n?/g, '');

console.log(`puts "[T-Ruby WASM] Loading: lib/t_ruby/version.rb"

eval(<<~'__T_RUBY_CODE_0__', binding, 'lib/t_ruby/version.rb')
${processedContent}
__T_RUBY_CODE_0__
`);

// Ruby에서 이 스크립트가 TRuby::VERSION을 정의하는지 확인
console.log('=== 검증 ===');
if (processedContent.includes('module TRuby') && processedContent.includes('VERSION =')) {
  console.log('✓ version.rb에 TRuby::VERSION 정의 존재');
} else {
  console.log('✗ version.rb에 TRuby::VERSION 정의 없음');
}
