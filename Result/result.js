//result.js

//요소참조
const copyRawBtns = document.querySelectorAll('.copy-btn');
const headerActions = document.querySelectorAll('.header-actions .icon-btn');
const shareBtn = headerActions[0];
const printBtn = headerActions[1];
const closeBtn = headerActions[2];
const payloadHeaders = document.querySelectorAll('.payload-header');
const searchInput = document.querySelector('.search-txt');
const clearBtn = document.querySelector(".clear-btn");
const noResultMsg = document.getElementById('no-result-message');



// 일시 메시지 표시 (2초)
const showTemporaryMessage = (message) => {
    const msgEl = document.createElement('div');
    msgEl.textContent = message;
    msgEl.style.position = 'fixed';
    msgEl.style.top = '16px';
    msgEl.style.right = '16px';
    msgEl.style.background = 'rgb(83, 83, 83)';
    msgEl.style.color = 'white';
    msgEl.style.padding = '8px 12px';
    msgEl.style.borderRadius = '4px';
    msgEl.style.zIndex = '500';
    msgEl.style.opacity = '1';
    msgEl.style.transition = 'opacity 0.5s ease'

    document.body.appendChild(msgEl);
    setTimeout(() => {
        msgEl.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(msgEl);
    }, 500);
        }, 1000);
        
};


// 원본 데이터 복사
copyRawBtns.forEach(copyBtn => {
    copyBtn.addEventListener('click', () => {
        const rawDataEl = copyBtn.closest('.raw-data-container').querySelector('.raw-data-content');
        if (!rawDataEl) {
            return;
        }

        const rawText = rawDataEl.textContent.trim();
        navigator.clipboard.writeText(rawText)
            .then(()=> showTemporaryMessage('원본 데이터 복사 완료'))
            .catch((err) => {
                console.error(err);
                showTemporaryMessage('복사 실패');
            });
    });

});



// 공유 버튼 (URL 복사)
shareBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showTemporaryMessage('URL 복사 완료');
    }).catch(() => {
        showTemporaryMessage('URL 복사 실패');
    });
});

// 인쇄 버튼
printBtn.addEventListener('click', () => {
    window.print();
});

// 닫기 버튼
closeBtn.addEventListener('click', () => {
    window.close();
});



//토글 설정
function toggleRawSection(headerElement){
    const rawSection = headerElement.nextElementSibling;
    const arrow = headerElement.querySelector('.arrow');

    if(!rawSection) {
        return;
    }

    rawSection.classList.toggle('hidden');
    const leftIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="mi-solid mi-triangle-left" viewBox="0 0 24 24">
        <path d="m18.03 2.26-14.02 8c-1.34.77-1.34 2.72 0 3.48l14.02 8C19.36 22.5 21 21.53 21 20V4c0-1.53-1.64-2.5-2.97-1.74"/>
    </svg>`

    const downIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="mi-solid mi-triangle-down" viewBox="0 0 24 24">
        <path d="M20 3H4C2.47 3 1.5 4.64 2.26 5.97l8 14.02c.77 1.34 2.72 1.34 3.48 0l8-14.02C22.5 4.64 21.53 3 20 3"/>
    </svg>
    `
    arrow.innerHTML = rawSection.classList.contains('hidden') ? leftIcon : downIcon;
}

payloadHeaders.forEach(header => {
    header.addEventListener('click', () => {
        toggleRawSection(header);
    });
});



//검색 기능
function filterAnalysisItem(query){
    const items = document.querySelectorAll('.analysis-item');
    const lowerQuery = query.toLowerCase();
    let visibleCount = 0;

    items.forEach(item => {
        const payload = item.querySelector('.payload-text')?.textContent.toLowerCase() || '';
        const raw = item.querySelector('.raw-data-content')?.textContent.toLowerCase() || '';
        const combined = payload + ' ' + raw;

        if (combined.includes(lowerQuery)) {
            item.style.display = 'block';
            visibleCount++;
        }else{
            item.style.display = 'none';
        }
    });

    noResultMsg.style.display = visibleCount === 0 ? 'block' : 'none';

}

// 검색 입력 시 필터링
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    filterAnalysisItem(query);
});

// 초기화 버튼
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterAnalysisItem('');
});







//TODO: 동적으로 summary 정보 받아 sum-box 숫자 업데이트
function updateSummary(summary){
    document.querySelector('#total-box .sum-value').textContent = summary?.total ?? '-';
    document.querySelector('#vuln-box .sum-value').textContent = summary?.vulnerable ?? '-';
    document.querySelector('#filter-box .sum-value').textContent = summary?.filtered ?? '-';
}



//TODO: 파라미터 이름 받아오기
function updateParameter(param){
    document.querySelector('.param').textContent = `Parameter: ${param}`;
}



//TODO: 페이로드 받아오기 - 동적으로 할당
function updatePayloadAndRaw(detail) {
    //payload
    document.querySelector('.payload-text').textContent = detail?.payload ?? '-';

    //raw value
    document.querySelector('.raw-data-content code').textContent = detail?.raw ?? '-';
    
    
}


//TODO : background.js에서 SCAN_COMPELTE 메시지 수신해 데이터 바인딩 
chrome.runtime.onMessage.addListener((message) => {
    if(message.type === "SCAN_COMPLETE"){
        const report = message.payload;

        try{
            updateSummary(report?.summary);               //TODO : sum-box 연결
            updateParameter(report?.parameter);           //TODO : parameter 연결  

            //TODO: details 배열 -> 반복 렌더링 필요. 현재는 첫번째만 테스트용
            updatePayloadAndRaw(report?.details?.[0]);    //TODO : payload, raw value 연결
        } catch(e){
            console.error("오류", e);
        }
    }
});
