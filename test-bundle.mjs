#!/usr/bin/env node

/**
 * T-Ruby 번들 및 초기화 스크립트 검증 테스트
 *
 * WASM 없이 번들 키와 초기화 스크립트의 일관성을 확인
 */

// 빌드된 파일에서 내보내기가 없으므로, 소스 파일을 직접 읽어서 분석
import { readFileSync } from 'node:fs';

// TRubyBundle.ts 소스에서 T_RUBY_BUNDLE 추출
const bundleSource = readFileSync('./src/vm/TRubyBundle.ts', 'utf-8');
const T_RUBY_BUNDLE = {};
const HAS_T_RUBY_BUNDLE = bundleSource.includes('HAS_T_RUBY_BUNDLE = true');

// 번들 키 추출 (정규식으로)
const keyMatches = bundleSource.matchAll(/"([^"]+\.rb)":\s*`/g);
for (const match of keyMatches) {
  T_RUBY_BUNDLE[match[1]] = 'exists';
}

// TRubyInitScript.ts 소스 읽기
const initScriptSource = readFileSync('./src/vm/TRubyInitScript.ts', 'utf-8');

// T_RUBY_LOAD_ORDER 추출
const loadOrderMatch = initScriptSource.match(/const T_RUBY_LOAD_ORDER = \[([\s\S]*?)\];/);
const loadOrder = [];
if (loadOrderMatch) {
  const orderMatches = loadOrderMatch[1].matchAll(/'([^']+\.rb)'/g);
  for (const m of orderMatches) {
    loadOrder.push(m[1]);
  }
}

console.log('=== T-Ruby 번들 검증 테스트 ===\n');

// 1. 번들 상태 확인
console.log('1. 번들 상태 확인');
console.log('   HAS_T_RUBY_BUNDLE:', HAS_T_RUBY_BUNDLE);
console.log('   번들 키 총 개수:', Object.keys(T_RUBY_BUNDLE).length);

// 2. lib/t_ruby 키들 확인
const libKeys = Object.keys(T_RUBY_BUNDLE).filter(k => k.startsWith('lib/t_ruby'));
console.log('\n2. lib/t_ruby 키들:');
console.log('   개수:', libKeys.length);
console.log('   처음 5개:', libKeys.slice(0, 5));

// 3. 핵심 파일들 존재 확인
console.log('\n3. 핵심 파일들 존재 확인:');
const criticalFiles = [
  'lib/t_ruby/version.rb',
  'lib/t_ruby/compiler.rb',
  'lib/t_ruby/parser.rb',
  'lib/t_ruby/type_checker.rb',
];

for (const file of criticalFiles) {
  const exists = file in T_RUBY_BUNDLE;
  console.log(`   ${exists ? '✓' : '✗'} ${file}`);
  if (!exists) {
    console.log('     번들에 없음!');
  }
}

// 4. 초기화 스크립트의 T_RUBY_LOAD_ORDER 추출
console.log('\n4. 초기화 스크립트 분석:');
console.log('   로드 순서 파일 수:', loadOrder.length);
console.log('   처음 5개:', loadOrder.slice(0, 5));

// 5. 로드 순서 파일들이 번들에 모두 있는지 확인
console.log('\n5. 로드 순서 파일들 번들 존재 확인:');
let missingCount = 0;
const missingFiles = [];

for (const file of loadOrder) {
  if (!(file in T_RUBY_BUNDLE)) {
    missingCount++;
    missingFiles.push(file);
  }
}

if (missingCount === 0) {
  console.log('   ✓ 모든 파일이 번들에 존재함');
} else {
  console.log(`   ✗ ${missingCount}개 파일이 번들에 없음:`);
  missingFiles.forEach(f => console.log(`     - ${f}`));
}

// 6. version.rb 내용 확인
console.log('\n6. version.rb 내용 확인:');
const versionExists = 'lib/t_ruby/version.rb' in T_RUBY_BUNDLE;
if (versionExists) {
  console.log('   ✓ version.rb 번들에 존재');
} else {
  console.log('   ✗ version.rb 번들에 없음!');
}

// 7. 결과 요약
console.log('\n=== 검증 결과 ===');
if (HAS_T_RUBY_BUNDLE && libKeys.length > 0 && missingCount === 0 && versionExists) {
  console.log('✓ 번들 검증 통과!');
  process.exit(0);
} else {
  console.log('✗ 번들 검증 실패!');
  process.exit(1);
}
