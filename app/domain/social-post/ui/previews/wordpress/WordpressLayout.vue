<template>
  <div class="wp-wrapper">
    <header class="wp-header">
      <div class="wp-header__logo">WordPress.com</div>

      <nav class="wp-header__nav">
        <a href="#">Discover</a>
        <a href="#">Blogs</a>
        <a href="#">Tags</a>
      </nav>
    </header>

    <main class="wp-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.wp-wrapper {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Helvetica Neue', Arial, sans-serif;
  background: #fafafa;
  min-height: 100vh;
  border: 1px solid grey;
}

.wp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;

  &__logo {
    font-size: 18px;
    font-weight: 700;
  }

  &__nav {
    display: flex;
    gap: 24px;

    a {
      color: #1d2327;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.wp-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}
</style>
