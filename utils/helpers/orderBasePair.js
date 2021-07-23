const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
const PNG = '0x60781C2586D68229fde47564546784ab3fACA982';
const JOE = '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd';

const orderBasePair = (pairs) => {
  if (pairs.includes(WAVAX)) {
    if (pairs.indexOf(WAVAX) != 0) {
      [pairs[0], pairs[1]] = [pairs[1], pairs[0]]
    }
  } else if (pairs.includes(PNG)) {
    if (pairs.indexOf(PNG) != 0) {
      [pairs[0], pairs[1]] = [pairs[1], pairs[0]]
    }    
  } else if (pairs.includes(JOE)) {
    if (pairs.indexOf(JOE) != 0) {
      [pairs[0], pairs[1]] = [pairs[1], pairs[0]]
    }
  }

  return pairs
}

export default orderBasePair
