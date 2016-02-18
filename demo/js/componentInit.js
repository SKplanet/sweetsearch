var oSS= null;

var Service = (function(){
    var doc = document;
    var elForm = doc.querySelector("#search-form");
    var elFormComtainer = doc.querySelector(".search-form");
    var elAutoCompleteLayer = doc.querySelector(".auto-complete-wrap");
    var elRecentWordLayer   = doc.querySelector(".recent-word-wrap");
    var elInputField        = doc.querySelector(".input-field");

    /*
    // callback 4 Ajax (local)
    var fnInsertAutoCompleteWordAjax = function(sData) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";

        sData.items[0].forEach( function(v) {
            result = sTemplate.replace(/\[%sKeyword%\]/, v[0]);       
            sHTML += result;
        });

        elAutoCompleteLayer.querySelector("ul").innerHTML = sHTML;
    }
    */

    //callback 4 JSONP (Amazon)
    //자동완성레이어에 보여줄 HTML (사용자정의)
    var fnInsertAutoCompleteWordAmazonProduct = function(sData) {
        console.log("fnInsertAutoCompleteWord");
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";
        var sInputValue = elInputField.value;
        var sInputValueNoBlank = sInputValue.replace(/\s+/g, ""); 

        var bHighlightMatchedWord = true;

        if(!sData) return;
        sData[1].forEach( function(v) {

            result = sTemplate.replace(/\[%sKeyword%\]/, v);       

            if(bHighlightMatchedWord) { 
                if(v.indexOf(sInputValue) > -1) { 
                    result = result.replace(sInputValue, "<b>"+sInputValue+"</b>");
                } else { 
                    result = result.replace(sInputValueNoBlank, "<b>"+sInputValueNoBlank+"</b>");
                }
            }

            sHTML += result;

        });
        elAutoCompleteLayer.querySelector("ul").innerHTML = sHTML;
    }

    //callback 4 JSONP (planet)
    var fnInsertAutoCompleteWordSyrupTable = function(sData) {
        console.log("fnInsertAutoCompleteWord");
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";
        var sInputValue = elInputField.value;
        var sInputValueNoBlank = sInputValue.replace(/\s+/g, ""); 

        var bHighlightMatchedWord = true;

        if(!sData) return;
        sData['kwds'].forEach( function(v) {

            result = sTemplate.replace(/\[%sKeyword%\]/, v[0]);       

            if(bHighlightMatchedWord) { 
                if(v.indexOf(sInputValue) > -1) { 
                    result = result.replace(sInputValue, "<b>"+sInputValue+"</b>");
                } else { 
                    result = result.replace(sInputValueNoBlank, "<b>"+sInputValueNoBlank+"</b>");
                }
            }

            sHTML += result;

        });
        elAutoCompleteLayer.querySelector("ul").innerHTML = sHTML;
    }


    var fnInsertRecentSearchWord = function(aData, nMaxList) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";
        //5개만,
        aData.length = nMaxList;
        aData.forEach( function(v) {
            result = sTemplate.replace(/\[%sKeyword%\]/, v);       
            sHTML += result;
        });
        elRecentWordLayer.querySelector("ul").innerHTML = sHTML;
    }

    //set css when select item and get text.
    var fnSelectAutoCompleteWord = function(_el) {
        //highlight selected item.
        var elCurrentLI = (_el.nodeName === "SPAN") ? _el.parentElement : _el;
        elCurrentLI.className += "selectedLI";

        //submit form with custom value.
        var sText = elCurrentLI.querySelector("span").innerText.trim();

        //must be code.
        elInputField.value = sText;
        oSS.handlerSubmitForm(null,sText);
    }

    var fnSelectRecentSearchWord = function(_el) {
        //highlight selected item.
        var elCurrentLI = (_el.nodeName === "SPAN") ? _el.parentElement : _el;
        elCurrentLI.className += "selectedLI";

        //submit form with custom value.
        var sText = elCurrentLI.querySelector("span").innerText.trim();

        //must be code.
        elInputField.value = sText;
        oSS.handlerSubmitForm(null,sText);
    }

    //set submit custom url.
    var fnSubmitForm = function(sQuery) {
        var url = "./SearchResult.html?q=" + sQuery;
         location.href = url;
    }

    /*****************************/
    /* Component initialize.
    /*****************************/

       //amazon
    var sAutoCompleteURLAmazon = 'http://completion.amazon.com/search/complete?mkt=1&client=amazon-search-ui&x=String&search-alias=aps&';
    var sAutoCompleteURLSyrupTable = 'http://211.110.43.73:19200/PickatAutoCompleteServer/request?s=pickat&';

    function runSyrupSearch() { 
        oSS = new SmartSearch(elFormComtainer, {
            'autoComplete'      : {
                'sAutoCompleteURL'    : sAutoCompleteURLSyrupTable,
                'requestType'         : 'jsonp',
                'jsonp_callbackName'  : 'ac_done'
            },
            'RecentWordPlugin'  : {
                'usage'               : true,
                'maxList'             : 7
            }
        });

        oSS.onUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordSyrupTable,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
            'FN_AFTER_INSERT_RECENT_WORD'  : fnInsertRecentSearchWord,
            'FN_AFTER_SELECT_RECENT_WORD'  : fnSelectRecentSearchWord,
            'FN_AFTER_FORM_SUBMIT'         : fnSubmitForm
        });
    }

     function runAmazonSearch() { 
        oSS = new SmartSearch(elFormComtainer, {
            'autoComplete'  : {
                'sAutoCompleteURL'    : sAutoCompleteURLAmazon,
                'requestType'         : 'jsonp',
                'jsonp_callbackName'  : 'completion'

            },
            'RecentWordPlugin'          : {
                'usage' : true,
                'maxList' : 7
            }
        });

        oSS.onUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAmazonProduct,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
            'FN_AFTER_INSERT_RECENT_WORD'  : fnInsertRecentSearchWord,
            'FN_AFTER_SELECT_RECENT_WORD'  : fnSelectRecentSearchWord,
            'FN_AFTER_FORM_SUBMIT'         : fnSubmitForm
        });
    }

    document.querySelector(".toggleMenu").addEventListener("click", function(evt) {
        if(evt.target.innerText.indexOf("Amazon") > -1) {
            location.href = "./amazonSearch.html"
        }else {
            location.href = "./syrupSearch.html"
        }
    }); 

    return  {
        'runAmazon' : runAmazonSearch,
        'runSyrup'  : runSyrupSearch
    }

})();






