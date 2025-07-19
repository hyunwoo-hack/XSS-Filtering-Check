import sign           from "../lib/operator.js";
import Input_Parser   from "../lib/inputpaser.js";
import { POPUP4_TAB } from "../lib/config.js";

class Find_url{
    constructor(){
        this.op    = sign();
        this.parser= new Input_Parser(); 
        this.main  = null;
        this.check = null;
        this.num   = null;
        this.url   = null;
        this.param = null;
        this.target= null;
        this.path  = null;

        this.#config();
    }

    #config(){
        this.#default_element_generator();
        this.#click_color_change();
    }

    #default_element_generator(){
        this.main   = this.op.gen("div"  , {"class" : "select_target sli", "id" : "target_section"});
        this.check  = this.op.gen("input", {"type"  : "radio"     });
        this.num    = this.op.gen("div"  , {"class" : "target-number"});
        this.url    = this.op.gen("div"  , {"class" : "target-url"   });
        this.target = this.op.gen("input", {"type"  : "hidden", "class" : "hidden-url"})
        this.param  = this.op.gen("div"  , {"id" : "param"});
        this.path   = this.op.gen("div");
        let mid     = this.op.gen("div");
        let mid2    = this.op.gen("div", {"class" : "host-tab"});

        this.check.checked = true;       
        this.op.apear(this.param , {marginBottom : "10px"   , fontSize   : "12px"});
        this.op.apear(this.check , {marginRight  : "20px"   , marginLeft : "10px"});
        this.op.apear(this.url   , {color        : "orange" , textAlign  : "center", paddingTop : "5px"});
        this.op.apear(this.num   , {color        : "#dadcde", width      : "40px"  , textAlign  : "center",  paddingTop : "5px"});
        this.op.apear(this.path  , {textAlign    : "center" , paddingBottom : "5px", borderBottomRadius : "1px solid gray", fontSize : "12px"});
        this.op.appends(mid      , [this.path ,this.param, this.target]);
        this.op.appends(mid2     , [this.num, this.url, this.check])
        this.op.appends(this.main, [mid2, mid]);
        
    }

    #click_color_change(){
        this.main.addEventListener("click",()=>{
            this.main.classList.contains("select_target") ? this.main.setAttribute("class", "target sli") : this.main.setAttribute("class", "select_target sli");
            if(this.check.checked){
                this.check.checked = false;
                this.op.print("select_count", Number(document.getElementById("select_count").innerText) - 1);
                this.op.attr(this.op.id("all-select"),{"class" : "all-select"});
                
            }else{
                this.check.checked = true;
                this.op.print("select_count", Number(document.getElementById("select_count").innerText) + 1);
                if(Number(document.getElementById("total").innerText) == Number(document.getElementById("select_count").innerText)){
                    this.op.attr(this.op.id("all-select"),{"class" : "current_all_select"});
                }
            }
        })
    }

    data_setting(url, current_url, num){
        let full_url         = url;
        if(full_url.startsWith("./") || full_url.startsWith("../") || full_url.startsWith("/")) {
            full_url = this.#to_absolute(full_url, current_url);
        }

        let domain_path      = this.parser.url_extractor(full_url);
        let host             = this.parser.host_extractor(domain_path);
        let path             = domain_path.replace(host, "");
        let params           = this.#param_to_string(this.parser.param_keys(full_url));
        params               = decodeURIComponent(params);

        this.num.innerText   = num;
        this.target.value    = full_url;
        this.url.innerText   = decodeURIComponent(host);
        this.path.innerText  = decodeURIComponent(path).length <= 45 ? decodeURIComponent(path) : decodeURIComponent(path).slice(0,35) + ". . . ." + decodeURIComponent(path).slice(-10);
        this.param.innerText = params;
    }

    #param_to_string(param_array){
        let result = "";
        let params = param_array;
        let count  = null;
        if(params.length >= 16){
            params = param_array.slice(0,16)
            count = param_array.length - 16; 
        }
        for(let param of params){
            if(result == ""){
                result += this.#decode_html_entities(param);
            }else{ 
                result += " ," + this.#decode_html_entities(param);
            }
        }
        if(count){result = result + "... + " + count;}

        return result;
    }

    #decode_html_entities(str) {
          let map = {
            'amp;'  : '&',
            'lt;'   : '<',
            'gt;'   : '>',
            'quot;' : '"',
            '#39;'  : "'",
            '#x2F;' : '/',
            '#96;'  : '`',
            '#x3D;' : '='
        };
        let result;
        for(let enti of Object.keys(map)){
            if(str.includes(enti)){
                result = str.replace(enti, map[enti]);
            }
        }

        return result ? result : str;
    }

    #to_absolute(url, current_url){
        let host = this.parser.host_extractor(current_url);
        let path = this.parser.url_extractor(current_url).replace(host, "");

        if(url.startsWith("/")){
            return host + url;
        }else if(url.startsWith("./")){
            return host + path + url.substring(1);
        }else if(url.startsWith("../")){
            let count = 1;
            for(;;){
                let url_cp = url;
                url_cp   = url_cp.substring(3);
                if(!url_cp.startsWith("../")){break;}
                count++
            }
            let res_path = this.parser.path_calc(path, count);
            return host + res_path + url_cp;
        }
    }  


    attach(element_id){
        this.op.append(element_id, this.main)
    }
}

export default function url_gen(url, current_url, num){
    let find_url = new Find_url();
    if(url&& current_url && num){
        find_url.data_setting(url, current_url, num);
    }
    return find_url;
}
