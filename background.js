chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: scrapeEmails
    });
  });
  
  function scrapeEmails() {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = [...document.body.innerText.matchAll(emailRegex)];
    chrome.storage.local.set({emails: emails.map(match => match[0])});
  }
  