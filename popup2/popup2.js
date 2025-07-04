import sign                                      from "../lib/operator.js";
import {res_gen}                                 from "./filter_result.js";
import {Recver, Sender}                          from "../lib/messegeController.js";
import {FILTER_RESULT, FILTER_DATA, VULN_REGEXP, SCAN_VAL, ATTACK_START, mov_result} from "../lib/config.js";
import "./filter_result.js"

const op                = sign();
const PARAM             = "param";
const PAYLOAD           = "payload";
const STATUS            = "status";
const REF_TYPE          = "reflection-type";
const REF_COUNT         = "reflection-count";
const TOTAL_COUNT       = "total-tests";
const VULN_COUNT        = "vuln-found";
const FILTER_COUNT      = "filtered";
const RESULT_SECTION_ID = 'result-section';

class popup2{
    static run_factory(){
        const op            = sign("scan_val",SCAN_VAL);
        const pop           = new popup2();
        const result_recver = new Recver();
        const error_recver  = new Recver();
        const move3_recver  = new Recver();

        result_recver.recv(FILTER_RESULT, [(msg)=>{pop.filter_result_controll(msg[FILTER_DATA]);}])
        move3_recver .recv(mov_result   , [()=>{chrome.tabs.create({url: chrome.runtime.getURL("Result/result.html")});}])
        error_recver.error_recv([(msg)=>{op.error(msg.payload);}]);

        op.click("back-button", ()=>{window.location.href = '../popup/popup.html';});
        op.click("start-scan" , ()=>{
            let attack_opt = op.levy("scan_val");
            let scaner_sender = new Sender(ATTACK_START, {status : 'started'});
            scaner_sender.req_set({payload : attack_opt});
            scaner_sender.send(null, [()=>{alert("스캔 실패");}]);
        });
    }
    
    constructor(){
        this.op       = sign();
        this.res_list = {};
    }

    filter_result_controll(msg){
        if(this.#exist(msg[PARAM]))this.#loutine_exist(msg);
        else this.#loutine_init(msg);
    }

    #loutine_exist(msg){
        let target = this.res_list[msg[PARAM]];
        target.update(msg[PAYLOAD], msg[STATUS]);
        this.#count_add(TOTAL_COUNT);
        this.#vlun_filter_add(msg)
    }

    #loutine_init(msg){
        let result                = res_gen(msg[PARAM], msg[PAYLOAD], msg[STATUS], msg[REF_TYPE], msg[REF_COUNT]);
        this.res_list[msg[PARAM]] = result;
        this.#count_add(TOTAL_COUNT);
        this.#vlun_filter_add(msg)
        result.click_transmit("test-param");
        result.attach(RESULT_SECTION_ID);
    }

    #vlun_filter_add(msg){
        if(this.#vuln_check(msg)) this.#count_add(VULN_COUNT);
        else this.#count_add(FILTER_COUNT);
    }

    #count_add(target){
        let count = Number(this.op.scan(target));
        this.op.print(target, count += 1);
    }

    #vuln_check(msg){
        let status = msg[STATUS];
        return VULN_REGEXP.test(status);
    }
    
    #exist(param){
        let res_keys = Object.keys(this.res_list);
        for(let i = 0; res_keys.length > i; i++){
            let res_key = res_keys[i];
            if(res_key == param){
                return true;
            }
        }
        return false;
    }
}

op.content_load(()=>{popup2.run_factory();})