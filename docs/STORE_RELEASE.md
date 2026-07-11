# Публикация в магазинах — что нужно от вас

Скачивание APK с сайта — **временная бета**. Нормальный путь: **Google Play** (Android) и **App Store** (iPhone). Тогда не нужны «всё равно установить» и «неизвестные источники».

---

## Google Play (Android) — приоритет

### Вы делаете один раз (без этого скрипт не запустить)

| # | Что | Где |
|---|-----|-----|
| 1 | **Аккаунт разработчика** (~25 USD) | [play.google.com/console](https://play.google.com/console) |
| 2 | **Создать приложение** «Perfect Season», package `com.perfectseasonhub.app` | Play Console |
| 3 | **Резервная копия keystore** | Файл `android/keystore/release.keystore` — на флешку/облако (не в git!) |
| 4 | **Политика** (уже есть) | `https://perfectseason.duckdns.org/ru/privacy` |
| 5 | **Анкеты в Console** (только в браузере, ~15 мин) | Data safety, рейтинг контента, целевая аудитория |
| 6 | **Скриншоты** минимум 2 с телефона | 1080×1920 или как снимет эмулятор/телефон |
| 7 | **Иконка 512×512** PNG | Сгенерируем в репо (`docs/store-assets/`) |

### Для автоматической загрузки AAB скриптом (опционально)

Положите файл **`%USERPROFILE%\.perfect-season-play.json`** — JSON ключ **service account** из Google Cloud:

1. [Google Cloud Console](https://console.cloud.google.com) → проект → **APIs** → включить **Google Play Android Developer API**
2. **IAM → Service Accounts** → создать → ключ JSON → скачать
3. Play Console → **Пользователи и разрешения** → пригласить email сервис-аккаунта → роль **Администратор выпусков** (Release manager)
4. Переименовать JSON в `.perfect-season-play.json` в домашней папке Windows

Без JSON скрипт только **соберёт AAB** и выведет чеклист; загрузку сделаете вручную в Console.

### Команды

```powershell
npm run android:build      # AAB + APK
npm run play:preflight     # проверка артефактов
npm run play:deploy        # сборка + загрузка (если есть JSON)
```

---

## App Store (iPhone) — второй этап

| Требование | Почему |
|------------|--------|
| **Mac** с Xcode | iOS-сборка только на macOS |
| **Apple Developer** (~99 USD/год) | [developer.apple.com](https://developer.apple.com) |
| **Bundle ID** `com.perfectseasonhub.app` | Зарегистрировать в Apple Developer |
| **App Store Connect** — создать приложение | Вручную в браузере |
| **Скриншоты iPhone** | 6.7" и 6.5" минимум |

В репозитории пока только **Android (Capacitor)**. iOS: `npx cap add ios` на Mac — отдельная задача после Google Play.

**От вас для App Store позже:** Apple ID, доступ в App Store Connect (или приглашение в команду), сертификаты через Xcode Automatic Signing.

---

## Что уже готово в проекте

- Release AAB/APK, подпись, офлайн Classic basketball
- Privacy URL на сайте
- targetSdk 36
- Скрипты: `build-android.mjs`, `play-store-preflight.mjs`, `play-store-deploy.mjs`

---

## Рекомендуемый порядок

1. Вы: Play Console + анкеты + (по желанию) service account JSON  
2. Мы: иконка, описания, `npm run play:deploy`  
3. **Внутреннее тестирование** — подруга по email Google, ставит из Play  
4. Продакшен в Google Play  
5. Потом iOS на Mac + App Store  

---

## Безопасность

- **Не коммитить:** `release.keystore`, `keystore.properties`, `*.json` ключи Google/Apple  
- После выхода в Play — на странице `/download` оставить только ссылку «Скачать в Google Play»
