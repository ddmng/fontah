import {
    Http,
    Random,
    Time,
} from '../../local_modules/hyperapp-fx/src'

import {SetChanged, SetIdle } from './general'

import * as fx from '../fx/effects'

import * as fonts from '../../assets/googlewebfonts'

export const FontLoaded = (state, {
    font,
    index
}) => state.fontIndex != index ? SetChanged({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-family": font.family
    },
    fontIndex: index
}) : SetIdle(state)

export const GoogleFontsListLoaded = (state, googleFontsList) => ({
    ...state,
    googleFontsList
})

export const MergeGoogleFontsList = (state) => ({
    ...state,
    googleFontsList: fonts.googleFonts
})


export const IncSize = (state) => ChangeSize(state, addPixels(state.textStyle["font-size"], 1))

export const DecSize = (state) => ChangeSize(state, addPixels(state.textStyle["font-size"], -1))

export const ChangeSize = (state, size) => SetChanged({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-size": `${Math.trunc(size)}px`,
    },
    status: 'idle'
})


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
    index: Math.trunc(index)
})
]

export const FontLoadError = (state, error) => [{
    ...state,
    status: "error_loading_font",
    error: error.message
}, Time({
    after: 2000,
    action: SetChanged
})]

export const LoadGoogleFontsList = (state) => [{
        ...state,
        status: "loading_google_fonts_list"
    },
    Http({
        url: googleFontsUrl,
        action: GoogleFontsListLoaded,
    })
]


const addPixels = (px, amount) => (
    parseInt(px.replace("px", ""), 10) + amount
)


export const randomSize = () => Random({
    action: ChangeSize,
    min: 6,
    max: mediaSize == 'small' ? 50 : 100
})


export const randomFont = (max) => Random({
    action: LoadFont,
    min: 0,
    max
})

export const RandomFont = (state) => [{
    ...state,
    status: "changing_font"
}, randomFont(state.googleFontsList.items.length - 1)]


export const RandomSize = (state) => [{
    ...state,
    status: "changing_size"
}, randomSize()]