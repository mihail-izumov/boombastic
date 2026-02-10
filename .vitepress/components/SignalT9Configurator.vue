<template>
  <div class="signal-demo-wrapper">

    <!-- Переключатель секций -->
    <div class="signal-demo__header">
      <div class="signal-demo__breadcrumbs" role="tablist">
        <button
          v-for="section in sections"
          :key="section.id"
          class="signal-breadcrumb"
          :class="[section.id, isActive(section.id) ? 'is-active' : '']"
          @click="selectedSection = section.id"
        >
          <div class="signal-breadcrumb-circle"></div>
        </button>
      </div>
    </div>

    <!-- Кнопка информации и переключатель пола -->
    <div class="signal-controls-row">
      <button 
        class="signal-info-button"
        :class="{ 
          'signal-info-female': selectedGender === 'female',
          'signal-info-male': selectedGender === 'male'
        }"
        @click="showInfoModal = true"
      >
        Как работает
      </button>
      <div class="signal-gender-switch">
        <div class="signal-gender-container">
          <div 
            class="signal-gender-btn signal-gender-female"
            :class="{ 'is-active': selectedGender === 'female' }"
            @click="onGenderClick('female')"
          ></div>
          <div 
            class="signal-gender-btn signal-gender-male"
            :class="{ 'is-active': selectedGender === 'male' }"
            @click="onGenderClick('male')"
          ></div>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
<div v-if="showInfoModal" class="modal-overlay" @click.self="showInfoModal = false">
  <div class="modal">
    <div class="modal-title">
      Почувствуйте силу <span class="title-break">настоящих перемен</span>
    </div>
    <div class="modal-body">
      <b>Сигнал – не просто мнение или жалоба, а импульс к реальным улучшениям.</b>
      
      <div class="modal-spacer"></div>
      
      Каждый Сигнал делает бизнес, который вы любите, еще лучше каждый день для Вас.
      
      <div class="modal-spacer"></div>

      <a href="https://cffx.ru/signals.html" target="_blank" class="modal-link no-double-underline">Как Работает Сигнал</a>
    </div>
    <div class="modal-footer">
      <button class="modal-ok" @click="showInfoModal = false">Понятно</button>
    </div>
  </div>
</div>


    <div class="signal-demo__form-container">

<!-- Секция 6: Локация + выбор направления в виде выпадающего меню -->
<div v-if="selectedSection === 'location'" class="signal-form-section">
  <div class="signal-question-block" style="--accent-color: #5A9FB8;">
    <div class="signal-rotating-phrase-container location-header-container">
  <p class="location-title">
    Где разобрать Ваш Сигнал?
  </p>
</div>

    <div style="display: flex; flex-direction: column; gap: 7px;">
      <select v-model="form.direction" class="signal-select">
        <option disabled value="">Выбрать направление</option>
        <option value="food">Рестораны и кофейни</option>
        <option value="fitness">Фитнес-клубы и студии</option>
      </select>
      <select
        v-model="form.selectedNetwork"
        class="signal-select"
        :disabled="!form.direction"
      >
        <option disabled value="">Выбрать сеть</option>
        <option
          v-for="(club, name) in form.direction === 'fitness' ? fitness : cafes"
          :key="name"
          :value="name"
        >{{ name }}</option>
      </select>
      <select
        v-model="form.selectedBranch"
        class="signal-select"
        :disabled="!form.selectedNetwork"
      >
        <option disabled value="">Выбрать локацию</option>
        <option
          v-for="(branch, index) in selectedNetworkBranches"
          :key="index"
          :value="branch.address"
        >{{ branch.address }}</option>
      </select>
    </div>
  </div>
</div>

      <!-- Секция 2: Эмоции -->
      <div v-if="selectedSection === 'emotions'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #6f5d9f;">
          <div class="signal-rotating-phrase-container signal-rotating-fixed-height">
  <transition name="fade" mode="out-in">
    <p :key="currentQuestion1" class="signal-question-label">
      {{ currentQuestion1 }}
    </p>
  </transition>
</div>

          <textarea 
            v-model="form.emotionalRelease" 
            @focus="stopRotation"
            @blur="startRotation(1)"
            :rows="isMobile ? 5 : 3"
            placeholder="Или напишите своими словами ..."
          ></textarea>
          <div class="signal-suggestions-container">
            <div 
              v-for="suggestion in currentSuggestions.emotions" 
              :key="suggestion"
              class="signal-suggestion-bubble signal-emotion-bubble"
              @click="selectSuggestion('emotionalRelease', suggestion, 'emotions')"
            >
              {{ suggestion }}
            </div>
            <div 
  v-if="!isInitialSuggestions('emotions')"
  class="signal-suggestion-bubble signal-reset-bubble signal-emotion-bubble"
  @click="resetSuggestions('emotions')"
>
  <!-- Начало иконки -->
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="signal-reset-icon">
    <path d="M6 8L2 12L6 16"/>
    <path d="M2 12H22"/>
  </svg>
  <!-- Конец иконки -->
  Ещё варианты
</div>
          </div>
        </div>
      </div>

      <!-- Секция 3: Факты -->
      <div v-if="selectedSection === 'facts'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #3a8862;">
          <div class="signal-rotating-phrase-container signal-rotating-fixed-height">
  <transition name="fade" mode="out-in">
    <p :key="currentQuestion2" class="signal-question-label">
      {{ currentQuestion2 }}
    </p>
  </transition>
</div>
          <textarea 
  v-model="form.factualAnalysis" 
  @focus="stopRotation" 
  @blur="startRotation(2)"
  :rows="isMobile ? 5 : 3"
  :placeholder="isMobile 
    ? 'Несколько фактов:\nчто и когда произошло ...' 
    : 'Несколько фактов: что и когда произошло ...'"
></textarea>

          <div class="signal-suggestions-container">
            <div 
              v-for="suggestion in currentSuggestions.facts" 
              :key="suggestion"
              class="signal-suggestion-bubble signal-fact-bubble"
              @click="selectSuggestion('factualAnalysis', suggestion, 'facts')"
            >
              {{ suggestion }}
            </div>
            <div 
  v-if="!isInitialSuggestions('facts')"
  class="signal-suggestion-bubble signal-reset-bubble signal-fact-bubble"
  @click="resetSuggestions('facts')"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="signal-reset-icon">
    <path d="M6 8L2 12L6 16"/>
    <path d="M2 12H22"/>
  </svg>
  Ещё варианты
</div>
          </div>
        </div>
      </div>

      <!-- Секция 4: Решение -->
      <div v-if="selectedSection === 'solutions'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #4A90E2;">
          <div class="signal-rotating-phrase-container signal-rotating-fixed-height">
  <transition name="fade" mode="out-in">
    <p :key="currentQuestion3" class="signal-question-label">
      {{ currentQuestion3 }}
    </p>
  </transition>
</div>
          <textarea 
            v-model="form.constructiveSuggestions" 
            @focus="stopRotation" 
            @blur="startRotation(3)" 
            :rows="isMobile ? 5 : 3"
            placeholder="Дайте честный совет ..."
          ></textarea>
          <div class="signal-suggestions-container">
            <div 
              v-for="suggestion in currentSuggestions.solutions" 
              :key="suggestion"
              class="signal-suggestion-bubble signal-solution-bubble"
              @click="selectSuggestion('constructiveSuggestions', suggestion, 'solutions')"
            >
              {{ suggestion }}
            </div>
            <div 
  v-if="!isInitialSuggestions('solutions')"
  class="signal-suggestion-bubble signal-reset-bubble signal-solution-bubble"
  @click="resetSuggestions('solutions')"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="signal-reset-icon">
    <path d="M6 8L2 12L6 16"/>
    <path d="M2 12H22"/>
  </svg>
  Ещё варианты
</div>
          </div>
        </div>
      </div>

      <!-- Секция 5: Итого -->
      <div v-if="selectedSection === 'summary'" class="signal-form-section">
        <div class="signal-question-block" style="--accent-color: #FFB800;">
          <p class="signal-direction-label">Ваш Сигнал</p>
          <div class="signal-rotating-phrase-container">
            <p class="signal-question-label">Что должно измениться?</p>
          </div>
          <textarea 
            v-model="form.summaryText" 
            :rows="isMobile ? 8 : 6"
            placeholder="Перемены начинаются здесь ..."
          ></textarea>
          <p class="signal-example-hint signal-example-hint-white">Команда к действию для бизнеса и видимый результат для вас</p>
        </div>
      </div>

      <!-- Секция 7: Контакт -->
      <div v-if="selectedSection === 'contact'" class="signal-form-section">
        <div v-if="formSubmitted" class="signal-success-screen">
          <div class="signal-success-content">
            <h3>Сигнал отправлен ⚡</h3>
            <div class="signal-success-ticket-info">
              <span class="signal-success-date">{{ currentDate }}</span>
              <span class="signal-success-ticket">{{ formattedTicketNumber }}</span>
            </div>
            <p class="signal-success-description">Отправьте тикет Анне, чтобы получить результат в Телеграм.</p>
            <a :href="`https://t.me/Anna_Signal?text=Тикет%20${rawTicketNumber}`"
               target="_blank"
               :class="['signal-telegram-button', selectedGender === 'female' ? 'female' : 'male']">
              Получить Ответ
            </a>
            <a href="/signals#знакомьтесь-–-анна" target="_blank" class="signal-secondary-link no-double-underline">
              Кто Анна и как работает
            </a>
          </div>
        </div>
        <div v-else>
          <div class="signal-question-block contact" style="--accent-color: #00C2A8;">
            <div class="signal-rotating-phrase-container">
              <p class="signal-question-label">Отправьте Ваш Сигнал</p>
            </div>
            <div v-if="!form.isIncognito" class="signal-name-field">
              <label>Для персонального разбора</label>
              <input v-model="form.userName" class="signal-input" placeholder="Ваше Имя" />
            </div>
            <div class="signal-incognito-toggle">
              <label class="signal-toggle-label">
                <input type="checkbox" v-model="form.isIncognito" class="signal-toggle-checkbox" />
                <span class="signal-toggle-slider"></span>
                <span class="signal-toggle-text">Анонимно</span>
              </label>
            </div>
            <p class="signal-input-hint">
              {{ form.isIncognito 
                ? 'Бизнес получит этот Сигнал. Ответ по запросу у Анны.'
                : 'Получим разбор Вашего Сигнала. Анна сообщит о результе и поможет уточнить детали.' }}
            </p>
          </div>
          <label class="signal-agreement">
            <input type="checkbox" v-model="form.agreedToTerms" />
            <span>Подтверждаю согласие с
              <a href="/terms" target="_blank" class="signal-policy-link no-double-underline">Условиями использования</a>
            </span>
          </label>
          <button 
            class="signal-submit-button" 
            :disabled="submitStatus === 'processing' || !form.agreedToTerms || !isEmotionFilled"
            @click="submitForm"
          >
            <span class="signal-liquid-next-text">{{ submitButtonText }}</span>
          </button>
        </div>
      </div>

      <!-- Кнопки навигации по шагам -->
      <div v-if="selectedSection !== 'contact'" class="signal-next-button-container">
  <button
    class="signal-liquid-next-btn"
    :class="[
      selectedSection === 'share' ? 'signal-share-next' : '',
      selectedSection === 'emotions' ? 'signal-emotion-next' : '',
      selectedSection === 'facts' ? 'signal-fact-next' : '',
      selectedSection === 'solutions' ? 'signal-solution-next' : '',
      selectedSection === 'summary' ? 'signal-summary-next' : '',
      selectedSection === 'location' ? 'signal-location-next' : ''
    ]"
    @click="goToNextSection"
    :disabled="
      (selectedSection === 'emotions' && !isEmotionFilled)
      || (selectedSection === 'summary' && (!form.summaryText || !form.summaryText.trim()))
      || (selectedSection === 'location' && (!form.direction || !form.selectedNetwork || !form.selectedBranch))
    "
  >
    <span class="signal-liquid-next-text">{{ currentSectionData.buttonText }}</span>
    <CupFillIcon
      class="signal-next-icon"
      :step-index="sections.findIndex(s => s.id === selectedSection)"
      :steps-total="6"
      :size="22"
    />
  </button>

        <div v-if="selectedSection === 'summary'" class="signal-humanize-button-container">
          <button class="signal-liquid-humanize-btn" @click="summarizeAllContent()" :disabled="humanizeStatus === 'processing'">
            <span class="signal-liquid-humanize-text">
              {{ humanizeStatus === 'completed' ? 'Готово' : humanizeStatus === 'processing' ? 'Обновление...' : 'Обновить' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch } from 'vue'

// ====== Стейт формы ======
const form = reactive({
  direction: '', // 'food' или 'fitness'
  emotionalRelease: '',
  factualAnalysis: '',
  constructiveSuggestions: '',
  summaryText: '',
  selectedNetwork: '',
  selectedBranch: '',
  userName: '',
  isIncognito: false,
  agreedToTerms: false,
});

// Сброс сети и локации при изменении направления
watch(
  () => form.direction,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      form.selectedNetwork = '';
      form.selectedBranch = '';
    }
  }
);

// Сброс локации при изменении сети
watch(
  () => form.selectedNetwork,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      form.selectedBranch = '';
    }
  }
);

