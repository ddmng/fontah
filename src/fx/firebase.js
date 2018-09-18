import firebase from '@firebase/app';
import '@firebase/firestore'

const saveState = (props, dispatch) => {
    console.log("Saving to Firebase!", props)

    firebase.app(props.database)
            .firestore()
            .collection(props.collection)
            .doc(props.key)
            .set({
        data: props.data
    }).then(() => {
        console.log("State saved")
        dispatch(props.action, {savedAt: props.savedAt})
    }).catch(error => {
        console.error("Error updating data", error)
        dispatch(props.action, error)
    })
}

export const SaveData = (props) => ({
    action: props.action,
    effect: saveState,
    data: props.data,
    key: props.key,
    collection: props.collection,
    database: props.database,
    savedAt: props.savedAt
})


const connect = (props, dispatch) => {
    console.log("Connecting to ", props.config, props.name)
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    const db = firebase.initializeApp(props.config, props.name).firestore()
    db.settings(settings);

    db.collection("/sessions").doc().set({data: "new session"})

    console.log("dispatching", props.action)
    dispatch(props.action)
}

export const Connect = (props) => ({
    action: props.action,
    effect: connect,
    config: props.config,
    name: props.name || "[DEFAULT]"
})