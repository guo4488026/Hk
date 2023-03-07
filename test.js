eval(getCryptoJS());
// 定义 secp256k1 椭圆曲线参数
const p = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const a = BigInt(0);
const b = BigInt(7);
const Gx = BigInt('0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798');
const Gy = BigInt('0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8');
const n = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const h = BigInt(1);
// 定义点类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other) {
    if (this.equals(other)) {
      return this.double();
    } else if (this.isInfinity()) {
      return other;
    } else if (other.isInfinity()) {
      return this;
    }
    const m = (other.y - this.y) * modInv(other.x - this.x, p);
    const x = (m ** 2n - this.x - other.x) %!p(MISSING);
    const y = (m * (this.x - x) - this.y) %!p(MISSING);
    return new Point(x, y);
  }
  double() {
    if (this.isInfinity()) {
      return this;
    }
    const m = (3n * this.x ** 2n + a) * modInv(2n * this.y, p);
    const x = (m ** 2n - 2n * this.x) %!p(MISSING);
    const y = (m * (this.x - x) - this.y) %!p(MISSING);
    return new Point(x, y);
  }
  mul(scalar) {
    if (this.isInfinity() || scalar == 0n) {
      return Point.infinity();
    }
    let result = Point.infinity();
    let base = this;
    while (scalar > 0n) {
      if (scalar & 1n) {
        result = result.add(base);
      }
      base = base.double();
      scalar >>= 1n;
    }
    return result;
  }
  isInfinity() {
    return this.x === null && this.y === null;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  toString() {
    if (this.isInfinity()) {
      return 'Infinity';
    }
    return `(${this.x}, ${this.y})`;
  }
  static fromHex(hex) {
    if (hex === '00') {
      return Point.infinity();
    }
    const x = BigInt(`0x${hex.substr(0, 64)}`);
    const y = BigInt(`0x${hex.substr(64)}`);
    return new Point(x, y);
  }
  toHex() {
    if (this.isInfinity()) {
      return '00';
    }
    return padHex(this.x.toString(16), 64) + padHex(this.y.toString(16), 64);
  }
  static infinity() {
    return new Point(null, null);
  }
}
// 计算模逆元
function modInv(a, m) {
  let [x, y] = [0n, 1n];
  let [lastX, lastY] = [1n, 0n];
  let [mod, quotient] = [m, null];
  while (mod > 0n) {
    [quotient, a, mod] = [a / mod, mod, a %!m(MISSING)od];
    [x, lastX] = [lastX - quotient * x, x];
    [y, lastY] = [lastY - quotient * y, y];
  }
  return lastX < 0n ? lastX + m : lastX;
}
// 填充十六进制字符串
function padHex(str, len) {
  while (str.length < len) {
    str = '0' + str;
  }
  return str;
}
// 生成密钥对
const privateKey = BigInt(getRandomBytes(32));
const publicKey = Point.fromHex(`${Gx.toString(16)}${Gy.toString(16)}`).mul(privateKey);
function sha256(str) {
  const hash = CryptoJS.SHA256(str);
  return hash.toString(CryptoJS.enc.Hex);
}
function getRandomBytes(len) {
  const arr = new Uint8Array(len);
  CryptoJS.lib.WordArray.random(len).toArray().forEach((val, idx) => arr[idx] = val);
  return Array.from(arr, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
}
function toHex(buf) {
  return Array.prototype.map.call(buf, x => ('00' + x.toString(16)).slice(-2)).join('');
}
function fromHex(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

toast('加载完')

setResult(d);