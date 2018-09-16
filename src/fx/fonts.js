
const loadFont = ({action, error, font, index}, dispatch) => {
    var fontFace = new FontFace(
        font.family,
        `url(${font.files.regular})`, {
            weight: 'normal',
            style: 'normal'
        });

    fontFace.load().then(function (loaded_face) {
        // console.log(loaded_face)
        document.fonts.add(loaded_face);
        //document.body.style.fontFamily = font.family;
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
    font: props.font,
    index: props.index
})
