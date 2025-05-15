from datetime import date
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.forms.widgets import DateInput
from .models import CustomUser, Supplier
import phonenumbers

class CustomUserCreationForm(UserCreationForm):
    birth_date = forms.DateField(
        widget=DateInput(attrs={'type': 'date', 'min': '1900-01-01', 'required': 'required', 'input_format' : '%d-%m-%Y'}),
    )
    phone = forms.CharField(max_length=20)

    class Meta:
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('is_staff', 'birth_date', 'phone')

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        self.fields['birth_date'].required = True
        self.fields['phone'].required = True

    def clean_birth_date(self):
        birth_date = self.cleaned_data['birth_date']
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if age < 18:
            raise ValidationError("You must be at least 18 years old to register.")
        return birth_date
    
    def clean_phone(self):
        phone = self.cleaned_data['phone']
        try:
            phone_number = phonenumbers.parse(phone, 'BY')
            if not phonenumbers.is_valid_number(phone_number):
                raise ValidationError("Invalid phone number")
            
            self.phone = phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except phonenumbers.NumberParseException:
            raise ValidationError("Phone number format should be +375 (25) XXX-XX-XX")
        return phone
    

class SupplierAddOrUpdateForm(forms.forms.Form):
    contact_phone = forms.CharField(max_length=20)

    class Meta:
        model = Supplier
        fields = ('contact_phone',)

    def __init__(self, *args, **kwargs):
        super(SupplierAddOrUpdateForm, self).__init__(*args, **kwargs)
        self.fields['contact_phone'].required = True

    def clean_phone(self):
        contact_phone = self.cleaned_data['contact_phone']
        try:
            phone_number = phonenumbers.parse(contact_phone, 'BY')
            if not phonenumbers.is_valid_number(phone_number):
                raise ValidationError("Invalid phone number")
            
            self.contact_phone = phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except phonenumbers.NumberParseException:
            raise ValidationError("Phone number format should be +375 (25) XXX-XX-XX")
        return contact_phone