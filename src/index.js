let allHogs = []

document.addEventListener("DOMContentLoaded", function() {
  const hogContainer = document.getElementById('hog-container')
  const hogForm = document.getElementById('hog-form')

  fetch('http://localhost:3000/hogs')
    .then(response => response.json())
    .then(hogJson => {
      allHogs = hogJson
      hogContainer.innerHTML = renderAllHogs(hogJson)
    })

  hogForm.addEventListener('submit', (event) => {
    event.preventDefault()
    patchNewHog(event)

  })

  hogContainer.addEventListener("click", (event) => {
    if (event.target.dataset.action === "delete") {
      deleteHog(event)
    }
    if (event.target.name === "greased") {
      let newGreasedStatus = event.target.checked
      let hogToUpdate = allHogs.find(hog => hog.id == event.target.parentElement.dataset.id)
      hogToUpdate.greased = newGreasedStatus
      fetch(`http://localhost:3000/hogs/${hogToUpdate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          greased: newGreasedStatus
        })
      })
    }
  })



  function patchNewHog(event) {
    let data = {
      "name": `${event.target.querySelector("#hog-name").value}`,
      "specialty": `${event.target.querySelector("#hog-specialty").value}`,
      "greased": `${event.target.querySelector("#hog-greased").value}`,
      "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": `${event.target.querySelector("#hog-weight").value}`,
      "highest medal achieved": `${event.target.querySelector("#hog-medal").value}`,
      "image": `${event.target.querySelector("#hog-image").value}`
    }
    fetch('http://localhost:3000/hogs', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(createdHogJson => {
      allHogs.push(createdHogJson)
      hogContainer.innerHTML += renderAllHogs([createdHogJson])
    })
  }

  function deleteHog(event) {
    let foundHog = allHogs.find(hog => hog.id == event.target.parentElement.dataset.id)

    fetch(`http://localhost:3000/hogs/${foundHog.id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (response.ok) {
        event.target.parentElement.remove()
        allHogs = allHogs.filter(hog => hog.id !== foundHog.id)
        debugger
        renderAllHogs(allHogs)
      }
    })

  }


}) // End of DOMContentLoaded


//----------Helpers--------------------

function renderAllHogs(hogsArray) {
  return hogsArray.map(hog => {
    return `
      <div class="hog-card" data-id='${hog.id}'>
        <h2 id="hog-name">${hog.name}</h2>
        <p class="hog-specialty">Specialty: ${hog.specialty}</p>
        <input type="checkbox" name="greased" ${isGreased(hog)}> Greased?<br>
        <p class="hog-weight">Weight: ${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}</p>
        <i>Highest Medal Achieved: ${hog["highest medal achieved"]}</i>
        <img src="${hog.image}">
        <button data-action="delete" type="button" name="button">Delete</button>
      </div>
    `
  }).join("")

  function isGreased(hog) {
    if (hog.greased) {
      return "checked"
    } else {
      return "unchecked"
    }
  }
}
