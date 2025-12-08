from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Region, Category, Attraction, Route, RouteStop, Review, UserProfile
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Populates the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting DB population...')

        # 1. Создаем пользователей
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True}
        )
        if _:
            admin.set_password('admin123')
            admin.save()
            UserProfile.objects.create(user=admin, country='Kazakhstan', bio='Administrator')
            self.stdout.write('Admin user created (admin/admin123)')

        user_emma, _ = User.objects.get_or_create(username='emma_schmidt', defaults={'email': 'emma@example.com'})
        if _:
            user_emma.set_password('user123')
            user_emma.save()
            UserProfile.objects.create(user=user_emma, country='Germany', bio='Travel enthusiast')

        user_john, _ = User.objects.get_or_create(username='john_doe', defaults={'email': 'john@example.com'})
        if _:
            user_john.set_password('user123')
            user_john.save()
            UserProfile.objects.create(user=user_john, country='USA', bio='Photographer')

        # 2. Регионы
        regions_data = ['Almaty Region', 'Astana', 'Central Kazakhstan', 'West Kazakhstan', 'East Kazakhstan']
        regions = {}
        for name in regions_data:
            region, _ = Region.objects.get_or_create(name=name)
            regions[name] = region

        # 3. Категории
        categories_data = ['Natural Wonder', 'Lake', 'City', 'Landscape', 'Cultural', 'Mountains', 'National Park']
        categories = {}
        for name in categories_data:
            cat, _ = Category.objects.get_or_create(name=name)
            categories[name] = cat

        # 4. Достопримечательности (Данные из HomePageUser.tsx и AdminManageAttractions.tsx)
        attractions_list = [
            {
                'name': 'Charyn Canyon',
                'region': regions['Almaty Region'],
                'category': categories['Natural Wonder'],
                'image': 'https://images.unsplash.com/photo-1556881798-ea9705321743?auto=format&fit=crop&w=1080',
                'description': 'Charyn Canyon is a breathtaking natural wonder located in the Almaty Region...',
                'entrance_fee': '700 KZT',
                'best_time': 'Apr - Oct',
                'status': 'active',
                'visitors_count': 3421
            },
            {
                'name': 'Kolsai Lakes',
                'region': regions['Almaty Region'],
                'category': categories['Lake'],
                'image': 'https://images.unsplash.com/photo-1696229592679-9b8f53b68a01?auto=format&fit=crop&w=1080',
                'description': 'System of three lakes in the northern Tian Shan...',
                'entrance_fee': '806 KZT',
                'best_time': 'May - Sep',
                'status': 'active',
                'visitors_count': 2890
            },
            {
                'name': 'Almaty City',
                'region': regions['Almaty Region'], # Или Almaty, если создали отдельно
                'category': categories['City'],
                'image': 'https://images.unsplash.com/photo-1762490375835-7df90519c9c6?auto=format&fit=crop&w=1080',
                'description': 'The largest city in Kazakhstan, located in the foothills of Trans-Ili Alatau.',
                'entrance_fee': 'Free',
                'best_time': 'All year',
                'status': 'active',
                'visitors_count': 2654
            },
            {
                'name': 'Big Almaty Lake',
                'region': regions['Almaty Region'],
                'category': categories['Lake'],
                'image': 'https://images.unsplash.com/photo-1530480667809-b655d4dc3aaa?auto=format&fit=crop&w=1080', # Пример
                'description': 'Natural alpine reservoir located in the Trans-Ili Alatau mountains.',
                'entrance_fee': '500 KZT',
                'best_time': 'Jun - Sep',
                'status': 'active',
                'visitors_count': 2103
            },
            {
                'name': 'Kazakh Steppe',
                'region': regions['Central Kazakhstan'],
                'category': categories['Landscape'],
                'image': 'https://images.unsplash.com/photo-1629907903204-e2bd1d402f68?auto=format&fit=crop&w=1080',
                'description': 'Vast open grassland region in northern Kazakhstan.',
                'entrance_fee': 'Free',
                'best_time': 'May - Jun',
                'status': 'active',
                'visitors_count': 1500
            }
        ]

        created_attractions = {}
        for item in attractions_list:
            attr, created = Attraction.objects.get_or_create(
                name=item['name'],
                defaults={
                    'region': item['region'],
                    'category': item['category'],
                    'description': item['description'],
                    'entrance_fee': item['entrance_fee'],
                    'best_time': item['best_time'],
                    'status': item['status'],
                    'visitors_count': item['visitors_count'],
                    # Для упрощения используем URL как строку, но в модели ImageField. 
                    # В реальном проекте нужно скачивать картинку. 
                    # Сейчас это поле в модели ImageField, поэтому Django будет ожидать путь к файлу.
                    # ВАЖНО: Если вы не меняли модель на URLField, этот скрипт упадет на сохранении URL в ImageField.
                    # Решение: Либо измените модель на URLField (быстро), либо используйте заглушку.
                    # Я предполагаю, что вы можете временно сменить поле image на models.CharField(max_length=500) в models.py
                    # или просто не заполнять image, если это ImageField.
                }
            )
            # Если поле image это URLField или CharField:
            if created:
                attr.image = item['image'] # Только если модель позволяет строки!
                attr.save()
            
            created_attractions[item['name']] = attr

        self.stdout.write(f'Created {len(created_attractions)} attractions')

        # 5. Маршруты
        route, _ = Route.objects.get_or_create(
            title="Almaty to Kolsai Lakes Adventure",
            defaults={
                'description': "Experience the best of southern Kazakhstan with this carefully curated 3-day route",
                'duration_days': 3,
                'budget_range': "$200-300",
                'difficulty': "Moderate",
                'distance_km': 500,
                # 'image': ...
            }
        )

        if _:
            RouteStop.objects.create(
                route=route, day_number=1, title="Almaty City", 
                description="Start your journey in Kazakhstan's largest city...", duration_label="Full Day"
            )
            RouteStop.objects.create(
                route=route, day_number=2, title="Charyn Canyon", 
                description="Drive to the spectacular Charyn Canyon...", duration_label="Full Day"
            )
            RouteStop.objects.create(
                route=route, day_number=3, title="Kolsai Lakes", 
                description="Visit the stunning Kolsai Lakes...", duration_label="Full Day"
            )
            self.stdout.write('Route created')

        # 6. Отзывы (Reviews)
        if 'Charyn Canyon' in created_attractions:
            charyn = created_attractions['Charyn Canyon']
            Review.objects.get_or_create(
                author=user_emma, attraction=charyn,
                defaults={
                    'rating': 5,
                    'text': 'Absolutely breathtaking! The canyon is even more impressive in person.',
                    'status': 'approved'
                }
            )
            Review.objects.get_or_create(
                author=user_john, attraction=charyn,
                defaults={
                    'rating': 4,
                    'text': 'Amazing natural wonder! Budget-friendly too.',
                    'status': 'pending'
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated database!'))