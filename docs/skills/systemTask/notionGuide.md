# System Test Notion Guide

이 문서는 FlowTool System Test 결과를 Notion에 기록하는 방법을 정의한다.

System Test 완료 후 CODEX는 이 문서를 참고하여 테스트 결과를 반드시 기록한다.

---

# 기록 대상

System Test 결과는 다음 Notion 데이터베이스에 저장한다.

* Database: `{SYSTEM_TEST_HISTORY_DATABASE_NAME}`
* Parent Page: `{DEVELOPMENT_HUB_PAGE_NAME}`
* Database URL: `{SYSTEM_TEST_HISTORY_DATABASE_URL}`

실제 Notion 값은 공개 문서에 작성하지 않는다.
로컬 실행 환경에서는 Git에 포함되지 않는 `docs/skills/private/notionConfig.md`를 참고한다.

`{DEVELOPMENT_HISTORY_DATABASE_NAME}`는 기능 구현 및 Feature Verification 결과를 기록한다.

`{SYSTEM_TEST_HISTORY_DATABASE_NAME}`는 현재까지 구현된 기능을 연결한 System Test 결과를 기록한다.

두 데이터베이스의 목적을 혼동하지 않는다.

---

# 기록 단위

다음 원칙에 따라 레코드를 생성한다.

```text
Scenario 1회 실행
=
Notion 레코드 1건
```

여러 Scenario를 한 번에 실행한 경우에도 Scenario별 결과를 구분할 수 있다면 각각 별도 레코드로 작성한다.

하나의 대표 Scenario와 그 하위 Case를 함께 실행한 경우에는 하나의 레코드에 기록할 수 있다.

---

# 기록 시점

다음 작업이 모두 끝난 후 Notion에 기록한다.

1. 선택한 Scenario 실행
2. 화면 동작 확인
3. API 및 Network 확인
4. PostgreSQL 데이터 확인
5. Database와 화면 데이터 비교
6. 사용자 관점 검토
7. 최종 결과 판정
8. 발견한 Issue 정리

테스트가 환경 문제로 중단된 경우에도 `BLOCKED` 결과로 기록한다.

---

# 페이지 제목 규칙

`Test Name`은 다음 형식을 사용한다.

```text
[System Test] {Scenario 이름} - {YYYY-MM-DD}
```

예시:

```text
[System Test] Capture Analysis Basic Journey - 2026-07-13
```

같은 Scenario를 같은 날 여러 번 실행한 경우 실행 순서를 추가한다.

```text
[System Test] Capture Analysis Basic Journey - 2026-07-13 #2
```

---

# Database 속성 작성 규칙

## Test Name

테스트 실행 기록의 제목이다.

형식:

```text
[System Test] {Scenario 이름} - {실행일}
```

필수 입력이다.

---

## Test Date

System Test를 실행한 날짜다.

형식:

```text
YYYY-MM-DD
```

필수 입력이다.

---

## Scenario ID

실행한 Scenario의 식별자다.

예시:

```text
SCENARIO-001
```

Scenario 문서에 ID가 없다면 먼저 Scenario 문서에 ID를 부여한다.

필수 입력이다.

---

## Result

System Test 전체 결과다.

사용 가능한 값:

* `PASS`
* `PARTIAL`
* `FAIL`
* `BLOCKED`

판정 기준:

### PASS

* Scenario의 핵심 사용자 흐름을 완료했다.
* 핵심 데이터가 Database, API, 화면에서 일치한다.
* 기능 사용을 방해하는 문제가 없다.
* 발견된 문제가 없거나 경미한 개선사항만 존재한다.

### PARTIAL

* 핵심 사용자 흐름은 완료할 수 있다.
* 일부 데이터 표현, 사용성 또는 부가 기능에 문제가 있다.
* 즉시 사용 불가능한 상태는 아니지만 후속 개선이 필요하다.

### FAIL

