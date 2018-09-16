import { h, app } from '../local_modules/hyperapp/src'
import {
    UpdateText,
    RandomFont, 
    RandomColor,
    RandomSize, 
    LoadGoogleFontsList,
    AllRandom
} from './actions'
import '../styles/style'

const initialState = LoadGoogleFontsList({
    status: "idle",
    text: "Sample text, change me!",
    textStyle: {
        "font-size": "50px",
        "font-family": "Roboto",
        color: "black"
    },
    containerStyle: {
        "background-color": "white"
    },
    footer: {
        color: "black"
    },
    error: "",
    lastViewed: []
})

app({
    init: (initialState),
    view: state =>
        <div class="container" style={state.containerStyle}>
            <div class="controls">
                <button onClick={[RandomColor, {bgfg: 'fg'}]} title="Random foreground color"><i class="fas fa-paint-brush"></i></button>
                <button onClick={[RandomColor, {bgfg: 'bg'}]} title="Random background color"><i class="fas fa-fill"></i></button>
                <button onClick={RandomSize} title="Random font size"><i class="fas fa-text-height"></i></button>
                <button onClick={RandomFont} title="Random font" disabled={state.status != "idle"} title="Change font"><i class="fas fa-font"></i></button>
                <button onClick={AllRandom} title="I'm feeling lucky"><i class="fas fa-random"></i></button>
                <button onClick={initialState} title="Start from scratch"><i class="fas fa-undo"></i></button>
            </div>
            <div class="subcontainer">
                <input class="text" value={state.text} style={state.textStyle} onInput={UpdateText}></input>
                <p>{state.error}</p>
            </div>
            <div class="footer" style={state.footer}>
                <p>
                    This is {state.textStyle["font-family"]}, 
                    size    {state.textStyle["font-size"]}, 
                    fg-color #{state.textStyle.color},
                    bg-color #{state.containerStyle["background-color"]}
                </p>
                <div class="star">
                    <a class="github-button" href="https://github.com/ddmng/homechooser" data-size="large" data-show-count="true" aria-label="Star ddmng/homechooser on GitHub">Star</a>            
                </div>
            </div>
        </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state),
})