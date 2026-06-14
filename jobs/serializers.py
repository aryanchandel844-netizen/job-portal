from rest_framework import serializers
from .models import Job, Application
from accounts.serializers import EmployerProfileSerializer, UserSerializer


class JobSerializer(serializers.ModelSerializer):
    employer_detail = EmployerProfileSerializer(
        source='employer',
        read_only=True
    )

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'description',
            'location',
            'job_type',
            'experience',
            'skills_required',
            'salary_min',
            'salary_max',
            'deadline',
            'status',
            'created_at',
            'employer',
            'employer_detail',
        ]
        read_only_fields = ['created_at', 'employer']


class ApplicationSerializer(serializers.ModelSerializer):
    job_detail = JobSerializer(source='job', read_only=True)
    applicant_detail = UserSerializer(source='applicant', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_detail',
            'applicant',
            'applicant_detail',
            'cover_letter',
            'status',
            'applied_at',
        ]
        read_only_fields = ['applied_at', 'applicant']