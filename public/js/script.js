const coloring = event => {
  console.log(document.activeElement.tagName);

  if (
    (document.activeElement.tagName !== 'INPUT' && event.keyCode === 32) ||
    event.keyCode === 13 ||
    event.target.className === 'generate'
  ) {
    for (let i = 1; i < 6; i++) {
      if (
        $(`.color${i}`)
          .find('span')
          .hasClass('locked')
      ) {
        //do nothing
      } else {
        const color = getRandomColor();
        $(`.color${i}`).css('background-color', color);
        $(`.color${i}`)
          .find('h4')
          .text(color);
      }
    }
  }
};

function getRandomColor() {
  return (
    '#' +
    Math.random()
      .toString(16)
      .slice(-6)
  );
}

const savePalette = () => {
  const palette = $('.color');
  const name = $('.palette-name').val();
  const colors = Object.keys(palette)
    .map(color => palette[color].textContent)
    .filter(color => color !== undefined);
  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({
      palettes: colors,
      name
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
  savedPalette();
};

const savedPalette = async () => {
  const initial = await fetch('/api/v1/palettes');
  const response = await initial.json()
  response.forEach((palette)=> {
    const {id, color1, color2, color3, color4, color5, name} = palette
    const card = `<div id=${id} class='card'>
    <div class='name'>${name}</div>
    <div class='color-palette' style='background-color:${color1}'></div>
    <div class='color-palette' style='background-color:${color2}'></div>
    <div class='color-palette' style='background-color:${color3}'></div>
    <div class='color-palette' style='background-color:${color4}'></div>
    <div class='color-palette' style='background-color:${color5}'></div>
    <button class='delete'>delete</button>
    </div>`
    $('#saved-palettes').append(card)
  })
};

function deletePalette(event) {
  const id = event.target.closest('.card').id
  console.log(id)
  if (event.target.className === 'delete') {
    console.log('delete button clicked')

    //remove from DOM
    //remove from database
  }
}

$(window).keypress(coloring);
window.onload = () => {
  savedPalette();
  for (let i = 1; i < 6; i++) {
    const color = getRandomColor();
    $(`.color${i}`).css('background-color', color);
    $(`.color${i}`)
      .find('h4')
      .text(color);
  }
};
$('#saved-palettes').click(deletePalette)
$('.lock').click(event => {
  $(event.target).toggleClass('locked');
});

$('.generate').click(coloring);
$('.save-palette').click(savePalette);
