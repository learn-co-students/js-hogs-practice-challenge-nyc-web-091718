allHogs = []
let hog
let hogCard
document.addEventListener('DOMContentLoaded', () => {
  const hogCont = document.getElementById('hog-container')
  const form = document.getElementById('form')
  let name = document.getElementById('name')
  let specialty = document.getElementById('specialty')
  let medal = document.getElementById('medal') //turn to arr
  let weight = document.getElementById('weight')//turn to arr
  let image = document.getElementById('img')
  let greasedInp = document.getElementById('greased')


  fetch('http://localhost:3000/hogs')
  .then(res => res.json())
  .then( json => {
    allHogs = json
    hogCont.innerHTML = renderAllHogs(allHogs)
  })

form.addEventListener('submit', (event) => {
  event.preventDefault();
   let data = {
    'name' : `${name.value}`,
    'specialty' : `${specialty.value}`,
    'greased' : `${greased.value}`,
    'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water' : `${weight.value}`,
    'highest medal achieved' : `${medal.value}`,
    'image' : `${image.value}`
  }
console.log(data);
  fetch('http://localhost:3000/hogs', {
  method: 'POST',
  headers: {
       'Content-Type': 'application/json'
     },
  body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then((json) => {
    hog = json
        hogCont.innerHTML += renderNewHog(hog)
    allHogs.push(hog)
    return allHogs
  })
}) // End Form Listener

hogCont.addEventListener('click', (event) => {
  if(event.target.dataset.action === "delete") {
    console.log(event.target.dataset.id);
    let id = parseInt(event.target.dataset.id)
     hogCard = document.getElementById(`hog-${id}`)

    fetch(`http://localhost:3000/hogs/${id}`, {
    method: 'DELETE'
    })
    .then(res => {
      if(res.ok){
        allHogs = filterHogs(allHogs, id)
        hogCard.remove()
      }
   })
  }
})

}) //END DOMContentLoaded


// HELPER FNS************************************************************************

function renderAllHogs(allHogs) {
  return allHogs.map((hog) => {
    return `
    <div id='hog-${hog.id}' class='hog-card'>
      <img src='${hog.image}'>
        <p>${hog.name} </p>
        <p>Specialty: ${hog.specialty}</p>
        <p>weight: ${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}</p>
      <p>highest medal achieved: ${hog['highest medal achieved']}</p>
    <p>Greased?</p><input type='checkbox' id='check-${hog.id}' ${isGreased(hog)}><br>
    <button data-action='delete' data-id='${hog.id}'>Delete 🐷</button>
    </div>
    `
  }).join('')
}

function isGreased(hog) {
  if(hog.greased) {
    return 'checked'
  } else {
    return 'unchecked'
  }
}

function renderNewHog(hog) {
  return `
  <div id='hog-${hog.id}' class='hog-card'>
    <img src='${hog.image}'>
      <p>${hog.name} </p>
      <p>Specialty: ${hog.specialty}</p>
      <p>weight: ${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}</p>
    <p>highest medal achieved: ${hog['highest medal achieved']}</p>
  <p>Greased?</p><input type='checkbox' id='check-${hog.id}' ${isGreased(hog)}><br>
  <button data-action='delete' data-id='${hog.id}'>Delete 🐷</button>
  </div>
  `
}

function filterHogs(allHogs, id) {
  return allHogs.filter((hog) => {
    return hog.id !== id
  })
}
