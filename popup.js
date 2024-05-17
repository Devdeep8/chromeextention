document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('refresh-result').addEventListener('click', refreshEmails);
    document.getElementById('copy').addEventListener('click', copyEmails);
    document.getElementById('download-csv').addEventListener('click', downloadCSV);
    document.getElementById('send-email').addEventListener('click', sendEmail);
  
    refreshEmails(); // Initial refresh
  
    function refreshEmails() {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: scrapeEmails
        }, (results) => {
          if (chrome.runtime.lastError || !results || !results[0] || !results[0].result) {
            console.error('Failed to execute script:', chrome.runtime.lastError || 'No results returned');
            alert('Failed to scrape emails.');
            return;
          }
          displayEmails(results);
        });
      });
    }
  
    function scrapeEmails() {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emails = new Set();
  
      // Search within visible text
      document.body.innerText.match(emailRegex)?.forEach(email => emails.add(email));
  
      // Search within HTML source code
      const html = document.documentElement.innerHTML;
      html.match(emailRegex)?.forEach(email => emails.add(email));
  
      return Array.from(emails);
    }
  
    function displayEmails(results) {
      const emails = results[0].result;
      document.getElementById('email-results').innerHTML = emails.join('<br>');
      document.getElementById('email-count-value').textContent = emails.length;
    }
  
    function copyEmails() {
      const emails = document.getElementById('email-results').innerText;
      navigator.clipboard.writeText(emails).then(() => {
        alert('Emails copied to clipboard.');
      }).catch(err => {
        console.error('Failed to copy emails:', err);
        alert('Failed to copy emails.');
      });
    }
  
    function downloadCSV() {
      const emails = document.getElementById('email-results').innerText;
      const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(emails.replace(/\n/g, ','));
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', 'emails.csv');
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
    }
  
    function sendEmail() {
      const recipientEmails = document.getElementById('email-results').innerText;
      const subject = 'Extracted Email Addresses';
      const body = `Here are the extracted email addresses:\n\n${recipientEmails}`;
  
      const mailtoLink = `mailto:devdeep.prabisha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    }
  });
  