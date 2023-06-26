javascript:(function(){'use strict'
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
      el.style.setProperty("border","4px solid red", "important");
      el.style.setProperty("clip","unset","important");
      el.style.setProperty("height","initial","important");
      el.style.setProperty("overflow","visible","important");
      el.style.setProperty("display","block","important");
      el.style.setProperty("position","relative","important");
      el.style.setProperty("padding","initial","important");
      el.style.setProperty("width","100%","important");
      el.style.setProperty("clip-path","none","important");
      el.style.setProperty("background","yellow","important");
      el.style.setProperty("color","#000000","important");
      el.style.setProperty("font-weight","bold","important");
      el.style.setProperty("white-space","normal","important");
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
  const elsWithAriaSkipLinkClasses=document.querySelectorAll('body .w_b8dH,.w_DKny,.w_iUH7,.skip-main,.brand-box-ad-hide');
  let i=1;
  let identCount=0;
  let issueCount=0;
  let snippet='';
  let isInteractive;
  let consoleOutput='';
  Array.from(elsWithAriaSkipLinkClasses).forEach(function (elWithAriaLabel) {
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
        newSpan.setAttribute('style', 'border: 4px solid red !important; clip: unset !important; clip: unset !important; -webkit-clip-path: unset !important; clip-path: unset !important; height: initial !important; overflow: visible!important; padding: initial !important; position: relative!important; white-space: normal!important; width: initial !important; display: block; background: yellow; color: #000 !important; font-weight: bold;');
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
  
    if (elWithAriaLabel.tagName==='IMG') {
      tc=elWithAriaLabel.getAttribute('alt');
    }
    let accName=tc;
    // Gio edit v1 - This value is what get's the aria-label value...
    let ariaLabelTextValue=elWithAriaLabel.getAttribute('class');
  
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
        notes+='- Remember this element is visually hidden off-screen.Element *was* hidden but has been temporarily revealed on the page<br>';
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
        notes+='- Remember to translate this text!<br>';
      }
    }

    if (warn) {
      row+=' class="warn"';
    }
    if (err) {
      row+=' class="issue err"';
    }
    row+='>';
    row+='<td>' + tc + '</td>';
    row+='<td>' + ariaLabelTextValue + '</td>';
    row+='<td>';
    if (err) {
      row+='<div class="issues">⚠️ Warning:</div>';
    }
    consoleOutput='Element with title \'' + tc.trim() + '\':\n'+notes+'Markup with issue:\n'+snippet+'\n---------------\n';
    row+=notes + '<br></td>';
    row+='<td><div class="snippet"><label for="snip'+ i + '">Code snippet (Expand)</label><textarea id="snip'+ i + '" aria-label="Markup snippet for this node">' + snippet + '</textarea></div></td>';
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
  s='<style>[aria-pressed=true]{color:white;background:rebeccapurple;}div.issues{font-weight:bold;};textarea {margin:5px 0;}.snippet label {font-weight:bold;font-size:0.8em;color:black;}.snippet{background:#efefef;outline:1px solid #666;padding:5px;margin-top:5px;}.checkDiffs{background:PapayaWhip;}.checkDiffs:after{content:"Accessible name differs";color:#a50202;font-weight:bold;font-size:10px;display:block}.warn {background:lightyellow;}.err {background:PapayaWhip;color:#a50202;}.visually-hidden,.a11y,.visuallyhidden,.sr-text,.sr-only {clip-path: inset(100%);clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;white-space: nowrap;width: 1px;}* {-webkit-box-sizing: border-box;box-sizing: border-box;}html {/*border: .75em solid #fff;*/min-height: 100vh;}body {background: #f7f7f5;color: #333;font: 400 105%/1.4 "Work Sans", sans-serif;margin: 1.5em auto;max-width: 54em;width: 90%;}a:elWithAriaLabel,a:visited {border-bottom: 1px solid rgba(42, 122, 130, .5);color: #2b7a82;text-decoration: none;}a:hover {border-bottom: 2px solid;color: #1e565c;}button:focus,a:focus {box-shadow: none;outline-offset: 2px;outline: 3px solid rgba(42, 122, 130, .75);}a:focus {border-bottom: none;}a:active {background: #333;color: #fff;}code {font-family: Consolas, monaco, monospace;-moz-tab-size: 4;tab-size: 4;text-transform: none;white-space: pre-wrap;color:brown;}textarea {width: 100%}legend h2, legend h3 {margin: 0;}table {border-collapse: collapse;}th,td {padding: 10px;border:2px solid #2b7a82;}table caption {font-weight: bold;text-align: left;margin:1em 0;}</style><h1>List of elements with visually hidden text on the page</h1>';
  s+='<table border="1" cellpadding="5"><caption>Visually hidden text affects accessibility and must be translated. It is invisible text just for screen readers, hence why it is hidden. Remember to let the entire page load before running this tool. Refer to the LD-Visually-Hidden Utility</caption><thead><tr valign=top><th scope="col">Visually Hidden text</th><th>CSS Class</th><th scope="col">Notes</th><th>Code Markup</th></tr></thead><tbody>' + row + '</tbody></table>';
  s+='<script>function showElsWithSkipLinkClasses(){';
  s+='var refWindow=window.opener;';
  s+='}window.addEventListener("load", (event) => {showElsWithSkipLinkClasses();});</script>';
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
