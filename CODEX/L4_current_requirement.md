# L4_current_requirement.md

# 현재 작업 지시

## 현재 프로젝트 상태

이전 작업에서 아래 기능까지 완료되었다.

* Express.js + TypeScript Backend 프로젝트 초기 구성
* PostgreSQL 연결
* HTTP Capture Middleware 구현
* Capture Log 저장
* Capture Log 목록 조회 API 구현
* Capture Log 단건 조회 API 구현
* 존재하지 않는 Capture Log 조회 시 404 예외 처리
* 자동 검증 스크립트 작성
* PostgreSQL MCP를 이용한 저장 및 조회 결과 검증
* TypeScript 설정 오류 및 IDE Problems 해결

현재 사용할 수 있는 Backend API는 다음과 같다.

```
GET /capture-logs
GET /capture-logs/:id
```

이번 작업에서는 이미 구현된 Backend API를 변경하거나 새로운 Backend 기능을 추가하지 않는다.

---

# 현재 목표

React + Vite 기반 Frontend 프로젝트를 `frontend/` 폴더 하위에 구성하고, 현재 구현된 Capture Log 목록 조회 API를 이용해 저장된 HTTP Capture Log를 확인할 수 있는 최소한의 조회 화면을 구현한다.

이번 작업은 디자인 완성이 목적이 아니다.

사용자가 브라우저에서 Capture Log 목록을 확인할 수 있는 최소한의 동작을 완성하는 데 집중한다.

---

# Sprint Goal

이번 작업에서는 아래 흐름만 완성한다.

```
Backend Capture Log 조회 API
        ↓
Frontend API 호출
        ↓
Capture Log 목록 화면 표시
```

새로운 기능이나 불필요한 구조 개선은 추가하지 않는다.

---

# 이번 작업 범위

이번 작업에서는 아래 항목만 구현한다.

* Repository 루트의 `frontend/` 폴더 생성
* `frontend/` 하위에 React + Vite + TypeScript 프로젝트 구성
* Frontend 실행 환경 구성
* Backend API Base URL 설정
* Capture Log 목록 조회 API 연동
* Capture Log 목록 화면 구현
* 로딩 상태 처리
* 빈 목록 상태 처리
* API 요청 실패 상태 처리
* Frontend 빌드 및 브라우저 동작 검증

Frontend 관련 모든 파일은 반드시 `frontend/` 폴더 하위에 작성한다.

기존 `backend/` 구조는 유지한다.

---

# 기술 기준

Frontend 기술은 기존 아키텍처 문서를 따른다.

* React
* Vite
* TypeScript

MVP 단계이므로 별도의 전역 상태 관리 라이브러리는 사용하지 않는다.

API 호출은 현재 프로젝트에 이미 정해진 방식이 있다면 해당 방식을 따른다.

정해진 방식이 없다면 브라우저 기본 `fetch`를 우선 사용한다.

단순 목록 화면 구현을 위해 불필요한 라이브러리를 추가하지 않는다.

---

# 권장 Frontend 구조

아래 구조를 기준으로 필요한 파일만 생성한다.

```txt
frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── api/
    ├── components/
    ├── types/
    └── styles/
```

현재 작업에 필요하지 않은 폴더는 생성하지 않아도 된다.

과도한 계층 분리나 추상화는 하지 않는다.

---

# 환경 변수

Backend 주소는 코드에 직접 고정하지 않고 Vite 환경 변수로 관리한다.

예시:

```env
VITE_API_BASE_URL=http://localhost:3000
```

실제 비밀 정보가 포함된 `.env` 파일은 Git에 포함하지 않는다.

필요한 환경 변수 구조는 `.env.example`에 작성한다.

---

# 구현 화면

## Capture Log 목록 화면

현재는 하나의 목록 화면만 구현한다.

화면에서는 `GET /capture-logs` API를 호출하여 Capture Log를 최신순으로 표시한다.

Backend에서 반환하는 정렬 순서를 그대로 사용하며, Frontend에서 별도의 정렬 기능은 구현하지 않는다.

각 목록 항목에는 최소한 아래 정보만 표시한다.

* HTTP Method
* Path
* Response Status
* Duration
* Created At

Backend 응답 필드명을 먼저 확인하고 실제 응답 구조에 맞게 구현한다.

---

# 화면 상태 처리

## 로딩 상태

API 응답을 기다리는 동안 사용자가 데이터를 불러오는 중임을 알 수 있어야 한다.

예시:

```txt
Loading capture logs...
```

---

## 빈 목록 상태

조회 결과가 비어 있다면 오류로 처리하지 않고 빈 상태 메시지를 표시한다.

예시:

```txt
No capture logs found.
```

---

## 오류 상태

Backend 서버가 실행되지 않았거나 API 요청이 실패한 경우 오류 메시지를 표시한다.

에러 내용을 과도하게 노출하지 않고, 사용자가 조회 실패를 인지할 수 있는 수준으로 표시한다.

예시:

```txt
Failed to load capture logs.
```

---

# 최소 UI 원칙

이번 작업에서는 기능 확인을 위한 최소 UI만 구현한다.

허용 범위:

* 기본적인 제목
* 목록 또는 테이블 형태
* 읽을 수 있는 최소 간격
* HTTP Method, Status 등의 텍스트 표시
* 로딩·빈 상태·오류 메시지

