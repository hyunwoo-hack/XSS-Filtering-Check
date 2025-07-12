import sign          from "../operator.js";
import Html_Lexer    from "./html_lexer.js";
import { VOID_TAGS, ABNORMAL_START, ABNORMAL_END } from "../config.js";


class Element_Node{
    constructor(tag_name=""){
        this.op         = sign();
        this.quote      = null;
        this.tag_name   = null;
        this.attribute  = {};
        this.gparent    = null;
        this.parent     = null;
        this.child      = [];
        this.inline_txt = null;
        this.abnormal   = false;
        this.set_tag_name(tag_name);
    }
    
    set_tag_name(tag){
        this.op.law(String, tag, "Type Error (method set_tag_name arg1)");
        this.tag_name = tag;
        return this;
    }

    set_attribute(attr_key, attr_val){
        this.op.law(String, attr_key, "Type Error (method set_attribute arg1)");
        this.attribute[attr_key] = attr_val;
        return this;
    }

    set_gparent(gparent_node){
        this.gparent = gparent_node;
        return this;
    }
        
    set_parent(parent_node){
        this.parent = parent_node;
        return this;
    }

    set_child(child_node){
        this.child.push(child_node);
        return this;
    }

    set_inline_txt(txt){
        this.inline_txt = txt;
        return this;
    }

    set_quote(quote){
        this.quote = quote;
        return this;
    }

    set_abnormal(ab_key, ab_val){
        if(this.abnormal == false){
            this.abnormal = {};
        }
        this.abnormal[ab_key] = ab_val;
        return this;
    }

    find_attr(attr_name){
        this.op.law(String, attr_name, "Type Error (method find attr arg1)");
        return this.attribute[attr_name] ? this.attribute[attr_name] : null;
    }
}

export default class Html_Ast extends Html_Lexer{
    constructor(){
        super();
        this.op            = sign();
        this.scope_stack   = [];
        this.abnormal_stack= [];

        this.token         = null;
        this.main          = null;
        this.tags          = {};
        this.attribute     = null;
        this.ast           = null
    }
    
    ast_generator(html){
        this.op.law(String, html, "Type Error (method ast_generator arg1)");
        this.token = this.lex(html);
        this.#parser();
        this.#json_ast();
    }

    ast_load(ast_tree){
        this.op.law(Object, ast_tree, "Type Error (method ast_load arg1)");
        this.ast = ast_tree;
    }

