document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault()

    const FORM = event.target
    const formData = new FormData(FORM)
    const newStudent = {}

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

    const res = await fetch("http://localhost:3001/cadastro", {
      method: "POST",
      body: JSON.stringify(newStudent),
      headers: {
        "Content-Type": "application/json"
      }
    })

    console.log(await res.json())
  })
})