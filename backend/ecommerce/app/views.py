from django.shortcuts import render
# from django.http import JsonResponse
# from .products import products
from rest_framework.response import Response  # pyright: ignore[reportMissingImports]
from rest_framework.decorators import api_view,permission_classes # pyright: ignore[reportMissingImports]
from .models import Product,Order,OrderItem,Shippingaddress
from .serializer import ProductSerializer,UserSerializerWithToken,OrderSerializer,UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  # pyright: ignore[reportMissingImports]
from rest_framework_simplejwt.views import TokenObtainPairView  # pyright: ignore[reportMissingImports]
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated,IsAdminUser  # pyright: ignore[reportMissingImports]
from django.views.decorators.csrf import csrf_exempt
#for Email Purpose and verifying Emails*
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import force_bytes,force_text,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
from .utils import TokenGenerator,generate_token
from rest_framework import status  # pyright: ignore[reportMissingImports]
from django.core.exceptions import ObjectDoesNotExist
from .tokens import generate_token
from django.contrib.auth.tokens import default_token_generator 
from django.utils.encoding import force_bytes, force_str, DjangoUnicodeDecodeError


# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    myapis=[
        {
            "products":'http://127.0.0.1:8000/api/products/',
            "product":'http://127.0.0.1:8000/api/product/1',
            "login":'http://127.0.0.1:8000/api/users/login',
            "signup":'http://127.0.0.1:8000/api/users/register',
            "getuesers":'http://127.0.0.1:8000/api/users/getallusers/',
            "allorders":'http://127.0.0.1:8000/api/orders/'
        }
    ]
      


    return Response(myapis)

@api_view(['GET'])
def getProducts(request):
    products=Product.objects.all()
    serialize=ProductSerializer(products,many=True)
    return Response(serialize.data)

@api_view(['GET'])
def getProduct(request, pk):
    product=Product.objects.get(id=pk)
    serialize=ProductSerializer(product,many=False)
    return Response(serialize.data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data=super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        data['name'] = self.user.first_name
        data['isAdmin'] = self.user.is_staff  # <- make sure this is included
        data['email'] = self.user.email
        for k,v in serializer.items():
            data[k]=v
        return data    
  
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # Create inactive user
        user = User.objects.create(
            first_name=data['fname'],
            last_name=data['lname'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=True
        )

        # Generate uid + token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Activation link (⚡ important fix here)
        activation_link = f"{settings.FRONTEND_URL}/activate/{uid}/{token}/"

        # Send email
        email_subject = "Activate Your Account"
        message = render_to_string("activate.html", {
            'user': user,
            'activation_link': activation_link
        })

        email_message = EmailMessage(
            email_subject,
            message,
            settings.EMAIL_HOST_USER,
            [data['email']]
        )
        email_message.content_subtype = 'html'
        email_message.send()

        return Response({"details": f"Activation email sent to {data['email']}. Please check your inbox."})
    except Exception as e:
        return Response({"details": f"Signup failed: {str(e)}"})





class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, "activatesuccess.html")
        else:
            return render(request, "activatefail.html")   
                       

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    print("Request Headers:", request.headers)
    print("Authenticated user:", request.user)  
    user=request.user
    data=request.data
    orderItems=data['orderItems']
    if orderItems and len(orderItems)==0:
        return Response({'details':"No Order Items"},status=status.HTTP_400_BAD_REQUEST)
    

    # 1. Create Order
    order=Order.objects.create(
        user=user,
        # paymentMethod=data['paymentMethod'],
        paymentMethod='Cash on Delivery',
        taxPrice=data['taxPrice'],
        shippingPrice=data['shippingPrice'],
        totalPrice=data['totalPrice'],
    )

    # 2. Create Shipping Address
    shipping=Shippingaddress.objects.create(
        order=order,
        address=data['shippingAddress']['address'],
        city=data['shippingAddress']['city'],
        postalCode=data['shippingAddress']['postalCode'],
        country=data['shippingAddress']['country']
    )

    # 3. Create the Order Items and set order-orderItem relationship

    for i in orderItems:
        product=Product.objects.get(id=i['product'])
        item=OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i['qty'],
            price=i['price'],
            image=product.image.url
        )

        # 4. Update the Stock

        product.countInStock-=item.qty
        product.save()
    serializer=OrderSerializer(order,many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user=request.user
    orders=user.order_set.all()
    serializer=OrderSerializer(orders,many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders=Order.objects.all()
    serializer=OrderSerializer(orders,many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'details': "Not authorized to view this order"}, status=status.HTTP_403_FORBIDDEN)
    except ObjectDoesNotExist:
        return Response({'details': "Order does not exist"}, status=status.HTTP_404_NOT_FOUND)

  
# Admin Views
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user=request.user

    product=Product.objects.create(
        user=user,
        name='sample name',
        price=0,
        brand='sample brand',
        countInStock=0,
        category='sample category',
        description='',
    )
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data=request.data
    product=Product.objects.get(id=pk)
    product.name=data['name']
    product.price=data['price']
    product.brand=data['brand']
    product.countInStock=data['countInStock']
    product.category=data['category']
    product.description=data['description']
    product.save()
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data=request.data
    product_id=data['product_id']
    product=Product.objects.get(id=product_id)
    product.image=request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    try:
        product = Product.objects.get(id=pk)
        product.delete()
        return Response({'detail': 'Product is deleted successfully'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users=User.objects.all()
    serializer=UserSerializer(users,many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request,pk):
    user=User.objects.get(id=pk)
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user=request.user
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user=request.user
    serializer=UserSerializerWithToken(user,many=False)
    data=request.data
    user.first_name=data['fname']
    user.last_name=data['lname']
    if data['password']!='':
        user.password=make_password(data['password'])
    user.save()
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request,pk):
    user=User.objects.get(id=pk)
    user.delete()
    return Response('User is Deleted...')




@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

    data = request.data

    user.first_name = data.get('name', user.first_name)
    user.email = data.get('email', user.email)
    user.username = user.email  
    user.is_staff = data.get('isAdmin', user.is_staff)  

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)
