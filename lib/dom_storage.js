import { HTML_CAPTURED } from "./config.js";
import { Recver }        from "./messegeController.js";

export default class Dom_Storage{
    constructor(){
        this.main_html = null;
        this.main_url  = null;
    }

    url_sensor(func=null){
        chrome.tabs.onUpdated.addListener((tabId, change_info, tab) =>{
            if(change_info.status === "complete" && tab.url.startsWith("http")){
                chrome.scripting.executeScript({
                    target : {tabId},
                    files  : ["lib/main_sensor.js"]
                });
            }
        });

        let capture_recver = new Recver();
        capture_recver.recv(HTML_CAPTURED, [(msg)=>{
            let capture_data = msg.payload;
            let url          = capture_data.url;
            let html         = capture_data.html;

            // func(url, html);
            console.log(url);
            console.log(html);
        }])
    }

    async power_capture(){
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["lib/main_capture.js"] 
        });

        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tab.id, { action: "get_html" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError);
                return;
            }
            resolve([response.url, response.html]);
            });
        });
    }
}