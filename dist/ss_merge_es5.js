"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommonUtil = {

	// __proto__
	//__proto__: theProtoObj,

	getFnName: function getFnName(fn) {
		if (typeof fn !== "function") return;
		var sName = fn.name ? fn.name : fn.toString().match(/function\s+([^(\(|\s)]+)/)[1];
		return sName;
	},

	// animation by rAF
	// super.runAnimation(nWidthForAnimation, this.option.nDuration, {
	// 			'before' : fnBefore,
	// 			'after' : this.fnAfter
	// });

	sendSimpleAjax: function sendSimpleAjax(url, fnCallback, sData, method, aHeaders, sQuery) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);

		if (aHeaders && CommonUtil.isArray(aHeaders)) {
			aHeaders.forEach(function (v) {
				xhr.setRequestHeader(v[0], v[1]);
			});
		}

		xhr.addEventListener("load", (function () {
			if (xhr.status === 200) {
				var sResult = JSON.parse(xhr.responseText);
				if (fnCallback && typeof fnCallback === 'function') fnCallback.call(this, sResult);
			}
		}).bind(this));
		xhr.send(sData);
	},
	sendSimpleJSONP: function sendSimpleJSONP(sURL, query, sCompletionName) {

		window[sCompletionName] = null;
		var encodedQuery = encodeURIComponent(query);

		var elScript = document.createElement('script');
		elScript.setAttribute('src', sURL + 'method=' + sCompletionName + '&q=' + encodedQuery);
		document.getElementsByTagName('head')[0].appendChild(elScript);

		elScript.onload = function () {
			console.log("json result -> ", window.completion);
			//delete script for JSONP Request.
			document.getElementsByTagName('head')[0].removeChild(this);
			window[sCompletionName] = null;
		};
	},
	runAnimation: function runAnimation(nWidthForAnimation, nDuration, htFn) {
		if (htFn && htFn.before && typeof htFn.before === "function") {
			htFn['before'].call();
		}

		this.bAnimationing = true;

		var sTF = this.getCSSName("transform");

		var elTarget = this.elTarget;
		var nStartTime = Date.now();

		var nPreviousTranslateX = this.getTranslate3dX(elTarget);

		function execAnimation() {

			var nNowTime = Date.now();
			var nDiffTime = nNowTime - nStartTime;

			if (nDiffTime > nDuration) {

				var nStep = nPreviousTranslateX + nWidthForAnimation;
				elTarget.style[sTF] = 'translate3d(' + nStep + 'px, 0, 0)';
				this.bAnimationing = false;
				if (htFn && htFn.after && typeof htFn.after === "function") {
					htFn['after'].call();
				}
				return;
			} else {

				var nStep = nPreviousTranslateX + nDiffTime / nDuration * nWidthForAnimation;
				elTarget.style[sTF] = 'translate3d(' + nStep + 'px, 0, 0)';
				window.requestAnimationFrame(execAnimation.bind(this));
			}
		}

		window.requestAnimationFrame(execAnimation.bind(this));
	},
	setTranslate3dX: function setTranslate3dX(ele, nValue) {

		var sTF = this.getCSSName('transform');
		this.elTarget.style[sTF] = 'translate3d(' + nValue + 'px, 0, 0)';
	},
	getWidth: function getWidth(ele) {
		var nWidth = 0;
		if (ele.getBoundingClientRect().width) {
			nWidth = ele.getBoundingClientRect().width;
		} else {
			nWidth = ele.offsetWidth;
		}

		return nWidth;
	},
	getCSSName: function getCSSName(sName) {
		if (this.htCacheData[sName]) return this.htCacheData[sName];

		var _htNameSet = {
			'transition': ['webkitTransition', 'transition'],
			'transform': ['webkitTransform', 'transform']
		};

		var aNameList = _htNameSet[sName];

		if (!this.isExist(aNameList)) return null;

		for (var i = 0, len = aNameList.length; i < len; i++) {
			if (typeof document.body.style[aNameList[i]] === 'string') this.htCacheData[sName] = aNameList[i];
			return this.htCacheData[sName];
		}
	},
	getTranslate3dX: function getTranslate3dX(ele) {
		var sTF = this.getCSSName("transform");
		var sPreCss = ele.style[sTF];
		var nPreX = +sPreCss.replace(/translate3d\((-*\d+(?:\.\d+)*)(px)*\,.+\)/g, "$1");
		return nPreX;
	},
	getCSSTransitionEnd: function getCSSTransitionEnd() {
		var sTS = this.getCSSName('transition');
		var sTSE = sTS === "webkitTransition" ? "webkitTransitionEnd" : "transitionend";
		return sTSE;
	},
	setCSS: function setCSS(el, style, value) {
		el.style[style] = value;
	},

	//check null or undefined
	isExist: function isExist(data) {
		return data != null;
	},
	isArray: function isArray(_a) {
		if (!Array.isArray) {
			return Object.prototype.toString.call(_a) === '[object Array]';
		}
		return Array.isArray(_a);
	}
};

