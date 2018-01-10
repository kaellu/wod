// ==UserScript==
// @name         Accept Duel
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto accept ALL duels so that you won't click them one by one!
// @author       Kael Lu
// @include		 http*://*.world-of-dungeons.*/wod/spiel/tournament/*duell.php*
// @require      https://github.com/kaellu/wod/raw/master/jquery-3.2.1.min.js
// @updateURL		  https://github.com/kaellu/wod/raw/master/acceptduel.user.js
// @downloadURL		https://github.com/kaellu/wod/raw/master/acceptduel.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function GetLocalContents(Contents) {
        function GetLanguageId() {
            var langText = null;
            var allMetas = document.getElementsByTagName("meta");
            for (var i = 0; i < allMetas.length; ++i) {
                if (allMetas[i].httpEquiv == "Content-Language") {
                    langText = allMetas[i].content;
                    break;
                }
            }
            if (langText === null)
                return false;

            switch (langText) {
                case "en":
                    return 0;
                case "cn":
                    return 1;
                default:
                    return null;
            }
        }

        var nLangId = GetLanguageId();
        if (nLangId === null)
            return null;

        if (Contents instanceof Object) {
            for (var name in Contents)
                Contents[name] = Contents[name][nLangId];
            return Contents;
        } else
            return null;
    }

    function InsertButton(Node, Value, OnClick) {
        var newButton = document.createElement("input");
        newButton.setAttribute("type", "button");
        newButton.setAttribute("class", "button");
        newButton.setAttribute("value", Value);
        newButton.addEventListener("click", OnClick, false);
        Node.parentNode.insertBefore(newButton, Node.nextSibling);
    }

    function GetDuelPage(href)
    {
        var XmlHttp = new XMLHttpRequest();

        XmlHttp.onreadystatechange = function() {
            try {
                if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
                    alert(XmlHttp.responseText);
                    //gResponseDiv.innerHTML = XmlHttp.responseText;
                    //ReadDuelPage();
                }
            } catch (e) {
                alert("GetDuelPage XMLHttpRequest.onreadystatechange(): " + e);
            }
        };

        XmlHttp.open("GET", href, true);
        XmlHttp.send(null);
    }

    function acceptDuel(){
        //if(!prepareDone) return;

        //$("form[name='the_form']").attr('target', '_blank');
        var j = 5;
        var duellist = document.getElementsByTagName("input");
        for (var i = 0; i < duellist.length; i++) {
            var duelButton = duellist[i];
            if(duelButton.getAttribute("type") == "submit" && duelButton.getAttribute("class") == "button clickable" && (duelButton.getAttribute("value") == "开始"||duelButton.getAttribute("value") == "接受")){
                //console.log(duelButton.getAttribute("name")+"开始！");
                //var posStart = duelButton.getAttribute("name").indexOf("[");
                //var posEnd = duelButton.getAttribute("name").indexOf("]");
                //var duelID = duelButton.getAttribute("name").substring(posStart+1,posEnd);
                //var duelURL = document.location.href +"&DuellId="+duelID;

                setTimeout(duelButton.click(),1000);
            }
        }

        console.log("done!");
    }




    function rejectDuel(){
        if(!prepareDone) return;

        //alert("action:reject");

    }

    var rContents = {
        Text_Button_AcceptAll: ["Accept All",
                                "全部接受/开始"
                               ],
        Text_Button_DenyAll: ["Deny All",
                              "全部拒绝"
                             ]

    };
    var gIndexTemplateDiv;
    var gResponseDiv;
    var prepareDone = false;

    try {
        var rLocal = GetLocalContents(rContents);
        if (rLocal === null) return;
        var allH1 = document.getElementsByTagName("h1");
        var allButton = document.getElementsByTagName("input");
        var i = 0;
        var h1;
        var continueFlag = false;
        if (allH1 === 'undefined') return;
        if (allButton === 'undefined') return;
        /*for (i = 0; i < allH1.length; ++i) {
            h1 = allH1[i];
            if (h1.innerHTML == "您的决斗") {
                //alert("duel list page!");
                InsertButton(h1, rLocal.Text_Button_AcceptAll, acceptDuel);
                InsertButton(h1, rLocal.Text_Button_DenyAll, rejectDuel);
                continueFlag = true;
                break;
            }
        }
*/
        acceptDuel();

        //if(!continueFlag) return;
        //prepareDone = true;
    } catch (e) {
        alert("Main(): " + e);
    }
})();