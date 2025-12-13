from rest_framework import viewsets, permissions, status, filters, generics
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters import rest_framework as django_filters # Импортируем фильтры
from django.db.models import Count
from django.contrib.auth.models import User
from .models import Attraction, Review, Route, Category, Region, UserProfile
from .serializers import (
    AttractionSerializer, ReviewSerializer, RouteSerializer,
    CategorySerializer, RegionSerializer, UserProfileSerializer,
    RegisterSerializer, BookingSerializer
)
from .models import Booking
from .serializers import BookingSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

# 1. Создаем кастомный фильтр для поиска по названиям
class AttractionFilter(django_filters.FilterSet):
    region = django_filters.CharFilter(field_name='region__name', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    status = django_filters.CharFilter(field_name='status')

    class Meta:
        model = Attraction
        fields = ['region', 'category', 'status']

class AttractionViewSet(viewsets.ModelViewSet):
    queryset = Attraction.objects.all().order_by('-id') # Добавляем сортировку, чтобы убрать Warning в консоли
    serializer_class = AttractionSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    # Подключаем наш фильтр
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = AttractionFilter 
    
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'visitors_count']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Attraction.objects.all().order_by('-id')
        return Attraction.objects.filter(status='active').order_by('-id')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        attraction = self.get_object()
        user = request.user
        if user in attraction.favorited_by.all():
            attraction.favorited_by.remove(user)
            return Response({'status': 'removed'})
        else:
            attraction.favorited_by.add(user)
            return Response({'status': 'added'})

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # 1. Если админ - видит всё
        if self.request.user.is_staff:
            return Review.objects.all().order_by('-created_at')
        
        # Получаем ID достопримечательности из запроса
        attraction_id = self.request.query_params.get('attraction')
        
        # Базовый запрос
        queryset = Review.objects.all()

        if attraction_id:
            queryset = queryset.filter(attraction_id=attraction_id)

        # 2. Логика для обычных пользователей:
        # Показывать отзыв, если он одобрен ИЛИ если текущий пользователь - его автор
        if self.request.user.is_authenticated:
            # Сложный фильтр: (status='approved') OR (author=myself)
            from django.db.models import Q
            queryset = queryset.filter(
                Q(status='approved') | Q(author=self.request.user)
            )
        else:
            # Анонимы видят только одобренные
            queryset = queryset.filter(status='approved')

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def moderate(self, request, pk=None):
        review = self.get_object()
        status_val = request.data.get('status')
        reason = request.data.get('reason', '')

        if status_val not in ['approved', 'rejected']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        review.status = status_val
        if status_val == 'rejected':
            review.rejection_reason = reason
        review.save()
        return Response({'status': f'Review {status_val}'})

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all().order_by('id')
    serializer_class = RouteSerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all().order_by('name')
    serializer_class = RegionSerializer
    permission_classes = [IsAdminOrReadOnly]

class UserProfileViewSet(viewsets.ModelViewSet): # Было ReadOnlyModelViewSet, стало ModelViewSet
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    # Добавляем 'patch' и 'put' в methods
    @action(detail=False, methods=['get', 'patch', 'put']) 
    def me(self, request):
        # Получаем профиль текущего юзера
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            data = serializer.data
            # Добавляем избранное
            favorites = request.user.favorites.all()
            data['favorites'] = AttractionSerializer(favorites, many=True).data
            return Response(data)
        
            try:
                bookings = request.user.bookings.all().order_by('-created_at')
                data['bookings'] = BookingSerializer(bookings, many=True).data
            except AttributeError:
                # Если вы забыли добавить related_name='bookings' в models.py, сработает booking_set
                bookings = request.user.booking_set.all().order_by('-created_at')
                data['bookings'] = BookingSerializer(bookings, many=True).data

            return Response(data)
        
        elif request.method in ['PATCH', 'PUT']:
            # Обновляем данные (partial=True разрешает обновить только одно поле, например bio)
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({
            'total_users': UserProfile.objects.count(),
            'total_attractions': Attraction.objects.count(),
            'pending_reviews': Review.objects.filter(status='pending').count(),
            'total_page_views': 89342,
            'popular_destinations': Attraction.objects.order_by('-visitors_count')[:5].values('name', 'visitors_count')
        })
    
# booking


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Пользователь видит только свои брони
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Автоматически считаем цену и привязываем юзера
        route = serializer.validated_data['route']
        people = serializer.validated_data.get('people_count', 1)
        
        # Предполагаем, что цена записана в budget_range как "$200-300". 
        # Для реальной оплаты в модели Route нужно отдельное поле price (Decimal).
        # Пока возьмем заглушку: 100$ за человека
        price_per_person = 100 
        total = price_per_person * people
        
        serializer.save(user=self.request.user, total_price=total, status='pending')

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        booking = self.get_object()
        # ЗДЕСЬ ПОДКЛЮЧАЕТСЯ STRIPE / KASPI / EPAY
        # Пока просто меняем статус
        booking.status = 'paid'
        booking.save()
        return Response({'status': 'payment successful', 'booking_status': 'paid'})