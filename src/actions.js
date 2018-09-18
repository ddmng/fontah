import {
    Http,
    Random,
    Time,
    BatchFx,
} from '../local_modules/hyperapp-fx/src/index'
import * as fx from './fx/effects'
import * as firebase from './fx/firebase'
import * as fonts from '../assets/googlewebfonts.js'
import {
    int2Color
} from './utils'
import {
    fbConfig
} from './fbconfig'

// ----------------------------------------------------
// Pure actions
// ----------------------------------------------------
export const ChangeFGColor = (state, color) => SetChanged({
    ...state,
    textStyle: {
        ...state.textStyle,
        color: `#${int2Color(color)}`,
    },
    footer: {
        ...state.footer,
        color: `#${int2Color(color)}`,
    },
})

export const ChangeBGColor = (state, color) => SetChanged({
    ...state,
    containerStyle: {
        ...state.containerStyle,
        "background-color": `#${int2Color(color)}`
    },
    textStyle: {
        ...state.textStyle,
        "background-color": `#${int2Color(color)}`,
    },
})

export const FontLoaded = (state, {
    font,
    index
}) => SetChanged({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-family": font.family
    },
    fontIndex: index
})

export const GoogleFontsListLoaded = (state, googleFontsList) => SetChanged({
    ...state,
    googleFontsList
})

export const MergeGoogleFontsList = (state) => SetChanged({
    ...state,
    googleFontsList: fonts.googleFonts
})

export const UpdateText = (state, {
    target
}) => ({
    ...state,
    text: target.value
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

const SetChanged = (state) => ({
    ...state,
    status: "changed",
    error: "",
})

const SetIdle = (state) => ({
    ...state,
    status: "idle",
    error: "",
})

export const Connected = (state) => SetChanged({
    ...state,
    firebase: "connected",
})

export const SetUniqId = (state, uniqid) => SetChanged({
    ...state,
    uniqid
})


// ----------------------------------------------------
// Actions w/ side effects
// ----------------------------------------------------
export const FontLoadError = (state, error) => [{
    ...state,
    status: "error_loading_font",
    error: error.message
}, Time({
    after: 2000,
    action: SetChanged
})]

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


const randomColor = (bgfg) => Random({
    action: bgfg == 'bg' ? ChangeBGColor : ChangeFGColor,
    min: 0,
    max: 0xff * 0xff * 0xff
})

const randomSize = () => Random({
    action: ChangeSize,
    min: 6,
    max: mediaSize == 'small' ? 50 : 100
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

export const RandomColor = (state, {
    bgfg
}) => [{
    ...state,
    status: "changing_color"
}, randomColor(bgfg)]

export const RandomSize = (state) => [{
    ...state,
    status: "changing_size"
}, randomSize()]

// TODO: is this the best way? I'm losing intermediate state changes
export const AllRandom = (state) => [
    SetChanged({
        ...state,
        status: "lucky_man"
    }),
    BatchFx(
        randomColor('bg'),
        randomColor('fg'),
        randomFont(state.googleFontsList.items.length - 1),
    )
]

export const ToFirebase = (state) => {
    if (state.firebase == "connected") {
        if (state.status == "changed") {
            return [{ ...state,
                    status: "saving_state"
                },
                firebase.SaveData({
                    action: SetIdle,
                    data: {
                        savedAt: new Date(),
                        fontIdex: state.fontIndex,
                        containerStyle: {
                            ...state.containerStyle,
                        },
                        textStyle: {
                            ...state.textStyle,
                        }
                    },
                    collection: 'combinations',
                    key: state.uniqid,
                    database: state.appname
                })
            ]
        } else {
            return SetIdle
        }
    } else {
        return [{
                ...state,
                status: "connecting"
            },
            firebase.Connect({
                action: Connected,
                config: fbConfig,
                name: state.appname
            })
        ]
    }
}