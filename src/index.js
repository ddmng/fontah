import { h, app } from '../local_modules/hyperapp/src'
import {
    UpdateText,
    RandomFont, 
    RandomColor,
    RandomSize, 
    LoadGoogleFontsList
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
                <button onClick={[RandomColor, {bgfg: 'fg'}]} title="Change foreground color">FG</button>
                <button onClick={[RandomColor, {bgfg: 'bg'}]} title="Change background color">BG</button>
                <button onClick={RandomSize}>Size</button>
                <button onClick={RandomFont} disabled={state.status != "idle"} title="Change font">Font!</button>
                <button onClick={initialState}>Reset</button>
            </div>
            <div class="subcontainer">
                <input class="text" value={state.text} style={state.textStyle} onInput={UpdateText}></input>
                <p>{state.error}</p>
            </div>
            <div class="footer" style={state.footer}>
                This is {state.textStyle["font-family"]}, 
                size    {state.textStyle["font-size"]}, 
                fg-color #{state.textStyle.color},
                bg-color #{state.containerStyle["background-color"]}
            </div>
        </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state),
})