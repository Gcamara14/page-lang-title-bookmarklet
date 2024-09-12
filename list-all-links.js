javascript:(function(){
  'use strict';

  /**
   * Get absolute xPath position from dom element
   * xPath position will not contain any id, class or attribute selectors
   * 
   * @param {Element} element element to get position
   * @returns {String} xPath string
   */
  function getXPath(element) {
    let selector = '';
    let foundRoot;
    let currentElement = element;

    do {
      const tagName = currentElement.tagName.toLowerCase();
      const parentElement = currentElement.parentElement;

      if (parentElement.childElementCount > 1) {
        const parentsChildren = [...parentElement.children];
        let tag = [];
        parentsChildren.forEach(child => {
          if (child.tagName.toLowerCase() === tagName) tag.push(child);
        });

        if (tag.length === 1) {
          selector = `/${tagName}${selector}`;
        } else {
          const position = tag.indexOf(currentElement) + 1;
          selector = `/${tagName}[${position}]${selector}`;
        }
      } else {
        selector = `/${tagName}${selector}`;
      }

      currentElement = parentElement;
      foundRoot = parentElement.tagName.toLowerCase() === 'html';
      if (foundRoot) selector = `/html${selector}`;
    } while (foundRoot === false);

    return selector;
  }

  // Function to list all <a> links
  function listLinks() {
    console.clear();
    
    let row = '';
    const links = document.querySelectorAll('a'); // Select all <a> elements
    const domain = window.location.origin; // Get the full domain
    let i = 1;

    links.forEach(function (link) {
      const url = link.getAttribute('href') || '[No href]'; // Get URL or [No href]
      const fullUrl = (url.startsWith('http') || url.startsWith('www')) ? url : domain + url; // Full URL
      const xPathLocation = getXPath(link);

      // Construct row
      row += '<tr>';
      row += `<td><code>&lt;a&gt;</code></td>`; // Tag type
      row += `<td>${link.textContent || '[No Text]'}</td>`; // Link text or '[No Text]'
      row += `<td>${fullUrl}</td>`; // Full URL
      row += `<td><div class="snippet"><textarea readonly>${xPathLocation}</textarea></div></td>`; // XPath
      row += `<td><button onclick="window.open('${fullUrl}', '_blank')">Visit</button></td>`; // Button to visit link
      row += '</tr>';
      i++;
    });

    // CSS styling (same as your original)
    let style = `
    <style>
      [aria-pressed=true]{color:white;background:darkred;};div.issues{font-weight:bold;};
      textarea {margin:5px 0;}.snippet label {font-weight:bold;font-size:0.8em;color:black;}.snippet{background:#efefef;outline:1px solid #666;padding:5px;margin-top:5px;}.checkDiffs{background:PapayaWhip;}.anDiff{color:red;font-weight:bold;font-size:10px;display:block}.warn {background:initial;}.err {background:initial;}.visually-hidden,.a11y,.visuallyhidden,.sr-text,.sr-only {clip-path: inset(100%);clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;white-space: nowrap;width: 1px;}* {-webkit-box-sizing: border-box;box-sizing: border-box;}html {/*border: .75em solid #fff;*/min-height: 100vh;}body {background: #f7f7f5;color: #333;font: 400 105%/1.4 "Work Sans", sans-serif;margin: 1.5em auto;max-width: 54em;width: 90%;}a:img,a:visited {border-bottom: 1px solid rgba(42, 122, 130, .5);color: #2b7a82;text-decoration: none;}a:hover {border-bottom: 2px solid;color: #1e565c;}button:focus,a:focus {box-shadow: none;outline-offset: 2px;outline: 3px solid rgba(42, 122, 130, .75);}a:focus {border-bottom: none;}a:active {background: #333;color: #fff;}code {font-family: Consolas, monaco, monospace;-moz-tab-size: 4;tab-size: 4;text-transform: none;white-space: pre-wrap;color:brown;}textarea {width: 100%}legend h2, legend h3 {margin: 0;}table {border-collapse: collapse;}th,td {padding: 10px;border:2px solid #2b7a82;}table caption {font-weight: bold;text-align: left;margin:1em 0;}th{min-width: 200px;} table td:nth-child(3), table th:nth-child(3){ background: yellow; font-weight: bold; color: #000000; }
    </style>
    `;

    // Add jQuery and DataTables CSS and JS
    let dataTableLinks = `
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link href="https://cdn.datatables.net/v/dt/dt-2.1.6/datatables.min.css" rel="stylesheet">
    <script src="https://cdn.datatables.net/v/dt/dt-2.1.6/datatables.min.js"></script>
    `;

    // Table structure
    let s = '<h1>List of Links on this page.</h1>';
    s += '<table id="linksTable" class="display" border="1" cellpadding="5">';
    s += '<thead><tr valign="top"><th>Tag Type</th><th>Link Text</th><th>URL</th><th>XPath</th><th>Action</th></tr></thead>';
    s += `<tbody>${row}</tbody>`;
    s += '</table>';
    
    // Add Export button and DataTables initialization
    s += `
    <button onclick="exportAsHTML()">Export as HTML</button>
    <script>
      function exportAsHTML() {
        const data = \`${style + s}\`;
        const blob = new Blob([data], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links_export.html';
        a.click();
        URL.revokeObjectURL(url); // Clean up
      }
      
      // Initialize DataTables after the page loads
      $(document).ready(function() {
        $('#linksTable').DataTable();
      });
    </script>
    `;

    // Open a new window and display the table with export button and DataTables functionality
    const popUpWinLinks = window.open('', 'popUpWinLinks', 'height=800,width=1000');
    popUpWinLinks.document.open();
    popUpWinLinks.document.write(dataTableLinks + style + s);
    popUpWinLinks.document.close();
  }

  // Call the function to list the links
  listLinks();
})();
