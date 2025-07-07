import sign from "../operator.js"

export default class Html_Lexer{
    constructor(){
        this.op = sign();
    }

    html_lex(){

    }

    tag_splitter(html){ // 주성 제거 로직 있어야 함. 
        this.op.law(String, html, "Type Error (method tag_splitter arg1)");
        let tag_list = [];
        let one_tag  = "";
        let count    = 0;
        let tag_flag = 0;
        let inner_txt= 0;

        for(let i = 0; html.length > i; i++){
            let arp = html[i];
            if(arp == "<"){
                inner_txt = 0;
                tag_flag += 1;
                if(one_tag){tag_list.push(one_tag.trim());}
                one_tag = "";
                one_tag += arp;
            }else if(arp == ">"){
                tag_flag = 0;
                one_tag += arp;
                tag_list.push(one_tag.trim());
            }else if(tag_flag == 0){
                if(inner_txt  == 0){
                    inner_txt += 1;
                    one_tag   = "";
                }
                one_tag += arp;
            }else{
                one_tag += arp;
            }     
        }
        tag_list = tag_list.filter(Boolean);
        this.op.law(Array, tag_list, "type Error (method tag_splitter return)");
        return tag_list;
    }

    tokenizer(tag_list){
        this.op.law(Array, tag_list, "type Error (method tokenizer arg1)");
        let token    = [];
        
        for(let tag of tag_list){
            if(tag[0] == "<") this.#tag_tokenizer(tag);
            else token.push(tag);
        }

        this.op.law(Array, token, "type Error (method tokenizer return)");
        return token
    }

    #tag_tokenizer(tag){
        this.op.law(String, tag, "Type Error (method tag_tokenizer arg1)")
        
        let token         = [];
        let attr_flag     = 0;
        let tag_name_flag = 0;
        let attr_quote    = ""; 
        let key_word      = ""; 
        for(let i = 0; tag.length > i; i++){
            let current_word = tag[ i ];
            let back_word    = tag[i+1];
            let bback_word   = tag[i+2] ? tag[i+2] : null; 
            let front_word   = tag[i-1] ? tag[i-1] : null;
            let last_token   = token[token.length-1] ? token[token.length-1] : null;

            if(current_word == "<" && attr_flag == 0){
                if(back_word == "/"){
                    token.push(current_word + back_word);
                    i += 1;
                }else{token.push(current_word);}
                continue;
            }
            if(current_word == "/" && back_word == ">" && attr_flag == 0){
                token.push(current_word + back_word);
                i += 1;
                continue;
            }
            if(current_word == ">" && front_word != "/" && attr_flag == 0){token.push(current_word); continue;}
            if((tag_name_flag == 1 && attr_flag == 0) || ((last_token == "<" || last_token == "</") && attr_flag == 0)){
                if(tag_name_flag == 0){ tag_name_flag += 1;}
                key_word += current_word;
                if(current_word == " " || back_word == ">"){
                    token.push(key_word.trim());
                    key_word      = "";
                    tag_name_flag = 0;
                }
                continue;
            }
            if(attr_flag == 1 || ((current_word == "'" || current_word == "\"" || current_word == "`") && attr_flag == 0)){
                if(attr_flag == 0){
                    attr_flag  += 1;
                    attr_quote += current_word; 
                    key_word   += current_word;
                    continue;
                }
                key_word += current_word;
                if(current_word == attr_quote){
                    token.push(key_word.trim());
                    attr_quote = "";
                    key_word   = "";
                    attr_flag  = 0;
                }
                continue;
            }
            if(current_word == "="){
                token.push(current_word);
                continue;
            }
            if(attr_flag == 0){
                key_word += current_word;
                if(back_word == "=" || back_word == ">" || back_word + bback_word == "/>"){
                    token.push(key_word.trim());
                    key_word = "";
                }
                continue;
            }

        }
        console.log(token);

        this.op.law(Array, token, "Type Error (method tag_tokenizer return)")
        return token;
    }
}
//"<title>"   ">meta" ">title"

let html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Popup 2 - XSS Filter Visualizer</title>
    <meta name="hidden-input" content="2" />
    <link rel="stylesheet" href="./popup2.css" />
</head>
<body>
<div class="container">
    <!-- Header -->
    <div class="header">
        <button id="back-button" class="back-button">
            ←
        </button>
        <div class="title">XSS Filter Visualizer</div>
    </div>

    <!-- Stats (예시) -->
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number" id="total-tests">0</div>
            <div class="stat-label">총 테스트</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="vuln-found">0</div>
            <div class="stat-label">취약점 발견</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="filtered">0</div>
            <div class="stat-label">필터링 됨</div>
        </div>
    </div>

    <!-- Dynamic Params Sections -->
    <div class="result-section" id="result-section">
        <!-- 여기에 각 파라미터별로 섹션을 추가 -->
    </div>

    <!-- 다시 스캔할 경우 입력란 -->
    <div class="input-section">
        <label for="test-param" class="input-label">
            테스트 파라미터 <span class="required">*</span>
        </label>
        <input
                type="text"
                id="test-param"
                class="input-field"
                placeholder="q, search"
        />
        <button id="start-scan" class="scan-button">스캔 시작</button>

        <div id="errorBanner" class="error-banner"></div>
    </div>
</div>
<script type="module" src="./popup2.js"></script>

<ft-res></ft-res>
</body>
</html>`

let a = new Html_Lexer();
let lis = a.tag_splitter(html);
console.log(lis);
let tok = a.tokenizer(lis);
console.log(tok);