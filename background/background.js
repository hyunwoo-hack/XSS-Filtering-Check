import Xss_Bayev     from "../lib/xss_bayev.js";
import sign          from "../lib/operator.js";
import Input_Parser  from "../lib/inputpaser.js";
import {Recver}      from "../lib/messegeController.js";
import Dom_Storage   from "../lib/dom_storage.js";
import {OPTION_KEYS, START_MSG, FILTER_CHECK, ATTACK_START} from "../lib/config.js";

const op            = sign();
const xss           = new Xss_Bayev(OPTION_KEYS);
const parser        = new Input_Parser();
const sensor        = new Dom_Storage();
const filter_recver = new Recver();
const replay_recver = new Recver();
const attack_recver = new Recver();


class Back_Ground{
  static async run_factory(){
    const back = new Back_Ground();

    filter_recver.resp_set(START_MSG);
    replay_recver.resp_set(START_MSG);
    attack_recver.resp_set(START_MSG);

    filter_recver.recv_resp(FILTER_CHECK, [(msg)=>{back.filter_seeker(msg.payload)}], "started");
    attack_recver.recv_resp(ATTACK_START, [(msg)=>{back.attack_seeker(msg.payload)}], "started");
  }

  constructor(){
    this.xss_obj    = {};// url : xss 객체
    this.xss_length = null;
    this.opt        = null;
  }
 // 전부 다 배열인지 아닌지 구분하는 방식으로 함수 실행 해보자 

  async filter_seeker(config=null) { // 이 인에서 객체 만들고 저장 해야 할 듯 
    if(config){
      if(op.born(config) == Array){
        this.xss_length = config.length;
        for(let one_target of config){
          if(!await this.#url_xss_obj(one_target["url"], one_target))return false;
        }
      }
      else if(op.born(config) == Object){
        this.xss_length = 1;
        if(!await this.#url_xss_obj(config["url"], config)) return false;
        else return true;
      }else return false;

    }
  }

  async #url_xss_obj(url, config){
    let xss_ins = new Xss_Bayev(OPTION_KEYS);
    this.xss_obj[parser.url_extractor(url)] = xss_ins;
    if(!await xss_ins.setting(config)) return false;
    await xss_ins.filter_cosmo();
    return true;
  }



  async attack_seeker(config){
    let url = config["current_url"];
    let target_ins = this.xss_obj[url];
    await target_ins.attack_naut(config);
  }

}
Back_Ground.run_factory();