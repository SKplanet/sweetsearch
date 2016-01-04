"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

		// animation by rAF
		// super.runAnimation(nWidthForAnimation, this.option.nDuration, {
		// 			'before' : fnBefore,
		// 			'after' : this.fnAfter
		// });

	}, {
		key: "runAnimation",
		value: function runAnimation(nWidthForAnimation, nDuration, htFn) {

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
		}
	}, {
		key: "setTranslate3dX",
		value: function setTranslate3dX(ele, nValue) {

			var sTF = this.getCSSName('transform');
			this.elTarget.style[sTF] = 'translate3d(' + nValue + 'px, 0, 0)';
		}
	}, {
		key: "getWidth",
		value: function getWidth(ele) {

			var nWidth = 0;
			if (ele.getBoundingClientRect().width) {
				nWidth = ele.getBoundingClientRect().width;
			} else {
				nWidth = ele.offsetWidth;
			}

			return nWidth;
		}
	}, {
		key: "getCSSName",
		value: function getCSSName(sName) {

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
		}
	}, {
		key: "getTranslate3dX",
		value: function getTranslate3dX(ele) {

			var sTF = this.getCSSName("transform");
			var sPreCss = ele.style[sTF];
			var nPreX = +sPreCss.replace(/translate3d\((-*\d+(?:\.\d+)*)(px)*\,.+\)/g, "$1");
			return nPreX;
		}
	}, {
		key: "getCSSTransitionEnd",
		value: function getCSSTransitionEnd() {

			var sTS = this.getCSSName('transition');
			var sTSE = sTS === "webkitTransition" ? "webkitTransitionEnd" : "transitionend";
			return sTSE;
		}

		//check null or undefined

	}, {
		key: "isExist",
		value: function isExist(data) {
			return data != null;
		}
	}]);

	return CommonComponent;
})();

var SmartSearch = (function (_CommonComponent) {
	_inherits(SmartSearch, _CommonComponent);

	function SmartSearch(elTarget, htOption) {
		_classCallCheck(this, SmartSearch);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartSearch).call(this, htOption));

		_this.elTarget = elTarget;
		_this.init(htOption);
		return _this;
	}

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

			this.elInputField = this.elTarget.querySelector(".input-field");
			this.elAutoCompleteLayer = this.elTarget.querySelector(".auto-complete-wrap");
			this.elRecentWordLayer = this.elTarget.querySelector(".recent-word-wrap");
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
				// 'beforeSwipe' : function(){},
				// 'afterSwipe' : function(){},
			};
		}
	}, {
		key: "registerCallback",
		value: function registerCallback(htFn) {

			this.htFn = {};
			this._setDefaultFunction();
			_get(Object.getPrototypeOf(SmartSearch.prototype), "execOption", this).call(this, htFn, this._htDefaultFunction, this.htFn);
		}
	}, {
		key: "_registerEvents",
		value: function _registerEvents() {
			var _this2 = this;

			this.elInputField.addEventListener("touchstart", function (evt) {
				_this2.handlerInputTouchStart(evt);
			});
			this.elInputField.addEventListener("keypress", function (evt) {
				_this2.handlerInputKeydown(evt);
			});
		}

		/* start EVENT-HANDLER */

	}, {
		key: "handlerInputTouchStart",
		value: function handlerInputTouchStart(evt) {

			this.elRecentWordLayer.style.display = "block";
		}
	}, {
		key: "handlerInputKeydown",
		value: function handlerInputKeydown(evt) {

			var sQuery = String.fromCharCode(evt.charCode);
			var sInputData = this.elInputField.value;

			var url = "../jsonMock/" + sInputData + ".json";

			var fnCallback = function fnCallback(sData) {
				console.log("print receive data ", sData);
			};

			this.sendAjax(url, fnCallback, sQuery);

			//console.log("lodash test > ", _.indexOf([1,2,3,9,5], 39));

			// fetch("../jsonMock/j.json").then(function(res){
			// 	return res.json()
			// }).then(function(json) {
			// 	console.log('parsed json', json)
			// }).catch(function(ex) {
			// 	console.log('parsing failed', ex)
			// });
		}
	}, {
		key: "sendAjax",
		value: function sendAjax(url, fnCallback, sQuery) {

			var xhr = new XMLHttpRequest();

			xhr.open('get', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function () {
				if (xhr.status === 200) {
					var sResult = JSON.parse(xhr.responseText);
					fnCallback(sResult);
				}
			};

			xhr.send(JSON.stringify({
				sQuery: sQuery,
				nTime: Date.now()
			}));

			//xhr.send();
		}
	}]);

	return SmartSearch;
})(CommonComponent);
//# sourceMappingURL=ss_merge_es5.js.map
