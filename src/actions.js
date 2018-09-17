import {
    Http,
    Random,
    Time,
    BatchFx
} from '../local_modules/hyperapp-fx/src/index'
import * as fx from './fx/fonts'
import * as fonts from '../assets/googlewebfonts.js'

// TODO: move this
var mediaSize = 'large';
const media = window.matchMedia("(max-width: 640px)")
const mediaChanged = (m) => mediaSize = m.matches?'small':'large'
media.addListener(mediaChanged) // Attach listener function on state changes

const int2Color = (color) => `${Math.trunc(color).toString(16)}`

export const ChangeFGColor = (state, color) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        color: `#${int2Color(color)}`,
    },
    footer: {
        ...state.footer,
        color: `#${int2Color(color)}`,
    },
    status: 'idle'
})

export const ChangeBGColor = (state, color) => ({
    ...state,
    containerStyle: {
        ...state.containerStyle,
        "background-color": `#${int2Color(color)}`
    },
    textStyle: {
        ...state.textStyle,
        "background-color": `#${int2Color(color)}`,
    },
    status: 'idle'
})

export const FontLoaded = (state, font) => ({
    ...state,
    status: "idle",
    textStyle: {
        ...state.textStyle,
        "font-family": font.family
    }
})

export const FontLoadError = (state, error) => [{
    ...state,
    status: "error_loading_font",
    error: error.message
}, Time({after: 2000, action: {...state, status: "idle", error: ""}})
]

export const LoadFont = (state, index) => [{
        ...state,
        status: "loading_font",
        lastViewed: [
            ...state.lastViewed,
            Math.trunc(index)
        ]
    },
    fx.LoadFontEffect({
        action: FontLoaded, 
        error: FontLoadError, 
        font: state.googleFontsList.items[Math.trunc(index)],
    })
]

export const GoogleFontsListLoaded = (state, googleFontsList) => ({
    ...state,
    status: "idle",
    googleFontsList
})

export const LoadGoogleFontsList = (state) => [{
        ...state,
        status: "loading_google_fonts_list"
    },
    Http({
        url: googleFontsUrl,
        action: GoogleFontsListLoaded,
    })
]

export const MergeGoogleFontsList = (state) => ({
    ...state,
    googleFontsList: fonts.googleFonts
})

export const UpdateText = (state, {target}) => ({
    ...state,
    text: target.value
})

const addPixels = (px, amount) => (
    parseInt(px.replace("px", ""), 10) + amount
)

export const IncSize = (state) => ChangeSize(state, addPixels(state.textStyle["font-size"], 1) )
export const DecSize = (state) => ChangeSize(state, addPixels(state.textStyle["font-size"], -1))

export const ChangeSize = (state, size) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-size": `${Math.trunc(size)}px`,
    },
    status: 'idle'
})

const Randomized = (state) => ({
    ...state,
    status: "idle"
})

const randomColor = (bgfg) => Random({
    action: bgfg=='bg'?ChangeBGColor:ChangeFGColor,
    min: 0,
    max: 0xff * 0xff * 0xff
})

const randomSize = () => Random({
    action: ChangeSize,
    min: 6,
    max: mediaSize=='small'?50:100
})

const randomFont = (max) => Random({
    action: LoadFont,
    min: 0,
    max
})

export const RandomFont = (state) => [{ 
    ...state,
    status: "changing_font"
}, randomFont(state.googleFontsList.items.length - 1)]

export const RandomColor = (state, {bgfg}) => [{ 
    ...state,
    status: "changing_color"
}, randomColor(bgfg)]

export const RandomSize = (state) => [{
    ...state,
    status: "changing_size"
}, randomSize()]

// TODO: is this the best way? I'm losing intermediate state changes
export const AllRandom = (state) => [
    Randomized({
        ...state, 
        status: "lucky_man"
    }),
    BatchFx(
        randomColor('bg'),
        randomColor('fg'),
        // randomSize(),
        randomFont(state.googleFontsList.items.length - 1),
    )
]