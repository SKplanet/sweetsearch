var oSS= null;

var sAutoCompleteURLAmazon = 'http://completion.amazon.com/search/complete?mkt=1&client=amazon-search-ui&x=String&search-alias=aps&';
var sAutoCompleteURLSyrupTable = 'http://211.110.43.73:19200/PickatAutoCompleteServer/request?s=pickat&';
var sAutoCompleteURLLocal = '../jsonMock/javascript.json';

var Service = (function(){
    var doc = document;
    var elForm = doc.querySelector("#search-form");
    var elFormComtainer = doc.querySelector(".search-form");
    var elAutoCompleteLayer = doc.querySelector(".auto-complete-wrap");
    var elRecentWordLayer   = doc.querySelector(".recent-word-wrap");
    var elInputField        = doc.querySelector(".input-field");

    
    // callback 4 Ajax (local)
    var fnInsertAutoCompleteWordAjax = function(sQuery, sData) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";

        sData.items[0].forEach( function(v) {
            result = sTemplate.replace(/\[%sKeyword%\]/, v[0]);       
            sHTML += result;
        });

        elAutoCompleteLayer.querySelector("ul").innerHTML = sHTML;
    }

    //callback 4 JSONP (Amazon)
    //자동완성레이어에 보여줄 HTML (사용자정의)
    var fnInsertAutoCompleteWordAmazonProduct = function(sQuery, sData) {
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
    var fnInsertAutoCompleteWordSyrupTable = function(sQuery, sData) {
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

    //set submit custom url.
    var fnSubmitForm = function(sQuery) {
        var url = "./searchResult.html?q=" + sQuery;
         location.href = url;
    }

    //set css when select item and get text.
    var fnSelectAutoCompleteWord = function(_el) {
        //highlight selected item.
        var elCurrentLI = (_el.nodeName === "SPAN") ? _el.parentElement : _el;
        elCurrentLI.className += "selectedLI";

        //submit form with custom value.
        var sText = elCurrentLI.querySelector("span").innerText.trim();

        fnSubmitForm(sText);

        return sText;
    }

    var fnSelectRecentSearchWord = function(_el) {
        //highlight selected item.
        var elCurrentLI = (_el.nodeName === "SPAN") ? _el.parentElement : _el;
        elCurrentLI.className += "selectedLI";

        //submit form with custom value.
        var sText = elCurrentLI.querySelector("span").innerText.trim();

        //must be code.
        elInputField.value = sText;

        fnSubmitForm(sText);

        return sText;
    }



    /***** CUSTOM AJAX LOGIC START *****/
    //this callback method is optional.
    var fnMyJSONP = function(sQuery, COMPONENT_CALLBACK) {
        var callback_name = "completion";
   
        //user can select one of the two way. (_cu.sendSimpleJSONP or other JSONP Library)
        _cu.sendSimpleJSONP(sAutoCompleteURLAmazon, sQuery, callback_name, COMPONENT_CALLBACK);
    }

    //this callback method is optional.
    var fnMyAjax = function(sQuery, COMPONENT_CALLBACK) {
        var ajaxURL = '../jsonMock/javascript.json';
        ajaxURL = ajaxURL+"?qs="+sQuery;
        var aHeaders = [["Content-Type", "application/json"]];

        //user can select one of the two way. (_cu.sendSimpleJSONP or other Ajax Library)
        _cu.sendSimpleAjax(ajaxURL, COMPONENT_CALLBACK, null, "get", aHeaders, sQuery);
    }
    /***** CUSTOM AJAX LOGIC END *****/


    /*****************************/
    /* Component initialize.
    /*****************************/


    function runSearch() { 
        /*
        //custom ajax logic (AJAX)
        oSS = new SweetSearch(elFormComtainer, {
            'AjaxRequestType'         : 'user', //jsonp, ajax, user
        });

        oSS.registerUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAjax,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
            'FN_RUN_AJAX_EXECUTE'          : fnMyAjax
        });
        */

        /*
        //custom ajax logic (JSONP)
        oSS = new SweetSearch(elFormComtainer, {
            'AjaxRequestType'         : 'user', //jsonp, ajax, user
        });

        oSS.registerUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAmazonProduct,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
            'FN_RUN_AJAX_EXECUTE'          : fnMyJSONP
        });
        */

        /*
        //delegated ajax logic (AJAX)
        oSS = new SweetSearch(elFormComtainer, {
            'sAutoCompleteURL'    : sAutoCompleteURLLocal,
            'AjaxRequestType'     : 'ajax', //jsonp, ajax, user
        });

        oSS.registerUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAjax,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
        });
        */

        //delegated ajax logic (JSONP)
        oSS = new SweetSearch(elFormComtainer, {
            'sAutoCompleteURL'    : sAutoCompleteURLAmazon,
            'AjaxRequestType'     : 'jsonp', //jsonp, ajax, user
            'jsonp_callbackName'  : 'completion'
        });
        

        oSS.registerUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAmazonProduct,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
        });

        oSS.onPlugins([
            { 
                'name'      : 'RecentWordPlugin',
                'option'    : {
                    'maxList' : 7,
                },
                'userMethod' : {
                    'FN_AFTER_INSERT_RECENT_WORD'  : fnInsertRecentSearchWord,
                    'FN_AFTER_SELECT_RECENT_WORD'  : fnSelectRecentSearchWord,
                }
            },
            { 
                'name'      : 'TTViewPlugin',
                'option'    : {},
                'userMethod' : {}
            }
        ]);
    }

    runSearch();

})();






