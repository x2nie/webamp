# coding=utf8
# the above tag defines encoding for this document and is for Python 2.x compatibility

import re

# regex = r"(\/\*\*[\s\S]*?\*\/\s*)?\s*extern(\s+.*)?\s+(.*)\.(.*)\((.*)\);\s*(\/\/.*$)?"
regex = r"(\/\*\*[\s\S]*?\*\/)?\s*(deprecated )?extern\s+(\w+\s+)?(\w+)\.(\w+).*;\s*(\/\/.*$)?"
regex = r"(\/\*\*\s[\s\S]*?\*\/)?\s*(deprecated )?extern\s+(\w+\s+)?(\w+)\.(\w+)\s*\((.*)\);\s*(\/\/.*$)?"

from collections import defaultdict

def scan_docstring(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    return grab_docsring(content)

def grab_docsring(s):
    founds = defaultdict(lambda: defaultdict(dict))

    #? real grab docstring
    matches = re.finditer(regex, s, re.MULTILINE)

    for matchNum, match in enumerate(matches, start=1):
        print ("\n\n==========Match {matchNum} was found at {start}-{end}: match".format(matchNum = matchNum, start = match.start(), end = match.end(), match = match.group()))
        # docstring = match.group(1) or match.group(6) or ''
        if match.group(1): 
            comments = match.group(1).strip().split('\n')
            docstring = '\n  '.join(comments)
            if docstring.count('/**') > 1:
                docstring = docstring[docstring.find('/**', 3):]
        else:
            docstring = match.group(7) or ''
            docstring = docstring.replace('//', '// ').replace('  ',' ')
        deprecated = (match.group(2) or '').strip() 
        deprecated = True if deprecated else False
        ret = (match.group(3) or '').strip()
        klass = match.group(4)
        method = match.group(5)
        params = match.group(6)
        args = [i.strip() for i in params.split(',') if i.strip()]
        kwargs = [k.split(' ') for k in args]
        
        # print(klass,method,docstring)
        founds[klass][method]['doc'] = docstring
        
        for groupNum in range(0, len(match.groups())):
            groupNum = groupNum + 1
            
            # print ("----------Group {groupNum} found at {start}-{end}: <{group}>".format(groupNum = groupNum, start = match.start(groupNum), end = match.end(groupNum), group = match.group(groupNum)))
        for k in 'docstring deprecated klass method kwargs'.split(' '):
            print ("----------{key} {value}".format(key=k, value=repr(locals()[k])))

    return founds

# Note: for Python 2.7 compatibility, use ur"" to prefix the regex and u"" to prefix the test string and substitution.

if __name__ == '__main__':
    test_str = '''extern String System.2floatToString(float value, int ndigits);

deprecated extern String System.3integerToLongTime(Int value);
/** 4stringToFloat()*/
extern Float System.4stringToFloat(String str);

deprecated extern String System.5integerToLongTime(Int value);

//*****************************************************************************
// Container CLASS
//*****************************************************************************
/**
 Container Class.

 @short    The container class enables you to control current containers and also create them.
 @author   Nullsoft Inc.
 @ver  1.0
*/

/** 
  6integerToTime()
*/
extern String System.6integerToTime(Int value, String foo, Boolean bar);
extern System.7integerToTime();// 7formats the date according to the locales - short date format
extern int System.getFileSize(String fullfilename); //Requires 5.51

//*****************************************************************************
// Container CLASS
//*****************************************************************************
/**
 Container Class.

 @short    The container class enables you to control current containers and also create them.
 @author   Nullsoft Inc.
 @ver  1.0
*/

/**
 onSwitchToLayout()

 Hookable. Event happens when a container is going to switch 
 from the currently active layout to another layout (newlayout).

 @param newlayout  The new layout that will be used.
*/
extern Container.onSwitchToLayout(Layout newlayout);
'''
    a = grab_docsring(test_str)
    # import pprint
    # pprint.pprint(a)
    import json
    print(json.dumps(a, indent=3))


    # b = scan_docstring('resources/maki_compiler/v1.2.0 (Winamp 5.66)/lib/std.mi')
    # # pprint.pprint(b)
    # import json
    # print(json.dumps(b, indent=3))