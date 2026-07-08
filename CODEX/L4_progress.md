# progress.md

# FlowTool 진행 상황

이 문서는 FlowTool 프로젝트의 현재 진행 상태와 다음 작업 계획을 관리한다.

현재 진행 상황은 항상 이 문서를 기준으로 판단한다.

---

# 현재 프로젝트 상태

현재 단계

> **Backend MVP 초기 구현 및 Capture Log 저장 검증 완료**

현재 목표

> **HTTP 요청과 응답을 수집하고 PostgreSQL에 저장하는 첫 번째 MVP 기능을 구현한다.**

---

# 완료된 작업

## 프로젝트 기획

* 프로젝트 방향 정의
* MVP 범위 정의
* 개발 전략 수립

---

## 개발 문서

완료

* AGENT.md
* coding_rules.md
* architecture.md
* api_spec.md
* entity_model.md
* mvp_scope.md
* ai_workflow.md
* mcp_workflow.md
* test_strategy.md

---

## 개발 환경

완료

* Codex 개발 환경 구성
* PostgreSQL MCP 연결
* Notion MCP 연동
* 개발 히스토리 DB 생성

---

## Backend MVP 초기 구성

완료

* `backend/` 하위 Express.js + TypeScript 프로젝트 구성
* PostgreSQL 연결 설정 추가
* `capture_logs` 테이블 초기화 SQL 정의
* CaptureLog 모델, Repository, Service 구현
* HTTP Capture Middleware 구현
* 테스트용 API 작성
* Capture 저장 검증 스크립트 작성

검증

* `npm run build` 성공
* `npm run verify:capture` 성공
* PostgreSQL MCP 연결 확인: `flowtool_dev` DB / `codex` 사용자
* PostgreSQL MCP로 `capture_logs` 테이블 및 저장 데이터 확인

현재 이슈

* 없음

---

# 현재 진행 중

현재 작업

* Capture 조회 API 구현 준비

---

# 다음 작업

## 1순위 (완료)

* PostgreSQL 쓰기 계정 또는 `DATABASE_URL` 설정
* Capture Log 저장 확인
* PostgreSQL MCP 저장 결과 확인

완료 기준

* 요청 발생 시 Capture Log가 저장된다. 완료
* PostgreSQL MCP로 저장 결과를 확인할 수 있다. 완료
* 자동 검증 명령을 실행할 수 있다. 완료

---

## 2순위 (다음 작업)

* Capture 조회 API
* 실패 요청 조회
* 기본 예외 처리

---

## 3순위

* Frontend 기본 화면
* Capture 목록 조회
* Capture 상세 조회

---

## 4순위

* Playwright 검증
* AI 로그 요약
* 기본 분석 기능

---

# MVP 진행률

| 항목           | 상태    |
| ------------ | ----- |
| 프로젝트 기획      | 완료    |
| 문서 작성        | 완료    |
| 개발 환경 구성     | 완료    |
| Backend 구현   | 일부 완료 |
| Frontend 구현  | 진행 예정 |
| MCP 검증       | 일부 완료 |
| GitHub 포트폴리오 | 진행 예정 |

---

# 현재 우선순위

현재는 새로운 기능을 추가하지 않는다.

우선순위는 아래와 같다.

1. HTTP Capture 구현
2. PostgreSQL 저장
3. 자동 검증
4. MCP 검증
5. Frontend 조회
6. AI 기능

---

# 현재 주의 사항

현재 프로젝트는 MVP 단계이다.

따라서 아래 원칙을 따른다.

* 하나의 기능만 구현한다.
* 구현과 검증을 함께 진행한다.
* Notion Development History를 지속적으로 기록한다.
* 과도한 추상화를 하지 않는다.
* 동작하는 MVP를 최우선으로 한다.

---

# 다음 작업 선정 기준

다음 작업은 아래 기준으로 선택한다.

* 현재 MVP 목표에 직접 기여하는가
* 3시간 이내에 완료 가능한가
* 구현 후 검증이 가능한가
* GitHub 포트폴리오에 의미 있는 결과를 남길 수 있는가

---

# 프로젝트 목표

FlowTool의 현재 목표는 많은 기능을 구현하는 것이 아니다.

> **HTTP 요청을 수집하고 저장한 뒤, 개발자가 이를 조회하고 MCP를 이용해 검증할 수 있는 MVP를 완성하는 것**

이 목표를 만족할 때까지 새로운 기능 추가보다 핵심 기능 완성을 우선한다.
