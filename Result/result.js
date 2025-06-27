//result.js

//대상 url과 파라미터 가져오기 
function getQueryParam(key){
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
};


function formatScanTime(timeString){
    return timeString
    ? new Date(timeString).toLocaleString("ko-KR", {
            year : 'numeric',
            month : '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\. /g, '-').replace('.', '').replace(' ', ' '): "undefined";
};



window.addEventListener("DOMContentLoaded", ()=>{
    scanInfo();
    sumBox();
    eventHandler();
});



function scanInfo(){
    //대상 url, 스캔 시간, 총 소요시간, 파라미터 출력하기
    const targetUrl = getQueryParam("url");
    const testParams = getQueryParam("params");
    const currentTime = getQueryParam("scanTime");


    const duration = performance.now()
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);


    document.getElementById("scan-url").textContent=targetUrl || undefined;
    document.getElementById("scan-time").textContent= formatScanTime(currentTime);
    document.getElementById("scan-total").textContent=`${minutes}분 ${seconds}초`;
    document.getElementById("scan-params").textContent=testParams || undefined;

};

//popup.js에서 background로부터 전달받고 result.js로 보내기
function sumBox(){
    //요약 상자 내역 출력하기 - 총 개수, 취약점 개수, 필터링 개수
    chrome.storage.local.get("scanReport", (data) => {
        const report = data.scanReport;
        if(!report || !report.summary) {
            return;
        }

        const summary = report.summary;
        
        document.getElementById("total-box").querySelector(".sum-value").textContent = summary.totalRequests;
        document.getElementById("vuln-box").querySelector(".sum-value").textContent = summary.vulnerableCount;
        document.getElementById("filter-box").querySelector(".sum-value").textContent = summary.filteredCount;
    });
};


function eventHandler(){

    const rescanBtn = document.getElementById("rescan");
    const jsonBtn = document.getElementById("export-json");
    const csvBtn = document.getElementById("export-csv");
    const newScanBtn = document.getElementById("new-scan");

    //재스캔 -> 연동하기 수정필요
    if (rescanBtn) {
        rescanBtn.addEventListener("click", () => {
            window.location.href="result.html"; 
        });
    };
    
    //json 내보내기
    if (jsonBtn){
        jsonBtn.addEventListener("click", () => {
            chrome.storage.local.get("scanReport", (data) => {
                const report = data.scanReport;
                if (!report){
                    return alert("undefined");
                }
                const jsonText = JSON.stringify(report, null, 2);
                const blob = new Blob([jsonText], {type: "application/json"});
                downloadReport(blob, "result.json");

            });
        });
    };


    //csv내보내기
    if (csvBtn){
        csvBtn.addEventListener("click", () =>{
            chrome.storage.local.get("scanReport", (data) => {
                const report = data.scanReport;
                if(!report){
                    alert("undefined");
                    return;
                }

                const header = ["Payload", "Status", "Position"];
                const rows = [header];

                for (const item of report.details){
                    rows.push([
                        item.payload,
                        item.status,
                        item.position !== undefined ? item.position : ""
                    ]);
                }
                const csvText = rows.map(row =>
                    row.map(field => `"${String(field).replace(/"/g,'""')}"`).join(",")).join("\r\n");

                const blob = new Blob([csvText], {type: "text/csv;charset=utf-8;"});
                downloadReport(blob, "result.csv");
                
            });
        });
    };

    //새 스캔 시작
    if(newScanBtn){
        newScanBtn.addEventListener("click", () => {
            window.close();
        });
    };
};


function downloadReport(blob, filename){
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
};



//보고서 공유 -> 어떻게 공유할 것인지 의논 필요  


//상세 결과 분석
//검색


