javascript: (function() {
    var css = `
        .tsc-rectangle-temp-, .tsc-symbol-temp- {
            position: absolute;
            box-shadow: black 0px 0px 0px 1px inset, white 0px 0px 0px 2px inset;
            z-index: 9999999;
            pointer-events: none;
            font-size: 24px;
            text-align: center;
            line-height: 24px;
            width: 24px;
            height: 24px;
        }
        .tsc-dimensions-temp- {
            position: absolute;
            background-color: white;
            color: black;
            padding: 2px;
            font-weight: bold;
            pointer-events: none;
            z-index: 9999999;
        }
    `;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    var rectangle = document.createElement('div');
    rectangle.className = 'tsc-rectangle-temp-';
    document.body.appendChild(rectangle);

    var symbol = document.createElement('div');
    symbol.className = 'tsc-symbol-temp-';
    document.body.appendChild(symbol);

    var dimensions = document.createElement('div');
    dimensions.className = 'tsc-dimensions-temp-';
    document.body.appendChild(dimensions);

    // Adjust tabindex and disabled attributes
    var allElements = document.querySelectorAll('*[tabindex="-1"], :disabled');
    allElements.forEach(element => {
        if (element.hasAttribute('tabindex') && element.tabIndex === -1) {
            element.tabIndex = 0;
        }
        if (element.disabled) {
            element.setAttribute('aria-disabled', 'true');
            element.disabled = false;
        }
    });

    function isFocusableOrInteractive(element) {
        if (element.tabIndex >= 0 || element.autofocus || element.hasAttribute('contenteditable')) return true;
        switch (element.tagName) {
            case 'A': return element.hasAttribute('href');
            case 'INPUT': return !element.disabled;
            case 'SELECT': case 'TEXTAREA': case 'BUTTON': return !element.disabled;
            default: return element.hasAttribute('onclick');
        }
    }

    function getInteractiveAncestor(element) {
        while (element && !isFocusableOrInteractive(element)) {
            element = element.parentElement;
        }
        return element;
    }

    function showIndicators(e) {
        var target = getInteractiveAncestor(e.target);  // Get interactive ancestor
        if (target) {
            var rect = target.getBoundingClientRect();
            var width = Math.round(rect.width);
            var height = Math.round(rect.height);
            var passFail = (width >= 24 && height >= 24) ? 'Pass' : 'Fail';

            rectangle.style.left = rect.left + window.scrollX + 'px';
            rectangle.style.top = rect.top + window.scrollY + 'px';
            rectangle.style.width = width + 'px';
            rectangle.style.height = height + 'px';

            var symbolLeft = rect.left + window.scrollX + (width / 2) - 12 + 'px';  // 12 is half the width of the symbol
            var symbolTop = rect.top + window.scrollY + (height / 2) - 12 + 'px';  // 12 is half the height of the symbol
            symbol.style.left = symbolLeft;
            symbol.style.top = symbolTop;
            symbol.textContent = (passFail === 'Pass') ? '✅' : '❌';
            symbol.style.color = (passFail === 'Pass') ? 'green' : 'red';

            dimensions.textContent = passFail + ' - ' + width + 'px X ' + height + 'px';
            dimensions.style.left = rect.left + window.scrollX + 'px';
            dimensions.style.top = (rect.top + window.scrollY + height) + 'px';
        }
    }

    document.addEventListener('mouseover', showIndicators);
    document.addEventListener('focus', showIndicators, true);  // using capture phase to ensure the handler is executed

    document.addEventListener('mouseout', function() {
        rectangle.style.width = '0';
        rectangle.style.height = '0';
        symbol.textContent = '';
        dimensions.textContent = '';
    });

    document.addEventListener('blur', function() {
        rectangle.style.width = '0';
        rectangle.style.height = '0';
        symbol.textContent = '';
        dimensions.textContent = '';
    }, true);  // using capture phase to ensure the handler is executed
})();
