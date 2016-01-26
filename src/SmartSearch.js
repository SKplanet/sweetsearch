class SmartSearch extends CommonComponent {
	
	constructor(elTarget, htOption) {
		super(htOption)
		this.elTarget = elTarget;
		this.init(htOption);
	}

	//TODO. think about moving super class.
	init(htOption) {
		this._setDefaultOption();
		//option variable declaration
		this.option = {};
		super.execOption(htOption, this._htDefaultOption, this.option);
		this._setInitValue();
		this._registerEvents();
	}

	_setInitValue() {
		const _s = {
			inputFieldWrap 		: ".inputWrap",
			inputField 			: ".input-field",
			autoCompleteWrap 	: ".auto-complete-wrap",
			closeLayer 			: ".closeLayer",
			clearQueryBtn 		: ".clearQuery",
			autoULWrap			: ".auto-complete-wrap .ul-wrap",
			realForm 			: "#search-form"
		} 

		this.elInputFieldWrap		= this.elTarget.querySelector(_s.inputFieldWrap);
		this.elInputField 			= this.elTarget.querySelector(_s.inputField);
		this.elAutoCompleteLayer 	= this.elTarget.querySelector(_s.autoCompleteWrap);
		this.elCloseButton 			= this.elAutoCompleteLayer.querySelector(_s.closeLayer);
		this.elClearQueryBtn 		= this.elTarget.querySelector(_s.clearQueryBtn);
		this.elAutoULWrap			= this.elAutoCompleteLayer.querySelector(_s.autoULWrap);
		this.elForm 				= this.elTarget.querySelector(_s.realForm);
		this.htCachedData 			= {};

		//plugins
		this.aPluginList			= ['RecentWordPlugin'];
		this.htPluginInstance 		= {};

	}

	//must be define full option name.
	_setDefaultOption () {
		this._htDefaultOption = {
			'autoComplete' : {
				requestType : 'jsonp',
				sAutoCompleteURL : ""
			}
		}
	}

	//must be define full option name.
	_setDefaultFunction() {
		//TODO rearrange.(maybe remove function)
		this._htDefaultFunction = {
			'fnInsertAutoCompleteWord' : function(){},
			'fnSelectAutoCompleteWord' : function(){},
			'fnSubmitForm' : function(){}
		}
	}

	_registerEvents() {
		this.elInputFieldWrap.addEventListener("touchend", (evt) => this.handlerInputWrap(evt));
		//this.elInputField.addEventListener("focus" , 	(evt) => this.handlerInputFocus(evt));
		this.elInputField.addEventListener("keypress", 	(evt) => this.handlerInputKeyPress(evt));
		this.elInputField.addEventListener("keydown", 	(evt) => this.handlerInputKeydown(evt));
		this.elInputField.addEventListener("input", 	(evt) => this.handlerInputKeyInput(evt));

		this.elCloseButton.addEventListener("touchend", (evt) => this.handlerCloseLayer(evt));
		this.elClearQueryBtn.addEventListener("touchend", (evt) => this.handlerClearInputValue(evt));

		this.elAutoULWrap.addEventListener("touchstart", (evt) => this.handlerSelectAutoCompletedWordTouchStart(evt));
		this.elAutoULWrap.addEventListener("touchend", (evt) => this.handlerSelectAutoCompletedWordTouchEnd(evt));

		this.elForm.addEventListener("submit", (evt) => this.handlerSubmitForm(evt));
	}


	registerCallback(htFn) {
		this.htFn = {};
 		this._setDefaultFunction();
		super.execOption(htFn, this._htDefaultFunction, this.htFn);
	}

	handlerInputWrap(evt) {
		this.execAfterFocus(evt);
		this.elInputField.focus();
	}


	//입력필드에 들어가는 값의 어떠한 처리가 필요할때 여기서 처리한다.
	handlerInputKeyPress(evt) {}
	
	//특수키(keycode 8인 backspace등) 작업 조정이 필요한 경우 여기서 처리.
	handlerInputKeydown(evt) {}

	handlerInputKeyInput(evt) {
		let sInputData = this.elInputField.value;
		console.log("input evet fired : ", sInputData);

		if(sInputData.length > 0 ) _cu.setCSS(this.elClearQueryBtn, "display", "inline-block");
		else _cu.closeLayer(this.elClearQueryBtn);

		//after input word, must hide a recent word layer
		let oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
		if(oRecentWordPlugin) _cu.closeLayer(oRecentWordPlugin.elRecentWordLayer);

		if (typeof this.htCachedData[sInputData] === "undefined") this._AutoCompleteRequestManager(sInputData);
		else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
	}

	handlerClearInputValue(evt) {
		this.elInputField.value = "";
		this.handlerCloseLayer();
		_cu.closeLayer(this.elClearQueryBtn);
	}
	
	handlerCloseLayer(evt) {
		_cu.closeLayer(this.elAutoCompleteLayer);
	}

	handlerSelectAutoCompletedWordTouchStart(evt) {
		this.htTouchStartSelectedWord = {'x' : evt.changedTouches[0].pageX, 'y' : evt.changedTouches[0].pageY};
	}

	handlerSelectAutoCompletedWordTouchEnd(evt) {
		let nowPageY = evt.changedTouches[0].pageY;
		if(this._isExecuteTouchScoll(nowPageY)) return;

		let sText = this.htFn.fnSelectAutoCompleteWord(evt.target);
		this.elInputField.value = sText;

		this.handlerSubmitForm(null, sText);
	}

	handlerSubmitForm(evt, sQuery) {
        if(evt) evt.preventDefault();
        sQuery = sQuery || this.elInputField.value;
		this.htFn.fnSubmitForm(sQuery);

		let oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
		if(oRecentWordPlugin) oRecentWordPlugin.saveQuery(sQuery);
	}

	_isExecuteTouchScoll(pageY) {
		var nDiff = this.htTouchStartSelectedWord.y - pageY;
		if(nDiff !== 0) return true;
		return false;
	}

	execAfterFocus(evt) {
		//execute RecentWordPlugin.
		let oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
		if(!oRecentWordPlugin) return;
		oRecentWordPlugin.showRecentSearchWord(this.htFn.fnInsertRecentSearchWord);
	}

	execAfterAutoCompleteAjax(sQuery, sResult) {
		this.htFn.fnInsertAutoCompleteWord(sResult);
		if(this.elAutoCompleteLayer.querySelector("li") !== null) _cu.showLayer(this.elAutoCompleteLayer);
		else _cu.closeLayer(this.elAutoCompleteLayer);

		//save history
		this.htCachedData[sQuery] = sResult;
	}

	_AutoCompleteRequestManager(sQuery) {
		let type = this.option.autoComplete.requestType;
		let url = this.option.autoComplete.sAutoCompleteURL;
		switch(type) {
			case 'jsonp':
				this._makeAutoCompleteJSONPRequest(sQuery,url);
				break;
			case 'ajax':
				this._makeAutoCompleteAjaxRequest(sQuery,url);
				break;
			default: 
				//do something..
		}
	}

	_makeAutoCompleteJSONPRequest(sQuery, sURL) {
		_cu.sendSimpleJSONP(sURL, sQuery, "completion", this.execAfterAutoCompleteAjax.bind(this,sQuery));
	}

	_makeAutoCompleteAjaxRequest(sQuery, sURL) {
		// hardcoded url for test.
		let url = "../jsonMock/"+ sQuery +".json";
		let aHeaders = [["Content-Type", "application/json"]];
		_cu.sendSimpleAjax(url, this.execAfterAutoCompleteAjax.bind(this, sQuery), 
			JSON.stringify({
				sQuery : sQuery,
				nTime : Date.now() 
			}), 
		"get", aHeaders, sQuery);
	}

	addOnPlugin(fnName) {
		return this._addOnPlugin(fnName, this.htPluginInstance, this.aPluginList, this.elTarget);
	}

}
