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
import openai
import os
from django.conf import settings
from .models import Booking
from .serializers import BookingSerializer
from django.db.models import Q 

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
            
            # 1. Добавляем избранное
            favorites = request.user.favorites.all()
            data['favorites'] = AttractionSerializer(favorites, many=True).data
            
            # 2. Добавляем бронирования (ВОТ ЭТОТ КОД РАНЬШЕ БЫЛ НЕДОСТУПЕН)
            # Используем related_name='bookings', который мы проверили в моделях
            bookings = request.user.bookings.all().order_by('-created_at')
            data['bookings'] = BookingSerializer(bookings, many=True).data

            # 3. И только теперь возвращаем полный ответ
            return Response(data)
        
        elif request.method in ['PATCH', 'PUT']:
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
    

# Настраиваем клиента OpenAI
# Ключ берется из переменных окружения (os.getenv) или settings
# 1. Настройка клиента OpenAI
# Мы создаем "пульт управления" (client), передавая ему ключ из .env файла
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AIChatViewSet(viewsets.ViewSet):
    # 2. Права доступа
    # AllowAny значит, что писать в чат могут даже незарегистрированные гости
    permission_classes = [permissions.AllowAny]

    # 3. Метод 'ask' (Спрашивать)
    # Это функция, которая срабатывает, когда прилетает запрос на /api/chat/ask/
    @action(detail=False, methods=['post'])
    def ask(self, request):
        # Получаем текст, который ввел пользователь (например, "Куда поехать в горы?")
        user_query = request.data.get('message', '').strip()
        
        # Если прислали пустоту — сразу отвечаем заглушкой, не тратим деньги на ИИ
        if not user_query:
            return Response({'reply': "Спроси меня что-нибудь!", 'recommendations': []})

        recommendations = [] # Сюда будем складывать карточки для фронтенда
        context_data = ""    # А сюда — текст для "мозгов" ИИ

        # --- ЭТАП 1: Поиск в твоей базе данных ---
        # Мы ищем совпадения в базе, чтобы ИИ знал о ТВОИХ турах, а не выдумывал
        
        # Ищем достопримечательности (по имени, описанию, региону...)
        attractions = Attraction.objects.filter(
            Q(name__icontains=user_query) | 
            Q(description__icontains=user_query) |
            Q(region__name__icontains=user_query)
        )[:3] # Берем только первые 3, чтобы не перегружать

        # Если нашли места — добавляем их в контекст
        if attractions.exists():
            context_data += "Found Attractions in DB:\n"
            for attr in attractions:
                # Собираем данные для красивой карточки на сайте
                img_url = request.build_absolute_uri(attr.image.url) if attr.image else ""
                recommendations.append({
                    'id': attr.id,
                    'title': attr.name,
                    'image': img_url,
                    'type': 'attraction'
                })
                # Формируем текст для ИИ: "Название - Описание (первые 300 букв)"
                desc_text = attr.description[:300] if attr.description else "No description"
                context_data += f"- {attr.name}: {desc_text}...\n"

        # (Аналогичный блок кода идет для маршрутов/Routes...)

        # --- ЭТАП 2: Запрос к ИИ ---
        
        # Инструкция для нейросети (System Prompt)
        # Мы говорим: "Ты гид. Используй данные из базы (context_data), чтобы ответить юзеру."
        system_instruction = (
            "You are a guide for TourismKZ. "
            f"Use this DB data to answer: {context_data}"
        )

        try:
            # Отправляем запрос в OpenAI
            ai_response = client.chat.completions.create(
                model="gpt-4o-mini", # Дешевая модель
                messages=[
                    {"role": "system", "content": system_instruction}, # Инструкция
                    {"role": "user", "content": user_query}            # Вопрос юзера
                ],
                max_tokens=500 # Ограничение длины ответа
            )
            # Достаем текст ответа из сложной структуры JSON, которую прислал OpenAI
            reply_text = ai_response.choices[0].message.content
        except Exception as e:
            # Если интернет пропал или ключ неверный — не роняем сайт, а пишем ошибку в консоль
            print(f"Error: {e}")
            reply_text = "Ошибка связи с ИИ."

        # --- ЭТАП 3: Ответ фронтенду ---
        # Возвращаем JSON с текстом ответа и списком найденных карточек
        return Response({
            'reply': reply_text,
            'recommendations': recommendations
        })



