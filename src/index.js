import { h, app } from '../local_modules/hyperapp/src'
import {
    UpdateText,
    RandomFont, 
    RandomColor,
    IncSize,
    DecSize,
    MergeGoogleFontsList,
    AllRandom,
    ToFirebase
} from './actions'
import '../styles/style'

const initialState = MergeGoogleFontsList({
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

// TODO: components
app({
    init: (initialState),
    view: state =>
        <div class="container" style={state.containerStyle}>
            <div class="header">
                <div class="title">
                    font-ah!
                </div>
                <div class="controls">
                    <div class="hsplit">
                        <button class="btn half" onClick={[RandomColor, {bgfg: 'fg'}]} title="Random foreground color"><i class="fas fa-paint-brush"></i></button>
                        <button class="btn half" onClick={[RandomColor, {bgfg: 'bg'}]} title="Random background color"><i class="fas fa-fill"></i></button>
                    </div>
                    <div class="hsplit">
                        <button class="btn half" onClick={IncSize} title="Larger size"><i class="fas fa-plus"></i></button>
                        <button class="btn half" onClick={DecSize} title="Smaller size"><i class="fas fa-minus"></i></button>
                    </div>
                    <button class="btn" onClick={RandomFont} title="Random font" disabled={state.status != "idle"} title="Change font"><i class="fas fa-font"></i></button>
                    <button class="btn" onClick={AllRandom} title="I'm feeling lucky"><i class="fas fa-random"></i></button>
                    <button class="btn" onClick={initialState} title="Start from scratch"><i class="fas fa-undo"></i></button>
                    <button class="btn" onClick={ToFirebase} title="Save state to firebase"><i class="fab fa-google"></i></button>
                </div>
            </div>
            <div class="subcontainer">
                <input class="text" value={state.text} style={state.textStyle} onInput={UpdateText}></input>
                <p>{state.error}</p>
            </div>
            <div class="footer" style={state.footer}>
                <p>
                    Font    "{state.textStyle["font-family"]}", 
                    size     {state.textStyle["font-size"]}, 
                    fg-color {state.textStyle.color},
                    bg-color {state.containerStyle["background-color"]}
                </p>
                <div class="star">
                    <a class="github-button" href="https://github.com/ddmng/fontah" data-size="large" data-show-count="true" aria-label="Star ddmng/fontah on GitHub">Star</a>            
                </div>
            </div>
        </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state)
})
