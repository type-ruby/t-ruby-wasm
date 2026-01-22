import { TRuby } from '../dist/index.js';

const logEl = document.getElementById('log');
const statusEl = document.getElementById('status');

function log(msg, type = '') {
  const span = document.createElement('span');
  span.className = type;
  span.textContent = msg + '\n';
  logEl.appendChild(span);
  console.log(msg);
}

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#f14c4c' : '#4ec9b0';
}

async function runTest() {
  logEl.innerHTML = '';
  log('=== T-Ruby WASM E2E Test ===\n', 'info');

  try {
    log('1. TRuby 인스턴스 생성...');
    const trb = new TRuby();
    log('   ✓ 인스턴스 생성 완료\n', 'success');

    log('2. initialize() 호출 (WASM 로딩, 시간이 걸릴 수 있습니다)...');
    setStatus('Loading WASM...');
    const initStart = performance.now();
    await trb.initialize();
    const initTime = (performance.now() - initStart).toFixed(0);
    log(`   ✓ 초기화 완료 (${initTime}ms)\n`, 'success');

    log('3. getVersion() 호출...');
    const version = await trb.getVersion();
    log(`   T-Ruby: ${version.tRuby}`, 'success');
    log(`   Ruby: ${version.ruby}`, 'success');
    log(`   Ruby WASM: ${version.rubyWasm}\n`, 'success');

    // TRuby::VERSION이 제대로 정의되었는지 확인
    if (!version.tRuby || version.tRuby === 'nil' || version.tRuby === 'undefined') {
      throw new Error(`TRuby::VERSION이 올바르지 않음: ${version.tRuby}`);
    }

    log('4. 간단한 컴파일 테스트...');
    const source1 = `def foo: Integer
  42
end`;
    log(`   입력:\n${source1}\n`, 'info');

    const result1 = await trb.compile(source1);
    if (result1.success) {
      log('   ✓ 컴파일 성공!', 'success');
      log(`   출력:\n${result1.ruby}\n`, 'info');
    } else {
      log('   ✗ 컴파일 실패', 'error');
      log(`   에러: ${JSON.stringify(result1.errors, null, 2)}`, 'error');
      throw new Error('기본 컴파일 실패');
    }

    log('5. Ruby interpolation 포함 코드 테스트...');
    const source2 = `def greet(name: String): String
  "Hello, \#{name}!"
end`;
    log(`   입력:\n${source2}\n`, 'info');

    const result2 = await trb.compile(source2);
    if (result2.success) {
      log('   ✓ 컴파일 성공!', 'success');
      log(`   출력:\n${result2.ruby}\n`, 'info');
    } else {
      log('   ✗ 컴파일 실패', 'error');
      log(`   에러: ${JSON.stringify(result2.errors, null, 2)}`, 'error');
      throw new Error('interpolation 코드 컴파일 실패');
    }

    log('6. 클래스 정의 테스트...');
    const source3 = `class User
  attr_reader name: String
  attr_reader age: Integer

  def initialize(name: String, age: Integer)
    @name = name
    @age = age
  end

  def greet: String
    "I am \#{@name}, \#{@age} years old"
  end
end`;
    log(`   입력:\n${source3}\n`, 'info');

    const result3 = await trb.compile(source3);
    if (result3.success) {
      log('   ✓ 컴파일 성공!', 'success');
      log(`   출력:\n${result3.ruby}\n`, 'info');
    } else {
      log('   ✗ 컴파일 실패', 'error');
      log(`   에러: ${JSON.stringify(result3.errors, null, 2)}`, 'error');
      throw new Error('클래스 정의 컴파일 실패');
    }

    log('\n=== 모든 테스트 통과! ===', 'success');
    setStatus('All tests passed!');

    // 자동화된 테스트를 위한 글로벌 결과
    window.__TEST_RESULT__ = { success: true, version };

  } catch (error) {
    log('\n❌ 테스트 실패: ' + error.message, 'error');
    log('스택: ' + error.stack, 'error');
    setStatus('Test failed: ' + error.message, true);
    window.__TEST_RESULT__ = { success: false, error: error.message };
  }
}

document.getElementById('runTest').addEventListener('click', runTest);

// 자동 실행 (Playwright 테스트용)
if (new URLSearchParams(window.location.search).has('autorun')) {
  runTest();
}
