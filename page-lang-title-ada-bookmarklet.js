javascript: (function() {
    function callback() {
        function l() {
if(document.getElementsByTagName('html')[0].getAttribute('xml:lang') && document.documentElement.lang) {
	$('body').prepend('<section id="msg1"><div class="langSpan" style="color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:#e6f1fc;margin:0 2px; padding:2px; font-family: Bogle; font-size: 19px; border: 1px solid;" id="lang-success" role="status"></div></section>');
	$('#lang-success').html('HTML document has lang=\"' + document.documentElement.lang + '\" AND? xml:lang=\"' + document.getElementsByTagName('html')[0].getAttribute('xml:lang') + '\" on page titled: ' + document.title);
} else if(document.documentElement.lang) {
	$('body').prepend('<section id="msg2" style=" padding: 15px; background: #f5f5f5; margin: 5px; "><p>Review: Does the page language code <strong>match</strong> the language of the page title?...If not this fails.</p><div class="langSpan" style="color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:#e6f1fc;margin:0 2px; padding:2px; font-family: Bogle; font-size: 19px; border: 1px solid;" id="lang-success" role="status"></div></section>');
	$('#lang-success').html('<p>' + '🌎 Page language: \"' + document.documentElement.lang + '\"' + '</p>' + '<p>' + '📚 Page title: ' + '\"' + document.title + '\"' +'</p>');
} else if(document.getElementsByTagName('html')[0].getAttribute('xml:lang')) {
	$('body').prepend('<section id="msg3"><div class="langSpan" style="color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:#e6f1fc;margin:0 2px; padding:2px; font-family: Bogle; font-size: 19px; border: 1px solid;" id="lang-success" role="status"></div></section>');
	$('#lang-success').html('HTML document has xml:lang=\"' + document.getElementsByTagName('html')[0].getAttribute('xml:lang') + '\" on page titled: ' + document.title);
} else {
		$('body').prepend('<section id="msg4"><div class="langSpan" style="color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:#fce8e9;margin:0 2px; padding:2px; font-family: Bogle; font-size: 19px; border: 2px solid #de1c24;" id="failure" role="status"></div></section>');
		$('#failure').html('🚨🚨🚨 Error: HTML document has no lang attributes on the HTML element. Please add a valid lang attribute on the HTML element.');
}
        $("span").remove(".langSpan");
		$("[lang]:not(html)").each(function() {
			$(this).attr('style','outline:orange 6px dashed;padding:2px;');
            $(this).after("<span class=\"langSpan\" style=\"color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;margin:0 2px; padding:2px; font-family: Bogle; font-size: 19px; border: 1px solid;speak:literal-punctuation;\">⚠️ lang=\""+$(this).attr('lang')+"\"</span>");
        });
			if ($("[lang]:not(html)").length) {
				$('body').prepend('<section id="msg5" style=" padding: 15px; background: #f5f5f5; margin: 5px; "><div class="langSpan" style="color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;margin:0 2px; padding:22px; font-family: Bogle; font-size: 19px; border: 1px solid;" id="lang-success" role="status"></div></section>');
				$('#lang-success').html('⚠️ ⚠️ ⚠️ Warning: This page has multiple lang attributes. Please review all the lang attributes on this page for accuracy. ⚠️ ⚠️ ⚠️ ');
			}
      $("script[src$='lang.js']").remove();s.remove();

if(document.title == ""){
		$('body').prepend('<section id="msg1pagetitle"><div class="langSpan" style="color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:#fce8e9;margin:0 2px; padding:2px; font-family: Bogle; font-size: 19px; border: 2px solid #de1c24;" id="failure" role="status"></div></section>');
		$('#failure').html('🚨🚨🚨 Error: Page title is empty. It cannot be empty.');	
}      

        }
        l()
    }
    var s = document.createElement("script");
    s.addEventListener ? s.addEventListener("load", callback, !1) : s.readyState && (s.onreadystatechange = callback), s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js", document.body.appendChild(s);
})()
