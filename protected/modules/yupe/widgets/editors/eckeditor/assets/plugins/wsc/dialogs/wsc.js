﻿/*
 Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */
var ManagerPostMessage = function () {
    return{init: function (b) {
        document.addEventListener ? window.addEventListener("message", b, !1) : window.attachEvent("onmessage", b)
    }, send: function (b) {
        var g = Object.prototype.toString;
        fn = b.fn || null;
        id = b.id || "";
        target = b.target || window;
        message = b.message || {id: id};
        "[object Object]" == g.call(b.message) && (b.message.id || (b.message.id = id), message = b.message);
        b = JSON.stringify(message, fn);
        target.postMessage(b, "*")
    }}
}, tools = {hash: {create: function (b, g) {
    return JSON.stringify(b, g || null)
},
    parse: function (b, g) {
        return JSON.parse(b, g || null)
    }}, filter4html: function (b) {
    return b.replace(/"/g, "&quot;").replace(/'/g, "&#146;")
}, setCookie: function (b, g, d) {
    var d = d || {}, e = d.expires;
    if ("number" == typeof e && e) {
        var f = new Date;
        f.setTime(f.getTime() + 1E3 * e);
        e = d.expires = f
    }
    e && e.toUTCString && (d.expires = e.toUTCString());
    var g = encodeURIComponent(g), b = b + "=" + g, j;
    for (j in d)b += "; " + j, g = d[j], !0 !== g && (b += "=" + g);
    document.cookie = b
}, getCookie: function (b) {
    return(b = document.cookie.match(RegExp("(?:^|; )" + b.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,
        "\\$1") + "=([^;]*)"))) ? decodeURIComponent(b[1]) : void 0
}, deleteCookie: function (b) {
    setCookie(b, "", {expires: -1})
}}, optionsDataObject = {}, NS = {}, nameNode = null;
NS.targetFromFrame = {};
NS.wsc_customerId = CKEDITOR.config.wsc_customerId;
NS.cust_dic_ids = CKEDITOR.config.wsc_customDictionaryIds;
NS.userDictionaryName = CKEDITOR.config.wsc_userDictionaryName;
NS.defaultLanguage = CKEDITOR.config.defaultLanguage;
NS.LocalizationComing = {};
function OptionsConfirm(b) {
    b && nameNode.setValue("")
}
CKEDITOR.dialog.add("checkspell", function (b) {
    function g(a) {
        if (!a)throw"Languages-by-groups list are required for construct selectbox";
        var c = [], h = "", b;
        for (b in a)for (var e in a[b]) {
            var d = a[b][e];
            "en_US" == d ? h = d : c.push(d)
        }
        c.sort();
        h && c.unshift(h);
        return{getCurrentLangGroup: function (c) {
            a:{
                for (var h in a)for (var b in a[h])if (b.toUpperCase() === c.toUpperCase()) {
                    c = h;
                    break a
                }
                c = ""
            }
            return c
        }, setLangList: function () {
            var c = {}, h;
            for (h in a)for (var b in a[h])c[a[h][b]] = b;
            return c
        }()}
    }

    CKEDITOR.on("dialogDefinition",
        function (a) {
            a.data.definition.dialog.on("cancel", function () {
                return!1
            }, this, null, -1)
        });
    NS.CKNumber = CKEDITOR.tools.getNextNumber();
    NS.iframeNumber = "cke_frame_" + NS.CKNumber;
    NS.TextAreaNumber = "cke_textarea_" + NS.CKNumber;
    NS.pluginPath = CKEDITOR.getUrl(b.plugins.wsc.path);
    NS.logotype = DefaultParams.logoPath;
    NS.templatePath = NS.pluginPath + "dialogs/tmp.html";
    NS.div_overlay_no_check = null;
    NS.loadIcon = DefaultParams.iconPath;
    NS.loadIconEmptyEditor = DefaultParams.iconPathEmptyEditor;
    NS.LangComparer = new _SP_FCK_LangCompare;
    NS.LangComparer.setDefaulLangCode(NS.defaultLanguage);
    NS.currentLang = b.config.wsc_lang || NS.LangComparer.getSPLangCode(b.langCode);
    NS.LocalizationButton = {ChangeTo: {instance: null, text: "Change to"}, ChangeAll: {instance: null, text: "Change All"}, IgnoreWord: {instance: null, text: "Ignore word"}, IgnoreAllWords: {instance: null, text: "Ignore all words"}, Options: {instance: null, text: "Options", optionsDialog: {instance: null}}, AddWord: {instance: null, text: "Add word"}, FinishChecking: {instance: null, text: "Finish Checking"}};
    NS.LocalizationLabel = {ChangeTo: {instance: null, text: "Change to"}, Suggestions: {instance: null, text: "Suggestions"}};
    var d = function (a) {
        for (var c in a)a[c].instance.getElement().setText(NS.LocalizationComing[c])
    }, e = function (a) {
        for (var c in a) {
            if (!a[c].instance.setLabel)break;
            a[c].instance.setLabel(NS.LocalizationComing[c])
        }
    };
    NS.load = !0;
    NS.cmd = {SpellTab: "spell", Thesaurus: "thes", GrammTab: "grammar"};
    NS.dialog = null;
    NS.optionNode = null;
    NS.selectNode = null;
    NS.grammerSuggest = null;
    NS.textNode = {};
    NS.iframeMain = null;
    NS.dataTemp = "";
    NS.div_overlay = null;
    NS.textNodeInfo = {};
    NS.selectNode = {};
    NS.selectNodeResponce = {};
    NS.selectingLang = NS.currentLang;
    NS.langList = null;
    NS.serverLocationHash = DefaultParams.serviceHost;
    NS.serverLocation = "#server=" + NS.serverLocationHash;
    NS.langSelectbox = null;
    NS.banner = "";
    var f = null;
    iframeOnload = !1;
    NS.framesetHtml = function (a) {
        return'<iframe src="' + NS.templatePath + NS.serverLocation + '" id=' + NS.iframeNumber + "_" + a + ' frameborder="0" allowtransparency="1" style="width:100%;border: 1px solid #AEB3B9;overflow: auto;background:#fff; border-radius: 3px;"></iframe>'
    };
    NS.setIframe = function (a, c) {
        var h = NS.framesetHtml(c);
        return a.getElement().setHtml(h)
    };
    NS.setCurrentIframe = function (a) {
        NS.setIframe(NS.dialog._.contents[a].Content, a)
    };
    NS.sendData = function () {
        var a = NS.dialog._.currentTabId, c = NS.dialog._.contents[a].Content, h, b;
        NS.setIframe(c, a);
        NS.dialog.parts.tabs.removeAllListeners();
        NS.dialog.parts.tabs.on("click", function (e) {
            e = e || window.event;
            e.data.getTarget().is("a") && a != NS.dialog._.currentTabId && (a = NS.dialog._.currentTabId, c = NS.dialog._.contents[a].Content, h =
                NS.iframeNumber + "_" + a, 0 == c.getElement().$.children.length ? (NS.setIframe(c, a), b = document.getElementById(h), NS.targetFromFrame[h] = b.contentWindow) : o(NS.targetFromFrame[h], NS.cmd[a]))
        })
    };
    NS.buildOptionSynonyms = function (a) {
        a = NS.selectNodeResponce[a];
        NS.selectNode.synonyms.clear();
        for (var c = 0; c < a.length; c++)NS.selectNode.synonyms.add(a[c], a[c]);
        NS.selectNode.synonyms.getInputElement().$.firstChild.selected = !0;
        NS.textNode.Thesaurus.setValue(NS.selectNode.synonyms.getInputElement().getValue())
    };
    NS.buildSelectLang =
        function () {
            var a = new CKEDITOR.dom.element("div"), c = new CKEDITOR.dom.element("select"), b = "wscLang" + NS.CKNumber;
            a.addClass("cke_dialog_ui_input_select");
            a.setAttribute("role", "presentation");
            a.setStyles({height: "auto", position: "absolute", right: "0", top: "-1px", width: "160px", "white-space": "normal"});
            c.setAttribute("id", b);
            c.addClass("cke_dialog_ui_input_select");
            c.setStyles({width: "160px"});
            a.append(c);
            return a
        };
    NS.buildOptionLang = function (a) {
        var c = document.getElementById("wscLang" + NS.CKNumber), b, e;
        if (0 ===
            c.options.length)for (var d in a)b = document.createElement("option"), b.setAttribute("value", a[d]), e = document.createTextNode(d), b.appendChild(e), a[d] == NS.selectingLang && (b.selected = !0), c.appendChild(b);
        for (a = 0; a < c.options.length; a++)c.options[a].value == NS.selectingLang && (c.options[a].selected = !0)
    };
    var j = function (a) {
            var c = document, b = a.target || c.body, e = a.id || "overlayBlock", d = a.opacity || "0.9", a = a.background || "#f1f1f1", g = c.getElementById(e), f = g || c.createElement("div");
            f.style.cssText = "position: absolute;top:30px;bottom:40px;left:1px;right:1px;z-index: 10020;padding:0;margin:0;background:" +
                a + ";opacity: " + d + ";filter: alpha(opacity=" + 100 * d + ");display: none;";
            f.id = e;
            g || b.appendChild(f);
            return{setDisable: function () {
                f.style.display = "none"
            }, setEnable: function () {
                f.style.display = "block"
            }}
        }, k = function (a, c, b) {
            var e = new CKEDITOR.dom.element("div"), d = new CKEDITOR.dom.element("input"), f = new CKEDITOR.dom.element("label"), g = "wscGrammerSuggest" + a + "_" + c;
            e.addClass("cke_dialog_ui_input_radio");
            e.setAttribute("role", "presentation");
            e.setStyles({width: "97%", padding: "5px", "white-space": "normal"});
            d.setAttributes({type: "radio",
                value: c, name: "wscGrammerSuggest", id: g});
            d.setStyles({"float": "left"});
            d.on("click", function (a) {
                NS.textNode.GrammTab.setValue(a.sender.getValue())
            });
            b && d.setAttribute("checked", !0);
            d.addClass("cke_dialog_ui_radio_input");
            f.appendText(a);
            f.setAttribute("for", g);
            f.setStyles({display: "block", "line-height": "16px", "margin-left": "18px", "white-space": "normal"});
            e.append(d);
            e.append(f);
            return e
        }, m = function (a) {
            var c = new g(a), a = document.getElementById("wscLang" + NS.CKNumber), b = NS.iframeNumber + "_" + NS.dialog._.currentTabId;
            NS.buildOptionLang(c.setLangList);
            a.onchange = function () {
                q[c.getCurrentLangGroup(this.value)]();
                NS.div_overlay.setEnable();
                NS.selectingLang = this.value;
                f.send({message: {changeLang: NS.selectingLang, text: NS.dataTemp}, target: NS.targetFromFrame[b], id: "selectionLang_outer__page"})
            }
        }, r = function (a) {
            if ("no_any_suggestions" == a) {
                a = "No suggestions";
                NS.LocalizationButton.ChangeTo.instance.disable();
                NS.LocalizationButton.ChangeAll.instance.disable();
                var c = function (a) {
                    a = NS.LocalizationButton[a].instance;
                    a.getElement().hasClass("cke_disabled") ?
                        a.getElement().setStyle("color", "#a0a0a0") : a.disable()
                };
                c("ChangeTo");
                c("ChangeAll")
            } else NS.LocalizationButton.ChangeTo.instance.enable(), NS.LocalizationButton.ChangeAll.instance.enable(), NS.LocalizationButton.ChangeTo.instance.getElement().setStyle("color", "#333"), NS.LocalizationButton.ChangeAll.instance.getElement().setStyle("color", "#333");
            return a
        }, s = {iframeOnload: function () {
            NS.div_overlay.setEnable();
            iframeOnload = !0;
            var a = NS.dialog._.currentTabId;
            o(NS.targetFromFrame[NS.iframeNumber + "_" + a],
                NS.cmd[a])
        }, suggestlist: function (a) {
            delete a.id;
            NS.div_overlay_no_check.setDisable();
            n();
            m(NS.langList);
            var c = r(a.word), b = "";
            c instanceof Array && (c = a.word[0]);
            b = c = c.split(",");
            selectNode.clear();
            NS.textNode.SpellTab.setValue(b[0]);
            for (a = 0; a < b.length; a++)selectNode.add(b[a], b[a]);
            l();
            NS.div_overlay.setDisable()
        }, grammerSuggest: function (a) {
            delete a.id;
            delete a.mocklangs;
            n();
            var c = a.grammSuggest[0];
            NS.grammerSuggest.getElement().setHtml("");
            NS.textNode.GrammTab.reset();
            NS.textNode.GrammTab.setValue(c);
            NS.textNodeInfo.GrammTab.getElement().setHtml("");
            NS.textNodeInfo.GrammTab.getElement().setText(a.info);
            for (var a = a.grammSuggest, c = a.length, b = !0, e = 0; e < c; e++)NS.grammerSuggest.getElement().append(k(a[e], a[e], b)), b = !1;
            l();
            NS.div_overlay.setDisable()
        }, thesaurusSuggest: function (a) {
            delete a.id;
            delete a.mocklangs;
            n();
            NS.selectNodeResponce = a;
            NS.textNode.Thesaurus.reset();
            NS.selectNode.categories.clear();
            for (var c in a)NS.selectNode.categories.add(c, c);
            a = NS.selectNode.categories.getInputElement().getChildren().$[0].value;
            NS.selectNode.categories.getInputElement().getChildren().$[0].selected = !0;
            NS.buildOptionSynonyms(a);
            l();
            NS.div_overlay.setDisable()
        }, finish: function (a) {
            delete a.id;
            NS.dialog.getContentElement(NS.dialog._.currentTabId, "bottomGroup").getElement().hide();
            NS.dialog.getContentElement(NS.dialog._.currentTabId, "BlockFinishChecking").getElement().show();
            NS.div_overlay.setDisable()
        }, settext: function (a) {
            delete a.id;
            NS.dialog.getParentEditor().focus();
            NS.dialog.getParentEditor().setData(a.text, NS.dialog.hide())
        },
            ReplaceText: function (a) {
                delete a.id;
                NS.div_overlay.setEnable();
                NS.dataTemp = a.text;
                NS.selectingLang = a.currentLang;
                window.setTimeout(function () {
                    NS.div_overlay.setDisable()
                }, 500);
                d(NS.LocalizationButton);
                e(NS.LocalizationLabel)
            }, options_checkbox_send: function (a) {
                delete a.id;
                a = {osp: tools.getCookie("osp"), udn: tools.getCookie("udn"), cust_dic_ids: NS.cust_dic_ids};
                f.send({message: a, target: NS.targetFromFrame[NS.iframeNumber + "_" + NS.dialog._.currentTabId], id: "options_outer__page"})
            }, getOptions: function (a) {
                var c =
                    a.DefOptions.udn;
                NS.LocalizationComing = a.DefOptions.localizationButtonsAndText;
                NS.langList = a.lang;
                var b = a.banner;
                NS.dialog.getContentElement(NS.dialog._.currentTabId, "banner").getElement().setHtml(b);
                "undefined" == c && (NS.userDictionaryName ? (c = NS.userDictionaryName, b = {osp: tools.getCookie("osp"), udn: NS.userDictionaryName, cust_dic_ids: NS.cust_dic_ids, id: "options_dic_send", udnCmd: "create"}, f.send({message: b, target: NS.targetFromFrame[frameId]})) : c = "");
                tools.setCookie("osp", a.DefOptions.osp);
                tools.setCookie("udn",
                    c);
                tools.setCookie("cust_dic_ids", a.DefOptions.cust_dic_ids);
                f.send({id: "giveOptions"})
            }, options_dic_send: function () {
                var a = {osp: tools.getCookie("osp"), udn: tools.getCookie("udn"), cust_dic_ids: NS.cust_dic_ids, id: "options_dic_send", udnCmd: tools.getCookie("udnCmd")};
                f.send({message: a, target: NS.targetFromFrame[NS.iframeNumber + "_" + NS.dialog._.currentTabId]})
            }, data: function (a) {
                delete a.id
            }, giveOptions: function () {
            }, setOptionsConfirmF: function () {
                OptionsConfirm(!1)
            }, setOptionsConfirmT: function () {
                OptionsConfirm(!0)
            },
            clickBusy: function () {
                NS.div_overlay.setEnable()
            }, suggestAllCame: function () {
                NS.div_overlay.setDisable();
                NS.div_overlay_no_check.setDisable()
            }, TextCorrect: function () {
                m(NS.langList)
            }}, t = function (a) {
            a = a || window.event;
            a = JSON.parse(a.data);
            s[a.id](a)
        }, i = function () {
            NS.div_overlay.setEnable();
            var a = NS.dialog._.currentTabId, b = NS.iframeNumber + "_" + a, e = NS.textNode[a].getValue();
            f.send({message: {cmd: this.getElement().getAttribute("title-cmd"), tabId: a, new_word: e}, target: NS.targetFromFrame[b], id: "cmd_outer__page"})
        },
        o = function (a, b, e, d) {
            b = b || CKEDITOR.config.wsc_cmd || "spell";
            e = e || NS.dataTemp;
            f.send({message: {customerId: NS.wsc_customerId, text: e, txt_ctrl: NS.TextAreaNumber, cmd: b, cust_dic_ids: NS.cust_dic_ids, udn: NS.userDictionaryName, slang: NS.selectingLang, reset_suggest: d || !1}, target: a, id: "data_outer__page"});
            NS.div_overlay.setEnable()
        }, q = {superset: function () {
            NS.dialog.showPage("Thesaurus");
            NS.dialog.showPage("GrammTab");
            NS.dialog.showPage("SpellTab")
        }, usual: function () {
            NS.dialog.hidePage("Thesaurus");
            NS.dialog.hidePage("GrammTab");
            NS.dialog.showPage("SpellTab")
        }}, p = function () {
            var a = new function (a) {
                var b = {};
                return{getCmdByTab: function (e) {
                    for (var d in a)b[a[d]] = d;
                    return b[e]
                }}
            }(NS.cmd);
            NS.dialog.selectPage(a.getCmdByTab(CKEDITOR.config.wsc_cmd));
            NS.sendData()
        }, l = function () {
            NS.dialog.getContentElement(NS.dialog._.currentTabId, "bottomGroup").getElement().show()
        }, n = function () {
            NS.dialog.getContentElement(NS.dialog._.currentTabId, "BlockFinishChecking").getElement().hide()
        };
    return{title: b.config.wsc_dialogTitle || b.lang.wsc.title, minWidth: 560,
        minHeight: 350, resizable: CKEDITOR.DIALOG_RESIZE_NONE, buttons: [CKEDITOR.dialog.cancelButton], onLoad: function () {
            f = new ManagerPostMessage;
            NS.dialog = this;
            p();
            NS.dataTemp = NS.dialog.getParentEditor().getData();
            f.init(t);
            NS.div_overlay = new j({opacity: "0.95", background: "#fff url(" + NS.loadIcon + ") no-repeat 50% 50%", target: this.parts.tabs.getParent().$});
            NS.div_overlay_no_check = new j({opacity: "1", id: "no_check_over", background: "#fff url(" + NS.loadIconEmptyEditor + ") no-repeat 50% 50%", target: this.parts.tabs.getParent().$});
            var a = CKEDITOR.document.getById("cke_dialog_tabs_" + (NS.CKNumber + 1));
            a.setStyle("width", "97%");
            a.append(NS.buildSelectLang())
        }, onShow: function () {
            NS.div_overlay.setDisable();
            p();
            "" == NS.dialog.getParentEditor().getData() && NS.div_overlay_no_check.setEnable()
        }, onHide: function () {
            NS.dataTemp = null
        }, contents: [
            {id: "SpellTab", label: "SpellChecker", accessKey: "S", elements: [
                {type: "html", id: "banner", label: "banner", html: "<div></div>"},
                {type: "html", id: "Content", label: "spellContent", html: "", onLoad: function () {
                    var a =
                        NS.iframeNumber + "_" + NS.dialog._.currentTabId, b = document.getElementById(a);
                    NS.targetFromFrame[a] = b.contentWindow
                }, onShow: function () {
                    NS.dataTemp = NS.dialog.getParentEditor().getData();
                    NS.div_overlay.setEnable()
                }},
                {type: "hbox", id: "bottomGroup", widths: ["50%", "50%"], children: [
                    {type: "hbox", id: "leftCol", align: "left", width: "50%", children: [
                        {type: "vbox", id: "rightCol1", widths: ["50%", "50%"], children: [
                            {type: "text", id: "text", label: NS.LocalizationLabel.ChangeTo.text + ":", labelLayout: "horizontal", labelStyle: "font: 12px/25px arial, sans-serif;",
                                width: "140px", "default": "", onLoad: function () {
                                NS.textNode.SpellTab = this;
                                NS.LocalizationLabel.ChangeTo.instance = this
                            }, onHide: function () {
                                this.reset()
                            }},
                            {type: "hbox", id: "rightCol", align: "right", width: "30%", children: [
                                {type: "vbox", id: "rightCol_col__left", children: [
                                    {type: "text", id: "labelSuggestions", label: NS.LocalizationLabel.Suggestions.text + ":", onLoad: function () {
                                        NS.LocalizationLabel.Suggestions.instance = this;
                                        this.getInputElement().hide()
                                    }},
                                    {type: "html", id: "logo", html: '<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">',
                                        onShow: function () {
                                            this.getElement().$.src = NS.logotype;
                                            this.getElement().getParent().setStyles({"text-align": "left"})
                                        }}
                                ]},
                                {type: "select", id: "list_of_suggestions", labelStyle: "font: 12px/25px arial, sans-serif;", size: "6", inputStyle: "width: 140px; height: auto;", items: [
                                    ["loading..."]
                                ], onShow: function () {
                                    selectNode = this
                                }, onHide: function () {
                                    this.clear()
                                }, onChange: function () {
                                    NS.textNode.SpellTab.setValue(this.getValue())
                                }}
                            ]}
                        ]}
                    ]},
                    {type: "hbox", id: "rightCol", align: "right", width: "50%", children: [
                        {type: "vbox", id: "rightCol_col__left",
                            widths: ["50%", "50%", "50%", "50%"], children: [
                            {type: "button", id: "ChangeTo", label: NS.LocalizationButton.ChangeTo.text, title: "Change to", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id);
                                NS.LocalizationButton.ChangeTo.instance = this
                            }, onClick: i},
                            {type: "button", id: "ChangeAll", label: NS.LocalizationButton.ChangeAll.text, title: "Change All", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id);
                                NS.LocalizationButton.ChangeAll.instance =
                                    this
                            }, onClick: i},
                            {type: "button", id: "AddWord", label: NS.LocalizationButton.AddWord.text, title: "Add word", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id);
                                NS.LocalizationButton.AddWord.instance = this
                            }, onClick: i},
                            {type: "button", id: "FinishChecking", label: NS.LocalizationButton.FinishChecking.text, title: "Finish Checking", style: "width: 100%;margin-top: 9px;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id);
                                NS.LocalizationButton.FinishChecking.instance =
                                    this
                            }, onClick: i}
                        ]},
                        {type: "vbox", id: "rightCol_col__right", widths: ["50%", "50%", "50%"], children: [
                            {type: "button", id: "IgnoreWord", label: NS.LocalizationButton.IgnoreWord.text, title: "Ignore word", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id);
                                NS.LocalizationButton.IgnoreWord.instance = this
                            }, onClick: i},
                            {type: "button", id: "IgnoreAllWords", label: NS.LocalizationButton.IgnoreAllWords.text, title: "Ignore all words", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd",
                                    this.id);
                                NS.LocalizationButton.IgnoreAllWords.instance = this
                            }, onClick: i},
                            {type: "button", id: "option", label: NS.LocalizationButton.Options.text, title: "Option", style: "width: 100%;", onLoad: function () {
                                NS.LocalizationButton.Options.instance = this
                            }, onClick: function () {
                                b.openDialog("options")
                            }}
                        ]}
                    ]}
                ]},
                {type: "hbox", id: "BlockFinishChecking", widths: ["70%", "30%"], onShow: function () {
                    this.getElement().hide()
                }, onHide: l, children: [
                    {type: "hbox", id: "leftCol", align: "left", width: "70%", children: [
                        {type: "vbox", id: "rightCol1",
                            children: [
                                {type: "html", id: "logo", html: '<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">', onShow: function () {
                                    this.getElement().$.src = NS.logotype;
                                    this.getElement().getParent().setStyles({"text-align": "center"})
                                }}
                            ]}
                    ]},
                    {type: "hbox", id: "rightCol", align: "right", width: "30%", children: [
                        {type: "vbox", id: "rightCol_col__left", children: [
                            {type: "button", id: "Option_button", label: NS.LocalizationButton.Options.text, title: "Option", style: "width: 100%;",
                                onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onClick: function () {
                                b.openDialog("options")
                            }},
                            {type: "button", id: "FinishChecking", label: NS.LocalizationButton.FinishChecking.text, title: "Finish Checking", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id)
                            }, onClick: i}
                        ]}
                    ]}
                ]}
            ]},
            {id: "GrammTab", label: "Grammar", accessKey: "G", elements: [
                {type: "html", id: "banner", label: "banner", html: "<div></div>"},
                {type: "html", id: "Content", label: "GrammarContent", html: "",
                    onShow: function () {
                        var a = NS.iframeNumber + "_" + NS.dialog._.currentTabId, b = document.getElementById(a);
                        NS.targetFromFrame[a] = b.contentWindow
                    }},
                {type: "vbox", id: "bottomGroup", children: [
                    {type: "hbox", id: "leftCol", widths: ["66%", "34%"], children: [
                        {type: "vbox", children: [
                            {type: "text", id: "text", label: "Change to:", labelLayout: "horizontal", labelStyle: "font: 12px/25px arial, sans-serif; float: right;margin-right: 80px;", inputStyle: "", width: "200px", "default": "", onLoad: function () {
                                NS.textNode.GrammTab = this
                            }, onHide: function () {
                                this.reset()
                            }},
                            {type: "html", id: "html_text", html: "<div style='min-height: 17px; width: 330px; line-height: 17px; padding: 5px; text-align: left;background: #F1F1F1;color: #595959; white-space: normal!important;'></div>", onLoad: function () {
                                NS.textNodeInfo.GrammTab = this
                            }},
                            {type: "html", id: "radio", html: "", onLoad: function () {
                                NS.grammerSuggest = this
                            }}
                        ]},
                        {type: "vbox", children: [
                            {type: "button", id: "ChangeTo", label: "Change to", title: "Change to", style: "width: 133px; float: right;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd",
                                    this.id)
                            }, onClick: i},
                            {type: "button", id: "IgnoreWord", label: "Ignore word", title: "Ignore word", style: "width: 133px; float: right;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id)
                            }, onClick: i},
                            {type: "button", id: "IgnoreAllWords", label: "Ignore Problem", title: "Ignore Problem", style: "width: 133px; float: right;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id)
                            }, onClick: i},
                            {type: "button", id: "FinishChecking", label: "Finish Checking", title: "Finish Checking", style: "width: 133px; float: right; margin-top: 9px;",
                                onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onClick: i}
                        ]}
                    ]}
                ]},
                {type: "hbox", id: "BlockFinishChecking", widths: ["70%", "30%"], onShow: function () {
                    this.getElement().hide()
                }, onHide: l, children: [
                    {type: "hbox", id: "leftCol", align: "left", width: "70%", children: [
                        {type: "vbox", id: "rightCol1", children: [
                            {type: "html", id: "logo", html: '<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">', onShow: function () {
                                this.getElement().$.src =
                                    NS.logotype;
                                this.getElement().getParent().setStyles({"text-align": "center"})
                            }}
                        ]}
                    ]},
                    {type: "hbox", id: "rightCol", align: "right", width: "30%", children: [
                        {type: "vbox", id: "rightCol_col__left", children: [
                            {type: "button", id: "FinishChecking", label: "Finish Checking", title: "Finish Checking", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id)
                            }, onClick: i}
                        ]}
                    ]}
                ]}
            ]},
            {id: "Thesaurus", label: "Thesaurus", accessKey: "T", elements: [
                {type: "html", id: "banner", label: "banner", html: "<div></div>"},
                {type: "html", id: "Content", label: "spellContent", html: "", onShow: function () {
                    var a = NS.iframeNumber + "_" + NS.dialog._.currentTabId, b = document.getElementById(a);
                    NS.targetFromFrame[a] = b.contentWindow
                }},
                {type: "vbox", id: "bottomGroup", children: [
                    {type: "hbox", widths: ["75%", "25%"], children: [
                        {type: "vbox", children: [
                            {type: "hbox", widths: ["65%", "35%"], children: [
                                {type: "text", id: "ChangeTo", label: "Change to:", labelLayout: "horizontal", inputStyle: "width: 160px;", labelStyle: "font: 12px/25px arial, sans-serif;", "default": "",
                                    onLoad: function () {
                                        NS.textNode.Thesaurus = this
                                    }, onHide: function () {
                                    this.reset()
                                }},
                                {type: "button", id: "ChangeTo", label: "Change to", title: "Change to", style: "width: 121px; margin-top: 1px;", onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onClick: i}
                            ]},
                            {type: "hbox", children: [
                                {type: "select", id: "categories", label: "Categories:", labelStyle: "font: 12px/25px arial, sans-serif;", size: "6", inputStyle: "width: 180px; height: auto;", items: [], onLoad: function () {
                                    NS.selectNode.categories = this
                                }, onHide: function () {
                                    this.clear()
                                },
                                    onChange: function () {
                                        NS.buildOptionSynonyms(this.getValue())
                                    }},
                                {type: "select", id: "synonyms", label: "Synonyms:", labelStyle: "font: 12px/25px arial, sans-serif;", size: "6", inputStyle: "width: 180px; height: auto;", items: [], onLoad: function () {
                                    NS.selectNode.synonyms = this
                                }, onShow: function () {
                                    NS.textNode.Thesaurus.setValue(this.getValue())
                                }, onHide: function () {
                                    this.clear()
                                }, onChange: function () {
                                    NS.textNode.Thesaurus.setValue(this.getValue())
                                }}
                            ]}
                        ]},
                        {type: "vbox", width: "120px", style: "margin-top:46px;", children: [
                            {type: "html",
                                id: "logotype", label: "WebSpellChecker.net", html: '<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">', onShow: function () {
                                this.getElement().$.src = NS.logotype;
                                this.getElement().getParent().setStyles({"text-align": "center"})
                            }},
                            {type: "button", id: "FinishChecking", label: "Finish Checking", title: "Finish Checking", style: "width: 121px; float: right; margin-top: 9px;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id)
                            },
                                onClick: i}
                        ]}
                    ]}
                ]},
                {type: "hbox", id: "BlockFinishChecking", widths: ["70%", "30%"], onShow: function () {
                    this.getElement().hide()
                }, onHide: l, children: [
                    {type: "hbox", id: "leftCol", align: "left", width: "70%", children: [
                        {type: "vbox", id: "rightCol1", children: [
                            {type: "html", id: "logo", html: '<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">', onShow: function () {
                                this.getElement().$.src = NS.logotype;
                                this.getElement().getParent().setStyles({"text-align": "center"})
                            }}
                        ]}
                    ]},
                    {type: "hbox", id: "rightCol", align: "right", width: "30%", children: [
                        {type: "vbox", id: "rightCol_col__left", children: [
                            {type: "button", id: "FinishChecking", label: "Finish Checking", title: "Finish Checking", style: "width: 100%;", onLoad: function () {
                                this.getElement().setAttribute("title-cmd", this.id)
                            }, onClick: i}
                        ]}
                    ]}
                ]}
            ]}
        ]}
});
CKEDITOR.dialog.add("options", function () {
    var b = new ManagerPostMessage, g = null, d = {}, e = {}, f = null, j = null;
    tools.getCookie("udn");
    tools.getCookie("osp");
    var k = function () {
        j = this.getElement().getAttribute("title-cmd");
        var d = [];
        d[0] = e.IgnoreAllCapsWords;
        d[1] = e.IgnoreWordsNumbers;
        d[2] = e.IgnoreMixedCaseWords;
        d[3] = e.IgnoreDomainNames;
        d = d.toString().replace(/,/g, "");
        tools.setCookie("osp", d);
        tools.setCookie("udnCmd", j ? j : "ignore");
        "delete" != j && tools.setCookie("udn", "" == nameNode.getValue() ? "" : nameNode.getValue());
        b.send({id: "options_dic_send"})
    }, m = function () {
        f.getElement().setHtml(NS.LocalizationComing.error);
        f.getElement().show()
    };
    return{title: NS.LocalizationComing.Options, minWidth: 430, minHeight: 130, resizable: CKEDITOR.DIALOG_RESIZE_NONE, contents: [
        {id: "OptionsTab", label: "Options", accessKey: "O", elements: [
            {type: "hbox", id: "options_error", children: [
                {type: "html", style: "display: block;text-align: center;white-space: normal!important; font-size: 12px;color:red", html: "<div></div>", onShow: function () {
                    f = this
                }}
            ]},
            {type: "vbox",
                id: "Options_content", children: [
                {type: "hbox", id: "Options_manager", widths: ["52%", "48%"], children: [
                    {type: "fieldset", label: "Spell Checking Options", style: "border: none;margin-top: 13px;padding: 10px 0 10px 10px", onShow: function () {
                        this.getInputElement().$.children[0].innerHTML = NS.LocalizationComing.SpellCheckingOptions
                    }, children: [
                        {type: "vbox", id: "Options_checkbox", children: [
                            {type: "checkbox", id: "IgnoreAllCapsWords", label: "Ignore All-Caps Words", labelStyle: "margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;",
                                style: "float:left; min-height: 16px;", "default": "", onClick: function () {
                                e[this.id] = !1 == this.getValue() ? 0 : 1
                            }},
                            {type: "checkbox", id: "IgnoreWordsNumbers", label: "Ignore Words with Numbers", labelStyle: "margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;", style: "float:left; min-height: 16px;", "default": "", onClick: function () {
                                e[this.id] = !1 == this.getValue() ? 0 : 1
                            }},
                            {type: "checkbox", id: "IgnoreMixedCaseWords", label: "Ignore Mixed-Case Words", labelStyle: "margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;",
                                style: "float:left; min-height: 16px;", "default": "", onClick: function () {
                                e[this.id] = !1 == this.getValue() ? 0 : 1
                            }},
                            {type: "checkbox", id: "IgnoreDomainNames", label: "Ignore Domain Names", labelStyle: "margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;", style: "float:left; min-height: 16px;", "default": "", onClick: function () {
                                e[this.id] = !1 == this.getValue() ? 0 : 1
                            }}
                        ]}
                    ]},
                    {type: "vbox", id: "Options_DictionaryName", children: [
                        {type: "text", id: "DictionaryName", style: "margin-bottom: 10px",
                            label: "Dictionary Name:", labelLayout: "vertical", labelStyle: "font: 12px/25px arial, sans-serif;", "default": "", onLoad: function () {
                            nameNode = this;
                            this.setValue(NS.userDictionaryName ? NS.userDictionaryName : (tools.getCookie("udn"), this.getValue()))
                        }, onShow: function () {
                            nameNode = this;
                            this.setValue(!tools.getCookie("udn") ? this.getValue() : tools.getCookie("udn"));
                            this.setLabel(NS.LocalizationComing.DictionaryName)
                        }, onHide: function () {
                            this.reset()
                        }},
                        {type: "hbox", id: "Options_buttons", children: [
                            {type: "vbox", id: "Options_leftCol_col",
                                widths: ["50%", "50%"], children: [
                                {type: "button", id: "create", label: "Create", title: "Create", style: "width: 100%;", onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onShow: function () {
                                    this.getElement().setText(NS.LocalizationComing.Create)
                                }, onClick: k},
                                {type: "button", id: "restore", label: "Restore", title: "Restore", style: "width: 100%;", onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onShow: function () {
                                    this.getElement().setText(NS.LocalizationComing.Restore)
                                }, onClick: k}
                            ]},
                            {type: "vbox", id: "Options_rightCol_col", widths: ["50%", "50%"], children: [
                                {type: "button", id: "rename", label: "Rename", title: "Rename", style: "width: 100%;", onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onShow: function () {
                                    this.getElement().setText(NS.LocalizationComing.Rename)
                                }, onClick: k},
                                {type: "button", id: "delete", label: "Remove", title: "Remove", style: "width: 100%;", onLoad: function () {
                                    this.getElement().setAttribute("title-cmd", this.id)
                                }, onShow: function () {
                                    this.getElement().setText(NS.LocalizationComing.Remove)
                                },
                                    onClick: k}
                            ]}
                        ]}
                    ]}
                ]},
                {type: "hbox", id: "Options_text", children: [
                    {type: "html", style: "text-align: justify;margin-top: 15px;white-space: normal!important; font-size: 12px;color:#777;", html: "<div>" + NS.LocalizationComing.OptionsTextIntro + "</div>", onShow: function () {
                        this.getElement().setText(NS.LocalizationComing.OptionsTextIntro)
                    }}
                ]}
            ]}
        ]}
    ], buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton], onOk: function () {
        var d = [];
        d[0] = e.IgnoreAllCapsWords;
        d[1] = e.IgnoreWordsNumbers;
        d[2] = e.IgnoreMixedCaseWords;
        d[3] =
            e.IgnoreDomainNames;
        d = d.toString().replace(/,/g, "");
        tools.setCookie("osp", d);
        tools.setCookie("udn", nameNode.getValue());
        b.send({id: "options_checkbox_send"});
        f.getElement().hide();
        f.getElement().setHtml(" ")
    }, onLoad: function () {
        g = this;
        b.init(m);
        d.IgnoreAllCapsWords = g.getContentElement("OptionsTab", "IgnoreAllCapsWords");
        d.IgnoreWordsNumbers = g.getContentElement("OptionsTab", "IgnoreWordsNumbers");
        d.IgnoreMixedCaseWords = g.getContentElement("OptionsTab", "IgnoreMixedCaseWords");
        d.IgnoreDomainNames = g.getContentElement("OptionsTab",
            "IgnoreDomainNames")
    }, onShow: function () {
        strToArr = tools.getCookie("osp").split("");
        e.IgnoreAllCapsWords = strToArr[0];
        e.IgnoreWordsNumbers = strToArr[1];
        e.IgnoreMixedCaseWords = strToArr[2];
        e.IgnoreDomainNames = strToArr[3];
        0 == e.IgnoreAllCapsWords ? d.IgnoreAllCapsWords.setValue("", !1) : d.IgnoreAllCapsWords.setValue("checked", !1);
        0 == e.IgnoreWordsNumbers ? d.IgnoreWordsNumbers.setValue("", !1) : d.IgnoreWordsNumbers.setValue("checked", !1);
        0 == e.IgnoreMixedCaseWords ? d.IgnoreMixedCaseWords.setValue("", !1) : d.IgnoreMixedCaseWords.setValue("checked",
            !1);
        0 == e.IgnoreDomainNames ? d.IgnoreDomainNames.setValue("", !1) : d.IgnoreDomainNames.setValue("checked", !1);
        e.IgnoreAllCapsWords = !1 == d.IgnoreAllCapsWords.getValue() ? 0 : 1;
        e.IgnoreWordsNumbers = !1 == d.IgnoreWordsNumbers.getValue() ? 0 : 1;
        e.IgnoreMixedCaseWords = !1 == d.IgnoreMixedCaseWords.getValue() ? 0 : 1;
        e.IgnoreDomainNames = !1 == d.IgnoreDomainNames.getValue() ? 0 : 1;
        d.IgnoreAllCapsWords.getElement().$.lastChild.innerHTML = NS.LocalizationComing.IgnoreAllCapsWords;
        d.IgnoreWordsNumbers.getElement().$.lastChild.innerHTML =
            NS.LocalizationComing.IgnoreWordsWithNumbers;
        d.IgnoreMixedCaseWords.getElement().$.lastChild.innerHTML = NS.LocalizationComing.IgnoreMixedCaseWords;
        d.IgnoreDomainNames.getElement().$.lastChild.innerHTML = NS.LocalizationComing.IgnoreDomainNames
    }}
});