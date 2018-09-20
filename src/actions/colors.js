import {
    Random,
} from '../../local_modules/hyperapp-fx/src'

import { SetChanged } from './general'

import {
    int2Color
} from '../utils'

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


export const randomColor = (bgfg) => Random({
    action: bgfg == 'bg' ? ChangeBGColor : ChangeFGColor,
    min: 0,
    max: 0xff * 0xff * 0xff
})


export const RandomColor = (state, {
    bgfg
}) => [{
    ...state,
    status: "changing_color"
}, randomColor(bgfg)]