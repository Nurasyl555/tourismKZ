from django.contrib import admin

# Register your models here.

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Region, Category, Attraction, Review, Route, RouteStop, Booking

# 1. Настройка Профиля Пользователя
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

# Расширяем стандартного юзера в админке
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

# Перерегистрируем User
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# 2. Справочники
@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

# 3. Достопримечательности
@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'category', 'status', 'visitors_count', 'average_rating_display')
    list_filter = ('status', 'region', 'category')
    search_fields = ('name', 'description')
    list_editable = ('status',) # Можно менять статус прямо в списке

    def average_rating_display(self, obj):
        return obj.average_rating
    average_rating_display.short_description = 'Rating'

# 4. Отзывы
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('attraction', 'author', 'rating', 'status', 'created_at')
    list_filter = ('status', 'rating', 'created_at')
    search_fields = ('text', 'author__username', 'attraction__name')
    list_editable = ('status',) # Удобно для модерации

# 5. Маршруты и остановки
class RouteStopInline(admin.TabularInline):
    model = RouteStop
    extra = 1 # Количество пустых полей для добавления новых остановок

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration_days', 'difficulty', 'distance_km')
    list_filter = ('difficulty',)
    search_fields = ('title',)
    inlines = [RouteStopInline] # Остановки редактируются внутри страницы Маршрута

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    # Поля, которые видны в списке
    list_display = ('id', 'user', 'route', 'date', 'people_count', 'total_price', 'status', 'created_at')
    
    # Поля, по которым можно кликнуть, чтобы открыть редактирование
    list_display_links = ('id', 'user')
    
    # Фильтры справа (очень удобно для сортировки заказов)
    list_filter = ('status', 'date', 'created_at')
    
    # Поле поиска (ищет по имени юзера и названию маршрута)
    search_fields = ('user__username', 'user__email', 'route__title')
    
    # Поля только для чтения (чтобы случайно не изменить дату создания)
    readonly_fields = ('created_at',)
    
    # Можно менять статус прямо из общего списка (опционально)
    list_editable = ('status',)