""" class AIChatViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def ask(self, request):
        # 1. Получаем запрос пользователя
        user_query = request.data.get('message', '').lower().strip()
        
        response_text = ""
        recommendations = []

        if not user_query:
            return Response({'reply': "Please type something!", 'recommendations': []})

        # --- ВСТАВЛЯТЬ СЮДА (НАЧАЛО) ---
        
        # Словарь синонимов (Маппинг намерений)
        # Ключ = слово, которое точно есть в твоей БД (например, в Category или Region)
        # Значение = список слов, которые может написать человек
        keywords_map = {
            'mountains': ['горы', 'mountain', 'hiking', 'climbing', 'peak', 'восхождение', 'хайкинг', 'альпинизм'],
            'lakes': ['озеро', 'lake', 'water', 'swim', 'beach', 'вода', 'купаться', 'пляж', 'река'],
            'historical': ['history', 'museum', 'monument', 'culture', 'old', 'ancient', 'история', 'музей', 'памятник'],
            'forest': ['forest', 'trees', 'nature', 'wood', 'лес', 'природа', 'деревья'],
            'canyon': ['canyon', 'rock', 'каньон', 'скалы', 'ущелье'],
            'almaty': ['almaty', 'city', 'apple', 'алматы', 'город'],
        }

        # Проверяем, есть ли синоним в запросе пользователя
        found_category = False
        for category, synonyms in keywords_map.items():
            if any(syn in user_query for syn in synonyms):
                # Если нашли синоним (например "хайкинг"), меняем запрос на категорию ("mountains")
                # Это поможет найти "Mountains" в базе, даже если слова "хайкинг" там нет
                user_query = category 
                found_category = True
                break
        
        # --- ВСТАВЛЯТЬ СЮДА (КОНЕЦ) ---


        # 2. Логика приветствия (если это не поиск категории)
        greetings = ['hello', 'hi', 'привет', 'сәлем', 'hey']
        # Если мы НЕ нашли категорию и это просто приветствие
        if not found_category and any(word == user_query for word in greetings):
            return Response({
                'reply': "Hello! I am your AI Guide for Kazakhstan. Ask me about mountains, lakes, or historical places!",
                'recommendations': []
            })

        # 3. Поиск по Достопримечательностям
        # Теперь user_query может быть заменен на 'mountains', что точно найдется в базе
        attractions = Attraction.objects.filter(
            Q(name__icontains=user_query) | 
            Q(description__icontains=user_query) |
            Q(region__name__icontains=user_query) |
            Q(category__name__icontains=user_query)
        )[:3]

        if attractions.exists():
            count = attractions.count()
            response_text += f"I found {count} place{'s' if count > 1 else ''} matching '{user_query}':\n"
            for attr in attractions:
                img_url = None
                if attr.image:
                    img_url = attr.image.url if hasattr(attr.image, 'url') else attr.image

                recommendations.append({
                    'id': attr.id,
                    'type': 'attraction',
                    'title': attr.name,
                    'image': img_url,
                    'desc': attr.category.name if attr.category else ""
                })
        
        # 4. Поиск по Маршрутам
        routes = Route.objects.filter(
            Q(title__icontains=user_query) |
            Q(description__icontains=user_query)
        )[:2]

        if routes.exists():
            if response_text: 
                response_text += "\n\nAlso, check out these tours:\n"
            else:
                response_text += f"I found some great tours for '{user_query}':\n"
                
            for route in routes:
                recommendations.append({
                    'id': route.id,
                    'type': 'route',
                    'title': route.title,
                    'image': route.image,
                    'desc': f"{route.duration_days} Days Tour"
                })

        # 5. Если ничего не нашли
        if not response_text:
            response_text = "I couldn't find anything matching that. Try searching for 'Almaty', 'National Park', or specific activities."

        return Response({
            'reply': response_text,
            'recommendations': recommendations
        }) """