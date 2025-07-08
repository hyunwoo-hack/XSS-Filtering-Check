import sign               from "../lib/operator.js";
import Input_Parser       from "../lib/inputpaser.js";
import Storage_Controller from "../lib/storageController.js";
import Dom_Observer       from "../lib/dom_obsever.js";


class Popup3{  
    constructor(){
        this.op     = sign();
        this.sc     = new Storage_Controller();
        this.obser  = new Dom_Observer();
        this.parser = new Input_Parser();
    }

    static async run_factory(){
        let pop = new Popup3();
        await pop.status_auto_set();

        await pop.toggle_status_print();
    }

    async status_auto_set(){
        if(await this.obser.exist()){
            this.op.id("observ").checked = true;
            this.op.print("toggle_status", "on");
        }
    }

    async toggle_status_print(){
        this.op.change("observ", ()=>{
            if(this.op.scan("observ")){
                this.obser.operated();
                this.op.print("toggle_status", " on");
            }
            else{
                this.obser.deoperated();
                this.op.print("toggle_status", "off");
            }
        })
    }
}

await Popup3.run_factory();