// Для проп-шагов (пример: если используются табы или плавный скролл)
const isMobile = ref(false);
onMounted(() => {
  const checkMobile = () => { isMobile.value = window.innerWidth <= 768 }
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

const selectedGender = ref('female');
const showInfoModal = ref(false);
const formSubmitted = ref(false);
const submitStatus = ref('idle');
const rawTicketNumber = ref(null);
const formattedTicketNumber = ref(null);
const currentDate = ref('');
const humanizeStatus = ref('idle');

  onMounted(() => {
  // Генерируем номер тикета и дату при запуске формы
  rawTicketNumber.value = String(Date.now()).slice(-6);
  formattedTicketNumber.value = `${rawTicketNumber.value.slice(0, 3)}-${rawTicketNumber.value.slice(3, 6)}`;

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  currentDate.value = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
});


// Массивы сетей и филиалов
const fitness = {
  'World Class': {
    branches: [
      { address: 'Москва, Оружейный переулок, 41' },
      { address: 'Москва, Ленинградское шоссе, 16Ас8' },
      { address: 'Москва, Пресненская наб., 8с1' },
      { address: 'Москва, ул. Житная, 14с2' },
      { address: 'Москва, ул. Земляной Вал, 9' },
      { address: 'Москва, пр. Академика Сахарова, 7' },
      { address: 'Москва, ул. Сергея Макеева, 9с5' },
      { address: 'Уфа, ул. Революционная, 39/2' },
      { address: 'Санкт-Петербург, ул. Ефимова, 4А' },
      { address: 'Санкт-Петербург, наб. Мартынова, 38' },
      { address: 'Санкт-Петербург, просп. Стачек, 99' },
      { address: 'Екатеринбург, Олимпийская наб., 9' },
      { address: 'Владивосток, ул. Батарейная, 8' },
      { address: 'Сочи, ул. Несебрская, 1А' },
      { address: 'Тюмень, ул. Республики, 245' }
    ]
  },
  'FIZКУЛЬТУРА': {
    branches: [
      { address: 'Самара, ул. Врубеля, 11' },
      { address: 'Самара, ул. Ново-Садовая, 160М' },
      { address: 'Самара, ул. Гагарина, 99' },
      { address: 'Самара, ул. Казачья, 36' }
    ]
  },
  'X-Fit': {
    branches: [
      { address: 'Москва, ул. Авиамоторная, д. 10, к.1' },
      { address: 'Москва, ул. Угличская, д. 13, корп. 1' },
      { address: 'Москва, ул. Горчакова, д.21' },
      { address: 'Москва, б-р Братьев Весниных, д.1' },
      { address: 'Москва, ул. Малая Дмитровка, д. 6' },
      { address: 'Москва, ул. Братиславская, д. 30' },
      { address: 'Москва, Ленинградский пр-т, д. 31А, стр.1' },
      { address: 'Санкт-Петербург, пр-кт Юрия Гагарина, д.71' },
      { address: 'Санкт-Петербург, ул. Кораблестроителей, д. 32/2' },
      { address: 'Казань, пр-кт Ямашева, д. 115а' },
      { address: 'Волгоград, ул. Маршала Рокоссовского, д. 62' },
      { address: 'Пермь, ул. Газеты Звезда, д. 46А' },
      { address: 'Екатеринбург, ул. Ткачей, д. 17' },
      { address: 'Краснодар, ул. Стасова, д. 182' },
      { address: 'Воронеж, ул. Карла Маркса, д. 67/1' }
    ]
  },
  'SMSTRETCHING': {
    branches: [
      { address: 'Москва, Спиридоньевский пер., 9' },
      { address: 'Москва, ул. Лужники, 24 стр 21' },
      { address: 'Москва, ул. Мясницкая, 24/7 стр 1' },
      { address: 'Москва, Холодильный пер., 3 к 1 стр 3' },
      { address: 'Москва, ул. Тимура Фрунзе, 16 стр 3' },
      { address: 'Москва, ул. Гиляровского, 39 стр 1' },
      { address: 'Санкт-Петербург, ул. Кременчугская, 19 к 3' },
      { address: 'Краснодар, ул. Новокузнечная, 89' }
    ]
  },
  'Спортлайф': {
    branches: [
      { address: 'Санкт-Петербург, Аптекарский проспект, 16' },
      { address: 'Санкт-Петербург, Байконурская ул., 14-А' },
      { address: 'Санкт-Петербург, Балканская площадь, 5' },
      { address: 'Санкт-Петербург, Обводный канал, 118' },
      { address: 'Санкт-Петербург, ул. Заневский, 71' },
      { address: 'Санкт-Петербург, Лиговский проспект, 153' },
      { address: 'Санкт-Петербург, ул. Маршала Захарова, 14' },
      { address: 'Санкт-Петербург, ул. Белы Куна, 3' },
      { address: 'Санкт-Петербург, ул. Савушкина, 141' },
      { address: 'Санкт-Петербург, площадь Александра Невского, 2' },
      { address: 'Санкт-Петербург, ул. Хошимина, 16' },
      { address: 'Санкт-Петербург, ул. Новорощинская, 4' }
    ]
  },
  'Fitness House': {
    branches: [
      { address: 'Санкт-Петербург, Ленинский проспект, 111 к1' },
      { address: 'Санкт-Петербург, просп. Ветеранов, 121 лит А' },
      { address: 'Санкт-Петербург, ул. Краснопутиловская, 111' },
      { address: 'Санкт-Петербург, Лиговский проспект, 153' },
      { address: 'Санкт-Петербург, ул. Маршала Захарова, 14к1' },
      { address: 'Санкт-Петербург, ул. Савушкина, 141' },
      { address: 'Санкт-Петербург, ул. Новорощинская, 4' },
      { address: 'Нижний Новгород, Московское шоссе, 129' },
      { address: 'Нижний Новгород, ул. Цветочная, 12' },
      { address: 'Ярославль, ул. Васильковая, 2 (пос. Красный Бор)' },
      { address: 'Ярославль, Дорожная ул., 6Б (пос. Нагорный)' },
      { address: 'Казань, пр-кт Ямашева, 115а' },
      { address: 'Самара, Московское шоссе, 4к4' },
      { address: 'Самара, ул. Стара Загора, 58' },
      { address: 'Самара, Южное шоссе, 5 (ТК «Амбар»)' }
    ]
  },
  'DDX': {
    branches: [
      { address: 'Москва, Ходынский бульвар, 4, ТЦ «Авиапарк», этаж 3' },
      { address: 'Москва, Страстной бульвар, 10с1' },
      { address: 'Москва, Большой Овчинниковский пер., 16, ТЦ «Аркадия», этаж 3' },
      { address: 'Москва, ул. Новый Арбат, 11с1, ТЦ «Новоарбатский», этаж -2' },
      { address: 'Москва, ул. Поляны, 8, ТЦ «ВиВа», этаж 2' },
      { address: 'Москва, Чонгарский бульвар, 7, ТЦ «Ангара», этаж 2' },
      { address: 'Москва, ш. Энтузиастов, 12 к.2, ТЦ «Город», 4 этаж' },
      { address: 'Санкт-Петербург, Лиговский проспект, 30А, ТРЦ «Галерея», этаж 5' },
      { address: 'Санкт-Петербург, Коломяжский проспект, 17к2, ТРК «Сити Молл», этаж 4' },
      { address: 'Самара, ул. Дыбенко 30, ТЦ «Космопорт», этаж 2' },
      { address: 'Самара, Московское шоссе, 205, ТРЦ «Эль Рио», этаж 3' },
      { address: 'Казань, ул. Кулахметова, 28, ТЦ «МОКИ», 3 этаж' },
      { address: 'Казань, ул. Николая Ершова, 62, МФКЦ АРТ, этаж 2' },
      { address: 'Волгоград, Бульвар 30-летия Победы, 21, ТРЦ «Парк Хаус»' },
      { address: 'Екатеринбург, ул. Репина, 94, ТЦ «Радуга Парк»' }
    ]
  }
};

const cafes = {
  'Дринкит': {
    branches: [
      { address: 'Москва, Стремянный пер., 23/19' },
      { address: 'Москва, Новокузнецкая ул., 4/12с1' },
      { address: 'Москва, Большой Овчинниковский пер., 16' },
      { address: 'Москва, ул. Шаболовка, 24' },
      { address: 'Москва, ул. Ленинская Слобода, 26, стр. 5' },
      { address: 'Самара, ул. Ленинградская, 29' },
      { address: 'Самара, Московское ш., 41' }
    ]
  },
  'Корж': {
    branches: [
      { address: 'Самара, Куйбышева, 103' },
      { address: 'Самара, Революционная, 101В' },
      { address: 'Самара, 9 просека 5-я малая линия, 3б' },
      { address: 'Самара, Льва Толстого, 30Б' },
      { address: 'Самара, Самарская, 270' },
      { address: 'Самара, Дачная, 2к2' },
      { address: 'Самара, Ульяновская, 19' },
      { address: 'Самара, Ново-Садовая, 106б' }
    ]
  },
  'Skuratov': {
    branches: [
      { address: 'Москва, Верхняя Радищевская ул., 19/3с2, этаж 1' },
      { address: 'Москва, Калашный пер., 5' },
      { address: 'Москва, Мясницкая ул., 13, стр. 2' },
      { address: 'Москва, Большая Садовая ул., 14, стр. 10' },
      { address: 'Москва, Большой Овчинниковский пер., 16, ТЦ «Аркадия»' },
      { address: 'Москва, Столешников пер., 11' },
      { address: 'Москва, ул. Александра Невского, 1' },
      { address: 'Москва, Нижняя Красносельская ул., 35, стр. 49' },
      { address: 'Москва, просп. Мира, 26, стр. 1' },
      { address: 'Самара, Самарская, 190' },
      { address: 'Самара, Молодогвардейская, 80' },
      { address: 'Самара, Максима Горького, 129' },
      { address: 'Самара, Красноармейская, 133' },
      { address: 'Самара, Первомайская, 29' },
      { address: 'Самара, Куйбышева, 68/70' }
    ]
  },
  'Кофемания': {
    branches: [
      { address: 'Москва, Садовническая ул., 82, стр. 2, БЦ Аврора Бизнес Парк' },
      { address: 'Москва, Большая Никитская ул., 13' },
      { address: 'Москва, Малый Черкасский пер., 2' },
      { address: 'Москва, 1-я Тверская-Ямская ул., 21' },
      { address: 'Москва, Красная площадь, 3, ГУМ, этаж 2' }
    ]
  },
  'Surf Coffee': {
    branches: [
      { address: 'Москва, ул. Большая Якиманка, 50' },
      { address: 'Москва, Кожевническая ул., 1, стр. 1' },
      { address: 'Москва, Стремянный пер., 2' },
      { address: 'Москва, ул. Солянка, 1/2с1' },
      { address: 'Москва, Холодильный пер., 3, подъезд 2' },
      { address: 'Москва, ул. Вавилова, 4' },
      { address: 'Москва, Дубининская ул., 59А, Корпус Марлон' },
      { address: 'Москва, Таганская ул., 1/2с2' },
      { address: 'Москва, ул. Покровка, 4, стр. 1' },
      { address: 'Москва, ул. Покровка, 31, стр. 1' },
      { address: 'Москва, Бауманская ул., 33/2с1, этаж цокольный' },
      { address: 'Москва, Огородный пр., 16/1с3' },
      { address: 'Москва, просп. Андропова, 27, этаж 1' },
      { address: 'Москва, Тверская ул., 25/12, этаж 1' },
      { address: 'Москва, Долгоруковская ул., 5' },
      { address: 'Москва, Пушечная ул., 7/5с2' },
      { address: 'Москва, Складочная ул., 1, стр. 38' },
      { address: 'Москва, ул. Бутырский Вал, 4' },
      { address: 'Москва, Новодмитровская ул., 1, стр. 12' },
      { address: 'Москва, Большая Новодмитровская ул., 36, стр. 8, подъезд 3' }
    ]
  },
  'Даблби': {
    branches: [
      { address: 'Москва, ул. Тимура Фрунзе, 11, стр. 33' },
      { address: 'Москва, Большой Толмачёвский пер., 4, стр. 1, этаж 1' },
      { address: 'Москва, ул. Коровий Вал, 5, БЦ Оазис' },
      { address: 'Москва, Павелецкая площадь' },
      { address: 'Москва, 1-я ул. Ямского Поля, 1, корп. 1' },
      { address: 'Москва, 4-я Тверская-Ямская ул., 27, Маяковская' },
      { address: 'Москва, ул. Арбат, 10, подъезд 1' },
      { address: 'Москва, Страстной бул., 10, стр. 1, этаж 1' },
      { address: 'Москва, Оболенский пер., 9, корп. 1, этаж 1' },
      { address: 'Москва, Проектируемый пр. № 4062, 6, стр. 16' },
      { address: 'Москва, Большой Патриарший пер., 8, стр. 1, Пушкинская' },
      { address: 'Москва, Дмитровский пр., 1' },
      { address: 'Москва, просп. Мира, 26, стр. 1' },
      { address: 'Москва, Лазоревый пр., 1А, корп. 2, подъезд 1' }
    ]
  },
  'Green House': {
    branches: [
      { address: 'Москва, Огородный проезд, 16/1с4 (БЦ Останкино)' },
      { address: 'Домодедово, ЖК Домодедово Парк, ул. Творчества 1к1' },
      { address: 'Новосибирск, Красный проспект, 174' },
      { address: 'Новосибирск, ул. Фрунзе, 238, ТЦ «Сибирский Молл»' },
      { address: 'Новосибирск, ул. Советская, 54' },
      { address: 'Новосибирск, ул. Дуси Ковальчук, 89' },
      { address: 'Новосибирск, Красный Проспект, 325 (ЖК «INFINITY»)' },
      { address: 'Новосибирск, ул. Титова, 22А' },
      { address: 'Барнаул, ул. Ленина, 64 (Помещение 1Н)' },
      { address: 'Томск, Проспект Кирова, 39' }
    ]
  },
  'Stars Coffee': {
    branches: [
      { address: 'Москва, ул. Арбат, 19, стр. 1' },
      { address: 'Москва, Тверская ул., 8, корп. 1, стр. 5' },
      { address: 'Москва, ул. Новый Арбат, 11, стр. 1' },
      { address: 'Москва, Ходынский бульвар, 4, ТЦ АвиаПарк, 2 этаж' },
      { address: 'Москва, ул. Гашека, 6' },
      { address: 'Санкт-Петербург, пр. Лиговский, 30А' },
      { address: 'Санкт-Петербург, Полюстровский пр., д.84А' },
      { address: 'Санкт-Петербург, пр. Космонавтов, д.14А' },
      { address: 'Санкт-Петербург, ул. Александровский парк, д. 4/3' },
      { address: 'Самара, ул. Дыбенко, 30 (ТЦ Космопорт)' },
      { address: 'Самара, 24км Московского шоссе, 5 (ТРЦ МЕГА Самара)' },
      { address: 'Нижний Новгород, Родионова 187Б (ТРЦ)' },
      { address: 'Пермь, ул. Петропавловская 57' }
    ]
  },
  'Cofix': {
    branches: [
      { address: 'Москва, Никольская ул., 11-13с3' },
      { address: 'Москва, Манежная площадь, 1, стр. 2, этаж -3' },
      { address: 'Москва, ул. Арбат, 9 ст1' },
      { address: 'Москва, Тверская ул., 4' },
      { address: 'Москва, Зубовский бульвар, 17' },
      { address: 'Москва, Павелецкая площадь, 3 (ТРЦ Павелецкая Плаза)' },
      { address: 'Москва, Мясницкая ул., 30/1/2 ст2' },
      { address: 'Санкт-Петербург, Набережная канала Грибоедова, 18-20' },
      { address: 'Санкт-Петербург, Невский проспект, 81' },
      { address: 'Санкт-Петербург, Невский проспект, 85 (Московский ж/д вокзал)' },
      { address: 'Санкт-Петербург, 7-я линия В.О., 40' },
      { address: 'Казань, ул. Баумана, 76' },
      { address: 'Казань, проспект Победы, 141 (ТЦ Мега)' },
      { address: 'Сочи, ул. Новая Заря, 7' },
      { address: 'Сочи, ул. Просвещения, 98/1' }
    ]
  }
};

// Список локаций для выбранной сети
const selectedNetworkBranches = computed(() => {
  if (!form.direction || !form.selectedNetwork) return [];
  const source = form.direction === 'fitness' ? fitness : cafes;
  return source[form.selectedNetwork]?.branches || [];
});

// computed для блокировки кнопки "Начать"
const isLocationStepComplete = computed(() =>
  !!form.direction && !!form.selectedNetwork && !!form.selectedBranch
);

// ====== Подсказки для двух направлений ======
const baseSuggestions = {
  food: {
    emotions: {
  male: ['расстроен', 'разочарован', 'доволен', 'удивлён', 'недоволен', 'возмущён', 'восхищён', 'благодарен'],
  female: ['расстроена', 'разочарована', 'довольна', 'удивлена', 'недовольна', 'возмущена', 'восхищена', 'благодарна'],
  initial: ['довольна', 'восхищена', 'благодарна', 'удивлена', 'расстроена', 'разочарована', 'недовольна', 'возмущена', 'доволен', 'восхищён', 'благодарен', 'удивлён', 'расстроен', 'разочарован', 'недоволен', 'возмущён'],

  'доволен': ['качеством кофе', 'скоростью обслуживания', 'вежливостью персонала', 'атмосферой заведения', 'чистотой помещения'],
  'восхищён': ['мастерством бариста', 'качеством десертов', 'дизайном интерьера', 'музыкальным сопровождением', 'ароматом кофе'],
  'благодарен': ['за внимание к деталям', 'за решение проблемы', 'за рекомендацию напитка', 'за уютную обстановку', 'за профессионализм'],
  'удивлён': ['таким сервисом', 'проблемами', 'невниманием', 'беспорядком', 'отношением'],
  'расстроен': ['долго ждал', 'грязная посуда', 'холодный кофе', 'грубый персонал', 'забыли заказ'],
  'разочарован': ['качеством', 'сервисом', 'ожиданиями', 'атмосферой', 'чистотой'],
  'недоволен': ['обслуживанием', 'очередью', 'ошибкой в заказе', 'температурой блюд', 'упаковкой'],
  'возмущён': ['антисанитарией', 'хамством', 'обманом', 'некачественной едой', 'инородными предметами'],

  'довольна': ['качеством кофе', 'скоростью обслуживания', 'вежливостью персонала', 'атмосферой заведения', 'чистотой помещения'],
  'восхищена': ['мастерством бариста', 'качеством десертов', 'дизайном интерьера', 'музыкальным сопровождением', 'ароматом кофе'],
  'благодарна': ['за внимание к деталям', 'за решение проблемы', 'за рекомендацию напитка', 'за уютную обстановку', 'за профессионализм'],
  'удивлена': ['таким сервисом', 'проблемами', 'невниманием', 'беспорядком', 'отношением'],
  'расстроена': ['долго ждала', 'грязная посуда', 'холодный кофе', 'грубый персонал', 'забыли заказ'],
  'разочарована': ['качеством', 'сервисом', 'ожиданиями', 'атмосферой', 'чистотой'],
  'недовольна': ['обслуживанием', 'очередью', 'ошибкой в заказе', 'температурой блюд', 'упаковкой'],
  'возмущена': ['антисанитарией', 'хамством', 'обманом', 'некачественной едой', 'инородными предметами'],

  // Гендерно-нейтральные (поддержка для обоих родов — вложенные причины):
  'долго ждал': ['20 минут', '30 минут', 'более часа', 'без объяснений', 'видя пустую кофейню'],
  'долго ждала': ['20 минут', '30 минут', 'более часа', 'без объяснений', 'видя пустую кофейню'],
  'грязная посуда': ['следы помады', 'остатки еды', 'жирные пятна', 'засохший кофе', 'странный запах'],
  'холодный кофе': ['едва теплый', 'совсем остыл', 'подали холодным', 'температура комнатная'],
  'грубый персонал': ['не поздоровались', 'хамили', 'игнорировали', 'были раздражены', 'повысили голос'],
  'забыли заказ': ['через 40 минут', 'не записали', 'потеряли чек', 'не передали на кухню'],
  'качеством': ['хуже чем обычно', 'не соответствует цене', 'испортилось за месяц', 'как в фастфуде', 'совсем не то'],
  'сервисом': ['медленный', 'невнимательный', 'равнодушный', 'непрофессиональный', 'хаотичный'],
  'ожиданиями': ['по отзывам лучше', 'раньше было вкуснее', 'не оправдал репутацию'],
  'атмосферой': ['шумно и грязно', 'неуютно', 'холодно', 'плохая музыка', 'неприятные запахи'],
  'чистотой': ['грязные столы', 'липкий пол', 'немытая посуда', 'пыль везде', 'антисанитария'],
  'обслуживанием': ['долгое ожидание', 'путаница в заказах', 'невежливость', 'игнорирование', 'ошибки кассира'],
  'очередью': ['не двигалась', 'час ожидания', 'нет системы', 'хаос', 'всех пропускают'],
  'ошибкой в заказе': ['не тот напиток', 'забыли позицию', 'неправильный размер', 'другой сироп', 'перепутали'],
  'температурой блюд': ['холодные', 'остывшие', 'чуть теплые', 'не разогрели', 'ледяные'],
  'упаковкой': ['протекающие крышки', 'слабые пакеты', 'разорвалась', 'неудобная', 'грязная'],
  'антисанитарией': ['грязные руки', 'упал и подали', 'на полу готовят', 'мухи', 'тараканы'],
  'хамством': ['нагрубили', 'оскорбили', 'накричали', 'показали характер', 'послали'],
  'обманом': ['не тот объем', 'обвесили', 'скрыли стоимость', 'навязали', 'обсчитали'],
  'некачественной едой': ['испорченная', 'несвежая', 'странный вкус', 'горькая', 'кислая'],
  'инородными предметами': ['волосы в еде', 'пластик в круассане', 'проволока', 'нитки', 'жук'],
  'таким сервисом': ['впервые такое', 'шокирован', 'не верю', 'ужасно'],
  'проблемами': ['постоянные', 'одни и те же', 'системные', 'не решаются', 'игнорируются'],
  'невниманием': ['не слушают', 'не реагируют', 'все равно', 'безразличие', 'не заботятся'],
  'беспорядком': ['хаос', 'непорядок', 'бардак', 'неорганизованность', 'суета'],
  'отношением': ['пренебрежение', 'высокомерие', 'равнодушие', 'неуважение', 'хамство'],
  'качеством кофе': ['идеальная температура', 'богатый аромат', 'сбалансированный вкус', 'красивая подача', 'свежая обжарка'],
  'скоростью обслуживания': ['заказ за 3 минуты', 'мгновенная подача', 'нет очередей', 'четкая организация', 'быстрая оплата'],
  'вежливостью персонала': ['улыбчивые сотрудники', 'внимательное отношение', 'помощь в выборе', 'вежливое общение', 'профессионализм'],
  'атмосферой заведения': ['уютный интерьер', 'приятная музыка', 'комфортные места', 'теплое освещение', 'спокойная обстановка'],
  'чистотой помещения': ['сверкающая посуда', 'чистые столы', 'порядок везде', 'свежий воздух', 'аккуратность'],
  'мастерством бариста': ['красивый латте-арт', 'точные пропорции', 'умение готовить', 'знание рецептов', 'творческий подход'],
  'качеством десертов': ['свежая выпечка', 'идеальный вкус', 'красивая презентация', 'домашний вкус', 'качественные ингредиенты'],
  'дизайном интерьера': ['стильное оформление', 'продуманные детали', 'современный дизайн', 'удобная мебель', 'гармоничные цвета'],
  'музыкальным сопровождением': ['приятная фоновая музыка', 'подходящий плейлист', 'комфортная громкость', 'качественный звук', 'атмосферные композиции'],
  'ароматом кофе': ['насыщенный запах', 'свежемолотые зерна', 'манящий аромат', 'качественные сорта', 'профессиональная обжарка'],
  'за внимание к деталям': ['запомнили предпочтения', 'учли пожелания', 'индивидуальный подход', 'забота о госте', 'персональный сервис'],
  'за решение проблемы': ['быстро исправили ошибку', 'заменили напиток', 'извинились за неудобство', 'предложили компенсацию', 'проявили понимание'],
  'за рекомендацию напитка': ['подобрали по вкусу', 'посоветовали новинку', 'объяснили особенности', 'учли предпочтения', 'помогли выбрать'],
  'за уютную обстановку': ['домашняя атмосфера', 'теплый прием', 'комфортные условия', 'располагающая обстановка', 'приятное времяпрепровождение'],
  'за профессионализм': ['высокий уровень сервиса', 'компетентность', 'качественная работа', 'внимание к деталям', 'превосходное обслуживание']
    },
    facts: {
      initial: ['ожидание', 'ошибка в заказе', 'качество блюд', 'чистота', 'персонал'],
    'ожидание': ['20 минут', '30 минут', 'более часа', 'забыли заказ', 'очередь не двигалась'],
    'ошибка в заказе': ['не тот напиток', 'не доложили позицию', 'неправильный соус', 'перепутали объём', 'другое молоко'],
    'качество блюд': ['холодный кофе', 'невкусная еда', 'недоваренный рис', 'комочки в матче', 'чёрствая выпечка'],
    'чистота': ['грязная посуда', 'волосы в еде', 'грязная уборная', 'насекомые', 'пластик в круассане'],
    'персонал': ['грубость', 'невнимательность', 'некомпетентность', 'трогали еду руками', 'не извинились'],
    '20 минут': ['засекала по часам', 'спросила у соседнего стола', 'заказала в 14:30, получила в 14:50', 'долгое ожидание для простого заказа', 'других обслужили быстрее'],
    '30 минут': ['полчаса точно', 'с 15:00 до 15:30', 'дважды подходила узнать', 'время на телефоне показало', 'успела прочитать новости'],
    'более часа': ['час и 10 минут', 'полтора часа ждала', 'с 12:00 до 13:15', 'весь обед потратила', 'опоздала на встречу'],
    'забыли заказ': ['не записали', 'потеряли чек', 'не передали на кухню', 'перепутали с другим', 'готовили не то'],
    'очередь не двигалась': ['стояла полчаса', 'один кассир на всех', 'касса сломалась', 'менялись местами', 'хаос'],
    'не тот напиток': ['заказала латте, принесли капучино', 'просила без сахара, был сладкий', 'хотела большой, дали маленький', 'другой сироп добавили', 'обычное молоко вместо овсяного'],
    'не доложили позицию': ['забыли десерт', 'нет половины заказа', 'пропали сэндвичи', 'только кофе принесли', 'блинчики не было'],
    'неправильный соус': ['острый вместо сладкого', 'майонез вместо сметаны', 'кетчуп забыли', 'соус отдельно не дали'],
    'перепутали объём': ['несоответствие объема напитков', 'маленький вместо большого', 'дали меньше чем заказала', 'размер не тот', 'обманули с порцией'],
    'другое молоко': ['обычное вместо овсяного', 'соевое вместо миндального', 'с лактозой дали', 'не предупредили', 'аллергия может быть'],
    'холодный кофе': ['градусов 40-50', 'можно было пить сразу', 'не обжигал язык', 'как будто стоял долго', 'температура комнатная'],
    'невкусная еда': ['пересоленная', 'недосоленная', 'горькая', 'кислая', 'странный вкус'],
    'недоваренный рис': ['жесткий', 'сырой', 'хрустит на зубах', 'не доварили'],
    'комочки в матче': ['комочки в матче', 'не размешали', 'порошок не растворился', 'комки муки', 'неоднородная масса'],
    'чёрствая выпечка': ['как камень', 'вчерашняя', 'сухая', 'твердая', 'невозможно откусить'],
    'грязная посуда': ['на чашке помада', 'жирные разводы на тарелке', 'крошки от предыдущих гостей', 'капли кофе на блюдце', 'следы от губной помады'],
    'волосы в еде': ['черный волос в редисе', 'длинный волос в салате', 'волосы на булочке', 'в супе волос', 'противно есть'],
    'грязная уборная': ['не убирали', 'бумаги нет', 'воняет', 'лужи на полу', 'грязь везде'],
    'насекомые': ['тараканы бегают', 'муха в кофе', 'жук в салате', 'паук на стене', 'противно смотреть'],
    'пластик в круассане': ['кусочек пластика в круассане', 'твердый кусок', 'чуть не сломала зуб', 'опасно', 'могла подавиться'],
    'грубость': ['не поздоровались', 'ответили резко', 'закатили глаза', 'проигнорировали вопрос', 'были явно недовольны'],
    'невнимательность': ['не слушали', 'переспрашивали', 'отвлекались', 'забыли просьбу', 'записали неправильно'],
    'некомпетентность': ['не знали меню', 'не умели готовить', 'путались в кнопках', 'долго соображали', 'спрашивали у коллег'],
    'трогали еду руками': ['трогали трубочку грязными руками', 'лапали булочки', 'без перчаток', 'грязными руками', 'неаккуратно'],
    'не извинились': ['даже не извинились', 'было все равно', 'сделали вид что нормально', 'проигнорировали', 'сказали что так и надо'],
    },
    solutions: {
      initial: ['таймер ожидания', 'обучение персонала', 'контроль качества', 'система проверки', 'стандарты сервиса'],
    'таймер ожидания': ['визуальный контроль бариста', 'с номерами заказов', 'видимый гостям', 'контроль времени', 'сигналы на баре', 'обратная связь от гостей'],
    'обучение персонала': ['по сервису', 'по санитарии', 'по качеству', 'по коммуникации', 'регулярные тренинги'],
    'контроль качества': ['проверка блюд', 'температурный контроль', 'свежесть продуктов', 'упаковка', 'дегустация'],
    'система проверки': ['чек-лист качества', 'двойная проверка', 'контроль чистоты', 'стандарты подачи', 'фото блюд'],
    'стандарты сервиса': ['вежливость', 'скорость', 'точность', 'чистота', 'профессионализм'],
    'визуальный контроль бариста': ['песочные часы на стойке', 'отчёты по среднему времени заказа', 'замеры скорости обслуживания менеджером', 'сравнение с нормой', 'обсуждение на пятиминутке'],
    'с номерами заказов': ['в мобильном приложении', 'на чеке QR-код', 'на чеке номер заказа'],
    'видимый гостям': ['в мобильном приложении', 'на чеке QR-код', 'на чеке номер заказа'],
    'контроль времени': ['стандарт 7 минут', 'красная зона после 10 мин', 'автоотсчёт от момента пробития чека'],
    'сигналы на баре': ['цветовые индикаторы готовности', 'звуковой таймер для бариста'],
    'обратная связь от гостей': ['опрос о времени ожидания', 'кнопка "долго жду" в приложении', 'комментарий в чеке QR-кодом'],
    'по сервису': ['тренинги вежливости', 'ролевые игры', 'работа с жалобами', 'стандарты общения', 'мотивация персонала'],
    'по санитарии': ['мытье посуды', 'уборка столов', 'проверка чистоты', 'гигиена рук', 'контроль температуры'],
    'по качеству': ['дегустация напитков', 'проверка ингредиентов', 'температура подачи', 'внешний вид блюд', 'сроки годности'],
    'по коммуникации': ['активное слушание', 'решение конфликтов', 'извинения и компенсации', 'позитивное общение', 'работа с негативом'],
    'регулярные тренинги': ['раз в месяц', 'новых сотрудников', 'переаттестация', 'мастер-классы', 'обмен опытом'],
    'проверка блюд': ['перед подачей', 'температура напитков', 'внешний вид', 'соответствие заказу', 'свежесть ингредиентов'],
    'температурный контроль': ['термометр для кофе', '85-90 градусов', 'горячие блюда', 'холодные напитки', 'контроль каждый час'],
    'свежесть продуктов': ['ежедневная поставка', 'сроки годности', 'ротация товара', 'маркировка даты', 'утилизация просрочки'],
    'упаковка': ['герметичные крышки', 'качественные пакеты', 'стаканы не протекают', 'салфетки в комплекте', 'удобная переноска'],
    'дегустация': ['каждая партия', 'новые рецепты', 'мнение гостей', 'тестирование вкуса', 'корректировка рецептур'],
    'чек-лист качества': ['для каждого заказа', 'проверка температуры', 'чистота посуды', 'правильность состава', 'время подачи'],
    'двойная проверка': ['готовящий и подающий', 'кассир и бариста', 'менеджер и персонал', 'фото готового блюда', 'подпись ответственного'],
    'контроль чистоты': ['каждый час', 'чек-лист уборки', 'дезинфекция', 'мытье рук', 'чистая форма'],
    'стандарты подачи': ['правильная посуда', 'украшение блюд', 'салфетки и приборы', 'температура подачи', 'презентация'],
    'фото блюд': ['перед подачей', 'контроль качества', 'обучение персонала', 'соцсети', 'архив образцов'],
    'вежливость': ['приветствие с улыбкой', 'благодарность гостю', 'извинения за ошибки', 'помощь в выборе', 'прощание'],
    'скорость': ['стандарт 10 минут', 'быстрое принятие заказа', 'оперативная готовка', 'мгновенная подача', 'ускоренная оплата'],
    'точность': ['записывать заказы', 'повторять вслух', 'проверять чек', 'уточнять детали', 'контроль состава'],
    'чистота': ['мытье рук каждые 30 мин', 'чистая форма', 'дезинфекция поверхностей', 'порядок на рабочем месте', 'свежая посуда'],
    'профессионализм': ['знание меню', 'умение готовить', 'решение проблем', 'работа в команде', 'развитие навыков'],
    }
  },
  fitness: {
  emotions: {
    male: ['доволен', 'восхищён', 'благодарен', 'спокоен', 'удивлён', 'расстроен', 'разочарован', 'недоволен', 'возмущён'],
    female: ['довольна', 'восхищена', 'благодарна', 'спокойна', 'удивлена', 'расстроена', 'разочарована', 'недовольна', 'возмущена'],
    initial: ['довольна', 'восхищена', 'благодарна', 'спокойна', 'удивлена', 'расстроена', 'разочарована', 'недовольна', 'возмущена', 'доволен', 'восхищён', 'благодарен', 'спокоен', 'удивлён', 'расстроен', 'разочарован', 'недоволен', 'возмущён'],

    'доволен': ['чистотой клуба', 'отзывчивостью персонала', 'качеством оборудования', 'атмосферой пространства', 'гибким расписанием'],
    'восхищён': ['новыми тренажёрами', 'командой тренеров', 'технологиями и сервисом', 'дизайном клуба', 'атмосферой зала'],
    'благодарен': ['за решение проблемы', 'за индивидуальный подход', 'за поддержку новичков', 'за внимательное отношение', 'за рекомендации по тренировкам'],
    'спокоен': ['обычная тренировка', 'стандартный сервис', 'нет ярких впечатлений', 'привычная атмосфера', 'нет проблем'],
    'удивлён': ['новыми услугами', 'изменениями в расписании', 'появлением новых тренажёров', 'нестандартным подходом тренера', 'быстрой реакцией персонала'],
    'расстроен': ['переполненностью зала', 'грубостью тренера', 'грязными раздевалками', 'ощущением неловкости', 'затруднённым доступом к оборудованию'],
    'разочарован': ['подходом персонала', 'ожиданиями от клуба', 'уровнем тренировок', 'расписанием занятий', 'стоимостью абонемента'],
    'недоволен': ['оборудованием', 'очередью на тренажёры', 'ошибкой в абонементе', 'температурой в зале', 'чистотой душевых'],
    'возмущён': ['антисанитарией', 'хамством администратора', 'обманом в оплате', 'опасными тренажёрами', 'токсичной атмосферой'],

    'довольна': ['чистотой клуба', 'отзывчивостью персонала', 'качеством оборудования', 'атмосферой пространства', 'гибким расписанием'],
    'восхищена': ['новыми тренажёрами', 'командой тренеров', 'технологиями и сервисом', 'дизайном клуба', 'атмосферой зала'],
    'благодарна': ['за решение проблемы', 'за индивидуальный подход', 'за поддержку новичков', 'за внимательное отношение', 'за рекомендации по тренировкам'],
    'спокойна': ['обычная тренировка', 'стандартный сервис', 'нет ярких впечатлений', 'привычная атмосфера', 'нет проблем'],
    'удивлена': ['новыми услугами', 'изменениями в расписании', 'появлением новых тренажёров', 'нестандартным подходом тренера', 'быстрой реакцией персонала'],
    'расстроена': ['переполненностью зала', 'грубостью тренера', 'грязными раздевалками', 'ощущением неловкости', 'затруднённым доступом к оборудованию'],
    'разочарована': ['подходом персонала', 'ожиданиями от клуба', 'уровнем тренировок', 'расписанием занятий', 'стоимостью абонемента'],
    'недовольна': ['оборудованием', 'очередью на тренажёры', 'ошибкой в абонементе', 'температурой в зале', 'чистотой душевых'],
    'возмущена': ['антисанитарией', 'хамством администратора', 'обманом в оплате', 'опасными тренажёрами', 'токсичной атмосферой'],

    // Гендерно-нейтральные (поддержка для обоих родов — вложенные причины):
    'чистотой клуба': ['раздевалка пахнет свежо', 'уборка 2 раза в день', 'нет запаха', 'чистые зеркала', 'чистый душ'],
    'раздевалка пахнет свежо': ['вентиляция работает', 'ароматизаторы сменяют запах', 'тест на запах корректорами', 'чистые полки', 'запах свежести после уборки'],
    'уборка 2 раза в день': ['график уборки опубликован', 'отметка клинера в приложении', 'фотоотчёт после уборки', 'служба контроля проверяет факт', 'отличие до и после чистки'],
    'нет запаха': ['смена фильтров каждый месяц', 'нет запаха пота', 'регулярная проверка воздуха', 'аромадиффузор включён ежедневно', 'очистка вентиляции'],
    'чистые зеркала': ['микрофибра используется', 'нет пятен после группы', 'проверка сотрудником после каждой тренировки', 'отметка клиента в системе', 'отполированы уголки'],
    'чистый душ': ['глубокая уборка раз в день', 'новые шторки каждый месяц', 'предоставлены гель и шампунь', 'отсутствие плесени', 'есть коврики после уборки'],
    'отзывчивостью персонала': ['помогли с тренажёром', 'ответили в чате', 'запомнили имя', 'мотивируют новичков', 'решили спор быстро'],
    'помогли с тренажёром': ['персональный инструктаж', 'показали все режимы', 'есть видео-инструкция', 'объяснили ошибки и силы', 'настроили под твою цель'],
    'ответили в чате': ['оператор отвечает не позднее 10 минут', 'чат открыт с 08:00 до 22:00', 'есть база знаний', 'персональные советы в чате', 'сохранена история переписки'],
    'запомнили имя': ['обращаются по имени при входе', 'поздравляют с днем рождения', 'отмечают прогресс в сообщениях', 'учёт ваших успехов ведёт тренер', 'индивидуальная рассылка уведомлений'],
    'мотивируют новичков': ['приветственная тренировка для новых клиентов', 'подарок за первую тренировку', 'доска успеха новичков', 'мотивационное видео после первой недели', 'режим “мотиватор” в приложении'],
    'решили спор быстро': ['оперативная реакция админа', 'в течение часа спор закрывался', 'применили компенсацию', 'заявка на поддержку не задержана', 'результат внесён в историю клиента'],
    'качеством оборудования': ['новые тренажёры', 'датчики работают', 'удобная посадка', 'нет поломок', 'регулярно обслуживается'],
    'новые тренажёры': ['модель 2025 года', 'сертификат производителя', 'отзывы клиентов подтверждены', 'есть гарантия 2 года', 'интеграция с мобильным приложением'],
    'датчики работают': ['подключение к телефону без ошибок', 'замер пульса точный', 'сохраняется история тренировок', 'работают все функции', 'отображение на экране тренажёра'],
    'удобная посадка': ['регулируется под рост', 'есть инструкция для разных пользователей', 'поддержка поясницы', 'плавная настройка кресла', 'анатомическая форма'],
    'нет поломок': ['служба сервиса проверяет каждые выходные', 'ремонт занимает не более 1 дня', 'рассылка об исправлениях', 'отзыв о поломке отмечен', 'нет повторяющихся проблем'],
    'регулярно обслуживается': ['замена расходников раз в месяц', 'осмотр сервисным инженером', 'история ТО сохраняется', 'рекомендации по уходу видны в профиле клиента', 'все оборудование сертифицировано'],
    'атмосферой пространства': ['музыка приятная', 'нет резкого света', 'много зон отдыха', 'пол в хорошем состоянии', 'уютная обстановка'],
    'музыка приятная': ['выбор стиля есть в приложении', 'разные зоны – разные треки', 'нет орущих динамиков', 'музыка снижает тревожность', 'выбор звука для групповой тренировки'],
    'нет резкого света': ['LED-освещение с регулировкой', 'дневной свет через окна', 'без мигания ламп', 'зональное управление', 'естественный свет в раздевалке'],
    'много зон отдыха': ['мягкие диваны', 'столы с розетками', 'бар с водой и снеками', 'Wi-Fi стабильный', 'можно отдохнуть в лобби'],
    'пол в хорошем состоянии': ['антискользящее покрытие', 'нет луж и пролитий', 'регулярная мойка', 'запасные коврики', 'качественная плитка'],
    'уютная обстановка': ['живые растения', 'теплые цвета', 'декор по сезону', 'фото-зона', 'приглушённый звук'],
    'гибким расписанием': ['есть ночные группы', 'удобная запись', 'режим выходного дня', 'гибкая замена групп', 'онлайн-план занятий'],
    'есть ночные группы': ['тренировки в 21:00 и позже', 'расписание восточного тренинга', 'очный тренер ночью', 'клиенты отдыхают после работы', 'охрана и освещение ночью'],
    'удобная запись': ['календарь в приложении', 'смс-напоминание', 'возможность отмены без штрафа', 'история всех тренировок', 'гибкая система замены'],
    'режим выходного дня': ['занятия в субботу и воскресенье', 'особые группы воскресенья', 'тариф выходного дня ниже', 'регистрация утром до 7:00', 'вечерние мастер-классы'],
    'гибкая замена групп': ['резерв по телефону', 'быстрая замена в приложении', 'автоматический поиск свободного времени', 'возможность приглашать друзей', 'изменение расписания без штрафа'],
    'онлайн-план занятий': ['фильтрация по времени', 'автоматический подбор группы', 'мгновенное подтверждение', 'видна загруженность', 'отправка напоминаний'],
    'новыми тренажёрами': ['премиум-бренды', 'интерактивные функции', 'идеальное состояние', 'выбор для всех уровней'],
    'командой тренеров': ['высокий профессионализм', 'индивидуальный подход', 'мотивация и поддержка', 'организация мастер-классов'],
    'технологиями и сервисом': ['умные зеркала', 'онлайн расписание', 'приложение клуба', 'система безопасности'],
    'дизайном клуба': ['современный стиль', 'эргономика пространства', 'много света', 'уютные лаунж-зоны'],
    'атмосферой зала': ['вдохновляющая музыка', 'приветливые клиенты', 'нет очередей', 'общая энергия'],
    'за решение проблемы': ['вернули деньги', 'предоставили бесплатное занятие', 'назначили нового тренера', 'извинения от руководства', 'компенсация на абонемент'],
    'вернули деньги': ['пополнили баланс', 'чек на телефон', 'снятие с карты', 'отметка в профиле клиента', 'компенсация бонусами'],
    'предоставили бесплатное занятие': ['записан на ближайшую группу', 'уведомление персоналу', 'отметка "бесплатно" в расписании', 'контроль через приложение', 'приглашение друга'],
    'за индивидуальный подход': ['создали личный план', 'подобрали тренера по уровню', 'учли ограничения по здоровью', 'изменили группу', 'дали доступ к архиву программы'],
    'создали личный план': ['индивидуальная оценка', 'советы по питанию', 'регулярные корректировки', 'отчёт по результату', 'подбор упражнений по целям'],
    'подобрали тренера по уровню': ['оценка прогресса', 'тест на физическую форму', 'репостивный ответ системы', 'отзыв на сайте клуба', 'замена в течение месяца'],
    'за поддержку новичков': ['провели пробное занятие', 'экскурсия по залу', 'групповой инструктаж', 'чек-лист первых шагов', 'активная помощь на старте'],
    'провели пробное занятие': ['без оплаты', 'инструктор только для новичков', 'консультация по целям', 'материалы в приложении', 'поддержка в чате новичков'],
    'экскурсия по залу': ['показали все зоны', 'рассказали о правилах', 'знакомство с тренерами', 'демонстрация инвентаря', 'разъяснение ключевых функций'],
    'за внимательное отношение': ['администратор помнил цели', 'тренер регулярно писал напоминания', 'дарили мотивационные подарки', 'отмечали достижения', 'учитывали смену расписания'],
    'администратор помнил цели': ['личное сообщение с поздравлением', 'отметка прогресса', 'внесение корректировок', 'замечание по технике', 'индивидуальное время тренировки'],
    'тренер регулярно писал напоминания': ['смс с мотивацией', 'еженедельный отчёт', 'рассылка по результатам', 'пожелание удачи перед занятием', 'анализ слабых мест'],
    'за рекомендации по тренировкам': ['подобрали программу восстановления', 'посоветовали йогу', 'рекомендация лучшего питания', 'советы по выбору тренажёра', 'направление к врачу'],
    'подобрали программу восстановления': ['чек-лист упражнений', 'консультация по растяжке', 'материалы по РПП', 'памятка по отдыху', ' встреча с нутрициологом'],
    'посоветовали йогу': ['запись на занятие через приложение', 'инструктор с сертификатом', 'материалы для домашней практики', 'групповая поддержка', 'челлендж на месяц'],
    'обычная тренировка': ['всё прошло по расписанию', 'нагрузка стандартна', 'без изменений', 'группа знакомая', 'тренер привычный'],
    'всё прошло по расписанию': ['начали вовремя', 'без отмен', 'все пришли', 'оборудование работало', 'расписание в приложении совпало'],
    'нагрузка стандартна': ['без новых упражнений', 'уровень нагрузки прежний', 'тренер не менял план', 'группа не устала', 'результаты стабильны'],
    'стандартный сервис': ['администратор работает корректно', 'оборудование привычно', 'занятие началось в норме', 'техподдержка есть', 'проблем не возникло'],
    'администратор работает корректно': ['всё объяснил', 'разрешил вопросы', 'корректен по расписанию', 'не было задержек', 'ответил на жалобу'],
    'оборудование привычно': ['все привычные тренажёры', 'никто не жаловался', 'работают как всегда', 'нет сбоев', 'все поддержаны в чистоте'],
    'новыми услугами': ['появился массаж', 'запущена сауна', 'детский фитнес', 'коучинг по питанию', 'занятия на крыше'],
    'появился массаж': ['запись через клубное приложение', 'сертифицированный массажист', 'комплимент клиентам', 'специальная цена', 'отзыв можно оставить в клубной базе'],
    'запущена сауна': ['график в приложении', 'отдельная зона', 'раздевалка рядом', 'входит в тариф', 'доступ после тренировки'],
    'изменениями в расписании': ['добавили утро', 'расширили вечер', 'новые интенсивы вечером', 'гибкое бронирование', 'ввод выходных групп'],
    'добавили утро': ['тренировки для работающих', 'ранее открытие зала', 'кофе для участников', 'мотивация на старте дня', 'возможна отмена без штрафа'],
    'новые интенсивы вечером': ['инструктор по кардизону', 'спецгруппы под проекты клуба', 'выбор интенсивности', 'дополнительные бонусы', 'тренировки для всех классов'],
    'переполненностью зала': ['нет свободных тренажёров', 'очередь на беговую', 'толпа на ковриках', 'мешают заниматься', 'группа слишком большая'],
    'нет свободных тренажёров': ['ожидание 20 минут', 'отсутствие броней', 'тайм-слот нарушен', 'админ не регулирует', 'группы совмещены'],
    'грубостью тренера': ['грубо разговаривал', 'игнорировал форму', 'давал непрофессиональные советы', 'выделял только одного клиента', 'критиковал громко'],
    'грубо разговаривал': ['отвечал резко', 'не здоровался', 'оценивал личность', 'повышал голос', 'не комментировал успехи'],
    'грязными раздевалками': ['грязь в душе', 'разбросанные вещи', 'нет чистых ковриков', 'запах сырости', 'не выносят мусор'],
    'грязь в душе': ['нет уборки', 'скользко после воды', 'плесень на плитке', 'грязные шторки', 'нет мыла'],
    'ощущением неловкости': ['все смотрят', 'стеснение раздеться', 'нет шторок', 'нет зоны для уединения', 'другая гендерная группа'],
    'все смотрят': ['пристальные взгляды', 'комментарии', 'смех над новым клиентом', 'игнор новичков', 'нет отдельной раздевалки'],
    'затруднённым доступом к оборудованию': ['тренажёры всегда заняты', 'очередь в приложении не работает', 'нет альтернатив', 'таймеры не соблюдают', 'администратор не помогает'],
    'тренажёры всегда заняты': ['нет расписания', 'таймер не включён', 'группы перепутаны', 'нет менеджера', 'ожидание по 25 минут'],
    'подходом персонала': ['равнодушие', 'нет поддержки', 'не объяснили правила', 'невнимательный тренер', 'нет мотивации'],
    'равнодушие': ['ответ через силу', 'избегают прямого общения', 'нет инициативы', 'отсутствие приветствия', 'нет желания помочь'],
    'нет поддержки': ['не подошёл тренер', 'не помогли с программой', 'не заметили прогресс', 'отправили решать самому', 'сообщили “разберётесь”'],
    'ожиданиями от клуба': ['думала будет лучше', 'по отзывам выше', 'завышенная реклама', 'обещали дополнительные услуги', 'ожидала премиум'],
    'думала будет лучше': ['на деле хуже', 'реклама не соответствует', 'понравились отзывы, а в реальности не так', 'не оправдало ожиданий', 'обещания не выполнены'],
    'по отзывам выше': ['расходится с мнением клиентов', 'разница в уровне сервиса', 'понравился сайт, а реальность иная', 'обещали быстрый сервис', 'нет того, что было в описании'],
    'уровнем тренировок': ['монотонные упражнения', 'нет прогресса', 'нет индивидуальной работы', 'тренер не мотивирует', 'однотипные группы'],
    'монотонные упражнения': ['повторяют прошлые', 'нет новых методик', 'нет подборок под цель', 'скучный процесс', 'цикличная работа'],
    'нет прогресса': ['стоит на месте по результату', 'нет отслеживания', 'тренер не отмечает успех', 'нет анализов нагрузки', 'одни и те же ошибки'],
    'расписанием занятий': ['неудобное время', 'нет подходящей группы', 'занятия отменяют', 'группы переполнены', 'смена расписания без уведомления'],
    'неудобное время': ['нет тренировок утром', 'вечером прошло всё', 'не успеваю на группу', 'нет записи на выходные', 'проблемы с календарем'],
    'нет подходящей группы': ['группы для новичка переполнены', 'нет детского разделения', 'только одна секция', 'нет выбора времени', 'нельзя выбрать уровень'],
    'стоимостью абонемента': ['дорого', 'скрытые доплаты', 'нет возврата денег', 'штраф за отмену', 'нет разовых тарифов'],
    'дорого': ['5000 в месяц', 'нет скидки для постоянных', 'сравнение с другими клубами не в пользу', 'разовый абонемент дороже группового', 'тариф не меняется по акциям'],
    'скрытые доплаты': ['доплата за тренажёр', 'не включено занятие с тренером', 'стоимость детской комнаты отдельно', 'нет расчёта абонемента по дням', 'плата за вход в раздевалку'],
    'оборудованием': ['старое', 'часто ломается', 'нет новых моделей', 'скрипит', 'не хватает веса'],
    'старое': ['дата выпуска не обновляется', 'нет Bluetooth', 'механика изношена', 'не соответствует фото на сайте', 'ржавчина на деталях'],
    'часто ломается': ['нет запчастей', 'ожидание ремонта больше недели', 'нет сервиса на месте', 'запись на ремонт сложная', 'долго ждёшь новый тренажёр'],
    'очередью на тренажёры': ['ждать приходится постоянно', 'таймер не работает', 'группы не разграничены', 'нет календаря в приложении', 'никакой очереди нет вовсе'],
    'ждать приходится постоянно': ['по 15 минут на каждый подход', 'нет уведомлений', 'менеджер не контролирует загрузку', 'занято всегда вечером', 'скандалы между клиентами'],
    'таймер не работает': ['не обновляется автоматически', 'нет напоминания', 'администратор не считает время', 'вручную все отмечают', 'ценность таймера потеряна'],
    'ошибкой в абонементе': ['двойное списание', 'не приходит подтверждение', 'нет возврата', 'тариф заблокирован', 'нельзя внести изменения'],
    'двойное списание': ['без уведомления смс', 'автоматическое продление', 'ошибка приложения', 'нет возврата средств', 'долго ждёшь решение'],
    'не приходит подтверждение': ['молчание от клуба', 'нет чека', 'только ответ через неделю', 'админ уходит от ответа', 'неясно за что списали'],
    'температурой в зале': ['жарко', 'холодно', 'душно', 'нет регулировки вентиляции', 'сквозняки в раздевалках'],
    'жарко': ['30 градусов в кардио', 'вентилятор сломан', 'нет жалюзи', 'нет выбора температурного режима', 'админ не реагирует'],
    'холодно': ['нет обогрева', 'открыты окна', 'зимние температуры и летом', 'нет тепла в раздевалке', 'пол ледяной'],
    'чистотой душевых': ['грязная плитка', 'не хватает геля', 'вода на полу', 'нет полотенец', 'плесень'],
    'грязная плитка': ['не моют после каждой группы', 'нет чистящих средств', 'плесень в уголках', 'нет дезинфекции', 'опасно для кожи'],
    'нет полотенец': ['забывают менять', 'только бумажные', 'нет сушилки', 'приходится покупать самому', 'грубая ткань'],
    'антисанитарией': ['грязные полотенца', 'мусор в раздевалке', 'тараканы', 'грибок в душе', 'воняет'],
    'грязные полотенца': ['не стирают по графику', 'нет маркировки', 'все в одной куче', 'запах плесени', 'один на всех'],
    'мусор в раздевалке': ['не выносят после занятий', 'нет корзин в уборных', 'мешки переполнены', 'нет уборки по заявкам', 'клинеры не реагируют'],
    'хамством администратора': ['грубые ответы', 'отказали без причины', 'разговаривают на повышенных тонах', 'оскорбили', 'не объяснили отказ'],
    'грубые ответы': ['перебивают на входе', 'игнорируют вопросы', '“вам сюда нельзя”', 'шутят неуместно', 'ругаются в раздевалке'],
    'отказали без причины': ['не записали на тренировку', 'объяснений не дали', '“нет мест — ищите сами”', '“администратор не в курсе”', 'нет альтернатив'],
    'обманом в оплате': ['списали без предупреждения', 'не вернули деньги', 'навязали допы', 'скрыли штраф', 'обманули с акцией'],
    'списали без предупреждения': ['автоплатёж без согласия', 'смс не пришла', 'сняли на выходных', 'нет возврата при отмене', 'ошибка в приложении'],
    'не вернули деньги': ['отказали по заявке', 'ждать пришлось месяц', 'не дали подробностей', '“вопрос решается” неделями', 'в чате не отвечают'],
    'опасными тренажёрами': ['сломана ручка', 'нет фиксатора', 'острые края', 'риск упасть', 'болтается весь тренажёр'],
    'сломана ручка': ['маленький хват', 'немного трещит', 'нет запасной', 'не отремонтировали за неделю', 'заниматься неудобно'],
    'токсичной атмосферой': ['соревнуются в группе', 'судят по внешности', 'игнор новичков', 'критика вместо обратной связи', 'нет поддержки'],
    'соревнуются в группе': ['соревнование между новичками', 'выделяют только “звёзд”', 'клиенты конфликтуют в чате', 'нет общей мотивации', 'играют на результат'],
    'группа слишком большая': ['занимается больше 20 человек', 'сложно попасть на инвентарь', 'нет индивидуального внимания', 'длинная очередь на подход', 'шумно и тесно'],
    'мешают заниматься': ['говорят слишком громко', 'делают фото и видео', 'шутят и перебивают тренера', 'не соблюдают режим', 'нет распорядка'],
    'тайм-слот нарушен': ['люди задерживаются', 'нет контроля времени', 'новички мешают уроку', 'группа затягивается', 'занято после вашей тренировки']
  },
    facts: {
      initial: ['опоздание тренера', 'переполненный зал', 'грязь в раздевалке', 'неисправное оборудование', 'ошибка в абонементе', 'ошибка персонала', 'ощущение неловкости', 'антисанитария', 'очередь на тренажёры'],
    'опоздание тренера': ['ждала у двери', 'занятие началось позже', 'тренер не предупредил', 'без извинений', 'опоздание не впервые'],
    'ждала у двери': ['была с группой', 'время видно на экране', 'звонили на ресепшн', 'никто не открыл вовремя', 'все нервничали'],
    'была с группой': ['замечания несколькими клиентами', 'группа возмущалась', 'сообщили на стойку', 'дисциплина не поддерживается', 'дополнительные вопросы к администратору'],
    'переполненный зал': ['нет мест на кардио', 'в тренажёрке очередь', 'группы объединены', 'невозможно заниматься', 'жарко и душно'],
    'нет мест на кардио': ['ожидание больше 15 минут', 'записывались заранее, не помогло', 'человек 10 ждёт', 'нет табло доступности', 'путаются расписания'],
    'ожидание больше 15 минут': ['пропала мотивация', 'ушёл с тренировки', 'занятие началось без меня', 'получил компенсацию отказа', 'сменил зал'],
    'грязь в раздевалке': ['вода на полу', 'грязная плитка', 'плесень в углу', 'нет бумаги', 'мусор под скамейками'],
    'вода на полу': ['коврики мокрые', 'скользко и опасно', 'просят убрать — игнорируют', 'жалобы в чат проходят без реакции', 'запах сырости'],
    'коврики мокрые': ['не стираются вовремя', 'одно полотенце на всех', 'администратор знает проблему', 'уборщица приходит редко', 'ждать приходится долго'],
    'неисправное оборудование': ['трос оборвался', 'дисплей не работает', 'поломан фиксатор', 'ржавчина на креплениях', 'скрип при нагрузке'],
    'трос оборвался': ['на жиме', 'было опасно', 'нет замены', 'просил починить раньше', 'сервис не помогает'],
    'на жиме': ['сразу обратился к тренеру', 'сообщил администратору', 'заменили через день', 'попросили написать жалобу', 'один занимался дома'],
    'ошибка в абонементе': ['двойное списание', 'не активирован тариф', 'блокировка аккаунта', 'не виден период', 'не приходит подтверждение'],
    'двойное списание': ['списали через приложение и картой', 'админ пообещал вернуть', 'завели обращение', 'нет возврата более 5 дней', 'предложили скидку на следующую оплату'],
    'списали через приложение и картой': ['две разные суммы', 'прошёл платёж дважды', 'отоветили только в чате', 'разбирался сам', 'попросили номер карты для возврата'],
    'ошибка персонала': ['неправильно записали время', 'ошибка при списании', 'забыли внести занятие в расписание', 'перепутали группы', 'не учли перенос'],
    'неправильно записали время': ['новый сотрудник', 'не понял просьбу', 'клиенты ждали', 'запись удалилась', 'нет подтверждения в приложении'],
    'забыли внести занятие в расписание': ['нет уведомления', 'пропала группа', 'попросили написать лично', 'занятие не состоялось', 'вернули деньги'],
    'ощущение неловкости': ['нет шторок', 'все смотрят', 'мужчины в женской раздевалке', 'слишком тесно', 'нет отдельной зоны'],
    'нет шторок': ['вид из коридора', 'просматривалось с улицы', 'застеснялась переодеваться', 'клиенты жаловались неоднократно', 'админ пообещал исправить'],
    'все смотрят': ['комментарии новичкам', 'замечание не реагировали', 'шёпот в раздевалке', 'громкие обсуждения', 'смеялись над ошибками'],
    'антисанитария': ['грязные полотенца', 'мусор на подоконнике', 'таракан в душе', 'грязные умывальники', 'нет дезинфекции'],
    'грязные полотенца': ['сырой запах', 'одно полотенце на всех', 'не меняют уже неделю', 'нет маркировки', 'просили постирать'],
    'таракан в душе': ['замечен не впервые', 'жалобы игнорируются', 'клинер не отреагировал', 'склад рядом с душем', 'дрянь на стенах'],
    'очередь на тренажёры': ['жду на кардио больше 10 минут', 'нет SMS-уведомлений', 'таймер не срабатывает', 'админ не управляет очередью', 'все тренажёры одним списком'],
    'жду на кардио больше 10 минут': ['записывалась заранее', 'никто не выходит по времени', 'контроля нет', 'место занято чужим клиентом', 'понятие “по записи” не работает'],
    'таймер не срабатывает': ['лампочка не горит', 'нет экранов', 'никто не отслеживает', 'бесполезная функция', 'не синхронизировано с приложением'],
    },
    solutions: {
      initial: ['таймер занятия', 'электронная очередь', 'чек-лист уборки', 'система жалоб', 'перепланировка зала', 'замена тренера', 'тех. поддержка', 'перерасчёт абонемента', 'компенсация'],
    'таймер занятия': ['таймер на двери', 'таймер в приложении', 'уведомление группе', 'штраф тренеру', 'фиксация участия'],
    'таймер на двери': ['LED экран', 'обратный отсчёт', 'графика красной зоны', 'видно всем клиентам', 'автоматический старт'],
    'LED экран': ['большой и яркий', 'размер не менее 21 дюйма', 'иконка “Занято”', 'с погодозащитой', 'установлен на видной точке'],
    'обратный отсчёт': ['заранее начинается за 5 минут', 'эхо-звуковой сигнал', 'прогресс бар отображает минуты', 'фоновая подсветка для опоздавших', 'сброс по окончании занятия'],
    'таймер в приложении': ['push-уведомление', 'баннер в профиле', 'история опозданий', 'интеграция с текущим расписанием', 'автоматическая компенсация участникам'],
    'push-уведомление': ['смс за 5 минут', 'цветовое выделение', 'кнопка “я опаздываю”', 'всплывающее уведомление', 'напоминание в истории'],
    'электронная очередь': ['слоты по 30 минут', 'предварительная запись', 'статус свободен/занят', 'уведомление о доступности', 'штраф за неявку'],
    'слоты по 30 минут': ['блокировка при опоздании', 'автоматическое освобождение', 'пришло уведомление на почту', 'история всех заявок', 'контроль менеджера'],
    'предварительная запись': ['за сутки через приложение', 'смс-напоминание', 'автоматический перенос свободных слотов', 'система отмены за 1 час', 'истории доступности'],
    'чек-лист уборки': ['уборка каждые 2 часа', 'подпись уборщицы', 'фотоотчёт через приложение', 'замена грязных полотенец', 'ответственный закреплён'],
    'уборка каждые 2 часа': ['отметка в листе проверки', 'виден график уборки клиенту', 'фиксация времени', 'смена клинера', 'проверка администратором после смены'],
    'фотоотчёт через приложение': ['отправка фото клиенту', 'сравнение до/после', 'открытость истории уборки', 'рейтинг за чистоту', 'обновление базы красивых зон'],
    'система жалоб': ['QR-код на стене', 'чат с админом', 'коробка для анонимных жалоб', 'онлайн-анкета', 'обратная связь за 60 мин'],
    'QR-код на стене': ['открывает чат мгновенно', 'автоматическая ссылка на нужный зал', 'логирование клиентских обращений', 'быстрая маршрутизация вопроса', 'статус “В работе” в профиле'],
    'чат с админом': ['возможность аудио-звонка', 'ответ без очереди', 'запись всех обращений', 'оценка работы админа', 'фотозапрос для ускорения'],
    'перепланировка зала': ['разделение зон по цвету', 'отдельные входы для тренажёров и групповых', 'навигаторы для клиентов', 'стикеры на полу', 'открытые планы передвижения'],
    'разделение зон по цвету': ['понятные указатели', 'стикеры для детей и взрослых', 'отдельные прикроватные зоны', 'цветовой код доступа', 'дублируется в приложении'],
    'замена тренера': ['выбор другого тренера через приложение', 'отмена занятия без штрафа', 'перевод абонемента', 'срочный вызов замены', 'анкетирование клиентов о предпочтениях'],
    'выбор другого тренера через приложение': ['просмотр отзывов о каждом', 'рейтинг компетенций', 'свободные слоты показываются сразу', 'уведомление администратору', 'онлайн-подтверждение'],
    'тех. поддержка': ['кнопка вызова сервиса на тренажёре', 'автоматический тикет по фото', 'статус ремонта виден клиенту', 'замена неисправного в день обращения', 'напоминание о сервисе по расписанию'],
    'кнопка вызова сервиса на тренажёре': ['отправляет заявку персоналу', 'дублирует в чат зала', 'фиксирует время залипа', 'отвечают за 10 минут', 'активируется QR'],
    'перерасчёт абонемента': ['аннулирование начислений', 'расчёт компенсации бонусами', 'перевыпуск на другой срок', 'запрос подтверждения клиентом', 'смс при перерасчёте'],
    'аннулирование начислений': ['замена тарифа', 'автоматическая отмена оплаты', 'история по клиенту', 'отметка в балансе', 'отчёт клиенту'],
    'компенсация': ['бесплатное занятие', 'продление абонемента', 'бонусные баллы', 'скидка на сервис', 'повышение тарифа'],
    'бесплатное занятие': ['запись через приложение', 'уведомление от администратора', 'контроль даты', 'перенос без штрафа', 'можноUNDER подарить другому'],
    }
  }
};

const currentSuggestions = reactive({
  emotions: getInitialSuggestions('emotions'),
  facts: getInitialSuggestions('facts'),
  solutions: getInitialSuggestions('solutions')
});

const selectedFirstLevelSuggestions = reactive({
  emotions: [],
  facts: [],
  solutions: []
});

watch([() => form.direction, selectedGender], () => {
  currentSuggestions.emotions = getInitialSuggestions('emotions');
  currentSuggestions.facts = getInitialSuggestions('facts');
  currentSuggestions.solutions = getInitialSuggestions('solutions');
  selectedFirstLevelSuggestions.emotions = [];
  selectedFirstLevelSuggestions.facts = [];
  selectedFirstLevelSuggestions.solutions = [];
});


// ====== Основная “цепочная” логика ======
function selectSuggestion(fieldName, suggestion, type) {
  const currentText = form[fieldName].trim();
  const isNewBranch = isInitialSuggestions(type);

  if (currentText) {
    if (isNewBranch) {
      form[fieldName] = currentText + '. ' + suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    } else {
      form[fieldName] = currentText + ' ' + suggestion;
    }
  } else {
    form[fieldName] = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
  }

  if (!selectedFirstLevelSuggestions[type].includes(suggestion)) {
    selectedFirstLevelSuggestions[type].push(suggestion);
  }

  updateSuggestions(type, suggestion);
}

function getInitialSuggestions(type) {
  if (type === 'emotions') {
    // Теперь возвращаем массив по selectedGender.value (male или female)
    return baseSuggestions[form.direction]?.emotions[selectedGender.value] || [];
  }
  return baseSuggestions[form.direction]?.[type]?.initial || [];
}

// Обновляет список подсказок по выбранному слову, переходя на следующий уровень,
// либо возвращает начальные если глубже идти некуда
function updateSuggestions(type, selectedWord) {
  const dict = baseSuggestions[form.direction]?.[type] || {};
  const initial = getInitialSuggestions(type);

  // Дочерние подсказки 2-го/3-го уровня для выбранного слова
  const next = dict[selectedWord];

  if (next && next.length) {
    // Переход на следующий уровень — показываем его
    currentSuggestions[type] = [...next];
    return;
  }

  // Если нет потомков — ротация по initial
  const remaining = initial.filter(
    item => !selectedFirstLevelSuggestions[type].includes(item)
  );

  if (remaining.length === 0) {
    selectedFirstLevelSuggestions[type] = [];
    currentSuggestions[type] = [...initial];
  } else {
    currentSuggestions[type] = remaining;
  }
}

// Сброс выбранных подсказок и возврат к начальному списку
function resetSuggestions(type) {
  selectedFirstLevelSuggestions[type] = [];
  currentSuggestions[type] = getInitialSuggestions(type);
}

// Возвращает true, если сейчас в currentSuggestions доступны только начальные подсказки, которые ещё не выбраны
function isInitialSuggestions(type) {
  const initialSuggs = getInitialSuggestions(type);
  const unusedInitial = initialSuggs.filter(
    item => !selectedFirstLevelSuggestions[type].includes(item)
  );
  return JSON.stringify(currentSuggestions[type]) === JSON.stringify(unusedInitial);
}

// ====== Остальные функции — оставить как было ======
function onGenderClick(gender) {
  selectedGender.value = gender;
}
function chooseDirection(dir) {
  form.direction = dir;
  selectedSection.value = 'location';
}
const sections = [
  { id: 'location', title: 'Локация', buttonText: 'Начать' },
  { id: 'emotions', title: 'Эмоции', buttonText: 'Дальше к фактам' },
  { id: 'facts', title: 'Факты', buttonText: 'К решению ситуации' },
  { id: 'solutions', title: 'Решения', buttonText: 'Суммировать' },
  { id: 'summary', title: 'Резюме', buttonText: 'Раз-два и готово' },
  { id: 'contact', title: 'Контакт', buttonText: '' }
];
const selectedSection = ref('location');
const isActive = id => id === selectedSection.value;
const currentSectionData = computed(() => sections.find(s => s.id === selectedSection.value));
const goToNextSection = () => {
  const idx = sections.findIndex(s => s.id === selectedSection.value);
  if (selectedSection.value === 'solutions') summarizeAllContent();
  if (idx < sections.length - 1) {
    selectedSection.value = sections[idx + 1].id
  }
};
// ======== МАССИВЫ ВОПРОСОВ ДЛЯ КАЖДОГО НАПРАВЛЕНИЯ =======

const questions1 = {
  food: [
    'Что вы почувствовали?',
    'Какие эмоции испытали?',
    'Что расстроило?',
    'Что порадовало?'
  ],
  fitness: [
    'Что вы почувствовали?',
    'Какие эмоции испытали на занятии?',
    'Какие ощущения после тренировки?',
    'Что понравилось или удивило?'
  ]
};
const questions2 = {
  food: [
    'Что именно произошло?',
    'Какие детали требуют внимания?',
    'Какие события самые важные?',
  ],
  fitness: [
    'Какие события самые важные?',
    'Какие детали требуют внимания?',
    'Что особенно запомнилось?'
  ]
};
const questions3 = {
  food: [
    'Что можно сделать лучше?',
    'Совет управляющему?',
    'Как исправить?',
    'Ваши предложения?'
  ],
  fitness: [
    'Что можно сделать лучше?',
    'Как сделать занятия комфортнее?',
    'Как исправить?',
    'Как мотивировать вас вернуться?'
  ]
};

// ======== АКТИВНЫЙ ВОПРОС (ДЛЯ ПОКАЗА/АНИМАЦИИ) ========
const currentQuestion1 = ref(questions1[form.direction]?.[0] || questions1.food[0]);
const currentQuestion2 = ref(questions2[form.direction]?.[0] || questions2.food[0]);
const currentQuestion3 = ref(questions3[form.direction]?.[0] || questions3.food[0]);

// ======== АНИМАЦИЯ/РОТАЦИЯ ВОПРОСОВ ========

let rotationInterval = null;

function startRotation(questionNum) {
  // Сначала останавливаем, чтобы не накладывалось
  stopRotation();

  let questionsArray = [];
  let currentRef = null;

  // ИСПРАВЛЕНО: используем questionNum в условиях
  if (questionNum === 1) {
    questionsArray = questions1[form.direction] || questions1.food;
    currentRef = currentQuestion1;
  } else if (questionNum === 2) {
    questionsArray = questions2[form.direction] || questions2.food;
    currentRef = currentQuestion2;
  } else if (questionNum === 3) {
    questionsArray = questions3[form.direction] || questions3.food;
    currentRef = currentQuestion3;
  } else {
    return;
  }

  // ИСПРАВЛЕНО: убрана лишняя строка с ошибкой let currentIndex = ...
  
  // Запускаем таймер
  rotationInterval = setInterval(() => {
    // Находим индекс текущего текста в массиве и берем следующий
    const currentIndex = questionsArray.indexOf(currentRef.value);
    const nextIndex = (currentIndex + 1) % questionsArray.length;
    currentRef.value = questionsArray[nextIndex];
  }, 4000); // Скорость смены - 4 секунды
}

function stopRotation() {
  if (rotationInterval) {
    clearInterval(rotationInterval);
    rotationInterval = null;
  }
}

watch(selectedSection, (newSection) => {
  stopRotation(); // При смене шага останавливаем старую ротацию
  
  if (newSection === 'emotions') {
    startRotation(1);
  } else if (newSection === 'facts') {
    startRotation(2);
  } else if (newSection === 'solutions') {
    startRotation(3);
  }
}, { immediate: true });

// Чистим память при уходе
onUnmounted(() => {
  stopRotation();
});

// Также следим за сменой направления (Рестораны <-> Фитнес), чтобы обновить массив вопросов
watch(() => form.direction, () => {
   stopRotation();
   // Перезапускаем ротацию для текущей активной секции
   if (selectedSection.value === 'emotions') startRotation(1);
   if (selectedSection.value === 'facts') startRotation(2);
   if (selectedSection.value === 'solutions') startRotation(3);
});


const isEmotionFilled = computed(() => form.emotionalRelease && form.emotionalRelease.trim().length > 0);
const submitButtonText = computed(() =>
  submitStatus.value === 'processing'
    ? '⏳ Отправляется...'
    : form.selectedNetwork
      ? `Отправить в ${getAccusativeCase(form.selectedNetwork)}`
      : 'Отправить в заведение'
);

// Склонение названия компании
function getAccusativeCase(networkName) {
  if (!networkName) return '';

  // 1. Нормализация: меняем латинские буквы на русские (A->А, K->К, O->О и т.д.)
  // Это решает проблему "Kофемания" (латинская K) или "FIZКУЛЬТУРA" (латинская A)
  let name = networkName.trim();
  
  // Таблица замен (латиница -> кириллица для нижнего регистра)
  const map = {'a':'а', 'e':'е', 'o':'о', 'p':'р', 'c':'с', 'k':'к', 'x':'х', 'y':'у', 'm':'м', 'h':'н'};
  
  // Строка для поиска (нормализованная, нижний регистр)
  let lower = name.toLowerCase().split('').map(char => map[char] || char).join('');

  // 2. Исключения (проверяем по нормализованной строке)
  const exceptions = [
    'корж', 'даблби', 'дринкит', 
    'world class', 'x-fit', 'smstretching', 'sportlife', 'fitness house', 
    'ddx', 'skuratov', 'surf coffee', 'stars coffee', 
    'cofix', 'green house', 'спортлайф'
  ];

  // Тут важно: exceptions тоже должны быть в кириллице или английском как есть.
  // Английские бренды (world class) останутся английскими, т.к. буквы w, s, l, i, f не менялись.
  // А вот "Kофемания" превратилась в чисто русскую "кофемания".
  
  if (exceptions.includes(lower)) return name;

  // 3. Ручные правила
  
  // FIZКУЛЬТУРА. У нас FIZ остался (f,i,z не меняли), а КУЛЬТУРА стала русской.
  if (lower.includes('fiz') && lower.includes('культур')) {
    if (name === name.toUpperCase()) return 'FIZКУЛЬТУРУ';
    return name.slice(0, -1) + 'у';
  }

  // Кофемания (теперь она точно русская "кофемания")
  if (lower.includes('кофемания')) {
    return 'Кофеманию';
  }

  // 4. Автоматика
  const lastChar = lower.slice(-1);
  const isCaps = name === name.toUpperCase() && name !== name.toLowerCase();

  if (lastChar === 'а') return name.slice(0, -1) + (isCaps ? 'У' : 'у');
  if (lastChar === 'я') return name.slice(0, -1) + (isCaps ? 'Ю' : 'ю');
  
  return name;
}


// Сборка итога для поля summaryText (можете сохранить свою реализацию или заменить на более универсальную)
function summarizeAllContent() {
  humanizeStatus.value = 'processing';
  // Сборка итогового текста из полей (вы можете переписать под свой стиль вывода)
  let parts = [];
  if (form.emotionalRelease) parts.push(form.emotionalRelease.trim());
  if (form.factualAnalysis) parts.push(form.factualAnalysis.trim());
  if (form.constructiveSuggestions) parts.push(form.constructiveSuggestions.trim());
  form.summaryText = parts.join('. ');
  humanizeStatus.value = 'completed';
  setTimeout(() => { humanizeStatus.value = 'idle'; }, 2000);
}

// Отправка формы (оставлен ваш исходник, только адаптировано на summaryText)
async function submitForm() {
  submitStatus.value = 'processing';

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const submittedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  let clientId = localStorage.getItem('signal_client_id');
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2, 15) + Date.now();
    localStorage.setItem('signal_client_id', clientId);
  }

  const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxPqW0GLJ7SCJc9J1yC17Bl2di_IxXDyAZEfSxJ7wLvupwjb7_IAIlKVsXlyOL6WcDj/exec';
  
  const formData = new FormData();
  formData.append('referer', window.location.origin);
  formData.append('clientId', clientId);
  formData.append('ticketNumber', formattedTicketNumber.value);
  formData.append('date', currentDate.value);
  formData.append('submitted', submittedTime);
  formData.append('network', form.selectedNetwork);
  formData.append('address', form.selectedBranch);
  formData.append('name', form.userName || 'Аноним');
  formData.append('review', form.summaryText);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.status === 'success' && result.processed) {
      formSubmitted.value = true;
      submitStatus.value = 'idle';
    } else {
      throw new Error(result.message || 'Ошибка обработки данных');
    }
  } catch (error) {
    alert('Не удалось отправить отзыв. Пожалуйста, попробуйте позже.');
    submitStatus.value = 'idle';
  }
}

