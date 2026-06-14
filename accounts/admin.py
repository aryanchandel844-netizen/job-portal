from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, JobSeekerProfile, EmployerProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'user_type', 'is_active']
    list_filter = ['user_type', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('user_type', 'phone', 'location', 'bio')}),
    )

@admin.register(JobSeekerProfile)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ['user', 'experience_years', 'education']

@admin.register(EmployerProfile)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'industry', 'company_size']