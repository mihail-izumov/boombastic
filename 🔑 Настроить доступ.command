#!/bin/bash
# Разовая настройка доступа к GitHub. Запуск: двойной клик в Finder.

cd "$(dirname "$0")" || exit 1

finish() {
  echo ""
  read -n 1 -s -r -p "  Нажмите любую клавишу, чтобы закрыть окно..."
  exit "$1"
}

echo ""
echo "  ╔════════════════════════════════════════╗"
echo "  ║   Настройка доступа к GitHub           ║"
echo "  ╚════════════════════════════════════════╝"
echo ""
echo "  Делается один раз. Дальше публикация будет без вопросов."
echo ""
echo "  ────────────────────────────────────────────"
echo "  ШАГ 1. Создайте токен на GitHub:"
echo ""
echo "    1) Откроется страница создания токена"
echo "    2) Note ........ Mac mini boombastic"
echo "    3) Expiration .. No expiration"
echo "    4) Галочки ..... repo  (самая первая в списке)"
echo "                     workflow  (сразу под ней)"
echo "    5) Внизу ....... кнопка Generate token"
echo "    6) Нажмите значок копирования рядом с токеном"
echo "  ────────────────────────────────────────────"
echo ""
read -n 1 -s -r -p "  Нажмите любую клавишу — открою страницу..."
# Две галочки, а не одна: repo — файлы сайта, workflow — файл публикации
# .github/workflows/deploy.yml. Без workflow GitHub отклоняет отправку с
# текстом «refusing to allow a Personal Access Token to update workflow».
open "https://github.com/settings/tokens/new?description=Mac%20mini%20boombastic&scopes=repo,workflow"
echo ""
echo ""
echo "  ШАГ 2. Вставьте токен сюда (Cmd+V) и нажмите Enter."
echo "  Он будет виден на экране — так надёжнее, экран очищу сразу после."
echo ""
read -r -p "  Токен: " TOKEN
TOKEN=$(echo "$TOKEN" | tr -d '[:space:]')
clear

echo ""
if [ -z "$TOKEN" ]; then
  echo "  ❌ Ничего не вставилось."
  echo "     Скопируйте токен на странице GitHub кнопкой копирования и запустите файл снова."
  finish 1
fi

case "$TOKEN" in
  ghp_*|github_pat_*) ;;
  *)
    echo "  ⚠️  Это не похоже на токен GitHub."
    echo "     Токен начинается с ghp_ или github_pat_"
    echo "     Возможно, скопировался не тот текст. Попробуйте снова."
    finish 1
    ;;
esac

echo "  🔍 Проверяю токен на GitHub..."
LOGIN=$(curl -s -H "Authorization: Bearer $TOKEN" https://api.github.com/user \
        | sed -n 's/.*"login"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

if [ -z "$LOGIN" ]; then
  echo ""
  echo "  ❌ GitHub не принял токен."
  echo "     Возможные причины: токен скопирован не полностью, уже удалён,"
  echo "     или нет интернета. Создайте новый и попробуйте снова."
  finish 1
fi

echo "  ✅ Токен рабочий. Аккаунт: $LOGIN"
echo ""

# --- Сохраняем в связку ключей macOS ---
git config --global credential.helper osxkeychain
git config --global user.name  "$LOGIN" 2>/dev/null
[ -z "$(git config --global user.email)" ] && git config --global user.email "$LOGIN@users.noreply.github.com"

printf "protocol=https\nhost=github.com\nusername=%s\npassword=%s\n\n" "$LOGIN" "$TOKEN" | git credential approve

echo "  🔐 Доступ сохранён в связке ключей Mac."
echo ""

# --- Проверка боем ---
echo "  🔍 Проверяю связь с репозиторием..."
if git ls-remote --exit-code origin >/dev/null 2>&1; then
  echo "  ✅ Всё работает."
else
  echo "  ⚠️  Токен верный, но к репозиторию подключиться не вышло."
  echo "     Проверьте, что у токена стоит галочка repo."
  finish 1
fi

unset TOKEN
echo ""
echo "  ────────────────────────────────────────────"
echo "  Готово! Теперь запустите 📤 Опубликовать.command —"
echo "  логин и пароль он больше не спросит."
echo "  ────────────────────────────────────────────"

finish 0
