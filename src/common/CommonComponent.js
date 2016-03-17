/**
 * @nigayo. SKPlanet.
 * @v0.0.2.prefetch
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

