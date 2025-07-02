//popup2.js
const RESULT_SECTION_ID = 'result-section';
const RESCAN_BUTTON_ID = 'start-scan';

// 기본 표시할 파라미터 리스트
const DEFAULT_PARAMS = ['search', 'params'];

document.addEventListener('DOMContentLoaded', () => {
    const resultSection = document.getElementById(RESULT_SECTION_ID);

    // 각 파라미터별로 섹션 생성
    DEFAULT_PARAMS.forEach((paramName) => {
        const paramSection = document.createElement('div');
        paramSection.className = 'param-section';

        const header = document.createElement('div');
        header.className = 'param-header';
        header.textContent = paramName;
        paramSection.appendChild(header);

        const list = document.createElement('ul');
        list.className = 'result-list';

        // 예시 아이템 하나
        const item = document.createElement('li');
        item.className = 'result-item';
        item.innerHTML = `
            <div class="payload">&lt;script&gt;alert(1)&lt;/script&gt;...</div>
            <div class="meta">Type: Header | Response: 245ms</div>
        `;
        list.appendChild(item);

        paramSection.appendChild(list);
        resultSection.appendChild(paramSection);
    });

    const rescanButton = document.getElementById(RESCAN_BUTTON_ID);
    rescanButton.addEventListener('click', () => {
        console.log('재스캔 버튼 클릭됨');
    });
});

// 뒤로 가기
const goBack = () => {
    window.location.href = '../popup/popup.html';
};

