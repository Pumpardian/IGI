"""
URL configuration for Lab5 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from django.urls import re_path
import PetShop.views as views

urlpatterns = [
                  path('', views.homepage, name="homepage"),
                  path('home', views.homepage, name="homepage"),
                  path('demo/', views.demopage, name='demo'),
                  path('payment/', views.payment_success, name='payment-success'),

                  path('signup/', views.SignUpView.as_view(), name='signup'),
                  path('admin/', admin.site.urls),

                  path('about/', views.aboutpage, name='about'),
                  path('policy/', views.PolicyView.as_view(), name='policy'),

                  path('cart/', views.CartView.as_view(), name='cart'),
                  path("cart/apply-promo/", views.ApplyPromoCodeView.as_view(), name="apply-promocode"),
                  re_path(r'^cart/(?P<pk>\d+)/update/$', views.update_cart_item, name='update-cart-item'),
                  re_path(r'^cart/(?P<pk>\d+)/remove/$', views.remove_from_cart, name='remove-from-cart'),

                  path('products/', views.ProductListView.as_view(), name='product-list'),
                  re_path(r'^products/(?P<pk>\d+)/$', views.ProductDetailsView.as_view(), name='product-details'),
                  path('products/new/', views.ProductCreateView.as_view(), name='product-create'),
                  re_path(r'^products/(?P<pk>\d+)/edit/$', views.ProductUpdateView.as_view(), name='product-update'),
                  re_path(r'^products/(?P<pk>\d+)/add-to-cart/$', views.add_to_cart, name='add-to-cart'),
                  re_path(r'^products/(?P<pk>\d+)/delete/$', views.ProductDeleteView.as_view(), name='product-delete'),

                  path('acquisitions/', views.AcquisitionListView.as_view(), name='acquisition-list'),
                  re_path(r'^acquisitions/(?P<pk>\d+)/$', views.AcquisitionDetailsView.as_view(), name='acquisition-details'),
                  path('acquisitions/new/', views.AcquisitionCreateView.as_view(), name='acquisition-create'),
                  re_path(r'^acquisitions/(?P<pk>\d+)/edit/$', views.AcquisitionUpdateView.as_view(), name='acquisition-update'),
                  re_path(r'^acquisitions/(?P<pk>\d+)/delete/$', views.AcquisitionDeleteView.as_view(), name='acquisition-delete'),

                  path('suppliers/', views.SupplierListView.as_view(), name='supplier-list'),
                  path('suppliers/new/', views.SupplierCreateView.as_view(), name='supplier-create'),
                  re_path(r'^suppliers/(?P<pk>\d+)/edit/$', views.SupplierUpdateView.as_view(), name='supplier-update'),
                  re_path(r'^suppliers/(?P<pk>\d+)/delete/$', views.SupplierDeleteView.as_view(), name='supplier-delete'),

                  path('articles/', views.ArticleListView.as_view(), name='article-list'),
                  re_path(r'^articles/(?P<pk>\d+)/$',
                          views.ArticleDetailView.as_view(), name='article-details'),

                  path('articles/new', views.ArticleCreateView.as_view(), name='article-create'),
                  re_path(r'^articles/(?P<pk>\d+)/edit/$',
                          views.ArticleUpdateView.as_view(), name='article-update'),
                  re_path(r'^articles/(?P<pk>\d+)/delete/$',
                          views.ArticleDeleteView.as_view(), name='article-delete'),

                  path('faq/', views.FAQListView.as_view(), name='faq-list'),
                  path('faq/new/', views.FAQCreateView.as_view(), name='faq-create'),
                  re_path(r'^faq/(?P<pk>\d+)/edit/$', views.FAQUpdateView.as_view(), name='faq-update'),
                  re_path(r'^faq/(?P<pk>\d+)/delete/$', views.FAQDeleteView.as_view(), name='faq-delete'),

                  path('vacancies/', views.VacancyListView.as_view(), name='vacancy-list'),
                  path('vacancies/new/', views.VacancyCreateView.as_view(), name='vacancy-create'),
                  re_path(r'^vacancies/(?P<pk>\d+)/edit/$', views.VacancyUpdateView.as_view(), name='vacancy-update'),
                  re_path(r'^vacancies/(?P<pk>\d+)/delete/$', views.VacancyDeleteView.as_view(), name='vacancy-delete'),

                  path('contacts/', views.ContactListView.as_view(), name='contact-list'),
                  path('contacts/new/', views.ContactCreateView.as_view(), name='contact-create'),
                  re_path(r'^contacts/(?P<pk>\d+)/edit/$', views.ContactUpdateView.as_view(), name='contact-update'),
                  re_path(r'^contacts/(?P<pk>\d+)/delete/$', views.ContactDeleteView.as_view(), name='contact-delete'),

                  path('reviews/', views.ReviewListView.as_view(), name='review-list'),
                  path('reviews/new/', views.ReviewCreateView.as_view(), name='review-create'),
                  re_path(r'^reviews/(?P<pk>\d+)/edit/$', views.ReviewUpdateView.as_view(), name='review-update'),
                  re_path(r'^reviews/(?P<pk>\d+)/delete/$', views.ReviewDeleteView.as_view(), name='review-delete'),

                  path('promocodes/', views.PromocodeListView.as_view(), name='promocode-list'),
                  path('promocodes/new/', views.PromocodeCreateView.as_view(), name='promocode-create'),
                  re_path(r'^promocodes/(?P<pk>\d+)/edit/$', views.PromocodeUpdateView.as_view(), name='promocode-update'),
                  re_path(r'^promocodes/(?P<pk>\d+)/delete/$', views.PromocodeDeleteView.as_view(), name='promocode-delete'),

                  path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
                  path('logout/', auth_views.LogoutView.as_view(), name='logout'),

                  path('currency-rates/', views.currency_rates_view, name='currency-rates'),
                  path('statistics/', views.StatisticsView.as_view(), name='statistics'),

                  path('task8a/', views.task8a, name='task8a'),
                  path('task8b/', views.task8b, name='task8b'),
                  path('chart/', views.chart, name='chart')
              ] + static(views.settings.MEDIA_URL, document_root=views.settings.MEDIA_ROOT)
