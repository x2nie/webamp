// Author: ChatGPT 3.5 @ https://chat.openai.com/chat

const menuContent = `256 MENUEX
LANGUAGE LANG_ENGLISH, SUBLANG_ENGLISH_US
{
  POPUP "File", 65535, MFT_STRING, MFS_ENABLED, 0
  {
    MENUITEM SEPARATOR
    MENUITEM "Play &file...   	L", 40029, MFT_STRING, MFS_ENABLED
    MENUITEM "Play &URL...	Ctrl+L", 40185, MFT_STRING, MFS_ENABLED
    MENUITEM "Play &folder...	Shift+L", 40187, MFT_STRING, MFS_ENABLED
    POPUP "Play &bookmark", 65535, MFT_STRING, MFS_ENABLED, 0
    {
      MENUITEM "&Edit bookmarks...	Ctrl+Alt+I", 40320, MFT_STRING, MFS_ENABLED
      MENUITEM "&Add current as bookmark	Ctrl+Alt+B", 40321, MFT_STRING, MFS_ENABLED
      MENUITEM "", 0, MFT_SEPARATOR, MFS_ENABLED
    }
    MENUITEM "E&xit	Alt+F4", 40001, MFT_STRING, MFS_ENABLED
  }
  POPUP "ML_View", 65535, MFT_STRING, MFS_ENABLED, 0
  {
    MENUITEM "Media Library &Preferences...", 40372, MFT_STRING | MFT_RIGHTJUSTIFY, MFS_ENABLED
  }
  POPUP "&Bookmarks"
    {
      MENUITEM "&Edit bookmarks...	Ctrl+Alt+I",  40320
      MENUITEM "&Add current as bookmark	Ctrl+Alt+B",  40321
      MENUITEM SEPARATOR
      POPUP "&Tools",  GRAYED
      {
        MENUITEM "Migrate/Import...",  40009
        MENUITEM "Register Winamp...",  40010
      }
    }
}
`;


// Untuk mengkonversi menu tersebut ke dalam format JSON, 
// Anda dapat melakukan parsing manual dengan melakukan split string dan looping. 
// Berikut ini adalah contoh implementasi menggunakan JavaScript:

// Membuat fungsi untuk parsing string menu ke dalam format JSON
function parseMenuToJson(menuContent) {
  const root = [];
  let container = root;
  let levelStack = [root];
  // let currentItem = null

  // Looping setiap baris pada string menu
  for (let line of menuContent.split('\n')) {
    // Mengabaikan baris yang tidak penting
    if (!line || line.trim().startsWith('//')) {
      continue;
    }

    // Mengambil level pada baris saat ini
    // const level = line.search(/\S/);

    // Mengecek apakah baris merupakan menu
    // const menuMatch = line.match(/\s*(POPUP|MENUITEM)\s+"([^"]+)"(?:\s*,\s*(\d+))?,\s*(\d+),\s*(\d+)/i);
    const menuMatch = line.match(/\s*(POPUP|MENUITEM)\s+(SEPARATOR|"([^"]*)")(?:\s*,\s*(\d+)[\s,]*(.*))?/i);
    if (menuMatch) {
      // console.log('match', menuMatch)
      // Mengambil informasi menu
      const [, tag, t1,t2, sid, flags] = menuMatch;
      const type = tag=='POPUP'? 'popup': (t1 == 'SEPARATOR' || (flags || '').indexOf('MFT_SEPARATOR') >= 0) ? 'separator': 'menuitem';
      const id = type=='popup'? 65535: type == 'separator' ? 0 : parseInt(sid);
      // Membuat objek menu baru
      const newMenu = {
        // tag,
        type,
        // caption: type == 'separator'? '' : t2,
        caption: t2,
        // t2,
        // id: parseInt(id) || 0,
        id,
        // type: type.toLowerCase(),
        // flags: parseInt(flags),
        flags,
        // children: [],
      };
      container.push(newMenu); // attach to prent

      if(type=='popup'){
        newMenu.children = [];
        container = newMenu.children;
        levelStack.push(container)
      }

      // console.log('m', newMenu, '>>', flags)
      console.log('m', newMenu)

      // Menambahkan objek menu baru ke dalam parent menu yang sesuai
      // if (level > levelStack[levelStack.length - 1]) {
      //   levelStack.push(level);
      //   currentItem.children.push(newMenu);
      //   currentItem = newMenu;
      // } else {
      //   while (level < levelStack[levelStack.length - 1]) {
      //     levelStack.pop();
      //     currentItem = levelStack.length > 0 ? currentMenu : result;
      //   }
      //   currentItem.children.push(newMenu);
      //   currentItem = newMenu;
      // }
    } else if (line.trim() === '}') {
      // Menutup menu saat ini
      levelStack.pop(); 
      container = levelStack[levelStack.length-1];
    }
  }

  return root;
}

var m = parseMenuToJson(menuContent)
console.log(m)