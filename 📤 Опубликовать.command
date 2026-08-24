#!/bin/bash
# Публикует изменения сайта БумБастик на b00m.fun.
# Запуск: двойной клик по файлу в Finder.

cd "$(dirname "$0")" || exit 1

# Показывать русские имена файлов нормально, а не кодами
git config --local core.quotePath false >/dev/null 2>&1

# Убрать «зависший» замок, если предыдущая операция оборвалась
if [ -f .git/index.lock ] && ! pgrep -x git >/dev/null 2>&1; then
  rm -f .git/index.lock
fi

finish() {
  echo ""
  read -n 1 -s -r -p "  Нажмите любую клавишу, чтобы закрыть окно..."
  exit "$1"
}

echo ""
echo "  ╔════════════════════════════════════════╗"
echo "  ║   Публикация сайта на b00m.fun         ║"
echo "  ╚════════════════════════════════════════╝"
echo ""

# --- Есть ли коммиты, которые не доехали до GitHub? ---
git fetch --quiet 2>/dev/null
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null)

if [ -n "$UNPUSHED" ]; then
  echo "  ⚠️  Есть сохранённые изменения, которые не доехали до GitHub:"
  echo ""
  echo "$UNPUSHED" | sed 's/^/     /'
  echo ""
  echo "  📤 Дослать их на GitHub..."
  if git push; then
    echo ""
    echo "  ✅ Готово! Изменения опубликованы."
    echo "     Сайт обновится через 1–2 минуты: https://b00m.fun"
  else
    echo ""
    echo "  ❌ Не удалось отправить. Проверьте интернет и запустите файл снова."
    finish 1
  fi
  echo ""
  # Если больше ничего не менялось — на этом всё
  if [ -z "$(git status --porcelain)" ]; then
    finish 0
  fi
  echo "  Продолжаю — есть ещё несохранённые правки."
  echo ""
fi

# --- Что изменилось ---
if [ -z "$(git status --porcelain)" ]; then
  echo "  ℹ️  Изменений нет — публиковать нечего."
  finish 0
fi

echo "  Изменённые файлы:"
echo ""
git status --short | sed 's/^/     /'
echo ""
echo "  Объём правок:"
echo ""
# --intent-to-add регистрирует новые файлы, чтобы они попали в подсчёт строк.
# Содержимое при этом не фиксируется — коммит делается ниже, после подтверждения.
git add -A --intent-to-add >/dev/null 2>&1
git diff --stat | sed 's/^/     /'
echo ""

read -r -p "  Всё верно, публикуем? (д — да, п — посмотреть правки, н — отмена) " CHECK
case "$CHECK" in
  [пПpP])
    git reset --quiet >/dev/null 2>&1   # вернуть индекс в исходное состояние
    echo ""
    echo "  Открываю GitHub Desktop — посмотрите правки там и запустите этот файл снова."
    open -a "GitHub Desktop" "$(pwd)" 2>/dev/null || open "$(pwd)"
    finish 0
    ;;
  [дДyY]) ;;
  *)
    git reset --quiet >/dev/null 2>&1   # вернуть индекс в исходное состояние
    echo ""
    echo "  Отменено. Ничего не опубликовано."
    finish 0
    ;;
esac
echo ""

# --- Проверка сборки ---
echo "  🔍 Проверяю, что сайт собирается без ошибок..."
if ! npm run docs:build >/tmp/boombastic-build.log 2>&1; then
  echo ""
  echo "  ❌ Сайт не собирается — публикация отменена."
  echo "     Ошибка:"
  echo ""
  tail -25 /tmp/boombastic-build.log | sed 's/^/     /'
  echo ""
  echo "  Покажите этот текст Claude — он поможет починить."
  finish 1
fi
echo "  ✅ Сборка прошла успешно."
echo ""

# --- Описание изменений ---
echo "  Что вы изменили? (коротко, например: «обновил цены»)"
read -r -p "  > " MSG
if [ -z "$MSG" ]; then
  MSG="Обновление сайта $(date '+%d.%m.%Y %H:%M')"
fi
echo ""

# --- Публикация ---
echo "  📤 Отправляю на GitHub..."
git add -A || finish 1
git commit -m "$MSG" || finish 1

if ! git push; then
  echo ""
  echo "  ❌ Не удалось отправить."
  echo "     Возможные причины: нет интернета, или на GitHub есть более новые правки."
  echo "     Попробуйте выполнить в Терминале: git pull --rebase, затем запустите этот файл снова."
  finish 1
fi

echo ""
echo "  ✅ Готово! Изменения опубликованы."
echo ""
echo "  Сайт обновится через 1–2 минуты: https://b00m.fun"
echo "  Статус сборки: https://github.com/mihail-izumov/boombastic/actions"
echo ""

read -r -p "  Открыть страницу со статусом сборки? (д/н) " ANS
case "$ANS" in
  [дД]|[yY]) open "https://github.com/mihail-izumov/boombastic/actions" ;;
esac

finish 0
