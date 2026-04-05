import anime from 'animejs';

export const popIn = (targets, delay = 0) => {
  return anime({
    targets,
    scale: [0.5, 1],
    opacity: [0, 1],
    duration: 800,
    delay: anime.stagger(100, { start: delay }),
    easing: 'spring(1, 80, 10, 0)'
  }).finished;
};

export const successShake = (target) => {
  return anime({
    targets: target,
    translateX: [
      { value: -10, duration: 100, easing: 'easeInOutQuad' },
      { value: 10, duration: 100, easing: 'easeInOutQuad' },
      { value: -10, duration: 100, easing: 'easeInOutQuad' },
      { value: 10, duration: 100, easing: 'easeInOutQuad' },
      { value: 0, duration: 100, easing: 'easeInOutQuad' }
    ],
    rotate: [
      { value: -5, duration: 100, easing: 'easeInOutQuad' },
      { value: 5, duration: 100, easing: 'easeInOutQuad' },
      { value: 0, duration: 100, easing: 'easeInOutQuad' }
    ],
    scale: [
      { value: 1.1, duration: 250, easing: 'easeOutQuad' },
      { value: 1, duration: 250, easing: 'easeInQuad' }
    ]
  }).finished;
};

export const failureShake = (target) => {
  return anime({
    targets: target,
    translateX: [
      { value: -15, duration: 100, easing: 'easeInOutQuad' },
      { value: 15, duration: 100, easing: 'easeInOutQuad' },
      { value: -15, duration: 100, easing: 'easeInOutQuad' },
      { value: 15, duration: 100, easing: 'easeInOutQuad' },
      { value: 0, duration: 100, easing: 'easeInOutQuad' }
    ],
    backgroundColor: [
      { value: '#ef4444', duration: 100 }, // red-500
      { value: '', duration: 400 } // back to original
    ]
  }).finished;
};

export const floatLoop = (targets, yOffset = 10, duration = 3000) => {
  return anime({
    targets,
    translateY: [
      { value: -yOffset, duration: duration / 2, easing: 'easeInOutSine' },
      { value: 0, duration: duration / 2, easing: 'easeInOutSine' }
    ],
    loop: true
  });
};
