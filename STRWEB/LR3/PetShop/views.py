from decimal import Decimal
import json
import os
import urllib.parse
from django.db.models.functions import TruncDay
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, TemplateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages
from django.core.files.base import ContentFile
from .models import *
from django.db.models import Count, Sum, Q
from .forms import *
import requests
from django.shortcuts import render, get_object_or_404, redirect
import pandas as pd
from django.http import HttpResponseForbidden, JsonResponse
from functools import wraps
import logging
from matplotlib import pyplot as plt
import numpy as np
import io, urllib, base64

logger = logging.getLogger('django')


def aboutpage(request):
    company = Company.objects.first()
    return render(request, 'about.html', {'company': company})


def demopage(request):
    return render(request, 'demo.html')


def task8a(request):
    return render(request, 'task8a.html')


def task8b(request):
    return render(request, 'task8b.html')


def chart(request):
    return render(request, 'chart.html')


def employee_list(request):
    return render(request, 'employee-list.html')


def product_list_json(request):
    products = Product.objects.all().values()
    product_list = list(products)
    return JsonResponse(product_list, safe=False)


def contact_list_json(request):
    contacts = Contact.objects.all().values()
    contact_list = list(contacts)
    return JsonResponse(contact_list, safe=False)


def create_contact(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            contact = Contact(name=data.get('name'),
                              email=data.get('email'),
                              phone=data.get('phone'),
                              description=data.get('description'))
            
            image_url = data.get('photo')
            if image_url:
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    parsed_url = urllib.parse.urlparse(image_url)
                    filename = os.path.basename(parsed_url.path)

                    if not os.path.splitext(filename)[1]:
                        filename += ".jpg"
        
                    contact.photo.save(filename, ContentFile(response.content), save=False)

                    contact.save()

                return JsonResponse({"id": contact.id,
                                        "name": contact.name,
                                        "email": contact.email,
                                        "phone": contact.phone,
                                        "description": contact.description,
                                        "photo": contact.photo.url if contact.photo else None
                                    }, status=201)

        except Exception as e:
            contact.photo.url = 'http://127.0.0.1:8000/media/media/contacts/MikaelaMyers_nTJK3yt.jpg'
            contact.save()
            print(f"Error creating contact: {str(e)}")
            return JsonResponse({"Error": "Failed to create contact"}, status=400)


def payment_success(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.promocode = None
    cart.products.clear()
    cart.save()
    return render(request, 'payment-success.html')


class PolicyView(TemplateView):
    model = Policy
    template_name = 'policy.html'


class CartView(ListView):
    model = CartItem
    template_name = 'cart.html'
    context_object_name = 'cart_items'

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        cart_items = CartItem.objects.filter(cart=cart).select_related('product')
        
        query = self.request.GET.get('query', '')
        sort_by = self.request.GET.get('sort', 'product__title')

        logger.debug(f"Fetching cart items with query: '{query}' and sort by: '{sort_by}'")

        if query:
            cart_items = cart_items.filter(
                Q(product__title__icontains=query) |
                Q(product__description__icontains=query) |
                Q(product__price__icontains=query)
            )
            logger.debug(f"Filtered cart items count: {cart_items.count()}")

        total_price = sum(item.product.price * item.quantity for item in cart_items)
        
        if cart.promocode:
            discount = cart.promocode.discount / Decimal("100")
            total_price = total_price * (Decimal("1.00") - discount)

        context = {
            "total_price": round(total_price, 2),
            'cart': Cart.objects.get(user=self.request.user),
            'promocode': cart.promocode,
            'cart_items': cart_items
        }

        return render(request, "cart.html", context)


class ApplyPromoCodeView(TemplateView):
    def post(self, request):
        promocode = request.POST.get("promocode")
        cart = get_object_or_404(Cart, user=request.user)
        promo = PromoCode.objects.filter(code=promocode, status=True).first()

        if promo:
            cart.promocode = promo
            cart.save()
        else:
            cart.promocode = None
            cart.save()

        return redirect("cart")


def add_to_cart(request, pk):
    if not request.user.is_authenticated:
        return redirect('login') + f'?next={request.path}'
    
    product = get_object_or_404(Product, id=pk)
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    quantity = int(request.POST.get('quantity', 1))

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    
    messages.success(request, f"Added {quantity} {product.title} to your cart")
    return redirect('product-details', pk=pk)


def update_cart_item(request, pk):
    if not request.user.is_authenticated:
        return redirect('login')
    
    cart_item = get_object_or_404(CartItem, id=pk, cart__user=request.user)
    
    try:
        quantity = int(request.POST.get('quantity', 1))
    except ValueError:
        messages.error(request, "Invalid quantity")
        return redirect('cart')
    
    cart_item.quantity = quantity
    cart_item.save()
    messages.success(request, "Quantity updated")
    
    return redirect('cart')


def remove_from_cart(request, pk):
    if not request.user.is_authenticated:
        return redirect('login')
    
    cart_item = get_object_or_404(CartItem, id=pk, cart__user=request.user)
    cart_item.delete()
    messages.success(request, "Item removed from cart")
    return redirect('cart')


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
    form_class = SupplierAddOrUpdateForm
    model = Supplier
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


class ArticleCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Article
    fields = ['title', 'summary', 'content', 'image']
    template_name = 'article-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ArticleCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Article created by {self.request.user.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('article-list')


class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Article
    fields = ['title', 'summary', 'content', 'image']
    template_name = 'article-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ArticleUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Article updated by {CustomUser.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('article-list')


class ArticleDeleteView(DeleteView):
    model = Article
    template_name = 'article-confirm-delete.html'

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting article with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('article-list')


class FAQListView(ListView):
    model = FAQ
    template_name = 'faq-list.html'


class FAQCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = FAQ
    fields = ['question', 'answer']
    template_name = 'faq-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in FAQCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"FAQ created by {self.request.user.username}: {form.cleaned_data['question']}")
        return super().form_valid(form)

    success_url = reverse_lazy('faq-list')


class FAQUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = FAQ
    fields = ['question', 'answer']
    template_name = 'faq-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in FAQUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"FAQ updated by {CustomUser.username}: {form.cleaned_data['question']}")
        return super().form_valid(form)

    success_url = reverse_lazy('faq-list')


class FAQDeleteView(DeleteView):
    model = FAQ
    template_name = 'faq-confirm-delete.html'

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting faq with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('faq-list')


class ReviewListView(ListView):
    model = Review
    template_name = 'review-list.html'

    def get(self, request):
        user = self.request.user

        if ((user.is_authenticated is False) or user.is_staff):
            context = {
                "review": None,
                "canHaveReview": False,
                "hasReview": False,
                "reviews": Review.objects.all()
            }
            return render(request, "review-list.html", context)
        
        hasReview = Review.objects.filter(user=user).exists()
        context = {
            "review": Review.objects.filter(user=user).first(),
            "canHaveReview": True,
            "hasReview": hasReview,
            "reviews": Review.objects.all()
        }

        return render(request, "review-list.html", context)
    


class ReviewCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    form_class = ReviewForm
    model = Review
    template_name = 'review-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and Review.objects.filter(user=self.request.user).first() is None)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ReviewCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Review created by {self.request.user.username}: {form.cleaned_data['title']}")
        form.instance.user = self.request.user
        return super().form_valid(form)

    success_url = reverse_lazy('review-list')


class ReviewUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    form_class = ReviewForm
    model = Review
    template_name = 'review-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and Review.objects.get(pk=self.kwargs.get('pk'), user=self.request.user) is not None)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ReviewUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Review updated by {CustomUser.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('review-list')


class ReviewDeleteView(DeleteView):
    model = Review
    template_name = 'review-confirm-delete.html'

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting review with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('review-list')


class PromocodeListView(ListView):
    model = PromoCode
    template_name = 'promocode-list.html'


class PromocodeCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = PromoCode
    fields = ['code', 'discount', 'status']
    template_name = 'promocode-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in PromocodeCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Promocode created by {self.request.user.username}: {form.cleaned_data['code']}")
        return super().form_valid(form)

    success_url = reverse_lazy('promocode-list')


class PromocodeUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = PromoCode
    fields = ['code', 'discount', 'status']
    template_name = 'promocode-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in PromocodeUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Promocode updated by {CustomUser.username}: {form.cleaned_data['code']}")
        return super().form_valid(form)

    success_url = reverse_lazy('promocode-list')


class PromocodeDeleteView(DeleteView):
    model = PromoCode
    template_name = 'promocode-confirm-delete.html'

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting promocode with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('promocode-list')


class VacancyListView(ListView):
    model = Vacancy
    template_name = 'vacancy-list.html'


class VacancyCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Vacancy
    fields = ['title', 'description']
    template_name = 'vacancy-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in VacancyCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Vacancy created by {self.request.user.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('vacancy-list')


class VacancyUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Vacancy
    fields = ['title', 'description']
    template_name = 'vacancy-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in VacancyUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Vacancy updated by {CustomUser.username}: {form.cleaned_data['title']}")
        return super().form_valid(form)

    success_url = reverse_lazy('vacancy-list')


class VacancyDeleteView(DeleteView):
    model = Vacancy
    template_name = 'vacancy-confirm-delete.html'

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting vacancy with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('vacancy-list')


class ContactListView(ListView):
    model = Contact
    template_name = 'contact-list.html'


class ContactDetailView(DetailView):
    model = Contact
    template_name = 'contact-details.html'


class ContactCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    form_class = ContactAddOrUpdateForm
    model = Contact
    template_name = 'contact-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ContactCreateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Contact created by {self.request.user.username}: {form.cleaned_data['name']}")
        return super().form_valid(form)

    success_url = reverse_lazy('contact-list')


class ContactUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    form_class = ContactAddOrUpdateForm
    model = Contact
    template_name = 'contact-form.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ContactUpdateView")
        return has_permission

    def form_valid(self, form):
        logger.info(f"Contact updated by {CustomUser.username}: {form.cleaned_data['name']}")
        return super().form_valid(form)

    success_url = reverse_lazy('contact-list')


class ContactDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Contact
    template_name = 'contact-confirm-delete.html'

    def test_func(self):
        has_permission = (self.request.user.is_authenticated and self.request.user.is_staff)
        if not has_permission:
            logger.warning(f"User {self.request.user.username} failed to pass test_func in ContactDeleteView")
        return has_permission

    def delete(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is deleting contact with id {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)

    success_url = reverse_lazy('contact-list')


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

    banners = Banner.objects.all()
    latestNews = Article.objects.last()
    partners = Partner.objects.all()
    products = Product.objects.all()
    company = Company.objects.first()

    context = {
        "banners": banners,
        "latestNews": latestNews,
        "partners": partners,
        "company": company,
        "products": products
    }

    return render(request, 'home.html', context)