var _cu = {
	
	// __proto__
	//__proto__: theProtoObj,

	getFnName(fn){
	    if(typeof fn !== "function") return;
	    var sName = (fn.name) ? fn.name : fn.toString().match(/function\s+([^(\(|\s)]+)/)[1];
	    return sName;
	},

	// animation by rAF
	// super.runAnimation(nWidthForAnimation, this.option.nDuration, {
	// 			'before' : fnBefore,
	// 			'after' : this.fnAfter
	// });

	sendSimpleAjax(url, fnCallback, sData, method, aHeaders, sQuery) {
		let xhr = new XMLHttpRequest();
		xhr.open(method, url);

		if(aHeaders && this.isArray(aHeaders)) {
			aHeaders.forEach( (v) => {
				xhr.setRequestHeader(v[0], v[1]);
			});
		}

		xhr.addEventListener("load", function() {
			if (xhr.status === 200) {
				var sResult = JSON.parse(xhr.responseText);
				if(fnCallback && typeof fnCallback === 'function') fnCallback.call(this, sResult);
			}
		}.bind(this));
		xhr.send(sData);
	},

	sendSimpleJSONP(sURL, query, sCompletionName, fnCallback) {

		window[sCompletionName] = null;
		let encodedQuery = encodeURIComponent(query);

		var elScript = document.createElement('script');
		elScript.setAttribute('src', sURL + 'method=' + sCompletionName + '&q=' + encodedQuery);
		document.getElementsByTagName('head')[0].appendChild(elScript);

		elScript.onload= function(evt) {
			let result = window[sCompletionName];
			if(fnCallback && typeof fnCallback === 'function') fnCallback(result);
			document.getElementsByTagName('head')[0].removeChild(this);
			window[sCompletionName] = null;
		}
	},

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
	},

	setTranslate3dX(ele, nValue) {

		let sTF = this.getCSSName('transform');
		this.elTarget.style[sTF] = 'translate3d(' + (nValue) + 'px, 0, 0)';

	},

	getWidth(ele) {
		let nWidth = 0;
		if (ele.getBoundingClientRect().width) {
 			nWidth = ele.getBoundingClientRect().width;
		} else {
		  	nWidth = ele.offsetWidth;
		}

		return nWidth
	},

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
	},

	getTranslate3dX(ele) {
		let sTF = this.getCSSName("transform");
		let sPreCss = ele.style[sTF];
		let nPreX = +sPreCss.replace(/translate3d\((-*\d+(?:\.\d+)*)(px)*\,.+\)/g , "$1");
		return nPreX;
	},

	getCSSTransitionEnd() {
		let sTS = this.getCSSName('transition');
		let sTSE = (sTS === "webkitTransition") ? "webkitTransitionEnd" : "transitionend";
		return sTSE;
	},

	setCSS(el,style,value) {
		el.style[style] = value;
	},

	showLayer(el) {
		el.style.display = "block";
	},

	closeLayer(el) {
		el.style.display = "none";
	},

	//check null or undefined
	isExist(data){
		return data != null;
	},

	isArray(_a) {
		if (!Array.isArray) {
			return Object.prototype.toString.call(_a) === '[object Array]';
		}
		return Array.isArray(_a);
	}
}