let reqIndex = 0
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault()

    reqIndex++


    const FORM = event.target
    const formData = new FormData(FORM)
    const newStudent = {}
    let serverResponse

    FORM.querySelectorAll('fieldset').forEach(fieldset => {
      const fieldsetName = fieldset.id
      newStudent[fieldsetName] = {}

      fieldset.querySelectorAll('[name]').forEach(input => {
        const key = input.name

        if (input.type === 'date') {
          newStudent[fieldsetName][key] = new Date(formData.get(key))
        }
        else if (input.type === 'number') {
          newStudent[fieldsetName][key] = parseInt(formData.get(key))
        }
        else {
          newStudent[fieldsetName][key] = formData.get(key) === 'on'
            ? true
            : formData.get(key) || null
        }
      })
    })

    if (reqIndex % 2) {
      const query = JSON.stringify(newStudent)
      const res = await fetch(`http://localhost:3001/cadastro/${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      // serverResponse = await res.json()

    }
    else {
      const res = await fetch("http://localhost:3001/cadastro", {
        method: "POST",
        body: JSON.stringify(newStudent),
        headers: {
          "Content-Type": "application/json"
        }
      })

      serverResponse = await res.json()
    }

    console.log(serverResponse)
  })
})