var CommonComponent = (function () {
	function CommonComponent(htOption) {
		_classCallCheck(this, CommonComponent);

		this.htOption = htOption;
		this.htCacheData = {};
	}

	_createClass(CommonComponent, [{
		key: "execOption",
		value: function execOption(htValue, htDefaultValue, htStorage) {
			Object.keys(htDefaultValue).forEach(function (v, i, o) {
				if (typeof htValue[v] === "undefined") {
					htStorage[v] = htDefaultValue[v];
				} else {
					htStorage[v] = htValue[v];
				}
			});
		}
	}, {
		key: "_addOnPlugin",
		value: function _addOnPlugin(fnPlugin, htPluginInstance, aPluginList, elTarget) {
			var sFunctionName = CommonUtil.getFnName(fnPlugin);
			if (aPluginList.indexOf(sFunctionName) < 0) return "unknown plugin";
			htPluginInstance[sFunctionName] = new fnPlugin(elTarget);
			return htPluginInstance[sFunctionName];
		}
	}]);

	return CommonComponent;
})();

var RecentWordPlugin = (function (_CommonComponent) {
	_inherits(RecentWordPlugin, _CommonComponent);

	function RecentWordPlugin(elTarget, htOption) {
		_classCallCheck(this, RecentWordPlugin);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RecentWordPlugin).call(this, htOption));

		_this.elTarget = elTarget;
		_this.init(htOption);
		return _this;
	}

	_createClass(RecentWordPlugin, [{
		key: "init",
		value: function init(htOption) {
			this._setDefaultOption();
			this.option = {};
			_get(Object.getPrototypeOf(RecentWordPlugin.prototype), "execOption", this).call(this, htOption, this._htDefaultOption, this.option);
			this._setInitValue();
			this._registerEvents();
		}
	}, {
		key: "_setInitValue",
		value: function _setInitValue() {
			this.elRecentWordLayer = this.elTarget.querySelector(".recent-word-wrap");
			this.elClearRecentWordBtn = this.elTarget.querySelector(".deleteWord");
			this.elCloseButtonRWL = this.elRecentWordLayer.querySelector(".closeLayer");
			this.oStorage = new RecentWordPluginLocalStorageAddOn("searchQuery");
		}
	}, {
		key: "_setDefaultOption",
		value: function _setDefaultOption() {
			this._htDefaultOption = {};
		}
	}, {
		key: "_setDefaultFunction",
		value: function _setDefaultFunction() {
			this._htDefaultFunction = {
				'fnInsertRecentSearchWord': function fnInsertRecentSearchWord() {}
			};
		}
	}, {
		key: "registerCallback",
		value: function registerCallback(htFn) {
			this.htFn = {};
			this._setDefaultFunction();
			_get(Object.getPrototypeOf(RecentWordPlugin.prototype), "execOption", this).call(this, htFn, this._htDefaultFunction, this.htFn);
		}
	}, {
		key: "_registerEvents",
		value: function _registerEvents() {
			var _this2 = this;

			this.elClearRecentWordBtn.addEventListener("touchend", function (evt) {
				_this2.handlerClearRecentWord(evt);
			});
			this.elCloseButtonRWL.addEventListener("touchend", function (evt) {
				_this2.handlerCloseAllLayer(evt);
			});
		}
	}, {
		key: "handlerClearRecentWord",
		value: function handlerClearRecentWord(evt) {
			this.oStorage.removeKeywords();
			this.elRecentWordLayer.querySelector("ul").innerHTML = "";
			this.elClearRecentWordBtn.style.display = "none";
		}

		//TODO. duplicate

	}, {
		key: "handlerCloseAllLayer",
		value: function handlerCloseAllLayer(evt) {
			this.elRecentWordLayer.style.display = "none";
		}
	}, {
		key: "showRecentSearchWord",
		value: function showRecentSearchWord() {
			this.elRecentWordLayer.style.display = "block";
			var sData = this.oStorage.getKeywords();
			if (sData === null || sData === "") return;
			this.elClearRecentWordBtn.style.display = "block";
			var aData = JSON.parse(sData);
			this.htFn.fnInsertRecentSearchWord(aData);
		}
	}]);

	return RecentWordPlugin;
})(CommonComponent);

