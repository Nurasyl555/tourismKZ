import os
import django
import random

# --- НАСТРОЙКА ОКРУЖЕНИЯ ---
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tourism_backend.settings')
django.setup()
# ---------------------------

from api.models import Route

def run():
    print("🚀 Creating new routes...")

    routes_data = [
        {
            "title": "Mystic Mangystau: Land of Mars",
            "description": (
                "Journey to the alien landscapes of Western Kazakhstan. This expedition takes you through the white "
                "chalk mountains of Ustyurt Plateau and the famous Bozzhira tract. You will visit underground mosques "
                "carved into rocks and see the mesmerizing shores of the Caspian Sea. Perfect for those who love "
                "off-road adventures and surreal photography spots."
            ),
            "duration_days": 5,
            "budget_range": "$ 600",
            "difficulty": "Hard",
            "distance_km": 1200
        },
        {
            "title": "Ancient Cities of the Silk Road",
            "description": (
                "Immerse yourself in history by visiting the spiritual heart of Kazakhstan. The tour starts in Shymkent, "
                "proceeds to the ancient ruins of Otrar, and culminates at the magnificent Mausoleum of Khoja Ahmed Yasawi "
                "in Turkestan. Experience authentic hospitality, taste traditional cuisine, and walk the paths of ancient traders."
            ),
            "duration_days": 4,
            "budget_range": "$ 400",
            "difficulty": "Easy",
            "distance_km": 800
        },
        {
            "title": "Pearl of the North: Burabay National Park",
            "description": (
                "Relax in the 'Switzerland of Kazakhstan'. Burabay offers crystal clear lakes, pine forests, and unique "
                "rock formations like the Sphinx (Zhumbaktas). It is a perfect weekend getaway for hiking, boating, "
                "and breathing the freshest air. In winter, it transforms into a snowy wonderland with Santa's residence."
            ),
            "duration_days": 2,
            "budget_range": "$ 250",
            "difficulty": "Easy",
            "distance_km": 260
        },
        {
            "title": "Altay Golden Mountains Expedition",
            "description": (
                "A true wilderness adventure in East Kazakhstan. Explore the dense taiga forests, the breathtaking "
                "Rakhmanov Springs, and view the majestic Belukha Mountain. This route is designed for nature lovers "
                "who want to escape civilization and see the rugged beauty of the Altai region."
            ),
            "duration_days": 7,
            "budget_range": "$ 850",
            "difficulty": "Hard",
            "distance_km": 1500
        },
        {
            "title": "Space and Future: Baikonur & Astana",
            "description": (
                "A contrast of eras. Start with the futuristic architecture of the capital, Astana, visiting the Sphere "
                "and Khan Shatyr. Then, travel to the Baikonur Cosmodrome to witness the history of human spaceflight. "
                "A unique educational and sightseeing tour covering the technological achievements of the country."
            ),
            "duration_days": 5,
            "budget_range": "$ 1100",
            "difficulty": "Moderate",
            "distance_km": 1300
        },
        {
            "title": "Seven Rivers: Dzungarian Trekking",
            "description": (
                "Discover the hidden gems of the Zhetysu region. This route takes you to the multicolored mountains "
                "of Altyn-Emel and the Singing Dune. Continue to the Dzungarian Alatau to see the highest waterfall "
                "in Central Asia, Burkhan-Bulak. An unforgettable journey through diverse natural zones."
            ),
            "duration_days": 6,
            "budget_range": "$ 500",
            "difficulty": "Moderate",
            "distance_km": 900
        }
    ]

    created_count = 0
    for data in routes_data:
        # get_or_create предотвращает создание дубликатов, если скрипт запустить дважды
        route, created = Route.objects.get_or_create(
            title=data["title"],
            defaults={
                "description": data["description"],
                "duration_days": data["duration_days"],
                "budget_range": data["budget_range"],
                "difficulty": data["difficulty"],
                "distance_km": data["distance_km"],
                # Оставляем image пустым, так как вы добавите их вручную
                "image": "" 
            }
        )
        if created:
            created_count += 1
            print(f"✅ Created route: {data['title']}")
        else:
            print(f"ℹ️ Route already exists: {data['title']}")

    print(f"\n🎉 Done! Added {created_count} new routes.")

if __name__ == "__main__":
    run()