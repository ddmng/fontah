import { h, app } from '../local_modules/hyperapp/src'
import '/styles/style'

const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyBpJbJtNqviQ-PDH2a_mmvvKIeFY6jT2vk"

console.log("Started")

const ChangeColor = (state, {color}) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        color,
    }
})

app({
    init: {
        status: "started",
        text: "test text",
        textStyle: {
            "font-size": "3em"
        },
        containerStyle: ""
    },
    view: state => 
    <div class="container" style={state.containerStyle}>
        <div class="subcontainer">
            <input class="text" value={state.text} style={state.textStyle}></input>
            <button onClick={[ChangeColor, {color: "blue"}]}>Click me</button>
        </div>
    </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state),
})