var RecentWordPluginLocalStorageAddOn = (function () {
	function RecentWordPluginLocalStorageAddOn(sKey) {
		_classCallCheck(this, RecentWordPluginLocalStorageAddOn);

		this.sKey = sKey;
	}

	_createClass(RecentWordPluginLocalStorageAddOn, [{
		key: "saveKeyword",
		value: function saveKeyword(sKeyword) {
			if (this._validStorage()) return;

			var aLegacy = this.getKeywords();

			//to Array
			if (aLegacy === null) aLegacy = [];else aLegacy = JSON.parse(aLegacy);

			//save data
			var nIndex = aLegacy.indexOf(sKeyword);
			if (nIndex > -1) {
				if (nIndex === aLegacy.length - 1) return;
				aLegacy.splice(nIndex, 1);
			}

			aLegacy.push(sKeyword);
			localStorage.setItem(this.sKey, JSON.stringify(aLegacy));
		}
	}, {
		key: "getKeywords",
		value: function getKeywords() {
			if (this._validStorage()) return;

			var sResult = localStorage.getItem(this.sKey);
			return sResult;
		}
	}, {
		key: "removeKeywords",
		value: function removeKeywords() {
			if (this._validStorage()) return;

			return localStorage.removeItem(this.sKey);
		}
	}, {
		key: "_validStorage",
		value: function _validStorage() {
			if (typeof Storage === "undefined") return;
		}
	}]);

	return RecentWordPluginLocalStorageAddOn;
})();

