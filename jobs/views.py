from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from accounts.models import EmployerProfile


@api_view(['GET'])
@permission_classes([AllowAny])
def job_list(request):
    jobs = Job.objects.filter(status='active')
    job_type = request.GET.get('job_type')
    location = request.GET.get('location')
    experience = request.GET.get('experience')
    if job_type:
        jobs = jobs.filter(job_type=job_type)
    if location:
        jobs = jobs.filter(location__icontains=location)
    if experience:
        jobs = jobs.filter(experience=experience)
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = JobSerializer(job)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    try:
        employer = EmployerProfile.objects.get(user=request.user)
    except EmployerProfile.DoesNotExist:
        employer = EmployerProfile.objects.create(
            user=request.user,
            company_name=request.user.username
        )
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(employer=employer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    already_applied = Application.objects.filter(
        job=job,
        applicant=request.user
    ).exists()
    if already_applied:
        return Response(
            {'error': 'Already applied for this job'},
            status=status.HTTP_400_BAD_REQUEST
        )
    application = Application.objects.create(
        job=job,
        applicant=request.user,
        cover_letter=request.data.get('cover_letter', '')
    )
    serializer = ApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    applications = Application.objects.filter(applicant=request.user)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employer_applications(request):
    applications = Application.objects.filter(
        job__employer__user=request.user
    )
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    try:
        application = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    application.status = request.data.get('status', application.status)
    application.save()
    serializer = ApplicationSerializer(application)
    return Response(serializer.data)