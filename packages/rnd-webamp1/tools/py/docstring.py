# coding=utf8
# the above tag defines encoding for this document and is for Python 2.x compatibility

import re

# regex = r"(\/\*\*[\s\S]*?\*\/\s*)?\s*extern(\s+.*)?\s+(.*)\.(.*)\((.*)\);\s*(\/\/.*$)?"
regex = r"(\/\*\*[\s\S]*?\*\/)?\s*(deprecated )?extern\s+(\w+\s+)?(\w+)\.(\w+).*;\s*(\/\/.*$)?"

from collections import defaultdict

def scan_docstring(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    return grab_docsring(content)

def grab_docsring(s):
    founds = defaultdict(dict)
    matches = re.finditer(regex, s, re.MULTILINE)

    for matchNum, match in enumerate(matches, start=1):
        # print ("\n\n==========Match {matchNum} was found at {start}-{end}: match".format(matchNum = matchNum, start = match.start(), end = match.end(), match = match.group()))
        # docstring = match.group(1) or match.group(6) or ''
        if match.group(1): 
            comments = match.group(1).strip().split('\n')
            docstring = '\n  '.join(comments)
        else:
            docstring = match.group(6) or ''
            docstring = docstring.replace('//', '// ').replace('  ',' ')
        klass = match.group(4)
        method = match.group(5)
        # print(klass,method,docstring)
        founds[klass][method] = docstring
        
        # for groupNum in range(0, len(match.groups())):
        #     groupNum = groupNum + 1
            
        #     print ("----------Group {groupNum} found at {start}-{end}: <{group}>".format(groupNum = groupNum, start = match.start(groupNum), end = match.end(groupNum), group = match.group(groupNum)))
    return founds

# Note: for Python 2.7 compatibility, use ur"" to prefix the regex and u"" to prefix the test string and substitution.

if __name__ == '__main__':
    test_str = '''extern String System.floatToString(float value, int ndigits);

deprecated extern String System.integerToLongTime(Int value);
/** stringToFloat()*/
extern Float System.stringToFloat(String str);

deprecated extern String System.integerToLongTime(Int value);

/** 
  integerToTime()
*/
extern String System.integerToTime(Int value);
extern String System.integerToTime(Int value);

extern System.formatDate(Int datetime); // formats the date according to the locales - short date format
'''
    a = grab_docsring(test_str)
    import pprint
    pprint.pprint(a)


    b = scan_docstring('resources/maki_compiler/v1.2.0 (Winamp 5.66)/lib/std.mi')
    # pprint.pprint(b)
    import json
    print(json.dumps(b, indent=3))