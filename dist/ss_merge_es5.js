"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _cu = {
	getFnName: function getFnName(fn) {
		if (typeof fn !== "function") return;
		var sName = fn.name ? fn.name : fn.toString().match(/function\s+([^(\(|\s)]+)/)[1];
		return sName;
	},
	sendSimpleAjax: function sendSimpleAjax(url, fnCallback, sData, method, aHeaders, sQuery) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);

		if (aHeaders && this.isArray(aHeaders)) {
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
	sendSimpleJSONP: function sendSimpleJSONP(sURL, query, sCompletionName, fnCallback) {

		window[sCompletionName] = function (htData) {
			fnCallback(htData);
		};

		var encodedQuery = encodeURIComponent(query);

		var elScript = document.createElement('script');
		elScript.setAttribute('src', sURL + 'method=' + sCompletionName + '&q=' + encodedQuery);
		document.getElementsByTagName('head')[0].appendChild(elScript);

		elScript.onload = function (evt) {
			var callbackValue = window[sCompletionName];
			if (callbackValue && typeof callbackValue !== 'function') {
				fnCallback(callbackValue);
			}

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
	showLayer: function showLayer(el) {
		el.style.display = "block";
	},
	closeLayer: function closeLayer(el) {
		el.style.display = "none";
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
	},
	isFunction: function isFunction(fn) {
		return Object.prototype.toString.call(fn) === '[object Function]';
	}
};

var CommonComponent = (function () {
	function CommonComponent(htOption) {
		_classCallCheck(this, CommonComponent);

		this.htOption = htOption;
		this.htCacheData = {};
	}

	_createClass(CommonComponent, [{
		key: "setOption",
		value: function setOption(htValue, htDefaultValue, htStorage) {
			var _this = this;

			Object.keys(htDefaultValue).forEach(function (v) {
				if (typeof htValue[v] === "undefined") {
					htStorage[v] = htDefaultValue[v];
				} else {
					if (Object.prototype.toString.call(htValue[v]) !== "[object Object]") {
						htStorage[v] = htValue[v];
						return;
					}
					htStorage[v] = {};
					_this.setOption.call(_this, htValue[v], htDefaultValue[v], htStorage[v]);
				}
			});
		}
	}, {
		key: "getDefaultCallbackList",
		value: function getDefaultCallbackList(aFn) {
			var htFn = {};
			aFn.forEach(function (v) {
				htFn[v] = function () {};
			});
			return htFn;
		}
	}, {
		key: "getPluginInstance",
		value: function getPluginInstance(htPluginList, htOptionList, elTarget) {
			var htPluginInstance = {};
			Object.keys(htPluginList).forEach(function (v) {
				if (htOptionList[v] === "undefined" || !htOptionList[v].usage) return;
				htPluginInstance[v] = new htPluginList[v](elTarget, htOptionList[v]);
			});
			return htPluginInstance;
		}
	}, {
		key: "registerPluginCallback",
		value: function registerPluginCallback(htFn) {
			var _this2 = this;

			Object.keys(this.htPluginInstance).forEach(function (v2) {
				var htPluginFunction = {};
				Object.keys(htFn).forEach(function (v) {
					if (typeof _this2.htPluginInstance[v2].htDefaultFn[v] !== "undefined") {
						htPluginFunction[v] = htFn[v];
					}
				});
				_this2.htPluginInstance[v2].onMethod(htPluginFunction);
			});
		}
	}]);

	return CommonComponent;
})();

var RecentWordPlugin = (function (_CommonComponent) {
	_inherits(RecentWordPlugin, _CommonComponent);

	function RecentWordPlugin(elTarget, htOption) {
		_classCallCheck(this, RecentWordPlugin);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(RecentWordPlugin).call(this, htOption));

		_this3.elTarget = elTarget;
		_this3.init(htOption);
		return _this3;
	}

	_createClass(RecentWordPlugin, [{
		key: "init",
		value: function init(htOption) {
			this.setInitValue();
			_get(Object.getPrototypeOf(RecentWordPlugin.prototype), "setOption", this).call(this, htOption, this.htDefaultOption, this.option);
			this.registerEvents();
			this.oStorage = new RecentWordPluginLocalStorageAddOn("searchQuery", this.option.maxList);
		}
	}, {
		key: "setInitValue",
		value: function setInitValue() {
			var htDefaultFn = ['fnInsertRecentSearchWord', 'fnSelectRecentSearchWord'];
			this.htDefaultOption = {
				'usage': true,
				'maxList': 5
			};

			this.elRecentWordLayer = this.elTarget.querySelector(".recent-word-wrap");
			this.elClearRecentWordBtn = this.elTarget.querySelector(".deleteWord");
			this.elCloseButtonRWL = this.elRecentWordLayer.querySelector(".closeLayer");
			this.elRecentULWrap = this.elRecentWordLayer.querySelector(".ul-wrap");

			this.htDefaultFn = _get(Object.getPrototypeOf(RecentWordPlugin.prototype), "getDefaultCallbackList", this).call(this, htDefaultFn);
			this.htFn = {};
			this.option = {};
		}
	}, {
		key: "onMethod",
		value: function onMethod(htFn) {
			_get(Object.getPrototypeOf(RecentWordPlugin.prototype), "setOption", this).call(this, htFn, this.htDefaultFn, this.htFn);
		}
	}, {
		key: "registerEvents",
		value: function registerEvents() {
			var _this4 = this;

			this.elClearRecentWordBtn.addEventListener("touchend", function (evt) {
				_this4.handlerClearRecentWord(evt);
			});
			this.elCloseButtonRWL.addEventListener("touchend", function (evt) {
				_this4.handlerCloseLayer(evt);
			});
			this.elRecentULWrap.addEventListener("touchstart", function (evt) {
				_this4.handlerSelectRecentWordTouchStart(evt);
			});
			this.elRecentULWrap.addEventListener("touchend", function (evt) {
				_this4.handlerSelectRecentWordTouchEnd(evt);
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
		key: "handlerCloseLayer",
		value: function handlerCloseLayer(evt) {
			this.elRecentWordLayer.style.display = "none";
		}
	}, {
		key: "handlerSelectRecentWordTouchStart",
		value: function handlerSelectRecentWordTouchStart(evt) {
			this.htTouchStartSelectedWord = { 'x': evt.changedTouches[0].pageX, 'y': evt.changedTouches[0].pageY };
		}
	}, {
		key: "handlerSelectRecentWordTouchEnd",
		value: function handlerSelectRecentWordTouchEnd(evt) {
			var nowPageY = evt.changedTouches[0].pageY;
			if (this.isExecuteTouchScroll(nowPageY)) return;
			this.htFn.fnSelectRecentSearchWord(evt.target);
		}
	}, {
		key: "isExecuteTouchScroll",
		value: function isExecuteTouchScroll(pageY) {
			var nDiff = this.htTouchStartSelectedWord.y - pageY;
			if (nDiff !== 0) return true;
			return false;
		}
	}, {
		key: "saveQuery",
		value: function saveQuery(sQuery) {
			this.oStorage.saveKeyword(sQuery);
		}
	}, {
		key: "showRecentSearchWord",
		value: function showRecentSearchWord() {
			var sData = this.oStorage.getKeywords();
			if (sData === null || sData === "") return;
			this.elRecentWordLayer.style.display = "block";
			this.elClearRecentWordBtn.style.display = "block";
			var aData = JSON.parse(sData);
			this.htFn.fnInsertRecentSearchWord(aData, this.option.maxList);
		}
	}]);

	return RecentWordPlugin;
})(CommonComponent);

var RecentWordPluginLocalStorageAddOn = (function () {
	function RecentWordPluginLocalStorageAddOn(sKey, nMaxList) {
		_classCallCheck(this, RecentWordPluginLocalStorageAddOn);

		this.sKey = sKey;
		this.nMaxList = nMaxList;
	}

	_createClass(RecentWordPluginLocalStorageAddOn, [{
		key: "saveKeyword",
		value: function saveKeyword(sKeyword) {
			if (this.validStorage()) return;

			var aLegacy = this.getKeywords();

			//to Array
			if (aLegacy === null) aLegacy = [];else aLegacy = JSON.parse(aLegacy);

			//save data
			var nIndex = aLegacy.indexOf(sKeyword);
			if (nIndex > -1) {
				if (nIndex === aLegacy.length - 1) return;
				aLegacy.splice(nIndex, 1);
			}

			aLegacy.unshift(sKeyword);
			if (aLegacy.length >= this.nMaxList) aLegacy.length = this.nMaxList;
			localStorage.setItem(this.sKey, JSON.stringify(aLegacy));
		}
	}, {
		key: "getKeywords",
		value: function getKeywords() {
			if (this.validStorage()) return;

			var sResult = localStorage.getItem(this.sKey);
			return sResult;
		}
	}, {
		key: "removeKeywords",
		value: function removeKeywords() {
			if (this.validStorage()) return;

			return localStorage.removeItem(this.sKey);
		}
	}, {
		key: "validStorage",
		value: function validStorage() {
			if (typeof Storage === "undefined") return;
		}
	}]);

	return RecentWordPluginLocalStorageAddOn;
})();

var SmartSearch = (function (_CommonComponent2) {
	_inherits(SmartSearch, _CommonComponent2);

	function SmartSearch(elTarget, htOption) {
		_classCallCheck(this, SmartSearch);

		var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartSearch).call(this, htOption));

		_this5.elTarget = elTarget;
		_this5.init(htOption);
		return _this5;
	}

	//TODO. think about moving super class.

	_createClass(SmartSearch, [{
		key: "init",
		value: function init(htOption) {
			this.setInitValue();
			_get(Object.getPrototypeOf(SmartSearch.prototype), "setOption", this).call(this, htOption, this._htDefaultOption, this.option);
			this.registerEvents();
			this.initPlugins();
		}
	}, {
		key: "setInitValue",
		value: function setInitValue() {
			var s = {
				inputFieldWrap: ".inputWrap",
				inputField: ".input-field",
				autoCompleteWrap: ".auto-complete-wrap",
				closeLayer: ".closeLayer",
				clearQueryBtn: ".clearQuery",
				autoULWrap: ".auto-complete-wrap .ul-wrap",
				realForm: "#search-form"
			};

			var aDefaultFn = ['fnInsertAutoCompleteWord', 'fnSelectAutoCompleteWord', 'fnSubmitForm'];

			this._htDefaultOption = {
				'autoComplete': {
					requestType: 'jsonp',
					sAutoCompleteURL: "",
					jsonp_callbackName: ""
				},
				'RecentWordPlugin': {
					'usage': false,
					'maxList': 5
				}
			};

			this.option = {};
			var _el = this.elTarget;

			this.elInputFieldWrap = _el.querySelector(s.inputFieldWrap);
			this.elInputField = _el.querySelector(s.inputField);
			this.elAutoCompleteLayer = _el.querySelector(s.autoCompleteWrap);
			this.elClearQueryBtn = _el.querySelector(s.clearQueryBtn);
			this.elForm = _el.querySelector(s.realForm);

			this.elCloseButton = this.elAutoCompleteLayer.querySelector(s.closeLayer);
			this.elAutoULWrap = this.elAutoCompleteLayer.querySelector(s.autoULWrap);

			this.htCachedData = {};
			this.htDefaultFn = _get(Object.getPrototypeOf(SmartSearch.prototype), "getDefaultCallbackList", this).call(this, aDefaultFn);
			this.htFn = {};

			//plugins
			this.htPluginList = { 'RecentWordPlugin': RecentWordPlugin };
			this.htPluginInstance = {};
		}
	}, {
		key: "registerEvents",
		value: function registerEvents() {
			var _this6 = this;

			this.elInputFieldWrap.addEventListener("touchend", function (evt) {
				return _this6.handlerInputWrap(evt);
			});

			this.elInputField.addEventListener("keypress", function (evt) {
				return _this6.handlerInputKeyPress(evt);
			});
			this.elInputField.addEventListener("keydown", function (evt) {
				return _this6.handlerInputKeydown(evt);
			});
			this.elInputField.addEventListener("input", function (evt) {
				return _this6.handlerInputKeyInput(evt);
			});

			this.elCloseButton.addEventListener("touchend", function (evt) {
				return _this6.handlerCloseLayer(evt);
			});
			this.elClearQueryBtn.addEventListener("touchend", function (evt) {
				return _this6.handlerClearInputValue(evt);
			});

			this.elAutoULWrap.addEventListener("touchstart", function (evt) {
				return _this6.handlerSelectAutoCompletedWordTouchStart(evt);
			});
			this.elAutoULWrap.addEventListener("touchend", function (evt) {
				return _this6.handlerSelectAutoCompletedWordTouchEnd(evt);
			});

			this.elForm.addEventListener("submit", function (evt) {
				return _this6.handlerSubmitForm(evt);
			});
		}
	}, {
		key: "initPlugins",
		value: function initPlugins() {
			this.htPluginInstance = _get(Object.getPrototypeOf(SmartSearch.prototype), "getPluginInstance", this).call(this, this.htPluginList, this.option, this.elTarget);
		}
	}, {
		key: "onMethod",
		value: function onMethod(htUserFn) {
			_get(Object.getPrototypeOf(SmartSearch.prototype), "setOption", this).call(this, htUserFn, this.htDefaultFn, this.htFn);
			_get(Object.getPrototypeOf(SmartSearch.prototype), "registerPluginCallback", this).call(this, htUserFn);
		}

		/***** START EventHandler *****/

	}, {
		key: "handlerInputWrap",
		value: function handlerInputWrap(evt) {
			this.execAfterFocus(evt);
			this.elInputField.focus();
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

			if (sInputData.length > 0) _cu.setCSS(this.elClearQueryBtn, "display", "inline-block");else _cu.closeLayer(this.elClearQueryBtn);

			//after input word, must hide a recent word layer
			var oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
			if (oRecentWordPlugin) _cu.closeLayer(oRecentWordPlugin.elRecentWordLayer);

			if (typeof this.htCachedData[sInputData] === "undefined") this.autoCompleteRequestManager(sInputData);else this.execAfterAutoCompleteAjax(sInputData, this.htCachedData[sInputData]);
		}
	}, {
		key: "handlerClearInputValue",
		value: function handlerClearInputValue(evt) {
			this.elInputField.value = "";
			this.handlerCloseLayer();
			_cu.closeLayer(this.elClearQueryBtn);
		}
	}, {
		key: "handlerCloseLayer",
		value: function handlerCloseLayer(evt) {
			_cu.closeLayer(this.elAutoCompleteLayer);
		}
	}, {
		key: "handlerSelectAutoCompletedWordTouchStart",
		value: function handlerSelectAutoCompletedWordTouchStart(evt) {
			this.htTouchStartSelectedWord = { 'x': evt.changedTouches[0].pageX, 'y': evt.changedTouches[0].pageY };
		}
	}, {
		key: "handlerSelectAutoCompletedWordTouchEnd",
		value: function handlerSelectAutoCompletedWordTouchEnd(evt) {
			var nowPageY = evt.changedTouches[0].pageY;
			if (this.isExecuteTouchScroll(nowPageY)) return;

			var sText = this.htFn.fnSelectAutoCompleteWord(evt.target);
		}
	}, {
		key: "handlerSubmitForm",
		value: function handlerSubmitForm(evt, sQuery) {
			if (evt) evt.preventDefault();
			sQuery = sQuery || this.elInputField.value;
			this.htFn.fnSubmitForm(sQuery);

			var oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
			if (this.htPluginInstance["RecentWordPlugin"]) oRecentWordPlugin.saveQuery(sQuery);
		}
		/***** End EventHandler *****/

	}, {
		key: "isExecuteTouchScroll",
		value: function isExecuteTouchScroll(pageY) {
			var nDiff = this.htTouchStartSelectedWord.y - pageY;
			if (nDiff !== 0) return true;
			return false;
		}
	}, {
		key: "execAfterFocus",
		value: function execAfterFocus(evt) {
			//execute RecentWordPlugin.
			var oRecentWordPlugin = this.htPluginInstance["RecentWordPlugin"];
			if (!oRecentWordPlugin) return;
			oRecentWordPlugin.showRecentSearchWord();
		}
	}, {
		key: "execAfterAutoCompleteAjax",
		value: function execAfterAutoCompleteAjax(sQuery, sResult) {
			this.htFn.fnInsertAutoCompleteWord(sResult);
			if (this.elAutoCompleteLayer.querySelector("li") !== null) _cu.showLayer(this.elAutoCompleteLayer);else _cu.closeLayer(this.elAutoCompleteLayer);

			//save history
			this.htCachedData[sQuery] = sResult;
		}
	}, {
		key: "autoCompleteRequestManager",
		value: function autoCompleteRequestManager(sQuery) {
			var type = this.option.autoComplete.requestType;
			var url = this.option.autoComplete.sAutoCompleteURL;
			switch (type) {
				case 'jsonp':
					this.makeAutoCompleteJSONPRequest(sQuery, url);
					break;
				case 'ajax':
					this.makeAutoCompleteAjaxRequest(sQuery, url);
					break;
				default:
				//do something..
			}
		}
	}, {
		key: "makeAutoCompleteJSONPRequest",
		value: function makeAutoCompleteJSONPRequest(sQuery, sURL) {
			//amazon
			//_cu.sendSimpleJSONP(sURL, sQuery, "completion", this.execAfterAutoCompleteAjax.bind(this,sQuery));
			var sCallbackName = this.option.autoComplete.jsonp_callbackName;
			_cu.sendSimpleJSONP(sURL, sQuery, sCallbackName, this.execAfterAutoCompleteAjax.bind(this, sQuery));
		}
	}, {
		key: "makeAutoCompleteAjaxRequest",
		value: function makeAutoCompleteAjaxRequest(sQuery, sURL) {
			// hardcoded url for test.
			var url = "../jsonMock/" + sQuery + ".json";
			var aHeaders = [["Content-Type", "application/json"]];
			_cu.sendSimpleAjax(url, this.execAfterAutoCompleteAjax.bind(this, sQuery), JSON.stringify({
				sQuery: sQuery,
				nTime: Date.now()
			}), "get", aHeaders, sQuery);
		}
	}]);

	return SmartSearch;
})(CommonComponent);
//# sourceMappingURL=ss_merge_es5.js.map
