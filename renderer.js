const marked = require('marked')
const fm = require('front-matter')
const { ipcRenderer } = require('electron')
const { html, Component, render } = require('htm/preact')
const mermaid = require('mermaid')

const renderer = new marked.Renderer()
renderer.code = (code, lang) => {
  if (lang === 'mermaid') return `<pre class="mermaid">${code}</pre>`
  if (!lang) return `<pre><code>${code}</code></pre>`
  return `<pre><code>${
    require('highlight.js').highlightAuto(code).value
  }</code></pre>`
}
marked.setOptions({
  renderer,
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { markdown: '' }
  }

  componentDidMount () {
    ipcRenderer.on('M::file-loaded', (e, { file, filePath, basePath }) => {
      const content = fm(file)
      this.setState(
        {
          markdown: marked(content.body, { baseUrl: `${basePath}/` })
        },
        () => {
          try {
            mermaid.init()
          } catch (e) {}
        }
      )
    })
  }

  render (props, { markdown }) {
    return html`
      <div
        class="markdown-body"
        dangerouslySetInnerHTML=${{ __html: markdown }}
      />
    `
  }
}

render(
  html`
    <${App} />
  `,
  document.body
)
