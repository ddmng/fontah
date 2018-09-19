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
// Initial app state
// ----------------------------------------------------

const blankState = {
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
    lastViewed: [],
    appname: 'fontah',
    firebase: "not_connected",
    uniqid: "",
    fontIndex: -1,
    savedAt: -1,
    lastChange: -1
}


// ----------------------------------------------------
// Pure actions
// ----------------------------------------------------


export const SetChanged = (state) => ({
    ...state,
    status: "changed",
    error: "",
    lastChange: new Date()
})


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
}) => state.fontIndex!=index?SetChanged({
    ...state,
    textStyle: {
        ...state.textStyle,
        "font-family": font.family
    },
    fontIndex: index
}):SetIdle(state)

export const GoogleFontsListLoaded = (state, googleFontsList) => ({
    ...state,
    googleFontsList
})

export const MergeGoogleFontsList = (state) => ({
    ...state,
    googleFontsList: fonts.googleFonts
})

export const initialState = MergeGoogleFontsList(blankState)

export const Reset = (state) => SetChanged(Connected({
    ...initialState,
    uniqid: state.uniqid,
    lastChange: new Date()
}))

export const UpdateText = (state, {
    target
}) => SetChanged({
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

const SetIdle = (state) => ({
    ...state,
    status: state.status=="changed"?"changed":"idle",
    error: "",
})

export const Connected = (state) => ({
    ...state,
    firebase: "connected",
})

export const SetUniqId = (state, uniqid) => ({
    ...state,
    uniqid
})

const StateSaved = (state, {
    savedAt
}) => SetIdle({
    ...state,
    savedAt
})

export const SyncRequest = (state, {document}) => {
    if (document) {
        if (state.lastChange==-1 || document.data.savedAt.toMillis() > state.lastChange.getTime()) {
            console.log("Update state from Firebase: document is", document.data.savedAt.toMillis())
            console.log("Update state from Firebase: state    is", state.lastChange==-1?-1:state.lastChange.getTime())
            return SetIdle({
                ...state,
                containerStyle: document.data.containerStyle,
                textStyle: document.data.textStyle,
                fontIndex: document.data.fontIndex,
                text: document.data.text,
                footer: document.data.footer,
                savedAt: document.data.savedAt.toDate(),
                lastChange: document.data.savedAt.toDate()
            })
        }
    } else {
        return SetIdle(state)
    }
}


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

const LoadFontFromFirebase = (state, {document}) => 
    document && document.data.fontIndex>=0?
    LoadFont(state, document.data.fontIndex)
    :state

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

export const Connect = (state) => [{
    ...state,
    status: "connecting"
},
firebase.Connect({
    action: Connected,
    config: fbConfig,
    name: state.appname
})
]

export const ToFirebase = (state) => {
    //const savedAt = new Date();

    if (state.firebase == "connected") {
        if (state.status == "changed") {
            return [{ ...state,
                    status: "saving_state"
                },
                firebase.SaveData({
                    action: StateSaved,
                    data: {
                        savedAt: state.lastChange,
                        fontIndex: state.fontIndex,
                        containerStyle: {
                            ...state.containerStyle,
                        },
                        textStyle: {
                            ...state.textStyle,
                        },
                        text: state.text,
                        footer: state.footer,
                    },
                    collection: 'combinations',
                    key: state.uniqid,
                    database: state.appname,
                    savedAt: state.lastChange
                })
            ]
        } else {
            return state
        }
    } else {
        return Connect
    }
}

export const FromFirebase = (state) => [{
    ...state,
    status: "fetching"
}, firebase.SyncData({
    collection: 'combinations',
    key: state.uniqid,
    database: state.appname,
    actions: [SyncRequest, LoadFontFromFirebase]
})]

export const GetToken = (state, {token}) => [{
        ...state,
    },
    fx.UniqIdEffect({
        action: SetUniqId,
        token
    }), // generates a unique ID on start
]

const LinkCopied = (state) => ({
    ...state
})

export const CopyLink = (state) => [
    state,
    fx.CopyLink({
        action: LinkCopied,
    })
]