import UI_ROOT from "../../UIRoot";
import Slider from "../makiClasses/Slider";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class SliderZ extends Slider {
  _pendingProps: { [prop: string]: string } = {};
  _background: string;

  getElTag(): string {
    return "slider";
  }

  setXmlAttr(_key: string, _value: string): boolean {
    const key = _key.toLowerCase();
    const value = _value.toLowerCase();
    if (value.startsWith("jscript:")) {
      this._pendingProps[key] = value;
      return;
    }
    if (super.setXmlAttr(key, value)) {
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

  _renderBackground() {
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      this.setBackgroundImage(bitmap);
    } else {
      this.setBackgroundImage(null);
    }
  }

  _solvePendingProps(){
    // sample: jscript:balance.top+12;
    // sample: jscript:eq1.top;
    // sample: jscript:balance.left+balance.width+27;
    // const re = /jscript:(\w+)\.(\w+)([\+|\-])*(\d+)*/gm;
    const re = /jscript:(\w+.\w+)(?:([\+|\-])([a-z\d\.]+))*/gm;
    let m: RegExpExecArray;
    for (const [prop, script] of Object.entries(this._pendingProps)) {
      // this.setXmlAttr(key, value);
      let sign = '+'
      let num:number;
      if ((m = re.exec(script)) !== null) {
        let result = 0
        // console.log('pendingProp:', m)
        // for(var i=1; i< m.length; i++)
        m.forEach((s, index)=> {
          if(index==0 || s==null){
            return
          } else if(s.indexOf('.')>0){
            const [id,attr] = s.split('.');
            const el = this.findobject(id);
            if(el){
              num = el['get'+attr]()
              if(!isNaN(num)) {
                if(sign=='-'){
                  num *= -1
                }
                result += num
              }
            }
            console.log('id:', id, attr)
          } else if(s=='+' || s=='-'){
            sign = s
            console.log('exp:', s)
          } else {
            num= parseInt(s);
            if(!isNaN(num)) {
              if(sign=='-'){
                num *= -1
              }
              result += num
            }
          }
        })
        // const [_,id,attribute, sign,num] = m
        // console.log('pendingProp:',id,attribute, sign,num)
        this.setXmlAttr(prop, result.toString())
      }
    }
    
  }

  draw() {
    this._solvePendingProps()
    super.draw();
    this._div.classList.add("webamp--img");
    // this._div.style.pointerEvents = "auto";
    this._renderBackground();
  }
}

const sliderZregex = /jscript:(\w+)\.(\w+)([\+|\-])*(\d+)*/gm;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('jscript:(\\w+)\\.(\\w+)([\\+|\\-])*(\\d+)*', 'gm')

// const str = `jscript:balance.top+12;
// jscript:eq1.top;`;
// const str = `jscript:balance.top+12;`
const str = `jscript:eq1.top;`;
let m;

// while ((m = regex.exec(str)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     if (m.index === regex.lastIndex) {
//         regex.lastIndex++;
//     }
    
//     // The result can be accessed through the `m`-variable.
//     m.forEach((match, groupIndex) => {
//         console.log(`Found match, group ${groupIndex}: ${match}`);
//     });
// }
if ((m = sliderZregex.exec(str)) !== null) {
  // This is necessary to avoid infinite loops with zero-width matches
  // if (m.index === regex.lastIndex) {
  //     regex.lastIndex++;
  // }
  console.log(m[1], m[2], m[3])
  
  // The result can be accessed through the `m`-variable.
  m.forEach((match, groupIndex) => {
      console.log(`Found match, group ${groupIndex}: ${match}`);
  });
}