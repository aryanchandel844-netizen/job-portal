from django.db import models
from accounts.models import User, EmployerProfile

class Job(models.Model):
    JOB_TYPE = (
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
 )

    EXPERIENCE_LEVEL = (
        ('fresher', 'Fresher'),
        ('junior', 'Junior (1-3 years)'),
        ('senior', 'Senior (3+ years)'),
)

    STATUS = (
        ('active', 'Active'),
        ('closed', 'Closed'),
    )

    employer = models.ForeignKey(
        EmployerProfile,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100)
    job_type = models.CharField(choices=JOB_TYPE, max_length=20)
    experience = models.CharField(choices=EXPERIENCE_LEVEL, max_length=20)
    skills_required = models.TextField()
    salary_min = models.IntegerField()
    salary_max = models.IntegerField()
    deadline = models.DateField()
    status = models.CharField(
        choices=STATUS, 
        max_length=10, 
        default='active'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.employer.company_name}"


class Application(models.Model):
    STATUS = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    applicant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    cover_letter = models.TextField(blank=True)
    status = models.CharField(
        choices=STATUS,
        max_length=20,
        default='pending'
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant.username} → {self.job.title}"