function applyGenderCorrection(text, gender) {
  return text;
}

function structureAndCleanText(share, emotional, factual, solutions, gender) {
  let result = '';

  // Набор устойчивых пар и словосочетаний, которые нельзя разрывать запятой
  const protectedBigrams = new Set([
    'нет системы',
    'мгновенная подача',
    'длинный волос',
    'архив образцов',
    'по санитарии',
    'качественный звук',
    'идеальный вкус',
    'точные пропорции',
    'за решение',
    'за внимание',
    'за профессионализм',
    'за рекомендацию',
    'за уютную',
    'по качеству',
    'по сервису',
    'по коммуникации',
    'по времени',
    'чистая посуда',
    'грязная посуда',
    'холодный кофе',
    'волосы в',
    'ошибка в',
  ]);

  // Попытаться склеить устойчивые пары внутри строки (чтобы не резать запятой)
  function joinProtectedBigrams(text) {
    let words = text.trim().split(/\s+/);
    if (words.length < 2) return text.trim();

    const joined = [];
    for (let i = 0; i < words.length; i++) {
      const bigram = (words[i] + ' ' + (words[i + 1] || '')).toLowerCase();
      if (i < words.length - 1 && protectedBigrams.has(bigram)) {
        joined.push(words[i] + ' ' + words[i + 1]);
        i += 1;
      } else {
        joined.push(words[i]);
      }
    }
    return joined.join(' ');
  }

  // Разбор «цепочки» на уровни: ожидаем 1–3 блока
  // Мы формируем уровни по логике ввода: первая лексема — уровень1, далее — уровень2 (одно или два слова),
  // остальное — уровень3 (детали). Для улучшения читаемости допускаем 2 слова в уровне2, если это устойчивое сочетание.
  function splitIntoLevels(sentence) {
    const cleaned = sentence.trim().replace(/\s+/g, ' ');
    let words = cleaned.split(' ');
    if (words.length === 0) return { l1: '', l2: '', l3: '' };

    const l1 = words[0]; // всегда первое слово — уровень1
    words = words.slice(1);

    if (words.length === 0) return { l1, l2: '', l3: '' };

    // кандидаты для l2: одно слово как минимум
    let l2 = words[0];
    let remainder = words.slice(1);

    // если первые два слова образуют защищённую пару — берём их как уровень2
    if (remainder.length >= 1) {
      const candidateBigram = (l2 + ' ' + remainder[0]).toLowerCase();
      if (protectedBigrams.has(candidateBigram)) {
        l2 = l2 + ' ' + remainder[0];
        remainder = remainder.slice(1);
      }
    }

    const l3 = remainder.join(' '); // всё, что осталось — детали
    return { l1, l2, l3 };
  }

  // Форматирование одной «цепочки» с корректной пунктуацией
  function formatChain(sentence) {
    // Склеиваем устойчивые пары, чтобы не рвать их запятой
    const normalized = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    const glued = joinProtectedBigrams(normalized);
    const { l1, l2, l3 } = splitIntoLevels(glued);

    if (!l1) return '';

    // 1 уровень
    if (!l2 && !l3) {
      return l1;
    }

    // 1 + 2 уровни
    if (l2 && !l3) {
      return `${l1} ${l2}:`;
    }

    // 1 + 2 + 3 уровни
    // Внутри l3 попробуем поставить ОДНУ запятую, если есть явные два смысловых блока
    // Критерии: ищем короткое служебное слово (<=3) примерно в середине или защищенную биграмму — запятую ставим ДО неё
    let l3Words = l3.split(/\s+/);
    let commaIdx = -1;

    // попытка: найти служебное/короткое слово во второй трети — поставить запятую перед ним
    for (let i = 1; i < l3Words.length - 1; i++) {
      const w = l3Words[i].toLowerCase();
      if (w.length <= 3 && i >= Math.floor(l3Words.length / 3)) {
        commaIdx = i;
        break;
      }
    }

    if (commaIdx === -1 && l3Words.length >= 4) {
      // запасной вариант: запятая на 2/3
      commaIdx = Math.floor(l3Words.length * 0.66);
    }

    // НО: не разрывать защищённые биграммы
    if (commaIdx > 0) {
      const leftBigram = (l3Words[commaIdx - 1] + ' ' + l3Words[commaIdx]).toLowerCase();
      if (protectedBigrams.has(leftBigram) && commaIdx < l3Words.length - 1) {
        // если запятая попала внутрь биграммы — сдвигаем вправо
        commaIdx += 1;
      }
    }

    let l3Formatted;
    if (commaIdx > 0 && commaIdx < l3Words.length - 1) {
      l3Formatted = l3Words.slice(0, commaIdx).join(' ') + ', ' + l3Words.slice(commaIdx).join(' ');
    } else {
      l3Formatted = l3; // не разобрали — оставляем как есть
    }

    return `${l1} ${l2}: ${l3Formatted}`;
  }

  // Удаление дублей между цепочками
  function formatSection(text) {
    const lines = text.split('. ').map(s => s.trim()).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const line of lines) {
      const key = line.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const formatted = formatChain(line);
      if (formatted) out.push(`• ${formatted}`);
    }
    return out.join('\n');
  }

  // МОЙ ОТЗЫВ
  if (share) {
    result += `МОЙ ОТЗЫВ\n${share}\n\n`;
  }

  // ВПЕЧАТЛЕНИЯ
  if (emotional) {
    result += `ВПЕЧАТЛЕНИЯ\n`;
    result += formatSection(emotional) + '\n\n';
  }

  // ПРОБЛЕМЫ
  if (factual) {
    result += `ПРОБЛЕМЫ\n`;
    result += formatSection(factual) + '\n\n';
  }

  // ПРЕДЛОЖЕНИЯ
  if (solutions) {
    result += `ПРЕДЛОЖЕНИЯ\n`;
    result += formatSection(solutions);
  }

  return result.trim();
}

