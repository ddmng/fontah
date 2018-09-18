import {
    toHttps
} from './utils'
import {
    process
} from 'uniqid';


const loadFont = ({
    action,
    error,
    font,
    index
}, dispatch) => {
    const fontFace = new FontFace(
        font.family,
        `url(${toHttps(font.files.regular)})`, {
            weight: 'normal',
            style: 'normal'
        });

    fontFace.load().then(function (font) {
        document.fonts.add(font);
        dispatch(action, {font, index})
    }).catch(function (msg) {
        console.log(msg)
        dispatch(error, msg)
    });
}

export const LoadFontEffect = (props) => ({
    effect: loadFont,
    action: props.action,
    error: props.error,
    font: props.font,
    index: props.index
})

const uniqId = (props, dispatch) => {
    if(props.token) {
        console.log("using params: ", props.token)
        dispatch(props.action, props.token)
    } else {
        console.log("generating uniqid")
        dispatch(props.action, process())
    }
}

export const UniqIdEffect = (props) => ({
    effect: uniqId,
    action: props.action,
    params: props.params,
    token: props.token
})



const readParams = (props, dispatch)  => {
    const p = new URL(window.location).searchParams.get("p")
    console.log("URL: ", p)
    dispatch(props.action, {token: p})
}

export const ParamsEffect = (props) => ({
    effect: readParams,
    action: props.action
})
