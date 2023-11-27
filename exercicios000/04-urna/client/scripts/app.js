import { INITIAL_INPUT, CONFIRM_NULL_VOTE, CONFIRM_VALID_VOTE, END_SCREEN } from "./states"

// telas possiveis //

///seleção numero
//confirmar voto
//numero === candidato identificado
//numero !== voto nulo
//voto branco
///voto confirmado
///votação encerrada


let state = {
  current_screen: INITIAL_INPUT,
  data: {
    current_number: ''
  }
}

function render() {
  const out = document.querySelector('.screen')
  out.innerHTML = ''

  const { current_screen } = state

  if (current_screen === INITIAL_INPUT) {
    out.innerHTML = `
    <img src="assets/img/avatar_placeholder.webp" alt="Foto do Candidato">
      <div class="wrapper">
        <div class="numero-nome">
          <form id="number-input" class="numero-candidato">
            <span class="numero-label">Número </span>
            <input min="1" max="9" maxlength="1" step="1" type="number" name="dig_01" required>
            <input min="0" max="9" maxlength="1" step="1" type="number" name="dig_02" required>
          </form>
          <!-- <div class="nome-candidato">
            <span class="nome-label">Nome </span> Fulano de Tal
          </div> -->
        </div>
      </div>
    `
  }
  else if (screen === 'confirmValidVote') {
    out.innerHTML = `
      <div class="wrapper">
        <img src="assets/img/avatar_placeholder.webp" alt="Foto do Candidato">
        <div class="numero-nome">
          <form id="number-input" class="numero-candidato">
            <span class="label">Número </span>
            <input min="1" max="9" maxlength="1" step="1" type="number" name="dig_01" required>
            <input min="0" max="9" maxlength="1" step="1" type="number" name="dig_02" required>
          </form>
          <div class="nome-candidato">
            <span class="label">Nome </span> Fulano de Tal
          </div>
          <div class="confirmar-voto">
            <div><span class="label">Aperte a tecla</span></div>
            <div>Confirma<span class="label"> para confirmar seu voto </span></div>
            <div>Corrige <span class="label">para corrigir seu voto</span>
            </div>
          </div>
        </div>
      </div>
    `
  }


}

document.addEventListener('DOMContentLoaded', () => {
  render()
})

const CONFIRMA = document.getElementById('confirma')
const NUMBERINPUT = document.getElementById('number-input')
let CURRENT_INPUT = 0
NUMBERINPUT[CURRENT_INPUT].focus()

NUMBERINPUT.dig_01.addEventListener('keydown', (e) => {
  state = {
    ...state,
    data: {
      current_number: e.target.value
    }
  }
  // console.log(state.data.current_number)

  CURRENT_INPUT = advanceInput(CURRENT_INPUT)

})

NUMBERINPUT.dig_02.addEventListener('keydown', (e) => {
  state = {
    ...state,
    data: {
      current_number: state.data.current_number + e.target.value
    }
  }
  // console.log(state.data.current_number)
  CONFIRMA.focus()
})

Array.from(document.querySelectorAll('[data-value]')).forEach(button => {
  button.onclick = () => {
    NUMBERINPUT[CURRENT_INPUT].value = button.dataset.value
    CURRENT_INPUT = advanceInput(CURRENT_INPUT)
  }
})



function advanceInput(prev) {
  NUMBERINPUT[prev++].focus()
  return prev++
}

function clearStateChanges() {
  state = {
    ...state,
    data: {
      current_number: ''
    }
  }
}

function changeScreenAndRender(newScreen) {
  data.current_screen = newScreen
  render()

}