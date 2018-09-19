import {
    fbConfig
} from '../fbconfig'

import {
    StateSaved,
    SetIdle
} from './general'

import {LoadFont } from './fonts'

import * as firebase from '../fx/firebase'

export const Connected = (state) => ({
    ...state,
    firebase: "connected",
})

export const SyncRequest = (state, {
    document
}) => {
    if (document) {
        if (state.lastChange == -1 || document.data.savedAt.toMillis() > state.lastChange.getTime()) {
            console.log("Update state from Firebase: document is", document.data.savedAt.toMillis())
            console.log("Update state from Firebase: state    is", state.lastChange == -1 ? -1 : state.lastChange.getTime())
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


const LoadFontFromFirebase = (state, {
        document
    }) =>
    document && document.data.fontIndex >= 0 ?
    LoadFont(state, document.data.fontIndex) :
    state



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