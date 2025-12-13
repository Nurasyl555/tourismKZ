from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Attraction, Region, Category, Review, Route, RouteStop, UserProfile
from .models import Booking 

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
    # id нужен, чтобы при обновлении отличать новые остановки от старых (опционально)
    id = serializers.IntegerField(required=False) 

    class Meta:
        model = RouteStop
        fields = ['id', 'day_number', 'title', 'description', 'image', 'duration_label']

class RouteSerializer(serializers.ModelSerializer):
    stops = RouteStopSerializer(many=True)

    def create(self, validated_data):
        # Извлекаем данные остановок
        stops_data = validated_data.pop('stops')
        # Создаем сам маршрут
        route = Route.objects.create(**validated_data)
        # Создаем остановки и привязываем к маршруту
        for stop_data in stops_data:
            RouteStop.objects.create(route=route, **stop_data)
        return route

    def update(self, instance, validated_data):
        # Извлекаем данные остановок, если они есть
        stops_data = validated_data.pop('stops', None)
        
        # Обновляем поля самого маршрута
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if stops_data is not None:
            instance.stops.all().delete()
            for stop_data in stops_data:
                RouteStop.objects.create(route=instance, **stop_data)

        return instance
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



# Пример на бэкенде (Python/Django)
class BookingSerializer(serializers.ModelSerializer):
    # Добавляем поле, чтобы на фронте видеть название, а не только ID
    route_title = serializers.CharField(source='route.title', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'route', 'route_title', 'date', 'people_count']
        read_only_fields = ['user', 'status', 'total_price', 'created_at']
        # status и total_price мы будем считать на бэкенде, чтобы нельзя было подделать