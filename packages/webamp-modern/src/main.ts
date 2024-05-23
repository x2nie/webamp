// import { loadFile, mount, App as OwlApp } from '@odoo/owl';
// import { App } from './skin/App';
// import './style.css'
import { Component, mount, xml } from "@odoo/owl";
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
  // skin: "assets/skins/SimpleTutorial/",
    skin: 'assets/skins/MMD3.wal'
  // skin: 'skins/WinampModern566.wal'
});
document.getElementById("mmd3")?.addEventListener("click", () => {
  webamp.switchSkin("skins/MMD3.wal");
});
document.getElementById("tutorial")?.addEventListener("click", () => {
  webamp.switchSkin("/skins/SimpleTutorial/");
});

// setTimeout(() => {
//   webamp.app.say('helloBoss')
// }, 3000);

class HelloWorld extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow DOM tree to this instance
    const shadow = this.attachShadow({ mode: "open" });

    // Create elements for the shadow DOM
    const container = document.createElement("div");
    const style = document.createElement("style");

    // Apply some styles
    style.textContent = `
          div {
              font-family: Arial, sans-serif;
              font-size: 24px;
              color: white;
              background-color: #007BFF;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
          }
      `;

    // Set the content of the container
    container.textContent = "Hello, World!";

    class MyComponent extends Component {
      static template = xml`<div>Hello, OWL! Data: <t t-esc="props.data"/></div>`;
      static props = ["data"];
    }
    shadow.appendChild(container);

    // Mount OWL ke shadow root dari web component
    mount(MyComponent, container, { props: { data: { satu: 1, dua: 2 } } });

    // Attach the created elements to the shadow DOM
    shadow.appendChild(style);
  }
}

// Define the new element
customElements.define("hello-world", HelloWorld);

class OwlWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Menggunakan Shadow DOM

    // const css = document.createElement('style')
    // // css.setAttribute('rel','stylsheet')
    // // css.setAttribute('href', 'main.css')
    // css.setAttribute('src', 'main.css')
    // this.shadowRoot.appendChild(css)
  }

  static get observedAttributes() {
    return ["data"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data") {
      this.data = JSON.parse(newValue);
      this.render();
    }
  }

  connectedCallback() {
    if (!this.data) {
      this.data = {};
    }
    // const css = document.createElement('link')
    // css.setAttribute('rel','stylsheet')
    // css.setAttribute('href', 'main.css')
    // // css.setAttribute('src', 'main.css')
    // this.shadowRoot.appendChild(css)

    this.render();
  }

  async render() {
    const css = document.createElement("style");
    // css.setAttribute('type', 'text/css')
    // css.setAttribute('src', 'main.css')
    try {
      const response = await fetch("main-inside-webcomponent.css");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const cssText = await response.text();
      // const style = document.createElement('style');
      css.textContent = cssText;
      // shadow.appendChild(style);
    } catch (error) {
      console.error("Error loading CSS:", error);
    }

    // const css = document.createElement('link')
    // css.setAttribute('rel','stylsheet')
    // css.setAttribute('href', 'main.css')
    this.shadowRoot.appendChild(css);

    const style = document.createElement("style");

    // Apply some styles
    style.textContent = `
          div {
              font-family: Arial, sans-serif;
              font-size: 24px;
              color: white;
              /* background-color: #007BFF; */
              padding: 10px;
              border-radius: 5px;
              text-align: center;
          }
      `;
    this.shadowRoot.appendChild(style);
    // Memuat OWL dan komponen Anda di sini
    // const { Component, mount } = owl;
    // const { xml } = owl.tags;

    // Definisikan komponen OWL
    class MyComponent extends Component {
      static template = xml`<div>Hello, OWL 2! Data: <t t-esc="window.JSON.stringify(props.data)"/></div>`;
      static props = ["data"];
    }

    // Mount OWL ke shadow root dari web component
    mount(MyComponent, this.shadowRoot, { props: { data: this.data } });

    // const shadow = this.attachShadow({ mode: 'open' });
    // mount(MyComponent, { target: shadow, props: { data: this.data } });
  }
}

// Definisikan custom element
customElements.define("owl-web-component", OwlWebComponent);

var o = document.createElement("owl-web-component");
document.body.appendChild(o);
setTimeout(() => {
  o.setAttribute("data", JSON.stringify({ skin: "123", song: [4, 5, 6] }));
}, 2000);
setTimeout(() => {
  o.setAttribute("data", JSON.stringify({ skin: "789", song: [1, 5.0] }));
}, 3000);
