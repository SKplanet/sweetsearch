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

	getPluginInstance(htPluginList, htOptionList, elTarget) {
		let htPluginInstance = {};
		Object.keys(htPluginList).forEach((v) => {
			if(htOptionList[v] === "undefined" || !htOptionList[v].usage) return;
			htPluginInstance[v] = new htPluginList[v](elTarget, htOptionList[v]);
		});
		return htPluginInstance;
	}

	registerPluginCallback(htFn) {
		Object.keys(this.htPluginInstance).forEach((v2) => {
			let htPluginFunction = {};
			Object.keys(htFn).forEach((v) => {
				if(typeof this.htPluginInstance[v2].htDefaultFn[v] !== "undefined") {
					htPluginFunction[v] = htFn[v];
				}
			});
			this.htPluginInstance[v2].onMethod(htPluginFunction);
		});
	}
	
}

