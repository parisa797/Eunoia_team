# Generated by Django 3.1.7 on 2021-05-20 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shoppings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppingitem',
            name='price',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
