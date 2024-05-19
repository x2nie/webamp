# coding=utf8
# the above tag defines encoding for this document and is for Python 2.x compatibility

import re

# regex = r"(\/\*\*[\s\S]*?\*\/\s*)?\s*extern(\s+.*)?\s+(.*)\.(.*)\((.*)\);\s*(\/\/.*$)?"
# regex = r"(\/\*\*[\s\S]*?\*\/)?\s*(deprecated )?extern\s+(\w+\s+)?(\w+)\.(\w+).*;\s*(\/\/.*$)?"

from collections import defaultdict

def scan_docstring(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    return grab_docsring(content)

def grab_docsring(s):
    founds = defaultdict(lambda: defaultdict(dict))

    #? classs definition
    regex = r"\s*(deprecated )?extern\s+class\s*\@\{(........\s?-\s?....\s?-\s?....\s?-\s?....\s?-\s?............)\}\s*\@\s*(.*?)\s+(_predecl )?(&)?(.*?);"
    matches = re.finditer(regex, s, re.MULTILINE)

    for matchNum, match in enumerate(matches, start=1):
        deprecated = (match.group(1) or '').strip()
        deprecated = True if deprecated else False
        GUID = match.group(2).upper()
        guid = getFormattedId(GUID).lower()
        parent = match.group(3) 
        klass = match.group(6) 

        for k in 'GUID guid deprecated parent'.split(' '):
            # founds[klass]['_CLASS'][k] = locals()[k]
            founds['_CLASS'][klass][k] = locals()[k]
    
        # print ("\n\n===Match {matchNum} was found at {start}-{end}: {match}".format(matchNum = matchNum, start = match.start(), end = match.end(), match = match.group()))
        # for k in 'GUID deprecated parent klass'.split(' '):
        #     print ("----------{key} {value}".format(key=k, value=repr(locals()[k])))

        # for groupNum in range(0, len(match.groups())):
        #     groupNum = groupNum + 1
            
        #     print ("---Group {groupNum} found at {start}-{end}: <{group}>".format(groupNum = groupNum, start = match.start(groupNum), end = match.end(groupNum), group = match.group(groupNum)))

    # return founds


    #? real grab docstring
    regex = r"(\/\*\*\s[\s\S]*?\*\/)?\s*(deprecated )?extern\s+(\w+\s+)?(\w+)\.(\w+)\s*\((.*)\);\s*(\/\/.*$)?"
    matches = re.finditer(regex, s, re.MULTILINE)

    for matchNum, match in enumerate(matches, start=1):
        # print ("\n\n==========Match {matchNum} was found at {start}-{end}: match".format(matchNum = matchNum, start = match.start(), end = match.end(), match = match.group()))
        # docstring = match.group(1) or match.group(6) or ''
        method = match.group(5).strip()
        deprecated = (match.group(2) or '').strip() 
        deprecated = True if deprecated else False
        if match.group(1): 
            comments = match.group(1).strip().split('\n')
            if len(comments) > 1 and comments[1].strip().startswith(method):
                del comments[1]
                if not comments[1].strip(): #empty line
                    del comments[1]
            if deprecated:
                comments.insert(1, '@deprecated')

            if len(comments) > 1 :
                for i in range(1, len(comments)):
                    comments[i] = ' * '+ comments[i].strip()
                comments[-1] = ' */'

            docstring = '\n  '.join(comments)
            if docstring.count('/**') > 1:
                docstring = docstring[docstring.find('/**', 3):]
            
        else:
            docstring = match.group(7) or ''
            docstring = docstring.replace('//', '// ').replace('  ',' ')
            if docstring.lower().startswith('// require'):
                docstring = ''
        doc = docstring
        result = (match.group(3) or '').strip()
        klass = match.group(4)
        # method = match.group(5)
        params = match.group(6)
        args = [i.strip() for i in params.split(',') if i.strip()]
        parameters = [k.split(' ') for k in args]
        
        for k in 'doc deprecated method parameters result'.split(' '):
            founds[klass][method][k] = locals()[k]
        # print(klass,method,docstring)
        # founds[klass][method]['doc'] = docstring
        
        for groupNum in range(0, len(match.groups())):
            groupNum = groupNum + 1
            
            # print ("----------Group {groupNum} found at {start}-{end}: <{group}>".format(groupNum = groupNum, start = match.start(groupNum), end = match.end(groupNum), group = match.group(groupNum)))
        # for k in 'docstring deprecated klass method kwargs'.split(' '):
        #     print ("----------{key} {value}".format(key=k, value=repr(locals()[k])))

    return founds

def getFormattedId(GUID):
    regex = r"(........)-(....)-(....)-(..)(..)-(..)(..)(..)(..)(..)(..)"
    subst = "\\1\\3\\2\\7\\6\\5\\4\\11\\10\\9\\8"
    subst = r"\1\3\2\7\6\5\4\11\10\9\8"

    # You can manually specify the number of replacements by changing the 4th argument
    return re.sub(regex, subst, GUID, 0)

# Note: for Python 2.7 compatibility, use ur"" to prefix the regex and u"" to prefix the test string and substitution.

if __name__ == '__main__':
    test_str = '''#define deprecated //

// GUIDS
extern class @{51654971-0D87-4a51-91E3-A6B53235F3E7}@ @{00000000-0000-0000-0000-000000000000}@ Object;
extern class @{D6F50F64-93FA-49b7-93F1-BA66EFAE3E98}@ Object _predecl System;
extern class @{E90DC47B-840D-4ae7-B02C-040BD275F7FC}@ Object Container;
deprecated extern class @{00C074A0-FEA2-49a0-BE8D-FABBDB161640}@ Object Wac; 
deprecated extern class @{2D2D1376-BE0A-4CB9-BC0C-57E6E4C999F5}@ GuiObject &Form;
extern class @{73C00594-961F-401B-9B1B-672427AC4165}@ GuiObject	&Menu;	// Winamp 5.52
extern String System.2floatToString(float value, int ndigits);

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