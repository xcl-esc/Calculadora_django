from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('calculadora/', views.calculadora, name='calculadora'),
    path('limpar_historico/', views.limpar_historico, name='limpar_historico'),
    path('salvar_operacao/', views.salvar_operacao, name='salvar_operacao'),
]
