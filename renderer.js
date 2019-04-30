const marked = require('marked')
const { ipcRenderer } = require('electron')
const { html, Component, render } = require('htm/preact')
const mermaid = require('mermaid')

const renderer = new marked.Renderer()
renderer.code = (code, language) => {
  if (language === 'mermaid') return '<pre class="mermaid">' + code + '</pre>'
  else return '<pre><code>' + code + '</code></pre>'
}
marked.setOptions({
  renderer,
  highlight: code => {
    return require('highlight.js').highlightAuto(code).value
  },
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
      this.setState(
        {
          markdown: marked(file, { baseUrl: `${basePath}/` })
        },
        () => mermaid.init()
      )
    })
  }

  render ({}, { markdown }) {
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
