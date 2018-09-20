import {startTests} from './testUtils'

import {int2Color, buttonsDisabled} from '../utils'

const int2Color_tests = [
  {f: int2Color, description: 'black', args: [0            ] , result: "0"},
  {f: int2Color, description: 'blue', args: [256-1        ] , result: "ff"},
  {f: int2Color, description: 'green+blue', args: [256*256-1    ] , result: "ffff"},
  {f: int2Color, description: 'red', args: [256*256      ] , result: "10000"},
  {f: int2Color, description: 'green', args: [256          ] , result: "100"},
  {f: int2Color, description: 'white', args: [256*256*256-1] , result: "ffffff"},
  {f: int2Color, description: 'overflow shold get white', args: [256*256*256] , result: "ffffff"},
]

const buttonsDisabled_tests = [
  {f: buttonsDisabled, description: 'true if connected and saving_state', args:  [ {status:"saving_state", firebase: "connected"} ], result: true },
  {f: buttonsDisabled, description: 'true if connected and loading_font', args: [ {status:"loading_font", firebase: "connected"} ], result: true },
  {f: buttonsDisabled, description: 'false if connected and any other status', args: [ {status:"xxx", firebase: "connected"} ], result: false },
  {f: buttonsDisabled, description: 'false if loading_font', args: [ {status:"loading_font", firebase: "xxx"} ], result: true },
  {f: buttonsDisabled, description: 'false if saving_state', args: [ {status:"saving_state", firebase: "xxx"} ], result: true },
  {f: buttonsDisabled, description: 'false if not_connected and other status', args: [ {status:"xxx", firebase: "not_connected"} ], result: false },
]


describe('int2Color tests', () => startTests(int2Color_tests) )
describe('buttonsDisabled tests', () => startTests(buttonsDisabled_tests) )

