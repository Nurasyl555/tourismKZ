import os
import django
import random

# --- ВАЖНАЯ ЧАСТЬ: НАСТРОЙКА ОКРУЖЕНИЯ ---
# Мы указываем, где лежат настройки вашего проекта.
# Судя по пути в терминале, папка с settings.py называется 'tourism_backend'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tourism_backend.settings')
django.setup()
# -----------------------------------------

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
# Импорт моделей
from api.models import Attraction, Region, Category, Review, Route 

User = get_user_model()

# ---------------------------------------------------------
# 1. ДАННЫЕ И ФУНКЦИИ
# ---------------------------------------------------------

def get_description(name, region_name):
    return (
        f"This is one of the most breathtaking destinations in {region_name}, attracting thousands of tourists "
        f"from all over the world. {name} offers a unique blend of natural beauty and cultural significance. "
        "Whether you are an adventure seeker looking for hiking trails or a peace lover seeking tranquility, "
        "this place has it all. Local guides highly recommend visiting during the sunrise or sunset to witness "
        "the spectacular play of light and colors. The infrastructure around has been developing rapidly, "
        "ensuring a comfortable stay while preserving the pristine environment. Don't miss the chance to "
        "experience the hospitality of the local people and taste traditional cuisine nearby."
    )

attractions_data = [
    # Almaty Region (ID 1)
    {"name": "Charyn Canyon", "region_id": 1, "cat_id": 7, "lat": 43.35, "lon": 79.08},
    {"name": "Kolsai Lakes", "region_id": 1, "cat_id": 2, "lat": 42.93, "lon": 78.32},
    {"name": "Kaindy Lake", "region_id": 1, "cat_id": 2, "lat": 42.98, "lon": 78.46},
    {"name": "Big Almaty Lake", "region_id": 1, "cat_id": 2, "lat": 43.05, "lon": 76.98},
    {"name": "Shymbulak Ski Resort", "region_id": 1, "cat_id": 6, "lat": 43.12, "lon": 77.08},
    {"name": "Singing Dune", "region_id": 1, "cat_id": 1, "lat": 43.85, "lon": 78.56},
    {"name": "Tamgaly Tas", "region_id": 1, "cat_id": 5, "lat": 44.05, "lon": 76.99},
    {"name": "Turgen Waterfalls", "region_id": 1, "cat_id": 4, "lat": 43.28, "lon": 77.63},
    
    # Astana (ID 2)
    {"name": "Bayterek Tower", "region_id": 2, "cat_id": 3, "lat": 51.12, "lon": 71.43},
    {"name": "Khan Shatyr", "region_id": 2, "cat_id": 3, "lat": 51.13, "lon": 71.40},
    {"name": "Hazrat Sultan Mosque", "region_id": 2, "cat_id": 5, "lat": 51.12, "lon": 71.47},
    {"name": "National Museum", "region_id": 2, "cat_id": 5, "lat": 51.12, "lon": 71.47},
    {"name": "Palace of Peace", "region_id": 2, "cat_id": 3, "lat": 51.12, "lon": 71.46},

    # Central Kazakhstan (ID 3)
    {"name": "Lake Balkhash", "region_id": 3, "cat_id": 2, "lat": 46.84, "lon": 74.98},
    {"name": "Bektau-Ata Tract", "region_id": 3, "cat_id": 4, "lat": 47.45, "lon": 74.76},
    {"name": "Karlag Museum", "region_id": 3, "cat_id": 5, "lat": 49.64, "lon": 72.82},
    {"name": "Karkaraly Park", "region_id": 3, "cat_id": 7, "lat": 49.40, "lon": 75.47},

    # West Kazakhstan (ID 4)
    {"name": "Bozzhira Tract", "region_id": 4, "cat_id": 4, "lat": 43.42, "lon": 54.07},
    {"name": "Sherkala Mountain", "region_id": 4, "cat_id": 6, "lat": 44.25, "lon": 52.00},
    {"name": "Beket-Ata Mosque", "region_id": 4, "cat_id": 5, "lat": 43.60, "lon": 54.06},
    {"name": "Valley of Balls", "region_id": 4, "cat_id": 1, "lat": 44.32, "lon": 51.58},

    # East Kazakhstan (ID 5)
    {"name": "Mount Belukha", "region_id": 5, "cat_id": 6, "lat": 49.80, "lon": 86.58},
    {"name": "Rakhmanov Springs", "region_id": 5, "cat_id": 1, "lat": 49.53, "lon": 86.48},
    {"name": "Kiin-Kerish", "region_id": 5, "cat_id": 4, "lat": 48.33, "lon": 84.47},
    {"name": "Markakol Lake", "region_id": 5, "cat_id": 2, "lat": 48.75, "lon": 85.75},
]

