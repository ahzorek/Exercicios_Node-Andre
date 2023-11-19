document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault()

    const form = e.target

    const newStudent = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      dateOfBirth: new Date(form.dateOfBirth.value),
      classAttending: Number(form.classAttending.value),
      gender: form.gender.value,
      mothersName: form.mothersName.value || 'Não definido',
      fathersName: form.fathersName.value || 'Não definido',
      address: form.address.value,
      address2: form.address2.value || null,
      postalCode: form.postalCode.value,
      city: form.city.value,
      stateRegion: form.stateRegion.value,
      telephone: form.telephone.value,
      wpp: form.wpp.value || null,
      email: form.email.value,
      necessidadesEspeciais: {
        def_auditiva: form.def_auditiva.checked,
        def_motora: form.def_motora.checked,
        def_visual: form.def_visual.checked,
        cerebral_paral: form.cerebral_paral.checked,
        espectro: form.espectro.checked,
        psicologico: form.psicologico.checked,
        deficit_apre: form.deficit_apre.checked,
        high_skills: form.high_skills.checked
      },
    }

    const options = {
      method: "POST",
      body: JSON.stringify(newStudent),
      headers: { "Content-Type": "application/json" }
    }

    const res = await fetch("http://localhost:3001/cadastro", options)

    console.log(await res.json())
  })
})