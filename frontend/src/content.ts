chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "pingSheet") {
    const sheetTitle = (
      document.querySelector(".docs-title-input") as HTMLInputElement
    )?.value;
    console.log("sheetTitle", sheetTitle);
    sendResponse({ sheetTitle });
  }
});
