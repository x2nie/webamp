import json,os
from pprint import pprint
from docstring import scan_docstring

tpl_file = '''import {{ xml }} from "@odoo/owl";
import {{ registry }} from "@web/core/registry";
import {{ {parent} }} from "./{parent}";

export class {Name} extends {parent} {{
  static GUID = "{guid}";
  static ID = "{{{GUID}}}";
  static template = xml`<div class="{name} layer dummy" tag="{name}" style="style()"/>`;

  {methods}
  // events binding ---------------
  {bindings}

}} // {name}

registry.category("component").add("{name}", {Name});
'''

def gen(std, klass='Container'):
    # klass = 'Container'

    # #? json
    # jsonpath = f'src/maki/objectData/{std}.byname.json'
    # # print(os.path.exists(jsonpath))
    # with open(jsonpath, 'r') as f:
    #     c = json.load(f)

    # o = c[klass]

    #? docstring 
    mifile = f'resources/maki_compiler/v1.2.0 (Winamp 5.66)/lib/{std}.mi'
    docstrings = scan_docstring(mifile)
    if std == 'std':
        stdPatch(docstrings)
    # print('using:', docstrings.get(klass))
    o = docstrings['_CLASS'][klass]
    o['Name'] = klass
    o['name'] = klass.lower()
    build_methods(klass, o, docstrings)
    # pprint(o)
    print('='*20)
    code = tpl_file.format(**o)
    print(code)
    output = os.path.join(os.path.dirname(__file__), 'output', 'generated.ts')
    output = os.path.join(os.path.dirname(__file__), 'output', klass+'.ts')
    with open(output, 'w') as f:
        f.write(code)

def stdPatch(getMethod):
    #? copied from /src/maki/stdPatched.ts
    
    # * From object.js
    # *
    # * > The std.mi has this set as void, but we checked in Winamp and confirmed it
    # * > returns 0/1
    getMethod["Timer"]["isRunning"]['result'] = "boolean";

    # * From Object.pm
    # *
    # * > note, std.mi does not have this parameter!
    getMethod["ToggleButton"]["onToggle"]["parameters"][0][1] = "onoff";

    # * Some methods are not compatible with the type signature of their parent class
    getMethod["GuiTree"]["onChar"]["parameters"][0][0] = "string";
    getMethod["GuiList"]["onSetVisible"]["parameters"][0][0] = "boolean";

    # I'm not sure how to get these to match
    getMethod["Wac"]["onNotify"]["parameters"] = getMethod["Object"]["onNotify"]["parameters"];
    getMethod["Wac"]["onNotify"]["result"] = "int";

type_conversion = {
    'int': 'number',
    'float': 'number',
    'double': 'number',
    'string': 'string',
    'boolean': 'boolean',
}

tpl_method = '''
  {doc}public {name}({params}){ret} {{}}{obsolete}
'''
tpl_binding = '''
  {doc}// {name}({params}){ret} {{}}{obsolete}
'''
tpl_doc = '''{}
  '''

def build_methods(klass, o, docstrings):
    
    functions = docstrings[klass]

    o['methods'] = ''
    o['bindings'] = ''
    for name,fn in functions.items():
        print()
        # doc = docstrings[klass][fn['name']]['doc']
        doc = fn['doc']
        if doc:
            fn['doc'] = tpl_doc.format(doc)
        r=fn['result']
        r = type_conversion.get(r.lower(), r)
        ret = f': {r}' if r else ''
        params = []
        for [t,p] in fn['parameters']:
            t = type_conversion.get(t.lower(), t)
            params.append(f'{p}: {t}')
        dep = ' //! deprecated' if fn['deprecated'] else ''
        binding = name.startswith('on')
        tpl = tpl_binding if binding else tpl_method
        method = tpl.format(**fn, name=name, ret=ret, params=', '.join(params), obsolete=dep)

        if binding:
            o['bindings'] += method
        else:
            o['methods'] += method
# json.load()
# print(__file__)

# gen('../../src/maki/objectData/std.json')
# gen('.../../src/maki/objectData/std.json')
# gen('src/maki/objectData/std.byname.json')
# gen('std')
# gen('std', 'Text')
# gen('std', 'Layout')F
# gen('std', 'Layer')
# gen('std', 'Group')
gen('std', 'Slider')
gen('std', 'AnimatedLayer')
gen('std', 'Status')
gen('std', 'Vis')
