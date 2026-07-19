# FlowTool

> HTTP 요청 흐름을 수집하고 추적하는 개발 지원 도구  
> **100% AI(Vibe Coding) 기반으로 개발 중인 개인 프로젝트**

---

# 프로젝트 소개

FlowTool는 개발 중 발생하는 HTTP 요청과 응답을 수집하고 저장하여,
개발자가 요청 흐름을 빠르게 분석할 수 있도록 돕는 개발 지원 도구입니다.

현재는 MVP 단계로, Proxy 기반 HTTP Capture 구조로 전환하며 구현하고 있으며,
향후 Spring Starter와 Node SDK를 통해 애플리케이션 내부 처리 흐름까지 추적하는 것을 목표로 하고 있습니다.

---

# 프로젝트 목표

FlowTool의 최종 목표는 다음과 같습니다.

- Proxy 기반 HTTP 요청 및 응답 수집
- 요청 흐름(Trace) 추적
- 요청/응답 데이터 조회
- 오류 발생 원인 분석 지원
- 개발 중 디버깅 생산성 향상

---

# 개발 철학

이 프로젝트는 **100% AI 기반(Vibe Coding)** 으로 개발됩니다.

직접 코드를 작성하기보다 AI Agent(Codex)와 MCP(Model Context Protocol)를 활용하여 다음과 같은 개발 프로세스를 구축했습니다.

```text
문서 기반 요구사항 정의

↓

AI 구현

↓

자동 테스트

↓

MCP 검증

↓

개발 히스토리 기록
```

AI는 단순히 코드를 생성하는 것이 아니라,

- 구현
- 테스트
- 검증
- 작업 기록

까지 하나의 작업 단위로 수행하도록 설계했습니다.

---

# 기술 스택

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL

## Frontend

- React
- Vite
- TypeScript

## AI & Development Tools

- OpenAI Codex
- PostgreSQL MCP
- Chrome DevTools MCP
- Playwright MCP
- Notion MCP

---

# 프로젝트 구조

```text
FlowTool

├── backend/        Express Backend
├── frontend/       React Frontend
├── CODEX/          AI 개발 문서
├── docs/           프로젝트 문서
└── README.md
```

---

# 개발 문서

FlowTool는 문서 기반 개발(Document Driven Development)을 지향합니다.

주요 문서는 다음과 같습니다.

- AGENT.md
- coding_rules.md
- architecture.md
- entity_model.md
- api_spec.md
- mvp_scope.md
- ai_workflow.md
- mcp_workflow.md
- test_strategy.md
- systemTask/

AI는 위 문서를 참고하여 구현을 진행합니다.

---

# 현재 구현 상태 (MVP)

현재 구현 완료

- Express.js Backend 초기 구성
- PostgreSQL 연동
- HTTP Capture Middleware
- Capture Log 저장
- 테스트 API
- Capture 자동 검증 스크립트
- Capture Log 목록 조회 API
- Capture Log 단건 상세 조회 API
- Query API 분리 (`GET /api/captures`, `GET /api/captures/:id`)
- FlowTool 내부 API 자동 Capture 제외
- Proxy Core 구현 (`ANY /proxy`)
- Target Application 요청/응답 중계
- Proxy 요청 및 응답 Capture Log 저장
- Proxy 전용 데이터 모델 일부 반영 (`sourceService`, `targetUrl`, `responseHeaders`)
- 존재하지 않는 Capture Log 조회 시 404 처리
- React + Vite Frontend 초기 구성
- Capture Log 목록 화면
- Capture Log 상세 화면
- 로딩 / 빈 목록 / 오류 상태 처리
- System Test 전략 및 기본 Capture 시나리오 문서화
- Notion 기반 Development History / System Test History 기록 흐름

진행 예정

- Proxy 오류 처리
- Proxy 데이터 모델 화면 반영
- Dashboard UI 개선
- Spring Starter
- Node SDK
- Trace 기반 요청 흐름 시각화

---

# 실행 방법

```bash
cd backend
npm install
npm run dev
```

Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

Backend 검증

```bash
npm run verify:capture
npm run verify:capture-logs
npm run verify:no-auto-capture
npm run verify:proxy-core
```

Frontend 검증

```bash
cd frontend
npm run build
```

---

# 프로젝트 특징

- AI와 협업하는 개발 프로세스 구축
- 문서 기반 개발
- MCP를 활용한 자동 검증
- 개발 히스토리 관리
- Feature Verification과 System Test 분리
- MVP 중심의 점진적 개발
