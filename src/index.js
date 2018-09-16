import { h, app } from '../local_modules/hyperapp/src'
import {
    ChangeSize,
    UpdateText,
    RandomFont, 
    ChangeColor, 
    ChangeBackground,
    LoadGoogleFontsList
} from './actions'
import '/styles/style'

const initialState = LoadGoogleFontsList({
    status: "idle",
    text: "Sample text, change me!",
    textStyle: {
        "font-size": "3em",
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
})

app({
    init: (initialState),
    view: state =>
        <div class="container" style={state.containerStyle}>
            <div class="controls">
                <button onClick={[ChangeColor, { color: "blue" }]} title="Change foreground color">FG</button>
                <button onClick={[ChangeBackground, { color: "gray" }]} title="Change background color">BG</button>
                <button onClick={[ChangeSize, { size: "4em" }]}>Size</button>
                <button onClick={RandomFont} disabled={state.status != "idle"} title="Change font">Font!</button>
                <button onClick={initialState}>Reset</button>
            </div>
            <div class="subcontainer">
                <input class="text" value={state.text} style={state.textStyle} onInput={UpdateText}></input>
                <p>{state.error}</p>
            </div>
            <div class="footer" style={state.footer}>
                This is {state.textStyle["font-family"]}, {state.textStyle["font-size"]}
            </div>
        </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state),
})