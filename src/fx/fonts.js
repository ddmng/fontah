
const loadFont = ({action, error, font, url}, dispatch) => {
    var fontFace = new FontFace(
        'BioRhyme Expanded',
        'url(http://fonts.gstatic.com/s/biorhymeexpanded/v3/i7dQIE1zZzytGswgU577CDY9LjbffySU.ttf)', {
            weight: 'normal',
            style: 'normal'
        });

    fontFace.load().then(function (loaded_face) {
        console.log(loaded_face)
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = 'BioRhyme Expanded';
        dispatch(action)
    }).catch(function (msg) {
        console.log(msg)
        dispatch(error, msg)
    });
}

export const LoadFontEffect = (action, ...props) => ({
    effect: loadFont,
    action,
    props
})

const loadFontsList = ({action}, dispatch) => {

}