import { useState } from "react"

const App = () => {
    const [text, setText] = useState('')
    const [voice, setVoice] = useState('')

    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    const handleVoiceChange = (e) => {
        setVoice(e.target.value)
    }



    return (
        <div>
            <header>
                <h1>Hello, World!</h1>
            </header>

        </div>
    )
}

export default App