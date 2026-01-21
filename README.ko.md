# T-Ruby WASM

[![npm version](https://badge.fury.io/js/@t-ruby%2Fwasm.svg)](https://www.npmjs.com/package/@t-ruby/wasm)
[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD--2--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)

> [English Documentation](./README.md)

브라우저 환경에서 WebAssembly로 실행되는 T-Ruby 컴파일러입니다. 이 패키지를 사용하면 브라우저에서 직접 T-Ruby(`.trb`) 파일을 Ruby(`.rb`)로 컴파일할 수 있어, 문서화 플레이그라운드, 온라인 에디터, 교육 도구 등에 적합합니다.

## T-Ruby란?

[T-Ruby](https://github.com/type-ruby/t-ruby)는 TypeScript에서 영감을 받은 Ruby용 타입 레이어입니다. 타입 어노테이션이 포함된 `.trb` 파일을 표준 `.rb` 파일로 컴파일하고 `.rbs` 타입 시그니처 파일을 생성합니다. 이 패키지는 그 기능을 WebAssembly를 통해 브라우저로 가져옵니다.

## 설치

```bash
npm install @t-ruby/wasm
```

## 빠른 시작

```typescript
import { createTRuby } from '@t-ruby/wasm';

// T-Ruby WASM 런타임 초기화
const tRuby = await createTRuby();

// T-Ruby 코드 컴파일
const result = await tRuby.compile(`
  def greet(name: String): String
    "Hello, #{name}!"
  end
`);

if (result.success) {
  console.log(result.ruby);  // 컴파일된 Ruby 코드
  console.log(result.rbs);   // 생성된 RBS 시그니처
} else {
  console.error(result.errors);
}
```

## API 레퍼런스

### `createTRuby(options?)`

T-Ruby 인스턴스를 생성하고 초기화합니다. 시작하는 데 권장되는 방법입니다.

```typescript
const tRuby = await createTRuby({
  debug: false,  // 디버그 로깅 활성화
});
```

### `TRuby` 클래스

더 세밀한 제어가 필요한 경우 `TRuby` 클래스를 직접 사용할 수 있습니다.

```typescript
import { TRuby } from '@t-ruby/wasm';

const tRuby = new TRuby();
await tRuby.initialize();
```

#### `compile(source, filename?)`

T-Ruby 소스 코드를 Ruby로 컴파일합니다.

```typescript
const result = await tRuby.compile(`
  interface Greeter
    def greet(name: String): String
  end

  class HelloGreeter
    implements Greeter

    def greet(name: String): String
      "Hello, #{name}!"
    end
  end
`, 'greeter.trb');

console.log(result.ruby);     // 컴파일된 Ruby 코드
console.log(result.rbs);      // RBS 타입 시그니처
console.log(result.errors);   // 컴파일 에러 (있는 경우)
console.log(result.warnings); // 컴파일 경고 (있는 경우)
```

#### `typeCheck(source, filename?)`

컴파일 없이 T-Ruby 소스 코드의 타입을 검사합니다.

```typescript
const result = await tRuby.typeCheck(`
  def add(a: Integer, b: Integer): Integer
    a + b
  end

  add("not", "integers")
`);

if (!result.valid) {
  result.errors?.forEach(err => {
    console.error(`${err.line}:${err.column} - ${err.message}`);
  });
}
```

#### 가상 파일 시스템

다중 파일 프로젝트를 위해 가상 파일 시스템의 파일을 관리합니다.

```typescript
// 개별 파일 추가
tRuby.addFile('lib/utils.trb', `
  def helper(x: Integer): Integer
    x * 2
  end
`);

// 여러 파일 추가
tRuby.addFiles([
  { path: 'lib/models.trb', content: '# models' },
  { path: 'lib/services.trb', content: '# services' },
]);

// 모든 파일 가져오기
const files = tRuby.getFiles();

// 파일 제거
tRuby.removeFile('lib/utils.trb');

// 모든 파일 지우기
tRuby.clearFiles();
```

#### `getVersion()`

버전 정보를 가져옵니다.

```typescript
const versions = await tRuby.getVersion();
console.log(versions.tRuby);     // T-Ruby 버전
console.log(versions.ruby);      // Ruby 버전
console.log(versions.rubyWasm);  // Ruby WASM 버전
```

#### `eval(code)`

임의의 Ruby 코드를 실행합니다 (고급 사용 사례용).

```typescript
const result = await tRuby.eval('1 + 2 + 3');
console.log(result); // 6
```

## 타입

패키지는 다음 TypeScript 타입을 내보냅니다:

```typescript
import type {
  TRubyOptions,
  CompileResult,
  CompileError,
  CompileWarning,
  TypeCheckResult,
  TypeCheckError,
  VirtualFile,
  VersionInfo,
} from '@t-ruby/wasm';
```

## 브라우저 사용법

### 번들러 사용 (Vite, Webpack 등)

```typescript
import { createTRuby } from '@t-ruby/wasm';

async function main() {
  const tRuby = await createTRuby();
  // tRuby 사용...
}

main();
```

### CDN 사용 (ESM)

```html
<script type="module">
  import { createTRuby } from 'https://esm.sh/@t-ruby/wasm';

  const tRuby = await createTRuby();
  const result = await tRuby.compile('def foo: Integer\n  42\nend');
  console.log(result.ruby);
</script>
```

## 사용 사례

- **문서화 플레이그라운드**: 사용자가 문서에서 직접 T-Ruby 코드를 시험해볼 수 있게 함
- **온라인 에디터**: 브라우저 기반 T-Ruby 에디터 구축
- **교육 도구**: T-Ruby 학습을 위한 대화형 튜토리얼 제작
- **코드 미리보기**: 사용자가 입력하는 대로 실시간으로 컴파일 출력 표시

## 요구 사항

- WebAssembly를 지원하는 최신 브라우저
- Node.js 18+ (개발/빌드용)

## 개발

```bash
# 의존성 설치
npm install

# 패키지 빌드
npm run build

# 테스트 실행
npm test

# 타입 검사
npm run typecheck

# 린트
npm run lint
```

## 라이선스

BSD-2-Clause

## 관련 프로젝트

- [T-Ruby](https://github.com/type-ruby/t-ruby) - T-Ruby 컴파일러 (Ruby)
- [ruby.wasm](https://github.com/ruby/ruby.wasm) - WebAssembly의 Ruby
