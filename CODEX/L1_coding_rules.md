# coding_rules.md

# FlowTool 코딩 규칙

이 문서는 FlowTool 프로젝트에서 공통으로 적용되는 구현 및 코딩 규칙을 정의한다.

모든 작업은 본 문서를 기준으로 구현한다.

---

# 기본 원칙

## 1. 가독성 우선

복잡한 구조보다 읽기 쉬운 코드를 우선한다.

지양

* 과도한 추상화
* 불필요한 디자인 패턴
* 과도한 Generic
* 불필요한 Layer 분리

권장

* 명확한 이름
* 짧은 함수
* 단순한 흐름
* 직관적인 구조

---

## 2. MVP 우선

현재 프로젝트는 MVP 단계이다.

따라서 아래 원칙을 따른다.

* 동작 가능한 구조를 우선한다.
* 빠른 검증을 우선한다.
* 과도한 최적화는 하지 않는다.
* 미래 기능을 미리 구현하지 않는다.

---

## 3. 추적 가능한 코드

FlowTool는 흐름을 추적하는 프로젝트이다.

따라서 모든 기능은 가능한 한 추적 가능해야 한다.

예시

* Request ID
* Trace ID
* 처리 시간
* Error 정보
* 저장 여부

---

# 프로젝트 구조

Backend는 아래 구조를 권장한다.

```txt
src/
├── config
├── middleware
├── routes
├── controllers
├── services
├── repositories
├── models
├── utils
├── types
└── tests
```

Frontend는 아래 구조를 권장한다.

```txt
src/
├── api
├── components
├── pages
├── hooks
├── types
├── layouts
└── utils
```

필요하지 않은 폴더는 생성하지 않는다.

---

# 함수 규칙

모든 함수는 하나의 역할만 수행한다.

권장

* 하나의 함수는 하나의 책임만 가진다.
* 가능한 30줄 이하를 권장한다.
* 함수명은 동작을 명확하게 표현한다.
* Early Return을 적극 활용한다.

지양

* 깊은 if 중첩
* 하나의 함수에서 여러 기능 처리
* 의미 없는 Helper 함수 생성

---

# 파일 구성 규칙

가능한 아래 순서를 따른다.

```txt
Import

↓

Type / Interface

↓

Constant

↓

Function

↓

Export
```

---

# 네이밍 규칙

## 파일명

kebab-case 사용

예시

```txt
capture-middleware.ts
trace-service.ts
capture-controller.ts
```

---

## 클래스 및 타입

PascalCase 사용

예시

```txt
CaptureService
CaptureLog
TraceInfo
```

---

## 함수 및 변수

camelCase 사용

예시

```txt
captureRequest
requestBody
responseStatus
traceId
```

---

## 상수

UPPER_SNAKE_CASE 사용

예시

```txt
DEFAULT_TIMEOUT
MAX_RETRY_COUNT
```

---

## 테이블 및 컬럼

snake_case 사용

예시

```txt
capture_logs
trace_steps
created_at
updated_at
```

---

# 에러 처리 규칙

Error를 무시하지 않는다.

권장

* Error Message를 명확하게 작성한다.
* 가능한 경우 Trace ID를 함께 기록한다.
* 필요한 로그를 남긴다.

지양

* 빈 catch
* 원인을 알 수 없는 Error Message
* 무조건 console.log 출력

---

# 로그 규칙

로그는 디버깅에 필요한 최소 정보만 기록한다.

권장

* Method
* Path
* Status Code
* Duration
* Trace ID

불필요한 로그는 제거한다.

---

# TypeScript 규칙

권장

* any 사용 최소화
* 명확한 타입 선언
* interface 또는 type 적극 활용
* Optional 값은 명시적으로 처리

지양

* any 남용
* 타입 추론이 어려운 코드

---

# 테스트 규칙

새로운 기능은 가능한 경우 아래 항목 중 하나 이상을 함께 제공한다.

* 테스트 코드
* 검증 스크립트
* 실행 가능한 검증 명령

기능만 구현하고 검증 방법을 제공하지 않는 작업은 완료로 판단하지 않는다.

---

# AI 친화 규칙

FlowTool는 AI Agent 중심으로 개발된다.

따라서 아래 원칙을 따른다.

* 작은 단위로 구현한다.
* 과도한 추상화를 만들지 않는다.
* 기존 구조를 최대한 활용한다.
* 사용하지 않는 코드는 제거한다.
* 문서와 실제 구현을 항상 일치시킨다.

---

# 금지 사항

아래 작업은 하지 않는다.

* 사용자가 요청하지 않은 기능 구현
* MVP 범위를 벗어난 기능 추가
* 불필요한 라이브러리 추가
* 과도한 리팩토링
* 사용하지 않는 코드 유지
* 검증 없이 완료 처리

---

# 완료 기준

아래 조건을 모두 만족해야 작업 완료로 판단한다.

* 프로젝트가 정상 실행된다.
* 테스트 또는 검증 스크립트가 성공한다.
* 필요한 MCP 검증을 완료한다.
* current_requirement.md의 작업 범위를 만족한다.
* progress.md를 업데이트한다.

---

# 구현 철학

FlowTool의 목표는 많은 기능을 빠르게 추가하는 것이 아니다.

**작동하는 MVP를 안정적으로 완성하고, 모든 기능을 추적 가능하며 검증 가능한 형태로 구현하는 것**을 최우선 목표로 한다.