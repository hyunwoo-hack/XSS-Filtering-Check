import Analyzer                      from "./analyzer.js";
import { START_CHUNCK, END_CHUNK }   from "./config.js";
import { Sender }                    from "./messegeController.js";
import { FILTER_RESULT, FILTER_DATA, JAVASCRIPT_REGEXP} from "./config.js";

export default class Filter_Finder extends Analyzer{
    constructor(){
        super();
        this.filter_check_list = ["<", ">"];
    }

    #filter_check_list_update(){
        for(let i = 0; this.data_info.length > i; i++){
            let current_context = this.data_info[i];
            let location_type   = this.#location_type_checker(current_context);
            switch(location_type){
                case "javascript":
                    this.#javascript_filter_keyword_setter(current_context);
                    break;
                case "attribute":
                    this.#attribute_filter_keyword_setter(current_context);
                    break;
                case "comment":
                    this.#commnet_filter_keyword_setter();
                    break;
            }
        }
    }
    
    #location_type_checker(current_context){
        return current_context["location-type"];
    }


    #javascript_filter_keyword_setter(current_context){
        let using_quote = current_context["location-status"]["status"]["quote"];
        this.#list_adder(using_quote);
        this.#list_adder("</ScrIpT/>");
    }


    #attribute_filter_keyword_setter(current_context){
        let tag_name        = current_context["location-status"]["status"]["tag"  ];
        let reflection_type = current_context["location-status"]["status"]["type" ];
        let attribute_name  = current_context["location-status"]["status"]["name" ];
        let using_quote     = current_context["location-status"]["status"]["quote"];
        if(using_quote.length > 0)this.#list_adder(using_quote);

        switch(reflection_type){
            case "attr-name":
                if(tag_name == "iframe")this.#list_adder("SrcDoC");
                if(tag_name == "a"     )this.#list_adder("HrEf"  );
                this.#list_adder("oN")
                break;
            case "attr-value":
                if(attribute_name == "srcdoc")this.#list_adder("&lt;");this.#list_adder("&gt;");
                break;
        } 
    }

    #commnet_filter_keyword_setter(){
        this.#list_adder("-->");
    }

    #list_adder(value){
        if(!this.filter_check_list.includes(value))this.filter_check_list.push(value);
    }


    async checking_request(url, param, delay, cookie=true, headers=null, target_param){ // 체크리스트를 업데이트 하면 그 것을 기반으로 작동한다. 
        let check_list                  = this.filter_check_list;
        for(let target of check_list){
            let marking_data            = START_CHUNCK + target + END_CHUNK;
            let test_param              = this.payload_injector(param, marking_data); 
            let test_url                = this.url_generator(url, test_param);
            let response_obj            = await this.get(test_url, delay, cookie, headers);
            let response                = await response_obj.text();
            let checking_res            = this.#value_status_checker(response, target, target_param);

            this.#ft_res_sender(target, checking_res, url);
        }
    }

    #ft_res_sender(target, result, url){ // 필터링 테스트 결과 전송
        this.scan_msg[  "url"  ]    = url;
        this.scan_msg["status" ]    = result;
        this.scan_msg["payload"]    = target; 
        let basic_filter_res_copy   = Object.assign({}, this.scan_msg);
        let basic_filter_res_sender = new Sender(FILTER_RESULT);
        basic_filter_res_sender.req_set({[FILTER_DATA] : basic_filter_res_copy});
        basic_filter_res_sender.send(null, null);
    }

    #value_status_checker(response, target, target_param){
        let target_type = this.#basic_type(target);
        let test_values = this.test_value_extractor(response, target_type);
        console.log(this.filter_result);
        let result      = this.#filter_result_save(test_values, target, target_param);
        return result;
    }

    // attribute = []
    #filter_result_save(value, target, target_param){
        let test_type = value[0];
        let test_res  = value[1];  // 이 안에 {} 이게 계속 있을 뜻
        let test_res2;
        let result_dict = {};
        let success   = 0;
        if(test_type == "attr_js") test_res2 = value[2];
        
        let first = test_type != "attr_js" ? test_type : "attribute";
        
        if(test_res != null){
            result_dict["all"]     = test_res.length;
            result_dict["success"] = 0;
            result_dict["fail"]    = 0; 

            if(first == "attribute"){
                result_dict["tag"] = [];
                for(let res1 of test_res){
                    let res_tag = Object.keys(res1);
                    let res_refs= res1[res_tag];
                    let count = 0;
                    
                    for(let res_ref of res_refs){
                        if(res_ref.replace(START_CHUNCK, "").replace(END_CHUNK, "") == target){
                            result_dict["success"] += 1;
                            success += 1;
                            if(count == 0){ result_dict["tag"].push(res_tag); }
                            count += 1;
                        }else{
                            result_dict["fail"] += 1;
                        }
                    }
                    if(result_dict["tag"].length <= 0){result_dict["tag"] = null;}
                }

            }else{
                for(let res1 of test_res){
                    if(res1.replace(START_CHUNCK, "").replace(END_CHUNK, "") == target){
                        result_dict["success"] += 1;
                        success += 1;
                    }else{
                        result_dict["fail"] += 1;
                    }
                }
            }


            this.filter_result[target_param][first][target] = result_dict;


        }else{
            result_dict["all"]     = 0;
            result_dict["success"] = 0;
            result_dict["fail"]    = 0;
            this.filter_result[target_param][first][target]      = result_dict; 
        }
        result_dict = {};
        result_dict["all"]     = 0;
        result_dict["success"] = 0;
        result_dict["fail"]    = 0;

        if(test_type == "attr_js"){
            let second = "javascript";

            if(test_res2 != null){
                result_dict["all"] = test_res2.length;
                for(let res2 of test_res2){
                    if(res2.replace(START_CHUNCK, "").replace(END_CHUNK, "") == target){
                        result_dict["success"] += 1;
                        success += 1;
                    }else{
                        result_dict["fail"] += 1;
                    }
                }
                this.filter_result[target_param][second][target] = result_dict;
            }else{
                this.filter_result[target_param][second][target] = result_dict
            }

        }
        if(success > 0){ return "Vulnerable"}
        else return "Filtered"

    
    }   

    test_value_extractor(response, type){
        let check_list = this.#type_to_resp(type, response);
        let find_word  = this.#filter_word_extrator(check_list);
        return find_word;
    }

    #filter_word_extrator(target_array){
        let target_type = target_array[0];
        let targets     = target_array[1];
        let result      = [];
        let matched     = [];

        result.push(target_type);
        if(target_type == "javascript"){
            for(let target of targets){matched = this.#result_ap(target, matched);}
            matched.length > 0 ? result.push(matched) : result.push(null);
            return result;

        }else if(target_type == "attr_js"  ){
            let attr_target = target_array[1];
            let js_target   = target_array[2];
            let attr_res    = [];
            let js_res      = [];
            for(let target of attr_target){attr_res = this.#result_ap(target, attr_res, "attribute");}
            for(let target of js_target  ){js_res   = this.#result_ap(target, js_res  );}
            attr_res.length > 0 ? result.push(attr_res) : result.push(null);
            js_res.length   > 0 ? result.push( js_res ) : result.push(null);
            return result;

        }else if(target_type == "attribute"){
            for(let target of targets){ matched = this.#result_ap(target, matched, "attribute");}
            matched.length > 0 ? result.push(matched) : result.push(null);           
            return result;

        }else if(target_type == "comment"  ){
            for(let target of targets){ matched = this.#result_ap(target, matched);}
            matched.length > 0 ? result.push(matched) : result.push(null);
            return result;

        }else if(target_type == "html"     ){
            let res = this.#find_filter_word(targets);
            result.push(res);
            return result;
        }
    }

    #result_ap(target, matched, test_type){
        let res = this.#find_filter_word(target, test_type);
        return res != null ? matched.concat(res) : matched;
    }

    #find_filter_word(target, test_type){
        let regexp  = new RegExp(`${START_CHUNCK}(.*?)${END_CHUNK}`, 'gs');
        let matched = target.match(regexp);
        let result;
        if(test_type == "attribute"){
            result = {};
            if(matched != null){
                result[target] = matched;
            }
        }else{
            result = matched;
        }
        if(Object.prototype.toString.call(result) == "[object Object]"){
            let result_key = Object.keys(result);
            if(result_key.length <= 0) result = null; 
        }
        return result;
    }


    #basic_type(target){
        if(target == "</ScrIpT/>"){ return "javascript";
        }else if(["'", "\"", "`"].includes(target)){ return "attr_js";
        }else if(["oN", "HrEf", "SrcDoC", "&lt;", "&gt;"].includes(target)){ return "attribute";
        }else if(target == "-->"){ return "comment";
        }else return "html";
    }


    #type_to_resp(target, response){
        let result = [];
        let b_response = response;                                 // 주석 존재하는 응답
        let p_response = response.replace(/<!--[\s\S]*?-->/g, ''); // 주석 제거 응답 
        
        result.push(target);
        switch(target){
            case "javascript":
                let javascripts = this.javascript_extractor(p_response); // 배열임
                result.push(javascripts);
                return result;
            case "attr_js": // 첫 번째 attr 두 번째 js
                let attr = this.open_tag_extrator(p_response);
                let js   = this.javascript_extractor(p_response);
                result.push(attr);
                result.push( js );
                return result; // [attr_js, attr, js]
            case "attribute":
                let attr_list = this.open_tag_extrator(p_response);
                result.push(attr_list);
                return result;
            case "comment":
                let comment_regexp = /<!--([\s\S]*?)-->/g;
                let comment = [];
                let matched;
                while((matched = comment_regexp.exec(b_response) != null)){
                    let comment_text = matched[1].trim();
                    comment.push(comment_text);
                }
                result.push(comment);
                return result;
            case "html":
                return [target , response];
        }
    }

    javascript_code(response){
        let dom_parser = new DOMParser();
        let html       = dom_parser.parseFromString(response, "text/html");
        let script_ele = html.querySelectorAll("script");

        let js_code = [];
        script_ele.forEach(script=>{
            if(!script.src && script.textContent.trim() !== ""){
                js_code.push(script.textContent.trim());
            }
        })
        return js_code;
    }

    open_tag_extrator(response){ // 주석 제거 되어야함 
        let regexp    = /<([a-zA-Z][\w:-]*)(\s[^<>]*?)?>/g;
        let attr_list = [];
        let matched;
        while((matched = regexp.exec(response)) !== null){
            attr_list.push(matched[0]);
        }

        return attr_list;
    }    



    #decode_html_entities(str) {
          let map = {
            '&amp;'  : '&',
            '&lt;'   : '<',
            '&gt;'   : '>',
            '&quot;' : '"',
            '&#39;'  : "'",
            '&#x2F;' : '/',
            '&#96;'  : '`',
            '&#x3D;' : '='
        };

        return str.replace(/&[#\w]+;/g, (entity) => map[entity] || entity);
    }

    async filter_checking(url, param, delay, cookie=true, headers=null){
        this.filter_check_list = ["<", ">"];
        let target_param  = this.target_param_extractor(param);
        let analyze_param = Object.assign({}, param);

        await this.analyzer_init(url, analyze_param, delay, cookie, headers);
        if(!this.analyzing(target_param, url))return false;

        this.filter_result[target_param]["reflection"] = true;
        this.filter_result[target_param]["javascript"] = {};
        this.filter_result[target_param]["attribute" ] = {};
        this.filter_result[target_param][  "comment" ] = {};
        this.filter_result[target_param][   "html"   ] = {};

        let filter_check_param = Object.assign({}, param);
        this.#filter_check_list_update();
        await this.checking_request(url, filter_check_param, delay, cookie, headers, target_param);

        return true;
    }
}