디자인 시스템이나 완성도 높은 스타일링은 요구하지 않는다.

브라우저 기본 스타일 또는 최소한의 CSS만 사용한다.

---

# 완료 기준

아래 조건을 모두 만족하면 이번 작업은 완료로 판단한다.

* `frontend/` 하위에 React + Vite + TypeScript 프로젝트가 구성된다.
* Frontend 개발 서버가 정상 실행된다.
* Backend의 `GET /capture-logs` API가 호출된다.
* 조회된 Capture Log가 브라우저 화면에 표시된다.
* HTTP Method가 표시된다.
* Path가 표시된다.
* Response Status가 표시된다.
* Duration이 표시된다.
* Created At이 표시된다.
* 로딩 상태가 표시된다.
* 빈 목록 상태가 표시된다.
* API 실패 상태가 표시된다.
* Frontend 빌드가 성공한다.
* TypeScript Error가 없다.
* IDE Problems 기준 Error가 남아 있지 않다.
* 브라우저에서 실제 조회 동작을 검증한다.

---

# 검증 방법

작업 완료 후 반드시 아래 검증을 수행한다.

## 1. Backend 실행

Backend 서버를 실행한다.

```bash
cd backend
npm run dev
```

---

## 2. Capture 데이터 준비

기존 테스트 API 또는 검증 스크립트를 이용해 Capture Log가 DB에 존재하도록 준비한다.

필요한 경우 기존 검증 명령을 사용한다.

```bash
npm run verify:capture-logs
```

검증 과정에서 기존 데이터를 불필요하게 삭제하지 않는다.

---

## 3. Frontend 실행

별도의 터미널에서 Frontend 개발 서버를 실행한다.

```bash
cd frontend
npm install
npm run dev
```

---

## 4. 브라우저 검증

브라우저에서 Frontend에 접속하여 아래를 확인한다.

* 화면이 정상 표시되는가
* Capture Log 목록이 조회되는가
* Backend 데이터와 화면 데이터가 일치하는가
* Method, Path, Status, Duration, Created At이 표시되는가
* 새로고침해도 목록을 다시 조회하는가

---

## 5. 상태별 검증

아래 상태를 가능한 범위에서 확인한다.

* 정상 조회
* 조회 결과 없음
* Backend 중단 또는 잘못된 API 주소로 인한 요청 실패

테스트를 위해 구현 코드를 임시 변경했다면 검증 후 반드시 원래 상태로 복구한다.

---

## 6. 빌드 및 정적 검증

Frontend 폴더에서 아래 검증을 수행한다.

```bash
npm run build
```

프로젝트에 별도의 lint 명령이 정의되어 있다면 함께 실행한다.

```bash
npm run lint
```

다음 항목도 확인한다.

* TypeScript 컴파일 오류 없음
* Deprecated 설정 경고 없음
* IDE Problems 기준 Error 없음
* 새로 추가된 설정 파일에 오류 없음

---

## 7. 필요 시 MCP 검증

브라우저 동작 검증에 Chrome DevTools MCP 또는 Playwright MCP를 사용할 수 있다.

MCP를 사용한 경우 실제 확인한 항목과 결과를 작업 보고에 기록한다.

---

# 작업 완료 후

반드시 아래 항목을 수행한다.

* Notion Development History 업데이트
* L4_progress.md 업데이트
* JournalGuide.md 기준으로 오늘 Journal 작성
* EndTask.md 기준으로 Git 변경사항 검토
* 적절한 Conventional Commit 메시지 선정
* Git Commit
* Git Push
* 작업 결과 보고

L4_progress.md에서는 아래 상태를 반영한다.

* Frontend 프로젝트 생성: 완료
* Capture Log 목록 화면: 완료
* Capture Log 상세 화면: 다음 작업

---

# 이번 작업에서 제외

이번 작업에서는 아래 기능을 구현하지 않는다.

* Capture Log 상세 화면
* `GET /capture-logs/:id` 화면 연동
* 검색
* 필터
* 정렬 기능
* 페이징
* 자동 새로고침
* 실시간 통신
* 데이터 수정
* 데이터 삭제
* 인증 및 권한
* 차트
* 타임라인
* 다크 모드
* 반응형 디자인 최적화
* 디자인 시스템
* UI 컴포넌트 라이브러리 도입
* 상태 관리 라이브러리 도입
* AI 기능
* Backend API 변경
* Spring Starter
* Node SDK
* OpenTelemetry
* Docker 및 배포 설정

---

# 다음 작업

이번 작업이 완료되면 다음 작업으로 아래 항목 하나를 제안한다.

> Capture Log 단건 조회 API를 연결하여 Capture Log 상세 화면을 구현한다.

다음 작업에서도 디자인, 검색, 필터 등의 기능은 추가하지 않는다.

---

# 참고 문서

작업 시작 전 반드시 아래 문서를 확인한다.

* AGENT.md
* L1_coding_rules.md
* L1_mvp_scope.md
* L2_architecture.md
* L2_entity_model.md
* L2_api_spec.md
* L2_mcp_workflow.md
* L3_test_strategy.md
* StartTask.md
* EndTask.md
* JournalGuide.md
* L4_progress.md

현재는 React + Vite Frontend 초기 구성과 Capture Log 목록 조회 화면 구현에만 집중한다.
