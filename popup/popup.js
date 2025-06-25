// popup.js

// 요소 참조
const urlInput = document.getElementById('url');
const paramInput = document.getElementById('param');
const headersInput = document.getElementById('headers');
const scanBtn = document.getElementById('scanBtn');
const spinner = scanBtn.querySelector('.spinner');
const buttonText = scanBtn.querySelector('.button-text');
const errorBanner = document.getElementById('errorBanner');

// 설정 아이콘 클릭 시 옵션 페이지 열기
const openSettings = () => {
    //옵션으로 이동
};

// 에러 메시지 표시
const showError = (message) => {
    errorBanner.textContent = message;
    errorBanner.style.display = 'block';
};

// 에러 배너 숨기기
const hideError = () => {
    errorBanner.textContent = '';
    errorBanner.style.display = 'none';
};

// 스피너 보이기
const showSpinner = () => {
    spinner.style.display = 'inline-block';
    buttonText.style.opacity = '0';
    scanBtn.disabled = true;
};

// 스피너 숨기기
const hideSpinner = () => {
    spinner.style.display = 'none';
    buttonText.style.opacity = '1';
    scanBtn.disabled = false;
};

// 입력값 유효성 검사 및 버튼 스타일 토글
const validateInputs = () => {
    const hasUrl = urlInput.value.trim() !== '';
    const hasParam = paramInput.value.trim() !== '';
    const valid = hasUrl && hasParam;
    // 클릭 가능 여부는 항상 유지하되, 스타일만 변경
    if (valid) {
        scanBtn.classList.add('active');
    } else {
        scanBtn.classList.remove('active');
    }
};

// 스캔 버튼 클릭 핸들러
const handleScan = async () => {
    hideError();

    const targetUrl = urlInput.value.trim();
    const testParam = paramInput.value.trim();
    const headersRaw = headersInput.value.trim();

    if (!targetUrl) {
        showError('대상 URL을 입력해주세요.');
        return;
    }

    if (!testParam) {
        showError('테스트 파라미터를 입력해주세요.');
        return;
    }

    // Custom Headers 파싱 (선택 입력)
    let customHeaders;
    if (headersRaw) {
        customHeaders = {};
        headersRaw.split('\n').forEach((line) => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length) {
                customHeaders[key.trim()] = rest.join(':').trim();
            }
        });
    }

    showSpinner();

    try {
        // TODO: 실제 XSS 스캔 로직 구현
        // 예: await scanXSS(targetUrl, testParam, customHeaders || undefined);

        // 샘플 대기 (테스트용)
        await new Promise((resolve) => { resolve(setTimeout(resolve, 2000)); });

        // TODO: 스캔 결과 처리 및 UI 업데이트
    } catch (err) {
        showError(`스캔 중 오류 발생: ${err.message}`);
    } finally {
        hideSpinner();
    }
};

// 이벤트 리스너 등록
scanBtn.addEventListener('click', handleScan);
urlInput.addEventListener('input', validateInputs);
paramInput.addEventListener('input', validateInputs);

// 초기 버튼 스타일 설정
validateInputs();

// 전역 함수 노출 (HTML onclick 연결용)
window.openSettings = openSettings;
