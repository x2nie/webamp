import json,os
from pprint import pprint

tpl_file = '''import {{ registry }} from "@web/core/registry";

export class {name} extend {parent} {{
  static GUID = "{guid}";
  static template = xml`<span c="{name}"/>`;

  {methods}
  // events binding ---------------
  {bindings}
'''

def gen(jsonpath):
    print(os.path.exists(jsonpath))
    with open(jsonpath, 'r') as f:
        c = json.load(f)
    o = c['Button']
    o = c['Layout']
    build_methods(o)
    # pprint(o)
    print('='*20)
    print(tpl_file.format(**o))

type_conversion = {
    'int': 'number',
    'float': 'number',
    'double': 'number',
    'string': 'string',
    'boolean': 'boolean',
}

tpl_method = '''
  {name}({params}){ret} {{}}{dep}
'''
tpl_binding = '''
  // {name}({params}){ret} {{}}{dep}'''

def build_methods(o):

    o['methods'] = ''
    o['bindings'] = ''
    for fn in o['functions']:
        r=fn['result']
        r = type_conversion.get(r.lower(), r)
        ret = f': {r}' if r else ''
        params = []
        for [t,p] in fn['parameters']:
            t = type_conversion.get(t.lower(), t)
            params.append(f'{p}: {t}')
        dep = ' //! deprecated' if fn['deprecated'] else ''
        binding = fn['name'].startswith('on')
        tpl = tpl_binding if binding else tpl_method
        method = tpl.format(**fn, ret=ret, params=', '.join(params), dep=dep)

        if binding:
            o['bindings'] += method
        else:
            o['methods'] += method
# json.load()
# print(__file__)

# gen('../../src/maki/objectData/std.json')
# gen('.../../src/maki/objectData/std.json')
gen('src/maki/objectData/std.byname.json')
