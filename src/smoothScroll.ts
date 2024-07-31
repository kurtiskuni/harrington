import Lenis from 'lenis';

const lenis = new Lenis();

lenis.on('scroll', (e: Event) => {
  console.log(e);
});

function raf(time: DOMHighResTimeStamp) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
