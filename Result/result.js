//대상 url과 파라미터 가져오기 
function getQueryParam(key){
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

//대상 url, 스캔 시간, 총 소요시간, 파라미터 출력하기
window.addEventListener("DOMContentLoaded", ()=>{
    const targetUrl = getQueryParam("url");
    const testParams = getQueryParam("params");
    const currentTime = getQueryParam("scanTime");


    const duration = performance.now()
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    const scanFormatTime= currentTime
        ? new Date(currentTime).toLocaleString("ko-KR", {
            year : 'numeric',
            month : '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\. /g, '-').replace('.', '').replace(' ', ' '): " ";



    document.getElementById("scan-url").textContent=targetUrl || undefined;
    document.getElementById("scan-time").textContent= scanFormatTime;
    document.getElementById("scan-total").textContent=`${minutes}분 ${seconds}초`;
    document.getElementById("scan-params").textContent=testParams || undefined;
    
})


//재스캔 -> 연동하기 수정필요
document.getElementById("rescan").addEventListener("click", () => {
    window.location.href="../popup.html"; 
});








