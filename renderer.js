const marked = require('marked')
const { ipcRenderer } = require('electron')

const { html, Component, render } = require('htm/preact')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { markdown: '' }
  }

  componentDidMount() {
    ipcRenderer.on('M::file-loaded', (e, { file, filePath, basePath }) => {
      this.setState({
        markdown: marked(file, { baseUrl: `${basePath}/` })
      })
    })
  }

  render({}, { markdown }) {
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
