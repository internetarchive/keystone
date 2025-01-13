"""
Django settings for keystone project.

Generated by 'django-admin startproject' using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from email.utils import parseaddr
from pathlib import Path
from uuid import UUID

from dotenv import dotenv_values

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from keystone.plugins import is_plugin_module_name


###############################################################################
# Helpers
###############################################################################


def assert_is_plugin_module_name(mod_name):
    """Raise an ValueError if mod_name if not a valid plugin module name,
    otherwise return mod_name."""
    if not is_plugin_module_name(mod_name):
        raise ValueError(f"Invalid Keystone plugin module name: '{mod_name}'")
    return mod_name


def is_valid_email_address(email_address):
    """Return a bool indicating whether the email address is valid."""
    return parseaddr(email_address)[1] != ""


###############################################################################
# Config
###############################################################################


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = {
    **dotenv_values(BASE_DIR / ".env"),
    **os.environ,  # override loaded values with environment variables
}

DEPLOYMENT_ENVIRONMENT = env.get("KEYSTONE_DEPLOYMENT_ENVIRONMENT", "DEV")
KEYSTONE_GIT_COMMIT_HASH = env.get("KEYSTONE_GIT_COMMIT_HASH", "")[:7]

# Configure Sentry
sentry_sdk.init(
    dsn=env.get("KEYSTONE_SENTRY_DSN", ""),
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=True,
    environment=DEPLOYMENT_ENVIRONMENT,
    release=KEYSTONE_GIT_COMMIT_HASH,
)

PUBLIC_BASE_URL = env.get("KEYSTONE_PUBLIC_BASE_URL", "")

# Note that enabling the Google Colab feature requires that ARCH be
# configured with a valid githubBearer value, and for this Keystone instance
# be served at a publicly-accessible URL from which Colab can fetch the data.
COLAB_DISABLED = env.get("KEYSTONE_COLAB_DISABLED", False)

# Define the our maximum supported file size for Google Colab.
COLAB_MAX_FILE_SIZE_BYTES = 1_000_000_000

# Note that publishing to archive.org requires that ARCH be configured
# with valid arkMintBearer, iaS3AuthHeader, pboxCollection, and pboxS3Url
# values, which is currently only possible internally within IA.
PUBLISHING_DISABLED = env.get("KEYSTONE_PUBLISHING_DISABLED", False)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.get("KEYSTONE_DJANGO_SECRET_KEY", "supersecret")

PRIVATE_API_KEY = env.get("KEYSTONE_PRIVATE_API_KEY", "supersecret")

ARCH_SYSTEM_USER = env.get("KEYSTONE_ARCH_SYSTEM_USER", "")
ARCH_SYSTEM_API_KEY = env.get("KEYSTONE_ARCH_SYSTEM_API_KEY", "")
ARCH_BASE_URL = env.get("KEYSTONE_ARCH_BASE_URL", "")
ARCH_ADMIN_BASE_URL = env.get("KEYSTONE_ARCH_ADMIN_BASE_URL", "")
ARCH_API_BASE_URL = env.get("KEYSTONE_ARCH_API_BASE_URL", "")
ARCH_FILES_BASE_URL = env.get("KEYSTONE_ARCH_FILES_BASE_URL", "")
ARCH_WASAPI_BASE_URL = env.get("KEYSTONE_ARCH_WASAPI_BASE_URL", "")

# Define the user to which we want ARCH to internally attribute global datasets.
ARCH_GLOBAL_USERNAME = env.get("KEYSTONE_ARCH_GLOBAL_USER", "arch:__global__")

# Define the Keystone user we want to serve as the owner of global datasets.
GLOBAL_USER_USERNAME = "global-datasets"
GLOBAL_USER_ACCOUNT_NAME = GLOBAL_USER_USERNAME + "-account"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.get("KEYSTONE_DJANGO_DEBUG", "false") == "true"
DB_QUERY_DEBUG = False

COLLECTION_IMAGE_MAX_WIDTH_PX = 250

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

# Get and validate the list of installed Keystone plugins.
INSTALLED_PLUGINS = list(
    map(
        assert_is_plugin_module_name,
        filter(
            bool,
            map(
                str.strip,
                env.get("KEYSTONE_INSTALLED_PLUGINS", "").split(","),
            ),
        ),
    )
)

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
] + INSTALLED_PLUGINS

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

# Embed commit hash in asset root to invalidate cache between releases
STATIC_URL = f"/static/{KEYSTONE_GIT_COMMIT_HASH}/"
STATIC_ROOT = env.get("KEYSTONE_STATIC_ROOT", "/opt/keystone/staticfiles")

# Define the media files base URL and local storage path.
MEDIA_URL = "/media/"
MEDIA_ROOT = env.get("KEYSTONE_MEDIA_ROOT", "/opt/keystone/media")

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
            "level": "DEBUG" if DEBUG else "INFO",
            "class": "logging.FileHandler",
            "formatter": "verbose",
            "filename": env.get("KEYSTONE_LOG_FILE_PATH", "/var/log/keystone.log"),
        },
    },
    "loggers": {
        "root": {"handlers": ["file"]},
        "django.db.backends": {
            "handlers": ["file"],
            "level": "DEBUG" if DB_QUERY_DEBUG else "INFO",
            "propagate": False,
        },
    },
}

EMAIL_HOST = env.get("KEYSTONE_EMAIL_HOST")
DEFAULT_FROM_EMAIL = env.get("KEYSTONE_DEFAULT_FROM_EMAIL")

# Parse a space-delimited list of staff user email addresses to which critical
# system-related communications should be sent.
STAFF_EMAIL_ADDRESSES = [
    addr
    for addr in env.get("KEYSTONE_STAFF_EMAIL_ADDRESSES", "").split()
    if is_valid_email_address(addr)
]

if DEPLOYMENT_ENVIRONMENT == "DEV":
    # in development, always send emails to the console rather than sending
    # actual emails.
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


class KnownArchJobUuids:
    """Known ARCH job UUIDs"""

    ARCHIVESPARK_ENTITY_EXTRACTION = UUID("018d114d-3426-730e-94a1-b56ca73fc1ad")
    ARCHIVESPARK_ENTITY_EXTRACTION_CHINESE = UUID(
        "018d1151-3a3a-7184-b6ed-8ec176ee750e"
    )
    ARCHIVESPARK_FLEX_JOB = UUID("018f52cc-d917-71ac-9e64-19fb219114a4")
    ARCHIVESPARK_NOOP = UUID("018d1cef-c91d-7d51-9cf4-05fe51900321")
    AUDIO_FILE_INFORMATION = UUID("01895066-7db2-794b-b91b-e3f5a340e859")
    DATASET_PUBLICATION = UUID("018950a2-21cb-7034-8d2a-03dff990cc1a")
    DOMAIN_FREQUENCY = UUID("01894bc7-ff6a-7e25-a5b5-4570425a8ab7")
    DOMAIN_GRAPH = UUID("01895067-417d-7665-ba60-a9bb9ca0aa3e")
    IMAGE_FILE_INFORMATION = UUID("01895067-d598-7db8-88ad-46fed66e27f5")
    IMAGE_GRAPH = UUID("01895067-92fb-739c-a99d-037fde1798a4")
    LONGITUDINAL_GRAPH = UUID("01895064-661c-79da-9ca7-cbf82507de61")
    NAMED_ENTITIES = UUID("01895065-8f59-7a8a-b432-79e20d749f4a")
    PDF_FILE_INFORMATION = UUID("01895068-3e02-72cb-b0d9-4e1bacc42c37")
    PLAIN_TEXT_OF_WEBPAGES = UUID("0189506a-46f3-7d73-9dcf-a8fce59c50cc")
    PRESENTATION_FILE_INFORMATION = UUID("01895068-a576-7a00-b4dd-2d5650bc69ab")
    SPREADSHEET_FILE_INFORMATION = UUID("01895069-192a-74f8-84a9-b14f20c20f89")
    TEXT_FILE_INFORMATION = UUID("01895069-6750-73bb-b758-a64b417097f0")
    USER_DEFINED_QUERY = UUID("018950a1-6773-79f3-8eb2-fba4356e23b9")
    VIDEO_FILE_INFORMATION = UUID("01895069-a9fa-734c-b669-fcf528f85c1e")
    WEB_ARCHIVE_TRANSFORMATION = UUID("01895066-11f7-7c35-af62-603955c6c20f")
    WEB_GRAPH = UUID("01895069-e74c-79de-8292-effb45265179")
    WORD_PROCESSING_FILE_INFORMATION = UUID("0189506a-d09d-7571-9d3c-a44698d58d39")


# Define the set of jobs that only work with WARC-type collections.
WARC_ONLY_JOB_IDS = {
    KnownArchJobUuids.AUDIO_FILE_INFORMATION,
    KnownArchJobUuids.DOMAIN_FREQUENCY,
    KnownArchJobUuids.DOMAIN_GRAPH,
    KnownArchJobUuids.IMAGE_FILE_INFORMATION,
    KnownArchJobUuids.IMAGE_GRAPH,
    KnownArchJobUuids.LONGITUDINAL_GRAPH,
    KnownArchJobUuids.NAMED_ENTITIES,
    KnownArchJobUuids.PDF_FILE_INFORMATION,
    KnownArchJobUuids.PLAIN_TEXT_OF_WEBPAGES,
    KnownArchJobUuids.PRESENTATION_FILE_INFORMATION,
    KnownArchJobUuids.SPREADSHEET_FILE_INFORMATION,
    KnownArchJobUuids.TEXT_FILE_INFORMATION,
    KnownArchJobUuids.USER_DEFINED_QUERY,
    KnownArchJobUuids.VIDEO_FILE_INFORMATION,
    KnownArchJobUuids.WEB_ARCHIVE_TRANSFORMATION,
    KnownArchJobUuids.WEB_GRAPH,
    KnownArchJobUuids.WORD_PROCESSING_FILE_INFORMATION,
}

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

# Define the DerivationOutput(Arch)/JobFile(Keystone) filenames for which Colab Notebooks exist.
SUPPORTED_COLAB_JOBFILE_FILENAMES = {
    "audio-information.csv.gz",
    "css-file-information.csv.gz",
    "domain-frequency.csv.gz",
    "domain-graph.csv.gz",
    "html-file-information.csv.gz",
    "image-graph.csv.gz",
    "image-information.csv.gz",
    "js-file-information.csv.gz",
    "json-file-information.csv.gz",
    "pdf-information.csv.gz",
    "plain-text-file-information.csv.gz",
    "powerpoint-information.csv.gz",
    "spreadsheet-information.csv.gz",
    "video-information.csv.gz",
    "web-graph.csv.gz",
    "web-pages.csv.gz",
    "word-document-information.csv.gz",
    "xml-file-information.csv.gz",
}
