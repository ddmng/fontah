import {
    Http,
    Random,
    Time
} from '../local_modules/hyperapp-fx/src/index'
import * as fx from './fx/fonts'

const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyBpJbJtNqviQ-PDH2a_mmvvKIeFY6jT2vk"

export const ChangeColor = (state, {
    color
}) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        color,
    }
})


export const ChangeBackground = (state, {
    color
}) => ({
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
        status: "loading_font"
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

export const UpdateText = (state, {target}) => ({
    ...state,
    text: target.value
})

export const ChangeSize = (state, {size}) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-size": size,
    },
})