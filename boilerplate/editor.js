import { ethers } from "//unpkg.com/ethers@5.5.1/dist/ethers.esm.min.js"

window.ethers = ethers

const clearHtmlCode = (code) =>
  code
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .join("\n")

customElements.define(
  "code-editor",
  class CodeEditor extends HTMLElement {
    connectedCallback() {
      const hintElement = this.querySelector("p")
      let codeHint = null
      if (hintElement) {
        codeHint = clearHtmlCode(hintElement.innerHTML)
        this.removeChild(hintElement)
      }

      const code = clearHtmlCode(this.innerHTML)

      this.innerHTML = `
      <pre><code data-editor-input contenteditable spellcheck="false">${code}</code></pre>
      <div>
        <button data-editor-execute>Execute!</button>
        <button data-editor-hint ${!codeHint ? "disabled" : ""}>Hint?</button>
      </div>
      <b>Result</b>
      <pre data-editor-result></pre>
      <br>`

      this.querySelector("[data-editor-execute]").addEventListener(
        "click",
        this.executeCode
      )

      if (hintElement) {
        let hinted = false
        this.querySelector("[data-editor-hint]").addEventListener(
          "click",
          (e) => {
            if (hinted) return
            e.target.parentNode.parentNode.querySelector(
              "[data-editor-input]"
            ).innerHTML += "\n" + codeHint
            hinted = true
          }
        )
      }
    }

    executeCode(e) {
      const parent = e.target.parentNode.parentNode
      const code = parent.querySelector("[data-editor-input]").innerHTML.trim()
      const outputElement = parent.querySelector("[data-editor-result]")

      outputElement.innerHTML = "Executing..."

      let cleared = false
      const print = (data) => {
        const content = JSON.stringify(data, null, 2)
        if (cleared) {
          outputElement.innerHTML += content
          return
        }
        outputElement.innerHTML = content
        cleared = true
      }

      eval(`
        async function editorCode() {
          ${code}
        }
        editorCode()
      `)
    }
  }
)
