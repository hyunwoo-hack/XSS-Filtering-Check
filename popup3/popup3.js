import sign from "../lib/operator.js";
import Input_Parser from "../lib/inputpaser.js";
import Storage_Controller from "../lib/storageController.js";
import Dom_Observer from "../lib/dom_obsever.js";


class Popup3 {
    constructor() {
        this.op = sign();
        this.sc = new Storage_Controller();
        this.obser = new Dom_Observer();
        this.parser = new Input_Parser();
    }

    async status_auto_set() {
        if (await this.obser.exist()) {
            this.op.id("observ").checked = true;
            this.op.print("toggle_status", "on");
        }
    }

    async toggle_status_print() {
        this.op.change("observ", () => {
            if (this.op.scan("observ")) {
                this.obser.operated();
                this.op.print("toggle_status", " on");
            }
            else {
                this.obser.deoperated();
                this.op.print("toggle_status", "off");
            }
        })
    }

    async grabCurrentHTML() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.documentElement.outerHTML
        });
        return { tab, html: result };
    }

    async fetchModifiedHTML(tab, paramString) {
        const url = new URL(tab.url);
        url.search = new URLSearchParams(paramString).toString();

        return new Promise(res =>
            chrome.runtime.sendMessage({ type: "fetchHTML", url: url.toString() },
                r => res(r?.html ?? ""))
        );
    }

    // 3) 두 HTML diff → iframe 에 바로 렌더
    renderDiff(oldHTML, newHTML) {
        const diff = Diff.diffLines(oldHTML, newHTML);
        const html = diff.map(p =>
            `<span style="${p.added ? "background:#c8facc;" :
                p.removed ? "background:#ffc8c8;text-decoration:line-through;" : ""}">
         ${p.value.replace(/</g, "&lt;")}
       </span>`
        ).join("");
        this.op.id("diffFrame").srcdoc = `<pre style="font-family:monospace;">${html}</pre>`;
    }

    /* ────────────────────────────────  바인딩  ─────────────────────────────── */

    bindDiffButton() {
        this.op.id("runDiff").addEventListener("click", async () => {
            const paramStr = this.op.id("paramBox").value.trim();
            if (!paramStr) return;

            const { tab, html: orig } = await this.grabCurrentHTML();
            const modified = await this.fetchModifiedHTML(tab, paramStr);
            this.renderDiff(orig, modified);
        });
    }

    static async run_factory() {
        let pop = new Popup3();
        await pop.status_auto_set();
        await pop.toggle_status_print();
        pop.bindDiffButton();
    }
}

await Popup3.run_factory();