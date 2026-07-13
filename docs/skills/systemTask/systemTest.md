# SystemTest

이 문서는 FlowTool의 System Test를 수행하기 위한 메인 진입 문서이다.

사용자가 System Test를 요청하면
CODEX는 본 문서를 시작점으로 테스트를 수행한다.

---

# 목적

Feature Verification은
이번 작업이 정상적으로 구현되었는지 검증한다.

System Test는
현재까지 구현된 기능들이 하나의 시스템으로 정상 동작하는지 검증한다.

또한 실제 사용자의 관점에서

- 기능 누락
- 사용성 문제
- 데이터 불일치
- 개선 포인트

를 발견하는 것을 목표로 한다.

---

# 실행 대상

System Test는 사용자가 명시적으로 요청한 경우에만 수행한다.

예시

- "System Test 진행해줘."
- "Capture 기본 시나리오 테스트해줘."
- "System Test Skill 참고해서 테스트해줘."

자동으로 실행하지 않는다.

---

# 수행 절차

System Test는 아래 순서로 수행한다.

1. strategy.md 확인
2. execution.md 확인
3. Scenario 선택
4. 테스트 수행
5. 결과 정리
6. Notion 기록

---

# 실행 원칙

- Feature를 수정하지 않는다.
- 테스트 중 발견한 문제를 임의로 수정하지 않는다.
- 테스트 결과를 기반으로 Issue를 기록한다.
- 수정이 필요한 사항은 다음 Requirement 후보로 제안한다.