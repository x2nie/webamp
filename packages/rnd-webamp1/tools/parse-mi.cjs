#!/usr/bin/env node

/**
 * Based on extract_objects.pl from Ralf Engels<ralf.engels@gmx.de> Maki decompiler
 */

const fs = require("fs");

function parseFile(filePath) {
  const mi = fs.readFileSync(filePath, "utf8");
  const lines = mi.split("\n");

  const objects = {};
  lines.forEach((line, lineNumber) => {
    const classDefinitionMatch =
      /\s*extern\s+class\s*\@\{(........\s?-\s?....\s?-\s?....\s?-\s?....\s?-\s?............)\}\s*\@\s*(.*?)\s+(.*?);/.exec(
        line
      );
    if (classDefinitionMatch) {
      const GUID = classDefinitionMatch[1];
      const id = classDefinitionMatch[1].replace(/[-\s]/g, "");
      const parent = classDefinitionMatch[2];
      const name = classDefinitionMatch[3]
        .replace(/^_predecl /, "")
        .replace(/^&/, "");
      const deprecated = /^deprecated\s/.test(line);
      objects[name.toLowerCase()] = {
        id,
        GUID,
        name,
        parent,
        deprecated,
        functions: [],
      };
    }

    // const methodMatch = /\s*extern(\s+.*)?\s+(.*)\.(.*)\((.*)\);/.exec(line);
    // const methodMatch = /(?:\/\*\*[\s\S]*?\*\/\s*)?\s*extern(\s+.*)?\s+(.*)\.(.*)\((.*)\);/.exec(line);
    const methodMatch = /(\/\*\*[\s\S]*?\*\/\s*)?\s*extern(\s+.*)?\s+(.*)\.(.*)\((.*)\);\s*(\/\/.*$)?/.exec(line);


    if (methodMatch) {
      // const docstring = methodMatch[0].match(/\/\*\*[\s\S]*?\*\//) ? methodMatch[0].match(/\/\*\*[\s\S]*?\*\//)[0] : "";
      const docstring = methodMatch[1] || methodMatch[6];
      console.log(methodMatch[1], '//', methodMatch[6])
   
      const methodDeprecated = /^deprecated\s/.test(line);
      const result = methodMatch[2] == null ? "" : methodMatch[2].trim();
      const className = methodMatch[3].toLowerCase();
      const name = methodMatch[4].trim();
      const rawArgs = methodMatch[5].split(/\s*,\s*/);
      const parameters = rawArgs.filter(Boolean).map((rawArg) => {
        const argMatch = /^\s*(.*\s+)?(.*)\s*/.exec(rawArg);
        if (argMatch == null) {
          throw new Error(`Could not find args in ${rawArg} in ${line}`);
        }
        const type = argMatch[1];
        if (type == null) {
          // console.warn(`Could not find args name in ${fileName}:${lineNum} "${line}"`);
          return [argMatch[2], "unknown_arg_name"];
        }
        return [type.trim(), argMatch[2]];
      });
      if (objects[className] == null) {
        throw new Error(
          `"${className} not defined in ${filePath}:${lineNumber}. I have ${JSON.stringify(
            Object.keys(objects)
          )}`
        );
      }
      objects[className].functions.push({
        name,
        parameters,
        result,
        deprecated: methodDeprecated,
        docstring,
      });
    }
  });

  const objectIds = {};
  Object.keys(objects).forEach((normalizedName) => {
    const { id, GUID, parent, functions, name, deprecated } = objects[normalizedName];
    const guid = getFormattedId(id)
    objectIds[name] = { name, parent, GUID, guid, deprecated, functions };
  });
/* 
  Object.keys(objects).forEach((normalizedName) => {
    const { id, parent, functions, name, deprecated } = objects[normalizedName];
    objectIds[id] = { parent, name, deprecated, functions };
  });
 */
  return objectIds;
}

function getFormattedId(id) {
  // https://en.wikipedia.org/wiki/Universally_unique_identifier#Encoding
  const formattedId = id.replace(
    /(........)(....)(....)(..)(..)(..)(..)(..)(..)(..)(..)/,
    "$1$3$2$7$6$5$4$11$10$9$8"
  );
  return formattedId.toLowerCase();
}
module.exports = { parseFile };
