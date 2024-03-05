"""
Django settings for keystone project.

Generated by 'django-admin startproject' using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from pathlib import Path

from dotenv import dotenv_values


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = {
    **dotenv_values(BASE_DIR / ".env"),
    **os.environ,  # override loaded values with environment variables
}

DEPLOYMENT_ENVIRONMENT = env.get("KEYSTONE_DEPLOYMENT_ENVIRONMENT", "DEV")
KEYSTONE_GIT_COMMIT_HASH = env.get("KEYSTONE_GIT_COMMIT_HASH", "")[:7]

PUBLIC_BASE_URL = env.get("KEYSTONE_PUBLIC_BASE_URL", "")

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.get(
    "KEYSTONE_DJANGO_SECRET_KEY",
    "devsecretkeyljkadfadfsjkl9ew0f02iefj20h8310hknsnlasd172yo1lnimposimfn",
)

PRIVATE_API_KEY = env.get("KEYSTONE_PRIVATE_API_KEY", "supersecret")

AIT_DB_HOST = env.get("KEYSTONE_AIT_DB_HOST", "")
AIT_DB_NAME = env.get("KEYSTONE_AIT_DB_NAME", "")
AIT_DB_PORT = env.get("KEYSTONE_AIT_DB_PORT", "")
AIT_DB_USER = env.get("KEYSTONE_AIT_DB_USER", "")

ARCH_SYSTEM_API_KEY = env.get("KEYSTONE_ARCH_SYSTEM_API_KEY", "")
ARCH_BASE_URL = env.get("KEYSTONE_ARCH_BASE_URL", "")
ARCH_API_BASE_URL = env.get("KEYSTONE_ARCH_API_BASE_URL", "")
ARCH_FILES_BASE_URL = env.get("KEYSTONE_ARCH_FILES_BASE_URL", "")
ARCH_WASAPI_BASE_URL = env.get("KEYSTONE_ARCH_WASAPI_BASE_URL", "")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.get("KEYSTONE_DJANGO_DEBUG", "false") == "true"

ALLOWED_HOSTS = (
    [
        "localhost",
        "127.0.0.1",
        "[::1]",
        "host.docker.internal",
    ]
    + (env.get("KEYSTONE_DJANGO_ALLOWED_HOSTS", "")).split(" ")
    if env.get("KEYSTONE_DJANGO_ALLOWED_HOSTS")
    else []
)

CSRF_TRUSTED_ORIGINS = (
    env.get("KEYSTONE_DJANGO_CSRF_TRUSTED_ORIGINS", "").split(" ")
    if env.get("KEYSTONE_DJANGO_CSRF_TRUSTED_ORIGINS")
    else []
)

ARCH_SUPPORT_TICKET_URL = "https://arch-webservices.zendesk.com/hc/en-us/requests/new"

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.humanize",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "keystone",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "keystone.middleware.ExceptionMiddleware",
    "keystone.middleware.ImpersonateMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.jinja2.Jinja2",
        "DIRS": [BASE_DIR / "templates/jinja2"],
        "APP_DIRS": True,
        "OPTIONS": {
            "environment": "config.jinja2env.environment",
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "keystone.context_processors.settings",
                "keystone.context_processors.extra_builtins",
                "keystone.context_processors.helpers",
            ],
        },
    },
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "APP_DIRS": True,
        "DIRS": [BASE_DIR / "templates"],
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "keystone.context_processors.settings",
                "keystone.context_processors.extra_builtins",
                "keystone.context_processors.helpers",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env.get("KEYSTONE_POSTGRES_NAME", "keystone"),
        "USER": env.get("KEYSTONE_POSTGRES_USER", "keystone"),
        "PASSWORD": env.get("KEYSTONE_POSTGRES_PASSWORD", "keystone"),
        "HOST": env.get("KEYSTONE_POSTGRES_HOST", "127.0.0.1"),
        "PORT": env.get("KEYSTONE_POSTGRES_PORT", "5433"),
        "DISABLE_SERVER_SIDE_CURSORS": True,
    }
}

AUTH_USER_MODEL = "keystone.User"
SESSION_COOKIE_NAME = "keystone-session-id"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "keystone.hashers.PBKDF2WrappedSha1PasswordHasher",
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

# embed commit hash in asset root to invalidate cache between releases
STATIC_URL = f"/static/{KEYSTONE_GIT_COMMIT_HASH}/"
STATIC_ROOT = "/opt/keystone/staticfiles"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGIN_URL = "/login"
LOGIN_REDIRECT_URL = "/"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{asctime} {levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "formatter": "verbose",
            "filename": env.get("KEYSTONE_LOG_FILE_PATH", "/var/log/keystone.log"),
        },
    },
    "loggers": {"root": {"handlers": ["file"]}},
}

EMAIL_HOST = env.get("KEYSTONE_EMAIL_HOST")
DEFAULT_FROM_EMAIL = env.get("KEYSTONE_DEFAULT_FROM_EMAIL")

if DEPLOYMENT_ENVIRONMENT == "DEV":
    # in development, always send emails to the console rather than sending
    # actual emails.
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


class KnownArchJobUuids:
    """Known ARCH job UUIDs"""

    ARCHIVESPARK_ENTITY_EXTRACTION = "018d114d-3426-730e-94a1-b56ca73fc1ad"
    ARCHIVESPARK_ENTITY_EXTRACTION_CHINESE = "018d1151-3a3a-7184-b6ed-8ec176ee750e"
    ARCHIVESPARK_NOOP = "018d1cef-c91d-7d51-9cf4-05fe51900321"
    AUDIO_FILE_INFORMATION = "01895066-7db2-794b-b91b-e3f5a340e859"
    DATASET_PUBLICATION = "018950a2-21cb-7034-8d2a-03dff990cc1a"
    DOMAIN_FREQUENCY = "01894bc7-ff6a-7e25-a5b5-4570425a8ab7"
    DOMAIN_GRAPH = "01895067-417d-7665-ba60-a9bb9ca0aa3e"
    IMAGE_FILE_INFORMATION = "01895067-d598-7db8-88ad-46fed66e27f5"
    IMAGE_GRAPH = "01895067-92fb-739c-a99d-037fde1798a4"
    LONGITUDINAL_GRAPH = "01895064-661c-79da-9ca7-cbf82507de61"
    NAMED_ENTITIES = "01895065-8f59-7a8a-b432-79e20d749f4a"
    PDF_FILE_INFORMATION = "01895068-3e02-72cb-b0d9-4e1bacc42c37"
    PLAIN_TEXT_OF_WEBPAGES = "0189506a-46f3-7d73-9dcf-a8fce59c50cc"
    PRESENTATION_FILE_INFORMATION = "01895068-a576-7a00-b4dd-2d5650bc69ab"
    SPREADSHEET_FILE_INFORMATION = "01895069-192a-74f8-84a9-b14f20c20f89"
    TEXT_FILE_INFORMATION = "01895069-6750-73bb-b758-a64b417097f0"
    USER_DEFINED_QUERY = "018950a1-6773-79f3-8eb2-fba4356e23b9"
    VIDEO_FILE_INFORMATION = "01895069-a9fa-734c-b669-fcf528f85c1e"
    WEB_ARCHIVE_TRANSFORMATION = "01895066-11f7-7c35-af62-603955c6c20f"
    WEB_GRAPH = "01895069-e74c-79de-8292-effb45265179"
    WORD_PROCESSING_FILE_INFORMATION = "0189506a-d09d-7571-9d3c-a44698d58d39"


JOB_TYPE_UUID_NON_AUT_TEMPLATE_FILENAME_MAP = {
    KnownArchJobUuids.LONGITUDINAL_GRAPH: "ars-dataset.html",
    KnownArchJobUuids.NAMED_ENTITIES: "ars-dataset.html",
    KnownArchJobUuids.WEB_ARCHIVE_TRANSFORMATION: "ars-dataset.html",
    KnownArchJobUuids.DOMAIN_GRAPH: "network-extraction-dataset.html",
    KnownArchJobUuids.IMAGE_GRAPH: "network-extraction-dataset.html",
    KnownArchJobUuids.WEB_GRAPH: "network-extraction-dataset.html",
    KnownArchJobUuids.DOMAIN_FREQUENCY: "domain-frequency-extraction-dataset.html",
    KnownArchJobUuids.TEXT_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.AUDIO_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.IMAGE_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.PDF_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.PRESENTATION_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.SPREADSHEET_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.VIDEO_FILE_INFORMATION: "binary-information-extraction-dataset.html",
    KnownArchJobUuids.WORD_PROCESSING_FILE_INFORMATION: (
        "binary-information-extraction-dataset.html"
    ),
}
