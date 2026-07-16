# mcp_workflow.md

# MCP 활용 가이드 문서

---

# 목적

FlowTool 개발 시 MCP를 활용하여:

* 개발 서버 실행 및 상태 확인
* 브라우저 상태 확인
* HTTP 요청 검증
* Runtime 상태 확인
* UI 테스트
* Console 검증
* DB 저장 결과 검증
* 작업 결과 기록

을 수행한다.

---

# MCP 사용 원칙

MCP는 구현을 대신하는 도구가 아니라,
구현 결과를 검증하고 개발 환경을 안정적으로 관리하기 위한 도구이다.

가능한 경우 구현 후 반드시 하나 이상의 MCP를 이용하여
동작 여부를 검증한다.

Frontend 또는 Backend 실행이 필요한 브라우저 검증에서는
사용자가 수동으로 서버를 실행하도록 요청하지 않는다.

또한 Codex가 임시 PowerShell 프로세스나 백그라운드 명령으로
직접 `npm run dev`를 실행하지 않는다.

Backend와 Frontend 서버 실행 및 종료는
반드시 FlowTool Server Manager MCP를 사용한다.

MCP 검증 결과는 필요 시 Notion Development History에 기록한다.

---

# 사용 MCP

## FlowTool Server Manager MCP

사용 목적

* Backend 개발 서버 실행
* Backend HTTP Ready 확인
* Frontend 개발 서버 실행
* Frontend HTTP Ready 확인
* Backend와 Frontend 프로세스 상태 확인
* 서버 PID 및 종료 코드 확인
* 브라우저 검증 완료 후 서버 종료

제공 도구

### `start_flowtool_servers`

역할

* Backend 개발 서버 실행
* Backend HTTP Ready 확인
* Frontend 개발 서버 실행
* Frontend HTTP Ready 확인
* Backend와 Frontend PID 반환

사용 시점

* Playwright MCP 검증 전
* Chrome DevTools MCP 검증 전
* Backend와 Frontend를 함께 사용하는 통합 검증 전

성공 조건

* Backend 프로세스가 실행 중이다.
* Frontend 프로세스가 실행 중이다.
* Backend HTTP Ready 상태가 정상이다.
* Frontend HTTP Ready 상태가 정상이다.
* Backend PID가 반환된다.
* Frontend PID가 반환된다.

---

### `get_flowtool_server_status`

역할

* Backend와 Frontend 프로세스 생존 여부 확인
* Backend와 Frontend PID 확인
* 종료 코드 확인
* Backend HTTP 응답 여부 확인
* Frontend HTTP 응답 여부 확인

사용 시점

* 서버 실행 직후
* Playwright MCP 또는 Chrome DevTools MCP 검증 직전
* 브라우저 접속 실패 시
* 브라우저 검증 직후
* 서버 종료 전

검증 항목

* Backend 프로세스가 살아 있는가
* Frontend 프로세스가 살아 있는가
* 종료 코드가 발생하지 않았는가
* Backend HTTP 응답이 정상인가
* Frontend HTTP 응답이 정상인가

---

### `stop_flowtool_servers`

역할

* Frontend 프로세스 트리 종료
* Backend 프로세스 트리 종료
* MCP 내부 프로세스 상태 초기화

사용 시점

* 브라우저 검증 완료 후
* 브라우저 검증 실패 후
* 서버 Ready 확인 실패 후
* 작업 중 오류 발생 시
* 작업 중단 시

검증 성공 여부와 관계없이
Server Manager MCP로 실행한 서버는 반드시 종료한다.

---

## PostgreSQL MCP

사용 목적

* Capture Log 저장 확인
* Query API 조회 결과 비교
* DB 상태 확인
* Query API 호출 전후 데이터 개수 비교

사용 시점

* Repository 구현 후
* API 테스트 후
* 데이터 저장 로직 수정 후
* DB 스키마 변경 후
* Capture 저장 또는 Query 책임 수정 후

검증 항목

* 데이터 저장 여부
* 컬럼 값
* NULL 여부
* API 응답과 DB 데이터 일치 여부
* Query API 호출로 Capture Log가 증가하지 않는지 여부

---

## Chrome DevTools MCP

