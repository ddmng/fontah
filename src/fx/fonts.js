const googleFontsUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyBpJbJtNqviQ-PDH2a_mmvvKIeFY6jT2vk"

export const loadFont = (action, dispatch) => {
    var font = new FontFace(
        'BioRhyme Expanded',
        'url(http://fonts.gstatic.com/s/biorhymeexpanded/v3/i7dQIE1zZzytGswgU577CDY9LjbffySU.ttf)', {
            weight: 'normal',
            style: 'normal'
        });

    font.load().then(function (loaded_face) {
        console.log(loaded_face)
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = 'BioRhyme Expanded';
    }).catch(function (error) {
        console.log(error)
    });

}