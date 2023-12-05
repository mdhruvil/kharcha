"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [2198],
  {
    32198: function (e, i, s) {
      s.d(i, {
        Z: function () {
          return E;
        },
      });
      var t = s(26042),
        n = s(69396),
        l = s(85893),
        r = s(67294),
        a = s(90443),
        o = s(76585),
        d = s(96410),
        u = (s(23956), s(94679)),
        c = s(38284),
        p = s(85313),
        v = s(96568),
        m = s(43759),
        f = s(67814),
        _ = s(59417),
        h = s(87663),
        w = s(88695),
        y = s(89885),
        x = s(39154),
        g = s(45508),
        k = s(96486),
        b = s(68178),
        j = s(46945),
        N = s(78207),
        A = s(46487);
      function E(e) {
        e.options, e.onReady;
        var i = e.currentVideoRecord,
          s = e.isOpen,
          E = e.toggle,
          Z = e.folderCourse,
          S = void 0 === Z ? "0" : Z,
          F = (0, r.useState)(!1),
          W = F[0],
          q = F[1],
          C = (0, r.useState)([]),
          I = C[0],
          D = C[1],
          O = (0, r.useState)(!1),
          B = O[0],
          Q = O[1],
          R = (0, r.useState)(!1),
          L = (R[0], R[1]),
          V = (0, r.useState)(null),
          G = V[0],
          P = V[1],
          z = (0, r.useContext)(y.Z),
          H = z.appConfig,
          J = z.currentUser,
          X = (0, r.useState)(!1),
          M = X[0],
          T = X[1],
          U = (0, r.useState)(),
          Y = U[0],
          K = U[1],
          $ = (0, r.useState)(),
          ee = $[0],
          ie = $[1],
          se = (0, r.useState)(!1),
          te = se[0],
          ne = se[1],
          le = (0, r.useState)(!1),
          re = le[0],
          ae = le[1];
        (0, r.useEffect)(function () {
          var e, s;
          i &&
            !(0, k.isEmpty)(i.media_id) &&
            (0, k.isEmpty)(i.video_key) &&
            (0, o.J)(i.media_id).then(function (e) {
              e ? D(e) : (T(!0), D(i.download_links));
            });
          var l = (0, p.Od)();
          Q(l);
          var r =
            null !=
            ["Intel Mac", "Mac"].find(function (e) {
              return navigator.userAgent.includes(e);
            });
          L(r);
          var a =
            navigator.vendor &&
            navigator.vendor.indexOf("Apple") > -1 &&
            navigator.userAgent &&
            -1 == navigator.userAgent.indexOf("CriOS") &&
            -1 == navigator.userAgent.indexOf("FxiOS");
          l &&
            (null === (e = i.livestream_links) || void 0 === e
              ? void 0
              : e.length) > 0 &&
            ("5" == i.hls_stream_type
              ? (i.livestream_links = i.livestream_links.map(function (e) {
                  return (0,
                  n.Z)((0, t.Z)({}, e), { path: e.path.split("?")[0] });
                }))
              : "3" == i.hls_stream_type &&
                (i.livestream_links = i.livestream_links.filter(function (e) {
                  return !e.quality.toLowerCase().includes("fast server");
                }))),
            ne(a),
            ((!(0, k.isEmpty)(i.video_key) && (l || a)) ||
              (null === (s = H.web_windowsdomains) || void 0 === s
                ? void 0
                : s.includes(H.host))) &&
              (0, j.a)(i.id, S).then(function (e) {
                e &&
                  (e.forEach(function (e) {
                    e.path = (0, g.N)(e.path);
                  }),
                  D(e));
              });
        }, []),
          (0, r.useEffect)(
            function () {
              re &&
                (0, j.a)(i.id, S).then(function (e) {
                  e &&
                    (e.forEach(function (e) {
                      e.path = (0, g.N)(e.path);
                    }),
                    Q(!0),
                    P(e[0]),
                    D(e));
                });
            },
            [re]
          );
        var oe = (0, w.G5)(H.web_firebaseconfig),
          de = (0, h.N8)(oe),
          ue = function () {
            if ("" != i.recording_schedule && "1" == i.live_status && s) {
              var e = (0, h.iH)(
                de,
                "/LiveViewData/"
                  .concat(i.recording_schedule, "/")
                  .concat(J.userid)
              );
              (0, h.t8)(e, null);
            }
            E();
          },
          ce = function () {
            return (0, l.jsx)(a.fe, {
              children: I.map(function (e, i) {
                return (0, l.jsx)(
                  a.zx,
                  {
                    color: "primary",
                    block: !0,
                    className: "my-2",
                    onClick: function () {
                      return (function (e) {
                        P(e), q(!1);
                      })(e);
                    },
                    children: e.quality,
                  },
                  i
                );
              }),
            });
          },
          pe = function () {
            if (
              !i ||
              null == i.media_id ||
              null == i.file_link ||
              null == i.download_link ||
              !i.live_status ||
              null == i.download_links
            )
              return (0, l.jsx)(a.fe, {
                className: "text-white text-center",
                children: "Not a valid Video",
              });
            var e = i.media_id,
              s = i.live_status,
              t = i.file_link,
              n = i.download_link,
              r = i.download_links,
              o = i.live_type,
              p = i.livestream_links,
              f = i.ytFlagWeb,
              _ = i.live_rewind_enable,
              h = i.low_latency_enabled,
              w = i.embed_url,
              y = i.video_key,
              x = i.webdrm_links,
              j = i.recording_type;
            if (3 == s)
              if ("" != e && !M && (0, k.isEmpty)(y)) {
                if (I.length > 0 && !W && !G) q(!0);
                else if (G)
                  return B
                    ? (ie(!0),
                      (0, l.jsx)("iframe", {
                        height: Y ? "100%" : "600px",
                        id: "myFrame",
                        width: "100%",
                        src: "https://streamos.teachx.in/embed?url=" + G.path,
                        allowFullScreen: !0,
                        allow: "autoplay",
                        className: "embed-player",
                      }))
                    : (0, l.jsx)(d.Z, {
                        videoId: i.id,
                        qualities: I,
                        seekBarDisabled: "0" == _ && "1" == s,
                        selectedQuality: G,
                        src: G.path,
                        isWindowsApp: H.isWindowsApp,
                        setIsDrmNotPlaying: ae,
                      });
              } else {
                var N;
                if (!((0, k.isEmpty)(x) || "4" != j || B || W || G))
                  return D(x), void q(!0);
                if (
                  !(
                    (0, k.isEmpty)(y) ||
                    (!B &&
                      !(null === (N = H.web_windowsdomains) || void 0 === N
                        ? void 0
                        : N.includes(H.host))) ||
                    W ||
                    G
                  )
                )
                  return void q(!0);
                if (!(0, k.isEmpty)(y) && (B || te))
                  return (
                    ie(!0),
                    (0, l.jsx)("iframe", {
                      height: Y ? "100%" : "600px",
                      id: "myFrame",
                      width: "100%",
                      src: "https://streamos.teachx.in/embed?url=" + G.path,
                      allowFullScreen: !0,
                      className: "embed-player",
                    })
                  );
                if (!(0, k.isEmpty)(x) && "4" == j && !B)
                  return (0, l.jsx)(d.Z, {
                    videoId: i.id,
                    qualities: I,
                    seekBarDisabled: "0" == _ && "1" == s,
                    selectedQuality: G,
                    src: G.path,
                    isWindowsApp: H.isWindowsApp,
                    video_key: y,
                    setIsDrmNotPlaying: ae,
                  });
                if ("" == r)
                  return "" != w
                    ? (ie(!0),
                      (0, l.jsx)("iframe", {
                        height: Y ? "100%" : "600px",
                        width: "100%",
                        id: "myFrame",
                        allowFullScreen: !0,
                        src: (0, g.N)(w),
                        className: "embed-player",
                      }))
                    : 2 == f && "" == n
                    ? (0, l.jsx)(v.Z, { src: t })
                    : 1 == f
                    ? (0, l.jsx)(m.Z, { videoId: i.video_id })
                    : (0, l.jsx)(c.Z, {
                        isWindowsApp: H.isWindowsApp,
                        videoId: i.id,
                        src: n,
                      });
                if (W || G)
                  return "4" == j || (!(0, k.isEmpty)(y) && !B)
                    ? (0, l.jsx)(d.Z, {
                        videoId: i.id,
                        qualities: I,
                        seekBarDisabled: "0" == _ && "1" == s,
                        selectedQuality: G,
                        src: G.path,
                        isWindowsApp: H.isWindowsApp,
                        video_key: y,
                        setIsDrmNotPlaying: ae,
                      })
                    : (0, l.jsx)(c.Z, {
                        isWindowsApp: H.isWindowsApp,
                        videoId: i.id,
                        qualities: I,
                        selectedQuality: G,
                        src: G.path,
                      });
                D(r), q(!0);
              }
            else if (1 == s) {
              if (t.includes("zoom"))
                return (0, l.jsx)("div", { children: "Zoom Player" });
              if (0 == f && 2 == o)
                return (0, l.jsx)("div", { children: "Browser Stream" });
              if (1 == f) return (0, l.jsx)(A.Z, { videoId: t, video: i });
              if (!(0 == f && p.length > 0))
                return (0, l.jsx)(u.Z, {
                  low_latency_enabled: h,
                  videojs: !1,
                  seekBarDisabled: "0" == _ && "1" == s,
                  video: i,
                  isWindowsApp: H.isWindowsApp,
                  src: i.file_link,
                });
              if (W || G) {
                if (G) {
                  if (B) {
                    var E = G.path;
                    return ie(!0), (0, l.jsx)(b.Z, { src: E, video: i });
                  }
                  return (0, l.jsx)(u.Z, {
                    low_latency_enabled: h,
                    videojs: !1,
                    qualities: I,
                    seekBarDisabled: "0" == _ && "1" == s,
                    selectedQuality: G,
                    video: i,
                    src: G.path,
                    isWindowsApp: H.isWindowsApp,
                  });
                }
              } else D(p), q(!0);
            }
          };
        return (0, l.jsxs)(a.u_, {
          size: W ? "md" : "xl",
          centered: !0,
          isOpen: s,
          toggle: ue,
          onOpened: function () {
            if ("" != i.recording_schedule && "1" == i.live_status) {
              var e = (0, h.iH)(
                de,
                "/LiveViewData/"
                  .concat(i.recording_schedule, "/")
                  .concat(J.userid)
              );
              (0, h.t8)(e, !0);
            }
          },
          onExit: function () {
            if (
              (q(!1),
              D([]),
              P(null),
              "" != i.recording_schedule && "1" == i.live_status)
            ) {
              var e = (0, h.iH)(
                de,
                "/LiveViewData/"
                  .concat(i.recording_schedule, "/")
                  .concat(J.userid)
              );
              (0, h.t8)(e, null);
            }
          },
          fullscreen: Y,
          contentClassName: "rounded ".concat(W ? "" : "bg-dark"),
          children: [
            (0, l.jsxs)(a.xB, {
              toggle: ue,
              className: "py-1",
              close: (0, l.jsx)(f.G, {
                onClick: ue,
                icon: _.nYk,
                className: "cursor-pointer",
                color: "gray",
              }),
              children: [
                W ? "Select  Quality" : "",
                ee &&
                  (0, l.jsx)(f.G, {
                    color: "white",
                    icon: Y ? _.Qj4 : _.TL5,
                    onClick: function () {
                      var e = document.getElementById("myFrame");
                      e
                        ? e.requestFullscreen
                          ? e.requestFullscreen()
                          : e.webkitRequestFullscreen
                          ? e.webkitRequestFullscreen()
                          : e.msRequestFullscreen
                          ? e.msRequestFullscreen()
                          : K(!Y)
                        : K(!Y);
                    },
                  }),
              ],
            }),
            !W &&
              (0, l.jsxs)(a.X2, {
                noGutters: !0,
                className: "align-items-center h-100",
                children: [
                  (0, l.jsxs)(a.JX, {
                    className: "h-100",
                    lg:
                      "1" == H.web_enablerecordedvideocomments &&
                      "3" == i.live_status
                        ? 8
                        : 12,
                    children: [
                      (0, l.jsx)(pe, {}),
                      ((0, k.isEmpty)(H.web_enablewatermarkonvideos) ||
                        "0" != H.web_enablewatermarkonvideos) &&
                        (0, l.jsx)(x.Z, {}),
                    ],
                  }),
                  "1" == H.web_enablerecordedvideocomments &&
                    "3" == i.live_status &&
                    (0, l.jsx)(a.JX, {
                      lg: "4",
                      children: (0, l.jsx)(N.Z, { video: i, folderCourse: S }),
                    }),
                ],
              }),
            W && (0, l.jsx)(ce, {}),
          ],
        });
      }
    },
  },
]);
