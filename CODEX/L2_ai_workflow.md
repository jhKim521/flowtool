# AI Workflow Guide

## 목적

이 문서는 FlowTool 프로젝트에서 AI Agent(Codex)가 작업을 수행하는 표준 절차를 정의한다.

FlowTool은 **100% 바이브 코딩(Vibe Coding)** 방식으로 개발된다.

사용자는 직접 코드를 작성하지 않으며, Codex는 기능 구현뿐 아니라 테스트, 검증, 결과 기록까지 하나의 작업 단위로 수행해야 한다.

모든 작업은 다음 원칙을 만족해야 한다.

* 구현 가능해야 한다.
* 실행 가능해야 한다.
* 검증 가능해야 한다.
* 추적 가능해야 한다.
* 기록 가능해야 한다.

---

# 기본 작업 흐름

Codex는 모든 작업을 아래 순서로 수행한다.

```txt
1. current_requirement.md 확인
2. 관련 문서 확인
3. 작업 범위 및 구현 계획 수립
4. 기능 구현 또는 문서 수정
5. 테스트 및 검증 명령 실행
6. MCP를 이용한 검증 수행
7. Notion Development History 기록
8. progress.md 업데이트
9. 사용자에게 결과 보고
```

각 단계는 가능한 한 완료되어야 하며, 검증 없이 작업을 완료 상태로 처리하지 않는다.

---

# 구현 규칙

모든 작업은 하나의 기능 단위로 수행한다.

새로운 기능을 구현할 때는 아래 기준을 따른다.

* MVP 범위를 벗어나지 않는다.
* 기존 구조를 최대한 활용한다.
* 필요한 경우에만 새로운 파일을 추가한다.
* 구현과 함께 검증 방법을 제공한다.
* 테스트 없이 완료 처리하지 않는다.
* 하나의 작업에서 여러 기능을 동시에 구현하지 않는다.

---

# 검증 규칙

모든 기능은 구현 후 반드시 검증한다.

가능한 경우 아래 순서를 따른다.

```txt
1. 테스트 실행
2. PostgreSQL MCP 검증
3. Chrome DevTools MCP 또는 Playwright MCP 검증
4. Notion Development History 기록
```

검증이 실패한 경우에는 원인을 분석하고 결과를 기록한다.

---

# Notion Development History

## 기록 대상

모든 의미 있는 작업은 FlowTool Development History Database에 기록한다.

* 기능 구현
* 버그 수정
* 테스트 추가
* 검증 스크립트 추가
* DB 스키마 변경
* API 변경
* 문서 구조 변경
* MCP 검증 수행
* 실패한 작업
* Blocked 상태 발생

단순 오타 수정이나 의미 없는 포맷팅 변경은 기록하지 않아도 된다.

### Notion Database

Database Name : []

Data Source ID : []
Codex는 작업 완료 후 Notion MCP를 사용하여 위 Database에 새로운 페이지를 생성한다.

작업 결과는 반드시 해당 Database에 기록하며,
작업이 실패한 경우에도 Blocked 또는 Fail 상태로 기록한다.

---

# DB 필드 작성 규칙

## Task

작업명을 작성한다.

예시

```txt
[Feature] Express HTTP Capture Middleware 구현
[Bugfix] responseBody 저장 오류 수정
[Test] verify:capture 스크립트 추가
[Docs] AGENT.md 정리
```

---

## Status

사용 가능한 값

```txt
Backlog
Ready
In Progress
Done
Blocked
```

기준

* Done : 구현과 검증이 모두 완료된 경우
* Blocked : 외부 환경 또는 설정 문제로 진행할 수 없는 경우
* In Progress : 작업 진행 중
* Ready : 다음 작업 후보
* Backlog : 추후 작업

---

## Type

사용 가능한 값

```txt
Feature
Bugfix
Refactor
Test
Docs
Setup
```

---

## Priority

