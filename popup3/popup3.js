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

    this.prevHtmlList = [];
    this.historyBox = null;
    this.testCount = 0;
    this.lastHtmlSnapshot = "";
  }

  async grabCurrentHTML() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.outerHTML,
    });
    return { tab, html: result, url: tab.url };
  }

  renderRawHtmlBlock(html, url, testNum) {
    const block = document.createElement("div");
    block.className = "diff-block";

    block.innerHTML = `
      <button class="del-btn">❌</button>
      <div class="caption"><strong>Test #${testNum}</strong> - 최초 HTML (URL: ${url})</div>
      <pre>${html.replace(/</g, "&lt;")}</pre>
    `;

    block.querySelector(".del-btn").onclick = () => {
      block.remove();
      this.removeHistory(testNum);
    };

    this.historyBox.appendChild(block);
  }

  renderDiffBlock(oldHTML, newHTML, url, testNum) {
    const diff = Diff.diffLines(oldHTML, newHTML);
    const summary = `<div class="summary">
      <strong>Summary:</strong> 
      Added: ${diff.filter((p) => p.added).length}, 
      Removed: ${diff.filter((p) => p.removed).length}
    </div>`;

    const html = diff
      .map((p) => {
        const style = p.added
          ? "background:#c8facc;"
          : p.removed
          ? "background:#ffc8c8;text-decoration:line-through;"
          : "";
        return `<span style="${style}">${p.value.replace(/</g, "&lt;")}</span>`;
      })
      .join("");

    const block = document.createElement("div");
    block.className = "diff-block";

    block.innerHTML = `
      <button class="del-btn">❌</button>
      <div class="caption"><strong>Test #${testNum}</strong> - 변경 비교 (URL: ${url})</div>
      <pre>${summary + html}</pre>
    `;

    block.querySelector(".del-btn").onclick = () => {
      block.remove();
      this.removeHistory(testNum);
    };

    this.historyBox.appendChild(block);
  }

  async startAutoObserver() {
    const checkHtml = async () => {
      const { html, url } = await this.grabCurrentHTML();
      if (this.lastHtmlSnapshot === html) return;

      this.testCount++;
      if (this.prevHtmlList.length === 0) {
        this.renderRawHtmlBlock(html, url, this.testCount);
      } else {
        const prevHtml = this.prevHtmlList[this.prevHtmlList.length - 1].html;
        this.renderDiffBlock(prevHtml, html, url, this.testCount);
      }

      this.prevHtmlList.push({ html, url, testNum: this.testCount });
      this.lastHtmlSnapshot = html;
      this.saveHistory();
    };

    await checkHtml();
    setInterval(checkHtml, 2000);
  }

  saveHistory() {
    chrome.storage.local.set({
      prevHtmlList: this.prevHtmlList,
      testCount: this.testCount,
      lastHtmlSnapshot: this.lastHtmlSnapshot,
    });
  }

  removeHistory(testNum) {
    this.prevHtmlList = this.prevHtmlList.filter(
      (item) => item.testNum !== testNum
    );
    this.saveHistory();
  }

  async restoreHistory() {
    return new Promise((res) => {
      chrome.storage.local.get(
        ["prevHtmlList", "testCount", "lastHtmlSnapshot"],
        (result) => {
          if (result.prevHtmlList) {
            this.prevHtmlList = result.prevHtmlList;
            this.testCount = result.testCount || 0;
            this.lastHtmlSnapshot = result.lastHtmlSnapshot || "";
            for (let i = 0; i < this.prevHtmlList.length; i++) {
              const { html, url, testNum } = this.prevHtmlList[i];
              if (i === 0) this.renderRawHtmlBlock(html, url, testNum);
              else
                this.renderDiffBlock(
                  this.prevHtmlList[i - 1].html,
                  html,
                  url,
                  testNum
                );
            }
          }
          res();
        }
      );
    });
  }

  bindElements() {
    this.historyBox = this.op.id("diffFrame");
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
      } else {
        this.obser.deoperated();
        this.op.print("toggle_status", "off");
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  const pop = new Popup3();
  await pop.status_auto_set();
  await pop.toggle_status_print();
  pop.bindElements();
  await pop.restoreHistory();
  pop.startAutoObserver();
});
