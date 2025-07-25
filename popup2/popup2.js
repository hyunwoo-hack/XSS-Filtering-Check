import sign                                      from "../lib/operator.js";
import {res_gen}                                 from "./filter_result.js";
import {Recver, Sender}                          from "../lib/messegeController.js";
import {FILTER_RESULT, FILTER_DATA, VULN_REGEXP, SCAN_VAL, ATTACK_START, mov_result} from "../lib/config.js";
import "./filter_result.js"

const op                = sign();
const PARAM             = "param";
const URL               = "url";
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

        result_recver.recv(FILTER_RESULT, [(msg)=>{pop.result_ctl(msg[FILTER_DATA]);}])
        move3_recver .recv(mov_result   , [()=>{chrome.tabs.create({url: chrome.runtime.getURL("Result/result.html")});}])
        error_recver.error_recv([(msg)=>{op.error(msg.payload);}]);

        op.click("back-button", ()=>{window.location.href = '../popup/popup.html';});
        op.click("prev_url"   , ()=>{pop.result_view_change("prev")});
        op.click("aft_url"    , ()=>{pop.result_view_change("next")});
        op.click("start-scan" , ()=>{
            let attack_opt = op.levy("scan_val");
            let scaner_sender = new Sender(ATTACK_START, {status : 'started'});
            scaner_sender.req_set({payload : attack_opt});
            scaner_sender.send(null, [()=>{alert("스캔 실패");}]);
        });
    }
    
    constructor(){
        this.op             = sign();
        this.res_list       = {};
        this.url_filter_res = {}; // {url : [result, count, visible]}
    }


    result_view_change(loc){
        let result_keys = Object.keys(this.url_filter_res); // url 목록
        let result_len  = result_keys.length;
        let current_view;
        if(result_len <= 1)return;

        for(let i=0; result_len > i; i++){ // url 개수 만큼 반복한다. 
            let result_key = result_keys[i];
            let result_val = this.url_filter_res[result_key];
            let visible    = result_val[2];
            if(visible){
                current_view = i;
                break;
            }
        }

        // 기존 요소 안보이게 하고, status false로 변경 
        this.url_filter_res[result_keys[current_view]][0].style.display = "none";
        this.url_filter_res[result_keys[current_view]][2] = false;

        let change_url;
        switch(loc){
            case "prev":
                if(current_view == 0){
                    change_url = result_keys[result_len - 1];
                    break;
                }
                else{
                    change_url = result_keys[current_view -1];
                    break;
                }
            case "next":
                if(current_view == result_len -1){
                    change_url = result_keys[0];
                    break;
                }
                else{
                    change_url = result_keys[current_view + 1];
                    break;
                }
        }
        let change_ins = this.url_filter_res[change_url];
        let change_res = change_ins[0];
        let change_cnt = change_ins[1];
        change_ins[2]  = true;

        // 변경 할 요소 보이게 하고, 찾은 취약점 수와 status 등을 변경
        change_res.style.display = "block";
        change_cnt.count_visible();
        this.op.print("current_url", change_url);
    }


    result_ctl(msg){
        if(this.#url_exist(msg[URL])) this.#url_res_update(msg);
        else this.#url_res_gen(msg);
    }


    #url_res_update(msg){ // 객체 찾고, 획수 없데이트 하고, 하는 것
        let url            = msg[URL]; 
        let result         = this.url_filter_res[url][0];
        let count          = this.url_filter_res[url][1];
        let visible_status = this.url_filter_res[url][2];
        let target         = this.url_filter_res[url][this.url_filter_res[url].length-1];

        if(this.#exist(url, msg[PARAM])) target.update(msg[PAYLOAD], msg[STATUS]);

        else{
            this.res_list[url].push(msg[PARAM]);
            let child_res      = res_gen(msg[PARAM], msg[PAYLOAD], msg[STATUS], msg[REF_TYPE], msg[REF_COUNT]);
            child_res.click_transmit("test-param");
            this.op.append(result, child_res.main);
            this.url_filter_res[url].push(child_res);
        }


        if(visible_status){
            if(this.#vuln_check(msg)) count.total_vuln_add_visible();
            else count.total_filter_add_visible();
        }

        else{
            if(this.#vuln_check(msg)) count.total_vuln_add();
            else count.total_filter_add();
        }

    }



    #url_res_gen(msg){ // 객체를 등록 하는데, 첫 객체라면, 보여지게 설정한다. 카운트를 제대로 올리고 
        let url       = msg[URL];
        let count     = new res_count();
        let result    = this.op.gen("div");
        let child_res = res_gen(msg[PARAM], msg[PAYLOAD], msg[STATUS], msg[REF_TYPE], msg[REF_COUNT]);
        child_res.click_transmit("test-param");
        let visible_status;
        
        if(Object.keys(this.url_filter_res).length <= 0)  visible_status = true; // this.url_filter_res 에 값이 없다면, visible을 성정한다.
        else visible_status = false;
        

        if(visible_status){ // 값이 보이게 설정되어있다면, 카운트를 보이게 증가시킨다.
            if(this.#vuln_check(msg)) count.total_vuln_add_visible();
            else count.total_filter_add_visible();
            this.op.id("current_url").innerText = url;
        }

        else{ // 값이 보이지 않게 설정되어있다면, 카운트를 보여지지 않게 증가시킨다. 
            if(this.#vuln_check(msg)) count.total_vuln_add();
            else count.total_filter_add();
            result.style.display = "none";
        }
        
        this.res_list[url] = [];
        this.res_list[url].push(msg[PARAM]);
        this.url_filter_res[url] = [result, count, visible_status, child_res];

        this.op.append(result, child_res.main);
        this.op.append(RESULT_SECTION_ID, result);
    }

    #url_exist(url){
        let filter_res_keys = Object.keys(this.url_filter_res);
        if(filter_res_keys.includes(url)) return true;
        else return false;
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
    
    #exist(url, param){
        let url_param_list = this.res_list[url];
        if(url_param_list.includes(param)) return true;
        else return false;
    }
}

op.content_load(()=>{popup2.run_factory();})



class res_count{
    constructor(){
        this.op    = sign();
        this.total = 0;
        this.vuln  = 0;
        this.filter = 0;
    }

    total_filter_add(){
        this.#adder("total");
        this.#adder("filter");
        return this;
    }

    total_vuln_add(){
        this.#adder("total");
        this.#adder("vuln");
        return this;
    }

    total_filter_add_visible(){
        this.total_filter_add();
        this.count_visible();
        return this;
    }

    total_vuln_add_visible(){
        this.total_vuln_add();
        this.count_visible();
        return this;
    }

    #adder(target){
        switch(target){
            case "total":
                this.total += 1;
                break;
            case "vuln":
                this.vuln += 1;
                break;
            case "fiter":
                this.filter += 1;
                break;
        }
    }

    count_visible(){
        this.op.id("total-tests").innerText = "";
        this.op.id("vuln-found").innerText = "";
        this.op.id("filtered").innerText   = "";

        this.op.id("total-tests").innerText = this.total;
        this.op.id("vuln-found").innerText = this.vuln;
        this.op.id("filtered").innerText   = this.filter;
    }
}