# Ymaps2

**Веб-приложение для работы с Яндекс.Картами**  
Интерактивная карта с фильтрацией объектов и сохранением настроек пользователя (куки). Проект включает клиентскую часть на JavaScript и серверную на Node.js.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Yandex Maps](https://img.shields.io/badge/Yandex_Maps-333333?style=for-the-badge&logo=yandex&logoColor=red)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

## О проекте
Приложение для отображения и фильтрации объектов на карте.  
На основе структуры и коммитов реализован следующий функционал:

- Интерактивная карта с использованием **API Яндекс.Карт**.
- Фильтрация отображаемых объектов (`почти сделан фильтр`).
- Сохранение настроек пользователя через **куки** (`добоаление куков` — с опечаткой, но суть ясна).
- Серверная часть на Node.js для обработки запросов и данных (`serverMaps.js`).
- Тестовая страница для отладки (`test.html`).

> Проект активно развивался с июля по октябрь 2020 года (23 коммита). Точный функционал уточняйте в файлах `map.js` и `serverMaps.js`.

## Технологии
- **JavaScript (клиент)** — логика карты, фильтры, работа с куками.
- **Node.js** — серверная среда выполнения.
- **Express** — веб-фреймворк для Node.js (предположительно).
- **API Яндекс.Карт** — отображение карты и объектов.
- **HTML5** — структура интерфейса.

## Структура проекта
```
Ymaps2/
├── public/ # Клиентская часть (статический контент)
│ └── map.js # Основной скрипт карты
├── serverMaps.js # Серверный файл (Node.js + Express)
├── test.html # Тестовая страница
├── package.json # Зависимости и скрипты
├── package-lock.json # Фиксация версий зависимостей
├── .gitattributes # Настройки Git
├── .gitignore # Исключённые файлы
└── README.md # Описание проекта
```
