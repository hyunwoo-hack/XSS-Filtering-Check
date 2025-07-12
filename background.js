import Xss_Bayev     from "../lib/xss_bayev.js";
import {Recver}      from "../lib/messegeController.js";
import Dom_Storage   from "../lib/dom_storage.js";
import {OPTION_KEYS, START_MSG, FILTER_CHECK, ATTACK_START, REPLAY_CHECK} from "../lib/config.js";

const xss           = new Xss_Bayev(OPTION_KEYS);
const sensor        = new Dom_Storage();
const filter_recver = new Recver();
const replay_recver = new Recver();
const attack_recver = new Recver();

let filter_seeker = async function(config=null) {
  if(config){ if(!await xss.setting(config))return false; }
  await xss.filter_cosmo();
}

let attack_seeker = async function(config){
  await xss.attack_naut(config);
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type !== "fetchHTML") return;
  (async () => {
    try {
      const res  = await fetch(msg.url, { cache: "no-store" });
      const html = await res.text();
      sendResponse({ html });
    } catch (e) {
      sendResponse({ error: e.message });
    }
  })();
  return true;
});

sensor.url_sensor();

filter_recver.resp_set(START_MSG);
replay_recver.resp_set(START_MSG);
attack_recver.resp_set(START_MSG);

filter_recver.recv_resp(FILTER_CHECK, [(msg)=>{filter_seeker(msg.payload)}], "started");
replay_recver.recv_resp(REPLAY_CHECK, [(   )=>{filter_seeker(           )}], "started");
attack_recver.recv_resp(ATTACK_START, [(msg)=>{attack_seeker(msg.payload)}], "started");