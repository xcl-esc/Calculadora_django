const display = document.getElementById('display');

const buttons = document.querySelectorAll('button');

let current = '';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('clear-history')) {
            return;
        }
        
        const value = button.textContent;

        if (value === 'C') {
            current = '';
            display.value = '';

        } else if (value === '%'){
            try {
                let numero = parseFloat(display.value);
                if (!isNaN(numero)) {
                    numero = numero / 100;
                    display.value = numero;
                    current = numero.toString();
                }
            } catch {
                display.value = 'Erro';
                current = '';
            }
        
        } else if (value === '=') {

            try { 
                const expressaoValida = current.replace(/÷/g, '/')
                const expressaoOriginal = current;  
                
                const result = eval(expressaoValida);  
                
                fetch('/salvar_operacao/', {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrftoken,
                    },
                    body: `parametros=${encodeURIComponent(expressaoOriginal)}&resultado=${encodeURIComponent(result)}`
                })
                .then(response => response.json()) 
                .then(data => {
                    if (data.status === 'ok') {
                        adicionarAoHistorico(`${expressaoOriginal} = ${result}`);
                    }
                    
                })
                .catch(error => {
                    console.error('Erro ao salvar operação:', error);
                });

                display.value = result;        
                
                document.getElementById('input-parametros').value = expressaoOriginal;
                document.getElementById('input-resultado').value = result;
                
                current = result.toString();
                   
            } catch {
                display.value = 'Erro';
                current = '';
            }

        } else if (value === '±') {
            if (current !== '') {
                let invertido = parseFloat(current) * -1;
                current = invertido.toString();
                display.value = current;
            }
        
        } else {
            current += value;
            display.value = current;
        }
    });
});

function adicionarAoHistorico(parametros) {
    const historyContainer = document.getElementById('history-boxes');

    const novaEntrada = document.createElement('div');
    novaEntrada.classList.add('history-box');
    novaEntrada.textContent = parametros;

    historyContainer.prepend(novaEntrada);
}

function salvarOperacao(parametros, resultado) {
    fetch('/salvar_operacao/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({parametros: parametros, resultado: resultado})
        })
        
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            atualizarHistorico();
        }
    })
}

document.getElementById('cls-historico').addEventListener('click', function (e) {
    e.preventDefault();
    
    fetch('/limpar_historico/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
        }
    })

    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            const historicoDiv = document.getElementById('history-boxes');
            if (historicoDiv) historicoDiv.innerHTML = '';
        } else {
            console.error('Erro ao limpar histórico:', data.mensagem);
        }
    })
    .catch(error => {
        console.error('Erro ao limpar histórico', error);
    });
});

