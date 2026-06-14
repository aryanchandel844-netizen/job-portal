from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list, name='job-list'),
    path('<int:pk>/', views.job_detail, name='job-detail'),
    path('create/', views.create_job, name='create-job'),
    path('<int:pk>/apply/', views.apply_job, name='apply-job'),
    path('my-applications/', views.my_applications, name='my-applications'),
    path('employer/applications/', views.employer_applications, name='employer-applications'),
    path('applications/<int:pk>/status/', views.update_application_status, name='update-status'),
]