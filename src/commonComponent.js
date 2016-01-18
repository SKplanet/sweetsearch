
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
		let sFunctionName = this.getFnName(fnPlugin);
		if(aPluginList.indexOf(sFunctionName) < 0) return "unknown plugin";
		htPluginInstance[sFunctionName] = new fnPlugin(elTarget);
		return htPluginInstance[sFunctionName];
	}

	getFnName(fn) {
	    if(typeof fn !== "function") return "not a function";
	    var sName = (fn.name) ? fn.name : fn.toString().match(/function\s+([^(\(|\s)]+)/)[1];
	    return sName;
	}

	// animation by rAF
	// super.runAnimation(nWidthForAnimation, this.option.nDuration, {
	// 			'before' : fnBefore,
	// 			'after' : this.fnAfter
	// });
	runAnimation(nWidthForAnimation, nDuration, htFn) {

		if(htFn && htFn.before && (typeof htFn.before === "function")) { 
		 	htFn['before'].call();
		}

		this.bAnimationing = true;

		let sTF = this.getCSSName("transform");

		let elTarget = this.elTarget;
		let nStartTime = Date.now();

		let nPreviousTranslateX = this.getTranslate3dX(elTarget);


		function execAnimation() {

			let nNowTime = Date.now();
			let nDiffTime = nNowTime-nStartTime;

			if(nDiffTime > nDuration) {

				let nStep = nPreviousTranslateX + (nWidthForAnimation);
				elTarget.style[sTF] = 'translate3d(' + (nStep) + 'px, 0, 0)';
				this.bAnimationing =false;
				if(htFn && htFn.after && (typeof htFn.after === "function")) { 
					htFn['after'].call();
				}
				return;

			} else { 

				let nStep = nPreviousTranslateX + (nDiffTime / nDuration * nWidthForAnimation);
				elTarget.style[sTF] = 'translate3d(' + (nStep) + 'px, 0, 0)';
				window.requestAnimationFrame(execAnimation.bind(this));   

			}
		}

		window.requestAnimationFrame(execAnimation.bind(this));

	}

	setTranslate3dX(ele, nValue) {

		let sTF = this.getCSSName('transform');
		this.elTarget.style[sTF] = 'translate3d(' + (nValue) + 'px, 0, 0)';

	}

	getWidth (ele) {

		let nWidth = 0;
		if (ele.getBoundingClientRect().width) {
 			nWidth = ele.getBoundingClientRect().width;
		} else {
		  	nWidth = ele.offsetWidth;
		}

		return nWidth
	}

	getCSSName(sName) {

		if(this.htCacheData[sName]) return this.htCacheData[sName];

		var _htNameSet = {
						'transition' : ['webkitTransition', 'transition' ], 
						'transform' : ['webkitTransform', 'transform' ], 
				  }

		let aNameList = _htNameSet[sName];

		if(!this.isExist(aNameList)) return null;

		for(let i=0, len=aNameList.length; i < len ; i++) {
			if(typeof document.body.style[aNameList[i]] === 'string') this.htCacheData[sName] = aNameList[i];
			return this.htCacheData[sName];
		}
	}

	getTranslate3dX(ele) {

		let sTF = this.getCSSName("transform");
		let sPreCss = ele.style[sTF];
		let nPreX = +sPreCss.replace(/translate3d\((-*\d+(?:\.\d+)*)(px)*\,.+\)/g , "$1");
		return nPreX;

	}

	getCSSTransitionEnd() {

		let sTS = this.getCSSName('transition');
		let sTSE = (sTS === "webkitTransition") ? "webkitTransitionEnd" : "transitionend";
		return sTSE;

	}

	//check null or undefined
	isExist(data) {
		return data != null;
	}

}