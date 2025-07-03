from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from tzlocal import get_localzone
import pytz
import phonenumbers


class Article(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    publish_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='media/articles/')

    def __str__(self):
        return self.title

    def get_local_time(self):
        local_timezone = get_localzone()
        local_time = self.publish_date.astimezone(local_timezone)
        return local_time.strftime('%d-%m-%Y %H:%M:%S')
    
    def get_utc_time(self):
        localtime = self.publish_date.astimezone(pytz.utc)
        return localtime.strftime('%d-%m-%Y %H:%M:%S')
    

class Company(models.Model):
    info = models.TextField()


class FAQ(models.Model):
    question = models.CharField(max_length=100)
    answer = models.TextField()
    addition_date = models.DateTimeField(auto_now_add=True)

    def get_local_time(self):
        local_timezone = get_localzone()
        local_time = self.addition_date.astimezone(local_timezone)
        return local_time.strftime('%d-%m-%Y %H:%M:%S')
    
    def get_utc_time(self):
        localtime = self.addition_date.astimezone(pytz.utc)
        return localtime.strftime('%d-%m-%Y %H:%M:%S')
    
    def __str__(self):
        return self.question


class Contact(models.Model):
    photo = models.ImageField(upload_to='media/contacts/', blank=True)
    description = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()

    def clean(self):
        try:
            phone_number = phonenumbers.parse(self.phone, 'BY')
            if not phonenumbers.is_valid_number(phone_number):
                raise ValidationError("Invalid phone number")
            
            self.phone = phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except phonenumbers.NumberParseException:
            raise ValidationError("Phone number format should be +375 (25) XXX-XX-XX")
        
    def __str__(self):
        return f"{self.email} {self.phone}"
        

class Policy(models.Model):
    ...


class Vacancy(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title

class Review(models.Model):
    RATINGS = (
        (1, '1 star'),
        (2, '2 stars'),
        (3, '3 stars'),
        (4, '4 stars'),
        (5, '5 stars'),
    )
    
    title = models.CharField(max_length=50)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATINGS)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def get_local_time(self):
        local_timezone = get_localzone()
        local_time = self.date.astimezone(local_timezone)
        return local_time.strftime('%d-%m-%Y %H:%M:%S')
    
    def get_utc_time(self):
        localtime = self.date.astimezone(pytz.utc)
        return localtime.strftime('%d-%m-%Y %H:%M:%S')
    
    def __str__(self):
        return self.title


class Supplier(models.Model):
    name = models.CharField(max_length=20)
    contact_phone = models.CharField(max_length=20)
    address = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class PromoCode(models.Model):
    code = models.CharField(max_length=50)
    status = models.BooleanField()

    def __str__(self):
        return self.code


class ProductType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.ForeignKey(ProductType, on_delete=models.SET_NULL, null=True)
    part_number = models.CharField(max_length=20)
    suppliers = models.ManyToManyField(Supplier, related_name='products')
    photo = models.ImageField(upload_to='media/')

    def get_suppliers(self):
        return "\n".join([s.name for s in self.suppliers.all()])
    
    def __str__(self):
        return self.title
    

class CustomUser(AbstractUser):
    is_staff = models.BooleanField(default=False)
    birth_date = models.DateField(null=True)
    phone = models.CharField(max_length=20)

    def clean(self):
        try:
            phone_number = phonenumbers.parse(self.phone, 'BY')
            if not phonenumbers.is_valid_number(phone_number):
                raise ValidationError("Invalid phone number")
            
            self.phone = phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except phonenumbers.NumberParseException:
            raise ValidationError("Phone number format should be +375 (25) XXX-XX-XX")


class Cart(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='carts')
    products = models.ManyToManyField(Product, through='CartItem', related_name='carts')

    def __str__(self):
        return f"{self.user.username}'s cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"


class Acquisition(models.Model):
    part_number = models.CharField(max_length=20)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    amount = models.IntegerField()
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def get_local_time(self):
        local_timezone = get_localzone()
        local_time = self.date.astimezone(local_timezone)
        return local_time.strftime('%d-%m-%Y %H:%M:%S')
    
    def get_utc_time(self):
        localtime = self.date.astimezone(pytz.utc)
        return localtime.strftime('%d-%m-%Y %H:%M:%S')
    
    def __str__(self):
        return self.part_number