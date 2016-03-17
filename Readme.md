SweetSearch
============
SweetSearch is Mobile Web Auto-Suggestion(Auto-Complete) component.


## Feature

* lightweight (vanillaJS)
* multiple options 
* based on ES6 Syntax

## Demo

http://nigayo.github.io/..

<br/>
## Install

* npm init
* gulp buildJS
* import script

```HTML
<script src="../dist/ss_merge_es5.js"></script>
```

## Usage
Initialize Component and register callback.

```JAVASCRIPT

        var oSS = new SweetSearch(elFormComtainer, {
            'sAutoCompleteURL'    : sAutoCompleteURLLocal,
            'AjaxRequestType'     : 'ajax', //jsonp, ajax, user
        });

        oSS.registerUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAjax,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
        });

```

## Register callback

Arguments of registerUserMethod function used above are all callback function.

```JAVASCRIPT
        'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAjax,
        'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
```

#### 1.FN_AFTER_INSERT_AUTO_WORD ####
This callback function will be execute after Ajax response.
<img src="demo/img/sweetsearch_reference_desc_001.jpg" width="530">

You can write function as making auto-Complete word list view.

**[Example]**
```JAVASCRIPT
	var fnInsertAutoCompleteWordAjax = function(sQuery, aResultData) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";

        sData.items[0].forEach( function(v) {
            result = sTemplate.replace(/\[%sKeyword%\]/, v[0]);       
            sHTML += result;
        });
    }
```

You can use two argument as follows.

**[Arguments]**

* sQuery(String) 	: search word.
* aResultData(String) : Ajax(JSONP) response data.

<br>
**[Return]**

* noting to return(undefined)

<br>

#### 2.FN_AFTER_SELECT_AUTO_WORD
This callback function will be execute after selecting auto-complete word list.
<img src="demo/img/sweetsearch_reference_desc_002.jpg" width="530">

You can implement codes about auto-Complete word list view.

After receiving Ajax response data, you can implement codes as follows codes.

(e.g. change stype of selected item and submit form to target URL)

**[Example]**
```JAVASCRIPT
	var fnSelectAutoCompleteWord = function(element) {
        element.className += "selectedLI";
        var sQuery = element.innerText;

        //send form.
        myformsubmit();

        return sQuery;
    }
```

**[Arguments]**

* element(HTMLElement) : element that fired an event.

<br>
**[Return]**

* sQuery(String) : selected item.(search query)

<br>

## Options 

**[sAutoCompleteURL]**

: AJAX URL.

**[AjaxRequestType]**

: 'ajax', 'jsonp', 'user'(you make a Ajax method yourself)


<br>
## Use Plugin

Plugin is a child component that parent Component use.

SweetSearch have plugin by the name of 'RecentWordPlugin'.

You can add plugin on Component as follows :

```javascript

    oSS.onPlugins([
        { 
            'name'      : 'RecentWordPlugin',
            'option'    : {
                'maxList' : 7,
            },
            'userMethod' : {
                'FN_AFTER_INSERT_RECENT_WORD'  : fnInsertRecentSearchWord,
                'FN_AFTER_SELECT_RECENT_WORD'  : fnSelectRecentSearchWord
            }
        }
    ]);

```
<br>
Plugin can also have callback functions.

FN_AFTER_INSERT_RECENT_WORD is similar to [FN_AFTER_INSERT_AUTO_WORD](#1fn_after_insert_auto_word).
FN_AFTER_SELECT_RECENT_WORD is similar to [FN_AFTER_SELECT_AUTO_WORD](#2fn_after_select_auto_word).

<br>

## Other examples.

#### 1. user custom Ajax.
You can code own's Ajax function as follows:

```JAVASCRIPT
	var fnMyAjax = function(sQuery, fnCallback) {
        let method = "get";
        let url = "../jsonMock/javascript.json?q="+sQuery;
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.addEventListener("load", function() {
          if (xhr.status === 200) {
            var sResult = JSON.parse(xhr.responseText);
            if(fnCallback && typeof fnCallback === 'function') fnCallback.call(this,sResult);
          }
        }.bind(this));
        xhr.send();
    }

	var elTarget = document.querySelector(".search-form");
	var htOption = {'AjaxRequestType' : 'user'};

    var oSS = new SweetSearch(elTarget, htOption);
    oSS.registerUserMethod({
        'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAjax,
        'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord,
        'FN_RUN_AJAX_EXECUTE'          : fnMyAjax
    });
```

**[Arguments]**

* sQuery(String)        : search word
* fnCallback(Function)  : callback

You must execute the callback function,**fnCallback** after receiving data.
