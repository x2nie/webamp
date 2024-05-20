// import { loadFile, mount, App as OwlApp } from '@odoo/owl';
// import { App } from './skin/App';
// import './style.css'
import { Webamp } from "./webamp";
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// async function  main(){
// App.mount1(document.getElementById('app'))
// }

// main()

const webamp = new Webamp(document.getElementById("web-amp") || document.body, {
  // skin: .../,,,,
  skin: "assets/skins/SimpleTutorial/",
//   skin: 'assets/skins/MMD3.wal'
  // skin: 'skins/WinampModern566.wal'
});
document.getElementById('mmd3')?.addEventListener('click', ()=>{
  webamp.switchSkin('skins/MMD3.wal')
})
document.getElementById('tutorial')?.addEventListener('click', ()=>{
  webamp.switchSkin('/skins/SimpleTutorial/')
})

// setTimeout(() => {
//   webamp.app.say('helloBoss')
// }, 3000);
