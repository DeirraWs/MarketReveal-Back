# Використовуємо офіційний образ Node.js
FROM node:16

# Встановлюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо решту коду
COPY . .

# Вказуємо команду для запуску програми
CMD ["npm", "run", "start:dev"]
