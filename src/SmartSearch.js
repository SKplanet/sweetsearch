
class SmartSearch extends CommonComponent {
	
	constructor(elTarget, htOption) {
		super(htOption)
		this.elTarget = elTarget;
		this.init(htOption);
	}

	init(htOption) {
		this._setDefaultOption();
		//option variable declaration
		this.option = {};
		super.execOption(htOption, this._htDefaultOption, this.option);
		this._setInitValue();
		this._registerEvents();
	}

	_setInitValue() {
		//TODO. have to set to option value
		this.elInputField 			= this.elTarget.querySelector(".input-field");
		this.elAutoCompleteLayer 	= this.elTarget.querySelector(".auto-complete-wrap");
		this.elRecentWordLayer 		= this.elTarget.querySelector(".recent-word-wrap");

		this.elCloseButton 			= this.elAutoCompleteLayer.querySelector(".closeLayer");
		this.elCloseButtonRWL		= this.elRecentWordLayer.querySelector(".closeLayer");

		this.elClearQueryBtn 		= this.elTarget.querySelector(".clearQuery");
		this.elClearRecentWordBtn 	= this.elTarget.querySelector(".deleteWord");
		this.htCachedData 			= {};

		this.oStorage = new LocalStorage("searchQuery");
	}

	_setDefaultOption () {
		this._htDefaultOption = {
			//'bCircular' : false,
		}
	}

	_setDefaultFunction() {
		this._htDefaultFunction = {
			'fnInsertAutoCompleteWord' : function(){},
			'fnInsertRecentSearchWord' : function(){}
		}
	}

	registerCallback(htFn) {
		this.htFn = {};
 		this._setDefaultFunction();
		super.execOption(htFn, this._htDefaultFunction, this.htFn);
	}

	_registerEvents() {
		this.elInputField.addEventListener("focus" , 	(evt) => { this.handlerInputFocus(evt) });

		this.elInputField.addEventListener("keypress", 	(evt) => { this.handlerInputKeyPress(evt) });
		this.elInputField.addEventListener("keydown", 	(evt) => { this.handlerInputKeydown(evt) });
		this.elInputField.addEventListener("input", 	(evt) => { this.handlerInputKeyInput(evt) });

		this.elCloseButton.addEventListener("touchend", (evt) => { this.handlerCloseAllLayer(evt)});
		this.elCloseButtonRWL.addEventListener("touchend", (evt) => { this.handlerCloseAllLayer(evt)});

		this.elClearQueryBtn.addEventListener("touchend", (evt) => { this.handlerClearInputValue(evt)});
		this.elClearRecentWordBtn.addEventListener("touchend", (evt) => { this.handlerClearRecentWord(evt)});

	}

	/* start EVENT-HANDLER */ 
	handlerInputFocus(evt) {
		this.elClearQueryBtn.style.display = "inline-block";
		//TODO.  optional
		this.showRecentSearchWord();
	}

	//입력필드에 들어가는 값의 어떠한 처리가 필요할때 여기서 처리한다.
	handlerInputKeyPress(evt) {
		//this._defer(this._makeAjaxRequest.bind(this));
	}
	
	//특수키(keycode 8인 backspace등) 작업 조정이 필요한 경우 여기서 처리.
	handlerInputKeydown(evt) {
	}

	handlerInputKeyInput(evt) {
		let sInputData = this.elInputField.value;
		console.log("input evet fired : ", sInputData);
		if (typeof this.htCachedData[sInputData] === "undefined") this._makeAutoCompleteAjaxRequest(sInputData);
		else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
	}

	execAfterAutoCompleteAjax(sQuery, sResult) {
		//user customed function
		this.htFn.fnInsertAutoCompleteWord(sResult);

		//save history
		this.htCachedData[sQuery] = sResult;

		//save keyword to localstorage 
		//this.saveKeyword(sQuery);
	}

	showRecentSearchWord() {
		this.elRecentWordLayer.style.display = "block";
		let sData = this.oStorage.getKeywords();
		if(sData === null || sData === "") return;
		this.elClearRecentWordBtn.style.display = "block";
		let aData = JSON.parse(sData);
		this.htFn.fnInsertRecentSearchWord(aData);
	}

	_defer(fn) {
		setTimeout( function() {
			let sInputData = this.elInputField.value;
			//let sQuery = sInputData + String.fromCharCode(evt.charCode);
			console.log("keydown timeout: " , sInputData);
			//fn(sInputData);
		}.bind(this),10);
	}

	_makeAutoCompleteAjaxRequest(sQuery) {
		let url = "../jsonMock/"+ sQuery +".json";
		let aHeaders = [["Content-Type", "application/json"]];

		this.sendSimpleAjax(url, this.execAfterAutoCompleteAjax.bind(this, sQuery), 
			JSON.stringify({
				sQuery : sQuery,
				nTime : Date.now() 
			}), 
		"get", aHeaders, sQuery);
	}

	//TODO. move to a CommmonComponent or AjaxUtils.
	sendSimpleAjax(url, fnCallback, sData, method, aHeaders, sQuery) {

		let xhr = new XMLHttpRequest();
		xhr.open(method, url);

		aHeaders.forEach( (v) => {
			xhr.setRequestHeader(v[0], v[1]);
		});

		xhr.addEventListener("load", function() {
			if (xhr.status === 200) {
				var sResult = JSON.parse(xhr.responseText);
				fnCallback.call(this, sResult);
			}
		}.bind(this));
		xhr.send(sData);
	}

	handlerClearInputValue(evt) {
		this.elInputField.value = "";
		this.handlerCloseAllLayer();
	}

	handlerClearRecentWord(evt) {
		this.oStorage.removeKeywords();
		this.elRecentWordLayer.querySelector("ul").innerHTML = "";
		this.elClearRecentWordBtn.style.display = "none";
	}

	handlerCloseAllLayer(evt) {
		this.elAutoCompleteLayer.style.display = "none";
		this.elRecentWordLayer.style.display = "none";
	}

	replaceHTML(elClose, elShow, sHTML) {
		elClose.style.display = "none";
        elShow.style.display = "block";
        elShow.querySelector("ul").innerHTML = sHTML;
    }

}