users_list = [
    ("alice_w", "alice@example.com"), ("bob_builder", "bob@example.com"),
    ("charlie_tr", "charlie@example.com"), ("david_g", "david@example.com"),
    ("eva_photo", "eva@example.com"), ("frank_kz", "frank@example.com"),
    ("grace_hiker", "grace@example.com"), ("henry_t", "henry@example.com"),
    ("irene_adv", "irene@example.com"), ("jack_sp", "jack@example.com")
]

reviews_texts = [
    "Absolutely stunning view! The best place I have visited in Kazakhstan.",
    "A bit hard to get to, but totally worth the effort. Highly recommended.",
    "Great for families. My kids loved running around and taking photos.",
    "The nature here is pristine. Please keep it clean when you visit!",
    "Amazing atmosphere and friendly locals. The food nearby was delicious too.",
    "I suggest visiting in the early morning to avoid the crowd.",
    "A magical experience. I felt like I was on another planet.",
    "Good infrastructure, plenty of parking space and clean restrooms.",
    "Don't forget to bring warm clothes, it gets windy up there.",
    "Five stars! Will definitely come back next year."
]

# ---------------------------------------------------------
# 2. ЗАПУСК
# ---------------------------------------------------------

if __name__ == "__main__":
    print("🚀 Starting database population...")

    # 1. Создание пользователей
    created_users = []
    for username, email in users_list:
        user, created = User.objects.get_or_create(username=username, email=email)
        if created:
            user.set_password("pass1234")
            user.save()
        created_users.append(user)
    print(f"✅ Users ready: {len(created_users)}")

    # 2. Создание Attractions
    created_attractions = []
    for data in attractions_data:
        try:
            region = Region.objects.get(pk=data["region_id"])
            category = Category.objects.get(pk=data["cat_id"])
            
            attr, created = Attraction.objects.get_or_create(
                name=data["name"],
                defaults={
                    "region": region,
                    "category": category,
                    "description": get_description(data["name"], region.name),
                    "latitude": data["lat"],
                    "longitude": data["lon"],
                    "status": "active",
                    "visitors_count": random.randint(100, 5000),
                    "entrance_fee": f"{random.randint(5, 20)} USD",
                    "best_time": "May - September"
                }
            )
            created_attractions.append(attr)
        except ObjectDoesNotExist:
            print(f"⚠️ Skip {data['name']}: Region or Category not found.")

    print(f"✅ Attractions ready: {len(created_attractions)}")

    # 3. Создание Reviews
    count_reviews = 0
    if created_attractions and created_users:
        print("📝 Adding reviews...")
        for attr in created_attractions:
            for _ in range(random.randint(2, 3)):
                Review.objects.create(
                    author=random.choice(created_users),
                    attraction=attr,
                    rating=random.randint(4, 5),
                    text=random.choice(reviews_texts),
                    status='approved'
                )
                count_reviews += 1
        print(f"✅ Added {count_reviews} reviews.")
    else:
        print("⚠️ No attractions or users to add reviews to.")

    print("🎉 Done!")