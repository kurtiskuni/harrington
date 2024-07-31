

document.addEventListener('astro:after-load', () => {
    // Utility
    const lerp = (current: number, target: number, factor: number): number => {
      return current * (1 - factor) + target * factor;
    };
  
    interface MousePosition {
      x: number;
      y: number;
    }
  
    let mousePosition: MousePosition = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e: MouseEvent) => {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    });
  
    // Calculate distance between 2 points
    const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
      return Math.hypot(x1 - x2, y1 - y2);
    };
  
    class MagneticObject {
      private domElement: HTMLElement;
      private boundingClientRect: DOMRect;
      private triggerArea: number;
      private interpolationFactor: number;
      private lerpingData: {
        x: { current: number; target: number };
        y: { current: number; target: number };
      };
  
      constructor(domElement: HTMLElement) {
        this.domElement = domElement;
        this.boundingClientRect = this.domElement.getBoundingClientRect();
        this.triggerArea = 200;
        this.interpolationFactor = 0.8;
  
        this.lerpingData = {
          x: { current: 0, target: 0 },
          y: { current: 0, target: 0 },
        };
  
        this.resize();
        this.render();
      }
  
      private resize() {
        window.addEventListener("resize", () => {
          this.boundingClientRect = this.domElement.getBoundingClientRect();
        });
      }
  
      private render() {
        const distanceFromMouseToCenter = calculateDistance(
          mousePosition.x,
          mousePosition.y,
          this.boundingClientRect.left + this.boundingClientRect.width / 2,
          this.boundingClientRect.top + this.boundingClientRect.height / 2
        );
  
        let targetHolder = { x: 0, y: 0 };
        if (distanceFromMouseToCenter < this.triggerArea) {
          this.domElement.classList.add("focus");
          targetHolder.x = (mousePosition.x - (this.boundingClientRect.left + this.boundingClientRect.width / 2)) * 0.3;
          targetHolder.y = (mousePosition.y - (this.boundingClientRect.top + this.boundingClientRect.height / 2)) * 0.3;
        } else {
          this.domElement.classList.remove("focus");
        }
        this.lerpingData.x.target = targetHolder.x;
        this.lerpingData.y.target = targetHolder.y;
  
        for (const item in this.lerpingData) {
          if (this.lerpingData.hasOwnProperty(item)) {
            this.lerpingData[item as "x" | "y"].current = lerp(
              this.lerpingData[item as "x" | "y"].current,
              this.lerpingData[item as "x" | "y"].target,
              this.interpolationFactor
            );
          }
        }
  
        this.domElement.style.transform = `translate(${this.lerpingData.x.current}px, ${this.lerpingData.y.current}px)`;
  
        window.requestAnimationFrame(() => this.render());
      }
    }
  
    const buttons = document.querySelectorAll(".call-to-action-btn");
    if (buttons.length > 0) {
      buttons.forEach(button => {
        if (button instanceof HTMLElement) {
          new MagneticObject(button);
        }
      });
    } else {
      console.error('Buttons with class "call-to-action-btn" not found.');
    }
  });
  
  
  // Utility function for linear interpolation
  
  
  // image
  interface Lerp {
    current: number;
    target: number;
    ease: number;
  }
  
  class LoopingElement {
    private element: HTMLElement;
    private currentTranslation: number;
    private speed: number;
    private metric: number;
    private direction: boolean;
    private scrollTop: number;
    private lerp: Lerp;
  
    constructor(element: HTMLElement, currentTranslation: number, speed: number) {
      this.element = element;
      this.currentTranslation = currentTranslation;
      this.speed = speed;
      this.metric = 100;
      this.direction = true;
      this.scrollTop = 0;
  
      this.lerp = {
        current: this.currentTranslation,
        target: this.currentTranslation,
        ease: 0.1,
      };
  
      this.events();
      this.render();
    }
  
    private events() {
      window.addEventListener('scroll', () => {
        const direction = window.pageYOffset;
        if (direction > this.scrollTop) {
          this.direction = true;
          this.lerp.target += this.speed * 5;
        } else {
          this.direction = false;
          this.lerp.target -= this.speed * 5
        }
        this.scrollTop = direction <= 0 ? 0 : direction;
      });
    }
  
    private lerpFunc(current: number, target: number, ease: number) {
      this.lerp.current = current * (1 - ease) + target * ease;
    }
  
    private right() {
      this.lerp.target += this.speed;
      if (this.lerp.target > this.metric) {
        this.lerp.current -= this.metric * 2;
        this.lerp.target -= this.metric * 2;
      }
    }
  
    private left() {
      this.lerp.target -= this.speed;
      if (this.lerp.target < -this.metric) {
        this.lerp.current += this.metric * 2;
        this.lerp.target += this.metric * 2;
      }
    }
  
    private animate() {
      this.lerpFunc(this.lerp.current, this.lerp.target, this.lerp.ease);
      this.element.style.transform = `translateX(${this.lerp.current}%)`;
    }
  
    private render() {
      this.direction ? this.right() : this.left();
      this.animate();
      window.requestAnimationFrame(() => this.render());
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll<HTMLElement>('.item');
    elements.forEach((element, index) => {
      new LoopingElement(element, index % 2 === 0 ? 0 : -100, 0.05);
    });
  
    const imagesArray = document.querySelectorAll<HTMLElement>('.images-wrapper');
    imagesArray.forEach((image, index) => {
      new LoopingElement(image, index % 2 === 0 ? 0 : -100, 0.05);
    });
  });
  
  
  // Testimonial Code
  
  class TestimonialCarousel {
    private currentIndex: number = 0;
    private items: NodeListOf<HTMLElement>;
    private dots: NodeListOf<HTMLElement>;
    private transitioning: boolean = false;
  
    constructor() {
      this.items = document.querySelectorAll('.testimonial-item');
      this.dots = document.querySelectorAll('.dot');
      this.showItem(this.currentIndex);
  
      document.querySelector('.prev-arrow')?.addEventListener('click', () => this.prevItem());
      document.querySelector('.next-arrow')?.addEventListener('click', () => this.nextItem());
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.showItem(index));
      });
    }
  
    private showItem(index: number) {
      if (this.transitioning) return;
      this.transitioning = true;
  
      const currentItem = this.items[this.currentIndex];
      const nextItem = this.items[index];
  
      currentItem.classList.remove('active-testimonial', 'fade-in-testimonial');
      currentItem.classList.add('fade-out-testimonial');
  
      nextItem.classList.add('active-testimonial', 'fade-in-testimonial');
  
      setTimeout(() => {
        currentItem.classList.remove('fade-out-testimonial');
        this.transitioning = false;
      }, 500);
  
      this.dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      this.currentIndex = index;
    }
  
    private prevItem() {
      const index = (this.currentIndex - 1 + this.items.length) % this.items.length;
      this.showItem(index);
    }
  
    private nextItem() {
      const index = (this.currentIndex + 1) % this.items.length;
      this.showItem(index);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel();
  });
  
  // Text Animations
  
  //  FADE IN 
  document.addEventListener('DOMContentLoaded', () => {
    const faders: NodeListOf<HTMLElement> = document.querySelectorAll(".fade-in");
    const fadeUp: NodeListOf<HTMLElement> = document.querySelectorAll(".fade-in-up");
    const fadeInLeft: NodeListOf<HTMLElement> = document.querySelectorAll(".fade-in-left");
    const fadeInRight: NodeListOf<HTMLElement> = document.querySelectorAll(".fade-in-right");
    const clipIn: NodeListOf<HTMLElement> = document.querySelectorAll(".clip-in");
  
    const appearOnScrollOptions: IntersectionObserverInit = {
      threshold: 0,
      rootMargin: "0px 0px 0px 0px"
    };
  
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        } else {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, appearOnScrollOptions);
  
    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  
    fadeUp.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  
    fadeInLeft.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  
    fadeInRight.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  
    clipIn.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  });

  

