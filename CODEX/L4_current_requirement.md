# current_requirement.md

# 현재 작업 지시

## 현재 목표

Express.js + TypeScript 기반의 FlowTool Backend MVP 프로젝트를 초기 구성하고,
HTTP Capture Middleware를 구현할 수 있는 기반을 마련한다.

현재 프로젝트는 Backend, Frontend 등을 하나의 Repository에서 관리하는 Monorepo 형태를 지향한다.

따라서 이번 작업에서는 Express.js Backend 프로젝트를 반드시 `backend/` 폴더 하위에 구성한다.

---

## 이번 작업 범위

이번 작업에서 구현한다.

- `backend/` 폴더 생성
- `backend/` 하위에 Express.js + TypeScript 프로젝트 초기 생성
- Backend 기본 디렉터리 구조 생성
- PostgreSQL 연결 설정
- CaptureLog 모델 정의
- Capture Middleware 구현
- 테스트용 API 작성
- 검증 스크립트 작성

이번 작업에서는 Frontend 및 AI 기능은 구현하지 않는다.

---

## Capture Middleware 수집 대상

- method
- path
- query
- requestHeaders
- requestBody
- responseStatus
- responseBody
- durationMs
- errorMessage
- createdAt

---

## 권장 Backend 구조

아래 구조를 기준으로 구성한다.

```txt
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── utils/
│   └── types/
└── scripts/
```
필요하지 않은 폴더는 생성하지 않아도 된다.

---

## 완료 기준

아래 조건을 모두 만족하면 이번 작업은 완료로 판단한다.

- backend/ 하위에 Express.js + TypeScript 프로젝트가 생성된다.
- 프로젝트가 정상 실행된다.
- Express 서버가 정상 실행된다.
- PostgreSQL 연결이 성공한다.
- HTTP 요청이 Capture Middleware를 통과한다.
- Capture Log가 PostgreSQL에 저장된다.
- PostgreSQL MCP로 저장 결과를 확인할 수 있다.
- 검증 스크립트가 정상 동작한다.
---

## 검증 방법

작업 완료 후 반드시 수행한다.

- Backend 서버 실행 확인
- 테스트 요청 실행
- 검증 스크립트 실행
- PostgreSQL MCP를 이용한 Capture Log 저장 확인
---

## 작업 완료 후

반드시 수행한다.

- Notion Development History 기록
- L4_progress.md 업데이트
- 작업 결과 보고

---

## 이번 작업에서 제외
- Frontend
- 인증 및 권한
- AI 기능
- Trace 비교
- OpenTelemetry
- Docker 배포
- Kubernetes 지원

---

## 참고 문서

작업 시작 전 반드시 확인한다.

- AGENT.md
- L1_coding_rules.md
- L1_mvp_scope.md
- L2_architecture.md
- L2_entity_model.md
- L2_api_spec.md
- L2_ai_workflow.md
- L2_mcp_workflow.md
- L3_test_strategy.md
- L4_progress.md

현재는 Backend 프로젝트 초기 구성 및 HTTP Capture 기반 마련에만 집중한다.