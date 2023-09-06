## Robozinho da Sorte

Este repositório foi criado a partir de uma necessidade em fazer "bolões" em apostas na Loterias Online (https://www.loteriasonline.caixa.gov.br/).

# Instalação
``git clone https://github.com/estopassoli/robozinho-da-sorte.git``</br>
``npm i`` </br>
``npm run start``</br>
# Como funciona?

-   Antes de rodar o "start" você deverá colocar no arquivo ``/src/data/userGames.csv`` suas apostas, seguindo o padrão que já está de exemplo: 01,02,03,04,05,06,07,08,09,10... (Números separados por vírgulas)
-   Esta automação não captura nenhuma informação sua e nem de suas apostas, a instalação é feita de no seu computador e roda somente em seu computador
-   Após o robô executar todas as apostas, irá aguardar você fazer o pagamento das apostas realizadas
-   Neste momento você faz a parte manual (Login > Pagamento)

<h3><b>Serão feitas algumas perguntas no seu terminal, a par de preencher especificações das apostas.</b></h3>

- question: Informe a URL do jogo
- question: Informe a quantidade de números por aposta randômica
- question: Informe o número máximo considerado apostável
- question: Informe a quantidade de jogos aleatórios
- question: Deseja jogar números aleatórios? (s/n)
- question: Deseja jogar ambos (números do usuário e aleatórios)? (s/n)
- question: Deseja efetuar log de todas as apostas feitas? (s/n)
- question: Informe o preço de cada jogo


# Créditos
Este repositório não tem fins lucrativos, caso queira comprar-me um café meu pix é: erick110999@gmail.com


<a href="https://instagram.com/estopassoli">@estopassoli</a>
