class CommonComponent {
	constructor(htOption) {
		this.htOption = htOption;
		this.htCacheData = {};
	}

	execOption (htValue, htDefaultValue, htStorage) {
		Object.keys(htDefaultValue).forEach((v) => {
			if(typeof htValue[v] === "undefined") {
				htStorage[v] = htDefaultValue[v];
			} else {
                if(toString.call(htValue[v]) !== "[object Object]") {
                	htStorage[v] = htValue[v];
                	return;
                }
                htStorage[v] = {};
				this.execOption.call(this, htValue[v], htDefaultValue[v],htStorage[v]); 
			}
		});
	}

	_addOnPlugin(fnPlugin, htPluginInstance, aPluginList, elTarget) {
		let sFunctionName = _cu.getFnName(fnPlugin);
		if(aPluginList.indexOf(sFunctionName) < 0) return "unknown plugin";
		htPluginInstance[sFunctionName] = new fnPlugin(elTarget);
		return htPluginInstance[sFunctionName];
	}
}

