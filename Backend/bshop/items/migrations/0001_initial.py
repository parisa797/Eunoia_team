# Generated by Django 3.1.2 on 2021-05-20 14:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_jalali.db.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('shops', '0002_board'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='items/')),
                ('description', models.TextField(blank=True)),
                ('manufacture_Date', django_jalali.db.models.jDateField(blank=True)),
                ('Expiration_Date', django_jalali.db.models.jDateField(blank=True)),
                ('count', models.IntegerField(blank=True, default=0)),
                ('price', models.IntegerField(blank=True, default=0)),
                ('discount', models.IntegerField(blank=True, default=0)),
                ('category', models.CharField(choices=[('Spices and condiments and food side dishes', 'Spices and condiments and food side dishes'), ('Cosmetics', 'Cosmetics'), ('Makeup and trimming', 'Makeup and trimming'), ('Protein', 'Protein'), ('Junk Food', 'Junk Food'), ('Nuts', 'Nuts'), ('Sweets and desserts', 'Sweets and desserts'), ('perfume', 'perfume'), ('Fruits and vegetables', 'Fruits and vegetables'), ('Dairy', 'Dairy'), ('Drinks', 'Drinks'), ('Washing and Cleaning Equipment', 'Washing and Cleaning Equipment'), ('others', 'others')], default='others', max_length=50)),
                ('shopID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shopid', to='shops.shop')),
            ],
        ),
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('commentID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comment_reply', to='items.comment')),
                ('user', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='Replies_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ReplyLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked_by', models.ManyToManyField(default=None, related_name='replies_users_liked', to=settings.AUTH_USER_MODEL)),
                ('liked_reply', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='liked_replies', to='items.reply')),
            ],
        ),
        migrations.CreateModel(
            name='Rate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rate', models.IntegerField(blank=True, default=2, null=True)),
                ('item', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='rate_item', to='items.item')),
                ('user', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='rate_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ItemLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked_by', models.ManyToManyField(default=None, related_name='users_liked', to=settings.AUTH_USER_MODEL)),
                ('liked_item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='liked_post', to='items.item')),
            ],
        ),
        migrations.CreateModel(
            name='CommentLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked_by', models.ManyToManyField(default=None, related_name='comments_users_liked', to=settings.AUTH_USER_MODEL)),
                ('liked_comment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='liked_comment', to='items.comment')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='ItemID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comment', to='items.item'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_comment_item', to=settings.AUTH_USER_MODEL),
        ),
    ]
