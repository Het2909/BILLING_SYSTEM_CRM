import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DEMO_USERNAME")
password = os.environ.get("DEMO_PASSWORD")
email = os.environ.get("DEMO_EMAIL", "demo@example.com")

if not username or not password:
    raise RuntimeError("DEMO_USERNAME and DEMO_PASSWORD must be configured")

user, created = User.objects.get_or_create(
    username=username,
    defaults={"email": email},
)

user.email = email
user.set_password(password)
user.save()

print("Demo user created." if created else "Demo user password updated.")