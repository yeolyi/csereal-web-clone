/**
 * HTTP 상태 코드가 200대가 아니면 에러를 throw하는 fetch wrapper
 */
export async function fetchOk(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const url = input instanceof Request ? input.url : String(input);
    throw new Error(
      `HTTP Error: ${response.status} ${response.statusText} (URL: ${url})`,
    );
  }

  return response;
}

/**
 * fetch를 실행하고 자동으로 JSON 파싱하는 함수
 * 200대가 아니면 에러를 throw
 */
export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetchOk(input, init);
  return response.json() as Promise<T>;
}