* 핵심 사용자 흐름을 완료할 수 없다.
* Capture, 저장, 목록, 상세 등 필수 단계 중 하나 이상이 실패했다.
* 핵심 데이터가 누락되거나 일치하지 않는다.
* 사용자가 의도한 목적을 달성할 수 없다.

### BLOCKED

* Backend, Frontend, Database 또는 MCP 환경 문제로 테스트를 완료하지 못했다.
* 테스트 대상 기능에 도달하기 전에 환경 문제로 중단됐다.
* 제품 결함인지 확인할 수 없는 상태다.

필수 입력이다.

---

## Environment

테스트 환경이다.

사용 가능한 값:

* `Local`
* `Dev`
* `Other`

현재 로컬 Backend, Frontend 및 PostgreSQL을 사용하면 `Local`로 기록한다.

필수 입력이다.

---

## Executor

실제 테스트 수행 주체다.

사용 가능한 값:

* `Codex`
* `Human`
* `Codex + Human`

CODEX가 MCP를 이용해 자동 검증만 수행했다면 `Codex`를 선택한다.

사용자가 직접 제품을 사용한 결과만 기록하면 `Human`을 선택한다.

CODEX 자동 검증과 사용자 수동 QA 결과를 함께 반영했다면 `Codex + Human`을 선택한다.

필수 입력이다.

---

## Commit

테스트 기준이 된 Git Commit Hash를 기록한다.

가능한 경우 전체 Hash 대신 식별 가능한 Short Hash를 사용한다.

예시:

```text
f49e6bd
```

테스트 전 Commit을 확인할 수 없다면 다음과 같이 기록한다.

```text
확인 불가
```

---

## Data Integrity

원본 요청, Database, API 응답 및 화면 데이터의 일치 여부다.

사용 가능한 값:

* `PASS`
* `PARTIAL`
* `FAIL`
* `N/A`

판정 기준:

### PASS

검증 대상 핵심 데이터가 모두 일치한다.

### PARTIAL

핵심 흐름은 유지되지만 일부 필드가 누락되거나 표현 방식이 다르다.

### FAIL

핵심 데이터가 누락·변경·중복 저장되었거나 서로 일치하지 않는다.

### N/A

해당 Scenario에서 데이터 비교가 필요하지 않다.

---

## User Flow

사용자가 Scenario의 목적을 달성할 수 있는지에 대한 판정이다.

사용 가능한 값:

* `PASS`
* `PARTIAL`
* `FAIL`
* `BLOCKED`

판정 기준:

### PASS

사용자가 중단 없이 목적을 달성할 수 있다.

### PARTIAL

목적은 달성할 수 있지만 불명확하거나 불편한 과정이 있다.

### FAIL

화면, 동작 또는 정보 부족으로 목적을 달성할 수 없다.

### BLOCKED

환경 문제로 사용자 흐름을 검증하지 못했다.

---

## Issues Found

테스트 과정에서 발견한 Issue 개수다.

다음 항목은 Issue로 계산한다.

* 기능 오류
* 데이터 불일치
* 사용자 흐름 중단
* 사용성을 크게 저해하는 문제
* 명확한 기능 누락
* 재현 가능한 비정상 동작

단순 아이디어나 선호 수준의 제안은 Issue 개수에 포함하지 않고 `Improvement Ideas`에 기록할 수 있다.

Issue가 없으면 `0`을 입력한다.

---

## Follow-up Required

후속 작업이 필요한지 표시한다.

다음 중 하나라도 해당하면 체크한다.

* `Result`가 `PARTIAL`, `FAIL`, `BLOCKED`다.
* 수정이 필요한 Issue가 존재한다.
* 다음 Requirement 후보가 도출됐다.
* 재테스트가 필요하다.
* 테스트 환경 개선이 필요하다.

---

## Scenario File

실행한 Scenario 문서의 프로젝트 내 경로다.

