from .models import Operacao

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect('calculadora')
        else:
            return render(request, 'login.html', {'error': 'Usuário ou senha inválidos.'})

    return render(request, 'login.html')

@login_required
def limpar_historico(request):
    if request.method == 'POST':
        Operacao.objects.filter(usuario=request.user).delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'erro', 'mensagem': 'Método inválido'})

@login_required
def salvar_operacao(request):
    if request.method == 'POST':
        parametros = request.POST.get('parametros')
        resultado = request.POST.get('resultado')
        Operacao.objects.create(usuario=request.user, parametros=parametros, resultado=resultado)
        return JsonResponse({'status': 'ok'})

@login_required
def calculadora(request):
    historico = Operacao.objects.filter(usuario=request.user).order_by('-dt_inclusao')[:10]
    return render(request, 'calculadora.html', {'historico': historico})

@login_required
def calcular(request):
    if request.method == 'POST':
        valor1 = float(request.POST.get('valor1'))
        valor2 = float(request.POST.get('valor2'))
        operacao = request.POST.get('operacao')

        if operacao == 'soma':
            resultado = valor1 + valor2
        elif operacao == 'subtracao':
            resultado = valor1 - valor2
        elif operacao =='multiplicacao':
            resultado = valor1 * valor2
        elif operacao == 'divisao':
            resultado = valor1 / valor2 if valor2!= 0 else 'Erro: divisão por zero'

        return JsonResponse({"status": "ok", "resultado": resultado})