사용 목적

* Network 확인
* Console 확인
* HTTP Request 및 Response 상세 확인

사용 시점

* UI 작업 후
* Frontend API 호출 경로 변경 후
* 브라우저 Console 또는 Network 확인이 필요한 경우

검증 항목

* HTTP Request
* HTTP Response
* 요청 URL
* HTTP Status
* Network Error
* Console Error
* 화면 렌더링 상태

Chrome DevTools MCP 사용 전에는
FlowTool Server Manager MCP로 서버 상태가 정상인지 먼저 확인한다.

---

## Playwright MCP

사용 목적

* 주요 사용자 시나리오 검증
* 화면 이동 및 동작 확인
* Frontend 회귀 검증
* 기본 E2E 흐름 확인

검증 항목

* 주요 사용자 시나리오
* 버튼 클릭
* 페이지 이동
* 화면 렌더링
* 목록 조회
* 상세 조회
* 로딩 상태
* 빈 상태
* 404 상태
* API 실패 상태

사용 시점

* 화면 기능 구현 후
* Frontend API 연동 변경 후
* 라우팅 변경 후
* Backend 변경이 기존 화면에 영향을 줄 수 있는 경우

Playwright MCP 사용 전에는
FlowTool Server Manager MCP로 서버 상태가 정상인지 먼저 확인한다.

Frontend 접속 주소는 아래로 통일한다.

```text
http://localhost:5173
```

`127.0.0.1` 또는 추측한 다른 포트를 사용하지 않는다.

---

## Notion MCP

사용 목적

* 작업 결과 기록
* 테스트 결과 저장
* 개발 히스토리 관리

사용 시점

* 기능 구현 완료 후
* 테스트 완료 후
* MCP 검증 완료 후

기록 항목

* 작업 요약
* 테스트 결과
* MCP 검증 결과
* 변경 파일
* 특이사항
* 다음 작업

---

# 개발 서버 실행 원칙

브라우저 검증이 필요한 경우
Backend와 Frontend 서버는 반드시 FlowTool Server Manager MCP를 사용하여 실행한다.

아래 방식으로 직접 서버를 실행하지 않는다.

```powershell
npm run dev
```

```powershell
Start-Process powershell.exe ...
```

```powershell
Start-Process npm.cmd ...
```

사용자가 수동으로 서버를 실행하도록 요청하지 않는다.

브라우저 검증이 필요하지 않은 아래 작업에서는
Server Manager MCP를 사용하지 않아도 된다.

* 문서만 수정하는 작업
* Backend Build만 확인하는 작업
* Frontend Build만 확인하는 작업
* TypeScript 타입 검사
* PostgreSQL MCP만 필요한 DB 검증
* 브라우저 동작에 영향을 주지 않는 내부 리팩터링

---

# 브라우저 검증 표준 흐름

Frontend 또는 통합 브라우저 검증이 필요한 경우
반드시 아래 순서를 따른다.

```text
1. start_flowtool_servers
2. get_flowtool_server_status
3. Playwright MCP 또는 Chrome DevTools MCP 검증
4. get_flowtool_server_status
5. 필요한 경우 PostgreSQL MCP 검증
6. stop_flowtool_servers
7. 서버 종료 결과 확인
```

---

## 1. 서버 실행

`start_flowtool_servers`를 호출한다.

아래 조건을 모두 만족해야 다음 단계로 진행한다.

* Backend HTTP Ready 정상
* Frontend HTTP Ready 정상
* Backend PID 반환
* Frontend PID 반환

서버가 Ready 상태가 아니면
Playwright MCP 또는 Chrome DevTools MCP 검증을 시작하지 않는다.

---

## 2. 서버 상태 확인

`get_flowtool_server_status`를 호출한다.

아래 항목을 확인한다.

* Backend 프로세스 생존
* Frontend 프로세스 생존
* Backend 종료 코드 없음
* Frontend 종료 코드 없음
* Backend HTTP 응답 정상
* Frontend HTTP 응답 정상

하나라도 만족하지 않으면
브라우저 MCP 문제가 아니라 서버 실행 문제로 판단한다.

---

## 3. 브라우저 MCP 검증

