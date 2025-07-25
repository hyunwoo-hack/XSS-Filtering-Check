import Html_Ast     from "../lib/half_ast_tree_int/html_ast.js";
import sign         from "../lib/operator.js";
import url_gen      from "./find_url.js";
import Dom_Storage  from "../lib/dom_storage.js";
import Input_Parser from "../lib/inputpaser.js";
import { Sender, Recver }   from "../lib/messegeController.js";
import { FILTER_CHECK, mov_popup2 } from "../lib/config.js";

// find_url



const op     = sign();
const parser = new Input_Parser();

class Popup4{
    static async run_factory(){
        const pop = new Popup4();
        const cap = new Dom_Storage();
        const test_sender = new Sender(FILTER_CHECK, {status : 'started'});
        const mov_recver = new Recver();

        let current_page = await cap.power_capture();
        let current_url  = current_page[0];
        let current_html = current_page[1];

        mov_recver.recv(mov_popup2, [()=>{location.href = '../popup2/popup2.html'}]);

        let url_list     = pop.url_extractor_at_element(current_html);
        pop.add_url_tab(url_list, current_url);

        op.click("unselect"  , pop.unselect_all);
        op.click("all-select", pop.select_all  );
        op.click("scan_start", ()=>{
            let opt = pop.get_select();
            test_sender.req_set({payload : opt});
            test_sender.send(null, [()=>{}]); // op.error("스캔 실패")
        });

        const container = op.id("find_url");
        const blank     = op.id("blank");
        container.addEventListener("wheel", (event)=>{
            let uad       = event.deltaY;
            if(uad > 0){
                let slides  = container.childNodes[0];
                let bslides = blank.childNodes[0];
                container.appendChild(bslides);
                blank.appendChild(slides);
            }else if(uad < 0){
                let slides  = container.childNodes;
                let bslides = blank.childNodes;
                container.prepend(bslides[bslides.length-1]);
                blank.prepend(slides[slides.length-1]);
            }

        })

    }

    constructor(){
        this.num = 1;
    }

    get_select(){
        let delay      = op.scan("delay");
        let conf       = []

        // for(;;){
        let selected_targets = document.querySelectorAll(".select_target");
        // if(selected_targets.length <= 0) break;
        for(let select_target of selected_targets){
            let full_url = select_target.childNodes[1].childNodes[2].value;
            if(full_url == "") continue;
            let param    = parser.param_keys(full_url);
            let opt      = {"url" : full_url, "param" : param.join(","), "delay" : delay, "useCookies" : true};
            conf.push(opt);
        }
        // }

        return conf;
    }

    url_extractor_at_element(response){
        op.law(String, response, "Type Error (method url_extractor_at_element)");
        let resp_ast = new Html_Ast();
        resp_ast.ast_generator(response);
        
        let url_list = [];
        url_list.push(resp_ast.attr_finder("href"));
        url_list.push(resp_ast.attr_finder("src"));
        url_list.push(resp_ast.attr_finder("data"));
        url_list.push(resp_ast.attr_finder("cite"));
        url_list.push(resp_ast.attr_finder("for"));
        url_list.push(resp_ast.attr_finder("formaction"));
        url_list.push(resp_ast.attr_finder("manifast"));
        url_list.push(resp_ast.attr_finder("srcdoc"));
        url_list.push(resp_ast.attr_finder("content"));
        
        url_list = this.#push_attr_url(url_list);

        let form_list = resp_ast.tag_finder("form");
        let form_urls;
        if(form_list != null){form_urls = this.#form_parser(form_list);}
        if(form_urls != null){
            for(let form_url of form_urls){
                url_list.push(form_url);
            }
        }

        return url_list;
    }

    #form_parser(form_list){
        let url_list = [];
        for(let form of form_list){
            let method = form.find_attr("method");
            let querystring;
            if(method == null || method.toLowerCase() == "get"){querystring = this.#form_querystring(form)}
            else if(method.toLowerCase() == "post") continue;
            let url = form.find_attr("action");
            
            if(querystring == null) url_list.push(url);
            else url_list.push(url+querystring);
        }
        return url_list.length > 0 ? url_list : null
    }

    #form_querystring(one_form){
        let form_child = one_form.child;
        let result     = "";
        for(let child of form_child){
            let name = child.find_attr("name");
            if(name == null) continue;
            let value = child.find_attr("value");
            if(value != null){
                if(result == "")result = "?" + name + "=" + value;
                else result = result + "&" + name + "=" + value;
            }
            else{
                if(result == "")result = "?" + name + "=";
                else result = result + "&" + name + "=" + value;
            }
        }
        return result != "" ? result : null;
    }

