import { h, app } from '../local_modules/hyperapp/src'
import {
    UpdateText,
    RandomFont, 
    RandomColor,
    IncSize,
    DecSize,
    initialState,
    AllRandom,
    ToFirebase,
    Reset,
    FromFirebase,
    GetToken
} from './actions'
import {
    TokenEffect
} from './fx/effects'

import '../styles/style'
import { Time } from '../local_modules/hyperapp-fx/src';
import {buttonsDisabled} from './utils'


// TODO: components
app({
    init: (initialState),
    view: state =>
        <div class="container" style={state.containerStyle}>
            <div class="header">
                <div class="title">
                    font-ah!
                </div>
                <div class="controls">
                    <div class="hsplit">
                        <button class="btn half" onClick={[RandomColor, {bgfg: 'fg'}]} disabled={ buttonsDisabled(state) } title="Random foreground color"><i class="fas fa-paint-brush"></i></button>
                        <button class="btn half" onClick={[RandomColor, {bgfg: 'bg'}]} disabled={ buttonsDisabled(state) } title="Random background color"><i class="fas fa-fill"></i></button>
                    </div>
                    <div class="hsplit">
                        <button class="btn half" onClick={IncSize} title="Larger size" disabled={ buttonsDisabled(state) }><i class="fas fa-plus"></i></button>
                        <button class="btn half" onClick={DecSize} title="Smaller size" disabled={ buttonsDisabled(state) }><i class="fas fa-minus"></i></button>
                    </div>
                    <button class="btn" onClick={RandomFont} title="Random font" disabled={ buttonsDisabled(state) } title="Change font"><i class="fas fa-font"></i></button>
                    <button class="btn" onClick={AllRandom} title="Surprise me!" disabled={ buttonsDisabled(state) }><i class="fas fa-gift"></i></button>
                    <button class="btn" onClick={Reset} title="Start from scratch"><i class="fas fa-undo"></i></button>
                </div>
            </div>
            <div class="subcontainer">
                <input class="text" value={state.text} style={state.textStyle} onInput={UpdateText}></input>
                <p>{state.error}</p>
            </div>
            <div class="footer" style={state.footer}>
                <p>
                    Font    "{state.textStyle["font-family"]}", 
                    size     {state.textStyle["font-size"]}, 
                    fg-color {state.textStyle.color},
                    bg-color {state.containerStyle["background-color"]}
                </p>
                <div class="star">
                    <a class="github-button" href="https://github.com/ddmng/fontah" data-size="large" data-show-count="true" aria-label="Star ddmng/fontah on GitHub">Star</a>            
                </div>
            </div>
        </div>
    ,
    container: document.getElementById("app"),
    subscriptions: 
        (state) => [
            console.log("STATE", state), // logs the changed state
            TokenEffect({action: GetToken}),
            state.uniqid!="" && state.status=="changed" && Time({after: 10, action: ToFirebase}), // saves to firebase periodically
            state.firebase=="connected" 
                && state.uniqid!="" 
                && Time({after: 1000, action: FromFirebase}) // registers for updates
        ] 
})
