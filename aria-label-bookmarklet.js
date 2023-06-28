javascript:(function(){'use strict'
// Start of code to display the xpath

/**
 * Get absolute xPath position from dom element
 * xPath position will does not contain any id, class or attribute, etc selector
 * Because, Some page use random id and class. This function should ignore that kind problem, so we're not using any selector
 * 
 * @param {Element} element element to get position
 * @returns {String} xPath string
 */
 function getXPath(element) {
    // Selector
    let selector = '';
    // Loop handler
    let foundRoot;
    // Element handler
    let currentElement = element;

    // Do action until we reach html element
    do {
        // Get element tag name 
        const tagName = currentElement.tagName.toLowerCase();
        // Get parent element
        const parentElement = currentElement.parentElement;

        // Count children
        if (parentElement.childElementCount > 1) {
            // Get children of parent element
            const parentsChildren = [...parentElement.children];
            // Count current tag 
            let tag = [];
            parentsChildren.forEach(child => {
                if (child.tagName.toLowerCase() === tagName) tag.push(child) // Append to tag
            })

            // Is only of type
            if (tag.length === 1) {
                // Append tag to selector
                selector = `/${tagName}${selector}`;
            } else {
                // Get position of current element in tag
                const position = tag.indexOf(currentElement) + 1;
                // Append tag to selector
                selector = `/${tagName}[${position}]${selector}`;
            }

        } else {
            //* Current element has no siblings
            // Append tag to selector
            selector = `/${tagName}${selector}`;
        }

        // Set parent element to current element
        currentElement = parentElement;
        // Is root  
        foundRoot = parentElement.tagName.toLowerCase() === 'html';
        // Finish selector if found root element
        if(foundRoot) selector = `/html${selector}`;
    }
    while (foundRoot === false);

    // Return selector
    return selector;
}

// Start of regular JS Code to display the table
function listThingsWithTitles(){
  console.clear();
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
  function isHidden(el) {
    const style=window.getComputedStyle(el);
    return ((style.display === 'none')||(style.opacity === 0)||((style.clipPath === 'inset(100%)')&&(style.clip === 'rect(1px, 1px, 1px, 1px)'))||((style.height === '1px')&&(style.width === '1px')&&(style.overflow === 'hidden')));
  }
  function attemptoToUnhide(el) {
    const style=window.getComputedStyle(el);
    if ((style.position==="absolute")&&(style.overflow === 'hidden')) {
      el.style.height='auto'; 
      el.style.width='auto';
      el.style.position='relative';
      el.style.overflow='visible';
      el.style.display='block';
      el.style.opacity=1;
    }
    if ((el.getAttribute('hidden')==="")||(el.getAttribute('hidden')==="hidden")||(el.getAttribute('hidden')==="true")) {
      el.removeAttribute('hidden');
    }
    if (style.visibility === 'hidden') {
      el.style.visibility='visible';
    }
    if (style.display === 'none') {
      el.style.display='block';
    }
    if (style.opacity === 0) {
      el.style.opacity=1;
    }
  }
  let s='';
  let row='';
  //Gio Edited Here v1
  //Gio Bulk find and replaced...
  const elsWithAriaLabels=document.querySelectorAll('body [aria-label]');
  let i=1;
  let identCount=0;
  let issueCount=0;
  let snippet='';
  let isInteractive;
  let consoleOutput='';
  Array.from(elsWithAriaLabels).forEach(function (elWithAriaLabel) {
    isInteractive ='Static Element';
    if (
      (elWithAriaLabel.getAttribute('tabindex')&&(elWithAriaLabel.getAttribute('tabindex')!=='-1'))||
        (
          (
            (elWithAriaLabel.tagName==='INPUT')||
            (elWithAriaLabel.tagName==='BUTTON')||
            (elWithAriaLabel.tagName==='TEXTAREA')||
            (elWithAriaLabel.tagName==='SELECT')||
            (elWithAriaLabel.tagName==='IFRAME')||
            (elWithAriaLabel.tagName==='A')
          ) && (
          (elWithAriaLabel.getAttribute('tabindex')!=='-1')&&
          (!elWithAriaLabel.disabled)
          )
        )
      ) {
      isInteractive='Interactive Element';
    }
    const wrap = document.createElement('div');
    wrap.appendChild(elWithAriaLabel.cloneNode(true));
    snippet = wrap.innerHTML;
    let notes='';
    let warn=false;
    let err=false;
    elWithAriaLabel.setAttribute('data-title-ref', i);
  
    let titleContainsImage=false;
    const images=elWithAriaLabel.querySelectorAll('img');
    titleContainsImage=images.length > 0;
    if (titleContainsImage) {
      const imageText='';
      Array.from(images).forEach(function (image) {
        const newSpan=document.createElement("SPAN");
        newSpan.setAttribute('class', 'visually-hidden');
        newSpan.setAttribute('style', 'clip-path: inset(100%);clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;white-space: nowrap;width: 1px;');
        newSpan.setAttribute('aria-hidden', 'true');
        if (image.getAttribute('alt')) {
          newSpan.textContent=' ' + image.getAttribute('alt') + ' ';
        } else {
          newSpan.textContent='** Image with empty or missing alt **';
        }
        insertAfter(newSpan, image);
      });
    }
  
    let tc=elWithAriaLabel.textContent;
    let xPathLocation=getXPath(elWithAriaLabel);
  
    if (elWithAriaLabel.tagName==='IMG') {
      tc=elWithAriaLabel.getAttribute('alt');
    }
    let accName=tc;
    // Gio edit v1 - This value is what get's the aria-label value...
    let ariaLabelTextValue=elWithAriaLabel.getAttribute('aria-label');
  
    if (accName===null) {
      accName='';
    }
    if (ariaLabelTextValue===null) {
      ariaLabelTextValue='';
    }
  
    if (isHidden(elWithAriaLabel)) {
       attemptoToUnhide(elWithAriaLabel);
       if (isHidden(elWithAriaLabel)) {
         notes+='- Element is hidden<br>';
       } else {
        notes+='- Element *was* hidden but has been temporarily revealed on the page<br>';
       }
     }
    if (err) {warn=false}
    row+='<tr';
    row+=' data-title-ref="' + i + '"';
    if (accName.trim() === ariaLabelTextValue.trim()) {
      warn=false;
      err=false;
    } else {
      if (elWithAriaLabel.tagName!=="IFRAME") {
        warn=false;
        err=true;
        identCount++;
        notes+='- Reminder to translate this aria-label (yellow column)! The aria-label is different from the on-screen text.<br>';
      }
    }

    if (warn) {
      row+=' class="warn"';
    }
    if (err) {
      row+=' class="issue err"';
    }
    row+='>';
    row+='<td>' + ariaLabelTextValue + '</td>';
    row+='<td>' + tc + '</td>';
    row+='<td><div class="snippet"><label for="xpath'+ i + '">xPath</label><textarea readonly id="xpath'+ i + '" aria-label="Xpath snippet for this node">' + xPathLocation + '</textarea></div></td>';
    row+='<td><div class="snippet"><label for="snip'+ i + '">Code snippet</label><textarea readonly id="snip'+ i + '" aria-label="Markup snippet for this node">' + snippet + '</textarea></div></td>';
    row+='<td>';
    if (err) {
      row+='<div class="issues">⚠️ Warning:</div>';
    }
    consoleOutput='Element with title \'' + tc.trim() + '\':\n'+notes+'Markup with issue:\n'+snippet+'\n---------------\n';
    row+=notes + '<br></td>';
    row+='</tr>';
    i++;
    if (warn || err) {
      issueCount++;
    }
    if (err) {
      consoleOutput=consoleOutput.split('<code>').join('`').split('</code>').join('`').split('<br>').join('\n').split('\n\n').join('\n');
      console.log(consoleOutput);
    }
  });
  s='<style>[aria-pressed=true]{color:white;background:rebeccapurple;}div.issues{font-weight:bold;};textarea {margin:5px 0;}.snippet label {font-weight:bold;font-size:0.8em;color:black;}.snippet{background:#efefef;outline:1px solid #666;padding:5px;margin-top:5px;}.checkDiffs{background:PapayaWhip;}.checkDiffs:after{content:"Accessible name differs";color:#a50202;font-weight:bold;font-size:10px;display:block}.warn {background:lightyellow;}.err {background:PapayaWhip;color:#a50202;}.visually-hidden,.a11y,.visuallyhidden,.sr-text,.sr-only {clip-path: inset(100%);clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;white-space: nowrap;width: 1px;}* {-webkit-box-sizing: border-box;box-sizing: border-box;}html {/*border: .75em solid #fff;*/min-height: 100vh;}body {background: #f7f7f5;color: #333;font: 400 105%/1.4 "Work Sans", sans-serif;margin: 1.5em auto;max-width: 54em;width: 90%;}a:elWithAriaLabel,a:visited {border-bottom: 1px solid rgba(42, 122, 130, .5);color: #2b7a82;text-decoration: none;}a:hover {border-bottom: 2px solid;color: #1e565c;}button:focus,a:focus {box-shadow: none;outline-offset: 2px;outline: 3px solid rgba(42, 122, 130, .75);}a:focus {border-bottom: none;}a:active {background: #333;color: #fff;}code {font-family: Consolas, monaco, monospace;-moz-tab-size: 4;tab-size: 4;text-transform: none;white-space: pre-wrap;color:brown;}textarea {width: 100%}legend h2, legend h3 {margin: 0;}table {border-collapse: collapse;}th,td {padding: 10px;border:2px solid #2b7a82;}table caption {font-weight: bold;text-align: left;margin:1em 0;} th{min-width: 200px;} table td:nth-child(1), table th:nth-child(1){ background: yellow; font-weight: bold; color: #000000; }</style><h1>List of elements with Aria-Label on this page.</h1>';
  s+='<table border="1" cellpadding="5"><caption>The aria-label affects accessibility and must be translated. Use the xPath to help you locate the element. It can be pasted in the DOM search field.</caption><thead><tr valign=top><th scope="col">Aria-Label</th><th>On-screen text</th><th>xPath</th><th scope="col">Code OuterHTML</th><th>Notes</th></tr></thead><tbody>' + row + '</tbody></table>';
  s+='<script>function showElsWithAriaLabels(){';
  s+='var refWindow=window.opener;';
  s+='}window.addEventListener("load", (event) => {showElsWithAriaLabels();});</script>';
  s+='<script>';
  s+='var dcUrl = "https://lloydi.com/a11y-tools/markup-de-crapulator/index.html?markup=";';
  s+='const dcs = document.querySelectorAll(".decrapulate");';
  s+='Array.from(dcs).forEach(function (dc) {';
  s+='dc.addEventListener("click", e => {';
  s+='var m = dc.previousElementSibling.value;';
  s+='m = encodeURIComponent(m);';
  s+='window.open(dcUrl + m, "dcWin", "height=800,width=1000");';
  s+='});';
  s+='});';
  s+='const sss = document.querySelectorAll(".showSnippet");';
  s+='Array.from(sss).forEach(function (ss) {';
  s+='ss.addEventListener("click", e => {';
  s+='let n = ss.nextElementSibling;';
  s+='if (ss.getAttribute("aria-expanded")==="false") {';
  s+='n.removeAttribute("hidden");';
  s+='ss.setAttribute("aria-expanded","true");';
  s+='} else {';
  s+='n.setAttribute("hidden","hidden");';
  s+='ss.setAttribute("aria-expanded","false");';
  s+='}';
  s+='});';
  s+='});';
  s+='</script>';
  
  const popUpWinTitles=window.open('', 'popUpWinTitles', 'height=800,width=1000');
  popUpWinTitles.document.open();
  popUpWinTitles.document.write(s);
  popUpWinTitles.document.close();
}
listThingsWithTitles();})()
