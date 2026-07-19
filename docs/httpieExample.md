# HTTPie Examples

현재 FlowTool은 STEP 10 기준으로 전역 Capture Middleware를 사용하지 않는다.

따라서 아래 요청은 Capture Log를 자동 생성하지 않는다.

- `GET /health`
- `GET /api/captures`
- `GET /api/captures/:id`
- `POST /api/test/echo`
- `GET /api/test/error`

Capture Log 저장은 `POST /proxy` 요청을 통해 Target Application으로 실제 중계된 요청과 응답만 대상으로 한다.

---

## 1. Backend 실행

```bash
cd backend
npm run dev
```

다른 터미널에서 아래 HTTPie 명령을 실행한다.

---

## 2. Health Check

```bash
http GET :3000/health
```

예상 결과:

```json
{
  "status": "UP"
}
```

이 요청은 Capture Log를 생성하지 않아야 한다.

---

## 3. Proxy 요청으로 Capture Log 생성

테스트 Target으로 Backend의 Echo API를 사용한다.

```bash
http POST :3000/proxy source==manual \
  X-FlowTool-Target-Url:http://localhost:3000/api/test/echo \
  X-FlowTool-Source-Service:manual-httpie \
  X-Source-Request:manual-001 \
  message="hello from proxy"
```

예상 결과:

```json
{
  "received": {
    "message": "hello from proxy"
  },
  "query": {
    "source": "manual"
  }
}
```

확인 항목:

- HTTP Status가 `201`인지
- 응답 Header에 `X-FlowTool-Capture-Id`가 포함되는지
- 응답 Body가 Target API 응답과 같은지
- Capture Log가 정확히 1건 생성되는지

자동 검증이 필요하면 아래 스크립트를 실행한다.

```bash
cd backend
npm run verify:proxy-core
```

기존 Capture Service 직접 저장 검증은 아래 명령으로 수행할 수 있다.

```bash
cd backend
npm run verify:capture
```

---

## 4. Capture Query 목록 조회

```bash
http GET :3000/api/captures
```

확인 항목:

- `success`가 `true`인지
- `data`가 배열인지
- 최신 Capture Log가 먼저 표시되는지
- 목록 항목에 `sourceService`, `targetUrl`이 포함되는지
- 목록 항목에 `requestBody`, `responseBody`가 포함되지 않는지

이 요청은 Capture Log를 생성하지 않아야 한다.

---

## 5. Capture Query 상세 조회

목록 응답에서 확인한 `id`를 사용한다.

```bash
http GET :3000/api/captures/102
```

확인 항목:

- `success`가 `true`인지
- `data.id`가 요청한 ID와 같은지
- `sourceService`, `targetUrl`, `query`, `requestHeaders`, `requestBody`, `responseHeaders`, `responseBody`, `errorMessage`가 표시되는지

이 요청은 Capture Log를 생성하지 않아야 한다.

---

## 6. 존재하지 않는 Capture Log 조회

```bash
http GET :3000/api/captures/999999999
```

예상 결과:

```json
{
  "success": false,
  "data": null,
  "failResponse": {
    "code": "CAPTURE_NOT_FOUND",
    "message": "Capture log not found."
  }
}
```

HTTP Status는 `404`여야 한다.

이 요청도 Capture Log를 생성하지 않아야 한다.

---

## 7. 기존 Capture Log 조회 경로 제거 확인

STEP 9부터 기존 조회 경로는 제공하지 않는다.

```bash
http GET :3000/capture-logs
http GET :3000/capture-logs/102
```

예상 결과:

```text
HTTP Status 404
```

---

## 8. 테스트 API 호출

아래 API는 현재도 응답 확인용으로 사용할 수 있다.

```bash
http POST :3000/api/test/echo \
  source==manual \
  message="hello"
```

예상 결과:

```json
{
  "received": {
    "message": "hello"
  },
  "query": {
    "source": "manual"
  }
}
```

주의:

이 요청은 더 이상 Capture Log를 생성하지 않는다.

---

## 9. 테스트 Error API 호출

```bash
http GET :3000/api/test/error
```

예상 결과:

```json
{
  "message": "Test error response"
}
```

HTTP Status는 `500`이다.

주의:

이 요청도 더 이상 Capture Log를 생성하지 않는다.

---

## 10. 내부 API 비수집 자동 검증

아래 스크립트는 `/health`, `/api/captures`, `/api/captures/:id`, 존재하지 않는 상세 조회, 기존 `/capture-logs` 404 경로를 호출한 뒤 `capture_logs` 개수가 변하지 않는지 확인한다.

```bash
cd backend
npm run verify:no-auto-capture
```

성공 시:

```text
No auto capture verification passed.
```

---

## 현재 제외

아래 기능은 아직 구현 전이다.

- Proxy 오류 저장
- Retry
- Timeout 정책
- Streaming 응답
