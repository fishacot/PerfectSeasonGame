# Полноценный APK (игра внутри)

## Важно

**VPS больше не нужен для игры в приложении.**  
APK содержит UI + базу игроков + симуляцию. Classic basketball работает офлайн.

Сайт на VPS — отдельная веб-версия.

## Как устроено

1. `npm run build:static` → папка `out/` (HTML/JS/CSS + `nba.json`)
2. Capacitor копирует `out/` внутрь Android
3. `npm run android:build` → `.aab` / `.apk`

Симуляция и спины — на клиенте (без `/api`).

## Сборка

```powershell
npm run android:build
```

Файлы:
- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/release/app-release.apk`

Если Gradle не качается (сеть), увеличьте `networkTimeout` в  
`android/gradle/wrapper/gradle-wrapper.properties` и повторите:

```powershell
cd android
.\gradlew.bat bundleRelease assembleRelease
```

## Что в APK, что нет

| Есть офлайн | Пока нет / опционально |
|-------------|------------------------|
| Classic / HoopIQ / CPU basketball | Друзья / логин (нужен сервер) |
| Sandbox basketball | Live-комнаты (WebSocket) |
| Данные NBA в APK | |

## Веб vs приложение

| | Веб (VPS) | APK |
|--|-----------|-----|
| Код | Next.js на сервере | Тот же UI, статикой в APK |
| Интернет | Нужен | Для основной игры — нет |
