
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

		this.elInputField 			= this.elTarget.querySelector(".input-field");
		this.elAutoCompleteLayer 	= this.elTarget.querySelector(".auto-complete-wrap");
		this.elRecentWordLayer 		= this.elTarget.querySelector(".recent-word-wrap");

	}

	_setDefaultOption () {

		this._htDefaultOption = {
			//'bCircular' : false,
		}
	}

	_setDefaultFunction() {

		this._htDefaultFunction = {
			// 'beforeSwipe' : function(){},
			// 'afterSwipe' : function(){},
		}

	}

	registerCallback(htFn) {

		this.htFn = {};
 		this._setDefaultFunction();
		super.execOption(htFn, this._htDefaultFunction, this.htFn);

	}

	_registerEvents() {

		this.elInputField.addEventListener("touchstart", (evt) => { this.handlerInputTouchStart(evt) });
		this.elInputField.addEventListener("keypress", (evt) => { this.handlerInputKeydown(evt) });

	}

	/* start EVENT-HANDLER */ 
	handlerInputTouchStart(evt) {

		this.elRecentWordLayer.style.display = "block";

	}

	handlerInputKeydown(evt) {

		let sQuery = String.fromCharCode(evt.charCode);
		let sInputData = this.elInputField.value;

		let url = "../jsonMock/"+ sInputData +".json";

		let fnCallback = function(sData) {
			console.log("print receive data ", sData);
		}

		this.sendAjax(url, fnCallback,sQuery);

		//console.log("lodash test > ", _.indexOf([1,2,3,9,5], 39));

		// fetch("../jsonMock/j.json").then(function(res){
		// 	return res.json()
		// }).then(function(json) {
		// 	console.log('parsed json', json)
		// }).catch(function(ex) {
		// 	console.log('parsing failed', ex)
		// });
	}

	sendAjax(url, fnCallback, sQuery) {

		var xhr = new XMLHttpRequest();

		xhr.open('get', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				var sResult = JSON.parse(xhr.responseText);
				fnCallback(sResult);
			}
		};

		xhr.send(JSON.stringify({
			sQuery : sQuery,
			nTime : Date.now() 
		}));

		//xhr.send();
	}

}







