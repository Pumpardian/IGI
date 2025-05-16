import urllib.parse
from django.db.models.functions import TruncDay
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, TemplateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from .models import *
from django.db.models import Count, Sum, Q
from .forms import *
import requests
from django.shortcuts import render
import pandas as pd
from django.http import HttpResponseForbidden
from functools import wraps
import logging
from matplotlib import pyplot as plt
import numpy as np
import io, urllib, base64

logger = logging.getLogger('django')


def aboutpage(request):
    company = Company.objects.first()
    return render(request, 'about.html', {'company': company})


class PolicyView(TemplateView):
    model = Policy
    template_name = 'policy.html'


class ProductListView(ListView):
    model = Product
    template_name = 'product-list.html'

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.GET.get('query', '')
        sort_by = self.request.GET.get('sort', 'title')

        logger.debug(f"Fetching products with query: '{query}' and sort by: '{sort_by}'")
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(price__icontains=query)
            )
            logger.debug(f"Filtered products count: {queryset.count()}")

        return queryset.order_by(sort_by)


class ProductDetailsView(LoginRequiredMixin, DetailView):
    model = Product
    template_name = 'product-details.html'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            logger.warning("Attempt to access ProductDetailsView without authentication")
            return self.handle_no_permission()
        logger.info(f"User {request.user.username} accessed ProductDetailsView")
        return super().dispatch(request, *args, **kwargs)


class ProductCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Product
    fields = ['title', 'description', 'price', 'type', 'photo', 'part_number', 'suppliers']
    template_name = 'product-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ProductCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Product created by {self.request.user.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('product-list')


class ProductUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Product
    fields = ['title', 'description', 'price', 'type', 'photo', 'part_number', 'suppliers']
    template_name = 'product-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ProductUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Product updated by {CustomUser.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('product-list')


class ProductDeleteView(DeleteView):
    model = Product
    template_name = 'product-confirm-delete.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ProductDeleteView")
        return has_permission

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting product with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('product-list')


class SupplierListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = Supplier
    template_name = 'supplier-list.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in SupplierListView")
        return has_permission

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.GET.get('query', '')
        sort_by = self.request.GET.get('sort', 'name')

        logger.debug(f"Fetching products with query: '{query}' and sort by: '{sort_by}'")
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(contact_phone__icontains=query) |
                Q(address__icontains=query)
            )
            logger.debug(f"Filtered products count: {queryset.count()}")

        return queryset.order_by(sort_by)


class SupplierCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    form_class = SupplierAddOrUpdateForm
    model = Supplier
    fields = ['name', 'address']
    template_name = 'supplier-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in SupplierCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Supplier created by {self.request.user.username}: {form.cleaned_data['name']}")
        return super().form_valid(form)

    success_url = reverse_lazy('supplier-list')


class SupplierUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Supplier
    fields = ['name', 'contact_phone', 'address']
    template_name = 'supplier-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in SupplierUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Supplier updated by {CustomUser.username}: {form.cleaned_data['name']}")
        return super().form_valid(form)

    success_url = reverse_lazy('supplier-list')


class SupplierDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Supplier
    template_name = 'supplier-confirm-delete.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in SupplierDeleteView")
        return has_permission

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting supplier with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('supplier-list')


class AcquisitionListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = Acquisition
    template_name = 'acquisition-list.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in AcquisitionListView")
        return has_permission

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.GET.get('query', '')
        sort_by = self.request.GET.get('sort', 'part_number')

        logger.debug(f"Fetching acquisitions with query: '{query}' and sort by: '{sort_by}'")
        if query:
            queryset = queryset.filter(
                Q(part_number__icontains=query) |
                Q(supplier__icontains=query) |
                Q(date__icontains=query)
            )
            logger.debug(f"Filtered acquisitions count: {queryset.count()}")

        return queryset.order_by(sort_by)


class AcquisitionDetailsView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = Acquisition
    template_name = 'acquisition-details.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in AcquisitionDetailsView")
        return has_permission

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            logger.warning("Attempt to access AcquisitionDetailsView without authentication")
            return self.handle_no_permission()
        logger.info(f"User {request.user.username} accessed AcquisitionDetailsView")
        return super().dispatch(request, *args, **kwargs)


class AcquisitionCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Acquisition
    fields = ['part_number', 'supplier', 'amount', 'sale_price', 'price']
    template_name = 'acquisition-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in AcquisitionCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Acquisition created by {self.request.user.username}: {form.cleaned_data['part_number']}")
        return super().form_valid(form)

    success_url = reverse_lazy('acquisition-list')


class AcquisitionUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Acquisition
    fields = ['part_number', 'supplier', 'amount', 'sale_price', 'price']
    template_name = 'acquisition-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in AcquisitionUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Acquisition updated by {CustomUser.username}: {form.cleaned_data['part_number']}")
        return super().form_valid(form)

    success_url = reverse_lazy('acquisition-list')


class AcquisitionDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Acquisition
    template_name = 'acquisition-confirm-delete.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in AcquisitionDeleteView")
        return has_permission

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting acquisition with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('acquisition-list')


