# Використовуємо офіційний образ Node.js
FROM node:16

# Встановлюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту коду
COPY . .

# Налаштовуємо порт
COPY ./dist ./dist

# Запускаємо додаток
CMD ["npm", "run", "start:dev"]
