const botaoTema = document.getElementById('botao-tema'); // pega no html o botão de mudar o tema
const body = document.body; // vai pegar o body inteiro e o que ta dentro pra depois mandar a alteração

// Carrega o tema salvo (se houver)
const temaSalvo = localStorage.getItem('tema'); 
if (temaSalvo === 'escuro') {
  body.classList.add('escuro');
  botaoTema.textContent = '☀️';
}

// Alternar entre os temas
botaoTema.addEventListener('click', () => {
  body.classList.toggle('escuro');

  const modoAtual = body.classList.contains('escuro') ? 'escuro' : 'claro';
  localStorage.setItem('tema', modoAtual);

  botaoTema.textContent = modoAtual === 'escuro' ? '☀️' : '🌙';
});
