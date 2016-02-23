/**
 * @nigayo. SKPlanet.
 * @v0.0.3
 * @UIComponent common component
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

	getDefaultCallbackList(aFn) {
		let htFn = {};
		aFn.forEach((v) => {
			htFn[v] = function(){};
		})
		return htFn;
	}

	initPlugins(aMyPluginName, aPluginList, elTarget) {
		let htPluginInstance = {};
		let oParent = this;
		aPluginList.forEach((v) => {
			let sName = v.name;
			if(aMyPluginName.indexOf(sName) < 0) return;
			htPluginInstance[sName] = new window[v.name](elTarget, v.option);
			htPluginInstance[sName].registerUserMethod(v.userMethod);
			this._injectParentObject(oParent, htPluginInstance[sName]);
		});
		return htPluginInstance;
	}

	onMethodSuper(htFn) {
		Object.keys(htFn).forEach((v) => {
			if(typeof this.htPluginInstance[v2].htDefaultFn[v] !== "undefined") {
				htPluginFunction[v] = htFn[v];
			}
		});
	}

	runCustomFn(type, eventname) {
		let args = [].slice.call(arguments, 2);
		switch(type) {
			case "USER" : 
				this.htUserFn[eventname](...args);
				break
			case "PLUGIN": 
				this.htPluginFn[eventname](...args);
				break
			default : 
		}
	}

	_injectParentObject(oParent, oChild) {
		oChild.dockingPluginMethod(oParent);
	}
}

