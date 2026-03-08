<template>
  <div class="posting-calendar">

    <!-- Дни недели -->
    <div class="weekdays">
      <div
        v-for="d in weekdays"
        :key="d"
        class="weekday">
        {{ d }}
      </div>
    </div>

    <!-- Сетка -->
    <div class="days-grid">
      <div
        v-for="(day, i) in days"
        :key="day?.date ?? i"
        class="cell"
      >
        <calendar-day
          v-if="day"
          :day="day"
          :opened-day="openedDay"
          @open="openedDay = $event"
          @close="openedDay = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import CalendarDay from './HeroSectionSecondTabDay.vue';

type PostStatus = 'published' | 'pending' | 'error'

export interface Post {
  id: number
  title: string
  time: string // HH:mm
  status: PostStatus
}

export interface CalendarDayData {
  date: string
  number: number
  isToday: boolean
  posts: Post[]
}

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();

/**
 * Пн = 0
 */
const firstWeekday =
  (new Date(year, month, 1).getDay() + 6) % 7;

/* ================= POSTS ================= */

const postsMap: Record<number, Post[]> = {
  2: [
    { id: 1, title: 'Telegram', time: '09:30', status: 'published' },
    { id: 2, title: 'VK', time: '18:00', status: 'pending' }
  ],
  5: [
    { id: 3, title: 'Instagram', time: '10:00', status: 'published' },
    { id: 4, title: 'Stories', time: '12:00', status: 'published' },
    { id: 5, title: 'Reels', time: '19:30', status: 'error' }
  ],
  9: [
    { id: 6, title: 'Post', time: '08:00', status: 'published' },
    { id: 7, title: 'Announcement', time: '14:00', status: 'pending' }
  ],
  14: [
    { id: 8, title: 'VK', time: '11:00', status: 'published' },
    { id: 9, title: 'Telegram', time: '20:00', status: 'published' }
  ],
  18: [
    { id: 10, title: 'Instagram', time: '09:00', status: 'pending' },
    { id: 11, title: 'Stories', time: '13:00', status: 'published' },
    { id: 12, title: 'Post', time: '21:00', status: 'published' }
  ],
  23: [
    { id: 13, title: 'Promo', time: '16:00', status: 'error' }
  ]
};

/* ===== helper: локальная YYYY-MM-DD ===== */
function localYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ================= DAYS ================= */

const days = computed<(CalendarDayData | null)[]>(() => {
  const result: (CalendarDayData | null)[] = [];

  // пустые ячейки до 1 числа
  for (let i = 0; i < firstWeekday; i++) {
    result.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);

    result.push({
      date: localYMD(date),
      number: d,
      isToday:
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear(),
      posts: (postsMap[d] ?? []).slice().sort((a, b) =>
        a.time.localeCompare(b.time)
      )
    });
  }

  return result;
});

const openedDay = ref<string | null>(null);
</script>

<style scoped lang="scss">
.header {
  font-weight: 600;
  margin-bottom: 12px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;

  .weekday {
    text-align: center;
    font-size: 12px;
    color: #777;
  }
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.cell {
  aspect-ratio: 1 / 1;
}
</style>