class ArticleListView(ListView):
    model = Article
    template_name = 'article-list.html'


class ArticleDetailView(DetailView):
    model = Article
    template_name = 'article-details.html'


# LEAVE THAT THING UNTIL STR-WEB 
#
# class ArticleCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
#     model = Article
#     fields = ['title', 'content', 'image']
#     template_name = 'article-form.html'

#     def test_func(self):
#         has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
#         if not has_permission:
#             logger.warning(f"User {self.request.user.username} failed to pass test_func in ArticleCreateView")
#         return has_permission

#     def form_valid(self, form):
#         logger.info(f"Article created by {self.request.user.username}: {form.cleaned_data['title']}")
#         return super().form_valid(form)

#     success_url = reverse_lazy('article-list')


# class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
#     model = Article
#     fields = ['title', 'content', 'image']
#     template_name = 'article-form.html'

#     def test_func(self):
#         has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
#         if not has_permission:
#             logger.warning(f"User {self.request.user.username} failed to pass test_func in ArticleUpdateView")
#         return has_permission

#     def form_valid(self, form):
#         logger.info(f"Article updated by {CustomUser.username}: {form.cleaned_data['title']}")
#         return super().form_valid(form)

#     success_url = reverse_lazy('article-list')


# class ArticleDeleteView(DeleteView):
#     model = Article
#     template_name = 'article-confirm-delete.html'

#     def delete(self, request, *args, **kwargs):
#         logger.info(f"User {request.user.username} is deleting article with id {kwargs.get('pk')}")
#         return super().delete(request, *args, **kwargs)

#     success_url = reverse_lazy('article-list')


class FAQListView(ListView):
    model = FAQ
    template_name = 'faq-list.html'


class FAQDetailView(DetailView):
    model = FAQ
    template_name = 'faq-details.html'


class ReviewListView(ListView):
    model = Review
    template_name = 'review-list.html'


class ReviewDetailView(DetailView):
    model = Review
    template_name = 'review-details.html'


class PromocodeListView(ListView):
    model = PromoCode
    template_name = 'promocode-list.html'


class VacancyListView(ListView):
    model = Vacancy
    template_name = 'vacancy-list.html'


class VacancyDetailView(DetailView):
    model = Vacancy
    template_name = 'vacancy-details.html'


class ContactListView(ListView):
    model = Contact
    template_name = 'contact-list.html'


class ContactDetailView(DetailView):
    model = Contact
    template_name = 'contact-details.html'


class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'

def staff_only():
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return HttpResponseForbidden()
            if request.user.is_staff:
                return view_func(request, *args, **kwargs)
            return HttpResponseForbidden("You don't have permission to access this page.")
        return _wrapped_view
    return decorator


class StatisticsView(TemplateView):
    template_name = 'statistics.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        users = CustomUser.objects.filter(birth_date__isnull=False)

        today = date.today()
        ages = [today.year - user.birth_date.year - (
                (today.month, today.day) < (user.birth_date.month, user.birth_date.day)) for user in users]

        df_users = pd.DataFrame(ages, columns=['age'])
        context['average_age'] = df_users['age'].mean()
        context['median_age'] = df_users['age'].median()

        context['most_popular_type'] = ProductType.objects.annotate(count=Count('product')).order_by('-count').first()
        context['most_expensive_type'] = ProductType.objects.annotate(total_income=Sum('product__price')).order_by(
            '-total_income').first()

        reviews = Review.objects.all()
        rates = [0,0,0,0,0]
        for review in reviews:
            rates[review.rating-1] += 1

        plt.bar(range(1,6), rates,
                 label = ['red', 'orange', 'yellow', 'green', 'blue'],
                 color = ['red', 'orange', 'yellow', 'green', 'blue'], edgecolor="black")
        plt.yticks(np.arange(max(rates)+1), np.arange(max(rates)+1).astype(int))
        fig = plt.gcf()
        buf = io.BytesIO()
        fig.savefig(buf,format='png')
        buf.seek(0)
        string = base64.b64encode(buf.read())
        uri = urllib.parse.quote(string)
        context['hist'] = uri
        plt.close()
        return context


def get_currency_rate(cur_code):
    url = f"https://api.nbrb.by/exrates/rates/{cur_code}?parammode=2"
    response = requests.get(url)
    response.raise_for_status()
    rate_info = response.json()
    return rate_info['Cur_OfficialRate'], rate_info['Cur_Scale']


@staff_only()
def currency_rates_view(request):
    usd_rate, usd_scale = get_currency_rate('USD')
    eur_rate, eur_scale = get_currency_rate('EUR')
    return render(request, 'currency-rates.html', {
        'usd_rate': usd_rate,
        'eur_rate': eur_rate
    })


def cat_fact(request):
    response = requests.get('https://catfact.ninja/fact')
    facts = response.json()
    data = facts['fact']
    messages.info(request, data)

def homepage(request):
    cat_fact(request)
    return render(request, 'home.html')