chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_html") {
    const html = document.documentElement.outerHTML;
    const url = window.location.href;
    sendResponse({ html, url });
  }
  return true;
});