사용 가능한 값

```txt
P0
P1
P2
P3
```

기준

* P0 : MVP 진행을 막는 작업
* P1 : 현재 단계에서 중요한 작업
* P2 : 있으면 좋은 작업
* P3 : 나중에 진행 가능한 작업

---

## Test Result

사용 가능한 값

```txt
Not Run
Pass
Fail
Partial
```

기준

* Pass : 테스트 및 검증 성공
* Fail : 테스트 실패
* Partial : 일부만 성공
* Not Run : 테스트를 수행하지 않음

---

## MCP Verified

MCP를 이용해 실제 검증을 수행한 경우 체크한다.

예시

* PostgreSQL MCP
* Chrome DevTools MCP
* Playwright MCP
* Notion MCP
* GitHub MCP

---

## MCP Tools

사용한 MCP를 모두 기록한다.

예시

```txt
PostgreSQL MCP
Chrome DevTools MCP
Playwright MCP
Notion MCP
GitHub MCP
```

---

## Summary

작업 결과를 2~5줄로 요약한다.

---

## Changed Files

수정한 파일 목록을 작성한다.

---

## Verification Command

실행한 검증 명령을 작성한다.

예시

```txt
npm test
npm run verify:capture
npm run lint
```

검증하지 못한 경우에는 이유를 함께 기록한다.

---

## Failure Log

실패한 경우 핵심 에러만 요약하여 기록한다.

성공한 경우에는 비워둔다.

---

## Known Issue

현재 남아 있는 한계나 주의사항을 작성한다.

---

## Next Action

다음 작업 하나만 작성한다.

---

## Commit

GitHub Commit URL이 있는 경우 기록한다.

---

## Date

작업 날짜를 작성한다.

형식

```txt
YYYY-MM-DD
```

---

# Notion 기록 형식

Codex는 작업 완료 후 Notion MCP를 사용하여 Development History DB에 새로운 작업을 기록한다.

페이지 제목은 Task와 동일하게 작성한다.

본문은 아래 형식을 따른다.

```md
# 작업 요약

작업 내용을 간단히 설명한다.

## 구현 내용

- 구현 내용

## 검증 결과

- 실행 명령
- 결과
- 확인한 항목

## MCP 검증

- 사용한 MCP
- 확인한 내용

## 변경 파일

- 변경 파일 목록

## 현재 한계

- Known Issue

## 다음 작업

- 다음 작업 하나
```

---

# 작업 완료 보고 형식

Codex는 사용자에게 아래 형식으로 작업 결과를 보고한다.

```md
## 작업 완료 보고

### 작업명

### 변경 파일

### 구현 내용

### 테스트 및 검증 결과

### MCP 검증 결과

### Notion 기록 여부

### 현재 한계

### 다음 작업 추천
```

다음 작업은 반드시 **하나만** 추천한다.

---

# 중요한 제한 사항

Codex는 아래 작업을 수행하지 않는다.

* 사용자가 요청하지 않은 기능을 선제적으로 구현하지 않는다.
* MVP 범위를 벗어난 기능을 추가하지 않는다.
* 불필요한 라이브러리를 추가하지 않는다.
* 과도한 리팩토링을 수행하지 않는다.
* 검증 없이 작업을 완료 처리하지 않는다.
* Notion 기록 없이 완료 처리하지 않는다.

---

# AI 행동 원칙

Codex는 항상 아래 원칙을 따른다.

* 구현보다 검증을 우선한다.
* 하나의 작업에서 하나의 기능만 구현한다.
* 구현 결과는 재현 가능해야 한다.
* 모든 결과는 추적 가능해야 한다.
* 작업이 실패하더라도 반드시 기록을 남긴다.

FlowTool의 목표는 **많은 기능을 빠르게 추가하는 것이 아니라, 작동하는 MVP를 안정적으로 완성하고 모든 작업을 추적 가능하게 만드는 것**이다.