FROM denoland/deno:alpine

WORKDIR /app

RUN chown -R deno:deno /app

USER deno

EXPOSE 3000

COPY --chown=deno:deno deno.json deno.lock ./
COPY --chown=deno:deno package.json package-lock.json* ./

COPY --chown=deno:deno . .

RUN deno cache src/main.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "src/main.ts"]
