<template>
  <word-press-layout>
    <article class="wp-article">
      <h1>Designing for readability first</h1>

      <p class="wp-lead">
        The Twenty Twenty-Five theme focuses on typography, spacing, and calm
        visual rhythm.
      </p>

      <figure>
        <img
          src="https://picsum.photos/900/500"
          alt="" >
        <figcaption>
          A clean layout helps readers focus on the content.
        </figcaption>
      </figure>

      <p>
        WordPress themes are designed to let the content breathe. Generous
        spacing, readable font sizes and minimal UI distractions are key.
      </p>

      <h2>Why typography matters</h2>

      <p>
        Good typography reduces cognitive load and helps readers stay engaged
        for longer periods of time.
      </p>

      <ul>
        <li>Comfortable line length</li>
        <li>Clear hierarchy</li>
        <li>Consistent rhythm</li>
      </ul>

      <blockquote>Content is king, but typography is the throne.</blockquote>

      <h2>Conclusion</h2>

      <p>
        A well-designed article layout should disappear and let the words speak
        for themselves.
      </p>
    </article>
  </word-press-layout>
</template>

<script setup lang="ts">
import WordPressLayout from './WordpressLayout.vue';
</script>

<style lang="scss">
.wp-article {
  max-width: 720px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 1.75;
  color: #1d2327;

  h1 {
    font-size: 36px;
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 26px;
    font-weight: 500;
    margin: 0 0 16px;
  }

  p {
    margin-bottom: 20px;
    line-height: 25px;
  }

  ul {
    margin: 0 0 24px 20px;

    li {
      margin-bottom: 8px;
    }
  }

  figure {
    margin: 40px 0;

    img {
      width: 100%;
      border-radius: 8px;
    }

    figcaption {
      font-size: 14px;
      color: #646970;
      margin-top: 8px;
    }
  }

  blockquote {
    margin: 32px 0;
    padding-left: 24px;
    border-left: 4px solid #dcdcde;
    color: #50575e;
    font-style: italic;
  }
}

.wp-lead {
  font-size: 20px;
  color: #50575e;
  margin-bottom: 32px;
}
</style>
