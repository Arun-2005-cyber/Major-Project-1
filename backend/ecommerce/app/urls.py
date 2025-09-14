from django.urls import path
from rest_framework_simplejwt.views import (  # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views   # 👈 relative import
from .views import MyTokenObtainPairView   # 👈 relative import

urlpatterns = [
    path('', views.getRoutes, name="getRoutes"),
    path('products/', views.getProducts, name="getProducts"),
    path('product/<str:pk>', views.getProduct, name="getProduct"),

    # Authentication
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='register'),
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate'),

    # Orders
    path('orders/add/', views.addOrderItems, name='order_add'),
    path('orders/', views.getOrders, name='orders'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),

    # Admin Product Management
    path('products/create/', views.createProduct, name='product-create'),
    path('products/update/<str:pk>/', views.updateProduct, name='product-update'),
    path('products/delete/<str:pk>/', views.deleteProduct, name='product-delete'),
    path('products/upload/', views.uploadImage, name='image-upload'),

    # Admin User Management
    path('users/getallusers/', views.getUsers, name='users'),
    path('users/update/<str:pk>/', views.updateUser, name='updateUser'),
    path('users/delete/<str:pk>/', views.deleteUser, name='deleteUser'),
    path('users/<int:pk>/', views.getUserById, name='getUserById'),

    # User Profile
    path('users/profile/', views.getUserProfile, name='getUserProfile'),
    path('users/profile/update/', views.updateUserProfile, name='updateUserProfile'),
]
