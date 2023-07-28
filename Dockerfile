FROM python:3.11.4-slim-bookworm

ENV HOME=/opt/keystone
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create directories and user
RUN mkdir -p $HOME \
    && mkdir -p $HOME/staticfiles \
    && mkdir -p $HOME/mediafiles \
    && groupadd keystone \
    && useradd -g keystone keystone
WORKDIR $HOME

# Install required packages
RUN apt-get update \
    && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    libpq5 \
    build-essential \
    netcat-traditional

# Copy container entrypoint and make it executable
COPY ./dev/app/entrypoint.prod.sh .
RUN chmod +x  $HOME/entrypoint.prod.sh

# Setup Keystone project code
COPY . $HOME
RUN chown -R keystone:keystone $HOME
USER keystone
RUN make venv && make install-prod

ENTRYPOINT ["/opt/keystone/entrypoint.prod.sh"]
