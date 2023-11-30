import { INITIAL_INPUT, CONFIRM_NULL_VOTE, CONFIRM_VALID_VOTE, END_SCREEN } from "./states.js"

const beep = new Audio("assets/sounds/beep.wav")
const trilili = new Audio("assets/sounds/trilili_fim.wav")

// telas possiveis //
///seleção numero
//confirmar voto
//numero === candidato identificado
//numero !== voto nulo
//voto branco
///voto confirmado
///votação encerrada


let state = {
  isLoading: true,
  keyboard: true,
  current_screen: INITIAL_INPUT,
  data: {
    current_number: '',
    candidate_selected: null,
    candidates: [],
  }
}

function render() {
  console.warn('render called')
  const out = document.querySelector('.screen')
  out.innerHTML = ''

  const { current_screen, isLoading, data } = state

  if (current_screen === INITIAL_INPUT) {
    out.innerHTML = `
        <div class="numero-nome">
          <form id="number-input-form">
            <span class="label">Número</span>
            <input value="${data.current_number}" id="number-input" min="10" max="99" maxlength="2" step="1" type="number" name="dig" required>
          </form>
        </div>
      </div>
    `
  }

  else if (current_screen === CONFIRM_VALID_VOTE) {
    if (data.candidate_selected) console.log(data.candidate_selected)
    out.innerHTML = `
        <div class="numero-nome">
          <img src="assets/img/candidates/${data.candidate_selected.urlFoto}" alt="Foto do Candidato">
          <form id="number-input-form">
            <span class="label">Número </span>
            <input value="${data.current_number}" id="number-input" min="10" max="99" maxlength="2" step="1" type="number" name="dig" required>
          </form>
          <div class="nome-candidato">
            <span class="label">Nome </span> ${data.candidate_selected.nomeCandidato}
          </div>
        </div>
        <div class="confirmar-voto">
          <div><span class="label">Aperte a tecla</span></div>
          <div>Confirma<span class="label"> para confirmar seu voto </span></div>
          <div>Corrige <span class="label">para corrigir seu voto</span>
          </div>
        </div>
      </div>
    `
  }
  else if (current_screen === CONFIRM_NULL_VOTE) {
    out.innerHTML = `
        <div class="numero-nome">
          <div class="nome-candidato">
            <span class="label">Voto </span> NULO / BRANCO
          </div>
        </div>
        <div class="confirmar-voto">
          <div><span class="label">Aperte a tecla</span></div>
          <div>Confirma<span class="label"> para confirmar seu voto </span></div>
          <div>Corrige <span class="label">para corrigir seu voto</span>
          </div>
        </div>
      </div>
    `
  }

  else if (current_screen === END_SCREEN) {
    if (isLoading) {
      out.innerHTML = `
        <div class="end-screen">
          <div id="loading"></div>
        </div>
      `
    } else {
      out.innerHTML = `
        <h1 class="end-screen">FIM</h1>
      `
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const url = 'first_load?elec_code=004'
  const res = await fetch(url)
  const POLLDATA = await res.json()
  state.data.candidates = [...POLLDATA]
  console.log(state)

  render()

  const openCandidateList = document.querySelector('#candidates-info')
  openCandidateList.querySelector('h3').addEventListener('click', () => {
    const status = openCandidateList.getAttribute('data-isOpen')
    if (status !== 'false') {
      openCandidateList.setAttribute('data-isOpen', false)
      openCandidateList.classList.replace('open', 'closed')
      openCandidateList.querySelector('h3').innerHTML = '🔼 Abrir Candidatos'
    } else {
      openCandidateList.setAttribute('data-isOpen', true)
      openCandidateList.classList.replace('closed', 'open')
      openCandidateList.querySelector('h3').innerHTML = '🔽 Fechar Candidatos'
    }

  })

  fillCandidateInfo(state.data.candidates)



  const CONFIRMA = document.getElementById('confirma')
  const CORRIGE = document.getElementById('corrige')
  const BRANCO = document.getElementById('branco')

  handleNumberInput()

  CONFIRMA.addEventListener('click', async () => {
    beep.play()
    state.isLoading = true
    state.current_screen = END_SCREEN

    render()

    await delayOutput(2000)
    state.isLoading = false
    trilili.play()

    render()

  })

  BRANCO.addEventListener('click', () => {
    beep.play()

    state.current_screen = CONFIRM_NULL_VOTE
    render()
  })

  CORRIGE.addEventListener('click', () => {
    beep.play()
    state.data.current_number = ''
    state.data.candidate_selected = null
    state.keyboard = true
    state.current_screen = INITIAL_INPUT

    changeScreen(INITIAL_INPUT)
  })

  Array.from(document.querySelectorAll('[data-value]')).forEach(button => {
    button.addEventListener('click', () => handleButtonNumberInput(button))
  })

})



function changeScreen(newScreen) {
  state.data.current_screen = newScreen
  render()
  handleNumberInput()
}


function handleButtonNumberInput(button) {
  if (state.keyboard) {
    beep.play()
    // console.log(button.dataset.value)
    state.data.current_number += button.dataset.value
    render()
    handleInputComplete(state.data.current_number.length)
  }

}


function handleNumberInput() {
  const numberInput = document.getElementById('number-input')
  if (numberInput) {
    numberInput.focus()
    numberInput.addEventListener('input', e => {
      state.data.current_number = + numberInput.value
      beep.play()

      handleInputComplete(numberInput.value.length)
    })
  }
}

function handleInputComplete(digits) {
  const numberInput = document.getElementById('number-input')
  if (digits === 2) {
    const candidate = findCandidate(state.data.current_number)
    if (candidate.length === 1) {
      state.data.candidate_selected = candidate[0]
      state.current_screen = CONFIRM_VALID_VOTE
    }
    else
      state.current_screen = CONFIRM_NULL_VOTE

    render()
    numberInput.setAttribute('disabled', true)
    state.keyboard = false
  }
}

function findCandidate(number) {
  return state.data.candidates.filter(({ numeroCandidato }) => numeroCandidato === parseInt(number))
}

async function delayOutput(time = 120) {
  await new Promise(resolve => setTimeout(resolve, time))
}

function fillCandidateInfo(cadidates) {
  console.log(cadidates)
  cadidates.forEach(info => {
    const newEl = document.createElement('div')
    newEl.classList.add('candidate-item')
    newEl.innerHTML = `
      <span>${info.numeroCandidato}</span>
      <span>${info.nomeCandidato}</span>
      <span>
      <img src="assets/img/candidates/${info.urlFoto}" alt="Foto do Candidato">
      </span>
    `


    document.getElementById('candidates-info').appendChild(newEl)
  })
}