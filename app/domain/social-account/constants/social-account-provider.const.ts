import type { SocialAccount } from '../models/social-account.types';

/** Инструкции по получению значений для Credentials аккаунта в зависимости от соц. сети */
export const SOCIAL_ACCOUNT_PROVIDER_INSTRUCTIONS: Record<
  SocialAccount['provider'],
  string
> = {
  wordpress: `
    <h6 class="weight-500">Как получить Application Password:</h6>
    <ol>
      <li>Зайти в админку WordPress под пользователем.</li>
      <li>Профиль пользователя (<code>/wp-admin/profile.php</code>).</li>
      <li>Блок <b>Application Passwords</b> → задать имя → <b>Добавить новый пароль</b>.</li>
      <li>Сохранить сгенерированный пароль (WordPress покажет его один раз).</li>
    </ol>
  `,
  yandex_dzen: `
    <h6 class="weight-500">Как получить zen_session_id:</h6>
    <ol>
      <li>Войти в Дзен в браузере под нужным аккаунтом: <a href="https://dzen.ru" target="_blank"><code>https://dzen.ru</code></a>.</li>
      <li>Открыть DevTools → вкладка <b>Application</b> (Chrome) или <b>Storage</b> (Firefox).</li>
      <li>Раздел <b>Cookies</b> → <code>https://dzen.ru.</code></li>
      <li>Найти куку <code>zen_session_id</code> и скопировать её значение — это и есть <code>zen_session_id</code>.</li>
    </ol>
  `,
  odnoklassniki: `
    <h6 class="weight-500">Как получить:</h6>
    <ol>
      <li>Зарегистрировать приложение на <a href="https://apiok.ru/" target="_blank"><code>https://apiok.ru/</code></a> (OK for sites / приложения).</li>
      <li>
        В панели приложения найти:
        <ul>
          <li>ID приложения (<code>application_id</code>).</li>
          <li>Секретный ключ (<code>application_secret_key</code>).</li>
        </ul>
      </li>
      <li>Написать в <code>api-support@ok.ru</code> и запросить доступ к <b>WidgetMediatopicPost</b> (publishing widget).</li>
      <li>При необходимости получить OAuth access token по стандартной схеме OAuth 2.0 (через redirect, code и т.п.).</li>
    </ol>
  `,
  instagram: `
    <h6 class="weight-500">Минимальные шаги:</h6>
    <ol>
      <li>Создать приложение в Facebook Developers: <a href="https://developers.facebook.com/" target="_blank"><code>https://developers.facebook.com/</code></a>.</li>
      <li>Привязать Facebook Page и Instagram Business/Creator аккаунт.</li>
      <li>
        Включить <b>Instagram Graph API</b> и выдать разрешения (<code>instagram_basic</code>, <code>pages_show_list</code>, <code>instagram_content_publish</code> и т.п.).
      </li>
      <li>
        Получить Page access token, затем через Graph API получить:
        <ul>
          <li><code>instagram_account_id</code> (<code>/me/accounts</code> → page → <code>/PAGE_ID?fields=instagram_business_account</code>).</li>
        </ul>
      </li>
      <li>Получить long-lived token, если нужно.</li>
    </ol>
  `,
  telegram: `
    <h6 class="weight-500">Как получить:</h6>
    <ol>
      <li>В Telegram найти <code>@BotFather</code> → команда <code>/newbot</code> → следовать инструкциям → забрать <code>HTTP API token</code> → это и есть <code>bot_token</code>.</li>
      <li>
        <code>chat_id</code>:
        <ul>
          <li>Для личного чата: написать боту, затем использовать любой бот/сервис вроде <code>@userinfobot</code> или вызвать <code>getUpdates</code> через Bot API, чтобы увидеть <code>chat.id</code>.</li>
          <li>Для канала: сделать бота админом канала; для публичного — можно использовать <code>@channel_username</code>, для приватного — смотреть <code>chat.id</code> через getUpdates (будет что-то вроде <code>-1001234567890</code>).</li>
        </ul>
      </li>
    </ol>
  `,
  vk: `
    <h6 class="weight-500">Как получить токен:</h6>
    <ol>
      <li>ВСоздать standalone‑приложение: <a href="https://vk.com/editapp?act=create" target="_blank"><code>https://vk.com/editapp?act=create</code></a> → тип <b>Standalone</b>.</li>
      <li>
        Сгенерировать user‑token через <a href="https://oauth.vk.com/authorize" target="_blank"><code>https://oauth.vk.com/authorize</code></a> с нужными scope:
        <ul>
          <li><code>scope=wall,offline</code> (минимум для постинга на свою стену).</li>
        </ul>
      </li>
      <li>
        Для постинга от имени сообщества:
        <ul>
          <li>Зайти в управление сообществом → Настройки → Работа с API → Создать ключ доступа сообщества с правами «управление сообществом/сообщениями/стеной».</li>
          <li>Этот ключ — <code>access_token</code>, <code>owner_id</code> = <code>-ID_сообщества</code>.</li>
        </ul>
      </li>
    </ol>
  `,
};
