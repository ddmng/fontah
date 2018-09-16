import {
    Http,
    Random,
    Time
} from '../local_modules/hyperapp-fx/src/index'
import * as fx from './fx/fonts'

const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyBpJbJtNqviQ-PDH2a_mmvvKIeFY6jT2vk"

const int2Color = (color) => `${Math.trunc(color).toString(16)}`

export const ChangeFGColor = (state, color) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        color: int2Color(color),
    },
    footer: {
        ...state.footer,
        color: int2Color(color),
    },
    status: 'idle'
})

export const ChangeBGColor = (state, color) => ({
    ...state,
    containerStyle: {
        ...state.containerStyle,
        "background-color": int2Color(color)
    },
    textStyle: {
        ...state.textStyle,
        "background-color": int2Color(color),
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

export const RandomFont = (state) => [{ 
    ...state,
    status: "changing_font"
}, Random({
    action: LoadFont,
    min: 0,
    max: state.googleFontsList.items.length - 1
})]

export const RandomColor = (state, {bgfg}) => [{ 
    ...state,
    status: "changing_color"
}, Random({
    action: bgfg=='bg'?ChangeBGColor:ChangeFGColor,
    min: 0,
    max: 0xff * 0xff * 0xff
})]

export const UpdateText = (state, {target}) => ({
    ...state,
    text: target.value
})

export const ChangeSize = (state, size) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-size": `${Math.trunc(size)}px`,
    },
    status: 'idle'
})

export const RandomSize = (state) => [{
    ...state,
    status: "changing_size"
}, Random({
    action: ChangeSize,
    min: 6,
    max: 100
})]
