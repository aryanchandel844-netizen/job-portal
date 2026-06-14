from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    USER_TYPE = (
        ('seeker', 'Job Seeker'),
        ('employer', 'Employer'),
    )
    
    user_type = models.CharField(
        choices=USER_TYPE, 
        max_length=20, 
        default='seeker'
    )
    phone = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)
    profile_pic = models.ImageField(
        upload_to='profile_pics/', 
        blank=True, 
        null=True
    )
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"


class JobSeekerProfile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='seeker_profile'
    )
    resume = models.FileField(
        upload_to='resumes/', 
        blank=True, 
        null=True
    )
    skills = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0)
    education = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - Seeker Profile"


class EmployerProfile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='employer_profile'
    )
    company_name = models.CharField(max_length=200)
    company_website = models.URLField(blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.company_name}"