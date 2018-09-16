import * as fx from './fx/fonts'

const makeEffect = (effect, action, ...props) => ({
    effect,
    action,
    props
})

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

export const LoadFont = (state, {
    font
}) => [{
        ...state,
        status: "loading_font"
    },
    makeEffect(fx.loadFont, FontLoaded, font)
]