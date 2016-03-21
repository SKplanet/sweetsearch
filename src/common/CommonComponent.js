/*
* The MIT License (MIT)
* Copyright (c) 2016 SK PLANET. All Rights Reserved. *
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: *
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software. *
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE. */

/*!
* \CommonComonent.js
* \core component source for Components UI .
* \copyright Copyright (c) 2016, SK PLANET. All Rights Reserved. 
* \license This project is released under the MIT License.
* \contributor Jisu Youn (jisu.youn@gmail.com)
* \warning dont'use this source in other library source.
*/

class CommonComponent {
	constructor(htOption) {
		this.htOption = htOption;
		this.htCacheData = {};
	}

	setOption (htValue, htDefaultValue, htStorage) {
		Object.keys(htDefaultValue).forEach((v) => {
			if(typeof htValue[v] === "undefined") {
				htStorage[v] = htDefaultValue[v];
			} else {
                if(Object.prototype.toString.call(htValue[v]) !== "[object Object]") {
                	htStorage[v] = htValue[v];
                	return;
                }
                htStorage[v] = {};
				this.setOption.call(this, htValue[v], htDefaultValue[v],htStorage[v]); 
			}
		});
	}

	appendPluginMethod (htValue, htDefaultValue, htStorage) {
		Object.keys(htDefaultValue).forEach((v) => {
			if(!Array.isArray(htStorage[v])) htStorage[v] = [];

			if(typeof htValue[v] === "undefined") {
				htStorage[v].push(htDefaultValue[v]);
			} else {
                htStorage[v].push(htValue[v]);
                return;
			}
		});
	}

	getDefaultCallbackList(aFn) {
		let htFn = {};
		aFn.forEach((v) => {
			htFn[v] = function(){};
		})
		return htFn;
	}

	initPlugins(aMyPluginName, aPluginList, elTarget) {
		//TODO. remove instance relation.
		this.htPluginInstance = {};
		let oParent = this;
		aPluginList.forEach((v) => {
			let sName = v.name;
			if(aMyPluginName.indexOf(sName) < 0) return;
			let oPlugin = new window[v.name](elTarget, v.option);
			oPlugin.registerUserMethod(v.userMethod);
			this._injectParentObject(oParent, oPlugin);
			//TODO. remove instance relation.
			this.htPluginInstance[v.name] = oPlugin;
		});
	}

	runCustomFn(type, eventname) {
		let args = [].slice.call(arguments, 2);
		let returnValue;

		switch(type) {
			case "USER" : 
				if((typeof this.htUserFn ==="object") && (typeof this.htUserFn[eventname] ==="function")) {
					returnValue = this.htUserFn[eventname](...args);
				}
				break
			case "PLUGIN": 
				if( (typeof this.htPluginFn ==="object") && (typeof this.htPluginFn[eventname] ==="object")) {
					this.htPluginFn[eventname].forEach((fn) => {
						fn(...args);
					});
				}
				break
			default : 
		}
		return returnValue;
	}

	_injectParentObject(oParent, oChild) {
		oChild.dockingPluginMethod(oParent);
	}
}

