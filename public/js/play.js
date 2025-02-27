!(function r(n, o, s) {
  function a(e, t) {
    if (!o[e]) {
      if (!n[e]) {
        var i = 'function' == typeof require && require;
        if (!t && i) return i(e, !0);
        if (h) return h(e, !0);
        throw (
          (((t = new Error("Cannot find module '" + e + "'")).code =
            'MODULE_NOT_FOUND'),
          t)
        );
      }
      (i = o[e] = { exports: {} }),
        n[e][0].call(
          i.exports,
          function (t) {
            return a(n[e][1][t] || t);
          },
          i,
          i.exports,
          r,
          n,
          o,
          s
        );
    }
    return o[e].exports;
  }
  for (
    var h = 'function' == typeof require && require, t = 0;
    t < s.length;
    t++
  )
    a(s[t]);
  return a;
})(
  {
    1: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/display'),
          u = t('@pixi/utils'),
          t = {
            accessible: !1,
            accessibleTitle: null,
            accessibleHint: null,
            tabIndex: 0,
            _accessibleActive: !1,
            _accessibleDiv: null,
            accessibleType: 'button',
            accessiblePointerEvents: 'auto',
            accessibleChildren: !0,
            renderId: -1,
          },
          n = (r.DisplayObject.mixin(t), 100);
        function o(t) {
          (this._hookDiv = null),
            (u.isMobile.tablet || u.isMobile.phone) && this.createTouchHook();
          var e = document.createElement('div');
          (e.style.width = n + 'px'),
            (e.style.height = n + 'px'),
            (e.style.position = 'absolute'),
            (e.style.top = '0px'),
            (e.style.left = '0px'),
            (e.style.zIndex = (2).toString()),
            (this.div = e),
            (this.pool = []),
            (this.renderId = 0),
            (this.debug = !1),
            (this.renderer = t),
            (this.children = []),
            (this._onKeyDown = this._onKeyDown.bind(this)),
            (this._onMouseMove = this._onMouseMove.bind(this)),
            (this._isActive = !1),
            (this._isMobileAccessibility = !1),
            (this.androidUpdateCount = 0),
            (this.androidUpdateFrequency = 500),
            window.addEventListener('keydown', this._onKeyDown, !1);
        }
        Object.defineProperty(o.prototype, 'isActive', {
          get: function () {
            return this._isActive;
          },
          enumerable: !1,
          configurable: !0,
        }),
          Object.defineProperty(o.prototype, 'isMobileAccessibility', {
            get: function () {
              return this._isMobileAccessibility;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (o.prototype.createTouchHook = function () {
            var t = this,
              e = document.createElement('button');
            (e.style.width = '1px'),
              (e.style.height = '1px'),
              (e.style.position = 'absolute'),
              (e.style.top = '-1000px'),
              (e.style.left = '-1000px'),
              (e.style.zIndex = (2).toString()),
              (e.style.backgroundColor = '#FF0000'),
              (e.title = 'select to enable accessability for this content'),
              e.addEventListener('focus', function () {
                (t._isMobileAccessibility = !0),
                  t.activate(),
                  t.destroyTouchHook();
              }),
              document.body.appendChild(e),
              (this._hookDiv = e);
          }),
          (o.prototype.destroyTouchHook = function () {
            this._hookDiv &&
              (document.body.removeChild(this._hookDiv),
              (this._hookDiv = null));
          }),
          (o.prototype.activate = function () {
            this._isActive ||
              ((this._isActive = !0),
              window.document.addEventListener(
                'mousemove',
                this._onMouseMove,
                !0
              ),
              window.removeEventListener('keydown', this._onKeyDown, !1),
              this.renderer.on('postrender', this.update, this),
              this.renderer.view.parentNode &&
                this.renderer.view.parentNode.appendChild(this.div));
          }),
          (o.prototype.deactivate = function () {
            this._isActive &&
              !this._isMobileAccessibility &&
              ((this._isActive = !1),
              window.document.removeEventListener(
                'mousemove',
                this._onMouseMove,
                !0
              ),
              window.addEventListener('keydown', this._onKeyDown, !1),
              this.renderer.off('postrender', this.update),
              this.div.parentNode && this.div.parentNode.removeChild(this.div));
          }),
          (o.prototype.updateAccessibleObjects = function (t) {
            if (t.visible && t.accessibleChildren) {
              t.accessible &&
                t.interactive &&
                (t._accessibleActive || this.addChild(t),
                (t.renderId = this.renderId));
              for (var e = t.children, i = 0; i < e.length; i++)
                this.updateAccessibleObjects(e[i]);
            }
          }),
          (o.prototype.update = function () {
            var t = performance.now();
            if (
              !(u.isMobile.android.device && t < this.androidUpdateCount) &&
              ((this.androidUpdateCount = t + this.androidUpdateFrequency),
              this.renderer.renderingToScreen)
            ) {
              this.renderer._lastObjectRendered &&
                this.updateAccessibleObjects(this.renderer._lastObjectRendered);
              var t = this.renderer.view.getBoundingClientRect(),
                e = this.renderer.resolution,
                i = (t.width / this.renderer.width) * e,
                r = (t.height / this.renderer.height) * e;
              ((o = this.div).style.left = t.left + 'px'),
                (o.style.top = t.top + 'px'),
                (o.style.width = this.renderer.width + 'px'),
                (o.style.height = this.renderer.height + 'px');
              for (var n = 0; n < this.children.length; n++) {
                var o,
                  s,
                  a,
                  h = this.children[n];
                h.renderId !== this.renderId
                  ? ((h._accessibleActive = !1),
                    u.removeItems(this.children, n, 1),
                    this.div.removeChild(h._accessibleDiv),
                    this.pool.push(h._accessibleDiv),
                    (h._accessibleDiv = null),
                    n--)
                  : ((o = h._accessibleDiv),
                    (s = h.hitArea),
                    (a = h.worldTransform),
                    h.hitArea
                      ? ((o.style.left = (a.tx + s.x * a.a) * i + 'px'),
                        (o.style.top = (a.ty + s.y * a.d) * r + 'px'),
                        (o.style.width = s.width * a.a * i + 'px'),
                        (o.style.height = s.height * a.d * r + 'px'))
                      : ((s = h.getBounds()),
                        this.capHitArea(s),
                        (o.style.left = s.x * i + 'px'),
                        (o.style.top = s.y * r + 'px'),
                        (o.style.width = s.width * i + 'px'),
                        (o.style.height = s.height * r + 'px'),
                        o.title !== h.accessibleTitle &&
                          null !== h.accessibleTitle &&
                          (o.title = h.accessibleTitle),
                        o.getAttribute('aria-label') !== h.accessibleHint &&
                          null !== h.accessibleHint &&
                          o.setAttribute('aria-label', h.accessibleHint)),
                    (h.accessibleTitle === o.title &&
                      h.tabIndex === o.tabIndex) ||
                      ((o.title = h.accessibleTitle),
                      (o.tabIndex = h.tabIndex),
                      this.debug && this.updateDebugHTML(o)));
              }
              this.renderId++;
            }
          }),
          (o.prototype.updateDebugHTML = function (t) {
            t.innerHTML =
              'type: ' +
              t.type +
              '</br> title : ' +
              t.title +
              '</br> tabIndex: ' +
              t.tabIndex;
          }),
          (o.prototype.capHitArea = function (t) {
            t.x < 0 && ((t.width += t.x), (t.x = 0)),
              t.y < 0 && ((t.height += t.y), (t.y = 0)),
              t.x + t.width > this.renderer.width &&
                (t.width = this.renderer.width - t.x),
              t.y + t.height > this.renderer.height &&
                (t.height = this.renderer.height - t.y);
          }),
          (o.prototype.addChild = function (t) {
            var e = this.pool.pop();
            e ||
              (((e = document.createElement('button')).style.width = n + 'px'),
              (e.style.height = n + 'px'),
              (e.style.backgroundColor = this.debug
                ? 'rgba(255,255,255,0.5)'
                : 'transparent'),
              (e.style.position = 'absolute'),
              (e.style.zIndex = (2).toString()),
              (e.style.borderStyle = 'none'),
              -1 < navigator.userAgent.toLowerCase().indexOf('chrome')
                ? e.setAttribute('aria-live', 'off')
                : e.setAttribute('aria-live', 'polite'),
              navigator.userAgent.match(/rv:.*Gecko\//)
                ? e.setAttribute('aria-relevant', 'additions')
                : e.setAttribute('aria-relevant', 'text'),
              e.addEventListener('click', this._onClick.bind(this)),
              e.addEventListener('focus', this._onFocus.bind(this)),
              e.addEventListener('focusout', this._onFocusOut.bind(this))),
              (e.style.pointerEvents = t.accessiblePointerEvents),
              (e.type = t.accessibleType),
              t.accessibleTitle && null !== t.accessibleTitle
                ? (e.title = t.accessibleTitle)
                : (t.accessibleHint && null !== t.accessibleHint) ||
                  (e.title = 'displayObject ' + t.tabIndex),
              t.accessibleHint &&
                null !== t.accessibleHint &&
                e.setAttribute('aria-label', t.accessibleHint),
              this.debug && this.updateDebugHTML(e),
              (t._accessibleActive = !0),
              ((t._accessibleDiv = e).displayObject = t),
              this.children.push(t),
              this.div.appendChild(t._accessibleDiv),
              (t._accessibleDiv.tabIndex = t.tabIndex);
          }),
          (o.prototype._onClick = function (t) {
            var e = this.renderer.plugins.interaction;
            e.dispatchEvent(t.target.displayObject, 'click', e.eventData),
              e.dispatchEvent(
                t.target.displayObject,
                'pointertap',
                e.eventData
              ),
              e.dispatchEvent(t.target.displayObject, 'tap', e.eventData);
          }),
          (o.prototype._onFocus = function (t) {
            t.target.getAttribute('aria-live') ||
              t.target.setAttribute('aria-live', 'assertive');
            var e = this.renderer.plugins.interaction;
            e.dispatchEvent(t.target.displayObject, 'mouseover', e.eventData);
          }),
          (o.prototype._onFocusOut = function (t) {
            t.target.getAttribute('aria-live') ||
              t.target.setAttribute('aria-live', 'polite');
            var e = this.renderer.plugins.interaction;
            e.dispatchEvent(t.target.displayObject, 'mouseout', e.eventData);
          }),
          (o.prototype._onKeyDown = function (t) {
            9 === t.keyCode && this.activate();
          }),
          (o.prototype._onMouseMove = function (t) {
            (0 === t.movementX && 0 === t.movementY) || this.deactivate();
          }),
          (o.prototype.destroy = function () {
            this.destroyTouchHook(),
              (this.div = null),
              window.document.removeEventListener(
                'mousemove',
                this._onMouseMove,
                !0
              ),
              window.removeEventListener('keydown', this._onKeyDown),
              (this.pool = null),
              (this.children = null),
              (this.renderer = null);
          }),
          (i.AccessibilityManager = o),
          (i.accessibleTarget = t);
      },
      { '@pixi/display': 5, '@pixi/utils': 34 },
    ],
    2: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/display'),
          n = t('@pixi/core'),
          t =
            ((o.registerPlugin = function (t) {
              o._plugins.push(t);
            }),
            (o.prototype.render = function () {
              this.renderer.render(this.stage);
            }),
            Object.defineProperty(o.prototype, 'view', {
              get: function () {
                return this.renderer.view;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(o.prototype, 'screen', {
              get: function () {
                return this.renderer.screen;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (o.prototype.destroy = function (t, e) {
              var i = this,
                r = o._plugins.slice(0);
              r.reverse(),
                r.forEach(function (t) {
                  t.destroy.call(i);
                }),
                this.stage.destroy(e),
                (this.stage = null),
                this.renderer.destroy(t),
                (this.renderer = null);
            }),
            o);
        function o(e) {
          var i = this;
          (e = Object.assign({ forceCanvas: !1 }, e)),
            (this.renderer = n.autoDetectRenderer(e)),
            (this.stage = new r.Container()),
            o._plugins.forEach(function (t) {
              t.init.call(i, e);
            });
        }
        function s() {}
        (t._plugins = []),
          (s.init = function (t) {
            var i = this;
            Object.defineProperty(this, 'resizeTo', {
              set: function (t) {
                window.removeEventListener('resize', this.queueResize),
                  (this._resizeTo = t) &&
                    (window.addEventListener('resize', this.queueResize),
                    this.resize());
              },
              get: function () {
                return this._resizeTo;
              },
            }),
              (this.queueResize = function () {
                i._resizeTo &&
                  (i.cancelResize(),
                  (i._resizeId = requestAnimationFrame(function () {
                    return i.resize();
                  })));
              }),
              (this.cancelResize = function () {
                i._resizeId &&
                  (cancelAnimationFrame(i._resizeId), (i._resizeId = null));
              }),
              (this.resize = function () {
                var t, e;
                i._resizeTo &&
                  (i.cancelResize(),
                  (e =
                    i._resizeTo === window
                      ? ((t = window.innerWidth), window.innerHeight)
                      : ((t = (e = i._resizeTo).clientWidth), e.clientHeight)),
                  i.renderer.resize(t, e));
              }),
              (this._resizeId = null),
              (this._resizeTo = null),
              (this.resizeTo = t.resizeTo || null);
          }),
          (s.destroy = function () {
            window.removeEventListener('resize', this.queueResize),
              this.cancelResize(),
              (this.cancelResize = null),
              (this.queueResize = null),
              (this.resizeTo = null),
              (this.resize = null);
          }),
          t.registerPlugin(s),
          (i.Application = t);
      },
      { '@pixi/core': 4, '@pixi/display': 5 },
    ],
    3: [
      function (t, e, i) {
        'use strict';
        var r;
        Object.defineProperty(i, '__esModule', { value: !0 }),
          ((r = i.ENV || (i.ENV = {}))[(r.WEBGL_LEGACY = 0)] = 'WEBGL_LEGACY'),
          (r[(r.WEBGL = 1)] = 'WEBGL'),
          (r[(r.WEBGL2 = 2)] = 'WEBGL2'),
          ((r = i.RENDERER_TYPE || (i.RENDERER_TYPE = {}))[(r.UNKNOWN = 0)] =
            'UNKNOWN'),
          (r[(r.WEBGL = 1)] = 'WEBGL'),
          (r[(r.CANVAS = 2)] = 'CANVAS'),
          ((r = i.BUFFER_BITS || (i.BUFFER_BITS = {}))[(r.COLOR = 16384)] =
            'COLOR'),
          (r[(r.DEPTH = 256)] = 'DEPTH'),
          (r[(r.STENCIL = 1024)] = 'STENCIL'),
          ((r = i.BLEND_MODES || (i.BLEND_MODES = {}))[(r.NORMAL = 0)] =
            'NORMAL'),
          (r[(r.ADD = 1)] = 'ADD'),
          (r[(r.MULTIPLY = 2)] = 'MULTIPLY'),
          (r[(r.SCREEN = 3)] = 'SCREEN'),
          (r[(r.OVERLAY = 4)] = 'OVERLAY'),
          (r[(r.DARKEN = 5)] = 'DARKEN'),
          (r[(r.LIGHTEN = 6)] = 'LIGHTEN'),
          (r[(r.COLOR_DODGE = 7)] = 'COLOR_DODGE'),
          (r[(r.COLOR_BURN = 8)] = 'COLOR_BURN'),
          (r[(r.HARD_LIGHT = 9)] = 'HARD_LIGHT'),
          (r[(r.SOFT_LIGHT = 10)] = 'SOFT_LIGHT'),
          (r[(r.DIFFERENCE = 11)] = 'DIFFERENCE'),
          (r[(r.EXCLUSION = 12)] = 'EXCLUSION'),
          (r[(r.HUE = 13)] = 'HUE'),
          (r[(r.SATURATION = 14)] = 'SATURATION'),
          (r[(r.COLOR = 15)] = 'COLOR'),
          (r[(r.LUMINOSITY = 16)] = 'LUMINOSITY'),
          (r[(r.NORMAL_NPM = 17)] = 'NORMAL_NPM'),
          (r[(r.ADD_NPM = 18)] = 'ADD_NPM'),
          (r[(r.SCREEN_NPM = 19)] = 'SCREEN_NPM'),
          (r[(r.NONE = 20)] = 'NONE'),
          (r[(r.SRC_OVER = 0)] = 'SRC_OVER'),
          (r[(r.SRC_IN = 21)] = 'SRC_IN'),
          (r[(r.SRC_OUT = 22)] = 'SRC_OUT'),
          (r[(r.SRC_ATOP = 23)] = 'SRC_ATOP'),
          (r[(r.DST_OVER = 24)] = 'DST_OVER'),
          (r[(r.DST_IN = 25)] = 'DST_IN'),
          (r[(r.DST_OUT = 26)] = 'DST_OUT'),
          (r[(r.DST_ATOP = 27)] = 'DST_ATOP'),
          (r[(r.ERASE = 26)] = 'ERASE'),
          (r[(r.SUBTRACT = 28)] = 'SUBTRACT'),
          (r[(r.XOR = 29)] = 'XOR'),
          ((r = i.DRAW_MODES || (i.DRAW_MODES = {}))[(r.POINTS = 0)] =
            'POINTS'),
          (r[(r.LINES = 1)] = 'LINES'),
          (r[(r.LINE_LOOP = 2)] = 'LINE_LOOP'),
          (r[(r.LINE_STRIP = 3)] = 'LINE_STRIP'),
          (r[(r.TRIANGLES = 4)] = 'TRIANGLES'),
          (r[(r.TRIANGLE_STRIP = 5)] = 'TRIANGLE_STRIP'),
          (r[(r.TRIANGLE_FAN = 6)] = 'TRIANGLE_FAN'),
          ((r = i.FORMATS || (i.FORMATS = {}))[(r.RGBA = 6408)] = 'RGBA'),
          (r[(r.RGB = 6407)] = 'RGB'),
          (r[(r.ALPHA = 6406)] = 'ALPHA'),
          (r[(r.LUMINANCE = 6409)] = 'LUMINANCE'),
          (r[(r.LUMINANCE_ALPHA = 6410)] = 'LUMINANCE_ALPHA'),
          (r[(r.DEPTH_COMPONENT = 6402)] = 'DEPTH_COMPONENT'),
          (r[(r.DEPTH_STENCIL = 34041)] = 'DEPTH_STENCIL'),
          ((r = i.TARGETS || (i.TARGETS = {}))[(r.TEXTURE_2D = 3553)] =
            'TEXTURE_2D'),
          (r[(r.TEXTURE_CUBE_MAP = 34067)] = 'TEXTURE_CUBE_MAP'),
          (r[(r.TEXTURE_2D_ARRAY = 35866)] = 'TEXTURE_2D_ARRAY'),
          (r[(r.TEXTURE_CUBE_MAP_POSITIVE_X = 34069)] =
            'TEXTURE_CUBE_MAP_POSITIVE_X'),
          (r[(r.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070)] =
            'TEXTURE_CUBE_MAP_NEGATIVE_X'),
          (r[(r.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071)] =
            'TEXTURE_CUBE_MAP_POSITIVE_Y'),
          (r[(r.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072)] =
            'TEXTURE_CUBE_MAP_NEGATIVE_Y'),
          (r[(r.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073)] =
            'TEXTURE_CUBE_MAP_POSITIVE_Z'),
          (r[(r.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074)] =
            'TEXTURE_CUBE_MAP_NEGATIVE_Z'),
          ((r = i.TYPES || (i.TYPES = {}))[(r.UNSIGNED_BYTE = 5121)] =
            'UNSIGNED_BYTE'),
          (r[(r.UNSIGNED_SHORT = 5123)] = 'UNSIGNED_SHORT'),
          (r[(r.UNSIGNED_SHORT_5_6_5 = 33635)] = 'UNSIGNED_SHORT_5_6_5'),
          (r[(r.UNSIGNED_SHORT_4_4_4_4 = 32819)] = 'UNSIGNED_SHORT_4_4_4_4'),
          (r[(r.UNSIGNED_SHORT_5_5_5_1 = 32820)] = 'UNSIGNED_SHORT_5_5_5_1'),
          (r[(r.FLOAT = 5126)] = 'FLOAT'),
          (r[(r.HALF_FLOAT = 36193)] = 'HALF_FLOAT'),
          ((r = i.SCALE_MODES || (i.SCALE_MODES = {}))[(r.NEAREST = 0)] =
            'NEAREST'),
          (r[(r.LINEAR = 1)] = 'LINEAR'),
          ((r = i.WRAP_MODES || (i.WRAP_MODES = {}))[(r.CLAMP = 33071)] =
            'CLAMP'),
          (r[(r.REPEAT = 10497)] = 'REPEAT'),
          (r[(r.MIRRORED_REPEAT = 33648)] = 'MIRRORED_REPEAT'),
          ((r = i.MIPMAP_MODES || (i.MIPMAP_MODES = {}))[(r.OFF = 0)] = 'OFF'),
          (r[(r.POW2 = 1)] = 'POW2'),
          (r[(r.ON = 2)] = 'ON'),
          ((r = i.ALPHA_MODES || (i.ALPHA_MODES = {}))[(r.NPM = 0)] = 'NPM'),
          (r[(r.UNPACK = 1)] = 'UNPACK'),
          (r[(r.PMA = 2)] = 'PMA'),
          (r[(r.NO_PREMULTIPLIED_ALPHA = 0)] = 'NO_PREMULTIPLIED_ALPHA'),
          (r[(r.PREMULTIPLY_ON_UPLOAD = 1)] = 'PREMULTIPLY_ON_UPLOAD'),
          (r[(r.PREMULTIPLY_ALPHA = 2)] = 'PREMULTIPLY_ALPHA'),
          ((r = i.CLEAR_MODES || (i.CLEAR_MODES = {}))[(r.NO = 0)] = 'NO'),
          (r[(r.YES = 1)] = 'YES'),
          (r[(r.AUTO = 2)] = 'AUTO'),
          (r[(r.BLEND = 0)] = 'BLEND'),
          (r[(r.CLEAR = 1)] = 'CLEAR'),
          (r[(r.BLIT = 2)] = 'BLIT'),
          ((r = i.GC_MODES || (i.GC_MODES = {}))[(r.AUTO = 0)] = 'AUTO'),
          (r[(r.MANUAL = 1)] = 'MANUAL'),
          ((r = i.PRECISION || (i.PRECISION = {})).LOW = 'lowp'),
          (r.MEDIUM = 'mediump'),
          (r.HIGH = 'highp'),
          ((r = i.MASK_TYPES || (i.MASK_TYPES = {}))[(r.NONE = 0)] = 'NONE'),
          (r[(r.SCISSOR = 1)] = 'SCISSOR'),
          (r[(r.STENCIL = 2)] = 'STENCIL'),
          (r[(r.SPRITE = 3)] = 'SPRITE'),
          ((r = i.MSAA_QUALITY || (i.MSAA_QUALITY = {}))[(r.NONE = 0)] =
            'NONE'),
          (r[(r.LOW = 2)] = 'LOW'),
          (r[(r.MEDIUM = 4)] = 'MEDIUM'),
          (r[(r.HIGH = 8)] = 'HIGH');
      },
      {},
    ],
    4: [
      function (t, F, e) {
        'use strict';
        Object.defineProperty(e, '__esModule', { value: !0 });
        var m = t('@pixi/settings'),
          y = t('@pixi/constants'),
          g = t('@pixi/utils'),
          r = t('@pixi/runner'),
          B = t('@pixi/ticker'),
          h = t('@pixi/math'),
          U =
            ((m.settings.PREFER_ENV = g.isMobile.any
              ? y.ENV.WEBGL
              : y.ENV.WEBGL2),
            (m.settings.STRICT_TEXTURE_CACHE = !1),
            []);
        function j(t, e) {
          if (!t) return null;
          var i,
            r = '';
          'string' == typeof t &&
            (i = /\.(\w{3,4})(?:$|\?|#)/i.exec(t)) &&
            (r = i[1].toLowerCase());
          for (var n = U.length - 1; 0 <= n; --n) {
            var o = U[n];
            if (o.test && o.test(t, r)) return new o(t, e);
          }
          throw new Error('Unrecognized source type to auto-detect Resource');
        }
        var k = function (t, e) {
          return (k =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        };
        function a(t, e) {
          function i() {
            this.constructor = t;
          }
          k(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        (i.prototype.bind = function (t) {
          this.onResize.add(t),
            this.onUpdate.add(t),
            this.onError.add(t),
            (this._width || this._height) &&
              this.onResize.emit(this._width, this._height);
        }),
          (i.prototype.unbind = function (t) {
            this.onResize.remove(t),
              this.onUpdate.remove(t),
              this.onError.remove(t);
          }),
          (i.prototype.resize = function (t, e) {
            (t === this._width && e === this._height) ||
              ((this._width = t), (this._height = e), this.onResize.emit(t, e));
          }),
          Object.defineProperty(i.prototype, 'valid', {
            get: function () {
              return !!this._width && !!this._height;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (i.prototype.update = function () {
            this.destroyed || this.onUpdate.emit();
          }),
          (i.prototype.load = function () {
            return Promise.resolve(this);
          }),
          Object.defineProperty(i.prototype, 'width', {
            get: function () {
              return this._width;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(i.prototype, 'height', {
            get: function () {
              return this._height;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (i.prototype.style = function (t, e, i) {
            return !1;
          }),
          (i.prototype.dispose = function () {}),
          (i.prototype.destroy = function () {
            this.destroyed ||
              ((this.destroyed = !0),
              this.dispose(),
              this.onError.removeAll(),
              (this.onError = null),
              this.onResize.removeAll(),
              (this.onResize = null),
              this.onUpdate.removeAll(),
              (this.onUpdate = null));
          }),
          (i.test = function (t, e) {
            return !1;
          });
        var X = i;
        function i(t, e) {
          void 0 === e && (e = 0),
            (this._width = t = void 0 === t ? 0 : t),
            (this._height = e),
            (this.destroyed = !1),
            (this.internal = !1),
            (this.onResize = new r.Runner('setRealSize')),
            (this.onUpdate = new r.Runner('update')),
            (this.onError = new r.Runner('onError'));
        }
        a(z, (G = X)),
          (z.prototype.upload = function (t, e, i) {
            t = t.gl;
            return (
              t.pixelStorei(
                t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                e.alphaMode === y.ALPHA_MODES.UNPACK
              ),
              i.width === e.width && i.height === e.height
                ? t.texSubImage2D(
                    e.target,
                    0,
                    0,
                    0,
                    e.width,
                    e.height,
                    e.format,
                    e.type,
                    this.data
                  )
                : ((i.width = e.width),
                  (i.height = e.height),
                  t.texImage2D(
                    e.target,
                    0,
                    i.internalFormat,
                    e.width,
                    e.height,
                    0,
                    e.format,
                    i.type,
                    this.data
                  )),
              !0
            );
          }),
          (z.prototype.dispose = function () {
            this.data = null;
          }),
          (z.test = function (t) {
            return (
              t instanceof Float32Array ||
              t instanceof Uint8Array ||
              t instanceof Uint32Array
            );
          });
        var G,
          H = z;
        function z(t, e) {
          var i = this,
            e = e || {},
            r = e.width,
            e = e.height;
          if (r && e) return ((i = G.call(this, r, e) || this).data = t), i;
          throw new Error('BufferResource width or height invalid');
        }
        var Y,
          V = {
            scaleMode: y.SCALE_MODES.NEAREST,
            format: y.FORMATS.RGBA,
            alphaMode: y.ALPHA_MODES.NPM,
          },
          d =
            (a(s, (Y = g.EventEmitter)),
            Object.defineProperty(s.prototype, 'realWidth', {
              get: function () {
                return Math.ceil(this.width * this.resolution - 1e-4);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(s.prototype, 'realHeight', {
              get: function () {
                return Math.ceil(this.height * this.resolution - 1e-4);
              },
              enumerable: !1,
              configurable: !0,
            }),
            (s.prototype.setStyle = function (t, e) {
              var i;
              return (
                void 0 !== t &&
                  t !== this.scaleMode &&
                  ((this.scaleMode = t), (i = !0)),
                void 0 !== e &&
                  e !== this.mipmap &&
                  ((this.mipmap = e), (i = !0)),
                i && this.dirtyStyleId++,
                this
              );
            }),
            (s.prototype.setSize = function (t, e, i) {
              return (
                (this.resolution = i || this.resolution),
                (this.width = t),
                (this.height = e),
                this._refreshPOT(),
                this.update(),
                this
              );
            }),
            (s.prototype.setRealSize = function (t, e, i) {
              return (
                (this.resolution = i || this.resolution),
                (this.width = t / this.resolution),
                (this.height = e / this.resolution),
                this._refreshPOT(),
                this.update(),
                this
              );
            }),
            (s.prototype._refreshPOT = function () {
              this.isPowerOfTwo =
                g.isPow2(this.realWidth) && g.isPow2(this.realHeight);
            }),
            (s.prototype.setResolution = function (t) {
              var e = this.resolution;
              return (
                e === t ||
                  ((this.resolution = t),
                  this.valid &&
                    ((this.width = (this.width * e) / t),
                    (this.height = (this.height * e) / t),
                    this.emit('update', this)),
                  this._refreshPOT()),
                this
              );
            }),
            (s.prototype.setResource = function (t) {
              if (this.resource === t) return this;
              if (this.resource)
                throw new Error('Resource can be set only once');
              return t.bind(this), (this.resource = t), this;
            }),
            (s.prototype.update = function () {
              this.valid
                ? (this.dirtyId++,
                  this.dirtyStyleId++,
                  this.emit('update', this))
                : 0 < this.width &&
                  0 < this.height &&
                  ((this.valid = !0),
                  this.emit('loaded', this),
                  this.emit('update', this));
            }),
            (s.prototype.onError = function (t) {
              this.emit('error', this, t);
            }),
            (s.prototype.destroy = function () {
              this.resource &&
                (this.resource.unbind(this),
                this.resource.internal && this.resource.destroy(),
                (this.resource = null)),
                this.cacheId &&
                  (delete g.BaseTextureCache[this.cacheId],
                  delete g.TextureCache[this.cacheId],
                  (this.cacheId = null)),
                this.dispose(),
                s.removeFromCache(this),
                (this.textureCacheIds = null),
                (this.destroyed = !0);
            }),
            (s.prototype.dispose = function () {
              this.emit('dispose', this);
            }),
            (s.prototype.castToBaseTexture = function () {
              return this;
            }),
            (s.from = function (t, e, i) {
              void 0 === i && (i = m.settings.STRICT_TEXTURE_CACHE);
              var r = 'string' == typeof t,
                n = null,
                n = r
                  ? t
                  : (t._pixiId || (t._pixiId = 'pixiid_' + g.uid()), t._pixiId),
                o = g.BaseTextureCache[n];
              if (r && i && !o)
                throw new Error(
                  'The cacheId "' + n + '" does not exist in BaseTextureCache.'
                );
              return (
                o || (((o = new s(t, e)).cacheId = n), s.addToCache(o, n)), o
              );
            }),
            (s.fromBuffer = function (t, e, i, r) {
              t = t || new Float32Array(e * i * 4);
              var n = new H(t, { width: e, height: i }),
                t =
                  t instanceof Float32Array
                    ? y.TYPES.FLOAT
                    : y.TYPES.UNSIGNED_BYTE;
              return new s(
                n,
                Object.assign(V, r || { width: e, height: i, type: t })
              );
            }),
            (s.addToCache = function (t, e) {
              e &&
                (-1 === t.textureCacheIds.indexOf(e) &&
                  t.textureCacheIds.push(e),
                g.BaseTextureCache[e] &&
                  console.warn(
                    'BaseTexture added to the cache with an id [' +
                      e +
                      '] that already had an entry'
                  ),
                (g.BaseTextureCache[e] = t));
            }),
            (s.removeFromCache = function (t) {
              if ('string' == typeof t) {
                var e,
                  i = g.BaseTextureCache[t];
                if (i)
                  return (
                    -1 < (e = i.textureCacheIds.indexOf(t)) &&
                      i.textureCacheIds.splice(e, 1),
                    delete g.BaseTextureCache[t],
                    i
                  );
              } else if (t && t.textureCacheIds) {
                for (var r = 0; r < t.textureCacheIds.length; ++r)
                  delete g.BaseTextureCache[t.textureCacheIds[r]];
                return (t.textureCacheIds.length = 0), t;
              }
              return null;
            }),
            (s._globalBatch = 0),
            s);
        function s(t, e) {
          void 0 === t && (t = null), void 0 === e && (e = null);
          var i = Y.call(this) || this,
            r = (e = e || {}).alphaMode,
            n = e.mipmap,
            o = e.anisotropicLevel,
            s = e.scaleMode,
            a = e.width,
            h = e.height,
            u = e.wrapMode,
            l = e.format,
            c = e.type,
            d = e.target,
            p = e.resolution,
            f = e.resourceOptions;
          return (
            !t || t instanceof X || ((t = j(t, f)).internal = !0),
            (i.width = a || 0),
            (i.height = h || 0),
            (i.resolution = p || m.settings.RESOLUTION),
            (i.mipmap = void 0 !== n ? n : m.settings.MIPMAP_TEXTURES),
            (i.anisotropicLevel =
              void 0 !== o ? o : m.settings.ANISOTROPIC_LEVEL),
            (i.wrapMode = u || m.settings.WRAP_MODE),
            (i.scaleMode = void 0 !== s ? s : m.settings.SCALE_MODE),
            (i.format = l || y.FORMATS.RGBA),
            (i.type = c || y.TYPES.UNSIGNED_BYTE),
            (i.target = d || y.TARGETS.TEXTURE_2D),
            (i.alphaMode = void 0 !== r ? r : y.ALPHA_MODES.UNPACK),
            void 0 !== e.premultiplyAlpha &&
              (i.premultiplyAlpha = e.premultiplyAlpha),
            (i.uid = g.uid()),
            (i.touched = 0),
            (i.isPowerOfTwo = !1),
            i._refreshPOT(),
            (i._glTextures = {}),
            (i.dirtyId = 0),
            (i.dirtyStyleId = 0),
            (i.cacheId = null),
            (i.valid = 0 < a && 0 < h),
            (i.textureCacheIds = []),
            (i.destroyed = !1),
            (i.resource = null),
            (i._batchEnabled = 0),
            (i._batchLocation = 0),
            (i.parentTextureArray = null),
            i.setResource(t),
            i
          );
        }
        a(n, (W = X)),
          (n.prototype.initFromArray = function (t, e) {
            for (var i = 0; i < this.length; i++)
              t[i] &&
                (t[i].castToBaseTexture
                  ? this.addBaseTextureAt(t[i].castToBaseTexture(), i)
                  : t[i] instanceof X
                  ? this.addResourceAt(t[i], i)
                  : this.addResourceAt(j(t[i], e), i));
          }),
          (n.prototype.dispose = function () {
            for (var t = 0, e = this.length; t < e; t++)
              this.items[t].destroy();
            (this.items = null),
              (this.itemDirtyIds = null),
              (this._load = null);
          }),
          (n.prototype.addResourceAt = function (t, e) {
            if (this.items[e])
              return (
                t.valid && !this.valid && this.resize(t.width, t.height),
                this.items[e].setResource(t),
                this
              );
            throw new Error('Index ' + e + ' is out of bounds');
          }),
          (n.prototype.bind = function (t) {
            if (null !== this.baseTexture)
              throw new Error(
                'Only one base texture per TextureArray is allowed'
              );
            W.prototype.bind.call(this, t);
            for (var e = 0; e < this.length; e++)
              (this.items[e].parentTextureArray = t),
                this.items[e].on('update', t.update, t);
          }),
          (n.prototype.unbind = function (t) {
            W.prototype.unbind.call(this, t);
            for (var e = 0; e < this.length; e++)
              (this.items[e].parentTextureArray = null),
                this.items[e].off('update', t.update, t);
          }),
          (n.prototype.load = function () {
            var i = this;
            if (this._load) return this._load;
            var t = this.items
              .map(function (t) {
                return t.resource;
              })
              .filter(function (t) {
                return t;
              })
              .map(function (t) {
                return t.load();
              });
            return (
              (this._load = Promise.all(t).then(function () {
                var t = i.items[0],
                  e = t.realWidth,
                  t = t.realHeight;
                return i.resize(e, t), Promise.resolve(i);
              })),
              this._load
            );
          });
        var W,
          t = n;
        function n(t, e) {
          var i = this,
            e = e || {},
            r = e.width,
            e = e.height;
          ((i = W.call(this, r, e) || this).items = []), (i.itemDirtyIds = []);
          for (var n = 0; n < t; n++) {
            var o = new d();
            i.items.push(o), i.itemDirtyIds.push(-2);
          }
          return (i.length = t), (i._load = null), (i.baseTexture = null), i;
        }
        a(K, (q = t)),
          (K.prototype.addBaseTextureAt = function (t, e) {
            if (t.resource) return this.addResourceAt(t.resource, e), this;
            throw new Error('ArrayResource does not support RenderTexture');
          }),
          (K.prototype.bind = function (t) {
            q.prototype.bind.call(this, t),
              (t.target = y.TARGETS.TEXTURE_2D_ARRAY);
          }),
          (K.prototype.upload = function (t, e, i) {
            var r = this.length,
              n = this.itemDirtyIds,
              o = this.items,
              s = t.gl;
            i.dirtyId < 0 &&
              s.texImage3D(
                s.TEXTURE_2D_ARRAY,
                0,
                e.format,
                this._width,
                this._height,
                r,
                0,
                e.format,
                e.type,
                null
              );
            for (var a = 0; a < r; a++) {
              var h = o[a];
              n[a] < h.dirtyId &&
                ((n[a] = h.dirtyId),
                h.valid &&
                  s.texSubImage3D(
                    s.TEXTURE_2D_ARRAY,
                    0,
                    0,
                    0,
                    a,
                    h.resource.width,
                    h.resource.height,
                    1,
                    e.format,
                    e.type,
                    h.resource.source
                  ));
            }
            return !0;
          });
        var q,
          o = K;
        function K(t, e) {
          var i,
            r = this,
            n = e || {},
            o = n.width,
            n = n.height,
            t = Array.isArray(t) ? (i = t).length : t,
            r = q.call(this, t, { width: o, height: n }) || this;
          return i && r.initFromArray(i, e), r;
        }
        a(J, (Z = X)),
          (J.crossOrigin = function (t, e, i) {
            void 0 === i && 0 !== e.indexOf('data:')
              ? (t.crossOrigin = g.determineCrossOrigin(e))
              : !1 !== i &&
                (t.crossOrigin = 'string' == typeof i ? i : 'anonymous');
          }),
          (J.prototype.upload = function (t, e, i, r) {
            var t = t.gl,
              n = e.realWidth,
              o = e.realHeight;
            return (
              (r = r || this.source),
              t.pixelStorei(
                t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                e.alphaMode === y.ALPHA_MODES.UNPACK
              ),
              this.noSubImage ||
              e.target !== t.TEXTURE_2D ||
              i.width !== n ||
              i.height !== o
                ? ((i.width = n),
                  (i.height = o),
                  t.texImage2D(e.target, 0, e.format, e.format, e.type, r))
                : t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, e.format, e.type, r),
              !0
            );
          }),
          (J.prototype.update = function () {
            var t, e;
            this.destroyed ||
              ((t = (e = this.source).naturalWidth || e.videoWidth || e.width),
              (e = e.naturalHeight || e.videoHeight || e.height),
              this.resize(t, e),
              Z.prototype.update.call(this));
          }),
          (J.prototype.dispose = function () {
            this.source = null;
          });
        var Z,
          l = J;
        function J(t) {
          var e = this,
            i = t.naturalWidth || t.videoWidth || t.width,
            r = t.naturalHeight || t.videoHeight || t.height;
          return (
            ((e = Z.call(this, i, r) || this).source = t),
            (e.noSubImage = !1),
            e
          );
        }
        a(tt, (Q = l)),
          (tt.test = function (t) {
            var e = window.OffscreenCanvas;
            return !!(e && t instanceof e) || t instanceof HTMLCanvasElement;
          });
        var Q,
          $ = tt;
        function tt() {
          return (null !== Q && Q.apply(this, arguments)) || this;
        }
        a(c, (et = t)),
          (c.prototype.bind = function (t) {
            et.prototype.bind.call(this, t),
              (t.target = y.TARGETS.TEXTURE_CUBE_MAP);
          }),
          (c.prototype.addBaseTextureAt = function (t, e, i) {
            if ((void 0 === i && (i = this.linkBaseTexture), !this.items[e]))
              throw new Error('Index ' + e + ' is out of bounds');
            if (
              !this.linkBaseTexture ||
              t.parentTextureArray ||
              0 < Object.keys(t._glTextures).length
            ) {
              if (!t.resource)
                throw new Error(
                  'CubeResource does not support copying of renderTexture.'
                );
              this.addResourceAt(t.resource, e);
            } else
              (t.target = y.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + e),
                (t.parentTextureArray = this.baseTexture),
                (this.items[e] = t);
            return (
              t.valid && !this.valid && this.resize(t.realWidth, t.realHeight),
              (this.items[e] = t),
              this
            );
          }),
          (c.prototype.upload = function (t, e, i) {
            for (var r = this.itemDirtyIds, n = 0; n < c.SIDES; n++) {
              var o = this.items[n];
              r[n] < o.dirtyId &&
                (o.valid && o.resource
                  ? (o.resource.upload(t, o, i), (r[n] = o.dirtyId))
                  : r[n] < -1 &&
                    (t.gl.texImage2D(
                      o.target,
                      0,
                      i.internalFormat,
                      e.realWidth,
                      e.realHeight,
                      0,
                      e.format,
                      i.type,
                      null
                    ),
                    (r[n] = -1)));
            }
            return !0;
          }),
          (c.test = function (t) {
            return Array.isArray(t) && t.length === c.SIDES;
          }),
          (c.SIDES = 6);
        var et,
          u = c;
        function c(t, e) {
          var i = this,
            r = e || {},
            n = r.width,
            o = r.height,
            s = r.autoLoad,
            r = r.linkBaseTexture;
          if (t && t.length !== c.SIDES)
            throw new Error('Invalid length. Got ' + t.length + ', expected 6');
          for (
            var i = et.call(this, 6, { width: n, height: o }) || this, a = 0;
            a < c.SIDES;
            a++
          )
            i.items[a].target = y.TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + a;
          return (
            (i.linkBaseTexture = !1 !== r),
            t && i.initFromArray(t, e),
            !1 !== s && i.load(),
            i
          );
        }
        a(nt, (it = l)),
          (nt.prototype.load = function (t) {
            var n = this;
            return (
              this._load ||
              (void 0 !== t && (this.createBitmap = t),
              (this._load = new Promise(function (t, e) {
                function i() {
                  n.destroyed ||
                    ((r.onload = null),
                    (r.onerror = null),
                    n.resize(r.width, r.height),
                    (n._load = null),
                    n.createBitmap ? t(n.process()) : t(n));
                }
                var r = n.source;
                n.url = r.src;
                r.complete && r.src
                  ? i()
                  : ((r.onload = i),
                    (r.onerror = function (t) {
                      e(t), n.onError.emit(t);
                    }));
              })),
              this._load)
            );
          }),
          (nt.prototype.process = function () {
            var e = this,
              t = this.source;
            return null !== this._process
              ? this._process
              : null === this.bitmap && window.createImageBitmap
              ? ((this._process = window
                  .createImageBitmap(t, 0, 0, t.width, t.height, {
                    premultiplyAlpha:
                      this.alphaMode === y.ALPHA_MODES.UNPACK
                        ? 'premultiply'
                        : 'none',
                  })
                  .then(function (t) {
                    return e.destroyed
                      ? Promise.reject()
                      : ((e.bitmap = t),
                        e.update(),
                        (e._process = null),
                        Promise.resolve(e));
                  })),
                this._process)
              : Promise.resolve(this);
          }),
          (nt.prototype.upload = function (t, e, i) {
            if (
              ('number' == typeof this.alphaMode &&
                (e.alphaMode = this.alphaMode),
              !this.createBitmap)
            )
              return it.prototype.upload.call(this, t, e, i);
            if (!this.bitmap && (this.process(), !this.bitmap)) return !1;
            if (
              (it.prototype.upload.call(this, t, e, i, this.bitmap),
              !this.preserveBitmap)
            ) {
              var r,
                n = !0,
                o = e._glTextures;
              for (r in o) {
                var s = o[r];
                if (s !== i && s.dirtyId !== e.dirtyId) {
                  n = !1;
                  break;
                }
              }
              n &&
                (this.bitmap.close && this.bitmap.close(),
                (this.bitmap = null));
            }
            return !0;
          }),
          (nt.prototype.dispose = function () {
            (this.source.onload = null),
              (this.source.onerror = null),
              it.prototype.dispose.call(this),
              this.bitmap && (this.bitmap.close(), (this.bitmap = null)),
              (this._process = null),
              (this._load = null);
          }),
          (nt.test = function (t) {
            return 'string' == typeof t || t instanceof HTMLImageElement;
          });
        var it,
          rt = nt;
        function nt(t, e) {
          var i,
            r = this;
          return (
            (e = e || {}),
            t instanceof HTMLImageElement ||
              ((i = new Image()),
              l.crossOrigin(i, t, e.crossorigin),
              (i.src = t),
              (t = i)),
            (r = it.call(this, t) || this),
            !t.complete &&
              r._width &&
              r._height &&
              ((r._width = 0), (r._height = 0)),
            (r.url = t.src),
            (r._process = null),
            (r.preserveBitmap = !1),
            (r.createBitmap =
              (void 0 !== e.createBitmap
                ? e.createBitmap
                : m.settings.CREATE_IMAGE_BITMAP) &&
              !!window.createImageBitmap),
            (r.alphaMode = 'number' == typeof e.alphaMode ? e.alphaMode : null),
            void 0 !== e.premultiplyAlpha &&
              (r.premultiplyAlpha = e.premultiplyAlpha),
            (r.bitmap = null),
            (r._load = null),
            !1 !== e.autoLoad && r.load(),
            r
          );
        }
        a(p, (ot = l)),
          (p.prototype.load = function () {
            var e = this;
            return (
              this._load ||
              ((this._load = new Promise(function (t) {
                if (
                  ((e._resolve = function () {
                    e.resize(e.source.width, e.source.height), t(e);
                  }),
                  /^\<svg/.test(e.svg.trim()))
                ) {
                  if (!btoa)
                    throw new Error(
                      "Your browser doesn't support base64 conversions."
                    );
                  e.svg =
                    'data:image/svg+xml;base64,' +
                    btoa(unescape(encodeURIComponent(e.svg)));
                }
                e._loadSvg();
              })),
              this._load)
            );
          }),
          (p.prototype._loadSvg = function () {
            var o = this,
              s = new Image();
            l.crossOrigin(s, this.svg, this._crossorigin),
              (s.src = this.svg),
              (s.onerror = function (t) {
                o._resolve && ((s.onerror = null), o.onError.emit(t));
              }),
              (s.onload = function () {
                if (o._resolve) {
                  var t = s.width,
                    e = s.height;
                  if (!t || !e)
                    throw new Error(
                      'The SVG image must have width and height defined (in pixels), canvas API needs them.'
                    );
                  var i = t * o.scale,
                    r = e * o.scale,
                    n =
                      ((o._overrideWidth || o._overrideHeight) &&
                        ((i = o._overrideWidth || (o._overrideHeight / e) * t),
                        (r = o._overrideHeight || (o._overrideWidth / t) * e)),
                      (i = Math.round(i)),
                      (r = Math.round(r)),
                      o.source);
                  (n.width = i),
                    (n.height = r),
                    (n._pixiId = 'canvas_' + g.uid()),
                    n.getContext('2d').drawImage(s, 0, 0, t, e, 0, 0, i, r),
                    o._resolve(),
                    (o._resolve = null);
                }
              });
          }),
          (p.getSize = function (t) {
            var t = p.SVG_SIZE.exec(t),
              e = {};
            return (
              t &&
                ((e[t[1]] = Math.round(parseFloat(t[3]))),
                (e[t[5]] = Math.round(parseFloat(t[7])))),
              e
            );
          }),
          (p.prototype.dispose = function () {
            ot.prototype.dispose.call(this),
              (this._resolve = null),
              (this._crossorigin = null);
          }),
          (p.test = function (t, e) {
            return (
              'svg' === e ||
              ('string' == typeof t &&
                /^data:image\/svg\+xml(;(charset=utf8|utf8))?;base64/.test(
                  t
                )) ||
              ('string' == typeof t && 0 === t.indexOf('<svg'))
            );
          }),
          (p.SVG_SIZE =
            /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i);
        var ot,
          st = p;
        function p(t, e) {
          var i = this;
          return (
            (e = e || {}),
            ((i =
              ot.call(this, document.createElement('canvas')) ||
              this)._width = 0),
            (i._height = 0),
            (i.svg = t),
            (i.scale = e.scale || 1),
            (i._overrideWidth = e.width),
            (i._overrideHeight = e.height),
            (i._resolve = null),
            (i._crossorigin = e.crossorigin),
            (i._load = null),
            !1 !== e.autoLoad && i.load(),
            i
          );
        }
        a(f, (at = l)),
          (f.prototype.update = function (t) {
            void 0 === t && (t = 0),
              this.destroyed ||
                ((t = B.Ticker.shared.elapsedMS * this.source.playbackRate),
                (this._msToNextUpdate = Math.floor(this._msToNextUpdate - t)),
                (!this._updateFPS || this._msToNextUpdate <= 0) &&
                  (at.prototype.update.call(this),
                  (this._msToNextUpdate = this._updateFPS
                    ? Math.floor(1e3 / this._updateFPS)
                    : 0)));
          }),
          (f.prototype.load = function () {
            var e = this;
            if (this._load) return this._load;
            var i = this.source;
            return (
              (i.readyState === i.HAVE_ENOUGH_DATA ||
                i.readyState === i.HAVE_FUTURE_DATA) &&
                i.width &&
                i.height &&
                (i.complete = !0),
              i.addEventListener('play', this._onPlayStart.bind(this)),
              i.addEventListener('pause', this._onPlayStop.bind(this)),
              this._isSourceReady()
                ? this._onCanPlay()
                : (i.addEventListener('canplay', this._onCanPlay),
                  i.addEventListener('canplaythrough', this._onCanPlay),
                  i.addEventListener('error', this._onError, !0)),
              (this._load = new Promise(function (t) {
                e.valid ? t(e) : ((e._resolve = t), i.load());
              })),
              this._load
            );
          }),
          (f.prototype._onError = function (t) {
            this.source.removeEventListener('error', this._onError, !0),
              this.onError.emit(t);
          }),
          (f.prototype._isSourcePlaying = function () {
            var t = this.source;
            return (
              0 < t.currentTime &&
              !1 === t.paused &&
              !1 === t.ended &&
              2 < t.readyState
            );
          }),
          (f.prototype._isSourceReady = function () {
            var t = this.source;
            return 3 === t.readyState || 4 === t.readyState;
          }),
          (f.prototype._onPlayStart = function () {
            this.valid || this._onCanPlay(),
              this.autoUpdate &&
                !this._isConnectedToTicker &&
                (B.Ticker.shared.add(this.update, this),
                (this._isConnectedToTicker = !0));
          }),
          (f.prototype._onPlayStop = function () {
            this._isConnectedToTicker &&
              (B.Ticker.shared.remove(this.update, this),
              (this._isConnectedToTicker = !1));
          }),
          (f.prototype._onCanPlay = function () {
            var t = this.source,
              e =
                (t.removeEventListener('canplay', this._onCanPlay),
                t.removeEventListener('canplaythrough', this._onCanPlay),
                this.valid);
            this.resize(t.videoWidth, t.videoHeight),
              !e &&
                this._resolve &&
                (this._resolve(this), (this._resolve = null)),
              this._isSourcePlaying()
                ? this._onPlayStart()
                : this.autoPlay && t.play();
          }),
          (f.prototype.dispose = function () {
            this._isConnectedToTicker &&
              B.Ticker.shared.remove(this.update, this);
            var t = this.source;
            t &&
              (t.removeEventListener('error', this._onError, !0),
              t.pause(),
              (t.src = ''),
              t.load()),
              at.prototype.dispose.call(this);
          }),
          Object.defineProperty(f.prototype, 'autoUpdate', {
            get: function () {
              return this._autoUpdate;
            },
            set: function (t) {
              t !== this._autoUpdate &&
                ((this._autoUpdate = t),
                !this._autoUpdate && this._isConnectedToTicker
                  ? (B.Ticker.shared.remove(this.update, this),
                    (this._isConnectedToTicker = !1))
                  : this._autoUpdate &&
                    !this._isConnectedToTicker &&
                    this._isSourcePlaying() &&
                    (B.Ticker.shared.add(this.update, this),
                    (this._isConnectedToTicker = !0)));
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(f.prototype, 'updateFPS', {
            get: function () {
              return this._updateFPS;
            },
            set: function (t) {
              t !== this._updateFPS && (this._updateFPS = t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          (f.test = function (t, e) {
            return t instanceof HTMLVideoElement || -1 < f.TYPES.indexOf(e);
          }),
          (f.TYPES = [
            'mp4',
            'm4v',
            'webm',
            'ogg',
            'ogv',
            'h264',
            'avi',
            'mov',
          ]),
          (f.MIME_TYPES = {
            ogv: 'video/ogg',
            mov: 'video/quicktime',
            m4v: 'video/mp4',
          });
        var at,
          ht = f;
        function f(t, e) {
          var i = this;
          if (((e = e || {}), !(t instanceof HTMLVideoElement))) {
            var r = document.createElement('video'),
              n =
                (r.setAttribute('preload', 'auto'),
                r.setAttribute('webkit-playsinline', ''),
                r.setAttribute('playsinline', ''),
                (t = 'string' == typeof t ? [t] : t)[0].src || t[0]);
            l.crossOrigin(r, n, e.crossorigin);
            for (var o = 0; o < t.length; ++o) {
              var s = document.createElement('source'),
                a = t[o],
                h = a.src,
                a = a.mime,
                u = (h = h || t[o]).split('?').shift().toLowerCase(),
                u = u.substr(u.lastIndexOf('.') + 1),
                a = a || f.MIME_TYPES[u] || 'video/' + u;
              (s.src = h), (s.type = a), r.appendChild(s);
            }
            t = r;
          }
          return (
            ((i = at.call(this, t) || this).noSubImage = !0),
            (i._autoUpdate = !0),
            (i._isConnectedToTicker = !1),
            (i._updateFPS = e.updateFPS || 0),
            (i._msToNextUpdate = 0),
            (i.autoPlay = !1 !== e.autoPlay),
            (i._load = null),
            (i._resolve = null),
            (i._onCanPlay = i._onCanPlay.bind(i)),
            (i._onError = i._onError.bind(i)),
            !1 !== e.autoLoad && i.load(),
            i
          );
        }
        a(ct, (ut = l)),
          (ct.test = function (t) {
            return !!window.createImageBitmap && t instanceof ImageBitmap;
          });
        var ut,
          lt = ct;
        function ct() {
          return (null !== ut && ut.apply(this, arguments)) || this;
        }
        U.push(rt, lt, $, ht, st, H, u, o);
        (t = {
          Resource: X,
          BaseImageResource: l,
          INSTALLED: U,
          autoDetectResource: j,
          AbstractMultiResource: t,
          ArrayResource: o,
          BufferResource: H,
          CanvasResource: $,
          CubeResource: u,
          ImageResource: rt,
          SVGResource: st,
          VideoResource: ht,
          ImageBitmapResource: lt,
        }),
          (dt.prototype.destroy = function () {
            this.renderer = null;
          }),
          (o = dt);
        function dt(t) {
          this.renderer = t;
        }
        a(mt, (pt = H)),
          (mt.prototype.upload = function (t, e, i) {
            var r = t.gl;
            return (
              r.pixelStorei(
                r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                e.alphaMode === y.ALPHA_MODES.UNPACK
              ),
              i.width === e.width && i.height === e.height
                ? r.texSubImage2D(
                    e.target,
                    0,
                    0,
                    0,
                    e.width,
                    e.height,
                    e.format,
                    e.type,
                    this.data
                  )
                : ((i.width = e.width),
                  (i.height = e.height),
                  r.texImage2D(
                    e.target,
                    0,
                    1 === t.context.webGLVersion
                      ? r.DEPTH_COMPONENT
                      : r.DEPTH_COMPONENT16,
                    e.width,
                    e.height,
                    0,
                    e.format,
                    e.type,
                    this.data
                  )),
              !0
            );
          });
        var pt,
          ft = mt;
        function mt() {
          return (null !== pt && pt.apply(this, arguments)) || this;
        }
        Object.defineProperty(v.prototype, 'colorTexture', {
          get: function () {
            return this.colorTextures[0];
          },
          enumerable: !1,
          configurable: !0,
        }),
          (v.prototype.addColorTexture = function (t, e) {
            return (
              (this.colorTextures[(t = void 0 === t ? 0 : t)] =
                e ||
                new d(null, {
                  scaleMode: y.SCALE_MODES.NEAREST,
                  resolution: 1,
                  mipmap: y.MIPMAP_MODES.OFF,
                  width: this.width,
                  height: this.height,
                })),
              this.dirtyId++,
              this.dirtyFormat++,
              this
            );
          }),
          (v.prototype.addDepthTexture = function (t) {
            return (
              (this.depthTexture =
                t ||
                new d(
                  new ft(null, { width: this.width, height: this.height }),
                  {
                    scaleMode: y.SCALE_MODES.NEAREST,
                    resolution: 1,
                    width: this.width,
                    height: this.height,
                    mipmap: y.MIPMAP_MODES.OFF,
                    format: y.FORMATS.DEPTH_COMPONENT,
                    type: y.TYPES.UNSIGNED_SHORT,
                  }
                )),
              this.dirtyId++,
              this.dirtyFormat++,
              this
            );
          }),
          (v.prototype.enableDepth = function () {
            return (this.depth = !0), this.dirtyId++, this.dirtyFormat++, this;
          }),
          (v.prototype.enableStencil = function () {
            return (
              (this.stencil = !0), this.dirtyId++, this.dirtyFormat++, this
            );
          }),
          (v.prototype.resize = function (t, e) {
            if (
              ((t = Math.ceil(t)),
              (e = Math.ceil(e)),
              t !== this.width || e !== this.height)
            ) {
              (this.width = t),
                (this.height = e),
                this.dirtyId++,
                this.dirtySize++;
              for (var i = 0; i < this.colorTextures.length; i++) {
                var r = this.colorTextures[i],
                  n = r.resolution;
                r.setSize(t / n, e / n);
              }
              this.depthTexture &&
                ((n = this.depthTexture.resolution),
                this.depthTexture.setSize(t / n, e / n));
            }
          }),
          (v.prototype.dispose = function () {
            this.disposeRunner.emit(this, !1);
          }),
          (v.prototype.destroyDepthTexture = function () {
            this.depthTexture &&
              (this.depthTexture.destroy(),
              (this.depthTexture = null),
              ++this.dirtyId,
              ++this.dirtyFormat);
          });
        var yt = v;
        function v(t, e) {
          (this.width = Math.ceil(t || 100)),
            (this.height = Math.ceil(e || 100)),
            (this.stencil = !1),
            (this.depth = !1),
            (this.dirtyId = 0),
            (this.dirtyFormat = 0),
            (this.dirtySize = 0),
            (this.depthTexture = null),
            (this.colorTextures = []),
            (this.glFramebuffers = {}),
            (this.disposeRunner = new r.Runner('disposeFramebuffer')),
            (this.multisample = y.MSAA_QUALITY.NONE);
        }
        a(_t, (gt = d)),
          (_t.prototype.resize = function (t, e) {
            (t = Math.ceil(t)),
              (e = Math.ceil(e)),
              this.framebuffer.resize(t * this.resolution, e * this.resolution);
          }),
          (_t.prototype.dispose = function () {
            this.framebuffer.dispose(), gt.prototype.dispose.call(this);
          }),
          (_t.prototype.destroy = function () {
            gt.prototype.destroy.call(this),
              this.framebuffer.destroyDepthTexture(),
              (this.framebuffer = null);
          });
        var gt,
          vt = _t;
        function _t(t) {
          var e = this,
            t =
              ((e =
                gt.call(
                  this,
                  null,
                  (t =
                    'number' == typeof t
                      ? {
                          width: arguments[0],
                          height: arguments[1],
                          scaleMode: arguments[2],
                          resolution: arguments[3],
                        }
                      : t)
                ) || this),
              t || {}),
            i = t.width,
            t = t.height;
          return (
            (e.mipmap = 0),
            (e.width = Math.ceil(i) || 100),
            (e.height = Math.ceil(t) || 100),
            (e.valid = !0),
            (e.clearColor = [0, 0, 0, 0]),
            (e.framebuffer = new yt(
              e.width * e.resolution,
              e.height * e.resolution
            ).addColorTexture(0, e)),
            (e.maskStack = []),
            (e.filterStack = [{}]),
            e
          );
        }
        bt.prototype.set = function (t, e, i) {
          var r,
            n,
            o,
            s,
            a = e.width,
            e = e.height;
          i
            ? ((r = t.width / 2 / a),
              (n = t.height / 2 / e),
              (o = t.x / a + r),
              (s = t.y / e + n),
              (i = h.groupD8.add(i, h.groupD8.NW)),
              (this.x0 = o + r * h.groupD8.uX(i)),
              (this.y0 = s + n * h.groupD8.uY(i)),
              (i = h.groupD8.add(i, 2)),
              (this.x1 = o + r * h.groupD8.uX(i)),
              (this.y1 = s + n * h.groupD8.uY(i)),
              (i = h.groupD8.add(i, 2)),
              (this.x2 = o + r * h.groupD8.uX(i)),
              (this.y2 = s + n * h.groupD8.uY(i)),
              (i = h.groupD8.add(i, 2)),
              (this.x3 = o + r * h.groupD8.uX(i)),
              (this.y3 = s + n * h.groupD8.uY(i)))
            : ((this.x0 = t.x / a),
              (this.y0 = t.y / e),
              (this.x1 = (t.x + t.width) / a),
              (this.y1 = t.y / e),
              (this.x2 = (t.x + t.width) / a),
              (this.y2 = (t.y + t.height) / e),
              (this.x3 = t.x / a),
              (this.y3 = (t.y + t.height) / e)),
            (this.uvsFloat32[0] = this.x0),
            (this.uvsFloat32[1] = this.y0),
            (this.uvsFloat32[2] = this.x1),
            (this.uvsFloat32[3] = this.y1),
            (this.uvsFloat32[4] = this.x2),
            (this.uvsFloat32[5] = this.y2),
            (this.uvsFloat32[6] = this.x3),
            (this.uvsFloat32[7] = this.y3);
        };
        var xt = bt;
        function bt() {
          (this.x0 = 0),
            (this.y0 = 0),
            (this.x1 = 1),
            (this.y1 = 0),
            (this.x2 = 1),
            (this.y2 = 1),
            (this.x3 = 0),
            (this.y3 = 1),
            (this.uvsFloat32 = new Float32Array(8));
        }
        var Tt,
          Et = new xt(),
          u =
            (a(_, (Tt = g.EventEmitter)),
            (_.prototype.update = function () {
              this.baseTexture.resource && this.baseTexture.resource.update();
            }),
            (_.prototype.onBaseTextureUpdated = function (t) {
              if (this.noFrame) {
                if (!this.baseTexture.valid) return;
                (this._frame.width = t.width),
                  (this._frame.height = t.height),
                  (this.valid = !0),
                  this.updateUvs();
              } else this.frame = this._frame;
              this.emit('update', this);
            }),
            (_.prototype.destroy = function (t) {
              this.baseTexture &&
                (t &&
                  ((t = this.baseTexture) &&
                    t.url &&
                    g.TextureCache[t.url] &&
                    _.removeFromCache(t.url),
                  this.baseTexture.destroy()),
                this.baseTexture.off('loaded', this.onBaseTextureUpdated, this),
                this.baseTexture.off('update', this.onBaseTextureUpdated, this),
                (this.baseTexture = null)),
                (this._frame = null),
                (this._uvs = null),
                (this.trim = null),
                (this.orig = null),
                (this.valid = !1),
                _.removeFromCache(this),
                (this.textureCacheIds = null);
            }),
            (_.prototype.clone = function () {
              return new _(
                this.baseTexture,
                this.frame.clone(),
                this.orig.clone(),
                this.trim && this.trim.clone(),
                this.rotate,
                this.defaultAnchor
              );
            }),
            (_.prototype.updateUvs = function () {
              this._uvs === Et && (this._uvs = new xt()),
                this._uvs.set(this._frame, this.baseTexture, this.rotate),
                this._updateID++;
            }),
            (_.from = function (t, e, i) {
              void 0 === e && (e = {}),
                void 0 === i && (i = m.settings.STRICT_TEXTURE_CACHE);
              var r = 'string' == typeof t,
                n = null,
                n = r
                  ? t
                  : (t._pixiId || (t._pixiId = 'pixiid_' + g.uid()), t._pixiId),
                o = g.TextureCache[n];
              if (r && i && !o)
                throw new Error(
                  'The cacheId "' + n + '" does not exist in TextureCache.'
                );
              return (
                o ||
                  (e.resolution || (e.resolution = g.getResolutionOfUrl(t)),
                  ((o = new _(new d(t, e))).baseTexture.cacheId = n),
                  d.addToCache(o.baseTexture, n),
                  _.addToCache(o, n)),
                o
              );
            }),
            (_.fromURL = function (t, e) {
              var i = Object.assign(
                  { autoLoad: !1 },
                  null == e ? void 0 : e.resourceOptions
                ),
                r = _.from(t, Object.assign({ resourceOptions: i }, e), !1),
                t = r.baseTexture.resource;
              return r.baseTexture.valid
                ? Promise.resolve(r)
                : t.load().then(function () {
                    return Promise.resolve(r);
                  });
            }),
            (_.fromBuffer = function (t, e, i, r) {
              return new _(d.fromBuffer(t, e, i, r));
            }),
            (_.fromLoader = function (t, e, i) {
              t = new rt(t);
              t.url = e;
              t = new _(
                new d(t, {
                  scaleMode: m.settings.SCALE_MODE,
                  resolution: g.getResolutionOfUrl(e),
                })
              );
              return (
                d.addToCache(t.baseTexture, (i = i || e)),
                _.addToCache(t, i),
                i !== e && (d.addToCache(t.baseTexture, e), _.addToCache(t, e)),
                t
              );
            }),
            (_.addToCache = function (t, e) {
              e &&
                (-1 === t.textureCacheIds.indexOf(e) &&
                  t.textureCacheIds.push(e),
                g.TextureCache[e] &&
                  console.warn(
                    'Texture added to the cache with an id [' +
                      e +
                      '] that already had an entry'
                  ),
                (g.TextureCache[e] = t));
            }),
            (_.removeFromCache = function (t) {
              if ('string' == typeof t) {
                var e,
                  i = g.TextureCache[t];
                if (i)
                  return (
                    -1 < (e = i.textureCacheIds.indexOf(t)) &&
                      i.textureCacheIds.splice(e, 1),
                    delete g.TextureCache[t],
                    i
                  );
              } else if (t && t.textureCacheIds) {
                for (var r = 0; r < t.textureCacheIds.length; ++r)
                  g.TextureCache[t.textureCacheIds[r]] === t &&
                    delete g.TextureCache[t.textureCacheIds[r]];
                return (t.textureCacheIds.length = 0), t;
              }
              return null;
            }),
            Object.defineProperty(_.prototype, 'resolution', {
              get: function () {
                return this.baseTexture.resolution;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(_.prototype, 'frame', {
              get: function () {
                return this._frame;
              },
              set: function (t) {
                (this._frame = t), (this.noFrame = !1);
                var e = t.x,
                  i = t.y,
                  r = t.width,
                  n = t.height,
                  o = e + r > this.baseTexture.width,
                  s = i + n > this.baseTexture.height;
                if (o || s)
                  throw (
                    ((e =
                      'X: ' +
                      e +
                      ' + ' +
                      r +
                      ' = ' +
                      (e + r) +
                      ' > ' +
                      this.baseTexture.width),
                    (i =
                      'Y: ' +
                      i +
                      ' + ' +
                      n +
                      ' = ' +
                      (i + n) +
                      ' > ' +
                      this.baseTexture.height),
                    new Error(
                      'Texture Error: frame does not fit inside the base Texture dimensions: ' +
                        e +
                        ' ' +
                        (o && s ? 'and' : 'or') +
                        ' ' +
                        i
                    ))
                  );
                (this.valid = r && n && this.baseTexture.valid),
                  this.trim || this.rotate || (this.orig = t),
                  this.valid && this.updateUvs();
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(_.prototype, 'rotate', {
              get: function () {
                return this._rotate;
              },
              set: function (t) {
                (this._rotate = t), this.valid && this.updateUvs();
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(_.prototype, 'width', {
              get: function () {
                return this.orig.width;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(_.prototype, 'height', {
              get: function () {
                return this.orig.height;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (_.prototype.castToBaseTexture = function () {
              return this.baseTexture;
            }),
            _);
        function _(t, e, i, r, n, o) {
          var s = Tt.call(this) || this;
          if (
            ((s.noFrame = !1),
            e || ((s.noFrame = !0), (e = new h.Rectangle(0, 0, 1, 1))),
            t instanceof _ && (t = t.baseTexture),
            (s.baseTexture = t),
            (s._frame = e),
            (s.trim = r),
            (s.valid = !1),
            (s._uvs = Et),
            (s.uvMatrix = null),
            (s.orig = i || e),
            (s._rotate = Number(n || 0)),
            !0 === n)
          )
            s._rotate = 2;
          else if (s._rotate % 2 != 0)
            throw new Error(
              'attempt to use diamond-shaped UVs. If you are sure, set rotation manually'
            );
          return (
            (s.defaultAnchor = o ? new h.Point(o.x, o.y) : new h.Point(0, 0)),
            (s._updateID = 0),
            (s.textureCacheIds = []),
            t.valid
              ? s.noFrame
                ? t.valid && s.onBaseTextureUpdated(t)
                : (s.frame = e)
              : t.once('loaded', s.onBaseTextureUpdated, s),
            s.noFrame && t.on('update', s.onBaseTextureUpdated, s),
            s
          );
        }
        function wt(t) {
          (t.destroy = function () {}),
            (t.on = function () {}),
            (t.once = function () {}),
            (t.emit = function () {});
        }
        (u.EMPTY = new u(new d())),
          wt(u.EMPTY),
          wt(u.EMPTY.baseTexture),
          (u.WHITE =
            (((st = document.createElement('canvas')).width = 16),
            (st.height = 16),
            ((ht = st.getContext('2d')).fillStyle = 'white'),
            ht.fillRect(0, 0, 16, 16),
            new u(new d(new $(st))))),
          wt(u.WHITE),
          wt(u.WHITE.baseTexture);
        a(Ot, (Pt = u)),
          Object.defineProperty(Ot.prototype, 'framebuffer', {
            get: function () {
              return this.baseTexture.framebuffer;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (Ot.prototype.resize = function (t, e, i) {
            void 0 === i && (i = !0),
              (t = Math.ceil(t)),
              (e = Math.ceil(e)),
              (this.valid = 0 < t && 0 < e),
              (this._frame.width = this.orig.width = t),
              (this._frame.height = this.orig.height = e),
              i && this.baseTexture.resize(t, e),
              this.updateUvs();
          }),
          (Ot.prototype.setResolution = function (t) {
            var e = this.baseTexture;
            e.resolution !== t &&
              (e.setResolution(t), this.resize(e.width, e.height, !1));
          }),
          (Ot.create = function (t) {
            return new Ot(
              new vt(
                (t =
                  'number' == typeof t
                    ? {
                        width: t,
                        height: arguments[1],
                        scaleMode: arguments[2],
                        resolution: arguments[3],
                      }
                    : t)
              )
            );
          });
        var Pt,
          St = Ot;
        function Ot(t, e) {
          var i,
            r,
            n,
            o,
            s = this,
            a = null;
          return (
            t instanceof vt ||
              ((i = arguments[1]),
              (r = arguments[2]),
              (n = arguments[3]),
              (o = arguments[4]),
              console.warn(
                'Please use RenderTexture.create(' +
                  i +
                  ', ' +
                  r +
                  ') instead of the ctor directly.'
              ),
              (a = arguments[0]),
              (e = null),
              (t = new vt({
                width: i,
                height: r,
                scaleMode: n,
                resolution: o,
              }))),
            ((s = Pt.call(this, t, e) || this).legacyRenderer = a),
            (s.valid = !0),
            (s.filterFrame = null),
            (s.filterPoolKey = null),
            s.updateUvs(),
            s
          );
        }
        (x.prototype.createTexture = function (t, e) {
          t = new vt(
            Object.assign(
              { width: t, height: e, resolution: 1 },
              this.textureOptions
            )
          );
          return new St(t);
        }),
          (x.prototype.getOptimalTexture = function (t, e, i) {
            var r = x.SCREEN_KEY,
              n =
                ((t *= i = void 0 === i ? 1 : i),
                (e *= i),
                (this.enableFullScreen &&
                  t === this._pixelsWidth &&
                  e === this._pixelsHeight) ||
                  (r =
                    ((65535 & (t = g.nextPow2(t))) << 16) |
                    (65535 & (e = g.nextPow2(e)))),
                this.texturePool[r] || (this.texturePool[r] = []),
                this.texturePool[r].pop());
            return (
              ((n = n || this.createTexture(t, e)).filterPoolKey = r),
              n.setResolution(i),
              n
            );
          }),
          (x.prototype.getFilterTexture = function (t, e) {
            e = this.getOptimalTexture(t.width, t.height, e || t.resolution);
            return (e.filterFrame = t.filterFrame), e;
          }),
          (x.prototype.returnTexture = function (t) {
            var e = t.filterPoolKey;
            (t.filterFrame = null), this.texturePool[e].push(t);
          }),
          (x.prototype.returnFilterTexture = function (t) {
            this.returnTexture(t);
          }),
          (x.prototype.clear = function (t) {
            if ((t = !1 !== t))
              for (var e in this.texturePool) {
                var i = this.texturePool[e];
                if (i) for (var r = 0; r < i.length; r++) i[r].destroy(!0);
              }
            this.texturePool = {};
          }),
          (x.prototype.setScreenSize = function (t) {
            if (
              t.width !== this._pixelsWidth ||
              t.height !== this._pixelsHeight
            ) {
              var e = x.SCREEN_KEY,
                i = this.texturePool[e];
              if (((this.enableFullScreen = 0 < t.width && 0 < t.height), i))
                for (var r = 0; r < i.length; r++) i[r].destroy(!0);
              (this.texturePool[e] = []),
                (this._pixelsWidth = t.width),
                (this._pixelsHeight = t.height);
            }
          }),
          (x.SCREEN_KEY = 'screen');
        var It = x;
        function x(t) {
          (this.texturePool = {}),
            (this.textureOptions = t || {}),
            (this.enableFullScreen = !1),
            (this._pixelsWidth = 0),
            (this._pixelsHeight = 0);
        }
        (Mt.prototype.destroy = function () {
          this.buffer = null;
        }),
          (Mt.from = function (t, e, i, r, n) {
            return new Mt(t, e, i, r, n);
          });
        var At = Mt;
        function Mt(t, e, i, r, n, o, s) {
          void 0 === e && (e = 0),
            void 0 === i && (i = !1),
            void 0 === r && (r = 5126),
            (this.buffer = t),
            (this.size = e),
            (this.normalized = i),
            (this.type = r),
            (this.stride = n),
            (this.start = o),
            (this.instance = s);
        }
        var Dt = 0,
          b =
            ((Ct.prototype.update = function (t) {
              (this.data = t || this.data), this._updateID++;
            }),
            (Ct.prototype.dispose = function () {
              this.disposeRunner.emit(this, !1);
            }),
            (Ct.prototype.destroy = function () {
              this.dispose(), (this.data = null);
            }),
            (Ct.from = function (t) {
              return new Ct((t = t instanceof Array ? new Float32Array(t) : t));
            }),
            Ct);
        function Ct(t, e, i) {
          void 0 === e && (e = !0),
            void 0 === i && (i = !1),
            (this.data = t || new Float32Array(1)),
            (this._glBuffers = {}),
            (this._updateID = 0),
            (this.index = i),
            (this.static = e),
            (this.id = Dt++),
            (this.disposeRunner = new r.Runner('disposeBuffer'));
        }
        function Rt(t) {
          if (4 === t.BYTES_PER_ELEMENT)
            return t instanceof Float32Array
              ? 'Float32Array'
              : t instanceof Uint32Array
              ? 'Uint32Array'
              : 'Int32Array';
          if (2 === t.BYTES_PER_ELEMENT) {
            if (t instanceof Uint16Array) return 'Uint16Array';
          } else if (1 === t.BYTES_PER_ELEMENT && t instanceof Uint8Array)
            return 'Uint8Array';
          return null;
        }
        var Lt = {
          Float32Array: Float32Array,
          Uint32Array: Uint32Array,
          Int32Array: Int32Array,
          Uint8Array: Uint8Array,
        };
        var Nt = { 5126: 4, 5123: 2, 5121: 1 },
          Ft = 0,
          Bt = {
            Float32Array: Float32Array,
            Uint32Array: Uint32Array,
            Int32Array: Int32Array,
            Uint8Array: Uint8Array,
            Uint16Array: Uint16Array,
          },
          lt =
            ((T.prototype.addAttribute = function (t, e, i, r, n, o, s, a) {
              if (
                (void 0 === i && (i = 0),
                void 0 === r && (r = !1),
                void 0 === a && (a = !1),
                !e)
              )
                throw new Error(
                  'You must pass a buffer when creating an attribute'
                );
              e instanceof b ||
                (e instanceof Array && (e = new Float32Array(e)),
                (e = new b(e)));
              var h = t.split('|');
              if (1 < h.length) {
                for (var u = 0; u < h.length; u++)
                  this.addAttribute(h[u], e, i, r, n);
                return this;
              }
              var l = this.buffers.indexOf(e);
              return (
                -1 === l &&
                  (this.buffers.push(e), (l = this.buffers.length - 1)),
                (this.attributes[t] = new At(l, i, r, n, o, s, a)),
                (this.instanced = this.instanced || a),
                this
              );
            }),
            (T.prototype.getAttribute = function (t) {
              return this.attributes[t];
            }),
            (T.prototype.getBuffer = function (t) {
              return this.buffers[this.getAttribute(t).buffer];
            }),
            (T.prototype.addIndex = function (t) {
              return (
                t instanceof b ||
                  (t instanceof Array && (t = new Uint16Array(t)),
                  (t = new b(t))),
                (t.index = !0),
                (this.indexBuffer = t),
                -1 === this.buffers.indexOf(t) && this.buffers.push(t),
                this
              );
            }),
            (T.prototype.getIndex = function () {
              return this.indexBuffer;
            }),
            (T.prototype.interleave = function () {
              if (
                1 === this.buffers.length ||
                (2 === this.buffers.length && this.indexBuffer)
              )
                return this;
              var t,
                e = [],
                i = [],
                r = new b();
              for (t in this.attributes) {
                var n = this.attributes[t],
                  o = this.buffers[n.buffer];
                e.push(o.data),
                  i.push((n.size * Nt[n.type]) / 4),
                  (n.buffer = 0);
              }
              for (
                r.data = (function (t, e) {
                  for (var i = 0, r = 0, n = {}, o = 0; o < t.length; o++)
                    (r += e[o]), (i += t[o].length);
                  for (
                    var s = new ArrayBuffer(4 * i), a = null, h = 0, o = 0;
                    o < t.length;
                    o++
                  ) {
                    var u = e[o],
                      l = t[o],
                      c = Rt(l);
                    n[c] || (n[c] = new Lt[c](s));
                    for (var a = n[c], d = 0; d < l.length; d++)
                      a[((d / u) | 0) * r + h + (d % u)] = l[d];
                    h += u;
                  }
                  return new Float32Array(s);
                })(e, i),
                  t = 0;
                t < this.buffers.length;
                t++
              )
                this.buffers[t] !== this.indexBuffer &&
                  this.buffers[t].destroy();
              return (
                (this.buffers = [r]),
                this.indexBuffer && this.buffers.push(this.indexBuffer),
                this
              );
            }),
            (T.prototype.getSize = function () {
              for (var t in this.attributes) {
                t = this.attributes[t];
                return (
                  this.buffers[t.buffer].data.length / (t.stride / 4 || t.size)
                );
              }
              return 0;
            }),
            (T.prototype.dispose = function () {
              this.disposeRunner.emit(this, !1);
            }),
            (T.prototype.destroy = function () {
              this.dispose(),
                (this.buffers = null),
                (this.indexBuffer = null),
                (this.attributes = null);
            }),
            (T.prototype.clone = function () {
              for (var t = new T(), e = 0; e < this.buffers.length; e++)
                t.buffers[e] = new b(this.buffers[e].data.slice(0));
              for (e in this.attributes) {
                var i = this.attributes[e];
                t.attributes[e] = new At(
                  i.buffer,
                  i.size,
                  i.normalized,
                  i.type,
                  i.stride,
                  i.start,
                  i.instance
                );
              }
              return (
                this.indexBuffer &&
                  ((t.indexBuffer =
                    t.buffers[this.buffers.indexOf(this.indexBuffer)]),
                  (t.indexBuffer.index = !0)),
                t
              );
            }),
            (T.merge = function (t) {
              for (
                var e = new T(), i = [], r = [], n = [], o = 0;
                o < t.length;
                o++
              )
                for (var s = t[o], a = 0; a < s.buffers.length; a++)
                  (r[a] = r[a] || 0),
                    (r[a] += s.buffers[a].data.length),
                    (n[a] = 0);
              for (o = 0; o < s.buffers.length; o++)
                (i[o] = new Bt[Rt(s.buffers[o].data)](r[o])),
                  (e.buffers[o] = new b(i[o]));
              for (o = 0; o < t.length; o++) {
                s = t[o];
                for (a = 0; a < s.buffers.length; a++)
                  i[a].set(s.buffers[a].data, n[a]),
                    (n[a] += s.buffers[a].data.length);
              }
              if (((e.attributes = s.attributes), s.indexBuffer)) {
                (e.indexBuffer = e.buffers[s.buffers.indexOf(s.indexBuffer)]),
                  (e.indexBuffer.index = !0);
                for (
                  var h = 0, u = 0, l = 0, c = 0, o = 0;
                  o < s.buffers.length;
                  o++
                )
                  if (s.buffers[o] !== s.indexBuffer) {
                    c = o;
                    break;
                  }
                for (o in s.attributes) {
                  var d = s.attributes[o];
                  (0 | d.buffer) === c && (u += (d.size * Nt[d.type]) / 4);
                }
                for (o = 0; o < t.length; o++) {
                  for (var p = t[o].indexBuffer.data, a = 0; a < p.length; a++)
                    e.indexBuffer.data[a + l] += h;
                  (h += s.buffers[c].data.length / u), (l += p.length);
                }
              }
              return e;
            }),
            T);
        function T(t, e) {
          void 0 === e && (e = {}),
            (this.buffers = t = void 0 === t ? [] : t),
            (this.indexBuffer = null),
            (this.attributes = e),
            (this.glVertexArrayObjects = {}),
            (this.id = Ft++),
            (this.instanced = !1),
            (this.instanceCount = 1),
            (this.disposeRunner = new r.Runner('disposeGeometry')),
            (this.refCount = 0);
        }
        a(kt, (Ut = lt));
        var Ut,
          jt = kt;
        function kt() {
          var t = Ut.call(this) || this;
          return (
            t
              .addAttribute(
                'aVertexPosition',
                new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
              )
              .addIndex([0, 1, 3, 2]),
            t
          );
        }
        a(Ht, (Xt = lt)),
          (Ht.prototype.map = function (t, e) {
            var i;
            return (
              (this.uvs[0] = 0),
              (this.uvs[1] = 0),
              (this.uvs[2] = 0 + e.width / t.width),
              (this.uvs[3] = 0),
              (this.uvs[4] = 0 + e.width / t.width),
              (this.uvs[5] = 0 + e.height / t.height),
              (this.uvs[6] = 0),
              (this.uvs[7] = 0 + e.height / t.height),
              (t = e.x),
              (i = e.y),
              (this.vertices[0] = t),
              (this.vertices[1] = i),
              (this.vertices[2] = t + e.width),
              (this.vertices[3] = i),
              (this.vertices[4] = t + e.width),
              (this.vertices[5] = i + e.height),
              (this.vertices[6] = t),
              (this.vertices[7] = i + e.height),
              this.invalidate(),
              this
            );
          }),
          (Ht.prototype.invalidate = function () {
            return (
              this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this
            );
          });
        var Xt,
          Gt = Ht;
        function Ht() {
          var t = Xt.call(this) || this;
          return (
            (t.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])),
            (t.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])),
            (t.vertexBuffer = new b(t.vertices)),
            (t.uvBuffer = new b(t.uvs)),
            t
              .addAttribute('aVertexPosition', t.vertexBuffer)
              .addAttribute('aTextureCoord', t.uvBuffer)
              .addIndex([0, 1, 2, 0, 2, 3]),
            t
          );
        }
        var zt = 0,
          Yt =
            ((Vt.prototype.update = function () {
              this.dirtyId++;
            }),
            (Vt.prototype.add = function (t, e, i) {
              this.uniforms[t] = new Vt(e, i);
            }),
            (Vt.from = function (t, e) {
              return new Vt(t, e);
            }),
            Vt);
        function Vt(t, e) {
          (this.uniforms = t),
            (this.group = !0),
            (this.syncUniforms = {}),
            (this.dirtyId = 0),
            (this.id = zt++),
            (this.static = !!e);
        }
        qt.prototype.clear = function () {
          (this.target = null),
            (this.filters = null),
            (this.renderTexture = null);
        };
        var Wt = qt;
        function qt() {
          (this.renderTexture = null),
            (this.target = null),
            (this.legacy = !1),
            (this.resolution = 1),
            (this.sourceFrame = new h.Rectangle()),
            (this.destinationFrame = new h.Rectangle()),
            (this.filters = []);
        }
        a(E, (Kt = o)),
          (E.prototype.push = function (t, e) {
            for (
              var i = this.renderer,
                r = this.defaultFilterStack,
                n = this.statePool.pop() || new Wt(),
                o = e[0].resolution,
                s = e[0].padding,
                a = e[0].autoFit,
                h = e[0].legacy,
                u = 1;
              u < e.length;
              u++
            )
              var l = e[u],
                o = Math.min(o, l.resolution),
                s = this.useMaxPadding ? Math.max(s, l.padding) : s + l.padding,
                a = a && l.autoFit,
                h = h || l.legacy;
            1 === r.length &&
              (this.defaultFilterStack[0].renderTexture =
                i.renderTexture.current),
              r.push(n),
              (n.resolution = o),
              (n.legacy = h),
              (n.target = t),
              n.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)),
              n.sourceFrame.pad(s),
              a && n.sourceFrame.fit(this.renderer.renderTexture.sourceFrame),
              n.sourceFrame.ceil(o),
              (n.renderTexture = this.getOptimalFilterTexture(
                n.sourceFrame.width,
                n.sourceFrame.height,
                o
              )),
              (n.filters = e),
              (n.destinationFrame.width = n.renderTexture.width),
              (n.destinationFrame.height = n.renderTexture.height);
            r = this.tempRect;
            (r.width = n.sourceFrame.width),
              (r.height = n.sourceFrame.height),
              (n.renderTexture.filterFrame = n.sourceFrame),
              i.renderTexture.bind(n.renderTexture, n.sourceFrame, r),
              i.renderTexture.clear();
          }),
          (E.prototype.pop = function () {
            var t = this.defaultFilterStack,
              e = t.pop(),
              i = e.filters,
              r = ((this.activeState = e), this.globalUniforms.uniforms),
              n =
                ((r.outputFrame = e.sourceFrame),
                (r.resolution = e.resolution),
                r.inputSize),
              o = r.inputPixel,
              s = r.inputClamp,
              n =
                ((n[0] = e.destinationFrame.width),
                (n[1] = e.destinationFrame.height),
                (n[2] = 1 / n[0]),
                (n[3] = 1 / n[1]),
                (o[0] = n[0] * e.resolution),
                (o[1] = n[1] * e.resolution),
                (o[2] = 1 / o[0]),
                (o[3] = 1 / o[1]),
                (s[0] = 0.5 * o[2]),
                (s[1] = 0.5 * o[3]),
                (s[2] = e.sourceFrame.width * n[2] - 0.5 * o[2]),
                (s[3] = e.sourceFrame.height * n[3] - 0.5 * o[3]),
                e.legacy &&
                  (((s = r.filterArea)[0] = e.destinationFrame.width),
                  (s[1] = e.destinationFrame.height),
                  (s[2] = e.sourceFrame.x),
                  (s[3] = e.sourceFrame.y),
                  (r.filterClamp = r.inputClamp)),
                this.globalUniforms.update(),
                t[t.length - 1]);
            if (
              (1 < e.renderTexture.framebuffer.multisample &&
                this.renderer.framebuffer.blit(),
              1 === i.length)
            )
              i[0].apply(
                this,
                e.renderTexture,
                n.renderTexture,
                y.CLEAR_MODES.BLEND,
                e
              ),
                this.returnFilterTexture(e.renderTexture);
            else {
              for (
                var a = e.renderTexture,
                  h =
                    (((l = this.getOptimalFilterTexture(
                      a.width,
                      a.height,
                      e.resolution
                    )).filterFrame = a.filterFrame),
                    0),
                  h = 0;
                h < i.length - 1;
                ++h
              ) {
                i[h].apply(this, a, l, y.CLEAR_MODES.CLEAR, e);
                var u = a,
                  a = l,
                  l = u;
              }
              i[h].apply(this, a, n.renderTexture, y.CLEAR_MODES.BLEND, e),
                this.returnFilterTexture(a),
                this.returnFilterTexture(l);
            }
            e.clear(), this.statePool.push(e);
          }),
          (E.prototype.bindAndClear = function (t, e) {
            var i;
            void 0 === e && (e = y.CLEAR_MODES.CLEAR),
              t && t.filterFrame
                ? (((i = this.tempRect).width = t.filterFrame.width),
                  (i.height = t.filterFrame.height),
                  this.renderer.renderTexture.bind(t, t.filterFrame, i))
                : this.renderer.renderTexture.bind(t),
              'boolean' == typeof e &&
                ((e = e ? y.CLEAR_MODES.CLEAR : y.CLEAR_MODES.BLEND),
                g.deprecation(
                  '5.2.1',
                  'Use CLEAR_MODES when using clear applyFilter option'
                )),
              (e === y.CLEAR_MODES.CLEAR ||
                (e === y.CLEAR_MODES.BLIT && this.forceClear)) &&
                this.renderer.renderTexture.clear();
          }),
          (E.prototype.applyFilter = function (t, e, i, r) {
            var n = this.renderer;
            this.bindAndClear(i, r),
              (t.uniforms.uSampler = e),
              (t.uniforms.filterGlobals = this.globalUniforms),
              n.state.set(t.state),
              n.shader.bind(t),
              t.legacy
                ? (this.quadUv.map(e._frame, e.filterFrame),
                  n.geometry.bind(this.quadUv),
                  n.geometry.draw(y.DRAW_MODES.TRIANGLES))
                : (n.geometry.bind(this.quad),
                  n.geometry.draw(y.DRAW_MODES.TRIANGLE_STRIP));
          }),
          (E.prototype.calculateSpriteMatrix = function (t, e) {
            var i = this.activeState,
              r = i.sourceFrame,
              i = i.destinationFrame,
              n = e._texture.orig,
              t = t.set(i.width, 0, 0, i.height, r.x, r.y),
              i = e.worldTransform.copyTo(h.Matrix.TEMP_MATRIX);
            return (
              i.invert(),
              t.prepend(i),
              t.scale(1 / n.width, 1 / n.height),
              t.translate(e.anchor.x, e.anchor.y),
              t
            );
          }),
          (E.prototype.destroy = function () {
            this.texturePool.clear(!1);
          }),
          (E.prototype.getOptimalFilterTexture = function (t, e, i) {
            return this.texturePool.getOptimalTexture(
              t,
              e,
              (i = void 0 === i ? 1 : i)
            );
          }),
          (E.prototype.getFilterTexture = function (t, e) {
            'number' == typeof t && ((i = t), (t = e), (e = i)),
              (t = t || this.activeState.renderTexture);
            var i = this.texturePool.getOptimalTexture(
              t.width,
              t.height,
              e || t.resolution
            );
            return (i.filterFrame = t.filterFrame), i;
          }),
          (E.prototype.returnFilterTexture = function (t) {
            this.texturePool.returnTexture(t);
          }),
          (E.prototype.emptyPool = function () {
            this.texturePool.clear(!0);
          }),
          (E.prototype.resize = function () {
            this.texturePool.setScreenSize(this.renderer.view);
          });
        var Kt,
          Zt = E;
        function E(t) {
          var e = Kt.call(this, t) || this;
          return (
            (e.defaultFilterStack = [{}]),
            (e.texturePool = new It()),
            e.texturePool.setScreenSize(t.view),
            (e.statePool = []),
            (e.quad = new jt()),
            (e.quadUv = new Gt()),
            (e.tempRect = new h.Rectangle()),
            (e.activeState = {}),
            (e.globalUniforms = new Yt(
              {
                outputFrame: e.tempRect,
                inputSize: new Float32Array(4),
                inputPixel: new Float32Array(4),
                inputClamp: new Float32Array(4),
                resolution: 1,
                filterArea: new Float32Array(4),
                filterClamp: new Float32Array(4),
              },
              !0
            )),
            (e.forceClear = !1),
            (e.useMaxPadding = !1),
            e
          );
        }
        (Qt.prototype.flush = function () {}),
          (Qt.prototype.destroy = function () {
            this.renderer = null;
          }),
          (Qt.prototype.start = function () {}),
          (Qt.prototype.stop = function () {
            this.flush();
          }),
          (Qt.prototype.render = function (t) {});
        var Jt = Qt;
        function Qt(t) {
          this.renderer = t;
        }
        a(ee, ($t = o)),
          (ee.prototype.setObjectRenderer = function (t) {
            this.currentRenderer !== t &&
              (this.currentRenderer.stop(),
              (this.currentRenderer = t),
              this.currentRenderer.start());
          }),
          (ee.prototype.flush = function () {
            this.setObjectRenderer(this.emptyRenderer);
          }),
          (ee.prototype.reset = function () {
            this.setObjectRenderer(this.emptyRenderer);
          }),
          (ee.prototype.copyBoundTextures = function (t, e) {
            for (
              var i = this.renderer.texture.boundTextures, r = e - 1;
              0 <= r;
              --r
            )
              (t[r] = i[r] || null), t[r] && (t[r]._batchLocation = r);
          }),
          (ee.prototype.boundArray = function (t, e, i, r) {
            for (
              var n = t.elements, o = t.ids, s = t.count, a = 0, h = 0;
              h < s;
              h++
            ) {
              var u = n[h],
                l = u._batchLocation;
              if (0 <= l && l < r && e[l] === u) o[h] = l;
              else
                for (; a < r; ) {
                  var c = e[a];
                  if (!c || c._batchEnabled !== i || c._batchLocation !== a) {
                    (o[h] = a), (e[(u._batchLocation = a)] = u);
                    break;
                  }
                  a++;
                }
            }
          });
        var $t,
          te = ee;
        function ee(t) {
          var e = $t.call(this, t) || this;
          return (
            (e.emptyRenderer = new Jt(t)),
            (e.currentRenderer = e.emptyRenderer),
            e
          );
        }
        var ie,
          re = 0,
          ne =
            (a(w, (ie = o)),
            Object.defineProperty(w.prototype, 'isLost', {
              get: function () {
                return !this.gl || this.gl.isContextLost();
              },
              enumerable: !1,
              configurable: !0,
            }),
            (w.prototype.contextChange = function (t) {
              (this.gl = t),
                (this.renderer.gl = t),
                (this.renderer.CONTEXT_UID = re++),
                t.isContextLost() &&
                  t.getExtension('WEBGL_lose_context') &&
                  t.getExtension('WEBGL_lose_context').restoreContext();
            }),
            (w.prototype.initFromContext = function (t) {
              (this.gl = t),
                this.validateContext(t),
                (this.renderer.gl = t),
                (this.renderer.CONTEXT_UID = re++),
                this.renderer.runners.contextChange.emit(t);
            }),
            (w.prototype.initFromOptions = function (t) {
              t = this.createContext(this.renderer.view, t);
              this.initFromContext(t);
            }),
            (w.prototype.createContext = function (t, e) {
              var i;
              if (
                (i =
                  m.settings.PREFER_ENV >= y.ENV.WEBGL2
                    ? t.getContext('webgl2', e)
                    : i)
              )
                this.webGLVersion = 2;
              else if (
                ((this.webGLVersion = 1),
                !(i =
                  t.getContext('webgl', e) ||
                  t.getContext('experimental-webgl', e)))
              )
                throw new Error(
                  'This browser does not support WebGL. Try using the canvas renderer'
                );
              return (this.gl = i), this.getExtensions(), this.gl;
            }),
            (w.prototype.getExtensions = function () {
              var t = this.gl;
              1 === this.webGLVersion
                ? Object.assign(this.extensions, {
                    drawBuffers: t.getExtension('WEBGL_draw_buffers'),
                    depthTexture: t.getExtension('WEBGL_depth_texture'),
                    loseContext: t.getExtension('WEBGL_lose_context'),
                    vertexArrayObject:
                      t.getExtension('OES_vertex_array_object') ||
                      t.getExtension('MOZ_OES_vertex_array_object') ||
                      t.getExtension('WEBKIT_OES_vertex_array_object'),
                    anisotropicFiltering: t.getExtension(
                      'EXT_texture_filter_anisotropic'
                    ),
                    uint32ElementIndex: t.getExtension(
                      'OES_element_index_uint'
                    ),
                    floatTexture: t.getExtension('OES_texture_float'),
                    floatTextureLinear: t.getExtension(
                      'OES_texture_float_linear'
                    ),
                    textureHalfFloat: t.getExtension('OES_texture_half_float'),
                    textureHalfFloatLinear: t.getExtension(
                      'OES_texture_half_float_linear'
                    ),
                  })
                : 2 === this.webGLVersion &&
                  Object.assign(this.extensions, {
                    anisotropicFiltering: t.getExtension(
                      'EXT_texture_filter_anisotropic'
                    ),
                    colorBufferFloat: t.getExtension('EXT_color_buffer_float'),
                    floatTextureLinear: t.getExtension(
                      'OES_texture_float_linear'
                    ),
                  });
            }),
            (w.prototype.handleContextLost = function (t) {
              t.preventDefault();
            }),
            (w.prototype.handleContextRestored = function () {
              this.renderer.runners.contextChange.emit(this.gl);
            }),
            (w.prototype.destroy = function () {
              var t = this.renderer.view;
              t.removeEventListener('webglcontextlost', this.handleContextLost),
                t.removeEventListener(
                  'webglcontextrestored',
                  this.handleContextRestored
                ),
                this.gl.useProgram(null),
                this.extensions.loseContext &&
                  this.extensions.loseContext.loseContext();
            }),
            (w.prototype.postrender = function () {
              this.renderer.renderingToScreen && this.gl.flush();
            }),
            (w.prototype.validateContext = function (t) {
              var e = t.getContextAttributes(),
                i =
                  'WebGL2RenderingContext' in window &&
                  t instanceof window.WebGL2RenderingContext,
                e =
                  (i && (this.webGLVersion = 2),
                  e.stencil ||
                    console.warn(
                      'Provided WebGL context does not have a stencil buffer, masks may not render correctly'
                    ),
                  i || !!t.getExtension('OES_element_index_uint'));
              (this.supports.uint32Indices = e) ||
                console.warn(
                  'Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly'
                );
            }),
            w);
        function w(t) {
          var e = ie.call(this, t) || this;
          return (
            (e.webGLVersion = 1),
            (e.extensions = {}),
            (e.supports = { uint32Indices: !1 }),
            (e.handleContextLost = e.handleContextLost.bind(e)),
            (e.handleContextRestored = e.handleContextRestored.bind(e)),
            t.view.addEventListener(
              'webglcontextlost',
              e.handleContextLost,
              !1
            ),
            t.view.addEventListener(
              'webglcontextrestored',
              e.handleContextRestored,
              !1
            ),
            e
          );
        }
        var oe,
          se = function (t) {
            (this.framebuffer = t),
              (this.stencil = null),
              (this.dirtyId = 0),
              (this.dirtyFormat = 0),
              (this.dirtySize = 0),
              (this.multisample = y.MSAA_QUALITY.NONE),
              (this.msaaBuffer = null),
              (this.blitFramebuffer = null);
          },
          ae = new h.Rectangle(),
          he =
            (a(P, (oe = o)),
            (P.prototype.contextChange = function () {
              var e,
                t,
                i = (this.gl = this.renderer.gl);
              (this.CONTEXT_UID = this.renderer.CONTEXT_UID),
                (this.current = this.unknownFramebuffer),
                (this.viewport = new h.Rectangle()),
                (this.hasMRT = !0),
                (this.writeDepthTexture = !0),
                this.disposeAll(!0),
                1 === this.renderer.context.webGLVersion
                  ? ((e = this.renderer.context.extensions.drawBuffers),
                    (t = this.renderer.context.extensions.depthTexture),
                    m.settings.PREFER_ENV === y.ENV.WEBGL_LEGACY &&
                      (t = e = null),
                    e
                      ? (i.drawBuffers = function (t) {
                          return e.drawBuffersWEBGL(t);
                        })
                      : ((this.hasMRT = !1), (i.drawBuffers = function () {})),
                    t || (this.writeDepthTexture = !1))
                  : (this.msaaSamples = i.getInternalformatParameter(
                      i.RENDERBUFFER,
                      i.RGBA8,
                      i.SAMPLES
                    ));
            }),
            (P.prototype.bind = function (t, e) {
              var i = this.gl;
              if (t) {
                var r =
                  t.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t);
                this.current !== t &&
                  ((this.current = t),
                  i.bindFramebuffer(i.FRAMEBUFFER, r.framebuffer)),
                  r.dirtyId !== t.dirtyId &&
                    ((r.dirtyId = t.dirtyId),
                    r.dirtyFormat !== t.dirtyFormat
                      ? ((r.dirtyFormat = t.dirtyFormat),
                        this.updateFramebuffer(t))
                      : r.dirtySize !== t.dirtySize &&
                        ((r.dirtySize = t.dirtySize),
                        this.resizeFramebuffer(t)));
                for (var n = 0; n < t.colorTextures.length; n++) {
                  var o = t.colorTextures[n];
                  this.renderer.texture.unbind(o.parentTextureArray || o);
                }
                t.depthTexture && this.renderer.texture.unbind(t.depthTexture),
                  e
                    ? this.setViewport(e.x, e.y, e.width, e.height)
                    : this.setViewport(0, 0, t.width, t.height);
              } else
                this.current &&
                  ((this.current = null),
                  i.bindFramebuffer(i.FRAMEBUFFER, null)),
                  e
                    ? this.setViewport(e.x, e.y, e.width, e.height)
                    : this.setViewport(
                        0,
                        0,
                        this.renderer.width,
                        this.renderer.height
                      );
            }),
            (P.prototype.setViewport = function (t, e, i, r) {
              var n = this.viewport;
              (n.width === i && n.height === r && n.x === t && n.y === e) ||
                ((n.x = t),
                (n.y = e),
                (n.width = i),
                (n.height = r),
                this.gl.viewport(t, e, i, r));
            }),
            Object.defineProperty(P.prototype, 'size', {
              get: function () {
                return this.current
                  ? {
                      x: 0,
                      y: 0,
                      width: this.current.width,
                      height: this.current.height,
                    }
                  : {
                      x: 0,
                      y: 0,
                      width: this.renderer.width,
                      height: this.renderer.height,
                    };
              },
              enumerable: !1,
              configurable: !0,
            }),
            (P.prototype.clear = function (t, e, i, r, n) {
              void 0 === n && (n = y.BUFFER_BITS.COLOR | y.BUFFER_BITS.DEPTH);
              var o = this.gl;
              o.clearColor(t, e, i, r), o.clear(n);
            }),
            (P.prototype.initFramebuffer = function (t) {
              var e = this.gl,
                e = new se(e.createFramebuffer());
              return (
                (e.multisample = this.detectSamples(t.multisample)),
                (t.glFramebuffers[this.CONTEXT_UID] = e),
                this.managedFramebuffers.push(t),
                t.disposeRunner.add(this),
                e
              );
            }),
            (P.prototype.resizeFramebuffer = function (t) {
              for (
                var e = this.gl,
                  i = t.glFramebuffers[this.CONTEXT_UID],
                  r =
                    (i.stencil &&
                      (e.bindRenderbuffer(e.RENDERBUFFER, i.stencil),
                      e.renderbufferStorage(
                        e.RENDERBUFFER,
                        e.DEPTH_STENCIL,
                        t.width,
                        t.height
                      )),
                    t.colorTextures),
                  n = 0;
                n < r.length;
                n++
              )
                this.renderer.texture.bind(r[n], 0);
              t.depthTexture && this.renderer.texture.bind(t.depthTexture, 0);
            }),
            (P.prototype.updateFramebuffer = function (t) {
              for (
                var e,
                  i,
                  r,
                  n = this.gl,
                  o = t.glFramebuffers[this.CONTEXT_UID],
                  s = t.colorTextures.length,
                  a =
                    (n.drawBuffers || (s = Math.min(s, 1)),
                    1 < o.multisample &&
                      ((o.msaaBuffer = n.createRenderbuffer()),
                      n.bindRenderbuffer(n.RENDERBUFFER, o.msaaBuffer),
                      n.renderbufferStorageMultisample(
                        n.RENDERBUFFER,
                        o.multisample,
                        n.RGBA8,
                        t.width,
                        t.height
                      ),
                      n.framebufferRenderbuffer(
                        n.FRAMEBUFFER,
                        n.COLOR_ATTACHMENT0,
                        n.RENDERBUFFER,
                        o.msaaBuffer
                      )),
                    []),
                  h = 0;
                h < s;
                h++
              )
                (0 === h && 1 < o.multisample) ||
                  ((i = (e = t.colorTextures[h]).parentTextureArray || e),
                  this.renderer.texture.bind(i, 0),
                  n.framebufferTexture2D(
                    n.FRAMEBUFFER,
                    n.COLOR_ATTACHMENT0 + h,
                    e.target,
                    i._glTextures[this.CONTEXT_UID].texture,
                    0
                  ),
                  a.push(n.COLOR_ATTACHMENT0 + h));
              1 < a.length && n.drawBuffers(a),
                t.depthTexture &&
                  this.writeDepthTexture &&
                  ((r = t.depthTexture),
                  this.renderer.texture.bind(r, 0),
                  n.framebufferTexture2D(
                    n.FRAMEBUFFER,
                    n.DEPTH_ATTACHMENT,
                    n.TEXTURE_2D,
                    r._glTextures[this.CONTEXT_UID].texture,
                    0
                  )),
                o.stencil ||
                  (!t.stencil && !t.depth) ||
                  ((o.stencil = n.createRenderbuffer()),
                  n.bindRenderbuffer(n.RENDERBUFFER, o.stencil),
                  n.renderbufferStorage(
                    n.RENDERBUFFER,
                    n.DEPTH_STENCIL,
                    t.width,
                    t.height
                  ),
                  t.depthTexture ||
                    n.framebufferRenderbuffer(
                      n.FRAMEBUFFER,
                      n.DEPTH_STENCIL_ATTACHMENT,
                      n.RENDERBUFFER,
                      o.stencil
                    ));
            }),
            (P.prototype.detectSamples = function (t) {
              var e = this.msaaSamples,
                i = y.MSAA_QUALITY.NONE;
              if (t <= 1 || null === e) return i;
              for (var r = 0; r < e.length; r++)
                if (e[r] <= t) {
                  i = e[r];
                  break;
                }
              return (i = 1 === i ? y.MSAA_QUALITY.NONE : i);
            }),
            (P.prototype.blit = function (t, e, i) {
              var r = this.current,
                n = this.renderer,
                o = this.gl,
                s = this.CONTEXT_UID;
              if (2 === n.context.webGLVersion && r) {
                n = r.glFramebuffers[s];
                if (n) {
                  if (!t) {
                    if (n.multisample <= 1) return;
                    n.blitFramebuffer ||
                      ((n.blitFramebuffer = new yt(r.width, r.height)),
                      n.blitFramebuffer.addColorTexture(0, r.colorTextures[0])),
                      ((t = n.blitFramebuffer).width = r.width),
                      (t.height = r.height);
                  }
                  e || (((e = ae).width = r.width), (e.height = r.height));
                  s = e.width === (i = i || e).width && e.height === i.height;
                  this.bind(t),
                    o.bindFramebuffer(o.READ_FRAMEBUFFER, n.framebuffer),
                    o.blitFramebuffer(
                      e.x,
                      e.y,
                      e.width,
                      e.height,
                      i.x,
                      i.y,
                      i.width,
                      i.height,
                      o.COLOR_BUFFER_BIT,
                      s ? o.NEAREST : o.LINEAR
                    );
                }
              }
            }),
            (P.prototype.disposeFramebuffer = function (t, e) {
              var i,
                r = t.glFramebuffers[this.CONTEXT_UID],
                n = this.gl;
              r &&
                (delete t.glFramebuffers[this.CONTEXT_UID],
                0 <= (i = this.managedFramebuffers.indexOf(t)) &&
                  this.managedFramebuffers.splice(i, 1),
                t.disposeRunner.remove(this),
                e ||
                  (n.deleteFramebuffer(r.framebuffer),
                  r.stencil && n.deleteRenderbuffer(r.stencil)));
            }),
            (P.prototype.disposeAll = function (t) {
              var e = this.managedFramebuffers;
              this.managedFramebuffers = [];
              for (var i = 0; i < e.length; i++)
                this.disposeFramebuffer(e[i], t);
            }),
            (P.prototype.forceStencil = function () {
              var t,
                e,
                i,
                r,
                n = this.current;
              !n ||
                ((t = n.glFramebuffers[this.CONTEXT_UID]) &&
                  !t.stencil &&
                  (n.enableStencil(),
                  (e = n.width),
                  (n = n.height),
                  (r = (i = this.gl).createRenderbuffer()),
                  i.bindRenderbuffer(i.RENDERBUFFER, r),
                  i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, e, n),
                  (t.stencil = r),
                  i.framebufferRenderbuffer(
                    i.FRAMEBUFFER,
                    i.DEPTH_STENCIL_ATTACHMENT,
                    i.RENDERBUFFER,
                    r
                  )));
            }),
            (P.prototype.reset = function () {
              (this.current = this.unknownFramebuffer),
                (this.viewport = new h.Rectangle());
            }),
            P);
        function P(t) {
          t = oe.call(this, t) || this;
          return (
            (t.managedFramebuffers = []),
            (t.unknownFramebuffer = new yt(10, 10)),
            (t.msaaSamples = null),
            t
          );
        }
        var ue,
          le = function (t) {
            (this.buffer = t || null),
              (this.updateID = -1),
              (this.byteLength = -1),
              (this.refCount = 0);
          },
          ce = { 5126: 4, 5123: 2, 5121: 1 },
          de =
            (a(S, (ue = o)),
            (S.prototype.contextChange = function () {
              this.disposeAll(!0);
              var e,
                o,
                t = (this.gl = this.renderer.gl),
                i = this.renderer.context;
              (this.CONTEXT_UID = this.renderer.CONTEXT_UID),
                2 !== i.webGLVersion &&
                  ((e = this.renderer.context.extensions.vertexArrayObject),
                  (e = m.settings.PREFER_ENV === y.ENV.WEBGL_LEGACY ? null : e)
                    ? ((t.createVertexArray = function () {
                        return e.createVertexArrayOES();
                      }),
                      (t.bindVertexArray = function (t) {
                        return e.bindVertexArrayOES(t);
                      }),
                      (t.deleteVertexArray = function (t) {
                        return e.deleteVertexArrayOES(t);
                      }))
                    : ((this.hasVao = !1),
                      (t.createVertexArray = function () {
                        return null;
                      }),
                      (t.bindVertexArray = function () {
                        return null;
                      }),
                      (t.deleteVertexArray = function () {
                        return null;
                      }))),
                2 !== i.webGLVersion &&
                  ((o = t.getExtension('ANGLE_instanced_arrays'))
                    ? ((t.vertexAttribDivisor = function (t, e) {
                        return o.vertexAttribDivisorANGLE(t, e);
                      }),
                      (t.drawElementsInstanced = function (t, e, i, r, n) {
                        return o.drawElementsInstancedANGLE(t, e, i, r, n);
                      }),
                      (t.drawArraysInstanced = function (t, e, i, r) {
                        return o.drawArraysInstancedANGLE(t, e, i, r);
                      }))
                    : (this.hasInstance = !1)),
                (this.canUseUInt32ElementIndex =
                  2 === i.webGLVersion || !!i.extensions.uint32ElementIndex);
            }),
            (S.prototype.bind = function (t, e) {
              e = e || this.renderer.shader.shader;
              var i = this.gl,
                r = t.glVertexArrayObjects[this.CONTEXT_UID],
                n = !1,
                r =
                  (r ||
                    ((this.managedGeometries[t.id] = t).disposeRunner.add(this),
                    (t.glVertexArrayObjects[this.CONTEXT_UID] = r = {}),
                    (n = !0)),
                  r[e.program.id] || this.initGeometryVao(t, e.program, n));
              (this._activeGeometry = t),
                this._activeVao !== r &&
                  ((this._activeVao = r),
                  this.hasVao
                    ? i.bindVertexArray(r)
                    : this.activateVao(t, e.program)),
                this.updateBuffers();
            }),
            (S.prototype.reset = function () {
              this.unbind();
            }),
            (S.prototype.updateBuffers = function () {
              for (
                var t = this._activeGeometry, e = this.gl, i = 0;
                i < t.buffers.length;
                i++
              ) {
                var r,
                  n,
                  o = t.buffers[i],
                  s = o._glBuffers[this.CONTEXT_UID];
                o._updateID !== s.updateID &&
                  ((s.updateID = o._updateID),
                  (r = o.index ? e.ELEMENT_ARRAY_BUFFER : e.ARRAY_BUFFER),
                  e.bindBuffer(r, s.buffer),
                  (this._boundBuffer = s).byteLength >= o.data.byteLength
                    ? e.bufferSubData(r, 0, o.data)
                    : ((n = o.static ? e.STATIC_DRAW : e.DYNAMIC_DRAW),
                      (s.byteLength = o.data.byteLength),
                      e.bufferData(r, o.data, n)));
              }
            }),
            (S.prototype.checkCompatibility = function (t, e) {
              var i,
                r = t.attributes;
              for (i in e.attributeData)
                if (!r[i])
                  throw new Error(
                    'shader and geometry incompatible, geometry missing the "' +
                      i +
                      '" attribute'
                  );
            }),
            (S.prototype.getSignature = function (t, e) {
              var i,
                r = t.attributes,
                n = e.attributeData,
                o = ['g', t.id];
              for (i in r) n[i] && o.push(i);
              return o.join('-');
            }),
            (S.prototype.initGeometryVao = function (t, e, i) {
              void 0 === i && (i = !0), this.checkCompatibility(t, e);
              var r = this.gl,
                n = this.CONTEXT_UID,
                o = this.getSignature(t, e),
                s = t.glVertexArrayObjects[this.CONTEXT_UID],
                a = s[o];
              if (a) return (s[e.id] = a);
              var h,
                u = t.buffers,
                l = t.attributes,
                c = {},
                d = {};
              for (h in u) (c[h] = 0), (d[h] = 0);
              for (h in l)
                !l[h].size && e.attributeData[h]
                  ? (l[h].size = e.attributeData[h].size)
                  : l[h].size ||
                    console.warn(
                      "PIXI Geometry attribute '" +
                        h +
                        "' size cannot be determined (likely the bound shader does not have the attribute)"
                    ),
                  (c[l[h].buffer] += l[h].size * ce[l[h].type]);
              for (h in l) {
                var p = l[h],
                  f = p.size;
                void 0 === p.stride &&
                  (c[p.buffer] === f * ce[p.type]
                    ? (p.stride = 0)
                    : (p.stride = c[p.buffer])),
                  void 0 === p.start &&
                    ((p.start = d[p.buffer]), (d[p.buffer] += f * ce[p.type]));
              }
              (a = r.createVertexArray()), r.bindVertexArray(a);
              for (var m = 0; m < u.length; m++) {
                var y = u[m];
                y._glBuffers[n] ||
                  ((y._glBuffers[n] = new le(r.createBuffer())),
                  (this.managedBuffers[y.id] = y).disposeRunner.add(this)),
                  i && y._glBuffers[n].refCount++;
              }
              return (
                this.activateVao(t, e),
                (this._activeVao = a),
                (s[e.id] = a),
                (s[o] = a)
              );
            }),
            (S.prototype.disposeBuffer = function (t, e) {
              var i, r;
              this.managedBuffers[t.id] &&
                (delete this.managedBuffers[t.id],
                (i = t._glBuffers[this.CONTEXT_UID]),
                (r = this.gl),
                t.disposeRunner.remove(this),
                i &&
                  (e || r.deleteBuffer(i.buffer),
                  delete t._glBuffers[this.CONTEXT_UID]));
            }),
            (S.prototype.disposeGeometry = function (t, e) {
              if (this.managedGeometries[t.id]) {
                delete this.managedGeometries[t.id];
                var i = t.glVertexArrayObjects[this.CONTEXT_UID],
                  r = this.gl,
                  n = t.buffers;
                if ((t.disposeRunner.remove(this), i)) {
                  for (var o = 0; o < n.length; o++) {
                    var s = n[o]._glBuffers[this.CONTEXT_UID];
                    s.refCount--,
                      0 !== s.refCount || e || this.disposeBuffer(n[o], e);
                  }
                  if (!e)
                    for (var a in i)
                      'g' === a[0] &&
                        ((a = i[a]),
                        this._activeVao === a && this.unbind(),
                        r.deleteVertexArray(a));
                  delete t.glVertexArrayObjects[this.CONTEXT_UID];
                }
              }
            }),
            (S.prototype.disposeAll = function (t) {
              for (
                var e = Object.keys(this.managedGeometries), i = 0;
                i < e.length;
                i++
              )
                this.disposeGeometry(this.managedGeometries[e[i]], t);
              for (
                e = Object.keys(this.managedBuffers), i = 0;
                i < e.length;
                i++
              )
                this.disposeBuffer(this.managedBuffers[e[i]], t);
            }),
            (S.prototype.activateVao = function (t, e) {
              var i,
                r = this.gl,
                n = this.CONTEXT_UID,
                o = t.buffers,
                s = t.attributes,
                a =
                  (t.indexBuffer &&
                    r.bindBuffer(
                      r.ELEMENT_ARRAY_BUFFER,
                      t.indexBuffer._glBuffers[n].buffer
                    ),
                  null);
              for (i in s) {
                var h = s[i],
                  u = o[h.buffer]._glBuffers[n];
                if (e.attributeData[i]) {
                  a !== u && (r.bindBuffer(r.ARRAY_BUFFER, u.buffer), (a = u));
                  u = e.attributeData[i].location;
                  if (
                    (r.enableVertexAttribArray(u),
                    r.vertexAttribPointer(
                      u,
                      h.size,
                      h.type || r.FLOAT,
                      h.normalized,
                      h.stride,
                      h.start
                    ),
                    h.instance)
                  ) {
                    if (!this.hasInstance)
                      throw new Error(
                        'geometry error, GPU Instancing is not supported on this device'
                      );
                    r.vertexAttribDivisor(u, 1);
                  }
                }
              }
            }),
            (S.prototype.draw = function (t, e, i, r) {
              var n,
                o,
                s = this.gl,
                a = this._activeGeometry;
              return (
                a.indexBuffer
                  ? ((o =
                      2 === (n = a.indexBuffer.data.BYTES_PER_ELEMENT)
                        ? s.UNSIGNED_SHORT
                        : s.UNSIGNED_INT),
                    2 === n || (4 === n && this.canUseUInt32ElementIndex)
                      ? a.instanced
                        ? s.drawElementsInstanced(
                            t,
                            e || a.indexBuffer.data.length,
                            o,
                            (i || 0) * n,
                            r || 1
                          )
                        : s.drawElements(
                            t,
                            e || a.indexBuffer.data.length,
                            o,
                            (i || 0) * n
                          )
                      : console.warn('unsupported index buffer type: uint32'))
                  : a.instanced
                  ? s.drawArraysInstanced(t, i, e || a.getSize(), r || 1)
                  : s.drawArrays(t, i, e || a.getSize()),
                this
              );
            }),
            (S.prototype.unbind = function () {
              this.gl.bindVertexArray(null),
                (this._activeVao = null),
                (this._activeGeometry = null);
            }),
            S);
        function S(t) {
          t = ue.call(this, t) || this;
          return (
            (t._activeGeometry = null),
            (t._activeVao = null),
            (t.hasVao = !0),
            (t.hasInstance = !0),
            (t.canUseUInt32ElementIndex = !1),
            (t.managedGeometries = {}),
            (t.managedBuffers = {}),
            t
          );
        }
        (fe.prototype.reset = function () {
          this.pooled &&
            ((this.maskObject = null),
            (this.type = y.MASK_TYPES.NONE),
            (this.autoDetect = !0)),
            (this._target = null);
        }),
          (fe.prototype.copyCountersOrReset = function (t) {
            t
              ? ((this._stencilCounter = t._stencilCounter),
                (this._scissorCounter = t._scissorCounter),
                (this._scissorRect = t._scissorRect))
              : ((this._stencilCounter = 0),
                (this._scissorCounter = 0),
                (this._scissorRect = null));
          });
        var pe = fe;
        function fe(t) {
          void 0 === t && (t = null),
            (this.type = y.MASK_TYPES.NONE),
            (this.autoDetect = !0),
            (this.maskObject = t || null),
            (this.pooled = !1),
            (this.isMaskData = !0),
            (this._stencilCounter = 0),
            (this._scissorCounter = 0),
            (this._scissorRect = null),
            (this._target = null);
        }
        function me(t, e, i) {
          e = t.createShader(e);
          return t.shaderSource(e, i), t.compileShader(e), e;
        }
        function ye(t, e, i, r) {
          var n = me(t, t.VERTEX_SHADER, e),
            o = me(t, t.FRAGMENT_SHADER, i),
            s = t.createProgram();
          if ((t.attachShader(s, n), t.attachShader(s, o), r))
            for (var a in r) t.bindAttribLocation(s, r[a], a);
          return (
            t.linkProgram(s),
            t.getProgramParameter(s, t.LINK_STATUS) ||
              (t.getShaderParameter(n, t.COMPILE_STATUS) ||
                (console.warn(e), console.error(t.getShaderInfoLog(n))),
              t.getShaderParameter(o, t.COMPILE_STATUS) ||
                (console.warn(i), console.error(t.getShaderInfoLog(o))),
              console.error('Pixi.js Error: Could not initialize shader.'),
              console.error(
                'gl.VALIDATE_STATUS',
                t.getProgramParameter(s, t.VALIDATE_STATUS)
              ),
              console.error('gl.getError()', t.getError()),
              '' !== t.getProgramInfoLog(s) &&
                console.warn(
                  'Pixi.js Warning: gl.getProgramInfoLog()',
                  t.getProgramInfoLog(s)
                ),
              t.deleteProgram(s),
              (s = null)),
            t.deleteShader(n),
            t.deleteShader(o),
            s
          );
        }
        function ge(t) {
          for (var e = new Array(t), i = 0; i < e.length; i++) e[i] = !1;
          return e;
        }
        function ve(t, e) {
          switch (t) {
            case 'float':
              return 0;
            case 'vec2':
              return new Float32Array(2 * e);
            case 'vec3':
              return new Float32Array(3 * e);
            case 'vec4':
              return new Float32Array(4 * e);
            case 'int':
            case 'sampler2D':
            case 'sampler2DArray':
              return 0;
            case 'ivec2':
              return new Int32Array(2 * e);
            case 'ivec3':
              return new Int32Array(3 * e);
            case 'ivec4':
              return new Int32Array(4 * e);
            case 'bool':
              return !1;
            case 'bvec2':
              return ge(2 * e);
            case 'bvec3':
              return ge(3 * e);
            case 'bvec4':
              return ge(4 * e);
            case 'mat2':
              return new Float32Array([1, 0, 0, 1]);
            case 'mat3':
              return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            case 'mat4':
              return new Float32Array([
                1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
              ]);
          }
          return null;
        }
        var _e,
          xe = {},
          be = xe;
        function Te() {
          var t, e;
          return (
            (be === xe || (be && be.isContextLost())) &&
              ((t = document.createElement('canvas')),
              (e = void 0),
              (e =
                m.settings.PREFER_ENV >= y.ENV.WEBGL2
                  ? t.getContext('webgl2', {})
                  : e) ||
                ((e =
                  t.getContext('webgl', {}) ||
                  t.getContext('experimental-webgl', {}))
                  ? e.getExtension('WEBGL_draw_buffers')
                  : (e = null)),
              (be = e)),
            be
          );
        }
        function Ee(t, e, i) {
          return 'precision' !== t.substring(0, 9)
            ? 'precision ' +
                (e === y.PRECISION.HIGH && i !== y.PRECISION.HIGH
                  ? y.PRECISION.MEDIUM
                  : e) +
                ' float;\n' +
                t
            : i !== y.PRECISION.HIGH && 'precision highp' === t.substring(0, 15)
            ? t.replace('precision highp', 'precision mediump')
            : t;
        }
        var we = {
          float: 1,
          vec2: 2,
          vec3: 3,
          vec4: 4,
          int: 1,
          ivec2: 2,
          ivec3: 3,
          ivec4: 4,
          bool: 1,
          bvec2: 2,
          bvec3: 3,
          bvec4: 4,
          mat2: 4,
          mat3: 9,
          mat4: 16,
          sampler2D: 1,
        };
        var Pe = null,
          Se = {
            FLOAT: 'float',
            FLOAT_VEC2: 'vec2',
            FLOAT_VEC3: 'vec3',
            FLOAT_VEC4: 'vec4',
            INT: 'int',
            INT_VEC2: 'ivec2',
            INT_VEC3: 'ivec3',
            INT_VEC4: 'ivec4',
            BOOL: 'bool',
            BOOL_VEC2: 'bvec2',
            BOOL_VEC3: 'bvec3',
            BOOL_VEC4: 'bvec4',
            FLOAT_MAT2: 'mat2',
            FLOAT_MAT3: 'mat3',
            FLOAT_MAT4: 'mat4',
            SAMPLER_2D: 'sampler2D',
            INT_SAMPLER_2D: 'sampler2D',
            UNSIGNED_INT_SAMPLER_2D: 'sampler2D',
            SAMPLER_CUBE: 'samplerCube',
            INT_SAMPLER_CUBE: 'samplerCube',
            UNSIGNED_INT_SAMPLER_CUBE: 'samplerCube',
            SAMPLER_2D_ARRAY: 'sampler2DArray',
            INT_SAMPLER_2D_ARRAY: 'sampler2DArray',
            UNSIGNED_INT_SAMPLER_2D_ARRAY: 'sampler2DArray',
          };
        function Oe(t, e) {
          if (!Pe) {
            var i = Object.keys(Se);
            Pe = {};
            for (var r = 0; r < i.length; ++r) {
              var n = i[r];
              Pe[t[n]] = Se[n];
            }
          }
          return Pe[e];
        }
        var Ie = [
            {
              test: function (t) {
                return 'float' === t.type && 1 === t.size;
              },
              code: function (t) {
                return (
                  '\n            if(uv["' +
                  t +
                  '"] !== ud["' +
                  t +
                  '"].value)\n            {\n                ud["' +
                  t +
                  '"].value = uv["' +
                  t +
                  '"]\n                gl.uniform1f(ud["' +
                  t +
                  '"].location, uv["' +
                  t +
                  '"])\n            }\n            '
                );
              },
            },
            {
              test: function (t) {
                return (
                  ('sampler2D' === t.type ||
                    'samplerCube' === t.type ||
                    'sampler2DArray' === t.type) &&
                  1 === t.size &&
                  !t.isArray
                );
              },
              code: function (t) {
                return (
                  't = syncData.textureCount++;\n\n            renderer.texture.bind(uv["' +
                  t +
                  '"], t);\n\n            if(ud["' +
                  t +
                  '"].value !== t)\n            {\n                ud["' +
                  t +
                  '"].value = t;\n                gl.uniform1i(ud["' +
                  t +
                  '"].location, t);\n; // eslint-disable-line max-len\n            }'
                );
              },
            },
            {
              test: function (t, e) {
                return 'mat3' === t.type && 1 === t.size && void 0 !== e.a;
              },
              code: function (t) {
                return (
                  '\n            gl.uniformMatrix3fv(ud["' +
                  t +
                  '"].location, false, uv["' +
                  t +
                  '"].toArray(true));\n            '
                );
              },
            },
            {
              test: function (t, e) {
                return 'vec2' === t.type && 1 === t.size && void 0 !== e.x;
              },
              code: function (t) {
                return (
                  '\n                cv = ud["' +
                  t +
                  '"].value;\n                v = uv["' +
                  t +
                  '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud["' +
                  t +
                  '"].location, v.x, v.y);\n                }'
                );
              },
            },
            {
              test: function (t) {
                return 'vec2' === t.type && 1 === t.size;
              },
              code: function (t) {
                return (
                  '\n                cv = ud["' +
                  t +
                  '"].value;\n                v = uv["' +
                  t +
                  '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud["' +
                  t +
                  '"].location, v[0], v[1]);\n                }\n            '
                );
              },
            },
            {
              test: function (t, e) {
                return 'vec4' === t.type && 1 === t.size && void 0 !== e.width;
              },
              code: function (t) {
                return (
                  '\n                cv = ud["' +
                  t +
                  '"].value;\n                v = uv["' +
                  t +
                  '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud["' +
                  t +
                  '"].location, v.x, v.y, v.width, v.height)\n                }'
                );
              },
            },
            {
              test: function (t) {
                return 'vec4' === t.type && 1 === t.size;
              },
              code: function (t) {
                return (
                  '\n                cv = ud["' +
                  t +
                  '"].value;\n                v = uv["' +
                  t +
                  '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud["' +
                  t +
                  '"].location, v[0], v[1], v[2], v[3])\n                }'
                );
              },
            },
          ],
          Ae = {
            float:
              '\n    if(cv !== v)\n    {\n        cv.v = v;\n        gl.uniform1f(location, v)\n    }',
            vec2: '\n    if(cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        gl.uniform2f(location, v[0], v[1])\n    }',
            vec3: '\n    if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }',
            vec4: 'gl.uniform4f(location, v[0], v[1], v[2], v[3])',
            int: 'gl.uniform1i(location, v)',
            ivec2: 'gl.uniform2i(location, v[0], v[1])',
            ivec3: 'gl.uniform3i(location, v[0], v[1], v[2])',
            ivec4: 'gl.uniform4i(location, v[0], v[1], v[2], v[3])',
            bool: 'gl.uniform1i(location, v)',
            bvec2: 'gl.uniform2i(location, v[0], v[1])',
            bvec3: 'gl.uniform3i(location, v[0], v[1], v[2])',
            bvec4: 'gl.uniform4i(location, v[0], v[1], v[2], v[3])',
            mat2: 'gl.uniformMatrix2fv(location, false, v)',
            mat3: 'gl.uniformMatrix3fv(location, false, v)',
            mat4: 'gl.uniformMatrix4fv(location, false, v)',
            sampler2D: 'gl.uniform1i(location, v)',
            samplerCube: 'gl.uniform1i(location, v)',
            sampler2DArray: 'gl.uniform1i(location, v)',
          },
          Me = {
            float: 'gl.uniform1fv(location, v)',
            vec2: 'gl.uniform2fv(location, v)',
            vec3: 'gl.uniform3fv(location, v)',
            vec4: 'gl.uniform4fv(location, v)',
            mat4: 'gl.uniformMatrix4fv(location, false, v)',
            mat3: 'gl.uniformMatrix3fv(location, false, v)',
            mat2: 'gl.uniformMatrix2fv(location, false, v)',
            int: 'gl.uniform1iv(location, v)',
            ivec2: 'gl.uniform2iv(location, v)',
            ivec3: 'gl.uniform3iv(location, v)',
            ivec4: 'gl.uniform4iv(location, v)',
            bool: 'gl.uniform1iv(location, v)',
            bvec2: 'gl.uniform2iv(location, v)',
            bvec3: 'gl.uniform3iv(location, v)',
            bvec4: 'gl.uniform4iv(location, v)',
            sampler2D: 'gl.uniform1iv(location, v)',
            samplerCube: 'gl.uniform1iv(location, v)',
            sampler2DArray: 'gl.uniform1iv(location, v)',
          };
        var De,
          Ce = [
            'precision mediump float;',
            'void main(void){',
            'float test = 0.1;',
            '%forloop%',
            'gl_FragColor = vec4(0.0);',
            '}',
          ].join('\n');
        function Re(t, e) {
          if (0 === t)
            throw new Error(
              'Invalid value of `0` passed to `checkMaxIfStatementsInShader`'
            );
          for (var i = e.createShader(e.FRAGMENT_SHADER); ; ) {
            var r = Ce.replace(
              /%forloop%/gi,
              (function (t) {
                for (var e = '', i = 0; i < t; ++i)
                  0 < i && (e += '\nelse '),
                    i < t - 1 && (e += 'if(test == ' + i + '.0){}');
                return e;
              })(t)
            );
            if (
              (e.shaderSource(i, r),
              e.compileShader(i),
              e.getShaderParameter(i, e.COMPILE_STATUS))
            )
              break;
            t = (t / 2) | 0;
          }
          return t;
        }
        var Le = 0,
          Ne = {},
          Fe =
            ((O.prototype.extractData = function (t, e) {
              var i = Te();
              i
                ? ((t = ye(i, t, e)),
                  (this.attributeData = this.getAttributeData(t, i)),
                  (this.uniformData = this.getUniformData(t, i)),
                  i.deleteProgram(t))
                : ((this.uniformData = {}), (this.attributeData = {}));
            }),
            (O.prototype.getAttributeData = function (t, e) {
              for (
                var i = {},
                  r = [],
                  n = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES),
                  o = 0;
                o < n;
                o++
              ) {
                var s = e.getActiveAttrib(t, o),
                  a = Oe(e, s.type),
                  a = { type: a, name: s.name, size: we[a], location: 0 };
                (i[s.name] = a), r.push(a);
              }
              r.sort(function (t, e) {
                return t.name > e.name ? 1 : -1;
              });
              for (o = 0; o < r.length; o++) r[o].location = o;
              return i;
            }),
            (O.prototype.getUniformData = function (t, e) {
              for (
                var i = {},
                  r = e.getProgramParameter(t, e.ACTIVE_UNIFORMS),
                  n = 0;
                n < r;
                n++
              ) {
                var o = e.getActiveUniform(t, n),
                  s = o.name.replace(/\[.*?\]$/, ''),
                  a = o.name.match(/\[.*?\]$/),
                  h = Oe(e, o.type);
                i[s] = {
                  type: h,
                  size: o.size,
                  isArray: a,
                  value: ve(h, o.size),
                };
              }
              return i;
            }),
            Object.defineProperty(O, 'defaultVertexSrc', {
              get: function () {
                return 'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n';
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(O, 'defaultFragmentSrc', {
              get: function () {
                return 'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}';
              },
              enumerable: !1,
              configurable: !0,
            }),
            (O.from = function (t, e, i) {
              var r = t + e,
                n = g.ProgramCache[r];
              return n || (g.ProgramCache[r] = n = new O(t, e, i)), n;
            }),
            O);
        function O(t, e, i) {
          void 0 === i && (i = 'pixi-shader'),
            (this.id = Le++),
            (this.vertexSrc = t || O.defaultVertexSrc),
            (this.fragmentSrc = e || O.defaultFragmentSrc),
            (this.vertexSrc = this.vertexSrc.trim()),
            (this.fragmentSrc = this.fragmentSrc.trim()),
            '#version' !== this.vertexSrc.substring(0, 8) &&
              ((i = i.replace(/\s+/g, '-')),
              Ne[i] ? (Ne[i]++, (i += '-' + Ne[i])) : (Ne[i] = 1),
              (this.vertexSrc =
                '#define SHADER_NAME ' + i + '\n' + this.vertexSrc),
              (this.fragmentSrc =
                '#define SHADER_NAME ' + i + '\n' + this.fragmentSrc),
              (this.vertexSrc = Ee(
                this.vertexSrc,
                m.settings.PRECISION_VERTEX,
                y.PRECISION.HIGH
              )),
              (this.fragmentSrc = Ee(
                this.fragmentSrc,
                m.settings.PRECISION_FRAGMENT,
                (_e ||
                  ((_e = y.PRECISION.MEDIUM),
                  (t = Te()) &&
                    t.getShaderPrecisionFormat &&
                    ((t = t.getShaderPrecisionFormat(
                      t.FRAGMENT_SHADER,
                      t.HIGH_FLOAT
                    )),
                    (_e = t.precision
                      ? y.PRECISION.HIGH
                      : y.PRECISION.MEDIUM))),
                _e)
              ))),
            this.extractData(this.vertexSrc, this.fragmentSrc),
            (this.glPrograms = {}),
            (this.syncUniforms = null);
        }
        (Ue.prototype.checkUniformExists = function (t, e) {
          if (e.uniforms[t]) return !0;
          for (var i in e.uniforms) {
            i = e.uniforms[i];
            if (i.group && this.checkUniformExists(t, i)) return !0;
          }
          return !1;
        }),
          (Ue.prototype.destroy = function () {
            this.uniformGroup = null;
          }),
          Object.defineProperty(Ue.prototype, 'uniforms', {
            get: function () {
              return this.uniformGroup.uniforms;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (Ue.from = function (t, e, i) {
            return new Ue(Fe.from(t, e), i);
          });
        var Be = Ue;
        function Ue(t, e) {
          for (var i in ((this.program = t),
          (this.uniformGroup = e
            ? e instanceof Yt
              ? e
              : new Yt(e)
            : new Yt({})),
          t.uniformData))
            this.uniformGroup.uniforms[i] instanceof Array &&
              (this.uniformGroup.uniforms[i] = new Float32Array(
                this.uniformGroup.uniforms[i]
              ));
        }
        Object.defineProperty(I.prototype, 'blend', {
          get: function () {
            return !!(1 & this.data);
          },
          set: function (t) {
            !!(1 & this.data) !== t && (this.data ^= 1);
          },
          enumerable: !1,
          configurable: !0,
        }),
          Object.defineProperty(I.prototype, 'offsets', {
            get: function () {
              return !!(2 & this.data);
            },
            set: function (t) {
              !!(2 & this.data) !== t && (this.data ^= 2);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(I.prototype, 'culling', {
            get: function () {
              return !!(4 & this.data);
            },
            set: function (t) {
              !!(4 & this.data) !== t && (this.data ^= 4);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(I.prototype, 'depthTest', {
            get: function () {
              return !!(8 & this.data);
            },
            set: function (t) {
              !!(8 & this.data) !== t && (this.data ^= 8);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(I.prototype, 'clockwiseFrontFace', {
            get: function () {
              return !!(16 & this.data);
            },
            set: function (t) {
              !!(16 & this.data) !== t && (this.data ^= 16);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(I.prototype, 'blendMode', {
            get: function () {
              return this._blendMode;
            },
            set: function (t) {
              (this.blend = t !== y.BLEND_MODES.NONE), (this._blendMode = t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(I.prototype, 'polygonOffset', {
            get: function () {
              return this._polygonOffset;
            },
            set: function (t) {
              (this.offsets = !!t), (this._polygonOffset = t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          (I.for2d = function () {
            var t = new I();
            return (t.depthTest = !1), (t.blend = !0), t;
          });
        var je = I;
        function I() {
          (this.data = 0),
            (this.blendMode = y.BLEND_MODES.NORMAL),
            (this.polygonOffset = 0),
            (this.blend = !0);
        }
        a(Xe, (ke = Be)),
          (Xe.prototype.apply = function (t, e, i, r, n) {
            t.applyFilter(this, e, i, r);
          }),
          Object.defineProperty(Xe.prototype, 'blendMode', {
            get: function () {
              return this.state.blendMode;
            },
            set: function (t) {
              this.state.blendMode = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(Xe, 'defaultVertexSrc', {
            get: function () {
              return 'attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n';
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(Xe, 'defaultFragmentSrc', {
            get: function () {
              return 'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n';
            },
            enumerable: !1,
            configurable: !0,
          });
        var ke,
          ht = Xe;
        function Xe(t, e, i) {
          var r = this,
            t = Fe.from(t || Xe.defaultVertexSrc, e || Xe.defaultFragmentSrc);
          return (
            ((r = ke.call(this, t, i) || this).padding = 0),
            (r.resolution = m.settings.FILTER_RESOLUTION),
            (r.enabled = !0),
            (r.autoFit = !0),
            (r.legacy = !!r.program.attributeData.aTextureCoord),
            (r.state = new je()),
            r
          );
        }
        var Ge = new h.Matrix(),
          He =
            (Object.defineProperty(ze.prototype, 'texture', {
              get: function () {
                return this._texture;
              },
              set: function (t) {
                (this._texture = t), (this._textureID = -1);
              },
              enumerable: !1,
              configurable: !0,
            }),
            (ze.prototype.multiplyUvs = function (t, e) {
              void 0 === e && (e = t);
              for (var i = this.mapCoord, r = 0; r < t.length; r += 2) {
                var n = t[r],
                  o = t[r + 1];
                (e[r] = n * i.a + o * i.c + i.tx),
                  (e[r + 1] = n * i.b + o * i.d + i.ty);
              }
              return e;
            }),
            (ze.prototype.update = function (t) {
              var e = this._texture;
              if (!e || !e.valid) return !1;
              if (!t && this._textureID === e._updateID) return !1;
              (this._textureID = e._updateID), this._updateID++;
              var t = e._uvs,
                t =
                  (this.mapCoord.set(
                    t.x1 - t.x0,
                    t.y1 - t.y0,
                    t.x3 - t.x0,
                    t.y3 - t.y0,
                    t.x0,
                    t.y0
                  ),
                  e.orig),
                i = e.trim,
                t =
                  (i &&
                    (Ge.set(
                      t.width / i.width,
                      0,
                      0,
                      t.height / i.height,
                      -i.x / i.width,
                      -i.y / i.height
                    ),
                    this.mapCoord.append(Ge)),
                  e.baseTexture),
                i = this.uClampFrame,
                r = this.clampMargin / t.resolution,
                n = this.clampOffset;
              return (
                (i[0] = (e._frame.x + r + n) / t.width),
                (i[1] = (e._frame.y + r + n) / t.height),
                (i[2] = (e._frame.x + e._frame.width - r + n) / t.width),
                (i[3] = (e._frame.y + e._frame.height - r + n) / t.height),
                (this.uClampOffset[0] = n / t.realWidth),
                (this.uClampOffset[1] = n / t.realHeight),
                (this.isSimple =
                  e._frame.width === t.width &&
                  e._frame.height === t.height &&
                  0 === e.rotate),
                !0
              );
            }),
            ze);
        function ze(t, e) {
          (this._texture = t),
            (this.mapCoord = new h.Matrix()),
            (this.uClampFrame = new Float32Array(4)),
            (this.uClampOffset = new Float32Array(2)),
            (this._textureID = -1),
            (this._updateID = 0),
            (this.clampOffset = 0),
            (this.clampMargin = void 0 === e ? 0.5 : e),
            (this.isSimple = !1);
        }
        a(We, (Ye = ht)),
          (We.prototype.apply = function (t, e, i, r) {
            var n = this.maskSprite,
              o = n._texture;
            o.valid &&
              (o.uvMatrix || (o.uvMatrix = new He(o, 0)),
              o.uvMatrix.update(),
              (this.uniforms.npmAlpha = o.baseTexture.alphaMode ? 0 : 1),
              (this.uniforms.mask = o),
              (this.uniforms.otherMatrix = t
                .calculateSpriteMatrix(this.maskMatrix, n)
                .prepend(o.uvMatrix.mapCoord)),
              (this.uniforms.alpha = n.worldAlpha),
              (this.uniforms.maskClamp = o.uvMatrix.uClampFrame),
              t.applyFilter(this, e, i, r));
          });
        var Ye,
          Ve = We;
        function We(t) {
          var e = this,
            i = new h.Matrix(),
            e =
              Ye.call(
                this,
                'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n',
                'varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n'
              ) || this;
          return (t.renderable = !1), (e.maskSprite = t), (e.maskMatrix = i), e;
        }
        a(Ze, (qe = o)),
          (Ze.prototype.setMaskStack = function (t) {
            (this.maskStack = t),
              this.renderer.scissor.setMaskStack(t),
              this.renderer.stencil.setMaskStack(t);
          }),
          (Ze.prototype.push = function (t, e) {
            var i,
              r = e;
            switch (
              (r.isMaskData ||
                (((i = this.maskDataPool.pop() || new pe()).pooled = !0),
                (i.maskObject = e),
                (r = i)),
              r.autoDetect && this.detect(r),
              r.copyCountersOrReset(this.maskStack[this.maskStack.length - 1]),
              (r._target = t),
              r.type)
            ) {
              case y.MASK_TYPES.SCISSOR:
                this.maskStack.push(r), this.renderer.scissor.push(r);
                break;
              case y.MASK_TYPES.STENCIL:
                this.maskStack.push(r), this.renderer.stencil.push(r);
                break;
              case y.MASK_TYPES.SPRITE:
                r.copyCountersOrReset(null),
                  this.pushSpriteMask(r),
                  this.maskStack.push(r);
            }
          }),
          (Ze.prototype.pop = function (t) {
            var e = this.maskStack.pop();
            if (e && e._target === t) {
              switch (e.type) {
                case y.MASK_TYPES.SCISSOR:
                  this.renderer.scissor.pop();
                  break;
                case y.MASK_TYPES.STENCIL:
                  this.renderer.stencil.pop(e.maskObject);
                  break;
                case y.MASK_TYPES.SPRITE:
                  this.popSpriteMask();
              }
              e.reset(), e.pooled && this.maskDataPool.push(e);
            }
          }),
          (Ze.prototype.detect = function (t) {
            var e,
              i = t.maskObject;
            i.isSprite
              ? (t.type = y.MASK_TYPES.SPRITE)
              : ((t.type = y.MASK_TYPES.STENCIL),
                this.enableScissor &&
                  i.isFastRect &&
                  i.isFastRect() &&
                  ((i = i.worldTransform),
                  (e = Math.atan2(i.b, i.a)),
                  (i = Math.atan2(i.d, i.c)),
                  (e = Math.round(e * (180 / Math.PI) * 100)),
                  (i = Math.round(i * (180 / Math.PI) * 100) - e),
                  0 == (e = ((e % 9e3) + 9e3) % 9e3) &&
                    9e3 == (i = ((i % 18e3) + 18e3) % 18e3) &&
                    (t.type = y.MASK_TYPES.SCISSOR)));
          }),
          (Ze.prototype.pushSpriteMask = function (t) {
            var e = t.maskObject,
              t = t._target,
              i = this.alphaMaskPool[this.alphaMaskIndex],
              r =
                (((i =
                  i ||
                  (this.alphaMaskPool[this.alphaMaskIndex] = [
                    new Ve(e),
                  ]))[0].resolution = this.renderer.resolution),
                (i[0].maskSprite = e),
                t.filterArea);
            (t.filterArea = e.getBounds(!0)),
              this.renderer.filter.push(t, i),
              (t.filterArea = r),
              this.alphaMaskIndex++;
          }),
          (Ze.prototype.popSpriteMask = function () {
            this.renderer.filter.pop(), this.alphaMaskIndex--;
          });
        var qe,
          Ke = Ze;
        function Ze(t) {
          t = qe.call(this, t) || this;
          return (
            (t.enableScissor = !1),
            (t.alphaMaskPool = []),
            (t.maskDataPool = []),
            (t.maskStack = []),
            (t.alphaMaskIndex = 0),
            t
          );
        }
        a(Qe, (Je = o)),
          (Qe.prototype.getStackLength = function () {
            return this.maskStack.length;
          }),
          (Qe.prototype.setMaskStack = function (t) {
            var e = this.renderer.gl,
              i = this.getStackLength(),
              t = ((this.maskStack = t), this.getStackLength());
            t !== i &&
              (0 === t
                ? e.disable(this.glConst)
                : (e.enable(this.glConst), this._useCurrent()));
          }),
          (Qe.prototype._useCurrent = function () {}),
          (Qe.prototype.destroy = function () {
            Je.prototype.destroy.call(this), (this.maskStack = null);
          });
        var Je,
          $ = Qe;
        function Qe(t) {
          t = Je.call(this, t) || this;
          return (t.maskStack = []), (t.glConst = 0), t;
        }
        a(ei, ($e = $)),
          (ei.prototype.getStackLength = function () {
            var t = this.maskStack[this.maskStack.length - 1];
            return t ? t._scissorCounter : 0;
          }),
          (ei.prototype.push = function (t) {
            var e = t.maskObject,
              i = ((e.renderable = !0), t._scissorRect),
              r = e.getBounds(!0),
              n = this.renderer.gl;
            (e.renderable = !1),
              i ? r.fit(i) : n.enable(n.SCISSOR_TEST),
              t._scissorCounter++,
              (t._scissorRect = r),
              this._useCurrent();
          }),
          (ei.prototype.pop = function () {
            var t = this.renderer.gl;
            0 < this.getStackLength()
              ? this._useCurrent()
              : t.disable(t.SCISSOR_TEST);
          }),
          (ei.prototype._useCurrent = function () {
            var t = this.maskStack[this.maskStack.length - 1]._scissorRect,
              e = this.renderer.renderTexture.current,
              i = this.renderer.projection,
              r = i.transform,
              n = i.sourceFrame,
              i = i.destinationFrame,
              o = (e || this.renderer).resolution,
              s = (t.x - n.x) * o + i.x,
              n = (t.y - n.y) * o + i.y,
              i = t.width * o,
              t = t.height * o;
            r && ((s += r.tx * o), (n += r.ty * o)),
              e || (n = this.renderer.height - t - n),
              this.renderer.gl.scissor(s, n, i, t);
          });
        var $e,
          ti = ei;
        function ei(t) {
          t = $e.call(this, t) || this;
          return (t.glConst = WebGLRenderingContext.SCISSOR_TEST), t;
        }
        a(ni, (ii = $)),
          (ni.prototype.getStackLength = function () {
            var t = this.maskStack[this.maskStack.length - 1];
            return t ? t._stencilCounter : 0;
          }),
          (ni.prototype.push = function (t) {
            var e = t.maskObject,
              i = this.renderer.gl,
              r = t._stencilCounter;
            0 === r &&
              (this.renderer.framebuffer.forceStencil(),
              i.enable(i.STENCIL_TEST)),
              t._stencilCounter++,
              i.colorMask(!1, !1, !1, !1),
              i.stencilFunc(i.EQUAL, r, this._getBitwiseMask()),
              i.stencilOp(i.KEEP, i.KEEP, i.INCR),
              (e.renderable = !0),
              e.render(this.renderer),
              this.renderer.batch.flush(),
              (e.renderable = !1),
              this._useCurrent();
          }),
          (ni.prototype.pop = function (t) {
            var e = this.renderer.gl;
            0 === this.getStackLength()
              ? (e.disable(e.STENCIL_TEST),
                e.clear(e.STENCIL_BUFFER_BIT),
                e.clearStencil(0))
              : (e.colorMask(!1, !1, !1, !1),
                e.stencilOp(e.KEEP, e.KEEP, e.DECR),
                (t.renderable = !0),
                t.render(this.renderer),
                this.renderer.batch.flush(),
                (t.renderable = !1),
                this._useCurrent());
          }),
          (ni.prototype._useCurrent = function () {
            var t = this.renderer.gl;
            t.colorMask(!0, !0, !0, !0),
              t.stencilFunc(
                t.EQUAL,
                this.getStackLength(),
                this._getBitwiseMask()
              ),
              t.stencilOp(t.KEEP, t.KEEP, t.KEEP);
          }),
          (ni.prototype._getBitwiseMask = function () {
            return (1 << this.getStackLength()) - 1;
          });
        var ii,
          ri = ni;
        function ni(t) {
          t = ii.call(this, t) || this;
          return (t.glConst = WebGLRenderingContext.STENCIL_TEST), t;
        }
        a(ai, (oi = o)),
          (ai.prototype.update = function (t, e, i, r) {
            (this.destinationFrame =
              t || this.destinationFrame || this.defaultFrame),
              (this.sourceFrame = e || this.sourceFrame || t),
              this.calculateProjection(
                this.destinationFrame,
                this.sourceFrame,
                i,
                r
              ),
              this.transform && this.projectionMatrix.append(this.transform);
            e = this.renderer;
            (e.globalUniforms.uniforms.projectionMatrix =
              this.projectionMatrix),
              e.globalUniforms.update(),
              e.shader.shader &&
                e.shader.syncUniformGroup(e.shader.shader.uniforms.globals);
          }),
          (ai.prototype.calculateProjection = function (t, e, i, r) {
            var n = this.projectionMatrix,
              r = r ? -1 : 1;
            n.identity(),
              (n.a = (1 / e.width) * 2),
              (n.d = r * ((1 / e.height) * 2)),
              (n.tx = -1 - e.x * n.a),
              (n.ty = -r - e.y * n.d);
          }),
          (ai.prototype.setTransform = function (t) {});
        var oi,
          si = ai;
        function ai(t) {
          t = oi.call(this, t) || this;
          return (
            (t.destinationFrame = null),
            (t.sourceFrame = null),
            (t.defaultFrame = null),
            (t.projectionMatrix = new h.Matrix()),
            (t.transform = null),
            t
          );
        }
        var hi,
          ui = new h.Rectangle(),
          li = new h.Rectangle(),
          ci = new h.Rectangle(),
          di =
            (a(pi, (hi = o)),
            (pi.prototype.bind = function (t, e, i) {
              var r,
                n,
                o,
                s = this.renderer;
              (this.current = t = void 0 === t ? null : t)
                ? ((o = (r = t.baseTexture).resolution),
                  e ||
                    ((ui.width = t.frame.width),
                    (ui.height = t.frame.height),
                    (e = ui)),
                  i ||
                    ((li.x = t.frame.x),
                    (li.y = t.frame.y),
                    (li.width = e.width),
                    (li.height = e.height),
                    (i = li)),
                  (n = r.framebuffer))
                : ((o = s.resolution),
                  e ||
                    ((ui.width = s.screen.width),
                    (ui.height = s.screen.height),
                    (e = ui)),
                  i || (((i = ui).width = e.width), (i.height = e.height))),
                (ci.x = i.x * o),
                (ci.y = i.y * o),
                (ci.width = i.width * o),
                (ci.height = i.height * o),
                this.renderer.framebuffer.bind(n, ci),
                this.renderer.projection.update(i, e, o, !n),
                t
                  ? this.renderer.mask.setMaskStack(r.maskStack)
                  : this.renderer.mask.setMaskStack(this.defaultMaskStack),
                this.sourceFrame.copyFrom(e),
                this.destinationFrame.copyFrom(i);
            }),
            (pi.prototype.clear = function (t, e) {
              (t = this.current
                ? t || this.current.baseTexture.clearColor
                : t || this.clearColor),
                this.renderer.framebuffer.clear(t[0], t[1], t[2], t[3], e);
            }),
            (pi.prototype.resize = function () {
              this.bind(null);
            }),
            (pi.prototype.reset = function () {
              this.bind(null);
            }),
            pi);
        function pi(t) {
          var e = hi.call(this, t) || this;
          return (
            (e.clearColor = t._backgroundColorRgba),
            (e.defaultMaskStack = []),
            (e.current = null),
            (e.sourceFrame = new h.Rectangle()),
            (e.destinationFrame = new h.Rectangle()),
            e
          );
        }
        function fi() {}
        yi.prototype.destroy = function () {
          (this.uniformData = null),
            (this.uniformGroups = null),
            (this.program = null);
        };
        var mi = yi;
        function yi(t, e) {
          (this.program = t), (this.uniformData = e), (this.uniformGroups = {});
        }
        var gi,
          vi = 0,
          _i = { textureCount: 0 },
          xi =
            (a(A, (gi = o)),
            (A.prototype.systemCheck = function () {
              if (
                !(function () {
                  if ('boolean' == typeof De) return De;
                  try {
                    var t = new Function(
                      'param1',
                      'param2',
                      'param3',
                      'return param1[param2] === param3;'
                    );
                    De = !0 === t({ a: 'b' }, 'a', 'b');
                  } catch (t) {
                    De = !1;
                  }
                  return De;
                })()
              )
                throw new Error(
                  'Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.'
                );
            }),
            (A.prototype.contextChange = function (t) {
              (this.gl = t), this.reset();
            }),
            (A.prototype.bind = function (t, e) {
              t.uniforms.globals = this.renderer.globalUniforms;
              var i = t.program,
                r =
                  i.glPrograms[this.renderer.CONTEXT_UID] ||
                  this.generateShader(t);
              return (
                (this.shader = t),
                this.program !== i &&
                  ((this.program = i), this.gl.useProgram(r.program)),
                e ||
                  ((_i.textureCount = 0),
                  this.syncUniformGroup(t.uniformGroup, _i)),
                r
              );
            }),
            (A.prototype.setUniforms = function (t) {
              var e = this.shader.program,
                i = e.glPrograms[this.renderer.CONTEXT_UID];
              e.syncUniforms(i.uniformData, t, this.renderer);
            }),
            (A.prototype.syncUniformGroup = function (t, e) {
              var i = this.getglProgram();
              (t.static && t.dirtyId === i.uniformGroups[t.id]) ||
                ((i.uniformGroups[t.id] = t.dirtyId),
                this.syncUniforms(t, i, e));
            }),
            (A.prototype.syncUniforms = function (t, e, i) {
              (
                t.syncUniforms[this.shader.program.id] ||
                this.createSyncGroups(t)
              )(e.uniformData, t.uniforms, this.renderer, i);
            }),
            (A.prototype.createSyncGroups = function (t) {
              var e = this.getSignature(t, this.shader.program.uniformData);
              return (
                this.cache[e] ||
                  (this.cache[e] = (function (t, e) {
                    var i,
                      r = [
                        '\n        var v = null;\n        var cv = null\n        var t = 0;\n        var gl = renderer.gl\n    ',
                      ];
                    for (i in t.uniforms) {
                      var n = e[i];
                      if (n) {
                        for (
                          var o, s = t.uniforms[i], a = !1, h = 0;
                          h < Ie.length;
                          h++
                        )
                          if (Ie[h].test(n, s)) {
                            r.push(Ie[h].code(i, s)), (a = !0);
                            break;
                          }
                        a ||
                          ((o = (1 === n.size ? Ae : Me)[n.type].replace(
                            'location',
                            'ud["' + i + '"].location'
                          )),
                          r.push(
                            '\n            cv = ud["' +
                              i +
                              '"].value;\n            v = uv["' +
                              i +
                              '"];\n            ' +
                              o +
                              ';'
                          ));
                      } else
                        t.uniforms[i].group &&
                          r.push(
                            '\n                    renderer.shader.syncUniformGroup(uv["' +
                              i +
                              '"], syncData);\n                '
                          );
                    }
                    return new Function(
                      'ud',
                      'uv',
                      'renderer',
                      'syncData',
                      r.join('\n')
                    );
                  })(t, this.shader.program.uniformData)),
                (t.syncUniforms[this.shader.program.id] = this.cache[e]),
                t.syncUniforms[this.shader.program.id]
              );
            }),
            (A.prototype.getSignature = function (t, e) {
              var i,
                r = [];
              for (i in t.uniforms) r.push(i), e[i] && r.push(e[i].type);
              return r.join('-');
            }),
            (A.prototype.getglProgram = function () {
              return this.shader
                ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID]
                : null;
            }),
            (A.prototype.generateShader = function (t) {
              var e = this.gl,
                i = t.program,
                r = {};
              for (n in i.attributeData) r[n] = i.attributeData[n].location;
              var n,
                o = ye(e, i.vertexSrc, i.fragmentSrc, r),
                s = {};
              for (n in i.uniformData) {
                var a = i.uniformData[n];
                s[n] = {
                  location: e.getUniformLocation(o, n),
                  value: ve(a.type, a.size),
                };
              }
              t = new mi(o, s);
              return (i.glPrograms[this.renderer.CONTEXT_UID] = t);
            }),
            (A.prototype.reset = function () {
              (this.program = null), (this.shader = null);
            }),
            (A.prototype.destroy = function () {
              this.destroyed = !0;
            }),
            A);
        function A(t) {
          t = gi.call(this, t) || this;
          return (
            (t.destroyed = !1),
            t.systemCheck(),
            (t.gl = null),
            (t.shader = null),
            (t.program = null),
            (t.cache = {}),
            (t.id = vi++),
            t
          );
        }
        a(M, (bi = o)),
          (M.prototype.contextChange = function (t) {
            var e;
            (this.gl = t),
              (this.blendModes =
                ((t = t),
                ((e = void 0 === e ? [] : e)[y.BLEND_MODES.NORMAL] = [
                  t.ONE,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.ADD] = [t.ONE, t.ONE]),
                (e[y.BLEND_MODES.MULTIPLY] = [
                  t.DST_COLOR,
                  t.ONE_MINUS_SRC_ALPHA,
                  t.ONE,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.SCREEN] = [
                  t.ONE,
                  t.ONE_MINUS_SRC_COLOR,
                  t.ONE,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.OVERLAY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.DARKEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.LIGHTEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.COLOR_DODGE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.COLOR_BURN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.HARD_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.SOFT_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.DIFFERENCE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.EXCLUSION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.HUE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.SATURATION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.COLOR] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.LUMINOSITY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.NONE] = [0, 0]),
                (e[y.BLEND_MODES.NORMAL_NPM] = [
                  t.SRC_ALPHA,
                  t.ONE_MINUS_SRC_ALPHA,
                  t.ONE,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.ADD_NPM] = [t.SRC_ALPHA, t.ONE, t.ONE, t.ONE]),
                (e[y.BLEND_MODES.SCREEN_NPM] = [
                  t.SRC_ALPHA,
                  t.ONE_MINUS_SRC_COLOR,
                  t.ONE,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.SRC_IN] = [t.DST_ALPHA, t.ZERO]),
                (e[y.BLEND_MODES.SRC_OUT] = [t.ONE_MINUS_DST_ALPHA, t.ZERO]),
                (e[y.BLEND_MODES.SRC_ATOP] = [
                  t.DST_ALPHA,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.DST_OVER] = [t.ONE_MINUS_DST_ALPHA, t.ONE]),
                (e[y.BLEND_MODES.DST_IN] = [t.ZERO, t.SRC_ALPHA]),
                (e[y.BLEND_MODES.DST_OUT] = [t.ZERO, t.ONE_MINUS_SRC_ALPHA]),
                (e[y.BLEND_MODES.DST_ATOP] = [
                  t.ONE_MINUS_DST_ALPHA,
                  t.SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.XOR] = [
                  t.ONE_MINUS_DST_ALPHA,
                  t.ONE_MINUS_SRC_ALPHA,
                ]),
                (e[y.BLEND_MODES.SUBTRACT] = [
                  t.ONE,
                  t.ONE,
                  t.ONE,
                  t.ONE,
                  t.FUNC_REVERSE_SUBTRACT,
                  t.FUNC_ADD,
                ]),
                e)),
              this.set(this.defaultState),
              this.reset();
          }),
          (M.prototype.set = function (t) {
            if (((t = t || this.defaultState), this.stateId !== t.data)) {
              for (var e = this.stateId ^ t.data, i = 0; e; )
                1 & e && this.map[i].call(this, !!(t.data & (1 << i))),
                  (e >>= 1),
                  i++;
              this.stateId = t.data;
            }
            for (i = 0; i < this.checks.length; i++) this.checks[i](this, t);
          }),
          (M.prototype.forceState = function (t) {
            t = t || this.defaultState;
            for (var e = 0; e < this.map.length; e++)
              this.map[e].call(this, !!(t.data & (1 << e)));
            for (e = 0; e < this.checks.length; e++) this.checks[e](this, t);
            this.stateId = t.data;
          }),
          (M.prototype.setBlend = function (t) {
            this.updateCheck(M.checkBlendMode, t),
              this.gl[t ? 'enable' : 'disable'](this.gl.BLEND);
          }),
          (M.prototype.setOffset = function (t) {
            this.updateCheck(M.checkPolygonOffset, t),
              this.gl[t ? 'enable' : 'disable'](this.gl.POLYGON_OFFSET_FILL);
          }),
          (M.prototype.setDepthTest = function (t) {
            this.gl[t ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
          }),
          (M.prototype.setCullFace = function (t) {
            this.gl[t ? 'enable' : 'disable'](this.gl.CULL_FACE);
          }),
          (M.prototype.setFrontFace = function (t) {
            this.gl.frontFace(this.gl[t ? 'CW' : 'CCW']);
          }),
          (M.prototype.setBlendMode = function (t) {
            var e;
            t !== this.blendMode &&
              ((this.blendMode = t),
              (t = this.blendModes[t]),
              (e = this.gl),
              2 === t.length
                ? e.blendFunc(t[0], t[1])
                : e.blendFuncSeparate(t[0], t[1], t[2], t[3]),
              6 === t.length
                ? ((this._blendEq = !0), e.blendEquationSeparate(t[4], t[5]))
                : this._blendEq &&
                  ((this._blendEq = !1),
                  e.blendEquationSeparate(e.FUNC_ADD, e.FUNC_ADD)));
          }),
          (M.prototype.setPolygonOffset = function (t, e) {
            this.gl.polygonOffset(t, e);
          }),
          (M.prototype.reset = function () {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1),
              this.forceState(this.defaultState),
              (this._blendEq = !0),
              (this.blendMode = -1),
              this.setBlendMode(0);
          }),
          (M.prototype.updateCheck = function (t, e) {
            var i = this.checks.indexOf(t);
            e && -1 === i
              ? this.checks.push(t)
              : e || -1 === i || this.checks.splice(i, 1);
          }),
          (M.checkBlendMode = function (t, e) {
            t.setBlendMode(e.blendMode);
          }),
          (M.checkPolygonOffset = function (t, e) {
            t.setPolygonOffset(1, e.polygonOffset);
          });
        var bi,
          Ti = M;
        function M(t) {
          t = bi.call(this, t) || this;
          return (
            (t.gl = null),
            (t.stateId = 0),
            (t.polygonOffset = 0),
            (t.blendMode = y.BLEND_MODES.NONE),
            (t._blendEq = !1),
            (t.map = []),
            (t.map[0] = t.setBlend),
            (t.map[1] = t.setOffset),
            (t.map[2] = t.setCullFace),
            (t.map[3] = t.setDepthTest),
            (t.map[4] = t.setFrontFace),
            (t.checks = []),
            (t.defaultState = new je()),
            (t.defaultState.blend = !0),
            t
          );
        }
        a(Pi, (Ei = o)),
          (Pi.prototype.postrender = function () {
            this.renderer.renderingToScreen &&
              (this.count++,
              this.mode !== y.GC_MODES.MANUAL &&
                (this.checkCount++,
                this.checkCount > this.checkCountMax &&
                  ((this.checkCount = 0), this.run())));
          }),
          (Pi.prototype.run = function () {
            for (
              var t = this.renderer.texture,
                e = t.managedTextures,
                i = !1,
                r = 0;
              r < e.length;
              r++
            ) {
              var n = e[r];
              !n.framebuffer &&
                this.count - n.touched > this.maxIdle &&
                (t.destroyTexture(n, !0), (i = !(e[r] = null)));
            }
            if (i) {
              for (var o = 0, r = 0; r < e.length; r++)
                null !== e[r] && (e[o++] = e[r]);
              e.length = o;
            }
          }),
          (Pi.prototype.unload = function (t) {
            var e = this.renderer.texture,
              i = t._texture;
            i && !i.framebuffer && e.destroyTexture(i);
            for (var r = t.children.length - 1; 0 <= r; r--)
              this.unload(t.children[r]);
          });
        var Ei,
          wi = Pi;
        function Pi(t) {
          t = Ei.call(this, t) || this;
          return (
            (t.count = 0),
            (t.checkCount = 0),
            (t.maxIdle = m.settings.GC_MAX_IDLE),
            (t.checkCountMax = m.settings.GC_MAX_CHECK_COUNT),
            (t.mode = m.settings.GC_MODE),
            t
          );
        }
        var Si,
          Oi = function (t) {
            (this.texture = t),
              (this.width = -1),
              (this.height = -1),
              (this.dirtyId = -1),
              (this.dirtyStyleId = -1),
              (this.mipmap = !1),
              (this.wrapMode = 33071),
              (this.type = 6408),
              (this.internalFormat = 5121);
          },
          Ii =
            (a(D, (Si = o)),
            (D.prototype.contextChange = function () {
              var t = (this.gl = this.renderer.gl),
                e =
                  ((this.CONTEXT_UID = this.renderer.CONTEXT_UID),
                  (this.webGLVersion = this.renderer.context.webGLVersion),
                  t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS));
              this.boundTextures.length = e;
              for (var i = 0; i < e; i++) this.boundTextures[i] = null;
              this.emptyTextures = {};
              var r = new Oi(t.createTexture());
              t.bindTexture(t.TEXTURE_2D, r.texture),
                t.texImage2D(
                  t.TEXTURE_2D,
                  0,
                  t.RGBA,
                  1,
                  1,
                  0,
                  t.RGBA,
                  t.UNSIGNED_BYTE,
                  new Uint8Array(4)
                ),
                (this.emptyTextures[t.TEXTURE_2D] = r),
                (this.emptyTextures[t.TEXTURE_CUBE_MAP] = new Oi(
                  t.createTexture()
                )),
                t.bindTexture(
                  t.TEXTURE_CUBE_MAP,
                  this.emptyTextures[t.TEXTURE_CUBE_MAP].texture
                );
              for (i = 0; i < 6; i++)
                t.texImage2D(
                  t.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                  0,
                  t.RGBA,
                  1,
                  1,
                  0,
                  t.RGBA,
                  t.UNSIGNED_BYTE,
                  null
                );
              t.texParameteri(
                t.TEXTURE_CUBE_MAP,
                t.TEXTURE_MAG_FILTER,
                t.LINEAR
              ),
                t.texParameteri(
                  t.TEXTURE_CUBE_MAP,
                  t.TEXTURE_MIN_FILTER,
                  t.LINEAR
                );
              for (i = 0; i < this.boundTextures.length; i++)
                this.bind(null, i);
            }),
            (D.prototype.bind = function (t, e) {
              void 0 === e && (e = 0);
              var i,
                r = this.gl;
              t
                ? (t = t.castToBaseTexture()).parentTextureArray ||
                  (t.valid &&
                    ((t.touched = this.renderer.textureGC.count),
                    (i =
                      t._glTextures[this.CONTEXT_UID] || this.initTexture(t)),
                    this.boundTextures[e] !== t &&
                      (this.currentLocation !== e &&
                        ((this.currentLocation = e),
                        r.activeTexture(r.TEXTURE0 + e)),
                      r.bindTexture(t.target, i.texture)),
                    i.dirtyId !== t.dirtyId &&
                      (this.currentLocation !== e &&
                        ((this.currentLocation = e),
                        r.activeTexture(r.TEXTURE0 + e)),
                      this.updateTexture(t)),
                    (this.boundTextures[e] = t)))
                : (this.currentLocation !== e &&
                    ((this.currentLocation = e),
                    r.activeTexture(r.TEXTURE0 + e)),
                  r.bindTexture(
                    r.TEXTURE_2D,
                    this.emptyTextures[r.TEXTURE_2D].texture
                  ),
                  (this.boundTextures[e] = null));
            }),
            (D.prototype.reset = function () {
              (this._unknownBoundTextures = !0), (this.currentLocation = -1);
              for (var t = 0; t < this.boundTextures.length; t++)
                this.boundTextures[t] = this.unknownTexture;
            }),
            (D.prototype.unbind = function (t) {
              var e = this.gl,
                i = this.boundTextures;
              if (this._unknownBoundTextures) {
                this._unknownBoundTextures = !1;
                for (var r = 0; r < i.length; r++)
                  i[r] === this.unknownTexture && this.bind(null, r);
              }
              for (r = 0; r < i.length; r++)
                i[r] === t &&
                  (this.currentLocation !== r &&
                    (e.activeTexture(e.TEXTURE0 + r),
                    (this.currentLocation = r)),
                  e.bindTexture(t.target, this.emptyTextures[t.target].texture),
                  (i[r] = null));
            }),
            (D.prototype.initTexture = function (t) {
              var e = new Oi(this.gl.createTexture());
              return (
                (e.dirtyId = -1),
                (t._glTextures[this.CONTEXT_UID] = e),
                this.managedTextures.push(t),
                t.on('dispose', this.destroyTexture, this),
                e
              );
            }),
            (D.prototype.initTextureType = function (t, e) {
              var i;
              (e.internalFormat = t.format),
                (e.type = t.type),
                2 === this.webGLVersion &&
                  ((i = this.renderer.gl),
                  t.type === i.FLOAT &&
                    t.format === i.RGBA &&
                    (e.internalFormat = i.RGBA32F),
                  t.type === y.TYPES.HALF_FLOAT && (e.type = i.HALF_FLOAT),
                  e.type === i.HALF_FLOAT &&
                    t.format === i.RGBA &&
                    (e.internalFormat = i.RGBA16F));
            }),
            (D.prototype.updateTexture = function (t) {
              var e,
                i,
                r,
                n = t._glTextures[this.CONTEXT_UID];
              n &&
                ((r = this.renderer),
                this.initTextureType(t, n),
                (t.resource && t.resource.upload(r, t, n)) ||
                  ((e = t.realWidth),
                  (i = t.realHeight),
                  (r = r.gl),
                  (n.width !== e || n.height !== i || n.dirtyId < 0) &&
                    ((n.width = e),
                    (n.height = i),
                    r.texImage2D(
                      t.target,
                      0,
                      n.internalFormat,
                      e,
                      i,
                      0,
                      t.format,
                      n.type,
                      null
                    ))),
                t.dirtyStyleId !== n.dirtyStyleId && this.updateTextureStyle(t),
                (n.dirtyId = t.dirtyId));
            }),
            (D.prototype.destroyTexture = function (t, e) {
              var i = this.gl;
              (t = t.castToBaseTexture())._glTextures[this.CONTEXT_UID] &&
                (this.unbind(t),
                i.deleteTexture(t._glTextures[this.CONTEXT_UID].texture),
                t.off('dispose', this.destroyTexture, this),
                delete t._glTextures[this.CONTEXT_UID],
                e ||
                  (-1 !== (i = this.managedTextures.indexOf(t)) &&
                    g.removeItems(this.managedTextures, i, 1)));
            }),
            (D.prototype.updateTextureStyle = function (t) {
              var e = t._glTextures[this.CONTEXT_UID];
              e &&
                ((t.mipmap !== y.MIPMAP_MODES.POW2 &&
                  2 === this.webGLVersion) ||
                t.isPowerOfTwo
                  ? (e.mipmap = 1 <= t.mipmap)
                  : (e.mipmap = !1),
                2 === this.webGLVersion || t.isPowerOfTwo
                  ? (e.wrapMode = t.wrapMode)
                  : (e.wrapMode = y.WRAP_MODES.CLAMP),
                (t.resource && t.resource.style(this.renderer, t, e)) ||
                  this.setStyle(t, e),
                (e.dirtyStyleId = t.dirtyStyleId));
            }),
            (D.prototype.setStyle = function (t, e) {
              var i,
                r = this.gl;
              e.mipmap && r.generateMipmap(t.target),
                r.texParameteri(t.target, r.TEXTURE_WRAP_S, e.wrapMode),
                r.texParameteri(t.target, r.TEXTURE_WRAP_T, e.wrapMode),
                e.mipmap
                  ? (r.texParameteri(
                      t.target,
                      r.TEXTURE_MIN_FILTER,
                      t.scaleMode === y.SCALE_MODES.LINEAR
                        ? r.LINEAR_MIPMAP_LINEAR
                        : r.NEAREST_MIPMAP_NEAREST
                    ),
                    (e =
                      this.renderer.context.extensions.anisotropicFiltering) &&
                      0 < t.anisotropicLevel &&
                      t.scaleMode === y.SCALE_MODES.LINEAR &&
                      ((i = Math.min(
                        t.anisotropicLevel,
                        r.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
                      )),
                      r.texParameterf(
                        t.target,
                        e.TEXTURE_MAX_ANISOTROPY_EXT,
                        i
                      )))
                  : r.texParameteri(
                      t.target,
                      r.TEXTURE_MIN_FILTER,
                      t.scaleMode === y.SCALE_MODES.LINEAR
                        ? r.LINEAR
                        : r.NEAREST
                    ),
                r.texParameteri(
                  t.target,
                  r.TEXTURE_MAG_FILTER,
                  t.scaleMode === y.SCALE_MODES.LINEAR ? r.LINEAR : r.NEAREST
                );
            }),
            D);
        function D(t) {
          t = Si.call(this, t) || this;
          return (
            (t.boundTextures = []),
            (t.currentLocation = -1),
            (t.managedTextures = []),
            (t._unknownBoundTextures = !1),
            (t.unknownTexture = new d()),
            t
          );
        }
        var Ai,
          st = {
            FilterSystem: Zt,
            BatchSystem: te,
            ContextSystem: ne,
            FramebufferSystem: he,
            GeometrySystem: de,
            MaskSystem: Ke,
            ScissorSystem: ti,
            StencilSystem: ri,
            ProjectionSystem: si,
            RenderTextureSystem: di,
            ShaderSystem: xi,
            StateSystem: Ti,
            TextureGCSystem: wi,
            TextureSystem: Ii,
          },
          Mi = new h.Matrix(),
          $ =
            (a(C, (Ai = g.EventEmitter)),
            (C.prototype.initPlugins = function (t) {
              for (var e in t) this.plugins[e] = new t[e](this);
            }),
            Object.defineProperty(C.prototype, 'width', {
              get: function () {
                return this.view.width;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(C.prototype, 'height', {
              get: function () {
                return this.view.height;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (C.prototype.resize = function (t, e) {
              (this.screen.width = t),
                (this.screen.height = e),
                (this.view.width = t * this.resolution),
                (this.view.height = e * this.resolution),
                this.autoDensity &&
                  ((this.view.style.width = t + 'px'),
                  (this.view.style.height = e + 'px')),
                this.emit('resize', t, e);
            }),
            (C.prototype.generateTexture = function (t, e, i, r) {
              0 === (r = r || t.getLocalBounds(null, !0)).width &&
                (r.width = 1),
                0 === r.height && (r.height = 1);
              e = St.create({
                width: 0 | r.width,
                height: 0 | r.height,
                scaleMode: e,
                resolution: i,
              });
              return (
                (Mi.tx = -r.x),
                (Mi.ty = -r.y),
                this.render(t, e, !1, Mi, !!t.parent),
                e
              );
            }),
            (C.prototype.destroy = function (t) {
              for (var e in this.plugins)
                this.plugins[e].destroy(), (this.plugins[e] = null);
              t &&
                this.view.parentNode &&
                this.view.parentNode.removeChild(this.view);
              t = this;
              (t.plugins = null),
                (t.type = y.RENDERER_TYPE.UNKNOWN),
                (t.view = null),
                (t.screen = null),
                (t._tempDisplayObjectParent = null),
                (t.options = null),
                (this._backgroundColorRgba = null),
                (this._backgroundColorString = null),
                (this._lastObjectRendered = null);
            }),
            Object.defineProperty(C.prototype, 'backgroundColor', {
              get: function () {
                return this._backgroundColor;
              },
              set: function (t) {
                (this._backgroundColor = t),
                  (this._backgroundColorString = g.hex2string(t)),
                  g.hex2rgb(t, this._backgroundColorRgba);
              },
              enumerable: !1,
              configurable: !0,
            }),
            C);
        function C(t, e) {
          void 0 === t && (t = y.RENDERER_TYPE.UNKNOWN);
          var i = Ai.call(this) || this;
          return (
            (e = Object.assign({}, m.settings.RENDER_OPTIONS, e)).roundPixels &&
              ((m.settings.ROUND_PIXELS = e.roundPixels),
              g.deprecation(
                '5.0.0',
                'Renderer roundPixels option is deprecated, please use PIXI.settings.ROUND_PIXELS',
                2
              )),
            (i.options = e),
            (i.type = t),
            (i.screen = new h.Rectangle(0, 0, e.width, e.height)),
            (i.view = e.view || document.createElement('canvas')),
            (i.resolution = e.resolution || m.settings.RESOLUTION),
            (i.transparent = e.transparent),
            (i.autoDensity = e.autoDensity || e.autoResize || !1),
            (i.preserveDrawingBuffer = e.preserveDrawingBuffer),
            (i.clearBeforeRender = e.clearBeforeRender),
            (i._backgroundColor = 0),
            (i._backgroundColorRgba = [0, 0, 0, 0]),
            (i._backgroundColorString = '#00000000'),
            (i.backgroundColor = e.backgroundColor || i._backgroundColor),
            (i._lastObjectRendered = null),
            (i.plugins = {}),
            i
          );
        }
        a(R, (Di = $)),
          (R.create = function (t) {
            if (g.isWebGLSupported()) return new R(t);
            throw new Error(
              'WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.'
            );
          }),
          (R.prototype.addSystem = function (t, e) {
            e = e || t.name;
            var i,
              r = new t(this);
            if (this[e])
              throw new Error('Whoops! The name "' + e + '" is already in use');
            for (i in ((this[e] = r), this.runners)) this.runners[i].add(r);
            return this;
          }),
          (R.prototype.render = function (t, e, i, r, n) {
            (this.renderingToScreen = !e),
              this.runners.prerender.emit(),
              this.emit('prerender'),
              (this.projection.transform = r),
              this.context.isLost ||
                (e || (this._lastObjectRendered = t),
                n ||
                  ((r = t.enableTempParent()),
                  t.updateTransform(),
                  t.disableTempParent(r)),
                this.renderTexture.bind(e),
                this.batch.currentRenderer.start(),
                (void 0 !== i ? i : this.clearBeforeRender) &&
                  this.renderTexture.clear(),
                t.render(this),
                this.batch.currentRenderer.flush(),
                e && e.baseTexture.update(),
                this.runners.postrender.emit(),
                (this.projection.transform = null),
                this.emit('postrender'));
          }),
          (R.prototype.resize = function (t, e) {
            Di.prototype.resize.call(this, t, e),
              this.runners.resize.emit(t, e);
          }),
          (R.prototype.reset = function () {
            return this.runners.reset.emit(), this;
          }),
          (R.prototype.clear = function () {
            this.renderTexture.bind(), this.renderTexture.clear();
          }),
          (R.prototype.destroy = function (t) {
            for (var e in (this.runners.destroy.emit(), this.runners))
              this.runners[e].destroy();
            Di.prototype.destroy.call(this, t), (this.gl = null);
          }),
          (R.registerPlugin = function (t, e) {
            (R.__plugins = R.__plugins || {})[t] = e;
          });
        var Di,
          Ci = R;
        function R(t) {
          var e = Di.call(this, y.RENDERER_TYPE.WEBGL, t) || this;
          return (
            (t = e.options),
            (e.gl = null),
            (e.CONTEXT_UID = 0),
            (e.runners = {
              destroy: new r.Runner('destroy'),
              contextChange: new r.Runner('contextChange'),
              reset: new r.Runner('reset'),
              update: new r.Runner('update'),
              postrender: new r.Runner('postrender'),
              prerender: new r.Runner('prerender'),
              resize: new r.Runner('resize'),
            }),
            (e.globalUniforms = new Yt(
              { projectionMatrix: new h.Matrix() },
              !0
            )),
            e
              .addSystem(Ke, 'mask')
              .addSystem(ne, 'context')
              .addSystem(Ti, 'state')
              .addSystem(xi, 'shader')
              .addSystem(Ii, 'texture')
              .addSystem(de, 'geometry')
              .addSystem(he, 'framebuffer')
              .addSystem(ti, 'scissor')
              .addSystem(ri, 'stencil')
              .addSystem(si, 'projection')
              .addSystem(wi, 'textureGC')
              .addSystem(Zt, 'filter')
              .addSystem(di, 'renderTexture')
              .addSystem(te, 'batch'),
            e.initPlugins(R.__plugins),
            t.context
              ? e.context.initFromContext(t.context)
              : e.context.initFromOptions({
                  alpha: !!e.transparent,
                  antialias: t.antialias,
                  premultipliedAlpha:
                    e.transparent && 'notMultiplied' !== e.transparent,
                  stencil: !0,
                  preserveDrawingBuffer: t.preserveDrawingBuffer,
                  powerPreference: e.options.powerPreference,
                }),
            (e.renderingToScreen = !0),
            g.sayHello(2 === e.context.webGLVersion ? 'WebGL 2' : 'WebGL 1'),
            e.resize(e.options.width, e.options.height),
            e
          );
        }
        var Ri = function () {
            (this.texArray = null),
              (this.blend = 0),
              (this.type = y.DRAW_MODES.TRIANGLES),
              (this.start = 0),
              (this.size = 0),
              (this.data = null);
          },
          Li =
            ((Ni.prototype.clear = function () {
              for (var t = 0; t < this.count; t++) this.elements[t] = null;
              this.count = 0;
            }),
            Ni);
        function Ni() {
          (this.elements = []), (this.ids = []), (this.count = 0);
        }
        Object.defineProperty(L.prototype, 'int8View', {
          get: function () {
            return (
              this._int8View ||
                (this._int8View = new Int8Array(this.rawBinaryData)),
              this._int8View
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
          Object.defineProperty(L.prototype, 'uint8View', {
            get: function () {
              return (
                this._uint8View ||
                  (this._uint8View = new Uint8Array(this.rawBinaryData)),
                this._uint8View
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(L.prototype, 'int16View', {
            get: function () {
              return (
                this._int16View ||
                  (this._int16View = new Int16Array(this.rawBinaryData)),
                this._int16View
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(L.prototype, 'uint16View', {
            get: function () {
              return (
                this._uint16View ||
                  (this._uint16View = new Uint16Array(this.rawBinaryData)),
                this._uint16View
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(L.prototype, 'int32View', {
            get: function () {
              return (
                this._int32View ||
                  (this._int32View = new Int32Array(this.rawBinaryData)),
                this._int32View
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          (L.prototype.view = function (t) {
            return this[t + 'View'];
          }),
          (L.prototype.destroy = function () {
            (this.rawBinaryData = null),
              (this._int8View = null),
              (this._uint8View = null),
              (this._int16View = null),
              (this._uint16View = null),
              (this._int32View = null),
              (this.uint32View = null),
              (this.float32View = null);
          }),
          (L.sizeOf = function (t) {
            switch (t) {
              case 'int8':
              case 'uint8':
                return 1;
              case 'int16':
              case 'uint16':
                return 2;
              case 'int32':
              case 'uint32':
              case 'float32':
                return 4;
              default:
                throw new Error(t + " isn't a valid view type");
            }
          });
        var Fi = L;
        function L(t) {
          (this.rawBinaryData = new ArrayBuffer(t)),
            (this.uint32View = new Uint32Array(this.rawBinaryData)),
            (this.float32View = new Float32Array(this.rawBinaryData));
        }
        a(N, (Bi = Jt)),
          (N.prototype.contextChange = function () {
            var t = this.renderer.gl;
            m.settings.PREFER_ENV === y.ENV.WEBGL_LEGACY
              ? (this.MAX_TEXTURES = 1)
              : ((this.MAX_TEXTURES = Math.min(
                  t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),
                  m.settings.SPRITE_MAX_TEXTURES
                )),
                (this.MAX_TEXTURES = Re(this.MAX_TEXTURES, t))),
              (this._shader = this.shaderGenerator.generateShader(
                this.MAX_TEXTURES
              ));
            for (var e = 0; e < this._packedGeometryPoolSize; e++)
              this._packedGeometries[e] = new this.geometryClass();
            this.initFlushBuffers();
          }),
          (N.prototype.initFlushBuffers = function () {
            for (
              var t = N._drawCallPool,
                e = N._textureArrayPool,
                i = this.size / 4,
                r = Math.floor(i / this.MAX_TEXTURES) + 1;
              t.length < i;

            )
              t.push(new Ri());
            for (; e.length < r; ) e.push(new Li());
            for (var n = 0; n < this.MAX_TEXTURES; n++)
              this._tempBoundTextures[n] = null;
          }),
          (N.prototype.onPrerender = function () {
            this._flushId = 0;
          }),
          (N.prototype.render = function (t) {
            t._texture.valid &&
              (this._vertexCount + t.vertexData.length / 2 > this.size &&
                this.flush(),
              (this._vertexCount += t.vertexData.length / 2),
              (this._indexCount += t.indices.length),
              (this._bufferedTextures[this._bufferSize] =
                t._texture.baseTexture),
              (this._bufferedElements[this._bufferSize++] = t));
          }),
          (N.prototype.buildTexturesAndDrawCalls = function () {
            var t = this._bufferedTextures,
              e = this.MAX_TEXTURES,
              i = N._textureArrayPool,
              r = this.renderer.batch,
              n = this._tempBoundTextures,
              o = this.renderer.textureGC.count,
              s = ++d._globalBatch,
              a = 0,
              h = i[0],
              u = 0;
            r.copyBoundTextures(n, e);
            for (var l = 0; l < this._bufferSize; ++l) {
              var c = t[l];
              (t[l] = null),
                c._batchEnabled !== s &&
                  (h.count >= e &&
                    (r.boundArray(h, n, s, e),
                    this.buildDrawCalls(h, u, l),
                    (u = l),
                    (h = i[++a]),
                    ++s),
                  (c._batchEnabled = s),
                  (c.touched = o),
                  (h.elements[h.count++] = c));
            }
            0 < h.count &&
              (r.boundArray(h, n, s, e),
              this.buildDrawCalls(h, u, this._bufferSize),
              ++a,
              ++s);
            for (l = 0; l < n.length; l++) n[l] = null;
            d._globalBatch = s;
          }),
          (N.prototype.buildDrawCalls = function (t, e, i) {
            var r = this._bufferedElements,
              n = this._attributeBuffer,
              o = this._indexBuffer,
              s = this.vertexSize,
              a = N._drawCallPool,
              h = this._dcIndex,
              u = this._aIndex,
              l = this._iIndex,
              c = a[h];
            (c.start = this._iIndex), (c.texArray = t);
            for (var d = e; d < i; ++d) {
              var p = r[d],
                f = p._texture.baseTexture,
                f = g.premultiplyBlendMode[f.alphaMode ? 1 : 0][p.blendMode];
              (r[d] = null),
                e < d &&
                  c.blend !== f &&
                  ((c.size = l - c.start),
                  (e = d),
                  ((c = a[++h]).texArray = t),
                  (c.start = l)),
                this.packInterleavedGeometry(p, n, o, u, l),
                (u += (p.vertexData.length / 2) * s),
                (l += p.indices.length),
                (c.blend = f);
            }
            e < i && ((c.size = l - c.start), ++h),
              (this._dcIndex = h),
              (this._aIndex = u),
              (this._iIndex = l);
          }),
          (N.prototype.bindAndClearTexArray = function (t) {
            for (var e = this.renderer.texture, i = 0; i < t.count; i++)
              e.bind(t.elements[i], t.ids[i]), (t.elements[i] = null);
            t.count = 0;
          }),
          (N.prototype.updateGeometry = function () {
            var t = this._packedGeometries,
              e = this._attributeBuffer,
              i = this._indexBuffer;
            m.settings.CAN_UPLOAD_SAME_BUFFER
              ? (t[this._flushId]._buffer.update(e.rawBinaryData),
                t[this._flushId]._indexBuffer.update(i),
                this.renderer.geometry.updateBuffers())
              : (this._packedGeometryPoolSize <= this._flushId &&
                  (this._packedGeometryPoolSize++,
                  (t[this._flushId] = new this.geometryClass())),
                t[this._flushId]._buffer.update(e.rawBinaryData),
                t[this._flushId]._indexBuffer.update(i),
                this.renderer.geometry.bind(t[this._flushId]),
                this.renderer.geometry.updateBuffers(),
                this._flushId++);
          }),
          (N.prototype.drawBatches = function () {
            for (
              var t = this._dcIndex,
                e = this.renderer,
                i = e.gl,
                r = e.state,
                n = N._drawCallPool,
                o = null,
                s = 0;
              s < t;
              s++
            ) {
              var a = n[s],
                h = a.texArray,
                u = a.type,
                l = a.size,
                c = a.start,
                a = a.blend;
              o !== h && this.bindAndClearTexArray((o = h)),
                (this.state.blendMode = a),
                r.set(this.state),
                i.drawElements(u, l, i.UNSIGNED_SHORT, 2 * c);
            }
          }),
          (N.prototype.flush = function () {
            0 !== this._vertexCount &&
              ((this._attributeBuffer = this.getAttributeBuffer(
                this._vertexCount
              )),
              (this._indexBuffer = this.getIndexBuffer(this._indexCount)),
              (this._aIndex = 0),
              (this._iIndex = 0),
              (this._dcIndex = 0),
              this.buildTexturesAndDrawCalls(),
              this.updateGeometry(),
              this.drawBatches(),
              (this._bufferSize = 0),
              (this._vertexCount = 0),
              (this._indexCount = 0));
          }),
          (N.prototype.start = function () {
            this.renderer.state.set(this.state),
              this.renderer.shader.bind(this._shader),
              m.settings.CAN_UPLOAD_SAME_BUFFER &&
                this.renderer.geometry.bind(
                  this._packedGeometries[this._flushId]
                );
          }),
          (N.prototype.stop = function () {
            this.flush();
          }),
          (N.prototype.destroy = function () {
            for (var t = 0; t < this._packedGeometryPoolSize; t++)
              this._packedGeometries[t] && this._packedGeometries[t].destroy();
            this.renderer.off('prerender', this.onPrerender, this),
              (this._aBuffers = null),
              (this._iBuffers = null),
              (this._packedGeometries = null),
              (this._attributeBuffer = null),
              (this._indexBuffer = null),
              this._shader && (this._shader.destroy(), (this._shader = null)),
              Bi.prototype.destroy.call(this);
          }),
          (N.prototype.getAttributeBuffer = function (t) {
            var t = g.nextPow2(Math.ceil(t / 8)),
              e = g.log2(t),
              t = 8 * t,
              e =
                (this._aBuffers.length <= e && (this._iBuffers.length = e + 1),
                this._aBuffers[t]);
            return (
              e || (this._aBuffers[t] = e = new Fi(t * this.vertexSize * 4)), e
            );
          }),
          (N.prototype.getIndexBuffer = function (t) {
            var t = g.nextPow2(Math.ceil(t / 12)),
              e = g.log2(t),
              t = 12 * t,
              i =
                (this._iBuffers.length <= e && (this._iBuffers.length = e + 1),
                this._iBuffers[e]);
            return i || (this._iBuffers[e] = i = new Uint16Array(t)), i;
          }),
          (N.prototype.packInterleavedGeometry = function (t, e, i, r, n) {
            for (
              var o = e.uint32View,
                s = e.float32View,
                a = r / this.vertexSize,
                h = t.uvs,
                u = t.indices,
                l = t.vertexData,
                c = t._texture.baseTexture._batchLocation,
                e = Math.min(t.worldAlpha, 1),
                d =
                  e < 1 && t._texture.baseTexture.alphaMode
                    ? g.premultiplyTint(t._tintRGB, e)
                    : t._tintRGB + ((255 * e) << 24),
                p = 0;
              p < l.length;
              p += 2
            )
              (s[r++] = l[p]),
                (s[r++] = l[p + 1]),
                (s[r++] = h[p]),
                (s[r++] = h[p + 1]),
                (o[r++] = d),
                (s[r++] = c);
            for (p = 0; p < u.length; p++) i[n++] = a + u[p];
          }),
          (N._drawCallPool = []),
          (N._textureArrayPool = []);
        var Bi,
          Ui = N;
        function N(t) {
          var e = Bi.call(this, t) || this;
          return (
            (e.shaderGenerator = null),
            (e.geometryClass = null),
            (e.vertexSize = null),
            (e.state = je.for2d()),
            (e.size = 4 * m.settings.SPRITE_BATCH_SIZE),
            (e._vertexCount = 0),
            (e._indexCount = 0),
            (e._bufferedElements = []),
            (e._bufferedTextures = []),
            (e._bufferSize = 0),
            (e._shader = null),
            (e._packedGeometries = []),
            (e._packedGeometryPoolSize = 2),
            (e._flushId = 0),
            (e._aBuffers = {}),
            (e._iBuffers = {}),
            (e.MAX_TEXTURES = 1),
            e.renderer.on('prerender', e.onPrerender, e),
            t.runners.contextChange.add(e),
            (e._dcIndex = 0),
            (e._aIndex = 0),
            (e._iIndex = 0),
            (e._attributeBuffer = null),
            (e._indexBuffer = null),
            (e._tempBoundTextures = []),
            e
          );
        }
        (ki.prototype.generateShader = function (t) {
          if (!this.programCache[t]) {
            for (var e = new Int32Array(t), i = 0; i < t; i++) e[i] = i;
            this.defaultGroupCache[t] = Yt.from({ uSamplers: e }, !0);
            var r = this.fragTemplate;
            (r = (r = r.replace(/%count%/gi, '' + t)).replace(
              /%forloop%/gi,
              this.generateSampleSrc(t)
            )),
              (this.programCache[t] = new Fe(this.vertexSrc, r));
          }
          r = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new h.Matrix(),
            default: this.defaultGroupCache[t],
          };
          return new Be(this.programCache[t], r);
        }),
          (ki.prototype.generateSampleSrc = function (t) {
            for (var e = (e = '') + '\n' + '\n', i = 0; i < t; i++)
              0 < i && (e += '\nelse '),
                i < t - 1 && (e += 'if(vTextureId < ' + i + '.5)'),
                (e =
                  (e += '\n{') +
                  '\n\tcolor = texture2D(uSamplers[' +
                  i +
                  '], vTextureCoord);\n}');
            return (e = e + '\n' + '\n');
          });
        var ji = ki;
        function ki(t, e) {
          if (
            ((this.vertexSrc = t),
            (this.fragTemplate = e),
            (this.programCache = {}),
            (this.defaultGroupCache = {}),
            e.indexOf('%count%') < 0)
          )
            throw new Error('Fragment template must contain "%count%".');
          if (e.indexOf('%forloop%') < 0)
            throw new Error('Fragment template must contain "%forloop%".');
        }
        a(Hi, (Xi = lt));
        var Xi,
          Gi = Hi;
        function Hi(t) {
          void 0 === t && (t = !1);
          var e = Xi.call(this) || this;
          return (
            (e._buffer = new b(null, t, !1)),
            (e._indexBuffer = new b(null, t, !0)),
            e
              .addAttribute('aVertexPosition', e._buffer, 2, !1, y.TYPES.FLOAT)
              .addAttribute('aTextureCoord', e._buffer, 2, !1, y.TYPES.FLOAT)
              .addAttribute('aColor', e._buffer, 4, !0, y.TYPES.UNSIGNED_BYTE)
              .addAttribute('aTextureId', e._buffer, 1, !0, y.TYPES.FLOAT)
              .addIndex(e._indexBuffer),
            e
          );
        }
        var zi =
            'precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n',
          Yi =
            'varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n',
          Vi =
            ((Wi.create = function (t) {
              var e,
                t = Object.assign(
                  {
                    vertex: zi,
                    fragment: Yi,
                    geometryClass: Gi,
                    vertexSize: 6,
                  },
                  t
                ),
                i = t.vertex,
                r = t.fragment,
                n = t.vertexSize,
                o = t.geometryClass;
              return a(s, (e = Ui)), s;
              function s(t) {
                t = e.call(this, t) || this;
                return (
                  (t.shaderGenerator = new ji(i, r)),
                  (t.geometryClass = o),
                  (t.vertexSize = n),
                  t
                );
              }
            }),
            Object.defineProperty(Wi, 'defaultVertexSrc', {
              get: function () {
                return zi;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(Wi, 'defaultFragmentTemplate', {
              get: function () {
                return Yi;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Wi);
        function Wi() {}
        var qi = Vi.create();
        (e.AbstractBatchRenderer = Ui),
          (e.AbstractRenderer = $),
          (e.Attribute = At),
          (e.BaseRenderTexture = vt),
          (e.BaseTexture = d),
          (e.BatchDrawCall = Ri),
          (e.BatchGeometry = Gi),
          (e.BatchPluginFactory = Vi),
          (e.BatchRenderer = qi),
          (e.BatchShaderGenerator = ji),
          (e.BatchTextureArray = Li),
          (e.Buffer = b),
          (e.Filter = ht),
          (e.FilterState = Wt),
          (e.Framebuffer = yt),
          (e.GLFramebuffer = se),
          (e.GLProgram = mi),
          (e.GLTexture = Oi),
          (e.Geometry = lt),
          (e.IGLUniformData = fi),
          (e.MaskData = pe),
          (e.ObjectRenderer = Jt),
          (e.Program = Fe),
          (e.Quad = jt),
          (e.QuadUv = Gt),
          (e.RenderTexture = St),
          (e.RenderTexturePool = It),
          (e.Renderer = Ci),
          (e.Shader = Be),
          (e.SpriteMaskFilter = Ve),
          (e.State = je),
          (e.System = o),
          (e.Texture = u),
          (e.TextureMatrix = He),
          (e.TextureUvs = xt),
          (e.UniformGroup = Yt),
          (e.ViewableBuffer = Fi),
          (e.autoDetectRenderer = function (t) {
            return Ci.create(t);
          }),
          (e.checkMaxIfStatementsInShader = Re),
          (e.defaultFilterVertex =
            'attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n'),
          (e.defaultVertex =
            'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}'),
          (e.resources = t),
          (e.systems = st),
          (e.uniformParsers = Ie);
      },
      {
        '@pixi/constants': 3,
        '@pixi/math': 16,
        '@pixi/runner': 25,
        '@pixi/settings': 26,
        '@pixi/ticker': 33,
        '@pixi/utils': 34,
      },
    ],
    5: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/settings'),
          o = t('@pixi/math'),
          s = t('@pixi/utils'),
          a =
            ((r.settings.SORTABLE_CHILDREN = !1),
            (n.prototype.isEmpty = function () {
              return this.minX > this.maxX || this.minY > this.maxY;
            }),
            (n.prototype.clear = function () {
              (this.minX = 1 / 0),
                (this.minY = 1 / 0),
                (this.maxX = -1 / 0),
                (this.maxY = -1 / 0);
            }),
            (n.prototype.getRectangle = function (t) {
              return this.minX > this.maxX || this.minY > this.maxY
                ? o.Rectangle.EMPTY
                : (((t = t || new o.Rectangle(0, 0, 1, 1)).x = this.minX),
                  (t.y = this.minY),
                  (t.width = this.maxX - this.minX),
                  (t.height = this.maxY - this.minY),
                  t);
            }),
            (n.prototype.addPoint = function (t) {
              (this.minX = Math.min(this.minX, t.x)),
                (this.maxX = Math.max(this.maxX, t.x)),
                (this.minY = Math.min(this.minY, t.y)),
                (this.maxY = Math.max(this.maxY, t.y));
            }),
            (n.prototype.addQuad = function (t) {
              var e = this.minX,
                i = this.minY,
                r = this.maxX,
                n = this.maxY,
                o = t[0],
                s = t[1],
                e = o < e ? o : e,
                i = s < i ? s : i,
                r = r < o ? o : r,
                n = n < s ? s : n;
              (e = (o = t[2]) < e ? o : e),
                (i = (s = t[3]) < i ? s : i),
                (r = r < o ? o : r),
                (n = n < s ? s : n),
                (e = (o = t[4]) < e ? o : e),
                (i = (s = t[5]) < i ? s : i),
                (r = r < o ? o : r),
                (n = n < s ? s : n),
                (o = t[6]),
                (i = (s = t[7]) < i ? s : i),
                (r = r < o ? o : r),
                (n = n < s ? s : n),
                (this.minX = e = o < e ? o : e),
                (this.minY = i),
                (this.maxX = r),
                (this.maxY = n);
            }),
            (n.prototype.addFrame = function (t, e, i, r, n) {
              this.addFrameMatrix(t.worldTransform, e, i, r, n);
            }),
            (n.prototype.addFrameMatrix = function (t, e, i, r, n) {
              var o = t.a,
                s = t.b,
                a = t.c,
                h = t.d,
                u = t.tx,
                t = t.ty,
                l = o * e + a * i + u,
                c = s * e + h * i + t,
                d = l < (d = this.minX) ? l : d,
                p = c < (p = this.minY) ? c : p,
                f = (f = this.maxX) < l ? l : f,
                m = (m = this.maxY) < c ? c : m;
              (d = (l = o * r + a * i + u) < d ? l : d),
                (p = (c = s * r + h * i + t) < p ? c : p),
                (f = f < l ? l : f),
                (m = m < c ? c : m),
                (d = (l = o * e + a * n + u) < d ? l : d),
                (p = (c = s * e + h * n + t) < p ? c : p),
                (m = m < c ? c : m),
                (p = (c = s * r + h * n + t) < p ? c : p),
                (f = (f = f < l ? l : f) < (l = o * r + a * n + u) ? l : f),
                (m = m < c ? c : m),
                (this.minX = d = l < d ? l : d),
                (this.minY = p),
                (this.maxX = f),
                (this.maxY = m);
            }),
            (n.prototype.addVertexData = function (t, e, i) {
              for (
                var r = this.minX,
                  n = this.minY,
                  o = this.maxX,
                  s = this.maxY,
                  a = e;
                a < i;
                a += 2
              )
                var h = t[a],
                  u = t[a + 1],
                  r = h < r ? h : r,
                  n = u < n ? u : n,
                  o = o < h ? h : o,
                  s = s < u ? u : s;
              (this.minX = r),
                (this.minY = n),
                (this.maxX = o),
                (this.maxY = s);
            }),
            (n.prototype.addVertices = function (t, e, i, r) {
              this.addVerticesMatrix(t.worldTransform, e, i, r);
            }),
            (n.prototype.addVerticesMatrix = function (t, e, i, r, n, o) {
              void 0 === n && (n = 0), void 0 === o && (o = n);
              for (
                var s = t.a,
                  a = t.b,
                  h = t.c,
                  u = t.d,
                  l = t.tx,
                  c = t.ty,
                  d = this.minX,
                  p = this.minY,
                  f = this.maxX,
                  m = this.maxY,
                  y = i;
                y < r;
                y += 2
              )
                var g = e[y],
                  v = e[y + 1],
                  _ = s * g + h * v + l,
                  v = u * v + a * g + c,
                  d = Math.min(d, _ - n),
                  f = Math.max(f, _ + n),
                  p = Math.min(p, v - o),
                  m = Math.max(m, v + o);
              (this.minX = d),
                (this.minY = p),
                (this.maxX = f),
                (this.maxY = m);
            }),
            (n.prototype.addBounds = function (t) {
              var e = this.minX,
                i = this.minY,
                r = this.maxX,
                n = this.maxY;
              (this.minX = t.minX < e ? t.minX : e),
                (this.minY = t.minY < i ? t.minY : i),
                (this.maxX = t.maxX > r ? t.maxX : r),
                (this.maxY = t.maxY > n ? t.maxY : n);
            }),
            (n.prototype.addBoundsMask = function (t, e) {
              var i,
                r,
                n,
                o = (t.minX > e.minX ? t : e).minX,
                s = (t.minY > e.minY ? t : e).minY,
                a = (t.maxX < e.maxX ? t : e).maxX,
                t = (t.maxY < e.maxY ? t : e).maxY;
              o <= a &&
                s <= t &&
                ((e = this.minX),
                (i = this.minY),
                (r = this.maxX),
                (n = this.maxY),
                (this.minX = o < e ? o : e),
                (this.minY = s < i ? s : i),
                (this.maxX = r < a ? a : r),
                (this.maxY = n < t ? t : n));
            }),
            (n.prototype.addBoundsMatrix = function (t, e) {
              this.addFrameMatrix(e, t.minX, t.minY, t.maxX, t.maxY);
            }),
            (n.prototype.addBoundsArea = function (t, e) {
              var i,
                r,
                n,
                o = t.minX > e.x ? t.minX : e.x,
                s = t.minY > e.y ? t.minY : e.y,
                a = t.maxX < e.x + e.width ? t.maxX : e.x + e.width,
                t = t.maxY < e.y + e.height ? t.maxY : e.y + e.height;
              o <= a &&
                s <= t &&
                ((e = this.minX),
                (i = this.minY),
                (r = this.maxX),
                (n = this.maxY),
                (this.minX = o < e ? o : e),
                (this.minY = s < i ? s : i),
                (this.maxX = r < a ? a : r),
                (this.maxY = n < t ? t : n));
            }),
            (n.prototype.pad = function (t, e) {
              void 0 === t && (t = 0),
                void 0 === e && (e = t),
                this.isEmpty() ||
                  ((this.minX -= t),
                  (this.maxX += t),
                  (this.minY -= e),
                  (this.maxY += e));
            }),
            (n.prototype.addFramePad = function (t, e, i, r, n, o) {
              (e -= o),
                (i += n),
                (r += o),
                (this.minX = this.minX < (t -= n) ? this.minX : t),
                (this.maxX = this.maxX > i ? this.maxX : i),
                (this.minY = this.minY < e ? this.minY : e),
                (this.maxY = this.maxY > r ? this.maxY : r);
            }),
            n);
        function n() {
          (this.minX = 1 / 0),
            (this.minY = 1 / 0),
            (this.maxX = -1 / 0),
            (this.maxY = -1 / 0),
            (this.rect = null),
            (this.updateID = -1);
        }
        var h = function (t, e) {
          return (h =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        };
        function u(t, e) {
          function i() {
            this.constructor = t;
          }
          h(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        u(c, (l = s.EventEmitter)),
          (c.mixin = function (t) {
            for (var e = Object.keys(t), i = 0; i < e.length; ++i) {
              var r = e[i];
              Object.defineProperty(
                c.prototype,
                r,
                Object.getOwnPropertyDescriptor(t, r)
              );
            }
          }),
          (c.prototype._recursivePostUpdateTransform = function () {
            this.parent
              ? (this.parent._recursivePostUpdateTransform(),
                this.transform.updateTransform(this.parent.transform))
              : this.transform.updateTransform(
                  this._tempDisplayObjectParent.transform
                );
          }),
          (c.prototype.updateTransform = function () {
            this._boundsID++,
              this.transform.updateTransform(this.parent.transform),
              (this.worldAlpha = this.alpha * this.parent.worldAlpha);
          }),
          (c.prototype.getBounds = function (t, e) {
            return (
              t ||
                (this.parent
                  ? (this._recursivePostUpdateTransform(),
                    this.updateTransform())
                  : ((this.parent = this._tempDisplayObjectParent),
                    this.updateTransform(),
                    (this.parent = null))),
              this._bounds.updateID !== this._boundsID &&
                (this.calculateBounds(),
                (this._bounds.updateID = this._boundsID)),
              e ||
                (this._boundsRect || (this._boundsRect = new o.Rectangle()),
                (e = this._boundsRect)),
              this._bounds.getRectangle(e)
            );
          }),
          (c.prototype.getLocalBounds = function (t) {
            t ||
              (this._localBoundsRect ||
                (this._localBoundsRect = new o.Rectangle()),
              (t = this._localBoundsRect)),
              this._localBounds || (this._localBounds = new a());
            var e = this.transform,
              i = this.parent,
              r =
                ((this.parent = null),
                (this.transform = this._tempDisplayObjectParent.transform),
                this._bounds),
              n = this._boundsID,
              t = ((this._bounds = this._localBounds), this.getBounds(!1, t));
            return (
              (this.parent = i),
              (this.transform = e),
              (this._bounds = r),
              (this._bounds.updateID += this._boundsID - n),
              t
            );
          }),
          (c.prototype.toGlobal = function (t, e, i) {
            return (
              (i = void 0 === i ? !1 : i) ||
                (this._recursivePostUpdateTransform(),
                this.parent
                  ? this.displayObjectUpdateTransform()
                  : ((this.parent = this._tempDisplayObjectParent),
                    this.displayObjectUpdateTransform(),
                    (this.parent = null))),
              this.worldTransform.apply(t, e)
            );
          }),
          (c.prototype.toLocal = function (t, e, i, r) {
            return (
              e && (t = e.toGlobal(t, i, r)),
              r ||
                (this._recursivePostUpdateTransform(),
                this.parent
                  ? this.displayObjectUpdateTransform()
                  : ((this.parent = this._tempDisplayObjectParent),
                    this.displayObjectUpdateTransform(),
                    (this.parent = null))),
              this.worldTransform.applyInverse(t, i)
            );
          }),
          (c.prototype.setParent = function (t) {
            if (t && t.addChild) return t.addChild(this), t;
            throw new Error('setParent: Argument must be a Container');
          }),
          (c.prototype.setTransform = function (t, e, i, r, n, o, s, a, h) {
            return (
              void 0 === e && (e = 0),
              void 0 === i && (i = 1),
              void 0 === r && (r = 1),
              void 0 === n && (n = 0),
              void 0 === o && (o = 0),
              void 0 === s && (s = 0),
              void 0 === a && (a = 0),
              void 0 === h && (h = 0),
              (this.position.x = t = void 0 === t ? 0 : t),
              (this.position.y = e),
              (this.scale.x = i || 1),
              (this.scale.y = r || 1),
              (this.rotation = n),
              (this.skew.x = o),
              (this.skew.y = s),
              (this.pivot.x = a),
              (this.pivot.y = h),
              this
            );
          }),
          (c.prototype.destroy = function (t) {
            this.parent && this.parent.removeChild(this),
              this.removeAllListeners(),
              (this.transform = null),
              (this.parent = null),
              (this._bounds = null),
              (this._mask = null),
              (this.filters = null),
              (this.filterArea = null),
              (this.hitArea = null),
              (this.interactive = !1),
              (this.interactiveChildren = !1),
              (this._destroyed = !0);
          }),
          Object.defineProperty(c.prototype, '_tempDisplayObjectParent', {
            get: function () {
              return (
                null === this.tempDisplayObjectParent &&
                  (this.tempDisplayObjectParent = new p()),
                this.tempDisplayObjectParent
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          (c.prototype.enableTempParent = function () {
            var t = this.parent;
            return (this.parent = this._tempDisplayObjectParent), t;
          }),
          (c.prototype.disableTempParent = function (t) {
            this.parent = t;
          }),
          Object.defineProperty(c.prototype, 'x', {
            get: function () {
              return this.position.x;
            },
            set: function (t) {
              this.transform.position.x = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'y', {
            get: function () {
              return this.position.y;
            },
            set: function (t) {
              this.transform.position.y = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'worldTransform', {
            get: function () {
              return this.transform.worldTransform;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'localTransform', {
            get: function () {
              return this.transform.localTransform;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'position', {
            get: function () {
              return this.transform.position;
            },
            set: function (t) {
              this.transform.position.copyFrom(t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'scale', {
            get: function () {
              return this.transform.scale;
            },
            set: function (t) {
              this.transform.scale.copyFrom(t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'pivot', {
            get: function () {
              return this.transform.pivot;
            },
            set: function (t) {
              this.transform.pivot.copyFrom(t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'skew', {
            get: function () {
              return this.transform.skew;
            },
            set: function (t) {
              this.transform.skew.copyFrom(t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'rotation', {
            get: function () {
              return this.transform.rotation;
            },
            set: function (t) {
              this.transform.rotation = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'angle', {
            get: function () {
              return this.transform.rotation * o.RAD_TO_DEG;
            },
            set: function (t) {
              this.transform.rotation = t * o.DEG_TO_RAD;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'zIndex', {
            get: function () {
              return this._zIndex;
            },
            set: function (t) {
              (this._zIndex = t), this.parent && (this.parent.sortDirty = !0);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'worldVisible', {
            get: function () {
              var t = this;
              do {
                if (!t.visible) return !1;
              } while ((t = t.parent));
              return !0;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(c.prototype, 'mask', {
            get: function () {
              return this._mask;
            },
            set: function (t) {
              var e;
              this._mask &&
                (((e = this._mask.maskObject || this._mask).renderable = !0),
                (e.isMask = !1)),
                (this._mask = t),
                this._mask &&
                  (((e = this._mask.maskObject || this._mask).renderable = !1),
                  (e.isMask = !0));
            },
            enumerable: !1,
            configurable: !0,
          });
        var l,
          t = c;
        function c() {
          var t = l.call(this) || this;
          return (
            (t.tempDisplayObjectParent = null),
            (t.transform = new o.Transform()),
            (t.alpha = 1),
            (t.visible = !0),
            (t.renderable = !0),
            (t.parent = null),
            (t.worldAlpha = 1),
            (t._lastSortedIndex = 0),
            (t._zIndex = 0),
            (t.filterArea = null),
            (t.filters = null),
            (t._enabledFilters = null),
            (t._bounds = new a()),
            (t._localBounds = null),
            (t._boundsID = 0),
            (t._boundsRect = null),
            (t._localBoundsRect = null),
            (t._mask = null),
            (t._destroyed = !1),
            (t.isSprite = !1),
            (t.isMask = !1),
            t
          );
        }
        u(f, (d = t));
        var d,
          p = f;
        function f() {
          var t = (null !== d && d.apply(this, arguments)) || this;
          return (t.sortDirty = null), t;
        }
        function m(t, e) {
          return t.zIndex === e.zIndex
            ? t._lastSortedIndex - e._lastSortedIndex
            : t.zIndex - e.zIndex;
        }
        t.prototype.displayObjectUpdateTransform = t.prototype.updateTransform;
        u(v, (y = t)),
          (v.prototype.onChildrenChange = function (t) {}),
          (v.prototype.addChild = function () {
            for (var t = arguments, e = [], i = 0; i < arguments.length; i++)
              e[i] = t[i];
            if (1 < e.length)
              for (var r = 0; r < e.length; r++) this.addChild(e[r]);
            else {
              var n = e[0];
              n.parent && n.parent.removeChild(n),
                ((n.parent = this).sortDirty = !0),
                (n.transform._parentID = -1),
                this.children.push(n),
                this._boundsID++,
                this.onChildrenChange(this.children.length - 1),
                this.emit('childAdded', n, this, this.children.length - 1),
                n.emit('added', this);
            }
            return e[0];
          }),
          (v.prototype.addChildAt = function (t, e) {
            if (e < 0 || e > this.children.length)
              throw new Error(
                t +
                  'addChildAt: The index ' +
                  e +
                  ' supplied is out of bounds ' +
                  this.children.length
              );
            return (
              t.parent && t.parent.removeChild(t),
              ((t.parent = this).sortDirty = !0),
              (t.transform._parentID = -1),
              this.children.splice(e, 0, t),
              this._boundsID++,
              this.onChildrenChange(e),
              t.emit('added', this),
              this.emit('childAdded', t, this, e),
              t
            );
          }),
          (v.prototype.swapChildren = function (t, e) {
            var i, r;
            t !== e &&
              ((i = this.getChildIndex(t)),
              (r = this.getChildIndex(e)),
              (this.children[i] = e),
              (this.children[r] = t),
              this.onChildrenChange(i < r ? i : r));
          }),
          (v.prototype.getChildIndex = function (t) {
            t = this.children.indexOf(t);
            if (-1 === t)
              throw new Error(
                'The supplied DisplayObject must be a child of the caller'
              );
            return t;
          }),
          (v.prototype.setChildIndex = function (t, e) {
            if (e < 0 || e >= this.children.length)
              throw new Error(
                'The index ' +
                  e +
                  ' supplied is out of bounds ' +
                  this.children.length
              );
            var i = this.getChildIndex(t);
            s.removeItems(this.children, i, 1),
              this.children.splice(e, 0, t),
              this.onChildrenChange(e);
          }),
          (v.prototype.getChildAt = function (t) {
            if (t < 0 || t >= this.children.length)
              throw new Error('getChildAt: Index (' + t + ') does not exist.');
            return this.children[t];
          }),
          (v.prototype.removeChild = function () {
            for (var t = arguments, e = [], i = 0; i < arguments.length; i++)
              e[i] = t[i];
            if (1 < e.length)
              for (var r = 0; r < e.length; r++) this.removeChild(e[r]);
            else {
              var n = e[0],
                o = this.children.indexOf(n);
              if (-1 === o) return null;
              (n.parent = null),
                (n.transform._parentID = -1),
                s.removeItems(this.children, o, 1),
                this._boundsID++,
                this.onChildrenChange(o),
                n.emit('removed', this),
                this.emit('childRemoved', n, this, o);
            }
            return e[0];
          }),
          (v.prototype.removeChildAt = function (t) {
            var e = this.getChildAt(t);
            return (
              (e.parent = null),
              (e.transform._parentID = -1),
              s.removeItems(this.children, t, 1),
              this._boundsID++,
              this.onChildrenChange(t),
              e.emit('removed', this),
              this.emit('childRemoved', e, this, t),
              e
            );
          }),
          (v.prototype.removeChildren = function (t, e) {
            var i = (t = void 0 === t ? 0 : t),
              r = (e = void 0 === e ? this.children.length : e) - i;
            if (0 < r && r <= e) {
              for (var n = this.children.splice(i, r), o = 0; o < n.length; ++o)
                (n[o].parent = null),
                  n[o].transform && (n[o].transform._parentID = -1);
              this._boundsID++, this.onChildrenChange(t);
              for (o = 0; o < n.length; ++o)
                n[o].emit('removed', this),
                  this.emit('childRemoved', n[o], this, o);
              return n;
            }
            if (0 == r && 0 === this.children.length) return [];
            throw new RangeError(
              'removeChildren: numeric values are outside the acceptable range.'
            );
          }),
          (v.prototype.sortChildren = function () {
            for (var t = !1, e = 0, i = this.children.length; e < i; ++e) {
              var r = this.children[e];
              (r._lastSortedIndex = e), t || 0 === r.zIndex || (t = !0);
            }
            t && 1 < this.children.length && this.children.sort(m),
              (this.sortDirty = !1);
          }),
          (v.prototype.updateTransform = function () {
            this.sortableChildren && this.sortDirty && this.sortChildren(),
              this._boundsID++,
              this.transform.updateTransform(this.parent.transform),
              (this.worldAlpha = this.alpha * this.parent.worldAlpha);
            for (var t = 0, e = this.children.length; t < e; ++t) {
              var i = this.children[t];
              i.visible && i.updateTransform();
            }
          }),
          (v.prototype.calculateBounds = function () {
            this._bounds.clear(), this._calculateBounds();
            for (var t = 0; t < this.children.length; t++) {
              var e,
                i = this.children[t];
              i.visible &&
                i.renderable &&
                (i.calculateBounds(),
                i._mask
                  ? ((e = i._mask.maskObject || i._mask).calculateBounds(),
                    this._bounds.addBoundsMask(i._bounds, e._bounds))
                  : i.filterArea
                  ? this._bounds.addBoundsArea(i._bounds, i.filterArea)
                  : this._bounds.addBounds(i._bounds));
            }
            this._bounds.updateID = this._boundsID;
          }),
          (v.prototype.getLocalBounds = function (t, e) {
            void 0 === e && (e = !1);
            t = y.prototype.getLocalBounds.call(this, t);
            if (!e)
              for (var i = 0, r = this.children.length; i < r; ++i) {
                var n = this.children[i];
                n.visible && n.updateTransform();
              }
            return t;
          }),
          (v.prototype._calculateBounds = function () {}),
          (v.prototype.render = function (t) {
            if (this.visible && !(this.worldAlpha <= 0) && this.renderable)
              if (this._mask || (this.filters && this.filters.length))
                this.renderAdvanced(t);
              else {
                this._render(t);
                for (var e = 0, i = this.children.length; e < i; ++e)
                  this.children[e].render(t);
              }
          }),
          (v.prototype.renderAdvanced = function (t) {
            t.batch.flush();
            var e = this.filters,
              i = this._mask;
            if (e) {
              this._enabledFilters || (this._enabledFilters = []);
              for (var r = (this._enabledFilters.length = 0); r < e.length; r++)
                e[r].enabled && this._enabledFilters.push(e[r]);
              this._enabledFilters.length &&
                t.filter.push(this, this._enabledFilters);
            }
            i && t.mask.push(this, this._mask), this._render(t);
            for (var r = 0, n = this.children.length; r < n; r++)
              this.children[r].render(t);
            t.batch.flush(),
              i && t.mask.pop(this),
              e &&
                this._enabledFilters &&
                this._enabledFilters.length &&
                t.filter.pop();
          }),
          (v.prototype._render = function (t) {}),
          (v.prototype.destroy = function (t) {
            y.prototype.destroy.call(this), (this.sortDirty = !1);
            var e = 'boolean' == typeof t ? t : t && t.children,
              i = this.removeChildren(0, this.children.length);
            if (e) for (var r = 0; r < i.length; ++r) i[r].destroy(t);
          }),
          Object.defineProperty(v.prototype, 'width', {
            get: function () {
              return this.scale.x * this.getLocalBounds().width;
            },
            set: function (t) {
              var e = this.getLocalBounds().width;
              (this.scale.x = 0 !== e ? t / e : 1), (this._width = t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(v.prototype, 'height', {
            get: function () {
              return this.scale.y * this.getLocalBounds().height;
            },
            set: function (t) {
              var e = this.getLocalBounds().height;
              (this.scale.y = 0 !== e ? t / e : 1), (this._height = t);
            },
            enumerable: !1,
            configurable: !0,
          });
        var y,
          g = v;
        function v() {
          var t = y.call(this) || this;
          return (
            (t.children = []),
            (t.sortableChildren = r.settings.SORTABLE_CHILDREN),
            (t.sortDirty = !1),
            t
          );
        }
        (g.prototype.containerUpdateTransform = g.prototype.updateTransform),
          (i.Bounds = a),
          (i.Container = g),
          (i.DisplayObject = t),
          (i.TemporaryDisplayObject = p);
      },
      { '@pixi/math': 16, '@pixi/settings': 26, '@pixi/utils': 34 },
    ],
    6: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var l = t('@pixi/utils'),
          r = t('@pixi/math'),
          c = t('@pixi/core'),
          d = new r.Rectangle();
        function p(t) {
          (this.renderer = t).extract = this;
        }
        (p.prototype.image = function (t, e, i) {
          var r = new Image();
          return (r.src = this.base64(t, e, i)), r;
        }),
          (p.prototype.base64 = function (t, e, i) {
            return this.canvas(t).toDataURL(e, i);
          }),
          (p.prototype.canvas = function (t) {
            var e,
              i,
              r = this.renderer,
              n = !1,
              o = !1,
              t =
                (t &&
                  (t instanceof c.RenderTexture
                    ? (e = t)
                    : ((e = this.renderer.generateTexture(t)), (o = !0))),
                e
                  ? ((i = e.baseTexture.resolution),
                    (u = e.frame),
                    (n = !1),
                    r.renderTexture.bind(e))
                  : ((i = this.renderer.resolution),
                    (n = !0),
                    ((u = d).width = this.renderer.width),
                    (u.height = this.renderer.height),
                    r.renderTexture.bind(null)),
                Math.floor(u.width * i + 1e-4)),
              s = Math.floor(u.height * i + 1e-4),
              a = new l.CanvasRenderTarget(t, s, 1),
              h = new Uint8Array(4 * t * s),
              r = r.gl,
              u =
                (r.readPixels(
                  u.x * i,
                  u.y * i,
                  t,
                  s,
                  r.RGBA,
                  r.UNSIGNED_BYTE,
                  h
                ),
                a.context.getImageData(0, 0, t, s));
            return (
              p.arrayPostDivide(h, u.data),
              a.context.putImageData(u, 0, 0),
              n &&
                ((i = new l.CanvasRenderTarget(
                  a.width,
                  a.height,
                  1
                )).context.scale(1, -1),
                i.context.drawImage(a.canvas, 0, -s),
                a.destroy(),
                (a = i)),
              o && e.destroy(!0),
              a.canvas
            );
          }),
          (p.prototype.pixels = function (t) {
            var e,
              i,
              r,
              n = this.renderer,
              o = !1,
              t =
                (t &&
                  (t instanceof c.RenderTexture
                    ? (r = t)
                    : ((r = this.renderer.generateTexture(t)), (o = !0))),
                r
                  ? ((e = r.baseTexture.resolution),
                    (i = r.frame),
                    n.renderTexture.bind(r))
                  : ((e = n.resolution),
                    ((i = d).width = n.width),
                    (i.height = n.height),
                    n.renderTexture.bind(null)),
                i.width * e),
              s = i.height * e,
              a = new Uint8Array(4 * t * s),
              n = n.gl;
            return (
              n.readPixels(i.x * e, i.y * e, t, s, n.RGBA, n.UNSIGNED_BYTE, a),
              o && r.destroy(!0),
              p.arrayPostDivide(a, a),
              a
            );
          }),
          (p.prototype.destroy = function () {
            (this.renderer.extract = null), (this.renderer = null);
          }),
          (p.arrayPostDivide = function (t, e) {
            for (var i = 0; i < t.length; i += 4) {
              var r = (e[i + 3] = t[i + 3]);
              0 !== r
                ? ((e[i] = Math.round(Math.min((255 * t[i]) / r, 255))),
                  (e[i + 1] = Math.round(Math.min((255 * t[i + 1]) / r, 255))),
                  (e[i + 2] = Math.round(Math.min((255 * t[i + 2]) / r, 255))))
                : ((e[i] = t[i]), (e[i + 1] = t[i + 1]), (e[i + 2] = t[i + 2]));
            }
          }),
          (i.Extract = p);
      },
      { '@pixi/core': 4, '@pixi/math': 16, '@pixi/utils': 34 },
    ],
    7: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/core'),
          n = function (t, e) {
            return (n =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (o = r.Filter),
          n((s = h), (t = o)),
          (s.prototype =
            null === t
              ? Object.create(t)
              : ((a.prototype = t.prototype), new a())),
          Object.defineProperty(h.prototype, 'alpha', {
            get: function () {
              return this.uniforms.uAlpha;
            },
            set: function (t) {
              this.uniforms.uAlpha = t;
            },
            enumerable: !1,
            configurable: !0,
          });
        var o,
          s,
          t = h;
        function a() {
          this.constructor = s;
        }
        function h(t) {
          void 0 === t && (t = 1);
          var e =
            o.call(
              this,
              r.defaultVertex,
              'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n',
              { uAlpha: 1 }
            ) || this;
          return (e.alpha = t), e;
        }
        i.AlphaFilter = t;
      },
      { '@pixi/core': 4 },
    ],
    8: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/core'),
          a = t('@pixi/settings'),
          n = function (t, e) {
            return (n =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        function o(t, e) {
          function i() {
            this.constructor = t;
          }
          n(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        var h =
          '\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n\n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }';
        var l,
          u = {
            5: [0.153388, 0.221461, 0.250301],
            7: [0.071303, 0.131514, 0.189879, 0.214607],
            9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
            11: [0.0093, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
            13: [
              0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868,
              0.197641,
            ],
            15: [
              489e-6, 0.002403, 0.009246, 0.02784, 0.065602, 0.120999, 0.174697,
              0.197448,
            ],
          },
          c = [
            'varying vec2 vBlurTexCoords[%size%];',
            'uniform sampler2D uSampler;',
            'void main(void)',
            '{',
            '    gl_FragColor = vec4(0.0);',
            '    %blur%',
            '}',
          ].join('\n');
        ((t = {
          NORMAL: 0,
          0: 'NORMAL',
          ADD: 1,
          1: 'ADD',
          MULTIPLY: 2,
          2: 'MULTIPLY',
          SCREEN: 3,
          3: 'SCREEN',
          OVERLAY: 4,
          4: 'OVERLAY',
          DARKEN: 5,
          5: 'DARKEN',
          LIGHTEN: 6,
          6: 'LIGHTEN',
          COLOR_DODGE: 7,
          7: 'COLOR_DODGE',
          COLOR_BURN: 8,
          8: 'COLOR_BURN',
          HARD_LIGHT: 9,
          9: 'HARD_LIGHT',
          SOFT_LIGHT: 10,
          10: 'SOFT_LIGHT',
          DIFFERENCE: 11,
          11: 'DIFFERENCE',
          EXCLUSION: 12,
          12: 'EXCLUSION',
          HUE: 13,
          13: 'HUE',
          SATURATION: 14,
          14: 'SATURATION',
          COLOR: 15,
          15: 'COLOR',
          LUMINOSITY: 16,
          16: 'LUMINOSITY',
          NORMAL_NPM: 17,
          17: 'NORMAL_NPM',
          ADD_NPM: 18,
          18: 'ADD_NPM',
          SCREEN_NPM: 19,
          19: 'SCREEN_NPM',
          NONE: 20,
          20: 'NONE',
          SRC_OVER: 0,
        })[0] = 'SRC_OVER'),
          (t[(t.SRC_IN = 21)] = 'SRC_IN'),
          (t[(t.SRC_OUT = 22)] = 'SRC_OUT'),
          (t[(t.SRC_ATOP = 23)] = 'SRC_ATOP'),
          (t[(t.DST_OVER = 24)] = 'DST_OVER'),
          (t[(t.DST_IN = 25)] = 'DST_IN'),
          (t[(t.DST_OUT = 26)] = 'DST_OUT'),
          (t[(t.DST_ATOP = 27)] = 'DST_ATOP'),
          (t[(t.ERASE = 26)] = 'ERASE'),
          (t[(t.SUBTRACT = 28)] = 'SUBTRACT'),
          (t[(t.XOR = 29)] = 'XOR'),
          ((t = {
            NPM: 0,
            0: 'NPM',
            UNPACK: 1,
            1: 'UNPACK',
            PMA: 2,
            2: 'PMA',
            NO_PREMULTIPLIED_ALPHA: 0,
          })[0] = 'NO_PREMULTIPLIED_ALPHA'),
          (t[(t.PREMULTIPLY_ON_UPLOAD = 1)] = 'PREMULTIPLY_ON_UPLOAD'),
          (t[(t.PREMULTIPLY_ALPHA = 2)] = 'PREMULTIPLY_ALPHA'),
          ((t = l = l || {})[(t.NO = 0)] = 'NO'),
          (t[(t.YES = 1)] = 'YES'),
          (t[(t.AUTO = 2)] = 'AUTO'),
          (t[(t.BLEND = 0)] = 'BLEND'),
          (t[(t.CLEAR = 1)] = 'CLEAR'),
          (t[(t.BLIT = 2)] = 'BLIT');
        o(p, (d = r.Filter)),
          (p.prototype.apply = function (t, e, i, r) {
            if (
              (i
                ? this.horizontal
                  ? (this.uniforms.strength =
                      (1 / i.width) * (i.width / e.width))
                  : (this.uniforms.strength =
                      (1 / i.height) * (i.height / e.height))
                : this.horizontal
                ? (this.uniforms.strength =
                    (1 / t.renderer.width) * (t.renderer.width / e.width))
                : (this.uniforms.strength =
                    (1 / t.renderer.height) * (t.renderer.height / e.height)),
              (this.uniforms.strength *= this.strength),
              (this.uniforms.strength /= this.passes),
              1 === this.passes)
            )
              t.applyFilter(this, e, i, r);
            else {
              var n = t.getFilterTexture(),
                o = t.renderer,
                s = e,
                a = n;
              (this.state.blend = !1), t.applyFilter(this, s, a, l.CLEAR);
              for (var h = 1; h < this.passes - 1; h++) {
                t.bindAndClear(s, l.BLIT);
                var u = (this.uniforms.uSampler = a),
                  a = s,
                  s = u;
                o.shader.bind(this), o.geometry.draw(5);
              }
              (this.state.blend = !0),
                t.applyFilter(this, a, i, r),
                t.returnFilterTexture(n);
            }
          }),
          Object.defineProperty(p.prototype, 'blur', {
            get: function () {
              return this.strength;
            },
            set: function (t) {
              (this.padding = 1 + 2 * Math.abs(t)), (this.strength = t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(p.prototype, 'quality', {
            get: function () {
              return this._quality;
            },
            set: function (t) {
              (this._quality = t), (this.passes = t);
            },
            enumerable: !1,
            configurable: !0,
          });
        var d,
          s = p;
        function p(t, e, i, r, n) {
          void 0 === e && (e = 8),
            void 0 === i && (i = 4),
            void 0 === r && (r = a.settings.FILTER_RESOLUTION);
          var o = this,
            s = (function (t, e) {
              for (
                var i = Math.ceil(t / 2),
                  r = h,
                  n = '',
                  o = e
                    ? 'vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);'
                    : 'vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);',
                  s = 0;
                s < t;
                s++
              )
                n =
                  n +
                  o
                    .replace('%index%', s.toString())
                    .replace('%sampleIndex%', s - (i - 1) + '.0') +
                  '\n';
              return (r = (r = r.replace('%blur%', n)).replace(
                '%size%',
                t.toString()
              ));
            })((n = void 0 === n ? 5 : n), t),
            n = (function (t) {
              for (var e = u[t], i = e.length, r = c, n = '', o = 0; o < t; o++)
                var s =
                    'gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;'.replace(
                      '%index%',
                      o.toString()
                    ),
                  a = o,
                  n =
                    n +
                    (s = s.replace(
                      '%value%',
                      e[(a = i <= o ? t - o - 1 : a)].toString()
                    )) +
                    '\n';
              return (r = (r = r.replace('%blur%', n)).replace(
                '%size%',
                t.toString()
              ));
            })(n);
          return (
            ((o = d.call(this, s, n) || this).horizontal = t),
            (o.resolution = r),
            (o._quality = 0),
            (o.quality = i),
            (o.blur = e),
            o
          );
        }
        o(m, (f = r.Filter)),
          (m.prototype.apply = function (t, e, i, r) {
            var n = Math.abs(this.blurXFilter.strength),
              o = Math.abs(this.blurYFilter.strength);
            n && o
              ? ((n = t.getFilterTexture()),
                this.blurXFilter.apply(t, e, n, l.CLEAR),
                this.blurYFilter.apply(t, n, i, r),
                t.returnFilterTexture(n))
              : (o ? this.blurYFilter : this.blurXFilter).apply(t, e, i, r);
          }),
          (m.prototype.updatePadding = function () {
            this._repeatEdgePixels
              ? (this.padding = 0)
              : (this.padding =
                  2 *
                  Math.max(
                    Math.abs(this.blurXFilter.strength),
                    Math.abs(this.blurYFilter.strength)
                  ));
          }),
          Object.defineProperty(m.prototype, 'blur', {
            get: function () {
              return this.blurXFilter.blur;
            },
            set: function (t) {
              (this.blurXFilter.blur = this.blurYFilter.blur = t),
                this.updatePadding();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(m.prototype, 'quality', {
            get: function () {
              return this.blurXFilter.quality;
            },
            set: function (t) {
              this.blurXFilter.quality = this.blurYFilter.quality = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(m.prototype, 'blurX', {
            get: function () {
              return this.blurXFilter.blur;
            },
            set: function (t) {
              (this.blurXFilter.blur = t), this.updatePadding();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(m.prototype, 'blurY', {
            get: function () {
              return this.blurYFilter.blur;
            },
            set: function (t) {
              (this.blurYFilter.blur = t), this.updatePadding();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(m.prototype, 'blendMode', {
            get: function () {
              return this.blurYFilter.blendMode;
            },
            set: function (t) {
              this.blurYFilter.blendMode = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(m.prototype, 'repeatEdgePixels', {
            get: function () {
              return this._repeatEdgePixels;
            },
            set: function (t) {
              (this._repeatEdgePixels = t), this.updatePadding();
            },
            enumerable: !1,
            configurable: !0,
          });
        var f,
          t = m;
        function m(t, e, i, r) {
          void 0 === t && (t = 8),
            void 0 === e && (e = 4),
            void 0 === i && (i = a.settings.FILTER_RESOLUTION),
            void 0 === r && (r = 5);
          var n = f.call(this) || this;
          return (
            (n.blurXFilter = new s(!0, t, e, i, r)),
            (n.blurYFilter = new s(!1, t, e, i, r)),
            (n.resolution = i),
            (n.quality = e),
            (n.blur = t),
            (n.repeatEdgePixels = !1),
            n
          );
        }
        (i.BlurFilter = t), (i.BlurFilterPass = s);
      },
      { '@pixi/core': 4, '@pixi/settings': 26 },
    ],
    9: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/core'),
          n = function (t, e) {
            return (n =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (o = r.Filter),
          n((s = h), (t = o)),
          (s.prototype =
            null === t
              ? Object.create(t)
              : ((a.prototype = t.prototype), new a())),
          (h.prototype._loadMatrix = function (t, e) {
            var i = t;
            (e = void 0 === e ? !1 : e) &&
              (this._multiply(i, this.uniforms.m, t),
              (i = this._colorMatrix(i))),
              (this.uniforms.m = i);
          }),
          (h.prototype._multiply = function (t, e, i) {
            return (
              (t[0] = e[0] * i[0] + e[1] * i[5] + e[2] * i[10] + e[3] * i[15]),
              (t[1] = e[0] * i[1] + e[1] * i[6] + e[2] * i[11] + e[3] * i[16]),
              (t[2] = e[0] * i[2] + e[1] * i[7] + e[2] * i[12] + e[3] * i[17]),
              (t[3] = e[0] * i[3] + e[1] * i[8] + e[2] * i[13] + e[3] * i[18]),
              (t[4] =
                e[0] * i[4] + e[1] * i[9] + e[2] * i[14] + e[3] * i[19] + e[4]),
              (t[5] = e[5] * i[0] + e[6] * i[5] + e[7] * i[10] + e[8] * i[15]),
              (t[6] = e[5] * i[1] + e[6] * i[6] + e[7] * i[11] + e[8] * i[16]),
              (t[7] = e[5] * i[2] + e[6] * i[7] + e[7] * i[12] + e[8] * i[17]),
              (t[8] = e[5] * i[3] + e[6] * i[8] + e[7] * i[13] + e[8] * i[18]),
              (t[9] =
                e[5] * i[4] + e[6] * i[9] + e[7] * i[14] + e[8] * i[19] + e[9]),
              (t[10] =
                e[10] * i[0] + e[11] * i[5] + e[12] * i[10] + e[13] * i[15]),
              (t[11] =
                e[10] * i[1] + e[11] * i[6] + e[12] * i[11] + e[13] * i[16]),
              (t[12] =
                e[10] * i[2] + e[11] * i[7] + e[12] * i[12] + e[13] * i[17]),
              (t[13] =
                e[10] * i[3] + e[11] * i[8] + e[12] * i[13] + e[13] * i[18]),
              (t[14] =
                e[10] * i[4] +
                e[11] * i[9] +
                e[12] * i[14] +
                e[13] * i[19] +
                e[14]),
              (t[15] =
                e[15] * i[0] + e[16] * i[5] + e[17] * i[10] + e[18] * i[15]),
              (t[16] =
                e[15] * i[1] + e[16] * i[6] + e[17] * i[11] + e[18] * i[16]),
              (t[17] =
                e[15] * i[2] + e[16] * i[7] + e[17] * i[12] + e[18] * i[17]),
              (t[18] =
                e[15] * i[3] + e[16] * i[8] + e[17] * i[13] + e[18] * i[18]),
              (t[19] =
                e[15] * i[4] +
                e[16] * i[9] +
                e[17] * i[14] +
                e[18] * i[19] +
                e[19]),
              t
            );
          }),
          (h.prototype._colorMatrix = function (t) {
            t = new Float32Array(t);
            return (
              (t[4] /= 255), (t[9] /= 255), (t[14] /= 255), (t[19] /= 255), t
            );
          }),
          (h.prototype.brightness = function (t, e) {
            this._loadMatrix(
              [t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, 1, 0],
              e
            );
          }),
          (h.prototype.greyscale = function (t, e) {
            this._loadMatrix(
              [t, t, t, 0, 0, t, t, t, 0, 0, t, t, t, 0, 0, 0, 0, 0, 1, 0],
              e
            );
          }),
          (h.prototype.blackAndWhite = function (t) {
            this._loadMatrix(
              [
                0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0,
                0, 0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.hue = function (t, e) {
            t = ((t || 0) / 180) * Math.PI;
            var i = Math.cos(t),
              t = Math.sin(t),
              r = 1 / 3,
              n = (0, Math.sqrt)(r);
            this._loadMatrix(
              [
                i + (1 - i) * r,
                r * (1 - i) - n * t,
                r * (1 - i) + n * t,
                0,
                0,
                r * (1 - i) + n * t,
                i + r * (1 - i),
                r * (1 - i) - n * t,
                0,
                0,
                r * (1 - i) - n * t,
                r * (1 - i) + n * t,
                i + r * (1 - i),
                0,
                0,
                0,
                0,
                0,
                1,
                0,
              ],
              e
            );
          }),
          (h.prototype.contrast = function (t, e) {
            var t = (t || 0) + 1,
              i = -0.5 * (t - 1);
            this._loadMatrix(
              [t, 0, 0, 0, i, 0, t, 0, 0, i, 0, 0, t, 0, i, 0, 0, 0, 1, 0],
              e
            );
          }),
          (h.prototype.saturate = function (t, e) {
            var t = (2 * (t = void 0 === t ? 0 : t)) / 3 + 1,
              i = -0.5 * (t - 1);
            this._loadMatrix(
              [t, i, i, 0, 0, i, t, i, 0, 0, i, i, t, 0, 0, 0, 0, 0, 1, 0],
              e
            );
          }),
          (h.prototype.desaturate = function () {
            this.saturate(-1);
          }),
          (h.prototype.negative = function (t) {
            this._loadMatrix(
              [-1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, 0],
              t
            );
          }),
          (h.prototype.sepia = function (t) {
            this._loadMatrix(
              [
                0.393, 0.7689999, 0.18899999, 0, 0, 0.349, 0.6859999,
                0.16799999, 0, 0, 0.272, 0.5339999, 0.13099999, 0, 0, 0, 0, 0,
                1, 0,
              ],
              t
            );
          }),
          (h.prototype.technicolor = function (t) {
            this._loadMatrix(
              [
                1.9125277891456083, -0.8545344976951645, -0.09155508482755585,
                0, 11.793603434377337, -0.3087833385928097, 1.7658908555458428,
                -0.10601743074722245, 0, -70.35205161461398, -0.231103377548616,
                -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138,
                0, 0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.polaroid = function (t) {
            this._loadMatrix(
              [
                1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0,
                -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.toBGR = function (t) {
            this._loadMatrix(
              [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
              t
            );
          }),
          (h.prototype.kodachrome = function (t) {
            this._loadMatrix(
              [
                1.1285582396593525, -0.3967382283601348, -0.03992559172921793,
                0, 63.72958762196502, -0.16404339962244616, 1.0835251566291304,
                -0.05498805115633132, 0, 24.732407896706203,
                -0.16786010706155763, -0.5603416277695248, 1.6014850761964943,
                0, 35.62982807460946, 0, 0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.browni = function (t) {
            this._loadMatrix(
              [
                0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0,
                47.43192855600873, -0.037703249837783157, 0.8609577587992641,
                0.15059552388459913, 0, -36.96841498319127, 0.24113635128153335,
                -0.07441037908422492, 0.44972182064877153, 0,
                -7.562075277591283, 0, 0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.vintage = function (t) {
            this._loadMatrix(
              [
                0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0,
                9.651285835294123, 0.02578397704808868, 0.6441188644374771,
                0.03259127616149294, 0, 7.462829176470591, 0.0466055556782719,
                -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296,
                0, 0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.colorTone = function (t, e, i, r, n) {
            var o = (((i = i || 16770432) >> 16) & 255) / 255,
              s = ((i >> 8) & 255) / 255,
              i = (255 & i) / 255,
              a = (((r = r || 3375104) >> 16) & 255) / 255,
              h = ((r >> 8) & 255) / 255,
              r = (255 & r) / 255;
            this._loadMatrix(
              [
                0.3,
                0.59,
                0.11,
                0,
                0,
                o,
                s,
                i,
                (t = t || 0.2),
                0,
                a,
                h,
                r,
                (e = e || 0.15),
                0,
                o - a,
                s - h,
                i - r,
                0,
                0,
              ],
              n
            );
          }),
          (h.prototype.night = function (t, e) {
            this._loadMatrix(
              [
                -2 * (t = t || 0.1),
                -t,
                0,
                0,
                0,
                -t,
                0,
                t,
                0,
                0,
                0,
                t,
                2 * t,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
              ],
              e
            );
          }),
          (h.prototype.predator = function (t, e) {
            this._loadMatrix(
              [
                11.224130630493164 * t,
                -4.794486999511719 * t,
                -2.8746118545532227 * t,
                0 * t,
                0.40342438220977783 * t,
                -3.6330697536468506 * t,
                9.193157196044922 * t,
                -2.951810836791992 * t,
                0 * t,
                -1.316135048866272 * t,
                -3.2184197902679443 * t,
                -4.2375030517578125 * t,
                7.476448059082031 * t,
                0 * t,
                0.8044459223747253 * t,
                0,
                0,
                0,
                1,
                0,
              ],
              e
            );
          }),
          (h.prototype.lsd = function (t) {
            this._loadMatrix(
              [
                2, -0.4, 0.5, 0, 0, -0.5, 2, -0.4, 0, 0, -0.4, -0.5, 3, 0, 0, 0,
                0, 0, 1, 0,
              ],
              t
            );
          }),
          (h.prototype.reset = function () {
            this._loadMatrix(
              [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
              !1
            );
          }),
          Object.defineProperty(h.prototype, 'matrix', {
            get: function () {
              return this.uniforms.m;
            },
            set: function (t) {
              this.uniforms.m = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(h.prototype, 'alpha', {
            get: function () {
              return this.uniforms.uAlpha;
            },
            set: function (t) {
              this.uniforms.uAlpha = t;
            },
            enumerable: !1,
            configurable: !0,
          });
        var o,
          s,
          t = h;
        function a() {
          this.constructor = s;
        }
        function h() {
          var t = this,
            e = {
              m: new Float32Array([
                1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
              ]),
              uAlpha: 1,
            };
          return (
            ((t =
              o.call(
                this,
                r.defaultFilterVertex,
                'varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n',
                e
              ) || this).alpha = 1),
            t
          );
        }
        (t.prototype.grayscale = t.prototype.greyscale),
          (i.ColorMatrixFilter = t);
      },
      { '@pixi/core': 4 },
    ],
    10: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/core'),
          n = t('@pixi/math'),
          o = function (t, e) {
            return (o =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (s = r.Filter),
          o((a = u), (t = s)),
          (a.prototype =
            null === t
              ? Object.create(t)
              : ((h.prototype = t.prototype), new h())),
          (u.prototype.apply = function (t, e, i, r) {
            (this.uniforms.filterMatrix = t.calculateSpriteMatrix(
              this.maskMatrix,
              this.maskSprite
            )),
              (this.uniforms.scale.x = this.scale.x),
              (this.uniforms.scale.y = this.scale.y);
            var n = this.maskSprite.worldTransform,
              o = Math.sqrt(n.a * n.a + n.b * n.b),
              s = Math.sqrt(n.c * n.c + n.d * n.d);
            0 !== o &&
              0 !== s &&
              ((this.uniforms.rotation[0] = n.a / o),
              (this.uniforms.rotation[1] = n.b / o),
              (this.uniforms.rotation[2] = n.c / s),
              (this.uniforms.rotation[3] = n.d / s)),
              t.applyFilter(this, e, i, r);
          }),
          Object.defineProperty(u.prototype, 'map', {
            get: function () {
              return this.uniforms.mapSampler;
            },
            set: function (t) {
              this.uniforms.mapSampler = t;
            },
            enumerable: !1,
            configurable: !0,
          });
        var s,
          a,
          r = u;
        function h() {
          this.constructor = a;
        }
        function u(t, e) {
          var i = this,
            r = new n.Matrix();
          return (
            (t.renderable = !1),
            ((i =
              s.call(
                this,
                'attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n\tgl_Position = filterVertexPosition();\n\tvTextureCoord = filterTextureCoord();\n\tvFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n',
                'varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n',
                {
                  mapSampler: t._texture,
                  filterMatrix: r,
                  scale: { x: 1, y: 1 },
                  rotation: new Float32Array([1, 0, 0, 1]),
                }
              ) || this).maskSprite = t),
            (i.maskMatrix = r),
            (i.scale = new n.Point((e = null == e ? 20 : e), e)),
            i
          );
        }
        i.DisplacementFilter = r;
      },
      { '@pixi/core': 4, '@pixi/math': 16 },
    ],
    11: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var t = t('@pixi/core'),
          r = function (t, e) {
            return (r =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (n = t.Filter),
          r((o = a), (t = n)),
          (o.prototype =
            null === t
              ? Object.create(t)
              : ((s.prototype = t.prototype), new s()));
        var n,
          o,
          t = a;
        function s() {
          this.constructor = o;
        }
        function a() {
          return (
            n.call(
              this,
              '\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputPixel;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n',
              'varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\nuniform sampler2D uSampler;\nuniform highp vec4 inputPixel;\n\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n\n --\n\n From:\n https://github.com/mitsuhiko/webgl-meincraft\n\n Copyright (c) 2011 by Armin Ronacher.\n\n Some rights reserved.\n\n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n\n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n\n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n\n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec4 color;\n\n      color = fxaa(uSampler, vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n'
            ) || this
          );
        }
        i.FXAAFilter = t;
      },
      { '@pixi/core': 4 },
    ],
    12: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/core'),
          n = function (t, e) {
            return (n =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (o = r.Filter),
          n((s = h), (t = o)),
          (s.prototype =
            null === t
              ? Object.create(t)
              : ((a.prototype = t.prototype), new a())),
          Object.defineProperty(h.prototype, 'noise', {
            get: function () {
              return this.uniforms.uNoise;
            },
            set: function (t) {
              this.uniforms.uNoise = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(h.prototype, 'seed', {
            get: function () {
              return this.uniforms.uSeed;
            },
            set: function (t) {
              this.uniforms.uSeed = t;
            },
            enumerable: !1,
            configurable: !0,
          });
        var o,
          s,
          t = h;
        function a() {
          this.constructor = s;
        }
        function h(t, e) {
          void 0 === t && (t = 0.5), void 0 === e && (e = Math.random());
          var i =
            o.call(
              this,
              r.defaultFilterVertex,
              'precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n',
              { uNoise: 0, uSeed: 0 }
            ) || this;
          return (i.noise = t), (i.seed = e), i;
        }
        i.NoiseFilter = t;
      },
      { '@pixi/core': 4 },
    ],
    13: [
      function (t, C, q) {
        'use strict';
        Object.defineProperty(q, '__esModule', { value: !0 });
        var p = t('@pixi/core'),
          K = t('@pixi/math'),
          c = t('@pixi/utils'),
          y = t('@pixi/constants'),
          e = t('@pixi/display'),
          Z =
            (((t = q.LINE_JOIN || (q.LINE_JOIN = {})).MITER = 'miter'),
            (t.BEVEL = 'bevel'),
            (t.ROUND = 'round'),
            ((t = q.LINE_CAP || (q.LINE_CAP = {})).BUTT = 'butt'),
            (t.ROUND = 'round'),
            (t.SQUARE = 'square'),
            {
              adaptive: !0,
              maxLength: 10,
              minSegments: 8,
              maxSegments: 2048,
              epsilon: 1e-4,
              _segmentsCount: function (t, e) {
                if (
                  (void 0 === e && (e = 20), !this.adaptive || !t || isNaN(t))
                )
                  return e;
                e = Math.ceil(t / this.maxLength);
                return (
                  e < this.minSegments
                    ? (e = this.minSegments)
                    : e > this.maxSegments && (e = this.maxSegments),
                  e
                );
              },
            }),
          i =
            ((r.prototype.clone = function () {
              var t = new r();
              return (
                (t.color = this.color),
                (t.alpha = this.alpha),
                (t.texture = this.texture),
                (t.matrix = this.matrix),
                (t.visible = this.visible),
                t
              );
            }),
            (r.prototype.reset = function () {
              (this.color = 16777215),
                (this.alpha = 1),
                (this.texture = p.Texture.WHITE),
                (this.matrix = null),
                (this.visible = !1);
            }),
            (r.prototype.destroy = function () {
              (this.texture = null), (this.matrix = null);
            }),
            r);
        function r() {
          (this.color = 16777215),
            (this.alpha = 1),
            (this.texture = p.Texture.WHITE),
            (this.matrix = null),
            (this.visible = !1),
            this.reset();
        }
        var n = function (t, e) {
          return (n =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        };
        function o(t, e) {
          function i() {
            this.constructor = t;
          }
          n(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        var s = {
            build: function (t) {
              t.points = t.shape.points.slice();
            },
            triangulate: function (t, e) {
              var i = t.points,
                r = t.holes,
                n = e.points,
                o = e.indices;
              if (6 <= i.length) {
                for (var s = [], a = 0; a < r.length; a++) {
                  var h = r[a];
                  s.push(i.length / 2), (i = i.concat(h.points));
                }
                var u = c.earcut(i, s, 2);
                if (u) {
                  for (var l = n.length / 2, a = 0; a < u.length; a += 3)
                    o.push(u[a] + l),
                      o.push(u[a + 1] + l),
                      o.push(u[a + 2] + l);
                  for (a = 0; a < i.length; a++) n.push(i[a]);
                }
              }
            },
          },
          t = {
            build: function (t) {
              var e,
                i,
                r = t.shape,
                n = t.points,
                o = r.x,
                s = r.y;
              if (
                ((n.length = 0),
                (i =
                  t.type === K.SHAPES.CIRC
                    ? ((e = r.radius), r.radius)
                    : ((e = (t = t.shape).width), t.height)),
                0 !== e && 0 !== i)
              ) {
                for (
                  var a =
                      Math.floor(30 * Math.sqrt(r.radius)) ||
                      Math.floor(15 * Math.sqrt(e + i)),
                    h = ((a /= 2.3), (2 * Math.PI) / a),
                    u = 0;
                  u < a - 0.5;
                  u++
                )
                  n.push(o + Math.sin(-h * u) * e, s + Math.cos(-h * u) * i);
                n.push(n[0], n[1]);
              }
            },
            triangulate: function (t, e) {
              var i = t.points,
                r = e.points,
                n = e.indices,
                o = r.length / 2,
                s = o,
                e = t.shape,
                a = t.matrix,
                h = e.x,
                e = e.y;
              r.push(
                t.matrix ? a.a * h + a.c * e + a.tx : h,
                t.matrix ? a.b * h + a.d * e + a.ty : e
              );
              for (var u = 0; u < i.length; u += 2)
                r.push(i[u], i[u + 1]), n.push(o++, s, o);
            },
          },
          R = {
            build: function (t) {
              var e = t.shape,
                i = e.x,
                r = e.y,
                n = e.width,
                e = e.height,
                t = t.points;
              (t.length = 0), t.push(i, r, i + n, r, i + n, r + e, i, r + e);
            },
            triangulate: function (t, e) {
              var t = t.points,
                i = e.points,
                r = i.length / 2;
              i.push(t[0], t[1], t[2], t[3], t[6], t[7], t[4], t[5]),
                e.indices.push(r, 1 + r, 2 + r, 1 + r, 2 + r, 3 + r);
            },
          };
        function f(t, e, i) {
          return t + (e - t) * i;
        }
        function a(t, e, i, r, n, o, s) {
          for (
            var a, h, u, l, c, d = (s = void 0 === s ? [] : s), p = 0;
            p <= 20;
            ++p
          )
            (u = f(t, i, (c = p / 20))),
              (a = f(e, r, c)),
              (l = f(i, n, c)),
              (h = f(r, o, c)),
              (u = f(u, l, c)),
              (l = f(a, h, c)),
              d.push(u, l);
        }
        var L = {
          build: function (t) {
            var e = t.shape,
              t = t.points,
              i = e.x,
              r = e.y,
              n = e.width,
              o = e.height,
              e = Math.max(0, Math.min(e.radius, Math.min(n, o) / 2));
            (t.length = 0),
              e
                ? (a(i, r + e, i, r, i + e, r, t),
                  a(i + n - e, r, i + n, r, i + n, r + e, t),
                  a(i + n, r + o - e, i + n, r + o, i + n - e, r + o, t),
                  a(i + e, r + o, i, r + o, i, r + o - e, t))
                : t.push(i, r, i + n, r, i + n, r + o, i, r + o);
          },
          triangulate: function (t, e) {
            for (
              var i = t.points,
                r = e.points,
                n = e.indices,
                o = r.length / 2,
                s = c.earcut(i, null, 2),
                a = 0,
                h = s.length;
              a < h;
              a += 3
            )
              n.push(s[a] + o), n.push(s[a + 1] + o), n.push(s[a + 2] + o);
            for (a = 0, h = i.length; a < h; a++) r.push(i[a], i[++a]);
          },
        };
        function Q(t, e, i, r, n, o, s, a) {
          var h,
            s = s ? ((h = r), -i) : ((h = -r), i),
            u = t + i * o + h,
            o = e + r * o + s;
          return a.push(t - i * n + h, e - r * n + s), a.push(u, o), 2;
        }
        function J(t, e, i, r, n, o, s, a) {
          var h = i - t,
            u = r - e,
            l = Math.atan2(h, u),
            c = Math.atan2(n - t, o - e),
            d =
              (a && l < c
                ? (l += 2 * Math.PI)
                : !a && c < l && (c += 2 * Math.PI),
              l),
            c = c - l,
            l = Math.abs(c),
            p = Math.sqrt(h * h + u * u),
            f = 1 + (((15 * l * Math.sqrt(p)) / Math.PI) >> 0),
            m = c / f;
          if (((d += m), a)) {
            s.push(t, e), s.push(i, r);
            for (var y = 1, g = d; y < f; y++, g += m)
              s.push(t, e), s.push(t + Math.sin(g) * p, e + Math.cos(g) * p);
            s.push(t, e), s.push(n, o);
          } else {
            s.push(i, r), s.push(t, e);
            for (y = 1, g = d; y < f; y++, g += m)
              s.push(t + Math.sin(g) * p, e + Math.cos(g) * p), s.push(t, e);
            s.push(n, o), s.push(t, e);
          }
          return 2 * f;
        }
        function h(t, e) {
          if (t.lineStyle.native) {
            var i = e,
              r = 0,
              n = (s = t).shape,
              o = s.points || n.points,
              s = n.type !== K.SHAPES.POLY || n.closeStroke;
            if (0 !== o.length) {
              var F = i.points,
                B = i.indices,
                U = o.length / 2,
                n = F.length / 2,
                a = n;
              for (F.push(o[0], o[1]), r = 1; r < U; r++)
                F.push(o[2 * r], o[2 * r + 1]), B.push(a, a + 1), a++;
              s && B.push(a, n);
            }
          } else {
            var i = e,
              n = (s = t).shape,
              h = s.points || n.points.slice(),
              e = i.closePointEps;
            if (0 !== h.length) {
              var u = s.lineStyle,
                s = new K.Point(h[0], h[1]),
                t = new K.Point(h[h.length - 2], h[h.length - 1]),
                n = n.type !== K.SHAPES.POLY || n.closeStroke,
                e = Math.abs(s.x - t.x) < e && Math.abs(s.y - t.y) < e,
                l =
                  (n &&
                    ((h = h.slice()),
                    e &&
                      (h.pop(),
                      h.pop(),
                      t.set(h[h.length - 2], h[h.length - 1])),
                    (e = 0.5 * (s.x + t.x)),
                    (t = 0.5 * (t.y + s.y)),
                    h.unshift(e, t),
                    h.push(e, t)),
                  i.points),
                c = h.length / 2,
                d = h.length,
                j = l.length / 2,
                p = u.width / 2,
                k = p * p,
                X = u.miterLimit * u.miterLimit,
                f = h[0],
                m = h[1],
                y = h[2],
                g = h[3],
                v = 0,
                _ = 0,
                x = -(m - g),
                b = f - y,
                T = 0,
                E = 0,
                w = Math.sqrt(x * x + b * b),
                s = ((x = (x / w) * p), (b = (b / w) * p), u.alignment),
                P = 2 * (1 - s),
                S = 2 * s;
              n ||
                (u.cap === q.LINE_CAP.ROUND
                  ? (d +=
                      J(
                        f - x * (P - S) * 0.5,
                        m - b * (P - S) * 0.5,
                        f - x * P,
                        m - b * P,
                        f + x * S,
                        m + b * S,
                        l,
                        !0
                      ) + 2)
                  : u.cap === q.LINE_CAP.SQUARE &&
                    (d += Q(f, m, x, b, P, S, !0, l))),
                l.push(f - x * P, m - b * P),
                l.push(f + x * S, m + b * S);
              for (var O = 1; O < c - 1; ++O) {
                (f = h[2 * (O - 1)]),
                  (m = h[2 * (O - 1) + 1]),
                  (y = h[2 * O]),
                  (g = h[2 * O + 1]),
                  (v = h[2 * (O + 1)]),
                  (_ = h[2 * (O + 1) + 1]),
                  (b = f - y),
                  (x = ((x = -(m - g)) / (w = Math.sqrt(x * x + b * b))) * p),
                  (b = (b / w) * p),
                  (E = y - v);
                var I,
                  A,
                  M,
                  D,
                  C,
                  G,
                  T = ((T = -(g - _)) / (w = Math.sqrt(T * T + E * E))) * p,
                  E = (E / w) * p,
                  R = y - f,
                  H = m - g,
                  z = y - v,
                  Y = _ - g,
                  L = H * z - Y * R,
                  N = L < 0;
                Math.abs(L) < 0.1
                  ? (l.push(y - x * P, g - b * P), l.push(y + x * S, g + b * S))
                  : ((M =
                      y +
                      ((A =
                        (R * (D = (-T + v) * (-E + g) - (-T + y) * (-E + _)) -
                          z * (I = (-x + f) * (-b + g) - (-x + y) * (-b + m))) /
                        L) -
                        y) *
                        P),
                    (D = g + ((I = (Y * I - H * D) / L) - g) * P),
                    (L = y - (A - y) * S),
                    (C = g - (I - g) * S),
                    (G = N ? P : S),
                    (A = (A - y) * (A - y) + (I - g) * (I - g)) <=
                    Math.min(R * R + H * H, z * z + Y * Y) + G * G * k
                      ? u.join === q.LINE_JOIN.BEVEL || X < A / k
                        ? (N
                            ? (l.push(M, D),
                              l.push(y + x * S, g + b * S),
                              l.push(M, D),
                              l.push(y + T * S, g + E * S))
                            : (l.push(y - x * P, g - b * P),
                              l.push(L, C),
                              l.push(y - T * P, g - E * P),
                              l.push(L, C)),
                          (d += 2))
                        : u.join === q.LINE_JOIN.ROUND
                        ? N
                          ? (l.push(M, D),
                            l.push(y + x * S, g + b * S),
                            (d +=
                              J(
                                y,
                                g,
                                y + x * S,
                                g + b * S,
                                y + T * S,
                                g + E * S,
                                l,
                                !0
                              ) + 4),
                            l.push(M, D),
                            l.push(y + T * S, g + E * S))
                          : (l.push(y - x * P, g - b * P),
                            l.push(L, C),
                            (d +=
                              J(
                                y,
                                g,
                                y - x * P,
                                g - b * P,
                                y - T * P,
                                g - E * P,
                                l,
                                !1
                              ) + 4),
                            l.push(y - T * P, g - E * P),
                            l.push(L, C))
                        : (l.push(M, D), l.push(L, C))
                      : (l.push(y - x * P, g - b * P),
                        l.push(y + x * S, g + b * S),
                        u.join === q.LINE_JOIN.BEVEL ||
                          X < A / k ||
                          (u.join === q.LINE_JOIN.ROUND
                            ? (d += N
                                ? J(
                                    y,
                                    g,
                                    y + x * S,
                                    g + b * S,
                                    y + T * S,
                                    g + E * S,
                                    l,
                                    !0
                                  ) + 2
                                : J(
                                    y,
                                    g,
                                    y - x * P,
                                    g - b * P,
                                    y - T * P,
                                    g - E * P,
                                    l,
                                    !1
                                  ) + 2)
                            : (N
                                ? (l.push(L, C), l.push(L, C))
                                : (l.push(M, D), l.push(M, D)),
                              (d += 2))),
                        l.push(y - T * P, g - E * P),
                        l.push(y + T * S, g + E * S),
                        (d += 2)));
              }
              (f = h[2 * (c - 2)]),
                (m = h[2 * (c - 2) + 1]),
                (y = h[2 * (c - 1)]),
                (x = -(m - (g = h[2 * (c - 1) + 1]))),
                (b = f - y),
                (w = Math.sqrt(x * x + b * b)),
                l.push(y - (x = (x / w) * p) * P, g - (b = (b / w) * p) * P),
                l.push(y + x * S, g + b * S),
                n ||
                  (u.cap === q.LINE_CAP.ROUND
                    ? (d +=
                        J(
                          y - x * (P - S) * 0.5,
                          g - b * (P - S) * 0.5,
                          y - x * P,
                          g - b * P,
                          y + x * S,
                          g + b * S,
                          l,
                          !1
                        ) + 2)
                    : u.cap === q.LINE_CAP.SQUARE &&
                      (d += Q(y, g, x, b, P, S, !1, l)));
              for (
                var V = i.indices, W = Z.epsilon * Z.epsilon, O = j;
                O < d + j - 2;
                ++O
              )
                (f = l[2 * O]),
                  (m = l[2 * O + 1]),
                  (y = l[2 * (O + 1)]),
                  (g = l[2 * (O + 1) + 1]),
                  (v = l[2 * (O + 2)]),
                  (_ = l[2 * (O + 2) + 1]),
                  Math.abs(f * (g - _) + y * (_ - m) + v * (m - g)) < W ||
                    V.push(O, O + 1, O + 2);
            }
          }
        }
        o(B, (N = K.Polygon));
        var N,
          F = B;
        function B(t, e, i, r, n, o) {
          void 0 === o && (o = 0);
          n = n || r / 2;
          for (
            var s = (-1 * Math.PI) / 2 + o,
              a = 2 * i,
              h = K.PI_2 / a,
              u = [],
              l = 0;
            l < a;
            l++
          ) {
            var c = l % 2 ? n : r,
              d = l * h + s;
            u.push(t + c * Math.cos(d), e + c * Math.sin(d));
          }
          return N.call(this, u) || this;
        }
        (u.curveTo = function (t, e, i, r, n, o) {
          var s = o[o.length - 2],
            a = o[o.length - 1] - e,
            s = s - t,
            r = r - e,
            i = i - t,
            h = Math.abs(a * i - s * r);
          if (h < 1e-8 || 0 === n)
            return (
              (o[o.length - 2] === t && o[o.length - 1] === e) || o.push(t, e),
              null
            );
          var o = a * a + s * s,
            u = r * r + i * i,
            l = a * r + s * i,
            c = (n * Math.sqrt(o)) / h,
            h = (n * Math.sqrt(u)) / h,
            o = (c * l) / o,
            l = (h * l) / u,
            u = c * i + h * s,
            d = c * r + h * a,
            p = i * (c + l),
            c = r * (c + l);
          return {
            cx: u + t,
            cy: d + e,
            radius: n,
            startAngle: Math.atan2(a * (h + o) - d, s * (h + o) - u),
            endAngle: Math.atan2(c - d, p - u),
            anticlockwise: i * a < s * r,
          };
        }),
          (u.arc = function (t, e, i, r, n, o, s, a, h) {
            for (
              var s = s - o,
                u = Z._segmentsCount(
                  Math.abs(s) * n,
                  40 * Math.ceil(Math.abs(s) / K.PI_2)
                ),
                l = s / (2 * u),
                c = 2 * l,
                d = Math.cos(l),
                p = Math.sin(l),
                f = u - 1,
                m = (f % 1) / f,
                y = 0;
              y <= f;
              ++y
            ) {
              var g = l + o + c * (y + m * y),
                v = Math.cos(g),
                g = -Math.sin(g);
              h.push((d * v + p * g) * n + i, (d * -g + p * v) * n + r);
            }
          });
        var d = u;
        function u() {}
        (g.curveLength = function (t, e, i, r, n, o, s, a) {
          for (
            var h, u, l, c, d, p, f, m, y = 0, g = t, v = e, _ = 1;
            _ <= 10;
            ++_
          )
            (f =
              g -
              (d =
                (p = (m = (c = 1 - (h = _ / 10)) * c) * c) * t +
                3 * m * h * i +
                3 * c * (u = h * h) * n +
                (l = u * h) * s)),
              (m = v - (p = p * e + 3 * m * h * r + 3 * c * u * o + l * a)),
              (g = d),
              (v = p),
              (y += Math.sqrt(f * f + m * m));
          return y;
        }),
          (g.curveTo = function (t, e, i, r, n, o, s) {
            var a,
              h,
              u,
              l,
              c,
              d = s[s.length - 2],
              p = s[s.length - 1],
              f =
                ((s.length -= 2),
                Z._segmentsCount(g.curveLength(d, p, t, e, i, r, n, o)));
            s.push(d, p);
            for (var m, y = 1; y <= f; ++y)
              s.push(
                (u = (h = (a = 1 - (m = y / f)) * a) * a) * d +
                  3 * h * m * t +
                  3 * a * (l = m * m) * i +
                  (c = l * m) * n,
                u * p + 3 * h * m * e + 3 * a * l * r + c * o
              );
          });
        var U = g;
        function g() {}
        (m.curveLength = function (t, e, i, r, n, o) {
          var n = t - 2 * i + n,
            o = e - 2 * r + o,
            i = 2 * i - 2 * t,
            t = 2 * r - 2 * e,
            r = 4 * (n * n + o * o),
            e = 4 * (n * i + o * t),
            n = i * i + t * t,
            o = 2 * Math.sqrt(r + e + n),
            i = Math.sqrt(r),
            t = 2 * r * i,
            s = 2 * Math.sqrt(n),
            a = e / i;
          return (
            (t * o +
              i * e * (o - s) +
              (4 * n * r - e * e) * Math.log((2 * i + a + o) / (a + s))) /
            (4 * t)
          );
        }),
          (m.curveTo = function (t, e, i, r, n) {
            for (
              var o = n[n.length - 2],
                s = n[n.length - 1],
                a = Z._segmentsCount(m.curveLength(o, s, t, e, i, r)),
                h = 1;
              h <= a;
              ++h
            ) {
              var u,
                l = h / a;
              n.push(
                (u = o + (t - o) * l) + (t + (i - t) * l - u) * l,
                (u = s + (e - s) * l) + (e + (r - e) * l - u) * l
              );
            }
          });
        var j = m;
        function m() {}
        (l.prototype.begin = function (t, e, i) {
          this.reset(),
            (this.style = t),
            (this.start = e),
            (this.attribStart = i);
        }),
          (l.prototype.end = function (t, e) {
            (this.attribSize = e - this.attribStart),
              (this.size = t - this.start);
          }),
          (l.prototype.reset = function () {
            (this.style = null),
              (this.size = 0),
              (this.start = 0),
              (this.attribStart = 0),
              (this.attribSize = 0);
          });
        var k = l;
        function l() {
          this.reset();
        }
        ((b = {})[K.SHAPES.POLY] = s),
          (b[K.SHAPES.CIRC] = t),
          (b[K.SHAPES.ELIP] = t),
          (b[K.SHAPES.RECT] = R),
          (b[K.SHAPES.RREC] = L);
        var v = b,
          _ = [],
          x = [],
          b = {
            buildPoly: s,
            buildCircle: t,
            buildRectangle: R,
            buildRoundedRectangle: L,
            FILL_COMMANDS: v,
            BATCH_POOL: _,
            DRAW_CALL_POOL: x,
            buildLine: h,
            Star: F,
            ArcUtils: d,
            BezierUtils: U,
            QuadraticUtils: j,
            BatchPart: k,
          },
          T =
            ((E.prototype.clone = function () {
              return new E(
                this.shape,
                this.fillStyle,
                this.lineStyle,
                this.matrix
              );
            }),
            (E.prototype.destroy = function () {
              (this.shape = null),
                (this.holes.length = 0),
                (this.holes = null),
                (this.points.length = 0),
                (this.points = null),
                (this.lineStyle = null),
                (this.fillStyle = null);
            }),
            E);
        function E(t, e, i, r) {
          void 0 === e && (e = null),
            void 0 === i && (i = null),
            void 0 === r && (r = null),
            (this.shape = t),
            (this.lineStyle = i),
            (this.fillStyle = e),
            (this.matrix = r),
            (this.type = t.type),
            (this.points = []),
            (this.holes = []);
        }
        var w,
          P = new K.Point(),
          X = new e.Bounds(),
          G =
            (o(S, (w = p.BatchGeometry)),
            Object.defineProperty(S.prototype, 'bounds', {
              get: function () {
                return (
                  this.boundsDirty !== this.dirty &&
                    ((this.boundsDirty = this.dirty), this.calculateBounds()),
                  this._bounds
                );
              },
              enumerable: !1,
              configurable: !0,
            }),
            (S.prototype.invalidate = function () {
              (this.boundsDirty = -1),
                this.dirty++,
                this.batchDirty++,
                (this.shapeIndex = 0),
                (this.points.length = 0),
                (this.colors.length = 0),
                (this.uvs.length = 0),
                (this.indices.length = 0);
              for (
                var t = (this.textureIds.length = 0);
                t < this.drawCalls.length;
                t++
              )
                this.drawCalls[t].texArray.clear(), x.push(this.drawCalls[t]);
              for (
                t = this.drawCalls.length = 0;
                t < this.batches.length;
                t++
              ) {
                var e = this.batches[t];
                e.reset(), _.push(e);
              }
              this.batches.length = 0;
            }),
            (S.prototype.clear = function () {
              return (
                0 < this.graphicsData.length &&
                  (this.invalidate(),
                  this.clearDirty++,
                  (this.graphicsData.length = 0)),
                this
              );
            }),
            (S.prototype.drawShape = function (t, e, i, r) {
              t = new T(
                t,
                (e = void 0 === e ? null : e),
                (i = void 0 === i ? null : i),
                (r = void 0 === r ? null : r)
              );
              return this.graphicsData.push(t), this.dirty++, this;
            }),
            (S.prototype.drawHole = function (t, e) {
              if (!this.graphicsData.length) return null;
              (t = new T(t, null, null, (e = void 0 === e ? null : e))),
                (e = this.graphicsData[this.graphicsData.length - 1]);
              return (
                (t.lineStyle = e.lineStyle), e.holes.push(t), this.dirty++, this
              );
            }),
            (S.prototype.destroy = function () {
              w.prototype.destroy.call(this);
              for (var t = 0; t < this.graphicsData.length; ++t)
                this.graphicsData[t].destroy();
              (this.points.length = 0),
                (this.points = null),
                (this.colors.length = 0),
                (this.colors = null),
                (this.uvs.length = 0),
                (this.uvs = null),
                (this.indices.length = 0),
                (this.indices = null),
                this.indexBuffer.destroy(),
                (this.indexBuffer = null),
                (this.graphicsData.length = 0),
                (this.graphicsData = null),
                (this.drawCalls.length = 0),
                (this.drawCalls = null),
                (this.batches.length = 0),
                (this.batches = null),
                (this._bounds = null);
            }),
            (S.prototype.containsPoint = function (t) {
              for (var e = this.graphicsData, i = 0; i < e.length; ++i) {
                var r = e[i];
                if (
                  r.fillStyle.visible &&
                  r.shape &&
                  (r.matrix ? r.matrix.applyInverse(t, P) : P.copyFrom(t),
                  r.shape.contains(P.x, P.y))
                ) {
                  var n = !1;
                  if (r.holes)
                    for (var o = 0; o < r.holes.length; o++)
                      if (r.holes[o].shape.contains(P.x, P.y)) {
                        n = !0;
                        break;
                      }
                  if (!n) return !0;
                }
              }
              return !1;
            }),
            (S.prototype.updateBatches = function (t) {
              if (this.graphicsData.length) {
                if (this.validateBatching()) {
                  this.cacheDirty = this.dirty;
                  var e = this.uvs,
                    i = this.graphicsData,
                    r = null,
                    n = null;
                  0 < this.batches.length &&
                    (n = (r = this.batches[this.batches.length - 1]).style);
                  for (var o = this.shapeIndex; o < i.length; o++) {
                    this.shapeIndex++;
                    var s = i[o],
                      a = s.fillStyle,
                      h = s.lineStyle;
                    v[s.type].build(s),
                      s.matrix && this.transformPoints(s.points, s.matrix);
                    for (var u = 0; u < 2; u++) {
                      var l,
                        c,
                        d,
                        p = 0 === u ? a : h;
                      p.visible &&
                        ((d = p.texture.baseTexture),
                        (l = this.indices.length),
                        (c = this.points.length / 2),
                        (d.wrapMode = y.WRAP_MODES.REPEAT),
                        0 === u ? this.processFill(s) : this.processLine(s),
                        0 != (d = this.points.length / 2 - c) &&
                          (r &&
                            !this._compareStyles(n, p) &&
                            (r.end(l, c), (r = null)),
                          r ||
                            ((r = _.pop() || new k()).begin(p, l, c),
                            this.batches.push(r),
                            (n = p)),
                          this.addUvs(
                            this.points,
                            e,
                            p.texture,
                            c,
                            d,
                            p.matrix
                          )));
                    }
                  }
                  var f = this.indices.length,
                    m = this.points.length / 2;
                  r && r.end(f, m),
                    0 === this.batches.length
                      ? (this.batchable = !0)
                      : (this.indicesUint16 &&
                        this.indices.length === this.indicesUint16.length
                          ? this.indicesUint16.set(this.indices)
                          : (this.indicesUint16 = new (
                              65535 < m && t ? Uint32Array : Uint16Array
                            )(this.indices)),
                        (this.batchable = this.isBatchable()),
                        this.batchable
                          ? this.packBatches()
                          : this.buildDrawCalls());
                }
              } else this.batchable = !0;
            }),
            (S.prototype._compareStyles = function (t, e) {
              return (
                !(!t || !e) &&
                t.texture.baseTexture === e.texture.baseTexture &&
                t.color + t.alpha === e.color + e.alpha &&
                !!t.native == !!e.native
              );
            }),
            (S.prototype.validateBatching = function () {
              if (this.dirty === this.cacheDirty || !this.graphicsData.length)
                return !1;
              for (var t = 0, e = this.graphicsData.length; t < e; t++) {
                var i = this.graphicsData[t],
                  r = i.fillStyle,
                  i = i.lineStyle;
                if (r && !r.texture.baseTexture.valid) return !1;
                if (i && !i.texture.baseTexture.valid) return !1;
              }
              return !0;
            }),
            (S.prototype.packBatches = function () {
              this.batchDirty++, (this.uvsFloat32 = new Float32Array(this.uvs));
              for (var t = this.batches, e = 0, i = t.length; e < i; e++)
                for (var r = t[e], n = 0; n < r.size; n++) {
                  var o = r.start + n;
                  this.indicesUint16[o] = this.indicesUint16[o] - r.attribStart;
                }
            }),
            (S.prototype.isBatchable = function () {
              if (131070 < this.points.length) return !1;
              for (var t = this.batches, e = 0; e < t.length; e++)
                if (t[e].style.native) return !1;
              return this.points.length < 2 * S.BATCHABLE_SIZE;
            }),
            (S.prototype.buildDrawCalls = function () {
              for (
                var t = ++p.BaseTexture._globalBatch, e = 0;
                e < this.drawCalls.length;
                e++
              )
                this.drawCalls[e].texArray.clear(), x.push(this.drawCalls[e]);
              this.drawCalls.length = 0;
              var i = this.colors,
                r = this.textureIds,
                n = x.pop(),
                o =
                  (n ||
                    ((n = new p.BatchDrawCall()).texArray =
                      new p.BatchTextureArray()),
                  (n.texArray.count = 0),
                  (n.start = 0),
                  (n.size = 0),
                  (n.type = y.DRAW_MODES.TRIANGLES),
                  0),
                s = null,
                a = !1,
                h = y.DRAW_MODES.TRIANGLES,
                u = 0;
              this.drawCalls.push(n);
              for (e = 0; e < this.batches.length; e++) {
                var l = this.batches[e],
                  c = l.style,
                  d = c.texture.baseTexture;
                a !== !!c.native &&
                  ((h = (a = !!c.native)
                    ? y.DRAW_MODES.LINES
                    : y.DRAW_MODES.TRIANGLES),
                  (s = null),
                  (o = 8),
                  t++),
                  s !== d &&
                    (s = d)._batchEnabled !== t &&
                    (8 === o &&
                      (t++,
                      (o = 0) < n.size &&
                        ((n = x.pop()) ||
                          ((n = new p.BatchDrawCall()).texArray =
                            new p.BatchTextureArray()),
                        this.drawCalls.push(n)),
                      (n.start = u),
                      (n.size = 0),
                      (n.texArray.count = 0),
                      (n.type = h)),
                    (d.touched = 1),
                    (d._batchEnabled = t),
                    (d._batchLocation = o),
                    (d.wrapMode = 10497),
                    (n.texArray.elements[n.texArray.count++] = d),
                    o++),
                  (n.size += l.size),
                  (u += l.size),
                  (d = d._batchLocation),
                  this.addColors(
                    i,
                    c.color,
                    c.alpha,
                    l.attribSize,
                    l.attribStart
                  ),
                  this.addTextureIds(r, d, l.attribSize, l.attribStart);
              }
              (p.BaseTexture._globalBatch = t), this.packAttributes();
            }),
            (S.prototype.packAttributes = function () {
              for (
                var t = this.points,
                  e = this.uvs,
                  i = this.colors,
                  r = this.textureIds,
                  n = new ArrayBuffer(3 * t.length * 4),
                  o = new Float32Array(n),
                  s = new Uint32Array(n),
                  a = 0,
                  h = 0;
                h < t.length / 2;
                h++
              )
                (o[a++] = t[2 * h]),
                  (o[a++] = t[2 * h + 1]),
                  (o[a++] = e[2 * h]),
                  (o[a++] = e[2 * h + 1]),
                  (s[a++] = i[h]),
                  (o[a++] = r[h]);
              this._buffer.update(n),
                this._indexBuffer.update(this.indicesUint16);
            }),
            (S.prototype.processFill = function (t) {
              t.holes.length
                ? (this.processHoles(t.holes), s.triangulate(t, this))
                : v[t.type].triangulate(t, this);
            }),
            (S.prototype.processLine = function (t) {
              h(t, this);
              for (var e = 0; e < t.holes.length; e++) h(t.holes[e], this);
            }),
            (S.prototype.processHoles = function (t) {
              for (var e = 0; e < t.length; e++) {
                var i = t[e];
                v[i.type].build(i),
                  i.matrix && this.transformPoints(i.points, i.matrix);
              }
            }),
            (S.prototype.calculateBounds = function () {
              var t = this._bounds,
                e = X,
                i = K.Matrix.IDENTITY;
              this._bounds.clear(), e.clear();
              for (var r = 0; r < this.graphicsData.length; r++) {
                var n,
                  o = this.graphicsData[r],
                  s = o.shape,
                  a = o.type,
                  h = o.lineStyle,
                  o = o.matrix || K.Matrix.IDENTITY,
                  u = 0;
                h &&
                  h.visible &&
                  ((n = h.alignment),
                  (u = h.width),
                  a === K.SHAPES.POLY
                    ? (u *= 0.5 + Math.abs(0.5 - n))
                    : (u *= Math.max(0, n))),
                  i !== o &&
                    (e.isEmpty() || (t.addBoundsMatrix(e, i), e.clear()),
                    (i = o)),
                  a === K.SHAPES.RECT || a === K.SHAPES.RREC
                    ? e.addFramePad(
                        s.x,
                        s.y,
                        s.x + s.width,
                        s.y + s.height,
                        u,
                        u
                      )
                    : a === K.SHAPES.CIRC
                    ? e.addFramePad(
                        s.x,
                        s.y,
                        s.x,
                        s.y,
                        s.radius + u,
                        s.radius + u
                      )
                    : a === K.SHAPES.ELIP
                    ? e.addFramePad(
                        s.x,
                        s.y,
                        s.x,
                        s.y,
                        s.width + u,
                        s.height + u
                      )
                    : t.addVerticesMatrix(
                        i,
                        s.points,
                        0,
                        s.points.length,
                        u,
                        u
                      );
              }
              e.isEmpty() || t.addBoundsMatrix(e, i),
                t.pad(this.boundsPadding, this.boundsPadding);
            }),
            (S.prototype.transformPoints = function (t, e) {
              for (var i = 0; i < t.length / 2; i++) {
                var r = t[2 * i],
                  n = t[2 * i + 1];
                (t[2 * i] = e.a * r + e.c * n + e.tx),
                  (t[2 * i + 1] = e.b * r + e.d * n + e.ty);
              }
            }),
            (S.prototype.addColors = function (t, e, i, r, n) {
              void 0 === n && (n = 0);
              var o = c.premultiplyTint(
                (e >> 16) + (65280 & e) + ((255 & e) << 16),
                i
              );
              t.length = Math.max(t.length, n + r);
              for (var s = 0; s < r; s++) t[n + s] = o;
            }),
            (S.prototype.addTextureIds = function (t, e, i, r) {
              void 0 === r && (r = 0), (t.length = Math.max(t.length, r + i));
              for (var n = 0; n < i; n++) t[r + n] = e;
            }),
            (S.prototype.addUvs = function (t, e, i, r, n, o) {
              void 0 === o && (o = null);
              for (var s = 0, a = e.length, h = i.frame; s < n; ) {
                var u,
                  l = t[2 * (r + s)],
                  c = t[2 * (r + s) + 1];
                o &&
                  ((u = o.a * l + o.c * c + o.tx),
                  (c = o.b * l + o.d * c + o.ty),
                  (l = u)),
                  s++,
                  e.push(l / h.width, c / h.height);
              }
              var d = i.baseTexture;
              (h.width < d.width || h.height < d.height) &&
                this.adjustUvs(e, i, a, n);
            }),
            (S.prototype.adjustUvs = function (t, e, i, r) {
              for (
                var n = e.baseTexture,
                  o = i + 2 * r,
                  r = e.frame,
                  s = r.width / n.width,
                  a = r.height / n.height,
                  h = r.x / r.width,
                  u = r.y / r.height,
                  l = Math.floor(t[i] + 1e-6),
                  c = Math.floor(t[i + 1] + 1e-6),
                  d = i + 2;
                d < o;
                d += 2
              )
                (l = Math.min(l, Math.floor(t[d] + 1e-6))),
                  (c = Math.min(c, Math.floor(t[d + 1] + 1e-6)));
              (h -= l), (u -= c);
              for (d = i; d < o; d += 2)
                (t[d] = (t[d] + h) * s), (t[d + 1] = (t[d + 1] + u) * a);
            }),
            (S.BATCHABLE_SIZE = 100),
            S);
        function S() {
          var t = w.call(this) || this;
          return (
            (t.uvsFloat32 = null),
            (t.indicesUint16 = null),
            (t.points = []),
            (t.colors = []),
            (t.uvs = []),
            (t.indices = []),
            (t.textureIds = []),
            (t.graphicsData = []),
            (t.dirty = 0),
            (t.batchDirty = -1),
            (t.cacheDirty = -1),
            (t.clearDirty = 0),
            (t.drawCalls = []),
            (t.batches = []),
            (t.shapeIndex = 0),
            (t._bounds = new e.Bounds()),
            (t.boundsDirty = -1),
            (t.boundsPadding = 0),
            (t.batchable = !1),
            (t.indicesUint16 = null),
            (t.uvsFloat32 = null),
            (t.closePointEps = 1e-4),
            t
          );
        }
        o(I, (O = i)),
          (I.prototype.clone = function () {
            var t = new I();
            return (
              (t.color = this.color),
              (t.alpha = this.alpha),
              (t.texture = this.texture),
              (t.matrix = this.matrix),
              (t.visible = this.visible),
              (t.width = this.width),
              (t.alignment = this.alignment),
              (t.native = this.native),
              (t.cap = this.cap),
              (t.join = this.join),
              (t.miterLimit = this.miterLimit),
              t
            );
          }),
          (I.prototype.reset = function () {
            O.prototype.reset.call(this),
              (this.color = 0),
              (this.alignment = 0.5),
              (this.width = 0),
              (this.native = !1);
          });
        var O,
          H = I;
        function I() {
          var t = (null !== O && O.apply(this, arguments)) || this;
          return (
            (t.width = 0),
            (t.alignment = 0.5),
            (t.native = !1),
            (t.cap = q.LINE_CAP.BUTT),
            (t.join = q.LINE_JOIN.MITER),
            (t.miterLimit = 10),
            t
          );
        }
        var A,
          z = new Float32Array(3),
          M = {},
          t =
            (o(D, (A = e.Container)),
            Object.defineProperty(D.prototype, 'geometry', {
              get: function () {
                return this._geometry;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (D.prototype.clone = function () {
              return this.finishPoly(), new D(this._geometry);
            }),
            Object.defineProperty(D.prototype, 'blendMode', {
              get: function () {
                return this.state.blendMode;
              },
              set: function (t) {
                this.state.blendMode = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(D.prototype, 'tint', {
              get: function () {
                return this._tint;
              },
              set: function (t) {
                this._tint = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(D.prototype, 'fill', {
              get: function () {
                return this._fillStyle;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(D.prototype, 'line', {
              get: function () {
                return this._lineStyle;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (D.prototype.lineStyle = function (t) {
              var e;
              return (
                'number' == typeof (t = void 0 === t ? null : t) &&
                  (t = {
                    width: (e = arguments)[0] || 0,
                    color: e[1] || 0,
                    alpha: void 0 !== e[2] ? e[2] : 1,
                    alignment: void 0 !== e[3] ? e[3] : 0.5,
                    native: !!e[4],
                  }),
                this.lineTextureStyle(t)
              );
            }),
            (D.prototype.lineTextureStyle = function (e) {
              'number' == typeof e &&
                (c.deprecation(
                  'v5.2.0',
                  'Please use object-based options for Graphics#lineTextureStyle'
                ),
                (e = {
                  width: (t = arguments)[0],
                  texture: t[1],
                  color: t[2],
                  alpha: t[3],
                  matrix: t[4],
                  alignment: t[5],
                  native: t[6],
                }),
                Object.keys(e).forEach(function (t) {
                  return void 0 === e[t] && delete e[t];
                })),
                (e = Object.assign(
                  {
                    width: 0,
                    texture: p.Texture.WHITE,
                    color: e && e.texture ? 16777215 : 0,
                    alpha: 1,
                    matrix: null,
                    alignment: 0.5,
                    native: !1,
                    cap: q.LINE_CAP.BUTT,
                    join: q.LINE_JOIN.MITER,
                    miterLimit: 10,
                  },
                  e
                )),
                this.currentPath && this.startPoly();
              var t = 0 < e.width && 0 < e.alpha;
              return (
                t
                  ? (e.matrix &&
                      ((e.matrix = e.matrix.clone()), e.matrix.invert()),
                    Object.assign(this._lineStyle, { visible: t }, e))
                  : this._lineStyle.reset(),
                this
              );
            }),
            (D.prototype.startPoly = function () {
              var t, e;
              this.currentPath
                ? ((t = this.currentPath.points),
                  2 < (e = this.currentPath.points.length) &&
                    (this.drawShape(this.currentPath),
                    (this.currentPath = new K.Polygon()),
                    (this.currentPath.closeStroke = !1),
                    this.currentPath.points.push(t[e - 2], t[e - 1])))
                : ((this.currentPath = new K.Polygon()),
                  (this.currentPath.closeStroke = !1));
            }),
            (D.prototype.finishPoly = function () {
              this.currentPath &&
                (2 < this.currentPath.points.length
                  ? (this.drawShape(this.currentPath),
                    (this.currentPath = null))
                  : (this.currentPath.points.length = 0));
            }),
            (D.prototype.moveTo = function (t, e) {
              return (
                this.startPoly(),
                (this.currentPath.points[0] = t),
                (this.currentPath.points[1] = e),
                this
              );
            }),
            (D.prototype.lineTo = function (t, e) {
              this.currentPath || this.moveTo(0, 0);
              var i = this.currentPath.points,
                r = i[i.length - 2],
                n = i[i.length - 1];
              return (r === t && n === e) || i.push(t, e), this;
            }),
            (D.prototype._initCurve = function (t, e) {
              void 0 === t && (t = 0),
                void 0 === e && (e = 0),
                this.currentPath
                  ? 0 === this.currentPath.points.length &&
                    (this.currentPath.points = [t, e])
                  : this.moveTo(t, e);
            }),
            (D.prototype.quadraticCurveTo = function (t, e, i, r) {
              this._initCurve();
              var n = this.currentPath.points;
              return (
                0 === n.length && this.moveTo(0, 0),
                j.curveTo(t, e, i, r, n),
                this
              );
            }),
            (D.prototype.bezierCurveTo = function (t, e, i, r, n, o) {
              return (
                this._initCurve(),
                U.curveTo(t, e, i, r, n, o, this.currentPath.points),
                this
              );
            }),
            (D.prototype.arcTo = function (t, e, i, r, n) {
              this._initCurve(t, e);
              var o = this.currentPath.points,
                t = d.curveTo(t, e, i, r, n, o);
              return (
                t &&
                  ((e = t.cx),
                  (i = t.cy),
                  (r = t.radius),
                  (n = t.startAngle),
                  (o = t.endAngle),
                  (t = t.anticlockwise),
                  this.arc(e, i, r, n, o, t)),
                this
              );
            }),
            (D.prototype.arc = function (t, e, i, r, n, o) {
              if (r === n) return this;
              if (
                (!(o = void 0 === o ? !1 : o) && n <= r
                  ? (n += K.PI_2)
                  : o && r <= n && (r += K.PI_2),
                0 == n - r)
              )
                return this;
              var s,
                a,
                h = t + Math.cos(r) * i,
                u = e + Math.sin(r) * i,
                l = this._geometry.closePointEps,
                c = this.currentPath ? this.currentPath.points : null;
              return (
                c
                  ? ((s = Math.abs(c[c.length - 2] - h)),
                    (a = Math.abs(c[c.length - 1] - u)),
                    (s < l && a < l) || c.push(h, u))
                  : (this.moveTo(h, u), (c = this.currentPath.points)),
                d.arc(h, u, t, e, i, r, n, o, c),
                this
              );
            }),
            (D.prototype.beginFill = function (t, e) {
              return this.beginTextureFill({
                texture: p.Texture.WHITE,
                color: (t = void 0 === t ? 0 : t),
                alpha: (e = void 0 === e ? 1 : e),
              });
            }),
            (D.prototype.beginTextureFill = function (e) {
              e instanceof p.Texture &&
                (c.deprecation(
                  'v5.2.0',
                  'Please use object-based options for Graphics#beginTextureFill'
                ),
                (e = {
                  texture: (t = arguments)[0],
                  color: t[1],
                  alpha: t[2],
                  matrix: t[3],
                }),
                Object.keys(e).forEach(function (t) {
                  return void 0 === e[t] && delete e[t];
                })),
                (e = Object.assign(
                  {
                    texture: p.Texture.WHITE,
                    color: 16777215,
                    alpha: 1,
                    matrix: null,
                  },
                  e
                )),
                this.currentPath && this.startPoly();
              var t = 0 < e.alpha;
              return (
                t
                  ? (e.matrix &&
                      ((e.matrix = e.matrix.clone()), e.matrix.invert()),
                    Object.assign(this._fillStyle, { visible: t }, e))
                  : this._fillStyle.reset(),
                this
              );
            }),
            (D.prototype.endFill = function () {
              return this.finishPoly(), this._fillStyle.reset(), this;
            }),
            (D.prototype.drawRect = function (t, e, i, r) {
              return this.drawShape(new K.Rectangle(t, e, i, r));
            }),
            (D.prototype.drawRoundedRect = function (t, e, i, r, n) {
              return this.drawShape(new K.RoundedRectangle(t, e, i, r, n));
            }),
            (D.prototype.drawCircle = function (t, e, i) {
              return this.drawShape(new K.Circle(t, e, i));
            }),
            (D.prototype.drawEllipse = function (t, e, i, r) {
              return this.drawShape(new K.Ellipse(t, e, i, r));
            }),
            (D.prototype.drawPolygon = function () {
              for (var t = arguments, e = [], i = 0; i < arguments.length; i++)
                e[i] = t[i];
              var r = !0,
                n = e[0],
                n = n.points
                  ? ((r = n.closeStroke), n.points)
                  : Array.isArray(e[0])
                  ? e[0]
                  : e,
                n = new K.Polygon(n);
              return (n.closeStroke = r), this.drawShape(n), this;
            }),
            (D.prototype.drawShape = function (t) {
              return (
                this._holeMode
                  ? this._geometry.drawHole(t, this._matrix)
                  : this._geometry.drawShape(
                      t,
                      this._fillStyle.clone(),
                      this._lineStyle.clone(),
                      this._matrix
                    ),
                this
              );
            }),
            (D.prototype.drawStar = function (t, e, i, r, n, o) {
              return this.drawPolygon(
                new F(t, e, i, r, n, (o = void 0 === o ? 0 : o))
              );
            }),
            (D.prototype.clear = function () {
              return (
                this._geometry.clear(),
                this._lineStyle.reset(),
                this._fillStyle.reset(),
                this._boundsID++,
                (this._matrix = null),
                (this._holeMode = !1),
                (this.currentPath = null),
                this
              );
            }),
            (D.prototype.isFastRect = function () {
              var t = this._geometry.graphicsData;
              return (
                1 === t.length &&
                t[0].shape.type === K.SHAPES.RECT &&
                !(t[0].lineStyle.visible && t[0].lineStyle.width)
              );
            }),
            (D.prototype._render = function (t) {
              this.finishPoly();
              var e = this._geometry,
                i = t.context.supports.uint32Indices;
              e.updateBatches(i),
                e.batchable
                  ? (this.batchDirty !== e.batchDirty &&
                      this._populateBatches(),
                    this._renderBatched(t))
                  : (t.batch.flush(), this._renderDirect(t));
            }),
            (D.prototype._populateBatches = function () {
              var t = this._geometry,
                e = this.blendMode,
                i = t.batches.length;
              (this.batchTint = -1),
                (this._transformID = -1),
                (this.batchDirty = t.batchDirty),
                (this.batches.length = i),
                (this.vertexData = new Float32Array(t.points));
              for (var r = 0; r < i; r++) {
                var n = t.batches[r],
                  o = n.style.color,
                  s = new Float32Array(
                    this.vertexData.buffer,
                    4 * n.attribStart * 2,
                    2 * n.attribSize
                  ),
                  a = new Float32Array(
                    t.uvsFloat32.buffer,
                    4 * n.attribStart * 2,
                    2 * n.attribSize
                  ),
                  s = {
                    vertexData: s,
                    blendMode: e,
                    indices: new Uint16Array(
                      t.indicesUint16.buffer,
                      2 * n.start,
                      n.size
                    ),
                    uvs: a,
                    _batchRGB: c.hex2rgb(o),
                    _tintRGB: o,
                    _texture: n.style.texture,
                    alpha: n.style.alpha,
                    worldAlpha: 1,
                  };
                this.batches[r] = s;
              }
            }),
            (D.prototype._renderBatched = function (t) {
              if (this.batches.length) {
                t.batch.setObjectRenderer(t.plugins[this.pluginName]),
                  this.calculateVertices(),
                  this.calculateTints();
                for (var e = 0, i = this.batches.length; e < i; e++) {
                  var r = this.batches[e];
                  (r.worldAlpha = this.worldAlpha * r.alpha),
                    t.plugins[this.pluginName].render(r);
                }
              }
            }),
            (D.prototype._renderDirect = function (t) {
              var e = this._resolveDirectShader(t),
                i = this._geometry,
                r = this.tint,
                n = this.worldAlpha,
                o = e.uniforms,
                s = i.drawCalls;
              (o.translationMatrix = this.transform.worldTransform),
                (o.tint[0] = (((r >> 16) & 255) / 255) * n),
                (o.tint[1] = (((r >> 8) & 255) / 255) * n),
                (o.tint[2] = ((255 & r) / 255) * n),
                (o.tint[3] = n),
                t.shader.bind(e),
                t.geometry.bind(i, e),
                t.state.set(this.state);
              for (var a = 0, h = s.length; a < h; a++)
                this._renderDrawCallDirect(t, i.drawCalls[a]);
            }),
            (D.prototype._renderDrawCallDirect = function (t, e) {
              for (
                var i = e.texArray,
                  r = e.type,
                  n = e.size,
                  e = e.start,
                  o = i.count,
                  s = 0;
                s < o;
                s++
              )
                t.texture.bind(i.elements[s], s);
              t.geometry.draw(r, n, e);
            }),
            (D.prototype._resolveDirectShader = function (t) {
              var e = this.shader,
                i = this.pluginName;
              if (!e) {
                if (!M[i]) {
                  for (
                    var r = t.plugins.batch.MAX_TEXTURES,
                      n = new Int32Array(r),
                      o = 0;
                    o < r;
                    o++
                  )
                    n[o] = o;
                  var s = {
                      tint: new Float32Array([1, 1, 1, 1]),
                      translationMatrix: new K.Matrix(),
                      default: p.UniformGroup.from({ uSamplers: n }, !0),
                    },
                    t = t.plugins[i]._shader.program;
                  M[i] = new p.Shader(t, s);
                }
                e = M[i];
              }
              return e;
            }),
            (D.prototype._calculateBounds = function () {
              this.finishPoly();
              var t,
                e,
                i,
                r = this._geometry;
              r.graphicsData.length &&
                ((t = (r = r.bounds).minX),
                (e = r.minY),
                (i = r.maxX),
                (r = r.maxY),
                this._bounds.addFrame(this.transform, t, e, i, r));
            }),
            (D.prototype.containsPoint = function (t) {
              return (
                this.worldTransform.applyInverse(t, D._TEMP_POINT),
                this._geometry.containsPoint(D._TEMP_POINT)
              );
            }),
            (D.prototype.calculateTints = function () {
              if (this.batchTint !== this.tint) {
                this.batchTint = this.tint;
                for (
                  var t = c.hex2rgb(this.tint, z), e = 0;
                  e < this.batches.length;
                  e++
                ) {
                  var i = this.batches[e],
                    r = i._batchRGB,
                    r =
                      ((t[0] * r[0] * 255) << 16) +
                      ((t[1] * r[1] * 255) << 8) +
                      (0 | (t[2] * r[2] * 255));
                  i._tintRGB = (r >> 16) + (65280 & r) + ((255 & r) << 16);
                }
              }
            }),
            (D.prototype.calculateVertices = function () {
              var t = this.transform._worldID;
              if (this._transformID !== t) {
                this._transformID = t;
                for (
                  var t = this.transform.worldTransform,
                    e = t.a,
                    i = t.b,
                    r = t.c,
                    n = t.d,
                    o = t.tx,
                    s = t.ty,
                    a = this._geometry.points,
                    h = this.vertexData,
                    u = 0,
                    l = 0;
                  l < a.length;
                  l += 2
                ) {
                  var c = a[l],
                    d = a[l + 1];
                  (h[u++] = e * c + r * d + o), (h[u++] = n * d + i * c + s);
                }
              }
            }),
            (D.prototype.closePath = function () {
              var t = this.currentPath;
              return t && (t.closeStroke = !0), this;
            }),
            (D.prototype.setMatrix = function (t) {
              return (this._matrix = t), this;
            }),
            (D.prototype.beginHole = function () {
              return this.finishPoly(), (this._holeMode = !0), this;
            }),
            (D.prototype.endHole = function () {
              return this.finishPoly(), (this._holeMode = !1), this;
            }),
            (D.prototype.destroy = function (t) {
              this._geometry.refCount--,
                0 === this._geometry.refCount && this._geometry.dispose(),
                (this._matrix = null),
                (this.currentPath = null),
                this._lineStyle.destroy(),
                (this._lineStyle = null),
                this._fillStyle.destroy(),
                (this._fillStyle = null),
                (this._geometry = null),
                (this.shader = null),
                (this.vertexData = null),
                (this.batches.length = 0),
                (this.batches = null),
                A.prototype.destroy.call(this, t);
            }),
            (D._TEMP_POINT = new K.Point()),
            D);
        function D(t) {
          void 0 === t && (t = null);
          var e = A.call(this) || this;
          return (
            (e._geometry = t || new G()),
            e._geometry.refCount++,
            (e.shader = null),
            (e.state = p.State.for2d()),
            (e._fillStyle = new i()),
            (e._lineStyle = new H()),
            (e._matrix = null),
            (e._holeMode = !1),
            (e.currentPath = null),
            (e.batches = []),
            (e.batchTint = -1),
            (e.batchDirty = -1),
            (e.vertexData = null),
            (e.pluginName = 'batch'),
            (e._transformID = -1),
            (e.tint = 16777215),
            (e.blendMode = y.BLEND_MODES.NORMAL),
            e
          );
        }
        (q.FillStyle = i),
          (q.GRAPHICS_CURVES = Z),
          (q.Graphics = t),
          (q.GraphicsData = T),
          (q.GraphicsGeometry = G),
          (q.LineStyle = H),
          (q.graphicsUtils = b);
      },
      {
        '@pixi/constants': 3,
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/math': 16,
        '@pixi/utils': 34,
      },
    ],
    14: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/math'),
          n = t('@pixi/ticker'),
          o = t('@pixi/display'),
          t = t('@pixi/utils'),
          s =
            (Object.defineProperty(a.prototype, 'pointerId', {
              get: function () {
                return this.identifier;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (a.prototype.getLocalPosition = function (t, e, i) {
              return t.worldTransform.applyInverse(i || this.global, e);
            }),
            (a.prototype.copyEvent = function (t) {
              'isPrimary' in t && t.isPrimary && (this.isPrimary = !0),
                (this.button = 'button' in t && t.button);
              var e = 'buttons' in t && t.buttons;
              (this.buttons = Number.isInteger(e)
                ? e
                : 'which' in t && t.which),
                (this.width = 'width' in t && t.width),
                (this.height = 'height' in t && t.height),
                (this.tiltX = 'tiltX' in t && t.tiltX),
                (this.tiltY = 'tiltY' in t && t.tiltY),
                (this.pointerType = 'pointerType' in t && t.pointerType),
                (this.pressure = 'pressure' in t && t.pressure),
                (this.rotationAngle = 'rotationAngle' in t && t.rotationAngle),
                (this.twist = ('twist' in t && t.twist) || 0),
                (this.tangentialPressure =
                  ('tangentialPressure' in t && t.tangentialPressure) || 0);
            }),
            (a.prototype.reset = function () {
              this.isPrimary = !1;
            }),
            a);
        function a() {
          (this.pressure = 0),
            (this.rotationAngle = 0),
            (this.twist = 0),
            (this.tangentialPressure = 0),
            (this.global = new r.Point()),
            (this.target = null),
            (this.originalEvent = null),
            (this.identifier = null),
            (this.isPrimary = !1),
            (this.button = 0),
            (this.buttons = 0),
            (this.width = 0),
            (this.height = 0),
            (this.tiltX = 0),
            (this.tiltY = 0),
            (this.pointerType = null),
            (this.pressure = 0),
            (this.rotationAngle = 0),
            (this.twist = 0),
            (this.tangentialPressure = 0);
        }
        var h = function (t, e) {
          return (h =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        };
        (l.prototype.stopPropagation = function () {
          (this.stopped = !0),
            (this.stopPropagationHint = !0),
            (this.stopsPropagatingAt = this.currentTarget);
        }),
          (l.prototype.reset = function () {
            (this.stopped = !1),
              (this.stopsPropagatingAt = null),
              (this.stopPropagationHint = !1),
              (this.currentTarget = null),
              (this.target = null);
          });
        var u = l;
        function l() {
          (this.stopped = !1),
            (this.stopsPropagatingAt = null),
            (this.stopPropagationHint = !1),
            (this.target = null),
            (this.currentTarget = null),
            (this.type = null),
            (this.data = null);
        }
        (d.prototype._doSet = function (t, e) {
          this._flags = e ? this._flags | t : this._flags & ~t;
        }),
          Object.defineProperty(d.prototype, 'pointerId', {
            get: function () {
              return this._pointerId;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(d.prototype, 'flags', {
            get: function () {
              return this._flags;
            },
            set: function (t) {
              this._flags = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(d.prototype, 'none', {
            get: function () {
              return this._flags === d.FLAGS.NONE;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(d.prototype, 'over', {
            get: function () {
              return 0 != (this._flags & d.FLAGS.OVER);
            },
            set: function (t) {
              this._doSet(d.FLAGS.OVER, t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(d.prototype, 'rightDown', {
            get: function () {
              return 0 != (this._flags & d.FLAGS.RIGHT_DOWN);
            },
            set: function (t) {
              this._doSet(d.FLAGS.RIGHT_DOWN, t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(d.prototype, 'leftDown', {
            get: function () {
              return 0 != (this._flags & d.FLAGS.LEFT_DOWN);
            },
            set: function (t) {
              this._doSet(d.FLAGS.LEFT_DOWN, t);
            },
            enumerable: !1,
            configurable: !0,
          }),
          (d.FLAGS = Object.freeze({
            NONE: 0,
            OVER: 1,
            LEFT_DOWN: 2,
            RIGHT_DOWN: 4,
          }));
        var c = d;
        function d(t) {
          (this._pointerId = t), (this._flags = d.FLAGS.NONE);
        }
        (f.prototype.recursiveFindHit = function (t, e, i, r, n) {
          if (!e || !e.visible) return !1;
          var o = t.data.global,
            s = !1,
            a = (n = e.interactive || n),
            h = !0;
          if (
            (e.hitArea
              ? (r &&
                  (e.worldTransform.applyInverse(o, this._tempPoint),
                  e.hitArea.contains(this._tempPoint.x, this._tempPoint.y)
                    ? (s = !0)
                    : (h = r = !1)),
                (a = !1))
              : !e._mask ||
                !r ||
                (e._mask.containsPoint && e._mask.containsPoint(o)) ||
                (r = !1),
            h && e.interactiveChildren && e.children)
          )
            for (var u = e.children, l = u.length - 1; 0 <= l; l--) {
              var c = u[l],
                d = this.recursiveFindHit(t, c, i, r, a);
              d &&
                c.parent &&
                ((a = !1), d && (t.target && (r = !1), (s = !0)));
            }
          return (
            n &&
              (r &&
                !t.target &&
                !e.hitArea &&
                e.containsPoint &&
                e.containsPoint(o) &&
                (s = !0),
              e.interactive &&
                (s && !t.target && (t.target = e), i && i(t, e, !!s))),
            s
          );
        }),
          (f.prototype.findHit = function (t, e, i, r) {
            this.recursiveFindHit(t, e, i, r, !1);
          });
        var p = f;
        function f() {
          this._tempPoint = new r.Point();
        }
        var m,
          y,
          g = {
            interactive: !1,
            interactiveChildren: !0,
            hitArea: null,
            get buttonMode() {
              return 'pointer' === this.cursor;
            },
            set buttonMode(t) {
              t
                ? (this.cursor = 'pointer')
                : 'pointer' === this.cursor && (this.cursor = null);
            },
            cursor: null,
            get trackedPointers() {
              return (
                void 0 === this._trackedPointers &&
                  (this._trackedPointers = {}),
                this._trackedPointers
              );
            },
            _trackedPointers: void 0,
          },
          v =
            (o.DisplayObject.mixin(g),
            { target: null, data: { global: null } }),
          t =
            ((m = t.EventEmitter),
            h((y = x), (t = m)),
            (y.prototype =
              null === t
                ? Object.create(t)
                : ((_.prototype = t.prototype), new _())),
            Object.defineProperty(x.prototype, 'useSystemTicker', {
              get: function () {
                return this._useSystemTicker;
              },
              set: function (t) {
                (this._useSystemTicker = t)
                  ? this.addTickerListener()
                  : this.removeTickerListener();
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(x.prototype, 'lastObjectRendered', {
              get: function () {
                return (
                  this.renderer._lastObjectRendered || this._tempDisplayObject
                );
              },
              enumerable: !1,
              configurable: !0,
            }),
            (x.prototype.hitTest = function (t, e) {
              return (
                (v.target = null),
                (v.data.global = t),
                (e = e || this.lastObjectRendered),
                this.processInteractive(v, e, null, !0),
                v.target
              );
            }),
            (x.prototype.setTargetElement = function (t, e) {
              void 0 === e && (e = 1),
                this.removeTickerListener(),
                this.removeEvents(),
                (this.interactionDOMElement = t),
                (this.resolution = e),
                this.addEvents(),
                this.addTickerListener();
            }),
            (x.prototype.addTickerListener = function () {
              !this.tickerAdded &&
                this.interactionDOMElement &&
                this._useSystemTicker &&
                (n.Ticker.system.add(
                  this.tickerUpdate,
                  this,
                  n.UPDATE_PRIORITY.INTERACTION
                ),
                (this.tickerAdded = !0));
            }),
            (x.prototype.removeTickerListener = function () {
              this.tickerAdded &&
                (n.Ticker.system.remove(this.tickerUpdate, this),
                (this.tickerAdded = !1));
            }),
            (x.prototype.addEvents = function () {
              var t;
              !this.eventsAdded &&
                this.interactionDOMElement &&
                ((t = this.interactionDOMElement.style),
                window.navigator.msPointerEnabled
                  ? ((t.msContentZooming = 'none'), (t.msTouchAction = 'none'))
                  : this.supportsPointerEvents && (t.touchAction = 'none'),
                this.supportsPointerEvents
                  ? (window.document.addEventListener(
                      'pointermove',
                      this.onPointerMove,
                      !0
                    ),
                    this.interactionDOMElement.addEventListener(
                      'pointerdown',
                      this.onPointerDown,
                      !0
                    ),
                    this.interactionDOMElement.addEventListener(
                      'pointerleave',
                      this.onPointerOut,
                      !0
                    ),
                    this.interactionDOMElement.addEventListener(
                      'pointerover',
                      this.onPointerOver,
                      !0
                    ),
                    window.addEventListener(
                      'pointercancel',
                      this.onPointerCancel,
                      !0
                    ),
                    window.addEventListener('pointerup', this.onPointerUp, !0))
                  : (window.document.addEventListener(
                      'mousemove',
                      this.onPointerMove,
                      !0
                    ),
                    this.interactionDOMElement.addEventListener(
                      'mousedown',
                      this.onPointerDown,
                      !0
                    ),
                    this.interactionDOMElement.addEventListener(
                      'mouseout',
                      this.onPointerOut,
                      !0
                    ),
                    this.interactionDOMElement.addEventListener(
                      'mouseover',
                      this.onPointerOver,
                      !0
                    ),
                    window.addEventListener('mouseup', this.onPointerUp, !0)),
                this.supportsTouchEvents &&
                  (this.interactionDOMElement.addEventListener(
                    'touchstart',
                    this.onPointerDown,
                    !0
                  ),
                  this.interactionDOMElement.addEventListener(
                    'touchcancel',
                    this.onPointerCancel,
                    !0
                  ),
                  this.interactionDOMElement.addEventListener(
                    'touchend',
                    this.onPointerUp,
                    !0
                  ),
                  this.interactionDOMElement.addEventListener(
                    'touchmove',
                    this.onPointerMove,
                    !0
                  )),
                (this.eventsAdded = !0));
            }),
            (x.prototype.removeEvents = function () {
              var t;
              this.eventsAdded &&
                this.interactionDOMElement &&
                ((t = this.interactionDOMElement.style),
                window.navigator.msPointerEnabled
                  ? ((t.msContentZooming = ''), (t.msTouchAction = ''))
                  : this.supportsPointerEvents && (t.touchAction = ''),
                this.supportsPointerEvents
                  ? (window.document.removeEventListener(
                      'pointermove',
                      this.onPointerMove,
                      !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                      'pointerdown',
                      this.onPointerDown,
                      !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                      'pointerleave',
                      this.onPointerOut,
                      !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                      'pointerover',
                      this.onPointerOver,
                      !0
                    ),
                    window.removeEventListener(
                      'pointercancel',
                      this.onPointerCancel,
                      !0
                    ),
                    window.removeEventListener(
                      'pointerup',
                      this.onPointerUp,
                      !0
                    ))
                  : (window.document.removeEventListener(
                      'mousemove',
                      this.onPointerMove,
                      !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                      'mousedown',
                      this.onPointerDown,
                      !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                      'mouseout',
                      this.onPointerOut,
                      !0
                    ),
                    this.interactionDOMElement.removeEventListener(
                      'mouseover',
                      this.onPointerOver,
                      !0
                    ),
                    window.removeEventListener(
                      'mouseup',
                      this.onPointerUp,
                      !0
                    )),
                this.supportsTouchEvents &&
                  (this.interactionDOMElement.removeEventListener(
                    'touchstart',
                    this.onPointerDown,
                    !0
                  ),
                  this.interactionDOMElement.removeEventListener(
                    'touchcancel',
                    this.onPointerCancel,
                    !0
                  ),
                  this.interactionDOMElement.removeEventListener(
                    'touchend',
                    this.onPointerUp,
                    !0
                  ),
                  this.interactionDOMElement.removeEventListener(
                    'touchmove',
                    this.onPointerMove,
                    !0
                  )),
                (this.interactionDOMElement = null),
                (this.eventsAdded = !1));
            }),
            (x.prototype.tickerUpdate = function (t) {
              (this._deltaTime += t),
                this._deltaTime < this.interactionFrequency ||
                  ((this._deltaTime = 0), this.update());
            }),
            (x.prototype.update = function () {
              if (this.interactionDOMElement)
                if (this._didMove) this._didMove = !1;
                else {
                  for (var t in ((this.cursor = null),
                  this.activeInteractionData))
                    !this.activeInteractionData.hasOwnProperty(t) ||
                      ((t = this.activeInteractionData[t]).originalEvent &&
                        'touch' !== t.pointerType &&
                        ((t = this.configureInteractionEventForDOMEvent(
                          this.eventData,
                          t.originalEvent,
                          t
                        )),
                        this.processInteractive(
                          t,
                          this.lastObjectRendered,
                          this.processPointerOverOut,
                          !0
                        )));
                  this.setCursorMode(this.cursor);
                }
            }),
            (x.prototype.setCursorMode = function (t) {
              if (this.currentCursorMode !== (t = t || 'default')) {
                this.currentCursorMode = t;
                var e = this.cursorStyles[t];
                if (e)
                  switch (typeof e) {
                    case 'string':
                      this.interactionDOMElement.style.cursor = e;
                      break;
                    case 'function':
                      e(t);
                      break;
                    case 'object':
                      Object.assign(this.interactionDOMElement.style, e);
                  }
                else
                  'string' != typeof t ||
                    Object.prototype.hasOwnProperty.call(
                      this.cursorStyles,
                      t
                    ) ||
                    (this.interactionDOMElement.style.cursor = t);
              }
            }),
            (x.prototype.dispatchEvent = function (t, e, i) {
              (i.stopPropagationHint && t !== i.stopsPropagatingAt) ||
                ((i.currentTarget = t),
                (i.type = e),
                t.emit(e, i),
                t[e] && t[e](i));
            }),
            (x.prototype.delayDispatchEvent = function (t, e, i) {
              this.delayedEvents.push({
                displayObject: t,
                eventString: e,
                eventData: i,
              });
            }),
            (x.prototype.mapPositionToPoint = function (t, e, i) {
              var r = this.interactionDOMElement.parentElement
                  ? this.interactionDOMElement.getBoundingClientRect()
                  : { x: 0, y: 0, width: 0, height: 0 },
                n = 1 / this.resolution;
              (t.x =
                (e - r.left) *
                (this.interactionDOMElement.width / r.width) *
                n),
                (t.y =
                  (i - r.top) *
                  (this.interactionDOMElement.height / r.height) *
                  n);
            }),
            (x.prototype.processInteractive = function (t, e, i, r) {
              var e = this.search.findHit(t, e, i, r),
                n = this.delayedEvents;
              if (!n.length) return e;
              t.stopPropagationHint = !1;
              var o = n.length;
              this.delayedEvents = [];
              for (var s = 0; s < o; s++) {
                var a = n[s],
                  h = a.displayObject,
                  u = a.eventString,
                  a = a.eventData;
                a.stopsPropagatingAt === h && (a.stopPropagationHint = !0),
                  this.dispatchEvent(h, u, a);
              }
              return e;
            }),
            (x.prototype.onPointerDown = function (t) {
              if (!this.supportsTouchEvents || 'touch' !== t.pointerType)
                for (
                  var e = this.normalizeToPointerData(t),
                    i =
                      (!this.autoPreventDefault ||
                        !e[0].isNormalized ||
                        (!t.cancelable && ('cancelable' in t)) ||
                        t.preventDefault(),
                      e.length),
                    r = 0;
                  r < i;
                  r++
                ) {
                  var n = e[r],
                    o = this.getInteractionDataForPointerId(n),
                    o = this.configureInteractionEventForDOMEvent(
                      this.eventData,
                      n,
                      o
                    );
                  (o.data.originalEvent = t),
                    this.processInteractive(
                      o,
                      this.lastObjectRendered,
                      this.processPointerDown,
                      !0
                    ),
                    this.emit('pointerdown', o),
                    'touch' === n.pointerType
                      ? this.emit('touchstart', o)
                      : ('mouse' !== n.pointerType &&
                          'pen' !== n.pointerType) ||
                        ((o = 2 === n.button),
                        this.emit(
                          o ? 'rightdown' : 'mousedown',
                          this.eventData
                        ));
                }
            }),
            (x.prototype.processPointerDown = function (t, e, i) {
              var r = t.data,
                n = t.data.identifier;
              i &&
                (e.trackedPointers[n] || (e.trackedPointers[n] = new c(n)),
                this.dispatchEvent(e, 'pointerdown', t),
                'touch' === r.pointerType
                  ? this.dispatchEvent(e, 'touchstart', t)
                  : ('mouse' !== r.pointerType && 'pen' !== r.pointerType) ||
                    ((i = 2 === r.button)
                      ? (e.trackedPointers[n].rightDown = !0)
                      : (e.trackedPointers[n].leftDown = !0),
                    this.dispatchEvent(e, i ? 'rightdown' : 'mousedown', t)));
            }),
            (x.prototype.onPointerComplete = function (t, e, i) {
              for (
                var r = this.normalizeToPointerData(t),
                  n = r.length,
                  o = t.target !== this.interactionDOMElement ? 'outside' : '',
                  s = 0;
                s < n;
                s++
              ) {
                var a,
                  h = r[s],
                  u = this.getInteractionDataForPointerId(h),
                  u = this.configureInteractionEventForDOMEvent(
                    this.eventData,
                    h,
                    u
                  );
                (u.data.originalEvent = t),
                  this.processInteractive(
                    u,
                    this.lastObjectRendered,
                    i,
                    e || !o
                  ),
                  this.emit(e ? 'pointercancel' : 'pointerup' + o, u),
                  'mouse' === h.pointerType || 'pen' === h.pointerType
                    ? ((a = 2 === h.button),
                      this.emit(a ? 'rightup' + o : 'mouseup' + o, u))
                    : 'touch' === h.pointerType &&
                      (this.emit(e ? 'touchcancel' : 'touchend' + o, u),
                      this.releaseInteractionDataForPointerId(h.pointerId));
              }
            }),
            (x.prototype.onPointerCancel = function (t) {
              (this.supportsTouchEvents && 'touch' === t.pointerType) ||
                this.onPointerComplete(t, !0, this.processPointerCancel);
            }),
            (x.prototype.processPointerCancel = function (t, e) {
              var i = t.data,
                r = t.data.identifier;
              void 0 !== e.trackedPointers[r] &&
                (delete e.trackedPointers[r],
                this.dispatchEvent(e, 'pointercancel', t),
                'touch' === i.pointerType &&
                  this.dispatchEvent(e, 'touchcancel', t));
            }),
            (x.prototype.onPointerUp = function (t) {
              (this.supportsTouchEvents && 'touch' === t.pointerType) ||
                this.onPointerComplete(t, !1, this.processPointerUp);
            }),
            (x.prototype.processPointerUp = function (t, e, i) {
              var r,
                n = t.data,
                o = t.data.identifier,
                s = e.trackedPointers[o],
                a = 'touch' === n.pointerType,
                h = 'mouse' === n.pointerType || 'pen' === n.pointerType,
                u = !1;
              h &&
                ((n = 2 === n.button),
                (r = c.FLAGS),
                (r = n ? r.RIGHT_DOWN : r.LEFT_DOWN),
                (r = void 0 !== s && s.flags & r),
                i
                  ? (this.dispatchEvent(e, n ? 'rightup' : 'mouseup', t),
                    r &&
                      (this.dispatchEvent(e, n ? 'rightclick' : 'click', t),
                      (u = !0)))
                  : r &&
                    this.dispatchEvent(
                      e,
                      n ? 'rightupoutside' : 'mouseupoutside',
                      t
                    ),
                s && (n ? (s.rightDown = !1) : (s.leftDown = !1))),
                i
                  ? (this.dispatchEvent(e, 'pointerup', t),
                    a && this.dispatchEvent(e, 'touchend', t),
                    s &&
                      ((h && !u) || this.dispatchEvent(e, 'pointertap', t),
                      a && (this.dispatchEvent(e, 'tap', t), (s.over = !1))))
                  : s &&
                    (this.dispatchEvent(e, 'pointerupoutside', t),
                    a && this.dispatchEvent(e, 'touchendoutside', t)),
                s && s.none && delete e.trackedPointers[o];
            }),
            (x.prototype.onPointerMove = function (t) {
              if (!this.supportsTouchEvents || 'touch' !== t.pointerType) {
                for (
                  var e = this.normalizeToPointerData(t),
                    i =
                      (('mouse' !== e[0].pointerType &&
                        'pen' !== e[0].pointerType) ||
                        ((this._didMove = !0), (this.cursor = null)),
                      e.length),
                    r = 0;
                  r < i;
                  r++
                ) {
                  var n = e[r],
                    o = this.getInteractionDataForPointerId(n),
                    o = this.configureInteractionEventForDOMEvent(
                      this.eventData,
                      n,
                      o
                    );
                  (o.data.originalEvent = t),
                    this.processInteractive(
                      o,
                      this.lastObjectRendered,
                      this.processPointerMove,
                      !0
                    ),
                    this.emit('pointermove', o),
                    'touch' === n.pointerType && this.emit('touchmove', o),
                    ('mouse' !== n.pointerType && 'pen' !== n.pointerType) ||
                      this.emit('mousemove', o);
                }
                'mouse' === e[0].pointerType && this.setCursorMode(this.cursor);
              }
            }),
            (x.prototype.processPointerMove = function (t, e, i) {
              var r = t.data,
                n = 'touch' === r.pointerType,
                r = 'mouse' === r.pointerType || 'pen' === r.pointerType;
              r && this.processPointerOverOut(t, e, i),
                (this.moveWhenInside && !i) ||
                  (this.dispatchEvent(e, 'pointermove', t),
                  n && this.dispatchEvent(e, 'touchmove', t),
                  r && this.dispatchEvent(e, 'mousemove', t));
            }),
            (x.prototype.onPointerOut = function (t) {
              var e, i;
              (this.supportsTouchEvents && 'touch' === t.pointerType) ||
                ('mouse' ===
                  (t = this.normalizeToPointerData(t)[0]).pointerType &&
                  ((this.mouseOverRenderer = !1), this.setCursorMode(null)),
                (e = this.getInteractionDataForPointerId(t)),
                ((i = this.configureInteractionEventForDOMEvent(
                  this.eventData,
                  t,
                  e
                )).data.originalEvent = t),
                this.processInteractive(
                  i,
                  this.lastObjectRendered,
                  this.processPointerOverOut,
                  !1
                ),
                this.emit('pointerout', i),
                'mouse' === t.pointerType || 'pen' === t.pointerType
                  ? this.emit('mouseout', i)
                  : this.releaseInteractionDataForPointerId(e.identifier));
            }),
            (x.prototype.processPointerOverOut = function (t, e, i) {
              var r = t.data,
                n = t.data.identifier,
                r = 'mouse' === r.pointerType || 'pen' === r.pointerType,
                o = e.trackedPointers[n];
              void 0 !==
                (o = i && !o ? (e.trackedPointers[n] = new c(n)) : o) &&
                (i && this.mouseOverRenderer
                  ? (o.over ||
                      ((o.over = !0),
                      this.delayDispatchEvent(e, 'pointerover', t),
                      r && this.delayDispatchEvent(e, 'mouseover', t)),
                    r && null === this.cursor && (this.cursor = e.cursor))
                  : o.over &&
                    ((o.over = !1),
                    this.dispatchEvent(e, 'pointerout', this.eventData),
                    r && this.dispatchEvent(e, 'mouseout', t),
                    o.none && delete e.trackedPointers[n]));
            }),
            (x.prototype.onPointerOver = function (t) {
              var t = this.normalizeToPointerData(t)[0],
                e = this.getInteractionDataForPointerId(t),
                e = this.configureInteractionEventForDOMEvent(
                  this.eventData,
                  t,
                  e
                );
              'mouse' === (e.data.originalEvent = t).pointerType &&
                (this.mouseOverRenderer = !0),
                this.emit('pointerover', e),
                ('mouse' !== t.pointerType && 'pen' !== t.pointerType) ||
                  this.emit('mouseover', e);
            }),
            (x.prototype.getInteractionDataForPointerId = function (t) {
              var e,
                i = t.pointerId;
              return (
                1 === i || 'mouse' === t.pointerType
                  ? (e = this.mouse)
                  : this.activeInteractionData[i]
                  ? (e = this.activeInteractionData[i])
                  : (((e =
                      this.interactionDataPool.pop() || new s()).identifier =
                      i),
                    (this.activeInteractionData[i] = e)),
                e.copyEvent(t),
                e
              );
            }),
            (x.prototype.releaseInteractionDataForPointerId = function (t) {
              var e = this.activeInteractionData[t];
              e &&
                (delete this.activeInteractionData[t],
                e.reset(),
                this.interactionDataPool.push(e));
            }),
            (x.prototype.configureInteractionEventForDOMEvent = function (
              t,
              e,
              i
            ) {
              return (
                (t.data = i),
                this.mapPositionToPoint(i.global, e.clientX, e.clientY),
                'touch' === e.pointerType &&
                  ((e.globalX = i.global.x), (e.globalY = i.global.y)),
                (i.originalEvent = e),
                t.reset(),
                t
              );
            }),
            (x.prototype.normalizeToPointerData = function (t) {
              var e,
                i = [];
              if (this.supportsTouchEvents && t instanceof TouchEvent)
                for (var r = 0, n = t.changedTouches.length; r < n; r++) {
                  var o = t.changedTouches[r];
                  void 0 === o.button && (o.button = t.touches.length ? 1 : 0),
                    void 0 === o.buttons &&
                      (o.buttons = t.touches.length ? 1 : 0),
                    void 0 === o.isPrimary &&
                      (o.isPrimary =
                        1 === t.touches.length && 'touchstart' === t.type),
                    void 0 === o.width && (o.width = o.radiusX || 1),
                    void 0 === o.height && (o.height = o.radiusY || 1),
                    void 0 === o.tiltX && (o.tiltX = 0),
                    void 0 === o.tiltY && (o.tiltY = 0),
                    void 0 === o.pointerType && (o.pointerType = 'touch'),
                    void 0 === o.pointerId && (o.pointerId = o.identifier || 0),
                    void 0 === o.pressure && (o.pressure = o.force || 0.5),
                    void 0 === o.twist && (o.twist = 0),
                    void 0 === o.tangentialPressure &&
                      (o.tangentialPressure = 0),
                    void 0 === o.layerX && (o.layerX = o.offsetX = o.clientX),
                    void 0 === o.layerY && (o.layerY = o.offsetY = o.clientY),
                    (o.isNormalized = !0),
                    i.push(o);
                }
              else
                !(t instanceof MouseEvent) ||
                (this.supportsPointerEvents && t instanceof window.PointerEvent)
                  ? i.push(t)
                  : (void 0 === (e = t).isPrimary && (e.isPrimary = !0),
                    void 0 === e.width && (e.width = 1),
                    void 0 === e.height && (e.height = 1),
                    void 0 === e.tiltX && (e.tiltX = 0),
                    void 0 === e.tiltY && (e.tiltY = 0),
                    void 0 === e.pointerType && (e.pointerType = 'mouse'),
                    void 0 === e.pointerId && (e.pointerId = 1),
                    void 0 === e.pressure && (e.pressure = 0.5),
                    void 0 === e.twist && (e.twist = 0),
                    void 0 === e.tangentialPressure &&
                      (e.tangentialPressure = 0),
                    (e.isNormalized = !0),
                    i.push(e));
              return i;
            }),
            (x.prototype.destroy = function () {
              this.removeEvents(),
                this.removeTickerListener(),
                this.removeAllListeners(),
                (this.renderer = null),
                (this.mouse = null),
                (this.eventData = null),
                (this.interactionDOMElement = null),
                (this.onPointerDown = null),
                (this.processPointerDown = null),
                (this.onPointerUp = null),
                (this.processPointerUp = null),
                (this.onPointerCancel = null),
                (this.processPointerCancel = null),
                (this.onPointerMove = null),
                (this.processPointerMove = null),
                (this.onPointerOut = null),
                (this.processPointerOverOut = null),
                (this.onPointerOver = null),
                (this.search = null);
            }),
            x);
        function _() {
          this.constructor = y;
        }
        function x(t, e) {
          var i = m.call(this) || this;
          return (
            (e = e || {}),
            (i.renderer = t),
            (i.autoPreventDefault =
              void 0 === e.autoPreventDefault || e.autoPreventDefault),
            (i.interactionFrequency = e.interactionFrequency || 10),
            (i.mouse = new s()),
            (i.mouse.identifier = 1),
            i.mouse.global.set(-999999),
            (i.activeInteractionData = {}),
            (i.activeInteractionData[1] = i.mouse),
            (i.interactionDataPool = []),
            (i.eventData = new u()),
            (i.interactionDOMElement = null),
            (i.moveWhenInside = !1),
            (i.eventsAdded = !1),
            (i.tickerAdded = !1),
            (i.mouseOverRenderer = !1),
            (i.supportsTouchEvents = 'ontouchstart' in window),
            (i.supportsPointerEvents = !!window.PointerEvent),
            (i.onPointerUp = i.onPointerUp.bind(i)),
            (i.processPointerUp = i.processPointerUp.bind(i)),
            (i.onPointerCancel = i.onPointerCancel.bind(i)),
            (i.processPointerCancel = i.processPointerCancel.bind(i)),
            (i.onPointerDown = i.onPointerDown.bind(i)),
            (i.processPointerDown = i.processPointerDown.bind(i)),
            (i.onPointerMove = i.onPointerMove.bind(i)),
            (i.processPointerMove = i.processPointerMove.bind(i)),
            (i.onPointerOut = i.onPointerOut.bind(i)),
            (i.processPointerOverOut = i.processPointerOverOut.bind(i)),
            (i.onPointerOver = i.onPointerOver.bind(i)),
            (i.cursorStyles = { default: 'inherit', pointer: 'pointer' }),
            (i.currentCursorMode = null),
            (i.cursor = null),
            (i.resolution = 1),
            (i.delayedEvents = []),
            (i.search = new p()),
            (i._tempDisplayObject = new o.TemporaryDisplayObject()),
            (i._useSystemTicker =
              void 0 === e.useSystemTicker || e.useSystemTicker),
            i.setTargetElement(i.renderer.view, i.renderer.resolution),
            i
          );
        }
        (i.InteractionData = s),
          (i.InteractionEvent = u),
          (i.InteractionManager = t),
          (i.InteractionTrackingData = c),
          (i.interactiveTarget = g);
      },
      {
        '@pixi/display': 5,
        '@pixi/math': 16,
        '@pixi/ticker': 33,
        '@pixi/utils': 34,
      },
    ],
    15: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('resource-loader'),
          n = t('@pixi/core'),
          t = r.Resource,
          o = function (t, e) {
            return (o =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        a.use = function (t, e) {
          t.data &&
            t.type === r.Resource.TYPE.IMAGE &&
            (t.texture = n.Texture.fromLoader(t.data, t.url, t.name)),
            e();
        };
        var s = a;
        function a() {}
        (h = r.Loader),
          o((u = p), (l = h)),
          (u.prototype =
            null === l
              ? Object.create(l)
              : ((d.prototype = l.prototype), new d())),
          (p.prototype.destroy = function () {
            this._protected || this.reset();
          }),
          Object.defineProperty(p, 'shared', {
            get: function () {
              var t = p._shared;
              return t || (((t = new p())._protected = !0), (p._shared = t)), t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (p.registerPlugin = function (t) {
            return p._plugins.push(t), t.add && t.add(), p;
          }),
          (p._plugins = []);
        var h,
          u,
          l,
          c = p;
        function d() {
          this.constructor = u;
        }
        function p(t, e) {
          for (
            var i = h.call(this, t, e) || this, r = 0;
            r < p._plugins.length;
            ++r
          ) {
            var n = p._plugins[r],
              o = n.pre,
              n = n.use;
            o && i.pre(o), n && i.use(n);
          }
          return (i._protected = !1), i;
        }
        function f() {}
        c.registerPlugin({ use: r.middleware.parsing }),
          c.registerPlugin(s),
          (f.init = function (t) {
            (t = Object.assign({ sharedLoader: !1 }, t)),
              (this.loader = t.sharedLoader ? c.shared : new c());
          }),
          (f.destroy = function () {
            this.loader && (this.loader.destroy(), (this.loader = null));
          }),
          (i.AppLoaderPlugin = f),
          (i.Loader = c),
          (i.LoaderResource = t),
          (i.TextureLoader = s);
      },
      { '@pixi/core': 4, 'resource-loader': 49 },
    ],
    16: [
      function (F, B, a) {
        'use strict';
        Object.defineProperty(a, '__esModule', { value: !0 });
        var h = 2 * Math.PI,
          t = 180 / Math.PI,
          e = Math.PI / 180,
          i =
            (((n = a.SHAPES || (a.SHAPES = {}))[(n.POLY = 0)] = 'POLY'),
            (n[(n.RECT = 1)] = 'RECT'),
            (n[(n.CIRC = 2)] = 'CIRC'),
            (n[(n.ELIP = 3)] = 'ELIP'),
            (n[(n.RREC = 4)] = 'RREC'),
            Object.defineProperty(r.prototype, 'left', {
              get: function () {
                return this.x;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(r.prototype, 'right', {
              get: function () {
                return this.x + this.width;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(r.prototype, 'top', {
              get: function () {
                return this.y;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(r.prototype, 'bottom', {
              get: function () {
                return this.y + this.height;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(r, 'EMPTY', {
              get: function () {
                return new r(0, 0, 0, 0);
              },
              enumerable: !1,
              configurable: !0,
            }),
            (r.prototype.clone = function () {
              return new r(this.x, this.y, this.width, this.height);
            }),
            (r.prototype.copyFrom = function (t) {
              return (
                (this.x = t.x),
                (this.y = t.y),
                (this.width = t.width),
                (this.height = t.height),
                this
              );
            }),
            (r.prototype.copyTo = function (t) {
              return (
                (t.x = this.x),
                (t.y = this.y),
                (t.width = this.width),
                (t.height = this.height),
                t
              );
            }),
            (r.prototype.contains = function (t, e) {
              return (
                !(this.width <= 0 || this.height <= 0) &&
                t >= this.x &&
                t < this.x + this.width &&
                e >= this.y &&
                e < this.y + this.height
              );
            }),
            (r.prototype.pad = function (t, e) {
              return (
                void 0 === t && (t = 0),
                void 0 === e && (e = t),
                (this.x -= t),
                (this.y -= e),
                (this.width += 2 * t),
                (this.height += 2 * e),
                this
              );
            }),
            (r.prototype.fit = function (t) {
              var e = Math.max(this.x, t.x),
                i = Math.min(this.x + this.width, t.x + t.width),
                r = Math.max(this.y, t.y),
                t = Math.min(this.y + this.height, t.y + t.height);
              return (
                (this.x = e),
                (this.width = Math.max(i - e, 0)),
                (this.y = r),
                (this.height = Math.max(t - r, 0)),
                this
              );
            }),
            (r.prototype.ceil = function (t, e) {
              void 0 === t && (t = 1), void 0 === e && (e = 0.001);
              var i = Math.ceil((this.x + this.width - e) * t) / t,
                r = Math.ceil((this.y + this.height - e) * t) / t;
              return (
                (this.x = Math.floor((this.x + e) * t) / t),
                (this.y = Math.floor((this.y + e) * t) / t),
                (this.width = i - this.x),
                (this.height = r - this.y),
                this
              );
            }),
            (r.prototype.enlarge = function (t) {
              var e = Math.min(this.x, t.x),
                i = Math.max(this.x + this.width, t.x + t.width),
                r = Math.min(this.y, t.y),
                t = Math.max(this.y + this.height, t.y + t.height);
              return (
                (this.x = e),
                (this.width = i - e),
                (this.y = r),
                (this.height = t - r),
                this
              );
            }),
            r);
        function r(t, e, i, r) {
          void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            void 0 === r && (r = 0),
            (this.x = Number(t)),
            (this.y = Number(e)),
            (this.width = Number(i)),
            (this.height = Number(r)),
            (this.type = a.SHAPES.RECT);
        }
        (o.prototype.clone = function () {
          return new o(this.x, this.y, this.radius);
        }),
          (o.prototype.contains = function (t, e) {
            if (this.radius <= 0) return !1;
            var i = this.radius * this.radius,
              t = this.x - t,
              e = this.y - e;
            return (t *= t) + (e *= e) <= i;
          }),
          (o.prototype.getBounds = function () {
            return new i(
              this.x - this.radius,
              this.y - this.radius,
              2 * this.radius,
              2 * this.radius
            );
          });
        var n = o;
        function o(t, e, i) {
          void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            (this.x = t = void 0 === t ? 0 : t),
            (this.y = e),
            (this.radius = i),
            (this.type = a.SHAPES.CIRC);
        }
        (u.prototype.clone = function () {
          return new u(this.x, this.y, this.width, this.height);
        }),
          (u.prototype.contains = function (t, e) {
            if (this.width <= 0 || this.height <= 0) return !1;
            (t = (t - this.x) / this.width), (e = (e - this.y) / this.height);
            return (t *= t) + (e *= e) <= 1;
          }),
          (u.prototype.getBounds = function () {
            return new i(
              this.x - this.width,
              this.y - this.height,
              this.width,
              this.height
            );
          });
        var s = u;
        function u(t, e, i, r) {
          void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            void 0 === r && (r = 0),
            (this.x = t = void 0 === t ? 0 : t),
            (this.y = e),
            (this.width = i),
            (this.height = r),
            (this.type = a.SHAPES.ELIP);
        }
        (c.prototype.clone = function () {
          var t = new c(this.points.slice());
          return (t.closeStroke = this.closeStroke), t;
        }),
          (c.prototype.contains = function (t, e) {
            for (
              var i = !1, r = this.points.length / 2, n = 0, o = r - 1;
              n < r;
              o = n++
            ) {
              var s = this.points[2 * n],
                a = this.points[2 * n + 1],
                h = this.points[2 * o],
                u = this.points[2 * o + 1];
              e < a != e < u &&
                t < ((e - a) / (u - a)) * (h - s) + s &&
                (i = !i);
            }
            return i;
          });
        var l = c;
        function c() {
          for (var t = arguments, e = [], i = 0; i < arguments.length; i++)
            e[i] = t[i];
          var r = Array.isArray(e[0]) ? e[0] : e;
          if ('number' != typeof r[0]) {
            for (var n = [], o = 0, s = r.length; o < s; o++)
              n.push(r[o].x, r[o].y);
            r = n;
          }
          (this.points = r),
            (this.type = a.SHAPES.POLY),
            (this.closeStroke = !0);
        }
        (p.prototype.clone = function () {
          return new p(this.x, this.y, this.width, this.height, this.radius);
        }),
          (p.prototype.contains = function (t, e) {
            if (this.width <= 0 || this.height <= 0) return !1;
            if (
              t >= this.x &&
              t <= this.x + this.width &&
              e >= this.y &&
              e <= this.y + this.height
            ) {
              if (
                (e >= this.y + this.radius &&
                  e <= this.y + this.height - this.radius) ||
                (t >= this.x + this.radius &&
                  t <= this.x + this.width - this.radius)
              )
                return !0;
              var i = t - (this.x + this.radius),
                r = e - (this.y + this.radius),
                n = this.radius * this.radius;
              if (i * i + r * r <= n) return !0;
              if (
                (i = t - (this.x + this.width - this.radius)) * i + r * r <=
                n
              )
                return !0;
              if (
                i * i + (r = e - (this.y + this.height - this.radius)) * r <=
                n
              )
                return !0;
              if ((i = t - (this.x + this.radius)) * i + r * r <= n) return !0;
            }
            return !1;
          });
        var d = p;
        function p(t, e, i, r, n) {
          void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            void 0 === r && (r = 0),
            void 0 === n && (n = 20),
            (this.x = t = void 0 === t ? 0 : t),
            (this.y = e),
            (this.width = i),
            (this.height = r),
            (this.radius = n),
            (this.type = a.SHAPES.RREC);
        }
        (m.prototype.clone = function () {
          return new m(this.x, this.y);
        }),
          (m.prototype.copyFrom = function (t) {
            return this.set(t.x, t.y), this;
          }),
          (m.prototype.copyTo = function (t) {
            return t.set(this.x, this.y), t;
          }),
          (m.prototype.equals = function (t) {
            return t.x === this.x && t.y === this.y;
          }),
          (m.prototype.set = function (t, e) {
            return (
              void 0 === t && (t = 0),
              void 0 === e && (e = t),
              (this.x = t),
              (this.y = e),
              this
            );
          });
        var f = m;
        function m(t, e) {
          void 0 === e && (e = 0),
            (this.x = t = void 0 === t ? 0 : t),
            (this.y = e);
        }
        (g.prototype.clone = function (t, e) {
          return new g(
            (t = void 0 === t ? this.cb : t),
            (e = void 0 === e ? this.scope : e),
            this._x,
            this._y
          );
        }),
          (g.prototype.set = function (t, e) {
            return (
              void 0 === t && (t = 0),
              void 0 === e && (e = t),
              (this._x === t && this._y === e) ||
                ((this._x = t), (this._y = e), this.cb.call(this.scope)),
              this
            );
          }),
          (g.prototype.copyFrom = function (t) {
            return (
              (this._x === t.x && this._y === t.y) ||
                ((this._x = t.x), (this._y = t.y), this.cb.call(this.scope)),
              this
            );
          }),
          (g.prototype.copyTo = function (t) {
            return t.set(this._x, this._y), t;
          }),
          (g.prototype.equals = function (t) {
            return t.x === this._x && t.y === this._y;
          }),
          Object.defineProperty(g.prototype, 'x', {
            get: function () {
              return this._x;
            },
            set: function (t) {
              this._x !== t && ((this._x = t), this.cb.call(this.scope));
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(g.prototype, 'y', {
            get: function () {
              return this._y;
            },
            set: function (t) {
              this._y !== t && ((this._y = t), this.cb.call(this.scope));
            },
            enumerable: !1,
            configurable: !0,
          });
        var y = g;
        function g(t, e, i, r) {
          void 0 === r && (r = 0),
            (this._x = i = void 0 === i ? 0 : i),
            (this._y = r),
            (this.cb = t),
            (this.scope = e);
        }
        (_.prototype.fromArray = function (t) {
          (this.a = t[0]),
            (this.b = t[1]),
            (this.c = t[3]),
            (this.d = t[4]),
            (this.tx = t[2]),
            (this.ty = t[5]);
        }),
          (_.prototype.set = function (t, e, i, r, n, o) {
            return (
              (this.a = t),
              (this.b = e),
              (this.c = i),
              (this.d = r),
              (this.tx = n),
              (this.ty = o),
              this
            );
          }),
          (_.prototype.toArray = function (t, e) {
            this.array || (this.array = new Float32Array(9));
            e = e || this.array;
            return (
              t
                ? ((e[0] = this.a),
                  (e[1] = this.b),
                  (e[2] = 0),
                  (e[3] = this.c),
                  (e[4] = this.d),
                  (e[5] = 0),
                  (e[6] = this.tx),
                  (e[7] = this.ty))
                : ((e[0] = this.a),
                  (e[1] = this.c),
                  (e[2] = this.tx),
                  (e[3] = this.b),
                  (e[4] = this.d),
                  (e[5] = this.ty),
                  (e[6] = 0),
                  (e[7] = 0)),
              (e[8] = 1),
              e
            );
          }),
          (_.prototype.apply = function (t, e) {
            e = e || new f();
            var i = t.x,
              t = t.y;
            return (
              (e.x = this.a * i + this.c * t + this.tx),
              (e.y = this.b * i + this.d * t + this.ty),
              e
            );
          }),
          (_.prototype.applyInverse = function (t, e) {
            e = e || new f();
            var i = 1 / (this.a * this.d + this.c * -this.b),
              r = t.x,
              t = t.y;
            return (
              (e.x =
                this.d * i * r +
                -this.c * i * t +
                (this.ty * this.c - this.tx * this.d) * i),
              (e.y =
                this.a * i * t +
                -this.b * i * r +
                (-this.ty * this.a + this.tx * this.b) * i),
              e
            );
          }),
          (_.prototype.translate = function (t, e) {
            return (this.tx += t), (this.ty += e), this;
          }),
          (_.prototype.scale = function (t, e) {
            return (
              (this.a *= t),
              (this.d *= e),
              (this.c *= t),
              (this.b *= e),
              (this.tx *= t),
              (this.ty *= e),
              this
            );
          }),
          (_.prototype.rotate = function (t) {
            var e = Math.cos(t),
              t = Math.sin(t),
              i = this.a,
              r = this.c,
              n = this.tx;
            return (
              (this.a = i * e - this.b * t),
              (this.b = i * t + this.b * e),
              (this.c = r * e - this.d * t),
              (this.d = r * t + this.d * e),
              (this.tx = n * e - this.ty * t),
              (this.ty = n * t + this.ty * e),
              this
            );
          }),
          (_.prototype.append = function (t) {
            var e = this.a,
              i = this.b,
              r = this.c,
              n = this.d;
            return (
              (this.a = t.a * e + t.b * r),
              (this.b = t.a * i + t.b * n),
              (this.c = t.c * e + t.d * r),
              (this.d = t.c * i + t.d * n),
              (this.tx = t.tx * e + t.ty * r + this.tx),
              (this.ty = t.tx * i + t.ty * n + this.ty),
              this
            );
          }),
          (_.prototype.setTransform = function (t, e, i, r, n, o, s, a, h) {
            return (
              (this.a = Math.cos(s + h) * n),
              (this.b = Math.sin(s + h) * n),
              (this.c = -Math.sin(s - a) * o),
              (this.d = Math.cos(s - a) * o),
              (this.tx = t - (i * this.a + r * this.c)),
              (this.ty = e - (i * this.b + r * this.d)),
              this
            );
          }),
          (_.prototype.prepend = function (t) {
            var e,
              i,
              r = this.tx;
            return (
              (1 === t.a && 0 === t.b && 0 === t.c && 1 === t.d) ||
                ((e = this.a),
                (i = this.c),
                (this.a = e * t.a + this.b * t.c),
                (this.b = e * t.b + this.b * t.d),
                (this.c = i * t.a + this.d * t.c),
                (this.d = i * t.b + this.d * t.d)),
              (this.tx = r * t.a + this.ty * t.c + t.tx),
              (this.ty = r * t.b + this.ty * t.d + t.ty),
              this
            );
          }),
          (_.prototype.decompose = function (t) {
            var e = this.a,
              i = this.b,
              r = this.c,
              n = this.d,
              o = -Math.atan2(-r, n),
              s = Math.atan2(i, e),
              a = Math.abs(o + s);
            return (
              a < 1e-5 || Math.abs(h - a) < 1e-5
                ? ((t.rotation = s), (t.skew.x = t.skew.y = 0))
                : ((t.rotation = 0), (t.skew.x = o), (t.skew.y = s)),
              (t.scale.x = Math.sqrt(e * e + i * i)),
              (t.scale.y = Math.sqrt(r * r + n * n)),
              (t.position.x = this.tx),
              (t.position.y = this.ty),
              t
            );
          }),
          (_.prototype.invert = function () {
            var t = this.a,
              e = this.b,
              i = this.c,
              r = this.d,
              n = this.tx,
              o = t * r - e * i;
            return (
              (this.a = r / o),
              (this.b = -e / o),
              (this.c = -i / o),
              (this.d = t / o),
              (this.tx = (i * this.ty - r * n) / o),
              (this.ty = -(t * this.ty - e * n) / o),
              this
            );
          }),
          (_.prototype.identity = function () {
            return (
              (this.a = 1),
              (this.b = 0),
              (this.c = 0),
              (this.d = 1),
              (this.tx = 0),
              (this.ty = 0),
              this
            );
          }),
          (_.prototype.clone = function () {
            var t = new _();
            return (
              (t.a = this.a),
              (t.b = this.b),
              (t.c = this.c),
              (t.d = this.d),
              (t.tx = this.tx),
              (t.ty = this.ty),
              t
            );
          }),
          (_.prototype.copyTo = function (t) {
            return (
              (t.a = this.a),
              (t.b = this.b),
              (t.c = this.c),
              (t.d = this.d),
              (t.tx = this.tx),
              (t.ty = this.ty),
              t
            );
          }),
          (_.prototype.copyFrom = function (t) {
            return (
              (this.a = t.a),
              (this.b = t.b),
              (this.c = t.c),
              (this.d = t.d),
              (this.tx = t.tx),
              (this.ty = t.ty),
              this
            );
          }),
          Object.defineProperty(_, 'IDENTITY', {
            get: function () {
              return new _();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(_, 'TEMP_MATRIX', {
            get: function () {
              return new _();
            },
            enumerable: !1,
            configurable: !0,
          });
        var v = _;
        function _(t, e, i, r, n, o) {
          void 0 === t && (t = 1),
            void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            void 0 === r && (r = 1),
            void 0 === n && (n = 0),
            void 0 === o && (o = 0),
            (this.array = null),
            (this.a = t),
            (this.b = e),
            (this.c = i),
            (this.d = r),
            (this.tx = n),
            (this.ty = o);
        }
        var x = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1],
          b = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1],
          T = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1],
          E = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1],
          w = [],
          P = [],
          S = Math.sign;
        for (var O = 0; O < 16; O++) {
          var I = [];
          w.push(I);
          for (var A = 0; A < 16; A++)
            for (
              var M = S(x[O] * x[A] + T[O] * b[A]),
                D = S(b[O] * x[A] + E[O] * b[A]),
                U = S(x[O] * T[A] + T[O] * E[A]),
                j = S(b[O] * T[A] + E[O] * E[A]),
                C = 0;
              C < 16;
              C++
            )
              if (x[C] === M && b[C] === D && T[C] === U && E[C] === j) {
                I.push(C);
                break;
              }
        }
        for (O = 0; O < 16; O++) {
          var R = new v();
          R.set(x[O], b[O], T[O], E[O], 0, 0), P.push(R);
        }
        var L = {
            E: 0,
            SE: 1,
            S: 2,
            SW: 3,
            W: 4,
            NW: 5,
            N: 6,
            NE: 7,
            MIRROR_VERTICAL: 8,
            MAIN_DIAGONAL: 10,
            MIRROR_HORIZONTAL: 12,
            REVERSE_DIAGONAL: 14,
            uX: function (t) {
              return x[t];
            },
            uY: function (t) {
              return b[t];
            },
            vX: function (t) {
              return T[t];
            },
            vY: function (t) {
              return E[t];
            },
            inv: function (t) {
              return 8 & t ? 15 & t : 7 & -t;
            },
            add: function (t, e) {
              return w[t][e];
            },
            sub: function (t, e) {
              return w[t][L.inv(e)];
            },
            rotate180: function (t) {
              return 4 ^ t;
            },
            isVertical: function (t) {
              return 2 == (3 & t);
            },
            byDirection: function (t, e) {
              return 2 * Math.abs(t) <= Math.abs(e)
                ? 0 <= e
                  ? L.S
                  : L.N
                : 2 * Math.abs(e) <= Math.abs(t)
                ? 0 < t
                  ? L.E
                  : L.W
                : 0 < e
                ? 0 < t
                  ? L.SE
                  : L.SW
                : 0 < t
                ? L.NE
                : L.NW;
            },
            matrixAppendRotationInv: function (t, e, i, r) {
              void 0 === i && (i = 0), void 0 === r && (r = 0);
              e = P[L.inv(e)];
              (e.tx = i), (e.ty = r), t.append(e);
            },
          },
          k =
            ((N.prototype.onChange = function () {
              this._localID++;
            }),
            (N.prototype.updateSkew = function () {
              (this._cx = Math.cos(this._rotation + this.skew.y)),
                (this._sx = Math.sin(this._rotation + this.skew.y)),
                (this._cy = -Math.sin(this._rotation - this.skew.x)),
                (this._sy = Math.cos(this._rotation - this.skew.x)),
                this._localID++;
            }),
            (N.prototype.updateLocalTransform = function () {
              var t = this.localTransform;
              this._localID !== this._currentLocalID &&
                ((t.a = this._cx * this.scale.x),
                (t.b = this._sx * this.scale.x),
                (t.c = this._cy * this.scale.y),
                (t.d = this._sy * this.scale.y),
                (t.tx =
                  this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c)),
                (t.ty =
                  this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d)),
                (this._currentLocalID = this._localID),
                (this._parentID = -1));
            }),
            (N.prototype.updateTransform = function (t) {
              var e,
                i,
                r = this.localTransform;
              this._localID !== this._currentLocalID &&
                ((r.a = this._cx * this.scale.x),
                (r.b = this._sx * this.scale.x),
                (r.c = this._cy * this.scale.y),
                (r.d = this._sy * this.scale.y),
                (r.tx =
                  this.position.x - (this.pivot.x * r.a + this.pivot.y * r.c)),
                (r.ty =
                  this.position.y - (this.pivot.x * r.b + this.pivot.y * r.d)),
                (this._currentLocalID = this._localID),
                (this._parentID = -1)),
                this._parentID !== t._worldID &&
                  ((e = t.worldTransform),
                  ((i = this.worldTransform).a = r.a * e.a + r.b * e.c),
                  (i.b = r.a * e.b + r.b * e.d),
                  (i.c = r.c * e.a + r.d * e.c),
                  (i.d = r.c * e.b + r.d * e.d),
                  (i.tx = r.tx * e.a + r.ty * e.c + e.tx),
                  (i.ty = r.tx * e.b + r.ty * e.d + e.ty),
                  (this._parentID = t._worldID),
                  this._worldID++);
            }),
            (N.prototype.setFromMatrix = function (t) {
              t.decompose(this), this._localID++;
            }),
            Object.defineProperty(N.prototype, 'rotation', {
              get: function () {
                return this._rotation;
              },
              set: function (t) {
                this._rotation !== t &&
                  ((this._rotation = t), this.updateSkew());
              },
              enumerable: !1,
              configurable: !0,
            }),
            (N.IDENTITY = new N()),
            N);
        function N() {
          (this.worldTransform = new v()),
            (this.localTransform = new v()),
            (this.position = new y(this.onChange, this, 0, 0)),
            (this.scale = new y(this.onChange, this, 1, 1)),
            (this.pivot = new y(this.onChange, this, 0, 0)),
            (this.skew = new y(this.updateSkew, this, 0, 0)),
            (this._rotation = 0),
            (this._cx = 1),
            (this._sx = 0),
            (this._cy = 0),
            (this._sy = 1),
            (this._localID = 0),
            (this._currentLocalID = 0),
            (this._worldID = 0),
            (this._parentID = 0);
        }
        (a.Circle = n),
          (a.DEG_TO_RAD = e),
          (a.Ellipse = s),
          (a.Matrix = v),
          (a.ObservablePoint = y),
          (a.PI_2 = h),
          (a.Point = f),
          (a.Polygon = l),
          (a.RAD_TO_DEG = t),
          (a.Rectangle = i),
          (a.RoundedRectangle = d),
          (a.Transform = k),
          (a.groupD8 = L);
      },
      {},
    ],
    17: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var s = t('@pixi/mesh'),
          o = t('@pixi/constants'),
          a = t('@pixi/core'),
          r = function (t, e) {
            return (r =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        function n(t, e) {
          function i() {
            this.constructor = t;
          }
          r(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        n(l, (h = s.MeshGeometry)),
          (l.prototype.build = function () {
            for (
              var t = this.segWidth * this.segHeight,
                e = [],
                i = [],
                r = [],
                n = this.segWidth - 1,
                o = this.segHeight - 1,
                s = this.width / n,
                a = this.height / o,
                h = 0;
              h < t;
              h++
            ) {
              var u = h % this.segWidth,
                l = (h / this.segWidth) | 0;
              e.push(u * s, l * a), i.push(u / n, l / o);
            }
            for (var c = n * o, h = 0; h < c; h++) {
              var d = h % n,
                p = (h / n) | 0,
                f = p * this.segWidth + d,
                m = p * this.segWidth + d + 1,
                y = (1 + p) * this.segWidth + d,
                p = (1 + p) * this.segWidth + d + 1;
              r.push(f, m, y, m, p, y);
            }
            (this.buffers[0].data = new Float32Array(e)),
              (this.buffers[1].data = new Float32Array(i)),
              (this.indexBuffer.data = new Uint16Array(r)),
              this.buffers[0].update(),
              this.buffers[1].update(),
              this.indexBuffer.update();
          });
        var h,
          u = l;
        function l(t, e, i, r) {
          void 0 === t && (t = 100),
            void 0 === e && (e = 100),
            void 0 === i && (i = 10),
            void 0 === r && (r = 10);
          var n = h.call(this) || this;
          return (
            (n.segWidth = i),
            (n.segHeight = r),
            (n.width = t),
            (n.height = e),
            n.build(),
            n
          );
        }
        n(p, (c = s.MeshGeometry)),
          Object.defineProperty(p.prototype, 'width', {
            get: function () {
              return this._width;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (p.prototype.build = function () {
            var t = this.points;
            if (t) {
              var e = this.getBuffer('aVertexPosition'),
                i = this.getBuffer('aTextureCoord'),
                r = this.getIndex();
              if (!(t.length < 1)) {
                e.data.length / 4 !== t.length &&
                  ((e.data = new Float32Array(4 * t.length)),
                  (i.data = new Float32Array(4 * t.length)),
                  (r.data = new Uint16Array(6 * (t.length - 1))));
                for (
                  var n = i.data,
                    o = r.data,
                    s = ((n[0] = 0), (n[1] = 0), (n[2] = 0), (n[3] = 1), 0),
                    a = t[0],
                    h = this._width * this.textureScale,
                    u = t.length,
                    l = 0;
                  l < u;
                  l++
                ) {
                  var c,
                    d,
                    p = 4 * l;
                  0 < this.textureScale
                    ? ((d = a.x - t[l].x),
                      (c = a.y - t[l].y),
                      (d = Math.sqrt(d * d + c * c)),
                      (a = t[l]),
                      (s += d / h))
                    : (s = l / (u - 1)),
                    (n[p] = s),
                    (n[p + 1] = 0),
                    (n[p + 2] = s),
                    (n[p + 3] = 1);
                }
                for (var f = 0, l = 0; l < u - 1; l++) {
                  p = 2 * l;
                  (o[f++] = p),
                    (o[f++] = p + 1),
                    (o[f++] = p + 2),
                    (o[f++] = p + 2),
                    (o[f++] = p + 1),
                    (o[f++] = p + 3);
                }
                i.update(), r.update(), this.updateVertices();
              }
            }
          }),
          (p.prototype.updateVertices = function () {
            var t = this.points;
            if (!(t.length < 1)) {
              for (
                var e = t[0],
                  i = 0,
                  r = 0,
                  n = this.buffers[0].data,
                  o = t.length,
                  s = 0;
                s < o;
                s++
              ) {
                var a = t[s],
                  h = 4 * s,
                  r = -((u = s < t.length - 1 ? t[s + 1] : a).x - e.x),
                  i = u.y - e.y,
                  u = Math.sqrt(i * i + r * r),
                  l =
                    0 < this.textureScale
                      ? (this.textureScale * this._width) / 2
                      : this._width / 2;
                (r = (r / u) * l),
                  (n[h] = a.x + (i = (i / u) * l)),
                  (n[1 + h] = a.y + r),
                  (n[2 + h] = a.x - i),
                  (n[3 + h] = a.y - r),
                  (e = a);
              }
              this.buffers[0].update();
            }
          }),
          (p.prototype.update = function () {
            0 < this.textureScale ? this.build() : this.updateVertices();
          });
        var c,
          d = p;
        function p(t, e, i) {
          void 0 === t && (t = 200), void 0 === i && (i = 0);
          var r =
            c.call(
              this,
              new Float32Array(4 * e.length),
              new Float32Array(4 * e.length),
              new Uint16Array(6 * (e.length - 1))
            ) || this;
          return (
            (r.points = e), (r._width = t), (r.textureScale = i), r.build(), r
          );
        }
        n(m, (f = s.Mesh)),
          (m.prototype._render = function (t) {
            var e = this.geometry;
            (!this.autoUpdate && e._width === this.shader.texture.height) ||
              ((e._width = this.shader.texture.height), e.update()),
              f.prototype._render.call(this, t);
          });
        var f,
          t = m;
        function m(t, e, i) {
          var r = this,
            e = new d(t.height, e, (i = void 0 === i ? 0 : i)),
            n = new s.MeshMaterial(t);
          return (
            0 < i && (t.baseTexture.wrapMode = o.WRAP_MODES.REPEAT),
            ((r = f.call(this, e, n) || this).autoUpdate = !0),
            r
          );
        }
        n(v, (y = s.Mesh)),
          (v.prototype.textureUpdated = function () {
            this._textureID = this.shader.texture._updateID;
            var t = this.geometry;
            (t.width = this.shader.texture.width),
              (t.height = this.shader.texture.height),
              t.build();
          }),
          Object.defineProperty(v.prototype, 'texture', {
            get: function () {
              return this.shader.texture;
            },
            set: function (t) {
              this.shader.texture !== t &&
                ((this.shader.texture = t),
                (this._textureID = -1),
                t.baseTexture.valid
                  ? this.textureUpdated()
                  : t.once('update', this.textureUpdated, this));
            },
            enumerable: !1,
            configurable: !0,
          }),
          (v.prototype._render = function (t) {
            this._textureID !== this.shader.texture._updateID &&
              this.textureUpdated(),
              y.prototype._render.call(this, t);
          }),
          (v.prototype.destroy = function (t) {
            this.shader.texture.off('update', this.textureUpdated, this),
              y.prototype.destroy.call(this, t);
          });
        var y,
          g = v;
        function v(t, e, i) {
          var r = this,
            e = new u(t.width, t.height, e, i),
            i = new s.MeshMaterial(a.Texture.WHITE);
          return ((r = y.call(this, e, i) || this).texture = t), r;
        }
        n(b, (_ = s.Mesh)),
          Object.defineProperty(b.prototype, 'vertices', {
            get: function () {
              return this.geometry.getBuffer('aVertexPosition').data;
            },
            set: function (t) {
              this.geometry.getBuffer('aVertexPosition').data = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (b.prototype._render = function (t) {
            this.autoUpdate &&
              this.geometry.getBuffer('aVertexPosition').update(),
              _.prototype._render.call(this, t);
          });
        var _,
          x = b;
        function b(t, e, i, r, n) {
          void 0 === t && (t = a.Texture.EMPTY);
          var o = this,
            e = new s.MeshGeometry(e, i, r),
            i =
              ((e.getBuffer('aVertexPosition').static = !1),
              new s.MeshMaterial(t));
          return ((o = _.call(this, e, i, null, n) || this).autoUpdate = !0), o;
        }
        n(w, (T = g)),
          (w.prototype.textureUpdated = function () {
            (this._textureID = this.shader.texture._updateID), this._refresh();
          }),
          Object.defineProperty(w.prototype, 'vertices', {
            get: function () {
              return this.geometry.getBuffer('aVertexPosition').data;
            },
            set: function (t) {
              this.geometry.getBuffer('aVertexPosition').data = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (w.prototype.updateHorizontalVertices = function () {
            var t = this.vertices,
              e = this._getMinScale();
            (t[9] = t[11] = t[13] = t[15] = this._topHeight * e),
              (t[17] =
                t[19] =
                t[21] =
                t[23] =
                  this._height - this._bottomHeight * e),
              (t[25] = t[27] = t[29] = t[31] = this._height);
          }),
          (w.prototype.updateVerticalVertices = function () {
            var t = this.vertices,
              e = this._getMinScale();
            (t[2] = t[10] = t[18] = t[26] = this._leftWidth * e),
              (t[4] =
                t[12] =
                t[20] =
                t[28] =
                  this._width - this._rightWidth * e),
              (t[6] = t[14] = t[22] = t[30] = this._width);
          }),
          (w.prototype._getMinScale = function () {
            var t = this._leftWidth + this._rightWidth,
              t = this._width > t ? 1 : this._width / t,
              e = this._topHeight + this._bottomHeight,
              e = this._height > e ? 1 : this._height / e;
            return Math.min(t, e);
          }),
          Object.defineProperty(w.prototype, 'width', {
            get: function () {
              return this._width;
            },
            set: function (t) {
              (this._width = t), this._refresh();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(w.prototype, 'height', {
            get: function () {
              return this._height;
            },
            set: function (t) {
              (this._height = t), this._refresh();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(w.prototype, 'leftWidth', {
            get: function () {
              return this._leftWidth;
            },
            set: function (t) {
              (this._leftWidth = t), this._refresh();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(w.prototype, 'rightWidth', {
            get: function () {
              return this._rightWidth;
            },
            set: function (t) {
              (this._rightWidth = t), this._refresh();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(w.prototype, 'topHeight', {
            get: function () {
              return this._topHeight;
            },
            set: function (t) {
              (this._topHeight = t), this._refresh();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(w.prototype, 'bottomHeight', {
            get: function () {
              return this._bottomHeight;
            },
            set: function (t) {
              (this._bottomHeight = t), this._refresh();
            },
            enumerable: !1,
            configurable: !0,
          }),
          (w.prototype._refresh = function () {
            var t = this.texture,
              e = this.geometry.buffers[1].data,
              t =
                ((this._origWidth = t.orig.width),
                (this._origHeight = t.orig.height),
                1 / this._origWidth),
              i = 1 / this._origHeight;
            (e[0] = e[8] = e[16] = e[24] = 0),
              (e[1] = e[3] = e[5] = e[7] = 0),
              (e[6] = e[14] = e[22] = e[30] = 1),
              (e[25] = e[27] = e[29] = e[31] = 1),
              (e[2] = e[10] = e[18] = e[26] = t * this._leftWidth),
              (e[4] = e[12] = e[20] = e[28] = 1 - t * this._rightWidth),
              (e[9] = e[11] = e[13] = e[15] = i * this._topHeight),
              (e[17] = e[19] = e[21] = e[23] = 1 - i * this._bottomHeight),
              this.updateHorizontalVertices(),
              this.updateVerticalVertices(),
              this.geometry.buffers[0].update(),
              this.geometry.buffers[1].update();
          });
        var T,
          E = w;
        function w(t, e, i, r, n) {
          void 0 === e && (e = 10),
            void 0 === i && (i = 10),
            void 0 === r && (r = 10),
            void 0 === n && (n = 10);
          var o = T.call(this, a.Texture.WHITE, 4, 4) || this;
          return (
            (o._origWidth = t.orig.width),
            (o._origHeight = t.orig.height),
            (o._width = o._origWidth),
            (o._height = o._origHeight),
            (o._leftWidth = e),
            (o._rightWidth = r),
            (o._topHeight = i),
            (o._bottomHeight = n),
            (o.texture = t),
            o
          );
        }
        (i.NineSlicePlane = E),
          (i.PlaneGeometry = u),
          (i.RopeGeometry = d),
          (i.SimpleMesh = x),
          (i.SimplePlane = g),
          (i.SimpleRope = t);
      },
      { '@pixi/constants': 3, '@pixi/core': 4, '@pixi/mesh': 18 },
    ],
    18: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var o = t('@pixi/core'),
          n = t('@pixi/math'),
          s = t('@pixi/constants'),
          r = t('@pixi/display'),
          f = t('@pixi/settings'),
          a = t('@pixi/utils'),
          h = function (t, e) {
            return (h =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        function u(t, e) {
          function i() {
            this.constructor = t;
          }
          h(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        c.prototype.update = function (t) {
          (!t &&
            this._bufferUpdateId === this.uvBuffer._updateID &&
            this._textureUpdateId === this.uvMatrix._updateID) ||
            ((this._bufferUpdateId = this.uvBuffer._updateID),
            (this._textureUpdateId = this.uvMatrix._updateID),
            (t = this.uvBuffer.data),
            (this.data && this.data.length === t.length) ||
              (this.data = new Float32Array(t.length)),
            this.uvMatrix.multiplyUvs(t, this.data),
            this._updateID++);
        };
        var l = c;
        function c(t, e) {
          (this.uvBuffer = t),
            (this.uvMatrix = e),
            (this.data = null),
            (this._bufferUpdateId = -1),
            (this._textureUpdateId = -1),
            (this._updateID = 0);
        }
        var d,
          p = new n.Point(),
          m = new n.Polygon(),
          t =
            (u(y, (d = r.Container)),
            Object.defineProperty(y.prototype, 'uvBuffer', {
              get: function () {
                return this.geometry.buffers[1];
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'verticesBuffer', {
              get: function () {
                return this.geometry.buffers[0];
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'material', {
              get: function () {
                return this.shader;
              },
              set: function (t) {
                this.shader = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'blendMode', {
              get: function () {
                return this.state.blendMode;
              },
              set: function (t) {
                this.state.blendMode = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'roundPixels', {
              get: function () {
                return this._roundPixels;
              },
              set: function (t) {
                this._roundPixels !== t && (this._transformID = -1),
                  (this._roundPixels = t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'tint', {
              get: function () {
                return this.shader.tint;
              },
              set: function (t) {
                this.shader.tint = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'texture', {
              get: function () {
                return this.shader.texture;
              },
              set: function (t) {
                this.shader.texture = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (y.prototype._render = function (t) {
              var e = this.geometry.buffers[0].data;
              this.shader.batchable &&
              this.drawMode === s.DRAW_MODES.TRIANGLES &&
              e.length < 2 * y.BATCHABLE_SIZE
                ? this._renderToBatch(t)
                : this._renderDefault(t);
            }),
            (y.prototype._renderDefault = function (t) {
              var e = this.shader;
              (e.alpha = this.worldAlpha),
                e.update && e.update(),
                t.batch.flush(),
                e.program.uniformData.translationMatrix &&
                  (e.uniforms.translationMatrix =
                    this.transform.worldTransform.toArray(!0)),
                t.shader.bind(e),
                t.state.set(this.state),
                t.geometry.bind(this.geometry, e),
                t.geometry.draw(
                  this.drawMode,
                  this.size,
                  this.start,
                  this.geometry.instanceCount
                );
            }),
            (y.prototype._renderToBatch = function (t) {
              var e = this.geometry,
                e =
                  (this.shader.uvMatrix &&
                    (this.shader.uvMatrix.update(), this.calculateUvs()),
                  this.calculateVertices(),
                  (this.indices = e.indexBuffer.data),
                  (this._tintRGB = this.shader._tintRGB),
                  (this._texture = this.shader.texture),
                  this.material.pluginName);
              t.batch.setObjectRenderer(t.plugins[e]),
                t.plugins[e].render(this);
            }),
            (y.prototype.calculateVertices = function () {
              var t = this.geometry,
                e = t.buffers[0].data;
              if (
                t.vertexDirtyId !== this.vertexDirty ||
                this._transformID !== this.transform._worldID
              ) {
                (this._transformID = this.transform._worldID),
                  this.vertexData.length !== e.length &&
                    (this.vertexData = new Float32Array(e.length));
                for (
                  var i = this.transform.worldTransform,
                    r = i.a,
                    n = i.b,
                    o = i.c,
                    s = i.d,
                    a = i.tx,
                    h = i.ty,
                    u = this.vertexData,
                    l = 0;
                  l < u.length / 2;
                  l++
                ) {
                  var c = e[2 * l],
                    d = e[2 * l + 1];
                  (u[2 * l] = r * c + o * d + a),
                    (u[2 * l + 1] = n * c + s * d + h);
                }
                if (this._roundPixels)
                  for (var p = f.settings.RESOLUTION, l = 0; l < u.length; ++l)
                    u[l] = Math.round(((u[l] * p) | 0) / p);
                this.vertexDirty = t.vertexDirtyId;
              }
            }),
            (y.prototype.calculateUvs = function () {
              var t = this.geometry.buffers[1];
              this.shader.uvMatrix.isSimple
                ? (this.uvs = t.data)
                : (this.batchUvs ||
                    (this.batchUvs = new l(t, this.shader.uvMatrix)),
                  this.batchUvs.update(),
                  (this.uvs = this.batchUvs.data));
            }),
            (y.prototype._calculateBounds = function () {
              this.calculateVertices(),
                this._bounds.addVertexData(
                  this.vertexData,
                  0,
                  this.vertexData.length
                );
            }),
            (y.prototype.containsPoint = function (t) {
              if (!this.getBounds().contains(t.x, t.y)) return !1;
              this.worldTransform.applyInverse(t, p);
              for (
                var e = this.geometry.getBuffer('aVertexPosition').data,
                  i = m.points,
                  r = this.geometry.getIndex().data,
                  n = r.length,
                  o = 4 === this.drawMode ? 3 : 1,
                  s = 0;
                s + 2 < n;
                s += o
              ) {
                var a = 2 * r[s],
                  h = 2 * r[s + 1],
                  u = 2 * r[s + 2];
                if (
                  ((i[0] = e[a]),
                  (i[1] = e[1 + a]),
                  (i[2] = e[h]),
                  (i[3] = e[1 + h]),
                  (i[4] = e[u]),
                  (i[5] = e[1 + u]),
                  m.contains(p.x, p.y))
                )
                  return !0;
              }
              return !1;
            }),
            (y.prototype.destroy = function (t) {
              d.prototype.destroy.call(this, t),
                this.geometry.refCount--,
                0 === this.geometry.refCount && this.geometry.dispose(),
                (this.geometry = null),
                (this.shader = null),
                (this.state = null),
                (this.uvs = null),
                (this.indices = null),
                (this.vertexData = null);
            }),
            (y.BATCHABLE_SIZE = 100),
            y);
        function y(t, e, i, r) {
          void 0 === r && (r = s.DRAW_MODES.TRIANGLES);
          var n = d.call(this) || this;
          return (
            (n.geometry = t).refCount++,
            (n.shader = e),
            (n.state = i || o.State.for2d()),
            (n.drawMode = r),
            (n.start = 0),
            (n.size = 0),
            (n.uvs = null),
            (n.indices = null),
            (n.vertexData = new Float32Array(1)),
            (n.vertexDirty = 0),
            (n._transformID = -1),
            (n._roundPixels = f.settings.ROUND_PIXELS),
            (n.batchUvs = null),
            n
          );
        }
        u(v, (g = o.Shader)),
          Object.defineProperty(v.prototype, 'texture', {
            get: function () {
              return this.uniforms.uSampler;
            },
            set: function (t) {
              this.uniforms.uSampler !== t &&
                ((this.uniforms.uSampler = t), (this.uvMatrix.texture = t));
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(v.prototype, 'alpha', {
            get: function () {
              return this._alpha;
            },
            set: function (t) {
              t !== this._alpha && ((this._alpha = t), (this._colorDirty = !0));
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(v.prototype, 'tint', {
            get: function () {
              return this._tint;
            },
            set: function (t) {
              t !== this._tint &&
                ((this._tint = t),
                (this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16)),
                (this._colorDirty = !0));
            },
            enumerable: !1,
            configurable: !0,
          }),
          (v.prototype.update = function () {
            var t;
            this._colorDirty &&
              ((this._colorDirty = !1),
              (t = this.texture.baseTexture),
              a.premultiplyTintToRgba(
                this._tint,
                this._alpha,
                this.uniforms.uColor,
                t.alphaMode
              )),
              this.uvMatrix.update() &&
                (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
          });
        var g,
          r = v;
        function v(t, e) {
          var i = this,
            r = {
              uSampler: t,
              alpha: 1,
              uTextureMatrix: n.Matrix.IDENTITY,
              uColor: new Float32Array([1, 1, 1, 1]),
            };
          return (
            (e = Object.assign(
              { tint: 16777215, alpha: 1, pluginName: 'batch' },
              e
            )).uniforms && Object.assign(r, e.uniforms),
            ((i =
              g.call(
                this,
                e.program ||
                  o.Program.from(
                    'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n',
                    'varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n'
                  ),
                r
              ) || this)._colorDirty = !1),
            (i.uvMatrix = new o.TextureMatrix(t)),
            (i.batchable = void 0 === e.program),
            (i.pluginName = e.pluginName),
            (i.tint = e.tint),
            (i.alpha = e.alpha),
            i
          );
        }
        u(b, (_ = o.Geometry)),
          Object.defineProperty(b.prototype, 'vertexDirtyId', {
            get: function () {
              return this.buffers[0]._updateID;
            },
            enumerable: !1,
            configurable: !0,
          });
        var _,
          x = b;
        function b(t, e, i) {
          var r = _.call(this) || this,
            t = new o.Buffer(t),
            e = new o.Buffer(e, !0),
            i = new o.Buffer(i, !0, !0);
          return (
            r
              .addAttribute('aVertexPosition', t, 2, !1, s.TYPES.FLOAT)
              .addAttribute('aTextureCoord', e, 2, !1, s.TYPES.FLOAT)
              .addIndex(i),
            (r._updateId = -1),
            r
          );
        }
        (i.Mesh = t),
          (i.MeshBatchUvs = l),
          (i.MeshGeometry = x),
          (i.MeshMaterial = r);
      },
      {
        '@pixi/constants': 3,
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/math': 16,
        '@pixi/settings': 26,
        '@pixi/utils': 34,
      },
    ],
    19: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var u = t('@pixi/core'),
          l = t('@pixi/sprite'),
          r = t('@pixi/display'),
          n = t('@pixi/math'),
          c = t('@pixi/utils'),
          d = t('@pixi/settings'),
          p = new n.Matrix(),
          o =
            ((r.DisplayObject.prototype._cacheAsBitmap = !1),
            (r.DisplayObject.prototype._cacheData = null),
            function () {
              (this.textureCacheId = null),
                (this.originalRender = null),
                (this.originalRenderCanvas = null),
                (this.originalCalculateBounds = null),
                (this.originalGetLocalBounds = null),
                (this.originalUpdateTransform = null),
                (this.originalDestroy = null),
                (this.originalMask = null),
                (this.originalFilterArea = null),
                (this.originalContainsPoint = null),
                (this.sprite = null);
            });
        Object.defineProperties(r.DisplayObject.prototype, {
          cacheAsBitmap: {
            get: function () {
              return this._cacheAsBitmap;
            },
            set: function (t) {
              var e;
              this._cacheAsBitmap !== t &&
                ((this._cacheAsBitmap = t)
                  ? (this._cacheData || (this._cacheData = new o()),
                    ((e = this._cacheData).originalRender = this.render),
                    (e.originalRenderCanvas = this.renderCanvas),
                    (e.originalUpdateTransform = this.updateTransform),
                    (e.originalCalculateBounds = this.calculateBounds),
                    (e.originalGetLocalBounds = this.getLocalBounds),
                    (e.originalDestroy = this.destroy),
                    (e.originalContainsPoint = this.containsPoint),
                    (e.originalMask = this._mask),
                    (e.originalFilterArea = this.filterArea),
                    (this.render = this._renderCached),
                    (this.renderCanvas = this._renderCachedCanvas),
                    (this.destroy = this._cacheAsBitmapDestroy))
                  : ((e = this._cacheData).sprite &&
                      this._destroyCachedDisplayObject(),
                    (this.render = e.originalRender),
                    (this.renderCanvas = e.originalRenderCanvas),
                    (this.calculateBounds = e.originalCalculateBounds),
                    (this.getLocalBounds = e.originalGetLocalBounds),
                    (this.destroy = e.originalDestroy),
                    (this.updateTransform = e.originalUpdateTransform),
                    (this.containsPoint = e.originalContainsPoint),
                    (this._mask = e.originalMask),
                    (this.filterArea = e.originalFilterArea)));
            },
          },
        }),
          (r.DisplayObject.prototype._renderCached = function (t) {
            !this.visible ||
              this.worldAlpha <= 0 ||
              !this.renderable ||
              (this._initCachedDisplayObject(t),
              (this._cacheData.sprite.transform._worldID =
                this.transform._worldID),
              (this._cacheData.sprite.worldAlpha = this.worldAlpha),
              this._cacheData.sprite._render(t));
          }),
          (r.DisplayObject.prototype._initCachedDisplayObject = function (t) {
            var e, i, r, n, o, s, a, h;
            (this._cacheData && this._cacheData.sprite) ||
              ((e = this.alpha),
              (this.alpha = 1),
              t.batch.flush(),
              (i = this.getLocalBounds(null, !0).clone()),
              this.filters && ((r = this.filters[0].padding), i.pad(r)),
              i.ceil(d.settings.RESOLUTION),
              (r = t.renderTexture.current),
              (n = t.renderTexture.sourceFrame.clone()),
              (o = t.renderTexture.destinationFrame.clone()),
              (s = t.projection.transform),
              (a = u.RenderTexture.create({
                width: i.width,
                height: i.height,
              })),
              (h = 'cacheAsBitmap_' + c.uid()),
              (this._cacheData.textureCacheId = h),
              u.BaseTexture.addToCache(a.baseTexture, h),
              u.Texture.addToCache(a, h),
              (h = this.transform.localTransform
                .copyTo(p)
                .invert()
                .translate(-i.x, -i.y)),
              (this.render = this._cacheData.originalRender),
              t.render(this, a, !0, h, !1),
              (t.projection.transform = s),
              t.renderTexture.bind(r, n, o),
              (this.render = this._renderCached),
              (this.updateTransform = this.displayObjectUpdateTransform),
              (this.calculateBounds = this._calculateCachedBounds),
              (this.getLocalBounds = this._getCachedLocalBounds),
              (this._mask = null),
              (this.filterArea = null),
              ((h = new l.Sprite(a)).transform.worldTransform =
                this.transform.worldTransform),
              (h.anchor.x = -(i.x / i.width)),
              (h.anchor.y = -(i.y / i.height)),
              (h.alpha = e),
              (h._bounds = this._bounds),
              (this._cacheData.sprite = h),
              (this.transform._parentID = -1),
              this.parent
                ? this.updateTransform()
                : (this.enableTempParent(),
                  this.updateTransform(),
                  this.disableTempParent(null)),
              (this.containsPoint = h.containsPoint.bind(h)));
          }),
          (r.DisplayObject.prototype._renderCachedCanvas = function (t) {
            !this.visible ||
              this.worldAlpha <= 0 ||
              !this.renderable ||
              (this._initCachedDisplayObjectCanvas(t),
              (this._cacheData.sprite.worldAlpha = this.worldAlpha),
              this._cacheData.sprite._renderCanvas(t));
          }),
          (r.DisplayObject.prototype._initCachedDisplayObjectCanvas = function (
            t
          ) {
            var e, i, r, n, o, s;
            (this._cacheData && this._cacheData.sprite) ||
              ((e = this.getLocalBounds(null, !0)),
              (i = this.alpha),
              (this.alpha = 1),
              (r = t.context),
              (n = t._projTransform),
              e.ceil(d.settings.RESOLUTION),
              (o = u.RenderTexture.create({
                width: e.width,
                height: e.height,
              })),
              (s = 'cacheAsBitmap_' + c.uid()),
              (this._cacheData.textureCacheId = s),
              u.BaseTexture.addToCache(o.baseTexture, s),
              u.Texture.addToCache(o, s),
              this.transform.localTransform.copyTo((s = p)),
              s.invert(),
              (s.tx -= e.x),
              (s.ty -= e.y),
              (this.renderCanvas = this._cacheData.originalRenderCanvas),
              t.render(this, o, !0, s, !1),
              (t.context = r),
              (t._projTransform = n),
              (this.renderCanvas = this._renderCachedCanvas),
              (this.updateTransform = this.displayObjectUpdateTransform),
              (this.calculateBounds = this._calculateCachedBounds),
              (this.getLocalBounds = this._getCachedLocalBounds),
              (this._mask = null),
              (this.filterArea = null),
              ((s = new l.Sprite(o)).transform.worldTransform =
                this.transform.worldTransform),
              (s.anchor.x = -(e.x / e.width)),
              (s.anchor.y = -(e.y / e.height)),
              (s.alpha = i),
              (s._bounds = this._bounds),
              (this._cacheData.sprite = s),
              (this.transform._parentID = -1),
              this.parent
                ? this.updateTransform()
                : ((this.parent = t._tempDisplayObjectParent),
                  this.updateTransform(),
                  (this.parent = null)),
              (this.containsPoint = s.containsPoint.bind(s)));
          }),
          (r.DisplayObject.prototype._calculateCachedBounds = function () {
            this._bounds.clear(),
              (this._cacheData.sprite.transform._worldID =
                this.transform._worldID),
              this._cacheData.sprite._calculateBounds(),
              (this._bounds.updateID = this._boundsID);
          }),
          (r.DisplayObject.prototype._getCachedLocalBounds = function () {
            return this._cacheData.sprite.getLocalBounds(null);
          }),
          (r.DisplayObject.prototype._destroyCachedDisplayObject = function () {
            this._cacheData.sprite._texture.destroy(!0),
              (this._cacheData.sprite = null),
              u.BaseTexture.removeFromCache(this._cacheData.textureCacheId),
              u.Texture.removeFromCache(this._cacheData.textureCacheId),
              (this._cacheData.textureCacheId = null);
          }),
          (r.DisplayObject.prototype._cacheAsBitmapDestroy = function (t) {
            (this.cacheAsBitmap = !1), this.destroy(t);
          }),
          (i.CacheData = o);
      },
      {
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/math': 16,
        '@pixi/settings': 26,
        '@pixi/sprite': 29,
        '@pixi/utils': 34,
      },
    ],
    20: [
      function (t, e, i) {
        'use strict';
        t = t('@pixi/display');
        (t.DisplayObject.prototype.name = null),
          (t.Container.prototype.getChildByName = function (t, e) {
            for (var i = 0, r = this.children.length; i < r; i++)
              if (this.children[i].name === t) return this.children[i];
            if (e)
              for (i = 0, r = this.children.length; i < r; i++)
                if (this.children[i].getChildByName) {
                  var n = this.children[i].getChildByName(t, !0);
                  if (n) return n;
                }
            return null;
          });
      },
      { '@pixi/display': 5 },
    ],
    21: [
      function (t, e, i) {
        'use strict';
        var r = t('@pixi/display'),
          n = t('@pixi/math');
        r.DisplayObject.prototype.getGlobalPosition = function (t, e) {
          return (
            void 0 === t && (t = new n.Point()),
            void 0 === e && (e = !1),
            this.parent
              ? this.parent.toGlobal(this.position, t, e)
              : ((t.x = this.position.x), (t.y = this.position.y)),
            t
          );
        };
      },
      { '@pixi/display': 5, '@pixi/math': 16 },
    ],
    22: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var s = t('@pixi/constants'),
          r = t('@pixi/display'),
          m = t('@pixi/utils'),
          a = t('@pixi/core'),
          n = t('@pixi/math'),
          o = function (t, e) {
            return (o =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        function h(t, e) {
          function i() {
            this.constructor = t;
          }
          o(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        h(l, (u = r.Container)),
          (l.prototype.setProperties = function (t) {
            t &&
              ((this._properties[0] =
                'vertices' in t || 'scale' in t
                  ? !!t.vertices || !!t.scale
                  : this._properties[0]),
              (this._properties[1] =
                'position' in t ? !!t.position : this._properties[1]),
              (this._properties[2] =
                'rotation' in t ? !!t.rotation : this._properties[2]),
              (this._properties[3] =
                'uvs' in t ? !!t.uvs : this._properties[3]),
              (this._properties[4] =
                'tint' in t || 'alpha' in t
                  ? !!t.tint || !!t.alpha
                  : this._properties[4]));
          }),
          (l.prototype.updateTransform = function () {
            this.displayObjectUpdateTransform();
          }),
          Object.defineProperty(l.prototype, 'tint', {
            get: function () {
              return this._tint;
            },
            set: function (t) {
              (this._tint = t), m.hex2rgb(t, this.tintRgb);
            },
            enumerable: !1,
            configurable: !0,
          }),
          (l.prototype.render = function (t) {
            var e = this;
            this.visible &&
              !(this.worldAlpha <= 0) &&
              this.children.length &&
              this.renderable &&
              (this.baseTexture ||
                ((this.baseTexture = this.children[0]._texture.baseTexture),
                this.baseTexture.valid ||
                  this.baseTexture.once('update', function () {
                    return e.onChildrenChange(0);
                  })),
              t.batch.setObjectRenderer(t.plugins.particle),
              t.plugins.particle.render(this));
          }),
          (l.prototype.onChildrenChange = function (t) {
            for (
              var e = Math.floor(t / this._batchSize);
              this._bufferUpdateIDs.length < e;

            )
              this._bufferUpdateIDs.push(0);
            this._bufferUpdateIDs[e] = ++this._updateID;
          }),
          (l.prototype.dispose = function () {
            if (this._buffers) {
              for (var t = 0; t < this._buffers.length; ++t)
                this._buffers[t].destroy();
              this._buffers = null;
            }
          }),
          (l.prototype.destroy = function (t) {
            u.prototype.destroy.call(this, t),
              this.dispose(),
              (this._properties = null),
              (this._buffers = null),
              (this._bufferUpdateIDs = null);
          });
        var u,
          t = l;
        function l(t, e, i, r) {
          void 0 === t && (t = 1500),
            void 0 === i && (i = 16384),
            void 0 === r && (r = !1);
          var n = u.call(this) || this;
          return (
            16384 < i && (i = 16384),
            (n._properties = [!1, !0, !1, !1, !1]),
            (n._maxSize = t),
            (n._batchSize = i),
            (n._buffers = null),
            (n._bufferUpdateIDs = []),
            (n._updateID = 0),
            (n.interactiveChildren = !1),
            (n.blendMode = s.BLEND_MODES.NORMAL),
            (n.autoResize = r),
            (n.roundPixels = !0),
            (n.baseTexture = null),
            n.setProperties(e),
            (n._tint = 0),
            (n.tintRgb = new Float32Array(4)),
            (n.tint = 16777215),
            n
          );
        }
        (d.prototype.initBuffers = function () {
          var t = this.geometry,
            e = 0;
          (this.indexBuffer = new a.Buffer(
            m.createIndicesForQuads(this.size),
            !0,
            !0
          )),
            t.addIndex(this.indexBuffer);
          for (
            var i = (this.dynamicStride = 0);
            i < this.dynamicProperties.length;
            ++i
          )
            ((o = this.dynamicProperties[i]).offset = e),
              (e += o.size),
              (this.dynamicStride += o.size);
          for (
            var r = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4),
              n =
                ((this.dynamicData = new Float32Array(r)),
                (this.dynamicDataUint32 = new Uint32Array(r)),
                (this.dynamicBuffer = new a.Buffer(this.dynamicData, !1, !1)),
                0),
              i = (this.staticStride = 0);
            i < this.staticProperties.length;
            ++i
          )
            ((o = this.staticProperties[i]).offset = n),
              (n += o.size),
              (this.staticStride += o.size);
          r = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
          (this.staticData = new Float32Array(r)),
            (this.staticDataUint32 = new Uint32Array(r)),
            (this.staticBuffer = new a.Buffer(this.staticData, !0, !1));
          for (i = 0; i < this.dynamicProperties.length; ++i) {
            var o = this.dynamicProperties[i];
            t.addAttribute(
              o.attributeName,
              this.dynamicBuffer,
              0,
              o.type === s.TYPES.UNSIGNED_BYTE,
              o.type,
              4 * this.dynamicStride,
              4 * o.offset
            );
          }
          for (i = 0; i < this.staticProperties.length; ++i) {
            o = this.staticProperties[i];
            t.addAttribute(
              o.attributeName,
              this.staticBuffer,
              0,
              o.type === s.TYPES.UNSIGNED_BYTE,
              o.type,
              4 * this.staticStride,
              4 * o.offset
            );
          }
        }),
          (d.prototype.uploadDynamic = function (t, e, i) {
            for (var r = 0; r < this.dynamicProperties.length; r++) {
              var n = this.dynamicProperties[r];
              n.uploadFunction(
                t,
                e,
                i,
                n.type === s.TYPES.UNSIGNED_BYTE
                  ? this.dynamicDataUint32
                  : this.dynamicData,
                this.dynamicStride,
                n.offset
              );
            }
            this.dynamicBuffer._updateID++;
          }),
          (d.prototype.uploadStatic = function (t, e, i) {
            for (var r = 0; r < this.staticProperties.length; r++) {
              var n = this.staticProperties[r];
              n.uploadFunction(
                t,
                e,
                i,
                n.type === s.TYPES.UNSIGNED_BYTE
                  ? this.staticDataUint32
                  : this.staticData,
                this.staticStride,
                n.offset
              );
            }
            this.staticBuffer._updateID++;
          }),
          (d.prototype.destroy = function () {
            (this.indexBuffer = null),
              (this.dynamicProperties = null),
              (this.dynamicBuffer = null),
              (this.dynamicData = null),
              (this.dynamicDataUint32 = null),
              (this.staticProperties = null),
              (this.staticBuffer = null),
              (this.staticData = null),
              (this.staticDataUint32 = null),
              this.geometry.destroy();
          });
        var c = d;
        function d(t, e, i) {
          (this.geometry = new a.Geometry()),
            (this.indexBuffer = null),
            (this.size = i),
            (this.dynamicProperties = []),
            (this.staticProperties = []);
          for (var r = 0; r < t.length; ++r) {
            var n = {
              attributeName: (n = t[r]).attributeName,
              size: n.size,
              uploadFunction: n.uploadFunction,
              type: n.type || s.TYPES.FLOAT,
              offset: n.offset,
            };
            (e[r] ? this.dynamicProperties : this.staticProperties).push(n);
          }
          (this.staticStride = 0),
            (this.staticBuffer = null),
            (this.staticData = null),
            (this.staticDataUint32 = null),
            (this.dynamicStride = 0),
            (this.dynamicBuffer = null),
            (this.dynamicData = null),
            (this.dynamicDataUint32 = null),
            (this._updateID = 0),
            this.initBuffers();
        }
        h(f, (p = a.ObjectRenderer)),
          (f.prototype.render = function (t) {
            var e = t.children,
              i = t._maxSize,
              r = t._batchSize,
              n = this.renderer,
              o = e.length;
            if (0 !== o) {
              i < o && !t.autoResize && (o = i);
              for (
                var s =
                    (s = t._buffers) || (t._buffers = this.generateBuffers(t)),
                  i = e[0]._texture.baseTexture,
                  a =
                    ((this.state.blendMode = m.correctBlendMode(
                      t.blendMode,
                      i.alphaMode
                    )),
                    n.state.set(this.state),
                    n.gl),
                  h = t.worldTransform.copyTo(this.tempMatrix),
                  u =
                    (h.prepend(n.globalUniforms.uniforms.projectionMatrix),
                    (this.shader.uniforms.translationMatrix = h.toArray(!0)),
                    (this.shader.uniforms.uColor = m.premultiplyRgba(
                      t.tintRgb,
                      t.worldAlpha,
                      this.shader.uniforms.uColor,
                      i.alphaMode
                    )),
                    (this.shader.uniforms.uSampler = i),
                    this.renderer.shader.bind(this.shader),
                    !1),
                  l = 0,
                  c = 0;
                l < o;
                l += r, c += 1
              ) {
                var d = o - l,
                  p =
                    (r < d && (d = r),
                    c >= s.length && s.push(this._generateOneMoreBuffer(t)),
                    s[c]),
                  f = (p.uploadDynamic(e, l, d), t._bufferUpdateIDs[c] || 0);
                (u = u || p._updateID < f) &&
                  ((p._updateID = t._updateID), p.uploadStatic(e, l, d)),
                  n.geometry.bind(p.geometry),
                  a.drawElements(a.TRIANGLES, 6 * d, a.UNSIGNED_SHORT, 0);
              }
            }
          }),
          (f.prototype.generateBuffers = function (t) {
            for (
              var e = [],
                i = t._maxSize,
                r = t._batchSize,
                n = t._properties,
                o = 0;
              o < i;
              o += r
            )
              e.push(new c(this.properties, n, r));
            return e;
          }),
          (f.prototype._generateOneMoreBuffer = function (t) {
            var e = t._batchSize,
              t = t._properties;
            return new c(this.properties, t, e);
          }),
          (f.prototype.uploadVertices = function (t, e, i, r, n, o) {
            for (var s = 0, a = 0, h = 0, u = 0, l = 0; l < i; ++l) {
              var c = t[e + l],
                d = c._texture,
                p = c.scale.x,
                f = c.scale.y,
                m = d.trim,
                d = d.orig;
              m
                ? ((s = (a = m.x - c.anchor.x * d.width) + m.width),
                  (h = (u = m.y - c.anchor.y * d.height) + m.height))
                : ((s = d.width * (1 - c.anchor.x)),
                  (a = d.width * -c.anchor.x),
                  (h = d.height * (1 - c.anchor.y)),
                  (u = d.height * -c.anchor.y)),
                (r[o] = a * p),
                (r[o + 1] = u * f),
                (r[o + n] = s * p),
                (r[o + n + 1] = u * f),
                (r[o + 2 * n] = s * p),
                (r[o + 2 * n + 1] = h * f),
                (r[o + 3 * n] = a * p),
                (r[o + 3 * n + 1] = h * f),
                (o += 4 * n);
            }
          }),
          (f.prototype.uploadPosition = function (t, e, i, r, n, o) {
            for (var s = 0; s < i; s++) {
              var a = t[e + s].position;
              (r[o] = a.x),
                (r[o + 1] = a.y),
                (r[o + n] = a.x),
                (r[o + n + 1] = a.y),
                (r[o + 2 * n] = a.x),
                (r[o + 2 * n + 1] = a.y),
                (r[o + 3 * n] = a.x),
                (r[o + 3 * n + 1] = a.y),
                (o += 4 * n);
            }
          }),
          (f.prototype.uploadRotation = function (t, e, i, r, n, o) {
            for (var s = 0; s < i; s++) {
              var a = t[e + s].rotation;
              (r[o] = a),
                (r[o + n] = a),
                (r[o + 2 * n] = a),
                (r[o + 3 * n] = a),
                (o += 4 * n);
            }
          }),
          (f.prototype.uploadUvs = function (t, e, i, r, n, o) {
            for (var s = 0; s < i; ++s) {
              var a = t[e + s]._texture._uvs;
              a
                ? ((r[o] = a.x0),
                  (r[o + 1] = a.y0),
                  (r[o + n] = a.x1),
                  (r[o + n + 1] = a.y1),
                  (r[o + 2 * n] = a.x2),
                  (r[o + 2 * n + 1] = a.y2),
                  (r[o + 3 * n] = a.x3),
                  (r[o + 3 * n + 1] = a.y3))
                : ((r[o] = 0),
                  (r[o + 1] = 0),
                  (r[o + n] = 0),
                  (r[o + n + 1] = 0),
                  (r[o + 2 * n] = 0),
                  (r[o + 2 * n + 1] = 0),
                  (r[o + 3 * n] = 0),
                  (r[o + 3 * n + 1] = 0)),
                (o += 4 * n);
            }
          }),
          (f.prototype.uploadTint = function (t, e, i, r, n, o) {
            for (var s = 0; s < i; ++s) {
              var a = t[e + s],
                h = 0 < a._texture.baseTexture.alphaMode,
                u = a.alpha,
                h =
                  u < 1 && h
                    ? m.premultiplyTint(a._tintRGB, u)
                    : a._tintRGB + ((255 * u) << 24);
              (r[o] = h),
                (r[o + n] = h),
                (r[o + 2 * n] = h),
                (r[o + 3 * n] = h),
                (o += 4 * n);
            }
          }),
          (f.prototype.destroy = function () {
            p.prototype.destroy.call(this),
              this.shader && (this.shader.destroy(), (this.shader = null)),
              (this.tempMatrix = null);
          });
        var p,
          r = f;
        function f(t) {
          t = p.call(this, t) || this;
          return (
            (t.shader = null),
            (t.properties = null),
            (t.tempMatrix = new n.Matrix()),
            (t.properties = [
              {
                attributeName: 'aVertexPosition',
                size: 2,
                uploadFunction: t.uploadVertices,
                offset: 0,
              },
              {
                attributeName: 'aPositionCoord',
                size: 2,
                uploadFunction: t.uploadPosition,
                offset: 0,
              },
              {
                attributeName: 'aRotation',
                size: 1,
                uploadFunction: t.uploadRotation,
                offset: 0,
              },
              {
                attributeName: 'aTextureCoord',
                size: 2,
                uploadFunction: t.uploadUvs,
                offset: 0,
              },
              {
                attributeName: 'aColor',
                size: 1,
                type: s.TYPES.UNSIGNED_BYTE,
                uploadFunction: t.uploadTint,
                offset: 0,
              },
            ]),
            (t.shader = a.Shader.from(
              'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n',
              'varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}',
              {}
            )),
            (t.state = a.State.for2d()),
            t
          );
        }
        (i.ParticleContainer = t), (i.ParticleRenderer = r);
      },
      {
        '@pixi/constants': 3,
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/math': 16,
        '@pixi/utils': 34,
      },
    ],
    23: [
      function (t, e, i) {
        'use strict';
        for (
          var r,
            n = t('es6-promise-polyfill'),
            t =
              (t = t('object-assign')) &&
              'object' == typeof t &&
              ('default' in t)
                ? t.default
                : t,
            o =
              (window.Promise || (window.Promise = n.Polyfill),
              Object.assign || (Object.assign = t),
              (Date.now && Date.prototype.getTime) ||
                (Date.now = function () {
                  return new Date().getTime();
                }),
              (window.performance && window.performance.now) ||
                ((r = Date.now()),
                window.performance || (window.performance = {}),
                (window.performance.now = function () {
                  return Date.now() - r;
                })),
              Date.now()),
            s = ['ms', 'moz', 'webkit', 'o'],
            a = 0;
          a < s.length && !window.requestAnimationFrame;
          ++a
        ) {
          var h = s[a];
          (window.requestAnimationFrame = window[h + 'RequestAnimationFrame']),
            (window.cancelAnimationFrame =
              window[h + 'CancelAnimationFrame'] ||
              window[h + 'CancelRequestAnimationFrame']);
        }
        window.requestAnimationFrame ||
          (window.requestAnimationFrame = function (t) {
            if ('function' != typeof t)
              throw new TypeError(t + 'is not a function');
            var e = Date.now(),
              i = 16 + o - e;
            return (
              i < 0 && (i = 0),
              (o = e),
              window.setTimeout(function () {
                (o = Date.now()), t(performance.now());
              }, i)
            );
          }),
          window.cancelAnimationFrame ||
            (window.cancelAnimationFrame = function (t) {
              return clearTimeout(t);
            }),
          Math.sign ||
            (Math.sign = function (t) {
              return 0 === (t = Number(t)) || isNaN(t) ? t : 0 < t ? 1 : -1;
            }),
          Number.isInteger ||
            (Number.isInteger = function (t) {
              return 'number' == typeof t && isFinite(t) && Math.floor(t) === t;
            }),
          window.ArrayBuffer || (window.ArrayBuffer = Array),
          window.Float32Array || (window.Float32Array = Array),
          window.Uint32Array || (window.Uint32Array = Array),
          window.Uint16Array || (window.Uint16Array = Array),
          window.Uint8Array || (window.Uint8Array = Array),
          window.Int32Array || (window.Int32Array = Array);
      },
      { 'es6-promise-polyfill': 36, 'object-assign': 41 },
    ],
    24: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/settings'),
          o = t('@pixi/core'),
          s = t('@pixi/graphics'),
          a = t('@pixi/ticker'),
          n = t('@pixi/display'),
          h = t('@pixi/text'),
          u =
            ((r.settings.UPLOADS_PER_FRAME = 4),
            function (t, e) {
              return (u =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            });
        (c.prototype.beginFrame = function () {
          this.itemsLeft = this.maxItemsPerFrame;
        }),
          (c.prototype.allowedToUpload = function () {
            return 0 < this.itemsLeft--;
          });
        var l = c;
        function c(t) {
          (this.maxItemsPerFrame = t), (this.itemsLeft = 0);
        }
        function d(t, e) {
          var i = !1;
          if (t && t._textures && t._textures.length)
            for (var r, n = 0; n < t._textures.length; n++)
              t._textures[n] instanceof o.Texture &&
                ((r = t._textures[n].baseTexture),
                -1 === e.indexOf(r) && (e.push(r), (i = !0)));
          return i;
        }
        function p(t, e) {
          return (
            t.baseTexture instanceof o.BaseTexture &&
            ((t = t.baseTexture), -1 === e.indexOf(t) && e.push(t), !0)
          );
        }
        function f(t, e) {
          return (
            !!(t._texture && t._texture instanceof o.Texture) &&
            ((t = t._texture.baseTexture), -1 === e.indexOf(t) && e.push(t), !0)
          );
        }
        function m(t, e) {
          return e instanceof h.Text && (e.updateText(!0), !0);
        }
        function y(t, e) {
          return (
            e instanceof h.TextStyle &&
            ((e = e.toFontString()), h.TextMetrics.measureFont(e), !0)
          );
        }
        function g(t, e) {
          return (
            t instanceof h.Text &&
            (-1 === e.indexOf(t.style) && e.push(t.style),
            -1 === e.indexOf(t) && e.push(t),
            (t = t._texture.baseTexture),
            -1 === e.indexOf(t) && e.push(t),
            !0)
          );
        }
        function v(t, e) {
          return (
            t instanceof h.TextStyle && (-1 === e.indexOf(t) && e.push(t), !0)
          );
        }
        (_.prototype.upload = function (t, e) {
          'function' == typeof t && ((e = t), (t = null)),
            t && this.add(t),
            this.queue.length
              ? (e && this.completes.push(e),
                this.ticking ||
                  ((this.ticking = !0),
                  a.Ticker.system.addOnce(
                    this.tick,
                    this,
                    a.UPDATE_PRIORITY.UTILITY
                  )))
              : e && e();
        }),
          (_.prototype.tick = function () {
            setTimeout(this.delayedTick, 0);
          }),
          (_.prototype.prepareItems = function () {
            for (
              this.limiter.beginFrame();
              this.queue.length && this.limiter.allowedToUpload();

            ) {
              var t = this.queue[0],
                e = !1;
              if (t && !t._destroyed)
                for (var i = 0, r = this.uploadHooks.length; i < r; i++)
                  if (this.uploadHooks[i](this.uploadHookHelper, t)) {
                    this.queue.shift(), (e = !0);
                    break;
                  }
              e || this.queue.shift();
            }
            if (this.queue.length)
              a.Ticker.system.addOnce(
                this.tick,
                this,
                a.UPDATE_PRIORITY.UTILITY
              );
            else {
              this.ticking = !1;
              for (
                var n = this.completes.slice(0),
                  i = (this.completes.length = 0),
                  r = n.length;
                i < r;
                i++
              )
                n[i]();
            }
          }),
          (_.prototype.registerFindHook = function (t) {
            return t && this.addHooks.push(t), this;
          }),
          (_.prototype.registerUploadHook = function (t) {
            return t && this.uploadHooks.push(t), this;
          }),
          (_.prototype.add = function (t) {
            for (
              var e = 0, i = this.addHooks.length;
              e < i && !this.addHooks[e](t, this.queue);
              e++
            );
            if (t instanceof n.Container)
              for (e = t.children.length - 1; 0 <= e; e--)
                this.add(t.children[e]);
            return this;
          }),
          (_.prototype.destroy = function () {
            this.ticking && a.Ticker.system.remove(this.tick, this),
              (this.ticking = !1),
              (this.addHooks = null),
              (this.uploadHooks = null),
              (this.renderer = null),
              (this.completes = null),
              (this.queue = null),
              (this.limiter = null),
              (this.uploadHookHelper = null);
          });
        t = _;
        function _(t) {
          var e = this;
          (this.limiter = new l(r.settings.UPLOADS_PER_FRAME)),
            (this.renderer = t),
            (this.uploadHookHelper = null),
            (this.queue = []),
            (this.addHooks = []),
            (this.uploadHooks = []),
            (this.completes = []),
            (this.ticking = !1),
            (this.delayedTick = function () {
              e.queue && e.prepareItems();
            }),
            this.registerFindHook(g),
            this.registerFindHook(v),
            this.registerFindHook(d),
            this.registerFindHook(p),
            this.registerFindHook(f),
            this.registerUploadHook(m),
            this.registerUploadHook(y);
        }
        function x(t, e) {
          return (
            e instanceof o.BaseTexture &&
            (e._glTextures[t.CONTEXT_UID] || t.texture.bind(e), !0)
          );
        }
        function b(t, e) {
          if (!(e instanceof s.Graphics)) return !1;
          for (
            var i = e.geometry,
              r = (e.finishPoly(), i.updateBatches(), i.batches),
              n = 0;
            n < r.length;
            n++
          ) {
            var o = r[n].style.texture;
            o && x(t, o.baseTexture);
          }
          return (
            i.batchable || t.geometry.bind(i, e._resolveDirectShader(t)), !0
          );
        }
        function T(t, e) {
          return t instanceof s.Graphics && (e.push(t), !0);
        }
        u((w = O), (P = E = t)),
          (w.prototype =
            null === P
              ? Object.create(P)
              : ((S.prototype = P.prototype), new S()));
        var E,
          w,
          P = O;
        function S() {
          this.constructor = w;
        }
        function O(t) {
          t = E.call(this, t) || this;
          return (
            (t.uploadHookHelper = t.renderer),
            t.registerFindHook(T),
            t.registerUploadHook(x),
            t.registerUploadHook(b),
            t
          );
        }
        (A.prototype.beginFrame = function () {
          this.frameStart = Date.now();
        }),
          (A.prototype.allowedToUpload = function () {
            return Date.now() - this.frameStart < this.maxMilliseconds;
          });
        var I = A;
        function A(t) {
          (this.maxMilliseconds = t), (this.frameStart = 0);
        }
        (i.BasePrepare = t),
          (i.CountLimiter = l),
          (i.Prepare = P),
          (i.TimeLimiter = I);
      },
      {
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/graphics': 13,
        '@pixi/settings': 26,
        '@pixi/text': 32,
        '@pixi/ticker': 33,
      },
    ],
    25: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        (n.prototype.emit = function (t, e, i, r, n, o, s, a) {
          if (8 < arguments.length) throw new Error('max arguments reached');
          var h = this.name,
            u = this.items;
          this._aliasCount++;
          for (var l = 0, c = u.length; l < c; l++)
            u[l][h](t, e, i, r, n, o, s, a);
          return u === this.items && this._aliasCount--, this;
        }),
          (n.prototype.ensureNonAliasedItems = function () {
            0 < this._aliasCount &&
              1 < this.items.length &&
              ((this._aliasCount = 0), (this.items = this.items.slice(0)));
          }),
          (n.prototype.add = function (t) {
            return (
              t[this._name] &&
                (this.ensureNonAliasedItems(),
                this.remove(t),
                this.items.push(t)),
              this
            );
          }),
          (n.prototype.remove = function (t) {
            t = this.items.indexOf(t);
            return (
              -1 !== t &&
                (this.ensureNonAliasedItems(), this.items.splice(t, 1)),
              this
            );
          }),
          (n.prototype.contains = function (t) {
            return -1 !== this.items.indexOf(t);
          }),
          (n.prototype.removeAll = function () {
            return this.ensureNonAliasedItems(), (this.items.length = 0), this;
          }),
          (n.prototype.destroy = function () {
            this.removeAll(), (this.items = null), (this._name = null);
          }),
          Object.defineProperty(n.prototype, 'empty', {
            get: function () {
              return 0 === this.items.length;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(n.prototype, 'name', {
            get: function () {
              return this._name;
            },
            enumerable: !1,
            configurable: !0,
          });
        var r = n;
        function n(t) {
          (this.items = []), (this._name = t), (this._aliasCount = 0);
        }
        Object.defineProperties(r.prototype, {
          dispatch: { value: r.prototype.emit },
          run: { value: r.prototype.emit },
        }),
          (i.Runner = r);
      },
      {},
    ],
    26: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        t = (
          (t = t('ismobilejs')) && 'object' == typeof t && 'default' in t
            ? t.default
            : t
        )(window.navigator);
        var r,
          n,
          o = {
            MIPMAP_TEXTURES: 1,
            ANISOTROPIC_LEVEL: 0,
            RESOLUTION: 1,
            FILTER_RESOLUTION: 1,
            SPRITE_MAX_TEXTURES:
              ((r = 32),
              (n = !0),
              (t.tablet || t.phone) &&
                (t.apple.device &&
                  (o = navigator.userAgent.match(/OS (\d+)_(\d+)?/)) &&
                  parseInt(o[1], 10) < 11 &&
                  (n = !1),
                t.android.device &&
                  (o = navigator.userAgent.match(/Android\s([0-9.]*)/)) &&
                  parseInt(o[1], 10) < 7 &&
                  (n = !1)),
              n ? r : 4),
            SPRITE_BATCH_SIZE: 4096,
            RENDER_OPTIONS: {
              view: null,
              antialias: !1,
              autoDensity: !1,
              transparent: !1,
              backgroundColor: 0,
              clearBeforeRender: !0,
              preserveDrawingBuffer: !1,
              width: 800,
              height: 600,
              legacy: !1,
            },
            GC_MODE: 0,
            GC_MAX_IDLE: 3600,
            GC_MAX_CHECK_COUNT: 600,
            WRAP_MODE: 33071,
            SCALE_MODE: 1,
            PRECISION_VERTEX: 'highp',
            PRECISION_FRAGMENT: t.apple.device ? 'highp' : 'mediump',
            CAN_UPLOAD_SAME_BUFFER: !t.apple.device,
            CREATE_IMAGE_BITMAP: !1,
            ROUND_PIXELS: !1,
          };
        (i.isMobile = t), (i.settings = o);
      },
      { ismobilejs: 38 },
    ],
    27: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/core'),
          n = t('@pixi/sprite'),
          o = t('@pixi/ticker'),
          s = function (t, e) {
            return (s =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (a = n.Sprite),
          s((h = l), (t = a)),
          (h.prototype =
            null === t
              ? Object.create(t)
              : ((u.prototype = t.prototype), new u())),
          (l.prototype.stop = function () {
            this._playing &&
              ((this._playing = !1),
              this._autoUpdate &&
                this._isConnectedToTicker &&
                (o.Ticker.shared.remove(this.update, this),
                (this._isConnectedToTicker = !1)));
          }),
          (l.prototype.play = function () {
            this._playing ||
              ((this._playing = !0),
              this._autoUpdate &&
                !this._isConnectedToTicker &&
                (o.Ticker.shared.add(this.update, this, o.UPDATE_PRIORITY.HIGH),
                (this._isConnectedToTicker = !0)));
          }),
          (l.prototype.gotoAndStop = function (t) {
            this.stop();
            var e = this.currentFrame;
            (this._currentTime = t),
              e !== this.currentFrame && this.updateTexture();
          }),
          (l.prototype.gotoAndPlay = function (t) {
            var e = this.currentFrame;
            (this._currentTime = t),
              e !== this.currentFrame && this.updateTexture(),
              this.play();
          }),
          (l.prototype.update = function (t) {
            if (this._playing) {
              var e = this.animationSpeed * t,
                i = this.currentFrame;
              if (null !== this._durations) {
                var r =
                  (this._currentTime % 1) * this._durations[this.currentFrame];
                for (r += (e / 60) * 1e3; r < 0; )
                  this._currentTime--,
                    (r += this._durations[this.currentFrame]);
                var n = Math.sign(this.animationSpeed * t);
                for (
                  this._currentTime = Math.floor(this._currentTime);
                  r >= this._durations[this.currentFrame];

                )
                  (r -= this._durations[this.currentFrame] * n),
                    (this._currentTime += n);
                this._currentTime += r / this._durations[this.currentFrame];
              } else this._currentTime += e;
              this._currentTime < 0 && !this.loop
                ? (this.gotoAndStop(0), this.onComplete && this.onComplete())
                : this._currentTime >= this._textures.length && !this.loop
                ? (this.gotoAndStop(this._textures.length - 1),
                  this.onComplete && this.onComplete())
                : i !== this.currentFrame &&
                  (this.loop &&
                    this.onLoop &&
                    ((0 < this.animationSpeed && this.currentFrame < i) ||
                      (this.animationSpeed < 0 && this.currentFrame > i)) &&
                    this.onLoop(),
                  this.updateTexture());
            }
          }),
          (l.prototype.updateTexture = function () {
            var t = this.currentFrame;
            this._previousFrame !== t &&
              ((this._previousFrame = t),
              (this._texture = this._textures[t]),
              (this._textureID = -1),
              (this._textureTrimmedID = -1),
              (this._cachedTint = 16777215),
              (this.uvs = this._texture._uvs.uvsFloat32),
              this.updateAnchor &&
                this._anchor.copyFrom(this._texture.defaultAnchor),
              this.onFrameChange && this.onFrameChange(this.currentFrame));
          }),
          (l.prototype.destroy = function (t) {
            this.stop(),
              a.prototype.destroy.call(this, t),
              (this.onComplete = null),
              (this.onFrameChange = null),
              (this.onLoop = null);
          }),
          (l.fromFrames = function (t) {
            for (var e = [], i = 0; i < t.length; ++i)
              e.push(r.Texture.from(t[i]));
            return new l(e);
          }),
          (l.fromImages = function (t) {
            for (var e = [], i = 0; i < t.length; ++i)
              e.push(r.Texture.from(t[i]));
            return new l(e);
          }),
          Object.defineProperty(l.prototype, 'totalFrames', {
            get: function () {
              return this._textures.length;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(l.prototype, 'textures', {
            get: function () {
              return this._textures;
            },
            set: function (t) {
              if (t[0] instanceof r.Texture)
                (this._textures = t), (this._durations = null);
              else {
                (this._textures = []), (this._durations = []);
                for (var e = 0; e < t.length; e++)
                  this._textures.push(t[e].texture),
                    this._durations.push(t[e].time);
              }
              (this._previousFrame = null),
                this.gotoAndStop(0),
                this.updateTexture();
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(l.prototype, 'currentFrame', {
            get: function () {
              var t = Math.floor(this._currentTime) % this._textures.length;
              return t < 0 && (t += this._textures.length), t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(l.prototype, 'playing', {
            get: function () {
              return this._playing;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(l.prototype, 'autoUpdate', {
            get: function () {
              return this._autoUpdate;
            },
            set: function (t) {
              t !== this._autoUpdate &&
                ((this._autoUpdate = t),
                !this._autoUpdate && this._isConnectedToTicker
                  ? (o.Ticker.shared.remove(this.update, this),
                    (this._isConnectedToTicker = !1))
                  : this._autoUpdate &&
                    !this._isConnectedToTicker &&
                    this._playing &&
                    (o.Ticker.shared.add(this.update, this),
                    (this._isConnectedToTicker = !0)));
            },
            enumerable: !1,
            configurable: !0,
          });
        var a,
          h,
          n = l;
        function u() {
          this.constructor = h;
        }
        function l(t, e) {
          void 0 === e && (e = !0);
          var i =
            a.call(this, t[0] instanceof r.Texture ? t[0] : t[0].texture) ||
            this;
          return (
            (i._textures = null),
            (i._durations = null),
            (i._autoUpdate = e),
            (i._isConnectedToTicker = !1),
            (i.animationSpeed = 1),
            (i.loop = !0),
            (i.updateAnchor = !1),
            (i.onComplete = null),
            (i.onFrameChange = null),
            (i.onLoop = null),
            (i._currentTime = 0),
            (i._playing = !1),
            (i._previousFrame = null),
            (i.textures = t),
            i
          );
        }
        i.AnimatedSprite = n;
      },
      { '@pixi/core': 4, '@pixi/sprite': 29, '@pixi/ticker': 33 },
    ],
    28: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var n = t('@pixi/core'),
          o = t('@pixi/math'),
          r = t('@pixi/sprite'),
          p = t('@pixi/utils'),
          f = t('@pixi/constants'),
          s = function (t, e) {
            return (s =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        function a(t, e) {
          function i() {
            this.constructor = t;
          }
          s(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        var h,
          u = new o.Point(),
          t =
            (a(l, (h = r.Sprite)),
            Object.defineProperty(l.prototype, 'clampMargin', {
              get: function () {
                return this.uvMatrix.clampMargin;
              },
              set: function (t) {
                (this.uvMatrix.clampMargin = t), this.uvMatrix.update(!0);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'tileScale', {
              get: function () {
                return this.tileTransform.scale;
              },
              set: function (t) {
                this.tileTransform.scale.copyFrom(t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'tilePosition', {
              get: function () {
                return this.tileTransform.position;
              },
              set: function (t) {
                this.tileTransform.position.copyFrom(t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            (l.prototype._onTextureUpdate = function () {
              this.uvMatrix && (this.uvMatrix.texture = this._texture),
                (this._cachedTint = 16777215);
            }),
            (l.prototype._render = function (t) {
              var e = this._texture;
              e &&
                e.valid &&
                (this.tileTransform.updateLocalTransform(),
                this.uvMatrix.update(),
                t.batch.setObjectRenderer(t.plugins[this.pluginName]),
                t.plugins[this.pluginName].render(this));
            }),
            (l.prototype._calculateBounds = function () {
              var t = this._width * -this._anchor._x,
                e = this._height * -this._anchor._y,
                i = this._width * (1 - this._anchor._x),
                r = this._height * (1 - this._anchor._y);
              this._bounds.addFrame(this.transform, t, e, i, r);
            }),
            (l.prototype.getLocalBounds = function (t) {
              return 0 === this.children.length
                ? ((this._bounds.minX = this._width * -this._anchor._x),
                  (this._bounds.minY = this._height * -this._anchor._y),
                  (this._bounds.maxX = this._width * (1 - this._anchor._x)),
                  (this._bounds.maxY = this._height * (1 - this._anchor._y)),
                  t ||
                    (this._localBoundsRect ||
                      (this._localBoundsRect = new o.Rectangle()),
                    (t = this._localBoundsRect)),
                  this._bounds.getRectangle(t))
                : h.prototype.getLocalBounds.call(this, t);
            }),
            (l.prototype.containsPoint = function (t) {
              this.worldTransform.applyInverse(t, u);
              var t = this._width,
                e = this._height,
                i = -t * this.anchor._x;
              if (u.x >= i && u.x < i + t) {
                i = -e * this.anchor._y;
                if (u.y >= i && u.y < i + e) return !0;
              }
              return !1;
            }),
            (l.prototype.destroy = function (t) {
              h.prototype.destroy.call(this, t),
                (this.tileTransform = null),
                (this.uvMatrix = null);
            }),
            (l.from = function (t, e) {
              return (
                'number' == typeof e &&
                  (p.deprecation(
                    '5.3.0',
                    'TilingSprite.from use options instead of width and height args'
                  ),
                  (e = { width: e, height: arguments[2] })),
                new l(n.Texture.from(t, e), e.width, e.height)
              );
            }),
            Object.defineProperty(l.prototype, 'width', {
              get: function () {
                return this._width;
              },
              set: function (t) {
                this._width = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'height', {
              get: function () {
                return this._height;
              },
              set: function (t) {
                this._height = t;
              },
              enumerable: !1,
              configurable: !0,
            }),
            l);
        function l(t, e, i) {
          void 0 === e && (e = 100), void 0 === i && (i = 100);
          var r = h.call(this, t) || this;
          return (
            (r.tileTransform = new o.Transform()),
            (r._width = e),
            (r._height = i),
            (r.uvMatrix = r.texture.uvMatrix || new n.TextureMatrix(t)),
            (r.pluginName = 'tilingSprite'),
            (r.uvRespectAnchor = !1),
            r
          );
        }
        var c,
          d =
            'attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n',
          m = new o.Matrix(),
          r =
            (a(y, (c = n.ObjectRenderer)),
            (y.prototype.render = function (t) {
              var e = this.renderer,
                i = this.quad,
                r = i.vertices,
                r =
                  ((r[0] = r[6] = t._width * -t.anchor.x),
                  (r[1] = r[3] = t._height * -t.anchor.y),
                  (r[2] = r[4] = t._width * (1 - t.anchor.x)),
                  (r[5] = r[7] = t._height * (1 - t.anchor.y)),
                  t.uvRespectAnchor &&
                    (((r = i.uvs)[0] = r[6] = -t.anchor.x),
                    (r[1] = r[3] = -t.anchor.y),
                    (r[2] = r[4] = 1 - t.anchor.x),
                    (r[5] = r[7] = 1 - t.anchor.y)),
                  i.invalidate(),
                  t._texture),
                n = r.baseTexture,
                o = t.tileTransform.localTransform,
                s = t.uvMatrix,
                a =
                  n.isPowerOfTwo &&
                  r.frame.width === n.width &&
                  r.frame.height === n.height,
                h =
                  (a &&
                    (n._glTextures[e.CONTEXT_UID]
                      ? (a = n.wrapMode !== f.WRAP_MODES.CLAMP)
                      : n.wrapMode === f.WRAP_MODES.CLAMP &&
                        (n.wrapMode = f.WRAP_MODES.REPEAT)),
                  a ? this.simpleShader : this.shader),
                u = r.width,
                l = r.height,
                c = t._width,
                d = t._height;
              m.set(
                (o.a * u) / c,
                (o.b * u) / d,
                (o.c * l) / c,
                (o.d * l) / d,
                o.tx / c,
                o.ty / d
              ),
                m.invert(),
                a
                  ? m.prepend(s.mapCoord)
                  : ((h.uniforms.uMapCoord = s.mapCoord.toArray(!0)),
                    (h.uniforms.uClampFrame = s.uClampFrame),
                    (h.uniforms.uClampOffset = s.uClampOffset)),
                (h.uniforms.uTransform = m.toArray(!0)),
                (h.uniforms.uColor = p.premultiplyTintToRgba(
                  t.tint,
                  t.worldAlpha,
                  h.uniforms.uColor,
                  n.alphaMode
                )),
                (h.uniforms.translationMatrix =
                  t.transform.worldTransform.toArray(!0)),
                (h.uniforms.uSampler = r),
                e.shader.bind(h),
                e.geometry.bind(i),
                (this.state.blendMode = p.correctBlendMode(
                  t.blendMode,
                  n.alphaMode
                )),
                e.state.set(this.state),
                e.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
            }),
            y);
        function y(t) {
          var t = c.call(this, t) || this,
            e = { globals: t.renderer.globalUniforms };
          return (
            (t.shader = n.Shader.from(
              d,
              'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture2D(uSampler, coord);\n    gl_FragColor = texSample * uColor;\n}\n',
              e
            )),
            (t.simpleShader = n.Shader.from(
              d,
              'varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 texSample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = texSample * uColor;\n}\n',
              e
            )),
            (t.quad = new n.QuadUv()),
            (t.state = n.State.for2d()),
            t
          );
        }
        (i.TilingSprite = t), (i.TilingSpriteRenderer = r);
      },
      {
        '@pixi/constants': 3,
        '@pixi/core': 4,
        '@pixi/math': 16,
        '@pixi/sprite': 29,
        '@pixi/utils': 34,
      },
    ],
    29: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = t('@pixi/constants'),
          n = t('@pixi/core'),
          o = t('@pixi/display'),
          s = t('@pixi/math'),
          y = t('@pixi/settings'),
          a = t('@pixi/utils'),
          h = function (t, e) {
            return (h =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        var u,
          l,
          c = new s.Point(),
          d = new Uint16Array([0, 1, 2, 0, 2, 3]),
          o =
            ((u = o.Container),
            h((l = f), (t = u)),
            (l.prototype =
              null === t
                ? Object.create(t)
                : ((p.prototype = t.prototype), new p())),
            (f.prototype._onTextureUpdate = function () {
              (this._textureID = -1),
                (this._textureTrimmedID = -1),
                (this._cachedTint = 16777215),
                this._width &&
                  (this.scale.x =
                    (a.sign(this.scale.x) * this._width) /
                    this._texture.orig.width),
                this._height &&
                  (this.scale.y =
                    (a.sign(this.scale.y) * this._height) /
                    this._texture.orig.height);
            }),
            (f.prototype._onAnchorUpdate = function () {
              (this._transformID = -1), (this._transformTrimmedID = -1);
            }),
            (f.prototype.calculateVertices = function () {
              var t = this._texture;
              if (
                this._transformID !== this.transform._worldID ||
                this._textureID !== t._updateID
              ) {
                this._textureID !== t._updateID &&
                  (this.uvs = this._texture._uvs.uvsFloat32),
                  (this._transformID = this.transform._worldID),
                  (this._textureID = t._updateID);
                var e = this.transform.worldTransform,
                  i = e.a,
                  r = e.b,
                  n = e.c,
                  o = e.d,
                  s = e.tx,
                  e = e.ty,
                  a = this.vertexData,
                  h = t.trim,
                  t = t.orig,
                  u = this._anchor,
                  l = 0,
                  c = 0,
                  d = 0,
                  p = 0,
                  d = h
                    ? ((l = (c = h.x - u._x * t.width) + h.width),
                      (p = h.y - u._y * t.height) + h.height)
                    : ((l = (c = -u._x * t.width) + t.width),
                      (p = -u._y * t.height) + t.height);
                if (
                  ((a[0] = i * c + n * p + s),
                  (a[1] = o * p + r * c + e),
                  (a[2] = i * l + n * p + s),
                  (a[3] = o * p + r * l + e),
                  (a[4] = i * l + n * d + s),
                  (a[5] = o * d + r * l + e),
                  (a[6] = i * c + n * d + s),
                  (a[7] = o * d + r * c + e),
                  this._roundPixels)
                )
                  for (var f = y.settings.RESOLUTION, m = 0; m < a.length; ++m)
                    a[m] = Math.round(((a[m] * f) | 0) / f);
              }
            }),
            (f.prototype.calculateTrimmedVertices = function () {
              if (this.vertexTrimmedData) {
                if (
                  this._transformTrimmedID === this.transform._worldID &&
                  this._textureTrimmedID === this._texture._updateID
                )
                  return;
              } else this.vertexTrimmedData = new Float32Array(8);
              (this._transformTrimmedID = this.transform._worldID),
                (this._textureTrimmedID = this._texture._updateID);
              var t = this._texture,
                e = this.vertexTrimmedData,
                t = t.orig,
                i = this._anchor,
                r = this.transform.worldTransform,
                n = r.a,
                o = r.b,
                s = r.c,
                a = r.d,
                h = r.tx,
                r = r.ty,
                u = -i._x * t.width,
                l = u + t.width,
                i = -i._y * t.height,
                t = i + t.height;
              (e[0] = n * u + s * i + h),
                (e[1] = a * i + o * u + r),
                (e[2] = n * l + s * i + h),
                (e[3] = a * i + o * l + r),
                (e[4] = n * l + s * t + h),
                (e[5] = a * t + o * l + r),
                (e[6] = n * u + s * t + h),
                (e[7] = a * t + o * u + r);
            }),
            (f.prototype._render = function (t) {
              this.calculateVertices(),
                t.batch.setObjectRenderer(t.plugins[this.pluginName]),
                t.plugins[this.pluginName].render(this);
            }),
            (f.prototype._calculateBounds = function () {
              var t = this._texture.trim,
                e = this._texture.orig;
              !t || (t.width === e.width && t.height === e.height)
                ? (this.calculateVertices(),
                  this._bounds.addQuad(this.vertexData))
                : (this.calculateTrimmedVertices(),
                  this._bounds.addQuad(this.vertexTrimmedData));
            }),
            (f.prototype.getLocalBounds = function (t) {
              return 0 === this.children.length
                ? ((this._bounds.minX =
                    this._texture.orig.width * -this._anchor._x),
                  (this._bounds.minY =
                    this._texture.orig.height * -this._anchor._y),
                  (this._bounds.maxX =
                    this._texture.orig.width * (1 - this._anchor._x)),
                  (this._bounds.maxY =
                    this._texture.orig.height * (1 - this._anchor._y)),
                  t ||
                    (this._localBoundsRect ||
                      (this._localBoundsRect = new s.Rectangle()),
                    (t = this._localBoundsRect)),
                  this._bounds.getRectangle(t))
                : u.prototype.getLocalBounds.call(this, t);
            }),
            (f.prototype.containsPoint = function (t) {
              this.worldTransform.applyInverse(t, c);
              var t = this._texture.orig.width,
                e = this._texture.orig.height,
                i = -t * this.anchor.x;
              return (
                c.x >= i &&
                c.x < i + t &&
                ((i = -e * this.anchor.y), c.y >= i && c.y < i + e)
              );
            }),
            (f.prototype.destroy = function (t) {
              u.prototype.destroy.call(this, t),
                this._texture.off('update', this._onTextureUpdate, this),
                (this._anchor = null),
                ('boolean' == typeof t ? t : t && t.texture) &&
                  ((t = 'boolean' == typeof t ? t : t && t.baseTexture),
                  this._texture.destroy(!!t)),
                (this._texture = null);
            }),
            (f.from = function (t, e) {
              return new f(t instanceof n.Texture ? t : n.Texture.from(t, e));
            }),
            Object.defineProperty(f.prototype, 'roundPixels', {
              get: function () {
                return this._roundPixels;
              },
              set: function (t) {
                this._roundPixels !== t && (this._transformID = -1),
                  (this._roundPixels = t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(f.prototype, 'width', {
              get: function () {
                return Math.abs(this.scale.x) * this._texture.orig.width;
              },
              set: function (t) {
                var e = a.sign(this.scale.x) || 1;
                (this.scale.x = (e * t) / this._texture.orig.width),
                  (this._width = t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(f.prototype, 'height', {
              get: function () {
                return Math.abs(this.scale.y) * this._texture.orig.height;
              },
              set: function (t) {
                var e = a.sign(this.scale.y) || 1;
                (this.scale.y = (e * t) / this._texture.orig.height),
                  (this._height = t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(f.prototype, 'anchor', {
              get: function () {
                return this._anchor;
              },
              set: function (t) {
                this._anchor.copyFrom(t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(f.prototype, 'tint', {
              get: function () {
                return this._tint;
              },
              set: function (t) {
                (this._tint = t),
                  (this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(f.prototype, 'texture', {
              get: function () {
                return this._texture;
              },
              set: function (t) {
                this._texture !== t &&
                  (this._texture &&
                    this._texture.off('update', this._onTextureUpdate, this),
                  (this._texture = t || n.Texture.EMPTY),
                  (this._cachedTint = 16777215),
                  (this._textureID = -1),
                  (this._textureTrimmedID = -1),
                  t &&
                    (t.baseTexture.valid
                      ? this._onTextureUpdate()
                      : t.once('update', this._onTextureUpdate, this)));
              },
              enumerable: !1,
              configurable: !0,
            }),
            f);
        function p() {
          this.constructor = l;
        }
        function f(t) {
          var e = u.call(this) || this;
          return (
            (e._anchor = new s.ObservablePoint(
              e._onAnchorUpdate,
              e,
              t ? t.defaultAnchor.x : 0,
              t ? t.defaultAnchor.y : 0
            )),
            (e._texture = null),
            (e._width = 0),
            (e._height = 0),
            (e._tint = null),
            (e._tintRGB = null),
            (e.tint = 16777215),
            (e.blendMode = r.BLEND_MODES.NORMAL),
            (e._cachedTint = 16777215),
            (e.uvs = null),
            (e.texture = t || n.Texture.EMPTY),
            (e.vertexData = new Float32Array(8)),
            (e.vertexTrimmedData = null),
            (e._transformID = -1),
            (e._textureID = -1),
            (e._transformTrimmedID = -1),
            (e._textureTrimmedID = -1),
            (e.indices = d),
            (e.pluginName = 'batch'),
            (e.isSprite = !0),
            (e._roundPixels = y.settings.ROUND_PIXELS),
            e
          );
        }
        i.Sprite = o;
      },
      {
        '@pixi/constants': 3,
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/math': 16,
        '@pixi/settings': 26,
        '@pixi/utils': 34,
      },
    ],
    30: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var u = t('@pixi/math'),
          l = t('@pixi/core'),
          r = t('@pixi/utils'),
          o = t('@pixi/loaders'),
          s =
            ((c.prototype._updateResolution = function (t) {
              var e = this.data.meta.scale,
                t = r.getResolutionOfUrl((t = void 0 === t ? null : t), null);
              return (
                1 !==
                  (t = null === t ? (void 0 !== e ? parseFloat(e) : 1) : t) &&
                  this.baseTexture.setResolution(t),
                t
              );
            }),
            (c.prototype.parse = function (t) {
              (this._batchIndex = 0),
                (this._callback = t),
                this._frameKeys.length <= c.BATCH_SIZE
                  ? (this._processFrames(0),
                    this._processAnimations(),
                    this._parseComplete())
                  : this._nextBatch();
            }),
            (c.prototype._processFrames = function (t) {
              for (
                var e = t, i = c.BATCH_SIZE;
                e - t < i && e < this._frameKeys.length;

              ) {
                var r,
                  n,
                  o,
                  s = this._frameKeys[e],
                  a = this._frames[s],
                  h = a.frame;
                h &&
                  ((r = o = null),
                  (n =
                    !1 !== a.trimmed && a.sourceSize ? a.sourceSize : a.frame),
                  (n = new u.Rectangle(
                    0,
                    0,
                    Math.floor(n.w) / this.resolution,
                    Math.floor(n.h) / this.resolution
                  )),
                  (o = a.rotated
                    ? new u.Rectangle(
                        Math.floor(h.x) / this.resolution,
                        Math.floor(h.y) / this.resolution,
                        Math.floor(h.h) / this.resolution,
                        Math.floor(h.w) / this.resolution
                      )
                    : new u.Rectangle(
                        Math.floor(h.x) / this.resolution,
                        Math.floor(h.y) / this.resolution,
                        Math.floor(h.w) / this.resolution,
                        Math.floor(h.h) / this.resolution
                      )),
                  !1 !== a.trimmed &&
                    a.spriteSourceSize &&
                    (r = new u.Rectangle(
                      Math.floor(a.spriteSourceSize.x) / this.resolution,
                      Math.floor(a.spriteSourceSize.y) / this.resolution,
                      Math.floor(h.w) / this.resolution,
                      Math.floor(h.h) / this.resolution
                    )),
                  (this.textures[s] = new l.Texture(
                    this.baseTexture,
                    o,
                    n,
                    r,
                    a.rotated ? 2 : 0,
                    a.anchor
                  )),
                  l.Texture.addToCache(this.textures[s], s)),
                  e++;
              }
            }),
            (c.prototype._processAnimations = function () {
              var t,
                e = this.data.animations || {};
              for (t in e) {
                this.animations[t] = [];
                for (var i = 0; i < e[t].length; i++) {
                  var r = e[t][i];
                  this.animations[t].push(this.textures[r]);
                }
              }
            }),
            (c.prototype._parseComplete = function () {
              var t = this._callback;
              (this._callback = null),
                (this._batchIndex = 0),
                t.call(this, this.textures);
            }),
            (c.prototype._nextBatch = function () {
              var t = this;
              this._processFrames(this._batchIndex * c.BATCH_SIZE),
                this._batchIndex++,
                setTimeout(function () {
                  t._batchIndex * c.BATCH_SIZE < t._frameKeys.length
                    ? t._nextBatch()
                    : (t._processAnimations(), t._parseComplete());
                }, 0);
            }),
            (c.prototype.destroy = function (t) {
              for (var e in (void 0 === t && (t = !1), this.textures))
                this.textures[e].destroy();
              (this._frames = null),
                (this._frameKeys = null),
                (this.data = null),
                (this.textures = null),
                t &&
                  (null != (t = this._texture) && t.destroy(),
                  this.baseTexture.destroy()),
                (this._texture = null),
                (this.baseTexture = null);
            }),
            (c.BATCH_SIZE = 1e3),
            c);
        function c(t, e, i) {
          void 0 === i && (i = null),
            (this._texture = t instanceof l.Texture ? t : null),
            (this.baseTexture =
              t instanceof l.BaseTexture ? t : this._texture.baseTexture),
            (this.textures = {}),
            (this.animations = {}),
            (this.data = e);
          t = this.baseTexture.resource;
          (this.resolution = this._updateResolution(i || (t ? t.url : null))),
            (this._frames = this.data.frames),
            (this._frameKeys = Object.keys(this._frames)),
            (this._batchIndex = 0),
            (this._callback = null);
        }
        (a.use = function (i, r) {
          var t,
            e,
            n = i.name + '_image';
          i.data &&
          i.type === o.LoaderResource.TYPE.JSON &&
          i.data.frames &&
          !this.resources[n]
            ? ((t = {
                crossOrigin: i.crossOrigin,
                metadata: i.metadata.imageMetadata,
                parentResource: i,
              }),
              (e = a.getResourcePath(i, this.baseUrl)),
              this.add(n, e, t, function (t) {
                var e;
                t.error
                  ? r(t.error)
                  : (e = new s(t.texture, i.data, i.url)).parse(function () {
                      (i.spritesheet = e), (i.textures = e.textures), r();
                    });
              }))
            : r();
        }),
          (a.getResourcePath = function (t, e) {
            return t.isDataUrl
              ? t.data.meta.image
              : r.url.resolve(t.url.replace(e, ''), t.data.meta.image);
          });
        t = a;
        function a() {}
        (i.Spritesheet = s), (i.SpritesheetLoader = t);
      },
      {
        '@pixi/core': 4,
        '@pixi/loaders': 15,
        '@pixi/math': 16,
        '@pixi/utils': 34,
      },
    ],
    31: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var Z = t('@pixi/math'),
          h = t('@pixi/settings'),
          J = t('@pixi/mesh'),
          Q = t('@pixi/utils'),
          $ = t('@pixi/core'),
          w = t('@pixi/text'),
          r = t('@pixi/display'),
          f = t('@pixi/loaders'),
          n = function (t, e) {
            return (n =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        var P = function () {
            (this.info = []),
              (this.common = []),
              (this.page = []),
              (this.char = []),
              (this.kerning = []);
          },
          t =
            ((o.test = function (t) {
              return 'string' == typeof t && 0 === t.indexOf('info face=');
            }),
            (o.parse = function (t) {
              var e,
                i = t.match(/^[a-z]+\s+.+$/gm),
                r = {
                  info: [],
                  common: [],
                  page: [],
                  char: [],
                  chars: [],
                  kerning: [],
                  kernings: [],
                };
              for (e in i) {
                var n,
                  o = i[e].match(/^[a-z]+/gm)[0],
                  s = i[e].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm),
                  a = {};
                for (n in s) {
                  var h = s[n].split('='),
                    u = h[0],
                    h = h[1].replace(/"/gm, ''),
                    l = parseFloat(h),
                    h = isNaN(l) ? h : l;
                  a[u] = h;
                }
                r[o].push(a);
              }
              var c = new P();
              return (
                r.info.forEach(function (t) {
                  return c.info.push({
                    face: t.face,
                    size: parseInt(t.size, 10),
                  });
                }),
                r.common.forEach(function (t) {
                  return c.common.push({
                    lineHeight: parseInt(t.lineHeight, 10),
                  });
                }),
                r.page.forEach(function (t) {
                  return c.page.push({ id: parseInt(t.id, 10), file: t.file });
                }),
                r.char.forEach(function (t) {
                  return c.char.push({
                    id: parseInt(t.id, 10),
                    page: parseInt(t.page, 10),
                    x: parseInt(t.x, 10),
                    y: parseInt(t.y, 10),
                    width: parseInt(t.width, 10),
                    height: parseInt(t.height, 10),
                    xoffset: parseInt(t.xoffset, 10),
                    yoffset: parseInt(t.yoffset, 10),
                    xadvance: parseInt(t.xadvance, 10),
                  });
                }),
                r.kerning.forEach(function (t) {
                  return c.kerning.push({
                    first: parseInt(t.first, 10),
                    second: parseInt(t.second, 10),
                    amount: parseInt(t.amount, 10),
                  });
                }),
                c
              );
            }),
            o);
        function o() {}
        (a.test = function (t) {
          return (
            t instanceof XMLDocument &&
            t.getElementsByTagName('page').length &&
            null !== t.getElementsByTagName('info')[0].getAttribute('face')
          );
        }),
          (a.parse = function (t) {
            for (
              var e = new P(),
                i = t.getElementsByTagName('info'),
                r = t.getElementsByTagName('common'),
                n = t.getElementsByTagName('page'),
                o = t.getElementsByTagName('char'),
                s = t.getElementsByTagName('kerning'),
                a = 0;
              a < i.length;
              a++
            )
              e.info.push({
                face: i[a].getAttribute('face'),
                size: parseInt(i[a].getAttribute('size'), 10),
              });
            for (a = 0; a < r.length; a++)
              e.common.push({
                lineHeight: parseInt(r[a].getAttribute('lineHeight'), 10),
              });
            for (a = 0; a < n.length; a++)
              e.page.push({
                id: parseInt(n[a].getAttribute('id'), 10) || 0,
                file: n[a].getAttribute('file'),
              });
            for (a = 0; a < o.length; a++) {
              var h = o[a];
              e.char.push({
                id: parseInt(h.getAttribute('id'), 10),
                page: parseInt(h.getAttribute('page'), 10) || 0,
                x: parseInt(h.getAttribute('x'), 10),
                y: parseInt(h.getAttribute('y'), 10),
                width: parseInt(h.getAttribute('width'), 10),
                height: parseInt(h.getAttribute('height'), 10),
                xoffset: parseInt(h.getAttribute('xoffset'), 10),
                yoffset: parseInt(h.getAttribute('yoffset'), 10),
                xadvance: parseInt(h.getAttribute('xadvance'), 10),
              });
            }
            for (a = 0; a < s.length; a++)
              e.kerning.push({
                first: parseInt(s[a].getAttribute('first'), 10),
                second: parseInt(s[a].getAttribute('second'), 10),
                amount: parseInt(s[a].getAttribute('amount'), 10),
              });
            return e;
          });
        var s = a;
        function a() {}
        function u() {}
        (u.test = function (t) {
          return (
            'string' == typeof t &&
            -1 < t.indexOf('<font>') &&
            ((t = new self.DOMParser().parseFromString(t, 'text/xml')),
            s.test(t))
          );
        }),
          (u.parse = function (t) {
            t = new window.DOMParser().parseFromString(t, 'text/xml');
            return s.parse(t);
          });
        var l = [t, s, u];
        function m(t) {
          for (var e = 0; e < l.length; e++) if (l[e].test(t)) return l[e];
          return null;
        }
        function S(t, e, i, r, n, o, s) {
          var a,
            h = i.text,
            u = i.fontProperties,
            r = (e.translate(r, n), e.scale(o, o), s.strokeThickness / 2),
            n = -s.strokeThickness / 2;
          (e.font = s.toFontString()),
            (e.lineWidth = s.strokeThickness),
            (e.textBaseline = s.textBaseline),
            (e.lineJoin = s.lineJoin),
            (e.miterLimit = s.miterLimit),
            (e.fillStyle = (function (t, e, i, r, n, o) {
              var s = i.fill;
              if (!Array.isArray(s)) return s;
              if (1 === s.length) return s[0];
              var a = i.dropShadow ? i.dropShadowDistance : 0,
                h = i.padding || 0,
                u = Math.ceil(t.width / r) - a - 2 * h,
                l = Math.ceil(t.height / r) - a - 2 * h,
                c = s.slice(),
                d = i.fillGradientStops.slice();
              if (!d.length)
                for (var p = c.length + 1, f = 1; f < p; ++f) d.push(f / p);
              if (
                (c.unshift(s[0]),
                d.unshift(0),
                c.push(s[s.length - 1]),
                d.push(1),
                i.fillGradientType === w.TEXT_GRADIENT.LINEAR_VERTICAL)
              )
                for (
                  var m = e.createLinearGradient(u / 2, h, u / 2, l + h),
                    y = 0,
                    g = (o.fontProperties.fontSize + i.strokeThickness) / l,
                    f = 0;
                  f < n.length;
                  f++
                )
                  for (var v = o.lineHeight * f, _ = 0; _ < c.length; _++) {
                    var x = 0,
                      x = 'number' == typeof d[_] ? d[_] : _ / c.length,
                      x = Math.max(y, v / l + x * g),
                      x = Math.min(x, 1);
                    m.addColorStop(x, c[_]), (y = x);
                  }
              else {
                m = e.createLinearGradient(h, l / 2, u + h, l / 2);
                for (var b = c.length + 1, T = 1, f = 0; f < c.length; f++) {
                  var E = void 0,
                    E = 'number' == typeof d[f] ? d[f] : T / b;
                  m.addColorStop(E, c[f]), T++;
                }
              }
              return m;
            })(t, e, s, o, [h], i)),
            (e.strokeStyle = s.stroke),
            s.dropShadow
              ? ((t = s.dropShadowColor),
                (t = Q.hex2rgb('number' == typeof t ? t : Q.string2hex(t))),
                (a = s.dropShadowBlur * o),
                (o = s.dropShadowDistance * o),
                (e.shadowColor =
                  'rgba(' +
                  255 * t[0] +
                  ',' +
                  255 * t[1] +
                  ',' +
                  255 * t[2] +
                  ',' +
                  s.dropShadowAlpha +
                  ')'),
                (e.shadowBlur = a),
                (e.shadowOffsetX = Math.cos(s.dropShadowAngle) * o),
                (e.shadowOffsetY = Math.sin(s.dropShadowAngle) * o))
              : ((e.shadowColor = 'black'),
                (e.shadowBlur = 0),
                (e.shadowOffsetX = 0),
                (e.shadowOffsetY = 0)),
            s.stroke &&
              s.strokeThickness &&
              e.strokeText(h, r, n + i.lineHeight - u.descent),
            s.fill && e.fillText(h, r, n + i.lineHeight - u.descent),
            e.setTransform(1, 0, 0, 1, 0, 0),
            (e.fillStyle = 'rgba(0, 0, 0, 0)');
        }
        (O.prototype.destroy = function () {
          for (var t in this.chars)
            this.chars[t].texture.destroy(), (this.chars[t].texture = null);
          for (var t in this.pageTextures)
            this._ownsTextures && this.pageTextures[t].destroy(!0),
              (this.pageTextures[t] = null);
          (this.chars = null), (this.pageTextures = null);
        }),
          (O.install = function (t, e, i) {
            var r;
            if (t instanceof P) r = t;
            else {
              var n = m(t);
              if (!n) throw new Error('Unrecognized data format for font.');
              r = n.parse(t);
            }
            n = new O(r, (e = e instanceof $.Texture ? [e] : e), i);
            return (O.available[n.font] = n);
          }),
          (O.uninstall = function (t) {
            var e = O.available[t];
            if (!e) throw new Error("No font found named '" + t + "'");
            e.destroy(), delete O.available[t];
          }),
          (O.from = function (t, e, i) {
            if (!t)
              throw new Error('[BitmapFont] Property `name` is required.');
            for (
              var r,
                n,
                o,
                i = Object.assign({}, O.defaultOptions, i),
                s = i.chars,
                a = i.padding,
                h = i.resolution,
                u = i.textureWidth,
                l = i.textureHeight,
                c = (function (t) {
                  for (
                    var e = [],
                      i = 0,
                      r = (t = 'string' == typeof t ? [t] : t).length;
                    i < r;
                    i++
                  ) {
                    var n = t[i];
                    if (Array.isArray(n)) {
                      if (2 !== n.length)
                        throw new Error(
                          '[BitmapFont]: Invalid character range length, expecting 2 got ' +
                            n.length +
                            '.'
                        );
                      var o = n[0].charCodeAt(0),
                        s = n[1].charCodeAt(0);
                      if (s < o)
                        throw new Error(
                          '[BitmapFont]: Invalid character range.'
                        );
                      for (var a = o, h = s; a <= h; a++)
                        e.push(String.fromCharCode(a));
                    } else e.push.apply(e, n.split(''));
                  }
                  if (0 === e.length)
                    throw new Error(
                      '[BitmapFont]: Empty set when resolving characters.'
                    );
                  return e;
                })(s),
                d = e instanceof w.TextStyle ? e : new w.TextStyle(e),
                p = u,
                f = new P(),
                m =
                  ((f.info[0] = { face: d.fontFamily, size: d.fontSize }),
                  (f.common[0] = { lineHeight: d.fontSize }),
                  0),
                y = 0,
                g = 0,
                v = [],
                _ = 0;
              _ < c.length;
              _++
            ) {
              r ||
                (((r = document.createElement('canvas')).width = u),
                (r.height = l),
                (n = r.getContext('2d')),
                (o = new $.BaseTexture(r, { resolution: h })),
                v.push(new $.Texture(o)),
                f.page.push({ id: v.length - 1, file: '' }));
              var x = w.TextMetrics.measureText(c[_], d, !1, r),
                b = x.width,
                T = Math.ceil(x.height),
                E = Math.ceil(('italic' === d.fontStyle ? 2 : 1) * b);
              if (l - T * h <= y) {
                if (0 === y)
                  throw new Error(
                    '[BitmapFont] textureHeight ' +
                      l +
                      'px is too small for ' +
                      d.fontSize +
                      'px fonts'
                  );
                --_, (o = n = r = null), (g = m = y = 0);
              } else {
                g = Math.max(T + x.fontProperties.descent, g);
                p <= E * h + m
                  ? (--_, (y += g * h), (y = Math.ceil(y)), (g = m = 0))
                  : (S(r, n, x, m, y, h, d),
                    (x = x.text.charCodeAt(0)),
                    f.char.push({
                      id: x,
                      page: v.length - 1,
                      x: m / h,
                      y: y / h,
                      width: E,
                      height: T,
                      xoffset: 0,
                      yoffset: 0,
                      xadvance: Math.ceil(
                        b -
                          (d.dropShadow ? d.dropShadowDistance : 0) -
                          (d.stroke ? d.strokeThickness : 0)
                      ),
                    }),
                    (m += (E + 2 * a) * h),
                    (m = Math.ceil(m)));
              }
            }
            i = new O(f, v, !0);
            return (
              void 0 !== O.available[t] && O.uninstall(t), (O.available[t] = i)
            );
          }),
          (O.ALPHA = [['a', 'z'], ['A', 'Z'], ' ']),
          (O.NUMERIC = [['0', '9']]),
          (O.ALPHANUMERIC = [['a', 'z'], ['A', 'Z'], ['0', '9'], ' ']),
          (O.ASCII = [[' ', '~']]),
          (O.defaultOptions = {
            resolution: 1,
            textureWidth: 512,
            textureHeight: 512,
            padding: 4,
            chars: O.ALPHANUMERIC,
          }),
          (O.available = {});
        var tt = O;
        function O(t, e, i) {
          var r = t.info[0],
            n = t.common[0],
            o = t.page[0],
            s = Q.getResolutionOfUrl(o.file),
            a = {};
          (this._ownsTextures = i),
            (this.font = r.face),
            (this.size = r.size),
            (this.lineHeight = n.lineHeight / s),
            (this.chars = {}),
            (this.pageTextures = a);
          for (var h = 0; h < t.page.length; h++) {
            var u = t.page[h],
              l = u.id,
              u = u.file;
            a[l] = e instanceof Array ? e[h] : e[u];
          }
          for (h = 0; h < t.char.length; h++) {
            var c = t.char[h],
              l = c.id,
              c = c.page,
              d = t.char[h],
              p = d.x,
              f = d.y,
              m = d.width,
              y = d.height,
              g = d.xoffset,
              v = d.yoffset,
              d = d.xadvance,
              p =
                ((p /= s),
                (f /= s),
                (m /= s),
                (y /= s),
                (g /= s),
                (v /= s),
                (d /= s),
                new Z.Rectangle(
                  p + a[c].frame.x / s,
                  f + a[c].frame.y / s,
                  m,
                  y
                ));
            this.chars[l] = {
              xOffset: g,
              yOffset: v,
              xAdvance: d,
              kerning: {},
              texture: new $.Texture(a[c].baseTexture, p),
              page: c,
            };
          }
          for (h = 0; h < t.kerning.length; h++) {
            var _ = t.kerning[h],
              x = _.first,
              b = _.second,
              _ = _.amount;
            (x /= s),
              (b /= s),
              (_ /= s),
              this.chars[b] && (this.chars[b].kerning[x] = _);
          }
        }
        var c,
          d,
          et = [],
          it = [],
          r =
            ((c = r.Container),
            n((d = y), (t = c)),
            (d.prototype =
              null === t
                ? Object.create(t)
                : ((p.prototype = t.prototype), new p())),
            (y.prototype.updateText = function () {
              for (
                var t = tt.available[this._fontName],
                  e = this._fontSize / t.size,
                  i = new Z.Point(),
                  r = [],
                  n = [],
                  o = this._text.replace(/(?:\r\n|\r)/g, '\n') || ' ',
                  F = o.length,
                  B = (this._maxWidth * t.size) / this._fontSize,
                  s = null,
                  a = 0,
                  h = 0,
                  u = 0,
                  l = -1,
                  c = 0,
                  d = 0,
                  p = 0,
                  f = 0;
                f < F;
                f++
              ) {
                var m,
                  y,
                  g = o.charCodeAt(f),
                  v = o.charAt(f);
                /(?:\s)/.test(v) && ((l = f), (c = a)),
                  '\r' === v || '\n' === v
                    ? (n.push(a),
                      (h = Math.max(h, a)),
                      ++u,
                      ++d,
                      (i.x = 0),
                      (i.y += t.lineHeight),
                      (s = null))
                    : (m = t.chars[g]) &&
                      (s && m.kerning[s] && (i.x += m.kerning[s]),
                      ((y = it.pop() || {
                        texture: $.Texture.EMPTY,
                        line: 0,
                        charCode: 0,
                        position: new Z.Point(),
                      }).texture = m.texture),
                      (y.line = u),
                      (y.charCode = g),
                      (y.position.x =
                        i.x + m.xOffset + this._letterSpacing / 2),
                      (y.position.y = i.y + m.yOffset),
                      r.push(y),
                      (i.x += m.xAdvance + this._letterSpacing),
                      (a = i.x),
                      (p = Math.max(p, m.yOffset + m.texture.height)),
                      (s = g),
                      -1 !== l &&
                        0 < B &&
                        i.x > B &&
                        (++d,
                        Q.removeItems(r, 1 + l - d, 1 + f - l),
                        (f = l),
                        (l = -1),
                        n.push(c),
                        (h = Math.max(h, c)),
                        u++,
                        (i.x = 0),
                        (i.y += t.lineHeight),
                        (s = null)));
              }
              for (
                var U = o.charAt(o.length - 1),
                  j =
                    ('\r' !== U &&
                      '\n' !== U &&
                      (/(?:\s)/.test(U) && (a = c),
                      n.push(a),
                      (h = Math.max(h, a))),
                    []),
                  f = 0;
                f <= u;
                f++
              ) {
                var k = 0;
                'right' === this._align
                  ? (k = h - n[f])
                  : 'center' === this._align && (k = (h - n[f]) / 2),
                  j.push(k);
              }
              for (
                var X = r.length,
                  _ = {},
                  x = [],
                  b = this._activePagesMeshData,
                  f = 0;
                f < b.length;
                f++
              )
                et.push(b[f]);
              for (f = 0; f < X; f++) {
                var G,
                  T,
                  E = (P = r[f].texture).baseTexture.uid;
                _[E] ||
                  ((C = et.pop()) ||
                    ((T = new J.MeshGeometry()),
                    (G = new J.MeshMaterial($.Texture.EMPTY)),
                    (C = {
                      index: 0,
                      indexCount: 0,
                      vertexCount: 0,
                      uvsCount: 0,
                      total: 0,
                      mesh: new J.Mesh(T, G),
                      vertices: null,
                      uvs: null,
                      indices: null,
                    })),
                  (C.index = 0),
                  (C.indexCount = 0),
                  (C.vertexCount = 0),
                  (C.uvsCount = 0),
                  (C.total = 0),
                  ((T = this._textureCache)[E] =
                    T[E] || new $.Texture(P.baseTexture)),
                  (C.mesh.texture = T[E]),
                  (C.mesh.tint = this._tint),
                  x.push(C),
                  (_[E] = C)),
                  _[E].total++;
              }
              for (f = 0; f < b.length; f++)
                -1 === x.indexOf(b[f]) && this.removeChild(b[f].mesh);
              for (f = 0; f < x.length; f++)
                x[f].mesh.parent !== this && this.addChild(x[f].mesh);
              for (f in ((this._activePagesMeshData = x), _)) {
                var w = (C = _[f]).total;
                if (
                  !((null == (H = C.indices) ? void 0 : H.length) > 6 * w) ||
                  C.vertices.length < 2 * J.Mesh.BATCHABLE_SIZE
                )
                  (C.vertices = new Float32Array(8 * w)),
                    (C.uvs = new Float32Array(8 * w)),
                    (C.indices = new Uint16Array(6 * w));
                else
                  for (
                    var H = C.total, z = C.vertices, Y = 4 * H * 2;
                    Y < z.length;
                    Y++
                  )
                    z[Y] = 0;
                C.mesh.size = 6 * w;
              }
              for (f = 0; f < X; f++) {
                var P,
                  S = (v = r[f]).position.x + j[v.line],
                  S = (S = this._roundPixels ? Math.round(S) : S) * e,
                  O = v.position.y * e,
                  I = _[(P = v.texture).baseTexture.uid],
                  A = P.frame,
                  M = P._uvs,
                  D = I.index++;
                (I.indices[6 * D + 0] = 0 + 4 * D),
                  (I.indices[6 * D + 1] = 1 + 4 * D),
                  (I.indices[6 * D + 2] = 2 + 4 * D),
                  (I.indices[6 * D + 3] = 0 + 4 * D),
                  (I.indices[6 * D + 4] = 2 + 4 * D),
                  (I.indices[6 * D + 5] = 3 + 4 * D),
                  (I.vertices[8 * D + 0] = S),
                  (I.vertices[8 * D + 1] = O),
                  (I.vertices[8 * D + 2] = S + A.width * e),
                  (I.vertices[8 * D + 3] = O),
                  (I.vertices[8 * D + 4] = S + A.width * e),
                  (I.vertices[8 * D + 5] = O + A.height * e),
                  (I.vertices[8 * D + 6] = S),
                  (I.vertices[8 * D + 7] = O + A.height * e),
                  (I.uvs[8 * D + 0] = M.x0),
                  (I.uvs[8 * D + 1] = M.y0),
                  (I.uvs[8 * D + 2] = M.x1),
                  (I.uvs[8 * D + 3] = M.y1),
                  (I.uvs[8 * D + 4] = M.x2),
                  (I.uvs[8 * D + 5] = M.y2),
                  (I.uvs[8 * D + 6] = M.x3),
                  (I.uvs[8 * D + 7] = M.y3);
              }
              for (f in ((this._textWidth = h * e),
              (this._textHeight = (i.y + t.lineHeight) * e),
              _)) {
                var C = _[f];
                if (0 !== this.anchor.x || 0 !== this.anchor.y)
                  for (
                    var R = 0,
                      L = this._textWidth * this.anchor.x,
                      N = this._textHeight * this.anchor.y,
                      V = 0;
                    V < C.total;
                    V++
                  )
                    (C.vertices[R++] -= L),
                      (C.vertices[R++] -= N),
                      (C.vertices[R++] -= L),
                      (C.vertices[R++] -= N),
                      (C.vertices[R++] -= L),
                      (C.vertices[R++] -= N),
                      (C.vertices[R++] -= L),
                      (C.vertices[R++] -= N);
                this._maxLineHeight = p * e;
                var W = C.mesh.geometry.getBuffer('aVertexPosition'),
                  q = C.mesh.geometry.getBuffer('aTextureCoord'),
                  K = C.mesh.geometry.getIndex();
                (W.data = C.vertices),
                  (q.data = C.uvs),
                  (K.data = C.indices),
                  W.update(),
                  q.update(),
                  K.update();
              }
              for (f = 0; f < r.length; f++) it.push(r[f]);
            }),
            (y.prototype.updateTransform = function () {
              this.validate(), this.containerUpdateTransform();
            }),
            (y.prototype.getLocalBounds = function () {
              return this.validate(), c.prototype.getLocalBounds.call(this);
            }),
            (y.prototype.validate = function () {
              this.dirty && (this.updateText(), (this.dirty = !1));
            }),
            Object.defineProperty(y.prototype, 'tint', {
              get: function () {
                return this._tint;
              },
              set: function (t) {
                if (this._tint !== t) {
                  this._tint = t;
                  for (var e = 0; e < this._activePagesMeshData.length; e++)
                    this._activePagesMeshData[e].mesh.tint = t;
                }
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'align', {
              get: function () {
                return this._align;
              },
              set: function (t) {
                this._align !== t && ((this._align = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'fontName', {
              get: function () {
                return this._fontName;
              },
              set: function (t) {
                if (!tt.available[t])
                  throw new Error('Missing BitmapFont "' + t + '"');
                this._fontName !== t &&
                  ((this._fontName = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'fontSize', {
              get: function () {
                return this._fontSize;
              },
              set: function (t) {
                this._fontSize !== t &&
                  ((this._fontSize = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'anchor', {
              get: function () {
                return this._anchor;
              },
              set: function (t) {
                'number' == typeof t
                  ? this._anchor.set(t)
                  : this._anchor.copyFrom(t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'text', {
              get: function () {
                return this._text;
              },
              set: function (t) {
                (t = String(null == t ? '' : t)),
                  this._text !== t && ((this._text = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'maxWidth', {
              get: function () {
                return this._maxWidth;
              },
              set: function (t) {
                this._maxWidth !== t &&
                  ((this._maxWidth = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'maxLineHeight', {
              get: function () {
                return this.validate(), this._maxLineHeight;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'textWidth', {
              get: function () {
                return this.validate(), this._textWidth;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'letterSpacing', {
              get: function () {
                return this._letterSpacing;
              },
              set: function (t) {
                this._letterSpacing !== t &&
                  ((this._letterSpacing = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'roundPixels', {
              get: function () {
                return this._roundPixels;
              },
              set: function (t) {
                t !== this._roundPixels &&
                  ((this._roundPixels = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(y.prototype, 'textHeight', {
              get: function () {
                return this.validate(), this._textHeight;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (y.prototype._upgradeStyle = function (t) {
              var e;
              'string' == typeof t.font
                ? ((e = t.font.split(' ')),
                  (t.fontName = 1 === e.length ? e[0] : e.slice(1).join(' ')),
                  2 <= e.length && (t.fontSize = parseInt(e[0], 10)))
                : ((t.fontName = t.font.name),
                  (t.fontSize =
                    'number' == typeof t.font.size
                      ? t.font.size
                      : parseInt(t.font.size, 10)));
            }),
            (y.prototype.destroy = function (t) {
              var e,
                i = this._textureCache;
              for (e in i) i[e].destroy(), delete i[e];
              (this._textureCache = null), c.prototype.destroy.call(this, t);
            }),
            (y.registerFont = function (t, e) {
              return (
                Q.deprecation(
                  '5.3.0',
                  'PIXI.BitmapText.registerFont is deprecated, use PIXI.BitmapFont.install'
                ),
                tt.install(t, e)
              );
            }),
            Object.defineProperty(y, 'fonts', {
              get: function () {
                return (
                  Q.deprecation(
                    '5.3.0',
                    'PIXI.BitmapText.fonts is deprecated, use PIXI.BitmapFont.available'
                  ),
                  tt.available
                );
              },
              enumerable: !1,
              configurable: !0,
            }),
            (y.styleDefaults = {
              align: 'left',
              tint: 16777215,
              maxWidth: 0,
              letterSpacing: 0,
            }),
            y);
        function p() {
          this.constructor = d;
        }
        function y(t, e) {
          void 0 === e && (e = {});
          var i = c.call(this) || this,
            e =
              ((i._tint = 16777215),
              e.font &&
                (Q.deprecation(
                  '5.3.0',
                  'PIXI.BitmapText constructor style.font property is deprecated.'
                ),
                i._upgradeStyle(e)),
              Object.assign({}, y.styleDefaults, e)),
            r = e.align,
            n = e.tint,
            o = e.maxWidth,
            s = e.letterSpacing,
            a = e.fontName,
            e = e.fontSize;
          if (tt.available[a])
            return (
              (i._activePagesMeshData = []),
              (i._textWidth = 0),
              (i._textHeight = 0),
              (i._align = r),
              (i._tint = n),
              (i._fontName = a),
              (i._fontSize = e || tt.available[a].size),
              (i._text = t),
              (i._maxWidth = o),
              (i._maxLineHeight = 0),
              (i._letterSpacing = s),
              (i._anchor = new Z.ObservablePoint(
                function () {
                  i.dirty = !0;
                },
                i,
                0,
                0
              )),
              (i._roundPixels = h.settings.ROUND_PIXELS),
              (i.dirty = !0),
              (i._textureCache = {}),
              i
            );
          throw new Error('Missing BitmapFont "' + a + '"');
        }
        (g.add = function () {
          f.LoaderResource.setExtensionXhrType(
            'fnt',
            f.LoaderResource.XHR_RESPONSE_TYPE.TEXT
          );
        }),
          (g.use = function (e, i) {
            var t = m(e.data);
            if (t)
              for (
                var r = g.getBaseUrl(this, e),
                  n = t.parse(e.data),
                  o = {},
                  s = function (t) {
                    (o[t.metadata.pageFile] = t.texture),
                      Object.keys(o).length === n.page.length &&
                        ((e.bitmapFont = tt.install(n, o, !0)), i());
                  },
                  a = 0;
                a < n.page.length;
                ++a
              ) {
                var h,
                  u,
                  l = n.page[a].file,
                  c = r + l,
                  d = !1;
                for (h in this.resources) {
                  var p = this.resources[h];
                  if (p.url === c) {
                    (p.metadata.pageFile = l),
                      p.texture ? s(p) : p.onAfterMiddleware.add(s),
                      (d = !0);
                    break;
                  }
                }
                d ||
                  ((u = {
                    crossOrigin: e.crossOrigin,
                    loadType: f.LoaderResource.LOAD_TYPE.IMAGE,
                    metadata: Object.assign(
                      { pageFile: l },
                      e.metadata.imageMetadata
                    ),
                    parentResource: e,
                  }),
                  this.add(c, u, s));
              }
            else i();
          }),
          (g.getBaseUrl = function (t, e) {
            var i = e.isDataUrl ? '' : g.dirname(e.url);
            return (
              e.isDataUrl &&
                ('.' === i && (i = ''),
                t.baseUrl &&
                  i &&
                  '/' === t.baseUrl.charAt(t.baseUrl.length - 1) &&
                  (i += '/')),
              (i = i.replace(t.baseUrl, '')) &&
                '/' !== i.charAt(i.length - 1) &&
                (i += '/'),
              i
            );
          }),
          (g.dirname = function (t) {
            var e = t
              .replace(/\\/g, '/')
              .replace(/\/$/, '')
              .replace(/\/[^\/]*$/, '');
            return e === t ? '.' : '' === e ? '/' : e;
          });
        t = g;
        function g() {}
        (i.BitmapFont = tt),
          (i.BitmapFontData = P),
          (i.BitmapFontLoader = t),
          (i.BitmapText = r);
      },
      {
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/loaders': 15,
        '@pixi/math': 16,
        '@pixi/mesh': 18,
        '@pixi/settings': 26,
        '@pixi/text': 32,
        '@pixi/utils': 34,
      },
    ],
    32: [
      function (t, e, b) {
        'use strict';
        Object.defineProperty(b, '__esModule', { value: !0 });
        var i = t('@pixi/sprite'),
          s = t('@pixi/core'),
          a = t('@pixi/settings'),
          h = t('@pixi/math'),
          x = t('@pixi/utils'),
          r = function (t, e) {
            return (r =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        (t = b.TEXT_GRADIENT || (b.TEXT_GRADIENT = {}))[
          (t.LINEAR_VERTICAL = 0)
        ] = 'LINEAR_VERTICAL';
        var n = {
            align: 'left',
            breakWords: !(t[(t.LINEAR_HORIZONTAL = 1)] = 'LINEAR_HORIZONTAL'),
            dropShadow: !1,
            dropShadowAlpha: 1,
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 0,
            dropShadowColor: 'black',
            dropShadowDistance: 5,
            fill: 'black',
            fillGradientType: b.TEXT_GRADIENT.LINEAR_VERTICAL,
            fillGradientStops: [],
            fontFamily: 'Arial',
            fontSize: 26,
            fontStyle: 'normal',
            fontVariant: 'normal',
            fontWeight: 'normal',
            letterSpacing: 0,
            lineHeight: 0,
            lineJoin: 'miter',
            miterLimit: 10,
            padding: 0,
            stroke: 'black',
            strokeThickness: 0,
            textBaseline: 'alphabetic',
            trim: !1,
            whiteSpace: 'pre',
            wordWrap: !1,
            wordWrapWidth: 100,
            leading: 0,
          },
          o = [
            'serif',
            'sans-serif',
            'monospace',
            'cursive',
            'fantasy',
            'system-ui',
          ],
          u =
            ((l.prototype.clone = function () {
              var t = {};
              return p(t, this, n), new l(t);
            }),
            (l.prototype.reset = function () {
              p(this, n, n);
            }),
            Object.defineProperty(l.prototype, 'align', {
              get: function () {
                return this._align;
              },
              set: function (t) {
                this._align !== t && ((this._align = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'breakWords', {
              get: function () {
                return this._breakWords;
              },
              set: function (t) {
                this._breakWords !== t &&
                  ((this._breakWords = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'dropShadow', {
              get: function () {
                return this._dropShadow;
              },
              set: function (t) {
                this._dropShadow !== t &&
                  ((this._dropShadow = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'dropShadowAlpha', {
              get: function () {
                return this._dropShadowAlpha;
              },
              set: function (t) {
                this._dropShadowAlpha !== t &&
                  ((this._dropShadowAlpha = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'dropShadowAngle', {
              get: function () {
                return this._dropShadowAngle;
              },
              set: function (t) {
                this._dropShadowAngle !== t &&
                  ((this._dropShadowAngle = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'dropShadowBlur', {
              get: function () {
                return this._dropShadowBlur;
              },
              set: function (t) {
                this._dropShadowBlur !== t &&
                  ((this._dropShadowBlur = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'dropShadowColor', {
              get: function () {
                return this._dropShadowColor;
              },
              set: function (t) {
                t = d(t);
                this._dropShadowColor !== t &&
                  ((this._dropShadowColor = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'dropShadowDistance', {
              get: function () {
                return this._dropShadowDistance;
              },
              set: function (t) {
                this._dropShadowDistance !== t &&
                  ((this._dropShadowDistance = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fill', {
              get: function () {
                return this._fill;
              },
              set: function (t) {
                t = d(t);
                this._fill !== t && ((this._fill = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fillGradientType', {
              get: function () {
                return this._fillGradientType;
              },
              set: function (t) {
                this._fillGradientType !== t &&
                  ((this._fillGradientType = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fillGradientStops', {
              get: function () {
                return this._fillGradientStops;
              },
              set: function (t) {
                !(function (t, e) {
                  if (!Array.isArray(t) || !Array.isArray(e)) return;
                  if (t.length !== e.length) return;
                  for (var i = 0; i < t.length; ++i) if (t[i] !== e[i]) return;
                  return 1;
                })(this._fillGradientStops, t) &&
                  ((this._fillGradientStops = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fontFamily', {
              get: function () {
                return this._fontFamily;
              },
              set: function (t) {
                this.fontFamily !== t &&
                  ((this._fontFamily = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fontSize', {
              get: function () {
                return this._fontSize;
              },
              set: function (t) {
                this._fontSize !== t && ((this._fontSize = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fontStyle', {
              get: function () {
                return this._fontStyle;
              },
              set: function (t) {
                this._fontStyle !== t &&
                  ((this._fontStyle = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fontVariant', {
              get: function () {
                return this._fontVariant;
              },
              set: function (t) {
                this._fontVariant !== t &&
                  ((this._fontVariant = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'fontWeight', {
              get: function () {
                return this._fontWeight;
              },
              set: function (t) {
                this._fontWeight !== t &&
                  ((this._fontWeight = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'letterSpacing', {
              get: function () {
                return this._letterSpacing;
              },
              set: function (t) {
                this._letterSpacing !== t &&
                  ((this._letterSpacing = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'lineHeight', {
              get: function () {
                return this._lineHeight;
              },
              set: function (t) {
                this._lineHeight !== t &&
                  ((this._lineHeight = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'leading', {
              get: function () {
                return this._leading;
              },
              set: function (t) {
                this._leading !== t && ((this._leading = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'lineJoin', {
              get: function () {
                return this._lineJoin;
              },
              set: function (t) {
                this._lineJoin !== t && ((this._lineJoin = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'miterLimit', {
              get: function () {
                return this._miterLimit;
              },
              set: function (t) {
                this._miterLimit !== t &&
                  ((this._miterLimit = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'padding', {
              get: function () {
                return this._padding;
              },
              set: function (t) {
                this._padding !== t && ((this._padding = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'stroke', {
              get: function () {
                return this._stroke;
              },
              set: function (t) {
                t = d(t);
                this._stroke !== t && ((this._stroke = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'strokeThickness', {
              get: function () {
                return this._strokeThickness;
              },
              set: function (t) {
                this._strokeThickness !== t &&
                  ((this._strokeThickness = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'textBaseline', {
              get: function () {
                return this._textBaseline;
              },
              set: function (t) {
                this._textBaseline !== t &&
                  ((this._textBaseline = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'trim', {
              get: function () {
                return this._trim;
              },
              set: function (t) {
                this._trim !== t && ((this._trim = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'whiteSpace', {
              get: function () {
                return this._whiteSpace;
              },
              set: function (t) {
                this._whiteSpace !== t &&
                  ((this._whiteSpace = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'wordWrap', {
              get: function () {
                return this._wordWrap;
              },
              set: function (t) {
                this._wordWrap !== t && ((this._wordWrap = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(l.prototype, 'wordWrapWidth', {
              get: function () {
                return this._wordWrapWidth;
              },
              set: function (t) {
                this._wordWrapWidth !== t &&
                  ((this._wordWrapWidth = t), this.styleID++);
              },
              enumerable: !1,
              configurable: !0,
            }),
            (l.prototype.toFontString = function () {
              for (
                var t =
                    'number' == typeof this.fontSize
                      ? this.fontSize + 'px'
                      : this.fontSize,
                  e = this.fontFamily,
                  i =
                    (e = Array.isArray(this.fontFamily)
                      ? e
                      : this.fontFamily.split(',')).length - 1;
                0 <= i;
                i--
              ) {
                var r = e[i].trim();
                !/([\"\'])[^\'\"]+\1/.test(r) &&
                  o.indexOf(r) < 0 &&
                  (r = '"' + r + '"'),
                  (e[i] = r);
              }
              return (
                this.fontStyle +
                ' ' +
                this.fontVariant +
                ' ' +
                this.fontWeight +
                ' ' +
                t +
                ' ' +
                e.join(',')
              );
            }),
            l);
        function l(t) {
          (this.styleID = 0), this.reset(), p(this, t, t);
        }
        function c(t) {
          return 'number' == typeof t
            ? x.hex2string(t)
            : 'string' == typeof t && 0 === t.indexOf('0x')
            ? t.replace('0x', '#')
            : t;
        }
        function d(t) {
          if (Array.isArray(t)) {
            for (var e = 0; e < t.length; ++e) t[e] = c(t[e]);
            return t;
          }
          return c(t);
        }
        function p(t, e, i) {
          for (var r in i)
            Array.isArray(e[r]) ? (t[r] = e[r].slice()) : (t[r] = e[r]);
        }
        (P.measureText = function (t, e, i, r) {
          void 0 === r && (r = P._canvas), (i = null == i ? e.wordWrap : i);
          var n = e.toFontString(),
            o = P.measureFont(n),
            s =
              (0 === o.fontSize &&
                ((o.fontSize = e.fontSize), (o.ascent = e.fontSize)),
              r.getContext('2d'));
          s.font = n;
          for (
            var a = (i ? P.wordWrap(t, e, r) : t).split(/(?:\r\n|\r|\n)/),
              h = new Array(a.length),
              u = 0,
              l = 0;
            l < a.length;
            l++
          ) {
            var c =
              s.measureText(a[l]).width + (a[l].length - 1) * e.letterSpacing;
            (h[l] = c), (u = Math.max(u, c));
          }
          (n = u + e.strokeThickness),
            e.dropShadow && (n += e.dropShadowDistance),
            (i = e.lineHeight || o.fontSize + e.strokeThickness),
            (r =
              Math.max(i, o.fontSize + e.strokeThickness) +
              (a.length - 1) * (i + e.leading));
          return (
            e.dropShadow && (r += e.dropShadowDistance),
            new P(t, e, n, r, a, h, i + e.leading, u, o)
          );
        }),
          (P.wordWrap = function (t, e, i) {
            for (
              var r = (i = void 0 === i ? P._canvas : i).getContext('2d'),
                n = 0,
                o = '',
                s = '',
                a = Object.create(null),
                h = e.letterSpacing,
                i = e.whiteSpace,
                u = P.collapseSpaces(i),
                l = P.collapseNewlines(i),
                c = !u,
                d = e.wordWrapWidth + h,
                p = P.tokenize(t),
                f = 0;
              f < p.length;
              f++
            ) {
              var m = p[f];
              if (P.isNewline(m)) {
                if (!l) {
                  (s += P.addLine(o)), (c = !u), (o = ''), (n = 0);
                  continue;
                }
                m = ' ';
              }
              if (u) {
                var y = P.isBreakingSpace(m),
                  g = P.isBreakingSpace(o[o.length - 1]);
                if (y && g) continue;
              }
              y = P.getFromCache(m, h, a, r);
              if (d < y)
                if (
                  ('' !== o && ((s += P.addLine(o)), (o = ''), (n = 0)),
                  P.canBreakWords(m, e.breakWords))
                )
                  for (var v = P.wordWrapSplit(m), _ = 0; _ < v.length; _++) {
                    for (var x = v[_], b = 1; v[_ + b]; ) {
                      var T = v[_ + b],
                        E = x[x.length - 1];
                      if (P.canBreakChars(E, T, m, _, e.breakWords)) break;
                      (x += T), b++;
                    }
                    _ += x.length - 1;
                    var w = P.getFromCache(x, h, a, r);
                    d < w + n &&
                      ((s += P.addLine(o)), (c = !1), (o = ''), (n = 0)),
                      (o += x),
                      (n += w);
                  }
                else {
                  0 < o.length && ((s += P.addLine(o)), (o = ''), (n = 0));
                  g = f === p.length - 1;
                  (s += P.addLine(m, !g)), (c = !1), (o = ''), (n = 0);
                }
              else
                d < y + n && ((c = !1), (s += P.addLine(o)), (o = ''), (n = 0)),
                  (0 < o.length || !P.isBreakingSpace(m) || c) &&
                    ((o += m), (n += y));
            }
            return (s += P.addLine(o, !1));
          }),
          (P.addLine = function (t, e) {
            return (
              void 0 === e && (e = !0),
              (t = P.trimRight(t)),
              (t = e ? t + '\n' : t)
            );
          }),
          (P.getFromCache = function (t, e, i, r) {
            var n = i[t];
            return (
              'number' != typeof n &&
                ((e = t.length * e),
                (n = r.measureText(t).width + e),
                (i[t] = n)),
              n
            );
          }),
          (P.collapseSpaces = function (t) {
            return 'normal' === t || 'pre-line' === t;
          }),
          (P.collapseNewlines = function (t) {
            return 'normal' === t;
          }),
          (P.trimRight = function (t) {
            if ('string' != typeof t) return '';
            for (var e = t.length - 1; 0 <= e; e--) {
              var i = t[e];
              if (!P.isBreakingSpace(i)) break;
              t = t.slice(0, -1);
            }
            return t;
          }),
          (P.isNewline = function (t) {
            return (
              'string' == typeof t && 0 <= P._newlines.indexOf(t.charCodeAt(0))
            );
          }),
          (P.isBreakingSpace = function (t) {
            return (
              'string' == typeof t &&
              0 <= P._breakingSpaces.indexOf(t.charCodeAt(0))
            );
          }),
          (P.tokenize = function (t) {
            var e = [],
              i = '';
            if ('string' != typeof t) return e;
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              P.isBreakingSpace(n) || P.isNewline(n)
                ? ('' !== i && (e.push(i), (i = '')), e.push(n))
                : (i += n);
            }
            return '' !== i && e.push(i), e;
          }),
          (P.canBreakWords = function (t, e) {
            return e;
          }),
          (P.canBreakChars = function (t, e, i, r, n) {
            return !0;
          }),
          (P.wordWrapSplit = function (t) {
            return t.split('');
          }),
          (P.measureFont = function (t) {
            if (P._fonts[t]) return P._fonts[t];
            for (
              var e = { ascent: 0, descent: 0, fontSize: 0 },
                i = P._canvas,
                r = P._context,
                n = ((r.font = t), P.METRICS_STRING + P.BASELINE_SYMBOL),
                o = Math.ceil(r.measureText(n).width),
                s = 2 * (a = Math.ceil(r.measureText(P.BASELINE_SYMBOL).width)),
                a = (a * P.BASELINE_MULTIPLIER) | 0,
                h =
                  ((i.width = o),
                  (i.height = s),
                  (r.fillStyle = '#f00'),
                  r.fillRect(0, 0, o, s),
                  (r.font = t),
                  (r.textBaseline = 'alphabetic'),
                  (r.fillStyle = '#000'),
                  r.fillText(n, 0, a),
                  r.getImageData(0, 0, o, s).data),
                i = h.length,
                u = 4 * o,
                l = 0,
                c = 0,
                d = !1,
                l = 0;
              l < a;
              ++l
            ) {
              for (var p = 0; p < u; p += 4)
                if (255 !== h[c + p]) {
                  d = !0;
                  break;
                }
              if (d) break;
              c += u;
            }
            for (e.ascent = a - l, c = i - u, d = !1, l = s; a < l; --l) {
              for (p = 0; p < u; p += 4)
                if (255 !== h[c + p]) {
                  d = !0;
                  break;
                }
              if (d) break;
              c -= u;
            }
            return (
              (e.descent = l - a),
              (e.fontSize = e.ascent + e.descent),
              (P._fonts[t] = e)
            );
          }),
          (P.clearMetrics = function (t) {
            (t = void 0 === t ? '' : t) ? delete P._fonts[t] : (P._fonts = {});
          });
        var T = P;
        function P(t, e, i, r, n, o, s, a, h) {
          (this.text = t),
            (this.style = e),
            (this.width = i),
            (this.height = r),
            (this.lines = n),
            (this.lineWidths = o),
            (this.lineHeight = s),
            (this.maxLineWidth = a),
            (this.fontProperties = h);
        }
        var f,
          m,
          t = (function () {
            try {
              var t = new OffscreenCanvas(0, 0),
                e = t.getContext('2d');
              return e && e.measureText ? t : document.createElement('canvas');
            } catch (t) {
              return document.createElement('canvas');
            }
          })(),
          y =
            ((t.width = t.height = 10),
            (T._canvas = t),
            (T._context = t.getContext('2d')),
            (T._fonts = {}),
            (T.METRICS_STRING = '|ÉqÅ'),
            (T.BASELINE_SYMBOL = 'M'),
            (T.BASELINE_MULTIPLIER = 1.4),
            (T._newlines = [10, 13]),
            {
              texture: !0,
              children: !(T._breakingSpaces = [
                9, 32, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8200, 8201,
                8202, 8287, 12288,
              ]),
              baseTexture: !0,
            }),
          i =
            ((f = i.Sprite),
            r((m = v), (t = f)),
            (m.prototype =
              null === t
                ? Object.create(t)
                : ((g.prototype = t.prototype), new g())),
            (v.prototype.updateText = function (t) {
              var e = this._style;
              if (
                (this.localStyleID !== e.styleID &&
                  ((this.dirty = !0), (this.localStyleID = e.styleID)),
                this.dirty || !t)
              ) {
                this._font = this._style.toFontString();
                for (
                  var i,
                    r,
                    n = this.context,
                    o = T.measureText(
                      this._text || ' ',
                      this._style,
                      this._style.wordWrap,
                      this.canvas
                    ),
                    t = o.width,
                    s = o.height,
                    a = o.lines,
                    h = o.lineHeight,
                    u = o.lineWidths,
                    l = o.maxLineWidth,
                    c = o.fontProperties,
                    d =
                      ((this.canvas.width = Math.ceil(
                        (Math.max(1, t) + 2 * e.padding) * this._resolution
                      )),
                      (this.canvas.height = Math.ceil(
                        (Math.max(1, s) + 2 * e.padding) * this._resolution
                      )),
                      n.scale(this._resolution, this._resolution),
                      n.clearRect(0, 0, this.canvas.width, this.canvas.height),
                      (n.font = this._font),
                      (n.lineWidth = e.strokeThickness),
                      (n.textBaseline = e.textBaseline),
                      (n.lineJoin = e.lineJoin),
                      (n.miterLimit = e.miterLimit),
                      e.dropShadow ? 2 : 1),
                    p = 0;
                  p < d;
                  ++p
                ) {
                  var f,
                    m,
                    y = e.dropShadow && 0 === p,
                    g = y ? Math.ceil(Math.max(1, s) + 2 * e.padding) : 0,
                    v = g * this._resolution;
                  y
                    ? ((n.fillStyle = 'black'),
                      (n.strokeStyle = 'black'),
                      (y = e.dropShadowColor),
                      (y = x.hex2rgb(
                        'number' == typeof y ? y : x.string2hex(y)
                      )),
                      (f = e.dropShadowBlur * this._resolution),
                      (m = e.dropShadowDistance * this._resolution),
                      (n.shadowColor =
                        'rgba(' +
                        255 * y[0] +
                        ',' +
                        255 * y[1] +
                        ',' +
                        255 * y[2] +
                        ',' +
                        e.dropShadowAlpha +
                        ')'),
                      (n.shadowBlur = f),
                      (n.shadowOffsetX = Math.cos(e.dropShadowAngle) * m),
                      (n.shadowOffsetY = Math.sin(e.dropShadowAngle) * m + v))
                    : ((n.fillStyle = this._generateFillStyle(e, a, o)),
                      (n.strokeStyle = e.stroke),
                      (n.shadowColor = 'black'),
                      (n.shadowBlur = 0),
                      (n.shadowOffsetX = 0),
                      (n.shadowOffsetY = 0));
                  for (var _ = 0; _ < a.length; _++)
                    (i = e.strokeThickness / 2),
                      (r = e.strokeThickness / 2 + _ * h + c.ascent),
                      'right' === e.align
                        ? (i += l - u[_])
                        : 'center' === e.align && (i += (l - u[_]) / 2),
                      e.stroke &&
                        e.strokeThickness &&
                        this.drawLetterSpacing(
                          a[_],
                          i + e.padding,
                          r + e.padding - g,
                          !0
                        ),
                      e.fill &&
                        this.drawLetterSpacing(
                          a[_],
                          i + e.padding,
                          r + e.padding - g
                        );
                }
                this.updateTexture();
              }
            }),
            (v.prototype.drawLetterSpacing = function (t, e, i, r) {
              void 0 === r && (r = !1);
              var n = this._style.letterSpacing;
              if (0 === n)
                r
                  ? this.context.strokeText(t, e, i)
                  : this.context.fillText(t, e, i);
              else
                for (
                  var o = e,
                    s = Array.from ? Array.from(t) : t.split(''),
                    a = this.context.measureText(t).width,
                    h = 0;
                  h < s.length;
                  ++h
                ) {
                  var u = s[h];
                  r
                    ? this.context.strokeText(u, o, i)
                    : this.context.fillText(u, o, i),
                    (o +=
                      a -
                      (u = this.context.measureText(t.substring(h + 1)).width) +
                      n),
                    (a = u);
                }
            }),
            (v.prototype.updateTexture = function () {
              var t = this.canvas,
                e =
                  (!this._style.trim ||
                    ((e = x.trimCanvas(t)).data &&
                      ((t.width = e.width),
                      (t.height = e.height),
                      this.context.putImageData(e.data, 0, 0))),
                  this._texture),
                i = this._style,
                i = i.trim ? 0 : i.padding,
                r = e.baseTexture;
              (e.trim.width = e._frame.width =
                Math.ceil(t.width / this._resolution)),
                (e.trim.height = e._frame.height =
                  Math.ceil(t.height / this._resolution)),
                (e.trim.x = -i),
                (e.trim.y = -i),
                (e.orig.width = e._frame.width - 2 * i),
                (e.orig.height = e._frame.height - 2 * i),
                this._onTextureUpdate(),
                r.setRealSize(t.width, t.height, this._resolution),
                this._recursivePostUpdateTransform(),
                (this.dirty = !1);
            }),
            (v.prototype._render = function (t) {
              this._autoResolution &&
                this._resolution !== t.resolution &&
                ((this._resolution = t.resolution), (this.dirty = !0)),
                this.updateText(!0),
                f.prototype._render.call(this, t);
            }),
            (v.prototype.getLocalBounds = function (t) {
              return (
                this.updateText(!0), f.prototype.getLocalBounds.call(this, t)
              );
            }),
            (v.prototype._calculateBounds = function () {
              this.updateText(!0),
                this.calculateVertices(),
                this._bounds.addQuad(this.vertexData);
            }),
            (v.prototype._generateFillStyle = function (t, e, i) {
              var r = t.fill;
              if (!Array.isArray(r)) return r;
              if (1 === r.length) return r[0];
              var n = t.dropShadow ? t.dropShadowDistance : 0,
                o = t.padding || 0,
                s = Math.ceil(this.canvas.width / this._resolution) - n - 2 * o,
                a =
                  Math.ceil(this.canvas.height / this._resolution) - n - 2 * o,
                h = r.slice(),
                u = t.fillGradientStops.slice();
              if (!u.length)
                for (var l = h.length + 1, c = 1; c < l; ++c) u.push(c / l);
              if (
                (h.unshift(r[0]),
                u.unshift(0),
                h.push(r[r.length - 1]),
                u.push(1),
                t.fillGradientType === b.TEXT_GRADIENT.LINEAR_VERTICAL)
              )
                for (
                  var d = this.context.createLinearGradient(
                      s / 2,
                      o,
                      s / 2,
                      a + o
                    ),
                    p = 0,
                    f = (i.fontProperties.fontSize + t.strokeThickness) / a,
                    c = 0;
                  c < e.length;
                  c++
                )
                  for (var m = i.lineHeight * c, y = 0; y < h.length; y++) {
                    var g = 0,
                      g = 'number' == typeof u[y] ? u[y] : y / h.length,
                      g = Math.max(p, m / a + g * f),
                      g = Math.min(g, 1);
                    d.addColorStop(g, h[y]), (p = g);
                  }
              else {
                d = this.context.createLinearGradient(o, a / 2, s + o, a / 2);
                for (var v = h.length + 1, _ = 1, c = 0; c < h.length; c++) {
                  var x = void 0,
                    x = 'number' == typeof u[c] ? u[c] : _ / v;
                  d.addColorStop(x, h[c]), _++;
                }
              }
              return d;
            }),
            (v.prototype.destroy = function (t) {
              'boolean' == typeof t && (t = { children: t }),
                (t = Object.assign({}, y, t)),
                f.prototype.destroy.call(this, t),
                this._ownCanvas && (this.canvas.height = this.canvas.width = 0),
                (this.context = null),
                (this.canvas = null),
                (this._style = null);
            }),
            Object.defineProperty(v.prototype, 'width', {
              get: function () {
                return (
                  this.updateText(!0),
                  Math.abs(this.scale.x) * this._texture.orig.width
                );
              },
              set: function (t) {
                this.updateText(!0);
                var e = x.sign(this.scale.x) || 1;
                (this.scale.x = (e * t) / this._texture.orig.width),
                  (this._width = t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(v.prototype, 'height', {
              get: function () {
                return (
                  this.updateText(!0),
                  Math.abs(this.scale.y) * this._texture.orig.height
                );
              },
              set: function (t) {
                this.updateText(!0);
                var e = x.sign(this.scale.y) || 1;
                (this.scale.y = (e * t) / this._texture.orig.height),
                  (this._height = t);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(v.prototype, 'style', {
              get: function () {
                return this._style;
              },
              set: function (t) {
                (this._style = (t = t || {}) instanceof u ? t : new u(t)),
                  (this.localStyleID = -1),
                  (this.dirty = !0);
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(v.prototype, 'text', {
              get: function () {
                return this._text;
              },
              set: function (t) {
                (t = String(null == t ? '' : t)),
                  this._text !== t && ((this._text = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(v.prototype, 'resolution', {
              get: function () {
                return this._resolution;
              },
              set: function (t) {
                (this._autoResolution = !1),
                  this._resolution !== t &&
                    ((this._resolution = t), (this.dirty = !0));
              },
              enumerable: !1,
              configurable: !0,
            }),
            v);
        function g() {
          this.constructor = m;
        }
        function v(t, e, i) {
          var r = this,
            n = !1,
            o =
              (i || ((i = document.createElement('canvas')), (n = !0)),
              (i.width = 3),
              (i.height = 3),
              s.Texture.from(i));
          return (
            (o.orig = new h.Rectangle()),
            (o.trim = new h.Rectangle()),
            ((r = f.call(this, o) || this)._ownCanvas = n),
            (r.canvas = i),
            (r.context = r.canvas.getContext('2d')),
            (r._resolution = a.settings.RESOLUTION),
            (r._autoResolution = !0),
            (r._text = null),
            (r._style = null),
            (r._styleListener = null),
            (r._font = ''),
            (r.text = t),
            (r.style = e),
            (r.localStyleID = -1),
            r
          );
        }
        (b.Text = i), (b.TextMetrics = T), (b.TextStyle = u);
      },
      {
        '@pixi/core': 4,
        '@pixi/math': 16,
        '@pixi/settings': 26,
        '@pixi/sprite': 29,
        '@pixi/utils': 34,
      },
    ],
    33: [
      function (t, e, r) {
        'use strict';
        Object.defineProperty(r, '__esModule', { value: !0 });
        var n = t('@pixi/settings'),
          o =
            ((n.settings.TARGET_FPMS = 0.06),
            ((t = r.UPDATE_PRIORITY || (r.UPDATE_PRIORITY = {}))[
              (t.INTERACTION = 50)
            ] = 'INTERACTION'),
            (t[(t.HIGH = 25)] = 'HIGH'),
            (t[(t.NORMAL = 0)] = 'NORMAL'),
            (t[(t.LOW = -25)] = 'LOW'),
            (t[(t.UTILITY = -50)] = 'UTILITY'),
            (i.prototype.match = function (t, e) {
              return (
                void 0 === e && (e = null), this.fn === t && this.context === e
              );
            }),
            (i.prototype.emit = function (t) {
              this.fn &&
                (this.context ? this.fn.call(this.context, t) : this.fn(t));
              t = this.next;
              return (
                this.once && this.destroy(!0),
                this._destroyed && (this.next = null),
                t
              );
            }),
            (i.prototype.connect = function (t) {
              (this.previous = t).next && (t.next.previous = this),
                (this.next = t.next),
                (t.next = this);
            }),
            (i.prototype.destroy = function (t) {
              void 0 === t && (t = !1),
                (this._destroyed = !0),
                (this.fn = null),
                (this.context = null),
                this.previous && (this.previous.next = this.next),
                this.next && (this.next.previous = this.previous);
              var e = this.next;
              return (this.next = t ? null : e), (this.previous = null), e;
            }),
            i);
        function i(t, e, i, r) {
          void 0 === e && (e = null),
            void 0 === i && (i = 0),
            void 0 === r && (r = !1),
            (this.fn = t),
            (this.context = e),
            (this.priority = i),
            (this.once = r),
            (this.next = null),
            (this.previous = null),
            (this._destroyed = !1);
        }
        (a.prototype._requestIfNeeded = function () {
          null === this._requestId &&
            this._head.next &&
            ((this.lastTime = performance.now()),
            (this._lastFrame = this.lastTime),
            (this._requestId = requestAnimationFrame(this._tick)));
        }),
          (a.prototype._cancelIfNeeded = function () {
            null !== this._requestId &&
              (cancelAnimationFrame(this._requestId), (this._requestId = null));
          }),
          (a.prototype._startIfPossible = function () {
            this.started
              ? this._requestIfNeeded()
              : this.autoStart && this.start();
          }),
          (a.prototype.add = function (t, e, i) {
            return (
              void 0 === i && (i = r.UPDATE_PRIORITY.NORMAL),
              this._addListener(new o(t, e, i))
            );
          }),
          (a.prototype.addOnce = function (t, e, i) {
            return (
              void 0 === i && (i = r.UPDATE_PRIORITY.NORMAL),
              this._addListener(new o(t, e, i, !0))
            );
          }),
          (a.prototype._addListener = function (t) {
            var e = this._head.next,
              i = this._head;
            if (e) {
              for (; e; ) {
                if (t.priority > e.priority) {
                  t.connect(i);
                  break;
                }
                e = (i = e).next;
              }
              t.previous || t.connect(i);
            } else t.connect(i);
            return this._startIfPossible(), this;
          }),
          (a.prototype.remove = function (t, e) {
            for (var i = this._head.next; i; )
              i = i.match(t, e) ? i.destroy() : i.next;
            return this._head.next || this._cancelIfNeeded(), this;
          }),
          Object.defineProperty(a.prototype, 'count', {
            get: function () {
              if (!this._head) return 0;
              for (var t = 0, e = this._head; (e = e.next); ) t++;
              return t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (a.prototype.start = function () {
            this.started || ((this.started = !0), this._requestIfNeeded());
          }),
          (a.prototype.stop = function () {
            this.started && ((this.started = !1), this._cancelIfNeeded());
          }),
          (a.prototype.destroy = function () {
            if (!this._protected) {
              this.stop();
              for (var t = this._head.next; t; ) t = t.destroy(!0);
              this._head.destroy(), (this._head = null);
            }
          }),
          (a.prototype.update = function (t) {
            var e;
            if ((t = void 0 === t ? performance.now() : t) > this.lastTime) {
              if (
                ((e = this.elapsedMS = t - this.lastTime) >
                  this._maxElapsedMS && (e = this._maxElapsedMS),
                (e *= this.speed),
                this._minElapsedMS)
              ) {
                var i = (t - this._lastFrame) | 0;
                if (i < this._minElapsedMS) return;
                this._lastFrame = t - (i % this._minElapsedMS);
              }
              (this.deltaMS = e),
                (this.deltaTime = this.deltaMS * n.settings.TARGET_FPMS);
              for (var i = this._head, r = i.next; r; )
                r = r.emit(this.deltaTime);
              i.next || this._cancelIfNeeded();
            } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
            this.lastTime = t;
          }),
          Object.defineProperty(a.prototype, 'FPS', {
            get: function () {
              return 1e3 / this.elapsedMS;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(a.prototype, 'minFPS', {
            get: function () {
              return 1e3 / this._maxElapsedMS;
            },
            set: function (t) {
              (t = Math.min(this.maxFPS, t)),
                (t = Math.min(Math.max(0, t) / 1e3, n.settings.TARGET_FPMS));
              this._maxElapsedMS = 1 / t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(a.prototype, 'maxFPS', {
            get: function () {
              return this._minElapsedMS
                ? Math.round(1e3 / this._minElapsedMS)
                : 0;
            },
            set: function (t) {
              0 === t
                ? (this._minElapsedMS = 0)
                : ((t = Math.max(this.minFPS, t)),
                  (this._minElapsedMS = 1 / (t / 1e3)));
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(a, 'shared', {
            get: function () {
              var t;
              return (
                a._shared ||
                  (((t = a._shared = new a()).autoStart = !0),
                  (t._protected = !0)),
                a._shared
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(a, 'system', {
            get: function () {
              var t;
              return (
                a._system ||
                  (((t = a._system = new a()).autoStart = !0),
                  (t._protected = !0)),
                a._system
              );
            },
            enumerable: !1,
            configurable: !0,
          });
        var s = a;
        function a() {
          var e = this;
          (this._head = new o(null, null, 1 / 0)),
            (this._requestId = null),
            (this._maxElapsedMS = 100),
            (this._minElapsedMS = 0),
            (this.autoStart = !1),
            (this.deltaTime = 1),
            (this.deltaMS = 1 / n.settings.TARGET_FPMS),
            (this.elapsedMS = 1 / n.settings.TARGET_FPMS),
            (this.lastTime = -1),
            (this.speed = 1),
            (this.started = !1),
            (this._protected = !1),
            (this._lastFrame = -1),
            (this._tick = function (t) {
              (e._requestId = null),
                e.started &&
                  (e.update(t),
                  e.started &&
                    null === e._requestId &&
                    e._head.next &&
                    (e._requestId = requestAnimationFrame(e._tick)));
            });
        }
        (h.init = function (t) {
          var e = this;
          (t = Object.assign({ autoStart: !0, sharedTicker: !1 }, t)),
            Object.defineProperty(this, 'ticker', {
              set: function (t) {
                this._ticker && this._ticker.remove(this.render, this),
                  (this._ticker = t) &&
                    t.add(this.render, this, r.UPDATE_PRIORITY.LOW);
              },
              get: function () {
                return this._ticker;
              },
            }),
            (this.stop = function () {
              e._ticker.stop();
            }),
            (this.start = function () {
              e._ticker.start();
            }),
            (this._ticker = null),
            (this.ticker = t.sharedTicker ? s.shared : new s()),
            t.autoStart && this.start();
        }),
          (h.destroy = function () {
            var t;
            this._ticker &&
              ((t = this._ticker), (this.ticker = null), t.destroy());
          });
        t = h;
        function h() {}
        (r.Ticker = s), (r.TickerPlugin = t);
      },
      { '@pixi/settings': 26 },
    ],
    34: [
      function (t, e, i) {
        'use strict';
        function r(t) {
          return t && 'object' == typeof t && 'default' in t ? t.default : t;
        }
        Object.defineProperty(i, '__esModule', { value: !0 });
        var n,
          o = t('@pixi/settings'),
          s = r(t('eventemitter3')),
          a = r(t('earcut')),
          h = t('url'),
          u = r(h),
          l = t('@pixi/constants'),
          c =
            ((o.settings.RETINA_PREFIX = /@([0-9\.]+)x/),
            !(o.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !0));
        var d = (function () {
          for (var t = [], e = [], i = 0; i < 32; i++) e[(t[i] = i)] = i;
          (t[l.BLEND_MODES.NORMAL_NPM] = l.BLEND_MODES.NORMAL),
            (t[l.BLEND_MODES.ADD_NPM] = l.BLEND_MODES.ADD),
            (t[l.BLEND_MODES.SCREEN_NPM] = l.BLEND_MODES.SCREEN),
            (e[l.BLEND_MODES.NORMAL] = l.BLEND_MODES.NORMAL_NPM),
            (e[l.BLEND_MODES.ADD] = l.BLEND_MODES.ADD_NPM),
            (e[l.BLEND_MODES.SCREEN] = l.BLEND_MODES.SCREEN_NPM);
          var r = [];
          return r.push(e), r.push(t), r;
        })();
        function p(t) {
          if (4 === t.BYTES_PER_ELEMENT)
            return t instanceof Float32Array
              ? 'Float32Array'
              : t instanceof Uint32Array
              ? 'Uint32Array'
              : 'Int32Array';
          if (2 === t.BYTES_PER_ELEMENT) {
            if (t instanceof Uint16Array) return 'Uint16Array';
          } else if (1 === t.BYTES_PER_ELEMENT && t instanceof Uint8Array)
            return 'Uint8Array';
          return null;
        }
        var f = {
          Float32Array: Float32Array,
          Uint32Array: Uint32Array,
          Int32Array: Int32Array,
          Uint8Array: Uint8Array,
        };
        var m = 0;
        var y = {};
        var g = Object.create(null),
          v = Object.create(null);
        (_.prototype.clear = function () {
          this.context.setTransform(1, 0, 0, 1, 0, 0),
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }),
          (_.prototype.resize = function (t, e) {
            (this.canvas.width = t * this.resolution),
              (this.canvas.height = e * this.resolution);
          }),
          (_.prototype.destroy = function () {
            (this.context = null), (this.canvas = null);
          }),
          Object.defineProperty(_.prototype, 'width', {
            get: function () {
              return this.canvas.width;
            },
            set: function (t) {
              this.canvas.width = t;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(_.prototype, 'height', {
            get: function () {
              return this.canvas.height;
            },
            set: function (t) {
              this.canvas.height = t;
            },
            enumerable: !1,
            configurable: !0,
          });
        t = _;
        function _(t, e, i) {
          (this.canvas = document.createElement('canvas')),
            (this.context = this.canvas.getContext('2d')),
            (this.resolution = i || o.settings.RESOLUTION),
            this.resize(t, e);
        }
        var x,
          b =
            /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;
        Object.defineProperty(i, 'isMobile', {
          enumerable: !0,
          get: function () {
            return o.isMobile;
          },
        }),
          (i.EventEmitter = s),
          (i.earcut = a),
          (i.url = u),
          (i.BaseTextureCache = v),
          (i.CanvasRenderTarget = t),
          (i.DATA_URI = b),
          (i.ProgramCache = {}),
          (i.TextureCache = g),
          (i.clearTextureCache = function () {
            for (var t in g) delete g[t];
            for (t in v) delete v[t];
          }),
          (i.correctBlendMode = function (t, e) {
            return d[e ? 1 : 0][t];
          }),
          (i.createIndicesForQuads = function (t, e) {
            var i = 6 * t;
            if (
              (e = (e = void 0 === e ? null : e) || new Uint16Array(i))
                .length !== i
            )
              throw new Error(
                'Out buffer length is incorrect, got ' +
                  e.length +
                  ' and expected ' +
                  i
              );
            for (var r = 0, n = 0; r < i; r += 6, n += 4)
              (e[r + 0] = n + 0),
                (e[r + 1] = n + 1),
                (e[r + 2] = n + 2),
                (e[r + 3] = n + 0),
                (e[r + 4] = n + 2),
                (e[r + 5] = n + 3);
            return e;
          }),
          (i.decomposeDataUri = function (t) {
            if ((t = b.exec(t)))
              return {
                mediaType: t[1] ? t[1].toLowerCase() : void 0,
                subType: t[2] ? t[2].toLowerCase() : void 0,
                charset: t[3] ? t[3].toLowerCase() : void 0,
                encoding: t[4] ? t[4].toLowerCase() : void 0,
                data: t[5],
              };
          }),
          (i.deprecation = function (t, e, i) {
            var r;
            void 0 === i && (i = 3),
              y[e] ||
                (void 0 === (r = new Error().stack)
                  ? console.warn(
                      'PixiJS Deprecation Warning: ',
                      e + '\nDeprecated since v' + t
                    )
                  : ((r = r.split('\n').splice(i).join('\n')),
                    console.groupCollapsed
                      ? (console.groupCollapsed(
                          '%cPixiJS Deprecation Warning: %c%s',
                          'color:#614108;background:#fffbe6',
                          'font-weight:normal;color:#614108;background:#fffbe6',
                          e + '\nDeprecated since v' + t
                        ),
                        console.warn(r),
                        console.groupEnd())
                      : (console.warn(
                          'PixiJS Deprecation Warning: ',
                          e + '\nDeprecated since v' + t
                        ),
                        console.warn(r))),
                (y[e] = !0));
          }),
          (i.destroyTextureCache = function () {
            for (var t in g) g[t].destroy();
            for (t in v) v[t].destroy();
          }),
          (i.determineCrossOrigin = function (t, e) {
            if (
              (void 0 === e && (e = window.location), 0 === t.indexOf('data:'))
            )
              return '';
            (e = e || window.location),
              ((x = x || document.createElement('a')).href = t);
            var i =
              (!(t = h.parse(x.href)).port && '' === e.port) ||
              t.port === e.port;
            return t.hostname === e.hostname && i && t.protocol === e.protocol
              ? ''
              : 'anonymous';
          }),
          (i.getBufferType = p),
          (i.getResolutionOfUrl = function (t, e) {
            return (t = o.settings.RETINA_PREFIX.exec(t))
              ? parseFloat(t[1])
              : void 0 !== e
              ? e
              : 1;
          }),
          (i.hex2rgb = function (t, e) {
            return (
              ((e = void 0 === e ? [] : e)[0] = ((t >> 16) & 255) / 255),
              (e[1] = ((t >> 8) & 255) / 255),
              (e[2] = (255 & t) / 255),
              e
            );
          }),
          (i.hex2string = function (t) {
            return (
              (t = t.toString(16)), '#' + ('000000'.substr(0, 6 - t.length) + t)
            );
          }),
          (i.interleaveTypedArrays = function (t, e) {
            for (var i = 0, r = 0, n = {}, o = 0; o < t.length; o++)
              (r += e[o]), (i += t[o].length);
            for (
              var s = new ArrayBuffer(4 * i), a = null, h = 0, o = 0;
              o < t.length;
              o++
            ) {
              var u = e[o],
                l = t[o],
                c = p(l);
              n[c] || (n[c] = new f[c](s));
              for (var a = n[c], d = 0; d < l.length; d++)
                a[((d / u) | 0) * r + h + (d % u)] = l[d];
              h += u;
            }
            return new Float32Array(s);
          }),
          (i.isPow2 = function (t) {
            return !(t & (t - 1) || !t);
          }),
          (i.isWebGLSupported = function () {
            return (n =
              void 0 === n
                ? (function () {
                    var t = {
                      stencil: !0,
                      failIfMajorPerformanceCaveat:
                        o.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT,
                    };
                    try {
                      if (!window.WebGLRenderingContext) return !1;
                      var e,
                        i = document.createElement('canvas'),
                        r =
                          i.getContext('webgl', t) ||
                          i.getContext('experimental-webgl', t),
                        n = !(!r || !r.getContextAttributes().stencil);
                      return (
                        r &&
                          (e = r.getExtension('WEBGL_lose_context')) &&
                          e.loseContext(),
                        (r = null),
                        n
                      );
                    } catch (t) {
                      return !1;
                    }
                  })()
                : n);
          }),
          (i.log2 = function (t) {
            var e = (65535 < t ? 1 : 0) << 4,
              i = (255 < (t >>>= e) ? 1 : 0) << 3;
            return (
              (e |= i) |
              (i = (15 < (t >>>= i) ? 1 : 0) << 2) |
              (i = (3 < (t >>>= i) ? 1 : 0) << 1) |
              ((t >>>= i) >> 1)
            );
          }),
          (i.nextPow2 = function (t) {
            return (
              (t += 0 === t ? 1 : 0),
              --t,
              (t =
                (t =
                  (t = (t = (t |= t >>> 1) | (t >>> 2)) | (t >>> 4)) |
                  (t >>> 8)) |
                (t >>> 16)) + 1
            );
          }),
          (i.premultiplyBlendMode = d),
          (i.premultiplyRgba = function (t, e, i, r) {
            return (
              (i = i || new Float32Array(4)),
              r || void 0 === r
                ? ((i[0] = t[0] * e), (i[1] = t[1] * e), (i[2] = t[2] * e))
                : ((i[0] = t[0]), (i[1] = t[1]), (i[2] = t[2])),
              (i[3] = e),
              i
            );
          }),
          (i.premultiplyTint = function (t, e) {
            return 1 === e
              ? ((255 * e) << 24) + t
              : 0 === e
              ? 0
              : ((255 * e) << 24) +
                (((((t >> 16) & 255) * e + 0.5) | 0) << 16) +
                (((((t >> 8) & 255) * e + 0.5) | 0) << 8) +
                (((255 & t) * e + 0.5) | 0);
          }),
          (i.premultiplyTintToRgba = function (t, e, i, r) {
            return (
              ((i = i || new Float32Array(4))[0] = ((t >> 16) & 255) / 255),
              (i[1] = ((t >> 8) & 255) / 255),
              (i[2] = (255 & t) / 255),
              (!r && void 0 !== r) || ((i[0] *= e), (i[1] *= e), (i[2] *= e)),
              (i[3] = e),
              i
            );
          }),
          (i.removeItems = function (t, e, i) {
            var r = t.length;
            if (!(r <= e || 0 === i)) {
              for (var n = r - (i = r < e + i ? r - e : i), o = e; o < n; ++o)
                t[o] = t[o + i];
              t.length = n;
            }
          }),
          (i.rgb2hex = function (t) {
            return (
              ((255 * t[0]) << 16) + ((255 * t[1]) << 8) + ((255 * t[2]) | 0)
            );
          }),
          (i.sayHello = function (t) {
            var e;
            c ||
              (-1 < navigator.userAgent.toLowerCase().indexOf('chrome')
                ? (e = window.console).log.apply(e, [
                    '\n %c %c %c PixiJS 5.3.12 - ✰ ' +
                      t +
                      ' ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n',
                    'background: #ff66a5; padding:5px 0;',
                    'background: #ff66a5; padding:5px 0;',
                    'color: #ff66a5; background: #030307; padding:5px 0;',
                    'background: #ff66a5; padding:5px 0;',
                    'background: #ffc3dc; padding:5px 0;',
                    'background: #ff66a5; padding:5px 0;',
                    'color: #ff2424; background: #fff; padding:5px 0;',
                    'color: #ff2424; background: #fff; padding:5px 0;',
                    'color: #ff2424; background: #fff; padding:5px 0;',
                  ])
                : window.console &&
                  window.console.log(
                    'PixiJS 5.3.12 - ' + t + ' - http://www.pixijs.com/'
                  ),
              (c = !0));
          }),
          (i.sign = function (t) {
            return 0 === t ? 0 : t < 0 ? -1 : 1;
          }),
          (i.skipHello = function () {
            c = !0;
          }),
          (i.string2hex = function (t) {
            return (
              'string' == typeof t && '#' === t[0] && (t = t.substr(1)),
              parseInt(t, 16)
            );
          }),
          (i.trimCanvas = function (t) {
            for (
              var e,
                i,
                r = t.width,
                n = t.height,
                o = (t = t.getContext('2d')).getImageData(0, 0, r, n).data,
                s = o.length,
                a = { top: null, left: null, right: null, bottom: null },
                h = null,
                u = 0;
              u < s;
              u += 4
            )
              0 !== o[u + 3] &&
                ((e = (u / 4) % r),
                (i = ~~(u / 4 / r)),
                null === a.top && (a.top = i),
                (null === a.left || e < a.left) && (a.left = e),
                (null === a.right || a.right < e) && (a.right = 1 + e),
                (null === a.bottom || a.bottom < i) && (a.bottom = i));
            return (
              null !== a.top &&
                ((r = a.right - a.left),
                (n = a.bottom - a.top + 1),
                (h = t.getImageData(a.left, a.top, r, n))),
              { height: n, width: r, data: h }
            );
          }),
          (i.uid = function () {
            return ++m;
          });
      },
      {
        '@pixi/constants': 3,
        '@pixi/settings': 26,
        earcut: 35,
        eventemitter3: 37,
        url: 51,
      },
    ],
    35: [
      function (t, e, i) {
        'use strict';
        function r(t, e, i) {
          i = i || 2;
          var r,
            n,
            o,
            s,
            a,
            h = e && e.length,
            u = h ? e[0] * i : t.length,
            l = m(t, 0, u, i, !0),
            c = [];
          if (!l || l.next === l.prev) return c;
          if (
            (h &&
              (l = (function (t, e, i, r) {
                var n,
                  o,
                  s,
                  a,
                  h = [];
                for (n = 0, o = e.length; n < o; n++)
                  (a = e[n] * r),
                    (s = n < o - 1 ? e[n + 1] * r : t.length),
                    (a = m(t, a, s, r, !1)) === a.next && (a.steiner = !0),
                    h.push(
                      (function (t) {
                        var e = t,
                          i = t;
                        for (
                          ;
                          (e.x < i.x || (e.x === i.x && e.y < i.y)) && (i = e),
                            (e = e.next),
                            e !== t;

                        );
                        return i;
                      })(a)
                    );
                for (h.sort(y), n = 0; n < h.length; n++)
                  (i = (function (t, e) {
                    var i = (function (t, e) {
                      var i,
                        r = e,
                        n = t.x,
                        o = t.y,
                        s = -1 / 0;
                      do {
                        if (o <= r.y && o >= r.next.y && r.next.y !== r.y) {
                          var a =
                            r.x +
                            ((o - r.y) * (r.next.x - r.x)) / (r.next.y - r.y);
                          if (a <= n && s < a) {
                            if ((s = a) === n) {
                              if (o === r.y) return r;
                              if (o === r.next.y) return r.next;
                            }
                            i = r.x < r.next.x ? r : r.next;
                          }
                        }
                      } while (((r = r.next), r !== e));
                      if (!i) return null;
                      if (n === s) return i;
                      var h,
                        u = i,
                        l = i.x,
                        c = i.y,
                        d = 1 / 0;
                      r = i;
                      for (
                        ;
                        n >= r.x &&
                          r.x >= l &&
                          n !== r.x &&
                          I(
                            o < c ? n : s,
                            o,
                            l,
                            c,
                            o < c ? s : n,
                            o,
                            r.x,
                            r.y
                          ) &&
                          ((h = Math.abs(o - r.y) / (n - r.x)),
                          C(r, t) &&
                            (h < d ||
                              (h === d &&
                                (r.x > i.x ||
                                  (r.x === i.x &&
                                    (function (t, e) {
                                      return (
                                        A(t.prev, t, e.prev) < 0 &&
                                        A(e.next, t, t.next) < 0
                                      );
                                    })(i, r))))) &&
                            ((i = r), (d = h))),
                          (r = r.next),
                          r !== u;

                      );
                      return i;
                    })(t, e);
                    if (!i) return e;
                    var t = R(i, t),
                      r = P(i, i.next);
                    return P(t, t.next), e === i ? r : e;
                  })(h[n], i)),
                    (i = P(i, i.next));
                return i;
              })(t, e, l, i)),
            t.length > 80 * i)
          ) {
            for (var d = (r = t[0]), p = (n = t[1]), f = i; f < u; f += i)
              (o = t[f]) < d && (d = o),
                (s = t[f + 1]) < p && (p = s),
                r < o && (r = o),
                n < s && (n = s);
            a = 0 !== (a = Math.max(r - d, n - p)) ? 1 / a : 0;
          }
          return S(l, c, i, d, p, a), c;
        }
        function m(t, e, i, r, n) {
          var o, s;
          if (n === 0 < g(t, e, i, r))
            for (o = e; o < i; o += r) s = a(o, t[o], t[o + 1], s);
          else for (o = i - r; e <= o; o -= r) s = a(o, t[o], t[o + 1], s);
          return s && M(s, s.next) && (L(s), (s = s.next)), s;
        }
        function P(t, e) {
          if (!t) return t;
          e = e || t;
          var i,
            r = t;
          do {
            if (
              ((i = !1),
              r.steiner || (!M(r, r.next) && 0 !== A(r.prev, r, r.next)))
            )
              r = r.next;
            else {
              if ((L(r), (r = e = r.prev) === r.next)) break;
              i = !0;
            }
          } while (i || r !== e);
          return e;
        }
        function S(t, e, i, r, n, o, s) {
          if (t) {
            if (!s && o) {
              for (
                var a = t, h = r, u = n, l = o, c = a;
                null === c.z && (c.z = O(c.x, c.y, h, u, l)),
                  (c.prevZ = c.prev),
                  (c.nextZ = c.next),
                  (c = c.next) !== a;

              );
              (c.prevZ.nextZ = null), (c.prevZ = null);
              var d,
                p,
                f,
                m,
                y,
                g,
                v,
                _,
                x = c,
                b = 1;
              do {
                for (p = x, y = x = null, g = 0; p; ) {
                  for (
                    g++, f = p, d = v = 0;
                    d < b && (v++, (f = f.nextZ));
                    d++
                  );
                  for (_ = b; 0 < v || (0 < _ && f); )
                    0 !== v && (0 === _ || !f || p.z <= f.z)
                      ? ((p = (m = p).nextZ), v--)
                      : ((f = (m = f).nextZ), _--),
                      y ? (y.nextZ = m) : (x = m),
                      (m.prevZ = y),
                      (y = m);
                  p = f;
                }
              } while (((y.nextZ = null), (b *= 2), 1 < g));
            }
            for (var T, E, w = t; t.prev !== t.next; )
              if (
                ((T = t.prev),
                (E = t.next),
                o
                  ? (function (t, e, i, r) {
                      var n = t.prev,
                        o = t,
                        s = t.next;
                      if (0 <= A(n, o, s)) return;
                      var a = (
                          n.x < o.x ? (n.x < s.x ? n : s) : o.x < s.x ? o : s
                        ).x,
                        h = (
                          n.y < o.y ? (n.y < s.y ? n : s) : o.y < s.y ? o : s
                        ).y,
                        u = (
                          n.x > o.x ? (n.x > s.x ? n : s) : o.x > s.x ? o : s
                        ).x,
                        l = (
                          n.y > o.y ? (n.y > s.y ? n : s) : o.y > s.y ? o : s
                        ).y,
                        c = O(a, h, e, i, r),
                        d = O(u, l, e, i, r),
                        p = t.prevZ,
                        f = t.nextZ;
                      for (; p && p.z >= c && f && f.z <= d; ) {
                        if (
                          p !== t.prev &&
                          p !== t.next &&
                          I(n.x, n.y, o.x, o.y, s.x, s.y, p.x, p.y) &&
                          0 <= A(p.prev, p, p.next)
                        )
                          return;
                        if (
                          ((p = p.prevZ),
                          f !== t.prev &&
                            f !== t.next &&
                            I(n.x, n.y, o.x, o.y, s.x, s.y, f.x, f.y) &&
                            0 <= A(f.prev, f, f.next))
                        )
                          return;
                        f = f.nextZ;
                      }
                      for (; p && p.z >= c; ) {
                        if (
                          p !== t.prev &&
                          p !== t.next &&
                          I(n.x, n.y, o.x, o.y, s.x, s.y, p.x, p.y) &&
                          0 <= A(p.prev, p, p.next)
                        )
                          return;
                        p = p.prevZ;
                      }
                      for (; f && f.z <= d; ) {
                        if (
                          f !== t.prev &&
                          f !== t.next &&
                          I(n.x, n.y, o.x, o.y, s.x, s.y, f.x, f.y) &&
                          0 <= A(f.prev, f, f.next)
                        )
                          return;
                        f = f.nextZ;
                      }
                      return 1;
                    })(t, r, n, o)
                  : (function (t) {
                      var e = t.prev,
                        i = t,
                        r = t.next;
                      if (0 <= A(e, i, r)) return;
                      var n = t.next.next;
                      for (; n !== t.prev; ) {
                        if (
                          I(e.x, e.y, i.x, i.y, r.x, r.y, n.x, n.y) &&
                          0 <= A(n.prev, n, n.next)
                        )
                          return;
                        n = n.next;
                      }
                      return 1;
                    })(t))
              )
                e.push(T.i / i),
                  e.push(t.i / i),
                  e.push(E.i / i),
                  L(t),
                  (t = E.next),
                  (w = E.next);
              else if ((t = E) === w) {
                s
                  ? 1 === s
                    ? S(
                        (t = (function (t, e, i) {
                          var r = t;
                          do {
                            var n = r.prev,
                              o = r.next.next;
                          } while (
                            (!M(n, o) &&
                              D(n, r, r.next, o) &&
                              C(n, o) &&
                              C(o, n) &&
                              (e.push(n.i / i),
                              e.push(r.i / i),
                              e.push(o.i / i),
                              L(r),
                              L(r.next),
                              (r = t = o)),
                            (r = r.next),
                            r !== t)
                          );
                          return P(r);
                        })(P(t), e, i)),
                        e,
                        i,
                        r,
                        n,
                        o,
                        2
                      )
                    : 2 === s &&
                      (function (t, e, i, r, n, o) {
                        var s = t;
                        do {
                          for (var a, h = s.next.next; h !== s.prev; ) {
                            if (
                              s.i !== h.i &&
                              (function (t, e) {
                                return (
                                  t.next.i !== e.i &&
                                  t.prev.i !== e.i &&
                                  !(function (t, e) {
                                    var i = t;
                                    do {
                                      if (
                                        i.i !== t.i &&
                                        i.next.i !== t.i &&
                                        i.i !== e.i &&
                                        i.next.i !== e.i &&
                                        D(i, i.next, t, e)
                                      )
                                        return 1;
                                    } while (((i = i.next), i !== t));
                                    return;
                                  })(t, e) &&
                                  ((C(t, e) &&
                                    C(e, t) &&
                                    (function (t, e) {
                                      var i = t,
                                        r = !1,
                                        n = (t.x + e.x) / 2,
                                        o = (t.y + e.y) / 2;
                                      for (
                                        ;
                                        i.y > o != i.next.y > o &&
                                          i.next.y !== i.y &&
                                          n <
                                            ((i.next.x - i.x) * (o - i.y)) /
                                              (i.next.y - i.y) +
                                              i.x &&
                                          (r = !r),
                                          (i = i.next),
                                          i !== t;

                                      );
                                      return r;
                                    })(t, e) &&
                                    (A(t.prev, t, e.prev) ||
                                      A(t, e.prev, e))) ||
                                    (M(t, e) &&
                                      0 < A(t.prev, t, t.next) &&
                                      0 < A(e.prev, e, e.next)))
                                );
                              })(s, h)
                            )
                              return (
                                (a = R(s, h)),
                                (s = P(s, s.next)),
                                (a = P(a, a.next)),
                                S(s, e, i, r, n, o),
                                S(a, e, i, r, n, o)
                              );
                            h = h.next;
                          }
                        } while (((s = s.next), s !== t));
                      })(t, e, i, r, n, o)
                  : S(P(t), e, i, r, n, o, 1);
                break;
              }
          }
        }
        function y(t, e) {
          return t.x - e.x;
        }
        function O(t, e, i, r, n) {
          return (
            (t =
              1431655765 &
              ((t =
                858993459 &
                ((t =
                  252645135 &
                  ((t = 16711935 & ((t = 32767 * (t - i) * n) | (t << 8))) |
                    (t << 4))) |
                  (t << 2))) |
                (t << 1))) |
            ((e =
              1431655765 &
              ((e =
                858993459 &
                ((e =
                  252645135 &
                  ((e = 16711935 & ((e = 32767 * (e - r) * n) | (e << 8))) |
                    (e << 4))) |
                  (e << 2))) |
                (e << 1))) <<
              1)
          );
        }
        function I(t, e, i, r, n, o, s, a) {
          return (
            0 <= (n - s) * (e - a) - (t - s) * (o - a) &&
            0 <= (t - s) * (r - a) - (i - s) * (e - a) &&
            0 <= (i - s) * (o - a) - (n - s) * (r - a)
          );
        }
        function A(t, e, i) {
          return (e.y - t.y) * (i.x - e.x) - (e.x - t.x) * (i.y - e.y);
        }
        function M(t, e) {
          return t.x === e.x && t.y === e.y;
        }
        function D(t, e, i, r) {
          var n = u(A(t, e, i)),
            o = u(A(t, e, r)),
            s = u(A(i, r, t)),
            a = u(A(i, r, e));
          return (
            (n !== o && s !== a) ||
            (0 === n && h(t, i, e)) ||
            (0 === o && h(t, r, e)) ||
            (0 === s && h(i, t, r)) ||
            !(0 !== a || !h(i, e, r))
          );
        }
        function h(t, e, i) {
          return (
            e.x <= Math.max(t.x, i.x) &&
            e.x >= Math.min(t.x, i.x) &&
            e.y <= Math.max(t.y, i.y) &&
            e.y >= Math.min(t.y, i.y)
          );
        }
        function u(t) {
          return 0 < t ? 1 : t < 0 ? -1 : 0;
        }
        function C(t, e) {
          return A(t.prev, t, t.next) < 0
            ? 0 <= A(t, e, t.next) && 0 <= A(t, t.prev, e)
            : A(t, e, t.prev) < 0 || A(t, t.next, e) < 0;
        }
        function R(t, e) {
          var i = new s(t.i, t.x, t.y),
            r = new s(e.i, e.x, e.y),
            n = t.next,
            o = e.prev;
          return (
            ((t.next = e).prev = t),
            ((i.next = n).prev = i),
            ((r.next = i).prev = r),
            ((o.next = r).prev = o),
            r
          );
        }
        function a(t, e, i, r) {
          t = new s(t, e, i);
          return (
            r
              ? ((t.next = r.next), ((t.prev = r).next.prev = t), (r.next = t))
              : ((t.prev = t).next = t),
            t
          );
        }
        function L(t) {
          (t.next.prev = t.prev),
            (t.prev.next = t.next),
            t.prevZ && (t.prevZ.nextZ = t.nextZ),
            t.nextZ && (t.nextZ.prevZ = t.prevZ);
        }
        function s(t, e, i) {
          (this.i = t),
            (this.x = e),
            (this.y = i),
            (this.prev = null),
            (this.next = null),
            (this.z = null),
            (this.prevZ = null),
            (this.nextZ = null),
            (this.steiner = !1);
        }
        function g(t, e, i, r) {
          for (var n = 0, o = e, s = i - r; o < i; o += r)
            (n += (t[s] - t[o]) * (t[o + 1] + t[s + 1])), (s = o);
          return n;
        }
        (e.exports = r),
          ((e.exports.default = r).deviation = function (t, e, i, r) {
            var n = e && e.length,
              o = n ? e[0] * i : t.length,
              s = Math.abs(g(t, 0, o, i));
            if (n)
              for (var a = 0, h = e.length; a < h; a++) {
                var u = e[a] * i,
                  l = a < h - 1 ? e[a + 1] * i : t.length;
                s -= Math.abs(g(t, u, l, i));
              }
            for (var c = 0, a = 0; a < r.length; a += 3) {
              var d = r[a] * i,
                p = r[a + 1] * i,
                f = r[a + 2] * i;
              c += Math.abs(
                (t[d] - t[f]) * (t[1 + p] - t[1 + d]) -
                  (t[d] - t[p]) * (t[1 + f] - t[1 + d])
              );
            }
            return 0 === s && 0 === c ? 0 : Math.abs((c - s) / s);
          }),
          (r.flatten = function (t) {
            for (
              var e = t[0][0].length,
                i = { vertices: [], holes: [], dimensions: e },
                r = 0,
                n = 0;
              n < t.length;
              n++
            ) {
              for (var o = 0; o < t[n].length; o++)
                for (var s = 0; s < e; s++) i.vertices.push(t[n][o][s]);
              0 < n && ((r += t[n - 1].length), i.holes.push(r));
            }
            return i;
          });
      },
      {},
    ],
    36: [
      function (t, e, O) {
        !function (P, S) {
          !function () {
            function i() {}
            function t(t) {
              return '[object Array]' === Object.prototype.toString.call(t);
            }
            function r() {
              for (var t = 0; t < w.length; t++) w[t][0](w[t][1]);
              T = !(w = []);
            }
            function n(t, e) {
              w.push([t, e]), T || ((T = !0), E(r, 0));
            }
            function e(t, e) {
              function i(t) {
                u(e, t);
              }
              try {
                t(function (t) {
                  a(e, t);
                }, i);
              } catch (t) {
                i(t);
              }
            }
            function o(e) {
              var t = e.owner,
                i = t.state_,
                t = t.data_,
                r = e[i],
                e = e.then;
              if ('function' == typeof r) {
                i = x;
                try {
                  t = r(t);
                } catch (t) {
                  u(e, t);
                }
              }
              s(e, t) || (i === x && a(e, t), i === b && u(e, t));
            }
            function s(e, i) {
              var r;
              try {
                if (e === i)
                  throw new TypeError(
                    'A promises callback cannot return that same promise.'
                  );
                if (i && ('function' == typeof i || 'object' == typeof i)) {
                  var t = i.then;
                  if ('function' == typeof t)
                    return (
                      t.call(
                        i,
                        function (t) {
                          r || ((r = !0), (i !== t ? a : h)(e, t));
                        },
                        function (t) {
                          r || ((r = !0), u(e, t));
                        }
                      ),
                      1
                    );
                }
              } catch (t) {
                return r || u(e, t), 1;
              }
            }
            function a(t, e) {
              (t !== e && s(t, e)) || h(t, e);
            }
            function h(t, e) {
              t.state_ === v && ((t.state_ = _), (t.data_ = e), n(c, t));
            }
            function u(t, e) {
              t.state_ === v && ((t.state_ = _), (t.data_ = e), n(d, t));
            }
            function l(t) {
              var e = t.then_;
              t.then_ = void 0;
              for (var i = 0; i < e.length; i++) o(e[i]);
            }
            function c(t) {
              (t.state_ = x), l(t);
            }
            function d(t) {
              (t.state_ = b), l(t);
            }
            function p(t) {
              if ('function' != typeof t)
                throw new TypeError(
                  'Promise constructor takes a function argument'
                );
              if (this instanceof p == !1)
                throw new TypeError(
                  "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
                );
              (this.then_ = []), e(t, this);
            }
            var f, m, y, g, v, _, x, b, T, E, w;
            (f =
              'undefined' != typeof window
                ? window
                : void 0 !== P
                ? P
                : 'undefined' != typeof self
                ? self
                : this),
              (y = f.Promise),
              (g =
                y &&
                'resolve' in y &&
                'reject' in y &&
                'all' in y &&
                'race' in y &&
                (new y(function (t) {
                  m = t;
                }),
                'function' == typeof m)),
              void 0 !== O && O
                ? ((O.Promise = g ? y : p), (O.Polyfill = p))
                : 'function' == typeof define && define.amd
                ? define(function () {
                    return g ? y : p;
                  })
                : g || (f.Promise = p),
              (v = 'pending'),
              (_ = 'sealed'),
              (x = 'fulfilled'),
              (b = 'rejected'),
              (E = void 0 !== S ? S : setTimeout),
              (w = []),
              (p.prototype = {
                constructor: p,
                state_: v,
                then_: null,
                data_: void 0,
                then: function (t, e) {
                  t = {
                    owner: this,
                    then: new this.constructor(i),
                    fulfilled: t,
                    rejected: e,
                  };
                  return (
                    this.state_ === x || this.state_ === b
                      ? n(o, t)
                      : this.then_.push(t),
                    t.then
                  );
                },
                catch: function (t) {
                  return this.then(null, t);
                },
              }),
              (p.all = function (s) {
                if (t(s))
                  return new this(function (i, t) {
                    var r = [],
                      n = 0;
                    for (var e, o = 0; o < s.length; o++)
                      (e = s[o]) && 'function' == typeof e.then
                        ? e.then(
                            (function (e) {
                              return (
                                n++,
                                function (t) {
                                  (r[e] = t), --n || i(r);
                                }
                              );
                            })(o),
                            t
                          )
                        : (r[o] = e);
                    n || i(r);
                  });
                throw new TypeError('You must pass an array to Promise.all().');
              }),
              (p.race = function (n) {
                if (t(n))
                  return new this(function (t, e) {
                    for (var i, r = 0; r < n.length; r++)
                      (i = n[r]) && 'function' == typeof i.then
                        ? i.then(t, e)
                        : t(i);
                  });
                throw new TypeError(
                  'You must pass an array to Promise.race().'
                );
              }),
              (p.resolve = function (e) {
                return e && 'object' == typeof e && e.constructor === this
                  ? e
                  : new this(function (t) {
                      t(e);
                    });
              }),
              (p.reject = function (i) {
                return new this(function (t, e) {
                  e(i);
                });
              });
          }.call(this);
        }.call(
          this,
          'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
            ? self
            : 'undefined' != typeof window
            ? window
            : {},
          t('timers').setImmediate
        );
      },
      { timers: 50 },
    ],
    37: [
      function (t, e, i) {
        'use strict';
        var r = Object.prototype.hasOwnProperty,
          p = '~';
        function n() {}
        function o(t, e, i) {
          (this.fn = t), (this.context = e), (this.once = i || !1);
        }
        function s(t, e, i, r, n) {
          if ('function' != typeof i)
            throw new TypeError('The listener must be a function');
          (i = new o(i, r || t, n)), (r = p ? p + e : e);
          return (
            t._events[r]
              ? t._events[r].fn
                ? (t._events[r] = [t._events[r], i])
                : t._events[r].push(i)
              : ((t._events[r] = i), t._eventsCount++),
            t
          );
        }
        function h(t, e) {
          0 == --t._eventsCount ? (t._events = new n()) : delete t._events[e];
        }
        function a() {
          (this._events = new n()), (this._eventsCount = 0);
        }
        Object.create &&
          ((n.prototype = Object.create(null)), new n().__proto__ || (p = !1)),
          (a.prototype.eventNames = function () {
            var t,
              e,
              i = [];
            if (0 === this._eventsCount) return i;
            for (e in (t = this._events))
              r.call(t, e) && i.push(p ? e.slice(1) : e);
            return Object.getOwnPropertySymbols
              ? i.concat(Object.getOwnPropertySymbols(t))
              : i;
          }),
          (a.prototype.listeners = function (t) {
            var t = p ? p + t : t,
              e = this._events[t];
            if (!e) return [];
            if (e.fn) return [e.fn];
            for (var i = 0, r = e.length, n = new Array(r); i < r; i++)
              n[i] = e[i].fn;
            return n;
          }),
          (a.prototype.listenerCount = function (t) {
            (t = p ? p + t : t), (t = this._events[t]);
            return t ? (t.fn ? 1 : t.length) : 0;
          }),
          (a.prototype.emit = function (t, e, i, r, n, o) {
            var s = p ? p + t : t;
            if (!this._events[s]) return !1;
            var a,
              h = this._events[s],
              u = arguments.length;
            if (h.fn) {
              switch ((h.once && this.removeListener(t, h.fn, void 0, !0), u)) {
                case 1:
                  return h.fn.call(h.context), !0;
                case 2:
                  return h.fn.call(h.context, e), !0;
                case 3:
                  return h.fn.call(h.context, e, i), !0;
                case 4:
                  return h.fn.call(h.context, e, i, r), !0;
                case 5:
                  return h.fn.call(h.context, e, i, r, n), !0;
                case 6:
                  return h.fn.call(h.context, e, i, r, n, o), !0;
              }
              for (d = 1, a = new Array(u - 1); d < u; d++)
                a[d - 1] = arguments[d];
              h.fn.apply(h.context, a);
            } else
              for (var l, c = h.length, d = 0; d < c; d++)
                switch (
                  (h[d].once && this.removeListener(t, h[d].fn, void 0, !0), u)
                ) {
                  case 1:
                    h[d].fn.call(h[d].context);
                    break;
                  case 2:
                    h[d].fn.call(h[d].context, e);
                    break;
                  case 3:
                    h[d].fn.call(h[d].context, e, i);
                    break;
                  case 4:
                    h[d].fn.call(h[d].context, e, i, r);
                    break;
                  default:
                    if (!a)
                      for (l = 1, a = new Array(u - 1); l < u; l++)
                        a[l - 1] = arguments[l];
                    h[d].fn.apply(h[d].context, a);
                }
            return !0;
          }),
          (a.prototype.on = function (t, e, i) {
            return s(this, t, e, i, !1);
          }),
          (a.prototype.once = function (t, e, i) {
            return s(this, t, e, i, !0);
          }),
          (a.prototype.removeListener = function (t, e, i, r) {
            t = p ? p + t : t;
            if (!this._events[t]) return this;
            if (!e) return h(this, t), this;
            var n = this._events[t];
            if (n.fn)
              n.fn !== e ||
                (r && !n.once) ||
                (i && n.context !== i) ||
                h(this, t);
            else {
              for (var o = 0, s = [], a = n.length; o < a; o++)
                (n[o].fn !== e ||
                  (r && !n[o].once) ||
                  (i && n[o].context !== i)) &&
                  s.push(n[o]);
              s.length
                ? (this._events[t] = 1 === s.length ? s[0] : s)
                : h(this, t);
            }
            return this;
          }),
          (a.prototype.removeAllListeners = function (t) {
            return (
              t
                ? ((t = p ? p + t : t), this._events[t] && h(this, t))
                : ((this._events = new n()), (this._eventsCount = 0)),
              this
            );
          }),
          (a.prototype.off = a.prototype.removeListener),
          (a.prototype.addListener = a.prototype.on),
          (a.prefixed = p),
          (a.EventEmitter = a),
          void 0 !== e && (e.exports = a);
      },
      {},
    ],
    38: [
      function (t, e, i) {
        'use strict';
        i.__esModule = !0;
        var r,
          n = t('./isMobile');
        for (r in n) i.hasOwnProperty(r) || (i[r] = n[r]);
        t = t('./isMobile');
        i.default = t.default;
      },
      { './isMobile': 39 },
    ],
    39: [
      function (t, e, i) {
        'use strict';
        i.__esModule = !0;
        function n(t) {
          return (
            void 0 !== t &&
            'MacIntel' === t.platform &&
            'number' == typeof t.maxTouchPoints &&
            1 < t.maxTouchPoints &&
            'undefined' == typeof MSStream
          );
        }
        var o = /iPhone/i,
          s = /iPod/i,
          a = /iPad/i,
          h = /\biOS-universal(?:.+)Mac\b/i,
          u = /\bAndroid(?:.+)Mobile\b/i,
          l = /Android/i,
          c = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,
          d = /Silk/i,
          p = /Windows Phone/i,
          f = /\bWindows(?:.+)ARM\b/i,
          m = /BlackBerry/i,
          y = /BB10/i,
          g = /Opera Mini/i,
          v = /\b(CriOS|Chrome)(?:.+)Mobile/i,
          _ = /Mobile(?:.+)Firefox\b/i;
        i.default = function (t) {
          var e,
            i = { userAgent: '', platform: '', maxTouchPoints: 0 };
          t || 'undefined' == typeof navigator
            ? 'string' == typeof t
              ? (i.userAgent = t)
              : t &&
                t.userAgent &&
                (i = {
                  userAgent: t.userAgent,
                  platform: t.platform,
                  maxTouchPoints: t.maxTouchPoints || 0,
                })
            : (i = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints || 0,
              });
          var r = (t = i.userAgent).split('[FBAN');
          return (
            void 0 !==
              (r = (t = void 0 !== r[1] ? r[0] : t).split('Twitter'))[1] &&
              (t = r[0]),
            (e = t),
            ((t = {
              apple: {
                phone:
                  (r = function (t) {
                    return t.test(e);
                  })(o) && !r(p),
                ipod: r(s),
                tablet: !r(o) && (r(a) || n(i)) && !r(p),
                universal: r(h),
                device: (r(o) || r(s) || r(a) || r(h) || n(i)) && !r(p),
              },
              amazon: {
                phone: r(c),
                tablet: !r(c) && r(d),
                device: r(c) || r(d),
              },
              android: {
                phone: (!r(p) && r(c)) || (!r(p) && r(u)),
                tablet: !r(p) && !r(c) && !r(u) && (r(d) || r(l)),
                device:
                  (!r(p) && (r(c) || r(d) || r(u) || r(l))) || r(/\bokhttp\b/i),
              },
              windows: { phone: r(p), tablet: r(f), device: r(p) || r(f) },
              other: {
                blackberry: r(m),
                blackberry10: r(y),
                opera: r(g),
                firefox: r(_),
                chrome: r(v),
                device: r(m) || r(y) || r(g) || r(_) || r(v),
              },
              any: !1,
              phone: !1,
              tablet: !1,
            }).any =
              t.apple.device ||
              t.android.device ||
              t.windows.device ||
              t.other.device),
            (t.phone = t.apple.phone || t.android.phone || t.windows.phone),
            (t.tablet = t.apple.tablet || t.android.tablet || t.windows.tablet),
            t
          );
        };
      },
      {},
    ],
    40: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        var r = function (t, e, i) {
          return e && n(t.prototype, e), i && n(t, i), t;
        };
        function n(t, e) {
          for (var i = 0; i < e.length; i++) {
            var r = e[i];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        function o(t, e) {
          if (!(t instanceof e))
            throw new TypeError('Cannot call a class as a function');
        }
        r(a, [
          {
            key: 'detach',
            value: function () {
              return null !== this._owner && (this._owner.detach(this), !0);
            },
          },
        ]);
        var s = a;
        function a(t, e, i) {
          void 0 === e && (e = !1),
            o(this, a),
            (this._fn = t),
            (this._once = e),
            (this._thisArg = i),
            (this._next = this._prev = this._owner = null);
        }
        function h(t, e) {
          return (
            t._head ? ((t._tail._next = e)._prev = t._tail) : (t._head = e),
            ((t._tail = e)._owner = t),
            e
          );
        }
        r(u, [
          {
            key: 'handlers',
            value: function () {
              var t = this._head;
              if (
                !(arguments.length <= 0 || void 0 === arguments[0]) &&
                arguments[0]
              )
                return !!t;
              for (var e = []; t; ) e.push(t), (t = t._next);
              return e;
            },
          },
          {
            key: 'has',
            value: function (t) {
              if (t instanceof s) return t._owner === this;
              throw new Error(
                'MiniSignal#has(): First arg must be a MiniSignalBinding object.'
              );
            },
          },
          {
            key: 'dispatch',
            value: function () {
              var t = this._head;
              if (!t) return !1;
              for (; t; )
                t._once && this.detach(t),
                  t._fn.apply(t._thisArg, arguments),
                  (t = t._next);
              return !0;
            },
          },
          {
            key: 'add',
            value: function (t) {
              var e =
                arguments.length <= 1 || void 0 === arguments[1]
                  ? null
                  : arguments[1];
              if ('function' != typeof t)
                throw new Error(
                  'MiniSignal#add(): First arg must be a Function.'
                );
              return h(this, new s(t, !1, e));
            },
          },
          {
            key: 'once',
            value: function (t) {
              var e =
                arguments.length <= 1 || void 0 === arguments[1]
                  ? null
                  : arguments[1];
              if ('function' != typeof t)
                throw new Error(
                  'MiniSignal#once(): First arg must be a Function.'
                );
              return h(this, new s(t, !0, e));
            },
          },
          {
            key: 'detach',
            value: function (t) {
              if (t instanceof s)
                return (
                  t._owner !== this ||
                    (t._prev && (t._prev._next = t._next),
                    t._next && (t._next._prev = t._prev),
                    t === this._head
                      ? ((this._head = t._next),
                        null === t._next && (this._tail = null))
                      : t === this._tail &&
                        ((this._tail = t._prev), (this._tail._next = null)),
                    (t._owner = null)),
                  this
                );
              throw new Error(
                'MiniSignal#detach(): First arg must be a MiniSignalBinding object.'
              );
            },
          },
          {
            key: 'detachAll',
            value: function () {
              var t = this._head;
              if (!t) return this;
              for (this._head = this._tail = null; t; )
                (t._owner = null), (t = t._next);
              return this;
            },
          },
        ]);
        r = u;
        function u() {
          o(this, u), (this._head = this._tail = void 0);
        }
        (r.MiniSignalBinding = s), (i.default = r), (e.exports = i.default);
      },
      {},
    ],
    41: [
      function (t, e, i) {
        'use strict';
        var h = Object.getOwnPropertySymbols,
          u = Object.prototype.hasOwnProperty,
          l = Object.prototype.propertyIsEnumerable;
        e.exports = (function () {
          try {
            if (!Object.assign) return;
            var t = new String('abc');
            if (((t[5] = 'de'), '5' === Object.getOwnPropertyNames(t)[0]))
              return;
            for (var e = {}, i = 0; i < 10; i++)
              e['_' + String.fromCharCode(i)] = i;
            if (
              '0123456789' !==
              Object.getOwnPropertyNames(e)
                .map(function (t) {
                  return e[t];
                })
                .join('')
            )
              return;
            var r = {};
            return (
              'abcdefghijklmnopqrst'.split('').forEach(function (t) {
                r[t] = t;
              }),
              'abcdefghijklmnopqrst' !==
              Object.keys(Object.assign({}, r)).join('')
                ? void 0
                : 1
            );
          } catch (t) {
            return;
          }
        })()
          ? Object.assign
          : function (t, e) {
              for (
                var i,
                  r = (function (t) {
                    if (null == t)
                      throw new TypeError(
                        'Object.assign cannot be called with null or undefined'
                      );
                    return Object(t);
                  })(t),
                  n = 1;
                n < arguments.length;
                n++
              ) {
                for (var o in (i = Object(arguments[n])))
                  u.call(i, o) && (r[o] = i[o]);
                if (h)
                  for (var s = h(i), a = 0; a < s.length; a++)
                    l.call(i, s[a]) && (r[s[a]] = i[s[a]]);
              }
              return r;
            };
      },
      {},
    ],
    42: [
      function (t, e, i) {
        'use strict';
        e.exports = (e, i = {}) => {
          if (e) {
            const n = {
              key: [
                'source',
                'protocol',
                'authority',
                'userInfo',
                'user',
                'password',
                'host',
                'port',
                'relative',
                'path',
                'directory',
                'file',
                'query',
                'anchor',
              ],
              q: { name: 'queryKey', parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
              parser: {
                strict:
                  /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:
                  /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/,
              },
            };
            var r = n.parser[i.strictMode ? 'strict' : 'loose'].exec(e);
            const o = {};
            let t = 14;
            for (; t--; ) o[n.key[t]] = r[t] || '';
            return (
              (o[n.q.name] = {}),
              o[n.key[12]].replace(n.q.parser, function (t, e, i) {
                e && (o[n.q.name][e] = i);
              }),
              o
            );
          }
        };
      },
      {},
    ],
    43: [
      function (t, N, e) {
        'use strict';
        Object.defineProperty(e, '__esModule', { value: !0 }),
          t('@pixi/polyfill');
        var p = t('@pixi/utils'),
          i = t('@pixi/accessibility'),
          r = t('@pixi/interaction'),
          n = t('@pixi/app'),
          o = t('@pixi/core'),
          s = t('@pixi/extract'),
          a = t('@pixi/loaders'),
          h = t('@pixi/particles'),
          u = t('@pixi/prepare'),
          l = t('@pixi/spritesheet'),
          c = t('@pixi/sprite-tiling'),
          d = t('@pixi/text-bitmap'),
          f = t('@pixi/ticker'),
          m = t('@pixi/filter-alpha'),
          y = t('@pixi/filter-blur'),
          g = t('@pixi/filter-color-matrix'),
          v = t('@pixi/filter-displacement'),
          _ = t('@pixi/filter-fxaa'),
          x = t('@pixi/filter-noise'),
          b =
            (t('@pixi/mixin-cache-as-bitmap'),
            t('@pixi/mixin-get-child-by-name'),
            t('@pixi/mixin-get-global-position'),
            t('@pixi/constants')),
          T = t('@pixi/display'),
          E = t('@pixi/graphics'),
          w = t('@pixi/math'),
          P = t('@pixi/mesh'),
          S = t('@pixi/mesh-extras'),
          O = t('@pixi/runner'),
          I = t('@pixi/sprite'),
          A = t('@pixi/sprite-animated'),
          M = t('@pixi/text'),
          D = t('@pixi/settings'),
          C = function (t, e) {
            return (C =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
              })(t, e);
          };
        function R(t, e) {
          function i() {
            this.constructor = t;
          }
          C(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }
        var L = '5.0.0';
        o.Renderer.registerPlugin('accessibility', i.AccessibilityManager),
          o.Renderer.registerPlugin('extract', s.Extract),
          o.Renderer.registerPlugin('interaction', r.InteractionManager),
          o.Renderer.registerPlugin('particle', h.ParticleRenderer),
          o.Renderer.registerPlugin('prepare', u.Prepare),
          o.Renderer.registerPlugin('batch', o.BatchRenderer),
          o.Renderer.registerPlugin('tilingSprite', c.TilingSpriteRenderer),
          a.Loader.registerPlugin(d.BitmapFontLoader),
          a.Loader.registerPlugin(l.SpritesheetLoader),
          n.Application.registerPlugin(f.TickerPlugin),
          n.Application.registerPlugin(a.AppLoaderPlugin);
        t = {
          AlphaFilter: m.AlphaFilter,
          BlurFilter: y.BlurFilter,
          BlurFilterPass: y.BlurFilterPass,
          ColorMatrixFilter: g.ColorMatrixFilter,
          DisplacementFilter: v.DisplacementFilter,
          FXAAFilter: _.FXAAFilter,
          NoiseFilter: x.NoiseFilter,
        };
        Object.keys(i).forEach(function (t) {
          Object.defineProperty(e, t, {
            enumerable: !0,
            get: function () {
              return i[t];
            },
          });
        }),
          Object.keys(r).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return r[t];
              },
            });
          }),
          Object.keys(n).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return n[t];
              },
            });
          }),
          Object.keys(o).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return o[t];
              },
            });
          }),
          Object.keys(s).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return s[t];
              },
            });
          }),
          Object.keys(a).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return a[t];
              },
            });
          }),
          Object.keys(h).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return h[t];
              },
            });
          }),
          Object.keys(u).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return u[t];
              },
            });
          }),
          Object.keys(l).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return l[t];
              },
            });
          }),
          Object.keys(c).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return c[t];
              },
            });
          }),
          Object.keys(d).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return d[t];
              },
            });
          }),
          Object.keys(f).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return f[t];
              },
            });
          }),
          Object.keys(b).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return b[t];
              },
            });
          }),
          Object.keys(T).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return T[t];
              },
            });
          }),
          Object.keys(E).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return E[t];
              },
            });
          }),
          Object.keys(w).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return w[t];
              },
            });
          }),
          Object.keys(P).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return P[t];
              },
            });
          }),
          Object.keys(S).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return S[t];
              },
            });
          }),
          Object.keys(O).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return O[t];
              },
            });
          }),
          Object.keys(I).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return I[t];
              },
            });
          }),
          Object.keys(A).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return A[t];
              },
            });
          }),
          Object.keys(M).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return M[t];
              },
            });
          }),
          Object.keys(D).forEach(function (t) {
            Object.defineProperty(e, t, {
              enumerable: !0,
              get: function () {
                return D[t];
              },
            });
          }),
          (e.utils = p),
          (e.VERSION = '5.3.12'),
          (e.filters = t),
          (e.useDeprecated = function () {
            function e(t) {
              return 'on' + t.charAt(0).toUpperCase() + t.slice(1);
            }
            var n,
              o,
              s = this,
              a =
                (Object.defineProperties(s, {
                  SVG_SIZE: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.utils.SVG_SIZE property has moved to PIXI.resources.SVGResource.SVG_SIZE'
                        ),
                        s.SVGResource.SVG_SIZE
                      );
                    },
                  },
                  TransformStatic: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.TransformStatic class has been removed, use PIXI.Transform'
                        ),
                        s.Transform
                      );
                    },
                  },
                  TransformBase: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.TransformBase class has been removed, use PIXI.Transform'
                        ),
                        s.Transform
                      );
                    },
                  },
                  TRANSFORM_MODE: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.TRANSFORM_MODE property has been removed'
                        ),
                        { STATIC: 0, DYNAMIC: 1 }
                      );
                    },
                  },
                  WebGLRenderer: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.WebGLRenderer class has moved to PIXI.Renderer'
                        ),
                        s.Renderer
                      );
                    },
                  },
                  CanvasRenderTarget: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.CanvasRenderTarget class has moved to PIXI.utils.CanvasRenderTarget'
                        ),
                        s.utils.CanvasRenderTarget
                      );
                    },
                  },
                  loader: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.loader instance has moved to PIXI.Loader.shared'
                        ),
                        s.Loader.shared
                      );
                    },
                  },
                  FilterManager: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.FilterManager class has moved to PIXI.systems.FilterSystem'
                        ),
                        s.systems.FilterSystem
                      );
                    },
                  },
                  CanvasTinter: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.0',
                          'PIXI.CanvasTinter namespace has moved to PIXI.canvasUtils'
                        ),
                        s.canvasUtils
                      );
                    },
                  },
                  GroupD8: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.0',
                          'PIXI.GroupD8 namespace has moved to PIXI.groupD8'
                        ),
                        s.groupD8
                      );
                    },
                  },
                }),
                (s.accessibility = {}),
                Object.defineProperties(s.accessibility, {
                  AccessibilityManager: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.3.0',
                          'PIXI.accessibility.AccessibilityManager moved to PIXI.AccessibilityManager'
                        ),
                        s.AccessibilityManager
                      );
                    },
                  },
                }),
                (s.interaction = {}),
                Object.defineProperties(s.interaction, {
                  InteractionManager: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.3.0',
                          'PIXI.interaction.InteractionManager moved to PIXI.InteractionManager'
                        ),
                        s.InteractionManager
                      );
                    },
                  },
                  InteractionData: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.3.0',
                          'PIXI.interaction.InteractionData moved to PIXI.InteractionData'
                        ),
                        s.InteractionData
                      );
                    },
                  },
                  InteractionEvent: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.3.0',
                          'PIXI.interaction.InteractionEvent moved to PIXI.InteractionEvent'
                        ),
                        s.InteractionEvent
                      );
                    },
                  },
                }),
                (s.prepare = {}),
                Object.defineProperties(s.prepare, {
                  BasePrepare: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.1',
                          'PIXI.prepare.BasePrepare moved to PIXI.BasePrepare'
                        ),
                        s.BasePrepare
                      );
                    },
                  },
                  Prepare: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.1',
                          'PIXI.prepare.Prepare moved to PIXI.Prepare'
                        ),
                        s.Prepare
                      );
                    },
                  },
                  CanvasPrepare: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.1',
                          'PIXI.prepare.CanvasPrepare moved to PIXI.CanvasPrepare'
                        ),
                        s.CanvasPrepare
                      );
                    },
                  },
                }),
                (s.extract = {}),
                Object.defineProperties(s.extract, {
                  Extract: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.1',
                          'PIXI.extract.Extract moved to PIXI.Extract'
                        ),
                        s.Extract
                      );
                    },
                  },
                  CanvasExtract: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.1',
                          'PIXI.extract.CanvasExtract moved to PIXI.CanvasExtract'
                        ),
                        s.CanvasExtract
                      );
                    },
                  },
                }),
                (s.extras = {}),
                Object.defineProperties(s.extras, {
                  TilingSprite: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.extras.TilingSprite class has moved to PIXI.TilingSprite'
                        ),
                        s.TilingSprite
                      );
                    },
                  },
                  TilingSpriteRenderer: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.extras.TilingSpriteRenderer class has moved to PIXI.TilingSpriteRenderer'
                        ),
                        s.TilingSpriteRenderer
                      );
                    },
                  },
                  AnimatedSprite: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.extras.AnimatedSprite class has moved to PIXI.AnimatedSprite'
                        ),
                        s.AnimatedSprite
                      );
                    },
                  },
                  BitmapText: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.extras.BitmapText class has moved to PIXI.BitmapText'
                        ),
                        s.BitmapText
                      );
                    },
                  },
                }),
                (s.TilingSprite.fromFrame = function (t, e, i) {
                  return (
                    p.deprecation(
                      '5.3.0',
                      'TilingSprite.fromFrame is deprecated, use TilingSprite.from'
                    ),
                    s.TilingSprite.from(t, { width: e, height: i })
                  );
                }),
                (s.TilingSprite.fromImage = function (t, e, i, r) {
                  return (
                    void 0 === r && (r = {}),
                    p.deprecation(
                      '5.3.0',
                      'TilingSprite.fromImage is deprecated, use TilingSprite.from'
                    ),
                    ((r =
                      r && 'object' != typeof r
                        ? {
                            scaleMode: arguments[4],
                            resourceOptions: { crossorigin: arguments[3] },
                          }
                        : r).width = e),
                    (r.height = i),
                    s.TilingSprite.from(t, r)
                  );
                }),
                Object.defineProperties(s.utils, {
                  getSvgSize: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.utils.getSvgSize function has moved to PIXI.resources.SVGResource.getSize'
                        ),
                        s.resources.SVGResource.getSize
                      );
                    },
                  },
                }),
                (s.mesh = {}),
                Object.defineProperties(s.mesh, {
                  Mesh: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.Mesh class has moved to PIXI.SimpleMesh'
                        ),
                        s.SimpleMesh
                      );
                    },
                  },
                  NineSlicePlane: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.NineSlicePlane class has moved to PIXI.NineSlicePlane'
                        ),
                        s.NineSlicePlane
                      );
                    },
                  },
                  Plane: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.Plane class has moved to PIXI.SimplePlane'
                        ),
                        s.SimplePlane
                      );
                    },
                  },
                  Rope: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.Rope class has moved to PIXI.SimpleRope'
                        ),
                        s.SimpleRope
                      );
                    },
                  },
                  RawMesh: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.RawMesh class has moved to PIXI.Mesh'
                        ),
                        s.Mesh
                      );
                    },
                  },
                  CanvasMeshRenderer: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.CanvasMeshRenderer class has moved to PIXI.CanvasMeshRenderer'
                        ),
                        s.CanvasMeshRenderer
                      );
                    },
                  },
                  MeshRenderer: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.mesh.MeshRenderer class has moved to PIXI.MeshRenderer'
                        ),
                        s.MeshRenderer
                      );
                    },
                  },
                }),
                (s.particles = {}),
                Object.defineProperties(s.particles, {
                  ParticleContainer: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.particles.ParticleContainer class has moved to PIXI.ParticleContainer'
                        ),
                        s.ParticleContainer
                      );
                    },
                  },
                  ParticleRenderer: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.particles.ParticleRenderer class has moved to PIXI.ParticleRenderer'
                        ),
                        s.ParticleRenderer
                      );
                    },
                  },
                }),
                (s.ticker = {}),
                Object.defineProperties(s.ticker, {
                  Ticker: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.ticker.Ticker class has moved to PIXI.Ticker'
                        ),
                        s.Ticker
                      );
                    },
                  },
                  shared: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.ticker.shared instance has moved to PIXI.Ticker.shared'
                        ),
                        s.Ticker.shared
                      );
                    },
                  },
                }),
                (s.loaders = {}),
                Object.defineProperties(s.loaders, {
                  Loader: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.loaders.Loader class has moved to PIXI.Loader'
                        ),
                        s.Loader
                      );
                    },
                  },
                  Resource: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.loaders.Resource class has moved to PIXI.LoaderResource'
                        ),
                        s.LoaderResource
                      );
                    },
                  },
                  bitmapFontParser: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.loaders.bitmapFontParser function has moved to PIXI.BitmapFontLoader.use'
                        ),
                        s.BitmapFontLoader.use
                      );
                    },
                  },
                  parseBitmapFontData: {
                    get: function () {
                      p.deprecation(
                        L,
                        'PIXI.loaders.parseBitmapFontData function has removed'
                      );
                    },
                  },
                  spritesheetParser: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.loaders.spritesheetParser function has moved to PIXI.SpritesheetLoader.use'
                        ),
                        s.SpritesheetLoader.use
                      );
                    },
                  },
                  getResourcePath: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.loaders.getResourcePath property has moved to PIXI.SpritesheetLoader.getResourcePath'
                        ),
                        s.SpritesheetLoader.getResourcePath
                      );
                    },
                  },
                }),
                (s.Loader.addPixiMiddleware = function (t) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.loaders.Loader.addPixiMiddleware function is deprecated, use PIXI.loaders.Loader.registerPlugin'
                    ),
                    s.loaders.Loader.registerPlugin({ use: t() })
                  );
                }),
                Object.assign(s.Loader.prototype, {
                  on: function (t) {
                    t = e(t);
                    p.deprecation(
                      L,
                      'PIXI.Loader#on is completely deprecated, use PIXI.Loader#' +
                        t +
                        '.add'
                    );
                  },
                  once: function (t) {
                    t = e(t);
                    p.deprecation(
                      L,
                      'PIXI.Loader#once is completely deprecated, use PIXI.Loader#' +
                        t +
                        '.once'
                    );
                  },
                  off: function (t) {
                    t = e(t);
                    p.deprecation(
                      L,
                      'PIXI.Loader#off is completely deprecated, use PIXI.Loader#' +
                        t +
                        '.detach'
                    );
                  },
                }),
                Object.defineProperty(s.extract, 'WebGLExtract', {
                  get: function () {
                    return (
                      p.deprecation(
                        L,
                        'PIXI.extract.WebGLExtract method has moved to PIXI.Extract'
                      ),
                      s.Extract
                    );
                  },
                }),
                Object.defineProperty(s.prepare, 'WebGLPrepare', {
                  get: function () {
                    return (
                      p.deprecation(
                        L,
                        'PIXI.prepare.WebGLPrepare class has moved to PIXI.Prepare'
                      ),
                      s.Prepare
                    );
                  },
                }),
                (s.Container.prototype._renderWebGL = function (t) {
                  p.deprecation(
                    L,
                    'PIXI.Container._renderWebGL method has moved to PIXI.Container._render'
                  ),
                    this._render(t);
                }),
                (s.Container.prototype.renderWebGL = function (t) {
                  p.deprecation(
                    L,
                    'PIXI.Container.renderWebGL method has moved to PIXI.Container.render'
                  ),
                    this.render(t);
                }),
                (s.DisplayObject.prototype.renderWebGL = function (t) {
                  p.deprecation(
                    L,
                    'PIXI.DisplayObject.renderWebGL method has moved to PIXI.DisplayObject.render'
                  ),
                    this.render(t);
                }),
                (s.Container.prototype.renderAdvancedWebGL = function (t) {
                  p.deprecation(
                    L,
                    'PIXI.Container.renderAdvancedWebGL method has moved to PIXI.Container.renderAdvanced'
                  ),
                    this.renderAdvanced(t);
                }),
                Object.defineProperties(s.settings, {
                  TRANSFORM_MODE: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.settings.TRANSFORM_MODE property has been removed'
                        ),
                        0
                      );
                    },
                    set: function () {
                      p.deprecation(
                        L,
                        'PIXI.settings.TRANSFORM_MODE property has been removed'
                      );
                    },
                  },
                }),
                s.BaseTexture),
              t = !(a.prototype.loadSource = function (t) {
                p.deprecation(
                  L,
                  'PIXI.BaseTexture.loadSource method has been deprecated'
                );
                t = s.resources.autoDetectResource(t);
                (t.internal = !0), this.setResource(t), this.update();
              }),
              i =
                (Object.defineProperties(a.prototype, {
                  hasLoaded: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.BaseTexture.hasLoaded property has been removed, use PIXI.BaseTexture.valid'
                        ),
                        this.valid
                      );
                    },
                  },
                  imageUrl: {
                    get: function () {
                      var t;
                      return (
                        p.deprecation(
                          L,
                          'PIXI.BaseTexture.imageUrl property has been removed, use PIXI.BaseTexture.resource.url'
                        ),
                        null == (t = this.resource) ? void 0 : t.url
                      );
                    },
                    set: function (t) {
                      p.deprecation(
                        L,
                        'PIXI.BaseTexture.imageUrl property has been removed, use PIXI.BaseTexture.resource.url'
                      ),
                        this.resource && (this.resource.url = t);
                    },
                  },
                  source: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.BaseTexture.source property has been moved, use `PIXI.BaseTexture.resource.source`'
                        ),
                        this.resource.source
                      );
                    },
                    set: function (t) {
                      p.deprecation(
                        L,
                        'PIXI.BaseTexture.source property has been moved, use `PIXI.BaseTexture.resource.source` if you want to set HTMLCanvasElement. Otherwise, create new BaseTexture.'
                      ),
                        this.resource && (this.resource.source = t);
                    },
                  },
                  premultiplyAlpha: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.0',
                          'PIXI.BaseTexture.premultiplyAlpha property has been changed to `alphaMode`, see `PIXI.ALPHA_MODES`'
                        ),
                        0 !== this.alphaMode
                      );
                    },
                    set: function (t) {
                      p.deprecation(
                        '5.2.0',
                        'PIXI.BaseTexture.premultiplyAlpha property has been changed to `alphaMode`, see `PIXI.ALPHA_MODES`'
                      ),
                        (this.alphaMode = Number(t));
                    },
                  },
                  _id: {
                    get: function () {
                      return (
                        t ||
                          (p.deprecation(
                            '5.2.0',
                            'PIXI.BaseTexture._id batch local field has been changed to `_batchLocation`'
                          ),
                          (t = !0)),
                        this._batchLocation
                      );
                    },
                    set: function (t) {
                      this._batchLocation = t;
                    },
                  },
                }),
                (a.fromImage = function (t, e, i, r) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.BaseTexture.fromImage method has been replaced with PIXI.BaseTexture.from'
                    ),
                    a.from(t, {
                      scaleMode: i,
                      resourceOptions: { scale: r, crossorigin: e },
                    })
                  );
                }),
                (a.fromCanvas = function (t, e) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.BaseTexture.fromCanvas method has been replaced with PIXI.BaseTexture.from'
                    ),
                    a.from(t, { scaleMode: e })
                  );
                }),
                (a.fromSVG = function (t, e, i, r) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.BaseTexture.fromSVG method has been replaced with PIXI.BaseTexture.from'
                    ),
                    a.from(t, {
                      scaleMode: i,
                      resourceOptions: { scale: r, crossorigin: e },
                    })
                  );
                }),
                Object.defineProperties(s.resources.ImageResource.prototype, {
                  premultiplyAlpha: {
                    get: function () {
                      return (
                        p.deprecation(
                          '5.2.0',
                          'PIXI.resources.ImageResource.premultiplyAlpha property has been changed to `alphaMode`, see `PIXI.ALPHA_MODES`'
                        ),
                        0 !== this.alphaMode
                      );
                    },
                    set: function (t) {
                      p.deprecation(
                        '5.2.0',
                        'PIXI.resources.ImageResource.premultiplyAlpha property has been changed to `alphaMode`, see `PIXI.ALPHA_MODES`'
                      ),
                        (this.alphaMode = Number(t));
                    },
                  },
                }),
                (s.Point.prototype.copy = function (t) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.Point.copy method has been replaced with PIXI.Point.copyFrom'
                    ),
                    this.copyFrom(t)
                  );
                }),
                (s.ObservablePoint.prototype.copy = function (t) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.ObservablePoint.copy method has been replaced with PIXI.ObservablePoint.copyFrom'
                    ),
                    this.copyFrom(t)
                  );
                }),
                (s.Rectangle.prototype.copy = function (t) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.Rectangle.copy method has been replaced with PIXI.Rectangle.copyFrom'
                    ),
                    this.copyFrom(t)
                  );
                }),
                (s.Matrix.prototype.copy = function (t) {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.Matrix.copy method has been replaced with PIXI.Matrix.copyTo'
                    ),
                    this.copyTo(t)
                  );
                }),
                (s.systems.StateSystem.prototype.setState = function (t) {
                  return (
                    p.deprecation(
                      'v5.1.0',
                      'StateSystem.setState has been renamed to StateSystem.set'
                    ),
                    this.set(t)
                  );
                }),
                Object.assign(s.systems.FilterSystem.prototype, {
                  getRenderTarget: function (t, e) {
                    return (
                      p.deprecation(
                        L,
                        'PIXI.FilterManager.getRenderTarget method has been replaced with PIXI.systems.FilterSystem#getFilterTexture'
                      ),
                      this.getFilterTexture(null, e)
                    );
                  },
                  returnRenderTarget: function (t) {
                    p.deprecation(
                      L,
                      'PIXI.FilterManager.returnRenderTarget method has been replaced with PIXI.systems.FilterSystem.returnFilterTexture'
                    ),
                      this.returnFilterTexture(t);
                  },
                  calculateScreenSpaceMatrix: function (t) {
                    p.deprecation(
                      L,
                      'PIXI.systems.FilterSystem.calculateScreenSpaceMatrix method is removed, use `(vTextureCoord * inputSize.xy) + outputFrame.xy` instead'
                    );
                    var t = t.identity(),
                      e = this.activeState,
                      i = e.sourceFrame,
                      e = e.destinationFrame;
                    return (
                      t.translate(i.x / e.width, i.y / e.height),
                      t.scale(e.width, e.height),
                      t
                    );
                  },
                  calculateNormalizedScreenSpaceMatrix: function (t) {
                    p.deprecation(
                      L,
                      'PIXI.systems.FilterManager.calculateNormalizedScreenSpaceMatrix method is removed, use `((vTextureCoord * inputSize.xy) + outputFrame.xy) / outputFrame.zw` instead.'
                    );
                    var e = this.activeState,
                      i = e.sourceFrame,
                      e = e.destinationFrame,
                      t = t.identity(),
                      r =
                        (t.translate(i.x / e.width, i.y / e.height),
                        e.width / i.width),
                      e = e.height / i.height;
                    return t.scale(r, e), t;
                  },
                }),
                Object.defineProperties(s.RenderTexture.prototype, {
                  sourceFrame: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.RenderTexture.sourceFrame property has been removed'
                        ),
                        this.filterFrame
                      );
                    },
                  },
                  size: {
                    get: function () {
                      return (
                        p.deprecation(
                          L,
                          'PIXI.RenderTexture.size property has been removed'
                        ),
                        this._frame
                      );
                    },
                  },
                }),
                R(r, (n = s.filters.BlurFilterPass)),
                r);
            function r(t, e, i, r) {
              return (
                p.deprecation(
                  L,
                  'PIXI.filters.BlurXFilter class is deprecated, use PIXI.filters.BlurFilterPass'
                ),
                n.call(this, !0, t, e, i, r) || this
              );
            }
            function h(t, e, i, r) {
              return (
                p.deprecation(
                  L,
                  'PIXI.filters.BlurYFilter class is deprecated, use PIXI.filters.BlurFilterPass'
                ),
                o.call(this, !1, t, e, i, r) || this
              );
            }
            R(h, (o = s.filters.BlurFilterPass)),
              Object.assign(s.filters, { BlurXFilter: i, BlurYFilter: h });
            var u = s.Sprite,
              l = s.Texture;
            function c(t, e, i, r) {
              return (
                p.deprecation(
                  L,
                  'PIXI.Sprite.' +
                    t +
                    ' method is deprecated, use PIXI.Sprite.from'
                ),
                u.from(e, { resourceOptions: { scale: r, crossorigin: i } })
              );
            }
            function d(t, e, i, r) {
              return (
                p.deprecation(
                  L,
                  'PIXI.Texture.' +
                    t +
                    ' method is deprecated, use PIXI.Texture.from'
                ),
                l.from(e, { resourceOptions: { scale: r, crossorigin: i } })
              );
            }
            (i = s.Graphics).prototype.generateCanvasTexture ||
              (i.prototype.generateCanvasTexture = function () {
                p.deprecation(
                  L,
                  'PIXI.Graphics.generateCanvasTexture method is only available in "pixi.js-legacy"'
                );
              }),
              Object.defineProperty(i.prototype, 'graphicsData', {
                get: function () {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.Graphics.graphicsData property is deprecated, use PIXI.Graphics.geometry.graphicsData'
                    ),
                    this.geometry.graphicsData
                  );
                },
              }),
              (u.fromImage = c.bind(null, 'fromImage')),
              (u.fromSVG = c.bind(null, 'fromSVG')),
              (u.fromCanvas = c.bind(null, 'fromCanvas')),
              (u.fromVideo = c.bind(null, 'fromVideo')),
              (u.fromFrame = c.bind(null, 'fromFrame')),
              (l.fromImage = d.bind(null, 'fromImage')),
              (l.fromSVG = d.bind(null, 'fromSVG')),
              (l.fromCanvas = d.bind(null, 'fromCanvas')),
              (l.fromVideo = d.bind(null, 'fromVideo')),
              (l.fromFrame = d.bind(null, 'fromFrame')),
              Object.defineProperty(
                s.AbstractRenderer.prototype,
                'autoResize',
                {
                  get: function () {
                    return (
                      p.deprecation(
                        L,
                        'PIXI.AbstractRenderer.autoResize property is deprecated, use PIXI.AbstractRenderer.autoDensity'
                      ),
                      this.autoDensity
                    );
                  },
                  set: function (t) {
                    p.deprecation(
                      L,
                      'PIXI.AbstractRenderer.autoResize property is deprecated, use PIXI.AbstractRenderer.autoDensity'
                    ),
                      (this.autoDensity = t);
                  },
                }
              ),
              Object.defineProperty(s.Renderer.prototype, 'textureManager', {
                get: function () {
                  return (
                    p.deprecation(
                      L,
                      'PIXI.Renderer.textureManager property is deprecated, use PIXI.Renderer.texture'
                    ),
                    this.texture
                  );
                },
              }),
              (s.utils.mixins = {
                mixin: function () {
                  p.deprecation(
                    L,
                    'PIXI.utils.mixins.mixin function is no longer available'
                  );
                },
                delayMixin: function () {
                  p.deprecation(
                    L,
                    'PIXI.utils.mixins.delayMixin function is no longer available'
                  );
                },
                performMixins: function () {
                  p.deprecation(
                    L,
                    'PIXI.utils.mixins.performMixins function is no longer available'
                  );
                },
              }),
              Object.defineProperty(s.BitmapText.prototype, 'font', {
                get: function () {
                  return (
                    p.deprecation(
                      '5.3.0',
                      'PIXI.BitmapText.font property is deprecated, use fontName, fontSize, tint or align properties'
                    ),
                    {
                      name: this._fontName,
                      size: this._fontSize,
                      tint: this._tint,
                      align: this._align,
                    }
                  );
                },
                set: function (t) {
                  p.deprecation(
                    '5.3.0',
                    'PIXI.BitmapText.font property is deprecated, use fontName, fontSize, tint or align properties'
                  ),
                    t &&
                      (this._upgradeStyle((t = { font: t })),
                      (t.fontSize =
                        t.fontSize || s.BitmapFont.available[t.fontName].size),
                      (this._fontName = t.fontName),
                      (this._fontSize = t.fontSize),
                      (this.dirty = !0));
                },
              });
          });
      },
      {
        '@pixi/accessibility': 1,
        '@pixi/app': 2,
        '@pixi/constants': 3,
        '@pixi/core': 4,
        '@pixi/display': 5,
        '@pixi/extract': 6,
        '@pixi/filter-alpha': 7,
        '@pixi/filter-blur': 8,
        '@pixi/filter-color-matrix': 9,
        '@pixi/filter-displacement': 10,
        '@pixi/filter-fxaa': 11,
        '@pixi/filter-noise': 12,
        '@pixi/graphics': 13,
        '@pixi/interaction': 14,
        '@pixi/loaders': 15,
        '@pixi/math': 16,
        '@pixi/mesh': 18,
        '@pixi/mesh-extras': 17,
        '@pixi/mixin-cache-as-bitmap': 19,
        '@pixi/mixin-get-child-by-name': 20,
        '@pixi/mixin-get-global-position': 21,
        '@pixi/particles': 22,
        '@pixi/polyfill': 23,
        '@pixi/prepare': 24,
        '@pixi/runner': 25,
        '@pixi/settings': 26,
        '@pixi/sprite': 29,
        '@pixi/sprite-animated': 27,
        '@pixi/sprite-tiling': 28,
        '@pixi/spritesheet': 30,
        '@pixi/text': 32,
        '@pixi/text-bitmap': 31,
        '@pixi/ticker': 33,
        '@pixi/utils': 34,
      },
    ],
    44: [
      function (t, e, i) {
        var r,
          n,
          e = (e.exports = {});
        function o() {
          throw new Error('setTimeout has not been defined');
        }
        function s() {
          throw new Error('clearTimeout has not been defined');
        }
        try {
          r = 'function' == typeof setTimeout ? setTimeout : o;
        } catch (t) {
          r = o;
        }
        try {
          n = 'function' == typeof clearTimeout ? clearTimeout : s;
        } catch (t) {
          n = s;
        }
        function a(e) {
          if (r === setTimeout) return setTimeout(e, 0);
          if ((r === o || !r) && setTimeout) return (r = setTimeout)(e, 0);
          try {
            return r(e, 0);
          } catch (t) {
            try {
              return r.call(null, e, 0);
            } catch (t) {
              return r.call(this, e, 0);
            }
          }
        }
        var h,
          u = [],
          l = !1,
          c = -1;
        function d() {
          l &&
            h &&
            ((l = !1),
            h.length ? (u = h.concat(u)) : (c = -1),
            u.length && p());
        }
        function p() {
          if (!l) {
            for (var t = a(d), e = ((l = !0), u.length); e; ) {
              for (h = u, u = []; ++c < e; ) h && h[c].run();
              (c = -1), (e = u.length);
            }
            (h = null),
              (l = !1),
              !(function (e) {
                if (n === clearTimeout) return clearTimeout(e);
                if ((n === s || !n) && clearTimeout)
                  return (n = clearTimeout)(e);
                try {
                  n(e);
                } catch (t) {
                  try {
                    return n.call(null, e);
                  } catch (t) {
                    return n.call(this, e);
                  }
                }
              })(t);
          }
        }
        function f(t, e) {
          (this.fun = t), (this.array = e);
        }
        function m() {}
        (e.nextTick = function (t) {
          var e = new Array(arguments.length - 1);
          if (1 < arguments.length)
            for (var i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
          u.push(new f(t, e)), 1 !== u.length || l || a(p);
        }),
          (f.prototype.run = function () {
            this.fun.apply(null, this.array);
          }),
          (e.title = 'browser'),
          (e.browser = !0),
          (e.env = {}),
          (e.argv = []),
          (e.version = ''),
          (e.versions = {}),
          (e.on = m),
          (e.addListener = m),
          (e.once = m),
          (e.off = m),
          (e.removeListener = m),
          (e.removeAllListeners = m),
          (e.emit = m),
          (e.prependListener = m),
          (e.prependOnceListener = m),
          (e.listeners = function (t) {
            return [];
          }),
          (e.binding = function (t) {
            throw new Error('process.binding is not supported');
          }),
          (e.cwd = function () {
            return '/';
          }),
          (e.chdir = function (t) {
            throw new Error('process.chdir is not supported');
          }),
          (e.umask = function () {
            return 0;
          });
      },
      {},
    ],
    45: [
      function (t, I, A) {
        !function (O) {
          !function () {
            var t = this,
              e = 'object' == typeof A && A && !A.nodeType && A,
              i = 'object' == typeof I && I && !I.nodeType && I,
              r = 'object' == typeof O && O;
            (r.global !== r && r.window !== r && r.self !== r) || (t = r);
            var n,
              o,
              y = 2147483647,
              g = 36,
              v = 26,
              s = 38,
              a = 700,
              h = /^xn--/,
              u = /[^\x20-\x7E]/,
              l = /[\x2E\u3002\uFF0E\uFF61]/g,
              c = {
                overflow: 'Overflow: input needs wider integers to process',
                'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                'invalid-input': 'Invalid input',
              },
              d = g - 1,
              _ = Math.floor,
              x = String.fromCharCode;
            function b(t) {
              throw new RangeError(c[t]);
            }
            function p(t, e) {
              for (var i = t.length, r = []; i--; ) r[i] = e(t[i]);
              return r;
            }
            function f(t, e) {
              var i = t.split('@'),
                r = '',
                i =
                  (1 < i.length && ((r = i[0] + '@'), (t = i[1])),
                  (t = t.replace(l, '.')).split('.'));
              return r + p(i, e).join('.');
            }
            function T(t) {
              for (var e, i, r = [], n = 0, o = t.length; n < o; )
                55296 <= (e = t.charCodeAt(n++)) && e <= 56319 && n < o
                  ? 56320 == (64512 & (i = t.charCodeAt(n++)))
                    ? r.push(((1023 & e) << 10) + (1023 & i) + 65536)
                    : (r.push(e), n--)
                  : r.push(e);
              return r;
            }
            function m(t) {
              return p(t, function (t) {
                var e = '';
                return (
                  65535 < t &&
                    ((e += x((((t -= 65536) >>> 10) & 1023) | 55296)),
                    (t = 56320 | (1023 & t))),
                  (e += x(t))
                );
              }).join('');
            }
            function E(t, e) {
              return t + 22 + 75 * (t < 26) - ((0 != e) << 5);
            }
            function w(t, e, i) {
              var r = 0;
              for (
                t = i ? _(t / a) : t >> 1, t += _(t / e);
                (d * v) >> 1 < t;
                r += g
              )
                t = _(t / d);
              return _(r + ((d + 1) * t) / (t + s));
            }
            function P(t) {
              var e,
                i,
                r,
                n,
                o,
                s,
                a,
                h = [],
                u = t.length,
                l = 0,
                c = 128,
                d = 72,
                p = t.lastIndexOf('-');
              for (p < 0 && (p = 0), i = 0; i < p; ++i)
                128 <= t.charCodeAt(i) && b('not-basic'),
                  h.push(t.charCodeAt(i));
              for (r = 0 < p ? p + 1 : 0; r < u; ) {
                for (
                  n = l, o = 1, s = g;
                  u <= r && b('invalid-input'),
                    (a = t.charCodeAt(r++)),
                    (g <=
                      (a =
                        a - 48 < 10
                          ? a - 22
                          : a - 65 < 26
                          ? a - 65
                          : a - 97 < 26
                          ? a - 97
                          : g) ||
                      a > _((y - l) / o)) &&
                      b('overflow'),
                    (l += a * o),
                    !(a < (a = s <= d ? 1 : d + v <= s ? v : s - d));
                  s += g
                )
                  o > _(y / (a = g - a)) && b('overflow'), (o *= a);
                (d = w(l - n, (e = h.length + 1), 0 == n)),
                  _(l / e) > y - c && b('overflow'),
                  (c += _(l / e)),
                  (l %= e),
                  h.splice(l++, 0, c);
              }
              return m(h);
            }
            function S(t) {
              for (
                var e,
                  i,
                  r,
                  n,
                  o,
                  s,
                  a,
                  h,
                  u,
                  l,
                  c = [],
                  d = (t = T(t)).length,
                  p = 128,
                  f = 72,
                  m = (e = 0);
                m < d;
                ++m
              )
                (a = t[m]) < 128 && c.push(x(a));
              for (i = r = c.length, r && c.push('-'); i < d; ) {
                for (n = y, m = 0; m < d; ++m)
                  p <= (a = t[m]) && a < n && (n = a);
                for (
                  n - p > _((y - e) / (h = i + 1)) && b('overflow'),
                    e += (n - p) * h,
                    p = n,
                    m = 0;
                  m < d;
                  ++m
                )
                  if (((a = t[m]) < p && ++e > y && b('overflow'), a == p)) {
                    for (
                      o = e, s = g;
                      !(o < (u = s <= f ? 1 : f + v <= s ? v : s - f));
                      s += g
                    )
                      c.push(x(E(u + ((l = o - u) % (u = g - u)), 0))),
                        (o = _(l / u));
                    c.push(x(E(o, 0))), (f = w(e, h, i == r)), (e = 0), ++i;
                  }
                ++e, ++p;
              }
              return c.join('');
            }
            if (
              ((n = {
                version: '1.4.1',
                ucs2: { decode: T, encode: m },
                decode: P,
                encode: S,
                toASCII: function (t) {
                  return f(t, function (t) {
                    return u.test(t) ? 'xn--' + S(t) : t;
                  });
                },
                toUnicode: function (t) {
                  return f(t, function (t) {
                    return h.test(t) ? P(t.slice(4).toLowerCase()) : t;
                  });
                },
              }),
              'function' == typeof define &&
                'object' == typeof define.amd &&
                define.amd)
            )
              define('punycode', function () {
                return n;
              });
            else if (e && i)
              if (I.exports == e) i.exports = n;
              else for (o in n) n.hasOwnProperty(o) && (e[o] = n[o]);
            else t.punycode = n;
          }.call(this);
        }.call(
          this,
          'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
            ? self
            : 'undefined' != typeof window
            ? window
            : {}
        );
      },
      {},
    ],
    46: [
      function (t, e, i) {
        'use strict';
        e.exports = function (t, e, i, r) {
          i = i || '=';
          var n = {};
          if ('string' != typeof t || 0 === t.length) return n;
          var o = /\+/g,
            e = ((t = t.split((e = e || '&'))), 1e3),
            s =
              (r && 'number' == typeof r.maxKeys && (e = r.maxKeys), t.length);
          0 < e && e < s && (s = e);
          for (var a = 0; a < s; ++a) {
            var h,
              u = t[a].replace(o, '%20'),
              l = u.indexOf(i),
              l =
                0 <= l
                  ? ((h = u.substr(0, l)), u.substr(l + 1))
                  : ((h = u), ''),
              u = decodeURIComponent(h),
              l = decodeURIComponent(l);
            Object.prototype.hasOwnProperty.call(n, u)
              ? c(n[u])
                ? n[u].push(l)
                : (n[u] = [n[u], l])
              : (n[u] = l);
          }
          return n;
        };
        var c =
          Array.isArray ||
          function (t) {
            return '[object Array]' === Object.prototype.toString.call(t);
          };
      },
      {},
    ],
    47: [
      function (t, e, i) {
        'use strict';
        function o(t) {
          switch (typeof t) {
            case 'string':
              return t;
            case 'boolean':
              return t ? 'true' : 'false';
            case 'number':
              return isFinite(t) ? t : '';
            default:
              return '';
          }
        }
        e.exports = function (i, r, n, t) {
          return (
            (r = r || '&'),
            (n = n || '='),
            'object' == typeof (i = null === i ? void 0 : i)
              ? a(h(i), function (t) {
                  var e = encodeURIComponent(o(t)) + n;
                  return s(i[t])
                    ? a(i[t], function (t) {
                        return e + encodeURIComponent(o(t));
                      }).join(r)
                    : e + encodeURIComponent(o(i[t]));
                }).join(r)
              : t
              ? encodeURIComponent(o(t)) + n + encodeURIComponent(o(i))
              : ''
          );
        };
        var s =
          Array.isArray ||
          function (t) {
            return '[object Array]' === Object.prototype.toString.call(t);
          };
        function a(t, e) {
          if (t.map) return t.map(e);
          for (var i = [], r = 0; r < t.length; r++) i.push(e(t[r], r));
          return i;
        }
        var h =
          Object.keys ||
          function (t) {
            var e,
              i = [];
            for (e in t)
              Object.prototype.hasOwnProperty.call(t, e) && i.push(e);
            return i;
          };
      },
      {},
    ],
    48: [
      function (t, e, i) {
        'use strict';
        (i.decode = i.parse = t('./decode')),
          (i.encode = i.stringify = t('./encode'));
      },
      { './decode': 46, './encode': 47 },
    ],
    49: [
      function (t, e, i) {
        'use strict';
        function r(t) {
          return t && 'object' == typeof t && 'default' in t ? t.default : t;
        }
        Object.defineProperty(i, '__esModule', { value: !0 });
        var n = r(t('parse-uri')),
          s = r(t('mini-signals'));
        function o() {}
        function a(i, r, n, o) {
          var s = 0,
            a = i.length;
          !(function t(e) {
            e || s === a
              ? n && n(e)
              : o
              ? setTimeout(function () {
                  r(i[s++], t);
                }, 1)
              : r(i[s++], t);
          })();
        }
        function h(e, t) {
          if (null == t) t = 1;
          else if (0 === t) throw new Error('Concurrency must not be zero');
          var i = 0,
            r = {
              _tasks: [],
              concurrency: t,
              saturated: o,
              unsaturated: o,
              buffer: t / 4,
              empty: o,
              drain: o,
              error: o,
              started: !1,
              paused: !1,
              push: function (t, e) {
                n(t, !1, e);
              },
              kill: function () {
                (i = 0), (r.drain = o), (r.started = !1), (r._tasks = []);
              },
              unshift: function (t, e) {
                n(t, !0, e);
              },
              process: function () {
                for (; !r.paused && i < r.concurrency && r._tasks.length; ) {
                  var t = r._tasks.shift();
                  0 === r._tasks.length && r.empty(),
                    (i += 1) === r.concurrency && r.saturated(),
                    e(
                      t.data,
                      (function (e) {
                        return function () {
                          if (null === e)
                            throw new Error('Callback was already called.');
                          var t = e;
                          (e = null), t.apply(this, arguments);
                        };
                      })(
                        (function (t) {
                          return function () {
                            --i,
                              t.callback.apply(t, arguments),
                              null != arguments[0] &&
                                r.error(arguments[0], t.data),
                              i <= r.concurrency - r.buffer && r.unsaturated(),
                              r.idle() && r.drain(),
                              r.process();
                          };
                        })(t)
                      )
                    );
                }
              },
              length: function () {
                return r._tasks.length;
              },
              running: function () {
                return i;
              },
              idle: function () {
                return r._tasks.length + i === 0;
              },
              pause: function () {
                !0 !== r.paused && (r.paused = !0);
              },
              resume: function () {
                if (!1 !== r.paused) {
                  r.paused = !1;
                  for (var t = 1; t <= r.concurrency; t++) r.process();
                }
              },
            };
          function n(t, e, i) {
            if (null != i && 'function' != typeof i)
              throw new Error('task callback must be a function');
            (r.started = !0),
              null == t && r.idle()
                ? setTimeout(function () {
                    return r.drain();
                  }, 1)
                : ((t = { data: t, callback: 'function' == typeof i ? i : o }),
                  e ? r._tasks.unshift(t) : r._tasks.push(t),
                  setTimeout(function () {
                    return r.process();
                  }, 1));
          }
          return r;
        }
        var t = { eachSeries: a, queue: h },
          u = {};
        function l(t, e) {
          for (var i = 0; i < e.length; i++) {
            var r = e[i];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        function c(t, e, i) {
          e && l(t.prototype, e), i && l(t, i);
        }
        var d = !(
            !window.XDomainRequest || 'withCredentials' in new XMLHttpRequest()
          ),
          p = null;
        function f() {}
        var m = (function () {
          function o(t, e, i) {
            if ('string' != typeof t || 'string' != typeof e)
              throw new Error(
                'Both name and url are required for constructing a resource.'
              );
            (i = i || {}),
              (this._flags = 0),
              this._setFlag(o.STATUS_FLAGS.DATA_URL, 0 === e.indexOf('data:')),
              (this.name = t),
              (this.url = e),
              (this.extension = this._getExtension()),
              (this.data = null),
              (this.crossOrigin =
                !0 === i.crossOrigin ? 'anonymous' : i.crossOrigin),
              (this.timeout = i.timeout || 0),
              (this.loadType = i.loadType || this._determineLoadType()),
              (this.xhrType = i.xhrType),
              (this.metadata = i.metadata || {}),
              (this.error = null),
              (this.xhr = null),
              (this.children = []),
              (this.type = o.TYPE.UNKNOWN),
              (this.progressChunk = 0),
              (this._dequeue = f),
              (this._onLoadBinding = null),
              (this._elementTimer = 0),
              (this._boundComplete = this.complete.bind(this)),
              (this._boundOnError = this._onError.bind(this)),
              (this._boundOnProgress = this._onProgress.bind(this)),
              (this._boundOnTimeout = this._onTimeout.bind(this)),
              (this._boundXhrOnError = this._xhrOnError.bind(this)),
              (this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this)),
              (this._boundXhrOnAbort = this._xhrOnAbort.bind(this)),
              (this._boundXhrOnLoad = this._xhrOnLoad.bind(this)),
              (this.onStart = new s()),
              (this.onProgress = new s()),
              (this.onComplete = new s()),
              (this.onAfterMiddleware = new s());
          }
          (o.setExtensionLoadType = function (t, e) {
            y(o._loadTypeMap, t, e);
          }),
            (o.setExtensionXhrType = function (t, e) {
              y(o._xhrTypeMap, t, e);
            });
          var t = o.prototype;
          return (
            (t.complete = function () {
              this._clearEvents(), this._finish();
            }),
            (t.abort = function (t) {
              if (!this.error) {
                if (
                  ((this.error = new Error(t)), this._clearEvents(), this.xhr)
                )
                  this.xhr.abort();
                else if (this.xdr) this.xdr.abort();
                else if (this.data)
                  if (this.data.src) this.data.src = o.EMPTY_GIF;
                  else
                    for (; this.data.firstChild; )
                      this.data.removeChild(this.data.firstChild);
                this._finish();
              }
            }),
            (t.load = function (t) {
              var e = this;
              if (!this.isLoading)
                if (this.isComplete)
                  t &&
                    setTimeout(function () {
                      return t(e);
                    }, 1);
                else
                  switch (
                    (t && this.onComplete.once(t),
                    this._setFlag(o.STATUS_FLAGS.LOADING, !0),
                    this.onStart.dispatch(this),
                    (!1 !== this.crossOrigin &&
                      'string' == typeof this.crossOrigin) ||
                      (this.crossOrigin = this._determineCrossOrigin(this.url)),
                    this.loadType)
                  ) {
                    case o.LOAD_TYPE.IMAGE:
                      (this.type = o.TYPE.IMAGE), this._loadElement('image');
                      break;
                    case o.LOAD_TYPE.AUDIO:
                      (this.type = o.TYPE.AUDIO),
                        this._loadSourceElement('audio');
                      break;
                    case o.LOAD_TYPE.VIDEO:
                      (this.type = o.TYPE.VIDEO),
                        this._loadSourceElement('video');
                      break;
                    default:
                      o.LOAD_TYPE.XHR;
                      d && this.crossOrigin ? this._loadXdr() : this._loadXhr();
                  }
            }),
            (t._hasFlag = function (t) {
              return 0 != (this._flags & t);
            }),
            (t._setFlag = function (t, e) {
              this._flags = e ? this._flags | t : this._flags & ~t;
            }),
            (t._clearEvents = function () {
              clearTimeout(this._elementTimer),
                this.data &&
                  this.data.removeEventListener &&
                  (this.data.removeEventListener(
                    'error',
                    this._boundOnError,
                    !1
                  ),
                  this.data.removeEventListener(
                    'load',
                    this._boundComplete,
                    !1
                  ),
                  this.data.removeEventListener(
                    'progress',
                    this._boundOnProgress,
                    !1
                  ),
                  this.data.removeEventListener(
                    'canplaythrough',
                    this._boundComplete,
                    !1
                  )),
                this.xhr &&
                  (this.xhr.removeEventListener
                    ? (this.xhr.removeEventListener(
                        'error',
                        this._boundXhrOnError,
                        !1
                      ),
                      this.xhr.removeEventListener(
                        'timeout',
                        this._boundXhrOnTimeout,
                        !1
                      ),
                      this.xhr.removeEventListener(
                        'abort',
                        this._boundXhrOnAbort,
                        !1
                      ),
                      this.xhr.removeEventListener(
                        'progress',
                        this._boundOnProgress,
                        !1
                      ),
                      this.xhr.removeEventListener(
                        'load',
                        this._boundXhrOnLoad,
                        !1
                      ))
                    : ((this.xhr.onerror = null),
                      (this.xhr.ontimeout = null),
                      (this.xhr.onprogress = null),
                      (this.xhr.onload = null)));
            }),
            (t._finish = function () {
              if (this.isComplete)
                throw new Error(
                  'Complete called again for an already completed resource.'
                );
              this._setFlag(o.STATUS_FLAGS.COMPLETE, !0),
                this._setFlag(o.STATUS_FLAGS.LOADING, !1),
                this.onComplete.dispatch(this);
            }),
            (t._loadElement = function (t) {
              this.metadata.loadElement
                ? (this.data = this.metadata.loadElement)
                : 'image' === t && void 0 !== window.Image
                ? (this.data = new Image())
                : (this.data = document.createElement(t)),
                this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
                this.metadata.skipSource || (this.data.src = this.url),
                this.data.addEventListener('error', this._boundOnError, !1),
                this.data.addEventListener('load', this._boundComplete, !1),
                this.data.addEventListener(
                  'progress',
                  this._boundOnProgress,
                  !1
                ),
                this.timeout &&
                  (this._elementTimer = setTimeout(
                    this._boundOnTimeout,
                    this.timeout
                  ));
            }),
            (t._loadSourceElement = function (t) {
              if (
                (this.metadata.loadElement
                  ? (this.data = this.metadata.loadElement)
                  : 'audio' === t && void 0 !== window.Audio
                  ? (this.data = new Audio())
                  : (this.data = document.createElement(t)),
                null === this.data)
              )
                this.abort('Unsupported element: ' + t);
              else {
                if (
                  (this.crossOrigin &&
                    (this.data.crossOrigin = this.crossOrigin),
                  !this.metadata.skipSource)
                )
                  if (navigator.isCocoonJS)
                    this.data.src = Array.isArray(this.url)
                      ? this.url[0]
                      : this.url;
                  else if (Array.isArray(this.url))
                    for (
                      var e = this.metadata.mimeType, i = 0;
                      i < this.url.length;
                      ++i
                    )
                      this.data.appendChild(
                        this._createSource(
                          t,
                          this.url[i],
                          Array.isArray(e) ? e[i] : e
                        )
                      );
                  else {
                    var r = this.metadata.mimeType;
                    this.data.appendChild(
                      this._createSource(
                        t,
                        this.url,
                        Array.isArray(r) ? r[0] : r
                      )
                    );
                  }
                this.data.addEventListener('error', this._boundOnError, !1),
                  this.data.addEventListener('load', this._boundComplete, !1),
                  this.data.addEventListener(
                    'progress',
                    this._boundOnProgress,
                    !1
                  ),
                  this.data.addEventListener(
                    'canplaythrough',
                    this._boundComplete,
                    !1
                  ),
                  this.data.load(),
                  this.timeout &&
                    (this._elementTimer = setTimeout(
                      this._boundOnTimeout,
                      this.timeout
                    ));
              }
            }),
            (t._loadXhr = function () {
              'string' != typeof this.xhrType &&
                (this.xhrType = this._determineXhrType());
              var t = (this.xhr = new XMLHttpRequest());
              t.open('GET', this.url, !0),
                (t.timeout = this.timeout),
                this.xhrType === o.XHR_RESPONSE_TYPE.JSON ||
                this.xhrType === o.XHR_RESPONSE_TYPE.DOCUMENT
                  ? (t.responseType = o.XHR_RESPONSE_TYPE.TEXT)
                  : (t.responseType = this.xhrType),
                t.addEventListener('error', this._boundXhrOnError, !1),
                t.addEventListener('timeout', this._boundXhrOnTimeout, !1),
                t.addEventListener('abort', this._boundXhrOnAbort, !1),
                t.addEventListener('progress', this._boundOnProgress, !1),
                t.addEventListener('load', this._boundXhrOnLoad, !1),
                t.send();
            }),
            (t._loadXdr = function () {
              'string' != typeof this.xhrType &&
                (this.xhrType = this._determineXhrType());
              var t = (this.xhr = new XDomainRequest());
              (t.timeout = this.timeout || 5e3),
                (t.onerror = this._boundXhrOnError),
                (t.ontimeout = this._boundXhrOnTimeout),
                (t.onprogress = this._boundOnProgress),
                (t.onload = this._boundXhrOnLoad),
                t.open('GET', this.url, !0),
                setTimeout(function () {
                  return t.send();
                }, 1);
            }),
            (t._createSource = function (t, e, i) {
              i = i || t + '/' + this._getExtension(e);
              t = document.createElement('source');
              return (t.src = e), (t.type = i), t;
            }),
            (t._onError = function (t) {
              this.abort('Failed to load element using: ' + t.target.nodeName);
            }),
            (t._onProgress = function (t) {
              t &&
                t.lengthComputable &&
                this.onProgress.dispatch(this, t.loaded / t.total);
            }),
            (t._onTimeout = function () {
              this.abort('Load timed out.');
            }),
            (t._xhrOnError = function () {
              var t = this.xhr;
              this.abort(
                g(t) +
                  ' Request failed. Status: ' +
                  t.status +
                  ', text: "' +
                  t.statusText +
                  '"'
              );
            }),
            (t._xhrOnTimeout = function () {
              var t = this.xhr;
              this.abort(g(t) + ' Request timed out.');
            }),
            (t._xhrOnAbort = function () {
              var t = this.xhr;
              this.abort(g(t) + ' Request was aborted by the user.');
            }),
            (t._xhrOnLoad = function () {
              var t,
                e,
                i = this.xhr,
                r = '',
                n = void 0 === i.status ? 200 : i.status;
              if (
                (('' !== i.responseType &&
                  'text' !== i.responseType &&
                  void 0 !== i.responseType) ||
                  (r = i.responseText),
                0 === n &&
                (0 < r.length || i.responseType === o.XHR_RESPONSE_TYPE.BUFFER)
                  ? (n = 200)
                  : 1223 === n && (n = 204),
                2 != ((n / 100) | 0))
              )
                this.abort(
                  '[' + i.status + '] ' + i.statusText + ': ' + i.responseURL
                );
              else {
                if (this.xhrType === o.XHR_RESPONSE_TYPE.TEXT)
                  (this.data = r), (this.type = o.TYPE.TEXT);
                else if (this.xhrType === o.XHR_RESPONSE_TYPE.JSON)
                  try {
                    (this.data = JSON.parse(r)), (this.type = o.TYPE.JSON);
                  } catch (t) {
                    return void this.abort(
                      'Error trying to parse loaded json: ' + t
                    );
                  }
                else if (this.xhrType === o.XHR_RESPONSE_TYPE.DOCUMENT)
                  try {
                    window.DOMParser
                      ? ((t = new DOMParser()),
                        (this.data = t.parseFromString(r, 'text/xml')))
                      : (((e = document.createElement('div')).innerHTML = r),
                        (this.data = e)),
                      (this.type = o.TYPE.XML);
                  } catch (t) {
                    return void this.abort(
                      'Error trying to parse loaded xml: ' + t
                    );
                  }
                else this.data = i.response || r;
                this.complete();
              }
            }),
            (t._determineCrossOrigin = function (t, e) {
              if (0 === t.indexOf('data:')) return '';
              if (window.origin !== window.location.origin) return 'anonymous';
              (e = e || window.location),
                ((p = p || document.createElement('a')).href = t);
              var i =
                  (!(t = n(p.href, { strictMode: !0 })).port &&
                    '' === e.port) ||
                  t.port === e.port,
                r = t.protocol ? t.protocol + ':' : '';
              return t.host === e.hostname && i && r === e.protocol
                ? ''
                : 'anonymous';
            }),
            (t._determineXhrType = function () {
              return o._xhrTypeMap[this.extension] || o.XHR_RESPONSE_TYPE.TEXT;
            }),
            (t._determineLoadType = function () {
              return o._loadTypeMap[this.extension] || o.LOAD_TYPE.XHR;
            }),
            (t._getExtension = function () {
              var t,
                e,
                i = this.url;
              return (
                this.isDataUrl
                  ? ((e = i.indexOf('/')),
                    i.substring(e + 1, i.indexOf(';', e)))
                  : ((e = i.indexOf('?')),
                    (t = i.indexOf('#')),
                    (e = Math.min(
                      -1 < e ? e : i.length,
                      -1 < t ? t : i.length
                    )),
                    (i = i.substring(0, e)).substring(i.lastIndexOf('.') + 1))
              ).toLowerCase();
            }),
            (t._getMimeFromXhrType = function (t) {
              switch (t) {
                case o.XHR_RESPONSE_TYPE.BUFFER:
                  return 'application/octet-binary';
                case o.XHR_RESPONSE_TYPE.BLOB:
                  return 'application/blob';
                case o.XHR_RESPONSE_TYPE.DOCUMENT:
                  return 'application/xml';
                case o.XHR_RESPONSE_TYPE.JSON:
                  return 'application/json';
                case o.XHR_RESPONSE_TYPE.DEFAULT:
                case o.XHR_RESPONSE_TYPE.TEXT:
                default:
                  return 'text/plain';
              }
            }),
            c(o, [
              {
                key: 'isDataUrl',
                get: function () {
                  return this._hasFlag(o.STATUS_FLAGS.DATA_URL);
                },
              },
              {
                key: 'isComplete',
                get: function () {
                  return this._hasFlag(o.STATUS_FLAGS.COMPLETE);
                },
              },
              {
                key: 'isLoading',
                get: function () {
                  return this._hasFlag(o.STATUS_FLAGS.LOADING);
                },
              },
            ]),
            o
          );
        })();
        function y(t, e, i) {
          (e = e && 0 === e.indexOf('.') ? e.substring(1) : e) && (t[e] = i);
        }
        function g(t) {
          return t.toString().replace('object ', '');
        }
        (m.STATUS_FLAGS = { NONE: 0, DATA_URL: 1, COMPLETE: 2, LOADING: 4 }),
          (m.TYPE = {
            UNKNOWN: 0,
            JSON: 1,
            XML: 2,
            IMAGE: 3,
            AUDIO: 4,
            VIDEO: 5,
            TEXT: 6,
          }),
          (m.LOAD_TYPE = { XHR: 1, IMAGE: 2, AUDIO: 3, VIDEO: 4 }),
          (m.XHR_RESPONSE_TYPE = {
            DEFAULT: 'text',
            BUFFER: 'arraybuffer',
            BLOB: 'blob',
            DOCUMENT: 'document',
            JSON: 'json',
            TEXT: 'text',
          }),
          (m._loadTypeMap = {
            gif: m.LOAD_TYPE.IMAGE,
            png: m.LOAD_TYPE.IMAGE,
            bmp: m.LOAD_TYPE.IMAGE,
            jpg: m.LOAD_TYPE.IMAGE,
            jpeg: m.LOAD_TYPE.IMAGE,
            tif: m.LOAD_TYPE.IMAGE,
            tiff: m.LOAD_TYPE.IMAGE,
            webp: m.LOAD_TYPE.IMAGE,
            tga: m.LOAD_TYPE.IMAGE,
            svg: m.LOAD_TYPE.IMAGE,
            'svg+xml': m.LOAD_TYPE.IMAGE,
            mp3: m.LOAD_TYPE.AUDIO,
            ogg: m.LOAD_TYPE.AUDIO,
            wav: m.LOAD_TYPE.AUDIO,
            mp4: m.LOAD_TYPE.VIDEO,
            webm: m.LOAD_TYPE.VIDEO,
          }),
          (m._xhrTypeMap = {
            xhtml: m.XHR_RESPONSE_TYPE.DOCUMENT,
            html: m.XHR_RESPONSE_TYPE.DOCUMENT,
            htm: m.XHR_RESPONSE_TYPE.DOCUMENT,
            xml: m.XHR_RESPONSE_TYPE.DOCUMENT,
            tmx: m.XHR_RESPONSE_TYPE.DOCUMENT,
            svg: m.XHR_RESPONSE_TYPE.DOCUMENT,
            tsx: m.XHR_RESPONSE_TYPE.DOCUMENT,
            gif: m.XHR_RESPONSE_TYPE.BLOB,
            png: m.XHR_RESPONSE_TYPE.BLOB,
            bmp: m.XHR_RESPONSE_TYPE.BLOB,
            jpg: m.XHR_RESPONSE_TYPE.BLOB,
            jpeg: m.XHR_RESPONSE_TYPE.BLOB,
            tif: m.XHR_RESPONSE_TYPE.BLOB,
            tiff: m.XHR_RESPONSE_TYPE.BLOB,
            webp: m.XHR_RESPONSE_TYPE.BLOB,
            tga: m.XHR_RESPONSE_TYPE.BLOB,
            json: m.XHR_RESPONSE_TYPE.JSON,
            text: m.XHR_RESPONSE_TYPE.TEXT,
            txt: m.XHR_RESPONSE_TYPE.TEXT,
            ttf: m.XHR_RESPONSE_TYPE.BUFFER,
            otf: m.XHR_RESPONSE_TYPE.BUFFER,
          }),
          (m.EMPTY_GIF =
            'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
        var v =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        function _(t) {
          for (var e = '', i = 0; i < t.length; ) {
            for (var r = [0, 0, 0], n = [0, 0, 0, 0], o = 0; o < r.length; ++o)
              i < t.length ? (r[o] = 255 & t.charCodeAt(i++)) : (r[o] = 0);
            switch (
              ((n[0] = r[0] >> 2),
              (n[1] = ((3 & r[0]) << 4) | (r[1] >> 4)),
              (n[2] = ((15 & r[1]) << 2) | (r[2] >> 6)),
              (n[3] = 63 & r[2]),
              i - (t.length - 1))
            ) {
              case 2:
                (n[3] = 64), (n[2] = 64);
                break;
              case 1:
                n[3] = 64;
            }
            for (var s = 0; s < n.length; ++s) e += v.charAt(n[s]);
          }
          return e;
        }
        var x = window.URL || window.webkitURL;
        var b = {
            caching: function (t, e) {
              var i = this;
              u[t.url]
                ? ((t.data = u[t.url]), t.complete())
                : t.onComplete.once(function () {
                    return (u[i.url] = i.data);
                  }),
                e();
            },
            parsing: function (t, e) {
              if (t.data) {
                if (t.xhr && t.xhrType === m.XHR_RESPONSE_TYPE.BLOB)
                  if (window.Blob && 'string' != typeof t.data) {
                    var i;
                    if (0 === t.data.type.indexOf('image'))
                      return (
                        (i = x.createObjectURL(t.data)),
                        (t.blob = t.data),
                        (t.data = new Image()),
                        (t.data.src = i),
                        (t.type = m.TYPE.IMAGE),
                        void (t.data.onload = function () {
                          x.revokeObjectURL(i), (t.data.onload = null), e();
                        })
                      );
                  } else {
                    var r = t.xhr.getResponseHeader('content-type');
                    if (r && 0 === r.indexOf('image'))
                      return (
                        (t.data = new Image()),
                        (t.data.src =
                          'data:' + r + ';base64,' + _(t.xhr.responseText)),
                        (t.type = m.TYPE.IMAGE),
                        void (t.data.onload = function () {
                          (t.data.onload = null), e();
                        })
                      );
                  }
                e();
              } else e();
            },
          },
          T = /(#[\w-]+)?$/,
          E = (function () {
            function o(t, e) {
              var i = this;
              void 0 === e && (e = 10),
                (this.baseUrl = t = void 0 === t ? '' : t),
                (this.progress = 0),
                (this.loading = !1),
                (this.defaultQueryString = ''),
                (this._beforeMiddleware = []),
                (this._afterMiddleware = []),
                (this._resourcesParsing = []),
                (this._boundLoadResource = function (t, e) {
                  return i._loadResource(t, e);
                }),
                (this._queue = h(this._boundLoadResource, e)),
                this._queue.pause(),
                (this.resources = {}),
                (this.onProgress = new s()),
                (this.onError = new s()),
                (this.onLoad = new s()),
                (this.onStart = new s()),
                (this.onComplete = new s());
              for (var r = 0; r < o._defaultBeforeMiddleware.length; ++r)
                this.pre(o._defaultBeforeMiddleware[r]);
              for (var n = 0; n < o._defaultAfterMiddleware.length; ++n)
                this.use(o._defaultAfterMiddleware[n]);
            }
            var t = o.prototype;
            return (
              (t.add = function (t, e, i, r) {
                if (Array.isArray(t)) {
                  for (var n = 0; n < t.length; ++n) this.add(t[n]);
                  return this;
                }
                if (
                  ('object' == typeof t &&
                    ((r = e || t.callback || t.onComplete),
                    (e = (i = t).url),
                    (t = t.name || t.key || t.url)),
                  'string' != typeof e && ((r = i), (i = e), (e = t)),
                  'string' != typeof e)
                )
                  throw new Error('No url passed to add resource to loader.');
                if (
                  ('function' == typeof i && ((r = i), (i = null)),
                  this.loading && (!i || !i.parentResource))
                )
                  throw new Error(
                    'Cannot add resources while the loader is running.'
                  );
                if (this.resources[t])
                  throw new Error('Resource named "' + t + '" already exists.');
                if (
                  ((e = this._prepareUrl(e)),
                  (this.resources[t] = new m(t, e, i)),
                  'function' == typeof r &&
                    this.resources[t].onAfterMiddleware.once(r),
                  this.loading)
                ) {
                  for (
                    var o = i.parentResource, s = [], a = 0;
                    a < o.children.length;
                    ++a
                  )
                    o.children[a].isComplete || s.push(o.children[a]);
                  var h = (o.progressChunk * (s.length + 1)) / (s.length + 2);
                  o.children.push(this.resources[t]), (o.progressChunk = h);
                  for (var u = 0; u < s.length; ++u) s[u].progressChunk = h;
                  this.resources[t].progressChunk = h;
                }
                return this._queue.push(this.resources[t]), this;
              }),
              (t.pre = function (t) {
                return this._beforeMiddleware.push(t), this;
              }),
              (t.use = function (t) {
                return this._afterMiddleware.push(t), this;
              }),
              (t.reset = function () {
                for (var t in ((this.progress = 0),
                (this.loading = !1),
                this._queue.kill(),
                this._queue.pause(),
                this.resources)) {
                  t = this.resources[t];
                  t._onLoadBinding && t._onLoadBinding.detach(),
                    t.isLoading && t.abort();
                }
                return (this.resources = {}), this;
              }),
              (t.load = function (t) {
                if (
                  ('function' == typeof t && this.onComplete.once(t),
                  this.loading)
                )
                  return this;
                if (this._queue.idle()) this._onStart(), this._onComplete();
                else {
                  for (
                    var e = 100 / this._queue._tasks.length, i = 0;
                    i < this._queue._tasks.length;
                    ++i
                  )
                    this._queue._tasks[i].data.progressChunk = e;
                  this._onStart(), this._queue.resume();
                }
                return this;
              }),
              (t._prepareUrl = function (t) {
                var e = n(t, { strictMode: !0 });
                return (
                  (e =
                    e.protocol || !e.path || 0 === t.indexOf('//')
                      ? t
                      : this.baseUrl.length &&
                        this.baseUrl.lastIndexOf('/') !==
                          this.baseUrl.length - 1 &&
                        '/' !== t.charAt(0)
                      ? this.baseUrl + '/' + t
                      : this.baseUrl + t),
                  this.defaultQueryString &&
                    ((t = T.exec(e)[0]),
                    -1 !== (e = e.substr(0, e.length - t.length)).indexOf('?')
                      ? (e += '&' + this.defaultQueryString)
                      : (e += '?' + this.defaultQueryString),
                    (e += t)),
                  e
                );
              }),
              (t._loadResource = function (i, t) {
                var r = this;
                (i._dequeue = t),
                  a(
                    this._beforeMiddleware,
                    function (t, e) {
                      t.call(r, i, function () {
                        e(i.isComplete ? {} : null);
                      });
                    },
                    function () {
                      i.isComplete
                        ? r._onLoad(i)
                        : ((i._onLoadBinding = i.onComplete.once(r._onLoad, r)),
                          i.load());
                    },
                    !0
                  );
              }),
              (t._onStart = function () {
                (this.progress = 0),
                  (this.loading = !0),
                  this.onStart.dispatch(this);
              }),
              (t._onComplete = function () {
                (this.progress = 100),
                  (this.loading = !1),
                  this.onComplete.dispatch(this, this.resources);
              }),
              (t._onLoad = function (i) {
                var r = this;
                (i._onLoadBinding = null),
                  this._resourcesParsing.push(i),
                  i._dequeue(),
                  a(
                    this._afterMiddleware,
                    function (t, e) {
                      t.call(r, i, e);
                    },
                    function () {
                      i.onAfterMiddleware.dispatch(i),
                        (r.progress = Math.min(
                          100,
                          r.progress + i.progressChunk
                        )),
                        r.onProgress.dispatch(r, i),
                        i.error
                          ? r.onError.dispatch(i.error, r, i)
                          : r.onLoad.dispatch(r, i),
                        r._resourcesParsing.splice(
                          r._resourcesParsing.indexOf(i),
                          1
                        ),
                        r._queue.idle() &&
                          0 === r._resourcesParsing.length &&
                          r._onComplete();
                    },
                    !0
                  );
              }),
              c(o, [
                {
                  key: 'concurrency',
                  get: function () {
                    return this._queue.concurrency;
                  },
                  set: function (t) {
                    this._queue.concurrency = t;
                  },
                },
              ]),
              o
            );
          })();
        (E._defaultBeforeMiddleware = []),
          (E._defaultAfterMiddleware = []),
          (E.pre = function (t) {
            return E._defaultBeforeMiddleware.push(t), E;
          }),
          (E.use = function (t) {
            return E._defaultAfterMiddleware.push(t), E;
          }),
          (i.Loader = E),
          (i.Resource = m),
          (i.async = t),
          (i.encodeBinary = _),
          (i.middleware = b);
      },
      { 'mini-signals': 40, 'parse-uri': 42 },
    ],
    50: [
      function (h, t, u) {
        !function (i, a) {
          !function () {
            var r = h('process/browser.js').nextTick,
              t = Function.prototype.apply,
              n = Array.prototype.slice,
              o = {},
              s = 0;
            function e(t, e) {
              (this._id = t), (this._clearFn = e);
            }
            (u.setTimeout = function () {
              return new e(t.call(setTimeout, window, arguments), clearTimeout);
            }),
              (u.setInterval = function () {
                return new e(
                  t.call(setInterval, window, arguments),
                  clearInterval
                );
              }),
              (u.clearTimeout = u.clearInterval =
                function (t) {
                  t.close();
                }),
              (e.prototype.unref = e.prototype.ref = function () {}),
              (e.prototype.close = function () {
                this._clearFn.call(window, this._id);
              }),
              (u.enroll = function (t, e) {
                clearTimeout(t._idleTimeoutId), (t._idleTimeout = e);
              }),
              (u.unenroll = function (t) {
                clearTimeout(t._idleTimeoutId), (t._idleTimeout = -1);
              }),
              (u._unrefActive = u.active =
                function (t) {
                  clearTimeout(t._idleTimeoutId);
                  var e = t._idleTimeout;
                  0 <= e &&
                    (t._idleTimeoutId = setTimeout(function () {
                      t._onTimeout && t._onTimeout();
                    }, e));
                }),
              (u.setImmediate =
                'function' == typeof i
                  ? i
                  : function (t) {
                      var e = s++,
                        i = !(arguments.length < 2) && n.call(arguments, 1);
                      return (
                        (o[e] = !0),
                        r(function () {
                          o[e] &&
                            (i ? t.apply(null, i) : t.call(null),
                            u.clearImmediate(e));
                        }),
                        e
                      );
                    }),
              (u.clearImmediate =
                'function' == typeof a
                  ? a
                  : function (t) {
                      delete o[t];
                    });
          }.call(this);
        }.call(this, h('timers').setImmediate, h('timers').clearImmediate);
      },
      { 'process/browser.js': 44, timers: 50 },
    ],
    51: [
      function (t, e, i) {
        'use strict';
        var E = t('punycode'),
          w = t('./util');
        function b() {
          (this.protocol = null),
            (this.slashes = null),
            (this.auth = null),
            (this.host = null),
            (this.port = null),
            (this.hostname = null),
            (this.hash = null),
            (this.search = null),
            (this.query = null),
            (this.pathname = null),
            (this.path = null),
            (this.href = null);
        }
        (i.parse = n),
          (i.resolve = function (t, e) {
            return n(t, !1, !0).resolve(e);
          }),
          (i.resolveObject = function (t, e) {
            return t ? n(t, !1, !0).resolveObject(e) : e;
          }),
          (i.format = function (t) {
            w.isString(t) && (t = n(t));
            return t instanceof b ? t.format() : b.prototype.format.call(t);
          }),
          (i.Url = b);
        var P = /^([a-z0-9.+-]+:)/i,
          r = /:[0-9]*$/,
          S = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
          i = ['{', '}', '|', '\\', '^', '`'].concat([
            '<',
            '>',
            '"',
            '`',
            ' ',
            '\r',
            '\n',
            '\t',
          ]),
          O = ["'"].concat(i),
          I = ['%', '/', '?', ';', '#'].concat(O),
          A = ['/', '?', '#'],
          M = /^[+a-z0-9A-Z_-]{0,63}$/,
          D = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
          C = { javascript: !0, 'javascript:': !0 },
          R = { javascript: !0, 'javascript:': !0 },
          L = {
            http: !0,
            https: !0,
            ftp: !0,
            gopher: !0,
            file: !0,
            'http:': !0,
            'https:': !0,
            'ftp:': !0,
            'gopher:': !0,
            'file:': !0,
          },
          N = t('querystring');
        function n(t, e, i) {
          if (t && w.isObject(t) && t instanceof b) return t;
          var r = new b();
          return r.parse(t, e, i), r;
        }
        (b.prototype.parse = function (t, e, i) {
          if (!w.isString(t))
            throw new TypeError(
              "Parameter 'url' must be a string, not " + typeof t
            );
          var r = t.indexOf('?'),
            r = -1 !== r && r < t.indexOf('#') ? '?' : '#',
            n = t.split(r);
          n[0] = n[0].replace(/\\/g, '/');
          var o = (o = t = n.join(r)).trim();
          if (!i && 1 === t.split('#').length) {
            n = S.exec(o);
            if (n)
              return (
                (this.path = o),
                (this.href = o),
                (this.pathname = n[1]),
                n[2]
                  ? ((this.search = n[2]),
                    (this.query = e
                      ? N.parse(this.search.substr(1))
                      : this.search.substr(1)))
                  : e && ((this.search = ''), (this.query = {})),
                this
              );
          }
          var s,
            r = P.exec(o);
          if (
            (r &&
              ((s = (r = r[0]).toLowerCase()),
              (this.protocol = s),
              (o = o.substr(r.length))),
            !(i || r || o.match(/^\/\/[^@\/]+@[^@\/]+/)) ||
              !(x = '//' === o.substr(0, 2)) ||
              (r && R[r]) ||
              ((o = o.substr(2)), (this.slashes = !0)),
            !R[r] && (x || (r && !L[r])))
          ) {
            for (var a = -1, h = 0; h < A.length; h++)
              -1 !== (u = o.indexOf(A[h])) && (-1 === a || u < a) && (a = u);
            -1 !==
              (t = -1 === a ? o.lastIndexOf('@') : o.lastIndexOf('@', a)) &&
              ((n = o.slice(0, t)),
              (o = o.slice(t + 1)),
              (this.auth = decodeURIComponent(n)));
            for (var u, a = -1, h = 0; h < I.length; h++)
              -1 !== (u = o.indexOf(I[h])) && (-1 === a || u < a) && (a = u);
            -1 === a && (a = o.length),
              (this.host = o.slice(0, a)),
              (o = o.slice(a)),
              this.parseHost(),
              (this.hostname = this.hostname || '');
            i =
              '[' === this.hostname[0] &&
              ']' === this.hostname[this.hostname.length - 1];
            if (!i)
              for (
                var l = this.hostname.split(/\./), h = 0, c = l.length;
                h < c;
                h++
              ) {
                var d = l[h];
                if (d && !d.match(M)) {
                  for (var p = '', f = 0, m = d.length; f < m; f++)
                    127 < d.charCodeAt(f) ? (p += 'x') : (p += d[f]);
                  if (!p.match(M)) {
                    var y = l.slice(0, h),
                      g = l.slice(h + 1),
                      v = d.match(D);
                    v && (y.push(v[1]), g.unshift(v[2])),
                      g.length && (o = '/' + g.join('.') + o),
                      (this.hostname = y.join('.'));
                    break;
                  }
                }
              }
            255 < this.hostname.length
              ? (this.hostname = '')
              : (this.hostname = this.hostname.toLowerCase()),
              i || (this.hostname = E.toASCII(this.hostname));
            var _ = this.port ? ':' + this.port : '',
              x = this.hostname || '';
            (this.host = x + _),
              (this.href += this.host),
              i &&
                ((this.hostname = this.hostname.substr(
                  1,
                  this.hostname.length - 2
                )),
                '/' !== o[0] && (o = '/' + o));
          }
          if (!C[s])
            for (h = 0, c = O.length; h < c; h++) {
              var b,
                T = O[h];
              -1 !== o.indexOf(T) &&
                ((b = encodeURIComponent(T)) === T && (b = escape(T)),
                (o = o.split(T).join(b)));
            }
          (r = o.indexOf('#')),
            -1 !== r && ((this.hash = o.substr(r)), (o = o.slice(0, r))),
            (t = o.indexOf('?'));
          return (
            -1 !== t
              ? ((this.search = o.substr(t)),
                (this.query = o.substr(t + 1)),
                e && (this.query = N.parse(this.query)),
                (o = o.slice(0, t)))
              : e && ((this.search = ''), (this.query = {})),
            o && (this.pathname = o),
            L[s] && this.hostname && !this.pathname && (this.pathname = '/'),
            (this.pathname || this.search) &&
              ((_ = this.pathname || ''),
              (n = this.search || ''),
              (this.path = _ + n)),
            (this.href = this.format()),
            this
          );
        }),
          (b.prototype.format = function () {
            var t = this.auth || '',
              e =
                (t &&
                  ((t = (t = encodeURIComponent(t)).replace(/%3A/i, ':')),
                  (t += '@')),
                this.protocol || ''),
              i = this.pathname || '',
              r = this.hash || '',
              n = !1,
              o = '',
              t =
                (this.host
                  ? (n = t + this.host)
                  : this.hostname &&
                    ((n =
                      t +
                      (-1 === this.hostname.indexOf(':')
                        ? this.hostname
                        : '[' + this.hostname + ']')),
                    this.port && (n += ':' + this.port)),
                this.query &&
                  w.isObject(this.query) &&
                  Object.keys(this.query).length &&
                  (o = N.stringify(this.query)),
                this.search || (o && '?' + o) || '');
            return (
              e && ':' !== e.substr(-1) && (e += ':'),
              this.slashes || ((!e || L[e]) && !1 !== n)
                ? ((n = '//' + (n || '')),
                  i && '/' !== i.charAt(0) && (i = '/' + i))
                : (n = n || ''),
              r && '#' !== r.charAt(0) && (r = '#' + r),
              t && '?' !== t.charAt(0) && (t = '?' + t),
              e +
                n +
                (i = i.replace(/[?#]/g, function (t) {
                  return encodeURIComponent(t);
                })) +
                (t = t.replace('#', '%23')) +
                r
            );
          }),
          (b.prototype.resolve = function (t) {
            return this.resolveObject(n(t, !1, !0)).format();
          }),
          (b.prototype.resolveObject = function (t) {
            w.isString(t) && ((d = new b()).parse(t, !1, !0), (t = d));
            for (
              var e = new b(), i = Object.keys(this), r = 0;
              r < i.length;
              r++
            ) {
              var n = i[r];
              e[n] = this[n];
            }
            if (((e.hash = t.hash), '' === t.href))
              return (e.href = e.format()), e;
            if (t.slashes && !t.protocol) {
              for (var o = Object.keys(t), s = 0; s < o.length; s++) {
                var a = o[s];
                'protocol' !== a && (e[a] = t[a]);
              }
              return (
                L[e.protocol] &&
                  e.hostname &&
                  !e.pathname &&
                  (e.path = e.pathname = '/'),
                (e.href = e.format()),
                e
              );
            }
            if (t.protocol && t.protocol !== e.protocol) {
              if (!L[t.protocol]) {
                for (var h = Object.keys(t), u = 0; u < h.length; u++) {
                  var l = h[u];
                  e[l] = t[l];
                }
                return (e.href = e.format()), e;
              }
              if (((e.protocol = t.protocol), t.host || R[t.protocol]))
                e.pathname = t.pathname;
              else {
                for (
                  var c = (t.pathname || '').split('/');
                  c.length && !(t.host = c.shift());

                );
                t.host || (t.host = ''),
                  t.hostname || (t.hostname = ''),
                  '' !== c[0] && c.unshift(''),
                  c.length < 2 && c.unshift(''),
                  (e.pathname = c.join('/'));
              }
              return (
                (e.search = t.search),
                (e.query = t.query),
                (e.host = t.host || ''),
                (e.auth = t.auth),
                (e.hostname = t.hostname || t.host),
                (e.port = t.port),
                (e.pathname || e.search) &&
                  ((d = e.pathname || ''),
                  (p = e.search || ''),
                  (e.path = d + p)),
                (e.slashes = e.slashes || t.slashes),
                (e.href = e.format()),
                e
              );
            }
            var d = e.pathname && '/' === e.pathname.charAt(0),
              p = t.host || (t.pathname && '/' === t.pathname.charAt(0)),
              d = p || d || (e.host && t.pathname),
              f = d,
              m = (e.pathname && e.pathname.split('/')) || [],
              c = (t.pathname && t.pathname.split('/')) || [],
              y = e.protocol && !L[e.protocol];
            if (
              (y &&
                ((e.hostname = ''),
                (e.port = null),
                e.host && ('' === m[0] ? (m[0] = e.host) : m.unshift(e.host)),
                (e.host = ''),
                t.protocol &&
                  ((t.hostname = null),
                  (t.port = null),
                  t.host && ('' === c[0] ? (c[0] = t.host) : c.unshift(t.host)),
                  (t.host = null)),
                (d = d && ('' === c[0] || '' === m[0]))),
              p)
            )
              (e.host = (t.host || '' === t.host ? t : e).host),
                (e.hostname = (
                  t.hostname || '' === t.hostname ? t : e
                ).hostname),
                (e.search = t.search),
                (e.query = t.query),
                (m = c);
            else if (c.length)
              (m = m || []).pop(),
                (m = m.concat(c)),
                (e.search = t.search),
                (e.query = t.query);
            else if (!w.isNullOrUndefined(t.search))
              return (
                y &&
                  ((e.hostname = e.host = m.shift()),
                  (x =
                    !!(e.host && 0 < e.host.indexOf('@')) &&
                    e.host.split('@')) &&
                    ((e.auth = x.shift()), (e.host = e.hostname = x.shift()))),
                (e.search = t.search),
                (e.query = t.query),
                (w.isNull(e.pathname) && w.isNull(e.search)) ||
                  (e.path = (e.pathname || '') + (e.search || '')),
                (e.href = e.format()),
                e
              );
            if (!m.length)
              return (
                (e.pathname = null),
                e.search ? (e.path = '/' + e.search) : (e.path = null),
                (e.href = e.format()),
                e
              );
            for (
              var g = m.slice(-1)[0],
                p =
                  ((e.host || t.host || 1 < m.length) &&
                    ('.' === g || '..' === g)) ||
                  '' === g,
                v = 0,
                _ = m.length;
              0 <= _;
              _--
            )
              '.' === (g = m[_])
                ? m.splice(_, 1)
                : '..' === g
                ? (m.splice(_, 1), v++)
                : v && (m.splice(_, 1), v--);
            if (!d && !f) for (; v--; ) m.unshift('..');
            !d ||
              '' === m[0] ||
              (m[0] && '/' === m[0].charAt(0)) ||
              m.unshift(''),
              p && '/' !== m.join('/').substr(-1) && m.push('');
            var x,
              f = '' === m[0] || (m[0] && '/' === m[0].charAt(0));
            return (
              y &&
                ((e.hostname = e.host = !f && m.length ? m.shift() : ''),
                (x =
                  !!(e.host && 0 < e.host.indexOf('@')) && e.host.split('@')) &&
                  ((e.auth = x.shift()), (e.host = e.hostname = x.shift()))),
              (d = d || (e.host && m.length)) && !f && m.unshift(''),
              m.length
                ? (e.pathname = m.join('/'))
                : ((e.pathname = null), (e.path = null)),
              (w.isNull(e.pathname) && w.isNull(e.search)) ||
                (e.path = (e.pathname || '') + (e.search || '')),
              (e.auth = t.auth || e.auth),
              (e.slashes = e.slashes || t.slashes),
              (e.href = e.format()),
              e
            );
          }),
          (b.prototype.parseHost = function () {
            var t = this.host,
              e = r.exec(t);
            e &&
              (':' !== (e = e[0]) && (this.port = e.substr(1)),
              (t = t.substr(0, t.length - e.length))),
              t && (this.hostname = t);
          });
      },
      { './util': 52, punycode: 45, querystring: 48 },
    ],
    52: [
      function (t, e, i) {
        'use strict';
        e.exports = {
          isString: function (t) {
            return 'string' == typeof t;
          },
          isObject: function (t) {
            return 'object' == typeof t && null !== t;
          },
          isNull: function (t) {
            return null === t;
          },
          isNullOrUndefined: function (t) {
            return null == t;
          },
        };
      },
      {},
    ],
    53: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 }), (i.Viz = void 0);
        var r = t('./animation/engine/Stage');
        function n(t) {
          var e,
            i = this;
          if (
            ((this.options = t),
            (this.waveform = {
              timeDomainData: new Float32Array(n.BIN_COUNT),
              timeDomainDataSmooth: new Float32Array(n.BIN_COUNT),
              minimumGain: 0,
              maximumGain: 0,
              averageGain: 0,
              averageGainLinearized: 0,
              averageGainFirstOrder: 0,
            }),
            !(e =
              'string' == typeof t.container
                ? document.querySelector(t.container)
                : t.container))
          )
            throw new Error('Container not found');
          (this.stage = new r.Stage(e, this)),
            this.stage.start(),
            new ResizeObserver(function (t) {
              return i.onContainerResized();
            }).observe(e),
            !1 !== t.startAnalysis && this.start();
        }
        (n.prototype.start = function () {
          (this.context = new AudioContext()),
            (this.gain = this.context.createGain()),
            (this.audio = this.options.source);
          var t = this.context.createMediaElementSource(this.audio);
          (this.analyser = this.context.createAnalyser()),
            (this.analyser.fftSize = n.BIN_COUNT),
            t.connect(this.gain),
            this.gain.connect(this.analyser),
            this.analyser.connect(this.context.destination),
            (this.lastUpdateDate = new Date()),
            this.updateStats();
        }),
          (n.prototype.updateStats = function () {
            var t = (Date.now() - this.lastUpdateDate.getTime()) / 1e3;
            if (1 < t)
              return (
                (this.lastUpdateDate = new Date()),
                void requestAnimationFrame(this.updateStats.bind(this))
              );
            this.analyser.getFloatTimeDomainData(this.waveform.timeDomainData),
              (this.waveform.averageGain =
                this.waveform.timeDomainData.reduce(function (t, e) {
                  return t + Math.abs(e);
                }, 0) / this.analyser.frequencyBinCount),
              (this.waveform.minimumGain = this.waveform.timeDomainData.reduce(
                function (t, e) {
                  return Math.min(t, e);
                },
                this.waveform.timeDomainData[0]
              )),
              (this.waveform.maximumGain = this.waveform.timeDomainData.reduce(
                function (t, e) {
                  return Math.max(t, e);
                },
                this.waveform.timeDomainData[0]
              )),
              (this.waveform.averageGainLinearized +=
                t *
                (this.waveform.averageGain > this.waveform.averageGainLinearized
                  ? 1
                  : -1)),
              (this.waveform.averageGainFirstOrder +=
                0.5 *
                (this.waveform.averageGain -
                  this.waveform.averageGainFirstOrder) *
                t);
            for (var e = 0; e < this.waveform.timeDomainData.length; ++e) {
              var i = this.waveform.timeDomainData[e];
              i > this.waveform.timeDomainDataSmooth[e]
                ? (this.waveform.timeDomainDataSmooth[e] = i)
                : (this.waveform.timeDomainDataSmooth[e] +=
                    0.5 * (i - this.waveform.timeDomainDataSmooth[e]) * t);
            }
            (this.lastUpdateDate = new Date()),
              requestAnimationFrame(this.updateStats.bind(this));
          }),
          (n.prototype.onContainerResized = function () {
            this.stage.resize();
          }),
          (n.prototype.flip = function () {
            var t = this.stage.powerCircle;
            if (!t) throw new Error('Unable to make the PowerCircle flip');
            t.flip();
          }),
          (n.BIN_COUNT = 256),
          (i.Viz = n);
      },
      { './animation/engine/Stage': 62 },
    ],
    54: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          t =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.AnimatedBackground = void 0),
            t('../engine/DisplayObject')),
          t =
            ((n = t.DisplayObject),
            o(s, n),
            (s.prototype.redraw = function () {
              var t;
              void 0 !== this.graphics &&
                ((t =
                  (17 *
                    (Math.min(
                      50,
                      256 * this.stage.viz.waveform.averageGainFirstOrder
                    ) /
                      50)) |
                  0),
                (t = parseInt(
                  '0x' + ((t << 16) | (t << 8) | t).toString(16),
                  16
                )),
                this.graphics.clear(),
                this.graphics.beginFill(t),
                this.graphics.drawRect(
                  0,
                  0,
                  this.stage.getWidth(),
                  this.stage.getHeight()
                ),
                this.graphics.endFill());
            }),
            s);
        function s() {
          return (null !== n && n.apply(this, arguments)) || this;
        }
        i.AnimatedBackground = t;
      },
      { '../engine/DisplayObject': 59 },
    ],
    55: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          t =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.Node = void 0),
            t('../engine/DisplayObject')),
          t =
            ((n = t.DisplayObject),
            o(s, n),
            (s.prototype.update = function (t) {
              n.prototype.update.call(this, t);
              var e = Math.max(0.1, 8 * this.stage.viz.waveform.averageGain);
              (this.position.x += t * this.velocity.x * (e - 1)),
                (this.position.y += t * this.velocity.y * (e - 1)),
                this.x < 0
                  ? (this.x = this.stage.getWidth())
                  : this.x > this.stage.getWidth() && (this.x = 0),
                this.y < 0
                  ? (this.y = this.stage.getHeight())
                  : this.y > this.stage.getHeight() && (this.y = 0),
                this.redraw();
            }),
            (s.prototype.redraw = function () {
              var t, e;
              void 0 !== this.graphics &&
                ((t =
                  (255 *
                    (0.5 +
                      Math.min(8, 64 * this.stage.viz.waveform.averageGain) /
                        16)) |
                  0),
                (t = parseInt(
                  '0x' + ((t << 16) | (t << 8) | t).toString(16),
                  16
                )),
                this.graphics.clear(),
                (e =
                  6 *
                  (this.radius +
                    4 * this.stage.viz.waveform.averageGainFirstOrder) *
                  (1 - Math.exp(-3 * this.stage.viz.waveform.averageGain))),
                this.graphics.lineStyle(
                  4,
                  0.15 < this.stage.viz.waveform.averageGain ? this.color : t,
                  0.3
                ),
                this.graphics.drawCircle(0, 0, e),
                this.graphics.lineStyle(0),
                this.graphics.beginFill(
                  0.15 < this.stage.viz.waveform.averageGain ? this.color : t
                ),
                this.graphics.drawCircle(
                  0,
                  0,
                  this.radius +
                    4 * this.stage.viz.waveform.averageGainFirstOrder
                ),
                this.graphics.endFill());
            }),
            s);
        function s(t) {
          t = n.call(this, t) || this;
          return (
            (t.radius = 2 + 4 * Math.random()),
            (t.color = 16777215 * (0.5 * Math.random() + 0.5)),
            t.setFriction(1),
            t
          );
        }
        i.Node = t;
      },
      { '../engine/DisplayObject': 59 },
    ],
    56: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          s =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.NodeContainer = void 0),
            t('../engine/DisplayObjectContainer')),
          a = t('./Node'),
          h = t('./NodeLinker'),
          t =
            ((n = s.DisplayObjectContainer),
            o(u, n),
            (u.prototype.populate = function () {
              for (var t = 10; t < this.stage.getWidth(); t += 200)
                for (var e = 10; e < this.stage.getHeight(); e += 200)
                  this.addNode(
                    t + 12 * Math.random(),
                    e + 12 * Math.random(),
                    0,
                    0
                  );
            }),
            (u.prototype.addNode = function (t, e, i, r) {
              var n = new a.Node(this.stage);
              n.position.set(t, e),
                n.velocity.set(i, r),
                this.nodes.addChild(n);
            }),
            u);
        function u(t, e) {
          t = n.call(this, t) || this;
          return (
            (t.nodes = new s.DisplayObjectContainer(t.stage)),
            t.addChild(t.nodes),
            t.addChildAt(new h.NodeLinker(t.stage, t.nodes), 0),
            (t.circle = e),
            t
          );
        }
        i.NodeContainer = t;
      },
      {
        '../engine/DisplayObjectContainer': 60,
        './Node': 55,
        './NodeLinker': 57,
      },
    ],
    57: [
      function (t, e, i) {
        'use strict';
        var r,
          p,
          n =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          o =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.NodeLinker = void 0),
            t('../engine/DisplayObject')),
          f = t('../engine/Point'),
          m = t('pixi.js'),
          t =
            ((p = o.DisplayObject),
            n(s, p),
            (s.prototype.update = function (t) {
              p.prototype.update.call(this, t);
              var e = this.nodeParent.children.length,
                t = this.parent;
              (this.centerPosition.x = t.circle.position.x),
                (this.centerPosition.y = t.circle.position.y);
              for (var i = 0; i < e; i++) {
                var r = this.nodeParent.children[i],
                  n = Math.atan2(
                    r.position.y - this.centerPosition.y,
                    r.position.x - this.centerPosition.x
                  ),
                  o = f.Point.distance(r.position, this.centerPosition),
                  s = (1e5 * -Math.cos(n)) / o,
                  n = (1e5 * -Math.sin(n)) / o;
                r.setForce('tocenter', { x: s, y: n });
                for (var a = i + 1; a < e; a++) {
                  var h,
                    u,
                    l,
                    c = this.nodeParent.children[a],
                    d = f.Point.distance(r.position, c.position);
                  300 < d
                    ? (r.clearForce('node_' + c.id),
                      c.clearForce('node_' + r.id))
                    : ((h = Math.atan2(
                        r.position.y - c.position.y,
                        r.position.x - c.position.x
                      )),
                      (l = u = 0) != d &&
                        ((u = (1e4 * Math.cos(h)) / d),
                        (l = (1e4 * Math.sin(h)) / d)),
                      r.setForce('node_' + c.id, new m.Point(-u, -l)),
                      c.setForce('node_' + r.id, new m.Point(u, l)));
                }
              }
              this.redraw();
            }),
            (s.prototype.redraw = function () {
              if (void 0 !== this.graphics) {
                this.graphics.clear(),
                  this.graphics.lineStyle(1, 16777215, 0.2);
                for (
                  var t = this.nodeParent.children.length, e = 0;
                  e < t;
                  ++e
                ) {
                  var i = this.nodeParent.children[e];
                  f.Point.distance(i.position, this.centerPosition) >
                    2 * this.parent.circle.radius ||
                    (this.graphics.moveTo(i.position.x, i.position.y),
                    this.graphics.lineTo(
                      this.centerPosition.x,
                      this.centerPosition.y
                    ));
                }
              }
            }),
            s);
        function s(t, e) {
          t = p.call(this, t) || this;
          return (t.nodeParent = e), (t.centerPosition = new m.Point(0, 0)), t;
        }
        i.NodeLinker = t;
      },
      { '../engine/DisplayObject': 59, '../engine/Point': 61, 'pixi.js': 43 },
    ],
    58: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          s =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.PowerCircle = void 0),
            t('../engine/DisplayObject')),
          a = t('pixi.js'),
          h = t('../engine/Point'),
          t =
            ((n = s.DisplayObject),
            o(u, n),
            (u.prototype.setBaseRadius = function (t) {
              this.baseRadius = t;
            }),
            (u.prototype.setCenter = function (t, e) {
              (this.centerX = t), (this.centerY = e);
            }),
            (u.prototype.update = function (t) {
              n.prototype.update.call(this, t),
                (this.eyesClosed =
                  Math.floor((10 * Date.now()) / 1e3) % 30 == 0),
                (this.lineWidth =
                  1 + 8 * this.stage.viz.waveform.averageGainLinearized),
                (this.filter.blur = Math.floor(
                  0.2 +
                    4 *
                      Math.exp(
                        -24 * this.stage.viz.waveform.averageGainLinearized
                      )
                )),
                (this.radius =
                  this.baseRadius +
                  100 * this.stage.viz.waveform.averageGainLinearized),
                this.setForce('main', {
                  x:
                    (this.targetPosition.x - this.position.x) *
                    this.stage.viz.waveform.averageGainFirstOrder *
                    16,
                  y:
                    (this.targetPosition.y - this.position.y) *
                    this.stage.viz.waveform.averageGainFirstOrder *
                    16,
                }),
                Date.now() > 800 + this.lastUpdateRandomPosition &&
                  ((this.randomAngle = 2 * Math.random() * Math.PI),
                  (this.lastUpdateRandomPosition = Date.now())),
                Date.now() > 1400 + this.lastUpdateRandomRotation &&
                  ((this.targetRotation =
                    2 *
                    this.stage.viz.waveform.averageGainFirstOrder *
                    (Math.random() - 0.5)),
                  Math.random() < 0.05 &&
                    0.25 <= this.stage.viz.waveform.averageGainFirstOrder &&
                    (this.targetBaseRotation -= 2 * Math.PI),
                  (this.lastUpdateRandomRotation = Date.now())),
                (this.rotationAcceleration =
                  (this.targetRotation +
                    this.targetBaseRotation -
                    this.rotation) *
                  this.stage.viz.waveform.averageGainFirstOrder *
                  16),
                (this.rotationAcceleration += 2 * -this.rotationVelocity),
                (this.rotationVelocity += this.rotationAcceleration * t),
                (this.rotation += this.rotationVelocity * t),
                this.updatePosition(),
                this.redraw();
            }),
            (u.prototype.updatePosition = function () {
              var t = 256 * this.stage.viz.waveform.averageGainFirstOrder,
                e = Math.cos(this.randomAngle) * t,
                i = Math.sin(this.randomAngle) * t,
                r = this.stage.renderer.plugins.interaction.mouse.global,
                t = Math.min(t, h.Point.distance(r, this.position)),
                r = Math.atan2(r.y - this.position.x, r.x - this.position.y),
                n = Math.cos(r) * t,
                r = Math.sin(r) * t;
              (this.targetPosition.x = this.centerX + e + n),
                (this.targetPosition.y = this.centerY + i + r);
            }),
            (u.prototype.redraw = function () {
              if (void 0 !== this.graphics) {
                this.graphics.clear();
                for (
                  var t = this.stage.viz.waveform.timeDomainDataSmooth,
                    e =
                      t.reduce(function (t, e) {
                        return t + e;
                      }, 0) / t.length,
                    i = t.reduce(function (t, e) {
                      return Math.min(t, e);
                    }, t[0]),
                    r = this.radius,
                    n = [],
                    o = [],
                    s = 0,
                    a = Math.PI / 2 - (0.5 * Math.PI) / t.length;
                  s < t.length;
                  ++s, a += Math.PI / t.length
                ) {
                  var h = Math.max(0, t[s] - i),
                    u = Math.cos(a) * (this.radius + r * h),
                    h = Math.sin(a) * (this.radius + r * h),
                    l = Math.max(0, t[s] - e),
                    c = Math.cos(a) * (5 + this.radius + r * l),
                    l = Math.sin(a) * (5 + this.radius + r * l);
                  n.push({ x: u, y: h }), o.push({ x: c, y: l });
                }
                for (s = n.length - 1; 0 <= s; --s)
                  n.push({ x: -n[s].x, y: n[s].y }),
                    o.push({ x: -o[s].x, y: o[s].y });
                this.graphics.beginFill(16777215, 0.02),
                  this.graphics.lineStyle(this.lineWidth, 16777215, 0.2),
                  this.graphics.moveTo(n[0].x, n[0].y);
                for (var d = 0, p = n; d < p.length; d++) {
                  var f = p[d];
                  this.graphics.lineTo(f.x, f.y);
                }
                this.graphics.beginFill(16777215, 0.2),
                  this.graphics.lineStyle(this.lineWidth, 16777215, 1),
                  this.graphics.moveTo(o[0].x, o[0].y);
                for (var m = 0, y = o; m < y.length; m++) {
                  f = y[m];
                  this.graphics.lineTo(f.x, f.y);
                }
                this.graphics.beginFill(1118481, 1),
                  this.graphics.lineStyle(this.lineWidth, 16777215),
                  this.graphics.drawCircle(0, 0, this.radius),
                  this.graphics.endFill(),
                  this.graphics.lineStyle(this.lineWidth, 16777215),
                  this.graphics.drawCircle(0, 0, this.radius);
                var g = this.eyesClosed
                    ? 0.02 * this.radius
                    : 0.1 * this.radius,
                  v = 0.3 * -this.radius;
                this.graphics.lineStyle(1, 16777215),
                  this.graphics.beginFill(16777215, 1),
                  this.graphics.drawRect(0.5 * -g, v - 0.5 * g, g, g),
                  this.graphics.drawRect(
                    0.3 * this.radius - 0.5 * g,
                    v - 0.5 * g,
                    g,
                    g
                  );
              }
            }),
            (u.prototype.flip = function () {
              (this.rotationVelocity = 4 * -Math.PI),
                (this.targetBaseRotation -= 2 * Math.PI);
            }),
            u);
        function u(t, e, i, r) {
          t = n.call(this, t) || this;
          return (
            (t.baseRadius = e),
            (t.centerX = i),
            (t.centerY = r),
            (t.lineWidth = 1),
            (t.eyesClosed = !1),
            (t.targetPosition = new a.Point(0, 0)),
            (t.rotationAcceleration = 0),
            (t.rotationVelocity = 0),
            (t.targetRotation = 0),
            (t.targetBaseRotation = 0),
            (t.lastUpdateRandomPosition = 0),
            (t.lastUpdateRandomRotation = 0),
            (t.randomAngle = 0),
            (t.radius = t.baseRadius),
            (t.filter = new a.filters.BlurFilter()),
            (t.filters = [t.filter]),
            t.setFriction(1),
            (t.position.x = i),
            (t.position.y = r),
            t
          );
        }
        i.PowerCircle = t;
      },
      { '../engine/DisplayObject': 59, '../engine/Point': 61, 'pixi.js': 43 },
    ],
    59: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          s =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.DisplayObject = void 0),
            t('pixi.js')),
          a = t('pixi.js'),
          t =
            ((n = a.Container),
            o(h, n),
            (h.prototype.setForce = function (t, e) {
              isNaN(e.x) || isNaN(e.y) || (this.forces[t] = { x: e.x, y: e.y });
            }),
            (h.prototype.clearForce = function (t) {
              delete this.forces[t];
            }),
            (h.prototype.clearForces = function () {
              this.forces = {};
            }),
            (h.prototype.setFriction = function (t) {
              'number' == typeof t
                ? (this.friction = new a.Point(t, t))
                : this.friction.set(t.x, t.y);
            }),
            (h.prototype.update = function (t) {
              for (var e in (this.setForce(
                'friction',
                new a.Point(
                  -this.friction.x * this.velocity.x,
                  -this.friction.y * this.velocity.y
                )
              ),
              this.acceleration.set(0, 0),
              this.forces))
                (this.acceleration.x += this.forces[e].x),
                  (this.acceleration.y += this.forces[e].y);
              (this.acceleration.x /= this.mass),
                (this.acceleration.y /= this.mass),
                (this.velocity.x += t * this.acceleration.x),
                (this.velocity.y += t * this.acceleration.y),
                (this.position.x += t * this.velocity.x),
                (this.position.y += t * this.velocity.y);
            }),
            (h.ID = 1),
            h);
        function h(t, e) {
          var i = n.call(this) || this;
          return (
            (e = void 0 === e || e),
            (i.id = h.ID++),
            (i.stage = t),
            (i.graphics = void 0),
            (i.velocity = new a.Point(0, 0)),
            (i.acceleration = new a.Point(0, 0)),
            (i.friction = new a.Point(0, 0)),
            (i.forces = {}),
            (i.mass = 1),
            e && ((i.graphics = new s.Graphics()), i.addChild(i.graphics)),
            i
          );
        }
        i.DisplayObject = t;
      },
      { 'pixi.js': 43 },
    ],
    60: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          t =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.DisplayObjectContainer = void 0),
            t('./DisplayObject')),
          t =
            ((n = t.DisplayObject),
            o(s, n),
            (s.prototype.update = function (t) {
              n.prototype.update.call(this, t);
              for (var e = 0, i = this.children.length; e < i; ++e) {
                var r = this.children[e];
                r.update && r.update(t);
              }
            }),
            s);
        function s(t) {
          return n.call(this, t, !1) || this;
        }
        i.DisplayObjectContainer = t;
      },
      { './DisplayObject': 59 },
    ],
    61: [
      function (t, e, i) {
        'use strict';
        function r() {}
        Object.defineProperty(i, '__esModule', { value: !0 }),
          (i.Point = void 0),
          (r.distance = function (t, e) {
            return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
          }),
          (i.Point = r);
      },
      {},
    ],
    62: [
      function (t, e, i) {
        'use strict';
        var r,
          n,
          o =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (r =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (t, e) {
                    t.__proto__ = e;
                  }) ||
                function (t, e) {
                  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                })(t, e);
            }),
            function (t, e) {
              function i() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((i.prototype = e.prototype), new i()));
            }),
          s =
            (Object.defineProperty(i, '__esModule', { value: !0 }),
            (i.Stage = void 0),
            t('./DisplayObjectContainer')),
          a = t('../audio/NodeContainer'),
          h = t('../audio/PowerCircle'),
          u = t('../audio/AnimatedBackground'),
          l = t('pixi.js'),
          t =
            ((n = s.DisplayObjectContainer),
            o(c, n),
            (c.prototype.getWidth = function () {
              return this.canvasContainer.clientWidth;
            }),
            (c.prototype.getHeight = function () {
              return this.canvasContainer.clientHeight;
            }),
            (c.prototype.resize = function () {
              this.renderer.resize(
                this.canvasContainer.clientWidth,
                this.canvasContainer.clientHeight
              ),
                this.powerCircle &&
                  (this.powerCircle.setBaseRadius(
                    Math.min(this.getWidth(), this.getHeight()) / 12
                  ),
                  this.powerCircle.setCenter(
                    this.getWidth() / 2,
                    (6 * this.getHeight()) / 10
                  ));
            }),
            (c.prototype.update = function () {
              var t = Date.now() / 1e3;
              (this.lastDelta = t - this.lastUpdateDelta),
                (this.lastUpdateDelta = t),
                1 < this.lastDelta && (this.lastDelta = 0),
                n.prototype.update.call(this, this.lastDelta),
                this.renderer.render(this),
                requestAnimationFrame(this.update.bind(this));
            }),
            (c.prototype.start = function () {
              for (; 0 < this.children.length; ) this.removeChildAt(0);
              (this.powerCircle = new h.PowerCircle(
                this,
                Math.min(this.getWidth(), this.getHeight()) / 12,
                this.getWidth() / 2,
                (6 * this.getHeight()) / 10
              )),
                this.addChild(this.powerCircle);
              var t = new a.NodeContainer(this, this.powerCircle);
              t.populate(),
                this.addChildAt(t, 0),
                this.addChildAt(new u.AnimatedBackground(this), 0),
                this.run();
            }),
            (c.prototype.run = function () {
              (this.lastUpdateDelta = Date.now() / 1e3),
                requestAnimationFrame(this.update.bind(this));
            }),
            c);
        function c(t, e) {
          var i = n.call(this, null) || this;
          return (
            (i.lastUpdateDelta = 0),
            (i.lastDelta = 0),
            (i.viz = e),
            (i.canvasContainer = t),
            (i.renderer = l.autoDetectRenderer({
              width: i.canvasContainer.clientWidth,
              height: i.canvasContainer.clientHeight,
            })),
            i.canvasContainer.appendChild(i.renderer.view),
            i.renderer.render(i),
            i
          );
        }
        i.Stage = t;
      },
      {
        '../audio/AnimatedBackground': 54,
        '../audio/NodeContainer': 56,
        '../audio/PowerCircle': 58,
        './DisplayObjectContainer': 60,
        'pixi.js': 43,
      },
    ],
    63: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 }),
          (i.PowerAudio = void 0);
        t = t('./Viz');
        i.PowerAudio = { Viz: t.Viz };
      },
      { './Viz': 53 },
    ],
    64: [
      function (t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: !0 });
        i = t('./index');
        window.PowerAudio = i.PowerAudio;
      },
      { './index': 63 },
    ],
  },
  {},
  [64]
);