예시:

```text
DOCS/skills/systemTest/scenarios/basic_capture.md
```

필수 입력이다.

---

## Related Feature

이번 Scenario와 관련된 구현 기능 또는 진행 단계를 기록한다.

예시:

```text
HTTP Capture, Capture Log 저장, 목록 조회, 상세 조회
```

또는:

```text
STEP 4 ~ STEP 7
```

여러 기능은 쉼표로 구분한다.

---

## Summary

테스트 결과를 한두 문장으로 요약한다.

예시:

```text
HTTP 요청부터 Capture Log 상세 확인까지 핵심 흐름은 정상 동작했다.
다만 FlowTool 관리 API가 Capture Log에 혼입되어 실제 요청 탐색이 불편했다.
```

상세 Issue 목록을 이 속성에 모두 작성하지 않는다.

---

# 페이지 본문 작성 형식

각 테스트 레코드의 본문은 다음 구조를 사용한다.

````md
# Test Objective

이번 System Test의 목적과 검증하려는 사용자 목적을 작성한다.

# Test Environment

- Date:
- Environment:
- Commit:
- Backend:
- Frontend:
- Database:
- Scenario File:
- Executor:

# Scenario

실행한 사용자 흐름을 순서대로 작성한다.

```text
HTTP 요청 발생
→ Capture Log 저장
→ 목록 확인
→ 항목 선택
→ 상세 확인
→ Database 비교
````

# Preconditions

테스트를 시작하기 전에 만족해야 했던 조건을 작성한다.

* Backend 실행
* Frontend 실행
* PostgreSQL 연결
* 테스트 API 사용 가능
* 필요한 MCP 연결

# Execution Result

Scenario의 각 STEP별 결과를 작성한다.

## Step 1. HTTP 요청 발생

* Expected:
* Actual:
* Result:
* Evidence:

## Step 2. Capture Log 저장

* Expected:
* Actual:
* Result:
* Evidence:

필요한 Step 수만큼 반복한다.

# Automated Verification

CODEX가 수행한 자동 또는 MCP 검증 내용을 작성한다.

* 실행 명령
* 검증 스크립트 결과
* Playwright MCP 결과
* Chrome DevTools MCP 결과
* PostgreSQL MCP 결과
* Console Error 여부
* Network Error 여부

실행하지 않은 검증은 생략하지 말고 다음과 같이 기록한다.

```text
Not Executed
```

# Data Comparison

원본 요청, Database, API 및 화면 데이터를 비교한다.

| Field           | Original Request | Database | API | UI | Result |
| --------------- | ---------------- | -------- | --- | -- | ------ |
| Method          |                  |          |     |    |        |
| Path            |                  |          |     |    |        |
| Request Body    |                  |          |     |    |        |
| Response Status |                  |          |     |    |        |
| Response Body   |                  |          |     |    |        |

검증 대상이 아닌 Field는 `N/A`로 기록한다.

# User Perspective Review

실제 사용자의 관점에서 관찰한 내용을 작성한다.

확인 예시:

* 방금 발생한 요청을 쉽게 찾을 수 있는가
* 어떤 항목을 클릭해야 하는지 알 수 있는가
* 오류 요청을 쉽게 구분할 수 있는가
* Request와 Response를 읽기 쉬운가
* JSON 데이터가 이해하기 쉽게 표시되는가
* 필요한 정보를 복사하거나 비교하기 쉬운가
* 사용자 흐름을 방해하는 로그가 있는가
* 목적 달성에 필요한 기능이 빠져 있지 않은가

자동 검증만 수행했다면 CODEX가 관찰 가능한 범위와 판단 한계를 함께 작성한다.

# Issues

발견한 Issue를 각각 구분하여 작성한다.

## ISSUE-001. Issue Title

* Severity: Critical / High / Medium / Low
* Category: Functional / Data / Usability / Environment
* Reproduction:
* Expected:
* Actual:
* Evidence:
* Suggested Follow-up:

Issue를 발견하지 않았다면 다음과 같이 작성한다.

```text
No issues found.
```

# Improvement Ideas

기능 오류는 아니지만 사용자 경험이나 제품 완성도를 높일 수 있는 제안을 기록한다.

Issue와 개선 아이디어를 구분한다.

예시:

* JSON Copy 버튼 제공
* 상태 코드 시각적 강조
* 최신 로그 자동 갱신
* Request와 Response 접기 기능

# Final Assessment

* Overall Result:
* Data Integrity:
* User Flow:
* Issues Found:
* Follow-up Required:

최종 판정 이유를 짧게 작성한다.

# Next Requirement Candidates

테스트 결과를 바탕으로 다음 구현 후보를 작성한다.

우선순위가 있다면 다음과 같이 표시한다.

* P0:
* P1:
* P2:

테스트 작업 안에서 코드를 수정하지 않는다.
수정이 필요한 내용은 Requirement 후보로만 기록한다.

````

---

# 증거 기록 원칙

테스트 결과는 재현 가능해야 한다.

가능한 경우 다음 증거를 포함한다.

- 실행한 명령어
- HTTP Method와 URL
- Response Status
- 테스트에 사용한 Capture Log ID
- PostgreSQL 조회 결과 요약
- Playwright 수행 결과
- Console 및 Network 상태
- 실패 재현 단계
- 화면 캡처 또는 관련 파일
- Git Commit

민감 정보, 인증 토큰, 비밀번호 및 Secret은 기록하지 않는다.

Request Header나 Body에 민감 정보가 있다면 마스킹하여 기록한다.

---

# Issue와 Improvement 구분

## Issue

현재 구현이 예상한 동작과 다르거나 사용자의 목적 달성을 방해한다.

예시:

- HTTP 요청이 저장되지 않는다.
- 목록에서 최신 Capture Log가 보이지 않는다.
- 상세 화면의 Response Body가 Database 값과 다르다.
- 클릭해도 상세 화면으로 이동하지 않는다.

## Improvement

현재 기능은 정상 동작하지만 더 나은 사용 경험을 위해 추가할 수 있다.

예시:

- JSON Copy 버튼
- 검색 기능
- Method별 색상
- 상태 코드 필터
- Request와 Response 접기

둘을 혼합하지 않는다.

---

# 중복 기록 방지

새 레코드를 생성하기 전에 다음 조건이 모두 같은 기록이 있는지 확인한다.

- Test Date
- Scenario ID
- Commit
- Executor

같은 테스트 실행이 이미 기록되어 있다면 새 레코드를 만들지 않는다.

기존 기록의 내용이 잘못됐다면 해당 레코드를 수정한다.

동일한 조건으로 의도적으로 재실행한 경우 제목에 실행 순서를 추가하고 새 레코드를 생성한다.

예시:

```text
[System Test] Capture Analysis Basic Journey - 2026-07-13 #2
````

---

# 기록 완료 기준

다음 조건을 모두 만족해야 Notion 기록 완료로 판단한다.

* Database 속성 필수값이 입력됐다.
* Scenario와 실행 환경이 기록됐다.
* 실행한 테스트와 결과가 기록됐다.
* Database와 화면 비교 결과가 기록됐다.
* 사용자 관점 검토가 기록됐다.
* 발견한 Issue가 재현 가능한 형태로 작성됐다.
* 최종 결과가 `PASS / PARTIAL / FAIL / BLOCKED` 중 하나로 지정됐다.
* 다음 Requirement 후보가 필요한 경우 작성됐다.

기록 완료 후 사용자에게 다음 내용을 보고한다.

* 생성하거나 수정한 Notion 기록 제목
* 최종 테스트 결과
* 발견한 Issue 수
* Follow-up 필요 여부
* Notion 페이지 위치
