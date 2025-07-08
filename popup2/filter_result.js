import sign            from "../lib/operator.js";
import { VULN_REGEXP } from "../lib/config.js";

class Filter_Result_Element{
    constructor(){
        this.op            = sign();
        this.main          = this.op.gen("ft-res");
        this.param_section = null;
        this.param_header  = null;
        this.result_list   = null;
        this.result_item   = null;
        this.pay_item      = null;
        this.parameter     = null;
        this.info_item     = null;
        
        this.#config();
    }

    #config(){
        this.#default_element_generator();
    }

    #default_element_generator(){
        this.param_section = this.op.gen("div", {"class" : "param-section"});
        this.param_header  = this.op.gen("div", {"class" : "param-header" });
        this.result_list   = this.op.gen("ul" , {"class" : "result-list"  });
        this.result_item   = this.op.gen("li" , {"class" : "result-item"  });
        this.pay_item      = this.op.gen("div");
        this.info_item     = this.op.gen("div");
        
        this.op.appends(this.result_item, [this.pay_item, this.info_item]);
        this.op.append(this.result_list, this.result_item);
        this.op.appends(this.param_section, [this.param_header, this.result_list]);
        this.op.append(this.main, this.param_section);

        this.main.style.cursor = "pointer";
    }

    element_setting(param, payload, status, loc, count){
        this.parameter_display(param);
        this.payload_display(payload, status);
        this.info_display(loc, count);
    }

    update(payload, status){
        this.payload_display(payload, status);
        return this;
    }

    parameter_display(param){
        if(this.op.born(param) != String){throw new Error("Type Error (method parameter_dispaly arg1)");}
        this.param_header.innerText = param; 
        this.parameter              = param;
        this.param_section.setAttribute("id", param);
        this.main.setAttribute("id", param + "-section");
        return this;
    }

    payload_display(payload, status){
        let testing_div       = this.op.gen("div");
        let payload_div       = this.op.gen("div", {"class" : "payload"});
        let status_div        = this.op.gen("div", {"class" : "payload"});
        payload_div.innerText = payload;
        status_div .innerText = status;

        if(this.#vuln_check(status))this.op.apear(testing_div, {"color" : "red"});

        this.op.apear(testing_div, {
            "display"        : "flex",
            "justifyContent" : "space-between"
        })
        this.op.appends(testing_div , [payload_div, status_div]);
        this.op.append (this.pay_item, testing_div             );
        return this
    }

    info_display(loc_type, count){
        let ass_div       = this.op.gen("div");
        let loc_div       = this.op.gen("div", {"class" : "meta"});
        let cnt_div       = this.op.gen("div", {"class" : "meta"});
        let located = "";
        for(let loc of loc_type){located += " | " + loc;}

        loc_div.innerText = "Location type" + located;
        cnt_div.innerText = "count : "         + count;

        this.op.apear(ass_div, {
            "display"        : "flex",
            "justifyContent" : "space-between"
        });

        this.op.appends(ass_div, [loc_div, cnt_div]);
        this.op.append(this.info_item, ass_div     )
        return this;
    }

    attach(target){
        let dom_element = this.op.id(target);
        this.op.append(dom_element, this.main);
        return this;
    }

    click_transmit(sending_target_id){
        this.main.addEventListener("click", ()=>{this.op.print(sending_target_id, this.parameter);});
        return this;
    }

    #vuln_check(msg){return VULN_REGEXP.test(msg);}
}

export let res_gen = function(param, payload, status, loc, count){
    let filter_res = new Filter_Result_Element();
    filter_res.element_setting(param, payload, status, loc, count);
    return filter_res;
}