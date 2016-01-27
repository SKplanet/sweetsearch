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
                if(toString.call(htValue[v]) !== "[object Object]") {
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
			htFn[v] = new Function();
		})
		return htFn;
	}

	registerPluginCallback(htFn) {
		Object.keys(htFn).forEach((v) => {
			Object.keys(this.htPluginInstance).forEach((v2) => {
				if(typeof this.htPluginInstance[v2].htDefaultFn[v] !== "undefined") {
					let htPluginFunction = {};
					htPluginFunction[v] = htFn[v];
					this.htPluginInstance[v2].onMethod(htPluginFunction);
				}
			});
		});
	}

}