onUnmounted(() => {
  if (rotationInterval) clearInterval(rotationInterval);
});
</script>

<style scoped>
:root {
  --signal-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --signal-font-mono: 'SF Mono', 'Monaco', monospace;
  --submit-gradient: linear-gradient(90deg, #A972FF 0%, #00C2FF 50%, #FFB800 100%);
}

.signal-demo-wrapper {
  font-family: var(--signal-font-sans);
  width: 100%;
  max-width: none;
  margin: 0;
}

.signal-demo__header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.signal-demo__breadcrumbs {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Стили для переключателей шагов (нейтрально-белые) */
.signal-breadcrumb {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.signal-breadcrumb-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.signal-breadcrumb.is-active .signal-breadcrumb-circle {
  width: 24px;
  height: 8px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

.signal-breadcrumb:hover .signal-breadcrumb-circle {
  background: rgba(255, 255, 255, 0.6);
}

.signal-controls-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.signal-info-button {
  background: rgba(135, 206, 235, 0.1);
  border: 1px solid rgba(135, 206, 235, 0.3);
  color: #87ceeb;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  height: 32px;
  display: inline-flex;
  align-items: center;
  width: auto;
}

.signal-info-button.signal-info-female {
  background: rgba(255, 105, 180, 0.1);
  border-color: rgba(255, 105, 180, 0.3);
  color: #ff69b4;
}

.signal-info-button.signal-info-female:hover {
  background: rgba(255, 105, 180, 0.2);
  border-color: rgba(255, 105, 180, 0.5);
}

.signal-info-button.signal-info-male {
  background: rgba(135, 206, 235, 0.1);
  border-color: rgba(135, 206, 235, 0.3);
  color: #87ceeb;
}

.signal-info-button.signal-info-male:hover {
  background: rgba(135, 206, 235, 0.2);
  border-color: rgba(135, 206, 235, 0.5);
}

.signal-gender-switch {
  display: flex;
  justify-content: center;
}

.signal-gender-container {
  display: flex;
  background: #2a2a2e;
  border-radius: 20px;
  padding: 4px;
  border: 1px solid #444;
  height: 32px;
  align-items: center;
}

.signal-gender-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 2px;
}

.signal-gender-female {
  background: rgba(255, 105, 180, 0.3);
}

.signal-gender-female.is-active {
  background: #ff69b4;
  box-shadow: 0 0 12px rgba(255, 105, 180, 0.5);
}

.signal-gender-male {
  background: rgba(135, 206, 235, 0.3);
}

.signal-gender-male.is-active {
  background: #87ceeb;
  box-shadow: 0 0 12px rgba(135, 206, 235, 0.5);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* === МОДАЛЬНОЕ ОКНО (Светлая тема) === */
.modal {
  background: #ffffff;        /* Белый фон */
  color: #1d1d1f;            /* Темный (почти черный) текст */
  border-radius: 20px;       /* Чуть мягче скругление */
  width: min(480px, 92vw);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); /* Мягкая тень */
  padding: 30px;
  text-align: center;        /* Центрируем весь текст внутри */
}

.modal-title {
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 16px;
  color: #000000;
}

.modal-body {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  color: #444;               /* Текст чуть мягче черного для чтения */
}

/* Ссылка внутри модалки */
.modal-link {
  color: #000 !important;    /* Черная ссылка */
  font-weight: 600;
  border-bottom: 1px solid rgba(0,0,0,0.2) !important;
  transition: border-color 0.3s;
}
.modal-link:hover {
  border-bottom-color: #000 !important;
}

.no-double-underline {
  text-decoration: none !important;
  border-bottom: 1px solid currentColor !important;
  padding-bottom: 1px !important;
}

.no-double-underline:hover {
  border-bottom: 1px solid currentColor !important;
}

/* Футер с кнопкой */
.modal-footer {
  margin-top: 28px;
  display: flex;
  justify-content: center;   /* Центрируем кнопку */
}

/* Базовый стиль кнопки (цвет будет задан через гендер) */
.modal-ok {
  border: none;
  color: #fff;               /* Белый текст на кнопке */
  border-radius: 12px;
  padding: 12px 40px;        /* Кнопка пошире */
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.modal-ok:hover {
  transform: scale(1.03);
  filter: brightness(1.05);
}

.signal-demo__form-container {
  background-color: #1E1E20;
  border-radius: 24px;
  padding: 2rem;
  color: #f0f0f0;
  border: 1px solid #2c2c2f;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.signal-form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Блок вопроса без цветной полоски слева */
.signal-question-block {
  background-color: #2a2a2e;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #3a3a3e;
  /* border-left удален для чистого стиля */
  padding-bottom: 35px;
}

.signal-question-block.contact {
  /* Цветная полоска для контакта тоже убрана */
}

.signal-direction-label {
  font-weight: 600;
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

/* Контейнер с вертикальным центрированием */
.signal-rotating-phrase-container {
  position: relative;
  min-height: 2.6em;    /* Фиксируем высоту */
  display: flex;        /* Включаем флексбокс */
  align-items: center;  /* Центрируем текст по вертикали */
  overflow: hidden;
}

/* Анимация */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

/* СБРОС: absolute больше не нужен, так как mode="out-in" исключает наложение.
   Теперь уходящий элемент тоже будет центрироваться флексом. */
.fade-leave-active {
  position: static; 
}

/* Прозрачность */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Убираем отступы у текста, чтобы центрирование было идеальным */
.signal-question-label {
  margin: 0;
  line-height: 1.3;
}

textarea, .signal-input, .signal-select {
  width: 100%;
  background-color: #242426;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 0.75rem 0.6rem;
  font-size: 0.95rem;
  color: #f0f0f0;
  transition: all 0.3s ease;
  font-family: var(--signal-font-sans);
  margin-bottom: 0.75rem;
  resize: none;
}

textarea:focus, .signal-input:focus, .signal-select:focus {
  outline: none;
  border-color: var(--accent-color);
  background-color: #2a2a2e;
}

::placeholder { 
  color: #666; 
}

.signal-suggestions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.signal-suggestion-bubble {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

/* Базовые цвета (переопределяются гендерными стилями ниже) */
.signal-emotion-bubble {
  background: rgba(169, 114, 255, 0.1);
  border-color: rgba(169, 114, 255, 0.3);
  color: #A972FF;
}

.signal-fact-bubble {
  background: rgba(61, 220, 132, 0.1);
  border-color: rgba(61, 220, 132, 0.3);
  color: #3DDC84;
}

.signal-solution-bubble {
  background: rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.3);
  color: #4A90E2;
}

/* Применяем ховер-эффекты только для устройств с мышью */
@media (hover: hover) and (pointer: fine) {
  .signal-emotion-bubble:hover {
    background: #A972FF;
    color: #000;
  }

  .signal-fact-bubble:hover {
    background: #3DDC84;
    color: #000;
  }
  
  .signal-solution-bubble:hover {
    background: #4A90E2;
    color: #fff;
  }
}

.signal-reset-bubble {
  font-weight: 600;
  opacity: 0.8;
  font-size: 0.75rem;
  border-style: dashed !important;
   /* Новые свойства для выравнивания иконки и текста */
  display: inline-flex !important; /* Чтобы flex работал внутри строки */
  align-items: center;             /* Центрируем иконку по вертикали */
  gap: 6px;                        /* Расстояние между стрелкой и текстом */
  padding-left: 10px !important;   /* Чуть больше отступ слева для баланса */
}

.signal-reset-icon {
  flex-shrink: 0; /* Чтобы иконку не сжимало */
  /* Цвет наследуется автоматически через stroke="currentColor" */
}

.signal-example-hint {
  font-family: var(--signal-font-sans);
  font-size: 0.85rem;       /* Чуть-чуть увеличим для читаемости */
  color: #888;
  line-height: 1.4;         /* Дадим строкам чуть больше воздуха */
  letter-spacing: 0.02em;   /* И самую малость - буквам */
  margin: 0.25rem 0 0.5rem 0.5rem; /* top | right | bottom | left */
}

.signal-example-hint-white {
  color: #f0f0f0 !important;
}

.signal-example-hint b {
  color: #aaa;
  font-weight: 600;
}

.signal-next-button-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.signal-humanize-button-container {
  order: 2;
}

.signal-liquid-humanize-btn {
  width: 100%;
  height: 56px;
  border-radius: 18px;
  border: 2px solid #444;
  background: #2a2a2e;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signal-liquid-humanize-btn:not(:disabled):hover {
  border-color: #666;
  color: #bbb;
  background: #333;
}

.signal-liquid-humanize-text {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.signal-liquid-next-btn {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  order: 1;
  font-size: 0;
  background: var(--submit-gradient, linear-gradient(90deg, #A972FF 0%, #00C2FF 50%, #FFB800 100%));
  background-size: 200% auto;
  background-position: 25% 50%;
  transition: all 0.4s ease-out;
}

.signal-liquid-next-btn:not(:disabled):hover {
  transform: translateY(-2px);
  background-position: 75% 50%;
}

.signal-liquid-next-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.signal-liquid-next-btn .signal-liquid-next-text,
.signal-liquid-next-btn .signal-next-icon {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.signal-liquid-next-btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.signal-liquid-next-text {
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
  line-height: 1;
  display: flex;
  align-items: center;
}

.signal-next-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  vertical-align: middle;
  transform: translate(0, 0px);
  transition: opacity 0.2s ease-in-out;
}

.signal-next-icon .signal-coffee-fill {
  fill: currentColor;
  opacity: 1;
  transition: height 0.3s ease-in-out, y 0.3s ease-in-out;
}

.signal-columns {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.signal-column {
  flex: 1;
}

.signal-column label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.signal-input-hint {
  font-size: 0.9rem;
  color: #777;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.2;
}

.signal-agreement {
  margin: 20px 0 24px 0;;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #ccc;
  cursor: pointer;
  padding: 0;
}

.signal-agreement input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #666;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.signal-agreement span {
  margin: 0;
  padding: 0;
  line-height: 1.4;
}

.signal-policy-link {
  color: #999 !important;
  padding: 0 !important;
  margin: 0 !important;
  transition: color 0.3s ease;
}

.signal-policy-link:hover {
  color: #fff !important;
}

.signal-submit-button {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  border: none;
  background: var(--submit-gradient, linear-gradient(90deg, #A972FF 0%, #00C2FF 50%, #FFB800 100%));
  background-size: 200% auto;
  background-position: 25% 50%;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s ease-out;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
}

.signal-submit-button .signal-liquid-next-text {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.signal-submit-button:hover:not(:disabled) {
  background-position: 75% 50%;
  transform: scale(1.02);
}

.signal-submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.signal-success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  width: 100%;
}

.signal-success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.signal-success-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.signal-success-ticket-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.signal-success-date {
  font-family: var(--signal-font-mono);
  font-size: 0.9rem;
  color: #888;
}

.signal-success-ticket {
  background-color: #2a2a2e;
  color: #fff;
  font-weight: 700;
  padding: 0.7rem 2.5rem !important;
  border-radius: 12px;
  letter-spacing: 1px;
  font-family: var(--signal-font-mono);
  font-size: 1.1rem;
}

.signal-success-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  text-align: center !important;
  width: 100% !important;
  display: block !important;
}

.signal-telegram-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  transition: all 0.3s;
}

.signal-telegram-button.female {
  background-color: #ff69b4;
  color: #fff;
}

.signal-telegram-button.male {
  background-color: #87ceeb;
  color: #000;
}

.signal-telegram-button:hover {
  filter: brightness(110%);
  transform: scale(1.05);
  text-decoration: none !important;
  border: none !important;
}

.signal-secondary-link {
  display: block;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #888;
  transition: color 0.3s;
}

.signal-secondary-link:hover {
  color: #fff !important;
}

.location-header-container {
  display: flex;
  justify-content: center; /* По центру горизонтально */
  align-items: center;
  margin-bottom: 32px;     /* Отступ снизу до полей ввода */
  margin-top: 12px;        /* Отступ сверху */
  min-height: auto;        /* Сбрасываем фиксированную высоту ротатора, здесь она не нужна */
}

/* Сам заголовок */
.location-title {
  font-family: var(--signal-font-sans); /* Твой шрифт */
  font-weight: 700;        /* Жирный */
  font-size: 22px;         /* Размер для десктопа */
  color: #f0f0f0;          /* Белый цвет текста */
  margin: 0;               /* Убираем дефолтные отступы */
  text-align: center;      /* Центровка текста */
  line-height: 1.2;
}

@media (max-width: 768px) {
  .location-title {
    font-size: 19px;
  }
  
  .location-header-container {
    margin-bottom: 24px;
    margin-top: 8px;
  }
  
  .signal-demo__header {
    margin-bottom: 12px;
  }

  .signal-controls-row {
    margin-bottom: 12px;
  }

  .signal-demo-wrapper {
    width: 100%;
    margin: 0 auto;
  }

  /* Сам контейнер без стилей карточки, но с отступами */
  .signal-demo__form-container {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0 !important; 
    margin: 0 !important;
    width: 100%;
  }

  /* Убеждаемся, что внутренние элементы занимают всю ширину */
  .signal-form-section {
    width: 100%;
  }
  
  .signal-question-block {
    padding: 1rem 0.5rem !important; 
  }

  .signal-liquid-next-btn {
    width: 100%;
    height: 52px;
  }

  .signal-suggestion-bubble {
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
  }
  
  .signal-columns {
    flex-direction: column;
    gap: 1rem;
  }

  .signal-success-ticket-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .signal-success-ticket {
    padding: 0.6rem 2rem;
  }
}

.signal-incognito-toggle {
  margin-bottom: 12px;
}

.signal-toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.signal-toggle-checkbox {
  display: none;
}

.signal-toggle-slider {
  position: relative;
  width: 48px;
  height: 26px;
  background-color: #444;
  border-radius: 26px;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.signal-toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  top: 3px;
  left: 3px;
  transition: transform 0.3s ease;
}

.signal-toggle-checkbox:checked + .signal-toggle-slider {
  background-color: #555;
}

.signal-toggle-checkbox:checked + .signal-toggle-slider::before {
  transform: translateX(22px);
}

.signal-toggle-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #ccc;
}

.signal-name-field {
  margin-bottom: 12px;
}

.signal-name-field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

/* ===============================
   ЕДИНЫЙ ГЕНДЕРНЫЙ ЦВЕТ ДЛЯ ВСЕХ ЭЛЕМЕНТОВ
   =============================== */

/* Женский цвет для всех элементов */
.signal-demo-wrapper:has(.signal-gender-female.is-active) .signal-suggestion-bubble {
  background: rgba(255, 105, 180, 0.1) !important;
  border-color: rgba(255, 105, 180, 0.3) !important;
  color: #ff69b4 !important;
}

.signal-demo-wrapper:has(.signal-gender-female.is-active) .signal-suggestion-bubble:hover {
  background: #ff69b4 !important;
  color: #fff !important;
}

.signal-demo-wrapper:has(.signal-gender-female.is-active) .signal-toggle-checkbox:checked + .signal-toggle-slider {
  background-color: #ff69b4 !important;
}

.signal-demo-wrapper:has(.signal-gender-female.is-active) .signal-agreement input[type="checkbox"] {
  accent-color: #ff69b4 !important;
}
.signal-demo-wrapper:has(.signal-gender-female.is-active) {
  --submit-gradient: linear-gradient(90deg, #ffb6da 0%, #ff69b4 50%, #ff1493 100%);
}

.signal-demo-wrapper:has(.signal-gender-female.is-active) .modal-ok {
  background-color: #ff69b4;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

/* Мужской цвет для всех элементов */
.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-suggestion-bubble {
  background: rgba(135, 206, 235, 0.1) !important;
  border-color: rgba(135, 206, 235, 0.3) !important;
  color: #fff !important;
}

.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-suggestion-bubble:hover {
  background: #87ceeb !important;
  color: #fff !important;
}

.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-liquid-next-btn .signal-liquid-next-text,
.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-liquid-next-btn .signal-next-icon {
  color: #fff !important;
}

.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-toggle-checkbox:checked + .signal-toggle-slider {
  background-color: #87ceeb !important;
}
.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-agreement input[type="checkbox"] {
  accent-color: #87ceeb !important;
}
.signal-demo-wrapper:has(.signal-gender-male.is-active) {
  --submit-gradient: linear-gradient(90deg, #c0e6ff 0%, #87ceeb 50%, #4682b4 100%);
}

/* Мужская кнопка "Понятно" */
.signal-demo-wrapper:has(.signal-gender-male.is-active) .modal-ok {
  background-color: #87ceeb;
  box-shadow: 0 4px 15px rgba(135, 206, 235, 0.3);
}

/* Гендерная подсветка для текстовых полей при фокусе */
.signal-demo-wrapper:has(.signal-gender-female.is-active) textarea:focus,
.signal-demo-wrapper:has(.signal-gender-female.is-active) .signal-input:focus,
.signal-demo-wrapper:has(.signal-gender-female.is-active) .signal-select:focus {
  border-color: #ff69b4 !important;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2) !important;
}

.signal-demo-wrapper:has(.signal-gender-male.is-active) textarea:focus,
.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-input:focus,
.signal-demo-wrapper:has(.signal-gender-male.is-active) .signal-select:focus {
  border-color: #87ceeb !important;
  box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.2) !important;
}

/* Настройка заголовка */
.modal-title {
  font-weight: 700;     /* Сделали еще жирнее для акцента */
  font-size: 22px;      /* Чуть крупнее */
  line-height: 1.3;     /* Оптимальный интервал */
  margin-bottom: 20px;
  color: #000;
}

/* Класс для переноса строки */
.title-break {
  display: inline;      /* На десктопе - в строку */
}

/* Разделитель (пустое пространство) */
.modal-spacer {
  height: 12px;         /* Высота пустого пространства */
}

/* Жирный текст в описании */
.modal-body b {
  font-weight: 600;
  color: #000;          /* Жирный текст чисто черный */
  display: block;       /* Чтобы точно занимал свой блок */
}

.signal-question-block {
    border: none;
  }

/* === МОБИЛЬНЫЕ СТИЛИ === */
@media (max-width: 480px) {
  /* Переносим "настоящих перемен" на новую строку */
  .title-break {
    display: block;
  }
  
  .modal {
    padding: 24px 20px; /* Чуть меньше отступы по краям на телефоне */
    width: 85vw;
  }
  
  .modal-title {
    font-size: 20px;    /* Чуть меньше шрифт на телефоне */
  }
}

</style>
