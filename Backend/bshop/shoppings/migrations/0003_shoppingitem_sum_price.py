# Generated by Django 3.1.7 on 2021-05-25 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shoppings', '0002_auto_20210521_1750'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppingitem',
            name='sum_price',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
