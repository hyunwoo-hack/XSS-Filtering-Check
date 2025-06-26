// popup.js

// 요소 참조
const urlInput    = document.getElementById('url');
const paramInput  = document.getElementById('param');
const headersInput= document.getElementById('headers');
const scanBtn     = document.getElementById('scanBtn');
const spinner     = scanBtn.querySelector('.spinner');
const buttonText  = scanBtn.querySelector('.button-text');
const errorBanner = document.getElementById('errorBanner');
const resultList  = document.getElementById('resultList');
const progressBar = document.getElementById('progress'); // 진행률 표시 영역

let totalRequests = 0;
let completed     = 0;

// 전역 메시지 리스너: background → popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SCAN_PROGRESS') {
    // 중간 결과
    appendResult(msg.payload);
    completed++;
    updateProgress();
  }
  if (msg.type === 'SCAN_COMPLETE') {
    // 최종 결과
    showSummary(msg.payload.summary);
    hideSpinner();
  }
});

// 유틸: textarea → 헤더 객체
function parseHeaders(raw) {
  const obj = {};
  raw.split('\n').forEach(line => {
    const [k, ...rest] = line.split(':');
    if (k && rest.length) {
      obj[k.trim()] = rest.join(':').trim();
    }
  });
  return obj;
}

// 에러 표시/숨기기
function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.style.display = 'block';
}
function hideError() {
  errorBanner.textContent = '';
  errorBanner.style.display = 'none';
}

// 스피너 토글
function showSpinner() {
  spinner.style.display = 'inline-block';
  buttonText.style.opacity = 0;
  scanBtn.disabled = true;
}
function hideSpinner() {
  spinner.style.display = 'none';
  buttonText.style.opacity = 1;
  scanBtn.disabled = false;
}

// 결과 리스트에 항목 추가
function appendResult({ payload, status, position }) {
  const li = document.createElement('li');
  li.textContent = `${payload} → ${status}` + (position != null ? ` @${position}` : '');
  li.classList.add(status);
  resultList.appendChild(li);
}

// 진행률 계산 & 표시
function updateProgress() {
  if (totalRequests > 0) {
    const pct = Math.round((completed / totalRequests) * 100);
    progressBar.textContent = `진행: ${pct}% (${completed}/${totalRequests})`;
  }
}

// 최종 통계 표시
function showSummary({ totalRequests: t, vulnerableCount, filteredCount, blockedCount }) {
  // 예시: alert로 대체 가능, 실제론 별도 UI 영역에 렌더
  alert(`완료!\n총: ${t}\n취약: ${vulnerableCount}\n필터링: ${filteredCount}\n차단: ${blockedCount}`);
}

// 스캔 시작 핸들러
async function handleScan() {
  hideError();
  resultList.innerHTML = '';
  progressBar.textContent = '';
  completed = 0;

  const targetUrl = urlInput.value.trim();
  const testParam = paramInput.value.trim();
  if (!targetUrl) { showError('대상 URL을 입력해주세요.'); return; }
  if (!testParam) { showError('테스트 파라미터를 입력해주세요.'); return; }

  // Custom Headers 파싱
  const headersRaw    = headersInput.value.trim();
  const customHeaders = headersRaw ? parseHeaders(headersRaw) : {};

  // 페이로드 수를 알기 위해 payloads.json 미리 로드
  try {
    const resp = await fetch(chrome.runtime.getURL('assets/test_payloads.json'));
    const list = await resp.json();
    totalRequests = list.length;
  } catch {
    totalRequests = 0; // 실패 시 진행률 생략
  }

  showSpinner();

  // START_SCAN 발송
  chrome.runtime.sendMessage({
    type: 'START_SCAN',
    payload: { targetUrl, param: testParam, headers: customHeaders }
  }, (response) => {
    if (response?.status !== 'started') {
      hideSpinner();
      showError('스캔 시작에 실패했습니다.');
    }
  });
}

// 이벤트 바인딩
scanBtn.addEventListener('click', handleScan);
urlInput.addEventListener('input', () => scanBtn.classList.toggle('active', urlInput.value && paramInput.value));
paramInput.addEventListener('input', () => scanBtn.classList.toggle('active', urlInput.value && paramInput.value));