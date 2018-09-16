import { h, app } from '../local_modules/hyperapp/src'
import { RandomFont, ChangeColor, ChangeBackground, NextFont, LoadFont, LoadGoogleFontsList } from './actions'
import '/styles/style'


console.log("Started")

const initialState = {
    status: "started",
    text: "test text",
    textStyle: {
        "font-size": "3em"
    },
    containerStyle: ""
}

app({
    init: LoadGoogleFontsList(initialState),
    view: state =>
        <div class="container" style={state.containerStyle}>
            <div class="subcontainer">
                <input class="text" value={state.text} style={state.textStyle}></input>
                <button onClick={[ChangeColor, { color: "blue" }]}>Foreground color</button>
                <button onClick={[ChangeBackground, { color: "gray" }]}>Background color</button>
                <button onClick={RandomFont}>Change font!</button>
            </div>
        </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state),
})