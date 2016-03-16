SweetSearch
============
SweetSearch is Auto-Suggestion(Auto-Complete) component.


## Feature

* lightweight (vanillaJS)
* multiple options 
* based on ES6 Syntax

## Demo

http://nigayo.github.io/..

<br/>
## Install

1. npm init

2. gulp buildJS

3. import

```HTML
<script src="../dist/ss_merge_es5.js"></script>
```

## Usage
initialize Component and register callback.

```JAVASCRIPT

        var oSS = new SweetSearch(elFormComtainer, {
            'sAutoCompleteURL'    : sAutoCompleteURLLocal,
            'AjaxRequestType'     : 'ajax', //jsonp, ajax, user
        });

        oSS.registerUserMethod({
            'FN_AFTER_INSERT_AUTO_WORD'    : fnInsertAutoCompleteWordAjax,
            'FN_AFTER_SELECT_AUTO_WORD'    : fnSelectAutoCompleteWord
        });

```

## Register callback

##### 1. FN_AFTER_INSERT_AUTO_WORD
execute after Ajax response.
<img src="demo/img/sweetsearch_reference_desc_001.jpg" alt="chrome dev tools" style="width:600px;">

you have to implement codes about auto-Complete word list view.

```JAVASCRIPT
	var fnInsertAutoCompleteWordAjax = function(sQuery, sData) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";

        sData.items[0].forEach( function(v) {
            result = sTemplate.replace(/\[%sKeyword%\]/, v[0]);       
            sHTML += result;
        });
    }
```

<br>

##### 2. FN_AFTER_SELECT_AUTO_WORD
execute after selecting auto-complete word list.
<img src="demo/img/sweetsearch_reference_desc_002.jpg" alt="chrome dev tools" style="width:600px;">

you have to implement codes about auto-Complete word list view.

```JAVASCRIPT
	var fnInsertAutoCompleteWordAjax = function(sQuery, sData) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";

        sData.items[0].forEach( function(v) {
            result = sTemplate.replace(/\[%sKeyword%\]/, v[0]);       
            sHTML += result;
        });
    }
```
