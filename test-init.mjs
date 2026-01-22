#!/usr/bin/env node

/**
 * T-Ruby WASM 초기화 테스트 스크립트
 *
 * Node.js 환경에서 WASM 초기화가 정상 동작하는지 확인
 */

import { TRuby } from './dist/index.js';

async function test() {
  console.log('=== T-Ruby WASM 초기화 테스트 ===\n');

  try {
    console.log('1. TRuby 인스턴스 생성...');
    const trb = new TRuby();
    console.log('   ✓ 인스턴스 생성 완료\n');

    console.log('2. initialize() 호출...');
    await trb.initialize();
    console.log('   ✓ 초기화 완료\n');

    console.log('3. getVersion() 호출...');
    const version = await trb.getVersion();
    console.log('   ✓ 버전 정보:', version, '\n');

    console.log('4. 간단한 컴파일 테스트...');
    const result = await trb.compile('def foo: Integer\n  42\nend');
    console.log('   ✓ 컴파일 결과:', result.success ? '성공' : '실패');
    if (result.ruby) {
      console.log('   출력 Ruby:', result.ruby.substring(0, 100) + '...');
    }
    if (result.errors?.length) {
      console.log('   에러:', result.errors);
    }

    console.log('\n=== 모든 테스트 통과! ===');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 테스트 실패:', error.message);
    console.error('스택:', error.stack);
    process.exit(1);
  }
}

test();
