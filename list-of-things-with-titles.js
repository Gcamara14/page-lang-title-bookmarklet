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
  const elsWithTitles=document.querySelectorAll('body [title],iframe');
  let i=1;
  let identCount=0;
  let issueCount=0;
  let snippet='';
  let isInteractive;
  let consoleOutput='';
  Array.from(elsWithTitles).forEach(function (elWithTitle) {
    isInteractive ='No';
    if (
      (elWithTitle.getAttribute('tabindex')&&(elWithTitle.getAttribute('tabindex')!=='-1'))||
        (
          (
            (elWithTitle.tagName==='INPUT')||
            (elWithTitle.tagName==='BUTTON')||
            (elWithTitle.tagName==='TEXTAREA')||
            (elWithTitle.tagName==='SELECT')||
            (elWithTitle.tagName==='IFRAME')||
            (elWithTitle.tagName==='A')
          ) && (
          (elWithTitle.getAttribute('tabindex')!=='-1')&&
          (!elWithTitle.disabled)
          )
        )
      ) {
      isInteractive='Yes';
    }
    const wrap = document.createElement('div');
    wrap.appendChild(elWithTitle.cloneNode(true));
    snippet = wrap.innerHTML;
    let notes='';
    let warn=false;
    let err=false;
    elWithTitle.setAttribute('data-title-ref', i);
  
    let titleContainsImage=false;
    const images=elWithTitle.querySelectorAll('img');
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
  
    let tc=elWithTitle.textContent;
  
    if (elWithTitle.tagName==='IMG') {
      tc=elWithTitle.getAttribute('alt');
    }
    let accName=tc;
    let titleText=elWithTitle.getAttribute('title');

    // Get the xpath
    let xPathLocation=getXPath(elWithTitle);
  
    if (accName===null) {
      accName='';
    }
    if (titleText===null) {
      titleText='';
    }
  
    if (isHidden(elWithTitle)) {
       attemptoToUnhide(elWithTitle);
       if (isHidden(elWithTitle)) {
         notes+='- Element is hidden<br>';
       } else {
        notes+='- Element *was* hidden but has been temporarily revealed on the page<br>';
       }
     }
    if (err) {warn=false}
    row+='<tr';
    row+=' data-title-ref="' + i + '"';
    if (accName.trim() === titleText.trim()) {
      warn=false;
      err=false;
    } else {
      if (elWithTitle.tagName!=="IFRAME") {
        warn=false;
        err=true;
        identCount++;
        notes+='- The title text differs from the on-screen text.<br>';
        if (isInteractive==="Yes") {
          notes+='- This is an interactive element, but the title attribute *may* be ignored by assistive tech (depending on user settings).<br>';
        }
        if (isInteractive==="No") {
          notes+='- As this is a non-interactive element, the title attribute will be ignored by assistive tech.<br>';
        }
      }
    }
  
    if (elWithTitle.tagName==="IFRAME") {
      if (titleText.trim()==='') {
        warn=false;
        err=true;
        identCount++;
        notes+='An <code>iframe</code> MUST have a title attribute.<br>';
      }
    }
    row+='>';
    row+='<td>' + tc + '</td>';
    row+='<td>' + titleText + '</td>';
    if (accName.trim() === titleText.trim()) {
      if (accName.trim()!=='') {
        notes+='- title text is identical to on-screen text (superfluous, but not harmful).<br>';
      }
    }
    if (isInteractive==="No") {
      notes+='- This is not an interactive/focusable element. The title attribute will not be available to anyone expect mouse users (touch screen, keyboard-only, assistive tech users all excluded).<br>';
    }
row+='<td><div class="snippet"><label for="xpath'+ i + '">xPath</label><textarea readonly id="xpath'+ i + '" aria-label="Xpath snippet for this node">' + xPathLocation + '</textarea></div></td>';    
    row+='<td><div class="snippet"><label for="snip'+ i + '">Code Reference</label><textarea readonly id="snip'+ i + '" aria-label="Markup snippet for this node">' + snippet + '</textarea></div></td>';
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
  s='<style>[aria-pressed=true]{color:white;background:rebeccapurple;}div.issues{font-weight:bold;};textarea {margin:5px 0;}.snippet label {font-weight:bold;font-size:0.8em;color:black;}.snippet{background:#efefef;outline:1px solid #666;padding:5px;margin-top:5px;}.checkDiffs{background:PapayaWhip;}.checkDiffs:after{content:"Accessible name differs";color:#a50202;font-weight:bold;font-size:10px;display:block}.warn {background:lightyellow;}.err {background:PapayaWhip;color:#a50202;}.visually-hidden,.a11y,.visuallyhidden,.sr-text,.sr-only {clip-path: inset(100%);clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;white-space: nowrap;width: 1px;}* {-webkit-box-sizing: border-box;box-sizing: border-box;}html {/*border: .75em solid #fff;*/min-height: 100vh;}body {background: #f7f7f5;color: #333;font: 400 105%/1.4 "Work Sans", sans-serif;margin: 1.5em auto;max-width: 54em;width: 90%;}a:elWithTitle,a:visited {border-bottom: 1px solid rgba(42, 122, 130, .5);color: #2b7a82;text-decoration: none;}a:hover {border-bottom: 2px solid;color: #1e565c;}button:focus,a:focus {box-shadow: none;outline-offset: 2px;outline: 3px solid rgba(42, 122, 130, .75);}a:focus {border-bottom: none;}a:active {background: #333;color: #fff;}code {font-family: Consolas, monaco, monospace;-moz-tab-size: 4;tab-size: 4;text-transform: none;white-space: pre-wrap;color:brown;}textarea {width: 100%}legend h2, legend h3 {margin: 0;}table {border-collapse: collapse;}th,td {padding: 10px;border:2px solid #2b7a82;}table caption {font-weight: bold;text-align: left;margin:1em 0;}th{min-width: 200px;} table td:nth-child(2), table th:nth-child(2){ background: yellow; font-weight: bold; color: #000000; }</style><h1>List of elements with title attributes on this page.</h1>';
  s+='<table border="1" cellpadding="5"><caption>We listed all elements with HTML title attributes on this page. The title attribute must be translated, as they get announced to the screen reader. They may also be available to users on a hover. Use the Xpath to find the element.</caption><thead><tr valign=top><th scope="col">On-screen text</th><th>Title text (Translate)</th><th scope="col">xPath</th><th scope="col">Code OuterHTML</th></tr></thead><tbody>' + row + '</tbody></table>';
  s+='<script>function showElsWithTitles(){';
  s+='var refWindow=window.opener;';
  s+='var highlightButtons=document.querySelectorAll(".highlightButton");var titleToHighlight;Array.from(highlightButtons).forEach(highlightButton => {highlightButton.addEventListener("click", e => {titleToHighlight="[data-title-ref=\'" + highlightButton.getAttribute("data-title-ref") + "\']";if (highlightButton.getAttribute("aria-pressed")==="false") {refWindow.document.querySelector(titleToHighlight).setAttribute("tabindex","-1");refWindow.document.querySelector(titleToHighlight).focus();refWindow.document.querySelector(titleToHighlight).style.outline="4px dashed rebeccapurple";refWindow.document.querySelector(titleToHighlight).style.outlineOffset="-4px";highlightButton.setAttribute("aria-pressed","true");} else {refWindow.document.querySelector(titleToHighlight).style.outline="";highlightButton.setAttribute("aria-pressed","false");}});});';
  s+='var highlightButtonAll=document.querySelector(".highlightButtonAll");highlightButtonAll.addEventListener("click", e => {if (highlightButtonAll.getAttribute("aria-pressed")==="false") {Array.from(highlightButtons).forEach(highlightButton => {highlightButton.setAttribute("aria-pressed","false");highlightButton.click();});highlightButtonAll.setAttribute("aria-pressed","true");} else {Array.from(highlightButtons).forEach(highlightButton => {highlightButton.setAttribute("aria-pressed","true");highlightButton.click();});highlightButtonAll.setAttribute("aria-pressed","false");}});';
  s+='function hideGoodRows(){Array.from(trsWithoutIssue).forEach(trWithoutIssue => {trWithoutIssue.setAttribute("hidden","hidden");});}function showGoodRows(){Array.from(trsWithoutIssue).forEach(trWithoutIssue => {trWithoutIssue.removeAttribute("hidden");});}var trsWithoutIssue=document.querySelectorAll("tbody tr:not(.issue)");var showProblemCheckbox=document.querySelector("#showPotentialProblemsOnly");showProblemCheckbox.addEventListener("click", e => {if (showProblemCheckbox.checked) {hideGoodRows();} else {showGoodRows();}});';
  s+='}window.addEventListener("load", (event) => {showElsWithTitles();});</script>';
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
