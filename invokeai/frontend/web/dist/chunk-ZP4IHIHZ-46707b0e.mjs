import { useEffect as k, memo as W, useState as $, useMemo as T, useSyncExternalStore as H } from "react";
import { d as V, eN as F, E as j, j as l, g as K, a as h, L as g, I as y, c as S, aX as U, f as A, b as p, o as X, k as G, eO as J, A as Q, el as Y } from "./exports-bb43e98f.mjs";
var tt = (o, e) => o.find((s) => s.id === e);
function _(o, e) {
  const s = w(o, e), t = s ? o[s].findIndex((n) => n.id === e) : -1;
  return {
    position: s,
    index: t
  };
}
function w(o, e) {
  for (const [s, t] of Object.entries(o))
    if (tt(t, e))
      return s;
}
function et(o) {
  const e = o.includes("right"), s = o.includes("left");
  let t = "center";
  return e && (t = "flex-end"), s && (t = "flex-start"), {
    display: "flex",
    flexDirection: "column",
    alignItems: t
  };
}
function ot(o) {
  const s = o === "top" || o === "bottom" ? "0 auto" : void 0, t = o.includes("top") ? "env(safe-area-inset-top, 0px)" : void 0, n = o.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : void 0, r = o.includes("left") ? void 0 : "env(safe-area-inset-right, 0px)", a = o.includes("right") ? void 0 : "env(safe-area-inset-left, 0px)";
  return {
    position: "fixed",
    zIndex: 5500,
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    margin: s,
    top: t,
    bottom: n,
    right: r,
    left: a
  };
}
function nt(o, e) {
  const s = V(o);
  k(() => {
    if (e == null)
      return;
    let t = null;
    return t = window.setTimeout(() => {
      s();
    }, e), () => {
      t && window.clearTimeout(t);
    };
  }, [e, s]);
}
var st = {
  initial: (o) => {
    const { position: e } = o, s = ["top", "bottom"].includes(e) ? "y" : "x";
    let t = ["top-right", "bottom-right"].includes(e) ? 1 : -1;
    return e === "bottom" && (t = 1), {
      opacity: 0,
      [s]: t * 24
    };
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
}, P = W((o) => {
  const {
    id: e,
    message: s,
    onCloseComplete: t,
    onRequestRemove: n,
    requestClose: r = !1,
    position: a = "bottom",
    duration: i = 5e3,
    containerStyle: u,
    motionVariants: c = st,
    toastSpacing: m = "0.5rem"
  } = o, [v, x] = $(i), f = F();
  j(() => {
    f || t == null || t();
  }, [f]), j(() => {
    x(i);
  }, [i]);
  const q = () => x(null), D = () => x(i), C = () => {
    f && n();
  };
  k(() => {
    f && r && n();
  }, [f, r, n]), nt(C, v);
  const L = T(
    () => ({
      pointerEvents: "auto",
      maxWidth: 560,
      minWidth: 300,
      margin: m,
      ...u
    }),
    [u, m]
  ), z = T(() => et(a), [a]);
  return /* @__PURE__ */ l.jsx(
    K.li,
    {
      layout: !0,
      className: "chakra-toast",
      variants: c,
      initial: "initial",
      animate: "animate",
      exit: "exit",
      onHoverStart: q,
      onHoverEnd: D,
      custom: { position: a },
      style: z,
      children: /* @__PURE__ */ l.jsx(
        h.div,
        {
          role: "status",
          "aria-atomic": "true",
          className: "chakra-toast__inner",
          __css: L,
          children: g(s, { id: e, onClose: C })
        }
      )
    }
  );
});
P.displayName = "ToastComponent";
function rt(o, e) {
  var s;
  const t = o ?? "bottom", r = {
    "top-start": { ltr: "top-left", rtl: "top-right" },
    "top-end": { ltr: "top-right", rtl: "top-left" },
    "bottom-start": { ltr: "bottom-left", rtl: "bottom-right" },
    "bottom-end": { ltr: "bottom-right", rtl: "bottom-left" }
  }[t];
  return (s = r == null ? void 0 : r[e]) != null ? s : t;
}
function it(o) {
  return /* @__PURE__ */ l.jsx(y, { viewBox: "0 0 24 24", ...o, children: /* @__PURE__ */ l.jsx(
    "path",
    {
      fill: "currentColor",
      d: "M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
    }
  ) });
}
function at(o) {
  return /* @__PURE__ */ l.jsx(y, { viewBox: "0 0 24 24", ...o, children: /* @__PURE__ */ l.jsx(
    "path",
    {
      fill: "currentColor",
      d: "M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
    }
  ) });
}
function N(o) {
  return /* @__PURE__ */ l.jsx(y, { viewBox: "0 0 24 24", ...o, children: /* @__PURE__ */ l.jsx(
    "path",
    {
      fill: "currentColor",
      d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
    }
  ) });
}
var [lt, ct] = S({
  name: "AlertContext",
  hookName: "useAlertContext",
  providerName: "<Alert />"
}), [ut, b] = S({
  name: "AlertStylesContext",
  hookName: "useAlertStyles",
  providerName: "<Alert />"
}), E = {
  info: { icon: at, colorScheme: "blue" },
  warning: { icon: N, colorScheme: "orange" },
  success: { icon: it, colorScheme: "green" },
  error: { icon: N, colorScheme: "red" },
  loading: { icon: U, colorScheme: "blue" }
};
function dt(o) {
  return E[o].colorScheme;
}
function mt(o) {
  return E[o].icon;
}
var M = A(
  function(e, s) {
    const n = {
      display: "inline",
      ...b().description
    };
    return /* @__PURE__ */ l.jsx(
      h.div,
      {
        ref: s,
        ...e,
        className: p("chakra-alert__desc", e.className),
        __css: n
      }
    );
  }
);
M.displayName = "AlertDescription";
function R(o) {
  const { status: e } = ct(), s = mt(e), t = b(), n = e === "loading" ? t.spinner : t.icon;
  return /* @__PURE__ */ l.jsx(
    h.span,
    {
      display: "inherit",
      ...o,
      className: p("chakra-alert__icon", o.className),
      __css: n,
      children: o.children || /* @__PURE__ */ l.jsx(s, { h: "100%", w: "100%" })
    }
  );
}
R.displayName = "AlertIcon";
var B = A(
  function(e, s) {
    const t = b();
    return /* @__PURE__ */ l.jsx(
      h.div,
      {
        ref: s,
        ...e,
        className: p("chakra-alert__title", e.className),
        __css: t.title
      }
    );
  }
);
B.displayName = "AlertTitle";
var O = A(function(e, s) {
  var t;
  const { status: n = "info", addRole: r = !0, ...a } = X(e), i = (t = e.colorScheme) != null ? t : dt(n), u = G("Alert", { ...e, colorScheme: i }), c = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    ...u.container
  };
  return /* @__PURE__ */ l.jsx(lt, { value: { status: n }, children: /* @__PURE__ */ l.jsx(ut, { value: u, children: /* @__PURE__ */ l.jsx(
    h.div,
    {
      role: r ? "alert" : void 0,
      ref: s,
      ...a,
      className: p("chakra-alert", e.className),
      __css: c
    }
  ) }) });
});
O.displayName = "Alert";
var ft = {
  top: [],
  "top-left": [],
  "top-right": [],
  "bottom-left": [],
  bottom: [],
  "bottom-right": []
}, d = ht(ft);
function ht(o) {
  let e = o;
  const s = /* @__PURE__ */ new Set(), t = (n) => {
    e = n(e), s.forEach((r) => r());
  };
  return {
    getState: () => e,
    subscribe: (n) => (s.add(n), () => {
      t(() => o), s.delete(n);
    }),
    removeToast: (n, r) => {
      t((a) => ({
        ...a,
        [r]: a[r].filter((i) => i.id != n)
      }));
    },
    notify: (n, r) => {
      const a = vt(n, r), { position: i, id: u } = a;
      return t((c) => {
        var m, v;
        const f = i.includes("top") ? [a, ...(m = c[i]) != null ? m : []] : [...(v = c[i]) != null ? v : [], a];
        return {
          ...c,
          [i]: f
        };
      }), u;
    },
    update: (n, r) => {
      n && t((a) => {
        const i = { ...a }, { position: u, index: c } = _(i, n);
        return u && c !== -1 && (i[u][c] = {
          ...i[u][c],
          ...r,
          message: Z(r)
        }), i;
      });
    },
    closeAll: ({ positions: n } = {}) => {
      t((r) => (n ?? [
        "bottom",
        "bottom-right",
        "bottom-left",
        "top",
        "top-left",
        "top-right"
      ]).reduce(
        (u, c) => (u[c] = r[c].map((m) => ({
          ...m,
          requestClose: !0
        })), u),
        { ...r }
      ));
    },
    close: (n) => {
      t((r) => {
        const a = w(r, n);
        return a ? {
          ...r,
          [a]: r[a].map((i) => i.id == n ? {
            ...i,
            requestClose: !0
          } : i)
        } : r;
      });
    },
    isActive: (n) => Boolean(_(d.getState(), n).position)
  };
}
var I = 0;
function vt(o, e = {}) {
  var s, t;
  I += 1;
  const n = (s = e.id) != null ? s : I, r = (t = e.position) != null ? t : "bottom";
  return {
    id: n,
    message: o,
    position: r,
    duration: e.duration,
    onCloseComplete: e.onCloseComplete,
    onRequestRemove: () => d.removeToast(String(n), r),
    status: e.status,
    requestClose: !1,
    containerStyle: e.containerStyle
  };
}
var xt = (o) => {
  const {
    status: e,
    variant: s = "solid",
    id: t,
    title: n,
    isClosable: r,
    onClose: a,
    description: i,
    icon: u
  } = o, c = t ? {
    root: `toast-${t}`,
    title: `toast-${t}-title`,
    description: `toast-${t}-description`
  } : void 0;
  return /* @__PURE__ */ l.jsxs(
    O,
    {
      addRole: !1,
      status: e,
      variant: s,
      id: c == null ? void 0 : c.root,
      alignItems: "start",
      borderRadius: "md",
      boxShadow: "lg",
      paddingEnd: 8,
      textAlign: "start",
      width: "auto",
      children: [
        /* @__PURE__ */ l.jsx(R, { children: u }),
        /* @__PURE__ */ l.jsxs(h.div, { flex: "1", maxWidth: "100%", children: [
          n && /* @__PURE__ */ l.jsx(B, { id: c == null ? void 0 : c.title, children: n }),
          i && /* @__PURE__ */ l.jsx(M, { id: c == null ? void 0 : c.description, display: "block", children: i })
        ] }),
        r && /* @__PURE__ */ l.jsx(
          J,
          {
            size: "sm",
            onClick: a,
            position: "absolute",
            insetEnd: 1,
            top: 1
          }
        )
      ]
    }
  );
};
function Z(o = {}) {
  const { render: e, toastComponent: s = xt } = o;
  return (n) => typeof e == "function" ? e({ ...n, ...o }) : /* @__PURE__ */ l.jsx(s, { ...n, ...o });
}
function yt(o, e) {
  const s = (n) => {
    var r;
    return {
      ...e,
      ...n,
      position: rt(
        (r = n == null ? void 0 : n.position) != null ? r : e == null ? void 0 : e.position,
        o
      )
    };
  }, t = (n) => {
    const r = s(n), a = Z(r);
    return d.notify(a, r);
  };
  return t.update = (n, r) => {
    d.update(n, s(r));
  }, t.promise = (n, r) => {
    const a = t({
      ...r.loading,
      status: "loading",
      duration: null
    });
    n.then(
      (i) => t.update(a, {
        status: "success",
        duration: 5e3,
        ...g(r.success, i)
      })
    ).catch(
      (i) => t.update(a, {
        status: "error",
        duration: 5e3,
        ...g(r.error, i)
      })
    );
  }, t.closeAll = d.closeAll, t.close = d.close, t.isActive = d.isActive, t;
}
var [St, At] = S({
  name: "ToastOptionsContext",
  strict: !1
}), bt = (o) => {
  const e = H(
    d.subscribe,
    d.getState,
    d.getState
  ), {
    motionVariants: s,
    component: t = P,
    portalProps: n
  } = o, a = Object.keys(e).map((i) => {
    const u = e[i];
    return /* @__PURE__ */ l.jsx(
      "ul",
      {
        role: "region",
        "aria-live": "polite",
        id: `chakra-toast-manager-${i}`,
        style: ot(i),
        children: /* @__PURE__ */ l.jsx(Q, { initial: !1, children: u.map((c) => /* @__PURE__ */ l.jsx(
          t,
          {
            motionVariants: s,
            ...c
          },
          c.id
        )) })
      },
      i
    );
  });
  return /* @__PURE__ */ l.jsx(Y, { ...n, children: a });
};
export {
  St as T,
  bt as a,
  yt as c,
  At as u
};
