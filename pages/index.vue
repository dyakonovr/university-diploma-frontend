<template>
  <container class="doctor-home">
    <div class="doctor-home__header">
      <h1 class="doctor-home__title">Записи на сегодня</h1>
      <div class="doctor-home__date">{{ formatCurrentDate() }}</div>
      <button
        class="generate-button"
        :disabled="generating"
        @click="handleGenerateDispanserizations"
      >
        {{ generating ? 'Создание...' : 'Сгенерировать диспансеризации' }}
      </button>
    </div>

    <div
      v-if="loading"
      class="doctor-home__loading">
      Загрузка записей...
    </div>

    <div
      v-else-if="!data || data.length === 0"
      class="doctor-home__empty">
      На сегодня записей нет
    </div>

    <div
      v-else
      class="doctor-home__list">
      <div 
        v-for="appointment in data" 
        :key="appointment.id" 
        class="doctor-home__item"
      >
        <div class="appointment-card">
          <div class="appointment-card__patient-info">
            <div class="appointment-card__photo">
              <div class="appointment-card__photo-placeholder">
                <span class="appointment-card__photo-initials">
                  {{ getPatientInitials(appointment.patient) }}
                </span>
              </div>
            </div>
            
            <div class="appointment-card__details">
              <h3 class="appointment-card__name">
                {{ formatDoctorFullName(appointment.patient) }}
              </h3>
              
              <div
                class="appointment-card__position">
                {{ formatTime(appointment.time) }}
              </div>
            </div>
          </div>
          
          <div class="appointment-card__actions">
            <button
              class="appointment-card__button appointment-card__button--accept"
              @click="acceptAppointment(appointment.id)">
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="meta.totalPages > 1"
      class="doctor-home__pagination">
      <button 
        v-for="page in meta.totalPages" 
        :key="page"
        class="pagination-button"
        :class="{ 'pagination-button--active': page === meta.currentPage }"
        @click="getData(page)"
      >
        {{ page }}
      </button>
    </div>
  </container>
</template>

<script lang="ts" setup>
import type { ResponseMeta } from '~/types/request.types';
import { useCustomToast } from '~/composables/useCustomToast';
import { getAppointmentsForDoctor } from '~/api/doctor-appointment';
import type { DoctorAppointment } from '~/types/doctor-appointment.types';
import Container from '~/components/layout/Container.vue';
import type { Patient } from '~/types/patient.types';
import { generateDispanserizations } from '~/api/dispanserizations';

const route = useRoute();

const { toastError, toastSuccess } = useCustomToast();

const data = ref<DoctorAppointment[] | null>(null);
const meta = ref<ResponseMeta>({
  currentPage: 1,
  totalPages: 1
});

const loading = ref(false);

// Форматирование времени
const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Форматирование текущей даты
const formatCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Получение инициалов пациента (в данном случае врача, так как в данных есть только doctor)
const getPatientInitials = (patient: Patient) => {
  const firstLetter = patient.surname?.[0] || '';
  const secondLetter = patient.name?.[0] || '';
  return `${firstLetter}${secondLetter}`;
};

// Форматирование ФИО
const formatDoctorFullName = (patient: Patient) => {
  return `${patient.surname} ${patient.name} ${patient.middlename}`;
};

// Получение данных
const getData = async (page: number) => {
  try {
    loading.value = true;
    
    const params = objectToQueryString({
      page,
    });

    const response = await getAppointmentsForDoctor(params);

    if (!response.data.value) throw new Error('Ошибка запроса');

    data.value = response.data.value.data;
    meta.value.currentPage = response.data.value.currentPage;
    meta.value.totalPages = response.data.value.totalPages;
  } catch {
    toastError('Ошибка при получении записей');
  } finally {
    loading.value = false;
  }
};

const router = useRouter();
const acceptAppointment = async (appointmentId: number) => {
  router.push(`/appointment/${appointmentId}`);
};

const parseFiltersFromUrl = () => {
  if (route.query.page && !Number.isNaN(+route.query.page)) {
    meta.value.currentPage = +route.query.page;
  }
};

const generating = ref(false);

const handleGenerateDispanserizations = async () => {
  try {
    generating.value = true;
    const response = await generateDispanserizations();
    
    if (response.data.value) {
      toastSuccess('Созданы новые диспансеризации!');
      // Можно обновить список данных, если нужно
      await getData(meta.value.currentPage);
    } else {
      toastError('Не удалось создать диспансеризации');
    }
  } catch (error) {
    console.error('Ошибка генерации диспансеризаций:', error);
    toastError('Ошибка при создании диспансеризаций');
  } finally {
    generating.value = false;
  }
};


onBeforeMount(async () => {
  parseFiltersFromUrl();
  await getData(meta.value.currentPage);
});

useHead({
  title: 'Записи на прием'
});
</script>

<style lang="scss" scoped>
.doctor-home {
  padding: 20px 0;
  
  &__header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  &__title {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  
  &__date {
    font-size: 16px;
    color: #666;
  }
  
  &__loading,
  &__empty {
    text-align: center;
    padding: 40px;
    font-size: 18px;
    color: #666;
  }
  
  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  &__pagination {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.appointment-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
 
  &__status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    
    &--active {
      background: #e8f5e9;
      color: #2e7d32;
    }
    
    &--canceled {
      background: #ffebee;
      color: #c62828;
    }
    
    &--closed {
      background: #e3f2fd;
      color: #1565c0;
    }
    
    &--passed {
      background: #f5f5f5;
      color: #616161;
    }
    
    &--undefined {
      background: #fff8e1;
      color: #ff8f00;
    }
  }
  
  &__patient-info {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;
  }
  
  &__photo {
    flex-shrink: 0;
    
    &-placeholder {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &-initials {
      color: white;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  &__details {
    flex: 1;
  }
  
  &__name {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
  }
  
  &__position {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
  
  &__actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  &__button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 120px;
    
    &--accept {
      background: #4CAF50;
      color: white;
      
      &:hover {
        background: #45a049;
      }
    }
    
    &--cancel {
      background: #f44336;
      color: white;
      
      &:hover {
        background: #d32f2f;
      }
    }
    
    &:active {
      transform: scale(0.98);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &__status-message {
    padding: 8px 16px;
    color: #666;
    font-size: 14px;
    text-align: center;
    width: 100%;
  }
}

.pagination-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &--active {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }
}

@media (max-width: 768px) {
  .doctor-home__list {
    grid-template-columns: 1fr;
  }
  
  .appointment-card {
    padding: 15px;
  }
  
  .appointment-card__actions {
    flex-direction: column;
  }
  
  .appointment-card__button {
    width: 100%;
  }
}

.generate-button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #4CAF50;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #45a049;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

</style>