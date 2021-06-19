import './code-editor.css'
import './syntax.css'
import { useRef } from 'react'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import codeShift from 'jscodeshift'
import HighLighter from 'monaco-jsx-highlighter'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>()

  const onEditorDidMount: EditorDidMount = (getEditorValue, monacoEditor) => {
    editorRef.current = monacoEditor
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getEditorValue())
    })

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 })

    const highlighter = new HighLighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    )
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    )
  }

  const onFormatClick = () => {
    // get current value from editor
    const unformattedText = editorRef.current.getModel().getValue()
    // format the value
    const formattedText = prettier
      .format(unformattedText, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true
      })
      .replace(/\n$/, '')
    // set the formatted value back to the editor
    editorRef.current.setValue(formattedText)
  }

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme='dark'
        language='javascript'
        height='100%'
        options={{
          wordWrap: 'on',
          minimap: {
            enabled: false
          },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  )
}

export default CodeEditor
