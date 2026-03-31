! function() {
    try {
        var A = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
            e = (new A.Error).stack;
        e && (A._sentryDebugIds = A._sentryDebugIds || {}, A._sentryDebugIds[e] = "2810fb40-0144-4adb-a9d3-dfbf5aaf9b55", A._sentryDebugIdIdentifier = "sentry-dbid-2810fb40-0144-4adb-a9d3-dfbf5aaf9b55")
    } catch (A) {}
}(), (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [7627, 2821, 3016, 2093], {
        82863: function(A, e, t) {
            "use strict";
            t.d(e, {
                Nq: function() {
                    return l
                },
                rg: function() {
                    return o
                }
            });
            var i = t(2784);
            let n = (0, i.createContext)(null);

            function o({
                clientId: A,
                nonce: e,
                onScriptLoadSuccess: t,
                onScriptLoadError: o,
                children: l
            }) {
                let r = function(A = {}) {
                        let {
                            nonce: e,
                            onScriptLoadSuccess: t,
                            onScriptLoadError: n
                        } = A, [o, l] = (0, i.useState)(!1), r = (0, i.useRef)(t);
                        r.current = t;
                        let a = (0, i.useRef)(n);
                        return a.current = n, (0, i.useEffect)(() => {
                            let A = document.createElement("script");
                            return A.src = "https://accounts.google.com/gsi/client", A.async = !0, A.defer = !0, A.nonce = e, A.onload = () => {
                                var A;
                                l(!0), null === (A = r.current) || void 0 === A || A.call(r)
                            }, A.onerror = () => {
                                var A;
                                l(!1), null === (A = a.current) || void 0 === A || A.call(a)
                            }, document.body.appendChild(A), () => {
                                document.body.removeChild(A)
                            }
                        }, [e]), o
                    }({
                        nonce: e,
                        onScriptLoadSuccess: t,
                        onScriptLoadError: o
                    }),
                    a = (0, i.useMemo)(() => ({
                        clientId: A,
                        scriptLoadedSuccessfully: r
                    }), [A, r]);
                return i.createElement(n.Provider, {
                    value: a
                }, l)
            }

            function l({
                flow: A = "implicit",
                scope: e = "",
                onSuccess: t,
                onError: o,
                onNonOAuthError: l,
                overrideScope: r,
                state: a,
                ...s
            }) {
                let {
                    clientId: c,
                    scriptLoadedSuccessfully: u
                } = function() {
                    let A = (0, i.useContext)(n);
                    if (!A) throw Error("Google OAuth components must be used within GoogleOAuthProvider");
                    return A
                }(), d = (0, i.useRef)(), g = (0, i.useRef)(t);
                g.current = t;
                let p = (0, i.useRef)(o);
                p.current = o;
                let f = (0, i.useRef)(l);
                f.current = l, (0, i.useEffect)(() => {
                    var t, i;
                    if (!u) return;
                    let n = "implicit" === A ? "initTokenClient" : "initCodeClient",
                        o = null === (i = null === (t = null == window ? void 0 : window.google) || void 0 === t ? void 0 : t.accounts) || void 0 === i ? void 0 : i.oauth2[n]({
                            client_id: c,
                            scope: r ? e : `openid profile email ${e}`,
                            callback: A => {
                                var e, t;
                                if (A.error) return null === (e = p.current) || void 0 === e ? void 0 : e.call(p, A);
                                null === (t = g.current) || void 0 === t || t.call(g, A)
                            },
                            error_callback: A => {
                                var e;
                                null === (e = f.current) || void 0 === e || e.call(f, A)
                            },
                            state: a,
                            ...s
                        });
                    d.current = o
                }, [c, u, A, e, a]);
                let m = (0, i.useCallback)(A => {
                        var e;
                        return null === (e = d.current) || void 0 === e ? void 0 : e.requestAccessToken(A)
                    }, []),
                    h = (0, i.useCallback)(() => {
                        var A;
                        return null === (A = d.current) || void 0 === A ? void 0 : A.requestCode()
                    }, []);
                return "implicit" === A ? m : h
            }
        },
        20964: function(A, e, t) {
            "use strict";
            t.d(e, {
                r: function() {
                    return r
                }
            });
            var i, n = t(2784);
            let o = ["title", "titleId"];

            function l() {
                return (l = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let r = (0, n.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: r
                } = A, a = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, o);
                return n.createElement("svg", l({
                    width: 28,
                    height: 28,
                    viewBox: "0 0 28 28",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": r
                }, a), t ? n.createElement("title", {
                    id: r
                }, t) : null, i || (i = n.createElement("path", {
                    d: "M20.0826 15.5497L20.8082 10.772H16.2694V7.67301C16.2694 6.36561 16.9023 5.09049 18.9352 5.09049H21V1.02301C21 1.02301 19.1269 0.700195 17.337 0.700195C13.5973 0.700195 11.1553 2.98896 11.1553 7.13068V10.772H7V15.5497H11.1553V27.1001C11.9895 27.2324 12.8429 27.3002 13.7123 27.3002C14.5817 27.3002 15.4352 27.2324 16.2694 27.1001V15.5497H20.0826Z",
                    fill: "#1877F2"
                })))
            });
            t.p
        },
        94336: function(A, e, t) {
            "use strict";
            t.d(e, {
                r: function() {
                    return a
                }
            });
            var i, n, o = t(2784);
            let l = ["title", "titleId"];

            function r() {
                return (r = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let a = (0, o.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: a
                } = A, s = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, l);
                return o.createElement("svg", r({
                    width: 28,
                    height: 28,
                    viewBox: "0 0 28 28",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": a
                }, s), t ? o.createElement("title", {
                    id: a
                }, t) : null, i || (i = o.createElement("g", {
                    clipPath: "url(#clip0_6492_143704)"
                }, o.createElement("path", {
                    d: "M25.9331 0H2.06694C1.51876 0 0.993022 0.217767 0.605394 0.605394C0.217767 0.993022 0 1.51876 0 2.06694V25.9331C0 26.4812 0.217767 27.007 0.605394 27.3946C0.993022 27.7822 1.51876 28 2.06694 28H25.9331C26.4812 28 27.007 27.7822 27.3946 27.3946C27.7822 27.007 28 26.4812 28 25.9331V2.06694C28 1.51876 27.7822 0.993022 27.3946 0.605394C27.007 0.217767 26.4812 0 25.9331 0ZM8.34556 23.8525H4.13583V10.4806H8.34556V23.8525ZM6.23778 8.6275C5.76026 8.62481 5.29424 8.48073 4.89852 8.21344C4.50281 7.94614 4.19515 7.56762 4.01436 7.12564C3.83357 6.68366 3.78776 6.19802 3.8827 5.73003C3.97765 5.26204 4.2091 4.83266 4.54785 4.49608C4.88659 4.1595 5.31745 3.93081 5.78604 3.83887C6.25464 3.74693 6.73997 3.79586 7.18078 3.97948C7.62159 4.16311 7.99813 4.4732 8.26288 4.87061C8.52762 5.26803 8.66871 5.73497 8.66833 6.2125C8.67284 6.53221 8.61293 6.84955 8.49218 7.14561C8.37143 7.44167 8.19231 7.71038 7.9655 7.93575C7.73869 8.16111 7.46882 8.3385 7.172 8.45734C6.87517 8.57619 6.55745 8.63406 6.23778 8.6275ZM23.8622 23.8642H19.6544V16.5589C19.6544 14.4044 18.7386 13.7394 17.5564 13.7394C16.3081 13.7394 15.0831 14.6806 15.0831 16.6133V23.8642H10.8733V10.4903H14.9217V12.3433H14.9761C15.3825 11.5208 16.8058 10.115 18.9778 10.115C21.3267 10.115 23.8642 11.5092 23.8642 15.5925L23.8622 23.8642Z",
                    fill: "#0A66C2"
                }))), n || (n = o.createElement("defs", null, o.createElement("clipPath", {
                    id: "clip0_6492_143704"
                }, o.createElement("rect", {
                    width: 28,
                    height: 28,
                    fill: "white"
                })))))
            });
            t.p
        },
        95710: function(A, e, t) {
            "use strict";
            t.d(e, {
                r: function() {
                    return r
                }
            });
            var i, n = t(2784);
            let o = ["title", "titleId"];

            function l() {
                return (l = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let r = (0, n.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: r
                } = A, a = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, o);
                return n.createElement("svg", l({
                    xmlns: "http://www.w3.org/2000/svg",
                    x: "0px",
                    y: "0px",
                    width: 28,
                    height: 28,
                    viewBox: "0,0,256,256",
                    style: {
                        fill: "#000000"
                    },
                    ref: e,
                    "aria-labelledby": r
                }, a), t ? n.createElement("title", {
                    id: r
                }, t) : null, n.createElement("g", {
                    fill: "#ffffff",
                    fillRule: "nonzero",
                    stroke: "none",
                    strokeWidth: 1,
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 10,
                    strokeDasharray: "",
                    strokeDashoffset: 0,
                    fontFamily: "none",
                    fontWeight: "none",
                    fontSize: "none",
                    textAnchor: "none",
                    style: {
                        mixBlendMode: "normal"
                    }
                }, i || (i = n.createElement("g", {
                    transform: "scale(5.12,5.12)"
                }, n.createElement("path", {
                    d: "M5.91992,6l14.66211,21.375l-14.35156,16.625h3.17969l12.57617,-14.57812l10,14.57813h12.01367l-15.31836,-22.33008l13.51758,-15.66992h-3.16992l-11.75391,13.61719l-9.3418,-13.61719zM9.7168,8h7.16406l23.32227,34h-7.16406z"
                })))))
            });
            t.p
        },
        60266: function(A, e, t) {
            "use strict";
            t.d(e, {
                r: function() {
                    return s
                }
            });
            var i, n, o, l = t(2784);
            let r = ["title", "titleId"];

            function a() {
                return (a = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let s = (0, l.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: s
                } = A, c = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, r);
                return l.createElement("svg", a({
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": s
                }, c), t ? l.createElement("title", {
                    id: s
                }, t) : null, i || (i = l.createElement("rect", {
                    width: 24,
                    height: 24,
                    rx: 12,
                    fill: "#FF0000"
                })), n || (n = l.createElement("path", {
                    d: "M20.221 7.87825C20.0233 7.1439 19.4443 6.56489 18.7099 6.36718C17.3683 6 12.0019 6 12.0019 6C12.0019 6 6.63543 6 5.29382 6.35306C4.57359 6.55077 3.98045 7.1439 3.78274 7.87825C3.42969 9.21986 3.42969 12.0019 3.42969 12.0019C3.42969 12.0019 3.42969 14.7981 3.78274 16.1256C3.98045 16.86 4.55946 17.439 5.29382 17.6367C6.64955 18.0039 12.0019 18.0039 12.0019 18.0039C12.0019 18.0039 17.3683 18.0039 18.7099 17.6508C19.4443 17.4531 20.0233 16.8741 20.221 16.1397C20.5741 14.7981 20.5741 12.0161 20.5741 12.0161C20.5741 12.0161 20.5882 9.21986 20.221 7.87825Z",
                    fill: "white"
                })), o || (o = l.createElement("path", {
                    d: "M10.293 14.5721L14.7556 12.0019L10.293 9.43164V14.5721Z",
                    fill: "#FF0000"
                })))
            });
            t.p
        },
        96292: function(A, e) {
            "use strict";
            e.C5 = function(A, e) {
                return a(A, o, t, e)
            };
            let t = ["accommodation", "adulthood", "advertising", "advice", "aggression", "aid", "air", "aircraft", "alcohol", "anger", "applause", "arithmetic", "assistance", "athletics", "bacon", "baggage", "beef", "biology", "blood", "botany", "bread", "butter", "carbon", "cardboard", "cash", "chalk", "chaos", "chess", "crossroads", "countryside", "dancing", "deer", "dignity", "dirt", "dust", "economics", "education", "electricity", "engineering", "enjoyment", "envy", "equipment", "ethics", "evidence", "evolution", "fame", "fiction", "flour", "flu", "food", "fuel", "fun", "furniture", "gallows", "garbage", "garlic", "genetics", "gold", "golf", "gossip", "gratitude", "grief", "guilt", "gymnastics", "happiness", "hardware", "harm", "hate", "hatred", "health", "heat", "help", "homework", "honesty", "honey", "hospitality", "housework", "humour", "hunger", "hydrogen", "ice", "importance", "inflation", "information", "innocence", "iron", "irony", "jam", "jewelry", "judo", "karate", "knowledge", "lack", "laughter", "lava", "leather", "leisure", "lightning", "linguine", "linguini", "linguistics", "literature", "litter", "livestock", "logic", "loneliness", "luck", "luggage", "macaroni", "machinery", "magic", "management", "mankind", "marble", "mathematics", "mayonnaise", "measles", "methane", "milk", "minus", "money", "mud", "music", "mumps", "nature", "news", "nitrogen", "nonsense", "nurture", "nutrition", "obedience", "obesity", "oxygen", "pasta", "patience", "physics", "poetry", "pollution", "poverty", "pride", "psychology", "publicity", "punctuation", "quartz", "racism", "relaxation", "reliability", "research", "respect", "revenge", "rice", "rubbish", "rum", "safety", "scenery", "seafood", "seaside", "series", "shame", "sheep", "shopping", "sleep", "smoke", "smoking", "snow", "soap", "software", "soil", "spaghetti", "species", "steam", "stuff", "stupidity", "sunshine", "symmetry", "tennis", "thirst", "thunder", "timber", "traffic", "transportation", "trust", "underwear", "unemployment", "unity", "validity", "veal", "vegetation", "vegetarianism", "vengeance", "violence", "vitality", "warmth", "wealth", "weather", "welfare", "wheat", "wildlife", "wisdom", "yoga", "zinc", "zoology"],
                i = {
                    plural: {
                        men: RegExp("^(m|wom)en$", "gi"),
                        people: /(pe)ople$/gi,
                        children: /(child)ren$/gi,
                        tia: /([ti])a$/gi,
                        analyses: RegExp("((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$", "gi"),
                        databases: /(database)s$/gi,
                        drives: /(drive)s$/gi,
                        hives: RegExp("(hi|ti)ves$", "gi"),
                        curves: /(curve)s$/gi,
                        lrves: /([lr])ves$/gi,
                        aves: /([a])ves$/gi,
                        foves: RegExp("([^fo])ves$", "gi"),
                        movies: /(m)ovies$/gi,
                        aeiouyies: RegExp("([^aeiouy]|qu)ies$", "gi"),
                        series: /(s)eries$/gi,
                        xes: RegExp("(x|ch|ss|sh)es$", "gi"),
                        mice: RegExp("([m|l])ice$", "gi"),
                        buses: /(bus)es$/gi,
                        oes: /(o)es$/gi,
                        shoes: /(shoe)s$/gi,
                        crises: RegExp("(cris|ax|test)es$", "gi"),
                        octopuses: RegExp("(octop|vir)uses$", "gi"),
                        aliases: RegExp("(alias|canvas|status|campus)es$", "gi"),
                        summonses: RegExp("^(summons|bonus)es$", "gi"),
                        oxen: RegExp("^(ox)en", "gi"),
                        matrices: /(matr)ices$/gi,
                        vertices: RegExp("(vert|ind)ices$", "gi"),
                        feet: RegExp("^feet$", "gi"),
                        teeth: RegExp("^teeth$", "gi"),
                        geese: RegExp("^geese$", "gi"),
                        quizzes: /(quiz)zes$/gi,
                        whereases: RegExp("^(whereas)es$", "gi"),
                        criteria: RegExp("^(criteri)a$", "gi"),
                        genera: RegExp("^genera$", "gi"),
                        ss: /ss$/gi,
                        s: /s$/gi
                    },
                    singular: {
                        man: RegExp("^(m|wom)an$", "gi"),
                        person: /(pe)rson$/gi,
                        child: /(child)$/gi,
                        drive: /(drive)$/gi,
                        ox: RegExp("^(ox)$", "gi"),
                        axis: RegExp("(ax|test)is$", "gi"),
                        octopus: RegExp("(octop|vir)us$", "gi"),
                        alias: RegExp("(alias|status|canvas|campus)$", "gi"),
                        summons: RegExp("^(summons|bonus)$", "gi"),
                        bus: /(bu)s$/gi,
                        buffalo: RegExp("(buffal|tomat|potat)o$", "gi"),
                        tium: /([ti])um$/gi,
                        sis: /sis$/gi,
                        ffe: RegExp("(?:([^f])fe|([lr])f)$", "gi"),
                        focus: RegExp("^(focus)$", "gi"),
                        hive: RegExp("(hi|ti)ve$", "gi"),
                        aeiouyy: RegExp("([^aeiouy]|qu)y$", "gi"),
                        x: RegExp("(x|ch|ss|sh)$", "gi"),
                        matrix: /(matr)ix$/gi,
                        vertex: RegExp("(vert|ind)ex$", "gi"),
                        mouse: RegExp("([m|l])ouse$", "gi"),
                        foot: RegExp("^foot$", "gi"),
                        tooth: RegExp("^tooth$", "gi"),
                        goose: RegExp("^goose$", "gi"),
                        quiz: /(quiz)$/gi,
                        whereas: RegExp("^(whereas)$", "gi"),
                        criterion: RegExp("^(criteri)on$", "gi"),
                        genus: RegExp("^genus$", "gi"),
                        s: /s$/gi,
                        common: /$/gi
                    }
                },
                n = [
                    [i.plural.men],
                    [i.plural.people],
                    [i.plural.children],
                    [i.plural.tia],
                    [i.plural.analyses],
                    [i.plural.databases],
                    [i.plural.drives],
                    [i.plural.hives],
                    [i.plural.curves],
                    [i.plural.lrves],
                    [i.plural.foves],
                    [i.plural.aeiouyies],
                    [i.plural.series],
                    [i.plural.movies],
                    [i.plural.xes],
                    [i.plural.mice],
                    [i.plural.buses],
                    [i.plural.oes],
                    [i.plural.shoes],
                    [i.plural.crises],
                    [i.plural.octopuses],
                    [i.plural.aliases],
                    [i.plural.summonses],
                    [i.plural.oxen],
                    [i.plural.matrices],
                    [i.plural.feet],
                    [i.plural.teeth],
                    [i.plural.geese],
                    [i.plural.quizzes],
                    [i.plural.whereases],
                    [i.plural.criteria],
                    [i.plural.genera],
                    [i.singular.man, "$1en"],
                    [i.singular.person, "$1ople"],
                    [i.singular.child, "$1ren"],
                    [i.singular.drive, "$1s"],
                    [i.singular.ox, "$1en"],
                    [i.singular.axis, "$1es"],
                    [i.singular.octopus, "$1uses"],
                    [i.singular.alias, "$1es"],
                    [i.singular.summons, "$1es"],
                    [i.singular.bus, "$1ses"],
                    [i.singular.buffalo, "$1oes"],
                    [i.singular.tium, "$1a"],
                    [i.singular.sis, "ses"],
                    [i.singular.ffe, "$1$2ves"],
                    [i.singular.focus, "$1es"],
                    [i.singular.hive, "$1ves"],
                    [i.singular.aeiouyy, "$1ies"],
                    [i.singular.matrix, "$1ices"],
                    [i.singular.vertex, "$1ices"],
                    [i.singular.x, "$1es"],
                    [i.singular.mouse, "$1ice"],
                    [i.singular.foot, "feet"],
                    [i.singular.tooth, "teeth"],
                    [i.singular.goose, "geese"],
                    [i.singular.quiz, "$1zes"],
                    [i.singular.whereas, "$1es"],
                    [i.singular.criterion, "$1a"],
                    [i.singular.genus, "genera"],
                    [i.singular.s, "s"],
                    [i.singular.common, "s"]
                ],
                o = [
                    [i.singular.man],
                    [i.singular.person],
                    [i.singular.child],
                    [i.singular.drive],
                    [i.singular.ox],
                    [i.singular.axis],
                    [i.singular.octopus],
                    [i.singular.alias],
                    [i.singular.summons],
                    [i.singular.bus],
                    [i.singular.buffalo],
                    [i.singular.tium],
                    [i.singular.sis],
                    [i.singular.ffe],
                    [i.singular.focus],
                    [i.singular.hive],
                    [i.singular.aeiouyy],
                    [i.singular.x],
                    [i.singular.matrix],
                    [i.singular.mouse],
                    [i.singular.foot],
                    [i.singular.tooth],
                    [i.singular.goose],
                    [i.singular.quiz],
                    [i.singular.whereas],
                    [i.singular.criterion],
                    [i.singular.genus],
                    [i.plural.men, "$1an"],
                    [i.plural.people, "$1rson"],
                    [i.plural.children, "$1"],
                    [i.plural.databases, "$1"],
                    [i.plural.drives, "$1"],
                    [i.plural.genera, "genus"],
                    [i.plural.criteria, "$1on"],
                    [i.plural.tia, "$1um"],
                    [i.plural.analyses, "$1$2sis"],
                    [i.plural.hives, "$1ve"],
                    [i.plural.curves, "$1"],
                    [i.plural.lrves, "$1f"],
                    [i.plural.aves, "$1ve"],
                    [i.plural.foves, "$1fe"],
                    [i.plural.movies, "$1ovie"],
                    [i.plural.aeiouyies, "$1y"],
                    [i.plural.series, "$1eries"],
                    [i.plural.xes, "$1"],
                    [i.plural.mice, "$1ouse"],
                    [i.plural.buses, "$1"],
                    [i.plural.oes, "$1"],
                    [i.plural.shoes, "$1"],
                    [i.plural.crises, "$1is"],
                    [i.plural.octopuses, "$1us"],
                    [i.plural.aliases, "$1"],
                    [i.plural.summonses, "$1"],
                    [i.plural.oxen, "$1"],
                    [i.plural.matrices, "$1ix"],
                    [i.plural.vertices, "$1ex"],
                    [i.plural.feet, "foot"],
                    [i.plural.teeth, "tooth"],
                    [i.plural.geese, "goose"],
                    [i.plural.quizzes, "$1"],
                    [i.plural.whereases, "$1"],
                    [i.plural.ss, "ss"],
                    [i.plural.s, ""]
                ],
                l = (RegExp("(_ids|_id)$", "g"), RegExp("[ _]", "g"), /([A-Z])/g),
                r = RegExp("^_");

            function a(A, e, t, i) {
                if (i) return i;
                if (t.includes(A.toLocaleLowerCase())) return A;
                for (let t of e)
                    if (A.match(t[0])) {
                        if (void 0 !== t[1]) return A.replace(t[0], t[1]);
                        break
                    }
                return A
            }
        },
        84992: function(A, e, t) {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/workflow", function() {
                return t(91479)
            }])
        },
        97101: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return u
                }
            });
            var i = t(752),
                n = t(59511),
                o = t(66836);
            let l = () => {
                    let [A] = (0, o.XL)("new_caption_styles");
                    return A
                },
                r = ["preset-fancy-Glitch-infinite-zoom", "preset-fancy-Blur-switch", "preset-fancy-Baby-earthquake", "preset-fancy-Seamless-bounce", "preset-fancy-Highlighter-box-around"],
                a = (A, e) => {
                    let t = A.filter(A => r.includes(A.templateId)),
                        i = A.filter(A => !r.includes(A.templateId));
                    switch (e) {
                        case "control":
                            return i;
                        case "test1":
                            return [...t, ...i];
                        case "test2":
                            {
                                let A = Math.floor(i.length / 2);
                                return [...i.slice(0, A), ...t, ...i.slice(A)]
                            }
                        case "test3":
                            return [...i, ...t];
                        default:
                            return A
                    }
                };
            var s = t(87558),
                c = t(15377);

            function u() {
                let A = (0, i.Dv)(s.K.nestApiPrefix),
                    {
                        clipApiHeaderWrapper: e
                    } = (0, c.m)(),
                    t = l(),
                    o = (0, n.Z)(async () => await e("".concat(A, "/brand-templates?q=mine"), {
                        method: "GET"
                    })),
                    r = (0, n.Z)(async () => a(await e("".concat(A, "/fancy-template-presets"), {
                        method: "GET"
                    }), t)),
                    u = (0, n.Z)(async t => await e("".concat(A, "/brand-templates"), {
                        method: "POST",
                        body: JSON.stringify(t)
                    }, {
                        noErrorToast: !0
                    })),
                    d = (0, n.Z)(async t => await e("".concat(A, "/brand-templates/").concat(null == t ? void 0 : t.templateId), {
                        method: "PUT",
                        body: JSON.stringify(t)
                    }, {
                        noErrorToast: !0
                    }));
                return {
                    getBrandTemplatesV2: o,
                    getFancyTemplates: r,
                    deleteBrandTemplate: (0, n.Z)(async t => await e("".concat(A, "/brand-templates/").concat(t), {
                        method: "DELETE"
                    })),
                    createBrandTemplate: u,
                    updateBrandTemplate: d
                }
            }
        },
        77606: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return s
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(59511),
                r = t(87558),
                a = t(15377);

            function s() {
                let A = (0, o.Dv)(r.K.nestApiPrefix),
                    {
                        clipApiHeaderWrapper: e
                    } = (0, a.m)(),
                    t = async t => {
                        var i;
                        return await e("".concat(A, "/event-tasks?postIds=").concat(null === (i = t.postIds) || void 0 === i ? void 0 : i.join(",")), {
                            method: "GET"
                        })
                    },
                    s = (0, l.Z)(async t => await e("".concat(A, "/feedback-survey-responses"), {
                        method: "POST",
                        body: JSON.stringify(t)
                    })),
                    c = (0, l.Z)(async (t, i) => {
                        await e("".concat(A, "/social-accounts"), {
                            method: "DELETE",
                            body: JSON.stringify({
                                platform: t,
                                extUserId: i
                            })
                        })
                    });
                return {
                    revokePostAccount: c,
                    postVideoByPlansocial: (0, l.Z)(async o => {
                        var l, r;
                        let a = await e("".concat(A, "/post-tasks"), {
                                method: "POST",
                                body: JSON.stringify(o)
                            }, {
                                noErrorToast: !0
                            }),
                            s = null === (r = a.data) || void 0 === r ? void 0 : null === (l = r.data) || void 0 === l ? void 0 : l.filter(A => !A.success);
                        return new Promise(A => {
                            let e = 0,
                                o = setInterval(async () => {
                                    var l, r, c, u, d, g;
                                    let p = await t({
                                        postIds: null === (c = a.data) || void 0 === c ? void 0 : null === (r = c.data) || void 0 === r ? void 0 : null === (l = r.map) || void 0 === l ? void 0 : l.call(r, A => {
                                            var e;
                                            return null !== (e = A.postId) && void 0 !== e ? e : ""
                                        })
                                    });
                                    (++e >= 30 || p.data && (null == p ? void 0 : null === (d = p.data) || void 0 === d ? void 0 : null === (u = d.every) || void 0 === u ? void 0 : u.call(d, A => "pending" !== A.status))) && (clearInterval(o), p.data, A((0, n._)((0, i._)({}, p), {
                                        data: [...null !== (g = null == p ? void 0 : p.data) && void 0 !== g ? g : [], ...s]
                                    })))
                                }, 2e3)
                        })
                    }),
                    updateLinkedinOrgSelection: (0, l.Z)(async t => {
                        let {
                            extOrgId: i,
                            extUserId: n
                        } = t;
                        await e("".concat(A, "/social-accounts/select-sub-accounts"), {
                            method: "POST",
                            body: JSON.stringify({
                                param: {
                                    platform: "LINKEDIN",
                                    extOrgId: i,
                                    extUserId: n
                                }
                            })
                        })
                    }),
                    updateExtPageSelection: (0, l.Z)(async t => {
                        let {
                            platform: i,
                            extPageId: n,
                            extUserId: o
                        } = t;
                        await e("".concat(A, "/social-accounts/select-sub-accounts"), {
                            method: "POST",
                            body: JSON.stringify({
                                param: {
                                    platform: i,
                                    extPageId: n,
                                    extUserId: o
                                }
                            })
                        })
                    }),
                    submitFeedbackSurvey: s
                }
            }
        },
        2404: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return a
                }
            });
            var i = t(30815),
                n = t(752),
                o = t(59511),
                l = t(87558),
                r = t(15377);

            function a() {
                let A = (0, n.Dv)(l.K.nestApiPrefix),
                    {
                        clipApiHeaderWrapper: e
                    } = (0, r.m)();
                return {
                    createAutoPostSchedule: (0, o.Z)(async (t, i) => (await e("".concat(A, "/publish-schedules?q=").concat(t), {
                        method: "POST",
                        body: JSON.stringify(i)
                    }, {
                        noErrorToast: !0
                    })).data),
                    queryAutoPostSchedule: (0, o.Z)(async t => {
                        let n = new URLSearchParams((0, i._)({
                            q: "findByProjectAndClip"
                        }, t));
                        try {
                            return (await e("".concat(A, "/publish-schedules?").concat(n), {}, {
                                noErrorToast: !0
                            })).data
                        } catch (A) {
                            return []
                        }
                    }),
                    deleteAutoPostSchedule: (0, o.Z)(async t => {
                        let i = new URLSearchParams(t);
                        await e("".concat(A, "/publish-schedules?").concat(i), {
                            method: "DELETE"
                        })
                    })
                }
            }
        },
        41950: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return r
                }
            });
            var i = t(752),
                n = t(59511),
                o = t(87558),
                l = t(15377);

            function r() {
                let A = (0, i.Dv)(o.K.nestApiPrefix),
                    {
                        clipApiHeaderWrapper: e
                    } = (0, l.m)(),
                    t = (0, n.Z)(async t => {
                        await e("".concat(A, "/system-events/track-lark"), {
                            method: "POST",
                            body: JSON.stringify(t)
                        })
                    }),
                    r = (0, n.Z)(async (t, i) => await e("".concat(A, "/notifications"), {
                        method: "POST",
                        body: JSON.stringify(t)
                    }, i)),
                    a = (0, n.Z)(async (t, i, n) => await e("".concat(A, "/clip-download-records"), {
                        method: "POST",
                        body: JSON.stringify({
                            projectId: t,
                            clipId: i
                        })
                    }, n)),
                    s = (0, n.Z)(async (t, i) => await e("".concat(A, "/clip-export-records"), {
                        method: "POST",
                        body: JSON.stringify({
                            userId: i,
                            orgId: t
                        })
                    }, {
                        noErrorToast: !0
                    })),
                    c = (0, n.Z)(async (t, i) => await e("".concat(A, "/clip-export-records/check-first-operation"), {
                        method: "POST",
                        body: JSON.stringify({
                            userId: i,
                            orgId: t
                        })
                    }, {
                        noErrorToast: !0
                    })),
                    u = (0, n.Z)(async t => await e("".concat(A, "/clip-export-records"), {
                        method: "PUT",
                        body: JSON.stringify(t)
                    }, {
                        noErrorToast: !0
                    }));
                return {
                    recordToFeishu: t,
                    sendEmail: r,
                    createDownloadRecord: a,
                    checkFirstTimeClipExport: c,
                    createUserClipExportedRecord: s,
                    createClipExportForUser: u,
                    createUserShareLoveRecord: (0, n.Z)(async t => await e("".concat(A, "/share-love-bonus"), {
                        method: "POST",
                        body: JSON.stringify(t)
                    }, {
                        noErrorToast: !0
                    })),
                    checkShareLoveBonusIssued: (0, n.Z)(async t => await e("".concat(A, "/share-love-bonus?feature=").concat(t), {
                        method: "GET"
                    }, {
                        noErrorToast: !0
                    })),
                    checkDownloadableClips: (0, n.Z)(async t => await e("".concat(A, "/check-export-operation"), {
                        method: "POST",
                        body: JSON.stringify({
                            projectClips: t
                        })
                    }))
                }
            }
        },
        9019: function(A, e, t) {
            "use strict";
            t.d(e, {
                H: function() {
                    return u
                }
            });
            var i = t(30815),
                n = t(42180),
                o = t(752),
                l = t(8718),
                r = t(59511),
                a = t(87558),
                s = t(15377);
            let c = "social-accounts/health-check",
                u = () => {
                    let {
                        healthyCheck: A
                    } = function() {
                        let A = (0, o.Dv)(a.K.nestApiPrefix),
                            {
                                clipApiHeaderWrapper: e
                            } = (0, s.m)();
                        return {
                            healthyCheck: (0, r.Z)(async t => {
                                let i = l.Z.stringify(t);
                                return await e("".concat(A, "/").concat(c, "?").concat(i), {
                                    method: "GET"
                                }, {
                                    noErrorToast: !0
                                })
                            })
                        }
                    }(), e = (0, n.a)({
                        queryKey: [c],
                        queryFn: () => A({
                            q: "mine"
                        }),
                        retry: !1
                    });
                    return (0, i._)({}, e)
                }
        },
        45428: function(A, e, t) {
            "use strict";

            function i(A) {
                return A ? A.reduce((A, e) => (A["REDFLAG_" + e.name] = e.reason, A), {}) : {}
            }

            function n(A) {
                return A ? A.reduce((A, e) => (A[e.join("-")] = !0, A), {}) : {}
            }
            t.d(e, {
                Y: function() {
                    return n
                },
                Z: function() {
                    return i
                }
            })
        },
        67423: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return a
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(72085),
                l = t(10123),
                r = t(71302);

            function a(A) {
                let {
                    className: e,
                    originalCredit: t,
                    credit: a,
                    grey: s
                } = A;
                return (0, i.jsxs)("div", {
                    className: (0, l.cn)("flex flex-row justify-between items-center space-x-1", e),
                    children: [s ? (0, i.jsx)(o.Z, {
                        className: "text-muted-foreground"
                    }) : (0, i.jsx)(r.P, {
                        icon: o.Z,
                        stroke: !1
                    }), t && (0, i.jsx)(n.ZT, {
                        className: "text-sm line-through",
                        variant: "default",
                        children: t.toLocaleString()
                    }), (0, i.jsx)(n.ZT, {
                        className: "text-sm ".concat(t && "text-success"),
                        variant: s ? "default" : "headings",
                        children: a.toLocaleString()
                    })]
                })
            }
        },
        3016: function(A, e, t) {
            "use strict";
            t.r(e), t.d(e, {
                default: function() {
                    return p
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(47680),
                l = t(752),
                r = t(98614),
                a = t(81438),
                s = t(27551),
                c = t(55975),
                u = t(6419),
                d = t(10123),
                g = t(80629);

            function p(A) {
                let {
                    page: e,
                    className: t
                } = A, {
                    t: p
                } = (0, r.$G)("common"), f = (0, l.Dv)(g.a.currentOrgAsset), m = (0, s.Sx)(null == f ? void 0 : f.plan);
                if (!(!e || (0, u.Q)(e.type, "showSupportButton"))) return null;
                let h = A => {
                    let e = document.getElementById("CookiebotWidget");
                    e && "add" === A ? e.classList.add("upper") : e && "remove" === A && e.classList.remove("upper")
                };
                return (0, i.jsx)(a.H, {
                    appId: "bp9kqydx",
                    autoBoot: !0,
                    autoBootProps: {
                        verticalPadding: 80,
                        horizontalPadding: 20,
                        customLauncherSelector: ".custom-launcher",
                        hideDefaultLauncher: !0
                    },
                    onHide: () => {
                        h("remove")
                    },
                    onShow: () => {
                        h("add")
                    },
                    children: (0, i.jsx)(n.zx, {
                        id: "intercom-button",
                        variant: "outline",
                        className: (0, d.cn)("custom-launcher fixed right-6 bottom-6 z-[9999] rounded-md border-border", t),
                        onClick: () => {
                            (0, c.B)("intercom.messenger.open")
                        },
                        children: m ? (0, i.jsxs)(n.ZT, {
                            variant: "headings",
                            className: "text-md flex flex-row items-center gap-2 font-sans font-semibold sm:text-sm",
                            children: [(0, i.jsx)(o.Z, {}), p("get_support")]
                        }) : (0, i.jsx)(n.ZT, {
                            variant: "headings",
                            className: "text-md font-sans font-semibold sm:text-sm",
                            children: p("questions")
                        })
                    })
                })
            }
        },
        71302: function(A, e, t) {
            "use strict";
            t.d(e, {
                P: function() {
                    return r
                }
            });
            var i = t(30815),
                n = t(52322),
                o = t(2784);
            let l = {
                    backgroundImage: "linear-gradient(to left, #FFA057, #FFE629)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                },
                r = A => {
                    let {
                        icon: e,
                        iconStyle: t,
                        iconPosition: r,
                        text: a,
                        textClassName: s,
                        stroke: c = !0
                    } = A, u = (0, o.useMemo)(() => {
                        let A = "http://www.w3.org/2000/svg",
                            e = document.createElementNS(A, "defs"),
                            t = document.createElementNS(A, "linearGradient");
                        t.setAttribute("gradientTransform", "rotate(90)"), t.setAttribute("id", "linearGradient");
                        let i = document.createElementNS(A, "stop");
                        i.setAttribute("offset", "0%"), i.setAttribute("stop-color", "#FFE629");
                        let n = document.createElementNS(A, "stop");
                        return n.setAttribute("offset", "100%"), n.setAttribute("stop-color", "#FFA057"), t.appendChild(i), t.appendChild(n), e.appendChild(t), e
                    }, []), d = (0, o.useRef)(u), g = !r || "start" === r, p = () => (0, n.jsx)(e, {
                        style: t,
                        ref: A => {
                            A && (A.appendChild(d.current), Array.from(A.children).forEach(A => {
                                "path" === A.nodeName && A.setAttribute(c ? "stroke" : "fill", 'url("#linearGradient")')
                            }))
                        }
                    });
                    return (0, n.jsxs)(n.Fragment, {
                        children: [g && p(), a && (0, n.jsx)("span", {
                            style: (0, i._)({}, l),
                            className: s,
                            children: a
                        }), !g && p()]
                    })
                }
        },
        29048: function(A, e, t) {
            "use strict";
            var i = t(52322),
                n = t(57992),
                o = t(752),
                l = t(2784),
                r = t(38195),
                a = t(2871),
                s = t(62258);
            let c = (0, l.memo)(A => {
                    let {
                        storageId: e,
                        init: t,
                        mustHide: n,
                        children: o,
                        title: r,
                        content: a,
                        side: s,
                        onPushShowEvent: c,
                        onPushUpgradeEvent: d
                    } = A, g = "function" == typeof o ? o(!0) : o;
                    return (0, i.jsx)(l.Suspense, {
                        fallback: g,
                        children: (0, i.jsx)(u, {
                            storageId: e,
                            init: t,
                            mustHide: n,
                            title: r,
                            content: a,
                            side: s,
                            onPushShowEvent: c,
                            onPushUpgradeEvent: d,
                            children: o
                        })
                    })
                }),
                u = (0, l.memo)(A => {
                    let {
                        storageId: e,
                        init: t,
                        mustHide: c,
                        children: u,
                        title: d,
                        content: g,
                        side: p,
                        onPushShowEvent: f,
                        onPushUpgradeEvent: m
                    } = A, {
                        openUpsellWindow: h
                    } = (0, a.w)(), [v, x] = (0, o.KO)(s.Z.featureUsed(e)), [C, K] = (0, l.useState)(!1), b = (0, r.Z)(f);
                    (0, l.useEffect)(() => {
                        if (!v) {
                            if (t) {
                                var A;
                                K(!0), null === (A = b.current) || void 0 === A || A.call(b), c && x(!0)
                            } else K(!1)
                        }
                    }, [v, t, x, b, c]);
                    let y = "function" == typeof u ? u(C) : u,
                        w = (0, l.useMemo)(() => c ? null : (0, i.jsxs)("div", {
                            className: "flex flex-col gap-y-1.5",
                            children: [(0, i.jsx)(n.ZT, {
                                variant: "headings",
                                className: "text-lg font-semibold leading-none",
                                children: d
                            }), (0, i.jsx)(n.ZT, {
                                variant: "default",
                                className: "text-sm font-normal",
                                children: g
                            }), (0, i.jsxs)("div", {
                                className: "mt-1.5 flex flex-row gap-2",
                                children: [(0, i.jsx)(n.zx, {
                                    variant: "default",
                                    onClick: () => {
                                        setTimeout(() => {
                                            K(!1), x(!0)
                                        }, 0), null == m || m(), h({
                                            switchType: "plan",
                                            trigger: ["pay-tooltip", e].join(":"),
                                            ads: "background"
                                        })
                                    },
                                    children: "Upgrade"
                                }), (0, i.jsx)(n.zx, {
                                    variant: "ghost",
                                    onClick: () => {
                                        K(!1), x(!0)
                                    },
                                    children: "Close"
                                })]
                            })]
                        }), [d, g, m, h, e, x, c]);
                    return !t || v ? y : (0, i.jsx)(n.J2, {
                        open: C,
                        content: w,
                        side: p,
                        sideOffset: 16,
                        className: "rounded-lg border-none",
                        children: y
                    })
                });
            e.Z = (0, l.memo)(c)
        },
        60963: function(A, e, t) {
            "use strict";
            t.d(e, {
                A: function() {
                    return g
                }
            });
            var i, n, o = t(52322),
                l = t(57992),
                r = t(2784),
                a = t(98614);
            let s = ["title", "titleId"];

            function c() {
                return (c = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let u = (0, r.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: o
                } = A, l = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, s);
                return r.createElement("svg", c({
                    width: 41,
                    height: 41,
                    viewBox: "0 0 41 41",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": o
                }, l), t ? r.createElement("title", {
                    id: o
                }, t) : null, i || (i = r.createElement("rect", {
                    x: .861328,
                    y: .216797,
                    width: 40,
                    height: 40,
                    rx: 20,
                    fill: "#3DD68C"
                })), n || (n = r.createElement("path", {
                    d: "M11.1387 21.6035L16.6942 27.1591L30.5831 13.2702",
                    stroke: "#FAFAFA",
                    strokeWidth: 3.75,
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                })))
            });
            t.p;
            var d = t(10123);
            let g = (0, r.memo)(A => {
                let {
                    completed: e,
                    completedText: t,
                    progress: i,
                    ready: n,
                    imagePreview: r,
                    className: s,
                    readyText: c,
                    notReadyText: g
                } = A, {
                    t: p
                } = (0, a.$G)("editor"), f = e ? (0, o.jsxs)("div", {
                    className: "flex h-full flex-col items-center justify-center gap-7 px-14",
                    children: [(0, o.jsx)(u, {}), (0, o.jsx)(l.ZT, {
                        variant: "headings",
                        className: "text-sm font-medium",
                        children: t
                    })]
                }) : (0, o.jsxs)("div", {
                    className: "flex h-full flex-col items-center",
                    children: [(0, o.jsxs)("div", {
                        className: "flex w-full flex-col items-center justify-center gap-5 px-14",
                        style: {
                            flex: "1 0 auto"
                        },
                        children: [(0, o.jsx)(l.ZT, {
                            variant: "headings",
                            className: "text-3xl font-medium",
                            children: "".concat(i, "%")
                        }), (0, o.jsx)(l.ZT, {
                            variant: "headings",
                            className: "text-center text-sm font-medium",
                            children: n ? c || p("your_video_is_almost_ready_hint") : g || p("in_progress_results_will_be_ready_soon")
                        })]
                    }), (0, o.jsx)("div", {
                        className: "flex w-full flex-col justify-center",
                        style: {
                            flex: "0 0 22px"
                        },
                        children: (0, o.jsx)(l.Ex, {
                            className: "h-1.5 animate-pulse",
                            value: i
                        })
                    })]
                }), m = r ? (0, o.jsxs)("div", {
                    className: "absolute z-[-1] flex w-full flex-row items-center justify-center overflow-hidden rounded-sm",
                    children: [r, (0, o.jsx)("div", {
                        className: "absolute inset-0 rounded-sm backdrop-blur",
                        style: {
                            background: "rgba(28, 28, 32, 0.60)"
                        }
                    })]
                }) : (0, o.jsx)(o.Fragment, {});
                return (0, o.jsxs)("div", {
                    className: (0, d.cn)("relative h-[270px]", s),
                    children: [m, f]
                })
            })
        },
        24167: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return m
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(5145),
                l = t(47460),
                r = t(752),
                a = t(2784),
                s = t(98614),
                c = t(1332),
                u = t(59511),
                d = t(87558),
                g = t(15377),
                p = t(91381),
                f = t(55773),
                m = A => {
                    let {
                        t: e
                    } = (0, s.$G)("common"), {
                        visible: t,
                        onOk: m,
                        onCancel: h
                    } = A || {}, {
                        createSecretKey: v,
                        listSecretKey: x
                    } = function() {
                        let A = (0, r.Dv)(d.K.nestApiPrefix),
                            e = "".concat(A, "/api-keys"),
                            {
                                clipApiHeaderWrapper: t
                            } = (0, g.m)();
                        return {
                            createSecretKey: (0, u.Z)(async A => await t(e, {
                                method: "POST",
                                body: JSON.stringify({
                                    orgId: A
                                })
                            })),
                            listSecretKey: (0, u.Z)(async A => await t((0, c.CB)(e, {
                                q: "findByOrgId",
                                orgId: A
                            }), {
                                method: "GET"
                            }))
                        }
                    }(), [C, K] = (0, a.useState)(""), b = (0, r.Dv)(f.Mz.currentOrgId);
                    return (0, o.Z)(async () => {
                        if (b && t) try {
                            var A, e, i, n, o;
                            let t = null === (i = await x(b)) || void 0 === i ? void 0 : null === (e = i.data) || void 0 === e ? void 0 : null === (A = e.at(0)) || void 0 === A ? void 0 : A.secretKey;
                            t || (t = null === (o = await v(b)) || void 0 === o ? void 0 : null === (n = o.data) || void 0 === n ? void 0 : n.secretKey), t ? K(t) : null == h || h()
                        } catch (A) {
                            null == h || h()
                        }
                    }, [b, t]), (0, i.jsx)(p.Vq, {
                        open: t && !!C,
                        onOpenChange: A => {
                            A || (null == h || h(), K(""))
                        },
                        children: (0, i.jsxs)(p.cZ, {
                            className: "sm:max-w-md",
                            onPointerUp: A => {
                                A.stopPropagation()
                            },
                            children: [(0, i.jsxs)(p.fK, {
                                children: [(0, i.jsx)(p.$N, {
                                    children: e("save_your_key")
                                }), (0, i.jsx)(n.ZT, {
                                    className: "text-xs font-normal",
                                    children: e("please_save_yo")
                                })]
                            }), (0, i.jsxs)("div", {
                                className: "flex flex-row gap-1",
                                children: [(0, i.jsx)(n.II, {
                                    "aria-label": "Display secret key",
                                    className: "mr-2 w-[300px]",
                                    value: C
                                }), (0, i.jsxs)(n.zx, {
                                    "aria-label": "Copy secret key",
                                    variant: "secondary",
                                    onClick: async () => {
                                        navigator.clipboard.writeText(C), n.Am.success(e("secret_key_cop"))
                                    },
                                    children: [(0, i.jsx)(l.Z, {
                                        className: "mr-1"
                                    }), e("copy")]
                                })]
                            }), (0, i.jsxs)(p.cN, {
                                className: "justify-end",
                                children: [(0, i.jsx)(n.zx, {
                                    variant: "secondary",
                                    onClick: async () => {
                                        window.open("https://help.opus.pro/api-reference/v2/introduction", "_blank")
                                    },
                                    children: e("documentation")
                                }), (0, i.jsx)(n.zx, {
                                    onClick: async () => {
                                        null == m || m(), K("")
                                    },
                                    children: e("done")
                                })]
                            })]
                        })
                    })
                }
        },
        91685: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return B
                }
            });
            var i = t(30815),
                n = t(52322),
                o = t(57992),
                l = t(25237),
                r = t.n(l),
                a = t(2784),
                s = t(98614),
                c = t(91381),
                u = t(752),
                d = t(39097),
                g = t.n(d),
                p = t(50620),
                f = t(10123),
                m = t(91117),
                h = t(55626),
                v = t(55773);
            let x = (0, m.Z)("auto-post");

            function C(A) {
                let {
                    open: e,
                    onClose: t,
                    setModal: i
                } = A, {
                    t: l
                } = (0, s.$G)("plansocial"), r = (0, u.Dv)(v.Mz.currentAccount), {
                    isBelowSm: a
                } = (0, p.G)("sm");
                return (0, n.jsx)(n.Fragment, {
                    children: (0, n.jsx)(o.Vq, {
                        open: e,
                        onOpenChange: A => !A && (null == t ? void 0 : t(A)),
                        classNames: {
                            content: (0, f.cn)("w-[420px] bg-[#09090B] p-6", a && "h-[500px] w-full overflow-y-auto z-[1300]")
                        },
                        children: (0, n.jsxs)("div", {
                            children: [(0, n.jsx)("div", {
                                className: "text-[18px] font-semibold text-white",
                                children: l("connect_facebook_account")
                            }), (0, n.jsx)("div", {
                                className: "mt-[16px] font-[14px] text-[#9B9EA3]",
                                children: (0, n.jsx)(s.cC, {
                                    i18nKey: "plansocial:your_facebook_account",
                                    components: [(0, n.jsx)(g(), {
                                        style: {
                                            textDecoration: "underline"
                                        },
                                        href: "https://www.facebook.com/help/337881706729661",
                                        target: "_blank"
                                    }, 1), (0, n.jsx)("br", {}, 2), (0, n.jsx)(g(), {
                                        style: {
                                            textDecoration: "underline"
                                        },
                                        href: "https://www.facebook.com/business/help/1199464373557428?id=418112142508425",
                                        target: "_blank"
                                    }, 3), (0, n.jsx)(g(), {
                                        style: {
                                            textDecoration: "underline"
                                        },
                                        href: "https://help.opus.pro/docs/article/how-to-connect-facebook#how-to-connect-facebook",
                                        target: "_blank"
                                    }, 4)]
                                })
                            }), (0, n.jsx)("div", {
                                style: {
                                    marginTop: 36,
                                    display: "flex",
                                    justifyContent: "flex-end"
                                },
                                children: (0, n.jsx)(o.zx, {
                                    style: {
                                        fontSize: 14,
                                        fontWeight: 600
                                    },
                                    onClick: () => {
                                        var A;
                                        if (!(null == r ? void 0 : r.orgId)) {
                                            x.warn("Cannot connect platform because currentAccount?.orgId is falsy");
                                            return
                                        }
                                        window.open((0, h.U)("FACEBOOK_PAGE", null !== (A = r.userId) && void 0 !== A ? A : "", r.orgId), "_blank", "popup=1,location=yes,width=500,height=600,status=yes"), i("connect.loading")
                                    },
                                    children: l("connect")
                                })
                            })]
                        })
                    })
                })
            }
            var K = t(50249),
                b = t(12200),
                y = t(32093);
            let w = r()(() => t.e(6497).then(t.bind(t, 56497)), {
                loadableGenerated: {
                    webpack: () => [56497]
                }
            });
            var B = (0, a.forwardRef)(function(A, e) {
                let {
                    open: t,
                    onClose: l,
                    source: r,
                    onSkip: u,
                    skip: d
                } = A, {
                    t: g
                } = (0, s.$G)("plansocial"), {
                    handleConnect: p,
                    modal: f,
                    setModal: m,
                    onConnect: h
                } = (0, K.A)({
                    open: t,
                    onClose: l,
                    source: r
                });
                (0, a.useImperativeHandle)(e, () => ({
                    connect: A => p((0, i._)({}, A))
                }));
                let v = g("subscription" === r ? "post_directly_from" : "add_social_accounts");
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(c.Vq, {
                        open: t,
                        onOpenChange: A => !A && (null == l ? void 0 : l()),
                        children: (0, n.jsxs)(c.cZ, {
                            className: "h-fit w-[450px] gap-6 max-sm:z-[1300] max-sm:max-h-[500px] max-sm:w-[calc(100vw-32px)] max-sm:overflow-y-auto sm:m-6",
                            children: [(0, n.jsx)(c.fK, {
                                children: (0, n.jsx)(c.$N, {
                                    children: v
                                })
                            }), (0, n.jsx)("div", {
                                className: "flex flex-wrap gap-4 max-sm:justify-center",
                                children: t && ["YOUTUBE", "TIKTOK_BUSINESS", "LINKEDIN", "FACEBOOK_PAGE", "INSTAGRAM_BUSINESS", "TWITTER"].map(A => (0, n.jsx)(w, {
                                    platform: A,
                                    onConnect: A => h({
                                        platform: A
                                    })
                                }, A))
                            }), d && (0, n.jsx)("div", {
                                className: "flex justify-end",
                                children: (0, n.jsx)(o.zx, {
                                    variant: "secondary",
                                    onClick: u,
                                    children: g("skip")
                                })
                            })]
                        })
                    }), (0, n.jsx)(C, {
                        open: "connect.instruction.FACEBOOK_PAGE" === f,
                        onClose: () => m(""),
                        setModal: m
                    }), (0, n.jsx)(y.default, {
                        open: "connect.instruction.YOUTUBE" === f,
                        onClose: () => m(""),
                        setModal: m
                    }), (null == f ? void 0 : f.startsWith("connect.select-sub-account.")) && (0, n.jsx)(b.Z, {
                        onClose: () => {
                            m("")
                        },
                        open: null == f ? void 0 : f.startsWith("connect.select-sub-account."),
                        modal: f
                    })]
                })
            })
        },
        12200: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return m
                }
            });
            var i = t(30815),
                n = t(52322),
                o = t(57992),
                l = t(752),
                r = t(2784),
                a = t(98614),
                s = t(27551),
                c = t(62863),
                u = t(91381),
                d = t(50620),
                g = t(25074),
                p = t(44710),
                f = t(80629);

            function m(A) {
                var e;
                let {
                    open: t,
                    onClose: m,
                    modal: h
                } = A, {
                    t: v
                } = (0, a.$G)("plansocial"), x = (0, l.Dv)(f.a.currentOrgAsset), {
                    accountListV2: C = [],
                    selectSubAccount: K,
                    refetchAccounts: b
                } = (0, g.E5)(), [y, w] = (0, r.useState)(""), [B, U] = (0, r.useState)([]), F = null == h ? void 0 : h.split(".")[2], I = RegExp(y, "i"), E = null == C ? void 0 : null === (e = C.filter(A => A.extUserId === F)) || void 0 === e ? void 0 : e.filter(A => I.test(A.extUserName)), Q = A => "".concat(A.extUserId, "-").concat(A.subAccountId), j = A => {
                    if (B.some(e => Q(e) === Q(A))) U(B.filter(e => Q(e) !== Q(A)));
                    else {
                        if ((0, s.UU)(null == x ? void 0 : x.plan) && B.length > 0) return;
                        U([...B, A])
                    }
                }, S = async () => {
                    let A = B.map(A => A.subAccountId).filter(A => E.some(e => e.subAccountId === A));
                    await K({
                        subAccountIdList: A,
                        platform: E[0].platform,
                        extUserId: F
                    }), b(), m(!1)
                }, {
                    isBelowSm: L
                } = (0, d.G)("sm");
                return (0, n.jsx)(n.Fragment, {
                    children: (0, n.jsx)(u.Vq, {
                        open: t,
                        onOpenChange: A => !A && (null == m ? void 0 : m(A)),
                        children: (0, n.jsx)(u.cZ, {
                            className: "bg-black-normal w-[497px] p-6",
                            style: (0, i._)({}, L ? {
                                width: "calc(100vw - 32px)",
                                height: "500px",
                                overflowY: "auto",
                                zIndex: 1300
                            } : {}),
                            children: (0, n.jsxs)("div", {
                                children: [(0, n.jsxs)("div", {
                                    className: "flex flex-col gap-6",
                                    children: [(0, n.jsx)("div", {
                                        className: "text-[18px] font-semibold text-white",
                                        children: v("select_account")
                                    }), (0, n.jsx)(o.II, {
                                        "aria-label": "Input keyword",
                                        onChange: w,
                                        placeholder: "Search account"
                                    }), (null == E ? void 0 : E.length) === 0 ? (0, n.jsx)("div", {
                                        className: "text-sm",
                                        children: v("no_results_ple")
                                    }) : (0, n.jsx)("div", {
                                        className: "border-input relative flex h-[360px] flex-col overflow-y-auto rounded-md border",
                                        children: E.map((A, e) => (0, n.jsxs)("div", {
                                            className: "border-muted flex h-[65px] cursor-pointer items-center gap-[8px] border-b p-2 py-4",
                                            style: {
                                                gap: 8,
                                                background: B.some(e => Q(e) === Q(A)) ? "rgba(39, 39, 42, 0.50)" : void 0
                                            },
                                            onClick: () => j(A),
                                            children: [(0, n.jsx)(p.Z, {
                                                imgSrc: A.extUserPictureLink,
                                                name: A.extUserName,
                                                platform: A.platform
                                            }), (0, n.jsx)("div", {
                                                children: A.extUserName
                                            }), (0, n.jsx)(c.Z, {
                                                options: [{
                                                    label: "",
                                                    value: Q(A)
                                                }],
                                                className: "pointer-events-none absolute right-0",
                                                value: (null == B ? void 0 : B.find(e => Q(e) === Q(A))) ? Q(A) : ""
                                            })]
                                        }, e))
                                    })]
                                }), (0, n.jsx)("div", {
                                    className: "flex justify-end",
                                    style: {
                                        marginTop: 12
                                    },
                                    children: (0, n.jsx)(o.zx, {
                                        disabled: !E.length || !B.length,
                                        onClick: S,
                                        children: v("connect")
                                    })
                                })]
                            })
                        })
                    })
                })
            }
        },
        32093: function(A, e, t) {
            "use strict";
            t.r(e), t.d(e, {
                default: function() {
                    return m
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(61528),
                l = t(752),
                r = t(98614),
                a = t(86415),
                s = t(60266),
                c = t(50620),
                u = t(10123),
                d = t(91117),
                g = t(55626),
                p = t(55773);
            let f = (0, d.Z)("auto-post");

            function m(A) {
                let {
                    open: e,
                    onClose: t,
                    setModal: d
                } = A, {
                    t: m
                } = (0, r.$G)("common"), h = (0, l.Dv)(p.Mz.currentAccount), {
                    isBelowSm: v
                } = (0, c.G)("sm");
                return (0, i.jsx)(i.Fragment, {
                    children: (0, i.jsx)(n.Vq, {
                        open: e,
                        onOpenChange: A => !A && (null == t ? void 0 : t(A)),
                        footer: null,
                        classNames: {
                            content: (0, u.cn)("w-[508px] bg-[#09090B] p-6", v && "w-full overflow-y-auto z-[1300]")
                        },
                        children: (0, i.jsxs)("div", {
                            className: "flex flex-col items-center gap-4 text-center",
                            children: [(0, i.jsxs)("div", {
                                className: "flex h-8 items-center justify-center gap-4",
                                children: [(0, i.jsx)(a.r, {
                                    height: 36
                                }), (0, i.jsx)(o.Z, {
                                    className: "rotate-90",
                                    height: 36
                                }), (0, i.jsx)(s.r, {
                                    height: 36
                                })]
                            }), (0, i.jsxs)("div", {
                                children: [(0, i.jsx)("div", {
                                    className: "text-foreground text-lg font-semibold",
                                    children: m("connect_to_youtube")
                                }), (0, i.jsx)("div", {
                                    className: "text-xs font-medium",
                                    children: (0, i.jsx)(r.cC, {
                                        i18nKey: "common:in_order_to",
                                        components: [(0, i.jsx)("span", {
                                            className: "text-foreground cursor-pointer underline",
                                            onClick: () => window.open("https://support.google.com/youtube/answer/1646861?hl=en")
                                        }, 0), (0, i.jsx)("span", {
                                            className: "text-foreground cursor-pointer underline",
                                            onClick: () => window.open("https://help.opus.pro/docs/article/scheduler-faq ")
                                        }, 1)]
                                    })
                                })]
                            }), (0, i.jsxs)("video", {
                                autoPlay: !0,
                                loop: !0,
                                muted: !0,
                                playsInline: !0,
                                width: 460,
                                children: [(0, i.jsx)("source", {
                                    src: "https://public.cdn.opus.pro/clip-web/videos/plansocial/youtube-guide.mp4",
                                    type: "video/mp4"
                                }), "not support"]
                            }), (0, i.jsx)("div", {
                                className: "flex w-full justify-end",
                                children: (0, i.jsx)(n.zx, {
                                    style: {
                                        fontSize: 14,
                                        fontWeight: 600
                                    },
                                    className: "",
                                    onClick: () => {
                                        var A;
                                        if (!(null == h ? void 0 : h.orgId)) {
                                            f.warn("Cannot connect platform because currentAccount?.orgId is falsy");
                                            return
                                        }
                                        window.open((0, g.U)("YOUTUBE", null !== (A = h.userId) && void 0 !== A ? A : "", h.orgId), "_blank", "popup=1,location=yes,width=500,height=600,status=yes"), d("connect.loading")
                                    },
                                    children: m("connect")
                                })
                            })]
                        })
                    })
                })
            }
        },
        50249: function(A, e, t) {
            "use strict";
            t.d(e, {
                A: function() {
                    return w
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(52322),
                l = t(57992),
                r = t(99913),
                a = t(752),
                s = t(2784),
                c = t(98614),
                u = t(9019),
                d = t(60266),
                g = t(55975),
                p = t(59511),
                f = t(91117),
                m = t(3250),
                h = t(2871),
                v = t(25074),
                x = t(55626),
                C = t(80629),
                K = t(55773),
                b = t(71774);
            let y = (0, f.Z)("auto-post"),
                w = A => {
                    let {
                        open: e,
                        onClose: t,
                        source: f
                    } = A, {
                        t: w
                    } = (0, c.$G)("plansocial"), B = (0, s.useRef)(null), {
                        selectedAccountListV2: U = [],
                        refetchAccounts: F,
                        deleteAccount: I
                    } = (0, v.E5)(), {
                        data: E,
                        refetch: Q
                    } = (0, u.H)(), j = null == U ? void 0 : U.filter(A => null == E ? void 0 : E.data.orgSocialAccount.some(e => e.platform === A.platform && e.enable)), [S, L] = (0, s.useState)(""), R = (0, a.Dv)(C.a.currentOrgAsset), {
                        plan: k
                    } = null != R ? R : {}, q = (0, s.useMemo)(() => {
                        if (!R) return -1;
                        let A = R.features.find(A => "SocialAccount" === A.key);
                        return A ? A.amount : -1
                    }, [R]), O = -1 !== q && (null == U ? void 0 : U.length) >= q;
                    (0, s.useEffect)(() => {
                        e && (0, g.B)("social_connection.add_account_popup.show", {
                            plan: k,
                            source: f
                        }, {
                            platform: {
                                SS: !0,
                                MP: !0
                            }
                        })
                    }, [e, k, f]);
                    let D = (0, a.Dv)(b.Z.utm),
                        P = (0, a.Dv)(K.Mz.currentAccount),
                        {
                            openUpsellWindow: N
                        } = (0, h.w)(),
                        Z = (0, p.Z)(A => {
                            let {
                                platform: e,
                                type: a,
                                params: s,
                                callback: u,
                                onConfirmReAuth: p,
                                onSuccessToast: h
                            } = A;
                            try {
                                var v, C;
                                if ((0, g.B)("social_connection.add_account_popup.click", {
                                        plan: k,
                                        platform: e
                                    }, {
                                        platform: {
                                            SS: !0,
                                            MP: !0
                                        }
                                    }), !(null == P ? void 0 : P.orgId)) {
                                    y.warn("Cannot connect platform because currentAccount?.orgId is falsy");
                                    return
                                }
                                if (O && "reauthorize" !== a) {
                                    "Enterprise" !== k ? (l.Am.warning(w("upgrade_to_business")), N({
                                        type: "Business",
                                        upsellTitle: w("upgrade_for_more"),
                                        switchType: "plan",
                                        trigger: "add-account-exceed",
                                        ads: "autopost"
                                    }, !1)) : "Enterprise" === k ? l.Am.warning(w("you_have_reached_your", {
                                        accountLimit: q
                                    })) : l.Am.warning("You have reached your limit of connected social accounts (".concat(q, ")."));
                                    return
                                }
                                if (j.some(A => A.platform === e) && ((null == R ? void 0 : R.plan) === "Starter" || (null == R ? void 0 : R.plan) === "Essential" || (null == R ? void 0 : R.plan) === "FreeTrial")) {
                                    let A = (null == R ? void 0 : R.plan) === "FreeTrial" ? "Trial" : null == R ? void 0 : R.plan;
                                    l.Vq.alert({
                                        title: w("you_already_have"),
                                        description: w("to_link_multiple", {
                                            currentPlan: A
                                        }),
                                        confirmText: w("upgrade_to_pro"),
                                        onConfirm: () => N({
                                            switchType: "plan",
                                            trigger: "add-account",
                                            ads: "autopost"
                                        }, !1)
                                    });
                                    return
                                }
                                let A = (0, n._)((0, i._)({}, D), {
                                    type: a,
                                    platform: e,
                                    plan: null == R ? void 0 : R.plan,
                                    source: f
                                });
                                (0, g.B)("user.connect.post.click", A, {
                                    platform: {
                                        SS: !0,
                                        MP: !0
                                    }
                                });
                                let K = "plansocial-".concat(e);
                                (0, g.B)("user.connect.post.channel", (0, n._)((0, i._)({}, A), {
                                    id: K,
                                    status: "start"
                                }), {
                                    platform: {
                                        SS: !0,
                                        MP: !0
                                    }
                                }), null === (v = B.current) || void 0 === v || v.close();
                                let b = new BroadcastChannel(K);
                                if (B.current = b, (0, g.B)("user.connect.post.channel", (0, n._)((0, i._)({}, A), {
                                        id: K,
                                        status: "connect"
                                    }), {
                                        platform: {
                                            SS: !0,
                                            MP: !0
                                        }
                                    }), b.onmessage = f => {
                                        let {
                                            success: v,
                                            showSubElementsSelector: x,
                                            extUserId: C
                                        } = (null == f ? void 0 : f.data) || {};
                                        if (console.log("bc.onmessage", b.name, b), b.close(), v && C) {
                                            null == Q || Q(), null == u || u(null == f ? void 0 : f.data), null == t || t();
                                            let A = () => {
                                                if (F(), x ? L("connect.select-sub-account.".concat(C)) : L(""), h) h(null == f ? void 0 : f.data);
                                                else {
                                                    var A;
                                                    l.Am.success(w("successfully_connected", {
                                                        platformName: null === (A = (0, m.k)()[e]) || void 0 === A ? void 0 : A.name
                                                    }))
                                                }
                                            };
                                            if ("reauthorize" === a) {
                                                if ((null == s ? void 0 : s.extUserId) === C) A();
                                                else {
                                                    let t = async () => {
                                                        ["FACEBOOK_PAGE", "LINKEDIN"].includes(e) || await I({
                                                            platform: e,
                                                            extUserId: C
                                                        }), (0, g.B)("social_connection.account_list.delete", {
                                                            platform: null == s ? void 0 : s.platform
                                                        }), F()
                                                    };
                                                    l.Vq.alert({
                                                        title: w("you_selected"),
                                                        description: (0, o.jsx)("div", {
                                                            children: (0, o.jsx)(c.cC, {
                                                                i18nKey: "plansocial:you_are_attemping",
                                                                components: [(0, o.jsx)("span", {
                                                                    className: "text-warn ml-1"
                                                                }, 0), (0, o.jsx)("br", {}, 1)]
                                                            })
                                                        }, 0),
                                                        confirmText: w("confirm"),
                                                        cancelText: w("cancel"),
                                                        onConfirm: async () => {
                                                            if (p) await (null == p ? void 0 : p(null == f ? void 0 : f.data));
                                                            else {
                                                                var t;
                                                                await I({
                                                                    platform: e,
                                                                    extUserId: null !== (t = null == s ? void 0 : s.extUserId) && void 0 !== t ? t : ""
                                                                })
                                                            }
                                                            A()
                                                        },
                                                        onCancel: t
                                                    })
                                                }
                                            } else A()
                                        } else {
                                            var K;
                                            let A = null == f ? void 0 : null === (K = f.data) || void 0 === K ? void 0 : K.message;
                                            if ("YOUTUBE" === e && A && (A.toLowerCase().includes("no channel") || A.toLowerCase().includes("create a channel"))) {
                                                let A = l.Vq.alert({
                                                    classNames: {
                                                        content: "w-[508px] p-6 gap-4"
                                                    },
                                                    title: (0, o.jsxs)("div", {
                                                        className: "flex flex-col items-center gap-4",
                                                        "data-exposure-id": "plansocial.no_channel_error",
                                                        children: [(0, o.jsx)("div", {
                                                            className: "flex size-12 items-center justify-center rounded-full bg-[#FF0000]",
                                                            children: (0, o.jsx)(d.r, {
                                                                width: 24,
                                                                height: 24
                                                            })
                                                        }), (0, o.jsx)("div", {
                                                            className: "text-center text-lg font-semibold",
                                                            children: w("fail_to_connect_no_channel_title")
                                                        })]
                                                    }),
                                                    description: (0, o.jsxs)("div", {
                                                        className: "flex flex-col gap-4",
                                                        children: [(0, o.jsxs)("div", {
                                                            className: "text-center text-sm text-muted-foreground",
                                                            children: [w("fail_to_connect_no_channel_description"), " ", (0, o.jsx)("span", {
                                                                className: "cursor-pointer underline",
                                                                onClick: () => window.open("https://support.google.com/youtube/answer/1646861?hl=en"),
                                                                children: w("learn_how_to_create_channel")
                                                            })]
                                                        }), (0, o.jsx)("div", {
                                                            className: "rounded-lg bg-white p-0",
                                                            children: (0, o.jsx)("img", {
                                                                src: "https://public.cdn.opus.pro/clip-web/images/plansocial/youtube-create-channel-guide.png",
                                                                alt: "YouTube create channel guide",
                                                                className: "w-full rounded-lg"
                                                            })
                                                        }), (0, o.jsxs)("div", {
                                                            className: "flex items-center justify-between gap-3",
                                                            children: [(0, o.jsx)("span", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: w("after_creating_channel_try_again")
                                                            }), (0, o.jsx)(l.zx, {
                                                                className: "shrink-0",
                                                                onClick: () => {
                                                                    A.destroy(), L("connect.instruction.".concat(e))
                                                                },
                                                                children: w("try_again")
                                                            })]
                                                        })]
                                                    }),
                                                    confirmText: ""
                                                })
                                            } else l.Vq.alert({
                                                title: (0, o.jsxs)("div", {
                                                    className: "flex flex-col items-center gap-3",
                                                    "data-exposure-id": "plansocial.failed_to_connect",
                                                    children: [(0, o.jsx)("div", {
                                                        className: "p-[10px]",
                                                        children: (0, o.jsx)("div", {
                                                            className: "flex size-10 items-center justify-center rounded-full",
                                                            style: {
                                                                backgroundColor: "rgba(255, 160, 87, 0.30)"
                                                            },
                                                            children: (0, o.jsx)(r.Z, {
                                                                width: 18,
                                                                className: "text-warn "
                                                            })
                                                        })
                                                    }), (0, o.jsx)("div", {
                                                        className: "text-base font-medium",
                                                        children: w("looks_like_we")
                                                    })]
                                                }),
                                                description: (0, o.jsxs)("div", {
                                                    className: "text-center",
                                                    children: [A, " ", w("please_try_again"), " ", (0, o.jsx)("span", {
                                                        className: "cursor-pointer underline",
                                                        onClick: () => window.open("INSTAGRAM_BUSINESS" === e ? "https://help.opus.pro/docs/article/connecting-your-instagram-account" : "YOUTUBE" === e ? "https://help.opus.pro/docs/article/connecting-youtube-channel-account" : "https://help.opus.pro/docs/article/scheduler-faq"),
                                                        children: w("go_to_the")
                                                    })]
                                                }),
                                                confirmText: w("try_again"),
                                                onConfirm: () => {
                                                    ["FACEBOOK_PAGE", "YOUTUBE"].includes(e) ? L("connect.instruction.".concat(e)) : L("")
                                                }
                                            })
                                        }(0, g.B)("user.connect.post", (0, n._)((0, i._)({}, A), {
                                            success: v
                                        }), {
                                            platform: {
                                                SS: !0,
                                                MP: !0
                                            }
                                        })
                                    }, ["FACEBOOK_PAGE", "YOUTUBE"].includes(e)) {
                                    (0, g.B)("user.connect.post.channel", {
                                        open: L,
                                        status: "openIns"
                                    }), L("connect.instruction.".concat(e));
                                    return
                                } {
                                    let A = (0, x.U)(e, null !== (C = P.userId) && void 0 !== C ? C : "", null == P ? void 0 : P.orgId);
                                    (0, g.B)("user.connect.post.channel", {
                                        link: A,
                                        open: window.open,
                                        status: "open"
                                    }), window.open(A, "_blank", "popup=1,location=yes,width=500,height=600,status=yes"), L("connect.loading")
                                }
                            } catch (A) {
                                (0, g.B)("user.connect.post.error", {
                                    message: null == A ? void 0 : A.message
                                })
                            }
                        });
                    return {
                        handleConnect: A => {
                            Z(A)
                        },
                        modal: S,
                        healthyAccountList: j,
                        setModal: L,
                        onConnect: Z,
                        refetchHealthyCheck: Q,
                        deleteAccount: I
                    }
                }
        },
        70025: function(A, e, t) {
            "use strict";
            t.d(e, {
                m: function() {
                    return b
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(52322),
                l = t(24744),
                r = t(57992),
                a = t(42119),
                s = t(96577),
                c = t.n(s),
                u = t(2784),
                d = t(98614),
                g = t(97101),
                p = t(30464),
                f = t(10123);
            let m = {
                    LANDSCAPE: "landscape",
                    PORTRAIT: "portrait",
                    SQUARE: "square",
                    FOUR_FIVE: "four-five"
                },
                h = {
                    SHORTS: "shorts",
                    MIDFORM: "midform",
                    LONGFORM: "longform",
                    CUSTOM: "custom"
                },
                v = {
                    shorts: [{
                        label: "<30s",
                        value: "under-30s"
                    }, {
                        label: "30-59s",
                        value: "30-59s"
                    }, {
                        label: "60-89s",
                        value: "60-89s"
                    }, {
                        label: "90s-3m",
                        value: "90s-3m"
                    }],
                    midform: [{
                        label: "3-5m",
                        value: "3-5m"
                    }, {
                        label: "5-10m",
                        value: "5-10m"
                    }],
                    longform: [{
                        label: "10-15m",
                        value: "10-15m"
                    }],
                    custom: [{
                        label: "Auto (0m-3m)",
                        value: "auto"
                    }, {
                        label: "<30s",
                        value: "under-30s"
                    }, {
                        label: "30s-59s",
                        value: "30-59s"
                    }, {
                        label: "60s-89s",
                        value: "60-89s"
                    }, {
                        label: "90s-3m",
                        value: "90s-3m"
                    }, {
                        label: "3m-5m",
                        value: "3-5m"
                    }, {
                        label: "5m-10m",
                        value: "5-10m"
                    }, {
                        label: "10m-15m",
                        value: "10-15m"
                    }]
                },
                x = {
                    auto: "[[0, 180]]",
                    "under-30s": "[[0, 30]]",
                    "30-59s": "[[30, 59]]",
                    "60-89s": "[[60, 89]]",
                    "90s-3m": "[[90, 180]]",
                    "3-5m": "[[180, 300]]",
                    "5-10m": "[[300, 600]]",
                    "10-15m": "[[600, 900]]"
                },
                C = {
                    "[[0, 180]]": "auto",
                    "[[0, 30]]": "under-30s",
                    "[[30, 59]]": "30-59s",
                    "[[60, 89]]": "60-89s",
                    "[[90, 180]]": "90s-3m",
                    "[[180, 300]]": "3-5m",
                    "[[300, 600]]": "5-10m",
                    "[[600, 900]]": "10-15m"
                },
                K = A => {
                    if (!A) return {
                        duration: h.SHORTS,
                        clipLength: ["under-30s"],
                        aspectRatio: m.LANDSCAPE,
                        importMode: l.Eq.ALL,
                        captionStyleId: void 0,
                        brandTemplateId: void 0
                    };
                    let e = ["under-30s"];
                    if (A.clipDurations && A.clipDurations.length > 0) {
                        let t = A.clipDurations.map(A => C["[[".concat(A[0], ", ").concat(A[1], "]]")] || "under-30s");
                        e = 1 === t.length ? t[0] : t
                    }
                    let t = h.SHORTS;
                    Array.isArray(e) && (e.includes("3-5m") || e.includes("5-10m") ? t = h.MIDFORM : e.includes("10-15m") ? t = h.LONGFORM : e.length > 4 && (t = h.CUSTOM));
                    let i = m.LANDSCAPE;
                    if (A.aspectRatio) switch (A.aspectRatio) {
                        case m.LANDSCAPE:
                            i = m.LANDSCAPE;
                            break;
                        case m.PORTRAIT:
                            i = m.PORTRAIT;
                            break;
                        case m.SQUARE:
                            i = m.SQUARE;
                            break;
                        case m.FOUR_FIVE:
                            i = m.FOUR_FIVE
                    }
                    let n = A.enableCaption ? A.brandTemplateId : "none",
                        o = A.enableCaption ? void 0 : A.brandTemplateId;
                    return {
                        duration: t,
                        clipLength: e,
                        aspectRatio: i,
                        importMode: A.importVideoType || l.Eq.ALL,
                        captionStyleId: n,
                        brandTemplateId: o
                    }
                },
                b = A => {
                    let {
                        acct: e,
                        playlists: t,
                        open: s,
                        cancelTxt: C,
                        confirmTxt: b,
                        onClose: y,
                        onConfirm: w,
                        limit: B = 5,
                        existingSettings: U,
                        isUpdate: F = !1,
                        hasExistingProjects: I = !0
                    } = A, {
                        t: E
                    } = (0, d.$G)("clip"), {
                        t: Q
                    } = (0, d.$G)("common"), {
                        getBrandTemplatesV2: j,
                        getFancyTemplates: S
                    } = (0, g.Z)(), [L, R] = (0, u.useState)("selection"), [k, q] = (0, u.useState)(null), [O, D] = (0, u.useState)(() => {
                        let A = K(U);
                        return I || (A.importMode = l.Eq.ALL), A
                    }), [P, N] = (0, u.useState)(void 0), [Z, M] = (0, u.useState)(void 0), [V, T] = (0, u.useState)([]), [Y, H] = (0, u.useState)([]), [_, W] = (0, u.useState)(!1), [G, J] = (0, u.useState)("caption"), z = (0, u.useCallback)(A => {
                        J(A)
                    }, []), X = (0, u.useCallback)(() => null != P ? P : O.captionStyleId, [P, O.captionStyleId]), $ = (0, u.useCallback)(() => null != Z ? Z : O.brandTemplateId, [Z, O.brandTemplateId]), [AA, Ae] = (0, u.useState)([]), At = A => [...v[A] || []], Ai = A => {
                        let e = At(A);
                        return "custom" === A ? ["auto"] : e.map(A => A.value)
                    }, An = (0, u.useCallback)(async () => {
                        W(!0);
                        try {
                            let [A, e] = await Promise.all([j(), S()]), t = {
                                templateId: "none",
                                name: "No captions",
                                needNewTag: !1,
                                gifUrl: "".concat("https://public.cdn.opus.pro/clip-web", "/images/fancy-template-thumbnails/preset-fancy-None.png"),
                                imgUrl: "".concat("https://public.cdn.opus.pro/clip-web", "/images/fancy-template-thumbnails/preset-fancy-None.png")
                            }, o = e.filter(A => A.imgUrl || A.gifUrl);
                            T([t, ...o]), H(A), D(e => {
                                var o, l, r;
                                return (0, n._)((0, i._)({}, e), {
                                    captionStyleId: null !== (l = e.captionStyleId) && void 0 !== l ? l : t.templateId,
                                    brandTemplateId: null !== (r = e.brandTemplateId) && void 0 !== r ? r : null === (o = A.find(A => A.isDefault)) || void 0 === o ? void 0 : o.templateId
                                })
                            })
                        } catch (A) {
                            console.error("Failed to fetch templates:", A)
                        } finally {
                            W(!1)
                        }
                    }, [j, S]);
                    (0, u.useEffect)(() => {
                        U && (D(K(U)), !U.enableCaption && U.brandTemplateId && J("brand"))
                    }, [U]), (0, u.useEffect)(() => {
                        s && "settings" === L && 0 === V.length && An()
                    }, [s, L, V.length, An]), (0, u.useEffect)(() => {
                        s ? 1 === t.length ? (q(t[0]), R("settings")) : (R("selection"), q(null)) : (R("selection"), q(null), T([]), H([]))
                    }, [t, s]);
                    let {
                        extUserName: Ao,
                        extUserPictureLink: Al,
                        extUserProfileLink: Ar
                    } = e || {}, Aa = Ao ? (0, p.v)(Ao) : "", As = A => {
                        if (B <= 0) {
                            let A = E("reached_limit");
                            r.Am.warning(A);
                            return
                        }
                        q(A), R("settings"), N(void 0), M(void 0)
                    }, Ac = (0, u.useCallback)(() => {
                        void 0 !== P && D(A => (0, n._)((0, i._)({}, A), {
                            captionStyleId: P
                        })), void 0 !== Z && D(A => (0, n._)((0, i._)({}, A), {
                            brandTemplateId: Z
                        })), N(void 0), M(void 0)
                    }, [P, Z]), Au = () => {
                        if (!k) return null;
                        let A = (0, i._)({}, O);
                        void 0 !== P && (A.captionStyleId = P), void 0 !== Z && (A.brandTemplateId = Z);
                        let e = [];
                        if (Array.isArray(A.clipLength)) e = A.clipLength.flatMap(A => {
                            let e = x[A];
                            return e ? JSON.parse(e) : [
                                [0, 30]
                            ]
                        });
                        else {
                            let t = x[A.clipLength];
                            e = t ? JSON.parse(t) : [
                                [0, 30]
                            ]
                        }
                        return {
                            playlistId: k.id,
                            playlistName: k.name,
                            playlistThumbnailUrl: k.thumbnailUrl,
                            playlistSettings: {
                                clipDurations: e,
                                aspectRatio: A.aspectRatio,
                                importVideoType: A.importMode,
                                enableCaption: !!A.captionStyleId && "none" !== A.captionStyleId || !!A.brandTemplateId,
                                brandTemplateId: A.captionStyleId && "none" !== A.captionStyleId ? A.captionStyleId : A.brandTemplateId
                            }
                        }
                    }, Ad = "selection" === L ? (0, o.jsx)("div", {
                        className: "flex w-full items-center justify-start",
                        children: (0, o.jsx)(r.zx, {
                            variant: "secondary",
                            onClick: y,
                            children: C || E("cancel")
                        })
                    }) : (0, o.jsxs)("div", {
                        className: "flex w-full items-center justify-between",
                        children: [(0, o.jsx)(r.zx, {
                            variant: "secondary",
                            onClick: () => {
                                R("selection"), q(null)
                            },
                            children: Q("back")
                        }), (0, o.jsx)(r.zx, {
                            autoLoading: !0,
                            onClick: async () => {
                                Ac();
                                let A = Au();
                                if (A) try {
                                    await w(A), F || (R("selection"), q(null))
                                } catch (A) {
                                    console.error("Failed to save playlist settings:", A)
                                }
                            },
                            className: "w-32",
                            children: "brand" === G ? E("save") : F ? E("update_settings") : E("save")
                        })]
                    });
                    return (0, o.jsx)(r.Vq, {
                        title: "selection" === L ? E("select_youtube_playlist_to_index") : E("playlist_settings"),
                        description: "selection" === L ? E("all_existing_public_videos_text") : E("select_settings_for_imported_videos"),
                        open: s,
                        classNames: {
                            content: (0, f.cn)("max-sm:max-w-[85%]", "selection" === L ? "max-w-[920px]" : "max-w-[788px]", "settings" === L ? "h-[800px] min-h-[640px] max-h-[90vh] sm:max-h-[85vh] lg:max-h-[80vh] flex flex-col" : "")
                        },
                        onCancel: y,
                        footer: Ad,
                        children: "selection" === L ? (0, o.jsxs)("div", {
                            className: "flex flex-col",
                            children: [(0, o.jsxs)("div", {
                                className: "bg-popover flex cursor-pointer gap-1 self-start rounded-full px-2 py-1.5",
                                onClick: () => {
                                    Ar && window.open(Ar, "_blank")
                                },
                                children: [(0, o.jsxs)(r.qE, {
                                    className: "relative size-5 overflow-visible",
                                    children: [(0, o.jsx)(r.F$, {
                                        className: "rounded-full",
                                        src: Al,
                                        alt: "avatar"
                                    }), (0, o.jsx)(r.Q5, {
                                        className: "text-xxs",
                                        children: Aa
                                    })]
                                }), (0, o.jsx)("div", {
                                    className: "text-sm",
                                    children: Ao
                                })]
                            }), (0, o.jsx)(r.xr, {
                                className: "h-[500px] max-h-[60vh] sm:max-h-[55vh] lg:max-h-[50vh] py-4",
                                viewPortClassName: "[&>div]:!block",
                                children: (0, o.jsx)("div", {
                                    className: "my-4 grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-4",
                                    children: t.map(A => {
                                        let e = B <= 0;
                                        return (0, o.jsx)("div", {
                                            className: (0, f.cn)("relative min-h-[160px] w-[194px] max-md:w-full", e ? "cursor-not-allowed opacity-50" : "cursor-pointer"),
                                            children: (0, o.jsxs)("div", {
                                                className: "relative flex flex-col items-center gap-3",
                                                onClick: () => {
                                                    As(A)
                                                },
                                                children: [(0, o.jsxs)("div", {
                                                    className: "absolute inset-x-0 -top-2 flex h-2 flex-col items-center justify-center bg-transparent opacity-50",
                                                    children: [(0, o.jsx)("div", {
                                                        className: "bg-secondary h-1 w-5/6 rounded-t-full"
                                                    }), (0, o.jsx)("div", {
                                                        className: "bg-secondary h-1 w-[90%] rounded-t-full"
                                                    })]
                                                }), (0, o.jsxs)(r.oM, {
                                                    ratio: 192 / 113,
                                                    children: [(0, o.jsx)(c(), {
                                                        src: A.thumbnailUrl,
                                                        alt: A.name,
                                                        width: 192,
                                                        height: 113,
                                                        className: "border-primary size-full rounded-md border object-cover"
                                                    }), e && (0, o.jsx)("div", {
                                                        className: "absolute inset-0 bg-black/50 rounded-md"
                                                    })]
                                                }), (0, o.jsx)("div", {
                                                    className: "text-foreground w-full truncate text-sm",
                                                    children: A.name
                                                })]
                                            })
                                        }, A.id)
                                    })
                                })
                            })]
                        }) : k ? (0, o.jsx)("div", {
                            className: "flex flex-col gap-8 h-full",
                            children: (0, o.jsxs)("div", {
                                className: "flex-1 flex gap-4 items-start",
                                children: [(0, o.jsxs)("div", {
                                    className: "w-[360px] flex flex-col gap-4 min-h-[400px] flex-shrink",
                                    children: [(0, o.jsxs)("div", {
                                        className: "rounded-lg flex flex-col gap-4",
                                        children: [(0, o.jsx)(r.oM, {
                                            ratio: 360 / 202,
                                            children: (0, o.jsx)(c(), {
                                                src: k.thumbnailUrl,
                                                alt: k.name,
                                                fill: !0,
                                                className: "rounded-lg object-cover"
                                            })
                                        }), (0, o.jsx)("div", {
                                            className: "flex flex-col gap-1",
                                            children: (0, o.jsx)(r.u, {
                                                content: k.name,
                                                children: (0, o.jsx)("div", {
                                                    className: "text-foreground text-2xl font-medium leading-tight truncate",
                                                    children: k.name
                                                })
                                            })
                                        })]
                                    }), (0, o.jsxs)("div", {
                                        className: "flex flex-col gap-3 flex-1 min-h-0",
                                        children: [(0, o.jsxs)("div", {
                                            className: "h-9 flex justify-between items-center",
                                            children: [(0, o.jsx)("div", {
                                                className: "text-muted-foreground text-sm",
                                                children: E("duration")
                                            }), (0, o.jsx)(r.Ph, {
                                                value: O.duration,
                                                onChange: A => {
                                                    let e = Ai(A);
                                                    D(t => (0, n._)((0, i._)({}, t), {
                                                        duration: A,
                                                        clipLength: e,
                                                        aspectRatio: "custom" === A ? "landscape" : t.aspectRatio
                                                    }))
                                                },
                                                options: [{
                                                    label: "Shorts (clips < 30s-3 mins)",
                                                    value: h.SHORTS
                                                }, {
                                                    label: "Midform (3-10 mins)",
                                                    value: h.MIDFORM
                                                }, {
                                                    label: "Longform (10 mins+)",
                                                    value: h.LONGFORM
                                                }, {
                                                    label: "Custom",
                                                    value: h.CUSTOM
                                                }],
                                                className: "w-56 border-0 bg-background-100",
                                                textAlign: "right",
                                                suffix: (0, o.jsx)(a.Wg, {
                                                    className: "size-4"
                                                })
                                            })]
                                        }), (0, o.jsxs)("div", {
                                            className: "flex justify-between items-center gap-4",
                                            children: [(0, o.jsx)("div", {
                                                className: "text-muted-foreground text-sm w-20",
                                                children: E("clip_length")
                                            }), (0, o.jsx)(r.Ph, {
                                                multiple: "custom" === O.duration,
                                                value: Array.isArray(O.clipLength) ? O.clipLength : [O.clipLength],
                                                onChange: A => D(e => (0, n._)((0, i._)({}, e), {
                                                    clipLength: A
                                                })),
                                                options: At(O.duration),
                                                className: "w-48 border-0 bg-background-100",
                                                textAlign: "right",
                                                renderLabel: A => {
                                                    var e;
                                                    return (0, o.jsx)("div", {
                                                        className: "truncate",
                                                        children: null === (e = A.value) || void 0 === e ? void 0 : e.map(A => {
                                                            let e = At(O.duration).find(e => e.value === A);
                                                            return (null == e ? void 0 : e.label) || A
                                                        }).join(", ")
                                                    })
                                                },
                                                suffix: (0, o.jsx)(a.Wg, {
                                                    className: "size-4"
                                                })
                                            })]
                                        }), (0, o.jsxs)("div", {
                                            className: "h-9 flex justify-between items-center",
                                            children: [(0, o.jsx)("div", {
                                                className: "text-muted-foreground text-sm",
                                                children: E("aspect_ratio")
                                            }), (0, o.jsx)(r.Ph, {
                                                value: O.aspectRatio,
                                                onChange: A => D(e => (0, n._)((0, i._)({}, e), {
                                                    aspectRatio: A
                                                })),
                                                options: [{
                                                    label: "16:9",
                                                    value: m.LANDSCAPE
                                                }, {
                                                    label: "9:16",
                                                    value: m.PORTRAIT
                                                }, {
                                                    label: "1:1",
                                                    value: m.SQUARE
                                                }, {
                                                    label: "4:5",
                                                    value: m.FOUR_FIVE
                                                }],
                                                className: (0, f.cn)("w-32 border-0 bg-background-100", "brand" === G ? "text-white/50" : ""),
                                                textAlign: "right",
                                                disabled: "brand" === G,
                                                suffix: "brand" === G ? null : (0, o.jsx)(a.Wg, {
                                                    className: "size-4"
                                                })
                                            })]
                                        }), k && (0, o.jsxs)("div", {
                                            className: "flex flex-col gap-3",
                                            children: [(0, o.jsxs)("div", {
                                                className: "h-9 flex justify-between items-center",
                                                children: [(0, o.jsx)("div", {
                                                    className: "text-muted-foreground text-sm",
                                                    children: E("import_video")
                                                }), (0, o.jsx)(r.Ph, {
                                                    value: O.importMode,
                                                    onChange: A => D(e => (0, n._)((0, i._)({}, e), {
                                                        importMode: A
                                                    })),
                                                    options: I ? [{
                                                        label: "Import all videos",
                                                        value: l.Eq.ALL
                                                    }, {
                                                        label: "Import new videos only",
                                                        value: l.Eq.NEW
                                                    }] : [{
                                                        label: "Import all videos",
                                                        value: l.Eq.ALL
                                                    }],
                                                    className: "w-48 border-0 bg-background-100",
                                                    textAlign: "right",
                                                    suffix: (0, o.jsx)(a.Wg, {
                                                        className: "size-4"
                                                    })
                                                })]
                                            }), (0, o.jsx)("div", {
                                                className: "text-center text-muted-foreground text-sm",
                                                children: O.importMode === l.Eq.ALL ? E("import_all_video_type") : E("import_new_video_type")
                                            })]
                                        })]
                                    })]
                                }), (0, o.jsx)("div", {
                                    className: "flex-1 flex flex-col gap-4 self-start min-h-0",
                                    children: (0, o.jsxs)("div", {
                                        className: "w-[364px] h-full px-4 bg-popover rounded-lg inline-flex flex-col justify-start items-center overflow-hidden",
                                        children: [(0, o.jsxs)("div", {
                                            className: "self-stretch py-3 border-b border-border inline-flex justify-start items-center gap-1",
                                            children: [(0, o.jsxs)(r.zx, {
                                                variant: "caption" === G ? "secondary" : "ghost",
                                                size: "sm",
                                                className: "gap-2",
                                                onClick: () => z("caption"),
                                                children: [(0, o.jsx)(a.YS, {
                                                    className: "size-4"
                                                }), E("caption_style")]
                                            }), (0, o.jsxs)(r.zx, {
                                                variant: "brand" === G ? "secondary" : "ghost",
                                                size: "sm",
                                                className: "gap-2",
                                                onClick: () => z("brand"),
                                                children: [(0, o.jsx)(a.Pl, {
                                                    className: "size-4"
                                                }), E("brand_templates")]
                                            })]
                                        }), (0, o.jsx)("div", {
                                            className: "w-[364px] inline-flex justify-center items-start gap-2.5",
                                            children: (0, o.jsx)(r.xr, {
                                                className: "w-[364px] h-[570px] min-h-[350px] max-h-[60vh] sm:max-h-[58vh] lg:max-h-[50vh] overflow-y-auto",
                                                children: (0, o.jsx)("div", {
                                                    className: "grid grid-cols-2 justify-items-center overflow-hidden pt-4 pb-8 px-4 gap-y-2 gap-x-6",
                                                    children: _ ? (0, o.jsx)("div", {
                                                        className: "col-span-2 flex items-center justify-center h-32",
                                                        children: (0, o.jsx)("div", {
                                                            className: "animate-spin rounded-full size-8 border-y-2 border-primary"
                                                        })
                                                    }) : "caption" === G ? V.map(A => (0, o.jsxs)("div", {
                                                        className: "rounded-md inline-flex flex-col justify-start items-center gap-2 cursor-pointer",
                                                        onClick: () => {
                                                            N(A.templateId), M(void 0)
                                                        },
                                                        children: [(0, o.jsx)("div", {
                                                            className: (0, f.cn)("h-[111px] w-[146px] bg-white/5 rounded-xl flex justify-center items-center gap-2.5 overflow-hidden", X() === A.templateId ? "outline outline-1 outline-offset-[-1px] outline-primary" : ""),
                                                            children: "none" === A.templateId ? (0, o.jsx)("div", {
                                                                className: "text-center text-muted-foreground text-sm flex items-center justify-center h-full",
                                                                children: (0, o.jsx)("svg", {
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                    width: "48",
                                                                    height: "48",
                                                                    viewBox: "0 0 48 48",
                                                                    fill: "none",
                                                                    children: (0, o.jsx)("path", {
                                                                        d: "M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM11.3633 14.1914C9.25727 16.9007 8 20.3027 8 24C8 32.8366 15.1634 40 24 40C27.6972 40 31.0974 38.7407 33.8066 36.6348L11.3633 14.1914ZM24 8C20.3027 8 16.9007 9.25727 14.1914 11.3633L36.6348 33.8066C38.7407 31.0974 40 27.6972 40 24C40 15.1634 32.8366 8 24 8Z",
                                                                        fill: "white",
                                                                        fillOpacity: "0.5"
                                                                    })
                                                                })
                                                            }) : A.imgUrl || A.gifUrl ? (0, o.jsx)(c(), {
                                                                src: A.imgUrl || A.gifUrl,
                                                                alt: "".concat(A.name, " caption style"),
                                                                width: 146,
                                                                height: 111,
                                                                className: "object-contain rounded",
                                                                onError: A => {
                                                                    A.currentTarget.style.display = "none"
                                                                }
                                                            }) : (0, o.jsx)(r.ZT, {
                                                                variant: "body-sm",
                                                                className: "text-center text-muted-foreground text-sm flex items-center justify-center h-4",
                                                                children: A.name
                                                            })
                                                        }), (0, o.jsx)("div", {
                                                            className: "self-stretch inline-flex justify-center items-start gap-2 h-4",
                                                            children: (0, o.jsx)(r.ZT, {
                                                                variant: "body-sm",
                                                                className: (0, f.cn)("text-center justify-center text-xs font-semibold leading-none", X() === A.templateId ? "text-foreground" : "opacity-50 text-foreground"),
                                                                children: A.name
                                                            })
                                                        })]
                                                    }, A.templateId)) : Y.length > 0 ? Y.map(A => {
                                                        var e, t, i, n, l, s, c, u, d, g, p;
                                                        return (0, o.jsxs)("div", {
                                                            className: "rounded-md inline-flex flex-col justify-start items-center gap-2 cursor-pointer",
                                                            onClick: () => {
                                                                M(A.templateId), N("none")
                                                            },
                                                            children: [(0, o.jsxs)("div", {
                                                                className: (0, f.cn)("w-[146px] h-[111px] px-1 py-3 bg-white/20 rounded-lg inline-flex flex-col justify-between items-start", $() === A.templateId ? "outline outline-1 outline-offset-[-1px] outline-primary" : ""),
                                                                children: [(0, o.jsxs)("div", {
                                                                    className: "w-28 h-3 px-1.5 inline-flex justify-start items-center gap-1",
                                                                    children: [(null === (t = A.preferences) || void 0 === t ? void 0 : null === (e = t.font) || void 0 === e ? void 0 : e.color) && (0, o.jsx)("div", {
                                                                        className: "size-4 rounded-full",
                                                                        style: {
                                                                            backgroundColor: null === (n = A.preferences) || void 0 === n ? void 0 : null === (i = n.font) || void 0 === i ? void 0 : i.color
                                                                        }
                                                                    }), (null === (l = Object.keys(null === (s = A.preferences) || void 0 === s ? void 0 : s.highlightColor)) || void 0 === l ? void 0 : l.length) > 0 && Object.values(null === (c = A.preferences) || void 0 === c ? void 0 : c.highlightColor).map((A, e) => (0, o.jsx)("div", {
                                                                        className: "size-4 rounded-full",
                                                                        style: {
                                                                            backgroundColor: A
                                                                        }
                                                                    }, e))]
                                                                }), (0, o.jsxs)("div", {
                                                                    className: "w-28 h-8 px-1.5 flex flex-col justify-center items-start",
                                                                    children: [(0, o.jsx)(r.ZT, {
                                                                        variant: "label-lg",
                                                                        className: "justify-center text-Text-secondary/50 text-[13px] leading-none",
                                                                        children: E("font")
                                                                    }), (0, o.jsx)(r.ZT, {
                                                                        className: "self-stretch justify-center text-primary text-[15px] leading-tight",
                                                                        children: (0, o.jsx)(r.u, {
                                                                            content: (null === (d = A.preferences) || void 0 === d ? void 0 : null === (u = d.font) || void 0 === u ? void 0 : u.family) || E("default_font"),
                                                                            children: (0, o.jsx)("span", {
                                                                                className: "truncate inline-block max-w-full",
                                                                                children: (null === (p = A.preferences) || void 0 === p ? void 0 : null === (g = p.font) || void 0 === g ? void 0 : g.family) || E("default_font")
                                                                            })
                                                                        })
                                                                    })]
                                                                }), (0, o.jsx)("div", {
                                                                    className: "w-28 h-4 px-1 inline-flex justify-start items-center gap-0.5",
                                                                    children: (() => {
                                                                        var e;
                                                                        let t = (null === (e = A.preferences) || void 0 === e ? void 0 : e.layoutAspectRatio) || "portrait",
                                                                            i = {
                                                                                portrait: {
                                                                                    ratio: "9:16",
                                                                                    icon: (0, o.jsx)(a.cM, {
                                                                                        className: "size-6 text-white"
                                                                                    })
                                                                                },
                                                                                landscape: {
                                                                                    ratio: "16:9",
                                                                                    icon: (0, o.jsx)(a.Kk, {
                                                                                        className: "size-6 text-white"
                                                                                    })
                                                                                },
                                                                                square: {
                                                                                    ratio: "1:1",
                                                                                    icon: (0, o.jsx)(a.zp, {
                                                                                        className: "size-6 text-white"
                                                                                    })
                                                                                },
                                                                                four_five: {
                                                                                    ratio: "4:5",
                                                                                    icon: (0, o.jsx)(a.zp, {
                                                                                        className: "size-6 text-white"
                                                                                    })
                                                                                }
                                                                            },
                                                                            {
                                                                                ratio: n,
                                                                                icon: l
                                                                            } = i[t] || i.portrait;
                                                                        return (0, o.jsxs)(o.Fragment, {
                                                                            children: [(0, o.jsx)("div", {
                                                                                className: "size-4 flex items-center justify-center",
                                                                                children: l
                                                                            }), (0, o.jsx)(r.ZT, {
                                                                                className: "justify-center text-primary text-sm font-medium leading-none",
                                                                                children: n
                                                                            })]
                                                                        })
                                                                    })()
                                                                })]
                                                            }), (0, o.jsx)("div", {
                                                                className: "self-stretch inline-flex justify-center items-start gap-2",
                                                                children: (0, o.jsx)("div", {
                                                                    className: (0, f.cn)("text-center justify-center text-xs font-semibold leading-none", $() === A.templateId ? "text-foreground" : "opacity-50 text-foreground"),
                                                                    children: A.name
                                                                })
                                                            })]
                                                        }, A.templateId)
                                                    }) : (0, o.jsxs)("div", {
                                                        className: "col-span-2 flex flex-col items-center justify-center h-[40vh] text-center",
                                                        children: [(0, o.jsx)(a.Pl, {
                                                            className: "size-12 text-muted-foreground mb-2"
                                                        }), (0, o.jsx)(r.ZT, {
                                                            variant: "body-sm",
                                                            className: "text-muted-foreground",
                                                            children: E("empty_brand_templates")
                                                        })]
                                                    })
                                                })
                                            })
                                        })]
                                    })
                                })]
                            })
                        }) : null
                    })
                }
        },
        62863: function(A, e, t) {
            "use strict";
            var i = t(30815),
                n = t(4670),
                o = t(83286),
                l = t(52322),
                r = t(57992),
                a = t(10123);
            e.Z = A => {
                let {
                    options: e,
                    onChange: t,
                    wrapperClassName: s,
                    direction: c,
                    optionClassName: u,
                    labelClassName: d,
                    radioOptionClassName: g,
                    onHover: p
                } = A, f = (0, o._)(A, ["options", "onChange", "wrapperClassName", "direction", "optionClassName", "labelClassName", "radioOptionClassName", "onHover"]);
                return (0, l.jsx)(r.Ee, (0, n._)((0, i._)({
                    onValueChange: t
                }, f), {
                    className: (0, a.cn)("column" === c ? "flex-col" : "flex-row", s),
                    children: null == e ? void 0 : e.map(A => (0, l.jsxs)("div", (0, n._)((0, i._)({
                        className: (0, a.cn)("flex items-center gap-2 py-1", u)
                    }, p ? {
                        onMouseOver: () => null == p ? void 0 : p(A.value)
                    } : {}), {
                        children: [(0, l.jsx)(r.mJ, {
                            value: null == A ? void 0 : A.value,
                            id: null == A ? void 0 : A.id,
                            className: g
                        }), (0, l.jsx)(r.__, {
                            htmlFor: null == A ? void 0 : A.id,
                            className: d,
                            children: null == A ? void 0 : A.label
                        })]
                    }), (null == A ? void 0 : A.id) || (null == A ? void 0 : A.value)))
                }))
            }
        },
        31037: function(A, e, t) {
            "use strict";
            t.d(e, {
                Ad: function() {
                    return s
                },
                DQ: function() {
                    return c
                },
                L1: function() {
                    return u
                },
                LN: function() {
                    return p
                },
                MO: function() {
                    return r
                },
                RD: function() {
                    return l
                },
                TG: function() {
                    return o
                },
                Wv: function() {
                    return m
                },
                Xg: function() {
                    return f
                },
                hP: function() {
                    return a
                },
                rq: function() {
                    return g
                }
            });
            var i = t(30815),
                n = t(28094);

            function o(A) {
                var e, t, i, n, o;
                let l = null == A ? void 0 : null === (i = A.name) || void 0 === i ? void 0 : null === (t = i.split) || void 0 === t ? void 0 : null === (e = t.call(i, ".")) || void 0 === e ? void 0 : e.pop();
                return null !== (o = null == l ? void 0 : null === (n = l.toLowerCase) || void 0 === n ? void 0 : n.call(l)) && void 0 !== o ? o : "unknown"
            }

            function l(A) {
                if (0 === A) return "0 Byte";
                let e = Number.parseInt(Math.floor(Math.log(A) / Math.log(1024)).toString());
                return "".concat(A / Math.pow(1024, e)).concat(["Bytes", "KB", "MB", "GB", "TB"][e])
            }
            let r = async A => new Promise((e, t) => {
                    let i = document.createElement("video"),
                        n = URL.createObjectURL(A);
                    i.src = n, i.height = 10, i.width = 10, i.addEventListener("loadedmetadata", () => {
                        let A = i.duration;
                        URL.revokeObjectURL(n), e(A), document.body.removeChild(i)
                    }), i.addEventListener("error", () => {
                        t(Error("failed to check duration")), document.body.removeChild(i)
                    }), document.body.appendChild(i)
                }),
                a = A => new Promise(e => {
                    let t = (0, n.tq)(),
                        i = document.createElement("video"),
                        o = document.createElement("canvas"),
                        l = URL.createObjectURL(A);
                    i.setAttribute("muted", ""), i.setAttribute("playsinline", ""), i.setAttribute("webkit-playsinline", ""), i.muted = !0, i.src = l, i.width = 10, i.height = 10;
                    let r = setTimeout(() => {
                            a("Failed to generate thumbnail timeout")
                        }, (t ? 1e4 : 5e3) + 1e3 * Math.min(A.size / 5e7, 10)),
                        a = (A, t) => {
                            clearTimeout(r);
                            let n = i.duration;
                            i.removeEventListener("loadedmetadata", s), i.removeEventListener("canplay", c), i.removeEventListener("seeked", u), i.removeEventListener("error", d), i.pause(), URL.revokeObjectURL(l), i.remove(), o.remove(), t ? e([t, n, void 0]) : n > 0 ? e(["", n, A]) : e(["", 0, A])
                        },
                        s = () => {
                            var A;
                            let e = t ? 640 : 1280,
                                n = i.videoWidth,
                                l = i.videoHeight;
                            (n > e || l > e) && (n > l ? (l = l / n * e, n = e) : (n = n / l * e, l = e)), o.width = n, o.height = l, null === (A = i.play()) || void 0 === A || A.catch(() => {})
                        },
                        c = () => {
                            try {
                                i.currentTime = .1
                            } catch (A) {
                                a("Failed to set video currentTime")
                            }
                        },
                        u = () => {
                            try {
                                let A = o.getContext("2d");
                                if (!A) {
                                    a("Failed to get canvas context");
                                    return
                                }
                                try {
                                    A.drawImage(i, 0, 0, o.width, o.height)
                                } catch (A) {
                                    a("Failed to draw image on canvas");
                                    return
                                }
                                o.toBlob(A => {
                                    A ? a("", URL.createObjectURL(A)) : a("Failed to generate blob")
                                }, "image/jpeg", .75)
                            } catch (A) {
                                a("Failed to generate thumbnail: ".concat(A))
                            }
                        },
                        d = A => {
                            a("Failed to load video: ".concat(A.message))
                        };
                    i.addEventListener("loadedmetadata", s), i.addEventListener("canplay", c), i.addEventListener("seeked", u), i.addEventListener("error", d)
                });

            function s(A) {
                return new Promise((e, t) => {
                    let i = new FileReader;
                    i.onload = function(A) {
                        var i;
                        let n = new Image;
                        n.src = null == A ? void 0 : null === (i = A.target) || void 0 === i ? void 0 : i.result, n.onload = function() {
                            e({
                                width: n.width,
                                height: n.height
                            })
                        }, n.onerror = function(A) {
                            t(A)
                        }
                    }, i.readAsDataURL(A)
                })
            }

            function c() {
                let A = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                    e = arguments.length > 1 ? arguments[1] : void 0;
                return !A || !!A.split(",").map(A => A.trim()).includes(e)
            }
            let u = {
                    avi: "video/x-msvideo",
                    flv: "video/x-flv",
                    m4v: "video/x-m4v",
                    mkv: "video/x-matroska",
                    mov: "video/quicktime",
                    mp4: "video/mp4",
                    mpeg: "video/mpeg",
                    ogv: "video/ogg",
                    webm: "video/webm",
                    wmv: "video/x-ms-wmv"
                },
                d = {
                    jpg: "image/jpeg",
                    jpeg: "image/jpeg",
                    png: "image/png",
                    gif: "image/gif",
                    bmp: "image/bmp",
                    webp: "image/webp"
                },
                g = Object.values(d).join(","),
                p = Object.values(u).join(",");
            (0, i._)({}, u, d);
            let f = {
                    "video/x-msvideo": "avi",
                    "video/x-flv": "flv",
                    "video/x-m4v": "m4v",
                    "video/x-matroska": "mkv",
                    "video/quicktime": "mov",
                    "video/mp4": "mp4",
                    "video/mpeg": "mpeg",
                    "video/ogg": "ogv",
                    "video/webm": "webm",
                    "video/x-ms-wmv": "wmv",
                    "image/jpeg": "jpg",
                    "image/png": "png",
                    "image/gif": "gif",
                    "image/bmp": "bmp",
                    "image/webp": "webp"
                },
                m = A => Object.values(u).includes(A.type)
        },
        5174: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return F
                }
            });
            var i = t(30815),
                n = t(52322),
                o = t(57992),
                l = t(21190),
                r = t(72085),
                a = t(752),
                s = t(2784),
                c = t(98614),
                u = t(28094),
                d = t(10313),
                g = t(59511),
                p = t(44724),
                f = t(10123),
                m = t(89802),
                h = t(44619),
                v = t(2871),
                x = t(7902),
                C = t(80629),
                K = t(66776),
                b = t(13243),
                y = t(46052),
                w = t(67423),
                B = t(71302),
                U = t(29048);

            function F(A) {
                let {
                    hideAddCreditButton: e,
                    className: t
                } = A, {
                    t: F
                } = (0, c.$G)("subscription"), I = (0, a.Dv)(b.T.totalCreditInSecond), E = (0, a.Dv)(b.T.creditItems), Q = (0, a.Dv)(y.o.userSubscription), j = (0, a.Dv)(C.a.currentOrgAsset), S = null == j ? void 0 : j.plan, L = (0, h.s0)(F, S), R = (0, a.Dv)(C.a.payStatus), k = (0, h.ro)(S, Q), q = "Active" === k, O = "Upgrading" === k, {
                    openUpsellWindow: D
                } = (0, v.w)(), P = (0, u.tq)(), N = (0, p.t)(), [Z, M] = (0, s.useState)(!1), V = (0, m.Z)() || !1, T = (0, a.Dv)(K.N.showDiscountPromotionNoti), Y = (0, s.useMemo)(() => {
                    var A;
                    return (null === (A = N.query) || void 0 === A ? void 0 : A.modal) === "upsell"
                }, [N.query]), H = I ? (0, d.f$)(I) : 0, _ = (0, s.useMemo)(() => (0, n.jsx)("div", {
                    className: (0, f.cn)("flex flex-row items-center rounded-md cursor-pointer font-sans space-x-1"),
                    children: void 0 === I ? "Loading..." : (0, n.jsx)(w.Z, {
                        className: "px-4 py-2",
                        credit: H
                    })
                }), [H, I]), W = (E || []).reduce((A, e) => A + e.creditFrozen, 0), G = (E || []).find(A => "TrialTime" === A.type), J = G ? G.creditAvailable : 1 / 0, z = (0, g.Z)(() => {
                    N.query.modal && (delete N.query.modal, N.replace({
                        pathname: N.pathname,
                        query: (0, i._)({}, N.query)
                    })), D({
                        switchType: "Essential" === S ? "plan" : "pack",
                        trigger: "upgrade-from-header",
                        ads: "background"
                    })
                }), X = T ? (0, n.jsxs)("div", {
                    className: "relative",
                    children: [(0, n.jsx)("span", {
                        className: "animate-breath absolute inset-0 z-0 inline-flex size-full rounded-md bg-white opacity-75"
                    }), (0, n.jsxs)(o.zx, {
                        className: "relative z-10 w-full",
                        onClick: z,
                        children: [F("common:you_have_a_discount"), !P && (0, n.jsx)(B.P, {
                            icon: r.Z,
                            stroke: !1,
                            textClassName: "text-sm font-medium"
                        })]
                    })]
                }) : (0, n.jsx)(o.zx, {
                    variant: "secondary",
                    className: "text-primary",
                    onClick: z,
                    children: F("common:add_more_credits")
                });
                (0, s.useEffect)(() => {
                    Y && void 0 !== S && !Z && (z(), M(!0))
                }, [z, Y, S, Z, M]);
                let $ = () => 0 === (E || []).length ? (0, n.jsxs)("div", {
                    className: "flex flex-col space-y-4",
                    children: [(0, n.jsx)(o.ZT, {
                        variant: "headings",
                        children: "Upload credits"
                    }), (0, n.jsx)(o.ZT, {
                        className: "text-sm",
                        children: "No credits"
                    })]
                }) : (0, n.jsxs)("div", {
                    className: "flex flex-col space-y-4",
                    children: [(0, n.jsx)("div", {
                        children: (0, n.jsx)(x.Z, {
                            title: L,
                            footer: (0, n.jsx)("div", {
                                className: "bg-accent rounded px-2 py-1",
                                children: (0, n.jsx)(o.ZT, {
                                    variant: "headings",
                                    className: (0, f.cn)("text-xs text-destructive", O ? "text-warn" : q ? "text-success" : "text-[#E5484D]"),
                                    children: F("common:".concat(k))
                                })
                            }),
                            titleClassName: "text-sm font-medium",
                            stackClassName: "justify-start gap-1"
                        })
                    }), W > 0 && (0, n.jsxs)("div", {
                        className: "flex flex-col space-y-2",
                        children: [(0, n.jsxs)("div", {
                            className: "flex flex-row items-center justify-between",
                            children: [(0, n.jsx)(o.ZT, {
                                variant: "headings",
                                className: "text-sm",
                                children: "Frozen"
                            }), (0, n.jsx)(w.Z, {
                                credit: (0, d.f$)(W)
                            })]
                        }), (0, n.jsx)(o.ZT, {
                            className: "text-muted-foreground text-xs",
                            children: "If the project fails, the upload time will be auto-refunded"
                        })]
                    }), (E || []).map((A, e) => {
                        let {
                            creditAvailable: t,
                            expireAt: i,
                            isActive: r
                        } = A;
                        return r ? (0, n.jsxs)("div", {
                            className: "flex flex-col space-y-1",
                            children: [(0, n.jsxs)("div", {
                                className: "flex items-center justify-between",
                                children: [(0, n.jsx)(o.ZT, {
                                    variant: "headings",
                                    className: "text-sm",
                                    children: F("common:credits")
                                }), (0, n.jsx)(w.Z, {
                                    credit: (0, d.f$)(t),
                                    grey: 0 === t
                                })]
                            }), (0, n.jsx)(o.ZT, {
                                variant: "default",
                                className: "text-xs",
                                children: F("common:expires_in", {
                                    date: Math.max((0, l.Z)(new Date(i), new Date), 0)
                                })
                            })]
                        }, e) : (0, n.jsx)(n.Fragment, {})
                    }), !V && X, (0, n.jsx)(o.zx, {
                        variant: "secondary",
                        onClick: () => window.open("https://help.opus.pro/docs/article/how-are-credits-consumed", "_blank"),
                        children: F("common:learn_how_credits")
                    })]
                });
                return P ? (0, n.jsx)("div", {
                    className: "flex cursor-pointer flex-row items-center gap-x-0 rounded-md",
                    children: (0, n.jsx)(U.Z, {
                        storageId: "run_out_of_credits",
                        init: J < 1800 && "trial" === R,
                        title: "You're low on Credits!",
                        content: "Thanks for sticking with us! Like the experience you have? Upgrade it with exclusive queues, auto-post to social platforms and so much more!",
                        side: "bottom",
                        children: A => A ? _ : (0, n.jsx)(o.u, {
                            portal: !0,
                            content: $(),
                            align: "center",
                            className: "border-muted bg-popover mt-2 max-h-[412px] w-[260px] overflow-auto rounded-md border px-4 py-3 z-[10000]",
                            children: _
                        })
                    })
                }) : (0, n.jsxs)("div", {
                    className: (0, f.cn)("flex gap-2 justify-end items-center py-2", t),
                    children: [(0, n.jsx)(U.Z, {
                        storageId: "run_out_of_credits",
                        init: J < 1800 && "trial" === R,
                        title: "You're low on Credits!",
                        content: "Thanks for sticking with us! Like the experience you have? Upgrade it with exclusive queues, auto-post to social platforms and so much more!",
                        side: "bottom",
                        children: A => A ? _ : (0, n.jsx)(o.u, {
                            content: $(),
                            align: "end",
                            alignOffset: -36,
                            className: "border-muted bg-popover mt-2 max-h-[412px] w-[280px] overflow-auto rounded-md border px-4 py-3 z-[10000]",
                            portal: !0,
                            children: _
                        })
                    }), !e && X]
                })
            }
        },
        72821: function(A, e, t) {
            "use strict";
            t.r(e), t.d(e, {
                FreePlanBar: function() {
                    return _
                },
                default: function() {
                    return W
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(752),
                l = t(2784),
                r = t(98614),
                a = t(5077),
                s = t(74123),
                c = t(89671),
                u = t(59511),
                d = t(44724),
                g = t(10123),
                p = t(91117),
                f = t(85682),
                m = t(89802),
                h = t(2871),
                v = t(80629),
                x = t(82561),
                C = t(62258),
                K = t(50620);
            t(17029);
            var b = t(1332),
                y = t(86139),
                w = t(62981),
                B = t(42119),
                U = t(74603),
                F = A => {
                    let {
                        className: e,
                        sourcePage: t
                    } = A, n = (0, o.b9)(U.B.openModal), [{
                        features: l
                    }] = (0, c.Ae)("opus_search_demos", "vidSummit", y.X), r = () => {
                        n(t)
                    };
                    return (0, i.jsxs)("button", {
                        onClick: r,
                        onKeyDown: A => {
                            ("Enter" === A.key || " " === A.key) && (A.preventDefault(), r())
                        },
                        className: (0, g.cn)("flex items-center justify-center relative text-white transition-colors", e),
                        style: {
                            width: "224px",
                            height: "38px",
                            borderRadius: "999px",
                            background: w.Ct,
                            padding: "0px 10px",
                            gap: "6px"
                        },
                        onMouseEnter: A => {
                            A.currentTarget.style.background = w.kB
                        },
                        onMouseLeave: A => {
                            A.currentTarget.style.background = w.Ct
                        },
                        "aria-label": "Open search modal",
                        children: [(0, i.jsx)(B.Dc, {
                            width: 18,
                            height: 18,
                            className: "text-white"
                        }), (0, i.jsx)("span", {
                            className: "text-sm font-medium",
                            children: "Search"
                        }), (0, i.jsx)("span", {
                            className: (0, g.cn)("text-xs ml-auto", (null == l ? void 0 : l.hasDemoAccess) ? "text-yellow-400 font-semibold" : "text-white/50"),
                            children: "⌘K"
                        })]
                    })
                },
                I = t(71774),
                E = t(5174),
                Q = t(30815),
                j = t(4670),
                S = t(44900),
                L = t(60571),
                R = t(77349),
                k = t(55975),
                q = t(75117),
                O = t(85411),
                D = t(22108);
            let P = (A, e) => !!A && (A instanceof Set ? A.has(e) : Object.prototype.hasOwnProperty.call(A, e)),
                N = A => {
                    var e;
                    let {
                        notification: t,
                        viewed: l,
                        onRead: a,
                        onClick: s
                    } = A, {
                        t: c
                    } = (0, r.$G)("clip"), u = (0, o.Dv)(D.Q.isUploading), d = null === (e = t.link) || void 0 === e ? void 0 : e.url, p = () => {
                        d && (!u || window.confirm(c("changes_not_saved"))) && ((0, k.B)("notification.click_link", {
                            url: d,
                            key: t.key
                        }), window.open(d, "_blank", "noopener,noreferrer")), s()
                    };
                    return (0, i.jsx)("div", {
                        className: (0, g.cn)("flex flex-row justify-between items-center rounded-md cursor-pointer", d ? "cursor-pointer" : "cursor-default"),
                        onClick: () => {
                            l && p()
                        },
                        onMouseEnter: a,
                        children: (0, i.jsxs)("div", {
                            className: " flex flex-1 flex-col",
                            children: [(0, i.jsxs)("div", {
                                className: "flex flex-row items-center justify-between",
                                children: [(0, i.jsx)(n.ZT, {
                                    className: "text-primary text-sm",
                                    children: t.title
                                }), d && (0, i.jsx)(S.Z, {
                                    width: 16,
                                    height: 16,
                                    className: "text-muted-foreground shrink-0"
                                })]
                            }), (0, i.jsxs)("div", {
                                className: "flex flex-row items-center justify-between",
                                children: [(0, i.jsx)(n.ZT, {
                                    className: "text-xs font-normal",
                                    children: "string" == typeof t.text ? t.text : t.text[0]
                                }), (0, i.jsx)("div", {
                                    className: "shrink-0 basis-4",
                                    children: !l && (0, i.jsx)("div", {
                                        className: "m-auto size-2 rounded-full bg-[#E31B0C]"
                                    })
                                })]
                            })]
                        })
                    })
                },
                Z = A => {
                    let {
                        onClickItem: e
                    } = A, {
                        t
                    } = (0, r.$G)("clip"), [n, a] = (0, q.l)("notif"), s = (0, l.useMemo)(() => Array.isArray(n) ? n : [], [n]), [c] = (0, o.KO)(O.R.viewedNotifications), u = (A, e) => {
                        P(c.notif, A.key) || (a(e), (0, k.B)("notification.viewed", {
                            key: A.key
                        }))
                    };
                    return (0, i.jsxs)("div", {
                        className: "z-10 font-sans",
                        children: [(0, i.jsx)("div", {
                            className: "border-muted sticky top-0 flex flex-row border-b px-4 py-2",
                            children: (0, i.jsx)("div", {
                                className: "text-primary text-lg font-medium",
                                children: t("common:news")
                            })
                        }), (0, i.jsx)("div", {
                            className: "flex max-h-[350px] min-h-[200px] flex-col overflow-y-auto px-4",
                            children: s.length > 0 ? (0, i.jsx)("div", {
                                className: "my-5 flex flex-col gap-y-6",
                                children: s.map((A, t) => (0, i.jsx)(N, {
                                    notification: A,
                                    viewed: P(c.notif, A.key),
                                    onRead: () => u(A, t),
                                    onClick: () => {
                                        e()
                                    }
                                }, A.key))
                            }) : (0, i.jsxs)("div", {
                                className: "text-muted-foreground flex flex-1 flex-col items-center justify-center",
                                children: [(0, i.jsx)(L.Z, {
                                    width: 24,
                                    height: 24,
                                    strokeWidth: 2
                                }), (0, i.jsx)("div", {
                                    className: "mt-2",
                                    children: "Your notifications will appear here"
                                })]
                            })
                        })]
                    })
                };

            function M() {
                let [A] = (0, q.l)("notif"), e = (0, l.useMemo)(() => Array.isArray(A) ? A : [], [A]), [t, r] = (0, o.KO)(O.R.viewedNotifications), {
                    isAuthenticated: a
                } = (0, f.a)(), [s, c] = (0, l.useState)(0), [u, d] = (0, l.useState)(!1);
                return (0, l.useEffect)(() => {
                    a && d(!1)
                }, [a]), (0, l.useEffect)(() => {
                    c(e.filter(A => !P(t.notif, A.key)).length)
                }, [A, e, t]), (0, i.jsx)(n.J2, {
                    open: u,
                    side: "bottom",
                    align: "end",
                    onOpenChange: A => {
                        A || (r(async A => {
                            let t = await A;
                            return (0, j._)((0, Q._)({}, t), {
                                notif: (() => {
                                    let A = new Set(t.notif);
                                    return e.forEach(e => {
                                        A.add(e.key)
                                    }), A
                                })()
                            })
                        }), d(!1))
                    },
                    className: "w-[320px] p-0",
                    content: (0, i.jsx)(Z, {
                        onClickItem: () => d(!1)
                    }),
                    children: (0, i.jsxs)(n.zx, {
                        "aria-label": "notifications",
                        size: "lg",
                        variant: "ghost",
                        className: (0, g.cn)("relative bg-background rounded-md p-0 w-9 h-9", u && "bg-accent cursor-default"),
                        onClick: () => {
                            d(!0), (0, k.B)("notification.click_exposure", {
                                count: s
                            })
                        },
                        children: [(0, i.jsx)(R.Z, {
                            strokeWidth: "2.5",
                            className: "text-primary",
                            width: 16,
                            height: 16
                        }), s > 0 && (0, i.jsx)("div", {
                            className: "text-xxs text-primary absolute right-1 top-1 flex size-[14px] flex-row items-center justify-center rounded-full bg-[#E31B0C]",
                            children: s
                        })]
                    })
                })
            }
            var V = t(70733);

            function T() {
                (0, I.y)();
                let A = (0, d.t)(),
                    e = (0, m.U)(),
                    [{
                        features: {
                            disableViewNotifications: t,
                            disableViewCredits: n
                        }
                    }] = (0, c.Ae)("opus_search_demos", "vidSummit", y.X),
                    o = (0, w.UT)(A.pathname);
                return (0, i.jsx)("div", {
                    className: (0, g.cn)("ml-[60px] bg-background z-40", (0, b.cm)() ? "staging-watermark" : ""),
                    children: (0, i.jsxs)("div", {
                        className: "box-border flex h-[60px] items-center justify-end gap-x-0 py-3 pr-4 sm:gap-2 sm:pl-3 sm:pr-6",
                        children: [(0, i.jsx)("div", {
                            className: "flex flex-1 flex-col items-start justify-center gap-2",
                            id: a.g2
                        }), (0, i.jsxs)("div", {
                            className: "bg-background z-30 flex items-center gap-2",
                            children: [e && (0, i.jsx)("div", {
                                className: (0, g.cn)(t && "animate-glow-pulse"),
                                children: (0, i.jsx)(F, {
                                    className: "max-sm:hidden",
                                    sourcePage: o
                                })
                            }), !t && (0, i.jsxs)(i.Fragment, {
                                children: [(0, i.jsx)(V.Z, {}), (0, i.jsx)(M, {})]
                            })]
                        }), !n && (0, i.jsx)(E.Z, {
                            hideAddCreditButton: !!e
                        })]
                    })
                })
            }
            var Y = t(33282);
            let H = (0, p.Z)("dashboard-layout"),
                _ = A => {
                    let {
                        className: e
                    } = A, {
                        t
                    } = (0, r.$G)("clip"), l = (0, o.Dv)(v.a.currentOrgAsset), a = null == l ? void 0 : l.plan, {
                        openUpsellWindow: s
                    } = (0, h.w)();
                    return "FreePlan" !== a ? null : (0, i.jsx)("div", {
                        className: (0, g.cn)("relative flex flex-row justify-center mb-6 sm:mx-auto", e),
                        children: (0, i.jsxs)("div", {
                            className: "border-muted flex flex-row items-center gap-4 rounded-md border pl-4",
                            children: [(0, i.jsx)("div", {
                                className: " text-primary font-sans text-sm font-medium sm:text-nowrap",
                                children: t("free_plan_limit_hint")
                            }), (0, i.jsx)(n.zx, {
                                "aria-label": t("common:upgrade"),
                                variant: "secondary",
                                className: "gap-2",
                                onClick: () => {
                                    s({
                                        switchType: "plan",
                                        trigger: "free-plan-bar",
                                        ads: "background"
                                    })
                                },
                                children: t("common:upgrade")
                            })]
                        })
                    })
                };

            function W(A) {
                var e, t, n;
                let {
                    children: r
                } = A, p = (0, o.Dv)(x.g.topBannersHeight), h = (0, o.Dv)(v.a.currentOrgAsset), b = null == h ? void 0 : h.isEnterprise, y = null == h ? void 0 : h.plan, w = "FreePlan" === y || "FreeTrial" === y, {
                    isBelowSm: B
                } = (0, K.G)("sm");
                (0, l.useEffect)(() => {
                    H.info("init-dashboard-layout")
                }, []);
                let U = decodeURIComponent(null !== (n = (0, d.t)().query.back_to) && void 0 !== n ? n : "").includes(s.Z.authOauth),
                    F = "/lp-embed" === window.location.pathname,
                    I = null === (e = window.location.pathname) || void 0 === e ? void 0 : e.startsWith("/affiliate"),
                    E = "/dashboard" === window.location.pathname,
                    Q = null === (t = window.location.pathname) || void 0 === t ? void 0 : t.startsWith("/clip"),
                    [j] = (0, c.Ek)("clip_anything_ban"),
                    S = (0, o.Dv)(C.Z.featureUsed("is_cat_user")),
                    {
                        updateBrevoCATAttributes: L
                    } = function() {
                        let A = (0, o.b9)(C.Z.featureUsed("is_cat_user")),
                            e = (0, f.a)();
                        return {
                            updateBrevoCATAttributes: async () => {
                                var t;
                                (null === (t = e.user) || void 0 === t ? void 0 : t.email) && A(!0)
                            }
                        }
                    }(),
                    R = (0, m.Z)();
                (0, l.useEffect)(() => {
                    b && k && q(!1)
                }, [R]), (0, l.useEffect)(() => {
                    S || j || L()
                }, [S, j]);
                let [k, q] = (0, o.KO)(C.Z.featureUsed("sidebar_close"));
                (0, l.useEffect)(() => {
                    (B || !E) && q(!0)
                }, []), (0, l.useEffect)(() => {
                    E && w && !k && q(!0)
                }, [w, E]);
                let O = (0, u.Z)(A => {
                    q(!A)
                });
                return U ? (0, i.jsx)("div", {
                    className: (0, g.cn)("w-screen h-screen relative font-sans bg-background flex flex-col"),
                    children: r
                }) : (0, i.jsx)("div", {
                    className: (0, g.cn)("w-screen relative font-sans bg-background flex flex-col"),
                    style: F ? {
                        height: "0px"
                    } : p > 0 ? {
                        height: "calc(100dvh - ".concat(p, "px)")
                    } : {
                        height: "100dvh"
                    },
                    children: I || F ? r : (0, i.jsxs)(i.Fragment, {
                        children: [(0, i.jsx)(T, {}), (0, i.jsx)(Y.Z, {
                            open: !k,
                            onOpenChange: O
                        }), (0, i.jsxs)("div", {
                            id: a.UU,
                            className: (0, g.cn)("flex-1 relative flex flex-col bg-background self-end overflow-x-hidden overflow-y-auto w-full"),
                            children: [(0, i.jsx)(_, {
                                className: (0, g.cn)(Q && B && "-bottom-20 z-30")
                            }), (0, i.jsx)("div", {
                                className: (0, g.cn)("relative flex flex-col flex-1 w-full px-6 max-md:px-3 md:pt-4 mx-0 md:mx-auto", k ? "md:pl-[108px]" : "md:pl-[268px]"),
                                children: r
                            })]
                        })]
                    })
                })
            }
        },
        33282: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return eV
                }
            });
            var i, n, o, l, r, a, s, c, u, d, g, p, f, m, h, v, x, C, K, b, y, w, B, U, F, I, E, Q = t(52322),
                j = t(35191),
                S = t(57992),
                L = t(83614),
                R = t(53866),
                k = t(36628),
                q = t(9082),
                O = t(1234),
                D = t(78035),
                P = t(189),
                N = t(3682),
                Z = t(45008),
                M = t(31489),
                V = t(752),
                T = t(2784),
                Y = t(98614);
            let H = ["title", "titleId"];

            function _() {
                return (_ = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let W = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: r
                } = A, a = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, H);
                return T.createElement("svg", _({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "none",
                    ref: e,
                    "aria-labelledby": r
                }, a), t ? T.createElement("title", {
                    id: r
                }, t) : null, i || (i = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M7 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V7C2.5 7.27614 2.72386 7.5 3 7.5H7C7.27614 7.5 7.5 7.27614 7.5 7V3C7.5 2.72386 7.27614 2.5 7 2.5ZM3 1C1.89543 1 1 1.89543 1 3V7C1 8.10457 1.89543 9 3 9H7C8.10457 9 9 8.10457 9 7V3C9 1.89543 8.10457 1 7 1H3Z",
                    fill: "white"
                })), n || (n = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M7 12.5H3C2.72386 12.5 2.5 12.7239 2.5 13V17C2.5 17.2761 2.72386 17.5 3 17.5H7C7.27614 17.5 7.5 17.2761 7.5 17V13C7.5 12.7239 7.27614 12.5 7 12.5ZM3 11C1.89543 11 1 11.8954 1 13V17C1 18.1046 1.89543 19 3 19H7C8.10457 19 9 18.1046 9 17V13C9 11.8954 8.10457 11 7 11H3Z",
                    fill: "white"
                })), o || (o = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M17 2.5H13C12.7239 2.5 12.5 2.72386 12.5 3V7C12.5 7.27614 12.7239 7.5 13 7.5H17C17.2761 7.5 17.5 7.27614 17.5 7V3C17.5 2.72386 17.2761 2.5 17 2.5ZM13 1C11.8954 1 11 1.89543 11 3V7C11 8.10457 11.8954 9 13 9H17C18.1046 9 19 8.10457 19 7V3C19 1.89543 18.1046 1 17 1H13Z",
                    fill: "white"
                })), l || (l = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M15.0038 11.0001C15.418 11.0001 15.7538 11.3359 15.7538 11.7501V14.25L18.2537 14.25C18.6679 14.25 19.0037 14.5858 19.0037 15C19.0037 15.4142 18.6679 15.75 18.2537 15.75L15.7538 15.75V18.2499C15.7538 18.6641 15.418 18.9999 15.0038 18.9999C14.5896 18.9999 14.2538 18.6641 14.2538 18.2499V15.75H11.7539C11.3397 15.75 11.0039 15.4142 11.0039 15C11.0039 14.5858 11.3397 14.25 11.7539 14.25H14.2538V11.7501C14.2538 11.3359 14.5896 11.0001 15.0038 11.0001Z",
                    fill: "white"
                })))
            });
            t.p;
            let G = ["title", "titleId"];

            function J() {
                return (J = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let z = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, G);
                return T.createElement("svg", J({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "none",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, r || (r = T.createElement("path", {
                    d: "M5 1.5C5 0.671573 5.67157 0 6.5 0H13.5C14.3284 0 15 0.671573 15 1.5H5Z",
                    fill: "white"
                })), a || (a = T.createElement("path", {
                    d: "M3 5C3 4.17157 3.67157 3.5 4.5 3.5H15.5C16.3284 3.5 17 4.17157 17 5H3Z",
                    fill: "white"
                })), s || (s = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M16 8.5H4C3.17157 8.5 2.5 9.17157 2.5 10V17C2.5 17.8284 3.17157 18.5 4 18.5H16C16.8284 18.5 17.5 17.8284 17.5 17V10C17.5 9.17157 16.8284 8.5 16 8.5ZM4 7C2.34315 7 1 8.34315 1 10V17C1 18.6569 2.34315 20 4 20H16C17.6569 20 19 18.6569 19 17V10C19 8.34315 17.6569 7 16 7H4Z",
                    fill: "white"
                })))
            });
            t.p;
            let X = ["title", "titleId"];

            function $() {
                return ($ = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let AA = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, X);
                return T.createElement("svg", $({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 95,
                    height: 24,
                    viewBox: "0 0 95 24",
                    fill: "none",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, c || (c = T.createElement("g", {
                    clipPath: "url(#clip0_5723_57184)"
                }, T.createElement("path", {
                    d: "M0 12.1233C0 8.60323 2.6057 6.00488 6.12385 6.00488C9.642 6.00488 12.1986 8.60323 12.1986 12.1233C12.1986 15.6433 9.59292 18.2417 6.12385 18.2417C2.65478 18.2417 0 15.6433 0 12.1233ZM6.12385 15.934C8.08705 15.934 9.52376 14.3115 9.52376 12.1233C9.52376 9.93508 8.08482 8.31252 6.12385 8.31252C4.16288 8.31252 2.68825 9.93508 2.68825 12.1233C2.68825 14.3115 4.10934 15.934 6.12385 15.934Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M13.5676 9.4907H14.9954C15.5888 9.4907 16.0707 9.97746 16.0707 10.5769C16.5437 9.94366 17.4918 9.35323 18.4913 9.35323C20.9787 9.35323 22.6541 11.0614 22.6541 13.7972C22.6541 16.5331 20.9787 18.2412 18.4913 18.2412C17.494 18.2412 16.5459 17.8311 16.0886 17.1979V21.2137H13.5855L13.5676 9.48844V9.4907ZM18.1009 16.0869C19.3011 16.0869 20.131 15.1629 20.131 13.7792C20.131 12.3955 19.3011 11.4896 18.1009 11.4896C16.9006 11.4896 16.0886 12.4136 16.0886 13.7792C16.0886 15.1449 16.9006 16.0869 18.1009 16.0869Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M23.9559 15.0306V9.49364H26.4433V14.4154C26.4433 15.4227 27.0189 16.038 27.9157 16.038C29.0825 16.038 29.7607 15.0306 29.7607 13.2345V9.49138H32.2638V18.1045H29.7607V17.1467C29.3547 17.6943 28.3909 18.2397 27.1215 18.2397C25.2609 18.2397 23.9581 17.0092 23.9581 15.0261L23.9559 15.0306Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M33.6176 15.1982H35.8508C35.9355 15.9171 36.375 16.3272 37.1871 16.3272C37.863 16.3272 38.2691 16.0365 38.2691 15.5588C38.2691 14.0894 33.7693 15.1306 33.7693 11.9012C33.7693 10.4837 34.9539 9.35472 36.8814 9.35472C38.9629 9.35472 40.2479 10.4319 40.4688 12.1581H38.2356C38.0995 11.5249 37.5931 11.1508 36.8814 11.1508C36.3728 11.1508 36.0025 11.3739 36.0025 11.748C36.0025 13.1317 40.5535 12.0049 40.5535 15.4731C40.5535 17.0799 39.1481 18.2427 37.1871 18.2427C35.0209 18.2427 33.718 16.9605 33.6176 15.2004V15.1982Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M46.3448 18.2587C43.4265 18.2587 41.611 16.5855 41.3904 13.9221H44.0033C44.173 15.1855 44.9704 15.9538 46.3448 15.9538C47.278 15.9538 48.0075 15.5611 48.0075 14.6733C48.0075 12.5903 41.8994 13.8879 41.8994 9.51712C41.8994 7.43417 43.7997 6.03415 46.0903 6.03415C48.7201 6.03415 50.349 7.38295 50.6204 9.79029H48.0075C47.8379 8.90248 47.0404 8.33906 46.0394 8.33906C45.1571 8.33906 44.5802 8.74882 44.5802 9.38053C44.5802 11.2757 50.7053 9.87566 50.7053 14.5025C50.7053 16.8757 48.805 18.2587 46.3448 18.2587Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M56.0776 18.2587C53.312 18.2587 51.6153 16.3977 51.6153 13.8025C51.6153 11.2245 53.4477 9.38053 55.9588 9.38053C58.8602 9.38053 60.5908 11.6001 60.1836 14.4001H54.0924C54.296 15.6123 55.0935 16.1928 56.0776 16.1928C56.9598 16.1928 57.5198 15.766 57.6555 15.2538H60.1666C59.8103 17.0636 58.4529 18.2587 56.0776 18.2587ZM54.1773 12.6074H57.5876C57.5367 11.805 56.909 11.2586 55.9588 11.2586C55.0426 11.2586 54.4318 11.7025 54.1773 12.6074Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M64.1292 18.2587C62.3646 18.2587 61.1939 17.1318 61.1939 15.6977C61.1939 14.0245 62.3137 13.1025 64.8588 12.8294L66.4367 12.6757V12.5391C66.4367 11.7537 65.8937 11.2586 65.0624 11.2586C64.2989 11.2586 63.739 11.6854 63.6371 12.4196H61.2109C61.4484 10.6269 63.0263 9.38053 65.0624 9.38053C67.319 9.38053 68.9308 10.5757 68.9308 12.8976V18.1221H66.4367V17.2001C66.0464 17.8148 65.1472 18.2587 64.1292 18.2587ZM66.4367 14.4513L64.9436 14.6391C64.0443 14.7416 63.6371 15.0318 63.6371 15.5952C63.6371 16.1074 64.0613 16.4148 64.7061 16.4148C65.7919 16.4148 66.4367 15.5269 66.4367 14.4513Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M70.5304 18.1221V9.51712H72.0743C72.6085 9.51712 73.0415 9.95283 73.0415 10.4903C73.4996 9.80737 74.3649 9.38053 75.4508 9.38053C75.824 9.38053 76.1294 9.43175 76.4179 9.55127V11.9245C75.9937 11.7708 75.6544 11.7367 75.2472 11.7367C74.1104 11.7367 73.0415 12.5903 73.0415 14.9635V18.1221H70.5304Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M81.2128 18.2587C78.6168 18.2587 76.7674 16.3977 76.7674 13.8025C76.7674 11.2074 78.6168 9.38053 81.1958 9.38053C83.5882 9.38053 85.1152 10.644 85.4036 12.8294H82.8586C82.7398 12.0269 82.0781 11.5147 81.2128 11.5147C80.1269 11.5147 79.2955 12.4196 79.2955 13.8025C79.2955 15.1855 80.1099 16.1245 81.2128 16.1245C82.129 16.1245 82.7568 15.5611 82.8755 14.8611H85.4715C85.1661 16.8757 83.5542 18.2587 81.2128 18.2587Z",
                    fill: "white"
                }), T.createElement("path", {
                    d: "M86.6523 18.1221V6.03415H89.1634V10.4562C89.5706 9.92688 90.5377 9.38053 91.8102 9.38053C93.6935 9.38053 95 10.6098 95 12.6415V18.1221H92.4889V13.1708C92.4889 12.1976 91.8951 11.583 91.0298 11.583C89.8421 11.583 89.1634 12.5733 89.1634 14.3489V18.1221H86.6523Z",
                    fill: "white"
                }))), u || (u = T.createElement("defs", null, T.createElement("clipPath", {
                    id: "clip0_5723_57184"
                }, T.createElement("rect", {
                    width: 95,
                    height: 24,
                    fill: "white"
                })))))
            });
            t.p;
            var Ae = t(86415);
            let At = ["title", "titleId"];

            function Ai() {
                return (Ai = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let An = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, At);
                return T.createElement("svg", Ai({
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, d || (d = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M15 2.5H5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5ZM5 1C2.79086 1 1 2.79086 1 5V15C1 17.2091 2.79086 19 5 19H15C17.2091 19 19 17.2091 19 15V5C19 2.79086 17.2091 1 15 1H5Z",
                    fill: "currentColor"
                })), g || (g = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M6 15.75C5.58579 15.75 5.25 15.4142 5.25 15V10C5.25 9.58579 5.58579 9.25 6 9.25C6.41421 9.25 6.75 9.58579 6.75 10V15C6.75 15.4142 6.41421 15.75 6 15.75Z",
                    fill: "currentColor"
                })), p || (p = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M10 15.75C9.58579 15.75 9.25 15.4142 9.25 15V5C9.25 4.58579 9.58579 4.25 10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V15C10.75 15.4142 10.4142 15.75 10 15.75Z",
                    fill: "currentColor"
                })), f || (f = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M14 15.75C13.5858 15.75 13.25 15.4142 13.25 15V8C13.25 7.58579 13.5858 7.25 14 7.25C14.4142 7.25 14.75 7.58579 14.75 8V15C14.75 15.4142 14.4142 15.75 14 15.75Z",
                    fill: "currentColor"
                })))
            });
            t.p;
            let Ao = ["title", "titleId"];

            function Al() {
                return (Al = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let Ar = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, Ao);
                return T.createElement("svg", Al({
                    width: 16,
                    height: 16,
                    viewBox: "0 0 16 16",
                    fill: "currentColor",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, m || (m = T.createElement("path", {
                    d: "M13 8H6M6 8L9.08571 5M6 8L9.08571 11",
                    stroke: "currentColor",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                })), h || (h = T.createElement("path", {
                    d: "M3 3V13",
                    stroke: "currentColor",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                })))
            });
            t.p;
            let Aa = ["title", "titleId"];

            function As() {
                return (As = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let Ac = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, Aa);
                return T.createElement("svg", As({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, v || (v = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M16 4.5H4C3.17157 4.5 2.5 5.17157 2.5 6V16C2.5 16.8284 3.17157 17.5 4 17.5H16C16.8284 17.5 17.5 16.8284 17.5 16V6C17.5 5.17157 16.8284 4.5 16 4.5ZM4 3C2.34315 3 1 4.34315 1 6V16C1 17.6569 2.34315 19 4 19H16C17.6569 19 19 17.6569 19 16V6C19 4.34315 17.6569 3 16 3H4Z",
                    fill: "currentColor"
                })), x || (x = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M6 1.25C6.41421 1.25 6.75 1.58579 6.75 2V5C6.75 5.41421 6.41421 5.75 6 5.75C5.58579 5.75 5.25 5.41421 5.25 5V2C5.25 1.58579 5.58579 1.25 6 1.25ZM14 1.25C14.4142 1.25 14.75 1.58579 14.75 2V5C14.75 5.41421 14.4142 5.75 14 5.75C13.5858 5.75 13.25 5.41421 13.25 5V2C13.25 1.58579 13.5858 1.25 14 1.25ZM18 9.5H2V8H18V9.5Z",
                    fill: "currentColor"
                })))
            });
            t.p;
            let Au = ["title", "titleId"];

            function Ad() {
                return (Ad = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let Ag = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, Au);
                return T.createElement("svg", Ad({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, C || (C = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M11.0054 4.51684C10.6061 4.51684 10.2233 4.35763 9.94173 4.07448L8.37618 2.5H2.5V16C2.5 16.8284 3.17157 17.5 4 17.5H16C16.8284 17.5 17.5 16.8284 17.5 16V6.01684C17.5 5.18841 16.8284 4.51684 16 4.51684H11.0054ZM9.29323 1.29491C9.10554 1.10614 8.85032 1 8.58412 1H2C1.44772 1 1 1.44772 1 2V16C1 17.6569 2.34315 19 4 19H16C17.6569 19 19 17.6569 19 16V6.01684C19 4.35999 17.6569 3.01684 16 3.01684H11.0054L9.29323 1.29491Z",
                    fill: "currentColor"
                })), K || (K = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M1.01086 8.21733C1.01086 7.80312 1.34665 7.46733 1.76086 7.46733L17.9958 7.46733C18.41 7.46733 18.7458 7.80312 18.7458 8.21733C18.7458 8.63154 18.41 8.96733 17.9958 8.96733L1.76086 8.96733C1.34665 8.96733 1.01086 8.63154 1.01086 8.21733Z",
                    fill: "currentColor"
                })))
            });
            t.p;
            let Ap = ["title", "titleId"];

            function Af() {
                return (Af = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let Am = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, Ap);
                return T.createElement("svg", Af({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, b || (b = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M10.0231 2.61908L3.16958 7.22688C2.75134 7.50807 2.5 7.98229 2.5 8.49021V15.966C2.5 16.8038 3.17157 17.483 4 17.483H16C16.8284 17.483 17.5 16.8038 17.5 15.966V8.48511C17.5 7.9786 17.25 7.5055 16.8337 7.22399L10.0231 2.61908ZM9.47027 1.16912L2.33915 5.96356C1.50268 6.52594 1 7.47437 1 8.49021V15.966C1 17.6416 2.34315 19 4 19H16C17.6569 19 19 17.6416 19 15.966V8.48511C19 7.47208 18.5001 6.52589 17.6674 5.96286L10.5797 1.17059C10.2441 0.943671 9.80646 0.943093 9.47027 1.16912Z",
                    fill: "currentColor"
                })), y || (y = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M7 14.2583C7 13.8441 7.33635 13.5083 7.75127 13.5083L12.2487 13.5083C12.6636 13.5083 13 13.8441 13 14.2583C13 14.6725 12.6636 15.0083 12.2487 15.0083H7.75127C7.33635 15.0083 7 14.6725 7 14.2583Z",
                    fill: "currentColor"
                })))
            });
            t.p;
            let Ah = ["title", "titleId"];

            function Av() {
                return (Av = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let Ax = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, Ah);
                return T.createElement("svg", Av({
                    width: 20,
                    height: 20,
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, w || (w = T.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M9.30288 5.04939L9.3029 16.2011C7.88289 15.631 5.41342 15.0207 2.39485 15.8506L2.39487 4.62963C3.41276 3.62123 4.90915 3.26883 6.32696 3.44167C7.73418 3.61322 8.85353 4.26959 9.30288 5.04939ZM9.99733 3.66813C9.14639 2.77123 7.82548 2.21979 6.49568 2.05768C4.73048 1.84249 2.71266 2.27694 1.31337 3.74122C1.1022 3.9622 1.00063 4.24941 1.00063 4.52898L1.00061 16.5389C1.00061 17.1643 1.61711 17.5644 2.17295 17.3763C5.98125 16.0874 8.88163 17.4703 9.65601 17.9097C9.86942 18.0308 10.1308 18.0308 10.3442 17.9096C11.1184 17.4701 14.0187 16.0873 17.8269 17.3768C18.3828 17.565 18.9994 17.1649 18.9994 16.5394L18.9994 4.52337C18.9994 4.24389 18.8979 3.95678 18.6868 3.73582C17.2876 2.2708 15.2697 1.83605 13.5043 2.05135C12.1717 2.21388 10.8481 2.76756 9.99733 3.66813ZM10.6971 5.04402L10.6971 16.201C12.1172 15.6308 14.5867 15.0206 17.6052 15.851L17.6051 4.62398C16.5872 3.61499 15.0909 3.26243 13.6731 3.43533C12.266 3.60695 11.1465 4.26365 10.6971 5.04402Z",
                    fill: "currentColor"
                })))
            });
            t.p;
            var AC = t(55975),
                AK = t(86139),
                Ab = t(5077),
                Ay = t(74123),
                Aw = t(91107),
                AB = t(63200),
                AU = t(89671),
                AF = t(50620),
                AI = t(46788),
                AE = t(66836),
                AQ = t(44724),
                Aj = t(10123),
                AS = t(29133),
                AL = t(89802),
                AR = t(20253),
                Ak = t(32945),
                Aq = t(80629),
                AO = t(71774),
                AD = t(62258),
                AP = t(24167),
                AN = t(45340),
                AZ = t(28316),
                AM = t(9019);

            function AV(A) {
                var e;
                let {
                    className: t,
                    onTry: i
                } = A, {
                    data: n
                } = (0, AM.H)(), [o, l] = (0, T.useState)(!1), r = null == n ? void 0 : null === (e = n.data) || void 0 === e ? void 0 : e.orgSocialAccount.some(A => !1 === A.enable);
                if ((0, T.useEffect)(() => {
                        r && l(!0)
                    }, [r]), !o) return null;
                let a = (0, Q.jsxs)("div", {
                    className: (0, Aj.cn)("font-sans fixed top-[60px] left-[20px] right-0 bg-[#2b1f1a] text-center text-sm text-warn px-4 py-2 flex items-center justify-center z-50 font-semibold whitespace-break-spaces", t),
                    children: [(0, Q.jsx)(Y.cC, {
                        i18nKey: "common:we_have_lost",
                        components: [(0, Q.jsx)("span", {
                            className: "cursor-pointer underline",
                            onClick: () => {
                                i()
                            }
                        }, 0)]
                    }), (0, Q.jsx)("div", {
                        className: "ml-2",
                        onClick: () => l(!1),
                        "aria-label": "Close",
                        children: (0, Q.jsx)(AN.Z, {
                            width: 16,
                            height: 16,
                            color: "white"
                        })
                    })]
                });
                return (0, AZ.createPortal)(a, document.body)
            }
            var AT = t(3016),
                AY = t(96577),
                AH = t.n(AY),
                A_ = A => {
                    let {
                        open: e,
                        onOpenChange: t
                    } = A, {
                        t: i
                    } = (0, Y.$G)("common");
                    return (0, Q.jsxs)(S.Vq, {
                        open: e,
                        modal: !0,
                        onOpenChange: t,
                        title: i("join_as_affiliate"),
                        confirmText: i("join_now"),
                        onConfirm: () => {
                            (0, AC.B)("affiliate.click", {
                                target: "join"
                            }), window.open("https://www.opus.pro/affiliate", "_blank", "noopener")
                        },
                        children: [(0, Q.jsx)(AH(), {
                            src: "https://public.cdn.opus.pro/clip-web/images/common/affiliate.png",
                            alt: "affiliate",
                            width: 414,
                            height: 158,
                            className: "size-full object-cover"
                        }), (0, Q.jsx)(S.ZT, {
                            variant: "default",
                            className: "text-foreground font-normal",
                            children: i("affiliate_description")
                        })]
                    })
                },
                AW = t(30815),
                AG = t(4670),
                AJ = t(37668),
                Az = t(65838),
                AX = t(42180),
                A$ = t(85140),
                A0 = t(20706),
                A1 = t(49879),
                A2 = t(79964),
                A5 = t(99614),
                A4 = t(72418),
                A6 = t(23028),
                A9 = t(7645),
                A3 = t(34678),
                A7 = t(50461);
            let A8 = ["title", "titleId"];

            function eA() {
                return (eA = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let ee = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, A8);
                return T.createElement("svg", eA({
                    width: 12,
                    height: 12,
                    viewBox: "0 0 12 12",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, B || (B = T.createElement("path", {
                    d: "M0.5 8.60001C0.5 8.31668 0.573 8.05635 0.719 7.81901C0.865 7.58168 1.05867 7.40035 1.3 7.27501C1.81667 7.01668 2.34167 6.82301 2.875 6.69401C3.40833 6.56501 3.95 6.50035 4.5 6.50001C5.05 6.49968 5.59167 6.56435 6.125 6.69401C6.65833 6.82368 7.18333 7.01735 7.7 7.27501C7.94167 7.40001 8.1355 7.58135 8.2815 7.81901C8.4275 8.05668 8.50033 8.31701 8.5 8.60001V9.00001C8.5 9.27501 8.40217 9.51051 8.2065 9.70651C8.01083 9.90251 7.77533 10.0003 7.5 10H1.5C1.225 10 0.989667 9.90218 0.794 9.70651C0.598333 9.51085 0.500333 9.27535 0.5 9.00001V8.60001ZM10.5 10H9.225C9.31667 9.85001 9.3855 9.68968 9.4315 9.51901C9.4775 9.34835 9.50033 9.17535 9.5 9.00001V8.50001C9.5 8.13335 9.398 7.78118 9.194 7.44351C8.99 7.10585 8.70033 6.81635 8.325 6.57501C8.75 6.62501 9.15 6.71051 9.525 6.83151C9.9 6.95251 10.25 7.10035 10.575 7.27501C10.875 7.44168 11.1042 7.62701 11.2625 7.83101C11.4208 8.03501 11.5 8.25801 11.5 8.50001V9.00001C11.5 9.27501 11.4022 9.51051 11.2065 9.70651C11.0108 9.90251 10.7753 10.0003 10.5 10ZM4.5 6.00001C3.95 6.00001 3.47917 5.80418 3.0875 5.41251C2.69583 5.02085 2.5 4.55001 2.5 4.00001C2.5 3.45001 2.69583 2.97918 3.0875 2.58751C3.47917 2.19585 3.95 2.00001 4.5 2.00001C5.05 2.00001 5.52083 2.19585 5.9125 2.58751C6.30417 2.97918 6.5 3.45001 6.5 4.00001C6.5 4.55001 6.30417 5.02085 5.9125 5.41251C5.52083 5.80418 5.05 6.00001 4.5 6.00001ZM9.5 4.00001C9.5 4.55001 9.30417 5.02085 8.9125 5.41251C8.52083 5.80418 8.05 6.00001 7.5 6.00001C7.40833 6.00001 7.29167 5.98968 7.15 5.96901C7.00833 5.94835 6.89167 5.92535 6.8 5.90001C7.025 5.63335 7.198 5.33751 7.319 5.01251C7.44 4.68751 7.50033 4.35001 7.5 4.00001C7.49967 3.65001 7.43933 3.31251 7.319 2.98751C7.19867 2.66251 7.02567 2.36668 6.8 2.10001C6.91667 2.05835 7.03333 2.03118 7.15 2.01851C7.26667 2.00585 7.38333 1.99968 7.5 2.00001C8.05 2.00001 8.52083 2.19585 8.9125 2.58751C9.30417 2.97918 9.5 3.45001 9.5 4.00001ZM1.5 9.00001H7.5V8.60001C7.5 8.50835 7.47717 8.42501 7.4315 8.35001C7.38583 8.27501 7.32533 8.21668 7.25 8.17501C6.8 7.95001 6.34583 7.78135 5.8875 7.66901C5.42917 7.55668 4.96667 7.50035 4.5 7.50001C4.03333 7.49968 3.57083 7.55601 3.1125 7.66901C2.65417 7.78201 2.2 7.95068 1.75 8.17501C1.675 8.21668 1.6145 8.27501 1.5685 8.35001C1.5225 8.42501 1.49967 8.50835 1.5 8.60001V9.00001ZM4.5 5.00001C4.775 5.00001 5.0105 4.90218 5.2065 4.70651C5.4025 4.51085 5.50033 4.27535 5.5 4.00001C5.49967 3.72468 5.40183 3.48935 5.2065 3.29401C5.01117 3.09868 4.77567 3.00068 4.5 3.00001C4.22433 2.99935 3.989 3.09735 3.794 3.29401C3.599 3.49068 3.501 3.72601 3.5 4.00001C3.499 4.27401 3.597 4.50951 3.794 4.70651C3.991 4.90351 4.22633 5.00135 4.5 5.00001Z",
                    fill: "#FAFAFA"
                })))
            });
            t.p;
            let et = ["title", "titleId"];

            function ei() {
                return (ei = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let en = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, et);
                return T.createElement("svg", ei({
                    width: 14,
                    height: 14,
                    viewBox: "0 0 14 14",
                    fill: "currentColor",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, U || (U = T.createElement("path", {
                    d: "M10.4999 6.41671H9.33325C9.16797 6.41671 9.02953 6.36071 8.91792 6.24871C8.80631 6.13671 8.75031 5.99826 8.74992 5.83337C8.74953 5.66849 8.80553 5.53004 8.91792 5.41804C9.03031 5.30604 9.16875 5.25004 9.33325 5.25004H10.4999V4.08337C10.4999 3.9181 10.5559 3.77965 10.6679 3.66804C10.7799 3.55643 10.9184 3.50043 11.0833 3.50004C11.2481 3.49965 11.3868 3.55565 11.4992 3.66804C11.6116 3.78043 11.6674 3.91887 11.6666 4.08337V5.25004H12.8333C12.9985 5.25004 13.1372 5.30604 13.2492 5.41804C13.3612 5.53004 13.417 5.66849 13.4166 5.83337C13.4162 5.99826 13.3602 6.1369 13.2486 6.24929C13.137 6.36168 12.9985 6.41748 12.8333 6.41671H11.6666V7.58337C11.6666 7.74865 11.6106 7.88729 11.4986 7.99929C11.3866 8.11129 11.2481 8.1671 11.0833 8.16671C10.9184 8.16632 10.7799 8.11032 10.6679 7.99871C10.5559 7.8871 10.4999 7.74865 10.4999 7.58337V6.41671ZM5.24992 7.00004C4.60825 7.00004 4.05895 6.77157 3.602 6.31462C3.14506 5.85768 2.91659 5.30837 2.91659 4.66671C2.91659 4.02504 3.14506 3.47574 3.602 3.01879C4.05895 2.56185 4.60825 2.33337 5.24992 2.33337C5.89159 2.33337 6.44089 2.56185 6.89784 3.01879C7.35478 3.47574 7.58325 4.02504 7.58325 4.66671C7.58325 5.30837 7.35478 5.85768 6.89784 6.31462C6.44089 6.77157 5.89159 7.00004 5.24992 7.00004ZM0.583252 10.5V10.0334C0.583252 9.70282 0.668419 9.3991 0.838752 9.12221C1.00909 8.84532 1.23503 8.63376 1.51659 8.48754C2.11936 8.18615 2.73186 7.96021 3.35409 7.80971C3.97631 7.65921 4.60825 7.58376 5.24992 7.58337C5.89159 7.58298 6.52353 7.65843 7.14575 7.80971C7.76797 7.96098 8.38047 8.18693 8.98325 8.48754C9.2652 8.63337 9.49134 8.84493 9.66167 9.12221C9.832 9.39948 9.91697 9.70321 9.91659 10.0334V10.5C9.91659 10.8209 9.80245 11.0956 9.57417 11.3243C9.34589 11.553 9.07114 11.6671 8.74992 11.6667H1.74992C1.42909 11.6667 1.15453 11.5526 0.926252 11.3243C0.697974 11.096 0.583641 10.8213 0.583252 10.5ZM1.74992 10.5H8.74992V10.0334C8.74992 9.92643 8.72328 9.82921 8.67 9.74171C8.61672 9.65421 8.54614 9.58615 8.45825 9.53754C7.93325 9.27504 7.40339 9.07826 6.86867 8.94721C6.33395 8.81615 5.79436 8.75043 5.24992 8.75004C4.70547 8.74965 4.16589 8.81537 3.63117 8.94721C3.09645 9.07904 2.56659 9.27582 2.04159 9.53754C1.95409 9.58615 1.8835 9.65421 1.82984 9.74171C1.77617 9.82921 1.74953 9.92643 1.74992 10.0334V10.5ZM5.24992 5.83337C5.57075 5.83337 5.8455 5.71924 6.07417 5.49096C6.30284 5.26268 6.41697 4.98793 6.41659 4.66671C6.4162 4.34549 6.30206 4.07093 6.07417 3.84304C5.84628 3.61515 5.57153 3.50082 5.24992 3.50004C4.92831 3.49926 4.65375 3.6136 4.42625 3.84304C4.19875 4.07248 4.08442 4.34704 4.08325 4.66671C4.08209 4.98637 4.19642 5.26112 4.42625 5.49096C4.65609 5.72079 4.93064 5.83493 5.24992 5.83337Z",
                    fill: "currentColor"
                })))
            });
            t.p;
            var eo = t(59511),
                el = t(98166),
                er = t(85682),
                ea = t(24744),
                es = t(42119),
                ec = t(97101),
                eu = t(33414),
                ed = t(81217);
            let eg = ["title", "titleId"];

            function ep() {
                return (ep = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let ef = (0, T.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, eg);
                return T.createElement("svg", ep({
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 16,
                    height: 17,
                    viewBox: "0 0 16 17",
                    fill: "none",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? T.createElement("title", {
                    id: i
                }, t) : null, F || (F = T.createElement("path", {
                    d: "M13.3621 14.4984H2.6382C1.61284 14.4984 0.971213 13.3893 1.48232 12.5004L6.84429 3.17526C7.35696 2.28365 8.64336 2.28365 9.15604 3.17525L14.518 12.5004C15.0291 13.3893 14.3875 14.4984 13.3621 14.4984Z",
                    stroke: "#FFA057",
                    strokeLinecap: "round"
                })), I || (I = T.createElement("path", {
                    d: "M8 6.49805V9.16471",
                    stroke: "#FFA057",
                    strokeLinecap: "round"
                })), E || (E = T.createElement("path", {
                    d: "M8 11.8377L8.00667 11.8303",
                    stroke: "#FFA057",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                })))
            });
            t.p;
            var em = t(70025),
                eh = t(91381),
                ev = t(19831),
                ex = t(43207);
            let eC = A => {
                let e = (0, ex.SB)(A.completedCount, A.totalCount);
                return {
                    timeEstimate: (0, ex.cM)(A.targetDeliveryAt).formattedTime,
                    progressPercent: e
                }
            };
            var eK = A => {
                    let {
                        playlist: e,
                        onDelete: t,
                        onOpenSettings: i
                    } = A, [n, o] = (0, T.useState)(!1), [l, r] = (0, T.useState)(!1), [a, s] = (0, T.useState)(!0), [c, u] = (0, T.useState)({
                        brandTemplates: [],
                        fancyTemplates: []
                    }), {
                        getBrandTemplatesV2: d,
                        getFancyTemplates: g
                    } = (0, ec.Z)(), p = !!e.errorMsg, f = e.status === ea.wS.RUNNING;
                    e.status, ea.wS.IDLE, e.status, ea.wS.SUSPENDED;
                    let m = e.completedCount === e.totalCount && e.totalCount > 0,
                        {
                            timeEstimate: h,
                            progressPercent: v
                        } = eC(e);
                    (0, T.useEffect)(() => {
                        a && requestAnimationFrame(() => {
                            s(!1)
                        })
                    }, [a]);
                    let x = (0, T.useCallback)(async () => {
                        try {
                            let [A, e] = await Promise.all([d(), g()]);
                            u({
                                brandTemplates: A,
                                fancyTemplates: e
                            })
                        } catch (A) {
                            console.error("Failed to fetch templates:", A)
                        }
                    }, [d, g]);
                    (0, T.useEffect)(() => {
                        x()
                    }, [x]);
                    let C = async () => {
                        if (!l) try {
                            r(!0), await t(e.id), o(!1)
                        } catch (A) {
                            console.error("Failed to delete playlist:", A)
                        } finally {
                            r(!1)
                        }
                    };
                    return (0, Q.jsxs)(Q.Fragment, {
                        children: [(0, Q.jsx)("div", {
                            className: "group",
                            children: (0, Q.jsxs)("div", {
                                className: "flex justify-between items-center py-3",
                                children: [(0, Q.jsxs)("div", {
                                    className: "flex justify-start items-center gap-3 w-[400px] flex-shrink-0",
                                    children: [(0, Q.jsx)(AH(), {
                                        className: "w-28 h-16 relative rounded flex-shrink-0",
                                        src: e.thumbnailUrl || "https://placehold.co/110x62",
                                        alt: e.extCollectionName,
                                        width: 112,
                                        height: 64
                                    }), (0, Q.jsxs)("div", {
                                        className: "flex flex-col justify-center items-start gap-0.5 min-w-0 flex-1",
                                        children: [(0, Q.jsx)(S.u, {
                                            content: e.extCollectionName,
                                            children: (0, Q.jsx)(S.ZT, {
                                                variant: "label-md",
                                                className: "text-white truncate w-full",
                                                children: e.extCollectionName
                                            })
                                        }), (0, Q.jsx)("div", {
                                            className: "flex justify-start items-center gap-0.5 w-full",
                                            children: (0, Q.jsx)(S.u, {
                                                content: e.accountName,
                                                children: (0, Q.jsx)(S.ZT, {
                                                    variant: "body-sm",
                                                    className: "text-muted-foreground truncate flex-1",
                                                    children: e.accountName
                                                })
                                            })
                                        }), (0, Q.jsxs)("div", {
                                            className: "flex justify-start items-center gap-0.5 w-full",
                                            children: [(0, Q.jsx)(es.Kk, {
                                                className: "size-4 flex-shrink-0"
                                            }), (0, Q.jsx)(S.ZT, {
                                                variant: "body-sm",
                                                className: "text-text-muted-foreground text-sm font-normal truncate flex-1",
                                                children: (() => {
                                                    let A = e.collectionSetting;
                                                    if (!A) return "Default settings";
                                                    let t = "landscape" === A.aspectRatio ? "16:9" : "portrait" === A.aspectRatio ? "9:16" : "square" === A.aspectRatio ? "1:1" : "four_five" === A.aspectRatio ? "4:5" : "-",
                                                        i = "No captions";
                                                    if (A.enableCaption && A.brandTemplateId) {
                                                        let e = c.brandTemplates.find(e => e.templateId === A.brandTemplateId),
                                                            t = c.fancyTemplates.find(e => e.templateId === A.brandTemplateId);
                                                        i = e ? e.name : t ? t.name : "With captions"
                                                    }
                                                    return "".concat(t, " • ").concat(i)
                                                })()
                                            })]
                                        })]
                                    })]
                                }), (0, Q.jsx)("div", {
                                    className: "flex flex-col justify-center items-center gap-1 min-w-[150px]",
                                    children: f ? (0, Q.jsxs)(Q.Fragment, {
                                        children: [(0, Q.jsxs)(S.ZT, {
                                            variant: "body-sm",
                                            className: "text-center text-text-muted-foreground text-sm font-normal leading-tight",
                                            children: [e.totalCount, " ", e.totalCount > 1 ? "videos" : "video", " indexed"]
                                        }), (0, Q.jsxs)("div", {
                                            className: "w-full max-w-[200px] relative h-1",
                                            children: [(0, Q.jsx)("div", {
                                                className: "absolute inset-0 bg-white/10 rounded-full"
                                            }), (0, Q.jsx)("div", {
                                                className: (0, Aj.cn)("absolute inset-0 bg-white rounded-full", a ? "" : "transition-all duration-300"),
                                                style: {
                                                    width: "".concat(m ? 100 : f ? v : 0, "%")
                                                }
                                            })]
                                        }), h && (0, Q.jsx)("div", {
                                            className: "text-center text-text-muted-foreground text-xs font-normal leading-tight",
                                            children: h.replace("Estimated", "Est.")
                                        })]
                                    }) : (0, Q.jsx)(S.ZT, {
                                        variant: "body-sm",
                                        className: "text-center text-text-muted-foreground text-sm font-normal leading-tight",
                                        children: e.successCount > 0 ? "".concat(e.successCount, " video").concat(e.successCount > 1 ? "s" : "", " indexed") : p ? "Error occurred" : "0 videos indexed"
                                    })
                                }), !f && (0, Q.jsx)(S.h_, {
                                    items: [{
                                        label: (0, Q.jsxs)("div", {
                                            className: "flex items-center",
                                            children: [(0, Q.jsx)(es.Zr, {
                                                className: "size-4 mr-2"
                                            }), "Playlist settings"]
                                        }),
                                        key: "settings",
                                        onClick: () => i(e)
                                    }, {
                                        label: (0, Q.jsxs)("div", {
                                            className: "flex items-center",
                                            children: [(0, Q.jsx)(es.HG, {
                                                className: "size-4 mr-2"
                                            }), "Disconnect playlist"]
                                        }),
                                        key: "delete",
                                        onClick: () => o(!0)
                                    }],
                                    align: "start",
                                    side: "right",
                                    classNames: {
                                        content: "min-w-[160px]"
                                    },
                                    children: (0, Q.jsx)(S.zx, {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "p-2 size-auto hover:bg-muted/50",
                                        "aria-label": "More options",
                                        onClick: A => {
                                            A.stopPropagation()
                                        },
                                        children: (0, Q.jsx)(es.Tk, {
                                            className: "size-4 text-muted-foreground"
                                        })
                                    })
                                })]
                            })
                        }), (0, Q.jsx)(eh.Vq, {
                            open: n,
                            onOpenChange: o,
                            children: (0, Q.jsx)(eh.cZ, {
                                className: "w-[384px] p-6 bg-background rounded-lg border border-border",
                                children: (0, Q.jsxs)("div", {
                                    className: "flex flex-col gap-4",
                                    children: [(0, Q.jsx)("div", {
                                        className: "flex flex-col gap-6 overflow-hidden",
                                        children: (0, Q.jsx)("div", {
                                            className: "flex flex-col gap-4",
                                            children: (0, Q.jsx)(S.ZT, {
                                                className: "text-lg font-semibold text-foreground leading-none",
                                                children: "Are you sure you want to disconnect this playlist?"
                                            })
                                        })
                                    }), (0, Q.jsx)("div", {
                                        className: "p-3 rounded border border-[#FFA94D]/50 flex flex-col gap-2",
                                        children: (0, Q.jsxs)("div", {
                                            className: "flex gap-2",
                                            children: [(0, Q.jsx)(ef, {}), (0, Q.jsx)(S.ZT, {
                                                className: "flex-1 text-sm text-foreground",
                                                children: "Videos already indexed from this playlist will remain in your OpusSearch. Any future uploads to that playlist will no longer be auto indexed."
                                            })]
                                        })
                                    }), (0, Q.jsxs)("div", {
                                        className: "flex justify-end gap-2",
                                        children: [(0, Q.jsx)(S.zx, {
                                            variant: "secondary",
                                            className: "h-9 px-4 py-2",
                                            onClick: () => o(!1),
                                            disabled: l,
                                            children: "Back"
                                        }), (0, Q.jsx)(S.zx, {
                                            variant: "default",
                                            className: "h-9 px-4 py-2",
                                            onClick: C,
                                            disabled: l,
                                            children: l ? "Disconnecting..." : "Confirm disconnect"
                                        })]
                                    })]
                                })
                            })
                        })]
                    })
                },
                eb = t(8792);
            let ey = A => {
                let {
                    open: e,
                    onOpenChange: t
                } = A, {
                    t: i
                } = (0, Y.$G)("clip"), {
                    t: n
                } = (0, Y.$G)("common"), [o, l] = (0, T.useState)([]), [r, a] = (0, T.useState)(!1), [s, c] = (0, T.useState)([]), [u, d] = (0, T.useState)(!1), [g, p] = (0, T.useState)(null), [f, m] = (0, T.useState)(!1), [h, v] = (0, T.useState)(!1), [x, C] = (0, T.useState)(!1), [K, b] = (0, T.useState)([]), [y, w] = (0, T.useState)(""), [B, U] = (0, T.useState)(!1), [F, I] = (0, T.useState)(!1), [E, j] = (0, T.useState)(!1), [L, R] = (0, T.useState)(null), [k, q] = (0, T.useState)(!0), [O] = (0, AU.Ek)("search_upload_from_url_auto_import"), {
                    getImportableYouTubePlaylists: D
                } = (0, ed.Z)(), {
                    getAutoImportAccountList: P,
                    deactivateAutoImportAccount: N,
                    addPlaylistFromUrl: Z,
                    createAutoImportCollections: M,
                    updateAutoImportCollection: V,
                    getAutoImportCollectionsList: H,
                    deleteAutoImportCollection: _,
                    countClipProjects: W
                } = (0, eu.Z)(), {
                    getBrandTemplatesV2: G
                } = (0, ec.Z)(), J = (0, T.useCallback)(async (A, e) => {
                    if (!A) return e;
                    try {
                        let i = (await G()).find(e => e.templateId === A);
                        if (null == i ? void 0 : i.preferences) {
                            var t;
                            let {
                                preferences: n
                            } = i, o = n.layoutAspectRatio || e.aspectRatio;
                            return (0, AG._)((0, AW._)({}, e), {
                                brandTemplateId: A,
                                aspectRatio: o,
                                enableCaption: null !== (t = n.enableCaption) && void 0 !== t ? t : e.enableCaption
                            })
                        }
                    } catch (A) {
                        console.error("Failed to auto-fill from brand template:", A), S.Am.warning("Failed to load brand template settings")
                    }
                    return e
                }, [G]), z = (0, T.useCallback)(async () => {
                    try {
                        var A, e, t;
                        d(!0);
                        let i = await P("YOUTUBE"),
                            n = (null == i ? void 0 : null === (A = i.data) || void 0 === A ? void 0 : A.socialConnectionMapping) || [],
                            o = (null == i ? void 0 : null === (e = i.data) || void 0 === e ? void 0 : e.autoImportChannelItemList) || [],
                            r = o.find(A => {
                                var e;
                                return A.extUserId === (null === (e = n[0]) || void 0 === e ? void 0 : e.extUserId)
                            }) || null;
                        if (p(r), b(o), n.length > 0) {
                            let A = [];
                            for (let e of o)
                                if (e.id) {
                                    let i = await H({
                                            q: ea.yn.CHANNEL_ID,
                                            channelId: e.id
                                        }),
                                        n = (null == i ? void 0 : null === (t = i.data) || void 0 === t ? void 0 : t.list.map(A => ({
                                            id: A.id,
                                            extCollectionId: A.extCollectionId,
                                            extCollectionName: A.extCollectionName,
                                            thumbnailUrl: A.thumbnailUrl,
                                            status: A.status,
                                            totalCount: A.totalCount || 0,
                                            completedCount: A.completedCount || 0,
                                            successCount: A.successCount || 0,
                                            errorMsg: A.errorMsg,
                                            targetDeliveryAt: A.targetDeliveryAt,
                                            startAt: A.startAt,
                                            accountId: e.id,
                                            accountName: e.extUserName || "YouTube Channel",
                                            accountPictureLink: e.extUserPictureLink,
                                            collectionSetting: A.collectionSetting
                                        }))) || [];
                                    A.push(...n)
                                }
                            l(A)
                        }
                    } catch (A) {
                        console.error("Failed to fetch account and playlists:", A), S.Am.error("Failed to fetch playlists")
                    } finally {
                        d(!1)
                    }
                }, [P, H]), X = (0, T.useCallback)(async () => {
                    if (0 !== K.length) try {
                        let e = [];
                        for (let t of K)
                            if (t.id) try {
                                var A;
                                let i = await H({
                                        q: ea.yn.CHANNEL_ID,
                                        channelId: t.id
                                    }),
                                    n = (null == i ? void 0 : null === (A = i.data) || void 0 === A ? void 0 : A.list.map(A => ({
                                        id: A.id,
                                        extCollectionId: A.extCollectionId,
                                        extCollectionName: A.extCollectionName,
                                        thumbnailUrl: A.thumbnailUrl,
                                        status: A.status,
                                        totalCount: A.totalCount || 0,
                                        completedCount: A.completedCount || 0,
                                        successCount: A.successCount || 0,
                                        errorMsg: A.errorMsg,
                                        targetDeliveryAt: A.targetDeliveryAt,
                                        startAt: A.startAt,
                                        accountId: t.id,
                                        accountName: t.extUserName || "YouTube Channel",
                                        accountPictureLink: t.extUserPictureLink,
                                        collectionSetting: A.collectionSetting
                                    }))) || [];
                                e.push(...n)
                            } catch (A) {
                                console.error("Failed to fetch playlists for account ".concat(t.id, ":"), A)
                            }
                        l(e)
                    } catch (A) {
                        console.error("Failed to refresh playlists:", A)
                    }
                }, [K, H]), $ = (0, T.useRef)(null);
                (0, T.useEffect)(() => {
                    let A = async () => {
                        if (0 !== K.length && e) try {
                            let e = [];
                            for (let t of K)
                                if (t.id) try {
                                    var A;
                                    let i = await H({
                                            q: ea.yn.CHANNEL_ID,
                                            channelId: t.id
                                        }),
                                        n = (null == i ? void 0 : null === (A = i.data) || void 0 === A ? void 0 : A.list.map(A => ({
                                            id: A.id,
                                            extCollectionId: A.extCollectionId,
                                            extCollectionName: A.extCollectionName,
                                            thumbnailUrl: A.thumbnailUrl,
                                            status: A.status,
                                            totalCount: A.totalCount || 0,
                                            completedCount: A.completedCount || 0,
                                            successCount: A.successCount || 0,
                                            errorMsg: A.errorMsg,
                                            targetDeliveryAt: A.targetDeliveryAt,
                                            startAt: A.startAt,
                                            accountId: t.id,
                                            accountName: t.extUserName || "YouTube Channel",
                                            accountPictureLink: t.extUserPictureLink,
                                            collectionSetting: A.collectionSetting
                                        }))) || [];
                                    e.push(...n)
                                } catch (A) {
                                    console.debug("Account ".concat(t.id, " not found, removing from state:"), A), b(A => A.filter(A => A.id !== t.id))
                                }
                            let t = e.some(A => A.status === ea.wS.RUNNING);
                            l(e), !t && $.current && (clearInterval($.current), $.current = null)
                        } catch (A) {
                            console.error("Failed to update playlist progress:", A)
                        }
                    };
                    return (async () => {
                        e && 0 !== K.length && ($.current && (clearInterval($.current), $.current = null), await A(), $.current || ($.current = setInterval(A, 5e3)))
                    })(), () => {
                        $.current && (clearInterval($.current), $.current = null)
                    }
                }, [K, e, H]), (0, T.useEffect)(() => {
                    e ? z() : $.current && (clearInterval($.current), $.current = null)
                }, [e, z]), (0, T.useEffect)(() => {
                    let A = async () => {
                        try {
                            let A = await W();
                            q(A.total > 0)
                        } catch (A) {
                            console.error("Failed to fetch project count:", A), q(!1)
                        }
                    };
                    e && A()
                }, [e, W]);
                let AA = async A => {
                        try {
                            await _(A), await z(), S.Am.success("Account playlists removed")
                        } catch (A) {
                            console.error("Failed to delete playlist:", A), S.Am.error("Failed to remove playlist")
                        }
                    },
                    Ae = A => {
                        let {
                            playlistId: e,
                            playlistSettings: t
                        } = A;
                        return o.some(A => {
                            if (A.extCollectionId !== e) return !1;
                            let i = A.collectionSetting;
                            if (!i) return !1;
                            let n = i.brandTemplateId === t.brandTemplateId,
                                o = i.importVideoType === t.importVideoType,
                                l = i.aspectRatio === t.aspectRatio,
                                r = i.enableCaption === t.enableCaption,
                                a = JSON.stringify(i.clipDurations || []) === JSON.stringify(t.clipDurations || []);
                            return n && o && l && r && a
                        })
                    },
                    At = A => {
                        let {
                            playlistId: e,
                            playlistSettings: t
                        } = A;
                        return o.some(A => {
                            if (A.id === (null == L ? void 0 : L.id) || A.extCollectionId !== e) return !1;
                            let i = A.collectionSetting;
                            if (!i) return !1;
                            let n = i.brandTemplateId === t.brandTemplateId,
                                o = i.importVideoType === t.importVideoType,
                                l = i.aspectRatio === t.aspectRatio,
                                r = i.enableCaption === t.enableCaption,
                                a = JSON.stringify(i.clipDurations || []) === JSON.stringify(t.clipDurations || []);
                            return n && o && l && r && a
                        })
                    },
                    Ai = async A => {
                        let e = !!(null == L ? void 0 : L.id);
                        if (e ? At(A) : Ae(A)) {
                            S.Am.warning(i("duplicate_playlist_settings"));
                            return
                        }
                        try {
                            let t = (null == L ? void 0 : L.accountId) || (null == g ? void 0 : g.id);
                            if (!t) {
                                S.Am.error("No account found for this playlist");
                                return
                            }
                            let {
                                playlistId: i,
                                playlistName: n,
                                playlistThumbnailUrl: o,
                                playlistSettings: r
                            } = A, a = r;
                            r.brandTemplateId && (a = await J(r.brandTemplateId, r));
                            let s = [{
                                extCollectionId: i,
                                extCollectionName: n,
                                thumbnailUrl: o,
                                collectionSetting: a
                            }];
                            if (e) await V({
                                collectionId: L.id,
                                collections: s
                            }), l(A => A.map(A => A.id === L.id ? (0, AG._)((0, AW._)({}, A), {
                                collectionSetting: a
                            }) : A)), S.Am.success("Playlist settings updated"), j(!1), R(null);
                            else {
                                await M({
                                    channelId: t,
                                    collections: s
                                });
                                let A = L ? {
                                        id: L.accountId,
                                        name: L.accountName,
                                        pictureLink: L.accountPictureLink
                                    } : {
                                        id: (null == g ? void 0 : g.id) || t,
                                        name: (null == g ? void 0 : g.extUserName) || "YouTube Account",
                                        pictureLink: null == g ? void 0 : g.extUserPictureLink
                                    },
                                    e = {
                                        id: "temp-".concat(Date.now()),
                                        extCollectionId: i,
                                        extCollectionName: n,
                                        thumbnailUrl: o,
                                        collectionSetting: a,
                                        status: ea.wS.RUNNING,
                                        totalCount: 0,
                                        completedCount: 0,
                                        successCount: 0,
                                        accountId: A.id,
                                        accountName: A.name,
                                        accountPictureLink: A.pictureLink
                                    };
                                l(A => [...A, e]), S.Am.success("Playlist indexed successfully"), R(null)
                            }
                            setTimeout(async () => {
                                await X()
                            }, 1e3)
                        } catch (A) {
                            console.error("Failed to update playlist settings:", A), S.Am.error(e ? "Failed to update playlist settings" : "Failed to index playlist")
                        }
                    },
                    An = async A => {
                        if (x) return;
                        let e = A || g;
                        if (e) try {
                            C(!0), e.extUserId && (await N({
                                platform: "YOUTUBE",
                                extUserId: e.extUserId
                            }), l(A => A.filter(A => A.accountId !== e.id)), b(A => A.filter(A => A.id !== e.id)), await z(), v(!1), (null == g ? void 0 : g.id) === e.id && p(null), window.dispatchEvent(new CustomEvent("youtube-account-disconnected")), t(!1), S.Am.success("Account disconnected successfully"))
                        } catch (A) {
                            console.error("Failed to disconnect account:", A), S.Am.error("Failed to disconnect account")
                        } finally {
                            C(!1)
                        }
                    },
                    Ao = async () => {
                        if (y.trim() && !B) try {
                            U(!0), await Z({
                                platform: "YOUTUBE",
                                playlistUri: y.trim(),
                                autoCreateEnable: !0
                            }), S.Am.success("Playlist URL submitted successfully"), w(""), I(!1), await new Promise(A => setTimeout(A, 1e3)), await z()
                        } catch (A) {
                            console.error("Failed to submit playlist URL:", A), S.Am.error("Failed to submit playlist URL")
                        } finally {
                            U(!1)
                        }
                    },
                    Al = () => {
                        m(!0)
                    },
                    Ar = () => {
                        I(!0)
                    },
                    Aa = async () => {
                        if (y.trim() && !B) try {
                            U(!0), await Z({
                                platform: "YOUTUBE",
                                playlistUri: y.trim(),
                                autoCreateEnable: !0
                            }), S.Am.success("Playlist URL submitted successfully"), w(""), await new Promise(A => setTimeout(A, 1e3)), await z()
                        } catch (A) {
                            console.error("Failed to submit playlist URL:", A), S.Am.error("Failed to submit playlist URL")
                        } finally {
                            U(!1)
                        }
                    },
                    As = async A => {
                        if (m(!1), p(A), o.length >= 5) {
                            S.Am.warning("You can only add up to ".concat(5, " playlists"));
                            return
                        }
                        c([]);
                        try {
                            var e;
                            d(!0);
                            let t = await D(A.channelId),
                                i = null == t ? void 0 : null === (e = t.data) || void 0 === e ? void 0 : e.list.map(A => (0, AG._)((0, AW._)({}, A), {
                                    status: A.status
                                }));
                            c(i || []), a(!0)
                        } catch (A) {
                            console.error("Failed to fetch available playlists:", A), S.Am.error("Failed to fetch available playlists")
                        } finally {
                            d(!1)
                        }
                    },
                    Ac = A => {
                        R(A), j(!0)
                    },
                    Au = () => {
                        j(!1), R(null)
                    };
                return (0, Q.jsxs)(Q.Fragment, {
                    children: [(0, Q.jsx)(eh.Vq, {
                        open: e,
                        onOpenChange: t,
                        children: (0, Q.jsx)(eh.cZ, {
                            className: "fixed inset-0 m-auto max-w-[908px] max-h-[568px] p-6 bg-[#0A0A0B] rounded-lg border border-border overflow-hidden transform-none",
                            children: (0, Q.jsxs)("div", {
                                className: "size-full flex flex-col gap-6",
                                children: [(0, Q.jsxs)("div", {
                                    className: "flex flex-col gap-1.5",
                                    children: [(0, Q.jsx)("div", {
                                        className: "flex items-center gap-2",
                                        children: (0, Q.jsx)(S.ZT, {
                                            variant: "label-lg",
                                            children: i("video_index_settings")
                                        })
                                    }), (0, Q.jsx)(S.ZT, {
                                        variant: "body-sm",
                                        className: "text-white/50",
                                        children: i("view_and_manage_your_video_index_sources")
                                    })]
                                }), o.length > 0 || g ? (0, Q.jsx)("div", {
                                    className: "flex-1 flex gap-3 overflow-hidden",
                                    children: (0, Q.jsxs)("div", {
                                        className: "flex-1 h-full rounded-lg overflow-hidden flex flex-col",
                                        children: [(0, Q.jsx)("div", {
                                            className: "w-full h-5 bg-[#17171B] pt-6 pb-2 px-4 flex items-center",
                                            children: (0, Q.jsxs)(S.ZT, {
                                                variant: "label-sm",
                                                className: "text-white/50",
                                                children: [i("playlists"), " (", o.length, "/", 5, ")"]
                                            })
                                        }), (0, Q.jsx)(S.xr, {
                                            className: "flex-1 bg-[#17171B] rounded-b-md max-h-[360px]",
                                            children: (0, Q.jsx)("div", {
                                                className: "px-4",
                                                children: u ? (0, Q.jsx)("div", {
                                                    className: "space-y-2",
                                                    children: Array.from({
                                                        length: 3
                                                    }).map((A, e) => (0, Q.jsxs)("div", {
                                                        className: "animate-pulse",
                                                        children: [(0, Q.jsx)("div", {
                                                            className: "h-11 bg-zinc-800/50 rounded-md"
                                                        }), (0, Q.jsx)("div", {
                                                            className: "w-[625px] h-0 mx-auto outline outline-1 outline-offset-[-0.50px] outline-border mt-1"
                                                        })]
                                                    }, e))
                                                }) : 0 === o.length ? (0, Q.jsxs)("div", {
                                                    className: "h-full flex flex-col items-center justify-center gap-2 py-20",
                                                    children: [(0, Q.jsx)(S.ZT, {
                                                        variant: "body-sm",
                                                        className: "text-muted-foreground",
                                                        children: i("no_playlists_connected")
                                                    }), (0, Q.jsx)(S.ZT, {
                                                        variant: "body-sm",
                                                        className: "text-muted-foreground",
                                                        children: i("connected_your_account_now_to_index_your_current_and_future_videos")
                                                    }), (0, Q.jsx)(S.h_, {
                                                        items: [{
                                                            label: (0, Q.jsxs)("div", {
                                                                className: "flex items-center",
                                                                children: [(0, Q.jsx)(es.n5, {
                                                                    className: "size-4 mr-2"
                                                                }), i("from_account")]
                                                            }),
                                                            key: "from_account",
                                                            onClick: Al,
                                                            disabled: o.length >= 5
                                                        }, ...O ? [{
                                                            label: (0, Q.jsxs)("div", {
                                                                className: "flex items-center",
                                                                children: [(0, Q.jsx)(es.rU, {
                                                                    className: "size-4 mr-2"
                                                                }), i("from_url")]
                                                            }),
                                                            key: "from_url",
                                                            onClick: Ar,
                                                            disabled: o.length >= 5
                                                        }] : []],
                                                        align: "center",
                                                        side: "top",
                                                        classNames: {
                                                            content: "min-w-[140px]"
                                                        },
                                                        children: (0, Q.jsxs)(S.zx, {
                                                            variant: "default",
                                                            size: "sm",
                                                            className: "mt-4 h-8 px-3.5 py-2 rounded-md shadow-sm inline-flex items-center gap-2",
                                                            disabled: o.length >= 5,
                                                            children: [(0, Q.jsx)(es.mm, {
                                                                className: "size-4"
                                                            }), (0, Q.jsx)("span", {
                                                                className: "text-xs font-medium leading-none",
                                                                children: i("add_playlist")
                                                            })]
                                                        })
                                                    })]
                                                }) : o.map((A, e) => (0, Q.jsxs)("div", {
                                                    children: [(0, Q.jsx)(eK, {
                                                        playlist: A,
                                                        onDelete: AA,
                                                        onOpenSettings: Ac
                                                    }), e < o.length - 1 && (0, Q.jsx)("div", {
                                                        className: "self-stretch h-px bg-white/10"
                                                    })]
                                                }, A.id))
                                            })
                                        }), o.length > 0 && (0, Q.jsx)("div", {
                                            className: "pt-6 pb-0 flex justify-end",
                                            children: (0, Q.jsx)(S.u, {
                                                content: "Index current and future videos in a playlist",
                                                children: (0, Q.jsx)(S.h_, {
                                                    items: [{
                                                        label: (0, Q.jsxs)("div", {
                                                            className: "flex items-center",
                                                            children: [(0, Q.jsx)(es.n5, {
                                                                className: "size-4 mr-2"
                                                            }), i("from_account")]
                                                        }),
                                                        key: "from_account",
                                                        onClick: Al,
                                                        disabled: o.length >= 5
                                                    }, ...O ? [{
                                                        label: (0, Q.jsxs)("div", {
                                                            className: "flex items-center",
                                                            children: [(0, Q.jsx)(es.rU, {
                                                                className: "size-4 mr-2"
                                                            }), i("from_url")]
                                                        }),
                                                        key: "from_url",
                                                        onClick: Ar,
                                                        disabled: o.length >= 5
                                                    }] : []],
                                                    align: "end",
                                                    side: "top",
                                                    classNames: {
                                                        content: "min-w-[140px]"
                                                    },
                                                    children: (0, Q.jsxs)(S.zx, {
                                                        variant: "base",
                                                        className: "w-auto h-8 bg-[#27272A] px-3 py-2 rounded-md shadow-sm inline-flex items-center gap-2 hover:bg-[#303035]",
                                                        disabled: u || o.length >= 5,
                                                        children: [(0, Q.jsx)(es.mm, {
                                                            className: "size-4"
                                                        }), (0, Q.jsx)(S.ZT, {
                                                            className: "text-sm font-medium text-foreground",
                                                            children: i("add_playlist")
                                                        })]
                                                    })
                                                })
                                            })
                                        })]
                                    })
                                }) : (0, Q.jsx)("div", {
                                    className: "flex-1 flex items-center justify-center",
                                    children: (0, Q.jsxs)("div", {
                                        className: "w-[500px] inline-flex flex-col justify-start items-center gap-4",
                                        children: [(0, Q.jsxs)("div", {
                                            className: "text-center",
                                            children: [(0, Q.jsx)(S.ZT, {
                                                className: "text-muted-foreground text-sm",
                                                children: i("no_accounts_connected")
                                            }), (0, Q.jsx)(S.ZT, {
                                                className: "text-muted-foreground text-sm",
                                                children: i("connected_your_account_now_to_index_your_current_and_future_videos")
                                            })]
                                        }), (0, Q.jsxs)(S.zx, {
                                            variant: "default",
                                            size: "sm",
                                            className: "h-8 px-3.5 py-2 rounded-md shadow-sm inline-flex items-center gap-2",
                                            onClick: () => m(!0),
                                            children: [(0, Q.jsx)(es.GL, {
                                                className: "size-4"
                                            }), (0, Q.jsx)("span", {
                                                className: "text-xs font-medium leading-none",
                                                children: i("connect_account")
                                            })]
                                        }), O && (0, Q.jsxs)(Q.Fragment, {
                                            children: [(0, Q.jsxs)("div", {
                                                className: "my-2 flex items-center",
                                                children: [(0, Q.jsx)("div", {
                                                    className: "flex-1 w-[500px] h-[2px] bg-border/100"
                                                }), (0, Q.jsx)("div", {
                                                    className: "px-4 text-sm text-muted-foreground",
                                                    children: i("or")
                                                }), (0, Q.jsx)("div", {
                                                    className: "flex-1  w-full h-[2px] bg-border/100"
                                                })]
                                            }), (0, Q.jsx)("div", {
                                                className: "w-full flex flex-col justify-center items-center",
                                                children: (0, Q.jsx)(S.ZT, {
                                                    variant: "label-sm",
                                                    className: "text-muted-foreground",
                                                    children: i("add_youtube_playlist_from_url")
                                                })
                                            }), (0, Q.jsx)("div", {
                                                className: "flex items-center justify-center gap-4",
                                                children: (0, Q.jsxs)("div", {
                                                    className: "w-full flex items-center gap-3",
                                                    children: [(0, Q.jsx)(S.II, {
                                                        placeholder: "Paste YouTube playlist URL here",
                                                        value: y,
                                                        onChange: A => w(A),
                                                        className: "self-stretch w-[378px] h-9 px-3 py-1 bg-UI-button-tonal/10 rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] inline-flex justify-start items-center overflow-hidden hover:border-white",
                                                        disabled: B,
                                                        "aria-label": "YouTube playlist URL input"
                                                    }), (0, Q.jsx)(S.zx, {
                                                        size: "sm",
                                                        className: "h-8 px-3.5 py-2 rounded-md shadow-sm inline-flex items-center gap-2",
                                                        onClick: Aa,
                                                        disabled: !y.trim() || B,
                                                        children: (0, Q.jsx)(S.ZT, {
                                                            className: "text-xs font-medium leading-none text-black",
                                                            children: B ? i("adding") : i("add_playlist")
                                                        })
                                                    })]
                                                })
                                            }), (0, Q.jsx)(S.ZT, {
                                                variant: "body-sm",
                                                className: "text-muted-foreground",
                                                children: i("youtube_playlists_must_be_public_or_unlisted")
                                            })]
                                        })]
                                    })
                                })]
                            })
                        })
                    }), g && r && (0, Q.jsx)(em.m, {
                        acct: g,
                        playlists: s,
                        open: r,
                        onClose: () => {
                            a(!1), c([])
                        },
                        onConfirm: Ai,
                        limit: 5 - o.length,
                        hasExistingProjects: k
                    }), (0, Q.jsx)(eh.Vq, {
                        open: h,
                        onOpenChange: v,
                        children: (0, Q.jsx)(eh.cZ, {
                            className: "w-[384px] p-6 bg-background rounded-lg border border-border",
                            children: (0, Q.jsxs)("div", {
                                className: "flex flex-col gap-4",
                                children: [(0, Q.jsx)("div", {
                                    className: "flex flex-col gap-6 overflow-hidden",
                                    children: (0, Q.jsx)("div", {
                                        className: "flex flex-col gap-4",
                                        children: (0, Q.jsx)(S.ZT, {
                                            className: "text-lg font-semibold text-foreground leading-none",
                                            children: i("are_you_sure_you_want_to_disconnect_this_account")
                                        })
                                    })
                                }), (0, Q.jsx)("div", {
                                    className: "p-3 rounded border border-[#FFA94D]/50 flex flex-col gap-2",
                                    children: (0, Q.jsxs)("div", {
                                        className: "flex gap-2",
                                        children: [(0, Q.jsx)("div", {
                                            className: "w-4 h-5 flex items-center",
                                            children: (0, Q.jsx)(ef, {})
                                        }), (0, Q.jsx)(S.ZT, {
                                            className: "flex-1 text-sm text-foreground",
                                            children: i("video_error")
                                        })]
                                    })
                                }), (0, Q.jsxs)("div", {
                                    className: "flex justify-end gap-2",
                                    children: [(0, Q.jsx)(S.zx, {
                                        variant: "secondary",
                                        className: "h-9 px-4 py-2",
                                        onClick: () => v(!1),
                                        disabled: x,
                                        children: n("back")
                                    }), (0, Q.jsx)(S.zx, {
                                        variant: "default",
                                        className: "h-9 px-4 py-2",
                                        onClick: () => An(),
                                        disabled: x,
                                        children: x ? i("disconnecting") : i("confirm_disconnect")
                                    })]
                                })]
                            })
                        })
                    }), (0, Q.jsx)(ev.s, {
                        open: F,
                        onOpenChange: I,
                        urlInputValue: y,
                        onUrlInputChange: w,
                        isSubmitting: B,
                        onSubmit: Ao,
                        onCancel: () => {
                            I(!1), w("")
                        }
                    }), L && (() => {
                        let A = K.find(A => A.id === L.accountId) || g || {
                            id: L.accountId,
                            channelId: L.accountId,
                            postAccountId: L.accountId,
                            extUserId: L.accountId,
                            extUserName: L.accountName || "YouTube Channel",
                            extUserPictureLink: L.accountPictureLink,
                            platform: "YOUTUBE",
                            autoCreateEnabled: !0,
                            autoImportScope: "PLAYLIST"
                        };
                        return (0, Q.jsx)(em.m, {
                            acct: A,
                            playlists: [{
                                id: L.extCollectionId,
                                name: L.extCollectionName,
                                thumbnailUrl: L.thumbnailUrl || "",
                                status: "NOT_IMPORTED"
                            }],
                            open: E,
                            onClose: Au,
                            onConfirm: Ai,
                            confirmTxt: (null == L ? void 0 : L.id) ? i("update_settings") : i("index_playlist"),
                            cancelTxt: "Cancel",
                            limit: 1,
                            existingSettings: L.collectionSetting,
                            isUpdate: !!(null == L ? void 0 : L.id),
                            hasExistingProjects: k
                        })
                    })(), f && (0, Q.jsx)(eb.R, {
                        open: f,
                        onAccountSelect: As,
                        onClose: () => m(!1)
                    })]
                })
            };
            var ew = t(68576),
                eB = t(49362),
                eU = t(2871),
                eF = t(55773),
                eI = t(5145),
                eE = t(43936);

            function eQ(A) {
                let {
                    open: e,
                    onClose: t
                } = A, {
                    t: i
                } = (0, Y.$G)("common"), {
                    cleanAccount: n
                } = (0, eE.Z)(), o = (0, V.Dv)(eF.Mz.currentAccount), [l, r] = (0, T.useState)([]), [a, s] = (0, T.useState)(!1), {
                    logout: c
                } = (0, er.a)(), u = (A, e) => {
                    r(t => {
                        let i = [...t];
                        return i[e] = A, i
                    })
                }, d = async () => {
                    s(!0), (0, AC.B)("user.account.delete", {
                        userId: (null == o ? void 0 : o.userId) || "",
                        orgId: (null == o ? void 0 : o.orgId) || ""
                    });
                    try {
                        await n({
                            userId: (null == o ? void 0 : o.userId) || "",
                            orgId: (null == o ? void 0 : o.orgId) || "",
                            loginId: (null == o ? void 0 : o.loginId) || ""
                        }), S.Am.success(i("account_delete")), c({
                            returnTo: "".concat(window.location.origin, "/questions/delete-account")
                        })
                    } catch (A) {}
                    s(!1)
                }, g = () => {
                    t(), r([])
                }, p = [{
                    name: "undone",
                    text: i("this_action_cant")
                }, {
                    name: "remove",
                    text: i("this_action_will")
                }, {
                    name: "subscription",
                    text: i("your_active_subscription")
                }, {
                    name: "credits",
                    text: i("unused_credits")
                }, {
                    name: "team",
                    text: i("if_you_are")
                }, {
                    name: "sign-in",
                    text: i("you_will_not")
                }], f = !(l.filter(A => void 0 !== A).length === p.length && l.every(A => !!A));
                return (0, Q.jsxs)(S.Vq, {
                    title: (0, Q.jsx)(S.ZT, {
                        className: "text-foreground text-center text-lg font-semibold",
                        children: i("delete_account")
                    }),
                    classNames: {
                        content: "w-[480px] border-0 bg-popover pb-2"
                    },
                    open: e,
                    onCancel: () => g(),
                    children: [(0, Q.jsxs)("div", {
                        className: "border-border rounded-lg border p-6",
                        children: [(0, Q.jsx)(S.ZT, {
                            className: "text-muted-foreground pb-4 text-center text-sm font-semibold",
                            children: i("by_deleting_my")
                        }), p.map((A, e) => (0, Q.jsxs)("div", {
                            className: "flex items-start pb-4",
                            children: [(0, Q.jsx)(S.XZ, {
                                id: A.name,
                                value: !!l[e],
                                onChange: A => u(A, e)
                            }), (0, Q.jsx)(S.ZT, {
                                className: "text-foreground relative top-[-3px] pl-2 text-sm",
                                children: A.text
                            })]
                        }, A.name))]
                    }), (0, Q.jsxs)("div", {
                        className: "mt-3 flex flex-col items-center",
                        children: [(0, Q.jsx)(S.zx, {
                            className: "mb-2",
                            variant: "destructive",
                            loading: a,
                            style: {
                                backgroundColor: f ? "#27272A" : "",
                                width: a ? 160 : 145
                            },
                            disabled: f,
                            onClick: () => {
                                d()
                            },
                            children: i("delete_account")
                        }), (0, Q.jsx)(S.zx, {
                            className: "bg-popover mb-2 w-[145px]",
                            variant: "outline",
                            onClick: () => {
                                var A;
                                null === (A = document.getElementById("intercom-button")) || void 0 === A || A.click()
                            },
                            children: i("contact_support")
                        }), (0, Q.jsx)(S.zx, {
                            className: "mb-2  w-[145px]",
                            variant: "ghost",
                            onClick: () => g(),
                            children: i("cancel")
                        })]
                    })]
                })
            }
            let ej = {
                "google-oauth2": "Google",
                email: "Email",
                facebook: "Facebook"
            };

            function eS(A) {
                var e, t, i, n, o, l;
                let {
                    open: r,
                    onClose: a,
                    hasTeam: s
                } = A, {
                    t: c
                } = (0, Y.$G)("common"), {
                    user: u
                } = (0, er.a)(), d = (0, V.Dv)(eF.Mz.accountList), {
                    getUserLoginInfo: g
                } = (0, eE.Z)(), [p, f] = (0, T.useState)(!1), [m, h] = (0, T.useState)();
                return ((0, eI.Z)(async () => {
                    r && h(await g())
                }, [r]), "hasData" !== d.state) ? (0, Q.jsx)(Q.Fragment, {}) : (0, Q.jsxs)(Q.Fragment, {
                    children: [(0, Q.jsx)(S.Vq, {
                        title: (0, Q.jsx)(S.ZT, {
                            className: "text-foreground text-lg font-semibold",
                            children: c("profile")
                        }),
                        open: r,
                        onCancel: () => a(),
                        children: (0, Q.jsxs)("div", {
                            children: [(0, Q.jsxs)("div", {
                                className: "border-muted mb-4 border-b",
                                children: [(0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-2 text-sm font-semibold",
                                    children: c("user_name")
                                }), (0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-4 text-sm font-normal",
                                    children: u.name || u.email
                                })]
                            }), (0, Q.jsxs)("div", {
                                className: "border-muted mb-4 border-b",
                                children: [(0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-2 text-sm font-semibold",
                                    children: c("email")
                                }), (0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-4 text-sm font-normal",
                                    children: u.email || "-"
                                })]
                            }), (0, Q.jsxs)("div", {
                                className: "border-muted mb-4 border-b",
                                children: [(0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-2 text-sm font-semibold",
                                    children: c("teams")
                                }), (0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-4 text-sm font-normal",
                                    children: s ? (null === (t = d.data) || void 0 === t ? void 0 : null === (e = t.map(A => A.name || A.orgName || (null == u ? void 0 : u.name) || (null == u ? void 0 : u.email) || A.orgId)) || void 0 === e ? void 0 : e.join(", ")) || "Not in a team" : c("not_in_a_team")
                                })]
                            }), (null !== (l = null == m ? void 0 : null === (i = m.identities) || void 0 === i ? void 0 : i.length) && void 0 !== l ? l : 0) > 0 && (0, Q.jsxs)("div", {
                                className: "border-muted my-4 border-b",
                                children: [(0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-2 text-sm font-semibold",
                                    children: c("sign_in_method")
                                }), (0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-4 text-sm font-normal",
                                    children: (null == m ? void 0 : null === (o = m.identities) || void 0 === o ? void 0 : null === (n = o.map(A => ej[null == A ? void 0 : A.connection])) || void 0 === n ? void 0 : n.join(", ")) || ""
                                })]
                            }), (0, Q.jsxs)("div", {
                                children: [(0, Q.jsx)(S.ZT, {
                                    className: "text-foreground pb-2 text-sm font-semibold",
                                    children: c("delete_account")
                                }), (0, Q.jsxs)("div", {
                                    className: "flex justify-between",
                                    children: [(0, Q.jsx)(S.ZT, {
                                        className: "text-muted-foreground w-[270px] text-[13px] font-normal",
                                        children: c("once_you_delete")
                                    }), (0, Q.jsx)(S.zx, {
                                        variant: "ghost-gray",
                                        className: "text-error mr-8 cursor-pointer text-sm font-medium",
                                        onClick: () => {
                                            f(!0), a()
                                        },
                                        style: {
                                            color: "#E5484D"
                                        },
                                        children: c("delete_account")
                                    })]
                                })]
                            })]
                        })
                    }), (0, Q.jsx)(eQ, {
                        open: p,
                        onClose: () => f(!1)
                    })]
                })
            }
            var eL = t(9442),
                eR = t(10555);
            let ek = () => (0, Q.jsxs)("div", {
                className: "relative size-4",
                children: [(0, Q.jsx)(A$.Z, {
                    className: "absolute left-0 top-0 size-3"
                }), (0, Q.jsx)(A0.Z, {
                    className: "absolute -right-px -bottom-px size-2"
                })]
            });

            function eq(A) {
                var e, t;
                let {
                    mini: i = !1
                } = A, {
                    changeLanguage: n,
                    currentLanguage: o
                } = (0, el.QT)(), [l] = (0, AU.Ek)("i18n"), [r] = (0, AU.Ek)("i18n_chinese"), {
                    t: a,
                    i18n: s
                } = (0, Y.$G)("common"), c = (0, V.Dv)(AO.Z.utm), [u, d] = (0, T.useState)(!0), g = (0, AQ.t)(), p = (0, j.Jn)(g.asPath), {
                    login_provider: f
                } = null !== (e = null == g ? void 0 : g.query) && void 0 !== e ? e : {}, {
                    isAuthenticated: m,
                    loginWithRedirect: h,
                    logout: v,
                    user: x,
                    isLoading: C
                } = (0, er.a)(), K = (0, V.Dv)(eF.Mz.userOrgToken), b = (0, AL.Z)(), [{
                    features: {
                        disableViewInviteMembers: y,
                        disableViewTeamSettings: w,
                        disableViewCaptions: B,
                        disableViewThumbnail: U,
                        disableViewCreditUsageHistory: F,
                        disableViewVideoIndex: I,
                        disableViewLanguageSwitcher: E
                    }
                }] = (0, AU.Ae)("opus_search_demos", "vidSummit", AK.X), L = (0, T.useMemo)(() => [...j.AH.map(A => ({
                    lang: A,
                    label: j.cG[A].label,
                    isBeta: j.cG[A].isBeta
                })), ...r ? j.Xl.map(A => ({
                    lang: A,
                    label: j.cG[A].label,
                    isBeta: j.cG[A].isBeta
                })) : []], [r]), {
                    getOrgInfo: R
                } = (0, A7.Z)(), {
                    picture: k,
                    email: q,
                    name: O
                } = x || {}, [D, P] = (0, T.useState)(!1), N = (0, V.b9)(eF.Mz.currentOrgOwnerUserId), Z = o(), M = {
                    name: q || O,
                    logo: k,
                    plan: "",
                    orgName: ""
                }, H = null !== (t = (0, V.Dv)(eF.Mz.currentAccount)) && void 0 !== t ? t : M, [_] = (0, AU.Ek)("delete_account");
                if (!H.name) {
                    let {
                        logo: A,
                        name: e
                    } = M;
                    H = (0, AG._)((0, AW._)({}, H), {
                        logo: A,
                        name: e
                    })
                }
                let {
                    featureOn: W
                } = (0, eB.O)({
                    featureKey: "OrgCreate"
                }), G = (0, T.useMemo)(() => null != H && !!H.orgName, [H]), {
                    isBelowSm: J
                } = (0, AF.G)("sm"), {
                    openUpsellWindow: z
                } = (0, eU.w)(), X = (0, V.Dv)(Aq.a.currentOrgAsset), $ = (0, V.Dv)(eF.Mz.accountList), {
                    isOwnerOrAdmin: AA
                } = (0, AS.i)();
                (0, T.useEffect)(() => {
                    C || d(!1)
                }, [C]);
                let {
                    data: Ae
                } = (0, AX.a)({
                    queryKey: ["orgInfo", H.orgId],
                    queryFn: () => R().then(A => {
                        var e, t, i, n, o;
                        let l = null === (t = A.data) || void 0 === t ? void 0 : null === (e = t.org) || void 0 === e ? void 0 : e.ownerUserId;
                        return l && N(l), null === (o = A.data) || void 0 === o ? void 0 : null === (n = o.member) || void 0 === n ? void 0 : null === (i = n.users) || void 0 === i ? void 0 : i.length
                    }).catch(() => {}),
                    enabled: G && m && !!K && "workos" !== f,
                    refetchOnWindowFocus: !1,
                    refetchOnMount: !1
                }), At = (0, eo.Z)(() => {
                    (0, AC.B)("user.logout", {}, {
                        platform: {
                            MP: !0,
                            SS: !0
                        }
                    }), new AJ.Z().reset(), new Az.HY().reset(), v()
                }), [Ai, An] = (0, T.useState)(!1), [Ao, Al] = (0, T.useState)(!1), Ar = (0, eo.Z)(() => {
                    if (!W) {
                        z({
                            trigger: "team-settings-from-header",
                            ads: "background",
                            switchType: "plan",
                            upsellTitle: a("upgrade_for_more"),
                            checkoutTitle: a("upgrade_for_more")
                        });
                        return
                    }
                    An(!0)
                }), Aa = (0, T.useMemo)(() => {
                    var A;
                    return [!w && {
                        label: (0, Q.jsxs)("div", {
                            className: "flex gap-2",
                            children: [G ? a("team_settings") : a("create_a_team"), " ", W ? void 0 : (0, Q.jsx)(S.Ct, {
                                children: a("pro")
                            })]
                        }),
                        key: "0",
                        icon: (0, Q.jsx)(ee, {
                            width: 16,
                            height: 16
                        }),
                        onClick: Ar
                    }, !I && AA && b && {
                        label: "Video index settings",
                        key: "video-index",
                        icon: (0, Q.jsx)(ek, {}),
                        onClick: () => Al(!0)
                    }, !B && {
                        label: (0, Q.jsxs)("div", {
                            className: "flex gap-2",
                            children: [a("opus_clip_captions"), (0, Q.jsx)(S.Ct, {
                                variant: "secondary",
                                children: a("free")
                            })]
                        }),
                        icon: (0, Q.jsx)(A1.Z, {
                            width: 16,
                            height: 16
                        }),
                        key: "1",
                        onClick: () => {
                            (0, AC.B)("user.header.click", {
                                destination: "freetool-captions"
                            }), window.location.href = "/captions"
                        }
                    }, !U && {
                        label: (0, Q.jsxs)("div", {
                            children: [a("opus_clip_thumbnail"), " ", (0, Q.jsx)(S.Ct, {
                                variant: "secondary",
                                children: a("free")
                            })]
                        }),
                        icon: (0, Q.jsx)(A1.Z, {
                            width: 16,
                            height: 16
                        }),
                        key: "2",
                        onClick: () => {
                            (0, AC.B)("user.header.click", {
                                destination: "freetool-thumbnail"
                            }), window.location.href = Ay.Z.youtubeThumbnailMaker
                        }
                    }, !F && {
                        label: a("credit_usage_history"),
                        icon: (0, Q.jsx)(A2.Z, {
                            height: 16,
                            width: 16
                        }),
                        key: "3",
                        onClick: () => {
                            window.location.href = "/activity"
                        }
                    }, !E && l && p && {
                        label: (0, Q.jsxs)("div", {
                            className: "flex w-full items-center justify-between",
                            children: [a("language"), " ", (0, Q.jsx)("span", {
                                className: "text-muted-foreground text-xs",
                                children: null === (A = L.find(A => A.lang === s.language)) || void 0 === A ? void 0 : A.label
                            })]
                        }),
                        icon: (0, Q.jsx)(A5.Z, {}),
                        key: "lang_switcher",
                        alignOffset: J && 100,
                        sideOffset: J && -130,
                        children: L.map(A => ({
                            className: Z === A.lang && "bg-accent",
                            label: (0, Q.jsxs)("div", {
                                className: (0, Aj.cn)("flex justify-between w-full"),
                                children: [(0, Q.jsx)("span", {
                                    className: "truncate min-w-0 flex-1 mr-2",
                                    children: A.label
                                }), A.isBeta && (0, Q.jsx)(S.Ct, {
                                    variant: "secondary",
                                    className: "flex-shrink-0",
                                    children: a("beta")
                                })]
                            }),
                            key: A.lang,
                            checked: !A.isBeta && Z === A.lang
                        }))
                    }, {
                        type: "separator"
                    }, {
                        label: a("logout"),
                        key: "logout",
                        icon: (0, Q.jsx)(A4.Z, {
                            width: 16,
                            height: 16
                        }),
                        onClick: At
                    }].filter(A => !!A)
                }, [G, a, W, Ar, l, p, s.language, J, Z, At, AA, b, L, w, B, U, F, I, E]);
                return "hasData" !== $.state ? (0, Q.jsx)(Q.Fragment, {}) : C && u ? (0, Q.jsx)(S.zx, {
                    "aria-label": "Loading",
                    variant: "secondary"
                }) : m ? (0, Q.jsxs)(Q.Fragment, {
                    children: [(0, Q.jsxs)("div", {
                        className: "flex w-full flex-col items-center",
                        children: [(0, Q.jsx)(S.h_, {
                            classNames: {
                                label: "py-0 px-0",
                                content: "w-max max-w-full translate-y-0 rounded-md border border-muted overflow-hidden bg-popover"
                            },
                            label: (0, Q.jsxs)(Q.Fragment, {
                                children: [J && (0, Q.jsx)(S.zx, {
                                    variant: "secondary",
                                    className: "text-foreground m-2 flex",
                                    onClick: () => {
                                        z({
                                            switchType: (null == X ? void 0 : X.plan) === "Essential" ? "plan" : "pack",
                                            trigger: "add-more-credits-from-sider",
                                            ads: "background"
                                        })
                                    },
                                    children: a("add_more_credits")
                                }), _ ? $.data.length > 0 ? (0, Q.jsxs)(Q.Fragment, {
                                    children: [(0, Q.jsx)(S.ZT, {
                                        className: "mb-[2px] px-2 py-[6px] text-sm font-normal",
                                        children: a("accounts")
                                    }), (0, Q.jsx)("div", {
                                        onClick: () => P(!0),
                                        className: "hover:bg-secondary mb-1 flex h-[36px] w-full items-center justify-between gap-1 rounded-md px-2 py-1 pb-[6px]",
                                        children: (0, Q.jsxs)("div", {
                                            className: "flex items-center gap-2",
                                            children: [(0, Q.jsx)(A9.Z, {}), (0, Q.jsx)(S.ZT, {
                                                variant: "headings",
                                                className: "text-sm font-normal leading-5",
                                                children: (null == x ? void 0 : x.name) || (null == x ? void 0 : x.email)
                                            })]
                                        })
                                    }), (0, Q.jsx)(eS, {
                                        open: D,
                                        onClose: () => P(!1),
                                        hasTeam: G || $.data.length > 1
                                    })]
                                }) : (0, Q.jsx)("div", {
                                    style: {
                                        height: "4px",
                                        width: "100%"
                                    }
                                }) : $.data.length > 1 ? (0, Q.jsx)(S.ZT, {
                                    className: "border-muted mb-[2px] border-b px-2 py-[6px] text-sm font-normal",
                                    children: a("switch_account")
                                }) : (0, Q.jsx)("div", {
                                    style: {
                                        height: "4px",
                                        width: "100%"
                                    }
                                }), (G || $.data.length > 1 || !_) && (0, Q.jsx)(ew.a, {
                                    className: (0, Aj.cn)(b ? "max-h-[200px] xs:max-h-[240px] sm:max-h-[300px]" : "max-h-[144px] xs:max-h-[180px] sm:max-h-[216px]", "overflow-y-auto"),
                                    showCurrent: !0,
                                    onSwitch: async () => {
                                        setTimeout(() => {
                                            g.reload()
                                        }, J ? 300 : 100)
                                    }
                                })]
                            }),
                            items: Aa,
                            side: "bottom",
                            align: "start",
                            onClick: A => {
                                let {
                                    key: e,
                                    path: t
                                } = A;
                                t.includes("lang_switcher") && Z !== e && ((0, AC.B)("i18n.change_language", {
                                    source: Z,
                                    target: e,
                                    site: "clip"
                                }), n(e))
                            },
                            children: (0, Q.jsxs)(S.zx, {
                                "aria-label": "Profile",
                                variant: "outline",
                                className: (0, Aj.cn)("w-full hover:bg-accent/50 py-[6px] h-[62px] data-[state=open]:bg-secondary", i ? "flex-col gap-2 px-0 w-[44px]" : "flex-row gap-2"),
                                onClick: () => {
                                    (0, AC.B)("user.header.click", {
                                        source: "profile"
                                    }, {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    })
                                },
                                children: [(0, Q.jsx)(eR.Z, {
                                    className: (0, Aj.cn)("rounded-full", i ? "size-6" : "w-9 h-9"),
                                    name: H.name,
                                    logo: H.logo
                                }), !i && (0, Q.jsxs)("div", {
                                    className: "animate-fade flex flex-1 flex-col items-start",
                                    children: [(0, Q.jsx)(S.ZT, {
                                        variant: "headings",
                                        className: "max-w-20 truncate text-sm",
                                        children: H.name
                                    }), (0, Q.jsxs)("div", {
                                        className: "flex flex-row items-center gap-1",
                                        children: [(0, Q.jsx)(ee, {
                                            width: 12,
                                            height: 12
                                        }), (0, Q.jsx)(S.ZT, {
                                            className: "text-primary flex items-center text-xs",
                                            children: null != Ae ? Ae : 0
                                        })]
                                    })]
                                }), (0, Q.jsx)(A3.Z, {})]
                            })
                        }), !y && (0, Q.jsx)(S.u, {
                            content: i ? a("invite_members") : null,
                            side: J ? "top" : "right",
                            sideOffset: 8,
                            className: "z-[10000]",
                            portal: !0,
                            children: (0, Q.jsxs)(S.zx, {
                                "aria-label": a("invite_members"),
                                variant: "outline",
                                className: (0, Aj.cn)("w-full p-2 h-[34px] hover:bg-accent/50 mt-2", i && "w-[44px]"),
                                onClick: () => {
                                    (0, AC.B)("user.header.click", {
                                        source: "invite_members"
                                    }, {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    }), Ar()
                                },
                                children: [(0, Q.jsx)(en, {
                                    width: 14,
                                    height: 14,
                                    className: (0, Aj.cn)(!i && "mr-2")
                                }), !i && a("invite_members")]
                            })
                        })]
                    }), (0, Q.jsx)(eL.Z, {
                        open: Ai,
                        onClose: () => {
                            An(!1)
                        }
                    }), (0, Q.jsx)(ey, {
                        open: Ao,
                        onOpenChange: Al
                    })]
                }) : (0, Q.jsx)(S.zx, {
                    onClick: () => {
                        (0, AC.B)("user.login", (0, AW._)({
                            from: "nav-bar"
                        }, c)), h()
                    },
                    className: "size-10 p-2",
                    "aria-label": "Sign in",
                    children: (0, Q.jsx)(A6.Z, {
                        width: 20,
                        height: 20,
                        strokeWidth: 2
                    })
                })
            }
            let eO = function() {
                    let A = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                        e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                        t = arguments.length > 2 ? arguments[2] : void 0,
                        i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                        n = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
                    return [{
                        group: "Create",
                        enable: !0,
                        icon: (0, Q.jsx)(Am, {}),
                        name: "Home",
                        displayName: t("common:home"),
                        url: Ay.Z.dashboard
                    }, {
                        group: "Create",
                        enable: e && !n,
                        icon: (0, Q.jsx)(R.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Submit video",
                        displayName: t("common:submit_video"),
                        url: Ay.Z.submitVideo
                    }, {
                        group: "Create",
                        enable: !n,
                        icon: e ? (0, Q.jsx)(W, {}) : (0, Q.jsx)(k.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Brand template",
                        displayName: t("common:brand_template"),
                        badge: A ? null : t("pro")
                    }, {
                        group: "Create",
                        enable: !i,
                        icon: (0, Q.jsx)(Ag, {}),
                        name: "Asset library",
                        displayName: t("common:asset_library"),
                        url: Ay.Z.library
                    }]
                },
                eD = function(A, e, t) {
                    let i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                        n = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
                        o = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
                    return [{
                        group: "Post",
                        enable: !o,
                        icon: (0, Q.jsx)(Ac, {}),
                        name: "Calendar",
                        displayName: A("common:calendar"),
                        badge: (null == e ? void 0 : e.Calendar) ? null : null == A ? void 0 : A("new"),
                        url: Ay.Z.calendar
                    }, {
                        group: "Post",
                        enable: !!(null == t ? void 0 : t.Analytics) && !i,
                        icon: (0, Q.jsx)(An, {}),
                        name: "Analytics",
                        displayName: A("common:analytics"),
                        badge: (null == e ? void 0 : e.Analytics) ? null : null == A ? void 0 : A("new"),
                        url: Ay.Z.analytics
                    }, {
                        group: "Post",
                        enable: !n,
                        icon: (0, Q.jsx)(q.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Social accounts",
                        displayName: A("common:social_accounts")
                    }]
                },
                eP = function(A, e) {
                    let t = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                    return [{
                        enable: !(null == e ? void 0 : e.HasClipSearchAccess),
                        icon: (0, Q.jsx)(O.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Subscription",
                        displayName: A("common:subscription"),
                        url: Ay.Z.subscription
                    }, {
                        enable: !!(null == e ? void 0 : e.API) && !t,
                        icon: (0, Q.jsx)(D.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "API Access",
                        displayName: A("common:api_access")
                    }, {
                        enable: !0,
                        icon: (0, Q.jsx)(Ax, {}),
                        name: "Learning center",
                        displayName: A("common:learn_center")
                    }, {
                        enable: !!(null == e ? void 0 : e.Affiliate),
                        icon: (0, Q.jsx)(P.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Affiliate program",
                        displayName: A("common:affiliate_program")
                    }, {
                        enable: !0,
                        icon: (0, Q.jsx)(N.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Help center",
                        displayName: A("common:help_center")
                    }]
                },
                eN = function() {
                    let A = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    return [{
                        group: "Manage",
                        enable: !A,
                        icon: (0, Q.jsx)(Z.Z, {
                            width: 20,
                            height: 20,
                            strokeWidth: 2
                        }),
                        name: "Favorites",
                        url: Ay.Z.favorite
                    }, {
                        group: "Manage",
                        enable: !0,
                        icon: (0, Q.jsx)(z, {}),
                        url: Ay.Z.collections,
                        name: "All content"
                    }]
                },
                eZ = {
                    Search: "search",
                    Home: "home",
                    "Submit video": "submit_video",
                    "Brand template": "brand_template",
                    "Asset library": "asset_library",
                    Calendar: "calendar",
                    Analytics: "analytics",
                    "Social accounts": "social_accounts",
                    Subscription: "subscription",
                    "API Access": "api_access",
                    "Learning center": "learn_center",
                    "Help center": "help_center",
                    Favorites: "favorites",
                    "All content": "all_content",
                    "Affiliate program": "affiliate_program"
                },
                eM = A => {
                    let {
                        title: e,
                        className: t,
                        routes: i,
                        expand: n,
                        onClick: o
                    } = A, {
                        t: l
                    } = (0, Y.$G)("common"), r = (0, AQ.t)(), {
                        isBelowMd: a
                    } = (0, AF.G)("md"), s = (A, e) => {
                        (0, AC.B)("user.header.click", {
                            source: A
                        }, {
                            platform: {
                                MP: !0,
                                SS: !0
                            }
                        }), e && r.push(e), o && o(A)
                    };
                    return (0, Q.jsxs)("div", {
                        className: (0, Aj.cn)("flex flex-col gap-2 items-start w-full", t),
                        children: [e && (0, Q.jsx)(S.ZT, {
                            className: (0, Aj.cn)("text-sm font-normal text-muted-foreground", n ? "animate-fade" : "opacity-0"),
                            children: e
                        }), null == i ? void 0 : i.map(A => {
                            var e, t;
                            return (null == A ? void 0 : A.enable) && (0, Q.jsx)(S.u, {
                                content: n ? null : null !== (e = A.displayName) && void 0 !== e ? e : A.name,
                                side: a ? "top" : "right",
                                sideOffset: 8,
                                className: "z-[10000]",
                                portal: !0,
                                children: (0, Q.jsxs)("div", {
                                    "aria-label": null !== (t = A.displayName) && void 0 !== t ? t : A.name,
                                    className: (0, Aj.cn)("relative flex justify-start w-full h-9 items-center gap-2 border rounded-md border-transparent text-sm text-foreground p-2 font-sans font-medium cursor-pointer text-nowrap hover:bg-accent/50 hover:border-border", (null == A ? void 0 : A.url) === r.asPath && "border-border bg-accent/50", !n && "w-9"),
                                    onClick: () => {
                                        s(A.name, A.url)
                                    },
                                    children: [(0, Q.jsx)("div", {
                                        className: "max-md:animate-fade size-5",
                                        children: A.icon
                                    }), n ? (0, Q.jsx)("span", {
                                        className: "animate-fade",
                                        children: l(eZ[A.name])
                                    }) : null, A.badge ? (0, Q.jsx)(S.Ct, {
                                        className: (0, Aj.cn)(!n && "New" !== A.badge && "hidden", n ? "" : "hidden absolute left-5 top-0 -translate-y-4", "px-2"),
                                        children: A.badge
                                    }) : null]
                                })
                            }, A.name)
                        })]
                    })
                };
            var eV = A => {
                var e, t;
                let {
                    open: i,
                    onOpenChange: n,
                    className: o
                } = A, {
                    t: l,
                    i18n: r
                } = (0, Y.$G)("common"), a = (0, AI.Z)(), [s, c] = (0, V.KO)(AO.Z.socialAccountListDialogOpen), [u, d] = (0, V.KO)(AD.Z.featureUsed("sidebar_schedule_new")), [g, p] = (0, V.KO)(AD.Z.featureUsed("sidebar_analytics_new")), f = (0, L.useGateValue)("enterprise_api_secret_key", {
                    disableExposureLog: !0
                }), m = (0, L.useGateValue)("enable_analytics", {
                    disableExposureLog: !0
                }), h = (0, L.useGateValue)("affiliate_enabled"), v = (0, V.Dv)(Aq.a.currentOrgAsset), x = null == v ? void 0 : v.isEnterprise, C = !!(null == v ? void 0 : null === (e = v.features) || void 0 === e ? void 0 : e.some(A => A.isOn && "OpenApi" === A.key)), K = !!(null == v ? void 0 : null === (t = v.permissions) || void 0 === t ? void 0 : t.includes("enterprise:key:view")), [b, y] = (0, T.useState)(!1), [w, B] = (0, T.useState)(!1), U = (0, AL.Z)(), [{
                    features: {
                        disableViewAssets: F,
                        disableViewAnalytics: I,
                        disableViewFavourites: E,
                        disableViewSocialAccounts: R,
                        disableViewCalender: k,
                        disableViewAPIKey: q,
                        disableViewSubmitVideo: O
                    }
                }] = (0, AU.Ae)("opus_search_demos", "vidSummit", AK.X), {
                    trigger: D,
                    featureOn: P
                } = (0, Ak.r)({
                    featureKey: "BrandTemplate",
                    checkIsOnOnly: !0,
                    upsellDesc: {
                        trigger: "brand-template-entry-from-header",
                        ads: "background",
                        switchType: "plan",
                        upsellTitle: l("upgrade_for_more"),
                        checkoutTitle: l("upgrade_for_more")
                    }
                }), [N] = (0, AE.Eh)(), Z = A => {
                    if (a && n(!1), "Brand template" === A) {
                        if (a) {
                            S.Am.warning(l("name_features", {
                                name: A
                            }));
                            return
                        }
                        D() || (window.location.href = N ? Ay.Z.brandTemplatesUX : Ay.Z.brandTemplates)
                    } else "Help center" === A ? window.open(Aw.DO, "_blank") : "Learning center" === A ? window.open(Aw.s6, "_blank") : "Social accounts" === A ? c(!0) : "Calendar" === A ? d(!0) : "Analytics" === A ? p(!0) : "API Access" === A ? y(!0) : "Affiliate program" === A && ((0, AC.B)("affiliate.open", {}), B(!0))
                };
                return (0, Q.jsx)(AS.q, {
                    children: (0, Q.jsxs)("aside", {
                        className: (0, Aj.cn)("absolute top-0 left-0 p-3 flex flex-col justify-start items-start gap-y-6 bg-background transition-all duration-300 transform-gpu z-30", i ? "w-full h-full border-border overflow-y-scroll border-r z-40 ".concat(j.jk.includes(r.language) ? "md:w-[229px]" : "md:w-[224px]") : "w-[60px] max-md:h-[60px] md:overflow-y-auto md:h-full border-r-transparent", o),
                        children: [(0, Q.jsxs)("div", {
                            className: "flex w-full items-center justify-between max-md:h-9",
                            children: [(0, Q.jsx)(AB.VQ, {}), i && (0, Q.jsxs)("div", {
                                id: Ab.fx,
                                className: "flex cursor-pointer flex-row items-center justify-center p-2",
                                children: [(0, Q.jsx)(Ae.r, {
                                    "aria-label": "Logo of OpusClip, Click to main page",
                                    onClick: () => {
                                        window.location.href = "/"
                                    }
                                }), (null == v ? void 0 : v.plan) && (0, Q.jsx)("div", {
                                    className: "ml-[10px] flex items-center gap-2",
                                    children: U ? (0, Q.jsx)(AA, {
                                        className: "h-6 w-24"
                                    }) : (0, Q.jsx)(S.Ct, {
                                        variant: "secondary",
                                        className: "text-xs",
                                        children: "FreePlan" === v.plan ? l("free") : v.plan
                                    })
                                })]
                            }), (0, Q.jsx)(AB.pZ, {
                                inline: !1,
                                children: (0, Q.jsx)(S.zx, {
                                    "aria-label": i ? "Click to collapse drawer" : "Click to expand drawer",
                                    variant: "outline",
                                    className: "box-border size-9 p-2",
                                    onClick: () => n(!i),
                                    children: i ? (0, Q.jsx)(Ar, {}) : a ? (0, Q.jsx)(M.Z, {}) : (0, Q.jsx)(Ar, {
                                        className: "rotate-180"
                                    })
                                })
                            })]
                        }), (i || !a) && (0, Q.jsxs)(Q.Fragment, {
                            children: [(0, Q.jsx)(eq, {
                                mini: !i
                            }), (0, Q.jsxs)("div", {
                                className: "flex w-full flex-1 flex-col gap-y-6",
                                children: [(0, Q.jsx)(eM, {
                                    title: l("create"),
                                    routes: eO(P, !!U, l, F, O),
                                    expand: i,
                                    onClick: Z
                                }), x && !a && (0, Q.jsx)(eM, {
                                    title: l("manage"),
                                    routes: eN(E),
                                    expand: i,
                                    onClick: Z
                                }), !O && (0, Q.jsx)(eM, {
                                    title: U ? l("publish") : l("post"),
                                    routes: eD(l, {
                                        Calendar: u,
                                        Analytics: g
                                    }, {
                                        Analytics: m
                                    }, I, R, k),
                                    expand: i,
                                    onClick: Z
                                })]
                            }), (0, Q.jsx)(eM, {
                                className: "self-end",
                                routes: eP(l, {
                                    API: (f || C) && K,
                                    HasClipSearchAccess: U || !1,
                                    Affiliate: h
                                }, q),
                                expand: i,
                                onClick: Z
                            }), a || U ? (0, Q.jsx)(AT.default, {
                                className: "bg-background static border-none px-2 [&_svg]:size-5"
                            }) : null]
                        }), (0, Q.jsx)(AV, {
                            className: i ? "left-[220px]" : "left-[60px]",
                            onTry: () => c(!0)
                        }), (0, Q.jsx)(AR.Z, {
                            open: s,
                            onClose: () => c(!1)
                        }), (0, Q.jsx)(AP.Z, {
                            visible: b,
                            onOk: () => y(!1),
                            onCancel: () => y(!1)
                        }), h && (0, Q.jsx)(A_, {
                            open: w,
                            onOpenChange: B
                        })]
                    })
                })
            }
        },
        70733: function(A, e, t) {
            "use strict";
            t.d(e, {
                i: function() {
                    return m
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(80827),
                l = t(17212),
                r = t(752),
                a = t(2784),
                s = t(98614),
                c = t(70183),
                u = t(44724),
                d = t(10123),
                g = t(30933),
                p = t(63453),
                f = t(22108);
            let m = A => {
                    let {
                        animate: e = !1,
                        className: t,
                        containerClassName: l
                    } = A;
                    return (0, i.jsx)(n.u, {
                        content: e ? "Uploading video" : null,
                        disablePersistedActivation: !0,
                        align: "center",
                        trigger: "hover",
                        children: (0, i.jsxs)("div", {
                            className: (0, d.cn)("relative size-4", l),
                            children: [(0, i.jsx)(o.Z, {
                                strokeWidth: "2.5",
                                className: "text-primary",
                                width: 16,
                                height: 16
                            }), (0, i.jsx)("div", {
                                className: (0, d.cn)("absolute opacity-50 inset-0 h-0", e && "h-full animate-collapse-height bg-muted", t)
                            })]
                        })
                    })
                },
                h = A => {
                    let {
                        handleCancelUpload: e,
                        uploadFile: t
                    } = (0, p.L)({}), {
                        t: i
                    } = (0, s.$G)("clip"), n = (0, u.t)();
                    (0, a.useEffect)(() => {
                        if (!A) return;
                        let o = A => {
                            let o = A.includes("projectId") && (A.startsWith("/dashboard") || A.startsWith("/collections")),
                                l = A.startsWith("/workflow");
                            if (!(o || l) && t) {
                                if (window.confirm(i("changes_not_saved"))) e();
                                else throw n.events.emit("routeChangeError"), "Route change aborted"
                            }
                        };
                        return n.events.on("routeChangeStart", o), () => {
                            n.events.off("routeChangeStart", o)
                        }
                    }, [A, n, e, t, i])
                },
                v = a.memo(() => {
                    let {
                        t: A
                    } = (0, s.$G)("clip"), e = (0, r.Dv)(f.Q.uploadingTasks), t = (0, r.Dv)(f.Q.isUploading), {
                        isUploadExp: o
                    } = (0, g.H)(), u = (0, a.useMemo)(() => t && o, [t, o]);
                    (0, c.Z)(u, A("changes_not_saved")), h(u);
                    let p = (0, a.useMemo)(() => (0, i.jsxs)("div", {
                        className: "font-sans",
                        children: [(0, i.jsxs)(n.ZT, {
                            variant: "headings",
                            className: "mb-2 text-sm",
                            children: ["Uploading (", e.length, ")"]
                        }), (0, i.jsx)("div", {
                            className: "text-muted-foreground flex flex-col gap-y-2 text-sm",
                            children: e.map(A => (0, i.jsxs)("div", {
                                className: "flex flex-row items-center gap-x-2 py-2",
                                children: [(0, i.jsx)(l.Z, {
                                    className: "mb-0.5 size-4 animate-spin"
                                }), (0, i.jsx)("div", {
                                    className: "flex-1 shrink truncate",
                                    children: A.file.name
                                }), (0, i.jsxs)("div", {
                                    className: "text-primary self-end",
                                    children: [Math.round(A.progress), "%"]
                                })]
                            }, A.file.name))
                        })]
                    }), [e]);
                    return e.length && o ? (0, i.jsx)(n.J2, {
                        side: "bottom",
                        align: "end",
                        content: p,
                        children: (0, i.jsxs)(n.zx, {
                            size: "lg",
                            variant: "ghost",
                            "aria-label": "Upload Overview",
                            className: (0, d.cn)("relative rounded-md px-0 sm:px-3 py-0 gap-2 h-9"),
                            children: [(0, i.jsx)(m, {
                                animate: t
                            }), e.length]
                        })
                    }) : null
                });
            e.Z = v
        },
        30339: function(A, e, t) {
            "use strict";
            t.d(e, {
                P$: function() {
                    return f
                },
                Qb: function() {
                    return h
                },
                Wb: function() {
                    return g
                },
                a5: function() {
                    return K
                },
                dR: function() {
                    return x
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(43157),
                l = t(7223),
                r = t(2784),
                a = t(98614),
                s = t(59511),
                c = t(71537);
            class u {
                async getUsageInfo() {
                    let A = (0, c.uC)("device");
                    return await A.getItem(this.usageKey)
                }
                async setExpireDays(A) {
                    this.expireDays = A
                }
                async recordUsage() {
                    let A = (0, c.uC)("device"),
                        e = new Date,
                        t = (0, o.Z)((0, l.Z)(e, this.expireDays)).getTime(),
                        r = await this.getUsageInfo();
                    if (!r || !r.expireDate || r.expireDate < e.getTime()) return await A.setItem(this.usageKey, {
                        expireDate: t,
                        count: 1
                    }), 1;
                    let a = r.count + 1;
                    return await A.setItem(this.usageKey, (0, n._)((0, i._)({}, r), {
                        count: a
                    })), a
                }
                async revertUsage() {
                    let A = (0, c.uC)("device"),
                        e = new Date,
                        t = (0, o.Z)((0, l.Z)(e, this.expireDays)).getTime(),
                        r = await this.getUsageInfo();
                    if (!r || !r.expireDate || r.expireDate < e.getTime()) return await A.setItem(this.usageKey, {
                        expireDate: t,
                        count: 0
                    }), 0;
                    let a = Math.max(r.count - 1, 0);
                    return await A.setItem(this.usageKey, (0, n._)((0, i._)({}, r), {
                        count: a
                    })), a
                }
                async getUsageCount() {
                    let A = new Date,
                        e = await this.getUsageInfo();
                    return !e || !e.expireDate || e.expireDate < A.getTime() ? 0 : e.count
                }
                constructor(A, e = 1) {
                    this.usageKey = "", this.expireDays = 1, this.usageKey = A, this.expireDays = e
                }
            }
            let d = new u("gen-broll-ai"),
                g = A => {
                    let {
                        t: e
                    } = (0, a.$G)("editor"), [t, i] = (0, r.useState)(!1), [n, o] = (0, r.useMemo)(() => {
                        switch (A) {
                            case "Enterprise":
                            case "Pro":
                                return [50, 1];
                            case "Starter":
                            case "Essential":
                                return [3, 30];
                            case "FreeTrial":
                                return [3, 7];
                            default:
                                return [0, 1]
                        }
                    }, [A]);
                    (0, r.useEffect)(() => {
                        d.setExpireDays(o), d.getUsageCount().then(A => {
                            i(A >= n)
                        })
                    }, [n, o]);
                    let l = (0, s.Z)(() => {
                            d.recordUsage().then(A => {
                                i(A >= n)
                            })
                        }),
                        c = (0, s.Z)(() => {
                            d.revertUsage().then(A => {
                                i(A >= n)
                            })
                        });
                    return {
                        maxCount: n,
                        recordUsage: l,
                        revertUsage: c,
                        exceedLimit: t,
                        usageHint: (0, r.useMemo)(() => {
                            switch (A) {
                                case "Enterprise":
                                case "Pro":
                                    return e("50_attempts_per_day");
                                case "Starter":
                                case "Essential":
                                    return e("3_attempts_per_month");
                                case "FreeTrial":
                                    return e("3_attempts");
                                default:
                                    return ""
                            }
                        }, [A, e])
                    }
                },
                p = new u("gen-broll-stock"),
                f = A => {
                    let [e, t] = (0, r.useState)(!1), [i, n] = (0, r.useMemo)(() => {
                        switch (A) {
                            case "Enterprise":
                            case "Pro":
                            case "FreeTrial":
                                return [Number.MAX_VALUE, 1];
                            case "Starter":
                            case "Essential":
                                return [3, 30];
                            default:
                                return [0, 1]
                        }
                    }, [A]);
                    (0, r.useEffect)(() => {
                        p.setExpireDays(n), p.getUsageCount().then(A => {
                            t(A >= i)
                        })
                    }, [i, n]);
                    let o = (0, s.Z)(() => {
                            p.recordUsage().then(A => {
                                t(A >= i)
                            })
                        }),
                        l = (0, s.Z)(() => {
                            p.revertUsage().then(A => {
                                t(A >= i)
                            })
                        });
                    return {
                        maxCount: i,
                        recordUsage: o,
                        revertUsage: l,
                        exceedLimit: e
                    }
                },
                m = new u("gen-voiceover-ai"),
                h = A => {
                    let {
                        t: e
                    } = (0, a.$G)("editor"), [t, i] = (0, r.useState)(!1), [n, o] = (0, r.useMemo)(() => [20, 1], [A]);
                    (0, r.useEffect)(() => {
                        m.setExpireDays(o), m.getUsageCount().then(A => {
                            i(A >= n)
                        })
                    }, [n, o]);
                    let l = (0, s.Z)(() => {
                            m.recordUsage().then(A => {
                                i(A >= n)
                            })
                        }),
                        c = (0, s.Z)(() => {
                            m.revertUsage().then(A => {
                                i(A >= n)
                            })
                        }),
                        u = (0, s.Z)(async () => await m.getUsageCount());
                    return {
                        maxCount: n,
                        recordUsage: l,
                        revertUsage: c,
                        exceedLimit: t,
                        usageHint: (0, r.useMemo)(() => e("account_limit_in_beta_10"), [A, e]),
                        getUsageCount: u
                    }
                },
                v = new u("gen-voice-enhancement"),
                x = () => {
                    let {
                        t: A
                    } = (0, a.$G)("editor"), [e, t] = (0, r.useState)(!1), [i, n] = (0, r.useMemo)(() => [10, 1], []), [o, l] = (0, r.useState)(i);
                    (0, r.useEffect)(() => {
                        v.setExpireDays(n), v.getUsageCount().then(A => {
                            t(A >= i), l(Math.max(i - A, 0))
                        })
                    }, [i, n]);
                    let c = (0, s.Z)(() => {
                            v.recordUsage().then(A => {
                                t(A >= i), l(Math.max(i - A, 0))
                            })
                        }),
                        u = (0, s.Z)(() => {
                            v.revertUsage().then(A => {
                                t(A >= i), l(Math.max(i - A, 0))
                            })
                        });
                    return {
                        maxCount: i,
                        recordUsage: c,
                        revertUsage: u,
                        exceedLimit: e,
                        usageHint: (0, r.useMemo)(() => A("account_limit_in_beta_10"), [A]),
                        remain: o
                    }
                },
                C = new u("quick-editor-usage"),
                K = () => {
                    let {
                        t: A
                    } = (0, a.$G)("editor"), [e, t] = (0, r.useState)(!1), [i, n] = (0, r.useMemo)(() => [20, 1], []), [o, l] = (0, r.useState)(i);
                    (0, r.useEffect)(() => {
                        C.setExpireDays(n), C.getUsageCount().then(A => {
                            t(A >= i), l(Math.max(i - A, 0))
                        })
                    }, [i, n]);
                    let c = (0, s.Z)(() => {
                            C.recordUsage().then(A => {
                                t(A >= i), l(Math.max(i - A, 0))
                            })
                        }),
                        u = (0, s.Z)(() => {
                            C.revertUsage().then(A => {
                                t(A >= i), l(Math.max(i - A, 0))
                            })
                        });
                    return {
                        maxCount: i,
                        recordUsage: c,
                        revertUsage: u,
                        exceedLimit: e,
                        usageHint: (0, r.useMemo)(() => A("account_limit_in_beta_20"), [A]),
                        remain: o
                    }
                }
        },
        91381: function(A, e, t) {
            "use strict";
            t.d(e, {
                $N: function() {
                    return x
                },
                Be: function() {
                    return C
                },
                GG: function() {
                    return p
                },
                Vq: function() {
                    return u
                },
                cN: function() {
                    return v
                },
                cZ: function() {
                    return m
                },
                fK: function() {
                    return h
                },
                hg: function() {
                    return d
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(83286),
                l = t(52322),
                r = t(70241),
                a = t(77298),
                s = t(2784),
                c = t(10123);
            let u = r.fC,
                d = r.xz,
                g = r.h_,
                p = r.x8,
                f = s.forwardRef((A, e) => {
                    var {
                        className: t,
                        onCancel: n
                    } = A, a = (0, o._)(A, ["className", "onCancel"]);
                    return (0, l.jsx)(r.aV, (0, i._)({
                        ref: e,
                        className: (0, c.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", t),
                        onClick: n
                    }, a))
                });
            f.displayName = r.aV.displayName;
            let m = s.forwardRef((A, e) => {
                var {
                    className: t,
                    children: s,
                    showClose: u = !0,
                    overLayClassName: d,
                    onCancel: p
                } = A, m = (0, o._)(A, ["className", "children", "showClose", "overLayClassName", "onCancel"]);
                return (0, l.jsxs)(g, {
                    children: [(0, l.jsx)(f, {
                        className: d,
                        onCancel: p
                    }), (0, l.jsxs)(r.VY, (0, n._)((0, i._)({
                        ref: e,
                        className: (0, c.cn)("border-border child-button:bg-transparent fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", t)
                    }, m), {
                        children: [s, u && (0, l.jsxs)(r.x8, {
                            className: "ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none",
                            children: [u && (0, l.jsx)(a.Pxu, {
                                className: "size-4"
                            }), (0, l.jsx)("span", {
                                className: "sr-only",
                                children: "Close"
                            })]
                        })]
                    }))]
                })
            });
            m.displayName = r.VY.displayName;
            let h = A => {
                var {
                    className: e
                } = A, t = (0, o._)(A, ["className"]);
                return (0, l.jsx)("div", (0, i._)({
                    className: (0, c.cn)("font-sans flex flex-col space-y-1.5 text-center sm:text-left", e)
                }, t))
            };
            h.displayName = "DialogHeader";
            let v = A => {
                var {
                    className: e
                } = A, t = (0, o._)(A, ["className"]);
                return (0, l.jsx)("div", (0, i._)({
                    className: (0, c.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", e)
                }, t))
            };
            v.displayName = "DialogFooter";
            let x = s.forwardRef((A, e) => {
                var {
                    className: t
                } = A, n = (0, o._)(A, ["className"]);
                return (0, l.jsx)(r.Dx, (0, i._)({
                    ref: e,
                    className: (0, c.cn)("text-[#FAFAFA] text-lg font-semibold leading-none tracking-tight", t)
                }, n))
            });
            x.displayName = r.Dx.displayName;
            let C = s.forwardRef((A, e) => {
                var {
                    className: t
                } = A, n = (0, o._)(A, ["className"]);
                return (0, l.jsx)(r.dk, (0, i._)({
                    ref: e,
                    className: (0, c.cn)("text-sm text-muted-foreground", t)
                }, n))
            });
            C.displayName = r.dk.displayName
        },
        71787: function(A, e, t) {
            "use strict";
            t.d(e, {
                $F: function() {
                    return d
                },
                AW: function() {
                    return p
                },
                Qk: function() {
                    return g
                },
                Xi: function() {
                    return f
                },
                h_: function() {
                    return u
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(83286),
                l = t(52322),
                r = t(40538),
                a = t(77298),
                s = t(2784),
                c = t(10123);
            let u = r.fC,
                d = r.xz,
                g = r.ZA;
            r.Uv, r.Tr, r.Ee, s.forwardRef((A, e) => {
                var {
                    className: t,
                    inset: s,
                    children: u
                } = A, d = (0, o._)(A, ["className", "inset", "children"]);
                return (0, l.jsxs)(r.fF, (0, n._)((0, i._)({
                    ref: e,
                    className: (0, c.cn)("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", s && "pl-8", t)
                }, d), {
                    children: [u, (0, l.jsx)(a.XCv, {
                        className: "ml-auto size-4"
                    })]
                }))
            }).displayName = r.fF.displayName, s.forwardRef((A, e) => {
                var {
                    className: t
                } = A, n = (0, o._)(A, ["className"]);
                return (0, l.jsx)(r.tu, (0, i._)({
                    ref: e,
                    className: (0, c.cn)("font-sans z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t)
                }, n))
            }).displayName = r.tu.displayName;
            let p = s.forwardRef((A, e) => {
                var {
                    className: t,
                    sideOffset: n = 4
                } = A, a = (0, o._)(A, ["className", "sideOffset"]);
                return (0, l.jsx)(r.Uv, {
                    children: (0, l.jsx)(r.VY, (0, i._)({
                        ref: e,
                        sideOffset: n,
                        className: (0, c.cn)("font-sans border-border z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", t)
                    }, a))
                })
            });
            p.displayName = r.VY.displayName;
            let f = s.forwardRef((A, e) => {
                var {
                    className: t,
                    inset: n
                } = A, a = (0, o._)(A, ["className", "inset"]);
                return (0, l.jsx)(r.ck, (0, i._)({
                    ref: e,
                    className: (0, c.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", n && "pl-8", t)
                }, a))
            });
            f.displayName = r.ck.displayName, s.forwardRef((A, e) => {
                var {
                    className: t,
                    children: s,
                    checked: u
                } = A, d = (0, o._)(A, ["className", "children", "checked"]);
                return (0, l.jsxs)(r.oC, (0, n._)((0, i._)({
                    ref: e,
                    className: (0, c.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", t),
                    checked: u
                }, d), {
                    children: [(0, l.jsx)("span", {
                        className: "absolute left-2 flex size-3.5 items-center justify-center",
                        children: (0, l.jsx)(r.wU, {
                            children: (0, l.jsx)(a.nQG, {
                                className: "size-4"
                            })
                        })
                    }), s]
                }))
            }).displayName = r.oC.displayName, s.forwardRef((A, e) => {
                var {
                    className: t,
                    children: s
                } = A, u = (0, o._)(A, ["className", "children"]);
                return (0, l.jsxs)(r.Rk, (0, n._)((0, i._)({
                    ref: e,
                    className: (0, c.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", t)
                }, u), {
                    children: [(0, l.jsx)("span", {
                        className: "absolute left-2 flex size-3.5 items-center justify-center",
                        children: (0, l.jsx)(r.wU, {
                            children: (0, l.jsx)(a.jXb, {
                                className: "size-4 fill-current"
                            })
                        })
                    }), s]
                }))
            }).displayName = r.Rk.displayName, s.forwardRef((A, e) => {
                var {
                    className: t,
                    inset: n
                } = A, a = (0, o._)(A, ["className", "inset"]);
                return (0, l.jsx)(r.__, (0, i._)({
                    ref: e,
                    className: (0, c.cn)("px-2 py-1.5 text-sm font-semibold", n && "pl-8", t)
                }, a))
            }).displayName = r.__.displayName, s.forwardRef((A, e) => {
                var {
                    className: t
                } = A, n = (0, o._)(A, ["className"]);
                return (0, l.jsx)(r.Z0, (0, i._)({
                    ref: e,
                    className: (0, c.cn)("-mx-1 my-1 h-px bg-muted", t)
                }, n))
            }).displayName = r.Z0.displayName
        },
        5077: function(A, e, t) {
            "use strict";
            t.d(e, {
                UU: function() {
                    return l
                },
                fx: function() {
                    return i
                },
                g2: function() {
                    return n
                },
                u9: function() {
                    return o
                }
            });
            let i = "clip_header_logo_area",
                n = "clip_header_extra_area",
                o = "opus-header",
                l = "dashboard-layout-container"
        },
        63200: function(A, e, t) {
            "use strict";
            t.d(e, {
                VQ: function() {
                    return b
                },
                pZ: function() {
                    return B
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(52322),
                l = t(57992),
                r = t(50823),
                a = t(21789),
                s = t(13379),
                c = t(752),
                u = t(2784),
                d = t(63955),
                g = t(1332),
                p = t(59511),
                f = t(10123),
                m = t(87558),
                h = t(55773),
                v = t(91376),
                x = t(45910),
                C = t(87579);
            let K = "clip_debug_area";

            function b() {
                let [A, e] = (0, c.KO)(v.D.debugMode), t = (0, c.Dv)(h.Mz.isOpusEmail), [r, a] = (0, u.useState)(!1), s = (0, d.cI)();
                return (0, u.useEffect)(() => {
                    let i = document.querySelector("#".concat(K));
                    if (!i) return;
                    let n = i => {
                        2 === i.detail && (A ? e(!1) : "hasData" === t.state && t.data ? e(!0) : a(!0))
                    };
                    return i.addEventListener("click", n), () => i.removeEventListener("click", n)
                }, [e, A, t]), (0, o.jsxs)(o.Fragment, {
                    children: [(0, o.jsx)("div", {
                        id: K,
                        className: "absolute left-0 top-0 z-10 size-5"
                    }), (0, o.jsx)(l.Vq, {
                        open: r,
                        onOpenChange: a,
                        showClose: !1,
                        children: (0, o.jsx)(l.l0, (0, n._)((0, i._)({}, s), {
                            children: (0, o.jsx)("form", {
                                onSubmit: s.handleSubmit(A => {
                                    "yQKjapgvgKj/yyy" === function(A, e) {
                                        let t = "";
                                        for (let e = 0; e < A.length; e++) {
                                            let i = A.charCodeAt(e);
                                            i % 3 == 0 ? i = (i - 65 + 2) % 26 + 65 : i % 3 == 2 && (i = (i - 97 + 2) % 26 + 97), t += String.fromCharCode(i)
                                        }
                                        return t
                                    }(A.kwd, 2) && e(!0), a(!1)
                                }),
                                children: (0, o.jsx)(l.l0.Item, {
                                    type: "Input",
                                    name: "kwd",
                                    className: "flex-col",
                                    placeholder: "Wifi name",
                                    rules: {
                                        pattern: {
                                            value: /^[a-zA-Z0-9-_]*$/,
                                            message: "Invalid characters"
                                        }
                                    }
                                })
                            })
                        }))
                    })]
                })
            }
            let y = (0, g.QY)(),
                w = (0, g.qM)();

            function B(A) {
                let {
                    children: e,
                    inline: t = !0
                } = A, i = (0, c.Dv)(v.D.debugMode), [n, a] = (0, c.KO)(m.K.nestApiPrefix), [, s] = (0, c.KO)(m.K.apiPrefix), [, d] = (0, c.KO)(v.D.debugIp), [, h] = (0, C.I)(x.L.ClipEngineManager), [, K] = (0, C.I)(x.L.ClipApi), b = (0, u.useMemo)(() => n === y ? "PROD" : n === w ? "SOLO" : "DEV", [n]), B = (0, p.Z)(A => {
                    switch (A) {
                        case "PROD":
                            s(y), a(y), h((0, g.cm)() ? "STG" : "PROD"), K((0, g.cm)() ? "STG" : "PROD"), d("");
                            break;
                        case "SOLO":
                            s(w), a(w), h("SOLO"), K("SOLO"), d("");
                            break;
                        case "DEV":
                            s("http://localhost:8000/api"), a("http://localhost:3001/api"), h("DEV"), K("DEV"), d("8.7.6.5")
                    }
                }), F = A => {
                    B(A ? "PROD" : "DEV")
                }, I = A => {
                    B(A ? "SOLO" : "PROD")
                };
                return (0, o.jsxs)("div", {
                    className: "relative flex min-h-4 flex-row items-center",
                    children: [(t || !i) && e, i && (0, o.jsx)(l.u, {
                        portal: !0,
                        content: "Debug Mode On (api: ".concat(n, ")"),
                        children: (0, o.jsx)(r.Z, {
                            className: (0, f.cn)("size-8 cursor-pointer", "PROD" === b && "text-success", "SOLO" === b && "text-warn", "DEV" === b && "text-destructive"),
                            onClick: () => F("DEV" === b),
                            onContextMenu: A => {
                                A.preventDefault(), I("PROD" === b)
                            }
                        })
                    }), (0, o.jsx)(U, {})]
                })
            }
            let U = (0, u.memo)(() => {
                let [A, e] = (0, c.KO)(v.D.debugEditorHistoryMode);
                return (0, c.Dv)(v.D.debugMode) && void 0 !== A ? (0, o.jsx)(l.u, {
                    content: A ? "You are browsing this clip's history. Your editing records won't be recorded when you save changes at this time. Click the icon to unlock." : "Your editing records will be recorded when you save changes right now. Click the icon to lock.",
                    side: "bottom",
                    delayDuration: 0,
                    children: (0, o.jsxs)("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [(0, o.jsx)(l.zx, {
                            variant: "base",
                            onClick: () => e(!A),
                            children: A ? (0, o.jsx)(a.Z, {
                                strokeWidth: 1.5,
                                className: "ml-2 size-8 text-red-500"
                            }) : (0, o.jsx)(s.Z, {
                                strokeWidth: 1.5,
                                className: "ml-2 size-8 text-red-300"
                            })
                        }), (0, o.jsx)(l.ZT, {
                            className: "text-sm text-red-300",
                            children: "You are browsing the history of this clip. Hover to see more details."
                        })]
                    })
                }) : (0, o.jsx)(o.Fragment, {})
            });
            U.displayName = "HistoryModeDebugHint"
        },
        31891: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return s
                }
            });
            var i = t(52322),
                n = t(752),
                o = t(25237),
                l = t.n(o),
                r = t(91376);
            let a = l()(() => Promise.all([t.e(9853), t.e(4119), t.e(7412), t.e(84), t.e(6042), t.e(4475), t.e(9838)]).then(t.bind(t, 49838)).then(A => A.default), {
                loadableGenerated: {
                    webpack: () => [49838]
                },
                ssr: !1,
                loading: () => null
            });

            function s(A) {
                let {
                    pageName: e
                } = A;
                return (0, n.Dv)(r.D.debugMode) ? (0, i.jsx)(a, {
                    pageName: e
                }) : null
            }
        },
        45910: function(A, e, t) {
            "use strict";
            var i, n;
            t.d(e, {
                L: function() {
                    return i
                }
            }), (n = i || (i = {})).ClipApi = "clip-api", n.ClipEngineManager = "clip-engine-manager", n.PlanSocial = "plan-social"
        },
        87579: function(A, e, t) {
            "use strict";
            t.d(e, {
                I: function() {
                    return s
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(1332),
                r = t(59511),
                a = t(91376);

            function s(A) {
                let [e, t] = (0, o.KO)(a.D.debugApiEndpointEnvMap);
                return [A && e[A] || ((0, l.cm)() ? "STG" : "PROD"), (0, r.Z)(e => {
                    A && t(async t => (0, n._)((0, i._)({}, await t), {
                        [A]: e
                    }))
                })]
            }
        },
        19810: function(A, e, t) {
            "use strict";
            t.d(e, {
                F3: function() {
                    return i
                },
                YQ: function() {
                    return o
                },
                ae: function() {
                    return n
                }
            });
            let i = {
                    cs: "Czech",
                    da: "Danish",
                    de: "German",
                    el: "Greek",
                    en: "English",
                    es: "Spanish",
                    et: "Estonian",
                    fi: "Finnish",
                    fr: "French",
                    hr: "Croatian",
                    hu: "Hungarian",
                    id: "Indonesian",
                    it: "Italian",
                    ja: "Japanese",
                    ko: "Korean",
                    nl: "Dutch",
                    no: "Norwegian",
                    pl: "Polish",
                    pt: "Portuguese",
                    ro: "Romanian",
                    ru: "Russian",
                    sk: "Slovak",
                    sv: "Swedish",
                    tr: "Turkish",
                    uk: "Ukrainian",
                    vi: "Vietnamese"
                },
                n = Object.values(i).sort((A, e) => A.localeCompare(e, "en", {
                    sensitivity: "base"
                })),
                o = Object.entries({
                    ar: "Arabic",
                    bg: "Bulgarian",
                    bn: "Bengali",
                    ca: "Catalan",
                    cs: "Czech",
                    da: "Danish",
                    de: "German",
                    el: "Greek",
                    en: "English",
                    es: "Spanish",
                    et: "Estonian",
                    eu: "Basque",
                    fa: "Persian",
                    fi: "Finnish",
                    fr: "French",
                    gl: "Galician",
                    hr: "Croatian",
                    hu: "Hungarian",
                    id: "Indonesian",
                    it: "Italian",
                    ja: "Japanese",
                    jw: "Javanese",
                    ka: "Georgian",
                    ko: "Korean",
                    lt: "Lithuanian",
                    ml: "Malayalam",
                    ms: "Malay",
                    nl: "Dutch",
                    nn: "Norwegian Nynorsk",
                    no: "Norwegian",
                    pl: "Polish",
                    pt: "Portuguese",
                    ro: "Romanian",
                    ru: "Russian",
                    sk: "Slovak",
                    sl: "Slovenian",
                    sv: "Swedish",
                    ta: "Tamil",
                    te: "Telugu",
                    tl: "Tagalog",
                    tr: "Turkish",
                    uk: "Ukrainian",
                    vi: "Vietnamese",
                    zh: "Chinese",
                    sq: "Albanian"
                }).sort((A, e) => {
                    let [t] = A, [i] = e;
                    return t.localeCompare(i, "en", {
                        sensitivity: "base"
                    })
                })
        },
        99211: function(A, e, t) {
            "use strict";

            function i(A) {
                let e = {
                    current: !1
                };
                return {
                    promise: new Promise((t, i) => {
                        A.then(A => e.current ? i(e) : t(A)).catch(A => {
                            i(e.current ? e : A)
                        })
                    }),
                    cancel: () => {
                        e.current = !0
                    }
                }
            }
            t.d(e, {
                Z: function() {
                    return i
                }
            })
        },
        48989: function(A, e, t) {
            "use strict";
            t.d(e, {
                B6: function() {
                    return n
                },
                nv: function() {
                    return r
                },
                qP: function() {
                    return l
                }
            });
            let i = (0, t(91117).Z)("format-seconds-to-timestamp");

            function n(A, e) {
                let [t, i, n] = o(A), l = [];
                if (t > 0) {
                    let A = e ? e("common:hour", {
                        count: Math.min(t, 2)
                    }) : "".concat(Math.min(t, 2), " hours");
                    l.push(A)
                }
                if (i > 0) {
                    let A = e ? e("common:min", {
                        count: i
                    }) : "".concat(i, " min");
                    l.push(A)
                }
                if (0 === t && 0 === i && n > 0) {
                    let A = e ? e("common:second", {
                        count: n
                    }) : "".concat(n, " seconds");
                    l.push(A)
                }
                if (0 === t && 0 === i && 0 === n) {
                    let A = e ? e("common:second", {
                        count: 0
                    }) : "0 seconds";
                    l.push(A)
                }
                return l.join(" ")
            }

            function o(A) {
                if (A < 0) {
                    let A = Error('cannot parse negative number; will return ""');
                    return i.error(A), []
                }
                let e = (A = Math.trunc(A)) % 60,
                    t = Math.floor(A / 60) % 60;
                return [Math.floor(A / 3600), t, e]
            }

            function l(A) {
                let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    [t, i, n] = o(A);
                return t > 0 || !e ? [t, i, n].map((A, e) => 0 === e ? A : String(A).padStart(2, "0")).join(":") : [i, n].map(A => String(A).padStart(2, "0")).join(":")
            }

            function r(A) {
                let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3,
                    [n, o, l, r] = function(A) {
                        if (A < 0) {
                            let A = Error('cannot parse negative number; will return ""');
                            return i.error(A), []
                        }
                        let e = (A = Math.trunc(A)) % 1e3,
                            t = Math.floor(A / 1e3);
                        return [Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60, e]
                    }(A),
                    a = (() => {
                        switch (t) {
                            case 1:
                            case 2:
                            case 3:
                                return Math.floor(r / 10 ** (3 - t));
                            default:
                                return r
                        }
                    })();
                return n > 0 || !e ? [n, o, l, a].map((A, e) => 0 === e ? A : String(A).padStart(2, "0")).join(":") : [o, l].map(A => String(A).padStart(2, "0")).join(":") + "." + String(a)
            }
        },
        30464: function(A, e, t) {
            "use strict";

            function i(A) {
                if (A = A.trim(), !/^[a-zA-Z\s]+$/.test(A)) return A.charAt(0).toUpperCase();
                let e = A.trim().split(" ");
                if (2 !== e.length) return A.charAt(0).toUpperCase(); {
                    let [A, t] = e;
                    return "".concat(A.charAt(0).toUpperCase()).concat(t.charAt(0).toUpperCase())
                }
            }
            t.d(e, {
                v: function() {
                    return i
                }
            })
        },
        16901: function(A, e, t) {
            "use strict";
            t.d(e, {
                fM: function() {
                    return o
                },
                lL: function() {
                    return a
                },
                mx: function() {
                    return l
                }
            });
            var i = t(91117);
            let n = [{
                    MIME: "video/mp4",
                    suffix: ".mp4"
                }, {
                    MIME: "video/quicktime",
                    suffix: ".mov"
                }, {
                    MIME: "video/x-matroska",
                    suffix: ".mkv"
                }, {
                    MIME: "video/webm",
                    suffix: ".webm"
                }],
                o = n.map(A => A.MIME),
                l = n.map(A => A.suffix),
                r = (0, i.Z)("get-local-video-fail-reason");
            async function a(A, e, t) {
                let i = A.type;
                A.name.toLowerCase().endsWith(".mkv") && (i = "video/x-matroska");
                let n = A.size;
                return n > (null != e ? e : 10737418240) ? "Your video file (".concat(Number((n / 1073741824).toFixed(1)), " GB) exceeds our size limit. We can only accommodate files up to ").concat(null != t ? t : "10GB", ".") : 0 === n ? "Empty files aren't supported. Please try uploading a different file." : o.includes(i) ? await new Promise((e, t) => {
                    let i = new FileReader;
                    i.onload = function(A) {
                        if (!A.target) {
                            t("no target");
                            return
                        }
                        e("")
                    }, i.onerror = () => {
                        t(i.error)
                    }, i.readAsArrayBuffer(A.slice(0, 1))
                }).catch(A => {
                    var e;
                    let t;
                    return r.error(A), null !== (t = null == A ? void 0 : A.message, A instanceof DOMException && ("NotReadableError" === A.name ? t = "The requested file cannot be read at the moment, likely due to file system permission settings. Kindly review and adjust your settings accordingly, and attempt the process again. Should you encounter any difficulties or require assistance, please do not hesitate to reach out to us." : "NotFoundError" === A.name && (t = "The requested file could not be located at the moment. It's possible that the file has been moved or renamed. Please take a moment to verify the path and try upload again. If you encounter any challenges or require assistance, our team is ready to offer support.")), e = t) && void 0 !== e ? e : ""
                }) : "Video type is not allowed"
            }
        },
        6419: function(A, e, t) {
            "use strict";

            function i(A, e) {
                e.showSupportButton && (A.showSupportButton = e.showSupportButton)
            }

            function n(A, e) {
                return A[e]
            }
            t.d(e, {
                Q: function() {
                    return n
                },
                i: function() {
                    return i
                }
            })
        },
        30265: function(A, e, t) {
            "use strict";

            function i(A) {
                if ("GDRIVE" === A.sourcePlatform) return "GDR_".concat(A.file.id);
                throw Error("not implemented sourcePlatform: ".concat(A.sourcePlatform))
            }
            t.d(e, {
                l: function() {
                    return i
                }
            })
        },
        14127: function(A, e, t) {
            "use strict";

            function i(A, e) {
                function t(A) {
                    return 16 / 9 * Math.pow(A, 2)
                }
                if (void 0 === A) {
                    if (e) {
                        if ("hd" === e) return ["hd", !1];
                        if ("sd" === e) return ["sd", !0]
                    }
                    return ["-", !1]
                }
                try {
                    let [e, i] = A.split("x"), n = Number(e) * Number(i);
                    if (Number.isNaN(n)) return ["-", !1];
                    if (n >= t(4320)) return ["8k", !1];
                    if (n >= t(2160)) return ["4k", !1];
                    if (n >= t(1440)) return ["2k", !1];
                    if (n >= t(1080)) return ["1080p", !1];
                    else if (n >= t(720)) return ["720p", !1];
                    else if (n >= t(480)) return ["480p", !0];
                    else if (n >= t(360)) return ["360p", !0];
                    else return ["240p", !0]
                } catch (A) {
                    return ["-", !1]
                }
            }

            function n(A) {
                if (!A) return [0, 0];
                try {
                    let [e, t] = A.split("x");
                    return [Number(e), Number(t)]
                } catch (A) {
                    return [0, 0]
                }
            }
            t.d(e, {
                Z: function() {
                    return i
                },
                l: function() {
                    return n
                }
            })
        },
        12600: function(A, e, t) {
            "use strict";

            function i(A) {
                let e = new URLSearchParams;
                return (null == A ? void 0 : A.source) && e.set("utm_source", A.source), (null == A ? void 0 : A.medium) && e.set("utm_medium", A.medium), (null == A ? void 0 : A.campaign) && e.set("utm_campaign", A.campaign), (null == A ? void 0 : A.term) && e.set("utm_term", A.term), (null == A ? void 0 : A.content) && e.set("utm_content", A.content), e
            }
            t.d(e, {
                I: function() {
                    return i
                }
            })
        },
        9772: function(A, e, t) {
            "use strict";
            t.d(e, {
                Co: function() {
                    return n
                },
                KL: function() {
                    return r
                },
                Rt: function() {
                    return a
                },
                hu: function() {
                    return l
                },
                kP: function() {
                    return o
                },
                wk: function() {
                    return i
                }
            });
            let i = 3e4,
                n = 8e3;

            function o(A) {
                return A("clip:youtube_timeout_msg")
            }
            let l = "youtube-timeout-warning";

            function r(A, e) {
                return A && ["Unsupported video link", "We are not able to import this type of link", "Language not supported", "is not supported. Please check", "We're not able to access private video links", "Load failed", "We are unable to handle live YouTube that is still ongoing"].some(e => A.includes(e)) ? A : e("clip:youtube_import_issue")
            }

            function a(A, e) {
                return A && ["This video has been removed"].some(e => A.includes(e)) ? e("clip:youtube_import_issue") : A
            }
        },
        26166: function(A, e, t) {
            "use strict";
            t.d(e, {
                NQ: function() {
                    return g
                },
                Q5: function() {
                    return d
                },
                mk: function() {
                    return p
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(2784),
                r = t(33414),
                a = t(59511),
                s = t(30933),
                c = t(99289),
                u = t(89640);

            function d(A, e) {
                let t = (0, o.Dv)(c.d9),
                    {
                        getClipProjectPaginatedList: d,
                        deleteClipProject: g
                    } = (0, r.Z)(),
                    {
                        enableUploadBg: p
                    } = (0, s.H)(),
                    f = (0, o.Dv)(u.E2.localSubmitProjectList),
                    {
                        upsertItemsIntoList: m,
                        deleteItem: h,
                        resetList: v,
                        updateItem: x
                    } = (0, c.Io)(),
                    [C, K] = (0, l.useState)(!1),
                    [b, y] = (0, o.KO)(c.U1.clipProjectNextPage),
                    w = b.hasNextPage,
                    B = (0, a.Z)(async e => {
                        if (C || !b.hasNextPage) return;
                        K(!0);
                        let {
                            page: t,
                            pageSize: o
                        } = b, {
                            list: l,
                            paging: r
                        } = await d({
                            page: t,
                            pageSize: o
                        }, e, A);
                        await m(l), y(A => (0, i._)((0, n._)((0, i._)({}, A), {
                            hasNextPage: r.hasNext
                        }), r.nextPageOpt)), K(!1)
                    }),
                    U = (0, a.Z)(async e => {
                        K(!0);
                        let {
                            list: t,
                            paging: o
                        } = await d({
                            page: 0,
                            pageSize: 16
                        }, e, A);
                        await v(t), y(A => (0, i._)((0, n._)((0, i._)({}, A), {
                            hasNextPage: o.hasNext
                        }), o.nextPageOpt)), K(!1)
                    });
                return {
                    deleteProject: (0, a.Z)(async A => {
                        let e = await g(A);
                        return await h(A), {
                            projectId: null == e ? void 0 : e.projectId,
                            useAmount: null == e ? void 0 : e.useAmount,
                            totalAmount: null == e ? void 0 : e.totalAmount
                        }
                    }),
                    loadMoreProjects: B,
                    loading: C,
                    hasNextPage: w,
                    projectList: (0, l.useMemo)(() => p && !e ? [...f, ...t] : t, [t, f, p, e]),
                    resetProjects: U,
                    updateItem: x
                }
            }

            function g() {
                let {
                    prependIfNotExist: A
                } = (0, c.Io)();
                return {
                    appendProjectPlaceholder: (0, a.Z)(async e => {
                        await A([p(e)])
                    })
                }
            }

            function p(A, e, t, n, o) {
                let l = new Date().toISOString();
                return {
                    id: A,
                    projectId: A,
                    productTier: e,
                    sourceInfo: (0, i._)({
                        title: "loading...",
                        durationMs: 0,
                        type: "YOUTUBE",
                        videoId: "",
                        thumbnailUrl: ""
                    }, t),
                    stage: null != n ? n : "QUEUED",
                    createdAt: l,
                    updatedAt: l,
                    model: o
                }
            }
        },
        60605: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z0: function() {
                    return s
                },
                ZP: function() {
                    return a
                },
                wq: function() {
                    return c
                }
            });
            var i = t(2784),
                n = t(91117);
            let o = (0, n.Z)("use-inject-script"),
                l = {
                    queue: {},
                    injectorMap: {},
                    scriptMap: {}
                },
                r = (0, n.Z)("use-gdrive-picker");

            function a() {
                let A;
                let [e, t] = function(A) {
                    let [e, t] = (0, i.useState)({
                        loaded: !1,
                        error: !1
                    });
                    return (0, i.useEffect)(() => {
                        var e, i, n, r, a;
                        if ((null === (e = l.injectorMap) || void 0 === e ? void 0 : e[A]) || (l.injectorMap[A] = "init"), "loaded" === l.injectorMap[A]) {
                            t({
                                loaded: !0,
                                error: !1
                            });
                            return
                        }
                        if ("error" === l.injectorMap[A]) {
                            t({
                                loaded: !0,
                                error: !0
                            });
                            return
                        }
                        let s = e => {
                                var t, i, n, r;
                                e && o.error("error loading the script"), null === (i = l.queue) || void 0 === i || null === (t = i[A]) || void 0 === t || t.forEach(A => A(e)), e && l.scriptMap[A] ? (null === (r = l.scriptMap) || void 0 === r || null === (n = r[A]) || void 0 === n || n.remove(), l.injectorMap[A] = "error") : l.injectorMap[A] = "loaded", delete l.scriptMap[A]
                            },
                            c = A => {
                                t({
                                    loaded: !0,
                                    error: A
                                })
                            };
                        return (null === (i = l.scriptMap) || void 0 === i ? void 0 : i[A]) || (l.scriptMap[A] = document.createElement("script"), l.scriptMap[A] && (l.scriptMap[A].src = A, l.scriptMap[A].async = !0, document.body.append(l.scriptMap[A]), l.scriptMap[A].addEventListener("load", () => s(!1)), l.scriptMap[A].addEventListener("error", () => s(!0)), l.injectorMap[A] = "loading")), (null === (n = l.queue) || void 0 === n ? void 0 : n[A]) ? null === (a = l.queue) || void 0 === a || null === (r = a[A]) || void 0 === r || r.push(c) : l.queue[A] = [c], () => {
                            var e, t;
                            l.scriptMap[A] && (null === (e = l.scriptMap[A]) || void 0 === e || e.removeEventListener("load", () => s(!0)), null === (t = l.scriptMap[A]) || void 0 === t || t.removeEventListener("error", () => s(!0)))
                        }
                    }, [A]), [e.loaded, e.error]
                }("https://apis.google.com/js/api.js"), [n, a] = (0, i.useState)(!1);
                (0, i.useEffect)(() => {
                    !e || t || n || (window.gapi.load("auth"), window.gapi.load("picker", {
                        callback: s
                    }))
                }, [e, t, n]);
                let s = () => {
                        a(!0), r.info("Google Picker load successfully")
                    },
                    c = e => {
                        let {
                            token: t,
                            appId: i,
                            developerKey: n,
                            viewId: o = "DOCS",
                            disabled: l,
                            multiselect: r,
                            setOrigin: a,
                            showUploadView: s = !1,
                            showUploadFolders: c,
                            setParentFolder: u = "",
                            viewMimeTypes: d,
                            selectableMimeTypes: g,
                            customViews: p,
                            locale: f = "en",
                            setIncludeFolders: m,
                            setSelectFolderEnabled: h,
                            disableDefaultView: v = !1,
                            callbackFunction: x,
                            mode: C
                        } = e;
                        if (l) return !1;
                        let K = new google.picker.DocsView(google.picker.ViewId[o]);
                        d && K.setMimeTypes(d), m && K.setIncludeFolders(!0), h && K.setSelectFolderEnabled(!0), C && K.setMode(C);
                        let b = new google.picker.DocsUploadView;
                        return d && b.setMimeTypes(d), c && b.setIncludeFolders(!0), u && b.setParent(u), u && K.setParent(u), A = new google.picker.PickerBuilder().setAppId(i).setDeveloperKey(n).setOAuthToken(t).setLocale(f).setCallback(x), g && A.setSelectableMimeTypes(g), a && A.setOrigin(a), v || A.addView(K), p && p.map(e => A.addView(e)), r && A.enableFeature(google.picker.Feature.MULTISELECT_ENABLED), s && A.addView(b), A.build().setVisible(!0), !0
                    };
                return {
                    openPicker: A => {
                        if (A.token && e && !t && n) return c(A)
                    },
                    pickerApiLoaded: n
                }
            }
            let s = ["https://www.googleapis.com/auth/drive.file"];

            function c(A) {
                return !!(A && A.accessToken && A.scopes && s.every(e => A.scopes.includes(e)))
            }
        },
        70183: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return a
                },
                h: function() {
                    return s
                }
            });
            var i = t(32364),
                n = t(2784),
                o = t(59511);
            class l {
                register() {
                    let A = (0, i.Z)(4);
                    return this.reminderIdMap[A] = !0, A
                }
                lockReminder(A) {
                    this.reminderIdMap[A] = !1
                }
                releaseReminder(A) {
                    this.reminderIdMap[A] = !0
                }
                constructor() {
                    this.reminderIdMap = {}
                }
            }
            let r = new l;

            function a(A, e, t) {
                let [i, o] = (0, n.useState)(""), l = (0, n.useRef)(!1);
                return (0, n.useEffect)(() => {
                    l.current || (o(r.register()), l.current = !0)
                }, []), (0, n.useEffect)(() => {
                    if (A) return window.addEventListener("beforeunload", n), window.addEventListener("pagehide", n), () => {
                        window.removeEventListener("beforeunload", n), window.removeEventListener("pagehide", n)
                    };

                    function n(A) {
                        if (!1 !== r.reminderIdMap[i]) return A.preventDefault(), A.returnValue = e, t && t(), e
                    }
                }, [A, e, t, i]), i
            }

            function s() {
                return {
                    lockReminder: (0, o.Z)(A => r.lockReminder(A)),
                    releaseReminder: (0, o.Z)(A => r.releaseReminder(A))
                }
            }
        },
        35258: function(A, e, t) {
            "use strict";
            t.d(e, {
                I6: function() {
                    return a
                },
                Z6: function() {
                    return s
                }
            });
            var i = t(752),
                n = t(84810),
                o = t(6034),
                l = t(80993),
                r = t(2784);

            function a(A) {
                let [e, t] = (0, i.KO)(A), n = (0, r.useCallback)(A => {
                    t(e => u(e, A))
                }, [t]);
                return (0, r.useMemo)(() => [e, n], [e, n])
            }

            function s(A) {
                let e = (0, i.b9)(A);
                return (0, r.useCallback)(A => {
                    e(e => u(e, A))
                }, [e])
            }

            function c(A, e, t, i) {
                if (void 0 === e) {
                    (0, n.Z)(i, t);
                    return
                }
                if (Array.isArray(A) || Array.isArray(e)) return e
            }

            function u(A, e, t) {
                return "function" == typeof e ? t ? e(A) : (0, o.Z)((0, l.Z)(A), e(A), c) : t ? e : (0, o.Z)((0, l.Z)(A), e, c)
            }
        },
        4269: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return o
                }
            });
            var i = t(2784),
                n = t(85682);

            function o() {
                let {
                    isAuthenticated: A,
                    isLoading: e,
                    loginWithRedirect: t
                } = (0, n.a)();
                (0, i.useEffect)(() => {
                    A || e || t()
                }, [e, t, A])
            }
        },
        49501: function(A, e, t) {
            "use strict";
            t.d(e, {
                Jn: function() {
                    return c
                },
                T0: function() {
                    return a
                },
                vP: function() {
                    return s
                }
            });
            var i = t(752),
                n = t(83646),
                o = t(79298),
                l = t(89671),
                r = t(80629);
            let a = [""];

            function s() {
                let A = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "FreePlan",
                    [e] = (0, l.Ae)("supported_platforms", "platforms", []),
                    t = (0, i.Dv)(r.a.currentOrgAsset),
                    s = e.filter(e => {
                        if (a.includes(e.name)) return null == t ? void 0 : t.isEnterprise;
                        switch (A) {
                            case "FreePlan":
                                return "Free" === e.plan;
                            case "Starter":
                                return "Free" === e.plan || "Starter" === e.plan;
                            case "Essential":
                                return "Free" === e.plan || "Starter" === e.plan || "Essential" === e.plan;
                            default:
                                return !0
                        }
                    }),
                    c = e.filter(A => a.includes(A.name)),
                    u = (0, n.Z)(s, "domains"),
                    d = (0, n.Z)(e, "domains"),
                    g = (0, n.Z)(c, "domains");
                return {
                    supportedPlatforms: (0, o.Z)(...u),
                    allSupportedPlatforms: (0, o.Z)(...d),
                    enterpriseSupportedOnly: (0, o.Z)(...g),
                    platforms: e
                }
            }

            function c() {
                let A = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "FreeTrial",
                    e = arguments.length > 1 ? arguments[1] : void 0,
                    [t] = (0, l.Ae)("supported_platforms", "messages", {
                        FreeTrial: {
                            inputTooltip: "Pro Plan supports video links of YouTube, Vimeo, Zoom, Rumble, Twitch, Facebook, LinkedIn, Twitter, Dropbox and StreamYard.",
                            errorMessage: "Unsupported video link. Please submit links from YouTube, Vimeo, Zoom, Rumble, Twitch, Facebook, LinkedIn, Twitter, Dropbox and StreamYard or upload your video files."
                        }
                    }),
                    i = t[A];
                i && (i.inputTooltip = e("clip:supported_platform_messages.".concat(A, ".inputTooltip"), {
                    defaultValue: i.inputTooltip
                }), i.errorMessage = e("clip:supported_platform_messages.".concat(A, ".errorMessage")));
                let n = t.Pro;
                return n && (n.inputTooltip = e("clip:supported_platform_messages.Pro.inputTooltip", {
                    defaultValue: n.inputTooltip
                }), n.errorMessage = e("clip:supported_platform_messages.Pro.errorMessage")), {
                    messageByPlan: i,
                    proMessage: n
                }
            }
        },
        38195: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return n
                }
            });
            var i = t(2784);

            function n(A) {
                let e = i.useRef(A);
                return e.current = A, e
            }
        },
        28372: function(A, e, t) {
            "use strict";
            t.d(e, {
                d: function() {
                    return P
                }
            });
            var i, n, o, l, r, a, s, c, u, d, g, p, f, m, h, v, x, C = t(52322),
                K = t(22979),
                b = t(2784);
            let y = ["title", "titleId"];

            function w() {
                return (w = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let B = (0, b.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: o
                } = A, l = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, y);
                return b.createElement("svg", w({
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": o
                }, l), t ? b.createElement("title", {
                    id: o
                }, t) : null, i || (i = b.createElement("g", {
                    clipPath: "url(#clip0_3332_28942)"
                }, b.createElement("path", {
                    d: "M24 12C24 5.3726 18.6274 1.52588e-05 12 1.52588e-05C5.37259 1.52588e-05 0 5.3726 0 12C0 17.6278 3.87432 22.3499 9.10108 23.6466V15.667H6.62659V12H9.10108V10.4199C9.10108 6.33548 10.9495 4.44236 14.9594 4.44236C15.7196 4.44236 17.0314 4.5914 17.568 4.74049V8.06468C17.2848 8.03487 16.7929 8.01995 16.1817 8.01995C14.214 8.01995 13.4538 8.76529 13.4538 10.7031V12H17.3734L16.7001 15.667H13.4538V23.9121C19.3955 23.1945 24 18.1353 24 12Z",
                    fill: "#0866FF"
                }), b.createElement("path", {
                    d: "M16.6985 15.667L17.3719 12H13.4522V10.7031C13.4522 8.76524 14.2125 8.01995 16.1801 8.01995C16.7913 8.01995 17.2832 8.03483 17.5664 8.06464V4.7405C17.0298 4.59141 15.718 4.44232 14.9578 4.44232C10.9479 4.44232 9.09949 6.33549 9.09949 10.4199V12H6.625V15.667H9.09949V23.6466C10.028 23.8769 10.9988 24 11.9984 24C12.4906 24 12.9756 23.9697 13.4522 23.9121V15.667H16.6985Z",
                    fill: "white"
                }))), n || (n = b.createElement("defs", null, b.createElement("clipPath", {
                    id: "clip0_3332_28942"
                }, b.createElement("rect", {
                    width: 24,
                    height: 24,
                    fill: "white"
                })))))
            });
            t.p;
            let U = ["title", "titleId"];

            function F() {
                return (F = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let I = (0, b.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, U);
                return b.createElement("svg", F({
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? b.createElement("title", {
                    id: i
                }, t) : null, o || (o = b.createElement("rect", {
                    width: 24,
                    height: 24,
                    rx: 12,
                    fill: "url(#pattern0)"
                })), l || (l = b.createElement("path", {
                    d: "M15.8379 9.01405C15.3611 9.01499 14.9734 8.6289 14.9724 8.15207C14.9715 7.67524 15.3576 7.28752 15.8346 7.28659C16.3117 7.28566 16.6994 7.67197 16.7003 8.1488C16.701 8.62564 16.315 9.01312 15.8379 9.01405Z",
                    fill: "white"
                })), r || (r = b.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M12.0077 15.6974C9.96623 15.7014 8.30784 14.0497 8.30388 12.0078C8.29991 9.96632 9.95199 8.30767 11.9934 8.3037C14.0353 8.29974 15.694 9.95232 15.6979 11.9936C15.7019 14.0355 14.0493 15.6934 12.0077 15.6974ZM11.996 9.60099C10.671 9.60333 9.59835 10.6799 9.60068 12.0052C9.60324 13.3307 10.6801 14.4031 12.0051 14.4006C13.3306 14.398 14.4032 13.3216 14.4007 11.9961C14.3981 10.6706 13.3213 9.59843 11.996 9.60099Z",
                    fill: "white"
                })), a || (a = b.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M7.2723 5.18867C7.72954 5.00951 8.25278 4.8868 9.01887 4.85064C9.78685 4.81378 10.032 4.80538 11.9869 4.80165C13.9423 4.79792 14.1874 4.80538 14.9554 4.83944C15.7217 4.87257 16.2452 4.99341 16.7034 5.17071C17.1774 5.35337 17.5796 5.59925 17.9804 5.9984C18.3811 6.39801 18.6279 6.79879 18.8129 7.27212C18.9919 7.72983 19.1146 8.25262 19.151 9.01919C19.1873 9.78692 19.1962 10.0319 19.1999 11.987C19.2037 13.9419 19.1957 14.1873 19.1621 14.9558C19.1288 15.7216 19.0082 16.2454 18.8309 16.7033C18.6478 17.1773 18.4023 17.5795 18.0032 17.9803C17.6041 18.3813 17.2028 18.6279 16.7295 18.8131C16.2718 18.9918 15.749 19.1145 14.9829 19.1511C14.215 19.1875 13.9698 19.1962 12.0142 19.1999C10.0595 19.2036 9.81437 19.1962 9.04641 19.1623C8.28008 19.1288 7.75636 19.0082 7.29843 18.8311C6.82441 18.6477 6.42223 18.4025 6.02145 18.0032C5.62045 17.6038 5.37341 17.2028 5.18866 16.7294C5.0095 16.272 4.88725 15.7489 4.85062 14.9831C4.814 14.2149 4.80537 13.9695 4.80164 12.0145C4.7979 10.0594 4.8056 9.81445 4.83919 9.04647C4.87302 8.27991 4.99316 7.75642 5.17046 7.29802C5.35358 6.82422 5.59899 6.42227 5.9986 6.02126C6.39774 5.62048 6.79898 5.37319 7.2723 5.18867ZM7.7657 17.6215C8.01974 17.7193 8.40092 17.8359 9.10287 17.8665C9.86242 17.8993 10.0899 17.9066 12.0119 17.9028C13.9346 17.8993 14.162 17.8912 14.9213 17.8555C15.6226 17.8221 16.0038 17.7041 16.2571 17.6052C16.5933 17.4738 16.8326 17.3168 17.0841 17.0651C17.3356 16.8125 17.4912 16.5724 17.6213 16.2363C17.7193 15.982 17.8357 15.6006 17.8663 14.8986C17.8996 14.1395 17.9066 13.9118 17.9029 11.9893C17.8994 10.0673 17.8912 9.83964 17.8551 9.0803C17.8219 8.37882 17.7041 7.99763 17.605 7.74452C17.4737 7.40789 17.3171 7.16901 17.0647 6.9173C16.8123 6.66558 16.5723 6.51045 16.2356 6.38028C15.9821 6.28207 15.6004 6.16589 14.8989 6.13533C14.1394 6.10197 13.9117 6.0952 11.9892 6.09894C10.0672 6.10267 9.8398 6.11037 9.08047 6.1463C8.37876 6.17965 7.99804 6.29746 7.74423 6.39661C7.40831 6.52795 7.16896 6.68401 6.91726 6.93666C6.66601 7.1893 6.51041 7.42889 6.38024 7.76575C6.28274 8.01956 6.16539 8.40121 6.1353 9.1027C6.10217 9.86227 6.09518 10.09 6.09891 12.012C6.10241 13.9345 6.11057 14.1621 6.14627 14.921C6.17916 15.623 6.29789 16.0037 6.39658 16.2577C6.52791 16.5934 6.68445 16.8328 6.93662 17.0845C7.18927 17.3353 7.42931 17.4913 7.7657 17.6215Z",
                    fill: "white"
                })), s || (s = b.createElement("defs", null, b.createElement("pattern", {
                    id: "pattern0",
                    patternContentUnits: "objectBoundingBox",
                    width: 1,
                    height: 1
                }, b.createElement("use", {
                    xlinkHref: "#image0_3332_28945",
                    transform: "translate(-0.0457598 -0.0443192) scale(0.000479789)"
                })), b.createElement("image", {
                    id: "image0_3332_28945",
                    width: 2273,
                    height: 2275,
                    xlinkHref: "data:image/jpeg;base64,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Hbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfw5h277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3XY/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26j+GHbqP4Yduo38MO3Ub+GHbqP4Yduo/hh26j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmNh25jYduY2HbmNh25jYduY2HbmNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh0+Nh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jhz+j7fweHn/AFd+fp9v6v8Ape79DDf1JLc930/LnmGfj9H0+v7/APAf6c32/wAQ/wCR+n/5f9383/iNaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca0415xrzjXnGvONeca8415xrzjXnGvONeca8415xrzjXnGvONeca8415xrzjXnGvONeYa8w15hrzDXmGvMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMNeYa8w15hrzDXnGvONeca8415xrzjXnGvONeca041pxrTjWnGtONaca041pxrTjWnGtONacas41ZxqzjVnGrONWcas41ZxqzjVnGrONScak41JxqTjUUGooNRQaig1FBqKDTUGmoNNQaag01BpqDTUGmoNNQaag0lBpKDSUGkoNJQaSg0lBpKDSUGioNFQaKg0VBoqDRVGiqNFUaKo0FRoKjQVGgqNBUaCo0FRoKjQVGgqPXqj16o9eqPXqj16o9eqPXqj16o9eqPXqj1yo9cqPXKj1yo9cqPXLD1yw9csPXLD1yw9csPWrD1qw9asPWrD1qw9asPWrD1qw9asPWrD1qw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1aw9WsPVrD1aw9WsPVrD1aw9WsPVrD1aw9WsPVrB34/8Ay/z/AH/53yHY/wDU/E/0v+P7/wCz/9k="
                }))))
            });
            t.p;
            let E = ["title", "titleId"];

            function Q() {
                return (Q = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let j = (0, b.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, E);
                return b.createElement("svg", Q({
                    id: "Layer_1",
                    style: {
                        enableBackground: "new 0 0 1000 1000"
                    },
                    viewBox: "0 0 1000 1000",
                    xmlSpace: "preserve",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink",
                    ref: e,
                    "aria-labelledby": i
                }, n), c || (c = b.createElement("style", {
                    type: "text/css"
                }, "\n	.st0{fill:#0078B5;}\n	.st1{fill:#FFFFFF;}\n")), t ? b.createElement("title", {
                    id: i
                }, t) : null, u || (u = b.createElement("g", null, b.createElement("path", {
                    className: "st0",
                    d: "M500,1000L500,1000C223.9,1000,0,776.1,0,500l0,0C0,223.9,223.9,0,500,0l0,0c276.1,0,500,223.9,500,500l0,0   C1000,776.1,776.1,1000,500,1000z"
                }), b.createElement("g", null, b.createElement("g", null, b.createElement("path", {
                    className: "st1",
                    d: "M184.2,387.3h132.9v427.7H184.2V387.3z M250.7,174.7c42.5,0,77,34.5,77,77.1s-34.5,77.1-77,77.1     c-42.6,0-77.1-34.5-77.1-77.1C173.5,209.3,208,174.7,250.7,174.7"
                }), b.createElement("path", {
                    className: "st1",
                    d: "M400.5,387.3H528v58.4h1.8c17.7-33.6,61-69.1,125.8-69.1c134.6,0,159.5,88.6,159.5,203.7v234.7H682.2V607.1     c0-49.7-0.9-113.4-69.1-113.4c-69.2,0-79.8,54-79.8,109.8v211.6H400.5V387.3z"
                }))))))
            });
            t.p;
            let S = ["title", "titleId"];

            function L() {
                return (L = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let R = (0, b.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, S);
                return b.createElement("svg", L({
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? b.createElement("title", {
                    id: i
                }, t) : null, d || (d = b.createElement("rect", {
                    width: 24,
                    height: 24,
                    rx: 12,
                    fill: "black"
                })), g || (g = b.createElement("path", {
                    d: "M15.3445 9.66394C16.4249 10.439 17.7484 10.895 19.1778 10.895V8.13454C18.9073 8.13459 18.6374 8.10628 18.3728 8.05001V10.2229C16.9435 10.2229 15.6202 9.76685 14.5395 8.99189V14.6251C14.5395 17.4431 12.2632 19.7274 9.45535 19.7274C8.40768 19.7274 7.43391 19.4096 6.625 18.8644C7.54824 19.8118 8.83576 20.3995 10.2602 20.3995C13.0682 20.3995 15.3447 18.1152 15.3447 15.297V9.66394H15.3445V9.66394ZM16.3376 6.87901C15.7855 6.27367 15.423 5.49138 15.3445 4.62653V4.27148H14.5817C14.7737 5.37071 15.4287 6.30982 16.3376 6.87901ZM8.40096 16.702C8.09249 16.2961 7.92579 15.7995 7.92654 15.289C7.92654 14.0001 8.96772 12.9551 10.2523 12.9551C10.4917 12.955 10.7296 12.9918 10.9578 13.0645V10.2423C10.6911 10.2057 10.4221 10.1901 10.1531 10.1958V12.3924C9.92478 12.3198 9.68671 12.2829 9.44725 12.2831C8.16272 12.2831 7.12159 13.328 7.12159 14.617C7.12159 15.5285 7.64201 16.3176 8.40096 16.702Z",
                    fill: "#FF004F"
                })), p || (p = b.createElement("path", {
                    d: "M14.5394 8.99183C15.62 9.7668 16.9433 10.2228 18.3726 10.2228V8.04995C17.5748 7.87941 16.8685 7.46099 16.3374 6.87901C15.4284 6.30976 14.7735 5.37065 14.5815 4.27148H12.5777V15.2969C12.5732 16.5823 11.5338 17.623 10.252 17.623C9.49665 17.623 8.82561 17.2617 8.40062 16.702C7.64173 16.3176 7.12131 15.5284 7.12131 14.6171C7.12131 13.3282 8.16244 12.2832 9.44697 12.2832C9.69309 12.2832 9.9303 12.3216 10.1528 12.3925V10.1959C7.3943 10.2531 5.17578 12.5151 5.17578 15.297C5.17578 16.6857 5.72824 17.9446 6.62489 18.8645C7.4338 19.4096 8.40757 19.7275 9.45524 19.7275C12.2631 19.7275 14.5394 17.4431 14.5394 14.6251V8.99183H14.5394Z",
                    fill: "white"
                })), f || (f = b.createElement("path", {
                    d: "M18.3729 8.05007V7.46255C17.6534 7.46364 16.9481 7.26144 16.3377 6.87906C16.878 7.47275 17.5896 7.88211 18.3729 8.05007ZM14.5818 4.2716C14.5635 4.16655 14.5494 4.0608 14.5396 3.95466V3.59961H11.7729V14.6252C11.7685 15.9103 10.7291 16.9511 9.44724 16.9511C9.07089 16.9511 8.71556 16.8614 8.40088 16.7021C8.82587 17.2618 9.49691 17.6231 10.2522 17.6231C11.5339 17.6231 12.5735 16.5824 12.578 15.2971V4.2716H14.5818ZM10.1532 10.196V9.57053C9.922 9.53882 9.68893 9.52291 9.45556 9.52302C6.64743 9.52296 4.37109 11.8074 4.37109 14.6252C4.37109 16.3918 5.26574 17.9487 6.62521 18.8645C5.72856 17.9447 5.1761 16.6857 5.1761 15.297C5.1761 12.5152 7.39456 10.2532 10.1532 10.196Z",
                    fill: "#00F2EA"
                })))
            });
            t.p;
            let k = ["title", "titleId"];

            function q() {
                return (q = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let O = (0, b.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, k);
                return b.createElement("svg", q({
                    viewBox: "0 0 18 18",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? b.createElement("title", {
                    id: i
                }, t) : null, m || (m = b.createElement("rect", {
                    x: .5,
                    y: .5,
                    width: 17,
                    height: 17,
                    rx: 8.5,
                    fill: "black"
                })), h || (h = b.createElement("rect", {
                    x: .5,
                    y: .5,
                    width: 17,
                    height: 17,
                    rx: 8.5,
                    stroke: "#09090B"
                })), v || (v = b.createElement("g", {
                    clipPath: "url(#clip0_7636_105651)"
                }, b.createElement("path", {
                    d: "M11.5301 4.96094H12.8795L9.9315 8.33033L13.3996 12.9153H10.6841L8.55722 10.1346L6.12359 12.9153H4.77338L7.92658 9.31138L4.59961 4.96094H7.38405L9.30657 7.50267L11.5301 4.96094ZM11.0565 12.1076H11.8042L6.97777 5.72619H6.17539L11.0565 12.1076Z",
                    fill: "white"
                }))), x || (x = b.createElement("defs", null, b.createElement("clipPath", {
                    id: "clip0_7636_105651"
                }, b.createElement("rect", {
                    width: 9.6,
                    height: 9.6,
                    fill: "white",
                    transform: "translate(4.19922 4.19922)"
                })))))
            });
            t.p;
            var D = t(60266);
            let P = {
                ALL: (0, C.jsx)(K.Z, {}),
                YOUTUBE: (0, C.jsx)(D.r, {}),
                TIKTOK_BUSINESS: (0, C.jsx)(R, {}),
                TIKTOK_USER: (0, C.jsx)(R, {}),
                INSTAGRAM_BUSINESS: (0, C.jsx)(I, {}),
                LINKEDIN: (0, C.jsx)(j, {}),
                FACEBOOK_PAGE: (0, C.jsx)(B, {}),
                TWITTER: (0, C.jsx)(O, {})
            }
        },
        19831: function(A, e, t) {
            "use strict";
            t.d(e, {
                s: function() {
                    return l
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(91381);
            let l = A => {
                let {
                    open: e,
                    onOpenChange: t,
                    urlInputValue: l,
                    onUrlInputChange: r,
                    isSubmitting: a,
                    onSubmit: s,
                    onCancel: c
                } = A;
                return (0, i.jsx)(n.Vq, {
                    open: e,
                    onOpenChange: t,
                    children: (0, i.jsx)(o.cZ, {
                        className: "w-[448px] p-6 bg-black-normal rounded-lg border border-[#27272A]",
                        children: (0, i.jsxs)("div", {
                            className: "flex flex-col gap-6",
                            children: [(0, i.jsxs)("div", {
                                className: "flex flex-col gap-1",
                                children: [(0, i.jsx)(n.ZT, {
                                    className: "text-lg font-semibold text-[#FAFAFA]",
                                    children: "Add YouTube playlist from URL"
                                }), (0, i.jsx)(n.ZT, {
                                    className: "text-sm text-[#A1A1AA]",
                                    children: "Paste a Youtube playlist URL here and we'll automatically index it."
                                })]
                            }), (0, i.jsx)("div", {
                                className: "flex flex-col gap-4",
                                children: (0, i.jsx)(n.II, {
                                    placeholder: "Paste YouTube playlist URL here",
                                    value: l,
                                    onChange: A => r(A),
                                    className: "flex h-[38px] px-[10px] py-[8px] items-center gap-[6px] flex-shrink-0 self-stretch rounded-[10px] border border-white/10 bg-black/15 hover:border-white/50 focus:border-white/50",
                                    classNames: {
                                        input: "text-white placeholder:text-white/50 focus:outline-none bg-transparent border-0 p-0 text-sm"
                                    },
                                    disabled: a,
                                    "aria-label": "YouTube playlist URL input",
                                    onKeyDown: A => {
                                        "Enter" === A.key && s()
                                    }
                                })
                            }), (0, i.jsxs)("div", {
                                className: "flex justify-end gap-2",
                                children: [(0, i.jsx)(n.zx, {
                                    variant: "secondary",
                                    onClick: c,
                                    disabled: a,
                                    className: "flex h-[38px] min-w-[38px] px-[10px] py-0 justify-center items-center gap-[6px] rounded-[10px] bg-white/10 hover:bg-white/20 border-none",
                                    children: "Cancel"
                                }), (0, i.jsx)(n.zx, {
                                    onClick: s,
                                    disabled: !l.trim() || a,
                                    className: (A => {
                                        let e = "flex h-[38px] min-w-[38px] px-[10px] py-0 justify-center items-center gap-[6px] rounded-[10px] border-none";
                                        return A ? "".concat(e, " bg-white/10 text-white/50 hover:bg-white/10") : "".concat(e, " bg-white hover:bg-white/80 text-black")
                                    })(!l.trim() || a),
                                    children: a ? "Adding..." : "Add playlist"
                                })]
                            })]
                        })
                    })
                })
            }
        },
        8792: function(A, e, t) {
            "use strict";
            t.d(e, {
                R: function() {
                    return f
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(42119),
                l = t(96577),
                r = t.n(l),
                a = t(2784),
                s = t(98614),
                c = t(33414),
                u = t(50249),
                d = t(12200),
                g = t(32093),
                p = t(91381);
            let f = A => {
                let {
                    open: e,
                    onAccountSelect: t,
                    onClose: l
                } = A, {
                    t: f
                } = (0, s.$G)("clip"), [m, h] = (0, a.useState)([]), [v, x] = (0, a.useState)(!1), {
                    getAutoImportAccountList: C,
                    createAutoImportAccount: K,
                    deactivateAutoImportAccount: b
                } = (0, c.Z)(), {
                    onConnect: y,
                    modal: w,
                    setModal: B
                } = (0, u.A)({
                    open: !1,
                    source: "opus_search"
                }), U = (0, a.useCallback)(async () => {
                    try {
                        var A, e, t, i;
                        x(!0);
                        let n = await C("YOUTUBE"),
                            o = new Set((null == n ? void 0 : null === (e = n.data) || void 0 === e ? void 0 : null === (A = e.socialConnectionMapping) || void 0 === A ? void 0 : A.map(A => A.extUserId)) || []),
                            l = (null == n ? void 0 : null === (i = n.data) || void 0 === i ? void 0 : null === (t = i.autoImportChannelItemList) || void 0 === t ? void 0 : t.filter(A => o.has(A.extUserId))) || [];
                        h(l)
                    } catch (A) {
                        console.error("Failed to fetch YouTube accounts:", A), n.Am.error("Failed to fetch YouTube accounts")
                    } finally {
                        x(!1)
                    }
                }, [C]), F = A => {
                    t(A)
                }, I = (0, a.useCallback)(async A => {
                    try {
                        (null == A ? void 0 : A.extUserId) && (await K({
                            platform: "YOUTUBE",
                            extUserId: A.extUserId,
                            autoCreateEnable: !0
                        }), await U())
                    } catch (A) {
                        console.error("Failed to create auto import account:", A), n.Am.error("Failed to connect YouTube account")
                    }
                    B("")
                }, [K, U, B]), E = async A => {
                    if (!A.extUserId) {
                        n.Am.error("Cannot delete account: Invalid account data");
                        return
                    }
                    try {
                        await b({
                            platform: "YOUTUBE",
                            extUserId: A.extUserId
                        }), n.Am.success("YouTube account disconnected successfully"), await U()
                    } catch (A) {
                        console.error("Failed to delete YouTube account:", A), n.Am.error("Failed to disconnect YouTube account")
                    }
                }, Q = A => A.startsWith("https://") && (A.includes("youtube.com") || A.includes("ytimg.com") || A.includes("yt3.ggpht.com") || A.includes("yt4.ggpht.com") || A.includes("lh3.googleusercontent.com") || A.includes("googleusercontent.com"));
                return (0, a.useEffect)(() => {
                    U()
                }, [U]), (0, i.jsxs)(i.Fragment, {
                    children: [(0, i.jsx)(n.Vq, {
                        open: e,
                        onOpenChange: A => !A && (null == l ? void 0 : l()),
                        children: (0, i.jsxs)(p.cZ, {
                            className: "flex h-fit max-w-md flex-col gap-6 max-sm:z-[1300]",
                            children: [(0, i.jsxs)(p.fK, {
                                children: [(0, i.jsx)(p.$N, {
                                    children: "YouTube Account"
                                }), (0, i.jsx)(n.ZT, {
                                    variant: "label-sm",
                                    className: "text-muted-foreground",
                                    children: "Select the account you‘d like to import a playlist from."
                                })]
                            }), (0, i.jsxs)(n.xr, {
                                className: "border-border w-full rounded-md border max-sm:h-[270px] sm:h-[420px]",
                                children: [v ? (0, i.jsx)("div", {
                                    className: "flex-1 flex items-center justify-center p-4",
                                    children: (0, i.jsx)("div", {
                                        className: "animate-spin rounded-full size-8 border-y-2 border-primary"
                                    })
                                }) : 0 === m.length ? (0, i.jsx)("div", {
                                    className: "flex-1 flex items-center justify-center p-4",
                                    children: (0, i.jsx)(n.ZT, {
                                        variant: "body-sm",
                                        className: "text-muted-foreground",
                                        children: "No YouTube accounts connected"
                                    })
                                }) : m.map((A, e) => (0, i.jsxs)("div", {
                                    className: "flex items-center justify-between p-3 border-b border-border-border-input hover:bg-background-bg-muted/50 transition-colors cursor-pointer",
                                    onClick: () => F(A),
                                    children: [(0, i.jsxs)("div", {
                                        className: "flex items-center gap-3",
                                        children: [(0, i.jsxs)("div", {
                                            className: "relative",
                                            children: [(0, i.jsxs)("div", {
                                                className: "size-8 relative rounded-full",
                                                children: [(0, i.jsx)("div", {
                                                    className: "size-8 bg-zinc-300 rounded-full"
                                                }), A.extUserPictureLink && Q(A.extUserPictureLink) && (0, i.jsx)(r(), {
                                                    className: "size-8 absolute inset-0 rounded-full object-cover",
                                                    src: A.extUserPictureLink,
                                                    alt: A.extUserName || "YouTube Channel",
                                                    width: 32,
                                                    height: 32
                                                })]
                                            }), (0, i.jsx)("div", {
                                                className: "size-3 absolute -bottom-0.5 -right-0.5 bg-red-600 rounded-full border-2 border-background flex items-center justify-center",
                                                children: (0, i.jsx)("div", {
                                                    className: "size-1.5 bg-white rounded-full"
                                                })
                                            })]
                                        }), (0, i.jsx)("div", {
                                            children: (0, i.jsx)(n.ZT, {
                                                variant: "body-sm",
                                                className: "font-medium",
                                                children: A.extUserName || "YouTube Channel"
                                            })
                                        })]
                                    }), (0, i.jsx)(n.h_, {
                                        items: [{
                                            label: (0, i.jsxs)("div", {
                                                className: "flex items-center text-white",
                                                children: [(0, i.jsx)(o.HG, {
                                                    className: "size-4 mr-2"
                                                }), "Remove account"]
                                            }),
                                            key: "delete",
                                            onClick: () => E(A)
                                        }],
                                        align: "end",
                                        side: "bottom",
                                        classNames: {
                                            content: "min-w-[140px]"
                                        },
                                        children: (0, i.jsx)(n.zx, {
                                            variant: "ghost",
                                            size: "sm",
                                            className: "size-8 p-0 hover:bg-background-bg-muted",
                                            "aria-label": "More options",
                                            onClick: A => {
                                                A.stopPropagation()
                                            },
                                            children: (0, i.jsx)(o.Tk, {
                                                className: "size-4"
                                            })
                                        })
                                    })]
                                }, A.id || e)), (0, i.jsx)(n.Bl, {})]
                            }), (0, i.jsx)(p.cN, {
                                children: (0, i.jsxs)(n.zx, {
                                    type: "submit",
                                    variant: "secondary",
                                    onClick: () => {
                                        y({
                                            platform: "YOUTUBE",
                                            type: "connect",
                                            callback: I,
                                            onSuccessToast: () => {
                                                n.Am.success(f("youtube_account_connected_successfully"))
                                            }
                                        })
                                    },
                                    children: [(0, i.jsx)(o.FU, {
                                        className: "mr-2 size-4"
                                    }), "Add account"]
                                })
                            })]
                        })
                    }), (0, i.jsx)(g.default, {
                        open: "connect.instruction.YOUTUBE" === w,
                        onClose: () => B(""),
                        setModal: B
                    }), (null == w ? void 0 : w.startsWith("connect.select-sub-account.")) && (0, i.jsx)(d.Z, {
                        open: !0,
                        onClose: () => B(""),
                        modal: w
                    })]
                })
            }
        },
        10696: function(A, e, t) {
            "use strict";
            t.d(e, {
                Wf: function() {
                    return x
                },
                X$: function() {
                    return U
                },
                Mi: function() {
                    return K
                },
                oi: function() {
                    return C
                },
                AB: function() {
                    return w
                }
            });
            var i = t(30815),
                n = t(83286),
                o = t(52322),
                l = t(58420),
                r = t(82876),
                a = t(2784),
                s = t(41748),
                c = t(38220),
                u = t(81217),
                d = t(96292);
            let g = A => A.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim().split(" ").map(A => (0, d.C5)(A)).join(" "),
                p = () => ({
                    people: new Map,
                    topic: new Map,
                    clearAll() {
                        this.people.clear(), this.topic.clear()
                    }
                }),
                f = function(A, e) {
                    let t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .1,
                        i = ((A, e) => {
                            if (!A || !e) return 0;
                            let t = A.length,
                                i = e.length,
                                n = Math.floor(Math.max(t, i) / 2) - 1,
                                o = Array(t).fill(!1),
                                l = Array(i).fill(!1),
                                r = 0,
                                a = 0;
                            for (let a = 0; a < t; a++) {
                                let t = Math.max(0, a - n),
                                    s = Math.min(i, a + n + 1);
                                for (let i = t; i < s; i++)
                                    if (!l[i] && A[a] === e[i]) {
                                        o[a] = l[i] = !0, r++;
                                        break
                                    }
                            }
                            if (0 === r) return 0;
                            let s = A.split("").filter((A, e) => o[e]),
                                c = e.split("").filter((A, e) => l[e]);
                            for (let A = 0; A < s.length; A++) s[A] !== c[A] && a++;
                            return (r / t + r / i + (r - (a = Math.floor(a / 2))) / r) / 3
                        })(A, e),
                        n = 0;
                    for (let t = 0; t < Math.min(A.length, e.length, 4) && A[t] === e[t]; t++) n++;
                    return i + t * n * (1 - i)
                },
                m = (A, e) => {
                    if (A.speakers) {
                        for (let i of [...A.speakers])
                            if (i) {
                                if (0 === e.people.size) e.people.set(i, [A]);
                                else {
                                    let n = !1;
                                    for (let o of e.people.keys())
                                        if (f(g(o), g(i)) >= .85) {
                                            var t;
                                            null === (t = e.people.get(o)) || void 0 === t || t.push(A), n = !0;
                                            break
                                        }
                                    n || e.people.set(i, [A])
                                }
                            }
                    }
                },
                h = (A, e, t) => {
                    var i, n, o, l;
                    let r = [...null !== (i = A.clipHashtags) && void 0 !== i ? i : [], ...null !== (n = A.mentionedPeople) && void 0 !== n ? n : []],
                        a = [];
                    if (0 !== t.topic.size) {
                        for (let e of r)
                            if (!(!e || t.people.has(e))) {
                                if (t.topic.has(e)) {
                                    null === (o = t.topic.get(e)) || void 0 === o || o.push(A);
                                    return
                                }
                                for (let A of t.topic.keys()) f(g(A), g(e)) >= .85 && a.push([A, e])
                            }
                    }
                    let s = "",
                        c = -1;
                    if (a.length > 0) {
                        for (let A of a) {
                            let t = f(g(e), g(A[1]));
                            t > c && (s = A[0], c = t)
                        }
                        null === (l = t.topic.get(s)) || void 0 === l || l.push(A)
                    } else {
                        for (let A of r) {
                            if (!A || t.people.has(A)) continue;
                            let i = f(g(e), g(A));
                            i > c && (s = A, c = i)
                        }
                        t.topic.set(s, [A])
                    }
                };
            var v = t(50480);
            let x = {
                    PEOPLE: "people",
                    TOPICS: "topics",
                    MOOD: "mood",
                    CUSTOM_TAGS: "custom tags",
                    FAVORITES: "favorites",
                    DURATION: "duration"
                },
                C = {
                    RELEVANCY: "relevancy",
                    RECENT: "recent",
                    OLDEST: "oldest"
                },
                K = {
                    [C.RELEVANCY]: "Relevancy",
                    [C.RECENT]: "Recently added",
                    [C.OLDEST]: "Oldest added"
                },
                b = [{
                    label: "<15 seconds",
                    range: [0, 15e3]
                }, {
                    label: "15-60 seconds",
                    range: [15e3, 6e4]
                }, {
                    label: "60-90 seconds",
                    range: [6e4, 9e4]
                }, {
                    label: "90 seconds-3 minutes",
                    range: [9e4, 18e4]
                }, {
                    label: "3-15 minutes",
                    range: [18e4, 9e5]
                }],
                y = (0, a.createContext)(void 0),
                w = () => {
                    let A = (0, a.useContext)(y);
                    if (!A) throw Error("useSearchContext must be used within a SearchProvider");
                    return A
                },
                B = A => {
                    let {
                        setOrgId: e,
                        setNoLlm: t,
                        setModel: i,
                        setRankType: n
                    } = A, o = (0, r.useSearchParams)();
                    return (0, a.useEffect)(() => {
                        let A = o.get("noLlm");
                        A && t(!!A);
                        let e = o.get("model");
                        e && i(e);
                        let l = o.get("rankType");
                        l && n(l)
                    }, [o, e, t, i, n]), null
                },
                U = A => {
                    let {
                        children: e
                    } = A, [t, r] = (0, a.useState)(""), [d, g] = (0, a.useState)(!1), [f, x] = (0, a.useState)(""), [K, w] = (0, a.useState)(""), [U, F] = (0, a.useState)(""), [I, E] = (0, a.useState)(null), [Q, j] = (0, a.useState)(null), [S, L] = (0, a.useState)(!1), [R, k] = (0, a.useState)(!1), [q, O] = (0, a.useState)([]), [D, P] = (0, a.useState)(C.RELEVANCY), [N, Z] = (0, a.useState)(b.map(A => A.range)), {
                        getPrismaClipsByProjectId: M
                    } = (0, c.ZP)(), {
                        getSearchableClips: V
                    } = (0, u.Z)(), T = (0, a.useRef)(p()).current, Y = (0, a.useRef)(new Map);
                    (0, a.useEffect)(() => {
                        let A = A => {
                            U && !U.includes("export") && A.preventDefault()
                        };
                        return window.addEventListener("beforeunload", A), () => {
                            window.removeEventListener("beforeunload", A)
                        }
                    }, [U]);
                    let H = async A => {
                            var e;
                            let {
                                exportableClip: t
                            } = A, o = (0, n._)(A, ["exportableClip"]), l = await M(null !== (e = A.projectId) && void 0 !== e ? e : ""), r = null == l ? void 0 : l.find(e => e.clipId === A.clipId);
                            return (0, i._)({}, (0, s.p9)([t])[0], o, r)
                        },
                        _ = (A, e) => Array.from(new Map([...A, ...e].map(A => [A.clipId, A])).values()),
                        W = (0, l.lV)(async (A, e, t, i) => {
                            let n = (await V({
                                    pageSize: 30,
                                    page: i,
                                    query: [t]
                                })).result.opusSearchPayloads,
                                o = n.map(A => A.clipId);
                            1 === i && Y.current.clear(), Y.current.set(i, o);
                            let l = [];
                            for (let A of Y.current.values()) l.push(...A);
                            e(v.p2.clipIdList, [...new Set(l)]);
                            let r = await Promise.all(n.map(H));
                            return r.forEach(A => {
                                e(v.p2.clipItem(A.clipId), A)
                            }), 1 === i ? (T.clearAll(), j(r), E(r)) : (j(A => _(A || [], r)), E(A => _(A || [], r))), r.forEach(A => {
                                m(A, T), h(A, t, T)
                            }), n.length
                        });
                    return (0, o.jsxs)(y.Provider, {
                        value: {
                            orgId: t,
                            noLlm: d,
                            model: f,
                            rankType: K,
                            clips: I,
                            sortBy: D,
                            filters: q,
                            dirtyReason: U,
                            durationRanges: N,
                            clipsAreLoading: S,
                            originalSearchClips: Q,
                            favoriteClipsLoading: R,
                            reverseIdxMaps: T,
                            setOrgId: r,
                            setNoLlm: g,
                            setModel: x,
                            setRankType: w,
                            setClips: E,
                            setSortBy: P,
                            addFilter: A => {
                                q.some(e => e.value === A.value && e.label === A.label) || O([...q, A])
                            },
                            removeFilter: A => O(q.filter(e => e.value !== A.value || e.label !== A.label)),
                            resetFilters: () => O([]),
                            setDirtyReason: F,
                            setDuration: Z,
                            setClipsAreLoading: L,
                            setOriginalSearchClips: j,
                            searchClips: W,
                            removeFilterByName: A => {
                                O(q.filter(e => e.value !== A))
                            },
                            setFavoriteClipsLoading: k
                        },
                        children: [(0, o.jsx)(a.Suspense, {
                            children: (0, o.jsx)(B, {
                                setOrgId: r,
                                setNoLlm: g,
                                setModel: x,
                                setRankType: w
                            })
                        }), e]
                    })
                }
        },
        29133: function(A, e, t) {
            "use strict";
            t.d(e, {
                i: function() {
                    return m
                },
                q: function() {
                    return f
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(52322),
                l = t(752),
                r = t(2784),
                a = t(81217),
                s = t(89802),
                c = t(55773);
            let u = (0, r.createContext)(null),
                d = "canUseSearch_",
                g = A => {
                    try {
                        let e = sessionStorage.getItem("".concat(d).concat(A));
                        return "true" === e || null
                    } catch (A) {
                        return console.warn("Failed to retrieve search cache from session storage:", A), null
                    }
                },
                p = (A, e) => {
                    try {
                        e && sessionStorage.setItem("".concat(d).concat(A), "true")
                    } catch (A) {
                        console.warn("Failed to store search cache in session storage:", A)
                    }
                },
                f = A => {
                    let {
                        children: e
                    } = A, [t, d] = (0, r.useState)({
                        isLoading: !0,
                        isOwner: !1,
                        isOwnerOrAdmin: !1,
                        isNewUser: !0,
                        indexingInProgress: !1,
                        canUseSearch: !1,
                        indexingStats: {
                            indexedVideos: 0,
                            totalVideos: 0,
                            targetDeliveryAt: ""
                        }
                    }), {
                        getInitialIndexingJobs: f
                    } = (0, a.Z)(), m = (0, l.Dv)(c.Mz.userOrgInfo), h = (0, l.Dv)(c.Mz.currentOrgOwnerUserId), v = (0, l.Dv)(c.Mz.userOrgs), x = (0, s.Z)(), C = (0, r.useCallback)(async () => {
                        try {
                            var A, e;
                            let t = null == m ? void 0 : m.userId,
                                o = h === t,
                                l = null == m ? void 0 : m.orgId,
                                r = v.find(A => A.orgId === l),
                                a = (null !== (e = null == r ? void 0 : null === (A = r.permissions) || void 0 === A ? void 0 : A.length) && void 0 !== e ? e : 0) > 0,
                                s = o || a;
                            if (!l) return d(A => (0, n._)((0, i._)({}, A), {
                                isLoading: !1
                            })), null;
                            let c = g(l);
                            if (!0 === c) return d({
                                isLoading: !1,
                                isOwner: o,
                                isOwnerOrAdmin: s,
                                isNewUser: !1,
                                indexingInProgress: !1,
                                canUseSearch: !0,
                                indexingStats: {
                                    indexedVideos: 0,
                                    totalVideos: 0,
                                    targetDeliveryAt: ""
                                }
                            }), {
                                indexingInProgress: !1,
                                canUseSearch: !0
                            };
                            let u = (await f()).data.list[0],
                                x = (null == u ? void 0 : u.status) === "PROCESSING",
                                C = (null == u ? void 0 : u.canUseSearch) || !1;
                            return C && l && !x && p(l, !0), d({
                                isLoading: !1,
                                isOwner: o,
                                isOwnerOrAdmin: s,
                                isNewUser: !C,
                                indexingInProgress: x,
                                canUseSearch: C,
                                indexingStats: {
                                    indexedVideos: (null == u ? void 0 : u.completedCount) || 0,
                                    totalVideos: (null == u ? void 0 : u.totalCount) || 0,
                                    targetDeliveryAt: (null == u ? void 0 : u.targetDeliveryAt) || ""
                                }
                            }), {
                                indexingInProgress: x,
                                canUseSearch: C
                            }
                        } catch (A) {
                            return console.error("Failed to check user state:", A), d(A => (0, n._)((0, i._)({}, A), {
                                isLoading: !1
                            })), null
                        }
                    }, [f, m, h, v]);
                    return (0, r.useEffect)(() => {
                        d({
                            isLoading: !0,
                            isOwner: !1,
                            isOwnerOrAdmin: !1,
                            isNewUser: !0,
                            indexingInProgress: !1,
                            canUseSearch: !1,
                            indexingStats: {
                                indexedVideos: 0,
                                totalVideos: 0,
                                targetDeliveryAt: ""
                            }
                        })
                    }, [null == m ? void 0 : m.orgId]), (0, r.useEffect)(() => {
                        if (x) {
                            let A = null;
                            return (async () => {
                                let e = await C();
                                (null == e ? void 0 : e.indexingInProgress) && (A = setInterval(async () => {
                                    let e = await C();
                                    (null == e ? void 0 : e.indexingInProgress) || !A || (clearInterval(A), A = null)
                                }, 5e3))
                            })(), () => {
                                A && clearInterval(A)
                            }
                        }
                    }, [C, x]), (0, o.jsx)(u.Provider, {
                        value: t,
                        children: e
                    })
                },
                m = () => {
                    let A = (0, r.useContext)(u);
                    if (!A) throw Error("useUserSearchState must be used within a UserSearchStateProvider");
                    return A
                }
        },
        43207: function(A, e, t) {
            "use strict";
            t.d(e, {
                Bl: function() {
                    return C
                },
                IO: function() {
                    return s
                },
                MN: function() {
                    return c
                },
                R: function() {
                    return h
                },
                SB: function() {
                    return x
                },
                YQ: function() {
                    return n
                },
                cM: function() {
                    return v
                },
                kN: function() {
                    return l
                },
                mH: function() {
                    return a
                },
                ny: function() {
                    return r
                }
            });
            var i = t(10696);
            let n = A => () => {
                    let e = window.open(A, "_blank", "noopener,noreferrer");
                    e && (e.opener = null)
                },
                o = (A, e) => {
                    let t = new URL("".concat(window.location.origin, "/editor-ux/").concat(A, ".").concat(e));
                    return t.searchParams.set("editType", "normal"), t.searchParams.set("clipId", e), t
                },
                l = (A, e) => o(A, e).toString(),
                r = (A, e) => {
                    let t = o(A, e);
                    return t.searchParams.set("quickAmend", JSON.stringify({
                        uploadVideo: 1
                    })), t.toString()
                };

            function a(A, e) {
                if (A && e && "YOUTUBE" === e) return "https://www.youtube.com/watch?v=".concat(A.replace(/^YT_/, ""))
            }
            let s = (A, e) => {
                    if (!e || 0 === e.length || 0 === e[0].length) return A;
                    let t = e[0][0];
                    if (Number.isNaN(t)) return A;
                    let i = new URL(A);
                    return i.searchParams.set("t", "".concat(Math.floor(t / 1e3), "s")), i.toString()
                },
                c = A => new Date(Number.parseInt(A.slice(0, 4), 10), Number.parseInt(A.slice(4, 6), 10) - 1, Number.parseInt(A.slice(6, 8), 10)),
                u = A => (e, t) => {
                    for (let i of A) {
                        let A = i(e, t);
                        if (0 !== A) return A
                    }
                    return 0
                },
                d = function() {
                    let A = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    return (e, t) => {
                        let i = e.uploadedDate ? Number.parseInt(e.uploadedDate) : e.updatedAt ? new Date(e.updatedAt).getTime() : 0,
                            n = t.uploadedDate ? Number.parseInt(t.uploadedDate) : t.updatedAt ? new Date(t.updatedAt).getTime() : 0;
                        return A ? i - n : n - i
                    }
                },
                g = (A, e) => {
                    var t, i;
                    return (null !== (t = e.searchableClipScore) && void 0 !== t ? t : 0) - (null !== (i = A.searchableClipScore) && void 0 !== i ? i : 0)
                },
                p = A => A.sort(u([d(), g])),
                f = A => A.sort(u([d(!0), g])),
                m = A => A.sort(u([g, d()])),
                h = (A, e) => {
                    switch (e) {
                        case i.oi.OLDEST:
                            return f(A);
                        case i.oi.RECENT:
                            return p(A);
                        default:
                            return m(A)
                    }
                },
                v = A => {
                    if (!A) return {
                        estimatedHours: 0,
                        actualHours: 0,
                        formattedTime: "Less than 1 hour remaining"
                    };
                    let e = new Date,
                        t = Math.max(0, (new Date(A).getTime() - e.getTime()) / 36e5),
                        i = Math.ceil(t),
                        n = t < 1 ? "Less than 1 hour remaining" : "Estimated ".concat(i, " ").concat(1 === i ? "hour" : "hours", " remaining");
                    return {
                        estimatedHours: i,
                        actualHours: t,
                        formattedTime: n
                    }
                },
                x = (A, e) => e > 0 ? Math.min(A / e * 100, 100) : 0,
                C = A => {
                    if (!A) return "";
                    let e = (Array.isArray(A) ? A[0] || "" : A).replace(/^["']|["']$/g, "");
                    return '"'.concat(e, '"')
                }
        },
        46688: function(A, e, t) {
            "use strict";
            t.d(e, {
                J0: function() {
                    return l
                },
                lC: function() {
                    return r
                },
                y8: function() {
                    return o
                }
            });
            var i = t(5077),
                n = t(48989);

            function o(A) {
                switch (A) {
                    case "YOUTUBE":
                        return "YouTube";
                    case "INSTAGRAM_BUSINESS":
                        return "Instagram";
                    case "TIKTOK_USER":
                    case "TIKTOK_BUSINESS":
                        return "TikTok";
                    case "LINKEDIN":
                        return "Linkedin";
                    case "TWITTER":
                        return "Twitter";
                    case "FACEBOOK_PAGE":
                        return "Facebook";
                    default:
                        return "Third Party"
                }
            }

            function l(A, e, t, i, o) {
                let l = t.map(A => 0 === A[0] ? "".concat(A[0], "-").concat(A[1], "s") : "".concat(A[0], "s-").concat(A[1], "s")).join(", "),
                    r = i.join(", ");
                return t.length && i.length ? o("clip:length_and_topics", {
                    lengthText: l,
                    topicsText: r,
                    startSecond: (0, n.qP)(A),
                    endSecond: (0, n.qP)(e)
                }) : t.length && !i.length ? o("clip:length_only", {
                    lengthText: l,
                    startSecond: (0, n.qP)(A),
                    endSecond: (0, n.qP)(e)
                }) : !t.length && i.length ? o("clip:auto_topics", {
                    topicsText: r,
                    startSecond: (0, n.qP)(A),
                    endSecond: (0, n.qP)(e)
                }) : o("clip:auto_only", {
                    startSecond: (0, n.qP)(A),
                    endSecond: (0, n.qP)(e)
                })
            }
            t(3250), t(18285);
            let r = () => {
                let A = document.getElementById(i.UU);
                A && A.scrollTo({
                    top: 0,
                    behavior: "instant"
                })
            }
        },
        3250: function(A, e, t) {
            "use strict";
            t.d(e, {
                k: function() {
                    return B
                }
            });
            var i, n, o, l, r, a, s = t(52322),
                c = t(57992),
                u = t(20964),
                d = t(2784);
            let g = ["title", "titleId"];

            function p() {
                return (p = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let f = (0, d.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: o
                } = A, l = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, g);
                return d.createElement("svg", p({
                    width: 28,
                    height: 28,
                    viewBox: "0 0 28 28",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    xmlnsXlink: "http://www.w3.org/1999/xlink",
                    ref: e,
                    "aria-labelledby": o
                }, l), t ? d.createElement("title", {
                    id: o
                }, t) : null, i || (i = d.createElement("path", {
                    d: "M8.00261 0.0222168L19.8196 0.0222168C22.0185 0.0222168 24.0191 0.924549 25.4706 2.37375C26.9244 3.82523 27.8267 5.82813 27.8267 8.02928V20.0171C27.8267 22.2137 26.9244 24.2143 25.4752 25.6658L25.4706 25.6703C24.0169 27.1218 22.0162 28.0219 19.8219 28.0219H8.00261C5.80145 28.0219 3.79853 27.1195 2.34704 25.6703L2.29235 25.6088C0.875037 24.1642 -0.0045166 22.1863 -0.0045166 20.0148L-0.0045166 8.02928C-0.0045166 5.82585 0.895545 3.82523 2.34704 2.37375C3.79853 0.922271 5.79917 0.0222168 8.00261 0.0222168ZM20.8473 7.09049L20.8632 7.11555H25.7851C25.5868 5.8213 24.9693 4.6592 24.0807 3.76826C22.9869 2.67453 21.4785 1.9955 19.8196 1.9955H17.7985L20.8473 7.09049ZM18.5709 7.11555L15.5062 1.9955L8.78418 1.9955L11.8854 7.11555L18.5709 7.11555ZM9.59082 7.11555L6.59213 2.16184C5.49611 2.42616 4.51402 2.99353 3.74156 3.76826C2.85289 4.65692 2.23766 5.8213 2.03714 7.11555H9.59082ZM25.8534 9.08884H1.96878L1.96878 20.0171C1.96878 21.6509 2.62731 23.1388 3.69143 24.228L3.74156 24.2758C4.83531 25.3696 6.34604 26.0509 8.00261 26.0509H19.8196C21.4785 26.0509 22.9869 25.3718 24.0784 24.2804L24.0829 24.2758C25.1744 23.1844 25.8534 21.6759 25.8534 20.0171V9.08884ZM11.6051 12.5432L17.7187 16.5194C17.8167 16.5832 17.9056 16.6652 17.9762 16.7655C18.2542 17.1688 18.1517 17.7225 17.7483 18.0005L11.6598 21.5939C11.5072 21.7192 11.3112 21.7944 11.0947 21.7944C10.6025 21.7944 10.2038 21.3956 10.2038 20.9035V13.2724H10.2083C10.2083 13.0969 10.2607 12.9192 10.3678 12.7642C10.6504 12.3609 11.2041 12.2629 11.6051 12.5432Z",
                    fill: "url(#pattern0)"
                })), n || (n = d.createElement("defs", null, d.createElement("pattern", {
                    id: "pattern0",
                    patternContentUnits: "objectBoundingBox",
                    width: 1,
                    height: 1
                }, d.createElement("use", {
                    xlinkHref: "#image0_1340_27096",
                    transform: "scale(0.000439947)"
                })), d.createElement("image", {
                    id: "image0_1340_27096",
                    width: 2273,
                    height: 2275,
                    xlinkHref: "data:image/jpeg;base64,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Hbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfw5h277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3XY/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26j+GHbqP4Yduo38MO3Ub+GHbqP4Yduo/hh26j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmNh25jYduY2HbmNh25jYduY2HbmNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh0+Nh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jhz+j7fweHn/AFd+fp9v6v8Ape79DDf1JLc930/LnmGfj9H0+v7/APAf6c32/wAQ/wCR+n/5f9383/iNaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca0415xrzjXnGvONeca8415xrzjXnGvONeca8415xrzjXnGvONeca8415xrzjXnGvONeYa8w15hrzDXmGvMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMNeYa8w15hrzDXnGvONeca8415xrzjXnGvONeca041pxrTjWnGtONaca041pxrTjWnGtONacas41ZxqzjVnGrONWcas41ZxqzjVnGrONScak41JxqTjUUGooNRQaig1FBqKDTUGmoNNQaag01BpqDTUGmoNNQaag0lBpKDSUGkoNJQaSg0lBpKDSUGioNFQaKg0VBoqDRVGiqNFUaKo0FRoKjQVGgqNBUaCo0FRoKjQVGgqPXqj16o9eqPXqj16o9eqPXqj16o9eqPXqj1yo9cqPXKj1yo9cqPXLD1yw9csPXLD1yw9csPWrD1qw9asPWrD1qw9asPWrD1qw9asPWrD1qw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1aw9WsPVrD1aw9WsPVrD1aw9WsPVrD1aw9WsPVrB34/8Ay/z/AH/53yHY/wDU/E/0v+P7/wCz/9k="
                }))))
            });
            t.p;
            var m = t(94336);
            let h = ["title", "titleId"];

            function v() {
                return (v = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let x = (0, d.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, h);
                return d.createElement("svg", v({
                    width: 28,
                    height: 28,
                    viewBox: "0 0 28 28",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? d.createElement("title", {
                    id: i
                }, t) : null, o || (o = d.createElement("g", {
                    clipPath: "url(#clip0_4107_24903)"
                }, d.createElement("path", {
                    d: "M20.0599 10.1085C21.8605 11.4002 24.0663 12.1602 26.4486 12.1602V7.55952C25.9978 7.55961 25.5481 7.51243 25.107 7.41864V11.0401C22.7248 11.0401 20.5193 10.28 18.7182 8.98844V18.3772C18.7182 23.0739 14.9243 26.881 10.2446 26.881C8.49848 26.881 6.87553 26.3513 5.52734 25.4427C7.06607 27.0216 9.21195 28.0011 11.586 28.0011C16.266 28.0011 20.0601 24.1939 20.0601 19.497V10.1085H20.0599ZM21.715 5.46696C20.7948 4.45807 20.1906 3.15426 20.0599 1.71284V1.12109H18.7885C19.1085 2.95313 20.2001 4.51832 21.715 5.46696ZM8.48728 21.8386C7.97316 21.1621 7.69533 20.3345 7.69657 19.4836C7.69657 17.3355 9.43188 15.5938 11.5728 15.5938C11.9718 15.5937 12.3684 15.655 12.7486 15.7761V11.0725C12.3042 11.0114 11.8558 10.9855 11.4075 10.995V14.656C11.027 14.5349 10.6302 14.4734 10.2311 14.4738C8.0902 14.4738 6.35499 16.2153 6.35499 18.3637C6.35499 19.8828 7.22236 21.1979 8.48728 21.8386Z",
                    fill: "#FF004F"
                }), d.createElement("path", {
                    d: "M18.7193 8.98835C20.5203 10.28 22.7258 11.04 25.108 11.04V7.41855C23.7783 7.1343 22.6011 6.43694 21.716 5.46696C20.2011 4.51822 19.1095 2.95304 18.7895 1.12109H15.4498V19.4968C15.4423 21.6391 13.7099 23.3737 11.5736 23.3737C10.3147 23.3737 9.19633 22.7715 8.48802 21.8386C7.2232 21.1979 6.35583 19.8827 6.35583 18.3638C6.35583 16.2156 8.09104 14.4739 10.2319 14.4739C10.6421 14.4739 11.0375 14.538 11.4083 14.6561V10.9951C6.81081 11.0904 3.11328 14.8604 3.11328 19.4969C3.11328 21.8115 4.03405 23.9097 5.52847 25.4428C6.87665 26.3513 8.4996 26.8811 10.2457 26.8811C14.9256 26.8811 18.7194 23.0738 18.7194 18.3772V8.98835H18.7193Z",
                    fill: "white"
                }), d.createElement("path", {
                    d: "M25.1058 7.41743V6.43823C23.9067 6.44006 22.7312 6.10305 21.7139 5.46576C22.6145 6.45524 23.8003 7.13751 25.1058 7.41743ZM18.7873 1.11998C18.7568 0.944897 18.7334 0.768659 18.7171 0.59175V0H14.1059V18.3759C14.0985 20.5179 12.3663 22.2525 10.2298 22.2525C9.60253 22.2525 9.01031 22.1031 8.48585 21.8376C9.19416 22.7703 10.3126 23.3725 11.5714 23.3725C13.7076 23.3725 15.4402 21.6381 15.4477 19.4958V1.11998H18.7873ZM11.4064 10.994V9.95154C11.0211 9.89869 10.6326 9.87217 10.2436 9.87236C5.56343 9.87226 1.76953 13.6796 1.76953 18.3759C1.76953 21.3203 3.2606 23.9151 5.52639 25.4415C4.03198 23.9085 3.11121 21.8102 3.11121 19.4957C3.11121 14.8593 6.80864 11.0893 11.4064 10.994Z",
                    fill: "#00F2EA"
                }))), l || (l = d.createElement("defs", null, d.createElement("clipPath", {
                    id: "clip0_4107_24903"
                }, d.createElement("rect", {
                    width: 28,
                    height: 28,
                    fill: "white"
                })))))
            });
            t.p;
            var C = t(95710);
            let K = ["title", "titleId"];

            function b() {
                return (b = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let y = (0, d.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: i
                } = A, n = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, K);
                return d.createElement("svg", b({
                    width: 28,
                    height: 28,
                    viewBox: "0 0 28 28",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": i
                }, n), t ? d.createElement("title", {
                    id: i
                }, t) : null, r || (r = d.createElement("path", {
                    d: "M10.5 18.9016L18.9 14.0016L10.5 9.10156V18.9016Z",
                    fill: "white"
                })), a || (a = d.createElement("path", {
                    d: "M21.062 12.1779C20.6514 11.9553 20.2587 11.7156 19.7947 11.4588C20.2587 11.185 20.6874 10.9453 21.0979 10.7227C23.0081 9.72985 24.0614 7.71021 23.7399 5.65613C23.2755 2.28437 19.2232 0.333336 16.1529 2.01053C13.011 3.73953 9.86919 5.43409 6.76298 7.21405C4.29949 8.63477 3.94235 10.5175 4.33512 12.7426C4.58509 14.1292 5.54905 15.156 6.81642 15.8579C7.26262 16.0976 7.69102 16.3373 8.17314 16.6111C7.63758 16.9191 7.15574 17.193 6.63799 17.4497C4.35293 18.8363 3.5674 21.6774 4.85287 23.9712C6.2096 26.3848 9.35144 27.3091 11.8684 26.0082C14.5818 24.5362 17.2953 23.0298 19.9909 21.5237C20.6336 21.1642 21.312 20.8391 21.8832 20.3939C24.7573 18.1002 24.3289 13.941 21.062 12.1779ZM11.4759 17.7922V10.3122L18.2239 14.0438L11.4759 17.7922Z",
                    fill: "#F40407"
                })))
            });
            t.p;
            var w = t(18285);
            let B = A => ({
                YOUTUBE: {
                    name: "YouTube Shorts",
                    icon: (0, s.jsx)(y, {}),
                    limit: {
                        title: 100,
                        description: 2200,
                        invalidCharactersInTitle: ["<", ">"],
                        invalidCharactersInDescription: ["<", ">"]
                    },
                    error: {
                        InsufficientQuotaError: (0, s.jsx)("div", {
                            className: "",
                            children: (0, s.jsxs)("span", {
                                className: "whitespace-pre-wrap text-sm font-semibold",
                                children: [null == A ? void 0 : A("plansocial:you_have_reached"), (0, s.jsx)(c.zx, {
                                    variant: "link",
                                    onClick: () => {
                                        window.open(w.eW)
                                    },
                                    className: "mx-1 bg-transparent",
                                    children: null == A ? void 0 : A("plansocial:here")
                                }), "."]
                            })
                        })
                    }
                },
                TIKTOK_USER: {
                    name: "TikTok",
                    sideHint: "Inbox",
                    icon: (0, s.jsx)(x, {}),
                    optionalTitle: !0,
                    limit: {
                        title: 1e3,
                        description: 1e3
                    }
                },
                TIKTOK_BUSINESS: {
                    name: "TikTok",
                    sideHint: "Feed",
                    icon: (0, s.jsx)(x, {}),
                    optionalTitle: !0,
                    limit: {
                        title: 1e3,
                        description: 1e3
                    }
                },
                INSTAGRAM_BUSINESS: {
                    name: "Instagram Reels",
                    icon: (0, s.jsx)(f, {}),
                    optionalTitle: !0,
                    limit: {
                        title: 2200,
                        description: 2200,
                        hashtagInDescription: 30,
                        atTagInDescription: 20
                    }
                },
                FACEBOOK_PAGE: {
                    name: "Facebook Page",
                    icon: (0, s.jsx)(u.r, {}),
                    optionalTitle: !0,
                    limit: {
                        title: 255,
                        description: 5e4
                    }
                },
                LINKEDIN: {
                    name: "LinkedIn",
                    icon: (0, s.jsx)(m.r, {}),
                    optionalTitle: !0,
                    limit: {
                        title: 3e3,
                        description: 3e3
                    }
                },
                TWITTER: {
                    name: "Twitter",
                    sideHint: "Beta",
                    icon: (0, s.jsx)(C.r, {}),
                    optionalTitle: !0,
                    limit: {
                        title: 280,
                        description: 280
                    }
                }
            })
        },
        81329: function(A, e, t) {
            "use strict";
            t.d(e, {
                v: function() {
                    return n
                }
            });
            var i = t(66836);
            let n = () => {
                let [A] = (0, i.XL)("editor_ux"), [e] = (0, i.lb)("editor_ux_v3"), [t] = (0, i.lb)("editor_ux_v3_from_legacy");
                return ["test1" === A || "test2" === A || e || t]
            }
        },
        15905: function(A, e, t) {
            "use strict";
            t.d(e, {
                M: function() {
                    return d
                }
            });
            var i = t(84411),
                n = t(39872),
                o = t(752),
                l = t(2784),
                r = t(6804),
                a = t(41950),
                s = t(87932),
                c = t(59511),
                u = t(55773);
            let d = () => {
                let {
                    userId: A,
                    orgId: e
                } = (0, o.Dv)(u.Mz.userOrgInfo) || {}, {
                    checkFirstTimeClipExport: t,
                    createClipExportForUser: d
                } = (0, a.Z)(), g = (0, l.useRef)(new n.WU);
                return {
                    recordExported: (0, c.Z)(async function(n, o, l) {
                        let a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "";
                        return await g.current.runExclusive(async () => {
                            if (e && A) try {
                                await t(e, A) && (0, s.kA)();
                                try {
                                    await d({
                                        orgId: e,
                                        userId: A,
                                        idempotentKey: (0, r.Z)(),
                                        projectId: n,
                                        clipId: o,
                                        type: l,
                                        platform: a
                                    })
                                } catch (A) {
                                    404 !== A.status && i.kg.error("failed to create clip export for user ".concat(A))
                                }
                            } catch (A) {
                                404 !== A.status && i.kg.error("failed to check first time clip export result ".concat(A))
                            }
                        })
                    })
                }
            }
        },
        30933: function(A, e, t) {
            "use strict";
            t.d(e, {
                H: function() {
                    return r
                }
            });
            var i = t(752),
                n = t(2784),
                o = t(89640),
                l = t(22108);
            let r = () => {
                let [A, e] = (0, i.KO)(l.Q.supportUploadBg), t = "quickstart_long_to_long" === (0, i.Dv)(o.E2.submitUseCase);
                return (0, n.useEffect)(() => {
                    t ? e(!1) : e(!0)
                }, [t, e]), {
                    enhanceUpload: !1,
                    enableUploadBg: !1,
                    enableYtbOauth: !1,
                    isUploadExp: !1,
                    supportUploadBg: A,
                    setSupportUploadBg: e
                }
            }
        },
        20253: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return U
                }
            });
            var i = t(52322),
                n = t(77298),
                o = t(57992),
                l = t(752),
                r = t(2784),
                a = t(98614),
                s = t(33414),
                c = t(9019),
                u = t(55975),
                d = t(91685),
                g = t(91381),
                p = t(50620),
                f = t(25074),
                m = t(33178),
                h = t(44710),
                v = t(80629),
                x = t(55773),
                C = t(89640),
                K = t(7885),
                b = t(10123),
                y = t(2871),
                w = t(6104);

            function B(A) {
                let {
                    name: e,
                    platform: t,
                    imgSrc: n,
                    sideHint: l,
                    onRemove: r,
                    link: s,
                    onReauthorize: c,
                    unhealthy: d
                } = A, {
                    t: g
                } = (0, a.$G)("plansocial"), {
                    openUpsellWindow: p
                } = (0, y.w)(), {
                    platformFeatureOn: f
                } = (0, w.Q)([t]);
                return (0, i.jsxs)("div", {
                    className: "border-border flex items-center justify-between border-b py-3 pl-2 pr-4",
                    style: {
                        paddingRight: 16,
                        paddingLeft: 8
                    },
                    children: [(0, i.jsxs)("div", {
                        className: "flex cursor-pointer items-center gap-2",
                        onClick: () => window.open(s),
                        children: [(0, i.jsx)(h.Z, {
                            platform: t,
                            name: e,
                            imgSrc: n
                        }), (0, i.jsx)("div", {
                            className: (0, b.cn)("text-xs text-foreground", d && "text-muted-foreground"),
                            children: e
                        }), d && (0, i.jsx)(K.Z, {
                            className: "text-warn opacity-60",
                            onClick: A => {
                                A.stopPropagation(), window.open("https://help.opus.pro/docs/article/9432410-social-account-faq#reauthorize-my-account")
                            }
                        }), l && (0, i.jsx)(o.Ct, {
                            variant: "secondary",
                            children: l
                        })]
                    }), (0, i.jsxs)("div", {
                        className: "flex items-center gap-4",
                        children: [d && (0, i.jsx)(o.zx, {
                            variant: "secondary",
                            className: "text-foreground cursor-pointer text-xs",
                            onClick: () => {
                                f ? ((0, u.B)("social_connection.reauthorize.click", {
                                    connectFrom: "account_management",
                                    platform: t
                                }), c()) : p({
                                    switchType: "plan",
                                    trigger: "add-account",
                                    ads: "autopost"
                                }, !1)
                            },
                            children: g("reauthorize")
                        }), (0, i.jsx)("div", {
                            className: "text-foreground cursor-pointer items-center text-xs",
                            onClick: r,
                            children: g("remove")
                        })]
                    })]
                })
            }

            function U(A) {
                let {
                    open: e,
                    onClose: t
                } = A, {
                    t: K
                } = (0, a.$G)("plansocial"), {
                    data: b,
                    refetch: y
                } = (0, c.H)(), w = (0, r.useRef)(null), [U, F] = (0, r.useState)(""), [I, E] = (0, r.useState)("ALL"), [Q, j] = (0, r.useState)(null), [S, L] = (0, r.useState)(!1), {
                    selectedAccountListV2: R = [],
                    refetchAccounts: k,
                    deleteAccount: q
                } = (0, f.E5)(), {
                    isBelowSm: O
                } = (0, p.G)("sm"), D = (0, l.Dv)(v.a.currentOrgAsset), {
                    plan: P
                } = null != D ? D : {}, N = (0, l.Dv)(x.Mz.impMode) || "off", {
                    getAutoImportAccountList: Z
                } = (0, s.Z)(), M = (0, l.b9)(C.E2.autoImportActive);
                (0, r.useEffect)(() => {
                    e && (0, u.B)("social_connection.account_list.show", {
                        plan: P
                    })
                }, [e, P]);
                let V = async () => {
                    let A = await Z("YOUTUBE"),
                        {
                            autoImportChannelItemList: e
                        } = (null == A ? void 0 : A.data) || {};
                    M((null == e ? void 0 : e.length) > 0)
                };
                return (0, i.jsxs)(i.Fragment, {
                    children: [(0, i.jsx)(d.Z, {
                        ref: w,
                        open: "add-account" === U,
                        onClose: () => F(""),
                        source: "window_dropdown"
                    }), (0, i.jsx)(g.Vq, {
                        open: e,
                        onOpenChange: A => !A && (null == t ? void 0 : t(A)),
                        children: (0, i.jsxs)(g.cZ, {
                            className: "flex h-fit max-w-md flex-col gap-6 max-sm:z-[1300]",
                            children: [(0, i.jsx)(g.fK, {
                                children: (0, i.jsx)(g.$N, {
                                    children: K("social_account_connections")
                                })
                            }), (0, i.jsx)(m.Z, {
                                setPlatform: E
                            }), (0, i.jsxs)(o.xr, {
                                className: "border-border w-full rounded-md border max-sm:h-[270px] sm:h-[420px]",
                                children: [R.filter(A => "ALL" === I || I === A.platform || "TIKTOK_BUSINESS" === I && ("TIKTOK_BUSINESS" === A.platform || "TIKTOK_USER" === A.platform)).map((A, e) => {
                                    var t, n;
                                    return (0, i.jsx)(B, {
                                        unhealthy: !(null === (n = null == b ? void 0 : null === (t = b.data.orgSocialAccount.find(e => e.extUserId === A.extUserId)) || void 0 === t ? void 0 : t.enable) || void 0 === n || n),
                                        name: A.extUserName,
                                        platform: A.platform,
                                        imgSrc: A.extUserPictureLink,
                                        link: A.extUserProfileLink,
                                        onReauthorize: () => {
                                            var e;
                                            null === (e = w.current) || void 0 === e || e.connect({
                                                platform: A.platform,
                                                type: "reauthorize",
                                                params: A,
                                                callback: async () => {
                                                    await y()
                                                }
                                            })
                                        },
                                        onRemove: () => {
                                            y(), j(A), L(!0)
                                        }
                                    }, e)
                                }), (0, i.jsx)(o.Bl, {})]
                            }), (0, i.jsx)(g.cN, {
                                children: (0, i.jsxs)(o.zx, {
                                    type: "submit",
                                    onClick: () => F("add-account"),
                                    disabled: "on" === N,
                                    children: [(0, i.jsx)(n.pOD, {
                                        className: "mr-2 size-4"
                                    }), K("add_account")]
                                })
                            })]
                        })
                    }), (0, i.jsx)(g.Vq, {
                        open: S,
                        onOpenChange: L,
                        children: (0, i.jsxs)(g.cZ, {
                            style: O ? {
                                width: "calc(100vw - 32px)",
                                height: "500px",
                                zIndex: 1300
                            } : {},
                            children: [(0, i.jsxs)(g.fK, {
                                className: "gap-4",
                                children: [(0, i.jsx)(g.$N, {
                                    children: K("remove_social_account")
                                }), (0, i.jsx)("div", {
                                    children: K("by_disconnecting")
                                }), Q && (0, i.jsx)("div", {
                                    className: "border-border flex items-center justify-center rounded-md border px-3 py-4",
                                    style: {
                                        paddingRight: 16,
                                        paddingLeft: 8
                                    },
                                    children: (0, i.jsxs)("div", {
                                        className: "flex items-center gap-2",
                                        children: [(0, i.jsx)(h.Z, {
                                            platform: Q.platform,
                                            name: Q.extUserName,
                                            imgSrc: Q.extUserPictureLink
                                        }), (0, i.jsx)("div", {
                                            className: "text-foreground text-xs",
                                            children: Q.extUserName
                                        })]
                                    })
                                })]
                            }), (0, i.jsx)(g.cN, {
                                className: "sm:justify-end",
                                children: (0, i.jsx)(g.GG, {
                                    asChild: !0,
                                    children: (0, i.jsx)(o.zx, {
                                        type: "button",
                                        variant: "destructive",
                                        onClick: async () => {
                                            Q && (await q(Q), await V(), (0, u.B)("social_connection.account_list.delete", {
                                                plan: P,
                                                platform: Q.platform
                                            }), o.Am.success(K("social_account_removed")), await k())
                                        },
                                        children: K("confirm_and_delete")
                                    })
                                })
                            })]
                        })
                    })]
                })
            }
        },
        32945: function(A, e, t) {
            "use strict";
            t.d(e, {
                r: function() {
                    return a
                }
            });
            var i = t(30815),
                n = t(83286),
                o = t(59511),
                l = t(49362),
                r = t(2871);

            function a(A) {
                var {
                    upsellDesc: e
                } = A, t = (0, n._)(A, ["upsellDesc"]);
                let {
                    openUpsellWindow: a
                } = (0, r.w)(), {
                    featureOn: s
                } = (0, l.O)(t), c = (0, o.Z)(A => !s && (a((0, i._)({
                    ads: "background"
                }, e, A)), !0));
                return {
                    featureOn: s,
                    showFlag: !s,
                    openUpsellWindow: a,
                    trigger: c
                }
            }
        },
        72325: function(A, e, t) {
            "use strict";
            t.d(e, {
                p: function() {
                    return c
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(96577),
                l = t.n(o),
                r = t(2784),
                a = t(98614),
                s = t(10123);
            let c = A => {
                let {
                    src: e,
                    badge: t,
                    className: o,
                    text: c,
                    boxClassName: u,
                    badgeClassName: d,
                    cover: g = !1,
                    thumbnailRef: p
                } = A, {
                    t: f
                } = (0, a.$G)("common"), [m, h] = (0, r.useState)(!1), v = (0, r.useMemo)(() => t ? (Array.isArray(t) ? t : [t]).filter(Boolean).map(A => "string" == typeof A ? {
                    text: A,
                    variant: "secondary"
                } : A) : [], [t]), x = e && !m;
                return (0, i.jsxs)("div", {
                    className: (0, s.cn)("relative", o),
                    children: [(0, i.jsx)("div", {
                        className: (0, s.cn)("relative w-full h-full", u),
                        children: (0, i.jsx)(n.oM, {
                            ratio: 16 / 9,
                            children: x ? (0, i.jsx)(l(), {
                                ref: p,
                                className: (0, s.cn)("rounded-xl", g ? "object-cover" : "object-contain"),
                                alt: "thumbnail",
                                src: e,
                                fill: !0,
                                onError: () => h(!0)
                            }) : (0, i.jsxs)(n.ZT, {
                                variant: "headings",
                                className: "text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs w-full text-center",
                                children: [c, "(", f("failed_to_load_thumbnail"), ")"]
                            })
                        })
                    }), (0, i.jsx)("div", {
                        className: (0, s.cn)("absolute left-2 top-2 flex flex-row space-x-1", 0 === v.length && "hidden", d),
                        children: v.map((A, e) => (0, i.jsx)(n.Ct, {
                            variant: A.variant,
                            className: A.className,
                            children: A.text
                        }, e))
                    })]
                })
            }
        },
        24505: function(A, e, t) {
            "use strict";
            t.d(e, {
                k: function() {
                    return x
                }
            });
            var i = t(52322),
                n = t(752),
                o = t(25237),
                l = t.n(o),
                r = t(80584),
                a = t(89671),
                s = t(10123),
                c = t(34411),
                u = t(80629);
            let d = l()(() => t.e(8750).then(t.bind(t, 98750)), {
                    loadableGenerated: {
                        webpack: () => [98750]
                    },
                    ssr: !1
                }),
                g = l()(() => Promise.all([t.e(84), t.e(2811)]).then(t.bind(t, 12811)), {
                    loadableGenerated: {
                        webpack: () => [12811]
                    },
                    ssr: !1
                }),
                p = l()(() => Promise.all([t.e(84), t.e(5808)]).then(t.bind(t, 55808)), {
                    loadableGenerated: {
                        webpack: () => [55808]
                    },
                    ssr: !1
                }),
                f = l()(() => t.e(2881).then(t.bind(t, 62881)), {
                    loadableGenerated: {
                        webpack: () => [62881]
                    },
                    ssr: !1
                }),
                m = l()(() => Promise.all([t.e(84), t.e(388), t.e(9315), t.e(328)]).then(t.bind(t, 50328)), {
                    loadableGenerated: {
                        webpack: () => [50328]
                    },
                    ssr: !1
                }),
                h = l()(() => Promise.all([t.e(84), t.e(8913), t.e(2884)]).then(t.bind(t, 12884)), {
                    loadableGenerated: {
                        webpack: () => [12884]
                    },
                    ssr: !1
                }),
                v = l()(() => Promise.all([t.e(7412), t.e(84), t.e(6042), t.e(9664)]).then(t.bind(t, 49664)), {
                    loadableGenerated: {
                        webpack: () => [49664]
                    },
                    ssr: !1
                }),
                x = A => {
                    let {
                        configContent: e = !0,
                        configStyle: t = !0,
                        configReframe: o = !1,
                        configBroll: l = !1,
                        configVoiceover: x = !1,
                        configEnhancement: C = !1,
                        saveSettings: K = !0,
                        className: b,
                        inDialog: y = !1
                    } = A, w = (0, n.Dv)(u.a.currentOrgAsset), B = null == w ? void 0 : w.plan, [U, F] = (0, a.Ek)("starter-old-copilot");
                    return (0, i.jsx)(c.yY, {
                        version: "LEGACY",
                        children: (0, i.jsx)("div", {
                            className: (0, s.cn)("mt-6 pb-[164px] ease-out max-sm:mx-4 sm:mx-0", ("FreePlan" === B || "FreeTrial" === B) && "opacity-40 transition-opacity duration-300 hover:opacity-100", b),
                            children: (0, i.jsx)("div", {
                                className: (0, s.cn)("flex flex-col items-center gap-y-10"),
                                children: F ? (0, i.jsx)(r.Z, {}) : (0, i.jsxs)(i.Fragment, {
                                    children: [e && (0, i.jsx)(g, {}), t && (0, i.jsx)(m, {
                                        enableBrandTemplate: "FreePlan" !== B || U,
                                        inDialog: y,
                                        autoLayout: !K
                                    }), o && (0, i.jsx)(p, {}), l && (0, i.jsx)(d, {}), x && (0, i.jsx)(h, {}), C && (0, i.jsx)(v, {}), K && (0, i.jsx)(f, {}), !y && (0, i.jsx)("div", {
                                        className: "fixed inset-x-0 bottom-0 h-16 max-sm:hidden",
                                        style: {
                                            background: "linear-gradient(180deg, rgba(9, 9, 11, 0.00) 0%, #09090B 76%, #09090B 100%)"
                                        }
                                    })]
                                })
                            })
                        })
                    })
                }
        },
        39411: function(A, e, t) {
            "use strict";
            t.d(e, {
                kF: function() {
                    return u.k
                },
                aB: function() {
                    return ee
                },
                w$: function() {
                    return A_
                },
                wF: function() {
                    return Az
                },
                pl: function() {
                    return T.p
                },
                zj: function() {
                    return AN
                }
            });
            var i, n, o, l, r, a, s, c, u = t(24505),
                d = t(52322),
                g = t(57992),
                p = t(96577),
                f = t.n(p),
                m = t(2784),
                h = t(98614),
                v = t(55975),
                x = t(89671),
                C = t(59511),
                K = t(10123),
                b = t(30933),
                y = t(98231),
                w = t(28281),
                B = t(63453),
                U = t(30815),
                F = t(4670),
                I = t(5145),
                E = t(752),
                Q = t(38220),
                j = t(66836),
                S = t(2871),
                L = t(80629),
                R = t(13243),
                k = t(89640),
                q = t(10313);
            let O = () => {
                let A = (0, E.Dv)(R.T.totalCreditInSecond),
                    e = (0, E.Dv)(k.E2.currentCreditToConsume),
                    t = (0, m.useMemo)(() => A ? (0, q.f$)(A) : 0, [A]);
                return {
                    isCreditsInsufficient: t < e,
                    remainingCredit: t - e
                }
            };
            var D = t(35120),
                P = t(80584),
                N = t(91381),
                Z = t(44724),
                M = t(46899),
                V = t(56538),
                T = t(72325);
            let Y = A => {
                let {
                    src: e,
                    resolution: t,
                    title: i,
                    className: n
                } = A;
                return e ? (0, d.jsx)("div", {
                    className: (0, K.cn)("relative flex flex-col gap-4 items-center justify-center self-center w-[268px]", n),
                    children: (0, d.jsx)(T.p, {
                        src: e,
                        text: i,
                        badge: "-" === t ? void 0 : t,
                        className: "w-full"
                    })
                }) : null
            };
            var H = t(82561);
            let _ = m.forwardRef((A, e) => {
                let {
                    onClick: t,
                    loading: i,
                    isSticky: n = !1,
                    title: o = "",
                    className: l,
                    containerClassName: r,
                    disabled: a = !1
                } = A, {
                    t: s
                } = (0, h.$G)("clip"), c = (0, E.Dv)(H.g.topBannersHeight);
                o || (o = s("click_to_clip"));
                let u = async () => {
                    await (null == t ? void 0 : t())
                };
                return (0, d.jsx)("div", {
                    className: (0, K.cn)("flex flex-row justify-center items-center bg-background transform-gpu transition-all duration-300 translate-y-0", n ? "fixed h-[56px] z-10 pb-2 left-4 right-4" : "relative h-12", r),
                    ref: e,
                    style: n ? {
                        top: "".concat(c + 60, "px")
                    } : {},
                    children: (0, d.jsx)(g.zx, {
                        "aria-label": o,
                        size: "xlg",
                        className: (0, K.cn)("w-full font-semibold text-base", l, n && "sm:w-[464px]"),
                        onClick: u,
                        loading: i,
                        disabled: i || a,
                        children: o
                    })
                })
            });
            _.displayName = "SubmitButton";
            var W = t(25237),
                G = t.n(W),
                J = t(33414),
                z = t(89802),
                X = t(50480),
                $ = t(82469),
                AA = t(3093),
                Ae = t(42180);
            let At = (A, e) => {
                let [t, i] = (0, m.useState)(!1), {
                    checkYoutubeOwner: n
                } = (0, J.Z)(), {
                    enableYtbOauth: o
                } = (0, b.H)(), l = (0, C.Z)(async () => (await n({
                    videoUri: e
                })).data), r = (0, m.useMemo)(() => A && o && !!e, [A, e, o]), {
                    data: a,
                    refetch: s
                } = (0, Ae.a)({
                    queryKey: ["checkYoutubeOwner", e],
                    queryFn: l,
                    enabled: r,
                    refetchOnWindowFocus: !1,
                    staleTime: 0
                }), c = (0, m.useMemo)(() => r && (null == a ? void 0 : a.hasAccess) === !1, [r, a]);
                return {
                    open: t,
                    setOpen: i,
                    channelDetail: null == a ? void 0 : a.channelDetail,
                    checkOwnership: s,
                    shouldOauth: c,
                    shouldRedirect: o
                }
            };
            var Ai = t(8667),
                An = t(27036),
                Ao = () => {
                    let A = (0, E.Dv)(An.E.upsellWindowDescription),
                        e = (0, Ai.Z)(A),
                        [t, i] = (0, m.useState)(!1);
                    return (0, m.useEffect)(() => {
                        e && !A && i(!0)
                    }, [e, A]), (0, d.jsx)(g.Vq, {
                        open: t,
                        title: "Upgrade now to unlock your bonus",
                        description: "Limited time offer for new users.",
                        classNames: {
                            content: "font-sans sm:w-[462px]",
                            title: "text-lg font-semibold text-primary"
                        },
                        confirmText: "Upgrade for a discount",
                        onConfirm: () => {
                            window.location.href = "/dashboard?modal=upsell&coupon_code=STARTER_DISCOUNT"
                        },
                        onCancel: () => {
                            i(!1)
                        },
                        children: (0, d.jsxs)("div", {
                            className: "text-background mb-5 flex w-full flex-col bg-[url('https://public.cdn.opus.pro/clip-web/images/common/discount-tag.png')] bg-contain bg-center bg-no-repeat px-10 py-5",
                            children: [(0, d.jsx)("div", {
                                className: "text-4xl font-semibold leading-none",
                                children: "40% OFF"
                            }), (0, d.jsx)("div", {
                                className: "mt-2 text-lg font-semibold leading-none",
                                children: "Starter Plan (First month)"
                            })]
                        })
                    })
                },
                Al = t(89870),
                Ar = t(9082),
                Aa = t(25933),
                As = t(67423),
                Ac = t(70733),
                Au = t(59451);
            let Ad = A => {
                    let {
                        onDrop: e,
                        isLoading: t
                    } = A, [i, n] = (0, m.useState)(!1);
                    return {
                        isDragging: i,
                        setIsDragging: n,
                        handleDragEvents: A => {
                            if (A.preventDefault(), A.target === A.currentTarget && !t) switch (A.type) {
                                case "dragenter":
                                    n(!0);
                                    break;
                                case "dragleave":
                                    n(!1);
                                    break;
                                case "drop":
                                    {
                                        n(!1);
                                        let t = A.dataTransfer.files;null == e || e(t)
                                    }
                            }
                        }
                    }
                },
                Ag = () => {
                    var A, e, t, i, n;
                    let {
                        t: o
                    } = (0, h.$G)("clip"), l = (0, E.Dv)(k.E2.renderPreference), r = (0, E.Dv)(R.T.featureQuota);
                    if (null === (A = l.quickstartConfig) || void 0 === A ? void 0 : A.enableBRoll) {
                        let A = (null === (n = l.quickstartConfig) || void 0 === n ? void 0 : null === (i = n.bRollParams) || void 0 === i ? void 0 : i.type) === "stock" ? null == r ? void 0 : r.genStockBroll : null == r ? void 0 : r.genAIBroll;
                        return {
                            quotaData: A,
                            tooltipContent: o("quotadata_per_day", {
                                total: null == A ? void 0 : A.total
                            })
                        }
                    }
                    if (null === (e = l.quickstartConfig) || void 0 === e ? void 0 : e.enableVoiceover) {
                        let A = null == r ? void 0 : r.voiceover;
                        return {
                            quotaData: A,
                            tooltipContent: o("voice_over_generations", {
                                total: null == A ? void 0 : A.total
                            })
                        }
                    }
                    if (null === (t = l.quickstartConfig) || void 0 === t ? void 0 : t.enableVoiceEnhancement) {
                        let A = null == r ? void 0 : r.voiceoverEnhancement;
                        return {
                            quotaData: A,
                            tooltipContent: o("speech_generations", {
                                total: null == A ? void 0 : A.total
                            })
                        }
                    }
                    return {
                        quotaData: null,
                        tooltipContent: ""
                    }
                };
            var Ap = t(72800),
                Af = t(35625),
                Am = t(17212),
                Ah = t(45340),
                Av = t(77985),
                Ax = t(79584);
            let AC = m.forwardRef((A, e) => {
                    let {
                        className: t,
                        disabled: i,
                        onDrag: n,
                        onSuccess: o,
                        onCancel: l
                    } = A, {
                        t: r
                    } = (0, h.$G)("clip"), {
                        createUploadLink: a
                    } = (0, Av.Z)(), [s, c] = (0, m.useState)(!1), [u, p] = (0, m.useState)(null), [f, x] = (0, m.useState)(0), [b, y] = (0, m.useState)(null), w = (0, C.Z)(A => {
                        if (!("text/srt" === A.type || "application/x-subrip" === A.type || A.name.toLowerCase().endsWith(".srt"))) return g.Am.warning(r("srt_file_type_error")), !1;
                        if (A.size > 10485760) {
                            let A = r("srt_size_exceeds_limit", {
                                maxSizeMb: 10
                            });
                            return g.Am.warning(A), !1
                        }
                        return !0
                    }), B = (0, C.Z)(async (A, e) => {
                        try {
                            c(!0), p(A);
                            let {
                                url: t,
                                uploadId: i
                            } = await a({
                                type: "Upload",
                                usecase: "LocalUploadSRT"
                            });
                            y(i), (0, v.B)("user.srt.upload", {
                                type: "start",
                                file_format: "srt",
                                file_size: A.size,
                                upload_type: e
                            }, {
                                platform: {
                                    MP: !0,
                                    SS: !0
                                }
                            });
                            let n = {
                                    duration: 0,
                                    size: A.size,
                                    name: A.name,
                                    type: A.type,
                                    url: i
                                },
                                l = Ax.E.getInstanceWithUploadId(i);
                            await l.uploadFile(A, t, {
                                onProgress: A => {
                                    let {
                                        percent: e
                                    } = A;
                                    x(e)
                                }
                            }), (0, v.B)("user.srt.upload", {
                                type: "success",
                                file_format: "srt",
                                file_size: A.size,
                                upload_type: e
                            }, {
                                platform: {
                                    MP: !0,
                                    SS: !0
                                }
                            }), await (null == o ? void 0 : o(n)), c(!1), Ax.E.removeInstance(i)
                        } catch (i) {
                            let t = i.message;
                            g.Am.warning(t), (0, v.B)("user.srt.upload", {
                                type: "fail",
                                message: t,
                                file_size: null == A ? void 0 : A.size,
                                upload_type: e,
                                file_format: "srt"
                            }, {
                                platform: {
                                    MP: !0,
                                    SS: !0
                                }
                            }), U()
                        }
                    }), U = (0, C.Z)(() => {
                        c(!1), p(null), x(0), y(null)
                    });
                    (0, m.useImperativeHandle)(e, () => ({
                        uploadId: b,
                        handleTriggerUpload: B,
                        handleBeforeUpload: w,
                        resetUpload: U
                    }), [B, U, w, b]);
                    let F = (0, m.useMemo)(() => s ? f < .1 ? "0" : f.toFixed(1) : "100", [f, s]),
                        I = (0, m.useMemo)(() => s || i, [s, i]),
                        E = (0, m.useMemo)(() => s ? (0, d.jsxs)("div", {
                            className: "flex w-full items-center gap-2",
                            children: [(0, d.jsx)(Am.Z, {
                                className: "animate-spin"
                            }), (0, d.jsx)("div", {
                                className: "flex w-full items-center gap-2",
                                children: (0, d.jsxs)("div", {
                                    className: "flex items-center gap-1",
                                    children: [(0, d.jsx)("div", {
                                        className: "max-w-[150px] truncate",
                                        children: null == u ? void 0 : u.name
                                    }), (0, d.jsxs)("div", {
                                        children: [" - ", F, "%"]
                                    })]
                                })
                            })]
                        }) : u ? (0, d.jsxs)("div", {
                            className: "flex w-full items-end gap-2",
                            children: [(0, d.jsx)("span", {
                                className: "max-w-[150px] truncate text-primary",
                                children: null == u ? void 0 : u.name
                            }), (0, d.jsx)(Ah.Z, {
                                className: "size-4 cursor-pointer",
                                onClick: A => {
                                    A.stopPropagation(), U(), null == l || l()
                                }
                            })]
                        }) : (0, d.jsx)("span", {
                            className: "underline",
                            children: r("upload_srt_optional")
                        }), [s, u, F, U, l, r]);
                    return (0, d.jsx)(g.gq.Dragger, {
                        beforeUpload: A => Promise.resolve(w(A)),
                        customRequest: A => B(A, "select"),
                        multiple: !1,
                        accept: ".srt,text/srt,application/x-subrip,text/plain,application/octet-stream",
                        disabled: I,
                        className: (0, K.cn)("p-0 border-none text-muted-foreground flex-shrink-0", t),
                        onDrag: n,
                        children: (0, d.jsx)(g.u, {
                            content: I ? null : null == u ? void 0 : u.name,
                            portal: !0,
                            disableHoverableContent: !0,
                            sideOffset: 8,
                            side: "top",
                            onClick: A => A.stopPropagation(),
                            children: (0, d.jsx)("div", {
                                className: "text-sm",
                                children: E
                            })
                        })
                    })
                }),
                AK = A => {
                    let {
                        loading: e,
                        seed: t,
                        preflightData: i,
                        warning: n,
                        hint: o,
                        showSubmitBtn: l = !0,
                        showLangSelection: r = !0,
                        className: a,
                        onReferenceChange: s,
                        onReset: c,
                        onSubmit: u,
                        children: p,
                        submitButtonDisabled: f,
                        workflow: x = "normal"
                    } = A, {
                        t: b
                    } = (0, h.$G)("clip"), I = (null == t ? void 0 : t.type) === "local", Q = (0, E.Dv)(k.E2.preferenceModel), S = (0, E.Dv)(k.E2.preferenceRanges), L = (0, E.Dv)(k.E2.renderPreference), R = (0, w.vy)(x), [q] = (0, j.Lg)(), [O, D] = (0, m.useState)({
                        videoLanguage: i.videoLanguage,
                        translationLanguage: i.translationLanguage
                    }), P = (0, m.useRef)(null), [N, Z] = (0, m.useState)(!1), M = (0, C.Z)(() => {
                        window.confirm(b("changes_not_saved")) && (T(), (0, v.B)("user.preflight.remove", {
                            trigger: "workflow"
                        }), c())
                    }), {
                        isUploading: V,
                        handleCancelUpload: T
                    } = (0, B.L)({
                        onCancel: c
                    }), [H, {
                        entry: W
                    }] = (0, Aa.S)(), G = !(null == W ? void 0 : W.isIntersecting), J = (0, m.useMemo)(() => ({
                        sourceLang: O.videoLanguage,
                        targetLang: O.translationLanguage
                    }), [O]);
                    (0, m.useEffect)(() => {
                        null == s || s(J)
                    }, [J, s]);
                    let z = (0, m.useMemo)(() => (function(A, e) {
                            let t = e ? e[1] - e[0] : A;
                            return Math.trunc(Math.max(Math.min(A, t), 60))
                        })(i.duration, S), [i.duration, S]),
                        [X, $] = (0, m.useState)("translation"),
                        {
                            pollUploadProgress: AA
                        } = (0, Ap.V8)(),
                        {
                            quotaData: Ae,
                            tooltipContent: At
                        } = Ag(),
                        Ai = (0, m.useMemo)(() => {
                            var A, e;
                            return (null === (A = L.quickstartConfig) || void 0 === A ? void 0 : A.enableVoiceover) || !q && (null === (e = L.quickstartConfig) || void 0 === e ? void 0 : e.enableBRoll) ? b("quota_need") : b("credit_usage")
                        }, [L.quickstartConfig, q, b]),
                        An = (0, m.useMemo)(() => {
                            var A, e, t, i, n, o, l;
                            if ("ClipAnything" === Q) {
                                let A = {
                                    textFunc: (A, e) => "".concat(b("credit_equal", {
                                        credit: A.toLocaleString(),
                                        count: A
                                    }), " = ").concat(b("video_equal", {
                                        realMin: e.toLocaleString(),
                                        count: e
                                    }))
                                };
                                return (0, d.jsx)(Ab, {
                                    originalMultiplier: A.originalMultiplier,
                                    seconds: z,
                                    currentMultiplier: 1,
                                    tooltip: A.textFunc
                                })
                            }
                            if ((null === (A = L.quickstartConfig) || void 0 === A ? void 0 : A.enableVoiceover) || !q && (null === (e = L.quickstartConfig) || void 0 === e ? void 0 : e.enableBRoll)) return (0, d.jsxs)("div", {
                                className: "flex flex-row items-center space-x-2",
                                children: [(0, d.jsx)(g.ZT, {
                                    variant: "headings",
                                    className: "flex flex-row items-center space-x-1 text-nowrap text-sm ",
                                    children: (null == Ae ? void 0 : Ae.hasLimit) ? null == Ae ? void 0 : Ae.remain : b("unlimited")
                                }), (null == Ae ? void 0 : Ae.hasLimit) && (0, d.jsx)(g.u, {
                                    content: At,
                                    align: "center",
                                    side: "top",
                                    children: (0, d.jsx)(Al.Z, {
                                        className: "text-muted-foreground"
                                    })
                                })]
                            });
                            let r = q && (null === (t = L.quickstartConfig) || void 0 === t ? void 0 : t.enableBRoll) && null !== (l = null == L ? void 0 : null === (n = L.quickstartConfig) || void 0 === n ? void 0 : null === (i = n.bRollParams) || void 0 === i ? void 0 : i.maxNumber) && void 0 !== l ? l : 0,
                                a = (null === (o = L.quickstartConfig) || void 0 === o ? void 0 : o.enableBRoll) ? "1 credit per video processing minute, plus 1 credit for each B-Roll. Credits are charged based on actual usage." : (A, e) => "".concat(b("credit_equal", {
                                    credit: A.toLocaleString(),
                                    count: A
                                }), " = ").concat(b("video_equal", {
                                    realMin: e.toLocaleString(),
                                    count: e
                                }));
                            return (0, d.jsx)(Ab, {
                                seconds: z,
                                extraCredits: r,
                                tooltip: a
                            })
                        }, [Q, Ae, At, z, null == L ? void 0 : L.quickstartConfig, q, b]),
                        Ao = (0, m.useMemo)(() => {
                            var A, e, i;
                            return (null == t ? void 0 : t.type) === "local" ? null == t ? void 0 : null === (A = t.file) || void 0 === A ? void 0 : A.name : (null == t ? void 0 : t.type) === "thirdPartyFile" ? null == t ? void 0 : null === (i = t.file) || void 0 === i ? void 0 : null === (e = i.file) || void 0 === e ? void 0 : e.name : null == t ? void 0 : t.url
                        }, [t]),
                        As = (0, C.Z)(A => {
                            D(e => (0, U._)({}, e, A))
                        }),
                        {
                            isDragging: Am,
                            setIsDragging: Ah,
                            handleDragEvents: Av
                        } = Ad({
                            onDrop: A => {
                                var e, t;
                                A[0] && (null === (e = P.current) || void 0 === e ? void 0 : e.handleBeforeUpload(A[0])) && (null === (t = P.current) || void 0 === t || t.handleTriggerUpload(A[0], "drag"))
                            }
                        }),
                        Ax = (0, C.Z)(() => {
                            Z(!1), null == s || s(J)
                        }),
                        AK = async A => {
                            let e = (0, y.cT)(t);
                            if (e) {
                                var i, n;
                                try {
                                    let {
                                        srtUploadId: t
                                    } = await AA({
                                        url: e.videoUrl,
                                        count: Ap.vu,
                                        srtUploadId: A.url
                                    });
                                    null == s || s((0, F._)((0, U._)({}, J), {
                                        srtUploadId: t
                                    })), (null === (i = P.current) || void 0 === i ? void 0 : i.uploadId) && Z(!0)
                                } catch (A) {
                                    null === (n = P.current) || void 0 === n || n.resetUpload(), Ax(), g.Am.warning((0, d.jsxs)("div", {
                                        children: [null == A ? void 0 : A.message, (0, d.jsx)("span", {
                                            className: "ml-1 underline text-primary cursor-pointer",
                                            onClick: () => {
                                                window.open("https://help.opus.pro/docs/article/upload-own-srt", "_blank")
                                            },
                                            children: b("common:learn_more")
                                        })]
                                    }))
                                }
                            }
                        },
                        Ay = (0, d.jsx)(d.Fragment, {
                            children: r && (0, d.jsx)(Au.QZ, {
                                label: (0, d.jsx)(g.ZT, {
                                    className: "mr-1 text-nowrap text-sm font-normal",
                                    children: R ? b("speech_lang_trans") : b("speech_language")
                                }),
                                expectedLanguage: O,
                                onUpdateExpectedLanguage: As
                            })
                        }),
                        Aw = (0, d.jsx)(AC, {
                            ref: P,
                            onDrag: A => A && Ah(!0),
                            onSuccess: AK,
                            onCancel: Ax
                        }),
                        AB = (0, d.jsxs)("div", {
                            className: (0, K.cn)("flex flex-row items-center gap-x-1 max-sm:flex-1 max-sm:justify-center", R && "justify-center"),
                            children: [(0, d.jsx)(g.ZT, {
                                variant: "headings",
                                className: "text-muted-foreground text-nowrap text-sm font-normal",
                                children: Ai
                            }), An]
                        }),
                        AU = [r && {
                            title: "Translation",
                            value: "translation",
                            children: Ay
                        }].filter(A => !!A),
                        AF = (0, d.jsxs)("div", {
                            className: "flex flex-col gap-5",
                            children: [AU.length > 0 && (0, d.jsxs)(g.mQ, {
                                value: X,
                                onValueChange: A => $(A),
                                children: [(0, d.jsx)(g.dr, {
                                    className: "bg-popover rounded-b-none",
                                    children: AU.map(A => (0, d.jsx)(g.SP, {
                                        className: "data-[state=active]:bg-popover",
                                        value: A.value,
                                        children: (0, d.jsx)("div", {
                                            children: A.title
                                        })
                                    }, A.value))
                                }), AU.map(A => (0, d.jsx)(g.nU, {
                                    className: "bg-popover mt-0 rounded-lg rounded-tl-none p-4",
                                    value: A.value,
                                    children: (0, d.jsx)("div", {
                                        children: A.children
                                    })
                                }, A.value))]
                            }), AB, p, o && (0, d.jsx)(g.ZT, {
                                className: "text-muted-foreground mt-10 break-words text-left text-sm font-normal opacity-50",
                                children: o
                            })]
                        });
                    return R ? AF : (0, d.jsxs)("div", {
                        className: (0, K.cn)("relative flex flex-col gap-4 justify-center self-center pt-[66px] w-full sm:w-[530px] max-w-full", a),
                        children: [(0, d.jsxs)("div", {
                            onDragEnter: Av,
                            onDragLeave: Av,
                            onDragOver: Av,
                            onDrop: Av,
                            className: "relative py-4 px-6",
                            children: [(0, d.jsxs)("div", {
                                className: (0, K.cn)("flex flex-col gap-4", Am && "pointer-events-none"),
                                children: [(0, d.jsx)("div", {
                                    className: "flex flex-col rounded-md pt-4",
                                    children: (0, d.jsxs)("div", {
                                        className: "border-border bg-background flex items-center justify-between rounded-md border p-2 px-4",
                                        children: [(0, d.jsx)(g.II, {
                                            "aria-label": Ao,
                                            className: "placeholder:text-primary flex-1 items-center text-ellipsis border-none bg-inherit px-0 font-sans focus-visible:ring-0 disabled:opacity-100",
                                            prefix: I ? (0, d.jsx)(Ac.i, {
                                                animate: V,
                                                containerClassName: "mr-2 sm:mr-3"
                                            }) : (0, d.jsx)(Ar.Z, {
                                                className: "text-primary mr-2 sm:mr-3"
                                            }),
                                            value: Ao,
                                            disabled: !0
                                        }), I && V ? (0, d.jsx)(Af.G, {
                                            triggerClassName: "text-muted-foreground underline ml-4",
                                            onCancel: T
                                        }) : (0, d.jsx)(g.zx, {
                                            variant: "link",
                                            className: "text-muted-foreground hover:text-foreground text-nowrap bg-transparent pr-0 text-sm font-normal underline",
                                            onClick: M,
                                            children: b("remove")
                                        })]
                                    })
                                }), W && l && (0, d.jsx)(_, {
                                    loading: e,
                                    onClick: u,
                                    isSticky: G,
                                    disabled: f
                                }), (0, d.jsx)("div", {
                                    className: "relative top-2 -mt-4 h-0",
                                    ref: H
                                }), n, (0, d.jsxs)("div", {
                                    className: (0, K.cn)("flex flex-nowrap max-sm:flex-wrap items-center sm:gap-x-6 justify-center", R && "flex-col"),
                                    children: [!N && Ay, Aw, AB]
                                })]
                            }), Am && (0, d.jsx)("div", {
                                className: "border-muted bg-popover pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border",
                                children: (0, d.jsx)("div", {
                                    className: "text-center text-sm",
                                    children: b("srt_upload_darg_tip")
                                })
                            })]
                        }), (null == i ? void 0 : i.thumbnailUrl) && (0, d.jsx)(Y, {
                            title: i.title,
                            src: i.thumbnailUrl,
                            resolution: i.resolution
                        }), o && (0, d.jsx)(g.ZT, {
                            className: "text-muted-foreground break-words text-center text-sm font-normal",
                            children: o
                        }), p]
                    })
                },
                Ab = A => {
                    let {
                        seconds: e,
                        extraCredits: t = 0,
                        tooltipLink: i,
                        tooltip: n,
                        originalMultiplier: o,
                        currentMultiplier: l = 1
                    } = A, r = (0, E.b9)(k.E2.currentCreditToConsume), a = (0, m.useMemo)(() => Math.floor((0, q.f$)(e) * l), [e, l]), s = (0, m.useMemo)(() => (0, q.f$)(e), [e]), c = (0, m.useMemo)(() => void 0 !== o && o > l ? Math.floor((0, q.f$)(e) * o) : void 0, [e, o, l]), u = (0, m.useMemo)(() => {
                        let A = "function" == typeof n ? n(a, s) : n,
                            e = (null == i ? void 0 : i.text) ? (0, d.jsx)(g.ZT, {
                                className: "text-primary-foreground text-xs underline ".concat("suffix" === i.type ? "ml-1" : "mr-1", " cursor-pointer"),
                                onClick: () => {
                                    window.open("https://help.opus.pro/docs/article/how-are-credits-consumed#how-are-credits-consumed", "_blank")
                                },
                                children: i.text
                            }) : null;
                        return (0, d.jsxs)("div", {
                            className: "flex w-full flex-row",
                            children: [(null == i ? void 0 : i.type) === "prefix" && e, (0, d.jsx)(g.ZT, {
                                className: "text-primary-foreground text-xs",
                                children: A
                            }), (null == i ? void 0 : i.type) === "suffix" && e]
                        })
                    }, [n, i, a, s]);
                    return (0, m.useEffect)(() => {
                        r(a + t)
                    }, [a, t, r]), (0, d.jsxs)("div", {
                        className: "flex flex-row items-center space-x-2",
                        children: [(0, d.jsx)(As.Z, {
                            originalCredit: c,
                            credit: a + t
                        }), (0, d.jsx)(g.u, {
                            className: "max-w-lg",
                            content: u,
                            align: "center",
                            side: "top",
                            children: (0, d.jsx)(Al.Z, {
                                className: "text-muted-foreground"
                            })
                        })]
                    })
                };
            var Ay = t(95318);
            let Aw = ["title", "titleId"];

            function AB() {
                return (AB = Object.assign ? Object.assign.bind() : function(A) {
                    for (var e = 1; e < arguments.length; e++) {
                        var t = arguments[e];
                        for (var i in t)({}).hasOwnProperty.call(t, i) && (A[i] = t[i])
                    }
                    return A
                }).apply(null, arguments)
            }
            let AU = (0, m.forwardRef)((A, e) => {
                let {
                    title: t,
                    titleId: u
                } = A, d = function(A, e) {
                    if (null == A) return {};
                    var t, i, n = function(A, e) {
                        if (null == A) return {};
                        var t = {};
                        for (var i in A)
                            if (({}).hasOwnProperty.call(A, i)) {
                                if (e.indexOf(i) >= 0) continue;
                                t[i] = A[i]
                            }
                        return t
                    }(A, e);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(A);
                        for (i = 0; i < o.length; i++) t = o[i], e.indexOf(t) >= 0 || ({}).propertyIsEnumerable.call(A, t) && (n[t] = A[t])
                    }
                    return n
                }(A, Aw);
                return m.createElement("svg", AB({
                    width: 150,
                    height: 36,
                    viewBox: "0 0 150 36",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    ref: e,
                    "aria-labelledby": u
                }, d), t ? m.createElement("title", {
                    id: u
                }, t) : null, i || (i = m.createElement("path", {
                    d: "M0 15.4163C0 8.22011 5.38102 2.9082 12.6463 2.9082C19.9116 2.9082 25.1913 8.22011 25.1913 15.4163C25.1913 22.6125 19.8103 27.9244 12.6463 27.9244C5.48237 27.9244 0 22.6125 0 15.4163ZM12.6463 23.2068C16.7005 23.2068 19.6674 19.8897 19.6674 15.4163C19.6674 10.9429 16.6959 7.6258 12.6463 7.6258C8.59673 7.6258 5.55148 10.9429 5.55148 15.4163C5.55148 19.8897 8.48616 23.2068 12.6463 23.2068Z",
                    fill: "white"
                })), n || (n = m.createElement("path", {
                    d: "M28.0186 10.034H30.9671C32.1925 10.034 33.1877 11.0291 33.1877 12.2545C34.1643 10.96 36.1223 9.75293 38.1863 9.75293C43.3231 9.75293 46.783 13.2451 46.783 18.838C46.783 24.4309 43.3231 27.9231 38.1863 27.9231C36.1269 27.9231 34.1689 27.0846 33.2245 25.79V33.9997H28.0554L28.0186 10.0294V10.034ZM37.3801 23.5187C39.8586 23.5187 41.5724 21.6299 41.5724 18.8011C41.5724 15.9724 39.8586 14.1204 37.3801 14.1204C34.9015 14.1204 33.2245 16.0093 33.2245 18.8011C33.2245 21.593 34.9015 23.5187 37.3801 23.5187Z",
                    fill: "white"
                })), o || (o = m.createElement("path", {
                    d: "M49.4712 21.3592V10.0398H54.608V20.1015C54.608 22.1609 55.7967 23.4186 57.6487 23.4186C60.0582 23.4186 61.4587 21.3592 61.4587 17.6874V10.0352H66.6278V27.6432H61.4587V25.6852C60.6202 26.8048 58.63 27.9196 56.0086 27.9196C52.1663 27.9196 49.4758 25.4042 49.4758 21.35L49.4712 21.3592Z",
                    fill: "white"
                })), l || (l = m.createElement("path", {
                    d: "M69.4233 21.7019H74.035C74.2101 23.1715 75.1176 24.01 76.7946 24.01C78.1905 24.01 79.029 23.4157 79.029 22.439C79.029 19.4352 69.7366 21.5637 69.7366 14.9618C69.7366 12.064 72.183 9.75586 76.1634 9.75586C80.4618 9.75586 83.1154 11.958 83.5715 15.487H78.9599C78.6789 14.1924 77.6331 13.4277 76.1634 13.4277C75.113 13.4277 74.3483 13.8838 74.3483 14.6485C74.3483 17.4772 83.7466 15.1737 83.7466 22.2639C83.7466 25.5488 80.8442 27.926 76.7946 27.926C72.3212 27.926 69.6307 25.3046 69.4233 21.7065V21.7019Z",
                    fill: "white"
                })), r || (r = m.createElement("path", {
                    d: "M85.7739 15.4163C85.7739 7.45074 91.1549 2.9082 98.1438 2.9082C104.188 2.9082 108.519 6.68136 108.938 11.9933H103.419C103.069 9.40872 100.973 7.6258 98.1438 7.6258C94.2647 7.6258 91.33 10.3854 91.33 15.4163C91.33 20.4472 94.3016 23.2068 98.1438 23.2068C100.903 23.2068 103.069 21.3916 103.488 18.7702H109.044C108.487 23.9762 104.363 27.9244 98.1438 27.9244C91.2932 27.9244 85.7739 23.4187 85.7739 15.4163Z",
                    fill: "white"
                })), a || (a = m.createElement("path", {
                    d: "M111.661 2.9082H116.83V27.648H111.661V2.9082Z",
                    fill: "white"
                })), s || (s = m.createElement("path", {
                    d: "M123.053 2C124.836 2 126.126 3.25772 126.126 4.97154C126.126 6.68535 124.831 7.94307 123.053 7.94307C121.275 7.94307 120.012 6.68535 120.012 4.97154C120.012 3.25772 121.339 2 123.053 2ZM122.726 10.0347H125.674V27.6427H120.505V12.2553C120.505 11.0298 121.5 10.0347 122.726 10.0347Z",
                    fill: "white"
                })), c || (c = m.createElement("path", {
                    d: "M129.341 10.034H132.29C133.515 10.034 134.51 11.0291 134.51 12.2545C135.487 10.96 137.445 9.75293 139.509 9.75293C144.646 9.75293 148.106 13.2451 148.106 18.838C148.106 24.4309 144.646 27.9231 139.509 27.9231C137.45 27.9231 135.492 27.0846 134.547 25.79V33.9997H129.378L129.341 10.0294V10.034ZM138.703 23.5187C141.181 23.5187 142.895 21.6299 142.895 18.8011C142.895 15.9724 141.181 14.1204 138.703 14.1204C136.224 14.1204 134.547 16.0093 134.547 18.8011C134.547 21.593 136.224 23.5187 138.703 23.5187Z",
                    fill: "white"
                })))
            });
            t.p;
            var AF = t(9772),
                AI = t(49501),
                AE = t(82863),
                AQ = t(18566),
                Aj = t(88853),
                AS = t(15377),
                AL = t(16901),
                AR = t(60605),
                Ak = t(87558);
            async function Aq(A) {
                return fetch("https://oauth2.googleapis.com/tokeninfo?access_token=".concat(A)).then(A => A.json()).then(A => A.scope)
            }
            var AO = (0, m.memo)(A => {
                let {
                    onChange: e,
                    onPick: t,
                    disabled: i
                } = A, {
                    t: n
                } = (0, h.$G)("clip"), [o, l] = (0, m.useState)(), [r, a] = (0, m.useState)(!1), s = !(0, E.Dv)(L.a.isPaidUser), {
                    openUpsellWindow: c
                } = (0, S.w)(), u = (0, E.Dv)(Ak.K.nestApiPrefix), {
                    clipApiHeaderWrapper: p
                } = (0, AS.m)(), {
                    openPicker: f,
                    pickerApiLoaded: x
                } = (0, AR.ZP)(), K = (0, AE.Nq)({
                    flow: "auth-code",
                    scope: AR.Z0.join(" "),
                    redirect_uri: "".concat(window.location.origin, "/oauth-google-callback"),
                    ux_mode: "redirect",
                    onError: A => {
                        AQ.U6.error(A), (0, v.B)("gdrive.connect.failed", (0, U._)({}, A)), a(!1)
                    },
                    onNonOAuthError: A => {
                        AQ.U6.error(A), (0, v.B)("gdrive.connect.failed", (0, U._)({}, A)), a(!1)
                    }
                }), b = (0, Z.t)(), y = A => {
                    (0, v.B)("gdrive.picker.open", {}), f({
                        appId: "603062173391",
                        mode: google.picker.DocsViewMode.GRID,
                        setIncludeFolders: !0,
                        developerKey: "",
                        selectableMimeTypes: AL.fM.join(","),
                        token: A.accessToken,
                        customScopes: AR.Z0,
                        callbackFunction: t => {
                            if (AQ.U6.debug("GDrive callback: ", t), "cancel" === t.action)(0, v.B)("gdrive.picker.cancel", {
                                action: t.action
                            }), AQ.U6.info("User clicked cancel/close button"), a(!1);
                            else if ("picked" === t.action) {
                                a(!1);
                                let i = t.docs[0];
                                if (!i) {
                                    AQ.U6.info("No file chosen");
                                    return
                                }
                                if (AQ.U6.debug({
                                        fileChosen: i
                                    }), !(null == A ? void 0 : A.extUserId)) {
                                    AQ.U6.error("oAuthResult?.extUserId is undefined");
                                    return
                                }
                                if (!i.duration) {
                                    g.Am.warning(n("video_processing"));
                                    return
                                }(0, v.B)("gdrive.picker.file_picked", {
                                    fileChosen: i
                                }), e({
                                    file: i,
                                    sourcePlatform: "GDRIVE",
                                    openId: A.extUserId
                                })
                            }
                        }
                    })
                }, w = (0, C.Z)(async () => {
                    if ((0, AR.wq)(o)) y(o);
                    else {
                        let A;
                        try {
                            let e = await p("".concat(u, "/oauth-connections?q=mine&sourcePlatform=GDRIVE&needAccessToken=true"), {
                                method: "GET"
                            }).then(A => A.data.find(A => "GDRIVE" === A.sourcePlatform));
                            if (null == e ? void 0 : e.accessToken) {
                                let t = await Aq(e.accessToken).then(A => A.split(" "));
                                A = (0, F._)((0, U._)({}, e), {
                                    scopes: t
                                })
                            }
                        } catch (A) {
                            AQ.U6.error(A, "failed to get access token from clip-api"), (0, v.B)("gdrive.connect.attempt", {}), K();
                            return
                        }(0, AR.wq)(A) ? (l(A), y(A)) : ((0, v.B)("gdrive.connect.attempt", {}), K())
                    }
                });
                (0, m.useEffect)(() => {
                    x && r && w()
                }, [x, r, w]);
                let B = (0, C.Z)(() => {
                    if (s) {
                        c({
                            switchType: "plan",
                            trigger: "gdrive-picker",
                            ads: "background"
                        });
                        return
                    }
                    r || (a(!0), null == t || t())
                });
                return "GDRIVE" === b.query.oauth && x && (AQ.U6.info("trigger GDrive OAuth process"), b.replace({
                    query: (0, F._)((0, U._)({}, b.query), {
                        oauth: ""
                    })
                }), B()), (0, d.jsx)(g.u, {
                    portal: !0,
                    content: n("choose_a_video"),
                    disableHoverableContent: !0,
                    side: "top",
                    sideOffset: 8,
                    children: (0, d.jsxs)(g.zx, {
                        "aria-label": n("google_drive"),
                        variant: "ghost-gray",
                        className: "text-muted-foreground",
                        disabled: r || i,
                        loading: r,
                        onClick: B,
                        children: [!r && (0, d.jsx)(Aj.Z, {
                            className: "mr-2"
                        }), " ", n("google_drive")]
                    })
                })
            });
            let AD = "603062173391-vrggpc0i3sugemivsnk6l2fsn56s65m1.apps.googleusercontent.com";
            var AP = (0, m.memo)(A => {
                let {
                    onCancel: e,
                    onChange: t,
                    onPick: i,
                    disabled: n
                } = A, [o, l] = (0, m.useState)(!1), [r, a] = (0, m.useState)(), s = (0, C.Z)(A => {
                    A.stopPropagation(), a(void 0), null == e || e()
                }), c = (0, C.Z)(A => {
                    a(A), t(A)
                });
                return (0, d.jsxs)(d.Fragment, {
                    children: [!r && AD && (0, d.jsx)(AE.rg, {
                        clientId: AD,
                        onScriptLoadSuccess: () => {
                            AQ.U6.info("Google Script load successfully"), l(!0)
                        },
                        onScriptLoadError: () => {
                            AQ.U6.error("Google Script failed to load"), g.Am.warning("Google Script failed to load. To use Google Drive connector, please double check your network connection, ad block settings and try again")
                        },
                        children: (0, d.jsx)(AO, {
                            disabled: n || !o,
                            onChange: c,
                            onPick: i
                        })
                    }), r && (0, d.jsxs)("div", {
                        className: "flex w-full flex-1 flex-row items-center justify-between px-4",
                        children: [(0, d.jsx)(g.ZT, {
                            variant: "headings",
                            className: "flex-1 text-ellipsis text-sm",
                            children: r.file.name
                        }), (0, d.jsx)(g.zx, {
                            variant: "link",
                            className: "text-muted-foreground hover:text-foreground text-nowrap bg-transparent px-0 text-sm font-normal underline",
                            onClick: s,
                            children: "Cancel"
                        })]
                    })]
                })
            });
            let AN = "https://www.youtube.com/watch?v=LXvv6CbGg8A",
                AZ = A => {
                    let {
                        variant: e
                    } = A, t = (0, E.b9)(k.E2.videoSourceSeed), {
                        t: i
                    } = (0, h.$G)("clip"), n = () => {
                        t({
                            type: "url",
                            url: AN
                        })
                    };
                    return "button" === e ? (0, d.jsx)(g.zx, {
                        variant: "secondary",
                        onClick: n,
                        children: i("try_a_sample_project")
                    }) : (0, d.jsx)("div", {
                        className: "flex justify-center",
                        children: (0, d.jsx)(g.zx, {
                            variant: "secondary",
                            className: "mt-2 h-4 gap-0.5 bg-transparent py-0 hover:bg-transparent",
                            onClick: n,
                            children: (0, d.jsx)("span", {
                                className: "text-primary text-sm font-normal underline",
                                children: i("click_try_sample")
                            })
                        })
                    })
                };
            var AM = t(59216),
                AV = t(91376),
                AT = t(3172);
            let AY = A => [A("clip:youtube_link"), A("clip:rumble_link"), A("clip:zoom_link"), A("clip:twitch_link")],
                AH = A => {
                    let {
                        loading: e,
                        defaultValue: t,
                        onChange: i,
                        disabled: n,
                        className: o
                    } = A, {
                        t: l
                    } = (0, h.$G)("clip"), [r, a] = (0, m.useState)(t || ""), s = (0, E.Dv)(k.E2.thirdVideoPreflightdata), c = (0, E.Dv)(AV.D.debugMode), [u, p] = (0, E.KO)(AV.D.debugYoutubeLink), f = (0, C.Z)(A => {
                        a((null != A ? A : "").trim())
                    }), x = (0, C.Z)(() => {
                        (0, v.B)("user.preflight.remove", {
                            trigger: "dashboard"
                        }), a("")
                    });
                    (0, m.useEffect)(() => {
                        c && u && a(u)
                    }, [u, c, a]), (0, m.useEffect)(() => {
                        (null == s ? void 0 : s.errorCode) === 3 && x()
                    }, [s.errorCode, x]);
                    let b = (0, m.useRef)(null);
                    return (0, AT.c)(b, AY(l)), (0, m.useEffect)(() => {
                        i && (c && !r && p(""), i(r))
                    }, [r, i, c, p]), (0, d.jsxs)("div", {
                        className: (0, K.cn)("flex justify-between items-center border border-border rounded-md py-2 px-4 bg-background h-12 relative", o),
                        onClick: A => {
                            var e, t;
                            null !== (e = b.current) && void 0 !== e && e.contains(A.target) || null === (t = b.current) || void 0 === t || t.focus()
                        },
                        children: [(0, d.jsx)(g.II, {
                            "aria-label": l("input_url"),
                            ref: b,
                            disabled: n || e,
                            placeholder: AY(l)[0],
                            value: r,
                            className: "bg-background items-center border-none p-0 font-sans",
                            classNames: {
                                input: "pl-3 py-1 placeholder:text-muted-foreground placeholder:font-normal focus-visible:ring-0 text-ellipsis"
                            },
                            prefix: e ? (0, d.jsx)(Am.Z, {
                                className: "animate-spin"
                            }) : (0, d.jsx)(Ar.Z, {}),
                            onChange: f
                        }), r && !e && (0, d.jsx)(g.zx, {
                            variant: "link",
                            className: "text-muted-foreground hover:text-foreground text-nowrap bg-transparent pr-0 text-sm font-normal underline",
                            onClick: x,
                            children: l("remove")
                        })]
                    })
                },
                A_ = m.forwardRef((A, e) => {
                    let {
                        className: t,
                        cardClassName: i,
                        inputClassName: n,
                        onPassPreflight: o,
                        rawVideoLink: l,
                        showSample: r = !1,
                        showModelSelection: a = !1,
                        showSubmitBtn: s = !0,
                        showTitle: c = !0,
                        inputRef: u,
                        workflow: p
                    } = A, {
                        t: f
                    } = (0, h.$G)("clip"), [v, w] = (0, m.useState)(!1), U = (0, m.useRef)(null), F = (0, E.Dv)(L.a.currentOrgAsset), [I, Q] = (0, m.useState)(), j = (0, E.b9)(k.E2.preferenceRanges), R = (0, m.useRef)(!1), [q, O] = (0, m.useState)(!1), D = (0, m.useMemo)(() => "uploading" === I, [I]), P = (0, m.useMemo)(() => "picked" === I, [I]), N = null == F ? void 0 : F.plan, {
                        messageByPlan: Z
                    } = (0, AI.Jn)(N || "FreeTrial", f), [M, V, T] = (0, y.WJ)(), {
                        openUpsellWindow: Y
                    } = (0, S.w)(), {
                        enableUploadBg: H,
                        enhanceUpload: W
                    } = (0, b.H)(), {
                        preflightData: G,
                        canPassPreflight: J,
                        isPreflighting: z
                    } = (0, y.ZP)(R.current ? M : void 0, p, f), X = (0, E.b9)(k.E2.preferenceModel), $ = (0, m.useMemo)(() => z || D, [z, D]), [AA] = (0, B.b)(), [Ae] = (0, x.Ek)("clip_anything_ban");
                    (0, m.useEffect)(() => {
                        Ae && X("ClipBasic")
                    }, [Ae, X]), (0, Ay.Z)(() => {
                        z && (null == M ? void 0 : M.type) === "url" && M.url.includes("youtube.com") && g.Am.warning((0, AF.kP)(f), {
                            duration: AF.Co,
                            id: AF.hu
                        })
                    }, z ? AF.wk : void 0);
                    let At = (0, m.useCallback)(() => {
                            Q(void 0), g.Am.dismiss(AF.hu), V()
                        }, [Q, V]),
                        Ai = (0, C.Z)(A => {
                            let {
                                url: e,
                                duration: t,
                                name: i,
                                type: n,
                                size: o,
                                thumbUrl: l
                            } = A;
                            j(void 0), Q("uploading"), H && T({
                                type: "local",
                                bypass: !0,
                                url: e,
                                file: {
                                    duration: t,
                                    thumbUrl: l,
                                    name: i,
                                    type: n,
                                    size: o
                                }
                            })
                        }),
                        An = (0, C.Z)(A => {
                            H || T({
                                type: "local",
                                url: A.url,
                                file: A.raw
                            }), Q("done")
                        }),
                        {
                            isUploading: Ao,
                            upload: Al
                        } = (0, B.L)({
                            onStart: Ai,
                            onSuccess: An,
                            onError: At,
                            onCancel: At,
                            workflow: p
                        });
                    (0, m.useEffect)(() => {
                        R.current || (R.current = !0, l || V())
                    }, []);
                    let Ar = (0, m.useMemo)(() => !M && r, [r, M]),
                        Aa = (0, C.Z)(() => {
                            Y({
                                switchType: "plan",
                                trigger: "source-video-preflight",
                                ads: "background"
                            }), g.Am.dismiss()
                        });
                    (0, m.useEffect)(() => {
                        if (null == G ? void 0 : G.errorMessage) {
                            g.Am.dismiss(AF.hu);
                            let A = 1 === G.errorCode,
                                e = 2 === G.errorCode,
                                t = 3 === G.errorCode;
                            e ? g.Am.warning((0, d.jsx)("div", {
                                children: (0, d.jsx)(h.cC, {
                                    i18nKey: "clip:unsupported_links",
                                    components: [(0, d.jsx)("a", {
                                        href: "https://www.opus.pro/contact?utm=frame.io",
                                        target: "_blank",
                                        className: "text-primary mx-1 underline",
                                        rel: "noreferrer",
                                        "aria-label": "Contact us here"
                                    }, "contact-us-here")],
                                    values: {
                                        userPlan: N,
                                        enterpriseOnlyPlatforms: AI.T0.join(", ")
                                    }
                                })
                            }), {
                                duration: 1 / 0
                            }) : A ? g.Am.warning(G.errorMessage, {
                                duration: 1 / 0,
                                action: (0, d.jsx)(g.zx, {
                                    variant: "ghost",
                                    onClick: Aa,
                                    children: f("upgrade_plans")
                                })
                            }) : t ? g.Am.warning(G.errorMessage, {
                                id: G.errorMessage,
                                duration: 1 / 0
                            }) : g.Am.warning(G.errorMessage, {
                                id: G.errorMessage,
                                duration: "size" in G ? 1 / 0 : void 0
                            }), Q(void 0), V(), g.Am.dismiss(AF.hu)
                        }
                    }, [null == G ? void 0 : G.errorMessage, J]), (0, m.useEffect)(() => {
                        M && o && J && o(M)
                    }, [J, o, M]), (0, m.useEffect)(() => {
                        Ao && !H && Q("uploading")
                    }, [Ao, H]);
                    let As = (0, C.Z)(A => {
                            A ? T({
                                type: "url",
                                url: A
                            }) : At()
                        }),
                        Ac = (0, C.Z)(A => {
                            A ? (T({
                                type: "thirdPartyFile",
                                file: A
                            }), Q("picked")) : At()
                        });
                    (0, m.useImperativeHandle)(e, () => ({
                        activate: () => {
                            var A;
                            null === (A = U.current) || void 0 === A || A.scrollIntoView({
                                behavior: "smooth"
                            }), setTimeout(() => {
                                w(!0)
                            }, 200), setTimeout(() => {
                                w(!1)
                            }, 1200)
                        }
                    }));
                    let {
                        isDragging: Au,
                        setIsDragging: Ag,
                        handleDragEvents: Ap
                    } = Ad({
                        onDrop: A => {
                            A[0] && Al(A[0], "drag")
                        },
                        isLoading: $
                    }), Af = (0, m.useMemo)(() => W && P ? null : (0, d.jsx)(g.u, {
                        content: null == Z ? void 0 : Z.inputTooltip,
                        sideOffset: 8,
                        disableHoverableContent: !0,
                        open: q,
                        portal: !0,
                        onOpenChange: O,
                        children: (0, d.jsx)("div", {
                            className: (0, K.cn)("flex-1", W && "w-full"),
                            children: (0, d.jsx)(AH, {
                                defaultValue: l,
                                disabled: $ || P,
                                loading: z && (null == M ? void 0 : M.type) === "url",
                                onChange: As,
                                className: (0, K.cn)(W ? "bg-background border-transparent hover:border-popover-foreground/35 focus-within:border-popover-foreground/35" : n)
                            })
                        })
                    }), [null == Z ? void 0 : Z.inputTooltip, q, W, l, $, P, z, null == M ? void 0 : M.type, As, n]), Am = (0, m.useMemo)(() => P && !W ? null : (0, d.jsx)(AM.Z, {
                        dragger: W,
                        onDrag: A => A && Ag(!0),
                        uploadBackground: H,
                        onStart: Ai,
                        onSuccess: An,
                        onError: At,
                        onCancel: At,
                        disabled: z,
                        extraLoading: z && (null == M ? void 0 : M.type) === "local",
                        workflow: p
                    }), [W, H, At, Ai, An, Ag, P, z, null == M ? void 0 : M.type, p]);
                    return (0, d.jsxs)("div", {
                        ref: U,
                        className: (0, K.cn)("flex flex-col justify-center w-full sm:w-[496px] relative self-center gap-y-3 pt-4", t),
                        children: [(c || a) && (0, d.jsx)("div", {
                            className: "relative self-center",
                            children: c && !a && (0, d.jsx)(AU, {
                                className: "self-center"
                            })
                        }), (0, d.jsxs)("div", {
                            className: (0, K.cn)("relative flex flex-col gap-y-2 border border-transparent rounded-xl p-6 bg-popover", W && "p-0.5 bg-background", i, $ && "border-animate before:animate-bg-rotate", v && "animate-border-twinkle"),
                            onMouseEnter: () => w(!1),
                            onDragEnter: Ap,
                            onDragLeave: Ap,
                            onDragOver: Ap,
                            onDrop: Ap,
                            children: [(0, d.jsxs)("div", {
                                className: (0, K.cn)(Au && "pointer-events-none", W && "flex flex-col gap-y-4"),
                                children: [W ? Am : Af, (0, d.jsxs)("div", {
                                    className: (0, K.cn)("flex flex-row gap-x-2 items-center h-12", W && "h-auto flex-col items-start gap-y-2 sm:h-12 sm:flex-row sm:flex-between sm:items-center"),
                                    children: [W ? Af : Am, (D || (null == M ? void 0 : M.type) === "local") && !W ? null : (0, d.jsx)(AP, {
                                        disabled: z || D,
                                        onCancel: At,
                                        onChange: Ac
                                    })]
                                }), s && !W && (0, d.jsx)(_, {
                                    ref: u,
                                    disabled: $,
                                    onClick: async () => O(!0)
                                }), Ar && !W && (0, d.jsx)(AZ, {
                                    variant: "link"
                                })]
                            }), Au && (0, d.jsx)("div", {
                                className: "border-muted bg-popover pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border",
                                children: (0, d.jsx)(g.ZT, {
                                    className: "text-center text-sm",
                                    children: f("file_maximum", {
                                        maxFileSize: AA
                                    })
                                })
                            })]
                        })]
                    })
                });
            A_.displayName = "SubmitCard";
            let AW = G()(() => Promise.all([t.e(84), t.e(4776)]).then(t.bind(t, 74776)), {
                    loadableGenerated: {
                        webpack: () => [74776]
                    },
                    ssr: !1
                }),
                AG = G()(() => Promise.all([t.e(84), t.e(2735)]).then(t.bind(t, 95505)), {
                    loadableGenerated: {
                        webpack: () => [95505]
                    },
                    ssr: !1
                }),
                AJ = ["normal", "quick_normal", "caption"],
                Az = (0, m.forwardRef)((A, e) => {
                    var t, i;
                    let {
                        workflow: n = "normal",
                        className: o,
                        onSubmit: l,
                        onSubmittingChange: r,
                        smokeToast: a = !1
                    } = A, {
                        t: s
                    } = (0, h.$G)("clip");
                    (0, m.useImperativeHandle)(e, () => ({
                        handleSubmit: Ah
                    }));
                    let c = (0, Z.t)(),
                        u = (0, E.Dv)(k.E2.preflightData),
                        p = (0, E.Dv)(k.E2.renderPreference),
                        f = (0, E.Dv)(k.E2.preferenceModel),
                        K = (0, E.b9)(k.E2.preferenceRanges),
                        w = (0, E.b9)(X.p2.showShareLove),
                        B = (0, E.Dv)(L.a.isPaidUser),
                        U = (0, E.Dv)(L.a.currentOrgAsset),
                        F = (0, E.Dv)(R.T.totalCreditInSecond),
                        I = (0, E.Dv)(k.E2.localVideoPreflightdata),
                        [Q, j] = (0, m.useState)(),
                        {
                            openUpsellWindow: q
                        } = (0, S.w)(),
                        [O, D] = (0, m.useState)(!1),
                        P = (0, E.b9)(k.E2.autoImportDialogOpen),
                        [N, M] = (0, y.WJ)(),
                        [V] = (0, x.Ek)("clip_anything_ban"),
                        T = (0, z.Z)(),
                        Y = (0, z.Z)(),
                        {
                            getAutoImportAccountList: H
                        } = (0, J.Z)(),
                        _ = (0, m.useMemo)(() => "normal" !== n, [n]),
                        W = (0, m.useMemo)(() => (!V || "ClipAnything" === f) && "normal" === n && !T, [V, f, n, T]),
                        {
                            enableUploadBg: G
                        } = (0, b.H)(),
                        Ae = G && (null == N ? void 0 : N.type) === "local",
                        {
                            addTask: Ai
                        } = (0, $.K)(),
                        [An, Al] = (0, m.useState)(!1);
                    (0, m.useEffect)(() => {
                        j({
                            sourceLang: (null == u ? void 0 : u.videoLanguage) || "auto",
                            targetLang: null == u ? void 0 : u.translationLanguage
                        })
                    }, [u]);
                    let Ar = (0, C.Z)(async (A, e, t) => {
                            var i;
                            w(!0);
                            let o = A;
                            if (Ae && t) try {
                                Al(!0);
                                let A = await Ai({
                                    request: t,
                                    file: null == N ? void 0 : N.file,
                                    workflow: n
                                });
                                A ? (o = A, g.Am.success(s("project_submitted"))) : g.Am.success(s("local_project_submitted"))
                            } catch (A) {
                                A instanceof Error ? g.Am.warning(A.message) : g.Am.warning(JSON.stringify(A));
                                return
                            } finally {
                                Al(!1)
                            } else a || g.Am.success(s("project_submitted"));
                            "normal" === n && (e.append("projectId", encodeURIComponent(o)), c.push("".concat(Y ? "/collections" : "/dashboard", "?").concat(e.toString())));
                            let r = await H("YOUTUBE", "1");
                            u && "sourcePlatform" in u && "YOUTUBE" === u.sourcePlatform && (null == r ? void 0 : null === (i = r.data) || void 0 === i ? void 0 : i.shouldPop) && P("auto-open"), l && l(A)
                        }),
                        {
                            getClipsHandler: Aa,
                            isLoading: As,
                            errorMessage: Ac,
                            needBuyMore: Au
                        } = (0, AA.ZP)({
                            link: (null == N ? void 0 : N.type) === "url" ? N.url : "",
                            localVideoId: (null == N ? void 0 : N.type) === "local" ? N.url : "",
                            thirdPartyFile: (null == N ? void 0 : N.type) === "thirdPartyFile" ? N.file : void 0,
                            skipRequest: Ae,
                            onCreate: Ar
                        });
                    (0, m.useEffect)(() => {
                        r && (null == r || r(As || An))
                    }, [r, As, An]);
                    let Ad = (0, m.useMemo)(() => Au && ((null == U ? void 0 : U.plan) === "FreePlan" || (null == U ? void 0 : U.plan) === "FreeTrial") && (null != F ? F : 0) < 1800 && O, [Au, null == U ? void 0 : U.plan, F, O]);
                    (0, m.useEffect)(() => {
                        Ac && g.Am.warning(Ac)
                    }, [Ac]);
                    let Ag = (0, C.Z)(() => {
                            q({
                                switchType: "plan",
                                trigger: "buy-more-from-workflow",
                                ads: "background"
                            }), D(!0)
                        }),
                        Ap = (0, m.useMemo)(() => !As && Au, [As, Au]),
                        Af = (0, m.useMemo)(() => As ? null : Au ? (0, d.jsxs)("div", {
                            className: "flex flex-row items-center",
                            children: [(0, d.jsx)(g.ZT, {
                                variant: "warn",
                                className: "text-nowrap text-sm font-normal",
                                children: s("used_up_credits")
                            }), (0, d.jsx)(g.zx, {
                                variant: "ghost",
                                className: "text-sm",
                                onClick: Ag,
                                children: s("buy_more")
                            })]
                        }) : void 0, [As, Au, Ag, s]),
                        Am = (0, C.Z)(A => {
                            j(A)
                        }),
                        Ah = (0, C.Z)(async () => {
                            u && !As && ((null == N ? void 0 : N.type) === "local" ? await Aa({
                                size: I.size,
                                type: I.type,
                                uploadedVideoAttr: {
                                    title: I.title,
                                    durationMs: 1e3 * I.duration
                                },
                                importPref: Q,
                                trigger: n
                            }) : AB && !Ay ? (Aw(!0), AQ(!0)) : await Aa({
                                importPref: Q,
                                trigger: n
                            }))
                        }),
                        Av = (0, C.Z)(() => {
                            M(), "normal" === n && c.push("/dashboard")
                        }),
                        Ax = (0, C.Z)(A => {
                            K(A)
                        }),
                        AC = (0, m.useMemo)(() => !!u && "sourcePlatform" in u && "YOUTUBE" === u.sourcePlatform, [u]),
                        Ab = (0, m.useMemo)(() => (null == N ? void 0 : N.type) === "url" && !!u && N.url === AN, [N, u]),
                        {
                            open: Ay,
                            setOpen: Aw,
                            shouldOauth: AB,
                            channelDetail: AU,
                            checkOwnership: AF,
                            shouldRedirect: AI
                        } = At(AC && !Ab, (null == N ? void 0 : N.type) === "url" && u ? N.url : ""),
                        [AE, AQ] = (0, m.useState)(!1),
                        Aj = (0, C.Z)(async () => {
                            Aw(!1);
                            let {
                                data: A
                            } = await AF();
                            (null == A ? void 0 : A.hasAccess) === !1 ? g.Am.warning(s("not_your_yt")) : AE && (AQ(!1), await Aa({
                                importPref: Q,
                                trigger: n
                            }))
                        }),
                        AS = (0, C.Z)(() => {
                            Aw(!1), g.Am.warning(s("upload_options"), {
                                id: "youtube-oauth-cancel-warning",
                                duration: 5e3,
                                action: (0, d.jsx)("a", {
                                    "aria-label": s("learn_more_supported"),
                                    className: "text-primary mx-1 cursor-pointer font-sans text-sm font-semibold",
                                    href: "https://help.opus.pro/docs/article/video-sources-supported",
                                    target: "_blank",
                                    rel: "noreferrer",
                                    onClick: () => {
                                        (0, v.B)("user.youtube_oauth.click_link", {
                                            channelId: null == AU ? void 0 : AU.id,
                                            channelTitle: null == AU ? void 0 : AU.title,
                                            link: "https://help.opus.pro/docs/article/video-sources-supported"
                                        }, {
                                            platform: {
                                                MP: !0,
                                                SS: !1
                                            }
                                        })
                                    },
                                    children: s("learn_more")
                                })
                            }), "normal" === n && AI && c.push("/dashboard")
                        }),
                        AL = (0, m.useMemo)(() => AC ? AB ? (0, d.jsxs)("div", {
                            children: [s("using_video_you_own"), (0, d.jsx)(g.zx, {
                                variant: "link",
                                className: "bg-transparent p-0 underline",
                                onClick: () => {
                                    Aw(!0), AQ(!1)
                                },
                                children: s("youtube_ownership")
                            })]
                        }) : Ab ? "" : s("copyright_hint") : B ? "" : s("unauthorized_clipping"), [AC, B, AB, Ab, Aw, s]),
                        AR = AJ.includes(n);
                    return (0, d.jsxs)(d.Fragment, {
                        children: [!u && (0, d.jsx)(A_, {
                            className: o,
                            workflow: n,
                            showTitle: "normal" === n && !T,
                            showModelSelection: W,
                            showProductHint: !1,
                            showSubmitBtn: "normal" === n
                        }), u && (0, d.jsx)(AK, {
                            className: o,
                            submitButtonDisabled: Ap,
                            showLangSelection: AR,
                            showSubmitBtn: "normal" === n,
                            seed: N,
                            preflightData: u,
                            loading: As || An,
                            onReset: Av,
                            warning: Af,
                            hint: AL,
                            onReferenceChange: Am,
                            onSubmit: Ah,
                            workflow: n,
                            children: _ ? (0, d.jsx)(AG, {
                                showBadge: "ClipAnything" !== f && !(null === (t = p.quickstartConfig) || void 0 === t ? void 0 : t.enableBRoll) && !(null === (i = p.quickstartConfig) || void 0 === i ? void 0 : i.enableVoiceover),
                                duration: u.duration,
                                onChange: Ax,
                                workflow: n
                            }) : null
                        }), Ad && (0, d.jsx)(Ao, {}), AB && AU && (0, d.jsx)(AW, {
                            open: Ay,
                            ignoreInteractOutside: AI,
                            channelDetail: AU,
                            onCancel: AS,
                            onSubmit: Aj
                        })]
                    })
                });
            Az.displayName = "SubmitPanel";
            let AX = A => {
                let {
                    title: e,
                    description: t,
                    copilot_config: i,
                    button_title: n,
                    disabled: o,
                    workflowType: l,
                    cover: r,
                    onClose: a,
                    onBeforeSubmit: s,
                    onAfterSubmit: c,
                    customerContent: p,
                    specialHint: v,
                    onClickOutside: x
                } = A, {
                    t: b
                } = (0, h.$G)("clip");
                (0, V.Z)(l);
                let w = (0, Z.t)(),
                    B = (0, E.Dv)(k.E2.preflightData),
                    [F, I] = (0, m.useState)(!1),
                    [Q, j] = (0, y.WJ)(),
                    {
                        durationWarning: S,
                        upgradeLimit: L
                    } = (0, M.zj)(null == B ? void 0 : B.duration),
                    R = (0, m.useRef)(null),
                    q = (0, C.Z)(() => {
                        a(!0)
                    });
                (0, m.useEffect)(() => {
                    "quick_normal" === l && B && w.push("/workflow")
                }, [l, B]);
                let O = (0, m.useMemo)(() => !!(!S && B && "quick_normal" !== l), [B, l, S]);
                return (0, m.useEffect)(() => {
                    S && "quick_normal" !== l && (j(), g.Am.warning((0, d.jsx)(g.ZT, {
                        className: "text-warn text-sm font-normal",
                        children: S
                    })))
                }, [S, l, j]), (0, d.jsxs)(N.Vq, {
                    open: !0,
                    modal: !1,
                    onOpenChange: A => {
                        A || null == a || a(!1, O)
                    },
                    children: [(0, d.jsx)("div", {
                        className: "fixed inset-0 z-[49] h-screen w-screen bg-black/80"
                    }), (0, d.jsxs)(N.cZ, {
                        className: "flex h-fit max-w-[496px] flex-col gap-y-4 font-sans max-sm:max-w-[90vw]",
                        onOpenAutoFocus: A => A.preventDefault(),
                        onFocusOutside: A => {
                            var e, t, i;
                            (null === (i = A.target) || void 0 === i ? void 0 : null === (t = i.className) || void 0 === t ? void 0 : null === (e = t.includes) || void 0 === e ? void 0 : e.call(t, "picker-dialog")) && A.preventDefault()
                        },
                        onPointerDownOutside: A => {
                            var e, t, i;
                            if (x) {
                                x(A, O);
                                return
                            }(null === (i = A.target) || void 0 === i ? void 0 : null === (t = i.className) || void 0 === t ? void 0 : null === (e = t.includes) || void 0 === e ? void 0 : e.call(t, "picker-dialog")) && A.preventDefault()
                        },
                        children: [(0, d.jsxs)(N.fK, {
                            className: "text-start",
                            children: [(0, d.jsx)(N.$N, {
                                children: e
                            }), (0, d.jsx)(N.Be, {
                                children: t
                            })]
                        }), "quick_normal" === l && B ? (0, d.jsx)(P.Z, {}) : O && p ? p() : (0, d.jsxs)(d.Fragment, {
                            children: [!O && (0, d.jsx)(g.oM, {
                                ratio: 446 / 219,
                                children: (0, d.jsx)(f(), {
                                    width: 0,
                                    height: 0,
                                    src: r,
                                    alt: "quick start",
                                    className: "size-full object-cover"
                                })
                            }), (0, d.jsxs)(g.xr, {
                                className: (0, K.cn)("w-full max-h-[547px]", O && "h-[calc(100dvh-256px)]"),
                                inDialog: !0,
                                type: "always",
                                viewPortClassName: "[&>div]:!block",
                                children: [O && (null == B ? void 0 : B.thumbnailUrl) && (0, d.jsx)(Y, {
                                    className: "w-full [&>div]:w-[268px]",
                                    title: B.title,
                                    src: B.thumbnailUrl,
                                    resolution: B.resolution
                                }), O && (0, d.jsx)(u.k, (0, U._)({
                                    className: "!mx-0 mt-4 pb-5",
                                    inDialog: !0,
                                    saveSettings: !1,
                                    configStyle: !1,
                                    configContent: !1,
                                    configReframe: !1,
                                    configBroll: !1,
                                    configVoiceover: !1
                                }, i)), (0, d.jsx)(Az, {
                                    workflow: l,
                                    ref: R,
                                    className: "bg-popover mt-4 rounded-md pt-0 sm:w-full",
                                    onSubmit: q,
                                    onSubmittingChange: I
                                }), !B && "quick_normal" !== l && (0, d.jsxs)("div", {
                                    className: "text-muted-foreground mt-4 text-xs",
                                    children: [b("max_video_length", {
                                        upgradeLimit: L
                                    }), " ", v]
                                })]
                            }), O && (0, d.jsx)(N.cN, {
                                children: (0, d.jsx)("div", {
                                    className: "w-full",
                                    onClick: () => {
                                        null == s || s()
                                    },
                                    children: (0, d.jsx)(_, {
                                        title: n,
                                        containerClassName: "w-full",
                                        className: "sm:w-full",
                                        loading: F,
                                        disabled: o,
                                        onClick: async () => {
                                            var A;
                                            await (null === (A = R.current) || void 0 === A ? void 0 : A.handleSubmit()), null == c || c()
                                        }
                                    })
                                })
                            })]
                        })]
                    })]
                })
            };
            var A$ = A => {
                    var e;
                    let {
                        onClose: t,
                        disabled: i
                    } = A, {
                        t: n
                    } = (0, h.$G)("clip"), [o, l] = (0, E.KO)(R.T.featureQuota), r = (0, E.Dv)(k.E2.renderPreference), a = (0, E.Dv)(L.a.currentOrgAsset), {
                        openUpsellWindow: s
                    } = (0, S.w)(), [c] = (0, j.Lg)(), u = (0, E.b9)(k.E2.brandTemplateId);
                    (0, m.useEffect)(() => (u("quick-start-empty"), () => {
                        u("")
                    }), [u]), (0, D.p)();
                    let g = (0, Q.ZP)(),
                        {
                            isCreditsInsufficient: p
                        } = O(),
                        f = (0, m.useMemo)(() => {
                            var A, e;
                            if (c) return p;
                            let t = null == o ? void 0 : o.genAIBroll;
                            return (null == r ? void 0 : null === (e = r.quickstartConfig) || void 0 === e ? void 0 : null === (A = e.bRollParams) || void 0 === A ? void 0 : A.type) === "stock" && (t = null == o ? void 0 : o.genStockBroll), (null == t ? void 0 : t.remain) !== void 0 && (null == t ? void 0 : t.remain) <= 0
                        }, [o, null == r ? void 0 : null === (e = r.quickstartConfig) || void 0 === e ? void 0 : e.bRollParams, p, c]);
                    return (0, I.Z)(async () => {
                        let A = await g.checkBrollQuota();
                        if (A.genAI || A.stock) {
                            var e, t, i, n, r, a;
                            l((0, F._)((0, U._)({}, o), {
                                genAIBroll: {
                                    hasLimit: null === (e = A.genAI) || void 0 === e ? void 0 : e.checkQuota,
                                    remain: null === (t = A.genAI) || void 0 === t ? void 0 : t.remainingQuota,
                                    total: null === (i = A.genAI) || void 0 === i ? void 0 : i.totalQuota
                                },
                                genStockBroll: {
                                    hasLimit: null === (n = A.stock) || void 0 === n ? void 0 : n.checkQuota,
                                    remain: null === (r = A.stock) || void 0 === r ? void 0 : r.remainingQuota,
                                    total: null === (a = A.stock) || void 0 === a ? void 0 : a.totalQuota
                                }
                            }))
                        }
                    }, []), (0, d.jsx)(AX, {
                        title: (0, w.KC)(n).broll.iconDesc,
                        description: (0, w.KC)(n).broll.iconTooltip,
                        copilot_config: {
                            configBroll: !0
                        },
                        button_title: n("b_roll_click"),
                        disabled: i || f || (null == a ? void 0 : a.plan) === "FreePlan",
                        cover: (0, w.KC)(n).broll.cover,
                        workflowType: "broll",
                        onClose: t,
                        onBeforeSubmit: () => {
                            (null == a ? void 0 : a.plan) === "FreePlan" && s({
                                switchType: "plan",
                                trigger: "quickstart-broll",
                                ads: "background"
                            })
                        },
                        specialHint: n("broll_hint")
                    })
                },
                A0 = A => {
                    let {
                        onClose: e,
                        disabled: t
                    } = A, {
                        t: i
                    } = (0, h.$G)("clip");
                    return (0, d.jsx)(AX, {
                        title: (0, w.KC)(i).caption.iconDesc,
                        description: (0, w.KC)(i).caption.iconTooltip,
                        copilot_config: {
                            configStyle: !0
                        },
                        button_title: i("captions_click"),
                        cover: (0, w.KC)(i).caption.cover,
                        workflowType: "caption",
                        disabled: t,
                        onClose: e
                    })
                },
                A1 = t(30339),
                A2 = A => {
                    var e, t, i;
                    let {
                        onClose: n,
                        disabled: o
                    } = A, {
                        t: l
                    } = (0, h.$G)("clip"), [r, a] = (0, E.KO)(R.T.featureQuota), s = (0, E.Dv)(k.E2.renderPreference), {
                        maxCount: c,
                        remain: u,
                        recordUsage: g
                    } = (0, A1.dR)(), {
                        openUpsellWindow: p
                    } = (0, S.w)(), f = (0, E.b9)(k.E2.brandTemplateId);
                    (0, m.useEffect)(() => (f("quick-start-empty"), () => {
                        f("")
                    }), [f]), (0, D.p)();
                    let v = (0, E.Dv)(L.a.currentOrgAsset);
                    (0, m.useEffect)(() => {
                        a((0, F._)((0, U._)({}, r), {
                            voiceoverEnhancement: {
                                hasLimit: !0,
                                remain: u,
                                total: c
                            }
                        }))
                    }, [c, u]);
                    let x = !(null == s ? void 0 : null === (e = s.quickstartConfig) || void 0 === e ? void 0 : e.enableVoiceEnhancement) && !(null == s ? void 0 : null === (t = s.quickstartConfig) || void 0 === t ? void 0 : t.enableRemoveFillerWords) && !(null == s ? void 0 : null === (i = s.quickstartConfig) || void 0 === i ? void 0 : i.enableRemovePauses);
                    return (0, d.jsx)(AX, {
                        title: (0, w.KC)(l).enhance_speech.iconDesc,
                        description: (0, w.KC)(l).enhance_speech.iconTooltip,
                        copilot_config: {
                            configEnhancement: !0
                        },
                        button_title: l("enhance_click"),
                        disabled: o || (null == v ? void 0 : v.plan) === "FreePlan" || x,
                        workflowType: "enhance_speech",
                        cover: (0, w.KC)(l).enhance_speech.cover,
                        onClose: n,
                        onBeforeSubmit: () => {
                            (null == v ? void 0 : v.plan) === "FreePlan" && p({
                                switchType: "plan",
                                trigger: "quickstart-speechEnhancement",
                                ads: "background"
                            })
                        },
                        onAfterSubmit: () => {
                            var A;
                            (null == s ? void 0 : null === (A = s.quickstartConfig) || void 0 === A ? void 0 : A.enableVoiceEnhancement) && g()
                        }
                    })
                },
                A5 = t(60963),
                A4 = t(81329),
                A6 = t(99289);
            let A9 = A => {
                var e;
                let {
                    exceedLimit: t,
                    usageHint: i,
                    recordUsage: n
                } = A, {
                    t: o
                } = (0, h.$G)("clip"), l = (0, m.useRef)(t), r = (0, m.useRef)(null), [a, s] = (0, m.useState)(""), c = (0, Z.t)(), u = (0, E.Dv)(A6.U1.projectList), p = (0, E.Dv)(k.E2.preflightData), f = (0, E.Dv)(X.p2.clipProjectProcess(a)), v = (0, m.useRef)(!0), {
                    getClips: x
                } = (0, Q.ZP)(), [C] = (0, A4.v)(), [K, b] = (0, y.WJ)(), [w] = (0, D.p)(), {
                    completed: B,
                    completedText: U
                } = (0, m.useMemo)(() => {
                    let A = u.find(A => A.id === a),
                        e = (null == A ? void 0 : A.stage) === "COMPLETE" || (null == f ? void 0 : f.status) === "CONCLUDED",
                        t = e ? o("video_ready_redirect") : o("failed_please_try");
                    return {
                        completed: e,
                        completedText: t
                    }
                }, [u, f, a, o]);
                return (0, m.useEffect)(() => {
                    if (l.current) {
                        g.Am.warning(i), b();
                        return
                    }
                    if (p && !w && v.current) {
                        var A;
                        v.current = !1, null === (A = r.current) || void 0 === A || A.handleSubmit(), n()
                    }
                }, [p, i, w, n, b]), (0, I.Z)(async () => {
                    if (B && a) {
                        var A, e, t;
                        let i = await x(a);
                        if (null === (A = i[0]) || void 0 === A ? void 0 : A.clipId) {
                            let A = "/".concat(C ? "editor-ux" : "editor", "/").concat(a, ".").concat(null === (e = i[0]) || void 0 === e ? void 0 : e.clipId, "?clipId=").concat(null === (t = i[0]) || void 0 === t ? void 0 : t.clipId);
                            c.push(A)
                        }
                    }
                }, [B, a, x]), (0, d.jsxs)(d.Fragment, {
                    children: [(0, d.jsx)(A5.A, {
                        completed: B,
                        completedText: U,
                        progress: Math.floor(100 * ((null == f ? void 0 : f.progress) || .05)),
                        ready: (null !== (e = null == f ? void 0 : f.progress) && void 0 !== e ? e : 0) >= .5,
                        imagePreview: (null == p ? void 0 : p.thumbnailUrl) ? (0, d.jsx)(Y, {
                            className: "w-full [&>div]:w-[268px]",
                            title: null == p ? void 0 : p.title,
                            src: null == p ? void 0 : p.thumbnailUrl,
                            resolution: null == p ? void 0 : p.resolution
                        }) : null,
                        className: "[&>div]:inset-0",
                        readyText: o("ranscribing_video_keep_open"),
                        notReadyText: o("keep_window_until_done")
                    }), (0, d.jsx)(Az, {
                        workflow: "quick_editor",
                        ref: r,
                        className: "hidden",
                        onSubmit: A => {
                            A && s(A)
                        },
                        smokeToast: !0
                    })]
                })
            };
            var A3 = A => {
                    let {
                        onClose: e,
                        disabled: t
                    } = A, {
                        t: i
                    } = (0, h.$G)("clip"), {
                        exceedLimit: n,
                        recordUsage: o,
                        usageHint: l
                    } = (0, A1.a5)(), r = (0, E.Dv)(R.T.needBuyMore), a = (0, E.Dv)(k.E2.preflightData), s = (0, E.b9)(k.E2.brandTemplateId);
                    return (0, m.useEffect)(() => (s("quick-start-empty"), () => {
                        s("")
                    }), [s]), (0, m.useEffect)(() => {
                        r && a && e(!0)
                    }, [r, a]), (0, d.jsx)(AX, {
                        title: (0, w.KC)(i).quick_editor.title,
                        description: (0, w.KC)(i).quick_editor.iconTooltip,
                        copilot_config: {
                            configStyle: !0
                        },
                        button_title: i("go_to_editor"),
                        cover: (0, w.KC)(i).quick_editor.cover,
                        workflowType: "quick_editor",
                        disabled: t,
                        onClose: e,
                        customerContent: () => (0, d.jsx)(A9, {
                            exceedLimit: n,
                            usageHint: l,
                            recordUsage: o
                        }),
                        onClickOutside: (A, e) => {
                            e && A.preventDefault()
                        },
                        specialHint: i("credits_not_required")
                    })
                },
                A7 = A => {
                    let {
                        onClose: e,
                        disabled: t
                    } = A, {
                        t: i
                    } = (0, h.$G)("clip");
                    return (0, d.jsx)(AX, {
                        title: (0, w.KC)(i).quick_normal.iconDesc,
                        description: (0, w.KC)(i).quick_normal.iconTooltip,
                        copilot_config: {},
                        button_title: "",
                        cover: (0, w.KC)(i).quick_normal.cover,
                        workflowType: "quick_normal",
                        disabled: t,
                        onClose: e
                    })
                },
                A8 = A => {
                    let {
                        disabled: e,
                        onClose: t
                    } = A, {
                        t: i
                    } = (0, h.$G)("clip");
                    return (0, d.jsx)(AX, {
                        title: (0, w.KC)(i).reframe.iconDesc,
                        description: (0, w.KC)(i).reframe.iconTooltip,
                        copilot_config: {
                            configReframe: !0
                        },
                        button_title: i("reframe_click"),
                        cover: (0, w.KC)(i).reframe.cover,
                        workflowType: "reframe",
                        disabled: !!e,
                        onClose: t
                    })
                },
                eA = A => {
                    let {
                        onClose: e,
                        disabled: t
                    } = A, {
                        t: i
                    } = (0, h.$G)("clip"), n = (0, E.Dv)(L.a.currentOrgAsset), [o, l] = (0, E.KO)(R.T.featureQuota), {
                        maxCount: r,
                        exceedLimit: a,
                        getUsageCount: s
                    } = (0, A1.Qb)(null == n ? void 0 : n.plan), {
                        openUpsellWindow: c
                    } = (0, S.w)();
                    return (0, D.p)(), (0, m.useEffect)(() => {
                        (async function() {
                            let A = await s();
                            void 0 !== A && void 0 !== r && l((0, F._)((0, U._)({}, o), {
                                voiceover: {
                                    hasLimit: !0,
                                    remain: Math.max(0, r - A),
                                    total: r
                                }
                            }))
                        })()
                    }, [s]), (0, d.jsx)(AX, {
                        title: (0, w.KC)(i).voiceover.iconDesc,
                        description: (0, w.KC)(i).voiceover.iconTooltip,
                        copilot_config: {
                            configVoiceover: !0
                        },
                        button_title: i("voice_click"),
                        disabled: t || a || (null == n ? void 0 : n.plan) === "FreePlan",
                        workflowType: "voiceover",
                        cover: (0, w.KC)(i).voiceover.cover,
                        onClose: e,
                        onBeforeSubmit: () => {
                            (null == n ? void 0 : n.plan) === "FreePlan" && c({
                                switchType: "plan",
                                trigger: "quickstart-voiceover",
                                ads: "background"
                            })
                        }
                    })
                };
            let ee = A => {
                let {
                    className: e,
                    workflowType: t,
                    onWorkflowChange: i,
                    onSubmit: n
                } = A, {
                    t: o
                } = (0, h.$G)("clip"), [l, r] = (0, y.WJ)(), [a, s] = (0, m.useState)(null), {
                    isUploading: c,
                    handleCancelUpload: u
                } = (0, B.L)({}), {
                    enableUploadBg: p
                } = (0, b.H)(), [U] = (0, x.Ek)("quick_start_11labs_ban"), [F, I] = (0, m.useState)(!1), E = (0, C.Z)(A => {
                    null == i || i(A, !1), (0, v.B)("project.quick_start.click", {
                        trigger: A
                    }, {
                        platform: {
                            MP: !0,
                            SS: !0
                        }
                    })
                }), Q = (0, C.Z)(A => {
                    r(), null == i || i("normal", !0), A && n && n()
                }), j = (0, C.Z)(A => {
                    if (p) {
                        A || u(), Q(A);
                        return
                    }
                    c ? I(!0) : Q(A)
                });
                return (0, d.jsxs)("div", {
                    className: (0, K.cn)("flex flex-col justify-center w-full items-center gap-y-4 overflow-hidden", e),
                    children: [(0, d.jsx)("div", {
                        className: "flex flex-row  justify-center gap-x-2 flex-wrap gap-y-8 max-md:grid max-md:w-full max-md:grid-cols-3 max-md:justify-items-center w-full max-w-full",
                        children: (0, w.v4)(U, o).map(A => (0, d.jsxs)("div", {
                            className: "relative flex w-[115px] cursor-pointer flex-col items-center gap-2 max-md:w-[108px]",
                            onClick: () => {
                                E(A.workflowType)
                            },
                            children: [(0, d.jsx)(g.u, {
                                trigger: "hover",
                                portal: !0,
                                sideOffset: 20,
                                content: A.iconTooltip,
                                children: (0, d.jsx)("div", {
                                    className: "bg-popover w-fit rounded-full p-4",
                                    onMouseEnter: () => {
                                        s(A.workflowType)
                                    },
                                    onMouseLeave: () => {
                                        s(null)
                                    },
                                    children: (0, d.jsx)(f(), {
                                        className: (0, K.cn)("duration-300 transform-gpu size-9", a === A.workflowType && "scale-125"),
                                        src: A.iconImg,
                                        alt: A.title,
                                        width: 0,
                                        height: 0
                                    })
                                })
                            }), A.withNewLabel && (0, d.jsx)(g.Ct, {
                                variant: "secondary",
                                className: "absolute -top-2 right-0",
                                children: o("common:new")
                            }), (0, d.jsx)("div", {
                                className: "text-primary break-words text-center text-xs font-medium",
                                children: A.iconDesc
                            })]
                        }, A.workflowType))
                    }), "quick_normal" === t && (0, d.jsx)(A7, {
                        disabled: !l,
                        onClose: j
                    }), "caption" === t && (0, d.jsx)(A0, {
                        disabled: !l,
                        onClose: j
                    }), "reframe" === t && (0, d.jsx)(A8, {
                        disabled: !l,
                        onClose: j
                    }), "broll" === t && (0, d.jsx)(A$, {
                        disabled: !l,
                        onClose: j
                    }), "voiceover" === t && (0, d.jsx)(eA, {
                        disabled: !l,
                        onClose: j
                    }), "enhance_speech" === t && (0, d.jsx)(A2, {
                        disabled: !l,
                        onClose: j
                    }), "quick_editor" === t && (0, d.jsx)(A3, {
                        disabled: !l,
                        onClose: j
                    }), (0, d.jsx)(g.Vq, {
                        open: F,
                        title: o("sure_cancel"),
                        confirmText: o("confirm_and_cancel"),
                        onCancel: () => {
                            I(!1)
                        },
                        onConfirm: () => {
                            u(), Q(!1), I(!1)
                        }
                    })]
                })
            }
        },
        35625: function(A, e, t) {
            "use strict";
            t.d(e, {
                G: function() {
                    return c
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(2784),
                l = t(98614),
                r = t(91381),
                a = t(59511),
                s = t(10123);
            let c = A => {
                let {
                    onCancel: e,
                    triggerClassName: t
                } = A, {
                    t: c
                } = (0, l.$G)("clip"), [u, d] = (0, o.useState)(!1), g = (0, a.Z)(A => {
                    e(A)
                });
                return (0, i.jsxs)(r.Vq, {
                    open: u,
                    onOpenChange: d,
                    children: [(0, i.jsx)(r.hg, {
                        asChild: !0,
                        children: (0, i.jsx)(n.zx, {
                            variant: "base",
                            className: (0, s.cn)("text-sm font-normal text-secondary-foreground", t),
                            children: c("common:cancel")
                        })
                    }), (0, i.jsxs)(r.cZ, {
                        className: "max-w-sm sm:max-w-lg",
                        children: [(0, i.jsx)(r.fK, {
                            children: (0, i.jsx)(r.$N, {
                                children: c("cancel_upload_question")
                            })
                        }), (0, i.jsx)("div", {
                            children: (0, i.jsx)(n.ZT, {
                                className: "text-sm font-normal",
                                children: c("cancel_upload_hint")
                            })
                        }), (0, i.jsxs)(r.cN, {
                            className: "justify-end",
                            children: [(0, i.jsx)(r.GG, {
                                asChild: !0,
                                children: (0, i.jsx)(n.zx, {
                                    variant: "outline",
                                    onClick: g,
                                    children: c("cancel_upload")
                                })
                            }), (0, i.jsx)(r.GG, {
                                asChild: !0,
                                children: (0, i.jsx)(n.zx, {
                                    children: c("common:dismiss")
                                })
                            })]
                        })]
                    })]
                })
            }
        },
        59216: function(A, e, t) {
            "use strict";
            var i = t(52322),
                n = t(57992),
                o = t(42119),
                l = t(17212),
                r = t(2784),
                a = t(98614),
                s = t(31037),
                c = t(48989),
                u = t(10123),
                d = t(46899),
                g = t(63453),
                p = t(35625);
            e.Z = A => {
                let {
                    className: e,
                    disabled: t,
                    extraLoading: f,
                    uploadBackground: m,
                    dragger: h,
                    onDrag: v,
                    onCancel: x,
                    onError: C,
                    onStart: K,
                    onSuccess: b,
                    onProgress: y,
                    workflow: w
                } = A, {
                    t: B
                } = (0, a.$G)("clip"), [U] = (0, g.b)(), F = (0, d.KC)(w), {
                    uploadFile: I,
                    leftTime: E,
                    progress: Q,
                    isUploading: j,
                    handleBeforeUpload: S,
                    handleTriggerUpload: L,
                    handleCancelUpload: R
                } = (0, g.L)({
                    onStart: K,
                    onError: C,
                    onProgress: y,
                    onSuccess: b,
                    onCancel: x,
                    workflow: w
                }), k = (0, r.useMemo)(() => !j && f ? "100" : Q < .1 ? "0" : Q.toFixed(1), [Q, f, j]), q = (0, r.useMemo)(() => j || t, [j, t]), O = h ? n.gq.Dragger : n.gq, D = (0, r.useMemo)(() => j || f ? (0, i.jsxs)("div", {
                    className: "flex w-full items-center gap-2",
                    children: [(0, i.jsx)(l.Z, {
                        className: "animate-spin"
                    }), (0, i.jsxs)("div", {
                        className: "flew-row flex w-full justify-between",
                        children: [m && I ? (0, i.jsx)("div", {
                            className: "flex-1 shrink truncate text-start",
                            children: I.name
                        }) : (0, i.jsx)(i.Fragment, {
                            children: E >= 0 ? (0, i.jsx)(a.cC, {
                                i18nKey: "clip:uploading_left_time",
                                components: [(0, i.jsx)("div", {
                                    className: "text-success text-sm font-normal"
                                }, "key-0"), (0, i.jsx)(n.ZT, {
                                    variant: "headings",
                                    className: "text-muted-foreground w-24 text-sm font-normal"
                                }, "key-1")],
                                values: {
                                    progressPercent: k,
                                    leftTime: (0, c.B6)(E, B)
                                }
                            }) : (0, i.jsx)(a.cC, {
                                i18nKey: "clip:uploading_no_time",
                                components: [(0, i.jsx)("div", {
                                    className: "text-success text-sm font-normal"
                                }, "key-0"), (0, i.jsx)(n.ZT, {
                                    variant: "headings",
                                    className: "text-muted-foreground w-24 text-sm font-normal"
                                }, "key-1")],
                                values: {
                                    progressPercent: k
                                }
                            })
                        }), (0, i.jsx)(p.G, {
                            onCancel: R
                        })]
                    })]
                }) : (0, i.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [(0, i.jsx)(o.D7, {
                        className: "size-4"
                    }), h ? B("clip:drag_to_upload") : B("clip:upload")]
                }), [j, f, m, I, k, E, R, h, B]);
                return (0, i.jsx)(O, {
                    beforeUpload: A => Promise.resolve(S(A)),
                    customRequest: A => L(A, "select"),
                    multiple: !1,
                    accept: s.LN,
                    disabled: q,
                    className: (0, u.cn)("flex flex-row", (j || f) && "flex-1", q && "rounded-md bg-background", h && "bg-popover upload-area"),
                    onDrag: v,
                    children: (0, i.jsx)(n.u, {
                        content: q ? null : B("video_limit", {
                            maxFileSizeGb: U,
                            maxHours: F
                        }),
                        portal: !0,
                        disableHoverableContent: !0,
                        sideOffset: 8,
                        side: "top",
                        onClick: A => A.stopPropagation(),
                        children: (0, i.jsx)(n.zx, {
                            "aria-label": B("upload_file"),
                            variant: "ghost-gray",
                            disabled: t,
                            className: (0, u.cn)("w-full justify-between text-nowrap text-muted-foreground", j && "hover:bg-transparent", h && "text-primary hover:bg-transparent px-1", e),
                            children: D
                        })
                    })
                })
            }
        },
        82469: function(A, e, t) {
            "use strict";
            t.d(e, {
                K: function() {
                    return g
                }
            });
            var i = t(57992),
                n = t(752),
                o = t(58420),
                l = t(26166),
                r = t(59511),
                a = t(3093),
                s = t(72800),
                c = t(13243),
                u = t(89640),
                d = t(61273);
            let g = () => {
                let [A, e] = (0, n.KO)(u.E2.localSubmitTasks), t = (0, n.Dv)(c.T.totalCreditInSecond), {
                    getUploadTask: g,
                    deleteUploadTask: p,
                    updateUploadTask: f
                } = (0, d.K)(), {
                    resetProjects: m
                } = (0, l.Q5)(), {
                    preflightPoll: h
                } = (0, s.QX)(), {
                    createProject: v
                } = (0, a.RN)(), x = (0, o.lV)((A, e, t) => t && A(u.E2.localSubmitTasks).find(A => A.uploadId === t) || null), C = (0, r.Z)(async A => {
                    let e = x(A);
                    if (null == e ? void 0 : e.project) try {
                        var t;
                        return f(A, {
                            submitted: !0
                        }), await h(null === (t = e.project) || void 0 === t ? void 0 : t.projectId, e.payload.workflow), await v(e.payload.request, e.payload.file, e.payload.workflow)
                    } catch (t) {
                        let A = (null == t ? void 0 : t.message) || "Failed to submit project: ".concat(e.payload.file.name);
                        i.Am.warning(A)
                    } finally {
                        K(A), m()
                    }
                    return null
                }), K = (0, r.Z)(A => {
                    e(e => e.filter(e => e.uploadId !== A)), p(A)
                }), b = (0, r.Z)(() => {
                    A.forEach(A => {
                        K(A.uploadId)
                    })
                });
                return {
                    addTask: (0, r.Z)(async A => {
                        var i;
                        let n = A.request.videoUrl;
                        if ((0, a.X_)(null !== (i = A.file.duration) && void 0 !== i ? i : 0, A.request.curationPref) > (null != t ? t : 0)) throw Error("You don't have enough credits to cover the full video length. Please specify a timeframe below, or purchase more credits.");
                        e(e => {
                            var t, i;
                            return [{
                                uploadId: n,
                                payload: A,
                                project: (0, l.mk)(n, A.request.productTier, {
                                    type: "UPLOADED",
                                    videoId: n,
                                    title: A.file.name,
                                    durationMs: null !== (i = A.file.duration) && void 0 !== i ? i : 0,
                                    thumbnailUrl: A.file.thumbUrl
                                }, "UPLOADING", null === (t = A.request.curationPref) || void 0 === t ? void 0 : t.model)
                            }, ...e]
                        });
                        let o = g(n);
                        return (null == o ? void 0 : o.status) === "done" ? await C(n) : null
                    }),
                    startTask: C,
                    resetTasks: b
                }
            }
        },
        61273: function(A, e, t) {
            "use strict";
            t.d(e, {
                K: function() {
                    return g
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(2784),
                r = t(79584),
                a = t(59511),
                s = t(30933),
                c = t(89640),
                u = t(22108),
                d = t(98231);
            let g = () => {
                let A = (0, o.Dv)(u.Q.uploadTasks),
                    e = (0, o.Dv)(c.E2.localSubmitTasks),
                    [t] = (0, d.WJ)(),
                    {
                        isUploadExp: g,
                        supportUploadBg: p
                    } = (0, s.H)(),
                    f = (0, l.useMemo)(() => {
                        var i, n, o;
                        if (!g) return null !== (i = A[0]) && void 0 !== i ? i : null;
                        if (!p) {
                            let t = null === (n = A[0]) || void 0 === n ? void 0 : n.uploadId;
                            return t ? e.some(A => A.uploadId === t) ? null : A[0] : null
                        }
                        return (null == t ? void 0 : t.type) !== "local" ? null : null !== (o = A.find(A => A.uploadId === (null == t ? void 0 : t.url))) && void 0 !== o ? o : null
                    }, [A, t, g, p, e]),
                    m = (0, a.T)(async (A, e, t) => {
                        let {
                            file: o,
                            url: l,
                            payload: a,
                            onStart: s,
                            onProgress: c,
                            onError: d,
                            onSuccess: g
                        } = t, p = a.url, f = A(u.Q.uploadTasks);
                        e(u.Q.uploadTasks, [{
                            uploadId: p,
                            status: "start",
                            submitted: !1,
                            leftTime: 120,
                            progress: 0,
                            file: a
                        }, ...f]);
                        let m = Date.now(),
                            x = r.E.getInstanceWithUploadId(p);
                        try {
                            await x.uploadFile(o, l, {
                                onUploadStart: () => {
                                    null == s || s((0, n._)((0, i._)({}, a), {
                                        status: "uploading",
                                        raw: o
                                    }))
                                },
                                onProgress: A => {
                                    let e = Math.min(99, A.percent),
                                        t = (Date.now() - m) / 1e3,
                                        i = 0 === e ? 120 : t / e * (100 - e);
                                    h(p, {
                                        progress: e,
                                        leftTime: i,
                                        status: "uploading"
                                    }), null == c || c(e)
                                }
                            }), p && (h(p, {
                                progress: 100,
                                leftTime: 0,
                                status: "done"
                            }), null == g || g((0, n._)((0, i._)({}, a), {
                                status: "done",
                                raw: o
                            })))
                        } catch (A) {
                            v(p), null == d || d(A)
                        }
                    }),
                    h = (0, a.T)((A, e, t, n) => {
                        if (!t) return;
                        let o = A(u.Q.uploadTasks).map(A => A.uploadId === t ? (0, i._)({}, A, n) : A);
                        e(u.Q.uploadTasks, o)
                    }),
                    v = (0, a.T)((A, e, t) => {
                        if (!t) return;
                        let i = A(u.Q.uploadTasks).filter(A => A.uploadId !== t);
                        e(u.Q.uploadTasks, i);
                        let n = r.E.getInstanceWithUploadId(t);
                        n && (n.cancelUpload(), r.E.removeInstance(t))
                    }),
                    x = (0, l.useCallback)(() => {
                        f && v(f.uploadId)
                    }, [f, v]);
                return {
                    addUploadTask: m,
                    updateUploadTask: h,
                    deleteUploadTask: v,
                    getUploadTask: (0, a.T)((A, e, t) => t && A(u.Q.uploadTasks).find(A => A.uploadId === t) || null),
                    resetUploadingTask: x,
                    currentUploadTask: f
                }
            }
        },
        3093: function(A, e, t) {
            "use strict";
            t.d(e, {
                RN: function() {
                    return E
                },
                X_: function() {
                    return j
                },
                ZP: function() {
                    return Q
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(2784),
                r = t(33414),
                a = t(41950),
                s = t(55975),
                c = t(45428),
                u = t(30339),
                d = t(60680),
                g = t(30265),
                p = t(10313),
                f = t(12600),
                m = t(26166),
                h = t(66836),
                v = t(59511),
                x = t(85682),
                C = t(30933),
                K = t(39411),
                b = t(80629),
                y = t(71774),
                w = t(13243),
                B = t(91376),
                U = t(71537),
                F = t(89640);
            let I = (0, U.uC)("device"),
                E = () => {
                    let A = (0, x.a)(),
                        e = (0, o.Dv)(b.a.payStatus),
                        t = (0, o.Dv)(b.a.currentOrgAsset),
                        {
                            enableUploadBg: l
                        } = (0, C.H)(),
                        {
                            startClipProject: g
                        } = (0, r.Z)(),
                        {
                            recordToFeishu: h
                        } = (0, a.Z)(),
                        {
                            recordUsage: y
                        } = (0, u.Qb)(null == t ? void 0 : t.plan),
                        {
                            refreshUserCredit: B
                        } = (0, w.J)(),
                        {
                            loginWithRedirect: U
                        } = (0, x.a)(),
                        {
                            appendProjectPlaceholder: F
                        } = (0, m.NQ)();
                    return {
                        createProject: (0, v.T)(async (o, r, a, u, m) => {
                            try {
                                var v, x, C, b, E, Q, L;
                                let r = await g((0, n._)((0, i._)({
                                        rawVideoLink: a.videoUrl
                                    }, a), {
                                        options: {
                                            noErrorToast: !0
                                        }
                                    })),
                                    U = r.id,
                                    {
                                        curationPref: R,
                                        uploadedVideoAttr: k
                                    } = a;
                                if (null === (x = a.renderPref) || void 0 === x ? void 0 : null === (v = x.quickstartConfig) || void 0 === v ? void 0 : v.enableVoiceover) {
                                    let A = await I.getItem("clipping-project-with-vo");
                                    I.setItem("clipping-project-with-vo", (null == A ? void 0 : A.length) ? [U, ...A] : [U]), y()
                                }
                                let q = await o(w.T.availableFreeTrialCreditBucket);
                                try {
                                    let o = null !== (L = null === (C = r.renderPref) || void 0 === C ? void 0 : C.layoutAspectRatio) && void 0 !== L ? L : "_NULL",
                                        g = a.utm;
                                    (0, s.B)("user.project.submitted", (0, n._)((0, i._)({
                                        projectId: U
                                    }, g), {
                                        paystatus: e,
                                        plan: null == t ? void 0 : t.plan,
                                        duration: S(r.duration || 0),
                                        processedDuration: j(r.duration || 0, R),
                                        copilot: function(A, e) {
                                            let t = j(A, e),
                                                o = t !== A,
                                                l = !!e && (o || e.clipDurations.length > 0 || e.topicKeywords.length > 0),
                                                r = (0, c.Y)(null == e ? void 0 : e.clipDurations),
                                                a = "";
                                            a = t <= 120 ? "0-2" : t <= 300 ? "2-5" : t <= 600 ? "5-10" : t <= 1800 ? "10-30" : "30+", o || (a = "not-set");
                                            let s = {
                                                rangeDifference: a
                                            };
                                            return (0, n._)((0, i._)({}, r, s), {
                                                copilot: l
                                            })
                                        }(r.duration || 0, R),
                                        platform: r.sourcePlatform,
                                        freeTrialCredit: q,
                                        email: null === (b = A.user) || void 0 === b ? void 0 : b.email,
                                        uploaded: function(A, e, t) {
                                            if (!A || !e || !t) return {};
                                            let i = "";
                                            return i = S(e / 1e3), {
                                                size: A <= 209715200 ? "0-200MB" : A <= 524288e3 ? "200MB-500MB" : A <= 1073741824 ? "500MB-1GB" : A <= 2147483648 ? "1GB-2GB" : A <= 5368709120 ? "2GB-5GB" : A <= 10737418240 ? "5GB-10GB" : "10GB+",
                                                duration: i,
                                                type: t
                                            }
                                        }(u.size, null == k ? void 0 : k.durationMs, u.type),
                                        enable_upload_bg: l,
                                        layoutAspectRatio: o,
                                        skipSlicing: null == R ? void 0 : R.skipSlicing,
                                        genre: null == R ? void 0 : R.genre,
                                        model: null == R ? void 0 : R.model,
                                        narratives: (null == R ? void 0 : R.model) === "ClipAnything" ? null == R ? void 0 : R.narrativeKeys : [],
                                        brandTemplateId: a.brandTemplateId,
                                        customPrompt: null == R ? void 0 : R.customPrompt,
                                        topicKeywords: null == R ? void 0 : null === (E = R.topicKeywords) || void 0 === E ? void 0 : E.join(","),
                                        trigger: m,
                                        sample: a.videoUrl === K.zj,
                                        enableAutoHook: null == R ? void 0 : R.enableAutoHook
                                    }), {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    }), R && R.topicKeywords.length > 0 && h({
                                        type: "keywords",
                                        content: {
                                            id: U,
                                            content: R.topicKeywords.join(",")
                                        }
                                    }), (0, d.X)(null === (Q = A.user) || void 0 === Q ? void 0 : Q.email, {
                                        LAST_PROJECT_SUBMISSION: (0, p.zO)(),
                                        PROJECT_LATEST_LINK: "".concat(window.location.origin, "/clip/").concat(encodeURIComponent(U), "?").concat((0, f.I)(g).toString())
                                    })
                                } catch (A) {
                                    console.error(A)
                                }
                                return setTimeout(() => {
                                    B()
                                }, 2e3), F(U), U
                            } catch (e) {
                                let A = e.message;
                                throw "NotAuthorizedError" === e.name && U(), "InsufficientCreditError" === e.name && (A = "You don't have enough credits to cover the full video length. Please specify a timeframe below, or purchase more credits."), (0, s.B)("user.project.submit.error", {
                                    errorName: e.name,
                                    errorMessage: A
                                }), e
                            }
                        })
                    }
                };

            function Q(A) {
                let {
                    link: e,
                    localVideoId: t,
                    thirdPartyFile: i,
                    skipRequest: n = !1,
                    onCreate: r
                } = A, [a, c] = (0, l.useState)(""), [u, d] = (0, l.useState)(!1), p = (0, o.Dv)(y.Z.utm), {
                    createProject: m
                } = E(), {
                    enableUploadBg: x
                } = (0, C.H)(), [K] = (0, h.US)(), b = (0, o.Dv)(F.E2.preferenceModel), U = (0, o.Dv)(F.E2.disableAutoHook), [I, Q] = (0, o.KO)(F.E2.insufficientCreditsErrorTime), j = (0, o.Dv)(F.E2.preferenceSkipSlicing), S = (0, o.Dv)(F.E2.preferenceNarrative), L = (0, o.Dv)(F.E2.preferencePrompt), R = (0, o.Dv)(F.E2.preferenceRanges), k = (0, o.Dv)(F.E2.rangesChanged), q = (0, o.Dv)(F.E2.brandTemplateId), O = (0, o.Dv)(F.E2.preferenceClipLengths), D = (0, o.Dv)(F.E2.preferenceGenre), P = (0, o.Dv)(F.E2.renderPreference), N = (0, o.Dv)(F.E2.preferenceSkipCurate), Z = (0, o.Dv)(F.E2.submitUseCase), [M, V] = (0, o.KO)(w.T.needBuyMore), T = (0, o.Dv)(w.T.totalCreditInSecond), Y = R && R[1] - R[0] < (T || 0);
                (0, l.useEffect)(() => {
                    V(!1)
                }, []), (0, l.useEffect)(() => {
                    c("")
                }, [e, t, null == i ? void 0 : i.file, Y]);
                let H = (0, o.Dv)(B.D.debugNeedBuyMore);
                return {
                    getClipsHandler: (0, v.Z)(async A => {
                        c("");
                        let {
                            size: o,
                            type: l,
                            uploadedVideoAttr: a,
                            importPref: u,
                            trigger: h
                        } = A;
                        d(!0);
                        try {
                            if (H) throw {
                                name: "InsufficientCreditError",
                                message: "You don't have enough credits to cover the full video length. Please specify a timeframe below, or purchase more credits."
                            };
                            let A = function(A, e, t, i, n, o, l, r, a, s) {
                                    let c = t ? {
                                            startSec: null == e ? void 0 : e[0],
                                            endSec: null == e ? void 0 : e[1]
                                        } : void 0,
                                        u = [...i].sort((A, e) => A[0] - e[0]);
                                    return {
                                        model: null != A ? A : "ClipBasic",
                                        range: c,
                                        clipDurations: n ? [] : u,
                                        topicKeywords: [],
                                        skipSlicing: n,
                                        skipCurate: a,
                                        genre: o,
                                        customPrompt: l,
                                        narrativeKeys: "ClipAnything" === A ? r.map(A => A.key) : void 0,
                                        enableAutoHook: s
                                    }
                                }(b, R, k, O, j, D, L, S, N, K && !j && !U),
                                c = (0, f.I)(p);
                            if (n) {
                                var v;
                                (0, s.B)("user.localvideo.submit", {
                                    enable_upload_bg: x,
                                    file_type: l,
                                    video_size: o,
                                    duration: (null !== (v = null == a ? void 0 : a.durationMs) && void 0 !== v ? v : 0) / 1e3,
                                    title: null == a ? void 0 : a.title,
                                    url: t,
                                    trigger: h
                                }, {
                                    platform: {
                                        MP: !0,
                                        SS: !0
                                    }
                                }), r(t, c, {
                                    videoUrl: t,
                                    utm: p,
                                    importPref: u,
                                    curationPref: A,
                                    uploadedVideoAttr: a,
                                    renderPref: P,
                                    brandTemplateId: q,
                                    conclusionActions: void 0
                                }), d(!1);
                                return
                            }
                            let C = {
                                    videoUrl: i ? (0, g.l)(i) : t || e,
                                    utm: p,
                                    importPref: u,
                                    curationPref: A,
                                    uploadedVideoAttr: a,
                                    renderPref: P,
                                    brandTemplateId: q,
                                    conclusionActions: void 0,
                                    useCase: Z
                                },
                                y = {
                                    name: C.videoUrl,
                                    url: C.videoUrl,
                                    size: o || 0,
                                    type: l || "",
                                    duration: (null == a ? void 0 : a.durationMs) ? a.durationMs / 1e3 : 0
                                },
                                w = await m(C, y, h);
                            w && r(w, c)
                        } catch (A) {
                            "InsufficientCreditError" === A.name && (Q(I + 1), V(!0)), c(A.message)
                        }
                        setTimeout(() => {
                            d(!1)
                        }, 500)
                    }),
                    errorMessage: a,
                    isLoading: u,
                    needBuyMore: M
                }
            }

            function j(A, e) {
                var t, i;
                return ((null == e ? void 0 : null === (t = e.range) || void 0 === t ? void 0 : t.endSec) || A) - ((null == e ? void 0 : null === (i = e.range) || void 0 === i ? void 0 : i.startSec) || 0)
            }

            function S(A) {
                let e;
                if (A <= 1800) e = "0-30";
                else if (A <= 3600) e = "30-60";
                else {
                    let t = Math.floor(A / 60 / 60);
                    e = "".concat(60 * t, "-").concat((t + 1) * 60)
                }
                return e
            }
        },
        46899: function(A, e, t) {
            "use strict";
            t.d(e, {
                KC: function() {
                    return r
                },
                h1: function() {
                    return s
                },
                zj: function() {
                    return a
                }
            });
            var i = t(752),
                n = t(2784),
                o = t(98614),
                l = t(89640);
            let r = A => "quick_normal" === A || "normal" === A ? 10 : 2,
                a = A => {
                    let {
                        t: e
                    } = (0, o.$G)("clip"), t = (0, i.Dv)(l.E2.preferenceSkipSlicing), r = ((0, i.Dv)(l.E2.submitUseCase), 7200), a = Math.floor(r / 60);
                    return (0, n.useMemo)(() => A ? t ? A > r ? {
                        durationWarning: e("exceed_minute_limit", {
                            upgradeLimit: a
                        }),
                        upgradeLimit: a
                    } : {
                        durationWarning: null,
                        upgradeLimit: a
                    } : A < 60 ? {
                        durationWarning: e("less_than_1_min"),
                        upgradeLimit: a
                    } : {
                        durationWarning: null,
                        upgradeLimit: a
                    } : {
                        durationWarning: null,
                        upgradeLimit: a
                    }, [t, A, a, r, e])
                },
                s = A => {
                    let e = (0, i.Dv)(l.E2.preferenceSkipSlicing);
                    return (0, n.useMemo)(() => A ? e ? Math.min(A, 7200) : A : 0, [e, A])
                }
        },
        3172: function(A, e, t) {
            "use strict";
            t.d(e, {
                c: function() {
                    return n
                }
            });
            var i = t(2784);
            let n = function(A, e) {
                let t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2e3,
                    n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                    [o, l] = (0, i.useState)(0);
                return (0, i.useEffect)(() => {
                    if (n) return;
                    let i = setInterval(() => {
                        A.current && (A.current.placeholder = e[o], l(A => (A + 1) % e.length))
                    }, t);
                    return () => clearInterval(i)
                }, [A, o, e, t, n]), o
            }
        },
        72800: function(A, e, t) {
            "use strict";
            t.d(e, {
                QX: function() {
                    return h
                },
                V8: function() {
                    return f
                },
                vu: function() {
                    return p
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(2784),
                r = t(33414),
                a = t(55975),
                s = t(4267),
                c = t(99211),
                u = t(14127),
                d = t(59511),
                g = t(89640);
            let p = 6,
                f = () => {
                    let {
                        preflightProject: A
                    } = (0, r.Z)(), e = (0, l.useRef)(), t = (0, d.Z)(async i => {
                        let {
                            url: n,
                            count: o,
                            srtUploadId: l
                        } = i;
                        try {
                            let {
                                promise: t,
                                cancel: i
                            } = (0, c.Z)(A({
                                videoUrl: n,
                                srtUploadId: l
                            }, {
                                noRedirect: !0,
                                noErrorToast: !0
                            }));
                            return e.current = i, await t
                        } catch (e) {
                            if ("WaitlistRequiredError" === e.name || "ProxyNotAllowedError" === e.name || "CapacityLimitedError" === e.name || 422 === e.status) throw e;
                            let A = 2e3 * Math.pow(2, o);
                            if (await (0, s.Z)(A), ++o >= p) throw Error("Preflight api timeout");
                            return await t({
                                url: n,
                                count: o,
                                srtUploadId: l
                            })
                        }
                    });
                    return {
                        pollUploadProgress: t,
                        cancelRef: e
                    }
                },
                m = (A, e) => {
                    (0, a.B)("user.preflight.".concat(A), e, {
                        platform: {
                            MP: !0,
                            SS: !0
                        }
                    })
                },
                h = () => {
                    let {
                        pollUploadProgress: A,
                        cancelRef: e
                    } = f(), t = (0, d.Z)(async (t, o) => {
                        try {
                            m("attempt", {
                                trigger: o,
                                preflightType: "local"
                            });
                            let e = await A({
                                    url: t,
                                    count: 0
                                }),
                                [l, r] = (0, u.l)(e.resolution);
                            return m("success", (0, n._)((0, i._)({
                                trigger: o,
                                preflightType: "local"
                            }, e), {
                                width: l,
                                height: r
                            })), (0, n._)((0, i._)({}, e), {
                                width: l,
                                height: r
                            })
                        } catch (A) {
                            throw m("error", {
                                trigger: o,
                                preflightType: "local",
                                message: null == A ? void 0 : A.message,
                                videoUrl: t
                            }), A
                        } finally {
                            var l;
                            null === (l = e.current) || void 0 === l || l.call(e)
                        }
                    });
                    return (0, l.useEffect)(() => {
                        let A = e.current;
                        return () => {
                            null == A || A()
                        }
                    }, []), {
                        preflightPoll: t
                    }
                };
            e.ZP = (A, e, t, i) => {
                let [n, r] = (0, l.useState)(!1), [a, s] = (0, l.useState)(!1), [c, p] = (0, o.KO)(g.E2.localVideoPreflightdata), {
                    preflightPoll: f
                } = h(), m = (0, d.Z)(async (A, e) => {
                    var n, o;
                    if (p({
                            size: e.size,
                            type: e.type,
                            duration: null !== (n = e.duration) && void 0 !== n ? n : 0,
                            title: e.name,
                            errorMessage: "",
                            resolution: "",
                            videoLanguage: "",
                            translationLanguage: void 0,
                            width: 0,
                            height: 0,
                            thumbnailUrl: null !== (o = e.thumbUrl) && void 0 !== o ? o : ""
                        }), i) {
                        s(!0);
                        return
                    }
                    try {
                        r(!0);
                        let i = await f(A, t);
                        s(!0), p({
                            title: e.name,
                            size: e.size,
                            type: e.type,
                            errorMessage: "",
                            resolution: (0, u.Z)(i.resolution, i.definition)[0],
                            duration: i.durationMs / 1e3,
                            videoLanguage: i.videoLanguage,
                            thumbnailUrl: i.thumbnailUrl,
                            translationLanguage: void 0,
                            width: i.width,
                            height: i.height
                        })
                    } catch (A) {
                        p({
                            errorMessage: null == A ? void 0 : A.message,
                            resolution: "",
                            duration: 0,
                            thumbnailUrl: "",
                            title: e.name,
                            type: e.type,
                            size: e.size,
                            videoLanguage: "",
                            translationLanguage: void 0
                        }), s(!1)
                    } finally {
                        r(!1)
                    }
                });
                return (0, l.useEffect)(() => {
                    A && (null == e ? void 0 : e.videoUrl) && (null == e ? void 0 : e.file) && m(e.videoUrl, e.file)
                }, [A, null == e ? void 0 : e.videoUrl, m]), {
                    isLoading: n,
                    canPassPreflight: a,
                    preflightData: c
                }
            }
        },
        35120: function(A, e, t) {
            "use strict";
            t.d(e, {
                n: function() {
                    return s
                },
                p: function() {
                    return c
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(34966),
                l = t(752),
                r = t(2784),
                a = t(89640);
            let s = (A, e) => {
                    if (!A || !e) return;
                    let t = A / e;
                    return 1 === t ? "square" : (0, o.r6)(t, .8) ? "four_five" : t > 1 ? "landscape" : "portrait"
                },
                c = () => {
                    let A = (0, l.Dv)(a.E2.preflightData),
                        e = s(null == A ? void 0 : A.width, null == A ? void 0 : A.height),
                        t = (0, l.b9)(a.E2.renderPreference),
                        [o, c] = (0, r.useState)(!0);
                    return (0, r.useEffect)(() => {
                        e && t(A => (0, n._)((0, i._)({}, A), {
                            layoutAspectRatio: e
                        })), c(!1)
                    }, [e, t]), [o]
                }
        },
        98231: function(A, e, t) {
            "use strict";
            t.d(e, {
                ZP: function() {
                    return B
                },
                cT: function() {
                    return y
                },
                WJ: function() {
                    return w
                }
            });
            var i = t(752),
                n = t(30265),
                o = t(89640),
                l = t(72800),
                r = t(30815),
                a = t(4670),
                s = t(98014),
                c = t(72439),
                u = t(2784),
                d = t(27551),
                g = t(33414),
                p = t(55975),
                f = t(99211),
                m = t(14127),
                h = t(9772),
                v = t(35258),
                x = t(49501),
                C = t(80629),
                K = t(71774);
            let b = (A, e, t, i, n) => {
                    (0, p.B)("user.preflight.error", {
                        videoUrl: A,
                        trigger: e,
                        preflightType: t,
                        message: i,
                        detail: n
                    }, {
                        platform: {
                            MP: !0,
                            SS: !0
                        }
                    })
                },
                y = A => {
                    if (A) switch (A.type) {
                        case "url":
                            return {
                                videoUrl: A.url
                            };
                        case "local":
                            return {
                                videoUrl: A.url,
                                file: A.file
                            };
                        case "thirdPartyFile":
                            return {
                                videoUrl: (0, n.l)(A.file)
                            };
                        default:
                            return
                    }
                },
                w = () => {
                    let [A, e] = (0, i.KO)(o.E2.videoSourceSeed), t = (0, i.b9)(o.E2.thirdVideoPreflightdata), n = (0, i.b9)(o.E2.localVideoPreflightdata);
                    return [A, () => {
                        e(void 0), t(o.CZ), n(o.fA)
                    }, e]
                };

            function B(A, e, t) {
                let n = y(A),
                    w = (0, i.Dv)(o.E2.thirdVideoPreflightdata),
                    B = (0, i.Dv)(o.E2.localVideoPreflightdata),
                    U = (null == A ? void 0 : A.type) === "local",
                    {
                        canPassPreflight: F,
                        isLoading: I
                    } = function(A, e, t, n) {
                        let [l, y] = (0, u.useState)(!1), [w, B] = (0, v.I6)(o.E2.thirdVideoPreflightdata), [U, F] = (0, u.useState)(!1), I = (0, i.Dv)(K.Z.utm), E = (0, i.Dv)(C.a.payStatus), Q = (0, u.useRef)(), j = (0, i.Dv)(C.a.currentOrgAsset), S = null == j ? void 0 : j.plan, {
                            supportedPlatforms: L,
                            allSupportedPlatforms: R,
                            enterpriseSupportedOnly: k
                        } = (0, x.vP)(S), {
                            messageByPlan: q,
                            proMessage: O
                        } = (0, x.Jn)(S, n), {
                            errorMessage: D = ""
                        } = q || {}, {
                            preflightProject: P
                        } = (0, g.Z)(), {
                            run: N
                        } = (0, c.Z)(async () => {
                            if (e) {
                                var A, i, o, l;
                                let c = (null == e ? void 0 : null === (A = e.videoUrl) || void 0 === A ? void 0 : A.startsWith("GDR_")) ? "gdriver" : "url";
                                (0, p.B)("user.preflight.attempt", (0, a._)((0, r._)({}, I), {
                                    paystatus: E,
                                    trigger: t,
                                    preflightType: c,
                                    videoUrl: null !== (i = null == e ? void 0 : e.videoUrl) && void 0 !== i ? i : null
                                }), {
                                    platform: {
                                        MP: !0,
                                        SS: !0
                                    }
                                });
                                let u = (0, s.C)(e.videoUrl),
                                    g = (0, d.oj)(S),
                                    v = u && g && 0 === R.length;
                                if ("url" === c && !v) {
                                    let A = (0, s.g)(e.videoUrl, k),
                                        i = (0, s.g)(e.videoUrl, L),
                                        n = (0, s.g)(e.videoUrl, R),
                                        l = null === (o = e.videoUrl) || void 0 === o ? void 0 : o.split("?")[0].toLowerCase().endsWith(".mp4"),
                                        d = {
                                            enterpriseSupportedOnly: k,
                                            supportedPlatforms: L,
                                            allSupportedPlatforms: R
                                        };
                                    if (!u || !n && !l) {
                                        B({
                                            errorMessage: null == O ? void 0 : O.errorMessage
                                        }), F(!1), b(e.videoUrl, t, c, null == O ? void 0 : O.errorMessage, (0, a._)((0, r._)({}, d), {
                                            type: "1"
                                        }));
                                        return
                                    }
                                    if (g && !l && !i) {
                                        B({
                                            errorMessage: D,
                                            errorCode: 2
                                        }), b(e.videoUrl, t, c, D, (0, a._)((0, r._)({}, d), {
                                            type: "2"
                                        })), F(!1);
                                        return
                                    }
                                    if (!g && !i) {
                                        B({
                                            errorMessage: D,
                                            errorCode: A ? 2 : 1
                                        }), b(e.videoUrl, t, c, D, (0, a._)((0, r._)({}, d), {
                                            type: "3"
                                        })), F(!1);
                                        return
                                    }
                                }
                                let x = P(e, {
                                        noErrorToast: !0
                                    }),
                                    {
                                        promise: C,
                                        cancel: K
                                    } = (0, f.Z)(x);
                                Q.current = K;
                                try {
                                    let A = await C,
                                        [e, i] = (0, m.l)(A.resolution);
                                    y(!0), (0, p.B)("user.preflight.success", (0, a._)((0, r._)({}, I), {
                                        paystatus: E,
                                        trigger: t,
                                        preflightType: c,
                                        resolution: A.resolution,
                                        durationMs: A.durationMs,
                                        videoLanguage: A.videoLanguage,
                                        width: e,
                                        height: i
                                    }), {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    }), B({
                                        errorMessage: "",
                                        resolution: (0, m.Z)(A.resolution, A.definition)[0],
                                        isBadQuality: (0, m.Z)(A.resolution, A.definition)[1],
                                        duration: A.durationMs / 1e3,
                                        thumbnailUrl: A.thumbnailUrl,
                                        videoLanguage: A.videoLanguage,
                                        translationLanguage: void 0,
                                        sourcePlatform: A.sourcePlatform,
                                        title: A.title,
                                        width: e,
                                        height: i
                                    })
                                } catch (i) {
                                    let A = i.message;
                                    if (b(e.videoUrl, t, c, A || String(i), {
                                            type: "4"
                                        }), l = e.videoUrl, [/youtube\.com/, /youtu\.be/].some(A => A.test(l))) {
                                        B({
                                            sourcePlatform: "YOUTUBE",
                                            errorMessage: (0, h.KL)(A, n),
                                            errorCode: 3
                                        }), F(!1), y(!1);
                                        return
                                    }
                                    if (A) {
                                        B({
                                            errorMessage: A
                                        });
                                        return
                                    }
                                }
                                F(!1)
                            } else B({
                                errorMessage: "",
                                resolution: "",
                                isBadQuality: !1,
                                duration: 0,
                                thumbnailUrl: "",
                                videoLanguage: ""
                            }), y(!1)
                        }, {
                            wait: 800
                        }), Z = () => {
                            Q.current && Q.current()
                        };
                        return (0, u.useEffect)(() => {
                            if (A) return F(!0), N(), Z
                        }, [A]), {
                            canPassPreflight: l,
                            isLoading: U
                        }
                    }(!!A && !U && !!(null == n ? void 0 : n.videoUrl), n, e, t),
                    {
                        canPassPreflight: E,
                        isLoading: Q
                    } = (0, l.ZP)(U && !!(null == n ? void 0 : n.videoUrl), n, e, !!U && !!(null == A ? void 0 : A.bypass));
                return {
                    seed: A,
                    canPassPreflight: F && !!w.duration || E && !!B.duration,
                    isPreflighting: !!A && (I || Q),
                    preflightData: U ? B : w
                }
            }
        },
        56538: function(A, e, t) {
            "use strict";
            t.d(e, {
                g: function() {
                    return d
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(752),
                l = t(2784),
                r = t(30339),
                a = t(66836),
                s = t(49362),
                c = t(44170),
                u = t(89640);
            let d = {
                    enableBonusClip: !1,
                    enableBRoll: !1,
                    enableVoiceover: !1,
                    enableVoiceEnhancement: !1,
                    enableRemoveFillerWords: !1,
                    enableRemovePauses: !1
                },
                g = {
                    enableCaption: !1,
                    enableEmoji: !1,
                    layoutAspectRatio: "portrait",
                    disableFillLayout: !1,
                    disableFitLayout: !1,
                    enableSplitLayout: !1,
                    enableThreeLayout: !1,
                    enableFourLayout: !1,
                    enableScreenLayout: !1,
                    fitLayoutCropRatio: "",
                    quickstartConfig: d
                },
                p = (0, n._)((0, i._)({}, d), {
                    enableVoiceover: !0,
                    voiceoverParams: {
                        speaker: "Adam",
                        volume: .1,
                        narrativeTone: "Serious",
                        voType: "1"
                    },
                    skipReframe: !0
                }),
                f = {
                    skipRender: !0,
                    enableCaption: !1,
                    enableEmoji: !1,
                    quickstartConfig: (0, n._)((0, i._)({}, d), {
                        skipReframe: !0
                    })
                };
            e.Z = A => {
                let [e, t] = (0, o.KO)(u.E2.preferenceModel), m = (0, o.b9)(u.E2.preferenceSkipSlicing), h = (0, o.b9)(u.E2.preferenceSkipCurate), v = (0, o.b9)(u.E2.submitUseCase), [x, C] = (0, o.KO)(u.E2.renderPreference), K = (0, o.b9)(u.E2.brandTemplateId), b = (0, l.useRef)(e), y = (0, l.useRef)(x), [w] = (0, a.Lg)(), B = (0, o.Dv)(c.t.brollCreditsCost), {
                    exceedLimit: U
                } = (0, r.dR)(), F = (0, l.useMemo)(() => ({
                    enableBonusClip: !1,
                    enableBRoll: !0,
                    enableVoiceover: !1,
                    bRollParams: (0, i._)({
                        type: "genAI"
                    }, w && B && {
                        maxNumber: B
                    }),
                    skipReframe: !0
                }), [w, B]), {
                    featureOn: I
                } = (0, s.O)({
                    featureKey: "VoiceEnhancement"
                });
                (0, l.useEffect)(() => {
                    switch (A) {
                        case "caption":
                            t("ClipBasic"), m(!0), K(""), C((0, n._)((0, i._)({}, x), {
                                quickstartConfig: (0, n._)((0, i._)({}, d), {
                                    skipReframe: !0
                                })
                            }));
                            break;
                        case "reframe":
                            t("ClipBasic"), m(!0), K(""), C(g);
                            break;
                        case "broll":
                            t("ClipBasic"), m(!0), K(""), C({
                                quickstartConfig: F
                            });
                            break;
                        case "voiceover":
                            t("ClipBasic"), m(!0), K(""), C({
                                quickstartConfig: p
                            });
                            break;
                        case "enhance_speech":
                            t("ClipBasic"), m(!0), K(""), C({
                                enableCaption: !1,
                                enableEmoji: !1,
                                quickstartConfig: (0, n._)((0, i._)({}, d), {
                                    enableVoiceEnhancement: !U && I,
                                    enableRemoveFillerWords: !0,
                                    enableRemovePauses: !0,
                                    skipReframe: !0
                                })
                            });
                            break;
                        case "quick_editor":
                            t("ClipBasic"), m(!0), h(!0), v("quickstart_long_to_long"), K(""), C(f)
                    }
                }, [A, U]), (0, l.useEffect)(() => (b.current = e, y.current = x, () => {
                    t(b.current), C(y.current), h(!1), v(void 0)
                }), [])
            }
        },
        28281: function(A, e, t) {
            "use strict";
            t.d(e, {
                KC: function() {
                    return a
                },
                kq: function() {
                    return l
                },
                v4: function() {
                    return s
                },
                vy: function() {
                    return r
                }
            });
            var i = t(91107),
                n = t(27526);
            let o = ["youtube-thumbnail-maker", "transcript-maker", ...Array.from(new Set(Object.values(t(55395).qK).map(A => {
                var e;
                return null === (e = n.dy[A]) || void 0 === e ? void 0 : e.slug
            }).filter(A => "string" == typeof A && A.length > 0)))];

            function l(A) {
                return ["caption", "reframe", "broll", "voiceover", "enhance_speech", "quick_editor"].some(e => A.includes(e)) || o.some(e => A.includes(e))
            }
            let r = A => ["broll", "caption", "enhance_speech", "reframe", "voiceover"].includes(A);

            function a(A) {
                return {
                    quick_normal: {
                        title: A("clip:turn_long_shorts"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-normal.png"),
                        iconImg: "".concat(i.Gw, "/workflow/icon-normal-quick-start.png"),
                        tooltip: A("clip:upload_started"),
                        iconTooltip: A("clip:ai_finds"),
                        iconDesc: A("clip:long_to_shorts"),
                        workflowType: "quick_normal"
                    },
                    caption: {
                        title: A("clip:add_captions"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-caption-only.png"),
                        iconImg: "".concat(i.Gw, "/workflow/icon-caption-quick-start.png"),
                        iconDesc: A("clip:ai_captions"),
                        iconTooltip: A("clip:add_stylish"),
                        workflowType: "caption"
                    },
                    reframe: {
                        title: A("clip:reframe_video"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-reframe-only.png"),
                        iconImg: "".concat(i.Gw, "/workflow/icon-reframe-quick-start.png"),
                        iconDesc: A("clip:ai_reframe"),
                        iconTooltip: A("clip:ai_auto_reframe"),
                        workflowType: "reframe"
                    },
                    broll: {
                        title: A("clip:add_b_roll"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-broll-only.png"),
                        iconImg: "".concat(i.Gw, "/workflow/icon-broll-quick-start.png"),
                        iconDesc: A("common:ai_broll"),
                        iconTooltip: A("clip:add_ai_b_roll"),
                        workflowType: "broll"
                    },
                    voiceover: {
                        title: A("clip:voice_over"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-voiceover-only.png"),
                        iconImg: "".concat(i.Gw, "/workflow/icon-voiceover-quick-start.png"),
                        iconDesc: A("common:ai_hook"),
                        iconTooltip: A("clip:voice_over_tip"),
                        workflowType: "voiceover"
                    },
                    enhance_speech: {
                        title: A("clip:enhance_speech"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-enhancement-only.png"),
                        iconImg: "".concat(i.Gw, "/workflow/icon-enhancement-quick-start.png"),
                        iconDesc: A("clip:enhance_speech"),
                        iconTooltip: A("clip:enhance_voice_tip"),
                        workflowType: "enhance_speech"
                    },
                    quick_editor: {
                        title: A("clip:upload_video_editor"),
                        cover: "".concat(i.Gw, "/workflow/quick-start-editor.png"),
                        iconImg: "".concat(i.Gw, "/result-page/edit-icon.png"),
                        iconDesc: A("clip:icon_video_editor"),
                        iconTooltip: A("clip:icon_upload_video_free"),
                        workflowType: "quick_editor"
                    }
                }
            }
            let s = (A, e) => [a(e).quick_normal, a(e).caption, !A && a(e).quick_editor, !A && a(e).enhance_speech, a(e).reframe, !A && a(e).broll, !A && a(e).voiceover].filter(Boolean)
        },
        63453: function(A, e, t) {
            "use strict";
            t.d(e, {
                L: function() {
                    return K
                },
                b: function() {
                    return C
                }
            });
            var i = t(57992),
                n = t(752),
                o = t(2784),
                l = t(98614),
                r = t(27551),
                a = t(77985),
                s = t(55975),
                c = t(72854),
                u = t(31037),
                d = t(59511),
                g = t(30933),
                p = t(2871),
                f = t(82469),
                m = t(80629),
                h = t(89640),
                v = t(61273),
                x = t(46899);
            let C = () => {
                    let A = (0, n.Dv)(m.a.currentOrgAsset),
                        e = (0, r.oj)(null == A ? void 0 : A.plan),
                        t = null == A ? void 0 : A.isEnterprise,
                        i = (0, n.Dv)(h.E2.submitUseCase),
                        [l, a] = (0, o.useMemo)(() => "quickstart_long_to_long" === i ? [1, !1] : e || t ? [30, !1] : [10, !0], [e, t, i]);
                    return [l, a]
                },
                K = A => {
                    var e, t;
                    let {
                        onStart: n,
                        onError: o,
                        onProgress: r,
                        onSuccess: m,
                        onCancel: h,
                        workflow: K = "normal"
                    } = A, {
                        t: b
                    } = (0, l.$G)("clip"), {
                        createUploadLink: y
                    } = (0, a.Z)(), {
                        openUpsellWindow: w
                    } = (0, p.w)(), [B, U] = C(), F = (0, x.KC)(K), {
                        enableUploadBg: I,
                        setSupportUploadBg: E
                    } = (0, g.H)(), {
                        addUploadTask: Q,
                        deleteUploadTask: j,
                        currentUploadTask: S
                    } = (0, v.K)(), {
                        startTask: L
                    } = (0, f.K)(), R = (0, d.Z)(() => {
                        w({
                            switchType: "plan",
                            trigger: "local-upload-limit",
                            ads: "background"
                        }), i.Am.dismiss()
                    }), k = (0, d.Z)(A => {
                        if (A.size > 1073741824 * B) {
                            let A = b("size_exceeds_limit_max", {
                                maxFileSizeGb: B
                            });
                            return U ? i.Am.warning(A, {
                                duration: 1 / 0,
                                action: {
                                    label: b("upgrade_plans"),
                                    onClick: R
                                }
                            }) : i.Am.warning(A), !1
                        }
                        return !!(0, u.DQ)(u.LN, A.type) || (i.Am.warning(b("file_type_error", {
                            fileType: A.type
                        })), !1)
                    }), q = (0, d.Z)(async function(A) {
                        let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "select",
                            t = null;
                        try {
                            let l, a = 0,
                                d = "";
                            if (I ? ([d, a, l] = await (0, u.hP)(A), a || d ? E(!0) : ((0, s.B)("user.localvideo.pre_upload_error", {
                                    message: l,
                                    file_name: A.name,
                                    video_size: A.size,
                                    upload_type: e,
                                    enable_upload_bg: !0
                                }, {
                                    platform: {
                                        MP: !0,
                                        SS: !0
                                    }
                                }), E(!1))) : a = await (0, u.MO)(A), a > 3600 * F) {
                                let A = (a / 3600).toFixed(1);
                                i.Am.warning(b("exceeds_limit_hours", {
                                    currentHours: A,
                                    maxDurationHours: F
                                }));
                                return
                            }
                            let {
                                url: g,
                                uploadId: p
                            } = await y({
                                type: "Upload",
                                usecase: "LocalUpload"
                            });
                            t = p;
                            let f = {
                                duration: a,
                                size: A.size,
                                name: A.name,
                                type: A.type,
                                url: t,
                                thumbUrl: d
                            };
                            await Q({
                                file: A,
                                payload: f,
                                url: g,
                                onStart: t => {
                                    c.Y.count("user.localvideo.on_upload"), (0, s.B)("user.localvideo.onUpload", {
                                        video_length: a,
                                        video_size: A.size,
                                        upload_type: e,
                                        enable_upload_bg: I
                                    }, {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    }), null == n || n(t)
                                },
                                onProgress: r,
                                onError: t => {
                                    c.Y.count("user.localvideo.error"), (0, s.B)("user.localvideo.error", {
                                        message: t.message,
                                        video_size: A.size,
                                        upload_type: e,
                                        enable_upload_bg: I
                                    }, {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    }), i.Am.warning(t.message), null == o || o(t)
                                },
                                onSuccess: i => {
                                    c.Y.count("user.localvideo.on_upload_success"), (0, s.B)("user.localvideo.onUploadSuccess", {
                                        video_length: a,
                                        video_size: A.size,
                                        upload_type: e,
                                        enable_upload_bg: I
                                    }, {
                                        platform: {
                                            MP: !0,
                                            SS: !0
                                        }
                                    }), I && t && L(t), !I && t && j(t), null == m || m(i)
                                }
                            })
                        } catch (t) {
                            null == o || o(t), i.Am.warning(t.message), (0, s.B)("user.localvideo.error", {
                                message: t.message,
                                video_size: null == A ? void 0 : A.size,
                                upload_type: e,
                                enable_upload_bg: I
                            }, {
                                platform: {
                                    MP: !0,
                                    SS: !0
                                }
                            })
                        }
                    }), O = (0, d.Z)(() => {
                        (null == S ? void 0 : S.uploadId) && ((0, s.B)("user.localvideo.dropout", {
                            trigger: "upload"
                        }, {
                            platform: {
                                MP: !0,
                                SS: !0
                            }
                        }), j(null == S ? void 0 : S.uploadId), null == h || h())
                    });
                    return {
                        isUploading: (null == S ? void 0 : S.status) === "uploading" || (null == S ? void 0 : S.status) === "start",
                        leftTime: null !== (e = null == S ? void 0 : S.leftTime) && void 0 !== e ? e : 0,
                        progress: null !== (t = null == S ? void 0 : S.progress) && void 0 !== t ? t : 0,
                        uploadFile: null == S ? void 0 : S.file,
                        upload: async (A, e) => {
                            k(A) && await q(A, e)
                        },
                        handleCancelUpload: O,
                        handleBeforeUpload: k,
                        handleTriggerUpload: q
                    }
                }
        },
        25074: function(A, e, t) {
            "use strict";
            t.d(e, {
                RJ: function() {
                    return N
                },
                Es: function() {
                    return M
                },
                mm: function() {
                    return J
                },
                zP: function() {
                    return G
                },
                _D: function() {
                    return W
                },
                kg: function() {
                    return _
                },
                E5: function() {
                    return V
                },
                jZ: function() {
                    return Z
                },
                Ff: function() {
                    return T
                },
                Jn: function() {
                    return z
                },
                eT: function() {
                    return Y
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(57992),
                l = t(42180),
                r = t(4182),
                a = t(965),
                s = t(28879),
                c = t.n(s),
                u = t(752),
                d = t(69835),
                g = t(8718),
                p = t(2784),
                f = t(41748),
                m = t(15377),
                h = t(77606),
                v = t(2404),
                x = t(55975);
            let C = {
                YOUTUBE: "YouTube",
                TIKTOK_BUSINESS: "TikTok",
                TIKTOK_USER: "TikTok",
                LINKEDIN: "LinkedIn",
                FACEBOOK_PAGE: "Facebook Page",
                TWITTER: "X",
                INSTAGRAM_BUSINESS: "Instagram"
            };
            var K = t(59511),
                b = t(85682),
                y = t(18285),
                w = t(46688),
                B = t(3250),
                U = t(15905),
                F = t(87558),
                I = t(80629),
                E = t(55773),
                Q = t(71774),
                j = t(50480),
                S = t(6932),
                L = t(82132);
            let R = "/post-tasks",
                k = "/social-accounts",
                q = "/publish-schedules",
                O = "/exportable-clips",
                D = "/social-copy/prompt",
                P = (A, e) => {
                    A.sort((A, t) => {
                        let i = (0, a.Z)(A.publishAt).getTime() - (0, a.Z)(t.publishAt).getTime();
                        return 0 === i && e && 0 !== e.length ? e.findIndex(e => e.platform === A.platform && e.extUserId === A.extUserId && (!A.subAccountId || e.subAccountId === A.subAccountId)) - e.findIndex(A => A.platform === t.platform && A.extUserId === t.extUserId && (!t.subAccountId || A.subAccountId === t.subAccountId)) : i
                    })
                },
                N = () => {
                    let A = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)();
                    return {
                        fetchPostTask: async t => {
                            let i = g.Z.stringify(t);
                            return await e("".concat(A).concat(R, "?").concat(i), {
                                method: "GET"
                            })
                        }
                    }
                },
                Z = A => {
                    let {
                        qs: e,
                        timezone: t,
                        format: o = "YYYY-MM-DD"
                    } = A, {
                        startAt: r,
                        endAt: a,
                        q: s
                    } = e, c = (0, u.Dv)(F.K.nestApiPrefix), {
                        clipApiHeaderWrapper: d
                    } = (0, m.m)(), {
                        selectedAccountListV2: f
                    } = V(), h = async A => {
                        let e = [],
                            t = async o => {
                                var l;
                                let r = o ? (0, n._)((0, i._)({}, A), {
                                        page: o
                                    }) : A,
                                    a = g.Z.stringify(r),
                                    {
                                        data: s
                                    } = await d("".concat(c).concat(R, "?").concat(a), {
                                        method: "GET"
                                    }, {
                                        noErrorToast: !0
                                    });
                                e = [...e, ...s.data], (null == s ? void 0 : null === (l = s.meta) || void 0 === l ? void 0 : l.nextPage) && s.meta.total === A.size && await t(s.meta.nextPage)
                            };
                        return await t(), P(e, f), null != e ? e : []
                    }, {
                        data: v,
                        isLoading: x,
                        refetch: C
                    } = (0, l.a)({
                        queryKey: [R, r, a, f, s],
                        queryFn: () => h(e),
                        refetchOnWindowFocus: !1
                    }), K = (0, p.useMemo)(() => {
                        var A;
                        return null !== (A = (0, L.vM)(o, t)(v)) && void 0 !== A ? A : {}
                    }, [v, t, o]), b = (0, p.useMemo)(() => {
                        let A = {};
                        return v && Object.entries(K).forEach(e => {
                            let [t, i] = e;
                            A[t] = null == i ? void 0 : i.filter(A => null == f ? void 0 : f.some(e => {
                                var t, i;
                                return (0, L._0)(e.platform, e.extUserId, null !== (t = e.subAccountId) && void 0 !== t ? t : "") === (0, L._0)(A.platform, A.extUserId, null !== (i = A.subAccountId) && void 0 !== i ? i : "")
                            }))
                        }), A
                    }, [v, K, f]);
                    return {
                        dataMap: null != K ? K : {},
                        dataMapWithAccount: b,
                        isDateCardListLoading: x,
                        refetchPostTask: C
                    }
                },
                M = A => {
                    let {
                        qs: e
                    } = A, t = (0, u.Dv)(F.K.apiPrefix), {
                        clipApiHeaderWrapper: i
                    } = (0, m.m)(), n = async A => {
                        let e = g.Z.stringify(A);
                        return (await i("".concat(t).concat(O, "?").concat(e), {
                            method: "GET"
                        }, {
                            noErrorToast: !0
                        })).data
                    }, {
                        data: o,
                        isLoading: r
                    } = (0, l.a)({
                        queryKey: [O, e.projectId],
                        queryFn: () => n(e),
                        enabled: !!e.projectId,
                        retry: !1,
                        refetchOnWindowFocus: !1
                    });
                    return {
                        clips: (0, f.p9)(null != o ? o : []),
                        isClipLoading: r
                    }
                },
                V = () => {
                    let A = (0, u.Dv)(F.K.planSocialApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)(),
                        t = async () => {
                            let {
                                data: t
                            } = await e("".concat(A).concat(k, "?q=mine"), {
                                method: "GET"
                            }, {
                                noErrorToast: !0
                            });
                            return t
                        },
                        {
                            data: i,
                            refetch: n,
                            isFetching: o,
                            isFetched: a
                        } = (0, l.a)({
                            queryKey: [k],
                            queryFn: () => t(),
                            refetchOnWindowFocus: !1
                        }),
                        {
                            mutateAsync: s
                        } = (0, r.D)({
                            mutationFn: async t => {
                                if (["FACEBOOK_PAGE", "INSTAGRAM_BUSINESS", "LINKEDIN"].includes(t.platform) && !t.subAccountId) {
                                    let A = f.find(A => A.platform === t.platform);
                                    t.subAccountId = A.subAccountId
                                }
                                await e("".concat(A, "/social-accounts"), {
                                    method: "DELETE",
                                    body: JSON.stringify(t)
                                })
                            }
                        }),
                        {
                            mutateAsync: c
                        } = (0, r.D)({
                            mutationFn: async t => {
                                await e("".concat(A, "/social-accounts/select-sub-accounts"), {
                                    method: "POST",
                                    body: JSON.stringify({
                                        param: t
                                    })
                                })
                            }
                        }),
                        d = (0, p.useMemo)(() => {
                            var A;
                            return null !== (A = null == i ? void 0 : i.filter(A => !A.subAccountId || A.selected)) && void 0 !== A ? A : []
                        }, [i]),
                        g = new Set;
                    d.forEach(A => {
                        g.add("".concat(A.platform, "-").concat(A.extUserId))
                    });
                    let f = Array.from(g).map(A => {
                        let [e, t] = A.split("-");
                        return d.find(A => A.platform === e && A.extUserId === t)
                    });
                    return {
                        refetchAccounts: async () => {
                            await n()
                        },
                        selectedAccountListV2: d,
                        accountListV2: i,
                        deleteAccount: s,
                        selectSubAccount: c,
                        firstSelectedAccountV2: f,
                        isFetching: o,
                        isFetched: a
                    }
                },
                T = A => {
                    let e = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: t
                        } = (0, m.m)(),
                        n = g.Z.stringify((0, i._)({
                            q: "findByProjectAndClip"
                        }, A)),
                        o = async () => {
                            let {
                                data: A
                            } = await t("".concat(e).concat(q, "?").concat(n), {
                                method: "GET"
                            });
                            return A
                        },
                        {
                            data: r,
                            refetch: a,
                            isFetching: s,
                            isSuccess: c
                        } = (0, l.a)({
                            queryKey: [q, A.clipId, A.projectId],
                            queryFn: () => o(),
                            enabled: !!A.projectId && !!A.clipId,
                            refetchOnWindowFocus: !1
                        });
                    return {
                        scheduleTasks: r,
                        refetchScheduleTasks: a,
                        isFetchingScheduleTasks: s,
                        isSuccessScheduleTasks: c
                    }
                },
                Y = () => {
                    let A = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)();
                    return {
                        updatePostSchedule: async t => {
                            await e("".concat(A).concat(q), {
                                method: "PUT",
                                body: JSON.stringify(t)
                            })
                        }
                    }
                },
                H = () => {
                    let A = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)();
                    return {
                        deletePostTask: async t => {
                            await e("".concat(A).concat(R, "/").concat(t.postId), {
                                method: "DELETE"
                            })
                        }
                    }
                },
                _ = A => {
                    let {
                        clip: e = {
                            videoId: "",
                            clipId: "",
                            videoUrl: "",
                            videoUrlForDownload: "",
                            text: "",
                            duration: 0,
                            score: 0,
                            rank: 0,
                            title: "",
                            reason: "",
                            paused: !1
                        },
                        projectId: t,
                        extUserProfileLink: l,
                        source: a,
                        openUpsellWindow: s,
                        t: g,
                        timezone: f
                    } = A, {
                        isAuthenticated: m
                    } = (0, b.a)(), {
                        orgId: K
                    } = (0, u.Dv)(E.Mz.userOrgInfo) || {}, {
                        clipId: F,
                        archId: L,
                        score: R,
                        rawScore: k,
                        rank: q
                    } = e, O = (0, u.Dv)(Q.Z.utm), D = (0, u.Dv)(I.a.currentOrgAsset), P = (0, u.b9)(S.ii.showSharereLove), N = (0, p.useMemo)(() => (0, i._)({
                        orgId: K,
                        projectId: t,
                        clipId: F,
                        archId: L,
                        score: R,
                        rawScore: k,
                        rank: q
                    }, O), [K, t, F, L, R, k, q, O]), Z = (0, u.Dv)(j.p2.clipProject(N.projectId)), M = null == D ? void 0 : D.plan, V = (0, y.cw)(N, Z, e), {
                        createAutoPostSchedule: T
                    } = (0, v.Z)(), {
                        recordExported: _
                    } = (0, U.M)(), {
                        mutateAsync: W,
                        isPending: G
                    } = (0, r.D)({
                        mutationFn: async A => {
                            let e = A.map(A => (0, d.Z)(A, "accountName"));
                            return await T("batch", {
                                schedules: e
                            })
                        },
                        onSuccess(A, e) {
                            A.results.forEach((A, i) => {
                                (async () => {
                                    let n = e[i];
                                    if (A.hasConflict) {
                                        var l;
                                        o.Am.warning("Your new post for ".concat(null == n ? void 0 : n.accountName, " (").concat(null !== (l = C[null == n ? void 0 : n.platform]) && void 0 !== l ? l : "", ") will be scheduled one minute later due to platform policies, as there's already an existing post scheduled for the same time."), {
                                            position: "bottom-center"
                                        })
                                    }
                                    m && K && await _(null != t ? t : "", F, "schedulePost", n.platform)
                                })()
                            })
                        }
                    }), {
                        updatePostSchedule: J
                    } = Y(), {
                        mutateAsync: z
                    } = (0, r.D)({
                        mutationFn: async A => {
                            await J(A)
                        }
                    }), {
                        deletePostTask: X
                    } = H(), {
                        mutateAsync: $
                    } = (0, r.D)({
                        mutationFn: async A => {
                            await X(A)
                        }
                    }), {
                        postVideoByPlansocial: AA
                    } = (0, h.Z)(), Ae = (A, e) => {
                        let r = !0;
                        Promise.all(A.map((A, u) => (async () => {
                            var d, p, h, v, C, b, y;
                            let {
                                platform: U,
                                error: I,
                                success: E,
                                errorMsg: Q
                            } = A, j = e[u], S = null == A ? void 0 : A.status;
                            if ((0, x.B)("clip.posted", (0, n._)((0, i._)({}, V), {
                                    platform: U,
                                    success: S ? "success" === S : E,
                                    error: I,
                                    extVideoId: "YOUTUBE" === U ? null == A ? void 0 : A.extVideoId : "",
                                    extUserProfileLink: l,
                                    plan: M,
                                    postFrom: a,
                                    video_source: j.clipId ? "project" : "local",
                                    isPostEdited: !!(null == j ? void 0 : j.isPostEdited),
                                    targetPublishAt: c()().tz(f, !0).format("YYYY-MM-DD HH:mm:ss Z"),
                                    localPublishAt: c()().tz(null === (p = c().tz) || void 0 === p ? void 0 : null === (d = p.guess) || void 0 === d ? void 0 : d.call(p), !0).format("YYYY-MM-DD HH:mm:ss Z"),
                                    aiSocialCopy: {
                                        title: null == j ? void 0 : j.defaultTitle,
                                        description: null == j ? void 0 : j.defaultDescription
                                    },
                                    finalSocialCopy: {
                                        title: null == j ? void 0 : null === (h = j.postDetail) || void 0 === h ? void 0 : h.title,
                                        description: null == j ? void 0 : null === (C = j.postDetail) || void 0 === C ? void 0 : null === (v = C.custom) || void 0 === v ? void 0 : v.description
                                    }
                                }), {
                                    platform: {
                                        MP: !0,
                                        SS: !0
                                    }
                                }), (0, x.B)("clip.exported", (0, n._)((0, i._)({}, V), {
                                    type: "post"
                                }), {
                                    platform: {
                                        MP: !0,
                                        SS: !0
                                    }
                                }), m && K && await _(null != t ? t : "", F, "post", U), "success" === S || "pending" === S) return;
                            r = !1;
                            let L = I && (null === (y = (0, B.k)(g)[U]) || void 0 === y ? void 0 : null === (b = y.error) || void 0 === b ? void 0 : b[I]) || "".concat(g("plansocial:failed_to_post_to"), " ").concat((0, w.y8)(U), ". ").concat(Q);
                            if ("trial user quota not enough" === Q) {
                                null == s || s({
                                    upsellTitle: "Upgrade to continue scheduling",
                                    switchType: "plan",
                                    trigger: "autopost-rate-limit",
                                    ads: "autopost"
                                });
                                return
                            }
                            "RejectForTwitterRateLimitError" === A.error ? o.Am.warning(L, {
                                duration: 1e4
                            }) : o.Am.warning(L)
                        })())).then(() => {
                            r && (o.Am.success(g("plansocial:posted_success"), {
                                style: {
                                    color: "#3DD68C",
                                    borderColor: "#3DD68C"
                                }
                            }), P(!0))
                        })
                    }, {
                        mutateAsync: At,
                        isPending: Ai
                    } = (0, r.D)({
                        mutationFn: AA,
                        onSuccess(A, e) {
                            Ae(A.data, e)
                        },
                        onError(A, e) {
                            e.forEach(e => {
                                (0, x.B)("clip.posted", (0, n._)((0, i._)({}, V), {
                                    platform: e.platform,
                                    success: !1,
                                    error: "clip api internal error: ".concat(A.message),
                                    extVideoId: "",
                                    extUserProfileLink: l,
                                    plan: M,
                                    postFrom: a,
                                    video_source: e.clipId ? "project" : "local"
                                }), {
                                    platform: {
                                        MP: !0,
                                        SS: !0
                                    }
                                })
                            })
                        }
                    });
                    return {
                        createScheduleTask: W,
                        isCreatingScheduleTask: G,
                        updateScheduleTask: z,
                        deletePostTask: $,
                        postVideos: At,
                        isPosting: Ai
                    }
                },
                W = () => {
                    let A = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)();
                    return async t => {
                        let i = g.Z.stringify(t);
                        return await e("".concat(A).concat("/plan-social-upload-links", "?").concat(i), {
                            method: "GET"
                        })
                    }
                },
                G = A => {
                    let e = (0, n._)((0, i._)({}, A), {
                            q: "findByProjectId"
                        }),
                        t = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: o
                        } = (0, m.m)(),
                        r = async A => {
                            let e = g.Z.stringify(A);
                            return await o("".concat(t).concat(R, "?").concat(e), {
                                method: "GET"
                            })
                        },
                        a = (0, l.a)({
                            queryKey: [R, e],
                            queryFn: () => r(e),
                            enabled: !!(null == e ? void 0 : e.projectId) && !!(null == e ? void 0 : e.q),
                            refetchOnWindowFocus: !1
                        });
                    return (0, i._)({}, a)
                },
                J = () => {
                    let A = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)(),
                        t = (0, K.Z)(async t => await e("".concat(A).concat("/social-copy"), {
                            method: "POST",
                            body: JSON.stringify({
                                requests: t
                            })
                        }));
                    return (0, K.Z)(async A => {
                        if (!(null == A ? void 0 : A.length)) return {
                            results: []
                        };
                        let e = new Map;
                        return A.forEach(A => {
                            var t, i;
                            let n = "".concat(null !== (t = A.projectId) && void 0 !== t ? t : "", ":").concat(null !== (i = A.curationId) && void 0 !== i ? i : ""),
                                o = e.get(n);
                            o ? o.push(A) : e.set(n, [A])
                        }), {
                            results: (await Promise.all([...e.values()].map(A => t(A)))).flatMap(A => {
                                var e;
                                return null !== (e = A.results) && void 0 !== e ? e : []
                            })
                        }
                    })
                },
                z = () => {
                    let A = (0, u.Dv)(F.K.nestApiPrefix),
                        {
                            clipApiHeaderWrapper: e
                        } = (0, m.m)();
                    return {
                        getSocialTextPrompt: (0, K.Z)(async () => await e("".concat(A).concat(D), {
                            method: "GET"
                        })),
                        saveSocialTextPrompt: (0, K.Z)(async t => await e("".concat(A).concat(D), {
                            method: "POST",
                            body: JSON.stringify(t)
                        }))
                    }
                }
        },
        33178: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return c
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(52322),
                l = t(57992);
            t(2784);
            var r = t(98614),
                a = t(28372);
            let s = A => [{
                label: A("all_platforms"),
                value: "ALL"
            }, {
                label: "YouTube",
                value: "YOUTUBE"
            }, {
                label: "TikTok",
                value: "TIKTOK_BUSINESS"
            }, {
                label: "Instagram Business",
                value: "INSTAGRAM_BUSINESS"
            }, {
                label: "Facebook Page",
                value: "FACEBOOK_PAGE"
            }, {
                label: "LinkedIn",
                value: "LINKEDIN"
            }, {
                label: "X",
                value: "TWITTER"
            }];

            function c(A) {
                var e;
                let {
                    setPlatform: t
                } = A, {
                    t: c
                } = (0, r.$G)("plansocial");
                return (0, o.jsx)(l.Ph, (0, i._)({
                    options: null == s ? void 0 : null === (e = s(c)) || void 0 === e ? void 0 : e.map(A => (0, n._)((0, i._)({}, A), {
                        label: (0, o.jsxs)("div", {
                            className: "flex items-center gap-2",
                            children: [a.d[A.value] && (0, o.jsx)("div", {
                                className: "size-4 shrink-0",
                                children: a.d[A.value]
                            }), (0, o.jsx)("div", {
                                className: "shrink text-ellipsis font-sans",
                                children: A.label
                            })]
                        })
                    })),
                    classNames: {
                        popoverContent: "z-[1350]"
                    }
                }, {
                    onChange: A => t(A),
                    defaultValue: "ALL",
                    className: "text-xs text-white w-[160px] px-3 py-0 items-center h-8 bg-transparent"
                }))
            }
        },
        44710: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return r
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(30464),
                l = t(28372);

            function r(A) {
                let {
                    imgSrc: e,
                    name: t,
                    platform: r,
                    sizePx: a = 24
                } = A, s = t ? (0, o.v)(t) : "";
                return (0, i.jsx)("div", {
                    children: (0, i.jsxs)(n.qE, {
                        className: "relative overflow-visible",
                        style: {
                            width: "".concat(a, "px"),
                            height: "".concat(a, "px")
                        },
                        children: [(0, i.jsx)(n.F$, {
                            className: "rounded-full",
                            src: e,
                            alt: "avatar"
                        }), (0, i.jsx)(n.Q5, {
                            children: s
                        }), r && (0, i.jsx)("div", {
                            className: "border-border absolute -bottom-1 -right-1 size-4 rounded-full border max-sm:bottom-0 max-sm:right-0",
                            children: l.d[r]
                        })]
                    })
                })
            }
        },
        6104: function(A, e, t) {
            "use strict";
            t.d(e, {
                K: function() {
                    return a
                },
                Q: function() {
                    return r
                }
            });
            var i = t(28879),
                n = t.n(i),
                o = t(89671),
                l = t(49362);
            let r = A => {
                    let {
                        featureOn: e
                    } = (0, l.O)({
                        featureKey: "SocialMediaScheduler",
                        featureValueList: A
                    }), t = [...A], [i, n] = (0, o.Ek)("post-facebook_page_whitelist");
                    i && !n && (t = t.filter(A => "FACEBOOK_PAGE" !== A));
                    let {
                        featureOn: r
                    } = (0, l.O)({
                        featureKey: "SocialMediaPlatform",
                        featureValueList: t
                    }), {
                        featureOn: a
                    } = (0, l.O)({
                        featureKey: "SocialMediaPublish",
                        featureValueList: t
                    });
                    return {
                        scheduleFeatureOn: e,
                        publishFeatureOn: a,
                        platformFeatureOn: r
                    }
                },
                a = (A, e) => Intl.supportedValuesOf("timeZone").map(t => {
                    let i = n()(A).tz(t).format("([GMT]Z)").replace(/([+-]\d{2}):(\d{2})/, "$1");
                    return {
                        label: e("timezone.".concat(function(A) {
                            let e = A.split("/");
                            return e[e.length - 1].toLowerCase()
                        }(t))) + i,
                        value: t
                    }
                })
        },
        82132: function(A, e, t) {
            "use strict";
            t.d(e, {
                VL: function() {
                    return r
                },
                Xr: function() {
                    return l
                },
                _0: function() {
                    return o
                },
                vM: function() {
                    return a
                }
            });
            var i = t(28879),
                n = t.n(i);

            function o(A, e, t) {
                return "".concat(A, "~").concat(e, "~").concat(t)
            }

            function l(A, e, t, i) {
                return "".concat(A, "~").concat(e, "~").concat(t, "~").concat(i)
            }

            function r(A) {
                let [e, t, i] = A.split("~");
                return {
                    platform: e,
                    extUserId: t,
                    subAccountId: i
                }
            }
            let a = (A, e) => t => {
                var i, o;
                return null !== (o = null == t ? void 0 : null === (i = t.reduce) || void 0 === i ? void 0 : i.call(t, (t, i) => {
                    let o = n()(new Date(i.publishAt)).tz(e).format(A);
                    return t[o] || (t[o] = []), t[o].push(i), t
                }, {})) && void 0 !== o ? o : []
            }
        },
        59451: function(A, e, t) {
            "use strict";
            t.d(e, {
                QZ: function() {
                    return h
                },
                ZP: function() {
                    return d
                }
            });
            var i = t(52322),
                n = t(57992),
                o = t(43681),
                l = t(34678),
                r = t(80993),
                a = t(2784),
                s = t(98614),
                c = t(71787),
                u = t(19810);

            function d(A) {
                let {
                    expectedLanguage: e,
                    expectedPref: t,
                    onUpdateExpectedLanguage: o,
                    onUpdateExpectedPref: l
                } = A, {
                    t: r
                } = (0, s.$G)("clip");
                return (0, i.jsxs)("div", {
                    className: "flex flex-row flex-wrap items-center justify-center gap-6",
                    children: [(0, i.jsx)(h, {
                        expectedLanguage: e,
                        onUpdateExpectedLanguage: o
                    }), (0, i.jsxs)("div", {
                        className: "flex flex-row items-center",
                        children: [(0, i.jsx)(n.ZT, {
                            className: "mr-[4px] text-sm font-semibold",
                            children: r("auto_emoji")
                        }), (0, i.jsx)(n.rs, {
                            checked: t.enableEmoji,
                            onCheckedChange: A => l({
                                enableEmoji: A
                            })
                        })]
                    }), (0, i.jsxs)("div", {
                        className: "flex flex-row items-center",
                        children: [(0, i.jsx)(n.ZT, {
                            className: "mr-[4px] text-sm font-semibold",
                            children: r("keywords_highlight")
                        }), (0, i.jsx)(n.rs, {
                            checked: t.enableHighlight,
                            onCheckedChange: A => l({
                                enableHighlight: A
                            })
                        })]
                    })]
                })
            }
            let g = (0, r.Z)(u.F3),
                p = ["auto"].concat(Object.entries(g).sort((A, e) => A[1].localeCompare(e[1], "en", {
                    sensitivity: "base"
                })).map(A => A[0])),
                f = [void 0, "en"];

            function m(A, e, t) {
                return void 0 === e ? t("no_translation") : "auto" === e ? t("auto") : e in g ? " ".repeat(5) + t("allow_languages.".concat(e), {
                    defaultValue: g[e]
                }) : t("origin" === A ? "auto" : "no_translation")
            }

            function h(A) {
                let {
                    label: e,
                    expectedLanguage: t,
                    onUpdateExpectedLanguage: r
                } = A, {
                    videoLanguage: u,
                    translationLanguage: d
                } = t, {
                    t: g
                } = (0, s.$G)("clip"), h = d ? "".concat(m("origin", u, g), " / ").concat(m("translation", d, g)) : m("origin", u, g), v = (0, a.useMemo)(() => p.map(A => ({
                    value: m("origin", A, g),
                    language: A,
                    selected: A === u
                })), [u, g]), x = (0, a.useMemo)(() => f.map(A => ({
                    value: m("translation", A, g),
                    language: A,
                    selected: A === d
                })), [d, g]);

                function C(A, e, t) {
                    return (0, i.jsxs)("div", {
                        className: "my-3 flex max-h-[280px] shrink-0 grow basis-[100px] flex-col overflow-y-auto overflow-x-hidden sm:max-h-[420px]",
                        children: [(0, i.jsx)(n.ZT, {
                            className: "text-sm",
                            children: t
                        }), (0, i.jsx)(c.Qk, {
                            children: e.map(e => (0, i.jsxs)(c.Xi, {
                                className: "gap-2",
                                onClick: () => {
                                    "origin" === A ? r({
                                        videoLanguage: e.language
                                    }) : r({
                                        translationLanguage: e.language
                                    })
                                },
                                children: [(0, i.jsx)(o.Z, {
                                    visibility: e.selected ? "visible" : "hidden"
                                }), (0, i.jsx)(n.ZT, {
                                    variant: "headings",
                                    className: "text-sm",
                                    children: e.value
                                })]
                            }, e.value))
                        })]
                    })
                }
                return (0, i.jsxs)("div", {
                    className: "flex flex-row items-center max-sm:basis-full max-sm:justify-center",
                    children: [e || (0, i.jsx)(n.ZT, {
                        className: "mr-[4px] text-nowrap text-sm font-semibold",
                        children: g("caption_language")
                    }), (0, i.jsxs)(c.h_, {
                        children: [(0, i.jsx)(c.$F, {
                            asChild: !0,
                            children: (0, i.jsxs)(n.zx, {
                                variant: "base",
                                className: "gap-1 text-white",
                                children: [h, (0, i.jsx)(l.Z, {
                                    strokeWidth: 2
                                })]
                            })
                        }), (0, i.jsx)(c.AW, {
                            className: "w-[372px]",
                            children: (0, i.jsxs)("div", {
                                className: "flex flex-row gap-1",
                                children: [C("origin", v, g("original_from")), C("translation", x, g("translate_to"))]
                            })
                        })]
                    })]
                })
            }
        },
        34411: function(A, e, t) {
            "use strict";
            t.d(e, {
                ZP: function() {
                    return g
                },
                yY: function() {
                    return d
                }
            });
            var i = t(52322),
                n = t(752),
                o = t(2784),
                l = t(17170),
                r = t(8497),
                a = t(97266),
                s = t(42320),
                c = t(45254);
            let u = o.createContext(void 0),
                d = A => {
                    let {
                        children: e,
                        version: t,
                        isNewCaption: d
                    } = A, g = (0, n.b9)(c.r.isNewCaption);
                    return (0, o.useEffect)(() => {
                        g("NG" === t)
                    }, [t, g]), (0, i.jsx)(u.Provider, {
                        value: "LEGACY" === t ? {
                            mainSideBar: {
                                heightType: "partial",
                                containCaption: !1,
                                containBrandTemplate: !1,
                                shouldClearSelectedSections: !1,
                                showNewOnboardingPopup: !1,
                                renderBorder: !0,
                                width: r.K7,
                                enableDeselect: !1,
                                newBadgePosition: "left",
                                enableBolderTitle: !1
                            },
                            timeline: {
                                style: {
                                    width: "calc(100vw - ".concat(r.qi, "px)")
                                },
                                showCleanButton: !0,
                                showHideTimeline: !1,
                                timelineContainerId: l._m
                            },
                            section: {
                                grabSize: {
                                    s: [6, 20],
                                    m: [6, 32]
                                },
                                showLegacyBar: !0,
                                grabBarClassName: "rounded-sm box-border border-white border absolute z-[11] bg-background top-0 bottom-0 m-auto cursor-col-resize",
                                showLegacyStyle: !0,
                                brollPlaceholderClassName: "rounded-lg",
                                audioHeight: s.kO,
                                enableNewAudioHeight: !1,
                                enableNewAiHook: !1
                            },
                            caption: {
                                className: "pl-8",
                                indicatorClassName: "text-xs h-[28px] px-1.5 my-1",
                                indicatorIconClassName: "mr-2",
                                fontStyle: {},
                                width: r.Uq,
                                isNewUx: !!d
                            },
                            assets: {
                                isCloseDisabled: !1,
                                enableResetAfterCleanPauses: !0,
                                enableResetAfterCleanFillerWords: !0,
                                enableMusicTitle: !0,
                                musicFilterWidth: 298,
                                musicFilterWidthInBrandTemplate: 228,
                                uploadButtonWidth: a.Zv,
                                uploadButtonHeight: a.aJ,
                                enableNewUploadButton: !1,
                                enableNewVoiceover: !1,
                                brollCardWidth: 164,
                                brollCardHeight: 96,
                                brollPreviewWidth: "100%",
                                brollPreviewHeight: 194,
                                musicItemWidth: 268,
                                musicProgressWidth: 170,
                                enableNewBroll: !1,
                                enableSmallAutoCensor: !1,
                                enableNewAutoTransitions: !1
                            },
                            render: {
                                enableNewSelector: !1,
                                enableOpenMainSidebar: !1,
                                enableDarkerBg: !1,
                                visibleWindowOffsetX: 0,
                                shouldShrinkCanvas: !1,
                                initialWindowPadding: void 0
                            },
                            common: {
                                showNewStepPopover: !1
                            },
                            version: t
                        } : {
                            mainSideBar: {
                                heightType: "partial",
                                containCaption: !0,
                                containBrandTemplate: !0,
                                shouldClearSelectedSections: !0,
                                showNewOnboardingPopup: !0,
                                renderBorder: !1,
                                width: r.V4,
                                enableDeselect: !0,
                                newBadgePosition: "right",
                                enableBolderTitle: !0
                            },
                            timeline: {
                                style: {
                                    width: "100vw"
                                },
                                showCleanButton: !1,
                                showHideTimeline: !0,
                                timelineContainerId: l.ZC
                            },
                            section: {
                                grabSize: {
                                    s: [12, 12],
                                    m: [16, 16]
                                },
                                showLegacyBar: !1,
                                grabBarClassName: "flex items-center h-full absolute top-0 z-[11] cursor-col-resize",
                                showLegacyStyle: !1,
                                brollPlaceholderClassName: "rounded-md",
                                audioHeight: 40,
                                enableNewAudioHeight: !0,
                                enableNewAiHook: !0
                            },
                            caption: {
                                className: "",
                                indicatorClassName: "text-xs h-[28px] px-1.5 my-1 text-secondary-foreground border border-input",
                                indicatorIconClassName: "text-muted-foreground mr-2",
                                fontStyle: {
                                    letterSpacing: "-0.28px",
                                    lineHeight: 2,
                                    fontSize: "0.875rem"
                                },
                                width: r.QD,
                                isNewUx: !!d
                            },
                            assets: {
                                isCloseDisabled: !0,
                                enableResetAfterCleanPauses: !1,
                                enableResetAfterCleanFillerWords: !1,
                                enableMusicTitle: !1,
                                musicFilterWidth: 228,
                                uploadButtonWidth: "100%",
                                uploadButtonHeight: a.HL,
                                enableNewUploadButton: !0,
                                enableNewVoiceover: !0,
                                brollCardWidth: 136,
                                brollCardHeight: 80,
                                brollPreviewWidth: "100%",
                                brollPreviewHeight: 120,
                                musicItemWidth: 202,
                                musicProgressWidth: 148,
                                enableNewBroll: !0,
                                enableSmallAutoCensor: !0,
                                enableNewAutoTransitions: !0
                            },
                            render: {
                                enableNewSelector: !0,
                                enableOpenMainSidebar: !0,
                                enableDarkerBg: !0,
                                visibleWindowOffsetX: r.QD - r.Uq - r.K7,
                                shouldShrinkCanvas: !0,
                                initialWindowPadding: 60
                            },
                            common: {
                                showNewStepPopover: !0
                            },
                            version: t
                        },
                        children: e
                    })
                };

            function g() {
                let A = (0, o.useContext)(u);
                if (!A) throw Error("useEditorUXConfiguration must be used within EditorUXConfigurationProvider");
                return A
            }
        },
        97266: function(A, e, t) {
            "use strict";
            t.d(e, {
                A5: function() {
                    return n
                },
                Cn: function() {
                    return C
                },
                FO: function() {
                    return c
                },
                HL: function() {
                    return x
                },
                O_: function() {
                    return p
                },
                Su: function() {
                    return d
                },
                TN: function() {
                    return s
                },
                Uv: function() {
                    return r
                },
                YR: function() {
                    return g
                },
                Zv: function() {
                    return f
                },
                aJ: function() {
                    return m
                },
                c5: function() {
                    return h
                },
                oV: function() {
                    return u
                },
                rn: function() {
                    return v
                },
                xM: function() {
                    return l
                },
                zZ: function() {
                    return a
                }
            });
            var i, n, o = t(13998);
            (i = n || (n = {})).EFFECT_TRACK = "effectTrack", i.MEDIA = "MEDIA", i.MUSIC = "MUSIC", i.TEXT_OVERLAY = "textOverlay";
            let l = A => [{
                    type: o.kV.Heading,
                    name: A("editor:text_overlay_add_text", "Add Text"),
                    style: {
                        fontSize: 16,
                        fontWeight: 600
                    }
                }],
                r = 100,
                a = 240,
                s = 100,
                c = .5,
                u = .1,
                d = "serious",
                g = "1",
                p = 2500,
                f = 344,
                m = 108,
                h = 104,
                v = 72,
                x = 88,
                C = "Newly added content is processing. Please check back later to clean up."
        },
        42320: function(A, e, t) {
            "use strict";
            t.d(e, {
                A$: function() {
                    return E
                },
                C4: function() {
                    return g
                },
                DA: function() {
                    return s
                },
                FD: function() {
                    return d
                },
                Gd: function() {
                    return M
                },
                Gt: function() {
                    return i
                },
                Hq: function() {
                    return B
                },
                K$: function() {
                    return q
                },
                Km: function() {
                    return F
                },
                Q: function() {
                    return _
                },
                RC: function() {
                    return o
                },
                SQ: function() {
                    return k
                },
                Sf: function() {
                    return V
                },
                Vx: function() {
                    return Z
                },
                W2: function() {
                    return y
                },
                Wf: function() {
                    return r
                },
                XB: function() {
                    return O
                },
                Yb: function() {
                    return w
                },
                Yk: function() {
                    return Y
                },
                _M: function() {
                    return N
                },
                aG: function() {
                    return T
                },
                c4: function() {
                    return a
                },
                cu: function() {
                    return l
                },
                d0: function() {
                    return P
                },
                dg: function() {
                    return u
                },
                iL: function() {
                    return S
                },
                im: function() {
                    return D
                },
                jR: function() {
                    return h
                },
                jn: function() {
                    return H
                },
                kO: function() {
                    return c
                },
                kg: function() {
                    return J
                },
                kt: function() {
                    return U
                },
                mA: function() {
                    return x
                },
                mJ: function() {
                    return W
                },
                n2: function() {
                    return C
                },
                q: function() {
                    return X
                },
                q5: function() {
                    return j
                },
                rD: function() {
                    return f
                },
                rN: function() {
                    return K
                },
                rf: function() {
                    return R
                },
                s4: function() {
                    return z
                },
                sB: function() {
                    return b
                },
                sr: function() {
                    return n
                },
                tL: function() {
                    return L
                },
                tl: function() {
                    return G
                },
                tu: function() {
                    return I
                },
                uD: function() {
                    return m
                },
                xp: function() {
                    return $
                },
                yh: function() {
                    return Q
                },
                zg: function() {
                    return v
                },
                zw: function() {
                    return p
                }
            });
            let i = 80,
                n = 0,
                o = .5,
                l = 150,
                r = 40,
                a = 10,
                s = 800,
                c = 15,
                u = 100,
                d = 56,
                g = 80,
                p = 45,
                f = 25,
                m = 640,
                h = 360,
                v = 1,
                x = 1e3,
                C = 32,
                K = 80,
                b = 90,
                y = 119,
                w = 40,
                B = 40,
                U = 32,
                F = 20,
                I = 32,
                E = 40,
                Q = 1e3,
                j = "timeline-box",
                S = "timeline-track-wrapper",
                L = 44,
                R = 8e3,
                k = 2,
                q = 1,
                O = [82, 73, 70, 70, 204, 194, 7, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 64, 31, 0, 0, 128, 62, 0, 0, 2, 0, 16, 0, 100, 97, 116, 97, 160, 194, 7, 0],
                D = 7,
                P = 20,
                N = 500,
                Z = 1e3,
                M = 3e3,
                V = 180,
                T = 260,
                Y = 80,
                H = 84,
                _ = 2e3,
                W = 2e3,
                G = "Fill",
                J = 16,
                z = 700,
                X = 114,
                $ = 201
        },
        66388: function(A, e, t) {
            "use strict";
            t.d(e, {
                XU: function() {
                    return J
                }
            });
            var i = t(89425),
                n = t(35864),
                o = t(65058),
                l = t(87809),
                r = t(26005),
                a = t(44527);
            let s = (0, t(91117).Z)("atom-with-force-update");

            function c(A, e) {
                let t = (0, o.cn)(0),
                    i = (0, o.cn)(n => {
                        let o = n(t);
                        return s.info("selectorWithForceUpdate", i.debugLabel, o), e(n(A))
                    });
                return i.forceUpdate = A => {
                    A(t, A => A + 1)
                }, i
            }
            var u = t(8497);
            let d = (0, o.cn)(void 0);
            d.debugLabel = "editor.core.captionTrackInstance";
            let g = c(d, A => null == A ? void 0 : A.parse());
            g.debugLabel = "editor.core.captionTrack";
            let p = (0, o.cn)(void 0);
            p.debugLabel = "editor.core.keyFrameTrackInstance";
            let f = c(p, A => null == A ? void 0 : A.parse());
            f.debugLabel = "editor.core.keyFrameTrack";
            let m = (0, o.cn)(void 0);
            m.debugLabel = "editor.core.voiceEnhancementTrackInstance";
            let h = c(m, A => null == A ? void 0 : A.parse());
            h.debugLabel = "editor.core.voiceEnhancementTrack";
            let v = (0, o.cn)(void 0);
            v.debugLabel = "editor.core.videoEffectTrackInstance";
            let x = c(v, A => null == A ? void 0 : A.parse());
            x.debugLabel = "editor.core.videoEffectTrack";
            let C = (0, o.cn)(void 0);
            C.debugLabel = "editor.core.emojiTrackInstance";
            let K = c(C, A => null == A ? void 0 : A.parse());
            K.debugLabel = "editor.core.emojiTrack";
            let b = (0, o.cn)([]);
            b.debugLabel = "editor.core.textOverlayTrackInstances";
            let y = c(b, A => A.map(A => A.parse()));
            y.debugLabel = "editor.core.textOverlayTracks";
            let w = (0, o.cn)(void 0);
            w.debugLabel = "editor.core.soundTrackInstance";
            let B = c(w, A => null == A ? void 0 : A.parse());
            B.debugLabel = "editor.core.soundTrack";
            let U = (0, o.cn)(void 0);
            U.debugLabel = "editor.core.voiceoverTrackInstance";
            let F = c(U, A => null == A ? void 0 : A.parse());
            F.debugLabel = "editor.core.voiceoverTrack";
            let I = (0, o.cn)(void 0);
            I.debugLabel = "editor.core.mediaTrackInstance";
            let E = c(I, A => null == A ? void 0 : A.parse());
            E.debugLabel = "editor.core.mediaTrack";
            let Q = (0, o.cn)(void 0);
            Q.debugLabel = "editor.core.brollTrackInstance";
            let j = c(Q, A => null == A ? void 0 : A.parse());
            j.debugLabel = "editor.core.brollTrack";
            let S = (0, r.s)([]);
            S.debugLabel = "editor.core.bundles";
            let L = (0, o.cn)(A => ({
                tracks: [A(f), A(g), A(K), A(j), A(E), A(x), ...A(y), A(F), A(h), A(B), A(q)].filter(i.s),
                bundles: A(S)
            }));
            L.debugLabel = "editor.core.editingScript";
            let R = (0, o.cn)();
            R.debugLabel = "editor.core.initialEditingScript";
            let k = (0, o.cn)();
            k.debugLabel = "editor.core.preference";
            let q = (0, l.kv)((0, o.cn)(A => {
                let e = A(k),
                    t = A(f);
                if (null == e || !e.disableScreenOverlay) return (0, n.z)(e, t)
            }), A => A, a.Z);
            q.debugLabel = "editor.core.screenOverlayTrack";
            let O = (0, o.cn)();
            O.debugLabel = "editor.core.customizedTemplate";
            let D = (0, o.cn)();
            D.debugLabel = "editor.core.initialPreference";
            let P = (0, o.cn)();
            P.debugLabel = "editor.core.captionTemplates";
            let N = (0, o.cn)();
            N.debugLabel = "editor.core.brandTemplates";
            let Z = (0, o.cn)();
            Z.debugLabel = "editor.core.fontResources";
            let M = (0, l.kv)(k, A => {
                var e;
                return u.EA[null !== (e = null == A ? void 0 : A.layoutAspectRatio) && void 0 !== e ? e : "portrait"]
            }, a.Z);
            M.debugLabel = "editor.core.outputSize";
            let V = (0, o.cn)({
                width: 0,
                height: 0
            });
            V.debugLabel = "editor.core.originalVideoSize";
            let T = (0, o.cn)();
            T.debugLabel = "editor.core.clipBasicInfo";
            let Y = (0, o.cn)();
            Y.debugLabel = "editor.core.rawTranscript";
            let H = (0, o.cn)();
            H.debugLabel = "editor.core.fullScreenplay";
            let _ = (0, o.cn)();
            _.debugLabel = "editor.core.language";
            let W = (0, o.cn)();
            W.debugLabel = "editor.core.xtroResources";
            let G = (0, o.cn)();
            G.debugLabel = "editor.core.xtroResourcesTypeIds";
            let J = {
                captionTrack: g,
                captionTrackInstance: d,
                keyFrameTrack: f,
                keyFrameTrackInstance: p,
                voiceEnhancementTrack: h,
                voiceEnhancementTrackInstance: m,
                videoEffectTrack: x,
                videoEffectTrackInstance: v,
                emojiTrack: K,
                emojiTrackInstance: C,
                textOverlayTracks: y,
                textOverlayTrackInstances: b,
                soundTrack: B,
                soundTrackInstance: w,
                voiceoverTrack: F,
                voiceoverTrackInstance: U,
                mediaTrack: E,
                mediaTrackInstance: I,
                brollTrack: j,
                brollTrackInstance: Q,
                preference: k,
                customizedTemplate: O,
                initialPreference: D,
                brandTemplates: N,
                captionTemplates: P,
                fontResources: Z,
                editingScript: L,
                initialEditingScript: R,
                outputSize: M,
                originalVideoSize: V,
                clipBasicInfo: T,
                rawTranscript: Y,
                language: _,
                fullScreenplay: H,
                xtroResources: W,
                xtroResourcesTypeIds: G,
                bundles: S,
                screenOverlayTrack: q
            }
        },
        86665: function(A, e, t) {
            "use strict";
            t.d(e, {
                a: function() {
                    return m
                }
            });
            var i = t(65058),
                n = t(87809);
            let o = (0, n.xu)(A => {
                    let e = (0, i.cn)(!1);
                    return e.debugLabel = "editor.engine.engineTemplateLoaded_".concat(A), e
                }),
                l = (0, n.xu)(A => {
                    let e = (0, i.cn)(!1);
                    return e.debugLabel = "editor.engine.engineCaptionLoaded_".concat(A), e
                }),
                r = (0, n.xu)(A => {
                    let e = (0, i.cn)();
                    return e.debugLabel = "editor.engine.engineCanvasHandle_".concat(A), e
                }),
                a = (0, n.xu)(A => {
                    let e = (0, i.cn)(!0);
                    return e.debugLabel = "editor.engine.engineTemplateRefreshed_".concat(A), e
                }),
                s = (0, n.xu)(A => {
                    let e = (0, i.cn)(!0);
                    return e.debugLabel = "editor.engine.engineTemplateSought_".concat(A), e
                }),
                c = (0, n.xu)(A => {
                    let e = (0, i.cn)(!1);
                    return e.debugLabel = "editor.engine.engineIsPlaying_".concat(A), e
                }),
                u = (0, n.xu)(A => {
                    let e = (0, i.cn)(!1);
                    return e.debugLabel = "editor.engine.isEnd_".concat(A), e
                }),
                d = (0, n.xu)(A => {
                    let e = (0, i.cn)(!1);
                    return e.debugLabel = "editor.engine.videoLoading_".concat(A), e
                }),
                g = (0, n.xu)(A => {
                    let e = (0, i.cn)(0);
                    return e.debugLabel = "editor.engine.videoCurrentTime_".concat(A), e
                }),
                p = (0, i.cn)();
            p.debugLabel = "editor.engine.addSectionVideoCurrentTime";
            let f = (0, i.cn)(A => 1e3 * Math.round(A(g("Module")) / 1e3));
            f.debugLabel = "editor.ui.currentTimeLF";
            let m = {
                engineTemplateLoaded: o,
                engineCaptionLoaded: l,
                engineCanvasHandle: r,
                engineTemplateRefreshed: a,
                engineTemplateSought: s,
                engineIsPlaying: c,
                videoLoading: d,
                videoCurrentTime: g,
                currentTimeLF: f,
                addSectionVideoCurrentTime: p,
                isEnd: u
            }
        },
        44170: function(A, e, t) {
            "use strict";
            t.d(e, {
                t: function() {
                    return v
                }
            });
            var i = t(13998),
                n = t(65058),
                o = t(87809),
                l = t(94069),
                r = t(50480),
                a = t(66388);
            let s = (0, n.cn)({});
            s.debugLabel = "editor.misc.quickAmend";
            let c = (0, n.cn)(!1);
            c.debugLabel = "editor.misc.quickGenBroll";
            let u = (0, o.kv)(a.XU.clipBasicInfo, A => ({
                genre: null == A ? void 0 : A.genre,
                subgenre: null == A ? void 0 : A.subgenre
            }));
            u.debugLabel = "editor.misc.clipType";
            let d = (0, l.Wg)("editor.misc.voiceEnhancementConfirmDisplayCount", 0),
                g = (0, l.Wg)("editor.misc.brollCreditsCost", 5),
                p = (0, o.xu)(A => {
                    let e = (0, n.cn)(e => {
                        var t, i;
                        return !(null === (t = e(r.p2.videoDownload(A))) || void 0 === t ? void 0 : t.onDemandLoading) && !(null === (i = e(r.p2.adobeDownload(A))) || void 0 === i ? void 0 : i.onDemandLoading)
                    });
                    return e.debugLabel = "editor.misc.shouldSaveClip-".concat(A), e
                }),
                f = (0, n.cn)("");
            f.debugLabel = "editor.misc.exitReminderId";
            let m = (0, n.cn)({
                modifyCaptionContent: !1
            });
            m.debugLabel = "editor.misc.editorEventLabelMap";
            let h = (0, n.cn)({
                [i.sr.Default]: 0,
                [i.sr.Fill]: 0,
                [i.sr.Fit]: 0,
                [i.sr.Split]: 0,
                [i.sr.ScreenShare]: 0,
                [i.sr.Game]: 0,
                [i.sr.Three]: 0,
                [i.sr.Four]: 0
            });
            h.debugLabel = "editor.misc.layoutTypeSelectedCountMap";
            let v = {
                quickAmend: s,
                quickGenBroll: c,
                clipType: u,
                voiceEnhancementConfirmDisplayCount: d,
                brollCreditsCost: g,
                shouldSaveClip: p,
                exitReminderId: f,
                editorEventLabelMap: m,
                layoutTypeSelectedCountMap: h
            }
        },
        45254: function(A, e, t) {
            "use strict";
            t.d(e, {
                r: function() {
                    return A8
                }
            });
            var i = t(89425),
                n = t(82222),
                o = t(65058),
                l = t(87809),
                r = t(44527),
                a = t(64556),
                s = t(94069),
                c = t(8497),
                u = t(42320),
                d = t(66388),
                g = t(86665);
            let p = (0, o.cn)([]);
            p.debugLabel = "editor.ui.editorSnapshots";
            let f = (0, o.cn)(-1);
            f.debugLabel = "editor.ui.editorSnapshotIndex";
            let m = (0, o.cn)(A => A(f) > 0);
            m.debugLabel = "editor.ui.canUndo";
            let h = (0, o.cn)(A => A(f) < A(p).length - 1);
            h.debugLabel = "editor.ui.canRedo";
            let v = (0, o.cn)(!1);
            v.debugLabel = "editor.ui.saving";
            let x = (0, o.cn)("");
            x.debugLabel = "editor.ui.brollTrackIdx";
            let C = (0, o.cn)("");
            C.debugLabel = "editor.ui.mediaTrackIdx";
            let K = (0, o.cn)([]);
            K.debugLabel = "editor.ui.textOverlayTrackIndices";
            let b = (0, o.cn)("");
            b.debugLabel = "editor.ui.captionTrackIdx";
            let y = (0, o.cn)(!1);
            y.debugLabel = "editor.ui.isNewCaption";
            let w = (0, o.cn)({
                loadWasm: void 0,
                createWasm: void 0,
                initData: void 0,
                parseJson: void 0,
                fetchResource: void 0,
                seekToFrame: void 0,
                renderFrame: void 0
            });
            w.debugLabel = "editor.ui.loadingStepMap";
            let B = (0, o.cn)(!1);
            B.debugLabel = "editor.ui.speakerDetectionLoading";
            let U = (0, o.cn)(!1);
            U.debugLabel = "editor.ui.templateIsChanged";
            let F = (0, o.cn)();
            F.debugLabel = "editor.ui.selectedCaptionTemplateId";
            let I = (0, o.cn)();
            I.debugLabel = "editor.ui.selectedBrandTemplateId";
            let E = (0, o.cn)({});
            E.debugLabel = "editor.ui.pendingExtendSections";
            let Q = (0, o.cn)(A => {
                let e = A(d.XU.keyFrameTrack),
                    t = A(g.a.videoCurrentTime("Module")),
                    i = null == e ? void 0 : e.sections.find(A => {
                        let {
                            sectionTimeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    }),
                    n = null == i ? void 0 : i.segments.find(A => {
                        let {
                            timeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    });
                return null == n ? void 0 : n.content.keyFrameContents.find(A => {
                    let {
                        timeline: e
                    } = A;
                    return e.in <= t && e.out > t
                })
            });
            Q.debugLabel = "editor.ui.currentKeyFrame";
            let j = (0, l.kv)((0, o.cn)(A => {
                let e = A(d.XU.keyFrameTrack),
                    t = A(g.a.videoCurrentTime("Module")),
                    i = null == e ? void 0 : e.sections.find(A => {
                        let {
                            sectionTimeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    }),
                    n = null == i ? void 0 : i.segments.find(A => {
                        let {
                            timeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    });
                return {
                    secId: null == i ? void 0 : i.id,
                    segId: null == n ? void 0 : n.id,
                    seg: n,
                    sec: i
                }
            }), A => A, r.Z);
            j.debugLabel = "editor.ui.currentKeyFrameGroupInfo";
            let S = (0, l.kv)(j, A => A.secId);
            S.debugLabel = "editor.ui.currentKeyFrameSectionId";
            let L = (0, l.kv)(j, A => A.segId);
            L.debugLabel = "editor.ui.currentKeyFrameGroupId";
            let R = (0, l.kv)(j, A => {
                var e, t, i;
                if (A) return null !== (i = null === (e = A.seg) || void 0 === e ? void 0 : e.content.layoutTypeAdjustment) && void 0 !== i ? i : null === (t = A.seg) || void 0 === t ? void 0 : t.content.layoutType
            });
            R.debugLabel = "editor.ui.currentLayoutType";
            let k = (0, o.cn)(A => {
                let e = A(d.XU.brollTrack),
                    t = A(g.a.videoCurrentTime("Module")),
                    i = null == e ? void 0 : e.sections.find(A => {
                        let {
                            sectionTimeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    }),
                    n = null == i ? void 0 : i.segments.find(A => {
                        let {
                            timeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    });
                return null == n ? void 0 : n.content
            });
            k.debugLabel = "editor.ui.currentBrollContent";
            let q = (0, o.cn)(A => {
                let e = A(d.XU.mediaTrack),
                    t = A(g.a.videoCurrentTime("Module")),
                    i = null == e ? void 0 : e.sections.find(A => {
                        let {
                            sectionTimeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    }),
                    n = null == i ? void 0 : i.segments.find(A => {
                        let {
                            timeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    });
                return null == n ? void 0 : n.content
            });
            q.debugLabel = "editor.ui.currentMediaContent";
            let O = (0, o.cn)(A => {
                let e = A(d.XU.screenOverlayTrack),
                    t = A(g.a.videoCurrentTime("Module"));
                return null == e ? void 0 : e.sections.find(A => {
                    let {
                        sectionTimeline: e
                    } = A;
                    return e.in <= t && e.out > t
                })
            });
            O.debugLabel = "editor.ui.currentScreenOverlayContent";
            let D = (0, o.cn)(A => {
                let e = A(d.XU.emojiTrack),
                    t = A(g.a.videoCurrentTime("Module")),
                    i = null == e ? void 0 : e.sections.flatMap(A => A.segments),
                    n = null == i ? void 0 : i.find(A => {
                        let {
                            timeline: e
                        } = A;
                        return e.in <= t && e.out > t
                    });
                return null == n ? void 0 : n.content
            });
            D.debugLabel = "editor.ui.currentEmojiContent";
            let P = (0, o.cn)(A => {
                let e = A(j),
                    t = A(E);
                return !!(null == e ? void 0 : e.secId) && e.secId in t
            });
            P.debugLabel = "editor.ui.currentIsInPendingSection";
            let N = (0, o.cn)([]);
            N.debugLabel = "editor.ui.timeline.manualSelectedKeyFrameGroupIds";
            let Z = (0, l.kv)((0, o.cn)(A => (0, a.Z)([...A(N), A(L)].filter(i.s))), A => A, r.Z);
            Z.debugLabel = "editor.ui.timeline.selectedKeyFrameGroupIds";
            let M = (0, l.xu)(A => (0, l.kv)(d.XU.keyFrameTrack, e => null == e ? void 0 : e.sections.flatMap(A => A.segments).find(e => e.id === A), r.Z), (A, e) => A === e),
                V = (0, o.cn)(A => new Set(A(Z).map(e => {
                    var t;
                    let i = A(M(e));
                    return null !== (t = null == i ? void 0 : i.content.layoutTypeAdjustment) && void 0 !== t ? t : null == i ? void 0 : i.content.layoutType
                }).filter(Boolean)).size <= 1);
            V.debugLabel = "editor.ui.timeline.canMultiEditCanvasArea";
            let T = (0, o.cn)(A => (0, n.$$)(A(d.XU.editingScript)));
            T.debugLabel = "editor.ui.totalTime";
            let Y = (0, o.cn)(A => {
                var e, t, i, n;
                let o = A(d.XU.keyFrameTrack),
                    l = null !== (i = null == o ? void 0 : o.sections) && void 0 !== i ? i : [];
                return null !== (n = null === (t = l[l.length - 1]) || void 0 === t ? void 0 : null === (e = t.sectionTimeline) || void 0 === e ? void 0 : e.out) && void 0 !== n ? n : 0
            });
            Y.debugLabel = "editor.ui.keyFrameTotalTime";
            let H = (0, o.cn)();
            H.debugLabel = "editor.ui.voGeneratingItem";
            let _ = (0, o.cn)(!1);
            _.debugLabel = "editor.ui.startToLoadingThumbnail";
            let W = (0, o.cn)(!1);
            W.debugLabel = "editor.ui.showSafeZone";
            let G = (0, s.Wg)("editor.ui.showCaptionPopup", !0),
                J = (0, s.Wg)("editor.ui.showDraggableSectionPopup", !0),
                z = (0, s.Wg)("editor.ui.timelineHeight", u.Sf),
                X = (0, o.cn)(!1);
            X.debugLabel = "editor.ui.initDataReady";
            let $ = (0, o.cn)();
            $.debugLabel = "editor.ui.currentVideoSnapshot";
            let AA = (0, o.cn)();
            AA.debugLabel = "editor.ui.videoCoverImage";
            let Ae = (0, s.Wg)("editor.ui.clipEditorVersionMap", {}),
                At = (0, s.Wg)("editor.ui.newFeatureMap", []),
                Ai = (0, o.cn)({});
            Ai.debugLabel = "editor.ui.hotKeyModuleMap";
            let An = (0, o.cn)();
            An.debugLabel = "editor.ui.editorFeatureGuidanceTab";
            let Ao = (0, o.cn)(!1);
            Ao.debugLabel = "editor.ui.editorFeatureGuidanceTabFirstTime";
            let Al = (0, o.cn)();
            Al.debugLabel = "editor.ui.editorShortcutGuidance";
            let Ar = (0, o.cn)();
            Ar.debugLabel = "editor.ui.mediaResourcePrompt";
            let Aa = (0, o.cn)(!1);
            Aa.debugLabel = "editor.ui.isProgrammaticScrollOnboarding";
            let As = (0, o.cn)(!1);
            As.debugLabel = "editor.ui.showSurvey";
            let Ac = (0, s.Wg)("editor.ui.enterCount", 0),
                Au = (0, s.Wg)("editor.ui.surveyShown", !1),
                Ad = (0, o.cn)("");
            Ad.debugLabel = "editor.ui.surveyTriggerWay";
            let Ag = (0, o.cn)(!1);
            Ag.debugLabel = "editor.ui.showQuickGenVoDialog";
            let Ap = (0, o.cn)();
            Ap.debugLabel = "editor.ui.voiceEnhancementProgress";
            let Af = (0, o.cn)(),
                Am = (0, o.cn)();
            Am.debugLabel = "editor.ui.timelineOperationLock";
            let Ah = (0, o.cn)([]);
            Ah.debugLabel = "editor.ui.userGuideList";
            let Av = (0, o.cn)(0);
            Av.debugLabel = "editor.ui.userGuideIndex";
            let Ax = (0, o.cn)();
            Ax.debugLabel = "editor.ui.userGuideOverlayOriginalPath";
            let AC = (0, o.cn)("");
            AC.debugLabel = "editor.ui.userGuideOverlayPath";
            let AK = (0, o.cn)([]);
            AK.debugLabel = "editor.ui.userGuideAIEnhancePosition";
            let Ab = (0, s.Wg)("editor.music.musicFavoredItems", []),
                Ay = (0, o.cn)("");
            Ay.debugLabel = "editor.music.activeMusicItemId";
            let Aw = (0, o.cn)(!1);
            Aw.debugLabel = "editor.music.musicDrawerOpen";
            let AB = (0, o.cn)(!1);
            AB.debugLabel = "editor.ui.brollOutOfCreditsOpen";
            let AU = (0, o.cn)(0);
            AU.debugLabel = "editor.music.musicSearchTimes";
            let AF = (0, o.cn)(0);
            AF.debugLabel = "editor.music.musicPlayTimes";
            let AI = (0, s.Wg)("editor.music.hasCustomAudioPopup", !1),
                AE = (0, l.n7)((0, o.cn)(async A => {
                    let e = await A(AI);
                    return (A(AU) >= 3 || A(AF) >= 5) && !A(Ay) && !e
                }));
            AE.debugLabel = "editor.music.shouldCustomAudioPopup";
            let AQ = (0, o.cn)(!1);
            AQ.debugLabel = "editor.ui.showAutoCensorPanel";
            let Aj = (0, s.Wg)("editor.music.hasAddMusicSplitPopup", !1),
                AS = (0, o.cn)(!1);
            AS.debugLabel = "editor.music.showAddMusicSplitPopup";
            let AL = (0, o.cn)("all");
            AL.debugLabel = "editor.ui.activeXtroResourcesType";
            let AR = (0, o.cn)();
            AR.debugLabel = "editor.ui.xtroResourcesTabLoadingStatus";
            let Ak = (0, o.cn)();
            Ak.debugLabel = "editor.ui.popoverAnchorRect";
            let Aq = (0, o.cn)(!1);
            Aq.debugLabel = "editor.ui.editorFirstTimeOnboardingPopup";
            let AO = (0, o.cn)(!1);
            AO.debugLabel = "editor.ui.editorUXOnboardingPopup";
            let AD = (0, o.cn)(!1);
            AD.debugLabel = "editor.ui.enableEditorUXOnboardingStepGuidance";
            let AP = (0, o.cn)(!1);
            AP.debugLabel = "editor.ui.showExportPopup";
            let AN = (0, o.cn)();
            AN.debugLabel = "editor.ui.showDetachedSectionReminder";
            let AZ = (0, o.cn)();
            AZ.debugLabel = "editor.ui.mainSidebarScroll";
            let AM = (0, s.Wg)("editor.ui.showCleanButton", !0),
                AV = (0, o.cn)([]);
            AV.debugLabel = "editor.ui.uploadingItems";
            let AT = (0, o.cn)(!1);
            AT.debugLabel = "editor.ui.canPlay";
            let AY = (0, o.cn)();
            AY.debugLabel = "editor.ui.activeFloatingSubmenuType";
            let AH = (0, o.cn)();
            AH.debugLabel = "editor.ui.selectedFloatingSubmenu";
            let A_ = (0, o.cn)("presets");
            A_.debugLabel = "editor.ui.selectedFloatingCaptionMenu";
            let AW = (0, o.cn)(!1);
            AW.debugLabel = "editor.ui.positiveFloatingSubmenuClose";
            let AG = (0, o.cn)(A => !!A(AY) && !A(AW));
            AG.debugLabel = "editor.ui.showFloatingSubmenu";
            let AJ = (0, o.cn)(!1);
            AJ.debugLabel = "editor.ui.layoutSelectorOpen";
            let Az = (0, o.cn)([]);
            Az.debugLabel = "editor.ui.musicList";
            let AX = (0, o.cn)(!1);
            AX.debugLabel = "editor.ui.layoutSelectorSubmenuOpen";
            let A$ = (0, o.cn)({
                timeAnchor: 0,
                caption: void 0,
                textOverlay: void 0
            });
            A$.debugLabel = "editor.ui.textBoxMap";
            let A0 = (0, l.kv)((0, o.cn)(A => {
                let e = A(A$),
                    t = A(d.XU.captionTrackInstance),
                    i = A(d.XU.textOverlayTracks),
                    n = A(g.a.videoCurrentTime("Module")),
                    o = {
                        caption: void 0,
                        textOverlay: void 0,
                        timeAnchor: e.timeAnchor
                    };
                if (n === e.timeAnchor) {
                    (null == t ? void 0 : t.sections.flatMap(A => A.segments).find(A => A.timeRange.timelineIn <= n && A.timeRange.timelineOut >= n)) && (o.caption = e.caption);
                    let A = i.flatMap(A => A.sections.flatMap(A => A.segments).filter(A => A.timeline.in <= n && A.timeline.out >= n));
                    if (A.length > 0 && e.textOverlay) {
                        let t = new Set(A.map(A => A.id));
                        o.textOverlay = Object.fromEntries(Object.entries(e.textOverlay).filter(A => {
                            let [e] = A;
                            return t.has(e)
                        }))
                    }
                    return o
                }
                return {
                    caption: void 0,
                    textOverlay: void 0
                }
            }), A => A, r.Z);
            A0.debugLabel = "editor.ui.textBoxMapRect";
            let A1 = (0, o.cn)();
            A1.debugLabel = "editor.ui.secondaryMenuTypeForAiEnhance";
            let A2 = (0, o.cn)(null),
                A5 = (0, o.cn)(A => {
                    let e = A(A2);
                    return null !== e ? e : A(y) ? c.QD : c.Uq
                }, (A, e, t) => {
                    e(A2, t)
                }),
                A4 = (0, l.kv)((0, o.cn)(A => A(A5) / 10), A => A);
            A4.debugLabel = "editor.ui.maxLineWidth";
            let A6 = (0, o.cn)([]);
            A6.debugLabel = "editor.ui.stockLibrarySearchResult";
            let A9 = (0, o.cn)();
            A9.debugLabel = "editor.ui.stockLibrarySearchKeyword";
            let A3 = (0, o.cn)();
            A3.debugLabel = "editor.ui.brollMenuOpenType";
            let A7 = (0, o.cn)(!1);
            A7.debugLabel = "editor.ui.selectWordsTooltipOpen";
            let A8 = {
                canPlay: AT,
                textBoxMap: A$,
                textBoxMapRect: A0,
                mainSidebarScroll: AZ,
                showCleanButton: AM,
                editorSnapshots: p,
                editorSnapshotIndex: f,
                showAutoCensorPanel: AQ,
                canUndo: m,
                canRedo: h,
                saving: v,
                totalTime: T,
                keyFrameTotalTime: Y,
                voGeneratingItem: H,
                brollTrackIdx: x,
                mediaTrackIdx: C,
                textOverlayTrackIndices: K,
                captionTrackIdx: b,
                loadingStepMap: w,
                templateIsChanged: U,
                selectedCaptionTemplateId: F,
                selectedBrandTemplateId: I,
                pendingExtendSections: E,
                currentKeyFrame: Q,
                currentKeyFrameGroupInfo: j,
                currentKeyFrameSectionId: S,
                currentKeyFrameGroupId: L,
                currentLayoutType: R,
                currentBrollContent: k,
                currentMediaContent: q,
                currentEmojiContent: D,
                currentScreenOverlayContent: O,
                currentIsInPendingSection: P,
                manualSelectedKeyFrameGroupIds: N,
                selectedKeyFrameGroupIds: Z,
                keyFrameSegment: M,
                canMultiEditCanvasArea: V,
                startToLoadingThumbnail: _,
                showSafeZone: W,
                showCaptionPopup: G,
                showDraggableSectionPopup: J,
                timelineHeight: z,
                captionPanelWidth: A5,
                initDataReady: X,
                currentVideoSnapshot: $,
                videoCoverImage: AA,
                clipEditorVersionMap: Ae,
                hotKeyModuleMap: Ai,
                editorFeatureGuidanceTab: An,
                editorFeatureGuidanceTabFirstTime: Ao,
                editorShortcutGuidance: Al,
                mediaResourcePrompt: Ar,
                isProgrammaticScrollOnboarding: Aa,
                showSurvey: As,
                enterCount: Ac,
                surveyShown: Au,
                surveyTriggerWay: Ad,
                showQuickGenVoDialog: Ag,
                xtroResourcesWarning: Af,
                activeXtroResourcesType: AL,
                xtroResourcesTabLoadingStatus: AR,
                voiceEnhancementProgress: Ap,
                timelineOperationLock: Am,
                userGuideList: Ah,
                userGuideIndex: Av,
                userGuideOverlayOriginalPath: Ax,
                userGuideOverlayPath: AC,
                userGuideAIEnhancePosition: AK,
                musicFavoredItems: Ab,
                activeMusicItemId: Ay,
                musicDrawerOpen: Aw,
                brollOutOfCreditsOpen: AB,
                shouldCustomAudioPopup: AE,
                hasCustomAudioPopup: AI,
                musicSearchTimes: AU,
                musicPlayTimes: AF,
                hasAddMusicSplitPopup: Aj,
                showAddMusicSplitPopup: AS,
                popoverAnchorRect: Ak,
                editorFirstTimeOnboardingPopup: Aq,
                editorUXOnboardingPopup: AO,
                enableEditorUXOnboardingStepGuidance: AD,
                showExportPopup: AP,
                showDetachedSectionReminderType: AN,
                uploadingItems: AV,
                activeFloatingSubmenuType: AY,
                positiveFloatingSubmenuClose: AW,
                showFloatingSubmenu: AG,
                selectedFloatingSubmenu: AH,
                selectedFloatingCaptionMenu: A_,
                layoutSelectorOpen: AJ,
                layoutSelectorSubmenuOpen: AX,
                speakerDetectionLoading: B,
                secondaryMenuTypeForAiEnhance: A1,
                isNewCaption: y,
                maxLineWidth: A4,
                stockLibrarySearchResult: A6,
                stockLibrarySearchKeyword: A9,
                brollMenuOpenType: A3,
                selectWordsTooltipOpen: A7,
                musicList: Az,
                newFeatureMap: At
            }
        },
        55626: function(A, e, t) {
            "use strict";
            t.d(e, {
                U: function() {
                    return i
                }
            });
            let i = (A, e, t) => {
                let i = new URLSearchParams({
                    platform: A.toLowerCase(),
                    sub: e,
                    org_id: t,
                    reredirect_uri: window.location.origin
                }).toString();
                return "".concat("https://plansocial.co/postplan", "?").concat(i)
            }
        },
        7902: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return o
                }
            });
            var i = t(52322);
            t(2784);
            var n = t(10123);

            function o(A) {
                let {
                    title: e,
                    desc: t,
                    footer: o,
                    stackClassName: l,
                    titleClassName: r
                } = A;
                return (0, i.jsxs)("div", {
                    className: "flex flex-col font-sans",
                    children: [(0, i.jsxs)("div", {
                        className: (0, n.cn)("flex flex-row justify-between items-center", l),
                        children: [(0, i.jsx)("div", {
                            className: (0, n.cn)("text-2xl font-semibold text-foreground", r),
                            children: e
                        }), o]
                    }), t]
                })
            }
        },
        91479: function(A, e, t) {
            "use strict";
            t.r(e), t.d(e, {
                default: function() {
                    return u
                }
            });
            var i = t(52322),
                n = t(80584),
                o = t(72821),
                l = t(31891),
                r = t(6419),
                a = t(4269),
                s = t(44724),
                c = t(39411);

            function u() {
                return ((0, a.Z)(), (0, s.t)().isReady) ? (0, i.jsxs)("div", {
                    className: "bg-background fixed left-0 flex h-[calc(100%-60px)] w-screen flex-col",
                    children: [(0, i.jsxs)("div", {
                        className: "flex flex-col overflow-y-auto",
                        children: [(0, i.jsx)("div", {
                            className: "flex flex-1 flex-col items-center justify-start",
                            children: (0, i.jsx)(c.wF, {})
                        }), (0, i.jsx)("div", {
                            className: "flex flex-1 scroll-mt-32 flex-col max-sm:scroll-mt-52",
                            children: (0, i.jsx)(c.kF, {})
                        })]
                    }), (0, i.jsx)(l.Z, {
                        pageName: "WORKFLOW"
                    })]
                }) : (0, i.jsx)(n.Z, {})
            }(0, r.i)(u, {
                showSupportButton: !0
            }), u.getLayout = A => (0, i.jsx)(o.default, {
                children: A
            })
        },
        99289: function(A, e, t) {
            "use strict";
            t.d(e, {
                Io: function() {
                    return K
                },
                U1: function() {
                    return C
                },
                d9: function() {
                    return v
                },
                rW: function() {
                    return y
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(65058),
                l = t(752),
                r = t(87809),
                a = t(2784),
                s = t(33414),
                c = t(30339),
                u = t(59511),
                d = t(80629);
            let g = (0, t(71537).uC)("device"),
                p = (0, o.cn)({
                    page: 0,
                    pageSize: 16,
                    hasNextPage: !0
                });
            p.debugLabel = "clipProject.nextPage";
            let f = (0, o.cn)({});
            f.debugLabel = "clipProject.clipProjectDashboardMap";
            let m = (0, r.xu)(A => {
                    let e = (0, o.cn)(e => {
                        if (A) return e(f)[A]
                    }, (e, t, o) => {
                        if (!A) return;
                        let l = e(f);
                        t(f, "function" == typeof o ? (0, n._)((0, i._)({}, l), {
                            [A]: o(l[A])
                        }) : (0, n._)((0, i._)({}, l), {
                            [A]: o
                        }))
                    });
                    return e.debugLabel = "clipProject.clipProjectDashboard", e
                }),
                h = (0, o.cn)([]);
            h.debugLabel = "clipProject.projectIdList";
            let v = (0, o.cn)(A => {
                let e = A(h),
                    t = [];
                return e.forEach(e => {
                    let i = A(m(e));
                    i && t.push(i)
                }), t
            });
            v.debugLabel = "clipProject.projectList";
            let x = (0, o.cn)({});
            x.debugLabel = "clipProject.refundCheckResultMap";
            let C = {
                clipProjectDashboard: m,
                projectIdList: h,
                projectList: v,
                clipProjectNextPage: p,
                refundCheckResult: (0, r.xu)(A => {
                    let e = (0, o.cn)(e => {
                        if (A) return e(x)[A]
                    }, (e, t, o) => {
                        if (!A) return;
                        let l = e(x);
                        t(x, "function" == typeof o ? (0, n._)((0, i._)({}, l), {
                            [A]: o(l[A])
                        }) : (0, n._)((0, i._)({}, l), {
                            [A]: o
                        }))
                    });
                    return e.debugLabel = "clipProject.refundCheckResult", e
                })
            };

            function K() {
                function A(A) {
                    return A.sort((A, e) => A.createdAt > e.createdAt ? -1 : 1)
                }
                let e = (0, u.T)((e, t, i) => {
                        let n = e(h),
                            o = e(v),
                            l = i.filter(A => !n.includes(A.id));
                        for (let e of (l.length > 0 && t(h, A([...l, ...o]).map(A => A.id)), i)) t(m(e.id), e)
                    }),
                    t = (0, u.T)((e, t, i) => {
                        for (let e of (t(h, A([...i]).map(A => A.id)), i)) t(m(e.id), e)
                    }),
                    n = (0, u.T)((e, t, i) => {
                        let n = e(h),
                            o = i.filter(A => !n.includes(A.id));
                        o.length > 0 && (t(h, A([...o, ...e(v)]).map(A => A.id)), o.forEach(A => {
                            t(m(A.id), A)
                        }))
                    });
                return {
                    upsertItemsIntoList: e,
                    deleteItem: (0, u.T)((A, e, t) => {
                        e(h, A => A.filter(A => A !== t)), e(m(t), void 0)
                    }),
                    prependIfNotExist: n,
                    resetList: t,
                    updateItem: (0, u.T)((A, e, t) => {
                        e(m(t.id), (0, i._)({}, t))
                    })
                }
            }

            function b(A) {
                return "COMPLETE" === A.stage || "STALLED" === A.stage
            }

            function y(A, e, t) {
                let i = (0, l.Dv)(v),
                    n = (0, l.Dv)(d.a.currentOrgAsset),
                    {
                        revertUsage: o
                    } = (0, c.Qb)(null == n ? void 0 : n.plan),
                    r = (0, a.useMemo)(() => i.filter(A => !b(A)).length, [i]),
                    {
                        upsertItemsIntoList: u
                    } = K(),
                    {
                        getClipProjectPaginatedList: p
                    } = (0, s.Z)();
                (0, a.useEffect)(() => {
                    if (!A || 0 === r) return;
                    let i = null,
                        n = setTimeout(() => {
                            async function A() {
                                let {
                                    list: A
                                } = await p({
                                    page: 0,
                                    pageSize: 16
                                }, e, t), i = await g.getItem("clipping-project-with-vo");
                                if (null == i ? void 0 : i.length)
                                    for (let e of i) {
                                        let t = A.find(A => A.id === e);
                                        t && "STALLED" === t.stage && o(), t && b(t) && g.setItem("clipping-project-with-vo", (null == i ? void 0 : i.length) === 1 ? [] : null == i ? void 0 : i.splice(i.indexOf(e), 1))
                                    }
                                u(A)
                            }
                            A(), i = setInterval(() => {
                                A()
                            }, 15e3)
                        }, 500);
                    return () => {
                        clearTimeout(n), i && clearInterval(i)
                    }
                }, [t, r, p, A, u, e])
            }
        },
        6932: function(A, e, t) {
            "use strict";
            t.d(e, {
                Y_: function() {
                    return r
                },
                Yx: function() {
                    return a
                },
                b5: function() {
                    return s
                },
                ii: function() {
                    return d
                }
            });
            var i = t(65058),
                n = t(87809);
            t(59511), t(18285), t(2404);
            let o = (0, n.xu)(A => (0, i.cn)("public")),
                l = (0, n.xu)(A => (0, i.cn)(void 0));

            function r(A) {
                let e = A.match(/#[a-zA-Z0-9_]+/g);
                return e ? e.length : 0
            }

            function a(A) {
                let e = A.match(/@[a-zA-Z0-9_]+/g);
                return e ? e.length : 0
            }

            function s(A, e) {
                let t = new Set(A);
                for (let A = 0; A < e.length; A++)
                    if (t.has(e[A])) return e[A];
                return null
            }
            let c = (0, n.xu)(A => (0, i.cn)(void 0)),
                u = (0, i.cn)(!1);
            u.debugLabel = "post.showSharereLove";
            let d = {
                postCaptionItem: l,
                postScheduleItem: c,
                postPrivacyItem: o,
                showSharereLove: u
            }
        },
        89640: function(A, e, t) {
            "use strict";
            t.d(e, {
                CZ: function() {
                    return C
                },
                E2: function() {
                    return L
                },
                fA: function() {
                    return b
                }
            });
            var i = t(65058),
                n = t(94069);
            let o = (0, n.Wg)("submit.preference.model", "Auto"),
                l = (0, i.cn)("");
            l.debugLabel = "submit.preference.customPrompt";
            let r = (0, i.cn)([]);
            r.debugLabel = "submit.preference.narrative";
            let a = (0, i.cn)({});
            a.debugLabel = "submit.preference.default";
            let s = (0, i.cn)(void 0);
            s.debugLabel = "submit.preference.preferenceRanges";
            let c = (0, n.Wg)("submit.preference.disableAutoHook", !1);
            c.debugLabel = "submit.preference.disableAutoHook";
            let u = (0, i.cn)(!1);
            u.debugLabel = "submit.preference.rangesChanged";
            let d = (0, i.cn)("");
            d.debugLabel = "submit.preference.brandTemplateId";
            let g = (0, i.cn)([]);
            g.debugLabel = "submit.preference.preferenceClipLengths";
            let p = (0, i.cn)("");
            p.debugLabel = "submit.preference.preferenceKeywords";
            let f = (0, i.cn)(!1);
            f.debugLabel = "submit.preference.preferenceSkipSlicing";
            let m = (0, i.cn)(!1);
            m.debugLabel = "submit.preference.preferenceSkipCurate";
            let h = (0, i.cn)("Auto");
            h.debugLabel = "submit.preference.preferenceGenre";
            let v = (0, i.cn)({});
            v.debugLabel = "submit.render.renderPreference";
            let x = (0, i.cn)();
            x.debugLabel = "submit.use.case";
            let C = {
                    errorMessage: "",
                    resolution: "",
                    isBadQuality: !1,
                    duration: 0,
                    thumbnailUrl: "",
                    videoLanguage: "",
                    translationLanguage: void 0,
                    sourcePlatform: void 0
                },
                K = (0, i.cn)(C);
            K.debugLabel = "submit.third.thirdVideoPreflightdata";
            let b = {
                    errorMessage: "",
                    resolution: "",
                    duration: 0,
                    thumbnailUrl: "",
                    title: "",
                    type: "",
                    size: 0,
                    videoLanguage: "",
                    translationLanguage: void 0
                },
                y = (0, i.cn)(b);
            y.debugLabel = "submit.local.localVideoPreflightdata";
            let w = (0, i.cn)(void 0);
            w.debugLabel = "submit.source.seed";
            let B = (0, i.cn)(A => {
                let e = A(w);
                if ((null == e ? void 0 : e.type) === "local") {
                    let e = A(y);
                    return (null == e ? void 0 : e.duration) ? e : null
                }
                if ((null == e ? void 0 : e.type) === "url" || (null == e ? void 0 : e.type) === "thirdPartyFile") {
                    let e = A(K);
                    return e.duration ? e : null
                }
                return null
            });
            B.debugLabel = "submit.preflight.data";
            let U = (0, n.Wg)("submit.hint.browserHintUpdatedAt", 0),
                F = (0, i.cn)(0);
            F.debugLabel = "submit.insufficientCreditsErrorTime";
            let I = (0, i.cn)(0);
            I.debugLabel = "submit.currentCreditToConsume";
            let E = (0, i.cn)("close");
            E.debugLabel = "submit.auto_import_dialog_open";
            let Q = (0, i.cn)(!1);
            Q.debugLabel = "submit.auto_import_active";
            let j = (0, i.cn)([]);
            j.debugLabel = "submit.local_submit_tasks";
            let S = (0, i.cn)(A => A(j).filter(A => A.project).map(A => A.project));
            S.debugLabel = "submit.local_submit_projects";
            let L = {
                preferenceRanges: s,
                rangesChanged: u,
                brandTemplateId: d,
                preferenceModel: o,
                preferencePrompt: l,
                preferenceNarrative: r,
                preferenceClipLengths: g,
                preferenceKeywords: p,
                preferenceSkipSlicing: f,
                preferenceGenre: h,
                renderPreference: v,
                disableAutoHook: c,
                thirdVideoPreflightdata: K,
                localVideoPreflightdata: y,
                videoSourceSeed: w,
                preflightData: B,
                browserHintUpdatedAt: U,
                insufficientCreditsErrorTime: F,
                defaultPreference: a,
                currentCreditToConsume: I,
                autoImportDialogOpen: E,
                autoImportActive: Q,
                localSubmitTasks: j,
                localSubmitProjectList: S,
                preferenceSkipCurate: m,
                submitUseCase: x
            }
        },
        22108: function(A, e, t) {
            "use strict";
            t.d(e, {
                Q: function() {
                    return a
                }
            });
            var i = t(65058);
            let n = (0, i.cn)(A => A(l).filter(A => "uploading" === A.status));
            n.debugLabel = "upload.uploadingTasks";
            let o = (0, i.cn)(A => A(n).length > 0);
            o.debugLabel = "upload.isUploading";
            let l = (0, i.cn)([]);
            l.debugLabel = "upload.tasks";
            let r = (0, i.cn)(!0);
            r.debugLabel = "upload.supportUploadBg";
            let a = {
                isUploading: o,
                uploadingTasks: n,
                uploadTasks: l,
                supportUploadBg: r
            }
        },
        89425: function(A, e, t) {
            "use strict";

            function i(A) {
                return !!A
            }
            t.d(e, {
                s: function() {
                    return i
                }
            })
        },
        98014: function(A, e, t) {
            "use strict";

            function i(A) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ["ftp:", "http:", "https:"];
                try {
                    let t = new URL(A);
                    return e.includes(t.protocol)
                } catch (A) {
                    return !1
                }
            }

            function n(A, e) {
                if (i(A)) try {
                    let t = new URL(A).hostname;
                    return e.some(A => t === A || t.endsWith("." + A))
                } catch (A) {}
                return !1
            }
            t.d(e, {
                C: function() {
                    return i
                },
                g: function() {
                    return n
                }
            })
        },
        24744: function(A, e, t) {
            "use strict";
            var i, n, o, l, r, a, s, c, u, d;
            t.d(e, {
                Eq: function() {
                    return a
                },
                wS: function() {
                    return o
                },
                yn: function() {
                    return l
                }
            }), (s = i || (i = {})).IMPORTED = "IMPORTED", s.NOT_IMPORTED = "NOT_IMPORTED", (n || (n = {})).EXT_CHANNEL_ID = "findByExtChannelId", (c = o || (o = {})).IDLE = "IDLE", c.RUNNING = "RUNNING", c.SUSPENDED = "SUSPENDED", (l || (l = {})).CHANNEL_ID = "findByChannelId", (u = r || (r = {})).ALL = "ALL", u.PLAYLIST = "PLAYLIST", (d = a || (a = {})).ALL = "ALL", d.NEW = "NEW"
        },
        13998: function(A, e, t) {
            "use strict";
            var i, n, o, l, r, a, s, c, u, d, g, p, f, m, h, v, x, C, K, b, y, w, B, U, F, I, E, Q, j, S, L, R, k, q, O, D;
            t.d(e, {
                $g: function() {
                    return m
                },
                Go: function() {
                    return n
                },
                PU: function() {
                    return r
                },
                U8: function() {
                    return a
                },
                Yn: function() {
                    return c
                },
                cx: function() {
                    return u
                },
                kV: function() {
                    return s
                },
                lL: function() {
                    return d
                },
                mh: function() {
                    return l
                },
                sr: function() {
                    return i
                },
                x6: function() {
                    return g
                }
            }), (y = i || (i = {})).Default = "Default", y.Fill = "Fill", y.Fit = "Fit", y.Four = "Four", y.Game = "Game", y.ScreenShare = "ScreenShare", y.Split = "Split", y.Three = "Three", (w = n || (n = {})).Gif = "gif", w.Image = "image", w.Video = "video", (B = o || (o = {})).Freeze = "freeze", B.Normal = "normal", (U = l || (l = {})).Face = "face", U.FakeFace = "fakeFace", U.FakeFaceCrops = "fakeFaceCrops", U.FaceV2 = "faceV2", U.PeopleV2 = "peopleV2", U.ActiveSpeaker = "activeSpeaker", U.Grid = "grid", U.MovingSpeaker = "movingSpeaker", U.Panel = "panel", U.People = "people", U.Screen = "screen", U.TrackingSubjects = "trackingSubjects", (F = r || (r = {})).NotDetected = "NotDetected", F.Off = "Off", F.On = "On", (I = a || (a = {}))[I.Default = 0] = "Default", I[I.Primary = 1] = "Primary", I[I.Secondary = 2] = "Secondary", (E = s || (s = {})).Heading = "heading", E.Paragraph = "paragraph", (Q = c || (c = {})).CrossFade = "crossFade", Q.CrossZoom = "crossZoom", Q.FadeIn = "fadeIn", Q.FadeOut = "fadeOut", Q.ZoomIn = "zoomIn", Q.ZoomOut = "zoomOut", (j = u || (u = {})).Bezier = "bezier", j.Linear = "linear", (S = d || (d = {})).Bezier = "bezier", S.Linear = "linear", (g || (g = {})).NotSet = "notSet", (L = p || (p = {})).END = "end", L.SCRIPT = "script", L.SOURCE_URI = "sourceUri", L.SPEAKER = "speaker", L.STABILITY = "stability", L.START = "start", L.VOLUME = "volume", L.VO_TYPE = "voType", (f || (f = {})).MOVING_SPEAKER = "movingSpeaker", (R = m || (m = {})).NotDetected = "NotDetected", R.Off = "Off", R.On = "On", (h || (h = {})).Default = "Default", (k = v || (v = {})).BuildContext = "BuildContext", k.ExtractFrame = "ExtractFrame", k.GenerateReframingScene = "GenerateReframingScene", (q = x || (x = {})).DefaultActiveSpeakerDetection = "DefaultActiveSpeakerDetection", q.DefaultFaceDetection = "DefaultFaceDetection", (O = C || (C = {})).DefaultFakeFaceFiltering = "DefaultFakeFaceFiltering", O.DefaultGeneralTracking = "DefaultGeneralTracking", O.DefaultKeyframeDetermination = "DefaultKeyframeDetermination", O.DefaultObjectDetection = "DefaultObjectDetection", O.DefaultPanelDetection = "DefaultPanelDetection", O.DefaultVllmGridCrop = "DefaultVllmGridCrop", (D = K || (K = {})).AddAiGeneratedContent = "AddAiGeneratedContent", D.AddAutoHook = "AddAutoHook", D.AddBRoll = "AddBRoll", D.AddVoiceEnhancement = "AddVoiceEnhancement", D.AddVoiceOver = "AddVoiceOver", D.AddIntroOutro = "AddIntroOutro", D.UnifyTrack = "UnifyTrack", D.RemoveFillerWords = "RemoveFillerWords", D.RemovePauses = "RemovePauses", (b || (b = {})).SEGMENT_BOUNDARIES = "segmentBoundaries"
        },
        6982: function(A, e, t) {
            "use strict";
            var i, n, o, l, r, a, s, c, u, d, g, p, f, m, h, v;
            t.d(e, {
                PH: function() {
                    return s
                },
                Vc: function() {
                    return i
                },
                _j: function() {
                    return c
                },
                g$: function() {
                    return r
                },
                h3: function() {
                    return o
                },
                u2: function() {
                    return n
                },
                zc: function() {
                    return l
                }
            }), (u = i || (i = {})).Audio = "a", u.Effect = "e", u.ManualText = "mt", u.Text = "t", u.Video = "v", (d = n || (n = {})).Audio = "a", d.Effect = "e", d.ManualText = "mt", d.Text = "t", d.Video = "v", (g = o || (o = {}))[g.Unknown = 0] = "Unknown", g[g.Image = 1] = "Image", g[g.Video = 2] = "Video", g[g.Audio = 3] = "Audio", g[g.Text = 4] = "Text", g[g.Gif = 5] = "Gif", g[g.SeqImg = 6] = "SeqImg", g[g.Timeline = 7] = "Timeline", g[g.Silence = 8] = "Silence", g[g.WaterMark = 9] = "WaterMark", g[g.Empty = 10] = "Empty", g[g.WebP = 11] = "WebP", g[g.Filter = 12] = "Filter", g[g.ManualText = 13] = "ManualText", g[g.PreTexture = 14] = "PreTexture", g[g.Lottie = 15] = "Lottie", (p = l || (l = {}))[p.color = 0] = "color", p[p.blur = 1] = "blur", p[p.image = 2] = "image", (f = r || (r = {})).bottom = "b", f.middle = "m", f.top = "t", (m = a || (a = {})).left = "l", m.middle = "m", m.right = "r", (h = s || (s = {}))[h.Left = 0] = "Left", h[h.Center = 1] = "Center", h[h.Right = 2] = "Right", (v = c || (c = {}))[v.Init = 0] = "Init", v[v.Linear = 1] = "Linear", v[v.Bezier = 2] = "Bezier"
        },
        82222: function(A, e, t) {
            "use strict";
            t.d(e, {
                $$: function() {
                    return F
                },
                Gf: function() {
                    return y
                },
                NI: function() {
                    return b
                },
                Qs: function() {
                    return U
                },
                Us: function() {
                    return u
                },
                az: function() {
                    return f
                },
                et: function() {
                    return d
                },
                ex: function() {
                    return c
                },
                fO: function() {
                    return g
                },
                hB: function() {
                    return K
                },
                io: function() {
                    return C
                },
                jT: function() {
                    return h
                },
                kz: function() {
                    return v
                },
                lx: function() {
                    return s
                },
                py: function() {
                    return B
                },
                qQ: function() {
                    return x
                },
                sY: function() {
                    return I
                },
                v7: function() {
                    return p
                },
                y1: function() {
                    return w
                }
            });
            var i = t(30815),
                n = t(4670),
                o = t(6982),
                l = t(34966),
                r = t(489),
                a = t(15638);
            let s = A => {
                    let {
                        originSections: e,
                        comparedSections: t,
                        originTimeOffset: i = 0,
                        comparedTimeOffset: n = 0
                    } = A, o = [];
                    return e.forEach(A => {
                        var e, l;
                        let r = null !== (l = null !== (e = A.sectionTimeline) && void 0 !== e ? e : A.timeline) && void 0 !== l ? l : { in: A.in,
                            out: A.out
                        };
                        if (void 0 === r.in || void 0 === r.out) return;
                        let a = r.in + i,
                            s = r.out + i;
                        t.forEach(A => {
                            var e, t;
                            let i = null !== (t = null !== (e = A.sectionTimeline) && void 0 !== e ? e : A.timeline) && void 0 !== t ? t : { in: A.in,
                                out: A.out
                            };
                            if (void 0 === i.in || void 0 === i.out) return;
                            let l = i.in + n,
                                r = i.out + n;
                            if (l >= a && l < s || r > a && r <= s || l <= a && r >= s) {
                                if (o.includes(A)) return;
                                o.push(A)
                            }
                        })
                    }), o.sort((A, e) => {
                        var t, i;
                        return (null !== (t = A.in) && void 0 !== t ? t : 0) - (null !== (i = e.in) && void 0 !== i ? i : 0)
                    }), o
                },
                c = (A, e) => {
                    let t = "top" === A ? a.Xv : "middle" === A ? 50 : "landscape" === e ? a.GT : a.et,
                        i = (0, a.Se)(t);
                    return {
                        vAlign: "middle" === A ? o.g$.middle : o.g$.bottom,
                        position: [0, i]
                    }
                };

            function u(A) {
                var e;
                return null !== (e = A.textAdjustment) && void 0 !== e ? e : A.text
            }
            let d = A => {
                let {
                    originSections: e,
                    comparedSections: t,
                    originTimeOffset: i = 0,
                    comparedTimeOffset: n = 0
                } = A, o = s({
                    originSections: e,
                    comparedSections: t,
                    originTimeOffset: i,
                    comparedTimeOffset: n
                });
                if (0 === o.length) return {
                    comparedSections: t,
                    position: "initial"
                };
                let l = o[0],
                    r = o[o.length - 1],
                    a = t.indexOf(l),
                    c = t.indexOf(r);
                return t.splice(a, c - a + 1), {
                    comparedSections: t,
                    position: 0 === a ? "start" : c === o.length - 1 ? "end" : "middle"
                }
            };

            function g(A) {
                let {
                    eOAdj: e,
                    eO: t,
                    sOAdj: i,
                    sO: n
                } = A;
                return [null != i ? i : n, null != e ? e : t]
            }

            function p(A, e) {
                let t = m(e),
                    i = t.width * A.wPct,
                    n = t.height * A.hPct,
                    o = (0, l.fS)({
                        width: i,
                        height: n
                    }, t);
                return {
                    width: i * o,
                    height: n * o,
                    scaleX: 1 / o,
                    scaleY: 1 / o,
                    left: (A.xPct + 1) / 2 * t.width - i / 2,
                    top: (1 - A.yPct) / 2 * t.height - n / 2
                }
            }

            function f(A, e, t) {
                let o = m(t),
                    l = e.height / o.height,
                    {
                        left: r,
                        top: a,
                        width: s,
                        height: c
                    } = A;
                return (0, n._)((0, i._)({}, A), {
                    left: r * l,
                    top: a * l,
                    width: s * l,
                    height: c * l
                })
            }

            function m(A) {
                return "square" === A ? {
                    width: 1280,
                    height: 1280
                } : "landscape" === A ? {
                    width: 1280,
                    height: 720
                } : "four_five" === A ? {
                    width: 1024,
                    height: 1280
                } : (0, i._)({}, {
                    width: 720,
                    height: 1280
                })
            }
            let h = (A, e) => {
                let t = A.wPct * e.width / (A.hPct * e.height),
                    i = e.width / e.height,
                    n = 1;
                return n = t > i ? A.wPct : A.hPct, {
                    position: [A.xPct, A.yPct],
                    scale: [n, n]
                }
            };

            function v(A, e) {
                return e ? [{
                    v: e,
                    mode: o._j.Init,
                    ft: A
                }] : void 0
            }
            let x = A => {
                    var e, t, i, n, o, l, r, a;
                    let s = Math.max(null !== (o = null == A ? void 0 : null === (e = A.at(0)) || void 0 === e ? void 0 : e.wPct) && void 0 !== o ? o : 1, null !== (l = null == A ? void 0 : null === (t = A.at(0)) || void 0 === t ? void 0 : t.hPct) && void 0 !== l ? l : 1);
                    return {
                        position: [null !== (r = null == A ? void 0 : null === (i = A.at(0)) || void 0 === i ? void 0 : i.xPct) && void 0 !== r ? r : 0, null !== (a = null == A ? void 0 : null === (n = A.at(0)) || void 0 === n ? void 0 : n.yPct) && void 0 !== a ? a : 0],
                        scale: [s, s]
                    }
                },
                C = A => {
                    var e, t;
                    let i = null == A ? void 0 : A.at(0);
                    return i ? {
                        position: [null !== (e = null == i ? void 0 : i.xPct) && void 0 !== e ? e : 0, null !== (t = null == i ? void 0 : i.yPct) && void 0 !== t ? t : 0],
                        scale: [Math.max(i.wPct, i.hPct), Math.max(null == i ? void 0 : i.wPct, i.hPct)],
                        bg: {
                            mode: o.zc.blur,
                            value: 30
                        }
                    } : {
                        position: [0, 0],
                        scale: [1, 1],
                        bg: {
                            mode: o.zc.blur,
                            value: 30
                        }
                    }
                },
                K = A => {
                    var e, t, i, n, o, l, r, a, s, c, u, d, g, p, f, m;
                    let h = Math.max(null !== (s = null == A ? void 0 : null === (e = A.at(0)) || void 0 === e ? void 0 : e.wPct) && void 0 !== s ? s : 1, null !== (c = null == A ? void 0 : null === (t = A.at(0)) || void 0 === t ? void 0 : t.hPct) && void 0 !== c ? c : 1),
                        v = Math.max(null !== (u = null == A ? void 0 : null === (i = A.at(1)) || void 0 === i ? void 0 : i.wPct) && void 0 !== u ? u : 1, null !== (d = null == A ? void 0 : null === (n = A.at(1)) || void 0 === n ? void 0 : n.hPct) && void 0 !== d ? d : 1);
                    return [{
                        position: [null !== (g = null == A ? void 0 : null === (o = A.at(0)) || void 0 === o ? void 0 : o.xPct) && void 0 !== g ? g : 0, null !== (p = null == A ? void 0 : null === (l = A.at(0)) || void 0 === l ? void 0 : l.yPct) && void 0 !== p ? p : .5],
                        scale: [h, h]
                    }, {
                        position: [null !== (f = null == A ? void 0 : null === (r = A.at(1)) || void 0 === r ? void 0 : r.xPct) && void 0 !== f ? f : 0, null !== (m = null == A ? void 0 : null === (a = A.at(1)) || void 0 === a ? void 0 : a.yPct) && void 0 !== m ? m : -.5],
                        scale: [v, v]
                    }]
                },
                b = A => {
                    var e, t, i, n, o, l, r, a, s, c, u, d, g, p, f, m;
                    let h = Math.max(null !== (s = null == A ? void 0 : null === (e = A.at(0)) || void 0 === e ? void 0 : e.wPct) && void 0 !== s ? s : 1, null !== (c = null == A ? void 0 : null === (t = A.at(0)) || void 0 === t ? void 0 : t.hPct) && void 0 !== c ? c : 1),
                        v = Math.max(null !== (u = null == A ? void 0 : null === (i = A.at(1)) || void 0 === i ? void 0 : i.wPct) && void 0 !== u ? u : 1, null !== (d = null == A ? void 0 : null === (n = A.at(1)) || void 0 === n ? void 0 : n.hPct) && void 0 !== d ? d : 1);
                    return [{
                        position: [null !== (g = null == A ? void 0 : null === (o = A.at(0)) || void 0 === o ? void 0 : o.xPct) && void 0 !== g ? g : 0, null !== (p = null == A ? void 0 : null === (l = A.at(0)) || void 0 === l ? void 0 : l.yPct) && void 0 !== p ? p : .7],
                        scale: [h, h]
                    }, {
                        position: [null !== (f = null == A ? void 0 : null === (r = A.at(1)) || void 0 === r ? void 0 : r.xPct) && void 0 !== f ? f : 0, null !== (m = null == A ? void 0 : null === (a = A.at(1)) || void 0 === a ? void 0 : a.yPct) && void 0 !== m ? m : -.3],
                        scale: [v, v]
                    }]
                },
                y = A => {
                    var e, t, i, n, o, l, r, a, s, c, u, d, g, p, f, m, h, v, x, C, K, b, y, w;
                    let B = Math.max(null !== (g = null == A ? void 0 : null === (e = A.at(0)) || void 0 === e ? void 0 : e.wPct) && void 0 !== g ? g : 1, null !== (p = null == A ? void 0 : null === (t = A.at(0)) || void 0 === t ? void 0 : t.hPct) && void 0 !== p ? p : 1),
                        U = Math.max(null !== (f = null == A ? void 0 : null === (i = A.at(1)) || void 0 === i ? void 0 : i.wPct) && void 0 !== f ? f : .5, null !== (m = null == A ? void 0 : null === (n = A.at(1)) || void 0 === n ? void 0 : n.hPct) && void 0 !== m ? m : .5),
                        F = Math.max(null !== (h = null == A ? void 0 : null === (o = A.at(2)) || void 0 === o ? void 0 : o.wPct) && void 0 !== h ? h : .5, null !== (v = null == A ? void 0 : null === (l = A.at(2)) || void 0 === l ? void 0 : l.hPct) && void 0 !== v ? v : .5);
                    return [{
                        position: [null !== (x = null == A ? void 0 : null === (r = A.at(0)) || void 0 === r ? void 0 : r.xPct) && void 0 !== x ? x : 0, null !== (C = null == A ? void 0 : null === (a = A.at(0)) || void 0 === a ? void 0 : a.yPct) && void 0 !== C ? C : .5],
                        scale: [B, B]
                    }, {
                        position: [null !== (K = null == A ? void 0 : null === (s = A.at(1)) || void 0 === s ? void 0 : s.xPct) && void 0 !== K ? K : -.5, null !== (b = null == A ? void 0 : null === (c = A.at(1)) || void 0 === c ? void 0 : c.yPct) && void 0 !== b ? b : -.5],
                        scale: [U, U]
                    }, {
                        position: [null !== (y = null == A ? void 0 : null === (u = A.at(2)) || void 0 === u ? void 0 : u.xPct) && void 0 !== y ? y : .5, null !== (w = null == A ? void 0 : null === (d = A.at(2)) || void 0 === d ? void 0 : d.yPct) && void 0 !== w ? w : -.5],
                        scale: [F, F]
                    }]
                },
                w = A => {
                    var e, t, i, n, o, l, r, a, s, c, u, d, g, p, f, m, h, v, x, C, K, b, y, w, B, U, F, I, E, Q, j, S;
                    let L = Math.max(null !== (h = null == A ? void 0 : null === (e = A.at(0)) || void 0 === e ? void 0 : e.wPct) && void 0 !== h ? h : .5, null !== (v = null == A ? void 0 : null === (t = A.at(0)) || void 0 === t ? void 0 : t.hPct) && void 0 !== v ? v : .5),
                        R = Math.max(null !== (x = null == A ? void 0 : null === (i = A.at(1)) || void 0 === i ? void 0 : i.wPct) && void 0 !== x ? x : .5, null !== (C = null == A ? void 0 : null === (n = A.at(1)) || void 0 === n ? void 0 : n.hPct) && void 0 !== C ? C : .5),
                        k = Math.max(null !== (K = null == A ? void 0 : null === (o = A.at(2)) || void 0 === o ? void 0 : o.wPct) && void 0 !== K ? K : .5, null !== (b = null == A ? void 0 : null === (l = A.at(2)) || void 0 === l ? void 0 : l.hPct) && void 0 !== b ? b : .5),
                        q = Math.max(null !== (y = null == A ? void 0 : null === (r = A.at(3)) || void 0 === r ? void 0 : r.wPct) && void 0 !== y ? y : .5, null !== (w = null == A ? void 0 : null === (a = A.at(3)) || void 0 === a ? void 0 : a.hPct) && void 0 !== w ? w : .5);
                    return [{
                        position: [null !== (B = null == A ? void 0 : null === (s = A.at(0)) || void 0 === s ? void 0 : s.xPct) && void 0 !== B ? B : -.5, null !== (U = null == A ? void 0 : null === (c = A.at(0)) || void 0 === c ? void 0 : c.yPct) && void 0 !== U ? U : .5],
                        scale: [L, L]
                    }, {
                        position: [null !== (F = null == A ? void 0 : null === (u = A.at(1)) || void 0 === u ? void 0 : u.xPct) && void 0 !== F ? F : .5, null !== (I = null == A ? void 0 : null === (d = A.at(1)) || void 0 === d ? void 0 : d.yPct) && void 0 !== I ? I : .5],
                        scale: [R, R]
                    }, {
                        position: [null !== (E = null == A ? void 0 : null === (g = A.at(2)) || void 0 === g ? void 0 : g.xPct) && void 0 !== E ? E : -.5, null !== (Q = null == A ? void 0 : null === (p = A.at(2)) || void 0 === p ? void 0 : p.yPct) && void 0 !== Q ? Q : -.5],
                        scale: [k, k]
                    }, {
                        position: [null !== (j = null == A ? void 0 : null === (f = A.at(3)) || void 0 === f ? void 0 : f.xPct) && void 0 !== j ? j : .5, null !== (S = null == A ? void 0 : null === (m = A.at(3)) || void 0 === m ? void 0 : m.yPct) && void 0 !== S ? S : -.5],
                        scale: [q, q]
                    }]
                };

            function B(A, e) {
                return void 0 === e ? "#".concat(A) : "#".concat(A, "-").concat(e)
            }

            function U(A, e, t) {
                switch (A) {
                    case "Split":
                    case "ScreenShare":
                        return (0, r.Qh)(e, t);
                    case "Fit":
                    default:
                        return (0, r.tl)(e, t);
                    case "Three":
                        return (0, r.Db)(e, t);
                    case "Four":
                        return (0, r.fn)(e, t)
                }
            }
            let F = A => {
                let e = ["KeyFrameTrack", "BRollTrack", "MediaTrack", "TextOverlayTrack", "VideoEffectTrack", "VoiceOverTrack", "AudioTrack", "ScreenOverlayTrack"];
                return A.tracks.filter(A => {
                    let {
                        trackType: t
                    } = A;
                    return e.includes(t)
                }).reduce((A, e) => {
                    var t, i, n;
                    return e ? Math.max(A, null !== (n = null === (i = e.sections.at(-1)) || void 0 === i ? void 0 : null === (t = i.sectionTimeline) || void 0 === t ? void 0 : t.out) && void 0 !== n ? n : 0) : A
                }, 0)
            };

            function I(A) {
                var e, t;
                let i;
                try {
                    i = new URL(A).pathname
                } catch (e) {
                    i = A
                }
                return (i = null !== (t = null === (e = i.split("?")[0]) || void 0 === e ? void 0 : e.split("#")[0]) && void 0 !== t ? t : "").toLowerCase().endsWith(".gif")
            }
        },
        34966: function(A, e, t) {
            "use strict";
            t.d(e, {
                $u: function() {
                    return c
                },
                DL: function() {
                    return a
                },
                aO: function() {
                    return o
                },
                bL: function() {
                    return r
                },
                fS: function() {
                    return s
                },
                is: function() {
                    return l
                },
                r6: function() {
                    return u
                }
            });
            var i = t(30815),
                n = t(4670);

            function o(A, e) {
                return A < e ? {
                    wPct: 1,
                    hPct: A / e
                } : A === e ? {
                    wPct: 1,
                    hPct: 1
                } : {
                    wPct: e / A,
                    hPct: 1
                }
            }

            function l(A, e, t) {
                return "horizontal" === e ? (0, n._)((0, i._)({}, A), {
                    wPct: A.wPct * t
                }) : "vertical" === e ? (0, n._)((0, i._)({}, A), {
                    hPct: A.hPct * t
                }) : (0, n._)((0, i._)({}, A), {
                    wPct: A.wPct * t,
                    hPct: A.hPct * t
                })
            }

            function r(A) {
                let {
                    wPct: e,
                    hPct: t,
                    xPct: i,
                    yPct: n
                } = A;
                return e > 1 && (t = 1 / e * t, e = 1), t > 1 && (e = 1 / t * e, t = 1), i + e > 1 && (i = 1 - e), -i + e > 1 && (i = e - 1), n + t > 1 && (n = 1 - t), -n + t > 1 && (n = t - 1), {
                    wPct: e,
                    hPct: t,
                    xPct: i,
                    yPct: n
                }
            }

            function a(A, e, t, i) {
                return {
                    wPct: A * t.width / i.width,
                    hPct: e * t.height / i.height
                }
            }

            function s(A, e) {
                return Math.min(e.width / A.width, e.height / A.height)
            }

            function c(A, e) {
                let t = [
                        [A.xPct - A.wPct, A.yPct - A.hPct],
                        [A.xPct + A.wPct, A.yPct + A.hPct]
                    ],
                    i = [
                        [e.xPct - e.wPct, e.yPct - e.hPct],
                        [e.xPct + e.wPct, e.yPct + e.hPct]
                    ],
                    n = [Math.max(t[0][0], i[0][0]), Math.min(t[0][1], i[0][1])],
                    o = [Math.min(t[1][0], i[1][0]), Math.max(t[1][1], i[1][1])],
                    l = o[0] - n[0],
                    r = o[1] - n[1];
                return l < 0 || r < 0 ? "Disjoint" : u(l, 2 * A.wPct) && u(r, 2 * A.hPct) ? "Containment" : u(l, 2 * e.wPct) && u(r, 2 * e.hPct) ? "Containment" : u(l, 0) || u(r, 0) ? "Externally Tangent" : "Overlap"
            }

            function u(A, e) {
                let t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .001;
                return Math.abs(A - e) < t
            }
        },
        28073: function(A, e, t) {
            "use strict";
            t.d(e, {
                x: function() {
                    return n
                }
            });
            var i = t(32364);

            function n(A) {
                return "".concat(A, "-").concat((0, i.Z)(6))
            }
        },
        35864: function(A, e, t) {
            "use strict";
            t.d(e, {
                q: function() {
                    return l
                },
                z: function() {
                    return o
                }
            });
            var i = t(30815),
                n = t(28073);

            function o(A, e) {
                var t, o, r;
                if (!A || !e) return;
                let a = null === (t = A.screenOverlays) || void 0 === t ? void 0 : t[0];
                if (!a) return;
                let s = null !== (r = null === (o = a.timelines) || void 0 === o ? void 0 : o[0]) && void 0 !== r ? r : l(e),
                    c = {
                        sO: 0,
                        eO: s.out - s.in,
                        type: "TS"
                    };
                return {
                    id: (0, n.x)("track"),
                    trackType: "ScreenOverlayTrack",
                    sections: [{
                        id: (0, n.x)("section"),
                        sectionTimeline: (0, i._)({}, s),
                        sectionDuration: (0, i._)({}, c),
                        segments: [{
                            id: (0, n.x)("segment"),
                            timeline: (0, i._)({}, s),
                            duration: (0, i._)({}, c),
                            contentType: "ScreenOverlay",
                            content: {
                                bucket: a.object.bucket,
                                path: a.object.name,
                                targetArea: a.rect,
                                duration: (0, i._)({}, c),
                                timeline: (0, i._)({}, s)
                            }
                        }]
                    }]
                }
            }

            function l(A) {
                let e = { in: 0,
                    out: 0
                };
                return A.sections.forEach(A => {
                    var t, i;
                    (null === (t = A.propertiesMap) || void 0 === t ? void 0 : t.subType) === "intro" && (e.in = A.sectionTimeline.out), (null === (i = A.propertiesMap) || void 0 === i ? void 0 : i.subType) === "outro" ? e.out = A.sectionTimeline.in: e.out = A.sectionTimeline.out
                }), e
            }
        },
        489: function(A, e, t) {
            "use strict";
            t.d(e, {
                tl: function() {
                    return a
                },
                fn: function() {
                    return c
                },
                Qh: function() {
                    return r
                },
                Db: function() {
                    return s
                },
                Mf: function() {
                    return l
                }
            });
            var i = t(30815),
                n = t(15638);
            let o = {
                caption: {
                    top: {
                        bPct: n.Xv,
                        lPct: 16.67,
                        rPct: 16.67
                    },
                    bottom: {
                        bPct: n.et,
                        lPct: 16.67,
                        rPct: 16.67
                    }
                },
                vhook: {
                    top: {
                        bPct: 74.53,
                        lPct: 16.67,
                        rPct: 16.67
                    },
                    bottom: {
                        bPct: 19.14,
                        lPct: 16.67,
                        rPct: 16.67
                    }
                }
            };

            function l(A) {
                return {
                    bPct: "landscape" === A ? n.zx : n.aQ,
                    hAlign: "center"
                }
            }

            function r(A, e) {
                return "emoji" === A ? l(e) : {
                    hAlign: "center",
                    vAlign: "center"
                }
            }

            function a(A, e) {
                return "caption" === A ? (0, i._)({
                    hAlign: "center"
                }, o.caption.bottom) : "emoji" === A ? l(e) : (0, i._)({
                    hAlign: "center"
                }, o.vhook.top)
            }

            function s(A, e) {
                return "emoji" === A ? l(e) : {
                    hAlign: "center",
                    vAlign: "center"
                }
            }

            function c(A, e) {
                return "emoji" === A ? l(e) : {
                    hAlign: "center",
                    vAlign: "center"
                }
            }
        },
        3204: function(A, e, t) {
            "use strict";
            var i = t(2784),
                n = t(17380),
                o = t(46207);
            e.Z = function(A) {
                o.Z && !(0, n.mf)(A) && console.error("useMemoizedFn expected parameter is a function, got ".concat(typeof A));
                var e = (0, i.useRef)(A);
                e.current = (0, i.useMemo)(function() {
                    return A
                }, [A]);
                var t = (0, i.useRef)();
                return t.current || (t.current = function() {
                    for (var A = [], t = 0; t < arguments.length; t++) A[t] = arguments[t];
                    return e.current.apply(this, A)
                }), t.current
            }
        },
        8667: function(A, e, t) {
            "use strict";
            var i = t(2784),
                n = function(A, e) {
                    return !Object.is(A, e)
                };
            e.Z = function(A, e) {
                void 0 === e && (e = n);
                var t = (0, i.useRef)(),
                    o = (0, i.useRef)();
                return e(o.current, A) && (t.current = o.current, o.current = A), t.current
            }
        },
        95318: function(A, e, t) {
            "use strict";
            var i = t(2784),
                n = t(3204),
                o = t(17380);
            e.Z = function(A, e) {
                var t = (0, n.Z)(A),
                    l = (0, i.useRef)(null),
                    r = (0, i.useCallback)(function() {
                        l.current && clearTimeout(l.current)
                    }, []);
                return (0, i.useEffect)(function() {
                    if ((0, o.hj)(e) && !(e < 0)) return l.current = setTimeout(t, e), r
                }, [e]), r
            }
        },
        25933: function(A, e, t) {
            "use strict";
            t.d(e, {
                S: function() {
                    return r
                }
            });
            var i, n = t(2784),
                o = [0],
                l = (i = new Map, {
                    getObserver: function(A) {
                        var e = A.root,
                            t = A.rootMargin,
                            n = A.threshold,
                            o = i.get(e);
                        o || (o = new Map, i.set(e, o));
                        var l = JSON.stringify({
                                rootMargin: t,
                                threshold: n
                            }),
                            r = o.get(l);
                        if (!r) {
                            var a = new Map;
                            r = {
                                observer: new IntersectionObserver(function(A) {
                                    A.forEach(function(A) {
                                        var e = a.get(A.target);
                                        null == e || e(A)
                                    })
                                }, {
                                    root: e,
                                    rootMargin: t,
                                    threshold: n
                                }),
                                entryCallbacks: a
                            }, o.set(l, r)
                        }
                        return {
                            observe: function(A, e) {
                                var t, i;
                                null == (t = r) || t.entryCallbacks.set(A, e), null == (i = r) || i.observer.observe(A)
                            },
                            unobserve: function(A) {
                                var e, t;
                                null == (e = r) || e.entryCallbacks.delete(A), null == (t = r) || t.observer.unobserve(A)
                            }
                        }
                    }
                });

            function r(A) {
                var e, t, i = null != (e = null == A ? void 0 : A.rootMargin) ? e : "0px",
                    r = null != (t = null == A ? void 0 : A.threshold) ? t : o,
                    a = (0, n.useRef)(null),
                    s = (0, n.useRef)(null),
                    c = (0, n.useRef)(null),
                    u = (0, n.useState)(),
                    d = u[0],
                    g = u[1],
                    p = (0, n.useCallback)(function() {
                        var A = a.current;
                        if (!A) {
                            g(void 0);
                            return
                        }
                        var e = l.getObserver({
                            root: s.current,
                            rootMargin: i,
                            threshold: r
                        });
                        e.observe(A, function(A) {
                            g(A)
                        }), c.current = e
                    }, [i, r]),
                    f = (0, n.useCallback)(function() {
                        var A = c.current,
                            e = a.current;
                        e && (null == A || A.unobserve(e)), c.current = null
                    }, []);
                return [(0, n.useCallback)(function(A) {
                    f(), a.current = A, p()
                }, [p, f]), {
                    entry: d,
                    rootRef: (0, n.useCallback)(function(A) {
                        f(), s.current = A, p()
                    }, [p, f])
                }]
            }
        },
        6804: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return s
                }
            });
            for (var i, n = new Uint8Array(16), o = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i, l = [], r = 0; r < 256; ++r) l.push((r + 256).toString(16).substr(1));
            var a = function(A) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                        t = (l[A[e + 0]] + l[A[e + 1]] + l[A[e + 2]] + l[A[e + 3]] + "-" + l[A[e + 4]] + l[A[e + 5]] + "-" + l[A[e + 6]] + l[A[e + 7]] + "-" + l[A[e + 8]] + l[A[e + 9]] + "-" + l[A[e + 10]] + l[A[e + 11]] + l[A[e + 12]] + l[A[e + 13]] + l[A[e + 14]] + l[A[e + 15]]).toLowerCase();
                    if (!("string" == typeof t && o.test(t))) throw TypeError("Stringified UUID is invalid");
                    return t
                },
                s = function(A, e, t) {
                    var o = (A = A || {}).random || (A.rng || function() {
                        if (!i && !(i = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                        return i(n)
                    })();
                    if (o[6] = 15 & o[6] | 64, o[8] = 63 & o[8] | 128, e) {
                        t = t || 0;
                        for (var l = 0; l < 16; ++l) e[t + l] = o[l];
                        return e
                    }
                    return a(o)
                }
        },
        26005: function(A, e, t) {
            "use strict";
            t.d(e, {
                s: function() {
                    return o
                }
            });
            var i = t(67067),
                n = t(65058);

            function o(A) {
                let e = (0, n.cn)(A, (A, t, n) => t(e, (0, i.Uy)(A(e), "function" == typeof n ? n : () => n)));
                return e
            }
        },
        45384: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return s
                }
            });
            var i = t(38714),
                n = t(19678),
                o = t(48465),
                l = t(52059),
                r = n.Z ? n.Z.isConcatSpreadable : void 0,
                a = function(A) {
                    return (0, l.Z)(A) || (0, o.Z)(A) || !!(r && A && A[r])
                },
                s = function A(e, t, n, o, l) {
                    var r = -1,
                        s = e.length;
                    for (n || (n = a), l || (l = []); ++r < s;) {
                        var c = e[r];
                        t > 0 && n(c) ? t > 1 ? A(c, t - 1, n, o, l) : (0, i.Z)(l, c) : o || (l[l.length] = c)
                    }
                    return l
                }
        },
        90820: function(A, e, t) {
            "use strict";
            var i = t(1809),
                n = t(3417);
            e.Z = function(A, e) {
                return A && (0, i.Z)(A, e, n.Z)
            }
        },
        5489: function(A, e, t) {
            "use strict";
            var i = t(59646),
                n = t(14551);
            e.Z = function(A, e) {
                e = (0, i.Z)(e, A);
                for (var t = 0, o = e.length; null != A && t < o;) A = A[(0, n.Z)(e[t++])];
                return t && t == o ? A : void 0
            }
        },
        66258: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return C
                }
            });
            var i = t(23782),
                n = t(60251),
                o = function(A, e, t, o) {
                    var l = t.length,
                        r = l,
                        a = !o;
                    if (null == A) return !r;
                    for (A = Object(A); l--;) {
                        var s = t[l];
                        if (a && s[2] ? s[1] !== A[s[0]] : !(s[0] in A)) return !1
                    }
                    for (; ++l < r;) {
                        var c = (s = t[l])[0],
                            u = A[c],
                            d = s[1];
                        if (a && s[2]) {
                            if (void 0 === u && !(c in A)) return !1
                        } else {
                            var g = new i.Z;
                            if (o) var p = o(u, d, c, A, e, g);
                            if (!(void 0 === p ? (0, n.Z)(d, u, 3, o, g) : p)) return !1
                        }
                    }
                    return !0
                },
                l = t(88225),
                r = function(A) {
                    return A == A && !(0, l.Z)(A)
                },
                a = t(3417),
                s = function(A) {
                    for (var e = (0, a.Z)(A), t = e.length; t--;) {
                        var i = e[t],
                            n = A[i];
                        e[t] = [i, n, r(n)]
                    }
                    return e
                },
                c = function(A, e) {
                    return function(t) {
                        return null != t && t[A] === e && (void 0 !== e || A in Object(t))
                    }
                },
                u = function(A) {
                    var e = s(A);
                    return 1 == e.length && e[0][2] ? c(e[0][0], e[0][1]) : function(t) {
                        return t === A || o(t, A, e)
                    }
                },
                d = t(5489),
                g = function(A, e, t) {
                    var i = null == A ? void 0 : (0, d.Z)(A, e);
                    return void 0 === i ? t : i
                },
                p = t(23834),
                f = t(41872),
                m = t(14551),
                h = t(45036),
                v = t(52059),
                x = t(85143),
                C = function(A) {
                    var e, t, i;
                    if ("function" == typeof A) return A;
                    if (null == A) return h.Z;
                    if ("object" == typeof A) {
                        return (0, v.Z)(A) ? (e = A[0], t = A[1], (0, f.Z)(e) && r(t) ? c((0, m.Z)(e), t) : function(A) {
                            var i = g(A, e);
                            return void 0 === i && i === t ? (0, p.Z)(A, e) : (0, n.Z)(t, i, 3)
                        }) : u(A)
                    }
                    return i = A, (0, f.Z)(i) ? (0, x.Z)((0, m.Z)(i)) : function(A) {
                        return (0, d.Z)(A, i)
                    }
                }
        },
        39254: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return g
                }
            });
            var i = t(36446),
                n = function(A, e, t, i) {
                    for (var n = A.length, o = t + (i ? 1 : -1); i ? o-- : ++o < n;)
                        if (e(A[o], o, A)) return o;
                    return -1
                },
                o = function(A) {
                    return A != A
                },
                l = function(A, e, t) {
                    for (var i = t - 1, n = A.length; ++i < n;)
                        if (A[i] === e) return i;
                    return -1
                },
                r = function(A, e) {
                    return !!(null == A ? 0 : A.length) && (e == e ? l(A, e, 0) : n(A, o, 0)) > -1
                },
                a = function(A, e, t) {
                    for (var i = -1, n = null == A ? 0 : A.length; ++i < n;)
                        if (t(e, A[i])) return !0;
                    return !1
                },
                s = t(22407),
                c = t(83864),
                u = t(74994),
                d = c.Z && 1 / (0, u.Z)(new c.Z([, -0]))[1] == 1 / 0 ? function(A) {
                    return new c.Z(A)
                } : function() {},
                g = function(A, e, t) {
                    var n = -1,
                        o = r,
                        l = A.length,
                        c = !0,
                        g = [],
                        p = g;
                    if (t) c = !1, o = a;
                    else if (l >= 200) {
                        var f = e ? null : d(A);
                        if (f) return (0, u.Z)(f);
                        c = !1, o = s.Z, p = new i.Z
                    } else p = e ? [] : g;
                    A: for (; ++n < l;) {
                        var m = A[n],
                            h = e ? e(m) : m;
                        if (m = t || 0 !== m ? m : 0, c && h == h) {
                            for (var v = p.length; v--;)
                                if (p[v] === h) continue A;
                            e && p.push(h), g.push(m)
                        } else o(p, h, t) || (p !== g && p.push(h), g.push(m))
                    }
                    return g
                }
        },
        26566: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return a
                }
            });
            var i = t(59646),
                n = function(A) {
                    var e = null == A ? 0 : A.length;
                    return e ? A[e - 1] : void 0
                },
                o = t(5489),
                l = t(95068),
                r = t(14551),
                a = function(A, e) {
                    var t, a;
                    return e = (0, i.Z)(e, A), t = A, null == (A = (a = e).length < 2 ? t : (0, o.Z)(t, (0, l.Z)(a, 0, -1))) || delete A[r.Z(n(e))]
                }
        },
        59646: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return g
                }
            });
            var i, n, o = t(52059),
                l = t(41872),
                r = t(28114);

            function a(A, e) {
                if ("function" != typeof A || null != e && "function" != typeof e) throw TypeError("Expected a function");
                var t = function() {
                    var i = arguments,
                        n = e ? e.apply(this, i) : i[0],
                        o = t.cache;
                    if (o.has(n)) return o.get(n);
                    var l = A.apply(this, i);
                    return t.cache = o.set(n, l) || o, l
                };
                return t.cache = new(a.Cache || r.Z), t
            }
            a.Cache = r.Z;
            var s = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                c = /\\(\\)?/g,
                u = (n = (i = a(function(A) {
                    var e = [];
                    return 46 === A.charCodeAt(0) && e.push(""), A.replace(s, function(A, t, i, n) {
                        e.push(i ? n.replace(c, "$1") : t || A)
                    }), e
                }, function(A) {
                    return 500 === n.size && n.clear(), A
                })).cache, i),
                d = t(16601),
                g = function(A, e) {
                    return (0, o.Z)(A) ? A : (0, l.Z)(A, e) ? [A] : u((0, d.Z)(A))
                }
        },
        64040: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return r
                }
            });
            var i = t(45384),
                n = function(A) {
                    return (null == A ? 0 : A.length) ? (0, i.Z)(A, 1) : []
                },
                o = t(22203),
                l = t(14964),
                r = function(A) {
                    return (0, l.Z)((0, o.Z)(A, void 0, n), A + "")
                }
        },
        41872: function(A, e, t) {
            "use strict";
            var i = t(52059),
                n = t(81470),
                o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                l = /^\w*$/;
            e.Z = function(A, e) {
                if ((0, i.Z)(A)) return !1;
                var t = typeof A;
                return !!("number" == t || "symbol" == t || "boolean" == t || null == A || (0, n.Z)(A)) || l.test(A) || !o.test(A) || null != e && A in Object(e)
            }
        },
        14551: function(A, e, t) {
            "use strict";
            var i = t(81470),
                n = 1 / 0;
            e.Z = function(A) {
                if ("string" == typeof A || (0, i.Z)(A)) return A;
                var e = A + "";
                return "0" == e && 1 / A == -n ? "-0" : e
            }
        },
        79298: function(A, e, t) {
            "use strict";
            var i = t(38714),
                n = t(45384),
                o = t(43737),
                l = t(52059);
            e.Z = function() {
                var A = arguments.length;
                if (!A) return [];
                for (var e = Array(A - 1), t = arguments[0], r = A; r--;) e[r - 1] = arguments[r];
                return (0, i.Z)((0, l.Z)(t) ? (0, o.Z)(t) : [t], (0, n.Z)(e, 1))
            }
        },
        23834: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return u
                }
            });
            var i = function(A, e) {
                    return null != A && e in Object(A)
                },
                n = t(59646),
                o = t(48465),
                l = t(52059),
                r = t(76325),
                a = t(45432),
                s = t(14551),
                c = function(A, e, t) {
                    e = (0, n.Z)(e, A);
                    for (var i = -1, c = e.length, u = !1; ++i < c;) {
                        var d = (0, s.Z)(e[i]);
                        if (!(u = null != A && t(A, d))) break;
                        A = A[d]
                    }
                    return u || ++i != c ? u : !!(c = null == A ? 0 : A.length) && (0, a.Z)(c) && (0, r.Z)(d, c) && ((0, l.Z)(A) || (0, o.Z)(A))
                },
                u = function(A, e) {
                    return null != A && c(A, e, i)
                }
        },
        44527: function(A, e, t) {
            "use strict";
            var i = t(60251);
            e.Z = function(A, e) {
                return (0, i.Z)(A, e)
            }
        },
        83646: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return d
                }
            });
            var i, n, o = t(25079),
                l = t(66258),
                r = t(90820),
                a = t(18226),
                s = (i = r.Z, function(A, e) {
                    if (null == A) return A;
                    if (!(0, a.Z)(A)) return i(A, e);
                    for (var t = A.length, o = -1, l = Object(A);
                        (n ? o-- : ++o < t) && !1 !== e(l[o], o, l););
                    return A
                }),
                c = function(A, e) {
                    var t = -1,
                        i = (0, a.Z)(A) ? Array(A.length) : [];
                    return s(A, function(A, n, o) {
                        i[++t] = e(A, n, o)
                    }), i
                },
                u = t(52059),
                d = function(A, e) {
                    return ((0, u.Z)(A) ? o.Z : c)(A, (0, l.Z)(e, 3))
                }
        },
        6034: function(A, e, t) {
            "use strict";
            var i = t(65253),
                n = (0, t(7733).Z)(function(A, e, t, n) {
                    (0, i.Z)(A, e, t, n)
                });
            e.Z = n
        },
        69835: function(A, e, t) {
            "use strict";
            t.d(e, {
                Z: function() {
                    return d
                }
            });
            var i = t(25079),
                n = t(4681),
                o = t(26566),
                l = t(59646),
                r = t(28363),
                a = t(36394),
                s = function(A) {
                    return (0, a.Z)(A) ? void 0 : A
                },
                c = t(64040),
                u = t(58242),
                d = (0, c.Z)(function(A, e) {
                    var t = {};
                    if (null == A) return t;
                    var a = !1;
                    e = (0, i.Z)(e, function(e) {
                        return e = (0, l.Z)(e, A), a || (a = e.length > 1), e
                    }), (0, r.Z)(A, (0, u.Z)(A), t), a && (t = (0, n.Z)(t, 7, s));
                    for (var c = e.length; c--;)(0, o.Z)(t, e[c]);
                    return t
                })
        },
        64556: function(A, e, t) {
            "use strict";
            var i = t(39254);
            e.Z = function(A) {
                return A && A.length ? (0, i.Z)(A) : []
            }
        },
        84810: function(A, e, t) {
            "use strict";
            var i = t(26566);
            e.Z = function(A, e) {
                return null == A || (0, i.Z)(A, e)
            }
        },
        81438: function(A, e, t) {
            "use strict";
            t.d(e, {
                H: function() {
                    return b
                }
            });
            var i = t(2784),
                n = Object.defineProperty,
                o = Object.getOwnPropertySymbols,
                l = Object.prototype.hasOwnProperty,
                r = Object.prototype.propertyIsEnumerable,
                a = (A, e, t) => e in A ? n(A, e, {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: t
                }) : A[e] = t,
                s = (A, e) => {
                    for (var t in e || (e = {})) l.call(e, t) && a(A, t, e[t]);
                    if (o)
                        for (var t of o(e)) r.call(e, t) && a(A, t, e[t]);
                    return A
                },
                c = (A, e) => {
                    var t = {};
                    for (var i in A) l.call(A, i) && 0 > e.indexOf(i) && (t[i] = A[i]);
                    if (null != A && o)
                        for (var i of o(A)) 0 > e.indexOf(i) && r.call(A, i) && (t[i] = A[i]);
                    return t
                },
                u = (A, e) => {
                    let t = "[react-use-intercom]";
                    switch (A) {
                        case "info":
                        default:
                            console.log(`${t} ${e}`);
                            break;
                        case "warn":
                            console.warn(`${t} ${e}`);
                            break;
                        case "error":
                            console.error(`${t} ${e}`)
                    }
                },
                d = "undefined" == typeof window,
                g = A => (Object.keys(A).forEach(e => {
                    A[e] && "object" == typeof A[e] ? g(A[e]) : void 0 === A[e] && delete A[e]
                }), A),
                p = (A, ...e) => {
                    if (!d && window.Intercom) return window.Intercom.apply(null, [A, ...e]);
                    u("error", `${A} Intercom instance is not initalized yet`)
                },
                f = i.createContext(void 0),
                m = (A, e = 0) => {
                    var t = window,
                        i = t.Intercom;
                    if ("function" == typeof i) i("reattach_activator"), i("update", t.intercomSettings);
                    else {
                        var n = document,
                            o = function() {
                                o.c(arguments)
                            };
                        o.q = [], o.c = function(A) {
                            o.q.push(A)
                        }, t.Intercom = o;
                        var l = function() {
                            setTimeout(function() {
                                var e = n.createElement("script");
                                e.type = "text/javascript", e.async = !0, e.src = "https://widget.intercom.io/widget/" + A;
                                var t = n.getElementsByTagName("script")[0];
                                t.parentNode.insertBefore(e, t)
                            }, e)
                        };
                        "complete" === document.readyState ? l() : t.attachEvent ? t.attachEvent("onload", l) : t.addEventListener("load", l, !1)
                    }
                },
                h = A => ({
                    custom_launcher_selector: A.customLauncherSelector,
                    alignment: A.alignment,
                    vertical_padding: A.verticalPadding,
                    horizontal_padding: A.horizontalPadding,
                    hide_default_launcher: A.hideDefaultLauncher,
                    session_duration: A.sessionDuration,
                    action_color: A.actionColor,
                    background_color: A.backgroundColor
                }),
                v = A => s({
                    company_id: A.companyId,
                    name: A.name,
                    created_at: A.createdAt,
                    plan: A.plan,
                    monthly_spend: A.monthlySpend,
                    user_count: A.userCount,
                    size: A.size,
                    website: A.website,
                    industry: A.industry
                }, A.customAttributes),
                x = A => ({
                    type: A.type,
                    image_url: A.imageUrl
                }),
                C = A => {
                    var e;
                    return s({
                        email: A.email,
                        user_id: A.userId,
                        created_at: A.createdAt,
                        name: A.name,
                        phone: A.phone,
                        last_request_at: A.lastRequestAt,
                        unsubscribed_from_emails: A.unsubscribedFromEmails,
                        language_override: A.languageOverride,
                        utm_campaign: A.utmCampaign,
                        utm_content: A.utmContent,
                        utm_medium: A.utmMedium,
                        utm_source: A.utmSource,
                        utm_term: A.utmTerm,
                        avatar: A.avatar && x(A.avatar),
                        user_hash: A.userHash,
                        company: A.company && v(A.company),
                        companies: null == (e = A.companies) ? void 0 : e.map(v)
                    }, A.customAttributes)
                },
                K = A => g(s(s({}, h(A)), C(A))),
                b = A => {
                    var {
                        appId: e,
                        autoBoot: t = !1,
                        autoBootProps: n,
                        children: o,
                        onHide: l,
                        onShow: r,
                        onUnreadCountChange: a,
                        onUserEmailSupplied: g,
                        shouldInitialize: h = !d,
                        apiBase: v,
                        initializeDelay: x
                    } = A, C = c(A, ["appId", "autoBoot", "autoBootProps", "children", "onHide", "onShow", "onUnreadCountChange", "onUserEmailSupplied", "shouldInitialize", "apiBase", "initializeDelay"]);
                    let b = i.useRef(!1),
                        y = i.useRef(!1),
                        [w, B] = i.useState(!1),
                        U = Object.keys(C).filter(A => !A.startsWith("data-"));
                    U.length > 0 && u("warn", `some invalid props were passed to IntercomProvider. Please check following props: ${U.join(", ")}.`);
                    let F = i.useCallback(() => {
                            B(!1), l && l()
                        }, [l, B]),
                        I = i.useCallback(() => {
                            B(!0), r && r()
                        }, [r, B]),
                        E = i.useCallback(A => {
                            if (!window.Intercom && !h) {
                                u("warn", "Intercom instance is not initialized because `shouldInitialize` is set to `false` in `IntercomProvider`");
                                return
                            }
                            p("onHide", F), p("onShow", I), p("onUserEmailSupplied", g), a && p("onUnreadCountChange", a);
                            let t = s(s({
                                app_id: e
                            }, v && {
                                api_base: v
                            }), A && K(A));
                            window.intercomSettings = t, p("boot", t), b.current = !0
                        }, [v, e, F, I, a, g, h]);
                    i.useEffect(() => {
                        d || !h || y.current || (m(e, x), t && E(n), y.current = !0)
                    }, [e, t, n, E, x, h]);
                    let Q = i.useCallback((A, e) => {
                            if (!window.Intercom && !h) {
                                u("warn", "Intercom instance is not initialized because `shouldInitialize` is set to `false` in `IntercomProvider`");
                                return
                            }
                            if (!b.current) {
                                u("warn", `"${A}" was called but Intercom has not booted yet. Please call 'boot' before calling '${A}' or set 'autoBoot' to true in the IntercomProvider.`);
                                return
                            }
                            return e()
                        }, [h]),
                        j = i.useCallback(() => {
                            b.current && (p("shutdown"), delete window.intercomSettings, b.current = !1)
                        }, []),
                        S = i.useCallback(() => {
                            b.current && (p("shutdown"), delete window.Intercom, delete window.intercomSettings, b.current = !1)
                        }, []),
                        L = i.useCallback(() => {
                            Q("update", () => {
                                p("update", {
                                    last_request_at: Math.floor(new Date().getTime() / 1e3)
                                })
                            })
                        }, [Q]),
                        R = i.useCallback(A => {
                            Q("update", () => {
                                if (!A) {
                                    L();
                                    return
                                }
                                let e = K(A);
                                window.intercomSettings = s(s({}, window.intercomSettings), e), p("update", e)
                            })
                        }, [Q, L]),
                        k = i.useCallback(() => {
                            Q("hide", () => {
                                p("hide")
                            })
                        }, [Q]),
                        q = i.useCallback(() => {
                            Q("show", () => p("show"))
                        }, [Q]),
                        O = i.useCallback(() => {
                            Q("showMessages", () => {
                                p("showMessages")
                            })
                        }, [Q]),
                        D = i.useCallback(A => {
                            Q("showNewMessage", () => {
                                A ? p("showNewMessage", A) : p("showNewMessage")
                            })
                        }, [Q]),
                        P = i.useCallback(() => Q("getVisitorId", () => p("getVisitorId")), [Q]),
                        N = i.useCallback(A => {
                            Q("startTour", () => {
                                p("startTour", A)
                            })
                        }, [Q]),
                        Z = i.useCallback(A => {
                            Q("startChecklist", () => {
                                p("startChecklist", A)
                            })
                        }, [Q]),
                        M = i.useCallback((A, e) => {
                            Q("trackEvent", () => {
                                e ? p("trackEvent", A, e) : p("trackEvent", A)
                            })
                        }, [Q]),
                        V = i.useCallback(A => Q("showArticle", () => {
                            p("showArticle", A)
                        }), [Q]),
                        T = i.useCallback(A => Q("showSpace", () => {
                            p("showSpace", A)
                        }), [Q]),
                        Y = i.useCallback(A => {
                            Q("startSurvey", () => {
                                p("startSurvey", A)
                            })
                        }, [Q]),
                        H = i.useCallback(A => Q("showNews", () => {
                            p("showNews", A)
                        }), [Q]),
                        _ = i.useCallback(A => Q("showTicket", () => {
                            p("showTicket", A)
                        }), [Q]),
                        W = i.useCallback(A => Q("showConversation", () => {
                            p("showConversation", A)
                        }), [Q]),
                        G = i.useMemo(() => ({
                            boot: E,
                            shutdown: j,
                            hardShutdown: S,
                            update: R,
                            hide: k,
                            show: q,
                            isOpen: w,
                            showMessages: O,
                            showNewMessage: D,
                            getVisitorId: P,
                            startTour: N,
                            startChecklist: Z,
                            trackEvent: M,
                            showArticle: V,
                            startSurvey: Y,
                            showSpace: T,
                            showNews: H,
                            showTicket: _,
                            showConversation: W
                        }), [E, j, S, R, k, q, w, O, D, P, N, Z, M, V, Y, T, H, _, W]);
                    return i.createElement(f.Provider, {
                        value: G
                    }, o)
                }
        }
    },
    function(A) {
        A.O(0, [84, 6361, 2888, 179], function() {
            return A(A.s = 84992)
        }), _N_E = A.O()
    }
]);