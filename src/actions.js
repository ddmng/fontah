import {
    Http
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

export const NextFont = (state, {
    font
}) => ({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-family": font
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

export const FontLoaded = (state) => ({
    ...state,
    status: "font_loaded"
})

export const FontLoadError = (state) => ({
    ...state,
    status: "error_loading_font"
})

export const LoadFont = (state, {
    font
}) => [{
        ...state,
        status: "loading_font"
    },
    fx.LoadFontEffect(FontLoaded, FontLoadError, font)
]

export const GoogleFontsListLoaded = (state, list) => ({
    ...state,
    status: "loaded_google_fonts_list",
    list
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