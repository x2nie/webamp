import json,os
from pprint import pprint
from docstring import scan_docstring

tpl_file = '''import {{ registry }} from "@web/core/registry";

export class {name} extends {parent} {{
  static GUID = "{guid}";
  static template = xml`<span c="{name}"/>`;

  {methods}
  // events binding ---------------
  {bindings}

}} // {name}
'''

def gen(std):
    klass = 'Container'

    mifile = f'resources/maki_compiler/v1.2.0 (Winamp 5.66)/lib/{std}.mi'
    docstrings = scan_docstring(mifile)
    # print('using:', docstrings.get(klass))
    jsonpath = f'src/maki/objectData/{std}.byname.json'
    # print(os.path.exists(jsonpath))
    with open(jsonpath, 'r') as f:
        c = json.load(f)

    o = c[klass]
    build_methods(klass, o, docstrings)
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
  {doc}{name}({params}){ret} {{}}{obsolete}
'''
tpl_binding = '''
  {doc}// {name}({params}){ret} {{}}{obsolete}
'''
tpl_doc = '''{}
  '''

def build_methods(klass, o, docstrings):

    o['methods'] = ''
    o['bindings'] = ''
    for fn in o['functions']:
        doc = docstrings[klass][fn['name']]
        if doc:
            doc = tpl_doc.format(doc)
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
        method = tpl.format(**fn, ret=ret, params=', '.join(params), obsolete=dep, doc=doc)

        if binding:
            o['bindings'] += method
        else:
            o['methods'] += method
# json.load()
# print(__file__)

# gen('../../src/maki/objectData/std.json')
# gen('.../../src/maki/objectData/std.json')
# gen('src/maki/objectData/std.byname.json')
gen('std')
