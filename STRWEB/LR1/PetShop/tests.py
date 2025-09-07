from django.test import TestCase, RequestFactory
from django.urls import reverse
from .views import *
from .models import *
from .forms import *
from datetime import date, timedelta
from django.utils import timezone
import datetime
from django.core.exceptions import ValidationError


class ArticleModelTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            title="Test article",
            content="Test article content",
            publish_date=timezone.now()
        )

    def test_article_creation(self):
        self.assertTrue(isinstance(self.article, Article))
        self.assertEqual(str(self.article), self.article.title)

    def test_get_local_time(self):
        formatted_time = self.article.get_local_time()
        self.assertIn(formatted_time[-8:],
                      str(self.article.publish_date.astimezone(get_localzone()).strftime('%H:%M:%S')))

    def test_get_utc_time(self):
        formatted_time = self.article.get_utc_time()
        self.assertIn(formatted_time[-8:], str(self.article.publish_date.astimezone(pytz.utc).strftime('%H:%M:%S')))


class CompanyModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(info="Company description")

    def test_company_creation(self):
        self.assertTrue(isinstance(self.company, Company))
        self.assertEqual(self.company.info, "Company description")


class ContactModelTest(TestCase):
    def setUp(self):
        self.contact = Contact.objects.create(
            phone="+375291112233",
            email="test@example.com",
            description="Contact description"
        )

    def test_phone_validation(self):
        self.contact.full_clean()

    def test_invalid_phone(self):
        self.contact.phone = "12345"
        with self.assertRaises(ValidationError):
            self.contact.full_clean()


class ReviewModelTest(TestCase):
    def setUp(self):
        user = CustomUser.objects.create_user(username="user1",
                                              password="testpass123",
                                              phone="+375291112233")
        self.review = Review.objects.create(
            user=user,
            rating=5,
            text="Great review",
            date=datetime.date.today()
        )

    def test_review_creation(self):
        self.assertTrue(isinstance(self.review, Review))
        self.assertEqual(self.review.rating, 5)


class CustomUserCreationFormTest(TestCase):
    def setUp(self):
        pass

    def test_birth_date_field_required(self):
        form = CustomUserCreationForm(data={
            'username': 'testuser',
            'password1': 'testpass123',
            'password2': 'testpass123',
            'is_staff': False,
            'phone' : '+375291112233',
        })
        self.assertFalse(form.is_valid())
        self.assertIn('birth_date', form.errors)

    def test_birth_date_validation_under_18(self):
        birth_date = date.today() - timedelta(days=17 * 365)
        form = CustomUserCreationForm(data={
            'username': 'testuser',
            'password1': 'testpass123',
            'password2': 'testpass123',
            'is_staff': False,
            'birth_date': birth_date,
            'phone' : '+375291112233',
        })
        self.assertFalse(form.is_valid())
        self.assertIn('birth_date', form.errors)
        self.assertEqual(form.errors['birth_date'], ['You must be at least 18 years old to register.'])

    def test_form_inherits_user_creation_fields(self):
        form = CustomUserCreationForm()
        self.assertIn('username', form.fields)
        self.assertIn('password1', form.fields)
        self.assertIn('password2', form.fields)
        self.assertIn('is_staff', form.fields)
        self.assertTrue(form.fields['phone'].required)


class ProductListViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

        self.product = Product.objects.create(
            title="Test",
            description="Nice test",
            price=1.1,
            part_number="111"
        )

    def test_product_list_view(self):
        request = self.factory.get(reverse('product-list'))
        response = ProductListView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test', response.rendered_content)


class ProductDetailViewTest(TestCase):
    def setUp(self):
        owner = CustomUser.objects.create_user(username='admin', password='test123', phone="+375251112233")

        self.product = Product.objects.create(
            title="Test",
            description="Nice test",
            price=1.1,
            part_number="111"
        )

    def test_login_required(self):
        response = self.client.get(reverse('product-details', kwargs={'pk': self.product.pk}))
        self.assertEqual(response.status_code, 302)

    def test_detail_view(self):
        self.client.login(username='admin', password='test123')
        response = self.client.get(reverse('product-details', kwargs={'pk': self.product.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test', response.content.decode())


class ProductCreateViewTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='admin', password='12345', is_staff=True, phone='+375251112233')
        self.client.login(username='admin', password='12345')

    def test_form_display(self):
        response = self.client.get(reverse('product-create'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('form', response.context)

    def test_create_property(self):
        post_data = {
            'title' : 'Test',
            'description' : 'Nice test',
            'price' : '1.1',
            'part_number' : '111'
        }
        response = self.client.post(reverse('product-create'), post_data)
        self.assertEqual(response.status_code, 200)