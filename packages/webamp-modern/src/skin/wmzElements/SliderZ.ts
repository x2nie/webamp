import UI_ROOT from "../../UIRoot";
import Slider from "../makiClasses/Slider";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class SliderZ extends Slider {
  _pendingProps: { [key: string]: string } = {};
  _background: string;

  getElTag(): string {
    return "slider";
  }

  setXmlAttr(_key: string, _value: string): boolean {
    const key = _key.toLowerCase();
    const value = _value.toLowerCase();
    if (value.startsWith("jscript:")) {
      this._pendingProps[key] = value;
      return true;
    }
    if (super.setXmlAttr(key, value)) {
      //? wmz has no action/param
      if (key == "id") {
        if (value.startsWith("eq")) {
          const index = value.substring(2);
          this.setxmlparam("action", "eq_band");
          this.setxmlparam("param", index);
        } else if(value =='balance'){
          this.setxmlparam("action", "pan");
          
          
        } else if(value =='volume'){
          this.setxmlparam("action", "volume");
          
        }
      }
      return true;
    }

    switch (key) {
      case "background":
        this._background = value;
        this._renderBackground();
        break;
      default:
        return false;
    }
    return true;
  }

  // This shadows `getheight()` on GuiObj
  getheight(): number {
    if (this._height) {
      return this._height;
    }
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      if (bitmap) return bitmap.getHeight();
    }
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if (this._width) {
      return this._width;
    }
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      if (bitmap) return bitmap.getWidth();
    }
    return super.getwidth();
  }

  _renderBackground() {
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      this.setBackgroundImage(bitmap);
    } else {
      this.setBackgroundImage(null);
    }
  }

  _solvePendingProps() {
    // sample: jscript:balance.top+12;
    // sample: jscript:eq1.top;
    // sample: jscript:balance.left+balance.width+27;
    // const re = /jscript:(\w+)\.(\w+)([\+|\-])*(\d+)*/gm;
    for (const [key, script] of Object.entries(this._pendingProps)) {
      const z: string[] = [];
      // const regex = /jscript:(\w+.\w+)(?:([\+|\-])([a-z\d\.]+))*/gm;
      const regex = /\w+\.\w+|[\+-]+|[0-9]+/gm;
      // let m: RegExpExecArray;
      let m = null;
      while ((m = regex.exec(script)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          // console.log(`Found match, group ${groupIndex}: ${match}`);
          if (match != null) {
            z.push(match);
          }
        });
        // console.log("----------");
      }
      // console.log("============", z);
      // this.setXmlAttr(key, value);
      let sign = "+";
      let num: number;
      // m = re.exec(script)
      // console.log('  --for',key, script, 'M==',m)
      if (z.length) {
        let result = 0;
        let msg = "";
        // console.log('--pendingProp, y=',this._y, key, m)
        // for(var i=1; i< m.length; i++)
        z.forEach((s, index) => {
          if (/* index == 0 || */ s == null) {
            return;
          } else if (s.indexOf(".") > 0) {
            const [id, attr] = s.split(".");
            const el = this.findobject(id);
            if (el) {
              num = el["get" + attr]();
              if (!isNaN(num)) {
                if (sign == "-") {
                  num *= -1;
                }
                result += num;
              }
            }
            // console.log("id:", id, attr);
            msg += `[${id}.${attr}=${num}]`;
          } else if (s == "+" || s == "-") {
            sign = s;
            // console.log('exp:', s)
            msg += s;
          } else {
            num = parseInt(s);
            if (!isNaN(num)) {
              if (sign == "-") {
                num *= -1;
              }
              result += num;
              msg += String(num);
            } else {
              msg += ` [Failed to process: ${s}]`;
            }
          }
        });
        // const [_,id,attribute, sign,num] = m
        // console.log('pendingProp:',id,attribute, sign,num)
        // console.log("pendingProp:", msg, ">>", key, "@", script, "==", result);
        this.setXmlAttr(key, result.toString());
      }
    }
  }

  // init() {
  //   super.init()
  //   this._solvePendingProps();
  // }

  draw() {
    this._solvePendingProps();
    super.draw();
    this._div.classList.add("webamp--img");
    // this._div.style.pointerEvents = "auto";
    this._renderBackground();
  }
}
const regex = /\w+\.\w+|[\+-]+|[0-9]+/gm;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('\\w+\\.\\w+|[\\+-]+|[0-9]+', 'gm')

const str = `    // sample: jscript:balance.top+12;
    // sample: jscript:eq1.top;
    // sample: jscript:balance.left+balance.width+27;`;
let m;

var z = [];
while ((m = regex.exec(str)) !== null) {
  // This is necessary to avoid infinite loops with zero-width matches
  if (m.index === regex.lastIndex) {
    regex.lastIndex++;
  }

  // The result can be accessed through the `m`-variable.
  m.forEach((match, groupIndex) => {
    console.log(`Found match, group ${groupIndex}: ${match}`);
    z.push(match);
  });
  console.log("----------");
}
console.log("M");
console.log(z);
