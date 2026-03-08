<template>
  <div class="hero-ft-swiper">
    <div class="hero-ft-swiper__screen">
      <div
        ref="container"
        class="keen-slider">
        <div class="keen-slider__slide number-slide1">1</div>
        <div class="keen-slider__slide number-slide2">2</div>
        <div class="keen-slider__slide number-slide3">3</div>
        <div class="keen-slider__slide number-slide4">4</div>
        <div class="keen-slider__slide number-slide5">5</div>
        <div class="keen-slider__slide number-slide6">6</div>
      </div>
    </div>

    <img
      src="/images/landing/hero/phone.png"
      class="hero-ft-swiper__phone">
  </div>
</template>

<script lang="ts" setup>
import 'keen-slider/keen-slider.min.css';

import type { KeenSliderPlugin } from 'keen-slider';
import { useKeenSlider } from 'keen-slider/vue.es';

const SWTICH_TIMEOUT = 5000;
const autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let mouseOver = false;

  const clearNextTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const nextTimeout = () => {
    clearNextTimeout();
    if (mouseOver) return;

    timeout = setTimeout(() => {
      slider.next();
    }, SWTICH_TIMEOUT);
  };

  slider.on('created', () => {
    const container = slider.container;

    const onMouseOver = () => {
      mouseOver = true;
      clearNextTimeout();
    };

    const onMouseOut = () => {
      mouseOver = false;
      nextTimeout();
    };

    container.addEventListener('mouseover', onMouseOver);
    container.addEventListener('mouseout', onMouseOut);

    nextTimeout();
  });

  slider.on('dragStarted', clearNextTimeout);
  slider.on('animationEnded', nextTimeout);
  slider.on('updated', nextTimeout);
};

const [container, slider] = useKeenSlider<HTMLDivElement>(
  {
    loop: true,
    drag: false,
    slides: {
      perView: 1,
      spacing: 0,
    },
  },
  [autoplay],
);
</script>

<style lang="scss">
.hero-ft-swiper {
  position: relative;
  
  &, &__phone {
    width: 220px;
    height: 400px;
  }

  &__phone {
    position: absolute;
    left: 0;
    top: 0;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }

  &__screen {
    position: absolute;
    top: 9px;
    left: 12px;
    width: 200px;
    height: 385px;

    overflow: hidden;
    border-radius: 24px;
    z-index: 1;
  }
}

[class^="number-slide"],
[class*=" number-slide"] {
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #fff;
  font-weight: 500;
  // height: 300px;
  // max-height: 100vh;
  height: 400px;
}

.number-slide1 {
  background: rgb(64, 175, 255);
  background: linear-gradient(
    128deg,
    rgba(64, 175, 255, 1) 0%,
    rgba(63, 97, 255, 1) 100%
  );
}

.number-slide2 {
  background: rgb(255, 75, 64);
  background: linear-gradient(
    128deg,
    rgba(255, 154, 63, 1) 0%,
    rgba(255, 75, 64, 1) 100%
  );
}

.number-slide3 {
  background: rgb(182, 255, 64);
  background: linear-gradient(
    128deg,
    rgba(182, 255, 64, 1) 0%,
    rgba(63, 255, 71, 1) 100%
  );
  background: linear-gradient(
    128deg,
    rgba(189, 255, 83, 1) 0%,
    rgba(43, 250, 82, 1) 100%
  );
}

.number-slide4 {
  background: rgb(64, 255, 242);
  background: linear-gradient(
    128deg,
    rgba(64, 255, 242, 1) 0%,
    rgba(63, 188, 255, 1) 100%
  );
}

.number-slide5 {
  background: rgb(255, 64, 156);
  background: linear-gradient(
    128deg,
    rgba(255, 64, 156, 1) 0%,
    rgba(255, 63, 63, 1) 100%
  );
}
.number-slide6 {
  background: rgb(64, 76, 255);
  background: linear-gradient(
    128deg,
    rgba(64, 76, 255, 1) 0%,
    rgba(174, 63, 255, 1) 100%
  );
}
</style>