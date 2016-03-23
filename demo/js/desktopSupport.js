 (function (doc) {

        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) return;

        var _u = {
            on : function(el,eType, handler) {
                doc.querySelector(el).addEventListener(eType, handler);
            }
        }

        var _h = {
            toggleSelectedBG : function(evt) {
                var _el = evt.target;
                var elCurrentLI = (_el.nodeName === "SPAN") ? _el.parentElement : _el;
                var _oldSelectedLI = elCurrentLI.parentElement.querySelector(".selectedLI");

                if(_oldSelectedLI) _oldSelectedLI.className = "";
                elCurrentLI.className += " selectedLI";
            },
            clearSelectedGB : function(evt) {
                var _oldSelectedLI = this.querySelector(".selectedLI");
                if(_oldSelectedLI) _oldSelectedLI.className = "";
            },
        }

        var _q = {
            recentCloseLayer : ".recent-word-wrap .close-layer",
            autoCloseLayer   : ".auto-complete-wrap .close-layer",
            clearQuery       : ".clear-query",
            inputWrap        : ".input-wrap",
            autoULWrap       : ".auto-complete-wrap .ul-wrap",
            recentULWrap     : ".recent-word-wrap .ul-wrap",
            realForm         : "#search-form",
            clearRecentWordBtn  : ".recent-word-wrap .delete-word"
        }

        // Support Mouse Events.
        _u.on(_q.recentCloseLayer,  "mousedown", function(){
            oSS.htPluginInstance["RecentWordPlugin"].handlerCloseLayer();
        });

        _u.on(_q.autoCloseLayer,    "mousedown", oSS.handlerCloseLayer.bind(oSS));
        _u.on(_q.clearQuery ,       "mousedown", oSS.handlerClearInputValue.bind(oSS));
        _u.on(_q.inputWrap,         "mousedown", oSS.handlerInputWrap.bind(oSS));

        //change selected LI 
        _u.on(_q.autoULWrap ,       "mouseover", _h.toggleSelectedBG);
        _u.on(_q.recentULWrap,      "mouseover", _h.toggleSelectedBG);
     
        //rollback backgroundColor when mouseover.
        _u.on(_q.autoULWrap,        "mouseout", _h.clearSelectedGB);
        _u.on(_q.recentULWrap,      "mouseout", _h.clearSelectedGB);

        _u.on(_q.autoULWrap,        "mouseup", function(evt) {
            var sQueryText = oSS.htUserFn['FN_AFTER_SELECT_AUTO_WORD'](evt.target);
            oSS.runCustomFn("PLUGIN", "FN_AFTER_SUBMIT", sQueryText);

        });

        _u.on(_q.recentULWrap,      "mouseup", function(evt) {
            oSS.htPluginInstance["RecentWordPlugin"].htUserFn['FN_AFTER_SELECT_RECENT_WORD'](evt.target);
        });

        _u.on(_q.clearRecentWordBtn,"mousedown", function(evt) {
            oSS.htPluginInstance["RecentWordPlugin"].handlerClearRecentWord(evt);
        });


    })(document); 