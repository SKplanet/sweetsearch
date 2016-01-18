class CommonComponent {
	constructor(htOption) {
		this.htOption = htOption;
		this.htCacheData = {};
	}

	execOption (htValue, htDefaultValue, htStorage) {
		Object.keys(htDefaultValue).forEach((v,i,o) => {
			if(typeof htValue[v] === "undefined") {
				htStorage[v] = htDefaultValue[v];
			} else {
				htStorage[v] = htValue[v];
			}
		});
	}

	_addOnPlugin(fnPlugin, htPluginInstance, aPluginList, elTarget) {
		let sFunctionName = CommonUtil.getFnName(fnPlugin);
		if(aPluginList.indexOf(sFunctionName) < 0) return "unknown plugin";
		htPluginInstance[sFunctionName] = new fnPlugin(elTarget);
		return htPluginInstance[sFunctionName];
	}
}

