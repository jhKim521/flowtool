# current_requirement.md

# STEP 10. Proxy Core 구현

---

# 목표

FlowTool의 Proxy Core를 구현한다.

Source Application으로부터 수신한 HTTP 요청을 Target Application으로 전달하고,
Target Application의 응답을 다시 Source Application으로 반환하는 기본 Proxy 기능을 구현한다.

이번 단계에서는 HTTP 요청과 응답을 정상적으로 중계하고,
중계 과정에서 Capture Log를 생성하는 것까지를 목표로 한다.

---

# 구현 범위

이번 작업에서는 아래 기능만 구현한다.

## Proxy 요청 처리

* Proxy API 구현
* Target URL 전달
* HTTP Method 전달
* Query Parameter 전달
* Request Header 전달
* Request Body 전달

---

## Proxy 데이터 모델 반영

Proxy 기능 구현에 필요한 Capture Log 필드를 DB 스키마에 추가한다.

추가 대상:

- `targetUrl`
- `responseHeaders`
- `sourceService` 필요 여부 검토

`sourceService` 자동 식별 기능은 이번 작업 범위에 포함하지 않는다.
값을 결정할 수 없는 경우 nullable로 저장한다. >> 이 경우엔 progress.md에 추후 작업 필요로 기록해둔다.

추가된 필드는 Capture 저장 로직과 Query API 응답에 함께 반영한다.

---

## Proxy 응답 처리

Target Application의 응답을 수신하여 Source Application에 그대로 반환한다.

전달 대상

* Response Status
* Response Header
* Response Body

---

## Capture Log 저장

Proxy 요청이 완료되면 요청과 응답 정보를 Capture Log로 저장한다.

Capture 대상

* HTTP Method
* Path
* Query Parameter
* Request Header
* Request Body
* Response Status
* Response Header
* Response Body
* Duration
* Error 정보(존재하는 경우)

Proxy 요청 1건당 Capture Log는 반드시 1건만 생성되어야 한다.

Proxy 내부 요청이나 Query API 호출이 별도의 Capture Log로 저장되어서는 안 된다.

---

# 완료 조건

아래 항목을 모두 만족해야 완료로 인정한다.

* Proxy API 구현 완료
* Target URL 전달 구현
* HTTP Method 전달
* Query Parameter 전달
* Request Header 전달
* Request Body 전달
* Target 응답 Status 수신
* Target 응답 Header 수신
* Target 응답 Body 수신
* Target 응답을 Source Application에 반환
* 중계 요청 및 응답 Capture Log 저장
* Proxy 요청당 Capture Log 1건 생성
* Proxy 요청 자체가 중복 Capture되지 않음

---

# 구현 제외 사항

이번 단계에서는 아래 항목을 구현하지 않는다.

* Retry
* Timeout 정책
* Circuit Breaker
* HTTPS 인증서 처리
* Streaming 응답
* WebSocket
* SSE(Server-Sent Events)
* 대용량 파일 업로드
* 압축(Gzip/Brotli) 최적화
* 성능 최적화
* SDK 연동

MVP 범위를 벗어나는 기능은 구현하지 않는다.

---

# 검증 방법

## Build 검증

* TypeScript Build 성공
* Type 오류 없음

---

## Proxy 기능 검증

FlowTool Server Manager MCP를 사용하여 Backend와 Frontend를 실행한다.

검증 항목

* Source → Proxy → Target 요청 전달
* HTTP Method 전달
* Query Parameter 전달
* Header 전달
* Request Body 전달
* Target 응답 정상 반환
* Response Status 전달
* Response Header 전달
* Response Body 전달

---

## PostgreSQL MCP 검증

아래 항목을 확인한다.

* Proxy 요청당 Capture Log 1건 생성
* Request 데이터 저장
* Response 데이터 저장
* Duration 저장
* Query API 호출이 Capture되지 않음
* 중복 Capture 발생하지 않음

---

## Chrome DevTools MCP 검증

필요한 경우 아래 항목을 확인한다.

* Network Request
* Network Response
* HTTP Status
* Console Error 없음

---

## Playwright MCP 검증

FlowTool Server Manager MCP를 통해 서버 실행 및 Ready 상태를 확인한 뒤 수행한다.

검증 항목

* Proxy 요청 정상 수행
* 정상 응답 반환
* 브라우저 Console Error 없음

검증 완료 후에는 FlowTool Server Manager MCP를 사용하여 서버를 종료한다.

---

# 작업 완료 후 수행 사항

* Build 확인
* MCP 검증 수행
* Journal 작성
* Git Commit
* Progress 문서 업데이트

---

# 참고 문서

* AGENT.md
* backend_spec.md
* api_spec.md
* coding_rules.md
* mcp_workflow.md
* progress.md
