FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

FROM base AS build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=api --prod /prod/api
RUN cp -r ./ui/dist /prod/ui

FROM base AS api
COPY --from=build /prod/api /prod/api
COPY .env.vault /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM nginx:alpine AS ui-dev
COPY --from=build /prod/ui /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

FROM nginx:alpine AS ui
COPY --from=build /prod/ui /usr/share/nginx/html
COPY nginx/nginx.prod.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
