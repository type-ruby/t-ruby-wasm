# T-Ruby WASM 기여 가이드

> [English Documentation](./CONTRIBUTING.md)

T-Ruby WASM에 기여해 주셔서 감사합니다! 이 문서는 기여자를 위한 가이드라인과 정보를 제공합니다.

## 행동 강령

모든 상호작용에서 존중과 건설적인 태도를 유지해 주세요. 모든 배경과 경험 수준의 기여자를 환영합니다.

## 시작하기

1. 저장소를 포크하세요
2. 포크한 저장소를 클론하세요:
   ```bash
   git clone https://github.com/YOUR_USERNAME/t-ruby-wasm.git
   cd t-ruby-wasm
   ```
3. 의존성을 설치하세요:
   ```bash
   npm install
   ```
4. 변경사항을 위한 브랜치를 생성하세요:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 개발 가이드라인

### 코드 스타일

- 모든 소스 파일에 TypeScript 사용
- 기존 코드 스타일 준수
- 각 파일은 하나의 export만 가져야 함
- 파일은 100줄 미만으로 유지 (주석 포함)
- 종합적인 JSDoc 주석 작성

### SOLID 원칙

SOLID 원칙을 따릅니다:

- **S**ingle Responsibility: 각 클래스/모듈은 하나의 책임만
- **O**pen/Closed: 확장에 열려있고 수정에 닫혀있음
- **L**iskov Substitution: 서브타입은 대체 가능해야 함
- **I**nterface Segregation: 인터페이스를 작고 집중적으로 유지
- **D**ependency Inversion: 추상화에 의존

### DRY 원칙

같은 코드를 반복하지 마세요. 공통 로직은 재사용 가능한 유틸리티로 추출하세요.

## 테스팅

### 테스트 주도 개발 (TDD)

TDD 방법론을 사용합니다:

1. 먼저 실패하는 테스트 작성
2. 테스트를 통과하는 최소한의 코드 작성
3. 테스트를 통과 상태로 유지하면서 리팩토링

### 테스트 실행

```bash
# 테스트 실행
npm test

# 감시 모드로 테스트 실행
npm run test:watch

# 커버리지와 함께 테스트 실행
npm run test:coverage
```

## Pull Request 과정

1. 모든 테스트가 통과하는지 확인
2. 필요한 경우 문서 업데이트
3. 새 기능에 대한 테스트 추가
4. 커밋은 원자적이고 설명이 잘 되어야 함
5. 관련 이슈 참조

### 커밋 메시지 형식

```
type: 짧은 설명

필요한 경우 더 긴 설명.

Fixes #123
```

타입: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 프로젝트 구조

```
t-ruby-wasm/
├── src/
│   ├── types/           # 타입 정의 (파일당 하나)
│   ├── vm/              # Ruby VM 관련 코드
│   ├── utils/           # 유틸리티 함수
│   ├── TRuby.ts         # 메인 TRuby 클래스
│   ├── createTRuby.ts   # 팩토리 함수
│   ├── VirtualFileSystem.ts
│   └── index.ts         # 공개 exports
├── tests/               # 테스트 파일
├── scripts/             # 빌드 스크립트
└── dist/                # 빌드 출력
```

## 질문이 있으신가요?

질문이나 논의를 위해 이슈를 열어주세요.
