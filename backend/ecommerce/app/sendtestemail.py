from django.core.management.base import BaseCommand
from django.core.mail import send_mail

class Command(BaseCommand):
    help = 'Send a test email using configured SMTP settings'

    def handle(self, *args, **kwargs):
        try:
            send_mail(
                subject='Test Email from Django',
                message='This is a test email sent via Gmail SMTP setup.',
                from_email='prakashsm940@gmail.com',           # 🔁 Replace with your Gmail
                recipient_list=['arunprakashsekar2005@gmail.com'],     # 🔁 Replace with any test email
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS('✅ Test email sent successfully.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Failed to send email: {e}'))
