from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product,Order,OrderItem,Shippingaddress
from rest_framework_simplejwt.tokens import RefreshToken
from cloudinary.utils import cloudinary_url

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        if not obj.image:
            return None
        try:
            url = obj.image.url
        except Exception:
            url = str(obj.image)

        # Force HTTPS (in case Cloudinary or local dev uses http)
        if url.startswith("http://"):
            url = url.replace("http://", "https://", 1)

        return url




 
class UserSerializer(serializers.ModelSerializer):
    first_name=serializers.SerializerMethodField(read_only=True)
    last_name=serializers.SerializerMethodField(read_only=True)
    id=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','isAdmin']

    def get_first_name(self,obj):
        return obj.first_name if obj.first_name else obj.username
    
    def get_last_name(self,obj):
        return obj.last_name if obj.last_name else obj.username

    def get_id(self,obj):
        return obj.id

    def get_isAdmin(self,obj):
        return obj.is_staff    



class UserSerializerWithToken(UserSerializer):
    token=serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','isAdmin','token']

    def get_token(self,obj):
        token=RefreshToken.for_user(obj)
        return str(token.access_token)
    
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderItem
        fields='__all__'
class ShippingaddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Shippingaddress
        fields='__all__'

class OrderSerializer(serializers.ModelSerializer):
    orderItems=serializers.SerializerMethodField(read_only=True)
    shippingAddress=serializers.SerializerMethodField(read_only=True)
    user=serializers.SerializerMethodField(read_only=True)
    createdAt = serializers.DateTimeField(read_only=True)
    class Meta:
        model=Order
        fields='__all__'

    def get_orderItems(self,obj):
        items=obj.orderitem_set.all()
        serializer=OrderItemSerializer(items,many=True)
        return serializer.data
     
    def get_shippingAddress(self,obj):
        try:
            address=ShippingaddressSerializer(
                obj.shippingaddress,many=False
            ).data

        except:
            address=False
        return address 

    def get_user(self,obj):
        user=obj.user
        serializer=UserSerializer(user,many=False)
        return serializer.data   



