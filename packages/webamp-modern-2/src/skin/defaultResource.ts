
export function getBitmap_system_elements(id:string){
    const dict = {
  
      'studio.basetexture': {file:'window/window-elementsextended3.png', gammagroup:'Display', },
      'studio.component.statusbar': {file:'player/minifont2.png', charwidth:'5', charheight:'6', hspacing:'0', vspacing:'0', gammagroup:'Display', },
    
      'statusbar.progress.inside': {file:'window/window-elements.png', x:'148', y:'92', h:'10', w:'40', gammagroup:'Display', },
      'statusbar.progress.outline': {file:'window/window-elements.png', x:'2', y:'170', h:'10', w:'100', gammagroup:'Backgrounds', },
    
    
      'wasabi.button.close.flat': {file:'window/window-elements.png', x:'160', y:'146', h:'10', w:'11', gammagroup:'Buttons', },
      'wasabi.button.close.flat.pressed': {file:'window/window-elements.png', x:'160', y:'156', h:'10', w:'11', gammagroup:'Buttons', },
    
      // Generic Lists and Trees
      'studio.green': {file:'window/green.png', x:'0', y:'0', h:'20', w:'20', gammagroup:'Display', },
      'studio.list.background': {file:'window/window-elementsextended.png', x:'0', y:'0', h:'100', w:'100', gammagroup:'Display', },
      'studio.tree.background': {file:'window/window-elementsextended2.png', x:'0', y:'0', h:'100', w:'100', gammagroup:'Display', },
    
      'studio.tree.tab.closed': {file:'window/window-elements.png', x:'149', y:'0', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.tab.open': {file:'window/window-elements.png', x:'135', y:'0', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.link.top.bottom': {file:'window/window-elements.png', x:'135', y:'14', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.link.top.right': {file:'window/window-elements.png', x:'135', y:'42', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.link.top.rightbottom': {file:'window/window-elements.png', x:'135', y:'28', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.link.tab.top.bottom': {file:'window/window-elements.png', x:'149', y:'14', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.link.tab.top.right': {file:'window/window-elements.png', x:'149', y:'42', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.link.tab.top.rightbottom': {file:'window/window-elements.png', x:'149', y:'28', h:'14', w:'14', gammagroup:'Display', },
      'studio.tree.sort.icon': {file:'window/tree-sort-icon.png', gammagroup:'Display', },
    
    
      // Old List & Tree scrollbars
      'studio.scrollbar.horizontal.background': {file:'window/window-elements.png', x:'58', y:'52', h:'13', w:'41', gammagroup:'Display', },
      'studio.scrollbar.horizontal.left': {file:'window/window-elements.png', x:'40', y:'13', h:'13', w:'17', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.left.hilite': {file:'window/window-elements.png', x:'40', y:'26', h:'13', w:'17', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.left.pressed': {file:'window/window-elements.png', x:'40', y:'39', h:'13', w:'17', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.right': {file:'window/window-elements.png', x:'98', y:'13', h:'13', w:'17', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.right.hilite': {file:'window/window-elements.png', x:'98', y:'26', h:'13', w:'17', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.right.pressed': {file:'window/window-elements.png', x:'98', y:'39', h:'13', w:'17', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.button': {file:'window/window-elements.png', x:'57', y:'13', h:'13', w:'41', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.button.hilite': {file:'window/window-elements.png', x:'57', y:'26', h:'13', w:'41', gammagroup:'Buttons', },
      'studio.scrollbar.horizontal.button.pressed': {file:'window/window-elements.png', x:'57', y:'39', h:'13', w:'41', gammagroup:'Buttons', },
    
      'studio.scrollbar.vertical.background': {file:'window/window-elements.png', x:'39', y:'55', h:'41', w:'13', gammagroup:'Display', },
      'studio.scrollbar.vertical.left': {file:'window/window-elements.png', x:'0', y:'38', h:'17', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.left.hilite': {file:'window/window-elements.png', x:'13', y:'38', h:'17', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.left.pressed': {file:'window/window-elements.png', x:'26', y:'38', h:'17', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.right': {file:'window/window-elements.png', x:'0', y:'96', h:'17', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.right.hilite': {file:'window/window-elements.png', x:'13', y:'96', h:'17', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.right.pressed': {file:'window/window-elements.png', x:'26', y:'96', h:'17', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.button': {file:'window/window-elements.png', x:'0', y:'55', h:'41', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.button.hilite': {file:'window/window-elements.png', x:'13', y:'55', h:'41', w:'13', gammagroup:'Buttons', },
      'studio.scrollbar.vertical.button.pressed': {file:'window/window-elements.png', x:'26', y:'55', h:'41', w:'13', gammagroup:'Buttons', },
    
      // NewList & Tree scrollbars
      'wasabi.scrollbar.horizontal.background': {file:'window/window-elements.png', x:'58', y:'52', h:'13', w:'41', gammagroup:'Backgrounds', },
      'wasabi.scrollbar.horizontal.left': {file:'window/window-elements.png', x:'40', y:'13', h:'13', w:'17', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.left.hover': {file:'window/window-elements.png', x:'40', y:'26', h:'13', w:'17', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.left.pressed': {file:'window/window-elements.png', x:'40', y:'39', h:'13', w:'17', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.right': {file:'window/window-elements.png', x:'98', y:'13', h:'13', w:'17', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.right.hover': {file:'window/window-elements.png', x:'98', y:'26', h:'13', w:'17', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.right.pressed': {file:'window/window-elements.png', x:'98', y:'39', h:'13', w:'17', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.horizontal.button.left': {file:'window/window-elements.png', x:'57', y:'13', h:'13', w:'3', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.button.middle': {file:'window/window-elements.png', x:'60', y:'13', h:'13', w:'35', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.button.right': {file:'window/window-elements.png', x:'95', y:'13', h:'13', w:'3', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.horizontal.button.left.hover': {file:'window/window-elements.png', x:'57', y:'26', h:'13', w:'3', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.button.middle.hover': {file:'window/window-elements.png', x:'60', y:'26', h:'13', w:'35', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.button.right.hover': {file:'window/window-elements.png', x:'95', y:'26', h:'13', w:'3', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.horizontal.button.left.pressed': {file:'window/window-elements.png', x:'57', y:'39', h:'13', w:'3', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.button.middle.pressed': {file:'window/window-elements.png', x:'60', y:'39', h:'13', w:'35', gammagroup:'Buttons', },
      'wasabi.scrollbar.horizontal.button.right.pressed': {file:'window/window-elements.png', x:'95', y:'39', h:'13', w:'3', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.vertical.background': {file:'window/window-elements.png', x:'39', y:'55', h:'41', w:'13', gammagroup:'Backgrounds', },
      'wasabi.scrollbar.vertical.left': {file:'window/window-elements.png', x:'0', y:'38', h:'17', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.left.hover': {file:'window/window-elements.png', x:'13', y:'38', h:'17', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.left.pressed': {file:'window/window-elements.png', x:'26', y:'38', h:'17', w:'13', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.vertical.right': {file:'window/window-elements.png', x:'0', y:'96', h:'17', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.right.hover': {file:'window/window-elements.png', x:'13', y:'96', h:'17', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.right.pressed': {file:'window/window-elements.png', x:'26', y:'96', h:'17', w:'13', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.vertical.button.top': {file:'window/window-elements.png', x:'0', y:'55', h:'3', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.button.middle': {file:'window/window-elements.png', x:'0', y:'58', h:'35', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.button.bottom': {file:'window/window-elements.png', x:'0', y:'93', h:'3', w:'13', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.vertical.button.top.hover': {file:'window/window-elements.png', x:'13', y:'55', h:'3', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.button.middle.hover': {file:'window/window-elements.png', x:'13', y:'58', h:'35', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.button.bottom.hover': {file:'window/window-elements.png', x:'13', y:'93', h:'3', w:'13', gammagroup:'Buttons', },
    
      'wasabi.scrollbar.vertical.button.top.pressed': {file:'window/window-elements.png', x:'26', y:'55', h:'3', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.button.middle.pressed': {file:'window/window-elements.png', x:'26', y:'58', h:'35', w:'13', gammagroup:'Buttons', },
      'wasabi.scrollbar.vertical.button.bottom.pressed': {file:'window/window-elements.png', x:'26', y:'93', h:'3', w:'13', gammagroup:'Buttons', },
    
      // Generic Sliders
      'wasabi.slider.horizontal.left': {file:'window/window-elements.png', x:'106', y:'149', h:'8', w:'8', gammagroup:'Display', },
      'wasabi.slider.horizontal.middle': {file:'window/window-elements.png', x:'115', y:'149', h:'8', w:'10', gammagroup:'Display', },
      'wasabi.slider.horizontal.right': {file:'window/window-elements.png', x:'126', y:'149', h:'8', w:'8', gammagroup:'Display', },
      'wasabi.slider.vertical.top': {file:'window/window-elements.png', x:'138', y:'136', h:'8', w:'8', gammagroup:'Display', },
      'wasabi.slider.vertical.middle': {file:'window/window-elements.png', x:'138', y:'145', h:'10', w:'8', gammagroup:'Display', },
      'wasabi.slider.vertical.bottom': {file:'window/window-elements.png', x:'138', y:'156', h:'8', w:'8', gammagroup:'Display', },
      'wasabi.slider.horizontal.button': {file:'window/window-elements.png', x:'106', y:'136', h:'13', w:'15', gammagroup:'Buttons', },
      'wasabi.slider.horizontal.button.pressed': {file:'window/window-elements.png', x:'121', y:'136', h:'13', w:'15', gammagroup:'Buttons', },
      'wasabi.slider.vertical.button': {file:'window/window-elements.png', x:'106', y:'157', h:'12', w:'16', gammagroup:'Buttons', },
      'wasabi.slider.vertical.button.pressed': {file:'window/window-elements.png', x:'122', y:'157', h:'12', w:'16', gammagroup:'Buttons', },
    
      // Generic Button
      'wasabi.button.label.arrow.up': {file:'window/window-elements.png', x:'137', y:'75', h:'4', w:'7', gammagroup:'Buttons', },
      'wasabi.button.label.arrow.down': {file:'window/window-elements.png', x:'137', y:'86', h:'4', w:'7', gammagroup:'Buttons', },
      'wasabi.button.label.arrow.left': {file:'window/window-elements.png', x:'133', y:'79', h:'7', w:'4', gammagroup:'Buttons', },
      'wasabi.button.label.arrow.right': {file:'window/window-elements.png', x:'144', y:'79', h:'7', w:'4', gammagroup:'Buttons', },
      'wasabi.button.label.ellipses': {file:'window/window-elements.png', x:'138', y:'92', h:'1', w:'5', gammagroup:'Buttons', },
    
      'wasabi.button.top.left': {file:'window/window-elements.png', x:'0', y:'134', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.top': {file:'window/window-elements.png', x:'4', y:'134', h:'4', w:'25', gammagroup:'Buttons', },
      'wasabi.button.top.right': {file:'window/window-elements.png', x:'29', y:'134', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.left': {file:'window/window-elements.png', x:'0', y:'138', h:'25', w:'4', gammagroup:'Buttons', },
      'wasabi.button.center': {file:'window/window-elements.png', x:'4', y:'138', h:'25', w:'25', gammagroup:'Buttons', },
      'wasabi.button.right': {file:'window/window-elements.png', x:'29', y:'138', h:'25', w:'4', gammagroup:'Buttons', },
      'wasabi.button.bottom.left': {file:'window/window-elements.png', x:'0', y:'163', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.bottom': {file:'window/window-elements.png', x:'4', y:'163', h:'4', w:'25', gammagroup:'Buttons', },
      'wasabi.button.bottom.right': {file:'window/window-elements.png', x:'29', y:'163', h:'4', w:'4', gammagroup:'Buttons', },
    
      'wasabi.button.hover.top.left': {file:'window/window-elements.png', x:'33', y:'134', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.hover.top': {file:'window/window-elements.png', x:'37', y:'134', h:'4', w:'25', gammagroup:'Buttons', },
      'wasabi.button.hover.top.right': {file:'window/window-elements.png', x:'62', y:'134', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.hover.left': {file:'window/window-elements.png', x:'33', y:'138', h:'25', w:'4', gammagroup:'Buttons', },
      'wasabi.button.hover.center': {file:'window/window-elements.png', x:'37', y:'138', h:'25', w:'25', gammagroup:'Buttons', },
      'wasabi.button.hover.right': {file:'window/window-elements.png', x:'62', y:'138', h:'25', w:'4', gammagroup:'Buttons', },
      'wasabi.button.hover.bottom.left': {file:'window/window-elements.png', x:'33', y:'163', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.hover.bottom': {file:'window/window-elements.png', x:'37', y:'163', h:'4', w:'25', gammagroup:'Buttons', },
      'wasabi.button.hover.bottom.right': {file:'window/window-elements.png', x:'62', y:'163', h:'4', w:'4', gammagroup:'Buttons', },
    
      'wasabi.button.pressed.top.left': {file:'window/window-elements.png', x:'66', y:'134', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.pressed.top': {file:'window/window-elements.png', x:'70', y:'134', h:'4', w:'25', gammagroup:'Buttons', },
      'wasabi.button.pressed.top.right': {file:'window/window-elements.png', x:'95', y:'134', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.pressed.left': {file:'window/window-elements.png', x:'66', y:'138', h:'25', w:'4', gammagroup:'Buttons', },
      'wasabi.button.pressed.center': {file:'window/window-elements.png', x:'70', y:'138', h:'25', w:'25', gammagroup:'Buttons', },
      'wasabi.button.pressed.right': {file:'window/window-elements.png', x:'95', y:'138', h:'25', w:'4', gammagroup:'Buttons', },
      'wasabi.button.pressed.bottom.left': {file:'window/window-elements.png', x:'66', y:'163', h:'4', w:'4', gammagroup:'Buttons', },
      'wasabi.button.pressed.bottom': {file:'window/window-elements.png', x:'70', y:'163', h:'4', w:'25', gammagroup:'Buttons', },
      'wasabi.button.pressed.bottom.right': {file:'window/window-elements.png', x:'95', y:'163', h:'4', w:'4', gammagroup:'Buttons', },
    
      // x2nie
      'studio.button': {file:'window/window-elements.png', x:'1', y:'135', h:'31', w:'31', gammagroup:'Buttons', },
      'studio.button.pressed': {file:'window/window-elements.png', x:'67', y:'135', h:'31', w:'31', gammagroup:'Buttons', },
    
      // default button
      'studio.button.upperleft': {file:'window/window-elements.png', x:'1', y:'135', h:'2', w:'2', gammagroup:'Buttons', },
      'studio.button.top': {file:'window/window-elements.png', x:'4', y:'135', h:'2', w:'25', gammagroup:'Buttons', },
      'studio.button.upperright': {file:'window/window-elements.png', x:'30', y:'135', h:'2', w:'2', gammagroup:'Buttons', },
      'studio.button.left': {file:'window/window-elements.png', x:'1', y:'138', h:'25', w:'2', gammagroup:'Buttons', },
      'studio.button.middle': {file:'window/window-elements.png', x:'4', y:'138', h:'25', w:'25', gammagroup:'Buttons', },
      'studio.button.right': {file:'window/window-elements.png', x:'30', y:'138', h:'25', w:'2', gammagroup:'Buttons', },
      'studio.button.lowerleft': {file:'window/window-elements.png', x:'1', y:'164', h:'2', w:'2', gammagroup:'Buttons', },
      'studio.button.bottom': {file:'window/window-elements.png', x:'4', y:'164', h:'2', w:'25', gammagroup:'Buttons', },
      'studio.button.lowerright': {file:'window/window-elements.png', x:'30', y:'164', h:'2', w:'2', gammagroup:'Buttons', },
    
      'studio.button.pressed.upperleft': {file:'window/window-elements.png', x:'67', y:'135', h:'2', w:'2', gammagroup:'Buttons', },
      'studio.button.pressed.top': {file:'window/window-elements.png', x:'70', y:'135', h:'2', w:'25', gammagroup:'Buttons', },
      'studio.button.pressed.upperright': {file:'window/window-elements.png', x:'96', y:'135', h:'2', w:'2', gammagroup:'Buttons', },
      'studio.button.pressed.left': {file:'window/window-elements.png', x:'67', y:'138', h:'25', w:'2', gammagroup:'Buttons', },
      'studio.button.pressed.middle': {file:'window/window-elements.png', x:'70', y:'138', h:'25', w:'25', gammagroup:'Buttons', },
      'studio.button.pressed.right': {file:'window/window-elements.png', x:'96', y:'138', h:'25', w:'2', gammagroup:'Buttons', },
      'studio.button.pressed.lowerleft': {file:'window/window-elements.png', x:'67', y:'164', h:'2', w:'2', gammagroup:'Buttons', },
      'studio.button.pressed.bottom': {file:'window/window-elements.png', x:'70', y:'164', h:'2', w:'25', gammagroup:'Buttons', },
      'studio.button.pressed.lowerright': {file:'window/window-elements.png', x:'96', y:'164', h:'2', w:'2', gammagroup:'Buttons', },
    
      // Context menu
      'studio.button.checkmark': {file:'menu/generic-menu-icon-check.png', gammagroup:'Buttons', },
      'studio.popup.seperator': {file:'menu/generic-menu-divider.png', gammagroup:'Backgrounds', },
      'studio.popup.background': {file:'menu/generic-menu-background.png', x:'0', y:'0', w:'255', h:'100', gammagroup:'Backgrounds', },
      'studio.popup.border.topleft': {file:'menu/generic-menu-top-left.png', gammagroup:'Frontcover', },
      'studio.popup.border.topright': {file:'menu/generic-menu-top-right.png', gammagroup:'Frontcover', },
      'studio.popup.border.bottomleft': {file:'menu/generic-menu-bottom-left.png', gammagroup:'Backgrounds', },
      'studio.popup.border.bottomright': {file:'menu/generic-menu-bottom-right.png', gammagroup:'Backgrounds', },
      'studio.popup.border.left': {file:'menu/generic-menu-left.png', gammagroup:'Backgrounds', x:'0', y:'0', w:'3', h:'10', },
      'studio.popup.border.right': {file:'menu/generic-menu-right.png', gammagroup:'Backgrounds', x:'0', y:'0', w:'3', h:'10', },
      'studio.popup.border.top': {file:'menu/generic-menu-top.png', gammagroup:'Frontcover', },
      'studio.popup.border.bottom': {file:'menu/generic-menu-bottom.png', gammagroup:'Backgrounds', },
      'studio.popup.submenuicon': {file:'menu/menu-submenu-icon.png', gammagroup:'Backgrounds', },
      'studio.popup.selection.left': {file:'menu/selbar.png', x:'0', y:'0', w:'5', h:'15', gammagroup:'Display', },
      'studio.popup.selection.right': {file:'menu/selbar.png', x:'27', y:'0', w:'5', h:'15', gammagroup:'Display', },
      'studio.popup.selection.center': {file:'menu/selbar.png', x:'6', y:'0', w:'20', h:'15', gammagroup:'Display', },
    
      'wasabi.button.checkmark': {file:'menu/generic-menu-icon-check.png', gammagroup:'Backgrounds', },
      'wasabi.popup.seperator': {file:'menu/generic-menu-divider.png', gammagroup:'Backgrounds', },
      'wasabi.popup.background': {file:'menu/generic-menu-background.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.topleft': {file:'menu/generic-menu-top-left.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.topright': {file:'menu/generic-menu-top-right.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.bottomleft': {file:'menu/generic-menu-bottom-left.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.bottomright': {file:'menu/generic-menu-bottom-right.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.left': {file:'menu/generic-menu-left.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.right': {file:'menu/generic-menu-right.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.top': {file:'menu/generic-menu-top.png', gammagroup:'Backgrounds', },
      'wasabi.popup.border.bottom': {file:'menu/generic-menu-bottom.png', gammagroup:'Backgrounds', },
      'wasabi.popup.submenuicon': {file:'menu/menu-submenu-icon.png', gammagroup:'Backgrounds', },
      'wasabi.popup.selection.left': {file:'menu/selbar.png', x:'0', y:'0', w:'5', h:'10', gammagroup:'Display', },
      'wasabi.popup.selection.right': {file:'menu/selbar.png', x:'6', y:'0', w:'5', h:'10', gammagroup:'Display', },
      'wasabi.popup.selection.center': {file:'menu/selbar.png', x:'27', y:'0', w:'20', h:'10', gammagroup:'Display', },
    
      'pe.marker': {file:'component/marker.png', },
    
    
      // Generic Group Box
      'wasabi.groupbox.top.left': {file:'window/window-elements.png', x:'116', y:'13', h:'3', w:'3', gammagroup:'Display', },
      'wasabi.groupbox.top': {file:'window/window-elements.png', x:'120', y:'13', h:'3', w:'8', gammagroup:'Display', },
      'wasabi.groupbox.top.right': {file:'window/window-elements.png', x:'129', y:'13', h:'3', w:'3', gammagroup:'Display', },
      'wasabi.groupbox.left': {file:'window/window-elements.png', x:'116', y:'17', h:'8', w:'3', gammagroup:'Display', },
      'wasabi.groupbox.right': {file:'window/window-elements.png', x:'129', y:'17', h:'8', w:'3', gammagroup:'Display', },
      'wasabi.groupbox.bottom.left': {file:'window/window-elements.png', x:'116', y:'26', h:'3', w:'3', gammagroup:'Display', },
      'wasabi.groupbox.bottom': {file:'window/window-elements.png', x:'120', y:'26', h:'3', w:'8', gammagroup:'Display', },
      'wasabi.groupbox.bottom.right': {file:'window/window-elements.png', x:'129', y:'26', h:'3', w:'3', gammagroup:'Display', },
    
    
      // Component status bar
      'studio.statusbar.left': {file:'window/window-elements.png', x:'94', y:'0', h:'12', w:'12', },
      'studio.statusbar.middle': {file:'window/window-elements.png', x:'107', y:'0', h:'12', w:'12', },
      'studio.statusbar.right': {file:'window/window-elements.png', x:'120', y:'0', h:'12', w:'12', },
    
    
      // Standard Configuration Widgets
      'wasabi.button.checkbox': {file:'window/window-elements.png', x:'79', y:'77', h:'7', w:'7', gammagroup:'Buttons', },
      'wasabi.button.checkbox.pressed': {file:'window/window-elements.png', x:'58', y:'77', h:'7', w:'7', gammagroup:'Buttons', },
    
      'wasabi.button.checkbox.xbox': {file:'window/window-elements.png', x:'79', y:'77', h:'7', w:'7', gammagroup:'Buttons', },
      'wasabi.button.checkbox.xbox.pressed': {file:'window/window-elements.png', x:'65', y:'77', h:'7', w:'7', gammagroup:'Buttons', },
    
      'wasabi.button.radio.background': {file:'window/window-elements.png', x:'58', y:'66', h:'11', w:'11', gammagroup:'Display', },
      'wasabi.button.radio.background.display': {file:'window/window-elements.png', x:'69', y:'66', h:'9', w:'9', gammagroup:'Backgrounds', },
      'wasabi.button.radio': {file:'window/window-elements.png', x:'89', y:'77', h:'7', w:'7', gammagroup:'Buttons', },
      'wasabi.button.radio.pressed': {file:'window/window-elements.png', x:'72', y:'77', h:'7', w:'7', gammagroup:'Buttons', },
    
    
      // Combo Box List
      'wasabi.dropdownlist.list.top.left': {file:'window/window-elements.png', x:'40', y:'124', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.dropdownlist.list.top': {file:'window/window-elements.png', x:'41', y:'124', h:'1', w:'10', gammagroup:'Display', },
      'wasabi.dropdownlist.list.top.right': {file:'window/window-elements.png', x:'51', y:'124', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.dropdownlist.list.left': {file:'window/window-elements.png', x:'40', y:'125', h:'8', w:'1', gammagroup:'Display', },
      'wasabi.dropdownlist.list.center': {file:'window/window-elements.png', x:'41', y:'125', h:'8', w:'10', gammagroup:'Display', },
      'wasabi.dropdownlist.list.right': {file:'window/window-elements.png', x:'51', y:'125', h:'8', w:'1', gammagroup:'Display', },
      'wasabi.dropdownlist.list.bottom.left': {file:'window/window-elements.png', x:'40', y:'133', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.dropdownlist.list.bottom': {file:'window/window-elements.png', x:'41', y:'133', h:'1', w:'10', gammagroup:'Display', },
      'wasabi.dropdownlist.list.bottom.right': {file:'window/window-elements.png', x:'51', y:'133', h:'1', w:'1', gammagroup:'Display', },
    
      // Embedded Window
      'wasabi.window.top.left': {file:'window/window-elements.png', x:'0', y:'114', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.window.top': {file:'window/window-elements.png', x:'1', y:'114', h:'1', w:'17', gammagroup:'Display', },
      'wasabi.window.top.right': {file:'window/window-elements.png', x:'18', y:'114', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.window.left': {file:'window/window-elements.png', x:'0', y:'115', h:'17', w:'1', gammagroup:'Display', },
      'wasabi.window.center': {file:'window/window-elements.png', x:'1', y:'115', h:'17', w:'17', gammagroup:'Display', },
      'wasabi.window.right': {file:'window/window-elements.png', x:'18', y:'115', h:'17', w:'1', gammagroup:'Display', },
      'wasabi.window.bottom.left': {file:'window/window-elements.png', x:'0', y:'132', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.window.bottom': {file:'window/window-elements.png', x:'1', y:'132', h:'1', w:'17', gammagroup:'Display', },
      'wasabi.window.bottom.right': {file:'window/window-elements.png', x:'18', y:'132', h:'1', w:'1', gammagroup:'Display', },
    
      // Panel Bevels
      'wasabi.panel.top.left': {file:'window/window-elements.png', x:'19', y:'114', h:'2', w:'2', gammagroup:'Display', },
      'wasabi.panel.top': {file:'window/window-elements.png', x:'21', y:'114', h:'2', w:'16', gammagroup:'Display', },
      'wasabi.panel.top.right': {file:'window/window-elements.png', x:'37', y:'114', h:'2', w:'2', gammagroup:'Display', },
      'wasabi.panel.left': {file:'window/window-elements.png', x:'19', y:'116', h:'16', w:'2', gammagroup:'Display', },
      'wasabi.panel.right': {file:'window/window-elements.png', x:'37', y:'116', h:'16', w:'2', gammagroup:'Display', },
      'wasabi.panel.bottom.left': {file:'window/window-elements.png', x:'19', y:'132', h:'2', w:'2', gammagroup:'Display', },
      'wasabi.panel.bottom': {file:'window/window-elements.png', x:'21', y:'132', h:'2', w:'16', gammagroup:'Display', },
      'wasabi.panel.bottom.right': {file:'window/window-elements.png', x:'37', y:'132', h:'2', w:'2', gammagroup:'Display', },
      'wasabi.panel.tint': {file:'window/window-elements.png', x:'24', y:'119', h:'10', w:'10', gammagroup:'Display', },
    
      // Object Frame
      'wasabi.objectframe.top.left': {file:'window/window-elements.png', x:'0', y:'114', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.objectframe.top': {file:'window/window-elements.png', x:'1', y:'114', h:'1', w:'17', gammagroup:'Display', },
      'wasabi.objectframe.top.right': {file:'window/window-elements.png', x:'18', y:'114', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.objectframe.left': {file:'window/window-elements.png', x:'0', y:'115', h:'17', w:'1', gammagroup:'Display', },
      'wasabi.objectframe.center': {file:'window/window-elements.png', x:'1', y:'115', h:'17', w:'17', gammagroup:'Display', },
      'wasabi.objectframe.right': {file:'window/window-elements.png', x:'18', y:'115', h:'17', w:'1', gammagroup:'Display', },
      'wasabi.objectframe.bottom.left': {file:'window/window-elements.png', x:'0', y:'132', h:'1', w:'1', gammagroup:'Display', },
      'wasabi.objectframe.bottom': {file:'window/window-elements.png', x:'1', y:'132', h:'1', w:'17', gammagroup:'Display', },
      'wasabi.objectframe.bottom.right': {file:'window/window-elements.png', x:'18', y:'132', h:'1', w:'1', gammagroup:'Display', },
    
      // TabSheet
      'wasabi.tabsheet.button.topleft': {file:'window/tabs.png', x:'0', y:'0', w:'10', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.top': {file:'window/tabs.png', x:'10', y:'0', w:'46', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.topright': {file:'window/tabs.png', x:'56', y:'0', w:'10', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.left': {file:'window/tabs.png', x:'0', y:'21', w:'10', h:'2', gammagroup:'Display', },
      'wasabi.tabsheet.button.right': {file:'window/tabs.png', x:'56', y:'21', w:'10', h:'2', gammagroup:'Display', },
      'wasabi.tabsheet.button.bottom': {file:'window/tabs.png', x:'0', y:'26', w:'66', h:'2', gammagroup:'Display', },
      'wasabi.tabsheet.button.shade.topleft': {file:'window/tabs.png', x:'0', y:'29', w:'10', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.shade.top': {file:'window/tabs.png', x:'10', y:'29', w:'46', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.shade.topright': {file:'window/tabs.png', x:'56', y:'29', w:'10', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.shade.left': {file:'window/tabs.png', x:'0', y:'39', w:'10', h:'2', gammagroup:'Display', },
      'wasabi.tabsheet.button.shade.middle': {file:'window/tabs.png', x:'10', y:'39', w:'46', h:'20', gammagroup:'Display', },
      'wasabi.tabsheet.button.shade.right': {file:'window/tabs.png', x:'56', y:'39', w:'10', h:'2', gammagroup:'Display', },
    
    
      'wasabi.label.top.left': {file:'window/window-elements.png', x:'145', y:'108', w:'2', h:'2', gammagroup:'Display', },
      'wasabi.label.top': {file:'window/window-elements.png', x:'148', y:'108', w:'30', h:'2', gammagroup:'Display', },
      'wasabi.label.top.right': {file:'window/window-elements.png', x:'189', y:'108', w:'2', h:'2', gammagroup:'Display', },
      'wasabi.label.left': {file:'window/window-elements.png', x:'145', y:'110', w:'2', h:'14', gammagroup:'Display', },
      'wasabi.label.middle': {file:'window/window-elements.png', x:'148', y:'110', w:'30', h:'14', gammagroup:'Display', },
      'wasabi.label.right': {file:'window/window-elements.png', x:'189', y:'110', w:'2', h:'14', gammagroup:'Display', },
      'wasabi.label.bottom.left': {file:'window/window-elements.png', x:'145', y:'124', w:'2', h:'2', gammagroup:'Display', },
      'wasabi.label.bottom': {file:'window/window-elements.png', x:'148', y:'124', w:'30', h:'2', gammagroup:'Display', },
      'wasabi.label.bottom.right': {file:'window/window-elements.png', x:'189', y:'124', w:'2', h:'2', gammagroup:'Display', },
      'wasabi.label.arrow.down': {file:'window/window-elements.png', x:'154', y:'130', h:'6', w:'9', gammagroup:'Display', },
    
    }
    const ret = dict[id];
    if(ret){
      ret.id = id
    }
    return ret
  }