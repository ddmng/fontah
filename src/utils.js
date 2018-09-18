export const int2Color = (color) => `${Math.trunc(color).toString(16)}`

export const isIn = (s, a) => {
    if(a === null || a === undefined) {
        return false
    } else {
        if( a["indexOf"] === undefined ) {
            return false
        } else {
            return ["idle", "changed"].indexOf(s)>=0 ? true : false
        }
    }
} 

export const buttonsDisabled = (state) => !isIn(state.status, ["idle", "changed"])