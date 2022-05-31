type IniTree = { [section: string]: { [key: string]: string } };

export class IniSection {
    _tree: { [key: string]: string } ;

    constructor(section: { [key: string]: string } ) {
        this._tree = section
    }

    getString( key:string):string {
        return this._tree[key.toLowerCase()]
    }
  
  
    getInt(key:string):number {
      return parseInt(this.getString(key))
    }
  
}
export default class IniFile {
  _tree: IniTree = {};

  section(name:string): IniSection {
      return new IniSection(this._tree[name.toLowerCase()])
  }

  readString(content: string) {
    const ini: IniTree = {};
    let section = 'root'
    content = content.replace(/\r/g, "");
    const lines = content.split("\n");
    for (var line of lines) {
      if (!line || line.startsWith(";")) continue;

      //?section
      if(line.startsWith('[')){
          line = line.replace(/\[/,'').replace(/\]/,'')
          section = line.toLowerCase()
          if(!ini[section]){
            ini[section] = {}
          }
          continue;
      }

      if(line.includes('=')){
          let [key,value] = line.split('=')
          key = strip(key).toLowerCase()
          value = strip(value)
        ini[section][key] = value
      }

      
    }
    this._tree = ini;
  }

  getString(section:string, key:string):string {
      const ksection = this._tree[section.toLowerCase()]
      if(!ksection) return null
      return ksection[key.toLowerCase()]
  }

  has(section:string, key:string):boolean {
      return this.getString(section,key) != null
  }


  getInt(section:string, key:string):number {
    return parseInt(this.getString(section,key))
  }
}

function strip(s:string):string {
    return s.replace(/^\s+|\s+$/g, '');
}