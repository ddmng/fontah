

const saveState = (props, dispatch) => {
    console.log("Saving to Firebase!")
    dispatch(props.action)
}

export const SaveData = (props) => ({
    action: props.action,
    effect: saveState
})