서버 상태가 정상임을 확인한 뒤
Playwright MCP 또는 Chrome DevTools MCP를 사용한다.

Playwright MCP는 사용자 흐름과 화면 상태를 검증한다.

Chrome DevTools MCP는 Network와 Console을 검증한다.

필요한 경우 둘을 함께 사용할 수 있다.

---

## 4. 접속 실패 처리

Playwright MCP 또는 Chrome DevTools MCP에서
`ERR_CONNECTION_REFUSED`, Timeout 등 접속 오류가 발생하면
즉시 애플리케이션 기능 실패로 판단하지 않는다.

먼저 `get_flowtool_server_status`를 다시 호출한다.

### 서버 상태가 비정상인 경우

예시

* Backend 또는 Frontend 프로세스 종료
* 종료 코드 존재
* HTTP Ready가 false

판단

> 개발 서버 실행 또는 유지 실패

브라우저 MCP 실패로 기록하지 않는다.

### 서버 상태가 정상인 경우

예시

* Backend와 Frontend 프로세스 생존
* Backend와 Frontend HTTP 응답 정상
* Playwright MCP 또는 Chrome DevTools MCP만 접속 실패

판단

> 브라우저 MCP 런타임 접근 문제

애플리케이션 기능 실패와 구분하여 기록한다.

---

## 5. 서버 종료

검증 성공 여부와 관계없이
`stop_flowtool_servers`를 반드시 호출한다.

아래 상황에서도 서버를 종료한다.

* Playwright MCP 검증 성공
* Playwright MCP 검증 실패
* Chrome DevTools MCP 검증 실패
* PostgreSQL MCP 검증 실패
* 서버 Ready 확인 실패
* 작업 중 예외 발생
* 검증 도중 작업 중단

---

## 6. 종료 확인

서버 종료 후 필요한 경우
`get_flowtool_server_status`를 다시 호출한다.

완료 조건

* Backend 프로세스가 실행 중이지 않다.
* Frontend 프로세스가 실행 중이지 않다.
* Backend와 Frontend 프로세스 트리가 종료되었다.
* MCP 내부 프로세스 상태가 초기화되었다.

서버 프로세스가 남아 있으면
작업 완료로 간주하지 않는다.

---

# MCP 사용 순서

일반적인 작업은 아래 순서를 따른다.

1. 기능 구현
2. Build 및 TypeScript 검사
3. 테스트 또는 검증 스크립트 실행
4. 브라우저 검증이 필요하면 `start_flowtool_servers` 호출
5. `get_flowtool_server_status`로 서버 상태 확인
6. Playwright MCP 또는 Chrome DevTools MCP 검증
7. 필요한 경우 PostgreSQL MCP 검증
8. `stop_flowtool_servers`로 서버 종료
9. 서버 종료 결과 확인
10. Notion MCP 기록
11. progress.md 업데이트

---

# MCP 검증 결과 보고

작업 완료 보고에는 사용한 MCP와 결과를 구분하여 작성한다.

FlowTool Server Manager MCP를 사용한 경우 아래 내용을 포함한다.

* `start_flowtool_servers` 결과
* Backend PID
* Frontend PID
* 서버 HTTP Ready 결과
* 브라우저 검증 직전 서버 상태
* Playwright MCP 또는 Chrome DevTools MCP 결과
* 브라우저 검증 직후 서버 상태
* `stop_flowtool_servers` 결과
* 잔존 프로세스 여부

예시

```text
FlowTool Server Manager MCP
- start_flowtool_servers: 성공
- Backend PID: 12345
- Frontend PID: 23456
- Backend HTTP Ready: 정상
- Frontend HTTP Ready: 정상
- 브라우저 검증 직전 상태: 정상
- Playwright MCP 검증: 성공
- stop_flowtool_servers: 성공
- 잔존 서버 프로세스: 없음
```

MCP 검증 실패 시 아래 중 하나로 원인을 구분한다.

* 서버 실행 실패
* 서버 프로세스 유지 실패
* 브라우저 MCP 런타임 접근 실패
* 애플리케이션 기능 실패
* DB 검증 실패

모든 MCP 실패를 하나의 원인으로 기록하지 않는다.
