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

  const { current_screen, isLoading, data } = state
  const out = document.querySelector('.screen')

  clear(out)


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
            <span class="label">Voto </span> ${data.current_number ? 'NULO' : 'BRANCO'}
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
        <div class="end-screen">
          <h1>FIM</h1>
        </div>
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
    if (status === 'true') {
      openCandidateList.setAttribute('data-isOpen', false)
      openCandidateList.querySelector('h3').innerHTML = '🔼 Abrir Candidatos'
    } else {
      openCandidateList.setAttribute('data-isOpen', true)
      openCandidateList.querySelector('h3').innerHTML = '🔽 Fechar Candidatos'
    }

  })

  fillCandidateInfo(state.data.candidates)



  const CONFIRMA = document.getElementById('confirma')
  const CORRIGE = document.getElementById('corrige')
  const BRANCO = document.getElementById('branco')

  handleNumberInput()

  CONFIRMA.addEventListener('click', async () => {
    //inicializa confirmação e envio do voto
    beep.play()
    state.isLoading = true
    state.current_screen = END_SCREEN
    render()

    try {
      const res = await fetch('/register_vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          elec_code: '002',
          vote: (state.data.candidate_selected) ? state.data.candidate_selected.numeroCandidato : null,
          createdAt: (new Date()).toISOString()
        })
      })

      if (!res.ok) throw new Error('deu ruim')

      const data = await res.json()
      console.log('sucesso:', data)

      //finaliza confirmação e envio do voto com sucesso
      await delayOutput(1200)
      state.isLoading = false
      trilili.play()

      //anula todas as ações do botao na urna (provisorio)
      document.querySelectorAll('button').forEach(button => {
        button.disabled = true
      })

      render()

    }
    catch (err) {
      console.error(err)
    }
  })

  BRANCO.addEventListener('click', () => {
    beep.play()

    state.data.current_number = null
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

  document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
      BRANCO.click()
    }
    else if (event.code === 'Backspace' || event.code === 'Delete') {
      if (state.current_screen === CONFIRM_NULL_VOTE || state.current_screen === CONFIRM_VALID_VOTE) {
        CORRIGE.click()
      }
    }
    else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      if (state.current_screen === CONFIRM_NULL_VOTE || state.current_screen === CONFIRM_VALID_VOTE) {
        CONFIRMA.click()
      }
    }
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
    button.blur()
    handleInputComplete(state.data.current_number.length)
  }

}

function handleNumberInput() {
  const numberInput = document.getElementById('number-input')
  if (numberInput) {
    numberInput.focus()
    numberInput.addEventListener('input', e => {
      if (isNaN(Number(e.target.value[0])) === false) {
        state.data.current_number = + numberInput.value
        beep.play()

        handleInputComplete(numberInput.value.length)
        return
      }
      else
        clear(e.target)
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
  console.table(cadidates)
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

function clear(target) {
  if (target.innerHTML) {
    target.innerHTML = ''
  }
  else if (target.innerText) {
    target.innerText = ''
  }
  else if (target.value) {
    target.value = ''
  }
  else
    target = ''
}