    #tag_exist(tag_name){
        this.op.law(String, tag_name, "Type Error (method #tag_exist arg1)");
        let tag_keys = this.op.keys(this.tags);
        if(tag_keys.length <= 0) return false; 
        if(tag_keys.includes(tag_name))return true;
        return false;
    }

    #tag_update(tag_name, node){
        if(this.#tag_exist(tag_name)){
            this.tags[tag_name].push(node);
        }else{
            this.tags[tag_name] = [];
            this.tags[tag_name].push(node);
        }
        return true;
    }

    #family_setting(target, parent, gparent){
        if(parent != null){
            target.set_parent(parent);
            parent.set_child(target);
        }
        if(gparent != null){
            target.set_gparent(gparent);
        }
        return true;
    }

    #scope_exrv(idx=0){
        return this.scope_stack[this.scope_stack.length - (1 + idx)] ? this.scope_stack[this.scope_stack.length - (1 + idx)] : null;
    }

    #parser(){
        let tokens     = this.token;
        let inline_txt = 0;
        let current_node;

        for(let i = 0; tokens.length > i; i++){
            let current_token = tokens[i];
            let back_token    = tokens[i+1] ? tokens[i+1] : null;
            let bback_token   = tokens[i+2] ? tokens[i+2] : null;

            switch(current_token){
                case "":
                    break;
                case "<":
                    inline_txt       = 0;
                    let last_nodes   = this.#abnormal_node_del();
                    let node         = back_token != null ? new Element_Node(back_token) : new Element_Node("null");
                    let back_node    = last_nodes[0];
                    let bback_node   = last_nodes[1];
                    current_node = node;

                    if(!VOID_TAGS.includes(back_token)){
                        this.scope_stack.push(node);
                        if(i == 0){this.main = node;}
                        else{this.#family_setting(node, back_node, bback_node);}
                    }else if(VOID_TAGS.includes(back_token)){this.#family_setting(node, back_node, bback_node);}
                    this.#tag_update(back_token, node);
                    i += 1;
                    break;
                case "</":
                    inline_txt = 0;
                    let back_tag = this.#scope_exrv().tag_name ? this.#scope_exrv().tag_name : null;
                    if(back_tag == back_token){
                        this.scope_stack.pop();
                    }
                    else if(back_tag == "weird_tag"){
                        let ab_node = this.scope_stack.pop();
                        let ab_tag_list = ab_node.abnormal.tag_name;

                        if(!ab_tag_list.includes(back_token)){
                            for(let ab_tag of ab_tag_list){
                                if(VOID_TAGS.includes(ab_tag)){
                                    this.scope_stack.pop();
                                }
                            }
                        }else{
                            ab_node.set_abnormal("ending_tag", back_token);
                        }
                    }
                    i += 2;
                    inline_txt = 1;
                    break;
                case ">":
                    inline_txt = 1;
                case "/>":
                    inline_txt = 1;
                case ABNORMAL_START:
                    if(bback_token == ABNORMAL_END){
                        let node         = new Element_Node("weird_tag");
                        let back_node    = this.#scope_exrv();
                        let bback_node   = this.#scope_exrv(1);
                        this.#family_setting(node, back_node, bback_node);
                        current_node     = node;

                        let abnormal_tag_name = this.#abnormal_tag_name_finder(back_token);
                        this.scope_stack.push(node);
                        node.set_abnormal("tag_name", abnormal_tag_name);
                        node.set_abnormal("tag", back_token);
                        node.set_abnormal("ending_tag", null);
                        i += 2;
                        inline_txt = 1;
                    }
                    break;
                default:
                    if(inline_txt == 1){
                        current_node.set_inline_txt(current_token);
                    }else{
                        if(inline_txt == 0 && !current_token.includes("\"") && !current_token.includes("'") && !current_token.includes("`")){
                            if(back_token == "=" && (bback_token.includes("\"") || bback_token.includes("'") || bback_token.includes("`"))){
                                let using_quote = bback_token[0];
                                let attr_val    = bback_token.slice(1,-1);
                                current_node.set_quote(using_quote)
                                current_node.set_attribute(current_token, attr_val);
                                i += 2;
                            }else if(back_token == "=" && (!bback_token.includes("\"") && !bback_token.includes("'") && !bback_token.includes("`"))){
                                current_node.set_attribute(current_token, "");
                                i += 1
                            }else if(back_token != "="){
                                current_node.set_attribute(current_token, null);
                            }
                        }
                    }
            }
        }
    }

    #abnormal_node_del(){
        let index = 0;
        let result = [];
        for(let i = 0;;i++){
            let back = this.#scope_exrv(index);
            if(!this.#abnormal_void_tester(back)){result.push(back);}
            if(result.length == 2){return result;}
            index += 1;
        }
    }

    #abnormal_void_tester(back_tag){
        if(!back_tag){return null;}
        if(back_tag.tag_name != "weird_tag"){return false;}
        let ab_data  = back_tag.abnormal;
        let tag_list = ab_data.tag_name;
        for(let tag of tag_list){
            if(VOID_TAGS.includes(tag)){return true;}
        } 
        return false
    }

    #abnormal_tag_name_finder(abnormal_tag){
        let flag     = 0;
        let key_word = "";
        let tag_name = [];

        let abnor = abnormal_tag.replace("<", " <");
        for(let i = 0; abnor.length > i; i++){
            let current_word = abnor[i];
            if(flag == 1){
                if(current_word == " "){
                    flag = 0;
                    tag_name.push(key_word.replace("<", ""));
                    key_word = ""
                    continue;
                }
                key_word += current_word;
            }
            if(current_word == "<"){flag = 1;}
        }

        return tag_name
    }

    #json_ast(){
        let dict = this.#to_dict(this.main);
        let ast  = {"main" : dict};
        ast      = JSON.stringify(ast);
        this.ast = ast
    }

    #to_dict(node){
        let dict = {};
        dict[ "nodeType" ] = "element";
        dict[ "tagName"  ] = node.tag_name;
        dict["attribute" ] = Object.assign({}, node.attribute);
        dict["inlineText"] = node.inline_txt;
        dict[ "abnormal" ] = node.abnormal;
        dict[   "quote"  ] = node.quote;
        dict[   "child"  ] = [];
        if(node.child.length > 0){
            for(let child_node of node.child){ dict["child"].push(this.#to_dict(child_node)); }
        }
        return dict;
    }

    attr_finder(attr_val){
        this.op.law(String, attr_val, "Type Error (method attr_finder arg1)");
        let all_element = this.op.values(this.tags);
        let result = [];
        for(let elements of all_element){
            for(let element of elements){
                let attr = element.find_attr(attr_val);
                if(attr != null){
                    result.push(attr);
                }
            }
        }
        return result.length >= 1 ? result : null;
    }

    tag_finder(tag_name){
        this.op.law(String, tag_name, "Type Error (method tag_finder arg1)");
        let tag_list = this.tags[tag_name] ? this.tags[tag_name] : null;
        return tag_list; 
    }
}