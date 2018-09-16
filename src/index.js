import { h, app } from '../local_modules/hyperapp/src'
import '/styles/style'

const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyBpJbJtNqviQ-PDH2a_mmvvKIeFY6jT2vk"

var font = new FontFace(
    'BioRhyme Expanded', 
    'url(http://fonts.gstatic.com/s/biorhymeexpanded/v3/i7dQIE1zZzytGswgU577CDY9LjbffySU.ttf)', 
    { weight: 'normal', style: 'normal' });

font.load().then(function(loaded_face) {
    console.log(loaded_face)
    document.fonts.add(loaded_face);
    document.body.style.fontFamily = 'BioRhyme Expanded';
}).catch(function(error) {
    console.log(error)
});


console.log("Started")

const ChangeColor = (state, {color}) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        color,
        "font-family": font
    }
})

const NextFont = (state, {font}) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-family": font
    }
})

const ChangeBackground = (state, {color}) => ({
    ...state,
    containerStyle: {
        ...state.containerStyle,
        "background-color": color
    },
    textStyle: {
        ...state.textStyle,
        "background-color": color
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
            <button onClick={[NextFont, {font: "BioRhyme Expanded"}]}>Next font</button>
            <button onClick={[ChangeColor, {color: "blue"}]}>Foreground color</button>
            <button onClick={[ChangeBackground, {color: "gray"}]}>Background color</button>
        </div>
    </div>
    ,
    container: document.getElementById("app"),
    subscriptions: (state) => console.log("STATE", state),
})