
SmartSearch는 웹검색 자동완성 UI컴포넌트 이다.


### 1. Demo

http://175.126.56.107:8081/demo/search/demo/syrupSearch.html

<br/>
### 2. Usage

##### step 1. download source.

dist/ss_merge_es5.js

##### step 2. import source.

```HTML

<script src="../dist/ss_merge_es5.js"></script>

```

##### step 3. initialize component.


```JAVASCRIPT

        var oSS = new SmartSearch(elFormComtainer, {
            'autoComplete'  : {
                'sAutoCompleteURL'    : "http://api.skplanet.com/search?XX=1&,
                'requestType'         : 'jsonp',
                'jsonp_callbackName'  : 'ac_done'

            }
        });

        oSS.onMethod({
            'fnInsertAutoCompleteWord' : function(sData) {},
            'fnSelectAutoCompleteWord' : function(element) {},
            'fnSubmitForm' : function(sQuery)  {}
        });

```
<br/>

### 3. Usage with RecentWordPlugin.
최근검색어까지 노출하고 싶을때.


```JAVASCRIPT

        var oSS = new SmartSearch(elFormComtainer, {
            'autoComplete'  : {
                'sAutoCompleteURL'    : "http://api.skplanet.com/search?XX=1&,
                'requestType'         : 'jsonp',
                'jsonp_callbackName'  : 'ac_done'
            },
             'RecentWordPlugin'          : {
                'usage' : true,
                'maxList' : 7
            }
        });

        oSS.onMethod({
            'fnInsertAutoCompleteWord' : function(sData) {},
            'fnSelectAutoCompleteWord' : function(element) {},
            'fnInsertRecentSearchWord' : function(sData) {},
            'fnSelectRecentSearchWord' : function(element) {},
            'fnSubmitForm' : function(sQuery)  {}
        });

```

<br/>
### 4. API
##### onMethod
: 콜백함수 등록.

<br/>
### 5. 콜백함수 목록
##### fnInsertAutoCompleteWord
: 자동완성이 끝나고 그 결과를 화면에 표현할때.

##### fnSelectAutoCompleteWord
: 자동완성 결과 하나를 선택했을 때

##### fnInsertRecentSearchWord
: 최근검색어를 가져와서 화면에 표현할 때.

##### fnSelectRecentSearchWord
: 자동완성 결과 하나를 선택했을 때


<br/>
### 6. Example.
서버로 받은 json형태의 자동완성 데이터를 fnInsertAutoCompleteWord 에서 파싱하는 예제.


```JAVASCRIPT

//server 에서 받은 데이터 형태(결과는 'kwds' 키에 있음)
{
    "q" : ["짬뽕", "짬뽕"], 
    "kwds" : [["짬뽕", "P" ],["짬뽕타임 영통점", "P" ],["짬뽕의 천국", "P" ],["짬뽕늬우스", "P" ],["짬뽕9단 제기역점", "P" ],["짬뽕타임 식사점", "P" ],["짬뽕타임 광교점", "P" ],["짬뽕산", "P" ],["짬뽕타임 화정점", "P" ],["짬뽕타임 수내점", "P" ],["짬뽕의전설", "P" ],["짬뽕의신화 삼산점", "P" ],["짬뽕의신화 구로본점", "P" ],["짬뽕신 도심공항점", "P" ],["짬뽕반점", "P" ],["짬뽕필락 서교점", "P" ],["짬뽕필락", "P" ],["짬뽕타임 청라점", "P" ],["짬뽕타임 중동점", "P" ],["짬뽕타임 이수점", "P" ]],
    "combq" : "",
    "df" : 0
}


//fnInsertAutoCompleteWord 에서 파싱.(kwds부분을 추출해서 파싱)
var fnInsertAutoCompleteWordSyrupTable = function(sData) {
        var result  = "";
        var sHTML   = "";
        var sTemplate = "<li><span>[%sKeyword%]</span></li>";
        var sInputValue = elInputField.value;
        var sInputValueNoBlank = sInputValue.replace(/\s+/g, ""); 

        var bHighlightMatchedWord = true; //검색어와 일치하는 글자에 bold처리.

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
        //document에 결과를 추가.
        elAutoCompleteLayer.querySelector("ul").innerHTML = sHTML;
    }

```

</br>


