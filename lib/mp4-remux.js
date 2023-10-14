var W = Object.defineProperty;
var H = (i, t, e) => t in i ? W(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var w = (i, t, e) => (H(i, typeof t != "symbol" ? t + "" : t, e), e);
const A = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get edts() {
    return Q;
  },
  get free() {
    return I;
  },
  get ftyp() {
    return K;
  },
  get mdat() {
    return N;
  },
  get mdia() {
    return J;
  },
  get mfhd() {
    return O;
  },
  get moof() {
    return k;
  },
  get moov() {
    return V;
  },
  get mvex() {
    return T;
  },
  get mvhd() {
    return R;
  },
  get sidx() {
    return q;
  },
  get tfdt() {
    return F;
  },
  get tfhd() {
    return P;
  },
  get tkhd() {
    return j;
  },
  get traf() {
    return C;
  },
  get trak() {
    return E;
  },
  get trex() {
    return z;
  },
  get trun() {
    return B;
  },
  get udta() {
    return G;
  }
}, Symbol.toStringTag, { value: "Module" }));
class d {
  // 记录元数据和盒子数据的偏差
  constructor(t) {
    w(this, "stream", new Uint8Array());
    w(this, "dv", new DataView(new Uint8Array().buffer));
    w(this, "boxs", []);
    w(this, "boxPos", 0);
    this.stream = t, this.dv = new DataView(t.buffer);
  }
  set size(t) {
    this.writeUint(4, t);
  }
  get size() {
    return this.readUint(4);
  }
  get type() {
    return this.readString(4, 4);
  }
  /**
   * 获取当前 box 的 binary
   */
  get raw() {
    if (this.boxPos) {
      let t = this.boxPos;
      const e = this.boxs.map((u) => {
        const _ = u.raw;
        return t += _.length, _;
      });
      this.size = t;
      const r = this.stream.slice(0, this.boxPos), s = new Uint8Array(t);
      let a = 0;
      for (const u of [r, ...e])
        s.set(u, a), a += u.length;
      return s;
    }
    return this.stream;
  }
  writeUint(t, e, r = 0) {
    const s = this.dv;
    switch (t) {
      case 1:
        s.setUint8(r, e);
        break;
      case 2:
        s.setUint16(r, e);
        break;
      case 4:
        s.setUint32(r, e);
        break;
    }
  }
  writeInt(t, e, r = 0) {
    const s = this.dv;
    switch (t) {
      case 1:
        s.setInt8(r, e);
        break;
      case 2:
        s.setInt16(r, e);
        break;
      case 4:
        s.setInt32(r, e);
        break;
    }
  }
  readInt(t = 4, e = 0) {
    const r = this.dv;
    switch (t) {
      case 1:
        return r.getInt8(e);
      case 2:
        return r.getInt16(e);
      case 4:
        return r.getInt32(e);
    }
  }
  // use dataView to Get Unsigned Int
  readUint(t, e = 0) {
    const r = this.dv;
    switch (t) {
      case 1:
        return r.getUint8(e);
      case 2:
        return r.getUint16(e);
      case 4:
        return r.getUint32(e);
    }
  }
  /**
   * Read string by char code from Uint8Array
   * @param size
   */
  readString(t, e = 0) {
    let r = "";
    for (let s = 0; s < t; s++)
      r += String.fromCharCode(this.readUint(1, e + s));
    return r;
  }
  parse(t) {
    this.boxPos = t;
    let e = t;
    for (; e <= this.stream.length - 8; ) {
      const r = this.readUint(4, e), s = this.readString(4, 4 + e);
      if (r <= this.stream.length) {
        const a = this.stream.slice(e, e + r), u = A[s] || I;
        this.boxs.push(new u(a));
      }
      e += r;
    }
  }
}
class z extends d {
  get version() {
    return this.readUint(1, 8);
  }
  get track_id() {
    return this.readUint(4, 12);
  }
  set track_id(t) {
    this.writeUint(4, t, 12);
  }
}
class B extends d {
  get sample_count() {
    return this.readUint(4, 12);
  }
  get data_offset() {
    return this.readInt(4, 16);
  }
  set data_offset(t) {
    this.writeInt(4, t, 16);
  }
}
class F extends d {
}
class P extends d {
  get version() {
    return this.readUint(1, 8);
  }
  get track_id() {
    return this.readUint(4, 12);
  }
  set track_id(t) {
    this.writeUint(4, t, 12);
  }
}
class C extends d {
  constructor(t) {
    super(t), this.parse(8);
  }
  get tfhd() {
    return this.boxs.find((t) => t instanceof P);
  }
  get trun() {
    return this.boxs.find((t) => t instanceof B);
  }
}
class O extends d {
  get sequence_number() {
    return this.readUint(4, 12);
  }
}
class G extends d {
}
class J extends d {
}
class K extends d {
}
class I extends d {
}
class V extends d {
  constructor(t) {
    super(t), this.parse(8);
  }
  get mvhd() {
    return this.boxs.find((t) => t instanceof R);
  }
  get mvex() {
    return this.boxs.find((t) => t instanceof T);
  }
  get trak() {
    return this.boxs.find((t) => t instanceof E);
  }
}
class k extends d {
  constructor(t) {
    super(t), this.parse(8);
  }
  get mfhd() {
    return this.boxs.find((t) => t instanceof O);
  }
  get traf() {
    return this.boxs.find((t) => t instanceof C);
  }
}
class q extends d {
  get version() {
    return this.readUint(1, 8);
  }
  get reference_ID() {
    return this.readUint(4, 12);
  }
  get timescale() {
    return this.readUint(4, 16);
  }
  get reserved() {
    let t = 28;
    return this.version !== 0 && (t = 16 + 20), this.readUint(2, t);
  }
  get reference_count() {
    let t = 28;
    return this.version !== 0 && (t = 16 + 20), t += 2, this.readUint(2, t);
  }
  get refList() {
    let t = 32;
    this.version !== 0 && (t = 16 + 24);
    const e = this.reference_count, r = [];
    for (let s = 0; s < e; s++) {
      const a = t + s * 12;
      let u = this.readUint(4, a);
      const _ = u >> 31 & 1, p = u & 2147483647, c = this.readUint(4, a + 4);
      u = this.readUint(4, a + 8);
      const b = u >> 31 & 1, v = u >> 28 & 7, y = u & 268435455;
      r.push({
        reference_type: _,
        referenced_size: p,
        subsegment_duration: c,
        starts_with_SAP: b,
        SAP_type: v,
        SAP_delta_time: y
      });
    }
    return r;
  }
}
class N extends d {
  push(t) {
    const e = new Uint8Array(this.stream.length + t.length);
    e.set(this.stream), e.set(t, this.stream.length), this.stream = e, this.dv = new DataView(this.stream.buffer), this.size = e.length;
  }
}
class R extends d {
  get version() {
    return this.readUint(1, 8);
  }
  get next_track_ID() {
    return this.version === 0 ? this.readUint(4, 104) : this.readUint(4, 116);
  }
  set next_track_ID(t) {
    this.version === 0 ? this.writeUint(4, t, 104) : this.writeUint(4, t, 116);
  }
}
class T extends d {
  constructor(t) {
    super(t), this.parse(8);
  }
  get trex() {
    return this.boxs.find((t) => t instanceof z);
  }
}
class j extends d {
  get version() {
    return this.readUint(1, 8);
  }
  get track_id() {
    return this.version === 1 ? this.readUint(4, 28) : this.readUint(4, 20);
  }
  set track_id(t) {
    this.version === 1 ? this.writeUint(4, t, 28) : this.writeUint(4, t, 20);
  }
}
class E extends d {
  constructor(t) {
    super(t), this.parse(8);
  }
  get tkhd() {
    return this.boxs.find((t) => t instanceof j);
  }
}
class Q extends d {
}
class M {
  constructor() {
    w(this, "stream", new Uint8Array());
    w(this, "dv", new DataView(new Uint8Array().buffer));
    w(this, "boxs", []);
    w(this, "isEnd", !1);
  }
  get sidx() {
    return this.boxs.find((t) => t instanceof q);
  }
  get moov() {
    return this.boxs.find((t) => t instanceof V);
  }
  push(t) {
    const e = new Uint8Array(this.stream.length + t.length);
    e.set(this.stream), e.set(t, this.stream.length), this.stream = e, this.dv = new DataView(this.stream.buffer);
  }
  /**
   * 将stream 截断，把pos前的数据返回，然后更新dataView
   * @param pos
   */
  slice(t) {
    const e = this.stream.slice(0, t), r = new Uint8Array(this.stream.length - t);
    return r.set(this.stream.slice(t)), this.stream = r, this.dv = new DataView(this.stream.buffer), e;
  }
  // use dataView to Get Unsigned Int
  readUint(t, e = 0) {
    const r = this.dv;
    switch (t) {
      case 1:
        return r.getUint8(e);
      case 2:
        return r.getUint16(e);
      case 4:
        return r.getUint32(e);
    }
  }
  /**
   * Read string by char code from Uint8Array
   * @param size
   */
  readString(t, e = 0) {
    let r = "";
    for (let s = 0; s < t; s++)
      r += String.fromCharCode(this.readUint(1, e + s));
    return r;
  }
  parse() {
    if (this.stream.length < 8)
      return;
    const t = this.readUint(4), e = this.readString(4, 4);
    if (t <= this.stream.length) {
      const r = this.slice(t), s = A[e] || I;
      this.boxs.push(new s(r)), this.parse();
    }
  }
  end() {
    this.isEnd = !0;
  }
}
function Y(i, t) {
  const e = i.getReader(), r = t.getReader(), s = new M(), a = new M(), { readable: u, writable: _ } = new TransformStream(), p = _.getWriter();
  let c = -1;
  function b(x) {
    p.write(x);
  }
  async function v() {
    if (c === -1) {
      const x = s.moov, g = a.moov;
      if (x && g) {
        const n = x.mvex, f = g.mvex;
        if (n && f) {
          const o = n.trex, l = f.trex;
          o.track_id = 1, l.track_id = 2, n.boxs = n.boxs.filter((S) => !(S instanceof z)), o && n.boxs.push(o), l && n.boxs.push(l);
        }
        const h = x.trak, U = g.trak;
        if (h && U) {
          h.tkhd.track_id = 1, U.tkhd.track_id = 2, x.boxs.push(U);
          for (const o of s.boxs)
            if (b(o.raw), o === x)
              break;
          c = 1;
        }
      }
    }
    if (!(!s.sidx || !a.sidx) && c !== -1) {
      const x = s.sidx.reference_count, g = a.sidx.reference_count;
      if (c <= x && c <= g) {
        const n = s.boxs.find((o) => o instanceof k && (o == null ? void 0 : o.mfhd.sequence_number) === c), f = a.boxs.find((o) => o instanceof k && (o == null ? void 0 : o.mfhd.sequence_number) === c), h = n && s.boxs[s.boxs.indexOf(n) + 1], U = f && a.boxs[a.boxs.indexOf(f) + 1];
        if (n && h && f && U) {
          const o = n.traf, l = f.traf;
          if (o.tfhd.track_id = 1, l.tfhd.track_id = 2, o != null && o.trun && (l != null && l.trun)) {
            const S = l.size, D = n.size, L = h.size;
            o.trun.data_offset = D + S + 8, l.trun.data_offset = D + S + L, n.boxs.push(l), b(n.raw), h.push(U.raw.slice(8)), b(h.raw), s.boxs = s.boxs.filter((m) => m !== n), s.boxs = s.boxs.filter((m) => m !== h), a.boxs = a.boxs.filter((m) => m !== f), a.boxs = a.boxs.filter((m) => m !== U), c += 1, v();
          }
        }
      } else if (c > x && c <= g) {
        const n = a.boxs.find((h) => h instanceof k && (h == null ? void 0 : h.mfhd.sequence_number) === c);
        n.traf.tfhd.track_id = 2;
        const f = n && a.boxs[a.boxs.indexOf(n) + 1];
        n && f && (b(n.raw), b(f.raw), c += 1, v());
      } else if (c > g && c <= x) {
        const n = s.boxs.find((h) => h instanceof k && (h == null ? void 0 : h.mfhd.sequence_number) === c);
        n.traf.tfhd.track_id = 1;
        const f = n && s.boxs[s.boxs.indexOf(n) + 1];
        n && f && (b(n.raw), b(f.raw), c += 1, v());
      } else
        c > x && c > g && (c = -2, p.close());
    }
  }
  async function y(x, g) {
    for (; ; ) {
      const { done: n, value: f } = await x.read();
      if (f && (g.push(f), g.parse(), v()), n) {
        g.end(), v();
        break;
      }
    }
  }
  return y(e, s), y(r, a), u;
}
export {
  Y as default
};
//# sourceMappingURL=mp4-remux.js.map
