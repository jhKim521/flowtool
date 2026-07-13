# System Test Execution

---

# Step 1

테스트 대상 Scenario를 확인한다.

예시

- basic_capture.md

---

# Step 2

테스트 환경을 확인한다.

- Backend 실행 여부
- Frontend 실행 여부
- PostgreSQL 실행 여부

필요 시 사용자에게 실행을 요청한다.

---

# Step 3

Scenario에 따라 테스트를 수행한다.

필요한 경우

- Playwright MCP
- PostgreSQL MCP
- Chrome DevTools MCP

를 이용하여 검증한다.

---

# Step 4

화면과 Database를 비교한다.

확인 항목

- 저장 데이터
- 조회 데이터
- 화면 데이터

---

# Step 5

사용성 문제를 확인한다.

예시

- 찾기 어려움
- 클릭이 직관적이지 않음
- JSON 가독성
- 정보 부족

---

# Step 6

발견한 문제를 정리한다.

문제를 발견했다고 해서

임의로 수정하지 않는다.

Issue만 기록한다.

---

# Step 7

최종 결과를 작성한다.

다음 내용을 포함한다.

- 실행한 Scenario
- 테스트 결과
- 발견한 문제
- 개선 아이디어
- 다음 Requirement 후보

---

# Step 8

결과를 Notion에 기록한다.

기록 형식은

report_template.md를 따른다.