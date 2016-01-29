"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

			var currentChar = String.fromCharCode(evt.charCode);

			//console.log("lodash test > ", _.indexOf([1,2,3,9,5], 39));

			// fetch("../jsonMock/j.json").then(function(res){
			// 	return res.json()
			// }).then(function(json) {
			// 	console.log('parsed json', json)
			// }).catch(function(ex) {
			// 	console.log('parsing failed', ex)
			// });
		}
	}]);

	return SmartSearch;
})(CommonComponent);
//# sourceMappingURL=ss_merge_es5.js.map
