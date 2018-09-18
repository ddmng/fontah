import {
    toHttps
} from './utils'
import {
    process
} from 'uniqid';


const loadFont = ({
    action,
    error,
    font
}, dispatch) => {
    const fontFace = new FontFace(
        font.family,
        `url(${toHttps(font.files.regular)})`, {
            weight: 'normal',
            style: 'normal'
        });

    fontFace.load().then(function (loaded_face) {
        document.fonts.add(loaded_face);
        dispatch(action, loaded_face)
    }).catch(function (msg) {
        console.log(msg)
        dispatch(error, msg)
    });
}

export const LoadFontEffect = (props) => ({
    effect: loadFont,
    action: props.action,
    error: props.error,
    font: props.font
})

const uniqId = (props, dispatch) => {
    console.log("generating uniqid")
    dispatch(props.action, process())
}

export const UniqIdEffect = (props) => ({
    effect: uniqId,
    action: props.action
})