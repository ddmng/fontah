import {
    BatchFx, Time
} from '../../local_modules/hyperapp-fx/src'
import * as fx from '../fx/effects'
import {MergeGoogleFontsList} from './fonts'
import {Connected} from './backend'
import {RandomFont} from './fonts'
import {RandomColor} from './colors'


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


const SetLastChange = (state, lastChange) => ({
    ...state,
    lastChange
})

export const SetChanged = (state) => [{
        ...state,
        status: "changed",
        error: "",
    },
    Time({now: true, asDate: true, action: SetLastChange})
]


export const initialState = MergeGoogleFontsList(blankState)

export const Reset = (state) => 
    SetChanged(Connected({
    ...initialState,
    uniqid: state.uniqid,
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
    })[0],
    BatchFx(
        // TODO is this acceptable instead of calling the effect repeating all the args again?
        RandomColor(state, {bgfg: 'fg'})[1],
        RandomColor(state, {bgfg: 'bg'})[1],
        RandomFont(state)[1],
        SetChanged(state)[1]
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