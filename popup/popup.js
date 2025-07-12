import sign               from "../lib/operator.js";
import Input_Parser       from "../lib/inputpaser.js";
import Dom_Observer       from "../lib/dom_obsever.js";
import Storage_Controller from "../lib/storageController.js";
import {Sender, Recver}   from "../lib/messegeController.js";
import {USER_OPTIONS, mov_popup2, FILTER_CHECK, SIGN}   from "../lib/config.js";

const err_recver   = new Recver();
const mov_recver   = new Recver();
const parser       = new Input_Parser();
const observ       = new Dom_Observer();
const sc           = new Storage_Controller();
const op           = sign(SIGN, USER_OPTIONS);

let spinner_show   = function(){op.visible_change("spinner"    , "button-text", [()=>{op.enabled ("scanBtn");}]);}
let spinner_destroy= function(){op.visible_change("button-text", "spinner"    , [()=>{op.disabled("scanBtn");}]);}

let param_auto_set = function(){
  let user_url     = op.scan("url");
  let param        = parser.param_keys(user_url);
  op.print("param", param);
}

let filter_check   = async function() { 
  op.print("resultList", "");
  let opt          = op.levy(SIGN);
  let sender       = new Sender(FILTER_CHECK, {status : 'started'});
  sender.req_set({payload : opt});
  spinner_show();
  sender.send(null, [spinner_destroy, ()=>{op.error("스캔 실패")}]);
}

op.content_load(async ()=>{
  if(!sc.session_get("oppened")){
    sc.session_set("oppened", "true");
    if(await observ.exist()){location.href="../popup3/popup3.html"}
  }
})

err_recver.error_recv([spinner_destroy, (msg)=>{op.error(msg.payload);}]);
mov_recver.recv(mov_popup2, [spinner_destroy, ()=>{location.href = '../popup2/popup2.html'}]);

op.input("url"    , param_auto_set);
op.click("scanBtn", filter_check  );
op.click("target-finder", ()=>{location.href = "../popup4/popup4.html"});
op.input("url"    , () => op.id("scanBtn").classList.toggle('active', op.scan("url") && op.scan("param")))
op.input("param"  , () => op.id("scanBtn").classList.toggle('active', op.scan("url") && op.scan("param")))






// delay
// "0"
// param
// "q"
// url
// "https://Domain.com?q=asd"
// useCookies
// true