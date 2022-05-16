export default {
  B2AD3F2B31ED4e31BC6DE9951CD555BB: {
    parent: "Object",
    functions: [
      {
        result: "WinampConfigGroup",
        name: "getGroup",
        parameters: [["String", "config_group_guid"]],
      },
    ],
    name: "WinampConfig",
  },
  FC17844EC72B4518A068A8F930A5BA80: {
    parent: "Object",
    functions: [
      {
        result: "Boolean",
        name: "getBool",
        parameters: [["String", "itemname"]],
      },
      {
        result: "",
        name: "setBool",
        parameters: [
          ["String", "itemname"],
          ["Boolean", "itemvalue"],
        ],
      },
      {
        result: "Int",
        name: "getInt",
        parameters: [["String", "itemname"]],
      },
      {
        result: "",
        name: "setInt",
        parameters: [["String", "itemname"]],
      },
      {
        result: "String",
        name: "getString",
        parameters: [["String", "itemname"]],
      },
      {
        result: "",
        name: "setString",
        parameters: [["String", "itemname"]],
      },
    ],
    name: "WinampConfigGroup",
  },
};