    #push_attr_url(attr_list){  
        op.law(Array, attr_list, "Type Error (method #push_aattr_url arg1)");
        let urls = [];

        for(let url_list of attr_list){
            if(url_list != null){
                for(let url of url_list){urls.push(url);}
            }
        }
        return urls.length >= 1 ? urls : null;
    }


    add_url_tab(url_array, current_url){
        let url_list = url_array;
        url_list = this.#url_filter(url_array);

        if(url_list != null){
            op.print("total"       , url_list.length);
            op.print("select_count", url_list.length);
            let count = 0;            
            for(let url of url_list){
                let tab = url_gen(url, current_url, this.num);
                this.num+=1;
                if(count < 7){tab.attach("find_url");}
                else tab.attach("blank");
                count += 1;
            }
            if(count < 7){
                for(;;){
                    let dummy = url_gen();
                    if(count == 7){
                        dummy.attach("blank");
                        break;
                    }
                    dummy.attach("find_url");
                    count += 1;
                }
            }
            op.attr(op.id("all-select"),{"class" : "current_all_select"})
        }
    }

    #url_filter(url_array){
        op.law(Array, url_array, "Type Error (method url_array arg1)");
        let pure_url      = [];
        let url_param_map = {};

        for(let url of url_array){
            if(url.startsWith("/xjs")){continue;}
            if(url.startsWith("data:")){continue;}
            if(!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/") && !url.startsWith("./") && !url.startsWith("../")){continue;}
            if(parser.param_keys(url)[0] == ""){continue;}
            if(url_param_map[parser.url_extractor(url)]){
                let param_keys  = parser.param_keys(url);
                let saved_param = url_param_map[parser.url_extractor(url)];
                if(this.#param_checker(param_keys, saved_param)){continue;}
            }
            url_param_map[parser.url_extractor(url)] = parser.param_keys(url);

            pure_url.push(url);
        }

        op.law(Array, pure_url, "Type Error (method url_array return)");
        return pure_url;
    }

    #param_checker(param_list, save_list){
        let params = param_list;
        let saved  = save_list;
        let count  = 0;
        if(params.length == saved.length){
            for(let param of params){
                if(saved.includes(param)){count += 1;}
            }
            if(params.length == count){return true;}
            else return false;
        }else{
            return false;
        }
    }
    
    unselect_all(){
        for(;;){
            let targets = document.getElementsByClassName("select_target")
            if(targets.length <= 0){return;}
            for(let target of targets){
                target.setAttribute("class", "target sli");
                target.childNodes[0].childNodes[2].checked = false;
                op.print("select_count", 0);
                op.attr(op.id("all-select"),{"class" : "all-select"});
            }
        } 
    }

    select_all(){
        for(;;){
            let targets = document.getElementsByClassName("target")
            if(targets.length <= 0){return;}
            for(let target of targets){
                target.setAttribute("class", "select_target sli");
                target.childNodes[0].childNodes[2].checked = true;
                op.print("select_count", Number(document.getElementById("total").innerText));
                op.attr(op.id("all-select"),{"class" : "current_all_select"});
            }
        } 
    }
}

Popup4.run_factory();