var SmartSearch = (function (_CommonComponent2) {
	_inherits(SmartSearch, _CommonComponent2);

	function SmartSearch(elTarget, htOption) {
		_classCallCheck(this, SmartSearch);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartSearch).call(this, htOption));

		_this3.elTarget = elTarget;
		_this3.init(htOption);
		return _this3;
	}

	//TODO. think about moving super class.

	_createClass(SmartSearch, [{
		key: "init",
		value: function init(htOption) {
			this._setDefaultOption();
			//option variable declaration
			this.option = {};
			_get(Object.getPrototypeOf(SmartSearch.prototype), "execOption", this).call(this, htOption, this._htDefaultOption, this.option);
			this._setInitValue();
			this._registerEvents();
		}
	}, {
		key: "_setInitValue",
		value: function _setInitValue() {
			var _cssSelector = {
				inputField: ".input-field",
				autoCompleteWrap: ".auto-complete-wrap",
				closeLayer: ".closeLayer",
				clearQueryBtn: ".clearQuery"
			};

			this.elInputField = this.elTarget.querySelector(_cssSelector.inputField);
			this.elAutoCompleteLayer = this.elTarget.querySelector(_cssSelector.autoCompleteWrap);
			this.elCloseButton = this.elAutoCompleteLayer.querySelector(_cssSelector.closeLayer);
			this.elClearQueryBtn = this.elTarget.querySelector(_cssSelector.clearQueryBtn);
			this.htCachedData = {};

			//plugins
			this.aPluginList = ['RecentWordPlugin'];
			this.htPluginInstance = {};
		}
	}, {
		key: "_setDefaultOption",
		value: function _setDefaultOption() {
			this._htDefaultOption = {
				//'bCircular' : false,
			};
		}
	}, {
		key: "_setDefaultFunction",
		value: function _setDefaultFunction() {
			this._htDefaultFunction = {
				'fnInsertAutoCompleteWord': function fnInsertAutoCompleteWord() {}
			};
		}
	}, {
		key: "_registerEvents",
		value: function _registerEvents() {
			var _this4 = this;

			this.elInputField.addEventListener("focus", function (evt) {
				return _this4.handlerInputFocus(evt);
			});
			this.elInputField.addEventListener("keypress", function (evt) {
				return _this4.handlerInputKeyPress(evt);
			});
			this.elInputField.addEventListener("keydown", function (evt) {
				return _this4.handlerInputKeydown(evt);
			});
			this.elInputField.addEventListener("input", function (evt) {
				return _this4.handlerInputKeyInput(evt);
			});
			this.elCloseButton.addEventListener("touchend", function (evt) {
				return _this4.handlerCloseAllLayer(evt);
			});
			this.elClearQueryBtn.addEventListener("touchend", function (evt) {
				return _this4.handlerClearInputValue(evt);
			});
		}
	}, {
		key: "registerCallback",
		value: function registerCallback(htFn) {
			this.htFn = {};
			this._setDefaultFunction();
			_get(Object.getPrototypeOf(SmartSearch.prototype), "execOption", this).call(this, htFn, this._htDefaultFunction, this.htFn);
		}

		/* start EVENT-HANDLER */

	}, {
		key: "handlerInputFocus",
		value: function handlerInputFocus(evt) {
			CommonUtil.setCSS(this.elClearQueryBtn, "display", "inline-block");
			this.execAfterFocus(evt);
		}

		//입력필드에 들어가는 값의 어떠한 처리가 필요할때 여기서 처리한다.

	}, {
		key: "handlerInputKeyPress",
		value: function handlerInputKeyPress(evt) {}

		//특수키(keycode 8인 backspace등) 작업 조정이 필요한 경우 여기서 처리.

	}, {
		key: "handlerInputKeydown",
		value: function handlerInputKeydown(evt) {}
	}, {
		key: "handlerInputKeyInput",
		value: function handlerInputKeyInput(evt) {
			var sInputData = this.elInputField.value;
			console.log("input evet fired : ", sInputData);

			//after input word, must hide a recent word layer
			var oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
			if (oRecentWordPlugin) oRecentWordPlugin.elRecentWordLayer.style.display = "none";

			if (typeof this.htCachedData[sInputData] === "undefined") this._makeAutoCompleteAjaxRequest(sInputData);else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
		}
	}, {
		key: "handlerClearInputValue",
		value: function handlerClearInputValue(evt) {
			this.elInputField.value = "";
			this.handlerCloseAllLayer();
		}
	}, {
		key: "handlerCloseAllLayer",
		value: function handlerCloseAllLayer(evt) {
			CommonUtil.setCSS(this.elAutoCompleteLayer, "display", "none");
		}
	}, {
		key: "execAfterFocus",
		value: function execAfterFocus(evt) {
			//execute RecentWordPlugin.
			var oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
			if (!oRecentWordPlugin) return;
			oRecentWordPlugin.showRecentSearchWord(this.htFn.fnInsertRecentSearchWord);

			//execute other plugin or other logic.
		}
	}, {
		key: "execAfterAutoCompleteAjax",
		value: function execAfterAutoCompleteAjax(sQuery, sResult) {
			this.htFn.fnInsertAutoCompleteWord(sResult);
			this.elAutoCompleteLayer.style.display = "block";

			//save history
			this.htCachedData[sQuery] = sResult;

			//save keyword to localstorage
			//this.saveKeyword(sQuery);
		}
	}, {
		key: "_makeAutoCompleteAjaxRequest",
		value: function _makeAutoCompleteAjaxRequest(sQuery) {

			// let myfunction = function(data) {
			// 	console.log("jsonp response..", data);
			// };

			//TODO. execAfterAutoCompleteAjax 메서드를 콜백을 전달해서 실행하게 해야 한다.
			var sURL = 'http://completion.amazon.com/search/complete?mkt=1&client=amazon-search-ui&x=String&search-alias=aps&';
			CommonUtil.sendSimpleJSONP(sURL, sQuery, "completion");

			//Ajax request.
			// let url = "../jsonMock/"+ sQuery +".json";
			// let aHeaders = [["Content-Type", "application/json"]];
			// CommonUtil.sendSimpleAjax(url, this.execAfterAutoCompleteAjax.bind(this, sQuery),
			// 	JSON.stringify({
			// 		sQuery : sQuery,
			// 		nTime : Date.now()
			// 	}),
			// "get", aHeaders, sQuery);
		}
	}, {
		key: "addOnPlugin",
		value: function addOnPlugin(fnName) {
			return this._addOnPlugin(fnName, this.htPluginInstance, this.aPluginList, this.elTarget);
		}
	}]);

	return SmartSearch;
})(CommonComponent);
//# sourceMappingURL=ss_merge_es5.js.map
