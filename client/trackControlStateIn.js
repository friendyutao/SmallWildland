'use strict'

function trackControlStateIn(dom) {
  const keyToDirection = {
    's': Math.PI / 2,
    'd': 0,
    'w': - Math.PI / 2,
    'a': Math.PI,

    'x': Math.PI / 4,
    'z': Math.PI / 4 * 3,
    'q': Math.PI / 4 * (-3),
    'e': Math.PI / 4 * (-1),
  }
  const keyToAction = {
    'j': 'fire',
    'k': 'changeWeapon',
    'l': 'dropWeapon',

    'u': 'usePotion',
    'i': 'changePotion',
    'o': 'dropPotion',

    'p': 'pick',
    'f': 'teleport',
  }
  const keyToSaying = {
    'v': '>a',
    'n': '>b',
    ' ': '',            // blank key
  }
  const controlKeys = Object.create(null);
  [...Object.keys(keyToDirection), ...Object.keys(keyToAction), ...Object.keys(keyToSaying)].forEach(key => { controlKeys[key] = 'keyup'; });
  const sayingDiv = elt('div', {style: `position: absolute; top: ${gameViewport.height - 60}; left: ${gameViewport.width / 3}; display: none;`});
  const input = elt('textarea', { rows: 3, cos: 10, });
  const button = elt('button', { 
    tabIndex: 0,
    onclick: () => {
      socket.emit('playerControl', [{ type: 'say', saying: input.value, }]);
      input.value = '';
      dom.focus();
      sayingDiv.style.display = 'none';
      dom.addEventListener('keydown', trackKeys);
      dom.addEventListener('keyup', trackKeys);
    },
  }, 'Enter');
  sayingDiv.appendChild(input);
  sayingDiv.appendChild(button);
  dom.appendChild(sayingDiv);

  function trackKeys(event) {
    event.preventDefault();
    if (! Object.keys(controlKeys).includes(event.key) || controlKeys[event.key] == event.type) return;
    controlKeys[event.key] = event.type;
    const controls = [];

    if (Object.keys(keyToDirection).includes(event.key)) {
      if (event.type == 'keydown') {
        controls.push({ type: 'changeDirection', direction: keyToDirection[event.key] });
      } else {
        controls.push({ type: 'stopMoving' });
      }
    } else if (Object.keys(keyToSaying).includes(event.key) && event.type == 'keydown') {
      let saying = keyToSaying[event.key];
      if (saying) {
        controls.push({ type: 'say', saying: saying });
      } else {
        dom.removeEventListener('keydown', trackKeys);
        dom.removeEventListener('keyup', trackKeys);
        sayingDiv.style.display = 'block';
        input.focus();
        controlKeys[event.key] = 'keyup';
      }
    } else if (Object.keys(keyToAction).includes(event.key) && event.type == 'keydown') {
      controls.push({ type: keyToAction[event.key], });
    } 
    socket.emit('playerControl', controls);
  } 
  dom.addEventListener('keydown', trackKeys);
  dom.addEventListener('keyup', trackKeys);
}
