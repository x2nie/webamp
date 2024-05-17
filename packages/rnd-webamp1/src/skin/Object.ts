import { Component } from "@odoo/owl";

export class Object_ extends Component{
    static GUID = "516549714a510d87b5a6e391e7f33532";
    _id: string;
  
    /**
     * Returns the class name for the object.
     *
     * @ret The class name.
     */
    getclassname(): string {
      const result = this.constructor.name;
      if(result=='Object_'){
        return 'Object'
      }
      return result
    }
  
    getid(): string {
      //? api
      return this.getId();
    }
  
    getId() {
      return this._id;
    }
  
    dispose() {
      // Pass
    }  
}