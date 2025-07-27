# syntax=docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine AS base

LABEL fly_launch_runtime="NestJS"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Set build environment
ENV NODE_ENV build

# NestJS app lives here
WORKDIR /home/node

# Install build dependencies for native modules
# RUN apk add --no-cache libc6-compat python3 make g++

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production


# Final stage for app image
FROM base

# Set production environment
ENV NODE_ENV production

# Create a non-root user and group
# RUN addgroup -S --gid 1001 nodejs && \
#     adduser -S --uid 1001 -G nodejs nestjs

WORKDIR /home/node

COPY --from=build --chown=node:node /home/node/package*.json ./
COPY --from=build --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=build --chown=node:node /home/node/dist/ ./dist/

# Switch to the non-root user
# USER nestjs

# Expose the port and start the server
CMD [ "node", "dist/src/main.js" ]

