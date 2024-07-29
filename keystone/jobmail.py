from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from config import settings

from keystone.context_processors import helpers


def send(template_base_name, context, subject, to):
    """Send a templated email."""
    txt_content = get_template(f"email/{template_base_name}.txt").render(context)
    html_content = get_template(f"email/{template_base_name}.html").render(context)
    msg = EmailMultiAlternatives(
        subject, txt_content, settings.DEFAULT_FROM_EMAIL, [to]
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()


def send_dataset_finished(request, job_complete):
    """Send a Dataset finished email."""
    job_start = job_complete.job_start
    user = job_start.user
    job_name = job_start.job_type.name
    collection_name = job_start.collection.name
    context = {
        "username": user.username,
        "job_name": job_name,
        "collection_name": collection_name,
        "dataset_url": helpers(request)["abs_url"](
            "dataset-detail", args=(job_start.dataset_set.first().id,)
        ),
        "support_url": settings.ARCH_SUPPORT_TICKET_URL,
    }
    subject = f"ARCH: Your {job_name} dataset from {collection_name} is ready to use"
    send("dataset-finished", context, subject, user.email)


def send_custom_collection_finished(request, job_complete):
    """Send a User-defined Query / Custom Collection finished email."""
    job_start = job_complete.job_start
    user = job_start.user
    collection = job_start.collection
    collection_name = collection.name
    context = {
        "username": user.username,
        "collection_name": collection_name,
        "collection_url": helpers(request)["abs_url"](
            "collection-detail", args=(collection.id,)
        ),
        "support_url": settings.ARCH_SUPPORT_TICKET_URL,
    }
    subject = f"ARCH: Your custom collection “{collection_name}” is ready to use"
    send("custom-collection-finished", context, subject, user.email)
