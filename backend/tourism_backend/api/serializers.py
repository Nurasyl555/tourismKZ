from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Attraction, Region, Category, Review, Route, RouteStop, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'avatar', 'bio', 'country']

class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    attraction_name = serializers.ReadOnlyField(source='attraction.name')

    class Meta:
        model = Review
        fields = ['id', 'author_name', 'attraction', 'attraction_name', 'rating', 'text', 'created_at', 'status', 'rejection_reason']
        read_only_fields = ['status', 'rejection_reason', 'author', 'created_at']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class AttractionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    region_name = serializers.ReadOnlyField(source='region.name')
    rating = serializers.ReadOnlyField(source='average_rating')
    reviews_count = serializers.IntegerField(source='reviews.count', read_only=True)

    class Meta:
        model = Attraction
        fields = '__all__'

class RouteStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStop
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = '__all__'

# ... (предыдущие импорты)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        # Используем create_user, чтобы пароль хешировался корректно
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Создаем профиль для нового пользователя
        UserProfile.objects.create(user=user)
        return user