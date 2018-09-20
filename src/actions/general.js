import {
    BatchFx,
} from '../../local_modules/hyperapp-fx/src'
import * as fx from '../fx/effects'
import {MergeGoogleFontsList} from './fonts'
import {Connected} from './backend'
import {randomFont} from './fonts'
import {randomColor} from './colors'


// ----------------------------------------------------
// Initial app state
// ----------------------------------------------------

const blankState = {
    status: "idle",
    errors: {
        firebase: "",
        others: ""
    },
    text: "Share the link and collaborate!",
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


export const SetIdle = (state) => ({
    ...state,
    status: state.status == "changed" ? "changed" : "idle",
    error: "",
})

export const SetUniqId = (state, uniqid) => ({
    ...state,
    uniqid
})


// ----------------------------------------------------
// Actions w/ side effects
// ----------------------------------------------------


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

export const GetToken = (state, {
    token
}) => [{
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