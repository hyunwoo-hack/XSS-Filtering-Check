// background/background.js (MV3 service worker)

// 2초 딜레이 상수
const DELAY_MS = 2000;
// 응답 분석 시 찾을 표시 토큰
const FINDING_TOKEN = 'finding_Bugteam123';

/**
 * 사전 정의된 페이로드 목록을 로드
 * @returns {Promise<string[]>} 페이로드 문자열 배열
 */
async function loadPayloads() {
  const url = chrome.runtime.getURL('asset/test_payload.json');
  const resp = await fetch(url);
  const data = await resp.json();
  // payloads.json이 문자열 배열 또는 {payload} 객체 배열이라 가정
  return data.map(item => typeof item === 'string' ? item : item.payload);
}

/**
 * 일정 시간 대기
 * @param {number} ms 밀리초
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 단일 페이로드 요청
 * @param {string} targetUrl 기본 URL
 * @param {string} param 테스트할 파라미터명
 * @param {string} payload XSS 테스트 문자열
 * @param {Object<string,string>} headers 커스텀 헤더
 * @returns {Promise<{text?: string, error?: any}>}
 */
async function requestFilterChk(targetUrl, param, payload, headers = {}) {
  // 1) URL 조합: payload + 표시 토큰
  const combo = payload + FINDING_TOKEN;
  const sep = targetUrl.includes('?') ? '&' : '?';
  const url = `${targetUrl}${sep}${param}=${encodeURIComponent(combo)}`;

  // 2) 2초 대기
  await delay(DELAY_MS);

  try {
    // 3) HTTP 요청 (fetch)
    const response = await fetch(url, { headers });
    const text = await response.text();
    return { text };
  } catch (err) {
    console.error('Request error:', err);
    return { error: err };
  }
}

/**
 * 응답 분석: finding 토큰으로 취약 여부 판단
 * @param {{text?: string, error?: any}} respObj
 * @param {string} payload 원본 페이로드
 * @returns {{payload: string, status: string, position?: number}}
 */
function analyzeRes(respObj, payload) {
  if (respObj.error) {
    return { payload, status: 'blocked' };
  }
  const { text } = respObj;
  // payload와 토큰이 함께 반사되었는지 확인
  const combo = payload + FINDING_TOKEN;
  const idx = text.indexOf(combo);
  if (idx !== -1) {
    return { payload, status: 'vulnerable', position: idx };
  }
  return { payload, status: 'filtered' };
}

/**
 * 집계: 결과 배열 기준으로 카운팅
 * @param {Array<{status: string}>} results
 * @returns {{totalRequests:number,vulnerableCount:number,filteredCount:number,blockedCount:number}}
 */
function countChk(results) {
  const totalRequests = results.length;
  const vulnerableCount = results.filter(r => r.status === 'vulnerable').length;
  const filteredCount = results.filter(r => r.status === 'filtered').length;
  const blockedCount = results.filter(r => r.status === 'blocked').length;
  return { totalRequests, vulnerableCount, filteredCount, blockedCount };
}

/**
 * 최종 리포트 생성
 * @param {Array<Object>} results 개별 TestResult 배열
 * @returns {Object} summary + details 구조
 */
function reportResult(results) {
  const summary = countChk(results);
  return { summary, details: results };
}

/**
 * 전체 스캔 수행
 * @param {{targetUrl:string,param:string,headers?:Object}} config
 */
async function handleScan(config) {
  // config 파싱: { targetUrl, param, headers }
  const payloads = await loadPayloads();
  const results = [];

  for (const payload of payloads) {
    // 1) 요청 및 응답 수집
    const respObj = await requestFilterChk(
      config.targetUrl,
      config.param,
      payload,
      config.headers
    );

    // 2) 응답 분석
    const result = analyzeRes(respObj, payload);
    results.push(result);

    // 3) 중간 진행 상황 전송
    chrome.runtime.sendMessage({ type: 'SCAN_PROGRESS', payload: result });
  }

  // 4) 전체 완료 후 리포트 전송
  const report = reportResult(results);
  chrome.runtime.sendMessage({ type: 'SCAN_COMPLETE', payload: report });
}

// 메시지 수신: START_SCAN 트리거
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'START_SCAN') {
    handleScan(msg.payload);
    sendResponse({ status: 'started' });
    return true; // 비동기 응답을 위해 true 반환
  }
});
