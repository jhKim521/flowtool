# mcp_workflow.md

# MCP 활용 가이드 문서

---

# 목적

FlowTool 개발 시 MCP를 활용하여:

- 브라우저 상태 확인
- HTTP 요청 검증
- Runtime 상태 확인
- UI 테스트
- Console 검증

을 수행한다.

---

# MCP 사용 원칙

MCP는 구현을 대신하는 도구가 아니라,
구현 결과를 검증하기 위한 도구이다.

가능한 경우 구현 후 반드시 하나 이상의 MCP를 이용하여
동작 여부를 검증한다.

MCP 검증 결과는 필요 시 Notion Development History에 기록한다.

---

# 사용 MCP

## PostgreSQL MCP

사용 목적

- Trace 저장 확인
- Capture Log 확인
- DB 상태 확인

사용 시점

- Repository 구현 후
- API 테스트 후
- 데이터 저장 로직 수정 후
- DB 스키마 변경 후

검증 항목

- 데이터 저장 여부
- 컬럼 값
- NULL 여부

## Chrome DevTools MCP

사용 목적

- Network 확인
- Console 확인

사용 시점

- UI 작업 후

검증 항목

- HTTP Request
- HTTP Response
- Network Error
- Console Error
- 화면 렌더링 상태

## Playwright MCP

검증 항목

- 주요 사용자 시나리오
- 버튼 클릭
- 페이지 이동
- 화면 렌더링
- 기본 E2E 테스트

사용 시점

- 화면 기능 구현 후

## Notion MCP

사용 목적

- 작업 결과 기록
- 테스트 결과 저장
- 개발 히스토리 관리

사용 시점

- 기능 구현 완료 후
- 테스트 완료 후
- MCP 검증 완료 후

기록 항목

- 작업 요약
- 테스트 결과
- MCP 검증 결과
- 변경 파일
- 다음 작업


---

# MCP 사용 순서

일반적인 작업은 아래 순서를 따른다.

1. 기능 구현
2. 테스트 실행
3. PostgreSQL MCP 검증
4. Chrome 또는 Playwright MCP 검증
5. Notion MCP 기록
6. progress.md 업데이트
