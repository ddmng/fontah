const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyBpJbJtNqviQ-PDH2a_mmvvKIeFY6jT2vk"


const loadFont = ({action, font, url}, dispatch) => {
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
    }).catch(function (error) {
        console.log(error)
    });
}

export const LoadFontEffect = (action, ...props) => ({
    effect: loadFont,
    action,
    props
})

