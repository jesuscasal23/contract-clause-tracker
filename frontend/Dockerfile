# ---- build stage: compile the Angular `app` project ----
FROM node:22-bookworm-slim AS build
WORKDIR /app

# pnpm (workspace pins pnpm@9.15.5 via package.json "packageManager")
RUN npm install -g pnpm@9.15.5

# Install deps first (cached unless the lockfile changes)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app (node_modules excluded via .dockerignore, so the install above is kept)
COPY . .
RUN pnpm ng build app --configuration production

# ---- serve stage: static files via nginx ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
