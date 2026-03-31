! function() {
    try {
        var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
            n = (new e.Error).stack;
        n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "3a354d77-e604-40d9-bf73-3e60afa42bd0", e._sentryDebugIdIdentifier = "sentry-dbid-3a354d77-e604-40d9-bf73-3e60afa42bd0")
    } catch (e) {}
}(), self.onmessage = () => {
    ! function() {
        let e = function() {
                let e = performance.now();
                for (let e = 0; e < 1e8; e++);
                return performance.now() - e
            }(),
            n = function() {
                let e = performance.now();
                for (let e = 0; e < 1e8; e++);
                return performance.now() - e
            }(),
            r = function() {
                let e = performance.now(),
                    n = Array(1e7).fill(0);
                for (let e = 0; e < n.length; e++) n[e] = Math.random();
                return performance.now() - e
            }(),
            o = function() {
                let e = performance.now();
                for (let e = 0; e < 1e8; e++);
                return performance.now() - e
            }();
        self.postMessage({
            integerTime: Math.round(e),
            floatTime: Math.round(n),
            memoryTime: Math.round(r),
            branchTime: Math.round(o)
        })
    }()
}, _N_E = {};