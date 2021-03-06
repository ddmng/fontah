import firebase from '@firebase/app';
import '@firebase/firestore'

const saveData = (props, dispatch) => {
    console.log("Saving to Firebase!", props)

    firebase.app(props.database)
        .firestore()
        .collection(props.collection)
        .doc(props.key)
        .set({
            data: props.data
        }).then(() => {
            console.log("State saved")
            dispatch(props.action, {
                savedAt: props.savedAt
            })
        }).catch(error => {
            console.error("Error updating data", error)
            dispatch(props.error, {error})
        })
}

export const SaveData = (props) => ({
    effect: saveData,
    ...props
})


const connect = (props, dispatch) => {
    console.log("Connecting to ", props.config, props.name)
    const settings = { /* your settings... */
        timestampsInSnapshots: true
    };
    const db = firebase.initializeApp(props.config, props.name).firestore()
    db.settings(settings);

    db.collection("/sessions").doc().set({
        started: new Date()
    })

    console.log("dispatching", props.action)
    dispatch(props.action)
}

export const Connect = (props) => ({
    effect: connect,
    name: props.name || "[DEFAULT]",
    ...props
})


const syncData = (props, dispatch) =>
    firebase.app(props.database)
    .firestore()
    .collection(props.collection)
    .doc(props.key)
    .onSnapshot(doc => {
        console.log("Received update from firebase!", doc.data())

        props.actions.map(action =>
            dispatch(action, {
                document: doc.data()
            })
        )
    }, e => {
        console.error("Error querying resource", e)
        dispatch(props.error, {e});
    })


export const SyncData = (props) => ({
    effect: syncData,
    ...props
})