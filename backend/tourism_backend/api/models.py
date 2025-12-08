from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Attraction(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('draft', 'Draft'),
    )

    name = models.CharField(max_length=200)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='attractions')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='attractions')
    description = models.TextField()
    # Изменено на URLField для работы скрипта populate_db
    image = models.URLField(max_length=500, blank=True)
    
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    visitors_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    entrance_fee = models.CharField(max_length=100, blank=True)
    best_time = models.CharField(max_length=100, blank=True)
    
    favorited_by = models.ManyToManyField(User, related_name='favorites', blank=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        reviews = self.reviews.filter(status='approved')
        if not reviews.exists():
            return 0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

class Review(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    attraction = models.ForeignKey(Attraction, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.author.username} - {self.attraction.name}"

class Route(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration_days = models.IntegerField()
    budget_range = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    # Добавлено пропущенное поле!
    distance_km = models.IntegerField(default=0)
    # Изменено на URLField
    image = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return self.title

class RouteStop(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='stops')
    day_number = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    # Изменено на URLField
    image = models.URLField(max_length=500, blank=True)
    duration_label = models.CharField(max_length=50, default="Full Day") 

    class Meta:
        ordering = ['day_number']