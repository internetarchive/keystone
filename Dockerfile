FROM python:3.11.4-slim-bookworm

# Build using the command: docker build --build-arg UID=$UID . -t keystone

ARG UID
ARG DEBIAN_FRONTEND=noninteractive
ARG KEYSTONE_USER_HOME=/home/keystone
ARG KEYSTONE_INSTALL_DIR=/opt/keystone
ARG KEYSTONE_VENV_DIR=/home/keystone/venv

ARG DJANGO_SETTINGS_MODULE=config.settings
ENV DJANGO_SETTINGS_MODULE $DJANGO_SETTINGS_MODULE

# Install required packages
RUN apt-get update \
    && apt-get install -y \
    gcc \
    make \
    python3-dev \
    libpq-dev \
    libpq5 \
    postgresql-client

# Create the keystone user
RUN useradd --create-home --home-dir=$KEYSTONE_USER_HOME --uid $UID keystone

# Create the log file.
RUN touch /var/log/keystone.log && chown keystone:keystone /var/log/keystone.log

# Copy in the Keystone source
USER keystone
WORKDIR $KEYSTONE_INSTALL_DIR
COPY --chown=keystone ./ .

# Create a virtualenv and install deps and Keystone into it
RUN make venv && make install

# Copy in the entrypoint scripts
COPY --chown=keystone dev/entrypoint.sh /entrypoint.sh
COPY --chown=keystone dev/entrypoint.py /entrypoint.py
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 12342
