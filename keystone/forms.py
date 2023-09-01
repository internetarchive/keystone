from django.contrib.auth import password_validation
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django import forms
from django.utils.translation import gettext_lazy as _


class KeystonePasswordResetForm(PasswordResetForm):
    """Override stock Django PasswordResetForm to add autofocus to the email
    field.
    """

    email = forms.EmailField(
        label=_("Email"),
        max_length=254,
        widget=forms.EmailInput(attrs={"autocomplete": "email", "autofocus": ""}),
    )


class KeystoneSetPasswordForm(SetPasswordForm):
    """Override stock Django SetPasswordForm to add autofocus to the
    new_password1 field.
    """

    new_password1 = forms.CharField(
        label=_("New password"),
        widget=forms.PasswordInput(
            attrs={"autocomplete": "new-password", "autofocus": ""}
        ),
        strip=False,
        help_text=password_validation.password_validators_help_text_html(),
    )


class CSVUploadForm(forms.Form):
    """Form for uploading a csv file"""

    csv_file = forms.FileField(label="Upload CSV")
