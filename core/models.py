from django.db import models
from django.contrib.auth.models import User
    
class Operacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='operacoes')
    parametros = models.CharField(max_length=255)
    resultado = models.CharField(max_length=100)
    dt_inclusao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.parametros} = {self.resultado}'
