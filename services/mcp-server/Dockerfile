FROM oven/bun:1

WORKDIR /app

# Copy root workspace files
COPY package.json bun.lock turbo.json ./

# Copy mcp-server package.json
COPY services/mcp-server/package.json ./services/mcp-server/

# Install dependencies (this installs in workspace root)
RUN bun install

# Copy source code
COPY services/mcp-server ./services/mcp-server

# Build
WORKDIR /app/services/mcp-server
RUN bun run build

EXPOSE 8080

CMD ["bun", "run", "start"]
