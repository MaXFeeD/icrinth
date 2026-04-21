FROM rust:1.88.0 AS build
ENV PKG_CONFIG_ALLOW_CROSS=1

WORKDIR /usr/src/labrinth
COPY . .
ENV SQLX_OFFLINE=true
RUN cargo build --release --package labrinth


FROM debian:bookworm-slim

LABEL org.opencontainers.image.source=https://github.com/nernar/icmods
LABEL org.opencontainers.image.description="Inner Core Mods API"
LABEL org.opencontainers.image.licenses=AGPL-3.0

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates openssl \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN update-ca-certificates

COPY --from=build /usr/src/labrinth/target/release/labrinth /labrinth/labrinth
COPY --from=build /usr/src/labrinth/apps/labrinth/migrations/* /labrinth/migrations/
COPY --from=build /usr/src/labrinth/apps/labrinth/assets /labrinth/assets
WORKDIR /labrinth

CMD ["/labrinth/labrinth"]
